
// Ce fichier est désormais déprécié.
// Veuillez utiliser les imports de src/services/firebase à la place.
// Exemple: import { db, app, analytics } from '../services/firebase';

import { 
  app, 
  db, 
  analytics,
  saveRadioSuggestion,
  approveRadioSuggestion,
  updateSponsorStatus,
  getNewlyApprovedRadios,
  saveFavorite,
  getUserFavorites,
  removeFavoriteFromDb
} from './firebase';

export { 
  app, 
  db, 
  analytics,
  saveRadioSuggestion,
  approveRadioSuggestion,
  updateSponsorStatus,
  getNewlyApprovedRadios,
  saveFavorite,
  getUserFavorites,
  removeFavoriteFromDb
};

// Interfaces re-exportées pour la compatibilité
export type { RadioSuggestion, ApprovedRadio } from './firebase/types';
