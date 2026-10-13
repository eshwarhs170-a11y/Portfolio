import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function CyberProfileImage({ src }: { src: string }) {
  const { theme } = useTheme();

  return (
    <motion.div 
      style={{
        width: '360px',
        height: '480px',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: theme === 'light' 
          ? '0 20px 50px rgba(0,0,0,0.12), inset 0 0 0 2px rgba(59,130,246,0.5), 0 0 30px rgba(59,130,246,0.15)'
          : '0 20px 50px rgba(0,0,0,0.8), inset 0 0 0 2px rgba(239,68,68,0.45), 0 0 30px rgba(239,68,68,0.15)',
        background: theme === 'light' ? '#f8fafc' : '#05070c',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* 1. Clear, high-fidelity profile photo */}
      <img 
        src={src} 
        alt="Eshwar H S - Full-Stack Developer"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* 2. Subtle bottom gradient for readability */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: theme === 'light' 
            ? 'linear-gradient(to top, rgba(255,255,255,0.7) 0%, transparent 40%)' 
            : 'linear-gradient(to top, rgba(5,8,16,0.85) 0%, transparent 40%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* 3. Sleek border framing corners */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <div style={{ width: 28, height: 28, borderTop: theme === 'light' ? '2.5px solid #3b82f6' : '2.5px solid #ef4444', borderLeft: theme === 'light' ? '2.5px solid #3b82f6' : '2.5px solid #ef4444', filter: theme === 'light' ? 'drop-shadow(0 0 4px #3b82f6)' : 'drop-shadow(0 0 4px #ef4444)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10 }}>
        <div style={{ width: 28, height: 28, borderBottom: theme === 'light' ? '2.5px solid #3b82f6' : '2.5px solid #ef4444', borderRight: theme === 'light' ? '2.5px solid #3b82f6' : '2.5px solid #ef4444', filter: theme === 'light' ? 'drop-shadow(0 0 4px #3b82f6)' : 'drop-shadow(0 0 4px #ef4444)' }} />
      </div>

      {/* 4. Top Right Dev Badge */}
      <div style={{ position: 'absolute', top: 22, right: 22, zIndex: 10, textAlign: 'right' }}>
        <div style={{ color: theme === 'light' ? '#2563eb' : '#ef4444', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '2px', textShadow: theme === 'light' ? '0 0 6px rgba(59,130,246,0.6)' : '0 0 6px rgba(239,68,68,0.6)' }}>
          ENG &bull; 2026
        </div>
      </div>

      {/* 5. Bottom Info Tag */}
      <div style={{ position: 'absolute', bottom: 22, left: 22, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ color: theme === 'light' ? '#0f172a' : '#fff', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px' }}>
            ESHWAR H S
          </span>
        </div>
        <div style={{ color: theme === 'light' ? '#475569' : '#94a3b8', fontSize: '0.65rem', fontFamily: 'monospace', marginTop: '4px', letterSpacing: '1px' }}>
          FULL-STACK &bull; PROBLEM SOLVING
        </div>
      </div>
    </motion.div>
  );
}
