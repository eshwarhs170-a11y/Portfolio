/**
 * FieldLinesBackground.tsx
 *
 * Bipolar Nebula — pure canvas, no image.
 * Matches: black space, two pink/magenta glowing orbs,
 * white blazing center, flowing filament streamlines.
 *
 * position: fixed → covers full screen behind everything
 * Only visible when `visible` prop = true (contact section in view)
 */

import { useEffect, useRef } from 'react';

interface Props {
  visible: boolean;
}

export default function FieldLinesBackground({ visible }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const opacityRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Stars: generate once, reuse every frame
    const STAR_COUNT = 220;
    const stars: { x: number; y: number; r: number; alpha: number; twinkleSpeed: number }[] = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      // Regenerate stars when resized
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.2,
          alpha: Math.random() * 0.6 + 0.2,
          twinkleSpeed: Math.random() * 2 + 1,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      time += 0.003;

      // ── Smooth opacity fade ──
      const target = visible ? 1 : 0;
      opacityRef.current += (target - opacityRef.current) * 0.025;
      canvas.style.opacity = String(opacityRef.current);

      // ── Pure black space background ──
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      // ── Stars (twinkling white dots) ──
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.x);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * twinkle})`;
        ctx.fill();
      }

      // Orb focal centres
      const L = { x: W * 0.30, y: H * 0.50 }; // left orb
      const R = { x: W * 0.70, y: H * 0.50 }; // right orb
      const CX = W * 0.5;
      const CY = H * 0.5;
      const orbR = Math.min(W, H) * 0.40;

      // ── LEFT ORB — warm pink / golden rose ──
      const lgL = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, orbR);
      lgL.addColorStop(0,    `rgba(255,200,180,${0.30 + Math.sin(time * 0.8) * 0.06})`);
      lgL.addColorStop(0.18, `rgba(255,100,180,${0.25 + Math.sin(time)       * 0.05})`);
      lgL.addColorStop(0.40, `rgba(200, 40,140, 0.18)`);
      lgL.addColorStop(0.65, `rgba(130, 20,100, 0.10)`);
      lgL.addColorStop(1,     'transparent');
      ctx.fillStyle = lgL;
      ctx.fillRect(0, 0, W, H);

      // ── RIGHT ORB — hot magenta / fuchsia ──
      const lgR = ctx.createRadialGradient(R.x, R.y, 0, R.x, R.y, orbR);
      lgR.addColorStop(0,    `rgba(255,160,220,${0.28 + Math.cos(time * 0.9) * 0.06})`);
      lgR.addColorStop(0.18, `rgba(255, 60,180,${0.25 + Math.cos(time)       * 0.05})`);
      lgR.addColorStop(0.40, `rgba(180, 20,140, 0.18)`);
      lgR.addColorStop(0.65, `rgba(100, 10, 80, 0.10)`);
      lgR.addColorStop(1,     'transparent');
      ctx.fillStyle = lgR;
      ctx.fillRect(0, 0, W, H);

      // ── BLAZING WHITE CORE at centre meeting point ──
      const coreR = Math.min(W, H) * 0.055;
      const core = ctx.createRadialGradient(CX, CY, 0, CX, CY, coreR);
      const corePulse = 0.90 + Math.sin(time * 3) * 0.10;
      core.addColorStop(0,    `rgba(255,255,255,${corePulse})`);
      core.addColorStop(0.25, `rgba(255,220,240,0.60)`);
      core.addColorStop(0.55, `rgba(255,100,200,0.25)`);
      core.addColorStop(1,     'transparent');
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, W, H);

      // ── FILAMENT STREAMLINES ──
      // 140 lines total: half from left orb, half from right
      for (let i = 0; i < 140; i++) {
        const fromLeft = i < 70;
        const focal    = fromLeft ? L : R;
        const sign     = fromLeft ? 1 : -1; // swirl direction

        // Start spread ring around each orb
        const spreadAngle = (i / 70) * Math.PI * 2 + time * sign * 0.15;
        const spreadR     = orbR * (0.08 + Math.random() * 0.55);
        let x = focal.x + Math.cos(spreadAngle) * spreadR;
        let y = focal.y + Math.sin(spreadAngle) * spreadR;

        ctx.beginPath();
        ctx.moveTo(x, y);

        // Follow velocity field toward the opposing orb, with spiral curl
        for (let step = 0; step < 90; step++) {
          const toOtherX = (fromLeft ? R.x : L.x) - x;
          const toOtherY = (fromLeft ? R.y : L.y) - y;
          const dist = Math.sqrt(toOtherX ** 2 + toOtherY ** 2) + 1;
          const nx = toOtherX / dist;
          const ny = toOtherY / dist;

          // Pull toward other orb + perpendicular spiral + time ripple
          const vx = nx * 2.8 + ny * sign * 1.8 + Math.sin(time * 0.5 + y / (H * 0.25)) * 0.5;
          const vy = ny * 2.8 - nx * sign * 1.8 + Math.cos(time * 0.5 + x / (W * 0.25)) * 0.5;

          x += vx;
          y += vy;
          ctx.lineTo(x, y);
          if (x < -10 || x > W + 10 || y < -10 || y > H + 10) break;
        }

        // Colour: pink spectrum matching the image
        // Left filaments: warm rose-pink, right: cool magenta-pink
        const hue = fromLeft
          ? 320 + Math.sin(time + i * 0.08) * 20   // 300-340 → rose/pink
          : 310 + Math.cos(time + i * 0.08) * 25;  // 285-335 → magenta/pink
        const lightness = 60 + Math.random() * 25;  // 60-85%
        const alpha = 0.12 + Math.random() * 0.40;

        ctx.strokeStyle = `hsla(${hue}, 90%, ${lightness}%, ${alpha})`;
        ctx.lineWidth   = 0.4 + Math.random() * 0.8;
        ctx.shadowBlur  = 10;
        ctx.shadowColor = `hsla(${hue}, 100%, 75%, 0.5)`;
        ctx.stroke();
      }

      // ── Outer glow: faint purple haze at the edges of both orbs ──
      const haze = ctx.createRadialGradient(CX, CY, orbR * 0.5, CX, CY, orbR * 1.4);
      haze.addColorStop(0,   'transparent');
      haze.addColorStop(0.6, `rgba(160, 30, 120, ${0.04 + Math.sin(time * 0.6) * 0.02})`);
      haze.addColorStop(1,    'transparent');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,           // behind all content
        pointerEvents: 'none',
        opacity: 0,
      }}
    />
  );
}
