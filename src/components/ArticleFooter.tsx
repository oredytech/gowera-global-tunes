
import React from 'react';
import { ShareButtons } from './ShareButtons';

interface ArticleFooterProps {
  sourceLink: string;
  sourceName: string;
  title: string;
  url: string;
}

export const ArticleFooter: React.FC<ArticleFooterProps> = ({ 
  sourceLink, 
  sourceName, 
  title, 
  url 
}) => {
  return (
    <>
      <div className="mt-12 pt-6 border-t">
        <h3 className="font-semibold text-xl mb-4">Partager cet article</h3>
        <ShareButtons url={url} title={title} />
      </div>
      
      <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground italic">
        Source originale : 
        <a 
          href={sourceLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="underline hover:text-primary transition-colors"
        >
          {sourceName}
        </a>.
        <p className="mt-2">Gowera n'est pas responsable du contenu des articles externes.</p>
      </div>
    </>
  );
};
