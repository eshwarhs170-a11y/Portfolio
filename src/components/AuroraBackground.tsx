import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.003;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (theme === 'dark') {
        const blobs = [
          { x: 0.25, y: 0.3, r: 0.5, color: [180, 0, 0] },
          { x: 0.75, y: 0.6, r: 0.45, color: [120, 0, 80] },
          { x: 0.5, y: 0.8, r: 0.4, color: [80, 0, 120] },
          { x: 0.1, y: 0.7, r: 0.35, color: [150, 0, 30] },
        ];
        blobs.forEach((b, i) => {
          const ox = Math.sin(t + i * 1.3) * 0.1 * w;
          const oy = Math.cos(t * 0.8 + i * 0.9) * 0.08 * h;
          const grd = ctx.createRadialGradient(b.x * w + ox, b.y * h + oy, 0, b.x * w + ox, b.y * h + oy, b.r * Math.max(w, h));
          const pulse = 0.07 + 0.04 * Math.sin(t * 1.5 + i);
          grd.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${pulse})`);
          grd.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
        });
      } else {
        const blobs = [
          { x: 0.2, y: 0.3, r: 0.55, color: [59, 130, 246] },
          { x: 0.8, y: 0.5, r: 0.5, color: [99, 102, 241] },
          { x: 0.5, y: 0.9, r: 0.45, color: [14, 165, 233] },
          { x: 0.9, y: 0.2, r: 0.4, color: [139, 92, 246] },
        ];
        blobs.forEach((b, i) => {
          const ox = Math.sin(t + i * 1.3) * 0.12 * w;
          const oy = Math.cos(t * 0.8 + i * 0.9) * 0.1 * h;
          const grd = ctx.createRadialGradient(b.x * w + ox, b.y * h + oy, 0, b.x * w + ox, b.y * h + oy, b.r * Math.max(w, h));
          const pulse = 0.08 + 0.04 * Math.sin(t * 1.5 + i);
          grd.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${pulse})`);
          grd.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
        });
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
