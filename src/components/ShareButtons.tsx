
import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Share } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Lien copié !");
    } catch (err) {
      toast.error("Erreur lors de la copie du lien");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={shareToFacebook}
        className="flex items-center gap-2"
      >
        <Facebook size={16} />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToTwitter}
        className="flex items-center gap-2"
      >
        <Twitter size={16} />
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToLinkedIn}
        className="flex items-center gap-2"
      >
        <Linkedin size={16} />
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="flex items-center gap-2"
      >
        <Share size={16} />
        Copier le lien
      </Button>
    </div>
  );
};
