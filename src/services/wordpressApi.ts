
import { toast } from "sonner";

export interface WordPressArticle {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  link: string;
  featured_media: number;
  featured_media_url?: string;
  categories: number[];
  source: {
    name: string;
    url: string;
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Liste des sites WordPress à interroger
const wordpressSites = [
  { name: "Totalement Actus", url: "https://totalementactus.net" },
  { name: "Kivu Reporter", url: "https://kivureporter.net" },
  { name: "Kivu7", url: "https://kivu7.net" },
  { name: "La Fortune RDC", url: "https://lafortunerdc.net" },
  { name: "RCVMA", url: "https://rcvma.net" },
  { name: "Radio Tele Eben-Ezer", url: "https://radioteleeben-ezer.net" },
  { name: "Sauti ya Wahamiaji", url: "https://sautiyawahamiaji.net" },
];

// Fonction pour récupérer les articles d'un site WordPress
async function fetchArticlesFromSite(site: { name: string; url: string }, perPage: number = 5): Promise<WordPressArticle[]> {
  try {
    const response = await fetch(`${site.url}/wp-json/wp/v2/posts?_embed&per_page=${perPage}`);
    
    if (!response.ok) {
      console.error(`Erreur lors de la récupération des articles depuis ${site.name}:`, response.status);
      return [];
    }
    
    const articles = await response.json();
    
    // Ajouter la source à chaque article
    return articles.map((article: any) => ({
      ...article,
      source: {
        name: site.name,
        url: site.url
      },
      // Extraire l'URL de l'image si disponible
      featured_media_url: article._embedded && 
                          article._embedded['wp:featuredmedia'] && 
                          article._embedded['wp:featuredmedia'][0] ? 
                          article._embedded['wp:featuredmedia'][0].source_url : null
    }));
  } catch (error) {
    console.error(`Erreur lors de la récupération des articles depuis ${site.name}:`, error);
    return [];
  }
}

// Récupérer les catégories d'un site WordPress
export async function fetchCategoriesFromSite(site: { name: string; url: string }): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(`${site.url}/wp-json/wp/v2/categories`);
    
    if (!response.ok) {
      console.error(`Erreur lors de la récupération des catégories depuis ${site.name}:`, response.status);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des catégories depuis ${site.name}:`, error);
    return [];
  }
}

// Récupérer les articles de tous les sites
export async function fetchAllArticles(perPage: number = 5): Promise<WordPressArticle[]> {
  try {
    // Récupérer les articles de tous les sites en parallèle
    const articlesPromises = wordpressSites.map(site => fetchArticlesFromSite(site, perPage));
    const articlesArrays = await Promise.allSettled(articlesPromises);
    
    // Combiner tous les articles
    const allArticles: WordPressArticle[] = [];
    articlesArrays.forEach((result) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      }
    });
    
    // Trier les articles par date (les plus récents d'abord)
    return allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    toast.error("Erreur lors de la récupération des actualités");
    return [];
  }
}

// Récupérer les articles par catégorie
export async function fetchArticlesByCategory(categorySlug: string, perPage: number = 5): Promise<WordPressArticle[]> {
  const allArticles = await fetchAllArticles(perPage * 2); // Récupérer plus d'articles pour avoir assez après filtrage
  
  // Si aucune catégorie spécifiée, retourner tous les articles
  if (!categorySlug || categorySlug === 'all') {
    return allArticles.slice(0, perPage * wordpressSites.length);
  }
  
  // Filtrer les articles par catégorie (nécessiterait une logique plus complexe avec les IDs de catégories)
  // Pour l'instant on simule, car les catégories varient selon les sites
  const filteredArticles = allArticles.filter((_, index) => index % 3 === 0); // Simulation simple
  return filteredArticles.slice(0, perPage * wordpressSites.length);
}

// Récupérer le contenu complet d'un article
export async function fetchFullArticleContent(siteUrl: string, articleId: number): Promise<string> {
  try {
    const response = await fetch(`${siteUrl}/wp-json/wp/v2/posts/${articleId}`);
    
    if (!response.ok) {
      toast.error("Erreur lors de la récupération de l'article");
      return "Contenu de l'article indisponible";
    }
    
    const article = await response.json();
    return article.content.rendered;
  } catch (error) {
    console.error("Erreur lors de la récupération du contenu de l'article:", error);
    toast.error("Erreur lors de la récupération de l'article");
    return "Contenu de l'article indisponible";
  }
}
