
import React from 'react';
import { FacebookShareButton } from './share/FacebookShareButton';
import { TwitterShareButton } from './share/TwitterShareButton';
import { LinkedInShareButton } from './share/LinkedInShareButton';
import { CopyLinkButton } from './share/CopyLinkButton';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const shareData = { url, title };
  
  return (
    <div className="flex flex-wrap gap-2">
      <FacebookShareButton data={shareData} />
      <TwitterShareButton data={shareData} />
      <LinkedInShareButton data={shareData} />
      <CopyLinkButton url={url} />
    </div>
  );
};
