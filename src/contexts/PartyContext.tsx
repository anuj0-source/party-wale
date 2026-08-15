import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import type { Song } from '../data/playlist';
import { playlist } from '../data/playlist';
import {
  createBeatController,
} from '../party/partyBeatController';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Phase = 'ticket' | 'entry' | 'party';

export interface PartyContextValue {
  // Navigation
  phase: Phase;
  setPhase: (p: Phase) => void;

  // Player ref — set by YouTubePlayer component after onReady
  player: YT.Player | null;
  setPlayer: (p: YT.Player | null) => void;

  // Playback state
  currentSongIndex: number;
  currentSong: Song;
  isPlaying: boolean;
  isBuffering: boolean;
  isReady: boolean;
  isUnavailable: boolean;

  // Music-Synchronized Visuals state
  partyEnergy: number;
  bassDropActive: boolean;

  // Ticket
  ticketNumber: string;

  // Controls
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  jumpToSong: (index: number) => void;

  // Called by YouTubePlayer component
  handlePlayerReady: (player: YT.Player) => void;
  handleStateChange: (state: YT.PlayerState) => void;
  handleError: (code: number) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const PartyContext = createContext<PartyContextValue | null>(null);

export function useParty(): PartyContextValue {
  const ctx = useContext(PartyContext);
  if (!ctx) throw new Error('useParty must be used inside PartyProvider');
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

function generateTicketNumber(): string {
  return String(Math.floor(10000 + Math.random() * 89999));
}

export function PartyProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>('ticket');
  const [player, setPlayerState] = useState<YT.Player | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [partyEnergy, setPartyEnergy] = useState(0);
  const [bassDropActive, setBassDropActive] = useState(false);
  const [ticketNumber] = useState(generateTicketNumber);

  const beatControllerRef = useRef<ReturnType<typeof createBeatController> | null>(null);
  const bassDropTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerRef = useRef<YT.Player | null>(null);

  const currentSong = playlist[currentSongIndex];

  // ── Helpers ───────────────────────────────────────────────────────────────

  const setPlayer = useCallback((p: YT.Player | null) => {
    playerRef.current = p;
    setPlayerState(p);
  }, []);

  const stopBeatController = useCallback(() => {
    if (beatControllerRef.current) {
      beatControllerRef.current.stop();
      beatControllerRef.current = null;
    }
  }, []);

  const startBeatController = useCallback(
    (song: Song) => {
      stopBeatController();
      if (!playerRef.current) return;
      beatControllerRef.current = createBeatController({
        song,
        getTime: () => playerRef.current?.getCurrentTime() ?? 0,
        callbacks: {
          onBassDrop: () => {
            setBassDropActive(true);
            if (bassDropTimeoutRef.current) clearTimeout(bassDropTimeoutRef.current);
            bassDropTimeoutRef.current = setTimeout(() => setBassDropActive(false), 1200);
          },
          onEnergyChange: setPartyEnergy,
          onPartyModeChange: () => {},
        },
      });
    },
    [stopBeatController],
  );

  // ── YouTube event handlers ────────────────────────────────────────────────

  const handlePlayerReady = useCallback(
    (p: YT.Player) => {
      setPlayer(p);
      setIsReady(true);
    },
    [setPlayer],
  );

  const skipToNext = useCallback(() => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    setIsUnavailable(false);
  }, []);

  const handleStateChange = useCallback(
    (state: YT.PlayerState) => {
      switch (state) {
        case YT.PlayerState.PLAYING:
          setIsPlaying(true);
          setIsBuffering(false);
          setIsUnavailable(false);
          startBeatController(playlist[currentSongIndex]);
          break;
        case YT.PlayerState.PAUSED:
          setIsPlaying(false);
          setIsBuffering(false);
          stopBeatController();
          setPartyEnergy(0);
          break;
        case YT.PlayerState.BUFFERING:
          setIsBuffering(true);
          break;
        case YT.PlayerState.ENDED:
          setIsPlaying(false);
          stopBeatController();
          skipToNext();
          break;
        case YT.PlayerState.UNSTARTED:
        case YT.PlayerState.CUED:
          setIsBuffering(false);
          break;
      }
    },
    [currentSongIndex, startBeatController, stopBeatController, skipToNext],
  );

  const handleError = useCallback(
    (_code: number) => {
      setIsUnavailable(true);
      setIsPlaying(false);
      stopBeatController();
      // Auto-skip after 2s
      setTimeout(() => skipToNext(), 2000);
    },
    [stopBeatController, skipToNext],
  );

  // ── Song change effect ────────────────────────────────────────────────────

  useEffect(() => {
    if (!playerRef.current || !isReady) return;
    const song = playlist[currentSongIndex];
    playerRef.current.loadVideoById(song.youtubeId, 0);
    setIsBuffering(true);
    setIsUnavailable(false);
    if (beatControllerRef.current) {
      beatControllerRef.current.resetDropIndex();
    }
  }, [currentSongIndex, isReady]);

  // ── Controls ──────────────────────────────────────────────────────────────

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const next = useCallback(() => {
    stopBeatController();
    skipToNext();
  }, [stopBeatController, skipToNext]);
  const previous = useCallback(() => {
    stopBeatController();
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsUnavailable(false);
  }, [stopBeatController]);
  const jumpToSong = useCallback((index: number) => {
    if (index === currentSongIndex) return;
    stopBeatController();
    setCurrentSongIndex(index);
    setIsUnavailable(false);
  }, [currentSongIndex, stopBeatController]);

  // ── Cleanup ───────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stopBeatController();
      if (bassDropTimeoutRef.current) clearTimeout(bassDropTimeoutRef.current);
    };
  }, [stopBeatController]);

  return (
    <PartyContext.Provider
      value={{
        phase,
        setPhase,
        player,
        setPlayer,
        currentSongIndex,
        currentSong,
        isPlaying,
        isBuffering,
        isReady,
        isUnavailable,
        partyEnergy,
        bassDropActive,
        ticketNumber,
        play,
        pause,
        next,
        previous,
        jumpToSong,
        handlePlayerReady,
        handleStateChange,
        handleError,
      }}
    >
      {children}
    </PartyContext.Provider>
  );
}
