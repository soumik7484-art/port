import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getAnswer } from './chatbot.js';

/* ─────────────────────────────────────────────────────────
   CURSOR  (clean white circle for desktop only)
───────────────────────────────────────────────────────── */
export function CursorOrb() {
  const coreRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -300, y: -300 });
  const core  = useRef({ x: -300, y: -300 });
  const ring  = useRef({ x: -300, y: -300 });

  useEffect(() => {
    document.documentElement.classList.add('cursor-none');

    const move = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (e.target && typeof e.target.closest === 'function') {
        const mag = e.target.closest('[data-magnetic]');
        if (mag) {
          const r = mag.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          mag.style.transform = `translate(${(e.clientX - cx) * 0.2}px,${(e.clientY - cy) * 0.2}px)`;
        }
      }
    };

    const resetMag = (e) => {
      if (e.target && typeof e.target.closest === 'function') {
        const m = e.target.closest('[data-magnetic]');
        if (m) m.style.transform = '';
      }
    };

    const handleTouch = (e) => {
      if (e.touches?.length > 0) {
        const t = e.touches[0];
        mouse.current = { x: t.clientX, y: t.clientY };
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: t.clientX, clientY: t.clientY, bubbles: true }));
      }
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', resetMag, true);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });

    let id;
    const tick = () => {
      core.current.x += (mouse.current.x - core.current.x) * 0.2;
      core.current.y += (mouse.current.y - core.current.y) * 0.2;
      ring.current.x += (mouse.current.x - ring.current.x) * 0.08;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.08;
      if (coreRef.current) coreRef.current.style.transform = `translate(${core.current.x - 5}px,${core.current.y - 5}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x - 18}px,${ring.current.y - 18}px)`;
      id = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      document.documentElement.classList.remove('cursor-none');
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', resetMag, true);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchstart', handleTouch);
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <>
      {/* Solid dot */}
      <div ref={coreRef} className="hidden md:block fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ width: 10, height: 10, borderRadius: '50%', background: '#0a0a0a', mixBlendMode: 'multiply' }} />
      {/* Trailing ring */}
      <div ref={ringRef} className="hidden md:block fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid rgba(10,10,10,0.25)', mixBlendMode: 'multiply' }} />
    </>
  );
}


