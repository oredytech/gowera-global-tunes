
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { WordPressArticle } from '../services/wordpressApi';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';

interface WordpressArticleCardProps {
  article: WordPressArticle;
}

const WordpressArticleCard: React.FC<WordpressArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  
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

  const handleOpenOriginalSite = () => {
    window.open(article.link, '_blank');
    setOpen(false);
  };

  const handleStayOnGowera = () => {
    navigate(`/article/${article.id}`, { 
      state: { 
        article,
        sourceUrl: article.source.url
      } 
    });
    setOpen(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              Lire l'article <ExternalLink size={14} className="ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Comment souhaitez-vous lire cet article ?</DialogTitle>
              <DialogDescription>
                Vous pouvez lire l'article sur le site d'origine ou rester sur Gowera.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={handleOpenOriginalSite}
                className="w-full sm:w-auto"
              >
                Lire sur le site d'origine <ExternalLink size={14} className="ml-2" />
              </Button>
              <Button 
                onClick={handleStayOnGowera}
                className="w-full sm:w-auto"
              >
                Rester sur Gowera
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default WordpressArticleCard;
