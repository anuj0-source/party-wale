import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParty } from '../../contexts/PartyContext';
import { playlist } from '../../data/playlist';
import {
  IconPlay, IconPause, IconSkipBack, IconSkipForward,
  IconShare, IconCheck, IconList, IconAlert, IconShuffle,
} from '../Icons/Icons';
import './MusicControls.css';

// ── Live EQ bars (collapsed pill) ────────────────────────────────────────────
function EQBars() {
  return (
    <div className="pill-eq" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="pill-eq-bar" />
      ))}
    </div>
  );
}

// ── Volume slider ─────────────────────────────────────────────────────────────
function VolumeSlider({ volume, onChange }: { volume: number; onChange: (v: number) => void }) {
  return (
    <div className="vol-row">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
      </svg>
      <input
        type="range"
        className="vol-slider"
        min={0} max={100} step={1}
        value={volume}
        onChange={(e) => onChange(parseInt(e.target.value))}
        aria-label="Volume"
        style={{ '--vol': `${volume}%` } as React.CSSProperties}
      />
    </div>
  );
}

// ── Share button ──────────────────────────────────────────────────────────────
function ShareBtn({ size = 14 }: { size?: number }) {
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
      className={`pill-btn pill-btn--sm pill-btn--share ${copied ? 'pill-btn--copied' : ''}`}
      onClick={handleShare}
      title={copied ? 'Copied!' : 'Share party'}
      aria-label="Share party"
    >
      {copied ? <IconCheck size={size} /> : <IconShare size={size} />}
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
          {i === currentSongIndex && isPlaying && (
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
    isShuffled, toggleShuffle,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      ? () => <IconPause size={20} />
      : () => <IconPlay size={20} />;

  const PlayPauseIconSm = isBuffering
    ? () => <span className="pill-spinner" />
    : isPlaying
      ? () => <IconPause size={15} />
      : () => <IconPlay size={15} />;

  return (
    <div
      ref={pillRef}
      className={`music-pill-wrapper ${isPlaying ? 'music-pill--playing' : ''}`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`music-pill-container ${expanded ? 'pill-expanded' : 'pill-collapsed'}`}
        onClick={() => !expanded && setExpanded(true)}
        style={{ borderRadius: expanded ? 28 : 100 }}
      >
        <AnimatePresence mode="popLayout">
          {/* ── COLLAPSED VIEW ── */}
          {!expanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="pill-content-collapsed"
            >
              {/* EQ bars */}
              <EQBars />

            {/* Song title */}
            <div className="pill-song-mini">
              <span className="pill-title-mini">{currentSong.title}</span>
            </div>

            {/* Prev */}
            <button
              className="pill-btn--sm-bare"
              onClick={(e) => { e.stopPropagation(); previous(); }}
              disabled={!isReady}
              aria-label="Previous"
            >
              <IconSkipBack size={13} />
            </button>

            {/* Play/Pause capsule */}
            <button
              className="pill-play-capsule"
              onClick={(e) => { e.stopPropagation(); isPlaying ? pause() : play(); }}
              disabled={!isReady || isUnavailable}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <PlayPauseIconSm />
            </button>

            {/* Next */}
            <button
              className="pill-btn--sm-bare"
              onClick={(e) => { e.stopPropagation(); next(); }}
              disabled={!isReady}
              aria-label="Next"
              style={{ marginRight: 4 }}
            >
              <IconSkipForward size={13} />
            </button>

              <ShareBtn size={13} />
            </motion.div>
          ) : (
            /* ── EXPANDED VIEW ── */
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="pill-content-expanded"
            >
              {/* Artwork + meta header */}
              <div className="pill-artwork">
              <div className="pill-disc" aria-hidden="true" />
              <div className="pill-artwork-text">
                <div className="pill-artwork-title">{currentSong.title}</div>
                <div className="pill-artwork-artist">{currentSong.artist}</div>
                {isUnavailable && (
                  <div className="pill-warn">
                    <IconAlert size={10} /> UNAVAILABLE
                  </div>
                )}
              </div>
            </div>

            {/* Card body */}
            <div className="pill-body">
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
                  aria-label="Seek"
                />
                <span className="pill-time">{fmt(duration)}</span>
              </div>

              {/* Controls */}
              <div className="pill-controls-row">
                {/* Left: shuffle + share */}
                <div className="pill-controls-left">
                  <button
                    className={`pill-btn pill-btn--sm ${isShuffled ? 'pill-btn--active' : ''}`}
                    onClick={toggleShuffle}
                    aria-label={isShuffled ? 'Shuffle on' : 'Shuffle off'}
                    title={isShuffled ? 'Shuffle: ON' : 'Shuffle: OFF'}
                  >
                    <IconShuffle size={14} />
                  </button>
                  <ShareBtn />
                </div>

                {/* Centre: prev · play · next */}
                <div className="pill-controls-center">
                  <button
                    className="pill-btn pill-btn--skip"
                    onClick={previous}
                    disabled={!isReady}
                    aria-label="Previous"
                  >
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

                  <button
                    className="pill-btn pill-btn--skip"
                    onClick={next}
                    disabled={!isReady}
                    aria-label="Next"
                  >
                    <IconSkipForward size={15} />
                  </button>
                </div>

                {/* Right: playlist toggle + close */}
                <div className="pill-controls-right">
                  <button
                    className={`pill-btn pill-btn--sm ${showPlaylist ? 'pill-btn--active' : ''}`}
                    onClick={() => setShowPlaylist((p) => !p)}
                    aria-label="Playlist"
                    aria-expanded={showPlaylist}
                  >
                    <IconList size={14} />
                  </button>
                  <button
                    className="pill-btn pill-btn--sm pill-btn--close"
                    onClick={() => setExpanded(false)}
                    aria-label="Collapse player"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Volume */}
              <div className="pill-aux-row">
                <VolumeSlider volume={volume} onChange={handleVolumeChange} />
              </div>

              {/* Playlist */}
              <AnimatePresence>
                {showPlaylist && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <PlaylistDrawer
                      currentSongIndex={currentSongIndex}
                      isPlaying={isPlaying}
                      onSelect={jumpToSong}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </div>
  );
}
