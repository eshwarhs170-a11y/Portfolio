import { useState } from 'react';
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

  return (
    <ThemeProvider>
      <div style={{ width: '100vw', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
        <Background3D />
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <CinematicIntro key="intro" onComplete={() => setStage('landing')} />
          )}
          {stage === 'landing' && (
            <LandingPage key="landing" onEnter={() => setStage('portfolio')} />
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
