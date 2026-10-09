import { useEffect, useMemo, useRef, useState } from 'react';
import CyberVortexCanvas from './CyberVortexCanvas';
import MatrixRain from './MatrixRain';
import CyberProfileImage from './CyberProfileImage';
import EduNeuralBg from './EduNeuralBg';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Folder, FileText, User, Mail, Shield, Database,
  Zap, Globe, Award, X, ExternalLink
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

function GlitchText({ text }: { text: string }) {
  return <span className="glitch-hover">{text}</span>;
}

// Same blood-red circle trail as the LandingPage — clears when cursor stops
function CursorTrail({ mousePos }: { mousePos: { x: number; y: number } }) {
  const { theme } = useTheme();
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const idRef = useRef(0);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mousePos.x < 0) return;
    const newDot = { x: mousePos.x, y: mousePos.y, id: idRef.current++ };
    setTrail(prev => [...prev.slice(-18), newDot]);

    // Clear trail 400ms after cursor stops moving
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => setTrail([]), 400);
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
              background: theme === 'light' ? `rgba(59, 130, 246, ${age * 0.7})` : `rgba(163, 0, 0, ${age * 0.7})`,
              boxShadow: theme === 'light' ? `0 0 ${age * 12}px rgba(59, 130, 246, ${age * 0.5})` : `0 0 ${age * 12}px rgba(163, 0, 0, ${age * 0.5})`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 9999,
              transition: 'opacity 0.3s ease',
            }}
          />
        );
      })}
    </>
  );
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

