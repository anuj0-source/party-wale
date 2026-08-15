// src/components/MusicPill/MusicPill.tsx
// The hand-drawn music pill. Collapsed view is the default; click to expand.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParty } from '../../contexts/useParty';
import { playlist } from '../../data/playlist';
import { copy } from '../../lib/copy';
import { shareMessage } from '../../lib/shareMessage';
import {
  IconPlay, IconPause, IconSkipBack, IconSkipForward,
  IconShare, IconCheck, IconList, IconShuffle,
} from '../Icons/Icons';
import { subscribeToPresence } from '../../lib/presenceSocket';
import './MusicPill.css';

export function MusicPill() {
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
  const [copied, setCopied] = useState(false);
  const [listenerCount, setListenerCount] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeToPresence((n) => setListenerCount(n));
    return unsub;
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (player && isPlaying) {
        setCurrentTime(player.getCurrentTime() || 0);
        setDuration(player.getDuration() || 0);
      }
    }, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [player, isPlaying]);

  useEffect(() => {
    if (player && isReady) player.setVolume(volume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, isReady]);

  useEffect(() => { if (!expanded) setShowPlaylist(false); }, [expanded]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    if (expanded) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (player && duration > 0) {
      player.seekTo((val / 100) * duration, true);
      setCurrentTime((val / 100) * duration);
    }
  };

  const handleVolumeChange = useCallback(
    (v: number) => {
      setVolume(v);
      player?.setVolume(v);
    },
    [player],
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'Party Wale', text: shareMessage(url), url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareMessage(url));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  const PlayPauseIcon = isBuffering
    ? () => <span className="pw-spinner" />
    : isPlaying ? () => <IconPause size={15} /> : () => <IconPlay size={15} />;

  return (
    <div className="music-pill-wrapper" ref={pillRef}>
      {copied && <div className="music-pill-share-toast">{copy.shareCopied}</div>}

      {/* Collapsed pill */}
      {!expanded && (
        <motion.div
          layout
          className={`music-pill ${isPlaying ? 'music-pill--playing' : ''}`}
          onClick={() => setExpanded(true)}
          role="button"
          aria-label="Open music controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="music-pill-dot" />
          <span className="music-pill-title">{currentSong.title}</span>
          <span className="music-pill-artist">— {currentSong.artist}</span>
          <button
            className="music-pill-btn"
            onClick={(e) => { e.stopPropagation(); previous(); }}
            disabled={!isReady}
            aria-label={copy.prev}
            title={copy.prev}
          >
            <IconSkipBack size={14} />
          </button>
          <button
            className="music-pill-btn music-pill-play"
            onClick={(e) => {
              e.stopPropagation();
              if (isPlaying) pause(); else play();
            }}
            disabled={!isReady || isUnavailable}
            aria-label={isPlaying ? copy.pause : copy.play}
            title={isPlaying ? copy.pause : copy.play}
          >
            <PlayPauseIcon />
          </button>
          <button
            className="music-pill-btn"
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={!isReady}
            aria-label={copy.next}
            title={copy.next}
          >
            <IconSkipForward size={14} />
          </button>
          <button
            className="music-pill-btn"
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            aria-label={copy.share}
            title={copy.share}
          >
            {copied ? <IconCheck size={14} /> : <IconShare size={14} />}
          </button>
        </motion.div>
      )}

      {/* Listener count sticker below */}
      {!expanded && listenerCount !== null && (
        <div className="music-pill-listeners">
          <span className="music-pill-listeners-dot" />
          {listenerCount === 1 ? copy.listenerSingular : copy.listenerPlural(listenerCount)}
        </div>
      )}

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="music-pill-expanded"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="music-pill-expanded-header">
              <div>
                <div className="music-pill-expanded-title">{currentSong.title}</div>
                <div className="music-pill-expanded-artist">— {currentSong.artist}</div>
                {isUnavailable && (
                  <div style={{ color: 'var(--hot)', fontSize: 11, marginTop: 4 }}>
                    {copy.partyNoSong}
                  </div>
                )}
              </div>
              <button
                className="music-pill-expanded-close"
                onClick={() => setExpanded(false)}
                aria-label="Collapse"
              >
                ✕
              </button>
            </div>

            <div className="music-pill-seek">
              <span>{fmt(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress}
                onChange={handleSeek}
                disabled={!isReady || duration === 0}
                aria-label="Seek"
                style={{ ['--prog' as string]: `${progress}%` } as React.CSSProperties}
              />
              <span>{fmt(duration)}</span>
            </div>

            <div className="music-pill-ctrls">
              <div className="music-pill-ctrls-group">
                <button
                  className={`music-pill-btn ${isShuffled ? 'music-pill-btn--active' : ''}`}
                  onClick={toggleShuffle}
                  aria-label="Shuffle"
                  title="Shuffle"
                  style={isShuffled ? { background: 'var(--mustard)' } : undefined}
                >
                  <IconShuffle size={14} />
                </button>
                <button
                  className="music-pill-btn"
                  onClick={handleShare}
                  aria-label={copy.share}
                  title={copy.share}
                >
                  {copied ? <IconCheck size={14} /> : <IconShare size={14} />}
                </button>
              </div>

              <div className="music-pill-ctrls-center">
                <button
                  className="music-pill-btn"
                  onClick={previous}
                  disabled={!isReady}
                  aria-label={copy.prev}
                  title={copy.prev}
                >
                  <IconSkipBack size={16} />
                </button>
                <button
                  className="music-pill-big-play"
                  onClick={isPlaying ? pause : play}
                  disabled={!isReady || isUnavailable}
                  aria-label={isPlaying ? copy.pause : copy.play}
                  title={isPlaying ? copy.pause : copy.play}
                >
                  {isBuffering ? <span className="pw-spinner" /> : isPlaying ? <IconPause size={18} /> : <IconPlay size={18} />}
                </button>
                <button
                  className="music-pill-btn"
                  onClick={next}
                  disabled={!isReady}
                  aria-label={copy.next}
                  title={copy.next}
                >
                  <IconSkipForward size={16} />
                </button>
              </div>

              <div className="music-pill-ctrls-group">
                <button
                  className="music-pill-btn"
                  onClick={() => setShowPlaylist((p) => !p)}
                  aria-label="Playlist"
                  title="Playlist"
                  style={showPlaylist ? { background: 'var(--mustard)' } : undefined}
                >
                  <IconList size={14} />
                </button>
              </div>
            </div>

            <div className="music-pill-aux">
              <span>{copy.volume}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                aria-label={copy.volume}
                style={{ ['--vol' as string]: `${volume}%` } as React.CSSProperties}
              />
            </div>

            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  className="music-pill-playlist"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 160, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflowY: 'auto', overflowX: 'hidden' }}
                >
                  {playlist.map((song, i) => (
                    <div
                      key={song.id}
                      className={`music-pill-playlist-row ${i === currentSongIndex ? 'music-pill-playlist-row--active' : ''}`}
                      onClick={() => jumpToSong(i)}
                    >
                      <span className="music-pill-playlist-num">{i + 1}</span>
                      <div className="music-pill-playlist-meta">
                        <span className="music-pill-playlist-title">{song.title}</span>
                        <span className="music-pill-playlist-artist">{song.artist}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
