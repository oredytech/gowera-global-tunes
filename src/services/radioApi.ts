
import { toast } from "sonner";

const API_BASE_URL = "https://de1.api.radio-browser.info/json";

export interface RadioStation {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  language: string;
  votes: number;
  lastchangetime: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  lastcheckoktime: string;
  lastlocalchecktime: string;
  clicktimestamp: string;
  clickcount: number;
  clicktrend: number;
}

export interface Country {
  name: string;
  stationcount: number;
}

export interface Language {
  name: string;
  stationcount: number;
}

export interface Tag {
  name: string;
  stationcount: number;
}

// Helper function to fetch from the API with error handling
async function fetchFromApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Erreur lors de la récupération des données radio");
    throw error;
  }
}

// Get stations by search term
export async function searchStations(term: string): Promise<RadioStation[]> {
  if (!term) return [];
  return fetchFromApi<RadioStation[]>(`stations/search?name=${encodeURIComponent(term)}&limit=30`);
}

// Get stations by country
export async function getStationsByCountry(country: string): Promise<RadioStation[]> {
  return fetchFromApi<RadioStation[]>(`stations/bycountry/${encodeURIComponent(country)}?limit=30`);
}

// Get stations by language
export async function getStationsByLanguage(language: string): Promise<RadioStation[]> {
  return fetchFromApi<RadioStation[]>(`stations/bylanguage/${encodeURIComponent(language)}?limit=30`);
}

// Get stations by tag (genre)
export async function getStationsByTag(tag: string): Promise<RadioStation[]> {
  return fetchFromApi<RadioStation[]>(`stations/bytag/${encodeURIComponent(tag)}?limit=30`);
}

// Get popular stations
export async function getPopularStations(): Promise<RadioStation[]> {
  return fetchFromApi<RadioStation[]>('stations/topvote?limit=30');
}

// Get trending stations
export async function getTrendingStations(): Promise<RadioStation[]> {
  return fetchFromApi<RadioStation[]>('stations/topclick?limit=30');
}

// Get random stations
export async function getRandomStations(limit: number = 10): Promise<RadioStation[]> {
  return fetchFromApi<RadioStation[]>(`stations/search?order=random&limit=${limit}`);
}

// Get countries
export async function getCountries(): Promise<Country[]> {
  return fetchFromApi<Country[]>('countries');
}

// Get languages
export async function getLanguages(): Promise<Language[]> {
  return fetchFromApi<Language[]>('languages');
}

// Get tags/genres
export async function getTags(): Promise<Tag[]> {
  return fetchFromApi<Tag[]>('tags');
}

// Get station by UUID
export async function getStationByUuid(uuid: string): Promise<RadioStation | null> {
  if (!uuid) return null;
  const stations = await fetchFromApi<RadioStation[]>(`stations/byuuid/${uuid}`);
  return stations.length > 0 ? stations[0] : null;
}

// Click tracking
export async function registerClick(stationUuid: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/url/${stationUuid}`);
  } catch (error) {
    console.error("Failed to register click:", error);
  }
}
