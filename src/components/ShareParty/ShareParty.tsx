import React, { useState } from 'react';
import './ShareParty.css';

export function ShareParty() {
  const [copied, setCopied] = useState(false);

  const shareMessage = "Bro I'm inside Party Wale 😂🔥 Come in. 🎉";
  const shareUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Party Wale 🔥',
          text: shareMessage,
          url: shareUrl,
        });
      } catch {
        // User cancelled — not an error
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // Clipboard access denied
      }
    }
  };

  return (
    <button
      id="btn-share-party"
      className={`share-btn ${copied ? 'share-btn--copied' : ''}`}
      onClick={handleShare}
      title="Share the party!"
    >
      {copied ? 'LINK COPIED 🔥' : 'SHARE PARTY 🔥'}
    </button>
  );
}
