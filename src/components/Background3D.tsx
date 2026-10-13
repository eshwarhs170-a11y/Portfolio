import { useTheme } from '../context/ThemeContext';

export default function Background3D() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: isLight
          ? 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.08) 0%, rgba(248, 250, 252, 0.6) 60%, #e8eaf0 100%)'
          : 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(239, 68, 68, 0.07) 0%, rgba(10, 14, 26, 0.7) 60%, #04060b 100%)',
        transition: 'background 0.5s ease',
      }}
    />
  );
}
