
// Export all Firebase services from this central file
export { app, auth, db, storage, analytics } from './config';

// Export radio suggestion services
export {
  saveRadioSuggestion,
  getPendingRadioSuggestions,
  approveRadioSuggestion,
  rejectRadioSuggestion,
  updateSponsorStatus,
  getNewlyApprovedRadios,
  getApprovedRadioBySlug,
  getApprovedRadiosByCategory
} from './radioSuggestionService';

// Export favorites services
export {
  saveFavorite,
  getUserFavorites,
  removeFavoriteFromDb
} from './favoritesService';

// Export types
export type { RadioSuggestion, ApprovedRadio } from './types';
