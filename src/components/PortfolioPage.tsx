import { useEffect, useMemo, useRef, useState } from 'react';
import CyberVortexCanvas from './CyberVortexCanvas';
import MatrixRain from './MatrixRain';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
  Folder, FileText, User, Mail, Code, Shield, Database,
  ChevronRight, Zap, Globe, Award, Cpu, Wifi,
  Server, Phone, MapPin, X,
  ExternalLink, BookOpen, Monitor, Terminal
} from 'lucide-react';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface ProjectData {
  caseNum: string;
  title: string;
  subtitle: string;
  desc: string;
  fullDetails: string[];
  impact: string;
  icon: React.ReactNode;
  status: 'solved' | 'active' | 'classified';
  tags: string[];
  image?: string;
  github?: string;
  live?: string;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="scroll-progress-bar" style={{ scaleX: scrollYProgress, transformOrigin: 'left' }} />;
}

function Counter({ target, suffix = '', decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true);
        let start = 0;
        const step = target / 50;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); } else { setCount(start); }
        }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, target]);
  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}</span>;
}

function GlitchText({ text }: { text: string }) {
  return <span className="glitch-hover">{text}</span>;
}

function FloatingParticles() {
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i, 
    left: `${Math.random() * 100}vw`,
    size: `${Math.random() * 4 + 2}px`,
    duration: `${Math.random() * 15 + 10}s`,
    delay: `-${Math.random() * 20}s`
  })), []);
  return (
    <div className="floating-particles-bg" aria-hidden="true">
      {particles.map((p) => (
        <div key={p.id} className="particle-mote" style={{ left: p.left, width: p.size, height: p.size, animationDuration: p.duration, animationDelay: p.delay }} />
      ))}
    </div>
  );
}

function ScanLine() { return <div className="global-scan-line" aria-hidden />; }
function SkillBar({ name, level, delay, icon }: { name: string; level: number; delay: number; icon?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div className="skill-bar-item"
      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
    >
      <div className="skill-bar-header">
        <span className="skill-bar-name">{icon && <span className="skill-icon">{icon}</span>}{name}</span>
        <motion.span className="skill-bar-pct" animate={{ scale: hovered ? 1.2 : 1 }} style={{ color: hovered ? '#ff5500' : 'var(--red)' }}>{level}%</motion.span>
      </div>
      <div className="skill-bar-track">
        <motion.div className="skill-bar-fill" animate={{ width: `${level}%` }} transition={{ duration: 1.2, delay: delay + 0.2, ease: 'easeOut' }} />
      </div>
    </motion.div>
  );
}



