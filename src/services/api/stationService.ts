
import { BASE_URL, mapApprovedRadioToStation } from './apiHelpers';
import { RadioStation } from './types';
import { getApprovedRadiosByCategory } from '../firebase';

// Function to get a list of all stations
export const getAllStations = async (limit: number = 100): Promise<RadioStation[]> => {
  try {
    const response = await fetch(`${BASE_URL}/stations?limit=${limit}&hidebroken=true`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting all stations:', error);
    return [];
  }
};

// Function to get a list of popular stations
export const getPopularStations = async (limit: number = 100): Promise<RadioStation[]> => {
  try {
    const response = await fetch(`${BASE_URL}/stations/topvote?limit=${limit}&hidebroken=true`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting popular stations:', error);
    return [];
  }
};

// Function to get a list of trending stations
export const getTrendingStations = async (limit: number = 100): Promise<RadioStation[]> => {
  try {
    const response = await fetch(`${BASE_URL}/stations/topclick?limit=${limit}&hidebroken=true`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting trending stations:', error);
    return [];
  }
};

// Function to search stations by name
export const searchStations = async (query: string, limit: number = 60): Promise<RadioStation[]> => {
  try {
    console.log(`Searching stations with query: ${query}`);
    const searchEndpoint = `${BASE_URL}/stations/search?name=${encodeURIComponent(query)}&limit=${limit}&hidebroken=true`;
    const response = await fetch(searchEndpoint);
    const data = await response.json();
    
    // Get approved radios by search query from Firebase
    try {
      const approvedRadios = await getApprovedRadiosByCategory('search', query);
      
      // Map approved radios to RadioStation format
      const mappedApprovedRadios = approvedRadios.map(radio => mapApprovedRadioToStation(radio));
      
      // Merge and return results
      return [...data, ...mappedApprovedRadios];
    } catch (error) {
      console.error(`Error getting approved radios by search query: ${query}`, error);
      return data; // Return radio-browser.info results only
    }
  } catch (error) {
    console.error(`Error searching stations with query: ${query}`, error);
    return [];
  }
};

// Function to get a single station by UUID
export const getStationByUuid = async (uuid: string): Promise<RadioStation | null> => {
  try {
    const response = await fetch(`${BASE_URL}/stations/byuuid/${uuid}`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      return data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting station by UUID ${uuid}:`, error);
    return null;
  }
};

// Helper function to normalize slug for comparison
const normalizeSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Function to get a single station by slug
export const getStationBySlug = async (slug: string): Promise<RadioStation | null> => {
  try {
    // First try to search by name that matches the slug
    const searchQuery = slug.replace(/-/g, ' ');
    console.log(`Searching for station with query: "${searchQuery}"`);
    
    const searchResults = await searchStations(searchQuery, 50);
    
    // Compare normalized slugs to find matching station
    const foundStation = searchResults.find(station => 
      normalizeSlug(station.name) === slug || 
      normalizeSlug(station.name) === normalizeSlug(searchQuery)
    );
    
    if (foundStation) {
      console.log(`Found station by slug search: ${foundStation.name}`);
      return foundStation;
    }
    
    // If not found through search, try getting all stations (more expensive operation)
    if (!foundStation) {
      console.log(`No station found by search, trying with all stations for slug: ${slug}`);
      const allStations = await getAllStations(500);
      
      const stationByAllSearch = allStations.find(station => 
        normalizeSlug(station.name) === slug || 
        normalizeSlug(station.name) === normalizeSlug(searchQuery)
      );
      
      if (stationByAllSearch) {
        console.log(`Found station in all stations: ${stationByAllSearch.name}`);
        return stationByAllSearch;
      }
    }
    
    console.warn(`No station found with slug ${slug}.`);
    return null;
  } catch (error) {
    console.error(`Error getting station by slug ${slug}:`, error);
    return null;
  }
};

// Function to get a list of random stations
export const getRandomStations = async (limit: number = 1): Promise<RadioStation[]> => {
  try {
    const response = await fetch(`${BASE_URL}/stations/search?limit=${limit}&hidebroken=true`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting random stations:', error);
    return [];
  }
};
