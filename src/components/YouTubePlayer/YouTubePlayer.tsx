import React, { useEffect, useRef } from 'react';
import { useParty } from '../../contexts/PartyContext';
import { playlist } from '../../data/playlist';

/**
 * Mounts the YouTube IFrame API player.
 * The iframe is kept at 1px so the API works, but is invisible to the user.
 * All visible controls are in MusicControls.tsx.
 */
export function YouTubePlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { handlePlayerReady, handleStateChange, handleError } = useParty();

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return;
      new window.YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        videoId: playlist[0].youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => handlePlayerReady(e.target),
          onStateChange: (e) => handleStateChange(e.data as YT.PlayerState),
          onError: (e) => handleError(e.data),
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.getElementById('yt-iframe-api');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'yt-iframe-api';
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Invisible 1×1 pixel iframe container — API requires it in the DOM
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: 1,
        height: 1,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: 0,
        zIndex: -1,
      }}
    >
      <div ref={containerRef} />
    </div>
  );
}
