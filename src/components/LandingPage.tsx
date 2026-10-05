import { useState, useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
  "CGPA: 9.64 | Passionate about IoT & AI/ML",
  "Top Case: NammaUGNEET (1,200+ Aspirants)",
  "Latest Evidence: GramSetu Gemini Vision AI",
  "Status: Open for Internships & AI/Web Roles",
];

// Trail of fading dots that follow the cursor
function CursorTrail({ mousePos }: { mousePos: { x: number; y: number } }) {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (mousePos.x < 0) return;
    const newDot = { x: mousePos.x, y: mousePos.y, id: idRef.current++ };
    setTrail(prev => [...prev.slice(-18), newDot]);
  }, [mousePos]);

  return (
    <>
      {trail.map((dot, i) => {
        const age = i / trail.length; // 0 = oldest, 1 = newest
        return (
          <div
            key={dot.id}
            style={{
              position: 'fixed',
              left: dot.x,
              top: dot.y,
              width: 6 + age * 6,
              height: 6 + age * 6,
              borderRadius: '50%',
              background: `rgba(163, 0, 0, ${age * 0.7})`,
              boxShadow: `0 0 ${age * 12}px rgba(163, 0, 0, ${age * 0.5})`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 50,
              transition: 'opacity 0.3s ease',
            }}
          />
        );
      })}
    </>
  );
}

export default function LandingPage({ onEnter }: Props) {
  const [typedText, setTypedText] = useState("");
  const [showButton, setShowButton] = useState(false);
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
    let timeoutId: number;
    const type = () => {
      if (idx < fullText.length) {
        setTypedText(fullText.substring(0, idx + 1));
        idx++;
        timeoutId = setTimeout(type, fullText.charAt(idx - 1) === '.' ? 600 : 65);
      } else {
        setIsTyping(false);
        setTimeout(() => setShowButton(true), 800);
        // Auto-open the archive 2 seconds after the button appears
        setTimeout(() => onEnter(), 800 + 2000);
      }
    };
    const init = setTimeout(type, 500);
    return () => { clearTimeout(timeoutId); clearTimeout(init); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhraseIdx(i => (i + 1) % cluePhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // ── Auto-silence background music when typing is done ───────────────────────
  useEffect(() => {
    if (!isTyping) {
      window.dispatchEvent(new Event('force-fade-music'));
    }
  }, [isTyping]);

  const playVoiceBriefing = () => {
    const voiceAudio = new Audio('/voice.mp3');
    voiceAudio.volume = 1;
    voiceAudio.play().catch(() => {});
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', width: '100vw', height: '100vh', zIndex: 10, overflow: 'hidden' }}
    >
      {/* Cursor blood-red trail */}
      <CursorTrail mousePos={mousePos} />

      {/* Always-visible ambient glow — no mouse needed to see this */}
      <div className="ambient-light" />

      {/* Dark vignette only at the EDGES — centre is visible */}
      <div className="edge-vignette" />

      {/* Spotlight that ADDS light where mouse is — not hides everything */}
      <motion.div
        className="mouse-spotlight"
        style={{ left: springX, top: springY }}
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
        <span className="clue-ticker-label">// INTEL</span>
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
      <div className="landing-center">
        <Tilt
          perspective={900}
          glareEnable={true}
          glareMaxOpacity={0.18}
          scale={1.03}
          tiltMaxAngleX={10}
          tiltMaxAngleY={10}
          gyroscope={true}
          style={{ width: '90%', maxWidth: '780px' }}
        >
          <div className="glass-card">
            <div className="card-corner card-corner-tl" />
            <div className="card-corner card-corner-tr" />
            <div className="card-corner card-corner-bl" />
            <div className="card-corner card-corner-br" />

            <div className="case-stamp">CASE FILE // 001 &nbsp;·&nbsp; PRIORITY: CRITICAL</div>

            <p className="typewriter-text">
              {typedText.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {isTyping && i === arr.length - 1 && <span className="cursor" />}
                  {i === 0 && <br />}
                </span>
              ))}
              {!isTyping && <span className="cursor" />}
            </p>

            <div className="card-divider" />

            <div className="card-meta">
              <span>DETECTIVE PORTFOLIO</span>
              <span>EST. 2024</span>
              <span>CLEARANCE: TS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: 36, opacity: showButton ? 1 : 0, pointerEvents: showButton ? 'auto' : 'none', transition: 'opacity 0.5s' }}>
              <motion.button
                className="enter-btn"
                style={{ position: 'relative', overflow: 'hidden', padding: '16px 24px', width: '100%' }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(163, 0, 0, 0.6)' }}
                whileTap={{ scale: 0.97 }}
                onClick={onEnter}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a30000' }}>
                    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                    <path d="M8 12a4 4 0 0 1 8 0"/>
                  </svg>
                  <span style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>OPEN THE ARCHIVE</span>
                </div>
                <motion.div 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: '#d4a017', boxShadow: '0 0 10px #d4a017', opacity: 0.8 }}
                  animate={{ y: [0, 50, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                />
              </motion.button>

              <motion.button
                style={{ 
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', 
                  fontFamily: 'monospace', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px', 
                  cursor: 'pointer', padding: '4px 10px' 
                }}
                whileHover={{ color: '#d4a017' }}
                onClick={playVoiceBriefing}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                PLAY AUDIO BRIEFING
              </motion.button>
            </div>
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
    </motion.div>
  );
}
