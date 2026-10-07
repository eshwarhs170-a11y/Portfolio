import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Day Shift' : 'Switch to Night Ops'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 14px 6px 6px',
        background: isDark ? 'rgba(10, 14, 23, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '30px',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        boxShadow: isDark 
          ? '0 0 10px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.05)' 
          : '0 2px 10px rgba(0,0,0,0.05), inset 0 2px 4px rgba(255,255,255,0.5)',
        position: 'relative',
        overflow: 'hidden',
        outline: 'none'
      }}
      whileHover={{ scale: 1.05, boxShadow: isDark ? '0 0 15px rgba(239, 68, 68, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.95 }}
    >
      <div style={{
        width: '44px',
        height: '24px',
        background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.08)',
        borderRadius: '20px',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
      }}>
        <motion.div
          animate={{ x: isDark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            position: 'absolute',
            top: '2px',
            left: '0px',
            width: '20px',
            height: '20px',
            background: isDark ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'linear-gradient(135deg, #fff, #f0f0f0)',
            borderRadius: '50%',
            boxShadow: isDark ? '0 2px 5px rgba(239, 68, 68, 0.5)' : '0 2px 5px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isDark ? <Moon size={10} color="#fff" /> : <Sun size={10} color="#f59e0b" />}
        </motion.div>
      </div>

      <div style={{ position: 'relative', height: '20px', width: '80px', display: 'flex', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="dark"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                left: 0,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '1px',
                color: '#cbd5e1',
                whiteSpace: 'nowrap'
              }}
            >
              NIGHT OPS
            </motion.span>
          ) : (
            <motion.span
              key="light"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                left: 0,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '1px',
                color: '#2d2d3a',
                whiteSpace: 'nowrap'
              }}
            >
              DAY SHIFT
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
