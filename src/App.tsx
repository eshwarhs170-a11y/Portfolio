import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Background3D from './components/Background3D';
import CinematicIntro from './components/CinematicIntro';
import LandingPage from './components/LandingPage';
import PortfolioPage from './components/PortfolioPage';
import './App.css';

type Stage = 'intro' | 'landing' | 'portfolio';

function App() {
  const [stage, setStage] = useState<Stage>('intro');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playedRef = useRef(false);

  // Try to play on first ANY interaction
  const tryPlay = useCallback(() => {
    if (playedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    playedRef.current = true;
    audio.play().catch(() => {});
    window.removeEventListener('click', tryPlay);
    window.removeEventListener('keydown', tryPlay);
    window.removeEventListener('touchstart', tryPlay);
    window.removeEventListener('mousemove', tryPlay);
  }, []);

  useEffect(() => {
    const audio = new Audio('/theme2.mp3');
    audio.volume = 0.55;
    audio.loop = true;
    audioRef.current = audio;

    window.addEventListener('click', tryPlay);
    window.addEventListener('keydown', tryPlay);
    window.addEventListener('touchstart', tryPlay);
    window.addEventListener('mousemove', tryPlay);

    const fadeOut = () => {
      if (!audio) return;
      const fade = setInterval(() => {
        if (audio.volume > 0.04) {
          audio.volume = Math.max(0, audio.volume - 0.04);
        } else {
          audio.pause();
          clearInterval(fade);
        }
      }, 80);
    };
    window.addEventListener('force-fade-music', fadeOut);

    return () => {
      window.removeEventListener('click', tryPlay);
      window.removeEventListener('keydown', tryPlay);
      window.removeEventListener('touchstart', tryPlay);
      window.removeEventListener('mousemove', tryPlay);
      window.removeEventListener('force-fade-music', fadeOut);
      audio.pause();
    };
  }, [tryPlay]);

  // Fade out music when entering portfolio
  const enterPortfolio = useCallback(() => {
    window.dispatchEvent(new Event('force-fade-music'));
    setStage('portfolio');
  }, []);

  return (
    <ThemeProvider>
      <div style={{ width: '100vw', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
        <Background3D />
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <CinematicIntro key="intro" onComplete={() => setStage('landing')} />
          )}
          {stage === 'landing' && (
            <LandingPage key="landing" onEnter={enterPortfolio} />
          )}
          {stage === 'portfolio' && (
            <PortfolioPage key="portfolio" />
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}

export default App;
