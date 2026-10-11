import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * AuroraPlasmaSmokeBg
 * Deep, atmospheric undulating plasma fog & aurora smoke waves.
 * Beautifully tuned for both Night Ops and Light mode:
 * - Night Ops: Billowing sapphire, deep violet, and crimson plasma smoke
 * - Light Mode: Luminous royal cobalt, sky cyan, and gentle lavender currents
 *   rendered richly over clean slate so it provides stunning depth in daylight.
 */

interface SmokeBlob {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  vx: number;
  vy: number;
  rgbDark: [number, number, number];
  rgbLight: [number, number, number];
  alphaDark: number;
  alphaLight: number;
  phase: number;
  oscSpeed: number;
}

export default function AuroraPlasmaSmokeBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener('resize', resize);

    const isLight = theme === 'light';

    // Tailored clusters for projects section
    const blobs: SmokeBlob[] = [
      { x: 0.15, y: 0.25, baseX: 0.15, baseY: 0.25, radius: 0.45, vx: 0.0003, vy: 0.0002, rgbDark: [239, 68, 68], rgbLight: [37, 99, 235], alphaDark: 0.22, alphaLight: 0.30, phase: 0, oscSpeed: 0.8 },
      { x: 0.85, y: 0.35, baseX: 0.85, baseY: 0.35, radius: 0.50, vx: -0.0002, vy: 0.0003, rgbDark: [147, 51, 234], rgbLight: [99, 102, 241], alphaDark: 0.25, alphaLight: 0.32, phase: 1.5, oscSpeed: 0.7 },
      { x: 0.50, y: 0.65, baseX: 0.50, baseY: 0.65, radius: 0.55, vx: 0.00025, vy: -0.0002, rgbDark: [37, 99, 235], rgbLight: [14, 165, 233], alphaDark: 0.24, alphaLight: 0.35, phase: 2.7, oscSpeed: 0.9 },
      { x: 0.20, y: 0.85, baseX: 0.20, baseY: 0.85, radius: 0.42, vx: -0.0003, vy: -0.00025, rgbDark: [220, 38, 38], rgbLight: [2, 132, 199], alphaDark: 0.18, alphaLight: 0.26, phase: 3.9, oscSpeed: 0.6 },
      { x: 0.78, y: 0.80, baseX: 0.78, baseY: 0.80, radius: 0.48, vx: 0.0002, vy: 0.00035, rgbDark: [126, 34, 206], rgbLight: [124, 58, 237], alphaDark: 0.20, alphaLight: 0.28, phase: 4.8, oscSpeed: 0.85 },
    ];

    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.01;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, w, h);

      // Base fill
      ctx.fillStyle = isLight ? '#f1f5f9' : 'rgba(3, 5, 14, 0.96)';
      ctx.fillRect(0, 0, w, h);

      // Render volumetric plasma blobs
      blobs.forEach((b) => {
        const driftX = Math.sin(time * b.oscSpeed + b.phase) * (w * 0.08);
        const driftY = Math.cos(time * (b.oscSpeed * 0.85) + b.phase * 1.3) * (h * 0.06);

        let currentX = b.baseX * w + driftX;
        let currentY = b.baseY * h + driftY;

        if (mouse.x > -500) {
          const mdx = currentX - mouse.x;
          const mdy = currentY - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 350) {
            const push = (1 - mDist / 350) * 50;
            currentX += (mdx / mDist) * push;
            currentY += (mdy / mDist) * push;
          }
        }

        const pulseScale = 1 + Math.sin(time * 1.2 + b.phase) * 0.12;
        const radius = Math.max(w, h) * b.radius * pulseScale;

        const grad = ctx.createRadialGradient(currentX, currentY, 15, currentX, currentY, radius);
        const [r, g, bl] = isLight ? b.rgbLight : b.rgbDark;
        const a = isLight ? b.alphaLight : b.alphaDark;

        grad.addColorStop(0, `rgba(${r}, ${g}, ${bl}, ${a * 0.9})`);
        grad.addColorStop(0.3, `rgba(${r}, ${g}, ${bl}, ${a * 0.6})`);
        grad.addColorStop(0.65, `rgba(${r}, ${g}, ${bl}, ${a * 0.22})`);
        grad.addColorStop(0.9, `rgba(${r}, ${g}, ${bl}, ${a * 0.04})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // Layer 2: Silky horizontal undulating smoke waves
      for (let s = 0; s < 4; s++) {
        const yBase = (h * (0.25 + s * 0.22)) + Math.sin(time * 0.6 + s * 1.5) * 45;
        const grad = ctx.createLinearGradient(0, yBase - 120, 0, yBase + 120);
        const waveAlpha = (0.05 + Math.sin(time * 0.8 + s) * 0.025) * (isLight ? 1.5 : 1);

        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.5, s % 2 === 0
          ? (isLight ? `rgba(99, 102, 241, ${waveAlpha})` : `rgba(147, 51, 234, ${waveAlpha})`)
          : (isLight ? `rgba(14, 165, 233, ${waveAlpha})` : `rgba(239, 68, 68, ${waveAlpha})`));
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, yBase - 120, w, 240);
      }

      // Edge Vignette
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, Math.max(w, h) * 0.85);
      vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vig.addColorStop(1, isLight ? 'rgba(241, 245, 249, 0.75)' : 'rgba(3, 5, 14, 0.75)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
