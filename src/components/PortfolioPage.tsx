import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
  Folder, FileText, User, Mail, Code, Shield, Database,
  ChevronRight, Zap, Globe, Award, Cpu, Wifi,
  Radio, Server, Phone, MapPin, X,
  ExternalLink, BookOpen
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
  return <span>{text}</span>;
}

function FloatingParticles() {
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, duration: Math.random() * 10 + 8, delay: Math.random() * 5,
  })), []);
  return (
    <div className="particles-container" aria-hidden>
      {particles.map((p) => (
        <motion.div key={p.id} className="particle"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-20, 20, -20], opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
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
        <motion.div className="skill-bar-fill" initial={{ width: 0 }} whileInView={{ width: `${level}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: delay + 0.2, ease: 'easeOut' }} />
      </div>
    </motion.div>
  );
}

function RadarDisplay() {
  const segs = [
    { label: 'Full-Stack Development', value: 94, color: '#a30000' },
    { label: 'AI & Machine Learning', value: 90, color: '#cc4400' },
    { label: 'Database Engineering', value: 88, color: '#10b981' },
    { label: 'System Programming', value: 85, color: '#3b82f6' },
    { label: 'UI/UX & Animations', value: 86, color: '#8b5cf6' },
    { label: 'Cloud & Serverless', value: 89, color: '#f59e0b' },
  ];
  return (
    <div className="radar-display">
      <div className="radar-title"><Radio size={12} /> PROFICIENCY MATRIX</div>
      <div className="radar-bars">
        {segs.map((s, i) => (
          <motion.div key={s.label} className="radar-bar-row"
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          >
            <span className="radar-label">{s.label}</span>
            <div className="radar-bar-track">
              <motion.div className="radar-bar-fill" initial={{ width: 0 }} whileInView={{ width: `${s.value}%` }} viewport={{ once: true }}
                transition={{ duration: 1.1, delay: i * 0.1 + 0.3 }} style={{ background: `linear-gradient(to right, ${s.color}88, ${s.color})` }} />
            </div>
            <span className="radar-value" style={{ color: s.color }}>{s.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CaseCard({ project, onClick, delay }: { project: ProjectData; onClick: () => void; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div className="case-card"
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay }} whileHover={{ y: -10, scale: 1.02 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      onClick={onClick} style={{ cursor: 'pointer' }}
    >
      <div className="case-num">{project.caseNum}</div>
      <div className="case-card-header">
        <motion.div className="case-icon" animate={{ rotate: hovered ? 12 : 0, scale: hovered ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          {project.icon}
        </motion.div>
        <span className={`status-badge ${project.status}`}>{project.status.toUpperCase()}</span>
      </div>
      {project.image && (
        <div className="case-image-preview" style={{ margin: '12px 0', borderRadius: '6px', overflow: 'hidden', height: '140px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: hovered ? 'contrast(1.15) brightness(1.05)' : 'grayscale(0.2)' }} />
          <div style={{ position: 'absolute', bottom: 6, right: 8, background: 'rgba(0,0,0,0.75)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#ffd700', fontFamily: 'monospace' }}>EVIDENCE EXHIBIT</div>
        </div>
      )}
      <h4>{project.title}</h4>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{project.desc}</p>
      <div style={{ margin: '8px 0', fontSize: '0.78rem', color: 'var(--red)', fontWeight: 600 }}>⚡ {project.impact}</div>
      <div className="case-tags">{project.tags.map(t => <span key={t} className="case-tag">{t}</span>)}</div>
      <motion.div className="case-link" animate={{ x: hovered ? 6 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
        <ChevronRight size={14} /> View Declassified File
      </motion.div>
      <motion.div className="case-card-glow" animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }} />
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
      image: '/nammaugneet.jpg', github: 'https://github.com/eshwarhs',
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
      image: '/gramsetu.jpg', github: 'https://github.com/eshwarhs',
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
    { year: '2025 – 2029', degree: 'B.E. in Computer Science & Engineering', institution: 'University Visvesvaraya College of Engineering (UVCE), Bengaluru', detail: 'Currently in 2nd Year. CGPA: 9.64 / 10.0', grade: '9.64', icon: <Award size={18} />, color: '#a30000' },
    { year: '2025', degree: 'Pre-University (Science — PCMB)', institution: 'SJES PU College, Bengaluru', detail: 'Karnataka State Board. Percentage: 97.33%', grade: '97.33%', icon: <BookOpen size={18} />, color: '#3b82f6' },
    { year: '2023', degree: 'Secondary School (SSLC)', institution: 'Kendriya Vidyalaya, Bengaluru', detail: 'CBSE Board. Percentage: 94.2%', grade: '94.2%', icon: <FileText size={18} />, color: '#10b981' },
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
      <header className="portfolio-header">
        <div className="header-brand"><Folder className="brand-icon" size={20} /><GlitchText text="ESHWAR H S // DOSSIER" /></div>
        <nav>
          {navLinks.map(link => (
            <a key={link.id} href={link.href} className={activeSection === link.id ? 'nav-active' : ''}>{link.label}</a>
          ))}
        </nav>
        <div className="header-right">
          <motion.div className="live-indicator" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
            <span className="live-dot-sm" /> ACTIVE
          </motion.div>
          <ThemeToggle />
        </div>
      </header>

      <main className="portfolio-content">

        <section id="home">
          <motion.div className="hero-section" style={{ opacity: heroOpacity, scale: heroScale }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="hero-text" style={{ position: 'relative' }}>
              <motion.div className="redacted-label" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }}>
                ▲ FULL-STACK & AI DEVELOPER
              </motion.div>
              <h1 className="hero-name"><GlitchText text="Eshwar H S" /></h1>
              <h2 className="hero-role">Developer &amp; AI Engineer</h2>
              <p className="hero-bio">
                Every complex problem leaves a trail. I follow the evidence — and build the solution.
                Specializing in <strong>Full-Stack Development</strong> and <strong>AI Integration</strong>,
                turning real-world challenges into production-ready applications.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', margin: '16px 0', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '4px' }}><MapPin size={13} color="#a30000" /> Bengaluru, Karnataka</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '4px' }}><Award size={13} color="#ffd700" /> UVCE BE CSE · CGPA 9.64</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '4px' }}><Mail size={13} color="#3b82f6" /> eshwarhs170@gmail.com</span>
              </div>
              <div className="hero-actions">
                <div className="hero-status"><span className="live-dot" /> Open for Internships &amp; Dev Roles</div>
                <div className="hero-socials">
                  <a href="https://github.com/eshwarhs" target="_blank" rel="noreferrer" className="social-link" title="GitHub"><GithubIcon size={16} /></a>
                  <a href="https://linkedin.com/in/eshwarhs" target="_blank" rel="noreferrer" className="social-link" title="LinkedIn"><LinkedinIcon size={16} /></a>
                  <a href="mailto:eshwarhs170@gmail.com" className="social-link" title="Email"><Mail size={16} /></a>
                </div>
              </div>
              <motion.div className="hero-stamp" animate={{ rotate: [-3, 0, -3], opacity: [0.6, 0.85, 0.6] }} transition={{ duration: 5, repeat: Infinity }}>VERIFIED ENGINEER</motion.div>
            </div>

            <motion.div className="id-card" style={{ rotateX: springY, rotateY: springX, transformStyle: 'preserve-3d' }} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 200 }}>
              <div className="id-card-top">
                <span className="id-card-label">DEVELOPER PORTFOLIO</span>
                <span className="id-card-level">CSE // UVCE</span>
              </div>
              <div className="id-photo" style={{ padding: 0, overflow: 'hidden', background: 'none', height: '200px' }}>
                <img src="/id_photo.jpg" alt="Eshwar H S" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
                <div className="id-scan-line" />
                <div className="id-corner id-corner-tl" />
                <div className="id-corner id-corner-br" />
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

          <div className="stats-row">
            {[
              { val: 1200, suf: '+', label: 'Users Served', icon: <User size={18} /> },
              { val: 9.64, suf: '', label: 'CGPA at UVCE', icon: <Award size={18} />, decimals: 2 },
              { val: 129, suf: 'k+', label: 'Records Processed', icon: <Database size={18} /> },
              { val: 3, suf: '+', label: 'Projects Shipped', icon: <Cpu size={18} /> },
            ].map((s, i) => (
              <motion.div key={i} className="stat-box" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.08 }}>
                <motion.div className="stat-icon" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, delay: i, repeat: Infinity }}>{s.icon}</motion.div>
                <span className="stat-value"><Counter target={s.val} suffix={s.suf} decimals={s.decimals} /></span>
                <span className="stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="skills">
          <motion.h2 className="section-title skills-title" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>Technical Skills</motion.h2>
          <div className="skills-layout">
            <div className="skill-bars">{skillBars.map((s, i) => <SkillBar key={s.name} {...s} delay={i * 0.1} />)}</div>
            <div className="skills-chips-col">
              <div className="skills-grid">
                {skillsList.map((skill, i) => (
                  <motion.div key={skill} className="skill-chip"
                    initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    whileHover={{ scale: 1.15, borderColor: 'var(--red)', color: 'var(--off-white)', boxShadow: '0 0 12px var(--red-glow)' }}
                  >{skill}</motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="radar-section" style={{ marginTop: '30px' }}><RadarDisplay /></div>
        </section>

        <section id="projects">
          <motion.div className="section-header" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="section-title proj-title">Featured Projects</h2>
            <span className="section-count">{projects.length} RECENT WORKS</span>
          </motion.div>
          <div className="cases-grid">
            {projects.map((p, i) => <CaseCard key={p.caseNum} project={p} delay={i * 0.15} onClick={() => setSelectedProject(p)} />)}
          </div>
        </section>

        <section id="education">
          <motion.h2 className="section-title edu-title" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>Education & Journey</motion.h2>
          <div className="timeline">
            {education.map((item, i) => (
              <motion.div key={i} className="timeline-item"
                initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }} whileHover={{ x: 8 }}
              >
                <div className="timeline-year">{item.year}</div>
                <motion.div className="timeline-dot"
                  whileInView={{ scale: [0, 1.4, 1] }} viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.2, duration: 0.4 }}
                  style={{ borderColor: item.color, background: `${item.color}22` }}
                >
                  <div className="timeline-dot-icon" style={{ color: item.color }}>{item.icon}</div>
                </motion.div>
                <div className="timeline-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h4>{item.degree}</h4>
                    <span style={{ background: `${item.color}22`, border: `1px solid ${item.color}66`, color: item.color, padding: '2px 10px', borderRadius: '3px', fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{item.grade}</span>
                  </div>
                  <span className="timeline-place">{item.institution}</span>
                  <p>{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact">
          <motion.div className="contact-section" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title contact-title" style={{ marginBottom: 12 }}>Get In Touch</h2>
            <p className="contact-desc">Looking to collaborate or recruit? Feel free to reach out.</p>
            <div className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label"><User size={10} style={{ marginRight: 5 }} />YOUR NAME</label>
                  <input type="text" className="form-input" placeholder="Your name or organization" />
                </div>
                <div className="form-group">
                  <label className="form-label"><Mail size={10} style={{ marginRight: 5 }} />EMAIL ADDRESS</label>
                  <input type="email" className="form-input" placeholder="your.email@example.com" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label"><FileText size={10} style={{ marginRight: 5 }} />MESSAGE</label>
                <textarea className="form-input form-textarea" placeholder="Detail your project or opportunity..." rows={4} />
              </div>
              <motion.button className="form-submit" whileHover={{ scale: 1.04, boxShadow: '0 0 40px var(--red-glow)' }} whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.preventDefault(); alert('Transmission sent! Eshwar will respond shortly.'); }}
              >
                <Zap size={14} style={{ marginRight: 8 }} /> TRANSMIT SIGNAL
              </motion.button>
            </div>
            <div className="contact-divider">— DIRECT CHANNELS —</div>
            <div className="contact-terminal">
              <Mail size={14} style={{ marginRight: 6, color: '#00ffcc' }} />
              <span>eshwarhs170@gmail.com</span>
              <span className="term-cursor">_</span>
            </div>
            <div className="contact-actions">
              <a href="mailto:eshwarhs170@gmail.com" className="contact-btn"><Mail size={16} /> SEND EMAIL</a>
              <a href="tel:+918904540775" className="contact-btn contact-btn-ghost"><Phone size={16} /> CALL</a>
              <a href="https://github.com/eshwarhs" target="_blank" rel="noreferrer" className="contact-btn contact-btn-ghost"><GithubIcon size={16} /> GITHUB</a>
            </div>
          </motion.div>
        </section>

      </main>

      <footer className="portfolio-footer">
        <div className="footer-left"><Folder size={14} /><span>ESHWAR H S — DETECTIVE DOSSIER © 2026</span></div>
        <motion.div className="footer-status" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="live-dot-sm" /> SYSTEM ONLINE
        </motion.div>
        <span className="footer-mono">BENGALURU, KA // ALL RIGHTS RESERVED</span>
      </footer>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
