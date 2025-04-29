
import React from 'react';

interface ArticleFeaturedImageProps {
  imageUrl: string;
  altText: string;
}

export const ArticleFeaturedImage: React.FC<ArticleFeaturedImageProps> = ({ imageUrl, altText }) => {
  return (
    <div className="mb-8">
      <img 
        src={imageUrl} 
        alt={altText} 
        className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md" 
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
};
