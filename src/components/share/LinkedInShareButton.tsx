
import React from 'react';
import { Button } from '@/components/ui/button';
import { Linkedin } from 'lucide-react';
import { ShareData, shareToLinkedIn } from '@/utils/shareUtils';

interface LinkedInShareButtonProps {
  data: ShareData;
}

export const LinkedInShareButton: React.FC<LinkedInShareButtonProps> = ({ data }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => shareToLinkedIn(data)}
      className="flex items-center gap-2"
    >
      <Linkedin size={16} />
      LinkedIn
    </Button>
  );
};