/* ─────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────── */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = ['About', 'Skills', 'Projects', 'Resume', 'Contact'];

  const go = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 32px',
      background: scrolled ? 'rgba(255,255,255,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
      transition: 'all 0.3s ease',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
    }}>
      <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em', cursor: 'pointer', color: '#0a0a0a' }}>
        SC
      </span>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map(l => (
          <button key={l} onClick={() => go(l)}
            style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#0a0a0a'}
            onMouseLeave={e => e.target.style.color = '#374151'}>
            {l}
          </button>
        ))}
        <button data-magnetic onClick={() => go('Contact')}
          style={{ background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => e.target.style.background = '#374151'}
          onMouseLeave={e => e.target.style.background = '#0a0a0a'}>
          Hire Me
        </button>
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden" onClick={() => setMenuOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
        <div style={{ width: 22, height: 1.5, background: '#0a0a0a', marginBottom: 5, borderRadius: 2, transition: 'all 0.2s',
          transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
        <div style={{ width: 22, height: 1.5, background: '#0a0a0a', marginBottom: 5, borderRadius: 2, transition: 'all 0.2s',
          opacity: menuOpen ? 0 : 1 }} />
        <div style={{ width: 22, height: 1.5, background: '#0a0a0a', borderRadius: 2, transition: 'all 0.2s',
          transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: '#fff', borderBottom: '1px solid #e5e7eb',
          padding: '16px 32px 24px', display: 'flex', flexDirection: 'column', gap: 12
        }}>
          {links.map(l => (
            <button key={l} onClick={() => go(l)}
              style={{ background: 'none', border: 'none', fontSize: 16, fontWeight: 500, color: '#374151', cursor: 'pointer', textAlign: 'left', padding: '4px 0' }}>
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}


/* ─────────────────────────────────────────────────────────
   HERO  — big name, clean tagline, photo card, stats
───────────────────────────────────────────────────────── */
export function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { n: '15+', label: 'Projects Built' },
    { n: '5+', label: 'AI Models Trained' },
    { n: '3+', label: 'Years Coding' },
  ];

  return (
    <section id="hero" style={{ minHeight: '100vh', paddingTop: 96, paddingBottom: 80, background: '#fff', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64, alignItems: 'center' }}>

          {/* LEFT */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.8s ease' }}>
            {/* Availability badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, border: '1px solid #dcfce7', background: '#f0fdf4', marginBottom: 32 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>Open to opportunities</span>
            </div>

            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', margin: '0 0 20px', color: '#0a0a0a' }}>
              Hi, I'm<br />
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>Soumik</span>
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#4b5563', lineHeight: 1.7, maxWidth: 480, margin: '0 0 40px', fontWeight: 400 }}>
              AI & ML Developer building intelligent systems and beautiful web experiences. I turn ideas into reality with code, data, and a lot of curiosity.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 56 }}>
              <button data-magnetic onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary">
                View My Work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button data-magnetic onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary">
                Get in Touch
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {stats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — photo card */}
          <div style={{ display: 'flex', justifyContent: 'center', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.8s ease 0.2s' }}>
            <div style={{ position: 'relative' }}>
              {/* Decorative blobs */}
              <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,126,234,0.12) 0%, transparent 70%)', top: -40, left: -40, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(118,75,162,0.1) 0%, transparent 70%)', bottom: -30, right: -30, pointerEvents: 'none' }} />

              {/* Card */}
              <div style={{
                width: 280, borderRadius: 24, background: '#fff', border: '1px solid #e5e7eb',
                boxShadow: '0 32px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
                overflow: 'hidden', position: 'relative', animation: 'float 6s ease-in-out infinite'
              }}>
                {/* Avatar area */}
                <div style={{ width: '100%', aspectRatio: '1', background: 'linear-gradient(135deg, #667eea10 0%, #764ba220 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <img src="/avatar.png" alt="Soumik Chatterjee"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: 72, background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }}>
                    👨‍💻
                  </div>
                </div>

                {/* Info strip */}
                <div style={{ padding: '18px 20px 20px' }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: '#0a0a0a', letterSpacing: '-0.02em' }}>Soumik Chatterjee</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>AI & ML Developer</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    {['Python', 'React', 'ML'].map(t => (
                      <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: '#f3f4f6', color: '#374151' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating pills */}
              <div style={{ position: 'absolute', top: 20, left: -70, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 100, padding: '8px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.07)', fontSize: 12, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', animation: 'float 5s ease-in-out 1s infinite' }}>
                🤖 AI/ML
              </div>
              <div style={{ position: 'absolute', bottom: 30, right: -70, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 100, padding: '8px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.07)', fontSize: 12, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', animation: 'float 5.5s ease-in-out 0.5s infinite' }}>
                💻 Full Stack
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────────────────── */
export function AboutSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} style={{ padding: '100px 32px', background: '#fafafa', borderTop: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div className="section-label">About Me</div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', margin: '0 0 16px', lineHeight: 1.15 }}>
            Turning data into<br />
            <span style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>intelligent experiences</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, marginTop: 60, opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }}>
          {[
            { icon: '🧠', title: 'AI & Machine Learning', desc: "I build and train models that solve real problems — from computer vision to NLP. I love the process of teaching machines to understand the world." },
            { icon: '🌐', title: 'Full-Stack Development', desc: "React on the front, Python/Node on the back. I craft complete digital products from database schema to pixel-perfect UI, optimized for performance." },
            { icon: '🎨', title: 'Interactive Design', desc: "Good software should feel great. I obsess over UX details, smooth animations, and interfaces that delight users from the first click." },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: 32, transition: 'all 0.3s ease 0s' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', margin: '0 0 10px', letterSpacing: '-0.02em' }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div style={{ marginTop: 60, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center', opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.35s' }}>
          <div>
            <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, margin: '0 0 20px' }}>
              I'm a Computer Science student with a deep passion for AI and its applications. Over the years, I've worked on everything from real-time object detection systems to full-stack web platforms.
            </p>
            <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, margin: 0 }}>
              When I'm not coding, I'm exploring research papers, contributing to open source, or experimenting with new frameworks. I believe in shipping fast, learning faster.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Location', value: 'India 🇮🇳' },
              { label: 'Education', value: 'B.Tech CS' },
              { label: 'Focus', value: 'AI/ML & Web' },
              { label: 'Available', value: 'Yes, let\'s talk' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '16px 20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────────────────
   SKILLS
───────────────────────────────────────────────────────── */
export function SkillsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const categories = [
    {
      label: 'AI & Machine Learning',
      color: '#667eea',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'Hugging Face', 'NumPy', 'Pandas', 'YOLO'],
    },
    {
      label: 'Frontend',
      color: '#f093fb',
      skills: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Tailwind CSS', 'Next.js', 'Framer Motion', 'GSAP'],
    },
    {
      label: 'Backend & Cloud',
      color: '#4facfe',
      skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Firebase', 'REST APIs', 'Git', 'Docker'],
    },
  ];

  return (
    <section id="skills" ref={ref} style={{ padding: '100px 32px', background: '#fff', borderTop: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div className="section-label">Skills</div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', margin: '0 0 16px', lineHeight: 1.15 }}>
            Tools & Technologies
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 0 60px', lineHeight: 1.7 }}>
            A collection of languages, frameworks, and tools I work with to build production-grade software.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }}>
          {categories.map((cat, ci) => (
            <div key={ci} className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{cat.label}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cat.skills.map((s, i) => (
                  <span key={i} style={{
                    fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 100,
                    background: `${cat.color}10`, color: cat.color, border: `1px solid ${cat.color}25`,
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.target.style.background = cat.color; e.target.style.color = '#fff'; }}
                    onMouseLeave={e => { e.target.style.background = `${cat.color}10`; e.target.style.color = cat.color; }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    title: 'Medical Image Diagnosis',
    desc: 'Deep learning pipeline for detecting diseases in X-rays and MRI scans using CNNs and transfer learning. Achieves 94% accuracy on benchmark datasets.',
    tags: ['Python', 'PyTorch', 'OpenCV', 'FastAPI'],
    color: '#22c55e',
    icon: '🩺',
    gh: 'https://github.com/soumik7484',
  },
  {
    title: 'MCQ Vision Solver',
    desc: 'Real-time AI system that reads quiz questions from a screen share and provides instant answers using Groq Vision API — built for speed under 10 seconds.',
    tags: ['React', 'Groq API', 'WebRTC', 'Node.js'],
    color: '#667eea',
    icon: '🎯',
    gh: 'https://github.com/soumik7484',
  },
  {
    title: 'Grammar Learning Platform',
    desc: 'Interactive educational platform with adaptive quizzes, progress tracking, and spaced-repetition algorithms to help users master grammar concepts.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    color: '#f093fb',
    icon: '📚',
    gh: 'https://github.com/soumik7484',
    live: 'https://grammar40.vercel.app',
  },
  {
    title: 'Legal AI Platform',
    desc: 'AI-powered legal document analyzer that extracts key clauses, summarizes contracts, and flags potential risks using LLMs and RAG architecture.',
    tags: ['Python', 'LangChain', 'RAG', 'React'],
    color: '#4facfe',
    icon: '⚖️',
    gh: 'https://github.com/soumik7484',
  },
  {
    title: 'Object Detection System',
    desc: 'Real-time multi-class object detection and tracking using YOLOv8, deployed as a web application with live camera feed and bounding box visualization.',
    tags: ['Python', 'YOLO', 'OpenCV', 'Streamlit'],
    color: '#f59e0b',
    icon: '👁️',
    gh: 'https://github.com/soumik7484',
  },
  {
    title: 'Interactive Portfolio',
    desc: 'This very portfolio — built with React, featuring smooth animations, a custom cursor, intersection observers, and a clean design system from scratch.',
    tags: ['React', 'CSS', 'GSAP', 'Vite'],
    color: '#ef4444',
    icon: '✨',
    gh: 'https://github.com/soumik7484',
  },
];

export function ProjectsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="projects" ref={ref} style={{ padding: '100px 32px', background: '#fafafa', borderTop: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div className="section-label">Projects</div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', margin: '0 0 16px', lineHeight: 1.15 }}>
            Things I've built
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 0 60px', lineHeight: 1.7 }}>
            A selection of projects across AI/ML, web development, and creative tools.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24, opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }}>
          {PROJECTS.map((p, i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, padding: 28,
                transition: 'all 0.35s ease',
                transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered === i ? '0 24px 60px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'default',
              }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ fontSize: 32, lineHeight: 1 }}>{p.icon}</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', textDecoration: 'none', transition: 'all 0.2s' }}
                      title="Live demo" onMouseEnter={e => e.currentTarget.style.background = '#0a0a0a'} onMouseLeave={e => e.currentTarget.style.background = '#f9fafb'}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  )}
                  <a href={p.gh} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', textDecoration: 'none', transition: 'all 0.2s' }}
                    title="GitHub" onMouseEnter={e => e.currentTarget.style.background = '#0a0a0a'} onMouseLeave={e => e.currentTarget.style.background = '#f9fafb'}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
                  </a>
                </div>
              </div>

              {/* Accent line */}
              <div style={{ width: 32, height: 3, borderRadius: 2, background: p.color, marginBottom: 14, transition: 'width 0.3s ease', ...(hovered === i ? { width: 64 } : {}) }} />

              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', margin: '0 0 10px', letterSpacing: '-0.02em' }}>{p.title}</h3>
              <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.65, margin: '0 0 20px' }}>{p.desc}</p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.tags.map((t, ti) => (
                  <span key={ti} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: '#f3f4f6', color: '#374151' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* More on GitHub */}
        <div style={{ textAlign: 'center', marginTop: 48, opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.4s' }}>
          <a href="https://github.com/soumik7484" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'inline-flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
            View all projects on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────────────────
   RESUME DOWNLOAD SECTION
───────────────────────────────────────────────────────── */
export function ResumeSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const highlights = [
    { icon: '🎓', label: 'B.Tech AIML', sub: 'Narula Institute of Technology' },
    { icon: '⭐', label: 'CGPA 8.58', sub: 'After 1st Semester' },
    { icon: '🏆', label: '3 Hackathons', sub: 'INNOVATEX ranker' },
    { icon: '🛠️', label: '2 AI Projects', sub: 'Medi AI & Legal AI' },
  ];

  return (
    <section id="resume" ref={ref} style={{ padding: '100px 32px', background: '#fff', borderTop: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Top label + heading */}
        <div style={{ textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Resume</div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', margin: '0 0 16px', lineHeight: 1.15 }}>
            My Full Resume
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto 56px', lineHeight: 1.7 }}>
            A complete overview of my education, skills, and projects — all in one page.
          </p>
        </div>

        {/* Highlights row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 48, opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.15s' }}>
          {highlights.map((h, i) => (
            <div key={i} style={{ padding: '20px 24px', background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 28 }}>{h.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0a0a0a' }}>{h.label}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{h.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Download card */}
        <div style={{
          opacity: visible ? 1 : 0,
          background: hovered ? '#0a0a0a' : '#fafafa',
          border: `2px solid ${hovered ? '#0a0a0a' : '#e5e7eb'}`,
          borderRadius: 24, padding: '40px 48px',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          transition: 'all 0.3s ease, opacity 0.7s ease 0.3s', cursor: 'default',
        }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>

          {/* Left — resume icon + text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* PDF icon */}
            <div style={{ width: 56, height: 56, borderRadius: 14, background: hovered ? 'rgba(255,255,255,0.1)' : '#f3f4f6', border: `1px solid ${hovered ? 'rgba(255,255,255,0.15)' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={hovered ? '#fff' : '#374151'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: hovered ? '#fff' : '#0a0a0a', letterSpacing: '-0.02em', transition: 'color 0.3s' }}>
                Soumik_Chatterjee_Resume.pdf
              </div>
              <div style={{ fontSize: 13, color: hovered ? 'rgba(255,255,255,0.6)' : '#9ca3af', marginTop: 4, transition: 'color 0.3s' }}>
                1 page · AI/ML & Full Stack Developer
              </div>
            </div>
          </div>

          {/* Right — Download button */}
          <a
            href="/resume.pdf"
            download="Soumik_Chatterjee_Resume.pdf"
            data-magnetic
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 28px', borderRadius: 12, textDecoration: 'none',
              background: hovered ? '#fff' : '#0a0a0a',
              color: hovered ? '#0a0a0a' : '#fff',
              fontWeight: 700, fontSize: 15,
              transition: 'all 0.3s ease',
              flexShrink: 0,
              boxShadow: hovered ? '0 4px 20px rgba(255,255,255,0.15)' : 'none',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Resume
          </a>
        </div>

      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────────────────
   CONTACT  — clean email box + animated social characters
───────────────────────────────────────────────────────── */
export function ContactSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  /* ── animated character helpers ── */
  // GitHub Cat
  const GitHubCat = () => (
    <a href="https://github.com/soumik7484" target="_blank" rel="noreferrer"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textDecoration: 'none', cursor: 'pointer' }}
      onMouseEnter={e => { const svg = e.currentTarget.querySelector('.char-cat'); if (svg) svg.style.transform = 'translateY(-6px)'; }}
      onMouseLeave={e => { const svg = e.currentTarget.querySelector('.char-cat'); if (svg) svg.style.transform = ''; }}>
      <div className="char-cat" style={{ transition: 'transform 0.3s ease' }}>
        <svg width="80" height="96" viewBox="0 0 80 96">
          {/* Body */}
          <ellipse cx="40" cy="68" rx="22" ry="18" fill="#1a1a2e" />
          {/* Head */}
          <circle cx="40" cy="42" r="20" fill="#1a1a2e" />
          {/* Ears */}
          <polygon points="24,28 18,12 30,24" fill="#1a1a2e" />
          <polygon points="26,27 21,14 31,24" fill="#ff6b8a" />
          <polygon points="56,28 62,12 50,24" fill="#1a1a2e" />
          <polygon points="54,27 59,14 49,24" fill="#ff6b8a" />
          {/* Eyes */}
          <circle cx="33" cy="40" r="5" fill="#fff" />
          <circle cx="47" cy="40" r="5" fill="#fff" />
          <circle cx="34" cy="41" r="2.5" fill="#0a0a0a" />
          <circle cx="48" cy="41" r="2.5" fill="#0a0a0a" />
          <circle cx="35" cy="40" r="1" fill="#fff" />
          <circle cx="49" cy="40" r="1" fill="#fff" />
          {/* Nose */}
          <polygon points="40,46 37,49 43,49" fill="#ff6b8a" />
          {/* Mouth */}
          <path d="M37,49 Q40,52 43,49" fill="none" stroke="#ff6b8a" strokeWidth="1.2" />
          {/* Whiskers */}
          <line x1="20" y1="46" x2="33" y2="47" stroke="#6b7280" strokeWidth="0.8" />
          <line x1="20" y1="49" x2="33" y2="49" stroke="#6b7280" strokeWidth="0.8" />
          <line x1="47" y1="47" x2="60" y2="46" stroke="#6b7280" strokeWidth="0.8" />
          <line x1="47" y1="49" x2="60" y2="49" stroke="#6b7280" strokeWidth="0.8" />
          {/* Arms holding icon */}
          <line x1="24" y1="66" x2="14" y2="78" stroke="#1a1a2e" strokeWidth="5" strokeLinecap="round" />
          <line x1="56" y1="66" x2="66" y2="78" stroke="#1a1a2e" strokeWidth="5" strokeLinecap="round" />
          {/* Tail */}
          <path d="M18,80 Q4,72 8,60 Q12,50 22,55" fill="none" stroke="#1a1a2e" strokeWidth="4.5" strokeLinecap="round" style={{ transformOrigin:'18px 80px', animation:'wave 2s ease-in-out infinite' }} />
          {/* GitHub Icon (held) */}
          <g transform="translate(27,78)">
            <circle cx="13" cy="11" r="11" fill="#0a0a0a" />
            <path d="M13 4A7 7 0 006 11c0 3.09 2 5.72 4.79 6.65.35.06.46-.16.46-.35v-1.18c-1.94.42-2.35-.94-2.35-.94-.32-.81-.78-1.03-.78-1.03-.63-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.61 1.06 1.64.75 2.04.57.06-.46.24-.76.44-.94-1.55-.18-3.18-.78-3.18-3.44 0-.76.27-1.4.72-1.9-.07-.17-.31-.9.07-1.84 0 0 .59-.19 1.93.71.56-.15 1.15-.23 1.75-.23.6 0 1.19.08 1.75.23 1.34-.9 1.93-.71 1.93-.71.38.94.14 1.67.07 1.84.45.5.72 1.14.72 1.9 0 2.67-1.63 3.26-3.19 3.44.25.22.48.64.48 1.3v1.93c0 .19.11.41.47.34A7 7 0 0013 4z" fill="#fff" />
          </g>
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>GitHub</div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>@soumik7484</div>
      </div>
    </a>
  );

  // LinkedIn Suited Man
  const LinkedInMan = () => (
    <a href="https://linkedin.com/in/soumikchatterjee" target="_blank" rel="noreferrer"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textDecoration: 'none', cursor: 'pointer' }}
      onMouseEnter={e => { const svg = e.currentTarget.querySelector('.char-man'); if (svg) svg.style.transform = 'translateY(-6px)'; }}
      onMouseLeave={e => { const svg = e.currentTarget.querySelector('.char-man'); if (svg) svg.style.transform = ''; }}>
      <div className="char-man" style={{ transition: 'transform 0.3s ease' }}>
        <svg width="80" height="96" viewBox="0 0 80 96">
          {/* Body / suit */}
          <rect x="20" y="55" width="40" height="32" rx="6" fill="#1e3a5f" />
          {/* Shirt */}
          <rect x="33" y="55" width="14" height="32" fill="#fff" opacity="0.9" />
          {/* Tie */}
          <polygon points="40,57 37,64 40,86 43,64" fill="#0077b5" />
          {/* Lapels */}
          <polygon points="33,55 20,65 27,55" fill="#163250" />
          <polygon points="47,55 60,65 53,55" fill="#163250" />
          {/* Head */}
          <circle cx="40" cy="38" r="18" fill="#f5c5a3" />
          {/* Hair */}
          <ellipse cx="40" cy="22" rx="18" ry="9" fill="#3d2b1f" />
          {/* Eyes */}
          <circle cx="33" cy="37" r="2.5" fill="#3d2b1f" />
          <circle cx="47" cy="37" r="2.5" fill="#3d2b1f" />
          <circle cx="34" cy="36" r="0.8" fill="#fff" />
          <circle cx="48" cy="36" r="0.8" fill="#fff" />
          {/* Smile */}
          <path d="M34,44 Q40,49 46,44" fill="none" stroke="#c17b4e" strokeWidth="1.5" strokeLinecap="round" />
          {/* Ears */}
          <ellipse cx="22" cy="38" rx="3.5" ry="4.5" fill="#f5c5a3" />
          <ellipse cx="58" cy="38" rx="3.5" ry="4.5" fill="#f5c5a3" />
          {/* Arms */}
          <rect x="8" y="55" width="13" height="7" rx="3.5" fill="#1e3a5f" />
          <rect x="59" y="55" width="13" height="7" rx="3.5" fill="#1e3a5f" />
          {/* Hands holding badge */}
          <circle cx="14" cy="69" r="4" fill="#f5c5a3" />
          <circle cx="66" cy="69" r="4" fill="#f5c5a3" />
          {/* LinkedIn card */}
          <rect x="24" y="72" width="32" height="22" rx="4" fill="#0077b5" />
          <text x="40" y="86" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="Arial">in</text>
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>LinkedIn</div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Let's connect</div>
      </div>
    </a>
  );

  // Email Postman
  const EmailPostman = () => (
    <a href="mailto:soumikchatterjee.dev@gmail.com"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textDecoration: 'none', cursor: 'pointer' }}
      onMouseEnter={e => { const svg = e.currentTarget.querySelector('.char-post'); if (svg) svg.style.transform = 'translateY(-6px)'; }}
      onMouseLeave={e => { const svg = e.currentTarget.querySelector('.char-post'); if (svg) svg.style.transform = ''; }}>
      <div className="char-post" style={{ transition: 'transform 0.3s ease' }}>
        <svg width="80" height="96" viewBox="0 0 80 96">
          {/* Legs */}
          <rect x="28" y="75" width="9" height="18" rx="4" fill="#1a4a7a" />
          <rect x="43" y="75" width="9" height="18" rx="4" fill="#1a4a7a" />
          {/* Shoes */}
          <ellipse cx="32" cy="92" rx="7" ry="3.5" fill="#2d1b0e" />
          <ellipse cx="47" cy="92" rx="7" ry="3.5" fill="#2d1b0e" />
          {/* Body / uniform */}
          <rect x="20" y="52" width="40" height="26" rx="7" fill="#1a4a7a" />
          {/* Bag strap */}
          <path d="M56,58 Q66,65 60,78" fill="none" stroke="#8b6914" strokeWidth="3" strokeLinecap="round" />
          {/* Head */}
          <circle cx="40" cy="36" r="19" fill="#f5c5a3" />
          {/* Hat */}
          <rect x="22" y="20" width="36" height="8" rx="3" fill="#1a4a7a" />
          <rect x="18" y="25" width="44" height="4" rx="2" fill="#1a4a7a" />
          {/* Badge on hat */}
          <rect x="33" y="21" width="14" height="6" rx="2" fill="#fbbf24" />
          {/* Eyes */}
          <circle cx="33" cy="36" r="2.5" fill="#3d2b1f" />
          <circle cx="47" cy="36" r="2.5" fill="#3d2b1f" />
          {/* Smile */}
          <path d="M34,43 Q40,47 46,43" fill="none" stroke="#c17b4e" strokeWidth="1.5" strokeLinecap="round" />
          {/* Arms extended holding envelope */}
          <rect x="6" y="60" width="16" height="7" rx="3.5" fill="#1a4a7a" />
          <rect x="58" y="60" width="16" height="7" rx="3.5" fill="#1a4a7a" />
          <circle cx="11" cy="73" r="4.5" fill="#f5c5a3" />
          <circle cx="69" cy="73" r="4.5" fill="#f5c5a3" />
          {/* Envelope */}
          <rect x="17" y="68" width="46" height="28" rx="4" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
          <polyline points="17,68 40,84 63,68" fill="none" stroke="#ea4335" strokeWidth="2" strokeLinejoin="round" />
          <line x1="17" y1="96" x2="32" y2="80" stroke="#ea4335" strokeWidth="1.2" />
          <line x1="63" y1="96" x2="48" y2="80" stroke="#ea4335" strokeWidth="1.2" />
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>Email</div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Say hello</div>
      </div>
    </a>
  );

  return (
    <section id="contact" ref={ref} style={{ padding: '100px 32px 80px', background: '#fff', borderTop: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Contact</div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.8rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0a', margin: '0 0 20px', lineHeight: 1.1 }}>
            Let's work together
          </h2>
          <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 56px' }}>
            I'm always open to interesting projects, collaborations, and opportunities. Drop me a message — I respond within 24 hours.
          </p>
        </div>

        {/* Social characters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(32px, 8vw, 80px)', flexWrap: 'wrap', marginBottom: 60, opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }}>
          <GitHubCat />
          <LinkedInMan />
          <EmailPostman />
        </div>

        {/* CTA */}
        <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.35s' }}>
          <a href="mailto:soumikchatterjee.dev@gmail.com" data-magnetic className="btn-primary" style={{ fontSize: 16, padding: '16px 36px', borderRadius: 14 }}>
            ✉️ Send me an Email
          </a>
        </div>

      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer style={{ padding: '32px', background: '#fafafa', borderTop: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 16, color: '#0a0a0a', letterSpacing: '-0.03em' }}>Soumik Chatterjee</span>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>© {new Date().getFullYear()} · Built with React & ❤️</span>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: 'GitHub', href: 'https://github.com/soumik7484' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/soumikchatterjee' },
            { label: 'Email', href: 'mailto:soumikchatterjee.dev@gmail.com' },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
              style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#0a0a0a'}
              onMouseLeave={e => e.target.style.color = '#6b7280'}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}


/* ─────────────────────────────────────────────────────────
   CHATBOT WIDGET — trained on Soumik's resume
───────────────────────────────────────────────────────── */
export function ChatbotWidget() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! 👋 I'm Soumik's AI assistant. Ask me anything about him — skills, projects, education, or how to hire him!" }
  ]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    setMessages(m => [...m, { from: 'user', text: q }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const answer = getAnswer(q);
      setMessages(m => [...m, { from: 'bot', text: answer }]);
      setTyping(false);
    }, 600);
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  // Render markdown-like bold (**text**) and bullet points
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      // Bold: **text**
      const parts = line.split(/\*\*(.*?)\*\*/);
      return (
        <span key={i} style={{ display: 'block', marginBottom: line === '' ? 6 : 2 }}>
          {parts.map((part, pi) =>
            pi % 2 === 1
              ? <strong key={pi} style={{ color: '#0a0a0a', fontWeight: 700 }}>{part}</strong>
              : part
          )}
        </span>
      );
    });
  };

  const QUICK = ['What are his skills?', 'Tell me about projects', 'How to hire him?', 'Contact info'];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Chat with Soumik's AI"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9000,
          width: 56, height: 56, borderRadius: '50%',
          background: open ? '#374151' : '#0a0a0a',
          border: 'none', cursor: 'pointer', boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s ease',
          transform: open ? 'scale(0.92)' : 'scale(1)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = open ? 'scale(0.92)' : 'scale(1)'}>
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        }
      </button>

      {/* Notification dot when closed */}
      {!open && (
        <div style={{ position: 'fixed', bottom: 68, right: 28, zIndex: 9001, background: '#22c55e', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', pointerEvents: 'none' }}>
          Ask me anything!
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 8999,
          width: 'min(380px, calc(100vw - 40px))',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 20,
          boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s ease',
        }}>

          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0a0a0a' }}>Soumik's AI Assistant</div>
              <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                Online · Trained on resume
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 340, minHeight: 200 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.from === 'bot' && (
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginRight: 8, flexShrink: 0, marginTop: 2 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '78%',
                  padding: '10px 14px',
                  borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.from === 'user' ? '#0a0a0a' : '#f9fafb',
                  color: msg.from === 'user' ? '#fff' : '#374151',
                  fontSize: 13,
                  lineHeight: 1.6,
                  border: msg.from === 'bot' ? '1px solid #f3f4f6' : 'none',
                }}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🤖</div>
                <div style={{ display: 'flex', gap: 4, padding: '12px 14px', background: '#f9fafb', borderRadius: '16px 16px 16px 4px', border: '1px solid #f3f4f6' }}>
                  {[0,1,2].map(d => (
                    <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', animation: `pulse-slow 1.2s ease ${d * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 16px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); setTimeout(send, 10); }}
                  style={{ fontSize: 11, fontWeight: 600, padding: '5px 11px', borderRadius: 100, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.target.style.background = '#0a0a0a'; e.target.style.color = '#fff'; e.target.style.borderColor = '#0a0a0a'; }}
                  onMouseLeave={e => { e.target.style.background = '#f9fafb'; e.target.style.color = '#374151'; e.target.style.borderColor = '#e5e7eb'; }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about Soumik..."
              style={{
                flex: 1, padding: '9px 14px', borderRadius: 12,
                border: '1.5px solid #e5e7eb', fontSize: 13,
                outline: 'none', fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.2s',
                background: '#fff', color: '#0a0a0a',
              }}
              onFocus={e => e.target.style.borderColor = '#0a0a0a'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <button onClick={send} disabled={!input.trim()}
              style={{
                width: 38, height: 38, borderRadius: 10, border: 'none',
                background: input.trim() ? '#0a0a0a' : '#e5e7eb',
                color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
              }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
