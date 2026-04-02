import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { login as apiLogin, register as apiRegister } from '../../lib/api';

type UserData = {
  id?: string;
  name: string;
  username: string;
  email?: string;
  profileImage: string | null;
  country: string;
  flag: string;
  studyLevel: string;
  fieldOfStudy: string;
  recentAcademicField?: string;
  cgpa?: string;
  englishLevel?: string;
  score?: string;
  testType?: string;
  passoutYear?: string;
  selectedUniversities: any[];
};

type UserContextType = {
  userData: UserData;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setUserData: (data: UserData | ((prev: UserData) => UserData)) => void;
  selectUniversity: (uni: any) => void;
};

const DEFAULT_USER_DATA: UserData = {
  name: "New Student",
  username: "@student",
  profileImage: null,
  country: "",
  flag: "",
  studyLevel: "",
  fieldOfStudy: "",
  recentAcademicField: "",
  cgpa: "",
  englishLevel: "",
  score: "",
  testType: "",
  passoutYear: "",
  selectedUniversities: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, _setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token;

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@auth_token');
        const storedUser = await AsyncStorage.getItem('@user_data');
        
        if (storedToken) setToken(storedToken);
        if (storedUser) _setUserData(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error loading auth data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  // Login handler
  const login = async (identifier: string, password: string) => {
    try {
      const data = await apiLogin(identifier, password);
      // data: { user, token }
      setToken(data.token);
      _setUserData(prev => ({
        ...prev,
        ...data.user,
        // Preserve onboarding fields if they already exist
      }));

      await AsyncStorage.setItem('@auth_token', data.token);
      await AsyncStorage.setItem('@user_data', JSON.stringify({
        ...userData,
        ...data.user,
      }));
    } catch (error) {
      throw error;
    }
  };

  // Register handler
  const register = async (signUpData: any) => {
    try {
      // For registration, we usually get back the initial user object but need OTP verification
      // For now, let's just handle the initial response
      const data = await apiRegister(signUpData);
      
      // If the backend returns a token immediately (or after verification)
      // Usually register might not login the user immediately if OTP is needed.
      // But for this task, we'll store what we get.
      if (data.token) {
        setToken(data.token);
        await AsyncStorage.setItem('@auth_token', data.token);
      }
      
      _setUserData(prev => ({
        ...prev,
        ...data.user,
      }));
      await AsyncStorage.setItem('@user_data', JSON.stringify(data.user));
    } catch (error) {
      throw error;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      setToken(null);
      _setUserData(DEFAULT_USER_DATA);
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@user_data');
      
      // Redirect to landing page
      router.replace("/");
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };

  // Wrapper for setUserData that also saves to AsyncStorage
  const setUserData = async (data: UserData | ((prev: UserData) => UserData)) => {
    try {
      const newData = typeof data === 'function' ? data(userData) : data;
      _setUserData(newData);
      await AsyncStorage.setItem('@user_data', JSON.stringify(newData));
    } catch (e) {
      console.error("Error saving user data:", e);
    }
  };

  const selectUniversity = (uni: any) => {
    setUserData(prev => ({
        ...prev,
        selectedUniversities: [uni, ...prev.selectedUniversities.filter(u => u.id !== uni.id)]
    }));
  };

  return (
    <UserContext.Provider value={{ 
      userData, 
      token, 
      isAuthenticated, 
      isLoading, 
      login, 
      register, 
      logout,
      setUserData, 
      selectUniversity 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
