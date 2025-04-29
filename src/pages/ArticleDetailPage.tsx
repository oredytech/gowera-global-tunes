
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SectionHeader } from '../components/SectionHeader';
import { Newspaper, ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareButtons } from '../components/ShareButtons';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchFullArticleContent } from '../services/wordpressApi';
import { WordPressArticle } from '../services/wordpressApi';

// Styles pour le contenu de l'article
const articleStyles = `
  .article-content h1, .article-content h2, .article-content h3, 
  .article-content h4, .article-content h5, .article-content h6 {
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    font-weight: 600;
    line-height: 1.3;
  }
  
  .article-content h1 {
    font-size: 1.75rem;
  }
  
  .article-content h2 {
    font-size: 1.5rem;
  }
  
  .article-content h3 {
    font-size: 1.25rem;
  }
  
  .article-content p {
    margin-bottom: 1.25em;
    line-height: 1.7;
  }
  
  .article-content img {
    margin: 2em auto;
    border-radius: 0.5rem;
    max-width: 100%;
    height: auto;
  }
  
  .article-content figure {
    margin: 2em 0;
  }
  
  .article-content figure figcaption {
    font-size: 0.875rem;
    text-align: center;
    margin-top: 0.5em;
    color: hsl(var(--muted-foreground));
  }
  
  .article-content ul, .article-content ol {
    margin: 1.25em 0;
    padding-left: 1.5em;
  }
  
  .article-content li {
    margin-bottom: 0.5em;
  }
  
  .article-content blockquote {
    margin: 1.5em 0;
    padding: 1em 1.5em;
    border-left: 4px solid hsl(var(--primary));
    background-color: hsl(var(--muted)/0.2);
    font-style: italic;
    border-radius: 0.25rem;
  }
  
  .article-content a {
    color: hsl(var(--primary));
    text-decoration: none;
  }
  
  .article-content a:hover {
    text-decoration: underline;
  }
  
  .article-content iframe {
    margin: 1.5em auto;
    max-width: 100%;
  }
  
  .article-content table {
    margin: 1.5em 0;
    width: 100%;
    border-collapse: collapse;
  }
  
  .article-content table th,
  .article-content table td {
    padding: 0.5em;
    border: 1px solid hsl(var(--border));
  }
  
  .article-content pre {
    margin: 1.5em 0;
    padding: 1em;
    background-color: hsl(var(--muted));
    border-radius: 0.25rem;
    overflow-x: auto;
  }
`;

const ArticleDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [articleContent, setArticleContent] = useState<string>('');
  
  // Get the article data from location state
  const article = location.state?.article as WordPressArticle | undefined;
  const sourceUrl = location.state?.sourceUrl as string | undefined;
  
  useEffect(() => {
    // If no article data was passed, redirect back to news page
    if (!article || !sourceUrl) {
      navigate('/news');
      return;
    }
    
    // Fetch the full article content
    const getArticleContent = async () => {
      setLoading(true);
      try {
        const content = await fetchFullArticleContent(sourceUrl, article.id);
        setArticleContent(content);
      } catch (error) {
        console.error('Failed to fetch article content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getArticleContent();
  }, [article, navigate, sourceUrl]);
  
  if (!article) {
    return null;
  }
  
  // Clean title from HTML entities
  const cleanTitle = article.title.rendered
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'");
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="container py-6">
      <Helmet>
        <title>{cleanTitle} - Gowera</title>
        <style>{articleStyles}</style>
      </Helmet>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Retour aux actualités
      </Button>
      
      <article className="max-w-3xl mx-auto">
        <SectionHeader
          title={cleanTitle}
          description={`Article de ${article.source.name}`}
          icon={<Newspaper className="h-6 w-6" />}
          className="mb-8"
        />
        
        <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mt-6 mb-8">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            {formatDate(article.date)}
          </div>
          <div className="flex items-center">
            <User size={16} className="mr-1" />
            {article.source.name}
          </div>
          {article.categories && article.categories.length > 0 && (
            <div className="flex items-center">
              <Tag size={16} className="mr-1" />
              Catégories
            </div>
          )}
        </div>
        
        {article.featured_media_url && (
          <div className="mb-8">
            <img
              src={article.featured_media_url}
              alt={cleanTitle}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div 
            className="prose prose-lg max-w-none article-content"
            dangerouslySetInnerHTML={{ __html: articleContent }}
          />
        )}
        
        <div className="mt-12 pt-6 border-t">
          <h3 className="font-semibold text-xl mb-4">Partager cet article</h3>
          <ShareButtons 
            url={window.location.href} 
            title={cleanTitle} 
          />
        </div>
        
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground italic">
          Source originale : <a href={article.link} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">{article.source.name}</a>.
          <p className="mt-2">Gowera n'est pas responsable du contenu des articles externes.</p>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;

