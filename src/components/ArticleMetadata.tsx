
import React from 'react';
import { Calendar, User, Tag } from 'lucide-react';
import { WordPressArticle } from '../services/wordpressApi';

interface ArticleMetadataProps {
  article: WordPressArticle;
  formatDate: (dateString: string) => string;
}

export const ArticleMetadata: React.FC<ArticleMetadataProps> = ({ article, formatDate }) => {
  return (
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
  );
};
