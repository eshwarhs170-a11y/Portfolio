import { useEffect, useState } from 'react';
import CyberProfileImage from './CyberProfileImage';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Folder, FileText, User, Mail, Shield,
  Zap, Award, X, ExternalLink
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



function CaseCard({ project, index }: { project: ProjectData; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      style={{ width: '100%', position: 'relative', cursor: 'pointer', perspective: '1200px' }}
      onClick={() => setFlipped(f => !f)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
      >
        {/* ===== FRONT FACE ===== */}
        <div style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'rgba(4,6,14,0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        }}>

          {/* ── BROWSER-STYLE TOP BAR ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 18px',
            background: 'rgba(8,12,24,0.98)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            {/* Left: traffic dots + case + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* macOS-style dots */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.7)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px rgba(245,158,11,0.5)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
              </div>
              <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: '#ef4444', fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 700 }}>{project.caseNum}</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>|</span>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{project.title}</span>
            </div>

            {/* Right: Live + Code buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                  style={{ background: 'rgba(239,68,68,0.92)', padding: '5px 14px', borderRadius: '6px', color: '#fff', fontSize: '0.72rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ExternalLink size={11} /> Live
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                  style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', padding: '5px 14px', borderRadius: '6px', color: '#fff', fontSize: '0.72rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <GithubIcon size={11} /> Code
                </a>
              )}
            </div>
          </div>

          {/* ── IMAGE VIEWPORT ── */}
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#03050d' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >

            {/* FULL IMAGE */}
            <img src={project.image} alt={project.title} style={{ width: '100%', height: 'auto', display: 'block' }} />

            {/* HOVER BOTTOM BAR */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15,
              background: 'linear-gradient(to top, rgba(3,5,12,0.98) 40%, rgba(3,5,12,0.7) 75%, transparent)',
              padding: '28px 20px 14px',
              transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}>
              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.83rem', lineHeight: 1.55, fontFamily: 'monospace' }}>{project.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                {project.tags.map(t => <span key={t} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.67rem', color: '#ef4444', fontFamily: 'monospace' }}>{t}</span>)}
              </div>
              <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.28)', fontSize: '0.63rem', fontFamily: 'monospace' }}>[ CLICK TO FLIP & VIEW FULL DETAILS ]</p>
            </div>
          </div>
        </div>


        {/* ===== BACK FACE ===== */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(160deg, #070d1f 0%, #0a1228 50%, #06090f 100%)',
          border: '1px solid rgba(239,68,68,0.35)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 0 60px rgba(239,68,68,0.12)',
        }}>
          {/* ── Top accent bar ── */}
          <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #ef4444, #ffd700, #ef4444, transparent)' }} />

          {/* ── Content ── */}
          <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>

            {/* Badges row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: 'linear-gradient(135deg, #a30000, #ef4444)', color: '#fff', fontSize: '0.65rem', padding: '4px 12px', borderRadius: '4px', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '1.5px', boxShadow: '0 0 12px rgba(239,68,68,0.4)' }}>CASE FILE {project.caseNum}</span>
              <span style={{ color: project.status === 'solved' ? '#22c55e' : '#f59e0b', fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 700, border: `1px solid ${project.status === 'solved' ? 'rgba(34,197,94,0.5)' : 'rgba(245,158,11,0.5)'}`, padding: '3px 10px', borderRadius: '4px', background: project.status === 'solved' ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)', letterSpacing: '1px' }}>{project.status.toUpperCase()}</span>
            </div>

            {/* Title block */}
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: '2rem', fontWeight: 900, lineHeight: 1.1, background: 'linear-gradient(135deg, #ffffff 40%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.title}</h2>
              <p style={{ margin: 0, color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.3px' }}>{project.subtitle}</p>
            </div>

            {/* Impact box */}
            <div style={{ background: 'linear-gradient(135deg, rgba(163,0,0,0.15), rgba(239,68,68,0.05))', borderLeft: '3px solid #ef4444', borderRadius: '0 8px 8px 0', padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 6px #ffd700' }} />
                <strong style={{ color: '#ffd700', fontSize: '0.68rem', letterSpacing: '2px', fontFamily: 'monospace' }}>IMPACT</strong>
              </div>
              <p style={{ margin: 0, color: '#f1f5f9', fontSize: '0.9rem', lineHeight: 1.6 }}>{project.impact}</p>
            </div>

            {/* Tech breakdown */}
            <div>
              <p style={{ margin: '0 0 10px', color: 'rgba(255,255,255,0.35)', fontSize: '0.63rem', fontFamily: 'monospace', letterSpacing: '2px' }}>TECHNICAL BREAKDOWN</p>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {project.fullDetails.map((d, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.7rem', marginTop: '4px', flexShrink: 0 }}>▸</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {project.tags.map((t, i) => (
                <span key={t} style={{
                  background: i % 3 === 0 ? 'rgba(239,68,68,0.1)' : i % 3 === 1 ? 'rgba(56,189,248,0.08)' : 'rgba(255,215,0,0.07)',
                  border: `1px solid ${i % 3 === 0 ? 'rgba(239,68,68,0.3)' : i % 3 === 1 ? 'rgba(56,189,248,0.25)' : 'rgba(255,215,0,0.2)'}`,
                  padding: '3px 10px', borderRadius: '4px', fontSize: '0.72rem',
                  color: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#38bdf8' : '#fcd34d',
                  fontFamily: 'monospace'
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* ── Bottom CTA bar ── */}
          <div style={{ padding: '16px 32px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {project.github && <a href={project.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '8px 18px', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}><GithubIcon size={14} /> Repository</a>}
              {project.live && <a href={project.live} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(185,28,28,0.9))', border: '1px solid rgba(239,68,68,0.5)', padding: '8px 18px', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 0 16px rgba(239,68,68,0.3)' }}><ExternalLink size={14} /> Live Demo</a>}
            </div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.22)', fontSize: '0.62rem', fontFamily: 'monospace' }}>[ CLICK TO FLIP BACK ]</p>
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

  // Removed skillBars, skillsList, education as they are unused right now

  const navLinks = [
    { href: '#home', label: 'Home', id: 'home' },
    { href: '#skills', label: 'Skills', id: 'skills' },
    { href: '#projects', label: 'Projects', id: 'projects' },
    { href: '#education', label: 'Education', id: 'education' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="portfolio-page" data-theme={theme}>
      <header className="portfolio-header">
        <div className="header-brand">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} style={{ display: 'flex', alignItems: 'center' }}>
            <Folder className="brand-icon" size={20} />
          </motion.div>
          <span style={{ fontWeight: 800, letterSpacing: '2px', fontSize: '0.95rem', color: theme === 'light' ? '#0f172a' : '#fff', fontFamily: 'monospace' }}>ESHWAR H S</span>
        </div>
        <nav>
          {navLinks.map(link => (
            <motion.a
              key={link.id} href={link.href}
              className={activeSection === link.id ? 'nav-active' : ''}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="live-indicator" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-dot-sm" /> ACTIVE
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="portfolio-content">
        <section id="home" style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 0 80px', overflow: 'hidden' }}>
          {/* Subtle clean background grid overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: theme === 'light' ? 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)' : 'linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 75%)' }} />
          </div>

          <div className="hero-grid-container" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1400px', padding: '0 40px', alignItems: 'center' }}>

            {/* ── LEFT: HERO TEXT ── */}
            <div className="hero-text" style={{ position: 'relative', zIndex: 10 }}>

              {/* Status Bar */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                transition={{ duration: 0.8, ease: 'circOut' }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: theme === 'light' ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '6px 16px', borderRadius: '100px', marginBottom: '24px', overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                <span style={{ color: theme === 'light' ? '#047857' : '#34d399', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1.5px', fontFamily: 'monospace' }}>AVAILABLE FOR OPPORTUNITIES</span>
              </motion.div>

              {/* Title */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, margin: 0, color: theme === 'light' ? '#0f172a' : '#fff', textTransform: 'uppercase', letterSpacing: '-1px' }}
                >
                  Eshwar H S
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ fontSize: '1.8rem', fontWeight: 400, color: theme === 'light' ? '#64748b' : '#94a3b8', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <span style={{ color: theme === 'light' ? '#3b82f6' : '#ef4444' }}>&lt;</span>
                  Full-Stack Developer &amp; Problem Solver
                  <span style={{ color: theme === 'light' ? '#3b82f6' : '#ef4444' }}>/&gt;</span>
                </motion.h2>
              </div>

              {/* Bio card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                  background: theme === 'light'
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,248,255,0.85))'
                    : 'linear-gradient(135deg, rgba(15,20,40,0.85), rgba(5,8,20,0.7))',
                  padding: '26px 30px',
                  borderRadius: '0 16px 16px 0',
                  marginBottom: '32px',
                  backdropFilter: 'blur(16px)',
                  border: theme === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)',
                  borderLeft: theme === 'light' ? '4px solid #3b82f6' : '4px solid #ef4444',
                  boxShadow: theme === 'light'
                    ? '4px 8px 30px rgba(0,0,0,0.04)'
                    : '4px 8px 32px rgba(0,0,0,0.5)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <p style={{ margin: 0, fontSize: '1.02rem', color: theme === 'light' ? '#334155' : '#cbd5e1', lineHeight: 1.8, fontFamily: 'monospace' }}>
                  Passionate about <strong style={{ color: theme === 'light' ? '#0f1117' : '#fff' }}>Data Structures, Algorithms</strong>, and building scalable full-stack applications.<br /><br />
                  Focused on solving challenging engineering problems with clean, efficient code and transforming ideas into high-performance web products.
                </p>
              </motion.div>

              {/* Action Buttons & Hero Socials (LinkedIn, GitHub, Resume directly here) */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <motion.a
                    whileHover={{ scale: 1.04, boxShadow: theme === 'light' ? '0 12px 30px -8px rgba(59,130,246,0.8)' : '0 12px 30px -8px rgba(239,68,68,0.8)' }}
                    whileTap={{ scale: 0.96 }}
                    href="#projects"
                    style={{
                      background: theme === 'light' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, #ef4444, #b91c1c)',
                      color: '#fff',
                      padding: '13px 26px',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      boxShadow: theme === 'light' ? '0 8px 24px -6px rgba(59,130,246,0.5)' : '0 8px 24px -6px rgba(239,68,68,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s'
                    }}
                  >
                    View Projects <span style={{ fontFamily: 'monospace' }}>&rarr;</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.04, background: theme === 'light' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)' }}
                    whileTap={{ scale: 0.96 }}
                    href="#contact"
                    style={{
                      background: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.05)',
                      color: theme === 'light' ? '#1e293b' : '#fff',
                      padding: '13px 26px',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      border: theme === 'light' ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Mail size={16} /> Contact Me
                  </motion.a>
                </div>

                {/* Hero Socials & Resume (LinkedIn, GitHub, Resume to hero section only) */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '4px' }}>
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://www.linkedin.com/in/eshwar-h-s-4b820638a"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      background: theme === 'light' ? 'rgba(10,102,194,0.1)' : 'rgba(10,102,194,0.15)',
                      border: theme === 'light' ? '1px solid rgba(10,102,194,0.35)' : '1px solid rgba(10,102,194,0.45)',
                      color: theme === 'light' ? '#0a66c2' : '#60a5fa',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      textDecoration: 'none',
                      transition: 'all 0.25s'
                    }}
                  >
                    <LinkedinIcon size={16} /> LinkedIn
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://github.com/eshwarhs170-a11y"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      background: theme === 'light' ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.06)',
                      border: theme === 'light' ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.15)',
                      color: theme === 'light' ? '#1e293b' : '#f8fafc',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      textDecoration: 'none',
                      transition: 'all 0.25s'
                    }}
                  >
                    <GithubIcon size={16} /> GitHub
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      background: theme === 'light' ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.15)',
                      border: theme === 'light' ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(239,68,68,0.45)',
                      color: theme === 'light' ? '#dc2626' : '#f87171',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      textDecoration: 'none',
                      transition: 'all 0.25s'
                    }}
                  >
                    <FileText size={16} /> Resume
                  </motion.a>
                </div>
              </motion.div>

            </div>

            {/* ── RIGHT: CYBER PROFILE IMAGE (NO 3D FINGERPRINT) ── */}
            <motion.div
              style={{ rotateX: springY, rotateY: springX, transformStyle: 'preserve-3d', perspective: '1000px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              <CyberProfileImage src="/id_photo.jpg" />
            </motion.div>

          </div>
        </section>

        <section id="skills" style={{ overflow: 'hidden' }}>
          <motion.div className="section-header" style={{ marginBottom: '50px' }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="section-title skills-title">Technical Skills</h2>
            <span className="section-count">CORE TECHNOLOGIES &amp; TOOLS</span>
          </motion.div>

          {/* ===== SOLAR SYSTEM — Proper flat circular orbits ===== */}
          <div className="solar-system-wrapper" style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Subtle Starfield */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {[...Array(35)].map((_, i) => (
                <div key={`star-${i}`}
                  style={{ position: 'absolute', top: `${(i * 17) % 100}%`, left: `${(i * 37) % 100}%`, width: `${(i % 2) + 1}px`, height: `${(i % 2) + 1}px`, background: i % 5 === 0 ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.4)', borderRadius: '50%' }}
                />
              ))}
            </div>

            {/* Center reference — scaled on mobile via css */}
            <div className="solar-center-container" style={{ position: 'relative', width: '1000px', height: '1000px', flexShrink: 0 }}>

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

              {/* ORBIT 1 — Tools: Git, GitHub, Vercel — radius 130 */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, animation: 'orbit-cw 40s linear infinite' }}>
                {[
                  {
                    name: 'Git', angle: 100, color: '#f05032',
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="#f05032">
                        <path d="M21.9 10.7L13.3 2.1a2 2 0 0 0-2.8 0L8.3 4.3l3.5 3.5a2.4 2.4 0 0 1 3 3l3.3 3.3a2.4 2.4 0 1 1-1.4 1.4L13.5 12v6.6a2.4 2.4 0 1 1-2 0V12a2.4 2.4 0 0 1-1.3-3.1L6.7 5.4 2.1 10a2 2 0 0 0 0 2.8l8.6 8.6a2 2 0 0 0 2.8 0l8.4-8.4a2 2 0 0 0 0-2.8z" />
                      </svg>
                    )
                  },
                  {
                    name: 'GitHub', angle: 220, color: '#e2e8f0',
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="#e2e8f0">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                      </svg>
                    )
                  },
                  {
                    name: 'Vercel', angle: 340, color: '#ffffff',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                        <path d="M12 2L22 19.7H2L12 2z" />
                      </svg>
                    )
                  },
                ].map(p => {
                  const rad = (p.angle * Math.PI) / 180;
                  return (
                    <div key={p.name} style={{ position: 'absolute', left: Math.cos(rad) * 130, top: Math.sin(rad) * 130, width: 0, height: 0 }}>
                      <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
                        <div className="planet-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'orbit-ccw 40s linear infinite' }}>
                          <motion.div whileHover={{ scale: 1.2, boxShadow: `0 0 30px ${p.color}` }}
                            style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5,8,16,0.95)', border: `2.5px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${p.color}55`, cursor: 'default', zIndex: 10 }}>
                            {p.icon}
                          </motion.div>
                          <div className="planet-label" style={{ position: 'absolute', top: '100%', marginTop: '8px', fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 800, color: '#fff', background: 'rgba(5,8,16,0.9)', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: `1px solid ${p.color}55`, zIndex: 20 }}>{p.name}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ORBIT 2 — Databases: MongoDB, Firebase — radius 240 */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, animation: 'orbit-ccw 60s linear infinite' }}>
                {[
                  {
                    name: 'MongoDB', angle: 15, color: '#47a248',
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1.5C11.5 2 7 6.5 7 13.5c0 4.2 3.2 7.7 5 8.8 1.8-1.1 5-4.6 5-8.8 0-7-4.5-11.5-5-12z" fill="#47a248" />
                        <path d="M12 2.5v17.5c-.3-.2-4.5-3-4.5-6.8 0-6.2 4-9.8 4.5-10.7z" fill="#3fa037" />
                        <path d="M12 2v18" stroke="#256020" strokeWidth="0.6" />
                        <path d="M11.5 22.3v1.2c0 .3.2.5.5.5s.5-.2.5-.5v-1.2c-.3.1-.7.1-1 0z" fill="#a4b494" />
                      </svg>
                    )
                  },
                  {
                    name: 'Firebase', angle: 195, color: '#ffca28',
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M4.1 17L6.6 1.5a.78.78 0 0 1 1.45-.25l3.3 6.16-7.26 9.59z" fill="#ffa000" />
                        <path d="M18.74 13.64l-2.07-3.92-3.8 3.92 5.87 0z" fill="#f57c00" />
                        <path d="M16.85 8.84l-1.92-3.66a.78.78 0 0 0-1.4 0L12 8.4l1.37 2.61 3.48-2.17z" fill="#ffca28" />
                        <path d="M2.87 18.23l8.03 4.54a2.2 2.2 0 0 0 2.2 0l8.03-4.54-5.26-9.96L2.87 18.23z" fill="#ffca28" />
                      </svg>
                    )
                  },
                ].map(p => {
                  const rad = (p.angle * Math.PI) / 180;
                  return (
                    <div key={p.name} style={{ position: 'absolute', left: Math.cos(rad) * 240, top: Math.sin(rad) * 240, width: 0, height: 0 }}>
                      <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
                        <div className="planet-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'orbit-cw 60s linear infinite' }}>
                          <motion.div whileHover={{ scale: 1.2, boxShadow: `0 0 30px ${p.color}` }}
                            style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5,8,16,0.95)', border: `2.5px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${p.color}55`, cursor: 'default', zIndex: 10 }}>
                            {p.icon}
                          </motion.div>
                          <div className="planet-label" style={{ position: 'absolute', top: '100%', marginTop: '8px', fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 800, color: '#fff', background: 'rgba(5,8,16,0.9)', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: `1px solid ${p.color}55`, zIndex: 20 }}>{p.name}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ORBIT 3 — Web Tech: React, Node.js, Tailwind, REST APIs — radius 350 */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, animation: 'orbit-cw 80s linear infinite' }}>
                {[
                  {
                    name: 'React', angle: 60, color: '#61dafb',
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="11" fill="#61dafb" />
                        <ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke="#61dafb" strokeWidth="5" />
                        <ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke="#61dafb" strokeWidth="5" transform="rotate(60 50 50)" />
                        <ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke="#61dafb" strokeWidth="5" transform="rotate(120 50 50)" />
                      </svg>
                    )
                  },
                  {
                    name: 'Node.js', angle: 150, color: '#68a063',
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="#68a063">
                        <path d="M12 1.6L2.3 7.2v11.2L12 24l9.7-5.6V7.2L12 1.6zm0 2.4l7.6 4.4v8.8L12 21.6 4.4 17.2V8.4L12 4z" />
                        <path d="M10.2 8.5v7h2v-4.2l2.4 4.2h1.8V8.5h-2v4.2l-2.4-4.2z" fill="#fff" />
                      </svg>
                    )
                  },
                  {
                    name: 'Tailwind', angle: 240, color: '#38bdf8',
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 54 33">
                        <path fill="#38bdf8" d="M27.5 0c-7.3 0-11.8 3.6-13.6 10.8 2.7-3.6 5.9-4.9 9.6-4 2 .5 3.5 2 5.1 3.6 2.7 2.7 5.7 5.8 12.4 5.8 7.3 0 11.8-3.6 13.6-10.8-2.7 3.6-5.9 4.9-9.6 4-2-.5-3.5-2-5.1-3.6-2.7-2.7-5.7-5.8-12.4-5.8zM13.8 16.2c-7.3 0-11.8 3.6-13.6 10.8 2.7-3.6 5.9-4.9 9.6-4 2 .5 3.5 2 5.1 3.6 2.7 2.7 5.7 5.8 12.4 5.8 7.3 0 11.8-3.6 13.6-10.8-2.7 3.6-5.9 4.9-9.6 4-2-.5-3.5-2-5.1-3.6-2.7-2.7-5.7-5.8-12.4-5.8z" />
                      </svg>
                    )
                  },
                  {
                    name: 'REST APIs', angle: 330, color: '#ff6b35',
                    icon: (
                      <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
                        <circle cx="5" cy="12" r="3" fill="#ff6b35" />
                        <circle cx="19" cy="6" r="3" fill="#ff6b35" />
                        <circle cx="19" cy="18" r="3" fill="#ff6b35" />
                        <path d="M7.7 10.8l8.6-3.6M7.7 13.2l8.6 3.6" stroke="#ff6b35" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    )
                  },
                ].map(p => {
                  const rad = (p.angle * Math.PI) / 180;
                  return (
                    <div key={p.name} style={{ position: 'absolute', left: Math.cos(rad) * 350, top: Math.sin(rad) * 350, width: 0, height: 0 }}>
                      <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
                        <div className="planet-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'orbit-ccw 80s linear infinite' }}>
                          <motion.div whileHover={{ scale: 1.2, boxShadow: `0 0 30px ${p.color}` }}
                            style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5,8,16,0.95)', border: `2.5px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${p.color}55`, cursor: 'default', zIndex: 10 }}>
                            {p.icon}
                          </motion.div>
                          <div className="planet-label" style={{ position: 'absolute', top: '100%', marginTop: '8px', fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 800, color: '#fff', background: 'rgba(5,8,16,0.9)', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: `1px solid ${p.color}55`, zIndex: 20 }}>{p.name}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ORBIT 4 — Core: C++, JS, HTML/CSS — radius 460 */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, animation: 'orbit-ccw 100s linear infinite' }}>
                {[
                  {
                    name: 'C++', angle: 0, color: '#00b4d8',
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                        <path d="M16 2.5l11.5 6.6v13.8L16 29.5 4.5 22.9V9.1L16 2.5z" stroke="#00b4d8" strokeWidth="2.2" />
                        <path d="M14.2 12.2c-.8-.7-1.8-1-2.9-1-2.4 0-4.1 1.8-4.1 4.8s1.7 4.8 4.1 4.8c1.1 0 2.1-.3 2.9-1l1.4 1.8c-1.2 1.1-2.7 1.6-4.3 1.6-4 0-6.8-2.9-6.8-7.2s2.8-7.2 6.8-7.2c1.6 0 3.1.5 4.3 1.6l-1.4 1.8z" fill="#00b4d8" />
                        <path d="M18.8 14.5v3M17.3 16h3" stroke="#00b4d8" strokeWidth="2" strokeLinecap="round" />
                        <path d="M24 14.5v3M22.5 16h3" stroke="#00b4d8" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )
                  },
                  {
                    name: 'JavaScript', angle: 120, color: '#f7df1e',
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M3 2l1.8 17.5L12 22l7.2-2.5L21 2H3z" fill="#f7df1e" />
                        <path d="M12 3.8v16.4l5.5-1.9 1.4-14.5H12z" fill="#dfc817" />
                        <path d="M6.8 13.5h2v2.4c0 .8-.5 1.2-1.2 1.2-.5 0-.9-.2-1.1-.5l-.8 1.1c.5.6 1.2.9 1.9.9 1.7 0 2.8-.9 2.8-2.7V8.5H8.4v4.2c0 .5-.3.8-.8.8H6.8v0z" fill="#050810" />
                        <path d="M12.8 15.6c.5.5 1.2.8 1.9.8.8 0 1.3-.4 1.3-1 0-.6-.5-.9-1.5-1.3-1.5-.5-2.4-1.3-2.4-2.5 0-1.4 1.1-2.5 2.8-2.5 1 0 1.8.3 2.3.9l-.9 1.2c-.4-.4-.9-.6-1.4-.6-.7 0-1.1.3-1.1.8 0 .5.4.8 1.3 1.1 1.6.6 2.6 1.4 2.6 2.7 0 1.5-1.2 2.6-3 2.6-1.2 0-2.2-.4-2.9-1.2l1-.1.1-.2z" fill="#050810" />
                      </svg>
                    )
                  },
                  {
                    name: 'HTML/CSS', angle: 240, color: '#e34f26',
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M3 2l1.8 17.5L12 22l7.2-2.5L21 2H3z" fill="#e34f26" />
                        <path d="M12 3.8v16.4l5.5-1.9 1.4-14.5H12z" fill="#ef652a" />
                        <path d="M9.5 9.5L7 12l2.5 2.5M14.5 9.5L17 12l-2.5 2.5M13 8l-2 8" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )
                  },
                ].map(p => {
                  const rad = (p.angle * Math.PI) / 180;
                  return (
                    <div key={p.name} style={{ position: 'absolute', left: Math.cos(rad) * 460, top: Math.sin(rad) * 460, width: 0, height: 0 }}>
                      <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
                        <div className="planet-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'orbit-cw 100s linear infinite' }}>
                          <motion.div whileHover={{ scale: 1.2, boxShadow: `0 0 30px ${p.color}` }}
                            style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5,8,16,0.95)', border: `2.5px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${p.color}55`, cursor: 'default', zIndex: 10 }}>
                            {p.icon}
                          </motion.div>
                          <div className="planet-label" style={{ position: 'absolute', top: '100%', marginTop: '8px', fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 800, color: '#fff', background: 'rgba(5,8,16,0.9)', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: `1px solid ${p.color}55`, zIndex: 20 }}>{p.name}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <style>{`
                @keyframes orbit-cw {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes orbit-ccw {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(-360deg); }
                }
              `}</style>

              {/* CENTER — SKILLS SUN */}
              <motion.div
                animate={{ boxShadow: ['0 0 20px rgba(239,68,68,0.4)', '0 0 60px rgba(239,68,68,0.8)', '0 0 20px rgba(239,68,68,0.4)'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, borderRadius: '50%' }}
              >
                <motion.div
                  style={{ background: 'linear-gradient(135deg, #1a0005, #0f0f1a)', border: '2px solid rgba(239,68,68,0.8)', borderRadius: '50%', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 20px rgba(239,68,68,0.3)', cursor: 'default' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '2px', color: '#ef4444', textShadow: '0 0 10px rgba(239,68,68,0.8)' }}>
                    SKILLS
                  </div>
                </motion.div>

                {/* Floating orbit ring around the center */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -15, border: '1px solid rgba(239,68,68,0.5)', borderRadius: '50%', borderTopColor: 'transparent', borderBottomColor: 'transparent', pointerEvents: 'none' }} />
              </motion.div>

            </div>
          </div>


        </section>


        <section id="projects" style={{ position: 'relative', overflow: 'hidden', padding: '60px 0 80px' }}>
          <div className="section-header" style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <h2 className="section-title proj-title" style={{ margin: 0 }}>Featured Projects</h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, var(--accent-1), transparent)' }} />
            <span className="section-count" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-1)', padding: '6px 12px', borderRadius: '4px', color: 'var(--accent-1)' }}>
              {projects.length} PROJECTS
            </span>
          </div>

          {/* Vertical stack with separator between cards */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0', padding: '0 40px', maxWidth: '900px', margin: '0 auto' }}>
            {projects.map((p, i) => (
              <>
                <CaseCard key={p.caseNum} project={p} index={i} />
                {i < projects.length - 1 && (
                  <motion.div
                    key={`sep-${i}`}
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 0 }}
                  >
                    {/* Left line */}
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(239,68,68,0.8))' }} />
                    {/* Center ornament */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 120, flexShrink: 0 }}>
                      {/* Outer glow ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', width: 56, height: 56, border: '1px solid rgba(239,68,68,0.4)', borderRadius: '50%', borderTopColor: 'transparent' }}
                      />
                      {/* Diamond */}
                      <div style={{ width: 18, height: 18, background: 'rgba(239,68,68,0.9)', transform: 'rotate(45deg)', boxShadow: '0 0 20px rgba(239,68,68,0.8)', zIndex: 2 }} />
                      {/* Case label */}
                      <span style={{ position: 'absolute', top: '100%', marginTop: 10, color: 'rgba(239,68,68,0.7)', fontSize: '0.62rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px', whiteSpace: 'nowrap' }}>PROJECT {i + 2}</span>
                    </div>
                    {/* Right line */}
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(239,68,68,0.8))' }} />
                  </motion.div>
                )}
              </>
            ))}
          </div>
        </section>

        <section id="education" style={{ position: 'relative', overflow: 'hidden', padding: '80px 0' }}>
          {/* Subtle deep space gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.05) 0%, rgba(239,68,68,0.03) 40%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

          <motion.div className="section-header" style={{ marginBottom: '60px', position: 'relative', zIndex: 2 }} initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, type: 'spring' }}>
            <h2 className="section-title edu-title">Education</h2>
            <span className="section-count">3 RECORDS</span>
          </motion.div>

          <div className="education-grid" style={{ position: 'relative', zIndex: 2 }}>
            {[
              {
                year: '2025 – 2029', degree: 'B.Tech in Computer Science & Engineering',
                short: 'B.TECH CSE', institution: 'UVCE, Bengaluru',
                grade: '9.64', gradeLabel: 'CGPA', color: '#ef4444',
                image: '/uvce.jpg', status: 'ACTIVE',
              },
              {
                year: '2023 – 2025', degree: 'Pre-University (Science — PCMB)',
                short: 'PUC', institution: 'Presidency PU College, Sira',
                grade: '98.17%', gradeLabel: 'SCORE', color: '#3b82f6',
                image: '/presidency.png', status: 'COMPLETED',
              },
              {
                year: '2023', degree: 'Secondary School (SSLC)',
                short: 'SSLC', institution: 'Jnanavardhaka Vidya Mandira, Chelur',
                grade: '98.04%', gradeLabel: 'SCORE', color: '#10b981',
                image: '/venus.jpg', status: 'COMPLETED',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                style={{ position: 'relative' }}
              >
                {/* ── MAIN CARD ── */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'linear-gradient(145deg, rgba(8,12,24,0.95) 0%, rgba(12,18,34,0.92) 100%)',
                    border: theme === 'light' ? '1px solid rgba(0,0,0,0.08)' : `1px solid ${item.color}35`,
                    boxShadow: theme === 'light' ? '0 10px 30px rgba(0,0,0,0.05)' : `0 12px 35px rgba(0,0,0,0.6), 0 0 25px ${item.color}10`,
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {/* ── Elegant top accent line ── */}
                  <div
                    style={{
                      height: '3px',
                      background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                    }}
                  />

                  {/* ── CONTENT ── */}
                  <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 1 }}>

                    {/* Status + year row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          letterSpacing: '1.5px',
                          color: item.color,
                          background: `${item.color}15`,
                          border: `1px solid ${item.color}40`,
                          padding: '3px 10px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {item.status === 'ACTIVE' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />}
                        {item.status}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: theme === 'light' ? '#64748b' : 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{item.year}</span>
                    </div>

                    {/* ── INSTITUTION IMAGE (Clean, framed circular avatar) ── */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
                      <div
                        style={{
                          width: '124px',
                          height: '124px',
                          borderRadius: '50%',
                          padding: '3px',
                          background: `linear-gradient(135deg, ${item.color}90, ${item.color}25)`,
                          boxShadow: `0 6px 20px ${item.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#050810' }}>
                          <img src={item.image} alt={item.institution} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    </div>

                    {/* Short label */}
                    <div
                      style={{
                        textAlign: 'center',
                        fontSize: '0.72rem',
                        fontFamily: 'monospace',
                        color: item.color,
                        fontWeight: 800,
                        letterSpacing: '2px',
                        marginBottom: '8px'
                      }}
                    >
                      {item.short}
                    </div>

                    {/* Degree */}
                    <div style={{ textAlign: 'center', fontSize: '1.02rem', fontWeight: 700, color: theme === 'light' ? '#0f172a' : '#f1f5f9', lineHeight: 1.45, marginBottom: '6px' }}>{item.degree}</div>

                    {/* Institution */}
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: theme === 'light' ? '#64748b' : 'rgba(255,255,255,0.45)', fontFamily: 'monospace', marginBottom: '22px' }}>{item.institution}</div>

                    <div style={{ flex: 1 }} />

                    {/* Grade / Score */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', paddingTop: '12px', borderTop: theme === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '0.62rem', fontFamily: 'monospace', color: theme === 'light' ? '#64748b' : 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', fontWeight: 600 }}>{item.gradeLabel}</span>
                      <span
                        style={{
                          fontSize: '1.75rem',
                          fontWeight: 900,
                          fontFamily: 'monospace',
                          color: item.color,
                          textShadow: `0 0 16px ${item.color}35`
                        }}
                      >
                        {item.grade}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>


        <section id="certifications" style={{ position: 'relative', overflow: 'hidden', padding: '60px 0' }}>
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <h2 className="section-title edu-title" style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Achievements &amp; Highlights</h2>
            <span className="section-count" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>NOTABLE HIGHLIGHTS</span>
          </div>

          <div className="certs-grid" style={{ gap: '30px' }}>

            {/* ── CARD 1: NammaUGNEET Impact ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5, boxShadow: '0 20px 50px rgba(34,197,94,0.2)' }}
              style={{ position: 'relative', background: 'rgba(4,6,14,0.95)', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {/* Animated glowing border */}
              <div style={{ position: 'absolute', inset: 0, padding: '2px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(34,197,94,0.6), rgba(34,197,94,0.1), transparent)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', pointerEvents: 'none' }} />

              {/* Inner content */}
              <div style={{ position: 'relative', padding: '32px', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>
                      <Zap size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>NammaUGNEET Impact</h4>
                      <span style={{ color: '#22c55e', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px' }}>HIGH ADOPTION RATE</span>
                    </div>
                  </div>
                </div>

                <p style={{ margin: '0 0 24px', fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>Adopted by <strong style={{ color: '#fff' }}>1,200+ NEET UG aspirants</strong> as a real-time college predictor during Karnataka's 2026 counselling season.</p>

                {/* Visual data bar */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontFamily: 'monospace' }}>ADOPTION METRIC</span>
                      <span style={{ color: '#22c55e', fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace' }}>SUCCESS</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1.5, delay: 0.3 }} style={{ height: '100%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Background grid */}
              <motion.div
                animate={{ backgroundPosition: ['0px 0px', '20px 20px'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px', zIndex: 0 }}
              />
            </motion.div>

            {/* ── CARD 2: CodeFury 9.0 ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5, boxShadow: '0 20px 50px rgba(245,158,11,0.2)' }}
              style={{ position: 'relative', background: 'rgba(4,6,14,0.95)', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {/* Animated glowing border */}
              <div style={{ position: 'absolute', inset: 0, padding: '2px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.6), rgba(245,158,11,0.1), transparent)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', pointerEvents: 'none' }} />

              {/* Inner content */}
              <div style={{ position: 'relative', padding: '32px', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', boxShadow: '0 0 20px rgba(245,158,11,0.2)' }}>
                      <Award size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>CodeFury 9.0</h4>
                      <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px' }}>NATIONAL HACKATHON</span>
                    </div>
                  </div>
                  <Shield size={32} color="rgba(245,158,11,0.2)" />
                </div>

                <p style={{ margin: '0 0 24px', fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>Participated in the <strong style={{ color: '#fff' }}>9th Annual National-Level Hackathon</strong> organized by IEEE UVCE Computer Society.</p>

                {/* Tech tags */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace' }}>COMPETITIVE CODING</span>
                  <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace' }}>IEEE UVCE</span>
                </div>
              </div>

              {/* Animated Background grid */}
              <motion.div
                animate={{ backgroundPosition: ['0px 0px', '20px 20px'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px', zIndex: 0 }}
              />
            </motion.div>

          </div>
        </section>

        <section id="contact" style={{ position: 'relative', overflow: 'hidden', padding: '90px 0', marginTop: '40px' }}>
          {/* Custom Styles for inputs */}
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

          <motion.div className="contact-section" style={{ position: 'relative', zIndex: 1, background: 'transparent', boxShadow: 'none', maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '50px' }}>
              <h2 className="section-title contact-title" style={{ marginBottom: 12, fontSize: '3.2rem', textAlign: 'center', color: theme === 'light' ? '#1e293b' : '#fff' }}>Get In Touch</h2>
              <p className="contact-desc" style={{ maxWidth: '520px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6, color: '#94a3b8' }}>
                Open to internships, full-stack engineering roles, and collaborations. Send a message anytime.
              </p>
            </div>

            <div className="contact-main-grid" style={{ width: '100%', alignItems: 'stretch' }}>
              {/* Left: Contact Form — compact & wide */}
              <motion.div
                style={{ padding: '32px 36px', borderRadius: '24px', background: theme === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(10, 15, 24, 0.8)', backdropFilter: 'blur(24px)', border: theme === 'light' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(239,68,68,0.3)', boxShadow: theme === 'light' ? '0 20px 60px rgba(0,0,0,0.06)' : '0 20px 60px rgba(0,0,0,0.8)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {/* Grid overlay bg */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: theme === 'light' ? 'linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)' : 'linear-gradient(rgba(163,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(163,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

                <form
                  style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const data = new FormData(form);
                    try {
                      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
                      const json = await res.json();
                      if (json.success) {
                        alert('Message sent successfully! Eshwar will respond shortly.');
                        form.reset();
                      } else {
                        alert('Something went wrong. Please email directly: eshwarhs170@gmail.com');
                      }
                    } catch {
                      alert('Network error. Please email directly: eshwarhs170@gmail.com');
                    }
                  }}
                >
                  {/* Web3Forms Access Key */}
                  <input type="hidden" name="access_key" value="e16be2dc-5606-4cf1-8e4b-ad57e0c009f3" />

                  {/* 2-col row: NAME + EMAIL */}
                  <div className="contact-name-email-row" style={{ gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.75rem', color: theme === 'light' ? '#3b82f6' : '#ef4444', fontWeight: 800 }}><User size={12} /> NAME</label>
                      <input type="text" name="name" className="cyber-input" placeholder="Your name" required />
                    </div>
                    <div>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.75rem', color: theme === 'light' ? '#3b82f6' : '#ef4444', fontWeight: 800 }}><Mail size={12} /> EMAIL</label>
                      <input type="email" name="email" className="cyber-input" placeholder="your.email@example.com" required />
                    </div>
                  </div>

                  {/* TOPIC */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.75rem', color: theme === 'light' ? '#3b82f6' : '#ef4444', fontWeight: 800 }}><FileText size={12} /> TOPIC</label>
                    <input type="text" name="subject" className="cyber-input" placeholder="What's this about?" required />
                  </div>

                  {/* MESSAGE */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.75rem', color: theme === 'light' ? '#3b82f6' : '#ef4444', fontWeight: 800 }}><FileText size={12} /> MESSAGE</label>
                    <textarea name="message" className="cyber-input" placeholder="Detail your project or opportunity..." style={{ flex: 1, resize: 'none', minHeight: '120px' }} required />
                  </div>

                  {/* Honeypot Spam Protection */}
                  <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                  <motion.button type="submit" className="form-submit"
                    style={{ background: theme === 'light' ? '#3b82f6' : '#ef4444', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: theme === 'light' ? '0 10px 30px rgba(59, 130, 246, 0.4)' : '0 10px 30px rgba(239, 68, 68, 0.4)' }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <Zap size={18} /> SEND MESSAGE
                  </motion.button>
                </form>
              </motion.div>

              {/* Right: Direct Channels — stretched to same height */}
              <div style={{ padding: '32px 30px', borderRadius: '24px', background: theme === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(10, 15, 24, 0.8)', backdropFilter: 'blur(24px)', border: theme === 'light' ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(255,255,255,0.1)', boxShadow: theme === 'light' ? '0 20px 60px rgba(0,0,0,0.06)' : '0 20px 60px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'monospace', color: '#94a3b8', letterSpacing: '3px', textAlign: 'center', marginBottom: '8px' }}>DIRECT CHANNELS</div>
                  <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)' }} />
                </div>

                {/* Channels — evenly spaced to fill height */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: '16px' }}>
                  {[
                    { icon: <Mail size={24} />, label: 'EMAIL', value: 'eshwarhs170@gmail.com', href: 'mailto:eshwarhs170@gmail.com', color: '#ef4444' },
                    { icon: <GithubIcon size={24} />, label: 'GITHUB', value: 'github.com/eshwarhs170-a11y', href: 'https://github.com/eshwarhs170-a11y', color: theme === 'light' ? '#333' : '#fff' },
                    { icon: <LinkedinIcon size={24} />, label: 'LINKEDIN', value: 'linkedin.com/in/eshwar-h-s', href: 'https://www.linkedin.com/in/eshwar-h-s-4b820638a', color: theme === 'light' ? '#0077b5' : '#0a66c2' },
                  ].map((ch) => (
                    <motion.a
                      key={ch.label}
                      href={ch.href}
                      target="_blank"
                      rel="noreferrer"
                      className="cyber-channel"
                      whileHover={{ scale: 1.02, borderColor: ch.color }}
                      style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px', background: `linear-gradient(135deg, rgba(255,255,255,0.03), ${ch.color}11)`, border: `1px solid rgba(255,255,255,0.08)`, borderLeft: `4px solid ${ch.color}`, borderRadius: '16px', textDecoration: 'none', color: 'var(--text-main)', transition: 'all 0.3s ease', flex: 1 }}
                    >
                      <span style={{ color: ch.color, flexShrink: 0 }}>{ch.icon}</span>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '2px', color: ch.color, marginBottom: '6px' }}>{ch.label}</div>
                        <div style={{ fontSize: '0.95rem', color: theme === 'light' ? '#2d2d3a' : '#f1f5f9', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.value}</div>
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

      <footer style={{
        borderTop: theme === 'light' ? '2px solid rgba(192,57,43,0.3)' : '2px solid rgba(239,68,68,0.3)',
        padding: '36px 40px',
        background: theme === 'light'
          ? 'linear-gradient(135deg, #dde0ee, #e8ddf0, #ddeaf8)'
          : 'linear-gradient(to bottom, rgba(5,7,12,0.9), rgba(0,0,0,1))',
        position: 'relative',
        zIndex: 10,
        boxShadow: theme === 'light'
          ? 'inset 0 1px 0 rgba(255,255,255,0.7), 0 -4px 20px rgba(0,0,0,0.08)'
          : 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}>

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '30px' }}>

          {/* Left: Brand & Copyright */}
          <div className="footer-left" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: theme === 'light' ? '#0f1117' : '#fff', fontWeight: 900, letterSpacing: '2px', fontSize: '1.2rem' }}>
              <Folder size={18} color="#ef4444" /> ESHWAR H S
            </div>
            <div style={{ color: theme === 'light' ? '#5a5a72' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '1px' }}>
              ESHWAR H S &copy; 2026
            </div>
          </div>

          {/* Middle: Enhanced Socials */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { icon: <GithubIcon size={18} />, href: 'https://github.com/eshwarhs170-a11y', color: theme === 'light' ? '#333' : '#fff' },
              { icon: <LinkedinIcon size={18} />, href: 'https://www.linkedin.com/in/eshwar-h-s-4b820638a', color: '#0a66c2' },
              { icon: <Mail size={18} />, href: 'mailto:eshwarhs170@gmail.com', color: '#ef4444' }
            ].map((link, i) => (
              <motion.a
                key={i}
                whileHover={{ y: -3, scale: 1.08, backgroundColor: `${link.color}22`, borderColor: link.color, color: link.color }}
                href={link.href} target="_blank" rel="noreferrer"
                style={{
                  color: theme === 'light' ? '#5a5a72' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s', padding: '10px', borderRadius: '10px',
                  border: theme === 'light' ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.1)',
                  background: theme === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          {/* Right: Actions & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div className="footer-status" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontFamily: 'monospace', letterSpacing: '1px', fontWeight: 800 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} /> ONLINE
            </div>

            <motion.a
              href="/resume.pdf" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: theme === 'light' ? 'rgba(192,57,43,0.08)' : 'rgba(239,68,68,0.1)', border: theme === 'light' ? '1px solid rgba(192,57,43,0.4)' : '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: theme === 'light' ? '#c0392b' : '#fff', fontSize: '0.8rem', fontFamily: 'monospace', textDecoration: 'none', fontWeight: 800, letterSpacing: '1px' }}
              whileHover={{ background: theme === 'light' ? 'rgba(192,57,43,0.15)' : 'rgba(239,68,68,0.2)', scale: 1.04 }}
            >
              <FileText size={16} /> DOWNLOAD RESUME
            </motion.a>
          </div>

        </div>
      </footer>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
      <ScrollToTopButton />
    </motion.div>
  );
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            zIndex: 9999,
            background: 'rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            width: '45px',
            height: '45px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
          }}
          whileHover={{ scale: 1.1, background: 'rgba(239, 68, 68, 0.2)', boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)' }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
