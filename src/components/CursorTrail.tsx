import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const DOT_COUNT = 6;
const LERP_SPEEDS = [0.28, 0.22, 0.17, 0.13, 0.10, 0.07]; // each dot is slightly slower

interface Dot {
  x: number;
  y: number;
  el: HTMLDivElement;
}

export default function CursorTrail() {
  const { theme } = useTheme();
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Build dots once on mount
  useEffect(() => {
    const container = document.createElement('div');
    container.style.cssText =
      'position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;z-index:99999;';
    document.body.appendChild(container);
    containerRef.current = container;

    const dots: Dot[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const el = document.createElement('div');
      const size = 10 - i * 1.2; // shrink each dot
      el.style.cssText = `
        position:fixed;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        pointer-events:none;
        transform:translate(-50%,-50%);
        transition:background 0.4s ease;
        will-change:transform;
        opacity:${1 - i * 0.12};
      `;
      container.appendChild(el);
      dots.push({ x: -200, y: -200, el });
    }
    dotsRef.current = dots;

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  // Update dot colors whenever theme changes
  useEffect(() => {
    const color = theme === 'dark' ? '#ef4444' : '#3b82f6';
    dotsRef.current.forEach((dot) => {
      dot.el.style.background = color;
      dot.el.style.boxShadow = `0 0 6px 2px ${color}88`;
    });
  }, [theme]);

  // Track mouse position
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const dots = dotsRef.current;
      let prevX = mouseRef.current.x;
      let prevY = mouseRef.current.y;

      dots.forEach((dot, i) => {
        const speed = LERP_SPEEDS[i];
        dot.x += (prevX - dot.x) * speed;
        dot.y += (prevY - dot.y) * speed;
        dot.el.style.left = `${dot.x}px`;
        dot.el.style.top = `${dot.y}px`;
        prevX = dot.x;
        prevY = dot.y;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // This component renders nothing into the React tree; all DOM is imperative
  return null;
}
