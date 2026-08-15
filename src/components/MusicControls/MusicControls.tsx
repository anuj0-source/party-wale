import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParty } from '../../contexts/PartyContext';
import { playlist } from '../../data/playlist';
import { IconPlay, IconPause, IconSkipBack, IconSkipForward, IconShare, IconCheck, IconList, IconAlert } from '../Icons/Icons';
import './MusicControls.css';

// ── Volume slider (inline, inside expanded pill) ──────────────────────────────
function VolumeSlider({ volume, onChange }: { volume: number; onChange: (v: number) => void }) {
  return (
    <div className="vol-row">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
      <input
        type="range"
        className="vol-slider"
        min={0} max={100} step={1}
        value={volume}
        onChange={e => onChange(parseInt(e.target.value))}
        aria-label="Volume"
        style={{ '--vol': `${volume}%` } as React.CSSProperties}
      />
    </div>
  );
}

// ── Share button ──────────────────────────────────────────────────────────────
function ShareBtn() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const text = "I'm inside Party Wale. Come join.";
    if (navigator.share) {
      try { await navigator.share({ title: 'Party Wale', text, url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <button
      id="btn-share"
      className={`pill-btn pill-btn--share ${copied ? 'pill-btn--copied' : ''}`}
      onClick={handleShare}
      title={copied ? 'Copied!' : 'Share party'}
      aria-label="Share party"
    >
      {copied ? <IconCheck size={14} /> : <IconShare size={14} />}
    </button>
  );
}

// ── Playlist drawer ───────────────────────────────────────────────────────────
function PlaylistDrawer({
  currentSongIndex,
  isPlaying,
  onSelect,
}: {
  currentSongIndex: number;
  isPlaying: boolean;
  onSelect: (index: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current
      ?.querySelector('.pl-item--active')
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentSongIndex]);

  return (
    <div className="playlist-drawer" ref={listRef}>
      {playlist.map((song, i) => (
        <div
          key={song.id}
          className={`pl-item ${i === currentSongIndex ? 'pl-item--active' : ''}`}
          onClick={() => onSelect(i)}
        >
          <span className="pl-num">{i + 1}</span>
          <div className="pl-info">
            <span className="pl-title">{song.title}</span>
            <span className="pl-artist">{song.artist}</span>
          </div>
          {i === currentSongIndex && (
            <span className="pl-active-dot" />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main floating pill ────────────────────────────────────────────────────────
export function MusicControls() {
  const {
    currentSong, currentSongIndex, isPlaying, isBuffering,
    isUnavailable, isReady, player, play, pause, next, previous, jumpToSong,
  } = useParty();

  const [expanded, setExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  // Poll time
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (player && isPlaying) {
        setCurrentTime(player.getCurrentTime() || 0);
        setDuration(player.getDuration() || 0);
      }
    }, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [player, isPlaying]);

  // Sync volume
  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    player?.setVolume(v);
  }, [player]);

  useEffect(() => {
    if (player && isReady) player.setVolume(volume);
  }, [player, isReady]);

  // Close playlist when pill collapses
  useEffect(() => {
    if (!expanded) setShowPlaylist(false);
  }, [expanded]);

  // Click outside to collapse
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    if (expanded) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (player && duration > 0) {
      player.seekTo((val / 100) * duration, true);
      setCurrentTime((val / 100) * duration);
    }
  };

  const PlayPauseIcon = isBuffering
    ? () => <span className="pill-spinner" />
    : isPlaying
      ? () => <IconPause size={18} />
      : () => <IconPlay size={18} />;

  return (
    <div
      ref={pillRef}
      className={`music-pill ${expanded ? 'music-pill--expanded' : ''} ${isPlaying ? 'music-pill--playing' : ''}`}
    >
      {/* ── COLLAPSED VIEW ── */}
      {!expanded && (
        <div className="pill-collapsed" onClick={() => setExpanded(true)}>
          <button
            className="pill-btn pill-btn--sm"
            onClick={e => { e.stopPropagation(); previous(); }}
            disabled={!isReady}
            aria-label="Previous"
          >
            <IconSkipBack size={14} />
          </button>

          <div className="pill-song-mini">
            <span className="pill-playing-dot" />
            <span className="pill-title-mini">{currentSong.title}</span>
          </div>

          <button
            className="pill-btn pill-btn--play-sm"
            onClick={e => { e.stopPropagation(); isPlaying ? pause() : play(); }}
            disabled={!isReady || isUnavailable}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <PlayPauseIcon />
          </button>

          <button
            className="pill-btn pill-btn--sm"
            onClick={e => { e.stopPropagation(); next(); }}
            disabled={!isReady}
            aria-label="Next"
          >
            <IconSkipForward size={14} />
          </button>

          <ShareBtn />
        </div>
      )}

      {/* ── EXPANDED VIEW ── */}
      {expanded && (
        <div className="pill-expanded">
          {/* Song info */}
          <div className="pill-meta">
            <div className="pill-meta-text">
              <span className="pill-title">{currentSong.title}</span>
              <span className="pill-artist">{currentSong.artist}</span>
            </div>
            {isUnavailable && (
              <div className="pill-warn">
                <IconAlert size={11} /> UNAVAILABLE
              </div>
            )}
          </div>

          {/* Seek */}
          <div className="pill-seek-row">
            <span className="pill-time">{fmt(currentTime)}</span>
            <input
              type="range"
              className="pill-seek"
              min={0} max={100} step={0.1}
              value={progress}
              onChange={handleSeek}
              disabled={!isReady || duration === 0}
              style={{ '--prog': `${progress}%` } as React.CSSProperties}
            />
            <span className="pill-time">{fmt(duration)}</span>
          </div>

          {/* Controls */}
          <div className="pill-controls-row">
            <button className="pill-btn pill-btn--sm" onClick={previous} disabled={!isReady} aria-label="Previous">
              <IconSkipBack size={15} />
            </button>

            <button
              className="pill-btn pill-btn--play"
              onClick={isPlaying ? pause : play}
              disabled={!isReady || isUnavailable}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <PlayPauseIcon />
            </button>

            <button className="pill-btn pill-btn--sm" onClick={next} disabled={!isReady} aria-label="Next">
              <IconSkipForward size={15} />
            </button>

            <VolumeSlider volume={volume} onChange={handleVolumeChange} />

            <button
              className={`pill-btn pill-btn--sm ${showPlaylist ? 'pill-btn--active' : ''}`}
              onClick={() => setShowPlaylist(p => !p)}
              aria-label="Playlist"
              aria-expanded={showPlaylist}
            >
              <IconList size={14} />
            </button>

            <ShareBtn />

            <button
              className="pill-btn pill-btn--sm pill-btn--close"
              onClick={() => setExpanded(false)}
              aria-label="Collapse player"
            >
              ✕
            </button>
          </div>

          {/* Playlist */}
          {showPlaylist && (
            <PlaylistDrawer
              currentSongIndex={currentSongIndex}
              isPlaying={isPlaying}
              onSelect={jumpToSong}
            />
          )}
        </div>
      )}
    </div>
  );
}
