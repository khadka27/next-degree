import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

const THEME = {
  primary: "#1A8A99",
  textDark: "#111827",
  textGray: "#6B7280",
  bgLight: "#FFFFFF",
  red: "#EF4444",
};

export default function ProfileTab() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitleLarge}>Profile</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Feather name="user" size={40} color={THEME.primary} />
          </View>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@example.com</Text>
        </View>

        <View style={styles.profileOptions}>
          <TouchableOpacity style={styles.profileOptionItem}>
            <Feather name="edit-2" size={20} color={THEME.textDark} />
            <Text style={styles.profileOptionText}>Edit Profile</Text>
            <Feather name="chevron-right" size={20} color={THEME.textGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.profileOptionItem}>
            <Feather name="file-text" size={20} color={THEME.textDark} />
            <Text style={styles.profileOptionText}>My Applications</Text>
            <Feather name="chevron-right" size={20} color={THEME.textGray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileOptionItem}>
            <Feather name="settings" size={20} color={THEME.textDark} />
            <Text style={styles.profileOptionText}>Settings</Text>
            <Feather name="chevron-right" size={20} color={THEME.textGray} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileOptionItem} 
            onPress={() => router.push("/")}
          >
            <Feather name="log-out" size={20} color={THEME.red} />
            <Text style={[styles.profileOptionText, { color: THEME.red }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bgLight,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 8,
    backgroundColor: THEME.bgLight,
  },
  headerTitleLarge: {
    fontSize: 32,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  scrollContent: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E0F2F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: THEME.textDark,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: THEME.textGray,
  },
  profileOptions: {
    padding: 24,
  },
  profileOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  profileOptionText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 16,
    flex: 1,
    color: THEME.textDark,
  },
});
