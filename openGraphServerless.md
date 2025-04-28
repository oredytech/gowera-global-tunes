
# Génération de métadonnées Open Graph pour GOWERA

## Solution proposée

Pour permettre un meilleur partage social des stations de radio sur GOWERA, nous utilisons deux approches complémentaires:

1. **React Helmet** pour les utilisateurs normaux navigant sur le site
2. **Fichiers HTML statiques** pour les robots des réseaux sociaux

## Implémentation du backend serverless

Pour générer dynamiquement des fichiers HTML avec les métadonnées Open Graph, vous pouvez:

### Option 1: Netlify Functions

```js
// functions/og-generator.js
const { generateOpenGraphHtml } = require('../src/services/openGraphService');
const fetch = require('node-fetch');

exports.handler = async function(event) {
  // Extraire le slug de l'URL
  const slug = event.path.split('/').pop().replace('.html', '');
  
  // Rechercher la station
  const searchTerm = slug.replace(/-/g, ' ');
  const response = await fetch(`https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(searchTerm)}&limit=1`);
  const stations = await response.json();
  
  if (stations.length === 0) {
    return {
      statusCode: 404,
      body: 'Station non trouvée'
    };
  }
  
  // Générer le HTML
  const station = stations[0];
  const html = generateOpenGraphHtml(station);
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    body: html
  };
};
```

### Option 2: Vercel Edge Functions

```js
// api/og/[slug].js
import { generateOpenGraphHtml } from '../../../src/services/openGraphService';

export default async function handler(req, res) {
  const { slug } = req.query;
  
  // Rechercher la station
  const searchTerm = slug.replace(/-/g, ' ');
  const response = await fetch(`https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(searchTerm)}&limit=1`);
  const stations = await response.json();
  
  if (stations.length === 0) {
    return res.status(404).send('Station non trouvée');
  }
  
  // Générer le HTML
  const station = stations[0];
  const html = generateOpenGraphHtml(station);
  
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  return res.status(200).send(html);
}
```

### Option 3: Supabase Edge Functions

Vous pouvez également utiliser l'intégration native de Lovable avec Supabase pour déployer une Edge Function:

1. Connectez votre projet à Supabase via Lovable
2. Créez une Edge Function qui génère les fichiers HTML
3. Configurez une redirection pour que `/og/:slug.html` pointe vers votre fonction

## Configuration des redirections

Pour que votre application réponde correctement aux requêtes des robots sociaux, ajoutez cette redirection:

```
/* /index.html 200
/og/* /api/og/:splat 200
```

Cela permettra à votre application de servir les fichiers HTML statiques pour les robots sociaux tout en maintenant le fonctionnement SPA pour les utilisateurs normaux.
