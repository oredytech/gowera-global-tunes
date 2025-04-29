
import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook } from 'lucide-react';
import { ShareData, shareToFacebook } from '@/utils/shareUtils';

interface FacebookShareButtonProps {
  data: ShareData;
}

export const FacebookShareButton: React.FC<FacebookShareButtonProps> = ({ data }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => shareToFacebook(data)}
      className="flex items-center gap-2"
    >
      <Facebook size={16} />
      Facebook
    </Button>
  );
};
