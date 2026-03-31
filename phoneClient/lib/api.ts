import { Platform } from 'react-native';

const API_BASE_URL = Platform.OS === 'android' ? 'http://192.168.1.68:3000/api' : 'http://localhost:3000/api';
// Fallback local IP for Expo Go on physical device if neither of the above works:
// const API_BASE_URL = 'http://192.168.1.68:3000/api';

export interface UniversityResult {
  id: string | number;
  name: string;
  location: string;
  tuition: string | number;
  acceptanceRate: number;
  website: string;
  country: string;
  // Fallbacks for the UI formatting
  course?: string;
  image?: string;
  rank?: string;
  duration?: string;
  tuitionValue?: number;
  admissionChance?: string;
  matchRating?: string;
  city?: string;
  recommended?: boolean;
}

export const searchUniversities = async (query: string, countries: string = "All"): Promise<UniversityResult[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (query) queryParams.append('q', query);
    if (countries && countries !== "All") queryParams.append('countries', countries);
    
    // Default URL to fetch
    const url = `${API_BASE_URL}/universities/search?${queryParams.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
        // Log errors to retry with physical IP
        console.warn(`API Failed on ${API_BASE_URL}, retrying with physical network IP...`);
        const fallbackUrl = `http://192.168.1.68:3000/api/universities/search?${queryParams.toString()}`;
        const fbResponse = await fetch(fallbackUrl);
        if(!fbResponse.ok) throw new Error("Failed to fetch from fallback URL");
        
        const data = await fbResponse.json();
        return processResults(data.results);
    }
    const data = await response.json();
    return processResults(data.results);
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
};

const processResults = (results: any[]): UniversityResult[] => {
  if (!results) return [];
  return results.map((res: any) => {
    // Attempt to extract numerical tuition
    let tuitionValue = 35000;
    if (typeof res.tuition === 'number') {
      tuitionValue = res.tuition;
    } else if (typeof res.tuition === 'string') {
      const match = res.tuition.replace(/[^0-9.]/g, '');
      if (match) tuitionValue = parseInt(match, 10);
    }

    // Attempt to map acceptance rate to chance string
    let chance = "Moderate";
    const rate = res.acceptanceRate || 50;
    if (rate >= 60) chance = "High";
    else if (rate <= 30) chance = "Low";

    return {
      id: String(res.id),
      name: res.name || "Unknown University",
      course: "Various Courses", // API returns institutions, not specific courses
      location: res.location || "Unknown Location",
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800", // Default image
      rank: "Global Rank N/A",
      duration: "Check Website",
      tuition: typeof res.tuition === 'number' ? `$${res.tuition.toLocaleString()} / yr` : (res.tuition || "Check Website"),
      tuitionValue,
      acceptanceRate: rate,
      admissionChance: chance,
      matchRating: "4.0",
      country: res.country || "Unknown",
      city: res.location?.split(',')[0] || "",
      recommended: false, 
      website: res.website || "",
      ...res // Allow overrides if API changes
    };
  });
};
