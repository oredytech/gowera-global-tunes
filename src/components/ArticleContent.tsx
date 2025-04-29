
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleContentProps {
  loading: boolean;
  content: string;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ loading, content }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  
  return (
    <div 
      className="prose prose-lg max-w-none article-content" 
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
