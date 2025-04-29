
// Utility functions for article handling

// Clean title from HTML entities
export const cleanTitle = (title: string): string => {
  return title
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'");
};

// Format date
export const formatArticleDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};
