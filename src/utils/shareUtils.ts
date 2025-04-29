
import { toast } from 'sonner';

export interface ShareData {
  url: string;
  title: string;
}

export const shareToFacebook = (data: ShareData): void => {
  const encodedUrl = encodeURIComponent(data.url);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
};

export const shareToTwitter = (data: ShareData): void => {
  const encodedUrl = encodeURIComponent(data.url);
  const encodedTitle = encodeURIComponent(data.title);
  window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
};

export const shareToLinkedIn = (data: ShareData): void => {
  const encodedUrl = encodeURIComponent(data.url);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
};

export const copyToClipboard = async (url: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Lien copié !");
  } catch (err) {
    toast.error("Erreur lors de la copie du lien");
  }
};
