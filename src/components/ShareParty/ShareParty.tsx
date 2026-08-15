import React, { useState } from 'react';
import { IconShare, IconCheck } from '../Icons/Icons';
import './ShareParty.css';

export function ShareParty() {
  const [copied, setCopied] = useState(false);

  const shareMessage = "I'm inside Party Wale. Come join the party.";
  const shareUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Party Wale', text: shareMessage, url: shareUrl });
      } catch { /* User cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch { /* Denied */ }
    }
  };

  return (
    <button
      id="btn-share-party"
      className={`share-btn ${copied ? 'share-btn--copied' : ''}`}
      onClick={handleShare}
      title="Share the party"
    >
      {copied ? <IconCheck size={14} /> : <IconShare size={14} />}
      {copied ? 'LINK COPIED' : 'SHARE PARTY'}
    </button>
  );
}
