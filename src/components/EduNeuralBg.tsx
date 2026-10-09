import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#a855f7'];

export default function EduNeuralBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let nodes: Node[] = [];
    let initialized = false;

    const init = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w < 10 || h < 10) return false;
      canvas.width = w;
      canvas.height = h;

      nodes = [];
      for (let i = 0; i < 55; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2.5 + 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
      return true;
    };

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w < 10 || h < 10) return;
      canvas.width = w;
      canvas.height = h;
      // Clamp existing nodes inside new bounds
      nodes.forEach(n => {
        n.x = Math.min(n.x, w);
        n.y = Math.min(n.y, h);
      });
    };

    window.addEventListener('resize', resize);

    const draw = () => {
      animId = requestAnimationFrame(draw);

      // Lazy init — wait until canvas has real dimensions
      if (!initialized) {
        initialized = init();
        if (!initialized) return;
      }

      const w = canvas.width;
      const h = canvas.height;
      if (w < 1 || h < 1) return;

      ctx.clearRect(0, 0, w, h);

      // Move nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));
      });

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;
          if (dist < maxDist && dist > 0.1) {
            const alpha = (1 - dist / maxDist) * 0.3;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // Traveling pulse dot along the line
            const t = (Math.sin(Date.now() * 0.0012 + i * 0.7) + 1) / 2;
            const px = a.x + (b.x - a.x) * t;
            const py = a.y + (b.y - a.y) * t;
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha * 2.5})`;
            ctx.fill();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const brightness = 0.6 + 0.4 * Math.sin(n.pulse);
        const r = n.radius * 8;

        // Outer glow
        try {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
          grd.addColorStop(0, n.color + '44');
          grd.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        } catch { /* skip if gradient fails */ }

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * brightness, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = n.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.5,
      }}
    />
  );
}
