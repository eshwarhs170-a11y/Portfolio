import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onSkip: () => void;
}

const NAME_LETTERS = "ESHWAR H S".split("");

export default function CinematicIntro({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Sequence timers
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Step 1: CLASSIFIED
    timers.push(setTimeout(() => setStep(1), 250));
    // Step 2: CASE FILE ACCESSED
    timers.push(setTimeout(() => setStep(2), 1050));
    // Step 3: SUBJECT: ESHWAR H S (redaction reveal)
    timers.push(setTimeout(() => setStep(3), 1850));
    // Step 4: DECRYPTING...
    timers.push(setTimeout(() => setStep(4), 2650));
    // Step 5: Transition to landing
    timers.push(setTimeout(onComplete, 3850));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Live decryption percentage counter during step 4
  useEffect(() => {
    if (step < 4) return;
    const duration = 850;
    const startTime = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setDecryptProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [step]);

  // Keyboard shortcut listener: Enter or Escape skips immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

  return (
    <motion.div
      className="cinematic-intro"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      <div className="intro-content">
        {/* Step 1: CLASSIFIED - clean, huge, atmospheric centered text like earlier */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              className="intro-classified"
              transition={{ duration: 0.6 }}
            >
              CLASSIFIED
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 2: CASE FILE ACCESSED */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, letterSpacing: '0.15em' }}
              className="intro-label"
              transition={{ duration: 0.5 }}
            >
              CASE FILE ACCESSED
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Extra - Redaction reveal for ESHWAR H S */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, letterSpacing: '0.15em' }}
              className="intro-subject"
              transition={{ duration: 0.5 }}
            >
              <span className="intro-subject-label">SUBJECT: </span>
              <span className="intro-name-wrap" aria-label="ESHWAR H S">
                {NAME_LETTERS.map((char, i) => (
                  <span key={i} className="intro-char-wrapper">
                    <span className="intro-char-text">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                    {char !== ' ' && (
                      <motion.span
                        className="intro-char-bar"
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{
                          delay: prefersReducedMotion ? 0 : 0.06 * i,
                          duration: prefersReducedMotion ? 0.15 : 0.3,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </span>
                ))}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: Extra - DECRYPTING... with live counter and progress bar */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="intro-decrypt-section"
            >
              <div className="intro-label">
                DECRYPTING... <span className="intro-pct">{decryptProgress}%</span>
              </div>
              <div className="intro-bar-container">
                <div
                  className="intro-bar"
                  style={{ width: `${decryptProgress}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SKIP INTRO BUTTON */}
      <motion.button
        type="button"
        className="intro-skip-btn"
        onClick={onSkip}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        aria-label="Skip Intro"
      >
        <span>SKIP INTRO</span>
        <span className="skip-arrow">→</span>
        <span className="skip-kbd">[ESC]</span>
      </motion.button>
    </motion.div>
  );
}
