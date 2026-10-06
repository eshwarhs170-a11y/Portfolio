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



function CaseCard({ project, index }: { project: ProjectData; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ perspective: '1500px', width: '100%', maxWidth: '850px', margin: '0 auto 40px auto' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 90, damping: 15 }}
        style={{ 
          width: '100%', 
          position: 'relative', 
          transformStyle: 'preserve-3d', 
          cursor: 'pointer',
          display: 'grid'
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* ---------------- FRONT OF FLASHCARD ---------------- */}
        <div style={{ 
          gridArea: '1 / 1', 
          backfaceVisibility: 'hidden', 
          WebkitBackfaceVisibility: 'hidden',
          background: '#050810', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          position: 'relative',
        }}>
           {/* FULL IMAGE — no cropping */}
           <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />

           {/* CLICK TO FLIP BADGE — always visible */}
           <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239,68,68,0.9)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 20px rgba(239,68,68,0.6)', zIndex: 10 }}>
              Click to Flip <ExternalLink size={14} />
           </div>

           {/* HOVER OVERLAY — slides up from bottom only on hover */}
           <motion.div
             initial={false}
             animate={{ y: isHovered ? '0%' : '100%', opacity: isHovered ? 1 : 0 }}
             transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
             style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(5,8,16,0.98) 0%, rgba(8,12,22,0.92) 100%)', backdropFilter: 'blur(12px)', padding: '28px 32px', borderTop: '1px solid rgba(239,68,68,0.3)' }}
           >
             <h3 style={{ margin: '0 0 10px 0', fontSize: '1.7rem', color: '#fff', fontWeight: 900, letterSpacing: '-0.5px' }}>{project.title}</h3>
             <p style={{ margin: '0 0 16px 0', color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5, fontFamily: 'monospace', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
               {project.desc}
             </p>
             <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
               {project.tags.map(t => (
                 <span key={t} style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#e2e8f0', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>
                   {t.toUpperCase()}
                 </span>
               ))}
             </div>
           </motion.div>
        </div>

        {/* ---------------- BACK OF FLASHCARD ---------------- */}
        <div style={{ 
          gridArea: '1 / 1', 
          backfaceVisibility: 'hidden', 
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(145deg, #0a0f1a, #0d1222)', 
          borderRadius: '16px', 
          border: '1px solid rgba(239, 68, 68, 0.4)',
          padding: '40px',
          boxShadow: 'inset 0 0 50px rgba(239, 68, 68, 0.05), 0 10px 40px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <span style={{ background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 800, fontFamily: 'monospace' }}>CASE #{project.caseNum}</span>
              <h3 style={{ margin: '16px 0 6px 0', fontSize: '2rem', color: '#fff', fontWeight: 900 }}>{project.title}</h3>
              <p style={{ margin: 0, color: '#ef4444', fontFamily: 'monospace', fontSize: '1.05rem' }}>{project.subtitle}</p>
            </div>
            <span className={`status-badge ${project.status}`} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>{project.status.toUpperCase()}</span>
          </div>
          
          <div style={{ background: 'rgba(239,68,68,0.1)', borderLeft: '4px solid #ef4444', padding: '20px', borderRadius: '0 8px 8px 0', marginBottom: '32px' }}>
             <strong style={{ color: '#fff', fontSize: '1rem', display: 'block', marginBottom: '8px' }}>⚡ IMPACT / RESULT:</strong>
             <p style={{ margin: 0, color: '#e2e8f0', fontSize: '1.05rem', lineHeight: 1.6 }}>{project.impact}</p>
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '16px', fontFamily: 'monospace', letterSpacing: '2px' }}>TECHNICAL DOSSIER</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.05rem' }}>
              {project.fullDetails.map((detail, i) => <li key={i} style={{ marginBottom: '12px' }}>{detail}</li>)}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }} onClick={(e) => e.stopPropagation()}>
             {project.live && (
               <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={project.live} target="_blank" rel="noreferrer" style={{ background: '#ef4444', color: '#fff', padding: '14px 28px', borderRadius: '8px', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 5px 20px rgba(239,68,68,0.4)' }}>
                 <ExternalLink size={18} /> OPEN LIVE PLATFORM
               </motion.a>
             )}
             {project.github && (
               <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={project.github} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '14px 28px', borderRadius: '8px', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
                 <GithubIcon size={18} /> ACCESS SOURCE CODE
               </motion.a>
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

      {/* Galaxy Background - Behind Everything */}
      <div className="galaxy-bg">
        <div className="galaxy-core"></div>
        <div className="galaxy-arm galaxy-arm-1"></div>
        <div className="galaxy-arm galaxy-arm-2"></div>
        <div className="galaxy-arm galaxy-arm-3"></div>
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>
      </div>

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

        <section id="skills" style={{ overflow: 'hidden' }}>
          <motion.div className="section-header" style={{ marginBottom: '50px' }} initial={{ opacity: 0, y: 30, rotateX: 20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="section-title skills-title">Arsenal // Technical Skills</h2>
            <span className="section-count">SYSTEM PROFILING COMPLETE</span>
          </motion.div>

          {/* ===== SOLAR SYSTEM — Proper flat circular orbits ===== */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '1000px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Galaxy starfield */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {[...Array(80)].map((_, i) => (
                <motion.div key={`star-${i}`}
                  animate={{ opacity: [0.1, 0.8, 0.1] }}
                  transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: i * 0.04 }}
                  style={{ position: 'absolute', top: `${(i * 13) % 100}%`, left: `${(i * 31) % 100}%`, width: `${(i % 3) + 1}px`, height: `${(i % 3) + 1}px`, background: i % 6 === 0 ? '#ef4444' : '#fff', borderRadius: '50%', boxShadow: `0 0 ${(i % 3) + 2}px ${i % 6 === 0 ? '#ef4444' : '#fff'}` }}
                />
              ))}
            </div>

            {/* Center reference — everything orbits this point */}
            <div style={{ position: 'relative', width: '1000px', height: '1000px', flexShrink: 0 }}>

              {/* ORBIT RINGS — static, always fully visible */}
              {[130, 240, 350, 460].map((r, i) => (
                <div key={`ring-${i}`} style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: r * 2, height: r * 2,
                  marginTop: -r, marginLeft: -r,
                  borderRadius: '50%',
                  border: '2px dashed rgba(239,68,68,0.55)',
                  boxShadow: '0 0 20px rgba(239,68,68,0.2)',
                  pointerEvents: 'none',
                }} />
              ))}

              {/* ORBIT 1 — Core: C++, JS, HTML/CSS — radius 130 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}
              >
                {[
                  { name: 'C++', angle: 0, color: '#00b4d8', icon: <span style={{ color:'#00b4d8', fontWeight:900, fontSize:'1rem', fontFamily:'monospace' }}>C++</span> },
                  { name: 'JavaScript', angle: 120, color: '#f7df1e', icon: <span style={{ color:'#f7df1e', fontWeight:900, fontSize:'1rem', fontFamily:'monospace' }}>JS</span> },
                  { name: 'HTML/CSS', angle: 240, color: '#e34f26', icon: <span style={{ color:'#e34f26', fontWeight:900, fontSize:'1rem', fontFamily:'monospace' }}>{'</>'}</span> },
                ].map(p => {
                  const rad = (p.angle * Math.PI) / 180;
                  return (
                    <div key={p.name} style={{ position: 'absolute', left: Math.cos(rad) * 130, top: Math.sin(rad) * 130, width: 0, height: 0 }}>
                      <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <motion.div whileHover={{ scale: 1.2, boxShadow: `0 0 30px ${p.color}` }}
                          style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5,8,16,0.95)', border: `2.5px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${p.color}55`, cursor: 'default', zIndex: 10 }}>
                          {p.icon}
                        </motion.div>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 800, color: '#fff', background: 'rgba(5,8,16,0.9)', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: `1px solid ${p.color}55` }}>{p.name}</div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              {/* ORBIT 2 — Web Tech: React, Node.js, Tailwind, REST APIs — radius 240 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}
              >
                {[
                  { name: 'React', angle: 60, color: '#61dafb', icon: <svg width="26" height="26" viewBox="0 0 100 100"><circle cx="50" cy="50" r="11" fill="#61dafb"/><ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke="#61dafb" strokeWidth="5"/><ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke="#61dafb" strokeWidth="5" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke="#61dafb" strokeWidth="5" transform="rotate(120 50 50)"/></svg> },
                  { name: 'Node.js', angle: 150, color: '#68a063', icon: <svg width="26" height="26" viewBox="0 0 256 289"><path fill="#68a063" d="M128 0L0 74v141l128 74 128-74V74z"/><path fill="#fff" d="M128 25l103 59.5v119L128 263 25 183.5v-119z"/><path fill="#68a063" d="M128 230l80-46v-92l-80 46z"/></svg> },
                  { name: 'Tailwind', angle: 240, color: '#38bdf8', icon: <svg width="26" height="26" viewBox="0 0 54 33"><path fill="#38bdf8" d="M27.5 0c-7.3 0-11.8 3.6-13.6 10.8 2.7-3.6 5.9-4.9 9.6-4 2 .5 3.5 2 5.1 3.6 2.7 2.7 5.7 5.8 12.4 5.8 7.3 0 11.8-3.6 13.6-10.8-2.7 3.6-5.9 4.9-9.6 4-2-.5-3.5-2-5.1-3.6-2.7-2.7-5.7-5.8-12.4-5.8zM13.8 16.2c-7.3 0-11.8 3.6-13.6 10.8 2.7-3.6 5.9-4.9 9.6-4 2 .5 3.5 2 5.1 3.6 2.7 2.7 5.7 5.8 12.4 5.8 7.3 0 11.8-3.6 13.6-10.8-2.7 3.6-5.9 4.9-9.6 4-2-.5-3.5-2-5.1-3.6-2.7-2.7-5.7-5.8-12.4-5.8z"/></svg> },
                  { name: 'REST APIs', angle: 330, color: '#ff6b35', icon: <Globe size={22} color="#ff6b35" /> },
                ].map(p => {
                  const rad = (p.angle * Math.PI) / 180;
                  return (
                    <div key={p.name} style={{ position: 'absolute', left: Math.cos(rad) * 240, top: Math.sin(rad) * 240, width: 0, height: 0 }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <motion.div whileHover={{ scale: 1.2, boxShadow: `0 0 30px ${p.color}` }}
                          style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5,8,16,0.95)', border: `2.5px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${p.color}55`, cursor: 'default' }}>
                          {p.icon}
                        </motion.div>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 800, color: '#fff', background: 'rgba(5,8,16,0.9)', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: `1px solid ${p.color}55` }}>{p.name}</div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              {/* ORBIT 3 — Databases: MongoDB, Firebase — radius 350 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}
              >
                {[
                  { name: 'MongoDB', angle: 15, color: '#47a248', icon: <Database size={24} color="#47a248" /> },
                  { name: 'Firebase', angle: 195, color: '#ffca28', icon: <Database size={24} color="#ffca28" /> },
                ].map(p => {
                  const rad = (p.angle * Math.PI) / 180;
                  return (
                    <div key={p.name} style={{ position: 'absolute', left: Math.cos(rad) * 350, top: Math.sin(rad) * 350, width: 0, height: 0 }}>
                      <motion.div animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <motion.div whileHover={{ scale: 1.2, boxShadow: `0 0 30px ${p.color}` }}
                          style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5,8,16,0.95)', border: `2.5px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${p.color}55`, cursor: 'default' }}>
                          {p.icon}
                        </motion.div>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 800, color: '#fff', background: 'rgba(5,8,16,0.9)', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: `1px solid ${p.color}55` }}>{p.name}</div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              {/* ORBIT 4 — Tools: Git, GitHub, Vercel — radius 460 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}
              >
                {[
                  { name: 'Git', angle: 100, color: '#f05032', icon: <svg width="24" height="24" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#f05032"/><path fill="#fff" d="M27.3 14.7l-10-10a1.9 1.9 0 0 0-2.7 0l-2.1 2.1 2.7 2.7a2.3 2.3 0 0 1 2.9 2.9l2.6 2.6a2.3 2.3 0 1 1-1.4 1.4l-2.4-2.4v6.3a2.3 2.3 0 1 1-1.9 0v-6.4a2.3 2.3 0 0 1-1.2-3l-2.7-2.6-7.2 7.2a1.9 1.9 0 0 0 0 2.7l10 10a1.9 1.9 0 0 0 2.7 0l10-10a1.9 1.9 0 0 0 0-2.8z"/></svg> },
                  { name: 'GitHub', angle: 220, color: '#e2e8f0', icon: <GithubIcon size={24} /> },
                  { name: 'Vercel', angle: 340, color: '#ffffff', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2L22 19.7H2L12 2z"/></svg> },
                ].map(p => {
                  const rad = (p.angle * Math.PI) / 180;
                  return (
                    <div key={p.name} style={{ position: 'absolute', left: Math.cos(rad) * 460, top: Math.sin(rad) * 460, width: 0, height: 0 }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <motion.div whileHover={{ scale: 1.2, boxShadow: `0 0 30px ${p.color}` }}
                          style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5,8,16,0.95)', border: `2.5px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${p.color}44`, cursor: 'default' }}>
                          {p.icon}
                        </motion.div>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 800, color: '#fff', background: 'rgba(5,8,16,0.9)', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: `1px solid ${p.color}44` }}>{p.name}</div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              {/* CENTER — SKILLS SUN */}
              <motion.div
                animate={{ boxShadow: ['0 0 20px rgba(239,68,68,0.4)', '0 0 60px rgba(239,68,68,0.8)', '0 0 20px rgba(239,68,68,0.4)'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, borderRadius: '50%' }}
              >
                <motion.div whileHover={{ scale: 1.15, rotate: 90 }} transition={{ type: 'spring', stiffness: 300 }}
                  style={{ background: 'linear-gradient(135deg, #1a0005, #0f0f1a)', border: '2px solid rgba(239,68,68,0.8)', borderRadius: '50%', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 20px rgba(239,68,68,0.3)', cursor: 'default' }}>
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{ fontSize: '0.8rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '2px', color: '#ef4444', textShadow: '0 0 10px rgba(239,68,68,0.8)' }}>
                    SKILLS
                  </motion.div>
                </motion.div>
                
                {/* Floating orbit ring around the center */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -15, border: '1px solid rgba(239,68,68,0.5)', borderRadius: '50%', borderTopColor: 'transparent', borderBottomColor: 'transparent', pointerEvents: 'none' }} />
              </motion.div>

            </div>
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

          {/* Horizontal scroll carousel */}
          <style>{`
            .projects-scroll::-webkit-scrollbar { height: 6px; }
            .projects-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 3px; }
            .projects-scroll::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.5); border-radius: 3px; }
            .projects-scroll::-webkit-scrollbar-thumb:hover { background: rgba(239,68,68,0.8); }
          `}</style>
          <div className="projects-scroll" style={{ display: 'flex', flexDirection: 'row', gap: '32px', overflowX: 'auto', overflowY: 'visible', paddingBottom: '20px', position: 'relative', zIndex: 2, scrollSnapType: 'x mandatory' }}>
            {projects.map((p, i) => <div key={p.caseNum} style={{ flexShrink: 0, width: '520px', scrollSnapAlign: 'start' }}><CaseCard project={p} index={i} /></div>)}
          </div>
        </section>

        <section id="education" style={{ padding: '60px 0' }}>
          <motion.div className="section-header" style={{ marginBottom: '40px' }} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, type: 'spring' }}>
            <h2 className="section-title edu-title">Education</h2>
            <span className="section-count">3 RECORDS</span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {[
              {
                year: '2025 – 2029', degree: 'B.Tech in Computer Science & Engineering',
                short: 'B.TECH CSE', institution: 'UVCE, Bengaluru',
                grade: '9.64', gradeLabel: 'CGPA', color: '#ff3333', accentLight: '#ff6666',
                image: '/uvce.jpg', status: 'ACTIVE',
              },
              {
                year: '2023 – 2025', degree: 'Pre-University (Science — PCMB)',
                short: 'PUC', institution: 'Presidency PU College, Sira',
                grade: '98.17%', gradeLabel: 'SCORE', color: '#3b82f6', accentLight: '#60a5fa',
                image: '/presidency.png', status: 'COMPLETED',
              },
              {
                year: '2023', degree: 'Secondary School (SSLC)',
                short: 'SSLC', institution: 'Jnanavardhaka Vidya Mandira, Chelur',
                grade: '98.04%', gradeLabel: 'SCORE', color: '#10b981', accentLight: '#34d399',
                image: '/venus.jpg', status: 'COMPLETED',
              },
            ].map((item, i) => (
              <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, type: 'spring', stiffness: 90 }}
                whileHover={{ y: -10, scale: 1.02 }}
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: 'rgba(8, 12, 24, 0.9)',
                  border: `1px solid ${item.color}44`,
                  boxShadow: `0 4px 30px rgba(0,0,0,0.4)`,
                  backdropFilter: 'blur(16px)',
                  cursor: 'default',
                  transition: 'box-shadow 0.35s ease',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.6), 0 0 40px ${item.color}33`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)')}
              >
                {/* Animated top gradient bar */}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${item.color}, ${item.accentLight}, ${item.color}, transparent)`, zIndex: 2 }}
                />

                {/* Background glow blob */}
                <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, ${item.color}18 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1, padding: '36px 30px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                  {/* Status chip */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <motion.span
                      animate={{ opacity: item.status === 'ACTIVE' ? [0.6, 1, 0.6] : 1 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ fontSize: '0.6rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px', color: item.color, background: `${item.color}18`, border: `1px solid ${item.color}44`, padding: '2px 8px', borderRadius: '4px' }}
                    >
                      {item.status === 'ACTIVE' && <span style={{ marginRight: 4 }}>●</span>}{item.status}
                    </motion.span>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)', letterSpacing: '1px' }}>{item.year}</span>
                  </div>

                  {/* Image with glowing ring */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <motion.div
                      animate={{ boxShadow: [`0 0 0 3px ${item.color}33`, `0 0 0 6px ${item.color}22`, `0 0 0 3px ${item.color}33`] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${item.color}88`, background: '#0a0f1a', flexShrink: 0 }}
                    >
                      <img src={item.image} alt={item.institution} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                  </div>

                  {/* Short label */}
                  <div style={{ textAlign: 'center', fontSize: '0.72rem', fontFamily: 'monospace', color: item.color, letterSpacing: '3px', fontWeight: 700, marginBottom: '10px' }}>{item.short}</div>

                  {/* Degree */}
                  <div style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4, marginBottom: '10px' }}>{item.degree}</div>

                  {/* Institution */}
                  <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '24px' }}>{item.institution}</div>

                  {/* Spacer to push grade down */}
                  <div style={{ flex: 1 }} />

                  {/* Divider */}
                  <div style={{ height: '1px', background: `linear-gradient(to right, transparent, ${item.color}55, transparent)`, marginBottom: '16px' }} />

                  {/* Grade */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'var(--text-muted)', letterSpacing: '2px' }}>{item.gradeLabel}</span>
                    <motion.span
                      animate={{ textShadow: [`0 0 8px ${item.color}`, `0 0 16px ${item.color}`, `0 0 8px ${item.color}`] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      style={{ fontSize: '1.7rem', fontWeight: 900, fontFamily: 'monospace', color: item.color }}
                    >
                      {item.grade}
                    </motion.span>
                  </div>
                </div>

                {/* Bottom corner decoration */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', borderRight: `1px solid ${item.color}33`, borderTop: `1px solid ${item.color}33`, borderRadius: '0 8px 0 0', opacity: 0.6 }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderLeft: `1px solid ${item.color}33`, borderTop: `1px solid ${item.color}33`, borderRadius: '8px 0 0 0', opacity: 0.6 }} />
              </motion.div>

              {/* Premium Connecting Data Stream */}
              {i < 2 && (
                <div
                  style={{
                    position: 'absolute', top: '50%', right: '-28px', transform: 'translateY(-50%)',
                    width: '28px', height: '2px', zIndex: 0, overflow: 'hidden'
                  }}
                >
                  {/* Track line */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)' }} />
                  
                  {/* Glowing data packet traveling across */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
                    style={{
                      position: 'absolute', top: '-1px', bottom: '-1px', width: '14px',
                      background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                      filter: `drop-shadow(0 0 6px ${item.color})`
                    }}
                  />
                  
                  {/* Pulsing end nodes */}
                  <div style={{ position: 'absolute', left: 0, top: '-1.5px', width: '5px', height: '5px', borderRadius: '50%', background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                  <div style={{ position: 'absolute', right: 0, top: '-1.5px', width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                </div>
              )}
            </div>
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
          {/* Custom Styles for high-josh inputs */}
          <style>{`
            .cyber-input {
              background: rgba(255,255,255,0.03);
              border: 1px solid rgba(255,255,255,0.1);
              color: #fff;
              padding: 16px 18px;
              border-radius: 12px;
              transition: all 0.3s ease;
              font-family: monospace;
              font-size: 0.95rem;
              outline: none;
              width: 100%;
              box-sizing: border-box;
            }
            .cyber-input:focus {
              background: rgba(239, 68, 68, 0.05);
              border-color: #ef4444;
              box-shadow: 0 0 25px rgba(239, 68, 68, 0.4), inset 0 0 15px rgba(239, 68, 68, 0.2);
            }
            .cyber-input::placeholder {
              color: rgba(255,255,255,0.3);
            }
            .cyber-channel {
              position: relative;
              overflow: hidden;
            }
            .cyber-channel::after {
              content: '';
              position: absolute;
              top: 0; left: -150%; width: 50%; height: 100%;
              background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
              transform: skewX(-20deg);
              transition: all 0.6s ease;
            }
            .cyber-channel:hover::after {
              left: 200%;
            }
          `}</style>

          {/* Huge Background Text */}
          <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translate(-50%, 0)', fontSize: '18vw', fontWeight: 900, color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.03)', whiteSpace: 'nowrap', zIndex: 0, pointerEvents: 'none', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em' }}>
            C O N T A C T
          </div>

          {/* Animated rings in background */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.04, 0.1, 0.04] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', borderRadius: '50%', border: '1px solid #ef4444', zIndex: 0, pointerEvents: 'none' }}
          />
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.03, 0.07, 0.03] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px', borderRadius: '50%', border: '1px solid #3b82f6', zIndex: 0, pointerEvents: 'none' }}
          />

          <motion.div className="contact-section" style={{ position: 'relative', zIndex: 1, background: 'transparent', boxShadow: 'none', maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '60px' }}>
              <motion.h2 className="section-title contact-title" style={{ marginBottom: 12, fontSize: '3.5rem', textAlign: 'center' }} animate={{ textShadow: ['0 0 10px #ef4444', '0 0 25px #ef4444', '0 0 10px #ef4444'] }} transition={{ duration: 2, repeat: Infinity }}>Establish Contact</motion.h2>
              <p className="contact-desc" style={{ maxWidth: '520px', margin: '0 auto', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.6, color: '#94a3b8' }}>
                "Open to internships, collaborations &amp; AI/Web dev opportunities. Drop a message."
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px', width: '100%', alignItems: 'stretch' }}>
              {/* Left: Contact Form — compact & wide */}
              <motion.div
                style={{ padding: '32px 36px', borderRadius: '24px', background: 'rgba(10, 15, 24, 0.8)', backdropFilter: 'blur(24px)', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 60px rgba(239,68,68,0.05)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                whileHover={{ boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 50px rgba(239,68,68,0.15), inset 0 0 60px rgba(239,68,68,0.1)' }}
                transition={{ duration: 0.4 }}
              >
                {/* Animated top bar */}
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ position: 'absolute', top: 0, left: '5%', width: '90%', height: '1px', background: 'linear-gradient(to right, transparent, #a30000, #ff4444, #a30000, transparent)' }}
                />
                {/* Grid overlay bg */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(163,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(163,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* 2-col row: NAME + EMAIL */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.75rem', color: '#ef4444', fontWeight: 800 }}><User size={12} /> NAME</label>
                      <input type="text" className="cyber-input" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.75rem', color: '#ef4444', fontWeight: 800 }}><Mail size={12} /> EMAIL</label>
                      <input type="email" className="cyber-input" placeholder="your.email@example.com" />
                    </div>
                  </div>

                  {/* TOPIC */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.75rem', color: '#ef4444', fontWeight: 800 }}><FileText size={12} /> TOPIC</label>
                    <input type="text" className="cyber-input" placeholder="What's this about?" />
                  </div>

                  {/* MESSAGE — flex grow to fill remaining space */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.75rem', color: '#ef4444', fontWeight: 800 }}><FileText size={12} /> MESSAGE</label>
                    <textarea className="cyber-input" placeholder="Detail your project or opportunity..." style={{ flex: 1, resize: 'none', minHeight: '120px' }} />
                  </div>

                  <motion.button className="form-submit" 
                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)' }}
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(239, 68, 68, 0.6)' }} whileTap={{ scale: 0.98 }}
                    onClick={(e) => { e.preventDefault(); alert('Transmission sent! Eshwar will respond shortly.'); }}
                  >
                    <Zap size={18} /> TRANSMIT SIGNAL
                  </motion.button>
                </div>
              </motion.div>

              {/* Right: Direct Channels — stretched to same height */}
              <div style={{ padding: '32px 30px', borderRadius: '24px', background: 'rgba(10, 15, 24, 0.8)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 60px rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                {/* Animated top bar */}
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3], scaleX: [0.7, 1, 0.7] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  style={{ position: 'absolute', top: 0, left: '5%', width: '90%', height: '1px', background: 'linear-gradient(to right, transparent, #3b82f6, #0a66c2, #3b82f6, transparent)' }}
                />

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'monospace', color: '#94a3b8', letterSpacing: '4px', textAlign: 'center', marginBottom: '8px' }}>— DIRECT CHANNELS —</div>
                  <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)' }} />
                </div>

                {/* Channels — evenly spaced to fill height */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: '16px' }}>
                  {[
                    { icon: <Mail size={24} />, label: 'EMAIL', value: 'eshwarhs170@gmail.com', href: 'mailto:eshwarhs170@gmail.com', color: '#ef4444' }, // changed email color to match theme!
                    { icon: <GithubIcon size={24} />, label: 'GITHUB', value: 'github.com/eshwarhs170-a11y', href: 'https://github.com/eshwarhs170-a11y', color: '#fff' },
                    { icon: <LinkedinIcon size={24} />, label: 'LINKEDIN', value: 'linkedin.com/in/eshwar-h-s', href: 'https://www.linkedin.com/in/eshwar-h-s-4b820638a', color: '#0a66c2' },
                  ].map((ch) => (
                    <motion.a
                      key={ch.label}
                      href={ch.href}
                      target="_blank"
                      rel="noreferrer"
                      className="cyber-channel"
                      whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${ch.color}33`, borderColor: ch.color }}
                      style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px', background: `linear-gradient(135deg, rgba(255,255,255,0.03), ${ch.color}11)`, border: `1px solid rgba(255,255,255,0.08)`, borderLeft: `4px solid ${ch.color}`, borderRadius: '16px', textDecoration: 'none', color: 'var(--text-main)', transition: 'all 0.3s ease', flex: 1 }}
                    >
                      <motion.span
                        style={{ color: ch.color, filter: `drop-shadow(0 0 12px ${ch.color}99)`, flexShrink: 0 }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: Math.random() }}
                      >{ch.icon}</motion.span>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '3px', color: ch.color, marginBottom: '6px' }}>{ch.label}</div>
                        <div style={{ fontSize: '0.95rem', color: '#f1f5f9', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.value}</div>
                      </div>
                      <ExternalLink size={16} style={{ color: ch.color, opacity: 0.6, flexShrink: 0 }} />
                    </motion.a>
                  ))}
                </div>
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
