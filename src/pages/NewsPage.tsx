
import React, { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Newspaper, Filter } from 'lucide-react';
import { useWordpressArticles } from '../hooks/useWordpressArticles';
import WordpressArticleCard from '../components/WordpressArticleCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '../hooks/use-mobile';

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { articles, isLoading, pagination } = useWordpressArticles(selectedCategory);
  const isMobile = useIsMobile();

  const ArticlesSkeleton = () => (
    <>
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col h-full">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-9 w-full mt-auto" />
        </div>
      ))}
    </>
  );

  return (
    <div className="container py-0 px-0">
      <SectionHeader 
        title="Actualités" 
        description="Les dernières nouvelles des médias partenaires" 
        icon={<Newspaper className="h-6 w-6" />}
      />

      <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <ArticlesSkeleton />
        ) : articles.length > 0 ? (
          articles.map(article => (
            <WordpressArticleCard 
              key={`${article.source.name}-${article.id}`} 
              article={article} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Aucun article trouvé</p>
          </div>
        )}
      </div>

      {articles.length > 0 && pagination.totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent className="flex-wrap justify-center gap-2">
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => pagination.prevPage()}
                className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
              />
            </PaginationItem>
            
            {isMobile
              ? // Mobile: Show limited pagination numbers
                <>
                  {pagination.currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => pagination.goToPage(1)}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {pagination.currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => pagination.goToPage(pagination.currentPage - 1)}
                      >
                        {pagination.currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationLink
                      isActive
                    >
                      {pagination.currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  
                  {pagination.currentPage < pagination.totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => pagination.goToPage(pagination.currentPage + 1)}
                      >
                        {pagination.currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {pagination.currentPage < pagination.totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => pagination.goToPage(pagination.totalPages)}
                      >
                        {pagination.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </>
              : // Desktop: Show all pagination numbers
                [...Array(pagination.totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={pagination.currentPage === i + 1}
                      onClick={() => pagination.goToPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))
            }
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => pagination.nextPage()}
                className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      <div className="mt-8 text-center text-sm text-muted-foreground italic">
        Gowera n'est pas responsable des articles externes.
      </div>
    </div>
  );
};

export default NewsPage;
