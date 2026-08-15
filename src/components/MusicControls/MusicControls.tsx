import React, { useState, useEffect, useRef } from 'react';
import { useParty } from '../../contexts/PartyContext';
import { playlist } from '../../data/playlist';
import './MusicControls.css';

export function MusicControls() {
  const {
    currentSong,
    currentSongIndex,
    isPlaying,
    isBuffering,
    isUnavailable,
    isReady,
    player,
    play,
    pause,
    next,
    previous,
  } = useParty();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll getCurrentTime every 500ms — efficient, not every frame
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (player && isPlaying) {
        setCurrentTime(player.getCurrentTime() || 0);
        setDuration(player.getDuration() || 0);
      }
    }, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [player, isPlaying]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (player && duration > 0) {
      player.seekTo((val / 100) * duration, true);
      setCurrentTime((val / 100) * duration);
    }
  };

  return (
    <div className="music-controls">
      {/* Song info */}
      <div className="mc-song-info">
        <div className="mc-song-number">#{currentSongIndex + 1}/{playlist.length}</div>
        <div className="mc-song-title">{currentSong.title}</div>
        <div className="mc-artist">{currentSong.artist}</div>
        {isUnavailable && (
          <div className="mc-unavailable">⚠️ TRACK UNAVAILABLE — SKIPPING...</div>
        )}
        {isBuffering && !isUnavailable && (
          <div className="mc-buffering">
            <span className="buffering-dot" />
            <span className="buffering-dot" />
            <span className="buffering-dot" />
            BUFFERING...
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mc-progress-container">
        <span className="mc-time">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="mc-progress-bar"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          disabled={!isReady || duration === 0}
        />
        <span className="mc-time">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="mc-controls">
        <button
          id="btn-previous"
          className="mc-btn mc-btn-secondary"
          onClick={previous}
          disabled={!isReady}
          title="Previous"
        >
          ⏮
        </button>
        <button
          id="btn-play-pause"
          className="mc-btn mc-btn-primary"
          onClick={isPlaying ? pause : play}
          disabled={!isReady || isUnavailable}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isBuffering ? <span className="spinner" /> : isPlaying ? '⏸' : '▶'}
        </button>
        <button
          id="btn-next"
          className="mc-btn mc-btn-secondary"
          onClick={next}
          disabled={!isReady}
          title="Next"
        >
          ⏭
        </button>
      </div>

      {/* Playlist */}
      <div className="mc-playlist">
        {playlist.map((song, i) => (
          <div
            key={song.id}
            className={`mc-playlist-item ${i === currentSongIndex ? 'mc-playlist-item--active' : ''}`}
            onClick={() => {
              if (i !== currentSongIndex) {
                // Trigger via context's setCurrentSongIndex indirectly through next/prev logic
                // For direct jump, we call player directly
                if (player) {
                  player.loadVideoById(song.youtubeId, 0);
                }
              }
            }}
          >
            <span className="mc-playlist-num">{i + 1}</span>
            <div className="mc-playlist-info">
              <span className="mc-playlist-title">{song.title}</span>
              <span className="mc-playlist-artist">{song.artist}</span>
            </div>
            {i === currentSongIndex && (
              <span className="mc-playlist-playing">
                {isPlaying ? '♫' : '▶'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
