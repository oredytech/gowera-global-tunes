
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
    <div className="container py-4">
      <Helmet>
        <title>{cleanTitle} - Gowera</title>
      </Helmet>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft size={16} className="mr-2" />
        Retour aux actualités
      </Button>
      
      <article className="max-w-3xl mx-auto">
        <SectionHeader
          title={cleanTitle}
          description={`Article de ${article.source.name}`}
          icon={<Newspaper className="h-6 w-6" />}
        />
        
        <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mt-4 mb-6">
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
          <div className="mb-6">
            <img
              src={article.featured_media_url}
              alt={cleanTitle}
              className="w-full h-auto max-h-[400px] object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: articleContent }}
          />
        )}
        
        <div className="mt-8 pt-4 border-t">
          <h3 className="font-semibold mb-4">Partager cet article</h3>
          <ShareButtons 
            url={window.location.href} 
            title={cleanTitle} 
          />
        </div>
        
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground italic">
          Source originale : <a href={article.link} target="_blank" rel="noopener noreferrer" className="underline">{article.source.name}</a>.
          Gowera n'est pas responsable du contenu des articles externes.
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