function CaseCard({ project, onClick, delay }: { project: ProjectData; onClick: () => void; delay: number }) {
  const [flipped, setFlipped] = useState(false);
  
  // Parallax & Spotlight state
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Spring configurations for smooth animation
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), springConfig);
  const spotlightX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), springConfig);
  const spotlightY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleFlip = (e: React.MouseEvent) => {
    // Don't flip if clicking on links
    if ((e.target as HTMLElement).closest('a')) return;
    setFlipped(f => !f);
  };

  return (
    <motion.div
      className="flip-card-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onClick={handleFlip}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer', perspective: 1200 }}
      title={flipped ? 'Click to flip back' : 'Click to see details'}
    >
      <motion.div
        className="flip-card-inner"
        animate={{ rotateY: flipped ? 180 : 0 }}
        style={{ 
          rotateX: flipped ? 0 : rotateX, 
          rotateY: flipped ? 180 : rotateY,
          transformStyle: 'preserve-3d',
          width: '100%', height: '100%', position: 'relative'
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── FRONT ── */}
        <div className="flip-card-front case-card cyber-border-run" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Spotlight Effect Overlay */}
          <motion.div 
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
              background: useTransform(
                [spotlightX, spotlightY], 
                ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(239, 68, 68, 0.15) 0%, transparent 60%)`
              )
            }} 
          />

          <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: '6px', zIndex: 10 }}>
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{ background: 'rgba(163,0,0,0.85)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', textDecoration: 'none', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #ff3333' }}>
                <ExternalLink size={10} /> LIVE
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{ background: 'rgba(10,10,10,0.85)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', textDecoration: 'none', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <GithubIcon size={10} /> CODE
              </a>
            )}
          </div>

          <div className="case-num" style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '8px' }}>{project.caseNum}</div>
          <div className="case-card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <motion.div className="case-icon" animate={{ rotate: flipped ? 0 : [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              {project.icon}
            </motion.div>
            <span className={`status-badge ${project.status}`}>{project.status.toUpperCase()}</span>
          </div>

          {project.image && (
            <div style={{ margin: '10px 0', borderRadius: '6px', overflow: 'hidden', height: '180px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={project.image} alt="" style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', objectFit: 'cover', filter: 'blur(8px) brightness(0.25)', zIndex: 0 }} aria-hidden />
              <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
              <div style={{ position: 'absolute', bottom: 5, right: 6, background: 'rgba(0,0,0,0.75)', padding: '2px 7px', borderRadius: '3px', fontSize: '0.6rem', color: '#ffd700', fontFamily: 'monospace', zIndex: 2 }}>EVIDENCE EXHIBIT</div>
            </div>
          )}

          <h4 style={{ margin: '10px 0 6px' }}>{project.title}</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '8px' }}>{project.desc}</p>
          <div style={{ fontSize: '0.75rem', color: 'var(--red)', fontWeight: 600, marginBottom: '10px' }}>⚡ {project.impact}</div>
          <div className="case-tags" style={{ marginBottom: '12px' }}>{project.tags.slice(0, 3).map(t => <span key={t} className="case-tag">{t}</span>)}</div>

          {/* Flip hint */}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 'auto' }}
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
          >
            <span style={{ fontSize: '1rem' }}>↩</span> CLICK TO FLIP — VIEW FULL DOSSIER
          </motion.div>
        </div>

        {/* ── BACK ── */}
        <div className="flip-card-back case-card" style={{ background: 'linear-gradient(145deg, rgba(10, 15, 24, 0.8), rgba(17, 24, 39, 0.8))', borderColor: 'rgba(163,0,0,0.5)' }}>
          {/* Flip back hint */}
          <motion.div
            onClick={e => { e.stopPropagation(); setFlipped(false); }}
            style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.65rem', fontFamily: 'monospace', color: '#a30000', cursor: 'pointer', border: '1px solid #a30000', padding: '3px 8px', borderRadius: '4px' }}
            whileHover={{ scale: 1.1 }}
          >
            ← BACK
          </motion.div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ background: '#a30000', color: '#fff', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '3px', fontWeight: 'bold', fontFamily: 'monospace' }}>CASE FILE {project.caseNum}</span>
            <span className={`status-badge ${project.status}`}>{project.status.toUpperCase()}</span>
          </div>

          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{project.title}</h4>
          <p style={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '0.75rem', marginBottom: '14px' }}>{project.subtitle}</p>

          <div style={{ background: 'rgba(163,0,0,0.12)', borderLeft: '3px solid #a30000', padding: '8px 12px', borderRadius: '4px', marginBottom: '14px' }}>
            <div style={{ color: '#ffd700', fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px' }}>⚡ IMPACT</div>
            <p style={{ margin: 0, color: '#f1f5f9', fontSize: '0.82rem' }}>{project.impact}</p>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: '1px', marginBottom: '8px' }}>KEY EVIDENCE</div>
            {project.fullDetails?.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <span style={{ color: '#a30000', flexShrink: 0 }}>▸</span>
                <span>{d}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {project.tags.map(t => <span key={t} className="case-tag" style={{ fontSize: '0.65rem' }}>{t}</span>)}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{ flex: 1, background: '#a30000', color: '#fff', padding: '9px', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', border: '1px solid #ff3333' }}>
                <ExternalLink size={12} /> LIVE DEMO
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{ flex: 1, background: 'rgba(255,255,255,0.07)', color: '#fff', padding: '9px', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <GithubIcon size={12} /> SOURCE CODE
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


function ProjectModal({ project, onClose }: { project: ProjectData; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(5,7,12,0.85)', backdropFilter: 'blur(12px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        style={{ background: 'linear-gradient(145deg, #0d111a, #141b29)', border: '1px solid rgba(163,0,0,0.4)', boxShadow: '0 0 50px rgba(163,0,0,0.3)', borderRadius: '12px', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '28px', color: '#e2e8f0' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ background: '#a30000', color: '#fff', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '4px', fontWeight: 'bold', fontFamily: 'monospace' }}>CASE FILE {project.caseNum}</span>
          <span className={`status-badge ${project.status}`}>{project.status.toUpperCase()}</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: '6px 0' }}>{project.title}</h2>
        <p style={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '16px' }}>{project.subtitle}</p>
        {project.image && (
          <div style={{ borderRadius: '8px', overflow: 'hidden', margin: '16px 0', border: '1px solid rgba(255,255,255,0.15)' }}>
            <img src={project.image} alt={project.title} style={{ width: '100%', maxHeight: '340px', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ background: 'rgba(163,0,0,0.12)', borderLeft: '3px solid #a30000', padding: '12px 16px', borderRadius: '4px', margin: '16px 0' }}>
          <strong style={{ color: '#ffd700', fontSize: '0.85rem' }}>IMPACT & RESULT:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#f1f5f9', fontSize: '0.95rem' }}>{project.impact}</p>
        </div>
        <h4 style={{ color: '#cbd5e1', fontSize: '1rem', marginTop: '20px', marginBottom: '10px' }}>TECHNICAL BREAKDOWN</h4>
        <ul style={{ paddingLeft: '20px', margin: 0, color: '#94a3b8', lineHeight: 1.7, fontSize: '0.92rem' }}>
          {project.fullDetails.map((detail, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{detail}</li>)}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '20px 0 24px 0' }}>
          {project.tags.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#e2e8f0', fontFamily: 'monospace' }}>{t}</span>)}
        </div>
        <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="contact-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }}><GithubIcon size={14} /> Repository Code</a>}
          {project.live && <a href={project.live} target="_blank" rel="noreferrer" className="contact-btn contact-btn-ghost" style={{ padding: '8px 16px', fontSize: '0.85rem' }}><ExternalLink size={14} /> Launch Live Demo</a>}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [contactVisible, setContactVisible] = useState(false);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.96]);
  const springX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const springY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2; const cy = window.innerHeight / 2;
      springX.set((e.clientX - cx) / cx * 8); springY.set((e.clientY - cy) / cy * 5);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [springX, springY]);

  useEffect(() => {
    const ids = ['home', 'skills', 'projects', 'education', 'contact'];
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }), { threshold: 0.35 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = document.getElementById('contact');
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const projects: ProjectData[] = [
    {
      caseNum: '#001', title: 'NammaUGNEET', subtitle: 'NEET UG Counselling & Real-Time College Predictor',
      desc: 'A counselling platform adopted by 1,200+ aspirants, converting 129,000+ raw cutoff records into instant predictions.',
      fullDetails: [
        'Transformed 129,000+ fragmented cutoff data points into a high-speed searchable college predictor.',
        'Engineered a Node.js pipeline to extract, parse, clean, and structure raw PDF cutoff files.',
        'MongoDB-backed serverless APIs on Vercel handling thousands of concurrent queries with zero downtime.',
      ],
      impact: 'Adopted by 1,200+ NEET UG aspirants during Karnataka counselling season.',
      icon: <Folder size={24} />, status: 'solved',
      tags: ['React', 'Node.js', 'MongoDB Atlas', 'Vercel', 'Tailwind CSS'],
      image: '/nammaugneet.png', github: 'https://github.com/eshwarhs170-a11y/Namma-UGNEET-Portal', live: 'https://namma-ugneet-portal.vercel.app/',
    },
    {
      caseNum: '#002', title: 'GramSetu', subtitle: 'Civic-Tech Platform with Gemini AI & Multilingual Voice UI',
      desc: 'Empowering rural citizens with AI-driven crop diagnosis, voice navigation in 3 languages, and automated grievance tracking.',
      fullDetails: [
        'Integrated Google Gemini Vision API to build an AI crop disease scanner covering 15+ major agricultural crops.',
        'Developed a trilingual (Kannada / English / Hindi) hands-free voice assistant using Web Speech API.',
        'Architected a 4-tier automated grievance escalation system with SLA resolution tracking.',
      ],
      impact: 'AI Crop diagnosis covering 15+ crops with real-time treatment guides.',
      icon: <Shield size={24} />, status: 'solved',
      tags: ['React', 'Google Gemini Vision API', 'Node.js', 'Web Speech API', 'Firebase'],
      image: '/gramsetu.png', github: 'https://github.com/eshwarhs170-a11y/GramSetu', live: 'https://gram-setu-one.vercel.app/',
    }
  ];

  const skillBars = [
    { name: 'C / C++ / Java', level: 90, icon: <Server size={12} /> },
    { name: 'JavaScript / Node.js', level: 92, icon: <Zap size={12} /> },
    { name: 'React / Vite / Tailwind', level: 94, icon: <Globe size={12} /> },
    { name: 'MongoDB / Firebase', level: 86, icon: <Database size={12} /> },
    { name: 'Google Gemini API & AI', level: 88, icon: <Cpu size={12} /> },
    { name: 'Git / GitHub / VS Code', level: 85, icon: <Wifi size={12} /> },
  ];

  const skillsList = [
    'C', 'C++', 'Java', 'JavaScript', 'React', 'Vite', 'Tailwind CSS',
    'Node.js', 'Vercel Serverless', 'MongoDB Atlas', 'Firebase / Firestore',
    'Google Gemini API', 'Web Speech API', 'Git', 'GitHub', 'VS Code', 'Data Structures',
  ];

  const education = [
    { year: '2025 – 2029', degree: 'B.E. in Computer Science & Engineering', institution: 'University Visvesvaraya College of Engineering (UVCE), Bengaluru', detail: 'Currently in 2nd Year. CGPA: 9.64 / 10.0', grade: '9.64', icon: <Award size={18} />, color: '#a30000', image: '/uvce.jpg' },
    { year: '2023 – 2025', degree: 'Pre-University (Science — PCMB)', institution: 'Presidency PU College, Bengaluru', detail: 'Karnataka State Board. Percentage: 98.17%', grade: '98.17%', icon: <BookOpen size={18} />, color: '#3b82f6', image: '/presidency.png' },
    { year: '2023', degree: 'Secondary School (SSLC)', institution: 'Venus International School', detail: 'Percentage: 98.04%', grade: '98.04%', icon: <FileText size={18} />, color: '#10b981', image: '/venus.jpg' },
  ];

  const navLinks = [
    { href: '#home', label: 'Home', id: 'home' },
    { href: '#skills', label: 'Skills', id: 'skills' },
    { href: '#projects', label: 'Projects', id: 'projects' },
    { href: '#education', label: 'Education', id: 'education' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="portfolio-page" data-theme={theme}>
      {/* Full-screen animated background — fades in at contact section */}
      <CyberVortexCanvas visible={contactVisible} />

      <header className="portfolio-header">
        <div className="header-brand">
          <motion.div whileHover={{ rotateY: 180, scale: 1.2 }} transition={{ duration: 0.4 }} style={{ display: 'flex', alignItems: 'center' }}>
            <Folder className="brand-icon" size={20} />
          </motion.div>
          <GlitchText text="ESHWAR H S // DOSSIER" />
        </div>
        <nav>
          {navLinks.map(link => (
            <motion.a 
              key={link.id} href={link.href} 
              className={activeSection === link.id ? 'nav-active' : ''}
              whileHover={{ y: -3, scale: 1.05, textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <motion.div className="live-indicator" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-dot-sm" /> ACTIVE
          </motion.div>
          <ThemeToggle />
        </div>
      </header>

      <main className="portfolio-content">
        <FloatingParticles />

        <section id="home">
          <motion.div className="hero-section" style={{ opacity: heroOpacity, scale: heroScale }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="hero-text" style={{ position: 'relative' }}>
              <motion.div className="redacted-label" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }}>
                ▲ FULL-STACK & AI DEVELOPER
              </motion.div>
              <motion.h1 className="hero-name" initial={{ opacity: 0, x: -100, rotateY: 45 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} transition={{ duration: 1, type: 'spring', bounce: 0.4 }}><GlitchText text="Eshwar H S" /></motion.h1>
              <motion.h2 className="hero-role" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>Developer &amp; AI Engineer</motion.h2>
              <p className="hero-bio">
                Every complex problem leaves a trail. I follow the evidence — and build the solution.
                Specializing in <strong>Full-Stack Development</strong> and <strong>AI Integration</strong>,
                turning real-world challenges into production-ready applications.
              </p>
              <div className="hero-actions">
                <div className="hero-status"><span className="live-dot" /> Open for Internships &amp; Dev Roles</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} color="#a30000" /> Bengaluru, Karnataka</span>
                  <span style={{ color: 'var(--glass-border)' }}>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Award size={12} color="#ffd700" /> UVCE · CGPA 9.64</span>
                </div>
              </div>
              <motion.div className="hero-stamp" animate={{ rotate: [-3, 0, -3], opacity: [0.6, 0.85, 0.6] }} transition={{ duration: 5, repeat: Infinity }}>VERIFIED ENGINEER</motion.div>
            </div>

            <motion.div className="id-card" style={{ rotateX: springY, rotateY: springX, transformStyle: 'preserve-3d' }} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 200 }}>
              <div className="id-card-top">
                <span className="id-card-label">DEVELOPER PORTFOLIO</span>
                <span className="id-card-level">CSE // UVCE</span>
              </div>
              <div className="id-photo" style={{ padding: 0, overflow: 'hidden', background: 'none', height: '200px', position: 'relative' }}>
                <img src="/id_photo.jpg" alt="Eshwar H S" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
                <div className="id-scan-line" />
                <div className="id-corner id-corner-tl" />
                <div className="id-corner id-corner-br" />
                <motion.div 
                  style={{ position: 'absolute', inset: 0, background: 'rgba(163,0,0,0.2)', mixBlendMode: 'color-burn', pointerEvents: 'none' }}
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <svg style={{ position: 'absolute', bottom: '5px', right: '5px', opacity: 0.4, pointerEvents: 'none' }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                  <path d="M8 12a4 4 0 0 1 8 0"/>
                </svg>
              </div>
              <div className="id-card-details">
                <p><strong>NAME:</strong> Eshwar H S</p>
                <p><strong>ROLE:</strong> Full-Stack &amp; AI Developer</p>
                <p><strong>STATUS:</strong> <span className="id-active">● ACTIVE // 2ND YEAR</span></p>
                <p><strong>SPECIALTY:</strong> AI Integration &amp; Web Apps</p>
                <p><strong>BASE:</strong> Bengaluru, Karnataka</p>
              </div>
              <div className="id-card-footer-row">
                <div className="id-barcode">||| || |||| | || ||| || |||| | || ||| || ||</div>
                <motion.div className="id-hologram" animate={{ opacity: [0.3, 0.8, 0.3], rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>◈</motion.div>
              </div>
            </motion.div>
          </motion.div>


        </section>

        <section id="skills">
          <motion.div className="section-header" style={{ marginBottom: '40px' }} initial={{ opacity: 0, y: 30, rotateX: 20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="section-title skills-title">Arsenal // Technical Skills</h2>
            <span className="section-count">SYSTEM PROFILING COMPLETE</span>
          </motion.div>

          {/* Evidence Wire Board */}
          <div className="evidence-board">
            {[
              {
                label: 'LANGUAGES', color: '#3b82f6',
                skills: ['C', 'C++', 'JavaScript (ES6)', 'HTML5 / CSS3'],
              },
              {
                label: 'WEB TECH', color: '#a30000',
                skills: ['React.js', 'Node.js', 'Tailwind CSS', 'REST APIs'],
              },
              {
                label: 'DATA & AI', color: '#10b981',
                skills: ['MongoDB', 'Firebase', 'Gemini AI API', 'Web Speech API'],
              },
              {
                label: 'TOOLS', color: '#d4a017',
                skills: ['Git', 'GitHub', 'VS Code', 'Vercel'],
              },
            ].map((cat) => (
              <div key={cat.label} className="evidence-column">
                {/* Column header pin */}
                <div className="evidence-col-header" style={{ borderColor: cat.color, color: cat.color }}>
                  <div className="evidence-pin" style={{ background: cat.color }} />
                  {cat.label}
                </div>
                {/* Vertical line */}
                <div className="evidence-col-line" style={{ background: `linear-gradient(to bottom, ${cat.color}, transparent)` }} />
                {/* Skill tags */}
                <div className="evidence-tags">
                  {cat.skills.map((skill, si) => (
                    <motion.div
                      key={skill}
                      className="evidence-tag"
                      style={{ '--tag-color': cat.color } as any}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: si * 0.08 }}
                      whileHover={{ scale: 1.07, boxShadow: `0 0 18px ${cat.color}66`, borderColor: cat.color }}
                    >
                      <span className="evidence-tag-dot" style={{ background: cat.color }} />
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </section>


        <section id="projects" style={{ position: 'relative', overflow: 'hidden', padding: '60px 0' }}>
          {/* Animated Background for Projects Section */}
          <MatrixRain />
          <div className="cyber-grid-anim" />

          <div className="section-header" style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <h2 className="section-title proj-title" style={{ margin: 0, textShadow: '0 0 15px rgba(239, 68, 68, 0.4)' }}>Featured Dossiers</h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, var(--accent-1), transparent)' }} />
            <span className="section-count" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-1)', padding: '6px 12px', borderRadius: '4px', color: 'var(--accent-1)' }}>
              {projects.length} ACTIVE CASES
            </span>
          </div>

          <div className="cases-grid" style={{ position: 'relative', zIndex: 2 }}>
            {projects.map((p, i) => <CaseCard key={p.caseNum} project={p} delay={0} onClick={() => setSelectedProject(p)} />)}
          </div>
        </section>

        <section id="education">
          <motion.div className="section-header" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, type: 'spring' }}>
            <h2 className="section-title edu-title">Background Check // Education</h2>
            <span className="section-count">3 RECORDS FOUND</span>
          </motion.div>
          <div className="timeline">
            {education.map((item, i) => (
              <motion.div key={i} className="timeline-item" whileHover={{ x: 12, scale: 1.01 }} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.2 }}>
                <div className="timeline-year">{item.year}</div>
                <motion.div className="timeline-dot" style={{ borderColor: item.color, background: `${item.color}22` }} whileHover={{ scale: 1.3, boxShadow: `0 0 15px ${item.color}` }}>
                  <div className="timeline-dot-icon" style={{ color: item.color }}>{item.icon}</div>
                </motion.div>
                <div className="timeline-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h4>{item.degree}</h4>
                    <span style={{ background: `${item.color}22`, border: `1px solid ${item.color}66`, color: item.color, padding: '2px 10px', borderRadius: '3px', fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{item.grade}</span>
                  </div>
                  <span className="timeline-place">{item.institution}</span>
                  <p>{item.detail}</p>
                  
                  {item.image && (
                    <div className="edu-image-container" style={{ marginTop: '16px', borderRadius: '6px', overflow: 'hidden', height: '240px', position: 'relative', border: `1px solid ${item.color}55`, background: 'rgba(0,0,0,0.85)' }}>
                      {/* Grid overlay */}
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `linear-gradient(${item.color}15 1px, transparent 1px), linear-gradient(90deg, ${item.color}15 1px, transparent 1px)`, backgroundSize: '30px 30px', zIndex: 0 }} />
                      
                      {/* Actual uncropped image */}
                      <img src={item.image} alt={item.institution} style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
                      
                      {/* Crosshairs & UI Overlays on the sides */}
                      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '25px', height: '25px', borderTop: `2px solid ${item.color}`, borderLeft: `2px solid ${item.color}`, zIndex: 2, opacity: 0.7 }} />
                      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '25px', height: '25px', borderBottom: `2px solid ${item.color}`, borderRight: `2px solid ${item.color}`, zIndex: 2, opacity: 0.7 }} />
                      
                      <div style={{ position: 'absolute', top: '40%', left: '3%', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
                        {[...Array(6)].map((_, i) => <div key={i} style={{ width: i % 2 === 0 ? '24px' : '14px', height: '2px', background: `${item.color}55` }} />)}
                      </div>
                      
                      <div style={{ position: 'absolute', top: '50%', right: '3%', transform: 'translateY(-50%)', fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--text-main)', textAlign: 'right', zIndex: 2, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
                        <div>LAT: 12.9716 N</div>
                        <div>LNG: 77.5946 E</div>
                        <div style={{ marginTop: '8px' }}>TARGET: {item.grade}</div>
                      </div>

                      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.85)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.65rem', color: '#d4a017', fontFamily: 'monospace', border: '1px solid rgba(212,160,23,0.5)', zIndex: 2 }}>
                        LOCATION SURVEILLANCE
                      </div>
                      <svg style={{ position: 'absolute', bottom: '10px', left: '10px', opacity: 0.4, zIndex: 2 }} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <div className="scan-line-horizontal" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: item.color, opacity: 0.6, boxShadow: `0 0 10px ${item.color}`, zIndex: 2 }} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="certifications">
          <div className="section-header">
            <h2 className="section-title edu-title">Declassified Records // Certifications & Achievements</h2>
            <span className="section-count">2 FILES FOUND</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div className="case-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-3)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', color: 'var(--accent-3)' }}><Zap size={18}/> NammaUGNEET Impact</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Adopted by 1,200+ NEET UG aspirants as a real-time college predictor during Karnataka's 2026 counselling season.</p>
            </div>
            <div className="case-card" style={{ padding: '24px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', color: 'var(--accent-4)' }}><Award size={18}/> CodeFury 9.0</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Participated in the 9th Annual National-Level Hackathon organized by IEEE UVCE Computer Society.</p>
              <div style={{ position: 'absolute', top: 12, right: 12, opacity: 0.1 }}><Shield size={40} /></div>
            </div>
          </div>
        </section>

        <section id="contact" style={{ position: 'relative', overflow: 'hidden', padding: '100px 0', marginTop: '60px' }}>
          {/* Huge Background Text */}
          <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translate(-50%, 0)', fontSize: '18vw', fontWeight: 900, color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.03)', whiteSpace: 'nowrap', zIndex: 0, pointerEvents: 'none', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em' }}>
            C O N T A C T
          </div>

          <motion.div className="contact-section" style={{ position: 'relative', zIndex: 1, background: 'transparent', boxShadow: 'none' }} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '60px' }}>
              <motion.h2 className="section-title contact-title" style={{ marginBottom: 12, fontSize: '3rem', textAlign: 'center' }} animate={{ textShadow: ['0 0 10px #a30000', '0 0 20px #a30000', '0 0 10px #a30000'] }} transition={{ duration: 2, repeat: Infinity }}>Establish Contact</motion.h2>
              <p className="contact-desc" style={{ maxWidth: '600px', margin: '0 auto' }}>Open to internships, collaborations, and AI/Web dev opportunities. The network is secure, drop a message.</p>
            </div>


            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '60px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
              {/* Left: Contact Form */}
              <motion.div className="contact-form cyber-border-run" style={{ padding: '30px', borderRadius: '16px', background: 'rgba(10, 15, 25, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} whileHover={{ boxShadow: '0 0 30px rgba(163,0,0,0.15)' }} transition={{ duration: 0.3 }}>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label className="form-label"><User size={10} style={{ marginRight: 5 }} />NAME</label>
                    <input type="text" className="form-input" placeholder="Your name or organization" />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Mail size={10} style={{ marginRight: 5 }} />EMAIL</label>
                    <input type="email" className="form-input" placeholder="your.email@example.com" />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label"><FileText size={10} style={{ marginRight: 5 }} />MESSAGE</label>
                  <textarea className="form-input form-textarea" placeholder="Detail your project or opportunity..." rows={4} />
                </div>
                <motion.button className="form-submit" whileHover={{ scale: 1.04, boxShadow: '0 0 40px var(--red-glow)' }} whileTap={{ scale: 0.97 }}
                  onClick={(e) => { e.preventDefault(); alert('Transmission sent! Eshwar will respond shortly.'); }}
                >
                  <Zap size={14} style={{ marginRight: 8 }} /> TRANSMIT SIGNAL
                </motion.button>
              </motion.div>

              {/* Right: Direct Channels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '4px' }}>— DIRECT CHANNELS —</div>
                {[
                  { icon: <Mail size={18} />, label: 'Email', href: 'mailto:eshwarhs170@gmail.com', color: '#3b82f6' },
                  { icon: <GithubIcon size={18} />, label: 'GitHub', href: 'https://github.com/eshwarhs170-a11y', color: '#e2e8f0' },
                  { icon: <LinkedinIcon size={18} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/eshwar-h-s-4b820638a', color: '#0a66c2' },
                  { icon: <InstagramIcon />, label: 'Instagram', href: 'https://www.instagram.com/_eshwar__hs_', color: '#e1306c' },
                ].map((ch) => (
                  <a key={ch.label} href={ch.href} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'rgba(10, 15, 25, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderLeft: `3px solid ${ch.color}`, borderRadius: '12px', textDecoration: 'none', color: 'var(--text-main)', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(6px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}
                  >
                    <span style={{ color: ch.color }}>{ch.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '2px' }}>{ch.label.toUpperCase()}</div>
                    </div>
                    <ExternalLink size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)', opacity: 0.5 }} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      <footer className="portfolio-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 40px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', marginTop: '80px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto', alignItems: 'center' }}>
          
          <div className="footer-left" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 'bold', letterSpacing: '2px' }}><Folder size={16} /> ESHWAR H S</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>DETECTIVE DOSSIER © 2026</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {[
              { icon: <GithubIcon size={20} />, href: 'https://github.com/eshwarhs170-a11y' },
              { icon: <LinkedinIcon size={20} />, href: 'https://www.linkedin.com/in/eshwar-h-s-4b820638a' },
              { icon: <InstagramIcon />, href: 'https://www.instagram.com/_eshwar__hs_' },
              { icon: <Mail size={20} />, href: 'mailto:eshwarhs170@gmail.com' }
            ].map((link, i) => (
              <motion.a key={i} whileHover={{ y: -5, scale: 1.1, color: '#fff' }} href={link.href} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}>
                {link.icon}
              </motion.a>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
            <motion.a 
              href="/resume.pdf" target="_blank" rel="noreferrer" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'monospace', textDecoration: 'none' }} 
              whileHover={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}
            >
              <FileText size={16} /> SECURE RESUME
            </motion.a>
            <motion.div className="footer-status" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#10b981', fontFamily: 'monospace', letterSpacing: '1px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} /> SYSTEM ONLINE
            </motion.div>
          </div>

        </div>
      </footer>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
