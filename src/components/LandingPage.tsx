import { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onEnter: () => void;
}

const evidenceMarkers = [
  { id: 'A', top: '18%', left: '8%', duration: 2.8 },
  { id: 'B', top: '68%', left: '6%', duration: 3.4 },
  { id: 'C', top: '22%', right: '8%', duration: 3.1 },
  { id: 'D', top: '72%', right: '9%', duration: 2.6 },
  { id: 'E', top: '48%', left: '4%', duration: 3.8 },
];

const cluePhrases = [
  "Subject: Eshwar H S (2nd Year CSE @ UVCE)",
  "CGPA: 9.64 | Passionate about Full-Stack & Problem Solving",
  "Top Project: NammaUGNEET (1,200+ Aspirants)",
  "Featured: GramSetu Agricultural System",
  "Status: Open for Internships & Software Roles",
];

export default function LandingPage({ onEnter }: Props) {
  const { theme } = useTheme();
  const [typedText, setTypedText] = useState("");
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isTyping, setIsTyping] = useState(true);
  const [activePhraseIdx, setActivePhraseIdx] = useState(0);

  // Smooth spring motion for the spotlight glow
  const springX = useSpring(useMotionValue(window.innerWidth / 2), { stiffness: 80, damping: 20 });
  const springY = useSpring(useMotionValue(window.innerHeight / 2), { stiffness: 80, damping: 20 });

  const fullText = "Every problem leaves evidence.\nI try to find the solution.";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX);
      springY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [springX, springY]);

  useEffect(() => {
    let idx = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let enterTimeoutId: ReturnType<typeof setTimeout> | undefined;
    const type = () => {
      if (idx < fullText.length) {
        setTypedText(fullText.substring(0, idx + 1));
        idx++;
        timeoutId = setTimeout(type, fullText.charAt(idx - 1) === '.' ? 600 : 65);
      } else {
        setIsTyping(false);
        // Automatically enter after a short delay
        enterTimeoutId = setTimeout(() => onEnter(), 800);
      }
    };
    const init = setTimeout(type, 500);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(init);
      clearTimeout(enterTimeoutId);
    };
  }, [onEnter]);

  // Allow pressing Enter or Escape to immediately enter dossier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhraseIdx(i => (i + 1) % cluePhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Voice briefing removed since it auto-enters


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', width: '100vw', height: '100vh', zIndex: 10, overflow: 'hidden' }}
    >
      {/* Ambient glow */}
      <div className="ambient-light" style={{ background: theme === 'light' ? 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 70%)' : undefined }} />

      {/* Subtle CSS Floor Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: theme === 'light' ? 'linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)' : 'linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 1 }} />

      {/* Massive Background Marquee / Floating Lines */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: theme === 'light' ? 0.35 : 0.2 }}>
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ whiteSpace: 'nowrap', fontSize: '10vw', fontWeight: 900, color: theme === 'light' ? 'rgba(15,23,42,0.1)' : '#fff', fontFamily: 'monospace', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px' }}
        >
          ESHWAR H S &bull; FULL-STACK DEVELOPER &bull; PROBLEM SOLVER &bull; ESHWAR H S &bull; FULL-STACK DEVELOPER &bull; PROBLEM SOLVER &bull;
        </motion.div>
        <motion.div
          animate={{ x: [-1000, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          style={{ whiteSpace: 'nowrap', fontSize: '8vw', fontWeight: 900, color: 'transparent', WebkitTextStroke: theme === 'light' ? '2px rgba(15,23,42,0.15)' : '2px rgba(255,255,255,0.8)', fontFamily: 'serif', letterSpacing: '2px', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: '20px' }}
        >
          PROBLEM SOLVER &bull; DATA STRUCTURES &bull; ALGORITHMS &bull; PROBLEM SOLVER &bull; DATA STRUCTURES &bull; ALGORITHMS &bull;
        </motion.div>
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ whiteSpace: 'nowrap', fontSize: '7vw', fontWeight: 800, color: theme === 'light' ? '#3b82f6' : '#ef4444', fontFamily: 'monospace', letterSpacing: '6px', textTransform: 'uppercase' }}
        >
          BUILDING SCALABLE SYSTEMS &bull; DIGITAL CRAFTSMAN &bull; BUILDING SCALABLE SYSTEMS &bull; DIGITAL CRAFTSMAN &bull;
        </motion.div>
      </div>

      {/* Dark vignette only at the EDGES — centre is visible */}
      <div className="edge-vignette" style={{ zIndex: 2 }} />

      {/* Spotlight that ADDS light where mouse is — not hides everything */}
      <motion.div
        className="mouse-spotlight"
        style={{ left: springX, top: springY, zIndex: 3 }}
      />

      {/* Evidence markers */}
      {evidenceMarkers.map(m => (
        <motion.div
          key={m.id}
          className="evidence-marker"
          style={{ top: m.top, left: (m as any).left, right: (m as any).right }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
          transition={{ duration: m.duration, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.3, boxShadow: '0 0 20px rgba(212,160,23,0.9)' }}
        >
          {m.id}
        </motion.div>
      ))}

      {/* Crime scene tape */}
      <div className="crime-tape crime-tape-top">
        ⚠ DO NOT CROSS &nbsp;·&nbsp; CLASSIFIED &nbsp;·&nbsp; DO NOT CROSS &nbsp;·&nbsp; CLASSIFIED &nbsp;·&nbsp; DO NOT CROSS &nbsp;·&nbsp; CLASSIFIED &nbsp;·&nbsp; DO NOT CROSS &nbsp;·&nbsp;
      </div>
      <div className="crime-tape crime-tape-bottom">
        ⚠ DO NOT CROSS &nbsp;·&nbsp; CLASSIFIED &nbsp;·&nbsp; DO NOT CROSS &nbsp;·&nbsp; CLASSIFIED &nbsp;·&nbsp; DO NOT CROSS &nbsp;·&nbsp; CLASSIFIED &nbsp;·&nbsp; DO NOT CROSS &nbsp;·&nbsp;
      </div>

      {/* Cycling clue ticker */}
      <div className="clue-ticker">
        <span className="clue-ticker-label">INTEL</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={activePhraseIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="clue-ticker-text"
          >
            {cluePhrases[activePhraseIdx]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Live coordinates */}
      <div className="coordinates">
        X: {mousePos.x < 0 ? '---' : mousePos.x.toFixed(0)} &nbsp;|&nbsp; Y: {mousePos.y < 0 ? '---' : mousePos.y.toFixed(0)}
      </div>

      {/* Main card */}
      <div className="landing-center" style={{ zIndex: 10 }}>
        <Tilt
          perspective={800}
          glareEnable={true}
          glareMaxOpacity={0.25}
          scale={1.05}
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          gyroscope={true}
          style={{ width: '90%', maxWidth: '780px', transformStyle: 'preserve-3d' }}
        >
          <div className="glass-card" style={{ transform: 'translateZ(30px)' }}>
            <div className="card-corner card-corner-tl" />
            <div className="card-corner card-corner-tr" />
            <div className="card-corner card-corner-bl" />
            <div className="card-corner card-corner-br" />

            <div className="case-stamp">CASE FILE 001 &nbsp;·&nbsp; PRIORITY: HIGH</div>

            <p className="typewriter-text" style={{ transform: 'translateZ(60px)' }}>
              {typedText.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {isTyping && i === arr.length - 1 && <span className="cursor" />}
                  {i === 0 && <br />}
                </span>
              ))}
              {!isTyping && <span className="cursor" />}
            </p>

            <div className="card-divider" style={{ transform: 'translateZ(40px)' }} />

            <div className="card-meta">
              <span>DETECTIVE PORTFOLIO</span>
              <span>EST. 2024</span>
              <span>CLEARANCE: TS</span>
            </div>

            {/* Buttons removed for auto-enter */}
          </div>
        </Tilt>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="scroll-hint"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={20} />
      </motion.div>

      {/* Enter Dossier Button */}
      <motion.button
        type="button"
        className="intro-skip-btn"
        onClick={onEnter}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.35 }}
        aria-label="Enter Dossier"
      >
        <span className="skip-text">ENTER DOSSIER</span>
        <span className="skip-arrow">→</span>
        <span className="skip-kbd">[ESC / ↵]</span>
      </motion.button>
    </motion.div>
  );
}
