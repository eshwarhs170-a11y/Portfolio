import { useEffect, useRef } from 'react';

interface Props {
  visible: boolean;
}

export default function CyberVortexCanvas({ visible }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const opacityRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // ── CIRCUIT GRID (faint background) ──────────
    const drawCircuitGrid = (W: number, H: number, colorShift: number) => {
      ctx.save();
      const startX = W * 0.1;
      const cellW = W * 0.07;
      const cellH = H * 0.09;

      ctx.strokeStyle = `hsla(${40 + colorShift}, 80%, 50%, 0.05)`;
      ctx.lineWidth = 0.5;
      ctx.shadowBlur = 0;

      for (let x = startX; x < W + cellW; x += cellW) {
        for (let y = -cellH; y < H + cellH; y += cellH) {
          if (Math.sin(x * 0.05 + y * 0.03) > -0.4) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellW * (0.4 + Math.abs(Math.sin(x + y)) * 0.5), y);
            ctx.stroke();
          }
          if (Math.cos(x * 0.04 + y * 0.07) > -0.3) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cellH * (0.3 + Math.abs(Math.cos(x * 0.1 + y)) * 0.6));
            ctx.stroke();
          }
          if (Math.random() < 0.015) {
            ctx.fillStyle = `hsla(${40 + colorShift}, 80%, 50%, 0.15)`;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();
    };

    // ── CENTRAL TECH HUB ───────────────────────────────────────────────────
    const drawHub = (cx: number, cy: number, t: number, W: number, H: number, hue1: number, hue2: number) => {
      const baseR = Math.min(W, H) * 0.06;
      ctx.save();

      for (let r = baseR * 3.5; r > 0; r -= baseR * 0.3) {
        const alpha = 0.02 + (1 - r / (baseR * 3.5)) * 0.05;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grd.addColorStop(0, `hsla(${hue1}, 100%, 70%, ${alpha})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      const ringCount = 5;
      for (let i = ringCount; i >= 1; i--) {
        const r = baseR * (i * 0.4);
        const alpha = 0.15 + (ringCount - i) * 0.1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue1}, 90%, 75%, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${hue1}, 100%, 60%, 0.5)`;
        ctx.stroke();
      }

      const spokeCount = 12;
      for (let s = 0; s < spokeCount; s++) {
        const angle = (s / spokeCount) * Math.PI * 2 + t * 0.15; // Slowed rotation
        const inner = baseR * 0.35;
        const outer = baseR * 1.2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.strokeStyle = `hsla(${hue1}, 80%, 75%, ${0.2 + 0.1 * Math.sin(t + s)})`;
        ctx.lineWidth = 0.6;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `hsla(${hue1}, 100%, 60%, 0.4)`;
        ctx.stroke();
      }

      for (let s = 0; s < 4; s++) {
        const angle = (s / 4) * Math.PI * 2 - t * 0.08; // Slowed rotation
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * baseR * 0.5, cy + Math.sin(angle) * baseR * 0.5);
        ctx.lineTo(cx + Math.cos(angle) * baseR * 1.8, cy + Math.sin(angle) * baseR * 1.8);
        ctx.strokeStyle = `hsla(${hue1}, 90%, 85%, 0.3)`;
        ctx.lineWidth = 0.8;
        ctx.shadowBlur = 10;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 0.85, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue2}, 90%, 60%, ${0.25 + 0.1 * Math.sin(t * 1.5)})`;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsla(${hue2}, 100%, 50%, 0.5)`;
      ctx.stroke();

      const coreGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 0.5);
      coreGrd.addColorStop(0,   `rgba(255,255,255,${0.9 + 0.1 * Math.sin(t * 2)})`);
      coreGrd.addColorStop(0.3, `hsla(${hue1}, 90%, 70%, 0.6)`);
      coreGrd.addColorStop(0.7, `hsla(${hue1}, 90%, 50%, 0.2)`);
      coreGrd.addColorStop(1,   'transparent');
      ctx.fillStyle = coreGrd;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsla(${hue1}, 100%, 70%, 0.8)`;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // ── STREAMLINES ────────────────────────────────────────────────────────
    const drawStreamlines = (
      cx: number, cy: number,
      W: number, H: number,
      t: number, hue1: number, hue2: number
    ) => {
      const LINES = 160; // Increased to cover more area

      for (let i = 0; i < LINES; i++) {
        const isPrimary = i < 100;

        let startAngle: number;
        if (isPrimary) {
          startAngle = (Math.PI * 0.5) + (i / 75) * Math.PI * 1.5 + t * 0.03; // Much slower rotation
        } else {
          startAngle = (-Math.PI * 0.3) + ((i - 75) / 45) * Math.PI * 0.9 + t * 0.02; // Much slower rotation
        }

        const startR = Math.max(W, H) * (0.5 + Math.random() * 0.4); // Start much further out to cover corners
        let x = cx + Math.cos(startAngle) * startR;
        let y = cy + Math.sin(startAngle) * startR;

        ctx.beginPath();
        ctx.moveTo(x, y);

        const stopRadius = Math.min(W, H) * 0.06;

        for (let step = 0; step < 350; step++) { // Increased steps to reach from far edges
          const dx = cx - x;
          const dy = cy - y;
          const r  = Math.sqrt(dx * dx + dy * dy) + 0.1;

          if (r < stopRadius) break;
          if (x < -10 || x > W + 10 || y < -10 || y > H + 10) break;

          const rx = dx / r;
          const ry = dy / r;

          const sign = isPrimary ? 1 : -1;
          const tx =  ry * sign;
          const ty = -rx * sign;

          // Added sine wave wobble to the path for more "attractive animation"
          const wobble = Math.sin(r * 0.05 - t * 2) * 0.5;

          const tightness = Math.min(1, r / (Math.min(W, H) * 0.25));
          const tangStrength = 2.5 * tightness;
          const radStrength  = 1.0 + (1 - tightness) * 3.0;

          const speed = 1.2 + r / (Math.min(W, H) * 0.5);
          const vx = (tx * tangStrength + rx * radStrength + ty * wobble) * speed / (tangStrength + radStrength);
          const vy = (ty * tangStrength + ry * radStrength - tx * wobble) * speed / (tangStrength + radStrength);

          x += vx;
          y += vy;
          ctx.lineTo(x, y);
        }

        const finalDist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const proximity = 1 - Math.min(finalDist / (Math.min(W, H) * 0.4), 1);
        const baseAlpha = 0.12 + Math.random() * 0.3;
        const alpha = baseAlpha + proximity * 0.25;

        if (isPrimary) {
          const lum = 55 + Math.random() * 25;
          ctx.strokeStyle = `hsla(${hue1 + Math.sin(i)*15}, 90%, ${lum}%, ${alpha})`;
          ctx.shadowColor = `hsla(${hue1}, 100%, 65%, 0.5)`;
        } else {
          const lum = 55 + Math.random() * 25;
          ctx.strokeStyle = `hsla(${hue2 + Math.cos(i)*15}, 90%, ${lum}%, ${alpha})`;
          ctx.shadowColor = `hsla(${hue2}, 100%, 60%, 0.4)`;
        }

        ctx.lineWidth   = 0.5 + Math.random() * 1.5;
        ctx.shadowBlur  = 8 + proximity * 12;
        ctx.stroke();
      }
    };

    const draw = () => {
      const W  = canvas.width;
      const H  = canvas.height;
      time += 0.0012; // Extremely slow overall animation time step

      // Smooth opacity fade
      const target = visible ? 1 : 0;
      opacityRef.current += (target - opacityRef.current) * 0.03;
      canvas.style.opacity = String(opacityRef.current);

      if (opacityRef.current < 0.01) {
        animId = requestAnimationFrame(draw);
        return; // Don't draw if invisible
      }

      // Dynamic colors over time (slowed down)
      const hue1 = (180 + time * 3) % 360; // Base starts cyan, slowly shifts
      const hue2 = (hue1 + 160) % 360;      // Secondary is roughly opposite

      const cx = W * 0.5; // Center it for full screen
      const cy = H * 0.5;

      ctx.fillStyle = 'rgba(2, 6, 12, 0.25)'; // Darker, cleaner trail
      ctx.fillRect(0, 0, W, H);

      drawCircuitGrid(W, H, time * 15);
      drawStreamlines(cx, cy, W, H, time, hue1, hue2);
      drawHub(cx, cy, time, W, H, hue1, hue2);

      animId = requestAnimationFrame(draw);
    };

    ctx.fillStyle = '#010308';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0, // Handled by ref
      }}
    />
  );
}
