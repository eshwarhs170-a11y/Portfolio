import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CyberProfileImage({ src }: { src: string }) {
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
        boxShadow: '0 20px 50px rgba(0,0,0,0.9), inset 0 0 0 2px rgba(239,68,68,0.5), 0 0 40px rgba(239,68,68,0.2)',
        background: '#05070c',
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

      {/* 2. LED / Dot Matrix Overlay (gives it the "made of dots" look while keeping it 100% recognizable) */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundSize: '4px 4px',
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.55) 1.5px, transparent 1.5px)',
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
          backgroundImage: 'linear-gradient(to bottom, transparent, transparent 50%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.25))',
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
          background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.85) 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* 6. Continuous Scanning Laser */}
      <motion.div 
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent, rgba(239,68,68,0.1) 40%, rgba(239,68,68,0.6) 95%, rgba(255,255,255,0.9) 100%)',
          borderBottom: '2px solid #ff4444',
          boxShadow: '0 15px 30px rgba(239,68,68,0.5)',
          zIndex: 6,
          pointerEvents: 'none',
        }}
      />

      {/* 7. Cyberpunk UI Overlays (Framing and Data) */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
        <div style={{ width: 40, height: 40, borderTop: '3px solid #ef4444', borderLeft: '3px solid #ef4444', filter: 'drop-shadow(0 0 6px #ef4444)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10 }}>
        <div style={{ width: 40, height: 40, borderBottom: '3px solid #ef4444', borderRight: '3px solid #ef4444', filter: 'drop-shadow(0 0 6px #ef4444)' }} />
      </div>
      
      {/* Top Right System Text */}
      <div style={{ position: 'absolute', top: 28, right: 28, zIndex: 10, textAlign: 'right' }}>
        <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '3px', textShadow: '0 0 8px rgba(239,68,68,0.8)' }}>SYS.OP.001</div>
        <motion.div 
          animate={{ opacity: [1, 0, 1] }} 
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: '#fff', fontSize: '0.65rem', fontFamily: 'monospace', marginTop: '6px', letterSpacing: '1px' }}
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
              style={{ width: '4px', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }}
            />
          ))}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem', fontFamily: 'monospace', letterSpacing: '2px' }}>
          BIOMETRIC SCAN: <span style={{ color: '#4ade80', fontWeight: 'bold' }}>MATCH</span>
        </div>
      </div>
    </motion.div>
  );
}
