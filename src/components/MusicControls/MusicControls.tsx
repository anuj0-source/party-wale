import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParty } from '../../contexts/PartyContext';
import { playlist } from '../../data/playlist';
import './MusicControls.css';

// ── Volume Knob ────────────────────────────────────────────────────────────────
// Drag up to increase, drag down to decrease. Range: -135deg → +135deg (270°)
function VolumeKnob({
  volume,
  onChange,
}: {
  volume: number;
  onChange: (v: number) => void;
}) {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startVol = useRef(volume);

  // volume 0-100 → angle -135 to +135
  const angle = -135 + (volume / 100) * 270;

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startY.current = e.clientY;
      startVol.current = volume;
    },
    [volume],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = startY.current - e.clientY; // drag up = positive
      const newVol = Math.min(100, Math.max(0, startVol.current + delta * 0.8));
      onChange(Math.round(newVol));
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onChange]);

  // Touch support
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isDragging.current = true;
      startY.current = e.touches[0].clientY;
      startVol.current = volume;
    },
    [volume],
  );

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const delta = startY.current - e.touches[0].clientY;
      const newVol = Math.min(100, Math.max(0, startVol.current + delta * 0.8));
      onChange(Math.round(newVol));
    };
    const onTouchEnd = () => {
      isDragging.current = false;
    };
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onChange]);

  // SVG arc helper
  const polarToCart = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: 28 + r * Math.cos(rad), y: 28 + r * Math.sin(rad) };
  };

  const describeArc = (startAngle: number, endAngle: number, r: number) => {
    const s = polarToCart(startAngle, r);
    const e = polarToCart(endAngle, r);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const trackStart = -135 + 90; // 90 offset because polarToCart subtracts 90
  const trackEnd = 135 + 90;
  const fillEnd = angle + 90;

  return (
    <div
      className="knob-wrapper"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      title={`Volume: ${volume}%`}
    >
      <svg className="knob-svg" viewBox="0 0 56 56" width="72" height="72">
        {/* Outer glow ring */}
        <circle cx="28" cy="28" r="26" className="knob-outer-ring" />

        {/* Track arc (grey) */}
        <path
          d={describeArc(-45, 225, 20)}
          className="knob-track"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Filled arc (neon pink→cyan gradient) */}
        <path
          d={describeArc(-45, -45 + (volume / 100) * 270, 20)}
          className="knob-fill"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Knob body */}
        <circle cx="28" cy="28" r="16" className="knob-body" />

        {/* Indicator dot */}
        {(() => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const dx = 28 + 10 * Math.cos(rad);
          const dy = 28 + 10 * Math.sin(rad);
          return <circle cx={dx} cy={dy} r="2.5" className="knob-dot" />;
        })()}
      </svg>
      <span className="knob-label">VOL</span>
      <span className="knob-value">{volume}%</span>
    </div>
  );
}

