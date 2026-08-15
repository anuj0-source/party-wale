import type { Song } from '../data/playlist';

export interface BeatControllerCallbacks {
  onBassDrop: () => void;
  onEnergyChange: (energy: number) => void;
  onPartyModeChange: (active: boolean) => void;
}

export interface BeatControllerOptions {
  song: Song;
  getTime: () => number;
  callbacks: BeatControllerCallbacks;
}

const INTENSITY_BASE: Record<Song['intensity'], number> = {
  medium: 60,
  high: 75,
  extreme: 90,
};

const DROP_WINDOW_MS = 500; // ms half-window around each bass-drop timestamp

/**
 * Music-Synchronized Visuals Beat Controller
 * ─────────────────────────────────────────────────────────────────────────
 * Uses YouTube playback time (polled via setInterval at 250ms) plus
 * song metadata (bpm, intensity, bassDrops[]) to drive visual effects.
 *
 * Does NOT access or analyze the YouTube audio stream.
 * ─────────────────────────────────────────────────────────────────────────
 */
export function createBeatController(options: BeatControllerOptions) {
  const { song, getTime, callbacks } = options;

  let lastDropIndex = -1;
  let lastDropTime = -Infinity;

  const dropWindowSec = DROP_WINDOW_MS / 1000;

  function computeEnergy(currentTime: number): number {
    const base = INTENSITY_BASE[song.intensity];
    // Gentle pulse based on bpm — creates a slow undulating energy curve
    const beatPeriod = 60 / song.bpm;
    const phase = (currentTime % beatPeriod) / beatPeriod;
    const pulse = Math.sin(phase * Math.PI * 2) * 8;
    // Small random jitter ±3%
    const jitter = (Math.random() - 0.5) * 6;
    return Math.min(100, Math.max(0, base + pulse + jitter));
  }

  function checkBeat() {
    const currentTime = getTime();

    // ── Energy ──────────────────────────────────────────────────────────────
    const energy = computeEnergy(currentTime);
    callbacks.onEnergyChange(energy);

    // ── Bass Drop Detection ─────────────────────────────────────────────────
    const now = performance.now();
    // Don't re-fire within 2s of last drop
    if (now - lastDropTime < 2000) return;

    for (let i = 0; i < song.bassDrops.length; i++) {
      const dropTime = song.bassDrops[i];
      // Check if we're inside the ±window around this drop
      if (Math.abs(currentTime - dropTime) < dropWindowSec) {
        if (i !== lastDropIndex) {
          lastDropIndex = i;
          lastDropTime = now;
          callbacks.onBassDrop();
          break;
        }
      }
    }
  }

  const intervalId = setInterval(checkBeat, 250);

  return {
    stop: () => clearInterval(intervalId),
    resetDropIndex: () => {
      lastDropIndex = -1;
      lastDropTime = -Infinity;
    },
  };
}
