
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { copyToClipboard } from '@/utils/shareUtils';

interface CopyLinkButtonProps {
  url: string;
}

export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ url }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(url)}
      className="flex items-center gap-2"
    >
      <Share size={16} />
      Copier le lien
    </Button>
  );
};
