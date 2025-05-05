
import { BASE_URL, mapApprovedRadioToStation } from './apiHelpers';
import { Country, Language, Tag, RadioStation } from './types';
import { getApprovedRadiosByCategory } from '../firebase';

// Function to get countries list
export const getCountries = async (): Promise<Country[]> => {
  try {
    console.log('Getting countries list');
    const response = await fetch(`${BASE_URL}/countries`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting countries:', error);
    return [];
  }
};

// Function to get languages list
export const getLanguages = async (): Promise<Language[]> => {
  try {
    console.log('Getting languages list');
    const response = await fetch(`${BASE_URL}/languages`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting languages:', error);
    return [];
  }
};

// Function to get tags/genres list
export const getTags = async (): Promise<Tag[]> => {
  try {
    console.log('Getting tags/genres list');
    const response = await fetch(`${BASE_URL}/tags`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
};

// Function to get a list of stations by country
export const getStationsByCountry = async (country: string, limit: number = 60): Promise<RadioStation[]> => {
  try {
    console.log(`Getting stations by country: ${country}`);
    const searchEndpoint = `${BASE_URL}/stations/bycountryexact/${country}?limit=${limit}&hidebroken=true`;
    const response = await fetch(searchEndpoint);
    const data = await response.json();
    
    // Get approved radios by country from Firebase
    try {
      const approvedRadios = await getApprovedRadiosByCategory('country', country);
      
      // Map approved radios to RadioStation format
      const mappedApprovedRadios = approvedRadios.map(radio => mapApprovedRadioToStation(radio));
      
      // Merge and return results
      return [...data, ...mappedApprovedRadios];
    } catch (error) {
      console.error(`Error getting approved radios by country: ${country}`, error);
      return data; // Return radio-browser.info results only
    }
  } catch (error) {
    console.error(`Error getting stations by country: ${country}`, error);
    return [];
  }
};

// Function to get a list of stations by language
export const getStationsByLanguage = async (language: string, limit: number = 60): Promise<RadioStation[]> => {
  try {
    console.log(`Getting stations by language: ${language}`);
    const searchEndpoint = `${BASE_URL}/stations/bylanguageexact/${language}?limit=${limit}&hidebroken=true`;
    const response = await fetch(searchEndpoint);
    const data = await response.json();
    
    // Get approved radios by language from Firebase
    try {
      const approvedRadios = await getApprovedRadiosByCategory('language', language);
      
      // Map approved radios to RadioStation format
      const mappedApprovedRadios = approvedRadios.map(radio => mapApprovedRadioToStation(radio));
      
      // Merge and return results
      return [...data, ...mappedApprovedRadios];
    } catch (error) {
      console.error(`Error getting approved radios by language: ${language}`, error);
      return data; // Return radio-browser.info results only
    }
  } catch (error) {
    console.error(`Error getting stations by language: ${language}`, error);
    return [];
  }
};

// Function to get a list of stations by tag
export const getStationsByTag = async (tag: string, limit: number = 60): Promise<RadioStation[]> => {
  try {
    console.log(`Getting stations by tag: ${tag}`);
    const searchEndpoint = `${BASE_URL}/stations/bytagexact/${tag}?limit=${limit}&hidebroken=true`;
    const response = await fetch(searchEndpoint);
    const data = await response.json();
    
    // Get approved radios by tag from Firebase
    try {
      const approvedRadios = await getApprovedRadiosByCategory('tag', tag);
      
      // Map approved radios to RadioStation format
      const mappedApprovedRadios = approvedRadios.map(radio => mapApprovedRadioToStation(radio));
      
      // Merge and return results
      return [...data, ...mappedApprovedRadios];
    } catch (error) {
      console.error(`Error getting approved radios by tag: ${tag}`, error);
      return data; // Return radio-browser.info results only
    }
  } catch (error) {
    console.error(`Error getting stations by tag: ${tag}`, error);
    return [];
  }
};
