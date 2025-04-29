
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '../components/SectionHeader';
import { fetchFullArticleContent } from '../services/wordpressApi';
import { WordPressArticle } from '../services/wordpressApi';
import { articleStyles } from '../styles/articleStyles';
import { cleanTitle, formatArticleDate } from '../utils/articleUtils';
import { ArticleMetadata } from '../components/ArticleMetadata';
import { ArticleFeaturedImage } from '../components/ArticleFeaturedImage';
import { ArticleContent } from '../components/ArticleContent';
import { ArticleFooter } from '../components/ArticleFooter';

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
  const title = cleanTitle(article.title.rendered);
  
  return (
    <div className="container px-0 py-0">
      <Helmet>
        <title>{title} - Gowera</title>
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
          title={title} 
          description={`Article de ${article.source.name}`} 
          className="mb-8" 
        />
        
        <ArticleMetadata 
          article={article} 
          formatDate={formatArticleDate} 
        />
        
        {article.featured_media_url && (
          <ArticleFeaturedImage 
            imageUrl={article.featured_media_url} 
            altText={title} 
          />
        )}
        
        <ArticleContent 
          loading={loading} 
          content={articleContent} 
        />
        
        <ArticleFooter 
          sourceLink={article.link} 
          sourceName={article.source.name} 
          title={title} 
          url={window.location.href} 
        />
      </article>
    </div>
  );
};

export default ArticleDetailPage;
