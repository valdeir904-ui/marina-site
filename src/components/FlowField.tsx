"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ColorTheme = "aurora" | "ember" | "ocean" | "warm";
type ParticleDensity = "sparse" | "medium" | "dense";

interface Particle {
  x: number;
  y: number;
  speed: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface ThemeConfig {
  hueStart: number;
  hueRange: number;
  saturation: number;
  lightness: number;
  bg: string;
  trailAlpha: number;
}

export interface FlowFieldProps {
  className?: string;
  children?: ReactNode;
  theme?: ColorTheme;
  density?: ParticleDensity;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTICLE_COUNTS: Record<ParticleDensity, number> = {
  sparse: 600,
  medium: 1200,
  dense: 2000,
} as const;

const THEMES: Record<ColorTheme, ThemeConfig> = {
  aurora: {
    hueStart: 120,
    hueRange: 200,
    saturation: 90,
    lightness: 62,
    bg: "5, 5, 8",
    trailAlpha: 0.06,
  },
  ember: {
    hueStart: 0,
    hueRange: 55,
    saturation: 95,
    lightness: 58,
    bg: "20, 10, 5", // Tweaked slightly for a warmer brown dark tone
    trailAlpha: 0.07,
  },
  ocean: {
    hueStart: 180,
    hueRange: 90,
    saturation: 88,
    lightness: 60,
    bg: "2, 6, 10",
    trailAlpha: 0.06,
  },
  warm: {
    hueStart: 31, // Brown/Bronze hue (#74532f is HSL 31, 42%, 32%)
    hueRange: 0,
    saturation: 42,
    lightness: 32,
    bg: "253, 251, 247", // #fdfbf7 (warm-50)
    trailAlpha: 0.20, // Higher alpha for very short trails
  },
} as const;

// ─── Noise / vector-field ─────────────────────────────────────────────────────

function fieldAngle(x: number, y: number, t: number): number {
  // 10 graus de queda (em radianos) da esquerda para a direita
  const baseAngle = 10 * (Math.PI / 180);
  
  // Adiciona uma oscilação mínima para parecer um vento orgânico e não linhas duras
  const wobble = Math.sin(x * 0.001 + y * 0.001 + t * 0.0005) * 0.1;
  
  return baseAngle + wobble;
}

// ─── Default hero content ─────────────────────────────────────────────────────

function DefaultContent() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl font-bold text-5xl text-white leading-[1.08] tracking-tight sm:text-6xl md:text-7xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.9, delay: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
      >
        Chaos finds its
        <br />
        <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-violet-300 bg-clip-text text-transparent">
          own beauty
        </span>
      </motion.h1>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-base text-white/50 leading-relaxed"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.9, delay: 0.56, ease: "easeOut" }}
      >
        Thousands of particles drift through an organic noise field, painting
        luminous trails that shift and spiral endlessly.
      </motion.p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FlowField({
  className,
  children,
  theme = "aurora",
  density = "medium",
}: FlowFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = THEMES[theme];
    const count = PARTICLE_COUNTS[density];
    const dpr = window.devicePixelRatio ?? 1;

    let width = 0;
    let height = 0;
    let animId = 0;
    let time = 0;
    let particles: Particle[] = [];

    const spawnParticle = (): Particle => {
      const maxLife = 200 + Math.floor(Math.random() * 300);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.4 + Math.random() * 0.8, // Reduced speed for calmness
        hue: cfg.hueStart + Math.random() * cfg.hueRange,
        life: Math.floor(Math.random() * maxLife),
        maxLife,
      };
    };

    const resize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Fill dark base on resize
      ctx.fillStyle = `rgb(${cfg.bg})`;
      ctx.fillRect(0, 0, width, height);

      // Re-seed particles spread across the canvas
      particles = Array.from({ length: count }, spawnParticle);
    };

    const render = () => {
      time++;

      // Fade previous frame — each dot persists ~16 frames, creating soft trails
      ctx.fillStyle = `rgba(${cfg.bg}, ${cfg.trailAlpha})`;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        const angle = fieldAngle(p.x, p.y, time);

        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;
        p.life++;

        // Respawn aged-out particles at a random position
        if (p.life > p.maxLife) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.life = 0;
          p.hue = cfg.hueStart + Math.random() * cfg.hueRange;
          continue;
        }

        // Wrap edges
        if (p.x < 0) p.x += width;
        else if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        else if (p.y > height) p.y -= height;

        // Fade in / out over particle lifetime, max 20% opacity
        const progress = p.life / p.maxLife;
        const fadeIn = Math.min(progress * 8, 1);
        const fadeOut = Math.min((1 - progress) * 6, 1);
        
        // Efeito de 0% no rodapé: partículas somem gradualmente nos últimos 300px
        const bottomFade = Math.max(0, Math.min(1, (height - p.y) / 300));
        
        const alpha = fadeIn * fadeOut * 0.2 * bottomFade;

        // Keep the exact hue (solid brown) without angle modulation
        const hueMod = p.hue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hueMod}, ${cfg.saturation}%, ${cfg.lightness}%, ${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [theme, density]);

  const bgColor = THEMES[theme].bg;
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div
      ref={containerRef}
      className={"relative w-full overflow-hidden " + (className || "")}
      style={{ background: `rgb(${bgColor})` }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ opacity: backgroundOpacity }}
      >
        <canvas
          className="absolute inset-0"
          ref={canvasRef}
        />

        {/* Soft bottom fade to make particles transparent at the bottom of the section */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
          style={{
            background: `linear-gradient(to top, rgb(${bgColor}), transparent)`,
          }}
        />

      </motion.div>

      <div className="relative z-10 w-full">
        {children ?? <DefaultContent />}
      </div>
    </div>
  );
}
