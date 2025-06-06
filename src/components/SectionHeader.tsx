
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  link?: string;
  linkText?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  description, 
  link, 
  linkText = "Voir tout",
  className = "",
  icon
}) => {
  // Clean the title from HTML entities
  const cleanTitle = title.replace(/&#8211;/g, '-')
                          .replace(/&#8217;/g, "'")
                          .replace(/&amp;/g, '&')
                          .replace(/&quot;/g, '"')
                          .replace(/&#039;/g, "'");
  
  return (
    <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-poppins font-semibold mb-1">{cleanTitle}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      
      {link && (
        <Button variant="ghost" asChild className="mt-2 sm:mt-0">
          <Link to={link}>
            {linkText}
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
}