// Removed ScanLine and SkillBar to fix TS errors



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
            {/* FILM CORNERS */}
            {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(pos => {
              const [v, h] = pos.split('-') as ['top' | 'bottom', 'left' | 'right'];
              return <div key={pos} style={{
                position: 'absolute', [v]: 10, [h]: 10, width: 18, height: 18,
                borderTop: v === 'top' ? '2px solid rgba(239,68,68,0.7)' : 'none',
                borderBottom: v === 'bottom' ? '2px solid rgba(239,68,68,0.7)' : 'none',
                borderLeft: h === 'left' ? '2px solid rgba(239,68,68,0.7)' : 'none',
                borderRight: h === 'right' ? '2px solid rgba(239,68,68,0.7)' : 'none',
                zIndex: 10, pointerEvents: 'none'
              }} />;
            })}

            {/* SCANLINES */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)', pointerEvents: 'none', zIndex: 5 }} />

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
  const [contactVisible, setContactVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const springX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const springY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
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

  // Removed skillBars, skillsList, education as they are unused right now

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
        <CursorTrail mousePos={mousePos} />

        <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 0 100px', overflow: 'hidden' }}>
          {/* Background Cyber Elements */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            {/* Grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: theme === 'light' ? 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)' : 'linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, transparent 70%)' }} />
            {/* Huge Watermark */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: theme === 'light' ? 0.04 : 0.02, scale: 1 }} transition={{ duration: 2 }} style={{ position: 'absolute', top: '10%', right: '-10%', fontSize: '25vw', fontWeight: 900, color: theme === 'light' ? '#0f1117' : '#fff', whiteSpace: 'nowrap', userSelect: 'none', fontFamily: 'monospace' }}>DOSSIER</motion.div>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 450px', gap: '140px', width: '100%', maxWidth: '1400px', padding: '0 40px', alignItems: 'center' }}>

            {/* ── LEFT: TERMINAL TEXT ── */}
            <div className="hero-text" style={{ position: 'relative', zIndex: 10 }}>

              {/* Status Bar */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                transition={{ duration: 0.8, ease: 'circOut' }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: theme === 'light' ? 'rgba(59,130,246,0.15)' : 'rgba(239,68,68,0.1)', border: theme === 'light' ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(239,68,68,0.3)', padding: '6px 16px', borderRadius: '100px', marginBottom: '24px', overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: '50%', background: theme === 'light' ? '#3b82f6' : '#ef4444', boxShadow: theme === 'light' ? '0 0 10px #3b82f6' : '0 0 10px #ef4444' }} />
                <span style={{ color: theme === 'light' ? '#2563eb' : '#ef4444', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', fontFamily: 'monospace' }}>AGENT ACTIVE // READY FOR ASSIGNMENT</span>
              </motion.div>

              {/* Title */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, margin: 0, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1px' }}
                >
                  <GlitchText text="Eshwar H S" />
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ fontSize: '1.8rem', fontWeight: 300, color: theme === 'light' ? '#64748b' : '#94a3b8', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <span style={{ color: theme === 'light' ? '#3b82f6' : '#ef4444' }}>&lt;</span>
                  Full-Stack & AI Engineer
                  <span style={{ color: theme === 'light' ? '#3b82f6' : '#ef4444' }}>/&gt;</span>
                </motion.h2>
              </div>

              {/* Bio with typing effect */}
              <motion.div
                initial={{ opacity: 0, rotateX: -8, y: 16 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                whileHover={{ scale: 1.02, rotateY: 2, boxShadow: theme === 'light' ? '8px 15px 40px rgba(0,0,0,0.1), inset 0 2px 10px rgba(255,255,255,1)' : '8px 15px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)' }}
                style={{
                  background: theme === 'light'
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,248,255,0.85))'
                    : 'linear-gradient(135deg, rgba(15,20,40,0.85), rgba(5,8,20,0.7))',
                  padding: '28px 32px',
                  borderRadius: '0 16px 16px 0',
                  marginBottom: '36px',
                  backdropFilter: 'blur(20px)',
                  border: theme === 'light' ? '1px solid rgba(255,255,255,1)' : '1px solid rgba(255,255,255,0.06)',
                  borderLeft: theme === 'light' ? '4px solid #3b82f6' : '4px solid #ef4444',
                  boxShadow: theme === 'light'
                    ? '4px 8px 30px rgba(0,0,0,0.06), inset 0 2px 5px rgba(255,255,255,1)'
                    : '4px 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
                  transform: 'perspective(1000px) rotateX(1deg)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <p style={{ margin: 0, fontSize: '1.05rem', color: theme === 'light' ? '#334155' : '#cbd5e1', lineHeight: 1.8, fontFamily: 'monospace' }}>
                  Every complex problem leaves a trail. I follow the evidence — and build the solution.<br /><br />
                  Specializing in <strong style={{ color: theme === 'light' ? '#0f1117' : '#fff' }}>Full-Stack Architecture</strong> and <strong style={{ color: theme === 'light' ? '#2563eb' : '#38bdf8' }}>AI Integration</strong>, I turn real-world chaos into production-ready intelligence.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <motion.a whileHover={{ scale: 1.05, boxShadow: theme === 'light' ? '0 15px 40px -10px rgba(59,130,246,0.9)' : '0 15px 40px -10px rgba(239,68,68,0.9)' }} whileTap={{ scale: 0.95 }} href="#projects" style={{
                  background: theme === 'light' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff', padding: '14px 28px', borderRadius: '8px',
                  fontSize: '0.88rem', fontWeight: 800, textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase',
                  boxShadow: theme === 'light' ? '0 10px 30px -10px rgba(59,130,246,0.6)' : '0 10px 30px -10px rgba(239,68,68,0.8)', border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s'
                }}>
                  Access Dossier <span style={{ fontFamily: 'monospace' }}>_&gt;</span>
                </motion.a>
                <motion.a whileHover={{ scale: 1.05, background: theme === 'light' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)', borderColor: theme === 'light' ? 'rgba(59,130,246,0.5)' : 'rgba(239,68,68,0.5)' }} whileTap={{ scale: 0.95 }} href="#contact" style={{
                  background: theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.03)', color: theme === 'light' ? '#1e293b' : '#fff', padding: '14px 28px', borderRadius: '8px',
                  fontSize: '0.88rem', fontWeight: 800, textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase',
                  border: theme === 'light' ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                  boxShadow: theme === 'light' ? '0 4px 15px rgba(0,0,0,0.05)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s'
                }}>
                  <Shield size={16} /> Secure Comms
                </motion.a>
              </motion.div>

            </div>

            {/* ── RIGHT: CYBER PROFILE IMAGE ── */}
            <motion.div
              style={{ rotateX: springY, rotateY: springX, transformStyle: 'preserve-3d', perspective: '1000px', display: 'flex', justifyContent: 'center' }}
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, type: 'spring' }}
            >
              <CyberProfileImage src="/id_photo.jpg" />
            </motion.div>

          </div>
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
              {/* Dynamic Shooting Stars */}
              {[...Array(5)].map((_, i) => (
                <div key={`shooting-star-${i}`} className="shooting-star" style={{
                  top: `${Math.random() * 50}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 3.5}s`,
                  animationDuration: `${Math.random() * 2 + 3}s`
                }} />
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

              {/* ORBIT 1 — Tools: Git, GitHub, Vercel — radius 130 */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, animation: 'orbit-cw 40s linear infinite' }}>
                {[
                  { name: 'Git', angle: 100, color: '#f05032', icon: <svg width="24" height="24" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#f05032" /><path fill="#fff" d="M27.3 14.7l-10-10a1.9 1.9 0 0 0-2.7 0l-2.1 2.1 2.7 2.7a2.3 2.3 0 0 1 2.9 2.9l2.6 2.6a2.3 2.3 0 1 1-1.4 1.4l-2.4-2.4v6.3a2.3 2.3 0 1 1-1.9 0v-6.4a2.3 2.3 0 0 1-1.2-3l-2.7-2.6-7.2 7.2a1.9 1.9 0 0 0 0 2.7l10 10a1.9 1.9 0 0 0 2.7 0l10-10a1.9 1.9 0 0 0 0-2.8z" /></svg> },
                  { name: 'GitHub', angle: 220, color: '#e2e8f0', icon: <GithubIcon size={24} /> },
                  { name: 'Vercel', angle: 340, color: '#ffffff', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2L22 19.7H2L12 2z" /></svg> },
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
                  { name: 'MongoDB', angle: 15, color: '#47a248', icon: <Database size={24} color="#47a248" /> },
                  { name: 'Firebase', angle: 195, color: '#ffca28', icon: <Database size={24} color="#ffca28" /> },
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
                  { name: 'React', angle: 60, color: '#61dafb', icon: <svg width="26" height="26" viewBox="0 0 100 100"><circle cx="50" cy="50" r="11" fill="#61dafb" /><ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke="#61dafb" strokeWidth="5" /><ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke="#61dafb" strokeWidth="5" transform="rotate(60 50 50)" /><ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke="#61dafb" strokeWidth="5" transform="rotate(120 50 50)" /></svg> },
                  { name: 'Node.js', angle: 150, color: '#68a063', icon: <svg width="26" height="26" viewBox="0 0 256 289"><path fill="#68a063" d="M128 0L0 74v141l128 74 128-74V74z" /><path fill="#fff" d="M128 25l103 59.5v119L128 263 25 183.5v-119z" /><path fill="#68a063" d="M128 230l80-46v-92l-80 46z" /></svg> },
                  { name: 'Tailwind', angle: 240, color: '#38bdf8', icon: <svg width="26" height="26" viewBox="0 0 54 33"><path fill="#38bdf8" d="M27.5 0c-7.3 0-11.8 3.6-13.6 10.8 2.7-3.6 5.9-4.9 9.6-4 2 .5 3.5 2 5.1 3.6 2.7 2.7 5.7 5.8 12.4 5.8 7.3 0 11.8-3.6 13.6-10.8-2.7 3.6-5.9 4.9-9.6 4-2-.5-3.5-2-5.1-3.6-2.7-2.7-5.7-5.8-12.4-5.8zM13.8 16.2c-7.3 0-11.8 3.6-13.6 10.8 2.7-3.6 5.9-4.9 9.6-4 2 .5 3.5 2 5.1 3.6 2.7 2.7 5.7 5.8 12.4 5.8 7.3 0 11.8-3.6 13.6-10.8-2.7 3.6-5.9 4.9-9.6 4-2-.5-3.5-2-5.1-3.6-2.7-2.7-5.7-5.8-12.4-5.8z" /></svg> },
                  { name: 'REST APIs', angle: 330, color: '#ff6b35', icon: <Globe size={22} color="#ff6b35" /> },
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
                  { name: 'C++', angle: 0, color: '#00b4d8', icon: <span style={{ color: '#00b4d8', fontWeight: 900, fontSize: '1rem', fontFamily: 'monospace' }}>C++</span> },
                  { name: 'JavaScript', angle: 120, color: '#f7df1e', icon: <span style={{ color: '#f7df1e', fontWeight: 900, fontSize: '1rem', fontFamily: 'monospace' }}>JS</span> },
                  { name: 'HTML/CSS', angle: 240, color: '#e34f26', icon: <span style={{ color: '#e34f26', fontWeight: 900, fontSize: '1rem', fontFamily: 'monospace' }}>{'</>'}</span> },
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



        <section id="projects" style={{ position: 'relative', overflow: 'hidden', padding: '60px 0 80px', background: 'rgba(3,5,12,0.97)' }}>
          {/* Glowing Orbs for ambient background lighting */}
          <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />

          {/* Dynamic Laser Scanner */}
          {/* scanner removed */}

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
                      <div style={{ width: 18, height: 18, background: 'rgba(239,68,68,0.9)', transform: 'rotate(45deg)', boxShadow: '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.4)', zIndex: 2 }} />
                      {/* Case label */}
                      <span style={{ position: 'absolute', top: '100%', marginTop: 10, color: 'rgba(239,68,68,0.7)', fontSize: '0.62rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px', whiteSpace: 'nowrap' }}>CASE {projects[i + 1]?.caseNum}</span>
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
          {/* Neural Network Canvas BG */}
          <EduNeuralBg />

          {/* Deep space radial gradient base */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.07) 0%, rgba(239,68,68,0.04) 40%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

          <motion.div className="section-header" style={{ marginBottom: '60px', position: 'relative', zIndex: 2 }} initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, type: 'spring' }}>
            <h2 className="section-title edu-title">Education</h2>
            <span className="section-count">3 RECORDS</span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', position: 'relative', zIndex: 2 }}>
            {[
              {
                year: '2025 – 2029', degree: 'B.Tech in Computer Science & Engineering',
                short: 'B.TECH CSE', institution: 'UVCE, Bengaluru',
                grade: '9.64', gradeLabel: 'CGPA', color: '#ef4444', accentLight: '#ff6666',
                image: '/uvce.jpg', status: 'ACTIVE',
                orbitColor1: 'rgba(239,68,68,0.7)', orbitColor2: 'rgba(251,191,36,0.5)',
              },
              {
                year: '2023 – 2025', degree: 'Pre-University (Science — PCMB)',
                short: 'PUC', institution: 'Presidency PU College, Sira',
                grade: '98.17%', gradeLabel: 'SCORE', color: '#3b82f6', accentLight: '#60a5fa',
                image: '/presidency.png', status: 'COMPLETED',
                orbitColor1: 'rgba(59,130,246,0.7)', orbitColor2: 'rgba(168,85,247,0.5)',
              },
              {
                year: '2023', degree: 'Secondary School (SSLC)',
                short: 'SSLC', institution: 'Jnanavardhaka Vidya Mandira, Chelur',
                grade: '98.04%', gradeLabel: 'SCORE', color: '#10b981', accentLight: '#34d399',
                image: '/venus.jpg', status: 'COMPLETED',
                orbitColor1: 'rgba(16,185,129,0.7)', orbitColor2: 'rgba(56,189,248,0.5)',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.18, type: 'spring', stiffness: 70 }}
                style={{ position: 'relative', perspective: '1000px' }}
              >
                {/* ── HOLOGRAPHIC ROTATING BORDER ── */}
                <motion.div
                  animate={{ '--angle': ['0deg', '360deg'] } as any}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: i * 1.3 }}
                  className="holo-card-border"
                  style={{ '--accent': item.color } as any}
                />

                {/* ── MAIN CARD ── */}
                <motion.div
                  whileHover={{ y: -14, scale: 1.03, rotateY: 3, rotateX: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    position: 'relative',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, rgba(6,10,22,0.97) 0%, rgba(10,15,30,0.95) 100%)',
                    border: `1px solid ${item.color}30`,
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* ── Iridescent top shimmer bar ── */}
                  <motion.div
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                    style={{
                      height: '3px',
                      background: `linear-gradient(90deg, transparent, ${item.color}, ${item.accentLight}, white, ${item.accentLight}, ${item.color}, transparent)`,
                      backgroundSize: '200% 100%',
                    }}
                  />

                  {/* ── Card inner glow blob ── */}
                  <div style={{
                    position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
                    width: '280px', height: '200px', borderRadius: '50%',
                    background: `radial-gradient(ellipse, ${item.color}12 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />

                  {/* ── CONTENT ── */}
                  <div style={{ padding: '30px 26px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 1 }}>

                    {/* Status + year row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                      <motion.span
                        animate={item.status === 'ACTIVE' ? { opacity: [0.6, 1, 0.6], boxShadow: [`0 0 6px ${item.color}`, `0 0 14px ${item.color}`, `0 0 6px ${item.color}`] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ fontSize: '0.58rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2.5px', color: item.color, background: `${item.color}18`, border: `1px solid ${item.color}55`, padding: '3px 10px', borderRadius: '4px' }}
                      >
                        {item.status === 'ACTIVE' && <span style={{ marginRight: 5 }}>●</span>}{item.status}
                      </motion.span>
                      <span style={{ fontSize: '0.62rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>{item.year}</span>
                    </div>

                    {/* ── ORBITAL IMAGE ── */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                      <div style={{ position: 'relative', width: '120px', height: '120px' }}>

                        {/* Orbit ring 1 — spins clockwise */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                          style={{
                            position: 'absolute', inset: '-16px',
                            borderRadius: '50%',
                            border: `2px solid transparent`,
                            background: `conic-gradient(from 0deg, transparent 60%, ${item.orbitColor1} 75%, transparent 90%) border-box`,
                            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'destination-out',
                            maskComposite: 'exclude',
                          }}
                        />

                        {/* Orbit ring 2 — spins counter-clockwise, different phase */}
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                          style={{
                            position: 'absolute', inset: '-8px',
                            borderRadius: '50%',
                            border: `1.5px solid transparent`,
                            background: `conic-gradient(from 120deg, transparent 50%, ${item.orbitColor2} 65%, transparent 80%) border-box`,
                            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'destination-out',
                            maskComposite: 'exclude',
                          }}
                        />

                        {/* Orbiting dot on ring 1 */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                          style={{ position: 'absolute', inset: '-16px', borderRadius: '50%' }}
                        >
                          <div style={{
                            position: 'absolute', top: '-3px', left: '50%', transform: 'translateX(-50%)',
                            width: '7px', height: '7px', borderRadius: '50%',
                            background: item.color,
                            boxShadow: `0 0 12px ${item.color}, 0 0 24px ${item.color}88`,
                          }} />
                        </motion.div>

                        {/* Orbiting dot on ring 2 */}
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                          style={{ position: 'absolute', inset: '-8px', borderRadius: '50%' }}
                        >
                          <div style={{
                            position: 'absolute', bottom: '-3px', left: '50%', transform: 'translateX(-50%)',
                            width: '5px', height: '5px', borderRadius: '50%',
                            background: item.accentLight,
                            boxShadow: `0 0 8px ${item.accentLight}`,
                          }} />
                        </motion.div>

                        {/* Image core */}
                        <motion.div
                          animate={{ boxShadow: [`0 0 20px ${item.color}40`, `0 0 40px ${item.color}70`, `0 0 20px ${item.color}40`] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
                          style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${item.color}60`, background: '#050810' }}
                        >
                          <img src={item.image} alt={item.institution} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9) contrast(1.1)' }} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Short label */}
                    <motion.div
                      animate={{ letterSpacing: ['3px', '5px', '3px'] }}
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
                      style={{ textAlign: 'center', fontSize: '0.7rem', fontFamily: 'monospace', color: item.color, fontWeight: 800, marginBottom: '10px', textShadow: `0 0 10px ${item.color}88` }}
                    >
                      {item.short}
                    </motion.div>

                    {/* Degree */}
                    <div style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.45, marginBottom: '8px' }}>{item.degree}</div>

                    {/* Institution */}
                    <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', marginBottom: '24px' }}>{item.institution}</div>

                    <div style={{ flex: 1 }} />



                    {/* Grade */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px' }}>{item.gradeLabel}</span>
                      <motion.span
                        animate={{ textShadow: [`0 0 10px ${item.color}`, `0 0 25px ${item.color}, 0 0 50px ${item.color}88`, `0 0 10px ${item.color}`] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        style={{ fontSize: '1.85rem', fontWeight: 900, fontFamily: 'monospace', color: item.color }}
                      >
                        {item.grade}
                      </motion.span>
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div style={{ position: 'absolute', top: 12, left: 12, width: 20, height: 20, borderTop: `2px solid ${item.color}88`, borderLeft: `2px solid ${item.color}88`, borderRadius: '3px 0 0 0' }} />
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderTop: `2px solid ${item.color}88`, borderRight: `2px solid ${item.color}88`, borderRadius: '0 3px 0 0' }} />
                  <div style={{ position: 'absolute', bottom: 12, left: 12, width: 20, height: 20, borderBottom: `2px solid ${item.color}88`, borderLeft: `2px solid ${item.color}88`, borderRadius: '0 0 0 3px' }} />
                  <div style={{ position: 'absolute', bottom: 12, right: 12, width: 20, height: 20, borderBottom: `2px solid ${item.color}88`, borderRight: `2px solid ${item.color}88`, borderRadius: '0 0 3px 0' }} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>


        <section id="certifications" style={{ position: 'relative', overflow: 'hidden', padding: '60px 0' }}>
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <h2 className="section-title edu-title" style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 0 20px rgba(239,68,68,0.5)' }}>Declassified Records // Achievements</h2>
            <span className="section-count" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>2 FILES FOUND</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>

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
            animate={{ scale: [1, 1.08, 1], opacity: theme === 'light' ? [0.15, 0.3, 0.15] : [0.04, 0.1, 0.04] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', borderRadius: '50%', border: theme === 'light' ? '2px solid #3b82f6' : '1px solid #ef4444', zIndex: 0, pointerEvents: 'none' }}
          />
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: theme === 'light' ? [0.1, 0.25, 0.1] : [0.03, 0.07, 0.03] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px', borderRadius: '50%', border: theme === 'light' ? '2px solid #8b5cf6' : '1px solid #3b82f6', zIndex: 0, pointerEvents: 'none' }}
          />

          <motion.div className="contact-section" style={{ position: 'relative', zIndex: 1, background: 'transparent', boxShadow: 'none', maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '60px' }}>
              <motion.h2 className="section-title contact-title" style={{ marginBottom: 12, fontSize: '3.5rem', textAlign: 'center', color: theme === 'light' ? '#1e293b' : undefined }} animate={{ textShadow: theme === 'light' ? ['0 0 10px rgba(59,130,246,0.5)', '0 0 25px rgba(59,130,246,0.8)', '0 0 10px rgba(59,130,246,0.5)'] : ['0 0 10px #ef4444', '0 0 25px #ef4444', '0 0 10px #ef4444'] }} transition={{ duration: 2, repeat: Infinity }}>Establish Contact</motion.h2>
              <p className="contact-desc" style={{ maxWidth: '520px', margin: '0 auto', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.6, color: '#94a3b8' }}>
                "Open to internships, collaborations &amp; AI/Web dev opportunities. Drop a message."
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px', width: '100%', alignItems: 'stretch' }}>
              {/* Left: Contact Form — compact & wide */}
              <motion.div
                style={{ padding: '32px 36px', borderRadius: '24px', background: theme === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(10, 15, 24, 0.8)', backdropFilter: 'blur(24px)', border: theme === 'light' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(239,68,68,0.3)', boxShadow: theme === 'light' ? '0 20px 60px rgba(0,0,0,0.1), inset 0 0 60px rgba(59,130,246,0.05)' : '0 20px 60px rgba(0,0,0,0.8), inset 0 0 60px rgba(239,68,68,0.05)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                whileHover={{ boxShadow: theme === 'light' ? '0 20px 60px rgba(0,0,0,0.15), 0 0 50px rgba(59,130,246,0.2), inset 0 0 60px rgba(59,130,246,0.1)' : '0 20px 60px rgba(0,0,0,0.8), 0 0 50px rgba(239,68,68,0.15), inset 0 0 60px rgba(239,68,68,0.1)' }}
                transition={{ duration: 0.4 }}
              >
                {/* Animated top bar */}
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ position: 'absolute', top: 0, left: '5%', width: '90%', height: '1px', background: theme === 'light' ? 'linear-gradient(to right, transparent, #3b82f6, #60a5fa, #3b82f6, transparent)' : 'linear-gradient(to right, transparent, #a30000, #ff4444, #a30000, transparent)' }}
                />
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
                        alert('Transmission sent! Eshwar will respond shortly.');
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
                    whileHover={{ scale: 1.02, boxShadow: theme === 'light' ? '0 10px 40px rgba(59, 130, 246, 0.6)' : '0 10px 40px rgba(239, 68, 68, 0.6)' }} whileTap={{ scale: 0.98 }}
                  >
                    <Zap size={18} /> TRANSMIT SIGNAL
                  </motion.button>
                </form>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: theme === 'light' ? '#0f1117' : '#fff', fontWeight: 900, letterSpacing: '3px', fontSize: '1.2rem' }}>
              <Folder size={18} color="#ef4444" /> ESHWAR H S
            </div>
            <div style={{ color: theme === 'light' ? '#5a5a72' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '1px' }}>
              DETECTIVE DOSSIER © 2026
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
                whileHover={{ y: -4, scale: 1.1, backgroundColor: `${link.color}22`, borderColor: link.color, color: link.color, boxShadow: `0 0 12px ${link.color}44` }}
                href={link.href} target="_blank" rel="noreferrer"
                style={{
                  color: theme === 'light' ? '#5a5a72' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s', padding: '10px', borderRadius: '10px',
                  border: theme === 'light' ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.1)',
                  background: theme === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: theme === 'light' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          {/* Right: Actions & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <motion.div className="footer-status" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontFamily: 'monospace', letterSpacing: '1px', fontWeight: 800 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} /> ONLINE
            </motion.div>

            <motion.a
              href="/resume.pdf" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: theme === 'light' ? 'linear-gradient(135deg, rgba(192,57,43,0.12), rgba(192,57,43,0.04))' : 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(0,0,0,0))', border: theme === 'light' ? '1px solid rgba(192,57,43,0.4)' : '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: theme === 'light' ? '#c0392b' : '#fff', fontSize: '0.8rem', fontFamily: 'monospace', textDecoration: 'none', fontWeight: 800, letterSpacing: '1px', boxShadow: theme === 'light' ? '0 2px 12px rgba(192,57,43,0.15)' : 'none' }}
              whileHover={{ background: theme === 'light' ? 'rgba(192,57,43,0.2)' : 'rgba(239,68,68,0.2)', borderColor: theme === 'light' ? '#c0392b' : '#ef4444', boxShadow: '0 0 15px rgba(192,57,43,0.4)', scale: 1.05 }}
            >
              <FileText size={16} /> DECRYPT RESUME
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
