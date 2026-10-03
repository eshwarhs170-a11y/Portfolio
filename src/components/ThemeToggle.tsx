import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Day Shift' : 'Switch to Night Ops'}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
    >
      <div className="theme-toggle-track">
        <motion.div
          className="theme-toggle-thumb"
          animate={{ x: isDark ? 2 : 32 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>

      <div className="theme-toggle-labels">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="dark"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="theme-label"
            >
              <Moon size={12} /> NIGHT OPS
            </motion.span>
          ) : (
            <motion.span
              key="light"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="theme-label"
            >
              <Sun size={12} /> DAY SHIFT
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
