/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * WorqNow Education API Client
 * Docs: https://api.worqnow.ai
 */

const BASE_URL = "https://api.worqnow.ai/education";

const FEE_BAND_USD: Record<string, number> = {
  low: 8_000,
  medium: 16_000,
  high: 26_000,
  very_high: 45_000,
};

export interface WorqnowUniversity {
  id?: string;
  code: string;
  name: string;
  city?: string;
  region?: string;
  website?: string;
  international_fee_band?: string;
  estimatedFeeUSD?: number;
  ranking_world?: number;
  ranking_national?: number;
  courses?: { name: string; category: string; level: string[] }[];
  scholarships?: { name: string; value: string }[];
  is_russell_group?: boolean;
}

const universityCache: Record<string, WorqnowUniversity[]> = {};

export async function fetchWorqnowUniversities(
  countryCode: string
): Promise<WorqnowUniversity[]> {
  const code = countryCode.toLowerCase();
  if (universityCache[code]) {
    return universityCache[code];
  }

  const apiKey = process.env.EXPO_PUBLIC_WORQNOW_API_KEY || "https://api.worqnow.ai";
  const url = `${BASE_URL}/${code}/universities`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Attach auth header if present
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
    headers["x-api-key"] = apiKey;
  }

  try {
    const response = await fetch(url, { method: "GET", headers });

    if (!response.ok) {
      console.warn(`WorqNow API Error: ${response.status} for ${countryCode}`);
      return [];
    }

    const data = await response.json();

    const list: any[] = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];

    const transformed = list.map((u: any) => ({
      ...u,
      estimatedFeeUSD: FEE_BAND_USD[u.international_fee_band] ?? 0,
    }));
    universityCache[code] = transformed;
    return transformed;
  } catch (error) {
    console.warn(`WorqNow API Fetch Error for ${countryCode}:`, error);
    return [];
  }
}

const COUNTRY_MAP: Record<string, string> = {
  "uk": "uk",
  "united kingdom": "uk",
  "usa": "us",
  "united states": "us",
  "canada": "ca",
  "australia": "au",
  "new zealand": "nz",
  "china": "cn"
};

export async function getWorqnowUniversityDetail(
  id: string,
  countryString?: string
): Promise<WorqnowUniversity | null> {
  const apiKey = process.env.EXPO_PUBLIC_WORQNOW_API_KEY || "https://api.worqnow.ai";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
    headers["x-api-key"] = apiKey;
  }

  // If we know the country, direct fetch
  if (countryString) {
    const code = COUNTRY_MAP[countryString.toLowerCase()] || countryString.toLowerCase();
    const url = `${BASE_URL}/${code}/universities/${id}`;
    try {
      const res = await fetch(url, { method: "GET", headers });
      if (res.ok) {
        const data = await res.json();
        const uni = data.data || data;
        return {
          ...uni,
          estimatedFeeUSD: FEE_BAND_USD[uni.international_fee_band] ?? 0,
        };
      }
    } catch (e) {
      console.warn("Direct fetch error:", e);
    }
  }

  // Fallback to searching lists if direct fetch fails or country is unknown
  const fallbackCountries = ["uk", "ca", "au", "us", "nz", "cn"];
  const allResults = await Promise.all(
    fallbackCountries.map(c => fetchWorqnowUniversities(c))
  );

  for (const unis of allResults) {
    const found = unis.find(u => 
      u.code === id || 
      u.name === id || 
      String((u as any).id) === id
    );
    if (found) return found;
  }
  
  return null;
}

