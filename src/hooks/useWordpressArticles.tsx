
import { useQuery } from "@tanstack/react-query";
import { fetchAllArticles, fetchArticlesByCategory, WordPressArticle } from "../services/wordpressApi";
import { useState } from "react";

export function useWordpressArticles(categorySlug?: string) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // Nombre d'articles par page

  const { data: articles = [], isLoading, error, refetch } = useQuery({
    queryKey: ["wordpressArticles", categorySlug, currentPage],
    queryFn: () => categorySlug 
      ? fetchArticlesByCategory(categorySlug, pageSize)
      : fetchAllArticles(pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Pagination simplifiée
  const totalArticles = articles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / pageSize));
  
  const paginatedArticles = articles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    articles: paginatedArticles,
    isLoading,
    error,
    refetch,
    pagination: {
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      goToPage
    }
  };
}
