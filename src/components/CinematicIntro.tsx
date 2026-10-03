import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

// Our unique cinematic intro: a redacted classified file being "declassified" 
export default function CinematicIntro({ onComplete }: Props) {
  const [step, setStep] = useState(0);

  // Sequence of dramatic lines that build tension
  const lines = [
    { text: "CLASSIFIED", className: "intro-classified" },
    { text: "CASE FILE ACCESSED", className: "intro-label" },
    { text: "DECRYPTING...", className: "intro-label" },
  ];

  useEffect(() => {
    const timers: number[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), (i + 1) * 900));
    });
    // Trigger final fade-out and hand off control
    timers.push(setTimeout(onComplete, lines.length * 900 + 1000));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="cinematic-intro"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      <div className="intro-content">
        {lines.map((line, i) => (
          <AnimatePresence key={i}>
            {step > i && (
              <motion.div
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, letterSpacing: line.className === 'intro-classified' ? '0.3em' : '0.15em' }}
                className={line.className}
                transition={{ duration: 0.6 }}
              >
                {line.text}
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {step >= lines.length && (
          <motion.div
            className="intro-bar-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="intro-bar"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
