import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function CyberProfileImage({ src }: { src: string }) {
  const { theme } = useTheme();
  const [glitching, setGlitching] = useState(false);

  // Random glitch effect trigger
  useEffect(() => {
    let timeoutId: number;
    
    const triggerGlitch = () => {
      setGlitching(true);
      // Glitch lasts 150 - 400ms
      setTimeout(() => setGlitching(false), 150 + Math.random() * 250); 
      
      // Schedule next glitch in 2 to 6 seconds
      timeoutId = window.setTimeout(triggerGlitch, 2000 + Math.random() * 4000);
    };
    
    const initialTimer = window.setTimeout(triggerGlitch, 1500);
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <motion.div 
      style={{
        width: '360px',
        height: '480px',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: theme === 'light' 
          ? '0 20px 50px rgba(0,0,0,0.2), inset 0 0 0 2px rgba(59,130,246,0.6), 0 0 40px rgba(59,130,246,0.3)'
          : '0 20px 50px rgba(0,0,0,0.9), inset 0 0 0 2px rgba(239,68,68,0.5), 0 0 40px rgba(239,68,68,0.2)',
        background: theme === 'light' ? '#f8fafc' : '#05070c',
      }}
      initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.9 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* 1. The Base Image - perfectly clear but filtered to look cinematic */}
      <img 
        src={src} 
        alt="Profile"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          filter: 'contrast(1.15) brightness(0.9) grayscale(0.1)',
        }}
      />

      {/* 2. Tech Grid / Dot Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundSize: theme === 'light' ? '20px 20px' : '4px 4px',
          backgroundImage: theme === 'light' 
            ? 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)' 
            : 'radial-gradient(circle, rgba(0,0,0,0.55) 1.5px, transparent 1.5px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      
      {/* 3. Scanlines */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundSize: '100% 4px',
          backgroundImage: theme === 'light' 
            ? 'linear-gradient(to bottom, transparent, transparent 50%, rgba(59,130,246,0.08) 50%, rgba(59,130,246,0.08))' 
            : 'linear-gradient(to bottom, transparent, transparent 50%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.25))',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* 4. Chromatic Aberration / Holographic Glitch Layer (Activates randomly) */}
      <AnimatePresence>
        {glitching && (
          <>
            {/* Red Channel Shift */}
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 0.8, x: -12 }}
              exit={{ opacity: 0, x: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mixBlendMode: 'screen',
                filter: 'sepia(1) hue-rotate(-50deg) saturate(4) brightness(1.1)', 
                zIndex: 3,
                pointerEvents: 'none',
              }}
            />
            {/* Cyan Channel Shift */}
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 0.8, x: 12 }}
              exit={{ opacity: 0, x: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mixBlendMode: 'screen',
                filter: 'sepia(1) hue-rotate(150deg) saturate(4) brightness(1.1)', 
                zIndex: 3,
                pointerEvents: 'none',
              }}
            />
            {/* Horizontal Static Noise block during glitch */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: `${Math.random() * 80}%`,
                left: 0,
                right: 0,
                height: `${20 + Math.random() * 60}px`,
                background: 'rgba(255,255,255,0.9)',
                mixBlendMode: 'overlay',
                zIndex: 4,
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* 5. Ambient Vignette - Darkens edges to focus on face */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: theme === 'light' ? 'radial-gradient(circle at center, transparent 30%, rgba(255,255,255,0.7) 100%)' : 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.85) 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* 6. Rotating Aurora Halo — spins a conic gradient around the full image */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '26px',
          background: theme === 'light' 
            ? 'conic-gradient(from 0deg, transparent 0deg, rgba(59,130,246,0.9) 60deg, rgba(14,165,233,0.8) 100deg, rgba(59,130,246,0.9) 140deg, transparent 200deg, rgba(59,130,246,0.5) 280deg, transparent 360deg)'
            : 'conic-gradient(from 0deg, transparent 0deg, rgba(239,68,68,0.9) 60deg, rgba(251,191,36,0.8) 100deg, rgba(239,68,68,0.9) 140deg, transparent 200deg, rgba(239,68,68,0.5) 280deg, transparent 360deg)',
          zIndex: 6,
          pointerEvents: 'none',
          maskImage: 'radial-gradient(circle, transparent 85%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 85%, black 100%)',
          filter: 'blur(2px)',
        }}
      />

      {/* 6b. Inner breathing glow pulse */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.02, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '24px',
          background: theme === 'light' ? 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.25) 0%, transparent 60%)' : 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.25) 0%, transparent 60%)',
          zIndex: 6,
          pointerEvents: 'none',
        }}
      />

      {/* 7. Cyberpunk UI Overlays (Framing and Data) */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
        <div style={{ width: 40, height: 40, borderTop: theme === 'light' ? '3px solid #3b82f6' : '3px solid #ef4444', borderLeft: theme === 'light' ? '3px solid #3b82f6' : '3px solid #ef4444', filter: theme === 'light' ? 'drop-shadow(0 0 6px #3b82f6)' : 'drop-shadow(0 0 6px #ef4444)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10 }}>
        <div style={{ width: 40, height: 40, borderBottom: theme === 'light' ? '3px solid #3b82f6' : '3px solid #ef4444', borderRight: theme === 'light' ? '3px solid #3b82f6' : '3px solid #ef4444', filter: theme === 'light' ? 'drop-shadow(0 0 6px #3b82f6)' : 'drop-shadow(0 0 6px #ef4444)' }} />
      </div>
      
      {/* Top Right System Text */}
      <div style={{ position: 'absolute', top: 28, right: 28, zIndex: 10, textAlign: 'right' }}>
        <div style={{ color: theme === 'light' ? '#3b82f6' : '#ef4444', fontSize: '0.8rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '3px', textShadow: theme === 'light' ? '0 0 8px rgba(59,130,246,0.8)' : '0 0 8px rgba(239,68,68,0.8)' }}>SYS.OP.001</div>
        <motion.div 
          animate={{ opacity: [1, 0, 1] }} 
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: theme === 'light' ? '#64748b' : '#fff', fontSize: '0.65rem', fontFamily: 'monospace', marginTop: '6px', letterSpacing: '1px' }}
        >
          [ LIVE FEED ]
        </motion.div>
      </div>

      {/* Bottom Left Biometric Data */}
      <div style={{ position: 'absolute', bottom: 28, left: 28, zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', alignItems: 'flex-end', height: '20px' }}>
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ height: [`${30 + Math.random() * 20}%`, `${60 + Math.random() * 40}%`, `${30 + Math.random() * 20}%`] }}
              transition={{ duration: 0.4 + Math.random() * 0.5, repeat: Infinity }}
              style={{ width: '4px', background: theme === 'light' ? '#3b82f6' : '#ef4444', boxShadow: theme === 'light' ? '0 0 6px #3b82f6' : '0 0 6px #ef4444' }}
            />
          ))}
        </div>
        <div style={{ color: theme === 'light' ? '#475569' : 'rgba(255,255,255,0.7)', fontSize: '0.6rem', fontFamily: 'monospace', letterSpacing: '2px' }}>
          BIOMETRIC SCAN: <span style={{ color: '#10b981', fontWeight: 'bold' }}>MATCH</span>
        </div>
      </div>
    </motion.div>
  );
}
