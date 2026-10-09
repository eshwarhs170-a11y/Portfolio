import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CyberGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    
    // Mouse tracking for parallax
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Floating particles
    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 100,
      speed: Math.random() * 0.5 + 0.2,
      size: Math.random() * 2 + 1
    }));

    const draw = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      const isLight = theme === 'light';
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Mouse parallax offsets
      const px = (mouseX - cx) * 0.15;
      const py = (mouseY - cy) * 0.15;

      // --- 1. Draw Perspective Grid (Floor) ---
      ctx.beginPath();
      const horizonY = cy + 100 + py;
      
      // Vertical grid lines
      for (let i = -30; i <= 30; i++) {
        const topX = cx + (i * 40) - px * 0.5;
        const bottomX = cx + (i * 200) - px * 2;
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(bottomX, canvas.height);
      }

      // Horizontal grid lines (moving towards viewer)
      const speed = 20;
      const offset = (time * speed) % 10;
      for (let i = 0; i <= 25; i++) {
        const z = i * 10 - offset;
        if (z > 0) {
          const y = horizonY + Math.pow(z, 1.6) * 0.2;
          if (y < canvas.height) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
          }
        }
      }

      ctx.strokeStyle = isLight ? 'rgba(59, 130, 246, 0.12)' : 'rgba(239, 68, 68, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- 2. Draw Perspective Grid (Ceiling) ---
      ctx.beginPath();
      for (let i = -30; i <= 30; i++) {
        const topX = cx + (i * 40) - px * 0.5;
        const bottomX = cx + (i * 200) - px * 2;
        ctx.moveTo(topX, horizonY - 100);
        ctx.lineTo(bottomX, 0);
      }
      for (let i = 0; i <= 25; i++) {
        const z = i * 10 - offset;
        if (z > 0) {
          const y = (horizonY - 100) - Math.pow(z, 1.6) * 0.2;
          if (y > 0) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
          }
        }
      }
      ctx.strokeStyle = isLight ? 'rgba(59, 130, 246, 0.05)' : 'rgba(239, 68, 68, 0.05)';
      ctx.stroke();

      // --- 3. Floating 3D Data Particles ---
      particles.forEach(p => {
        p.y -= p.speed;
        p.x += Math.sin(time + p.z) * 0.5;
        
        // Wrap around
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        // Mouse dodge
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x += dx * 0.02;
          p.y += dy * 0.02;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? `rgba(14, 165, 233, ${0.4 + Math.sin(time * 3 + p.z) * 0.3})` : `rgba(239, 68, 68, ${0.4 + Math.sin(time * 3 + p.z) * 0.3})`;
        ctx.fill();
        
        // Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = isLight ? '#0ea5e9' : '#ef4444';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });
      ctx.shadowBlur = 0; // reset

      // --- 4. Horizon Glow Line ---
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(canvas.width, horizonY);
      ctx.strokeStyle = isLight ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, // Behind text but above deepest background
        pointerEvents: 'none'
      }}
    />
  );
}