// ── Mini visualizer bars ───────────────────────────────────────────────────────
function VisualizerBars({ isPlaying, energy }: { isPlaying: boolean; energy: number }) {
  return (
    <div className="mc-visualizer" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="mc-viz-bar"
          style={
            {
              '--delay': `${i * 0.07}s`,
              '--height': isPlaying ? `${20 + Math.random() * 60 + energy * 0.4}%` : '15%',
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// ── Main MusicControls ─────────────────────────────────────────────────────────
export function MusicControls() {
  const {
    currentSong,
    currentSongIndex,
    isPlaying,
    isBuffering,
    isUnavailable,
    isReady,
    player,
    partyEnergy,
    play,
    pause,
    next,
    previous,
  } = useParty();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playlistRef = useRef<HTMLDivElement>(null);

  // Poll time every 500ms
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

  // Sync volume with player
  const handleVolumeChange = useCallback(
    (v: number) => {
      setVolume(v);
      player?.setVolume(v);
    },
    [player],
  );

  // Set initial volume when player becomes ready
  useEffect(() => {
    if (player && isReady) {
      player.setVolume(volume);
    }
  }, [player, isReady]);

  // Auto-scroll active playlist item into view
  useEffect(() => {
    if (showPlaylist && playlistRef.current) {
      const active = playlistRef.current.querySelector('.mc-pl-item--active');
      active?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentSongIndex, showPlaylist]);

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

  const handlePlaylistJump = (index: number) => {
    if (index === currentSongIndex) return;
    if (player) {
      player.loadVideoById(playlist[index].youtubeId, 0);
    }
  };

  return (
    <div className={`music-controls ${isPlaying ? 'mc--playing' : ''}`}>
      {/* ── Glass card ── */}
      <div className="mc-glass">

        {/* ── Top: visualizer + song info ── */}
        <div className="mc-top">
          <div className="mc-disc-area">
            <div className={`mc-disc ${isPlaying ? 'mc-disc--spin' : ''}`}>
              <div className="mc-disc-inner">🎵</div>
            </div>
            <VisualizerBars isPlaying={isPlaying} energy={partyEnergy} />
          </div>

          <div className="mc-info">
            <div className="mc-track-num">#{currentSongIndex + 1} / {playlist.length}</div>
            <div className="mc-title">{currentSong.title}</div>
            <div className="mc-artist">{currentSong.artist}</div>

            {isUnavailable && (
              <div className="mc-status mc-status--warn">⚠ UNAVAILABLE — SKIPPING...</div>
            )}
            {isBuffering && !isUnavailable && (
              <div className="mc-status mc-status--buf">
                <span className="mc-buf-dot" />
                <span className="mc-buf-dot" />
                <span className="mc-buf-dot" />
                LOADING...
              </div>
            )}
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="mc-progress-row">
          <span className="mc-time">{formatTime(currentTime)}</span>
          <div className="mc-progress-track">
            <input
              type="range"
              className="mc-seek"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={handleSeek}
              disabled={!isReady || duration === 0}
              style={{ '--prog': `${progress}%` } as React.CSSProperties}
            />
          </div>
          <span className="mc-time">{formatTime(duration)}</span>
        </div>

        {/* ── Controls row ── */}
        <div className="mc-controls-row">
          {/* Prev */}
          <button
            id="btn-previous"
            className="mc-btn mc-btn--sm"
            onClick={previous}
            disabled={!isReady}
            title="Previous"
          >
            ⏮
          </button>

          {/* Play/Pause */}
          <button
            id="btn-play-pause"
            className="mc-btn mc-btn--play"
            onClick={isPlaying ? pause : play}
            disabled={!isReady || isUnavailable}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isBuffering ? <span className="mc-spinner" /> : isPlaying ? '⏸' : '▶'}
          </button>

          {/* Next */}
          <button
            id="btn-next"
            className="mc-btn mc-btn--sm"
            onClick={next}
            disabled={!isReady}
            title="Next"
          >
            ⏭
          </button>

          {/* Playlist toggle */}
          <button
            id="btn-playlist"
            className={`mc-btn mc-btn--sm ${showPlaylist ? 'mc-btn--active' : ''}`}
            onClick={() => setShowPlaylist((p) => !p)}
            title="Playlist"
          >
            ☰
          </button>

          {/* Volume Knob */}
          <VolumeKnob volume={volume} onChange={handleVolumeChange} />
        </div>

        {/* ── Playlist drawer ── */}
        {showPlaylist && (
          <div className="mc-playlist" ref={playlistRef}>
            {playlist.map((song, i) => (
              <div
                key={song.id}
                className={`mc-pl-item ${i === currentSongIndex ? 'mc-pl-item--active' : ''}`}
                onClick={() => handlePlaylistJump(i)}
              >
                <span className="mc-pl-num">{i + 1}</span>
                <div className="mc-pl-info">
                  <span className="mc-pl-title">{song.title}</span>
                  <span className="mc-pl-artist">{song.artist}</span>
                </div>
                {i === currentSongIndex && (
                  <span className="mc-pl-icon">{isPlaying ? '♫' : '▶'}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
