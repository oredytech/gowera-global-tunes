
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { WordPressArticle } from '../services/wordpressApi';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WordpressArticleCardProps {
  article: WordPressArticle;
}

const WordpressArticleCard: React.FC<WordpressArticleCardProps> = ({ article }) => {
  // Nettoyer le HTML de l'extrait
  const cleanExcerpt = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent || "";
    // Limiter à 150 caractères
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  // Formater la date en français
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">
          {article.title.rendered && article.title.rendered.replace(/&#8211;/g, '-').replace(/&#8217;/g, "'")}
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{formatDate(article.date)}</span>
          <span className="text-primary">{article.source.name}</span>
        </CardDescription>
      </CardHeader>
      
      {article.featured_media_url && (
        <div className="px-6 pb-2">
          <img 
            src={article.featured_media_url} 
            alt={article.title.rendered} 
            className="w-full h-32 object-cover rounded-md"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm">
          {article.excerpt.rendered && cleanExcerpt(article.excerpt.rendered)}
        </p>
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            Lire l'article <ExternalLink size={14} className="ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WordpressArticleCard;
