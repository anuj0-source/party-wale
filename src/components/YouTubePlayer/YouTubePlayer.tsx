import React, { useEffect, useRef } from 'react';
import { useParty } from '../../contexts/PartyContext';
import { playlist } from '../../data/playlist';
import './YouTubePlayer.css';

/**
 * Mounts the official YouTube IFrame Player in a visible, integrated area.
 * Handles onReady, onStateChange, onError, onPlaybackQualityChange.
 */
export function YouTubePlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { handlePlayerReady, handleStateChange, handleError, currentSong } = useParty();

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return;
      new window.YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId: playlist[0].youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => handlePlayerReady(e.target),
          onStateChange: (e) => handleStateChange(e.data as YT.PlayerState),
          onError: (e) => handleError(e.data),
          onPlaybackQualityChange: () => {},
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Load the YouTube IFrame API script
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

  return (
    <div className="yt-player-wrapper">
      <div className="yt-player-label">
        <span className="yt-icon">▶</span> YouTube
      </div>
      <div className="yt-player-frame">
        <div ref={containerRef} className="yt-player-inner" />
      </div>
      <div className="yt-player-song-info">
        <span className="yt-now-label">NOW PLAYING</span>
        <span className="yt-song-title">{currentSong.title}</span>
      </div>
    </div>
  );
}
