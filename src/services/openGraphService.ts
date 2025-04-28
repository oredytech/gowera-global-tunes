
import { RadioStation } from './radioApi';

/**
 * Génère un contenu HTML avec les métadonnées Open Graph pour une station de radio
 * @param station La station de radio pour laquelle générer les métadonnées
 * @returns Le HTML généré avec les métadonnées Open Graph
 */
export const generateOpenGraphHtml = (station: RadioStation): string => {
  const stationImage = station.favicon && station.favicon !== '' 
    ? station.favicon 
    : 'https://gowera.lovable.app/placeholder.svg';
  
  const stationDescription = station.tags 
    ? `${station.name} - ${station.country || 'Radio'} - ${station.tags.split(',').slice(0, 3).join(', ')}`
    : `${station.name} - ${station.country || 'Radio'}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${station.name} - GOWERA</title>
  
  <!-- Métadonnées Open Graph standard -->
  <meta property="og:title" content="${station.name} - GOWERA" />
  <meta property="og:description" content="${stationDescription}" />
  <meta property="og:image" content="${stationImage}" />
  <meta property="og:url" content="https://gowera.lovable.app/station/${normalizeSlug(station.name)}" />
  <meta property="og:type" content="music.radio_station" />
  <meta property="og:site_name" content="GOWERA - Les voix du monde" />
  
  <!-- Métadonnées Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${station.name} - GOWERA" />
  <meta name="twitter:description" content="${stationDescription}" />
  <meta name="twitter:image" content="${stationImage}" />
  
  <!-- Redirection vers la page réelle après quelques secondes -->
  <meta http-equiv="refresh" content="0;url=https://gowera.lovable.app/station/${normalizeSlug(station.name)}" />
</head>
<body>
  <p>Redirection vers ${station.name}...</p>
</body>
</html>`;
};

/**
 * Normalise un nom de station en slug URL
 * @param name Le nom de la station
 * @returns Le slug URL normalisé
 */
export const normalizeSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Crée une URL pour le fichier Open Graph d'une station
 * @param stationName Le nom de la station
 * @returns L'URL du fichier Open Graph
 */
export const getOpenGraphUrl = (stationName: string): string => {
  const slug = normalizeSlug(stationName);
  return `https://gowera.lovable.app/og/${slug}.html`;
};
