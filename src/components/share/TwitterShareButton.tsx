
import React from 'react';
import { Button } from '@/components/ui/button';
import { Twitter } from 'lucide-react';
import { ShareData, shareToTwitter } from '@/utils/shareUtils';

interface TwitterShareButtonProps {
  data: ShareData;
}

export const TwitterShareButton: React.FC<TwitterShareButtonProps> = ({ data }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => shareToTwitter(data)}
      className="flex items-center gap-2"
    >
      <Twitter size={16} />
      Twitter
    </Button>
  );
};
