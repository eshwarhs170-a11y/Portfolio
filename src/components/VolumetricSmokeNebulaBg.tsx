import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * VolumetricSmokeNebulaBg
 * Moving volumetric smoke & fog nebula tuned for both Dark & Light modes.
 * - Dark mode: Silky deep purple (#8b5cf6), indigo (#6366f1), and royal blue (#3b82f6) over #070913
 * - Light mode: Vibrant sky blue (#0284c7), electric sapphire (#2563eb), and lavender violet (#7c3aed)
 *   rendered with multiply blend-weight over clean slate (#f1f5f9) so it is vividly visible.
 */

interface SmokeVortex {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  colorDark: [number, number, number];
  colorLight: [number, number, number];
  alphaDark: number;
  alphaLight: number;
  scaleOsc: number;
  phase: number;
}

export default function VolumetricSmokeNebulaBg() {
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

    // Volumetric cloud vortices with tailored palettes for dark and light modes
    const vortices: SmokeVortex[] = [
      { x: 0.18, y: 0.35, radius: 0.44, vx: 0.0003, vy: 0.0002, colorDark: [139, 92, 246], colorLight: [79, 70, 229], alphaDark: 0.42, alphaLight: 0.36, scaleOsc: 0.12, phase: 0 },
      { x: 0.82, y: 0.45, radius: 0.50, vx: -0.00025, vy: 0.00035, colorDark: [99, 102, 241], colorLight: [2, 132, 199], alphaDark: 0.45, alphaLight: 0.38, scaleOsc: 0.15, phase: 1.2 },
      { x: 0.45, y: 0.78, radius: 0.54, vx: 0.0002, vy: -0.0003, colorDark: [168, 85, 247], colorLight: [124, 58, 237], alphaDark: 0.38, alphaLight: 0.32, scaleOsc: 0.10, phase: 2.5 },
      { x: 0.30, y: 0.65, radius: 0.40, vx: -0.00018, vy: -0.0002, colorDark: [59, 130, 246], colorLight: [14, 165, 233], alphaDark: 0.35, alphaLight: 0.34, scaleOsc: 0.14, phase: 3.8 },
      { x: 0.70, y: 0.25, radius: 0.42, vx: 0.00035, vy: 0.00015, colorDark: [192, 132, 252], colorLight: [99, 102, 241], alphaDark: 0.32, alphaLight: 0.30, scaleOsc: 0.08, phase: 4.6 },
      { x: 0.52, y: 0.48, radius: 0.48, vx: -0.0002, vy: 0.00025, colorDark: [124, 58, 237], colorLight: [37, 99, 235], alphaDark: 0.40, alphaLight: 0.35, scaleOsc: 0.11, phase: 5.4 },
    ];

    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.008;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, w, h);

      // ── Layer 1: Base Fill ──
      ctx.fillStyle = isLight ? '#f1f5f9' : '#070913';
      ctx.fillRect(0, 0, w, h);

      // ── Layer 2: Moving Volumetric Smoke Clouds ──
      vortices.forEach((v) => {
        const currentX =
          ((v.x + Math.sin(time * 0.6 + v.phase) * 0.08 + (v.vx * time * 200)) % 1 + 1) % 1 * w;
        const currentY =
          ((v.y + Math.cos(time * 0.5 + v.phase * 1.3) * 0.08 + (v.vy * time * 200)) % 1 + 1) % 1 * h;

        // Interactive mouse dispersion
        let offsetX = 0;
        let offsetY = 0;
        if (mouse.x > -500) {
          const mdx = currentX - mouse.x;
          const mdy = currentY - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 320) {
            const push = (1 - mDist / 320) * 45;
            offsetX = (mdx / mDist) * push;
            offsetY = (mdy / mDist) * push;
          }
        }

        const px = currentX + offsetX;
        const py = currentY + offsetY;

        const scale = 1 + Math.sin(time * 1.2 + v.phase) * v.scaleOsc;
        const r = Math.max(w, h) * v.radius * scale;

        const grad = ctx.createRadialGradient(px, py, 10, px, py, r);
        const [red, green, blue] = isLight ? v.colorLight : v.colorDark;
        const alpha = isLight ? v.alphaLight : v.alphaDark;

        grad.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${alpha * 0.9})`);
        grad.addColorStop(0.25, `rgba(${red}, ${green}, ${blue}, ${alpha * 0.65})`);
        grad.addColorStop(0.55, `rgba(${red}, ${green}, ${blue}, ${alpha * 0.28})`);
        grad.addColorStop(0.85, `rgba(${red}, ${green}, ${blue}, ${alpha * 0.06})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // ── Layer 3: Organic Swirling Smoke Waves ──
      for (let s = 0; s < 5; s++) {
        const strandY = (h * (0.2 + s * 0.16)) + Math.sin(time * 0.8 + s) * 35;
        const grad = ctx.createLinearGradient(0, strandY - 90, 0, strandY + 90);
        const colAlpha = (0.08 + Math.sin(time + s) * 0.035) * (isLight ? 1.4 : 1);

        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.5, s % 2 === 0
          ? (isLight ? `rgba(99, 102, 241, ${colAlpha})` : `rgba(139, 92, 246, ${colAlpha})`)
          : (isLight ? `rgba(2, 132, 199, ${colAlpha})` : `rgba(99, 102, 241, ${colAlpha})`));
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, strandY - 90, w, 180);
      }

      // ── Layer 4: Vignette to soften edges ──
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, Math.max(w, h) * 0.85);
      vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vig.addColorStop(1, isLight ? 'rgba(241, 245, 249, 0.72)' : 'rgba(4, 7, 15, 0.75)');
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
        borderRadius: 'inherit',
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
