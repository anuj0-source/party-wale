import React, { useRef, useEffect, useCallback } from 'react';

interface ParticlesProps {
  isPlaying: boolean;
  isMobile?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

const COLORS = ['#f6b73c', '#ff3d77', '#19d3da', '#5fb87a', '#ffa6b9', '#f6ecd9'];

function getParticleCount(isMobile: boolean, isReduced: boolean): number {
  if (isReduced) return 6;
  if (isMobile) return 20;
  const cpuCount = navigator.hardwareConcurrency ?? 4;
  if (cpuCount <= 2) return 30;
  return 50;  // Atmospheric dust — not a fireworks show
}

export function Particles({ isPlaying, isMobile = false }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const isPlayingRef = useRef(isPlaying);

  const isReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const maxCount = getParticleCount(isMobile, isReduced);

  const spawnParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    // playing → gentle float; idle → almost still
    const speed = isPlayingRef.current ? 0.8 : 0.25;
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * speed,
      vy: -(Math.random() * speed + 0.2),
      size: Math.random() * 1.2 + 0.3,
      color,
      alpha: 1,
      life: 0,
      maxLife: 120 + Math.random() * 200,
    };
  }, []);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Initialize particles
    particlesRef.current = Array.from({ length: Math.floor(maxCount * 0.3) }, () =>
      spawnParticle(canvas),
    ).map((p) => ({ ...p, y: Math.random() * canvas.height }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const target = isPlayingRef.current
        ? bassDropRef.current
          ? Math.floor(maxCount * 2.5)   // explosion
          : Math.floor(maxCount * 0.6)   // gentle atmosphere
        : Math.floor(maxCount * 0.08);   // nearly invisible idle

      // Spawn new particles to reach target
      while (particlesRef.current.length < target) {
        particlesRef.current.push(spawnParticle(canvas));
      }

      // Update and draw
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.015; // gravity-like float upward
        p.alpha = 1 - p.life / p.maxLife;

        if (p.alpha <= 0 || p.y < -10) return false;

        ctx.save();
        ctx.globalAlpha = p.alpha * (bassDropRef.current ? 0.85 : isPlayingRef.current ? 0.35 : 0.12);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 4;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxCount]);

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
