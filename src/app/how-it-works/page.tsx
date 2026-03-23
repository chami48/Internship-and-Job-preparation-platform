import Link from "next/link";

const stats = [
  { value: "10k+", label: "Active Candidates" },
  { value: "500+", label: "Partner Companies" },
  { value: "3×", label: "Faster Shortlisting" },
  { value: "98%", label: "Verified Results" },
];

const steps = [
  {
    num: "01",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 28 }}>
        <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M34 22l2.5 2.5L42 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Build your profile",
    body: "Sign up and craft a proof-ready portfolio — skills, projects, and interests that stand out to the right employers.",
    tag: "2 minutes",
  },
  {
    num: "02",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 28 }}>
        <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <path d="M6 18h36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="13" cy="14" r="1.5" fill="currentColor" />
        <circle cx="19" cy="14" r="1.5" fill="currentColor" />
        <path d="M14 28h8M14 33h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="34" cy="31" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M38 35l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Discover & apply",
    body: "Filter internships and jobs by your exact skills. One-click apply through HireSmart — no re-entering your details.",
    tag: "Smart filters",
  },
  {
    num: "03",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 28 }}>
        <rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <path d="M16 18h16M16 24h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 34l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Complete assessments",
    body: "Take role-specific timed exams with live identity checks. Every result is verified and tamper-proof.",
    tag: "AI-proctored",
  },
  {
    num: "04",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 28 }}>
        <path d="M24 6l4.5 9.5 10.5 1.5-7.5 7.5 1.8 10.5L24 30l-9.3 5 1.8-10.5L9 17l10.5-1.5L24 6z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 38v4M18 40l2-3M30 40l-2-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Get hired faster",
    body: "Companies see your readiness score and invite top candidates directly. No black-box decisions — just clear signals.",
    tag: "Verified badge",
  },
];

const tracks = [
  {
    audience: "Candidates",
    points: [
      { label: "AI interview drills", desc: "Practice with adaptive mock interviews tailored to your target role" },
      { label: "Unified dashboard", desc: "Track every application status and deadline in one place" },
      { label: "Verified score badge", desc: "Showcase tamper-proof results directly to recruiters" },
      { label: "Personalised feedback", desc: "Know exactly where to improve between applications" },
    ],
  },
  {
    audience: "Companies",
    points: [
      { label: "Custom assessments", desc: "Launch role-specific exams in minutes, not days" },
      { label: "Readiness signals", desc: "Compare candidates with clear, objective scoring" },
      { label: "Faster shortlisting", desc: "Cut screening time by up to 70% with trusted results" },
      { label: "Identity assurance", desc: "Every submission is proctored and fraud-proof" },
    ],
  },
];

const pillars = [
  {
    label: "Integrity",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 26, height: 26 }}>
        <path d="M20 4l13 5v9c0 8-5.5 14.5-13 17C7.5 32.5 7 26 7 18V9L20 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    body: "Proctoring and identity checks keep every result fair. Candidates earn their scores — no exceptions.",
  },
  {
    label: "Clarity",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 26, height: 26 }}>
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
        <path d="M20 13v7l4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="10" r="3" fill="currentColor" />
      </svg>
    ),
    body: "Readable signals replace guesswork. Both sides of the hiring table always know where things stand.",
  },
  {
    label: "Growth",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 26, height: 26 }}>
        <polyline points="6,32 14,20 20,26 28,12 34,18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M28 12h6v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    body: "Detailed feedback loops help candidates improve with every attempt, building real-world readiness over time.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="hiw-root">
      <style>{`
        .hiw-root {
          color: #0F172A;
          background: #EEF6FF;
          overflow-x: hidden;
        }

        /* ─── HERO ─────────────────────────────────────────────── */
        .hiw-hero {
          position: relative;
          padding: 96px 24px 80px;
          text-align: center;
          overflow: hidden;
        }

        .hiw-hero-orb-1 {
          position: absolute; top: -10%; right: -5%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%);
          border-radius: 50%; filter: blur(80px);
          animation: hiw-float 15s ease-in-out infinite;
          pointer-events: none;
        }

        .hiw-hero-orb-2 {
          position: absolute; bottom: 5%; left: -8%;
          width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%);
          border-radius: 50%; filter: blur(80px);
          animation: hiw-float 18s ease-in-out infinite reverse;
          pointer-events: none;
        }

        @keyframes hiw-float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50%       { transform: translateY(40px) translateX(20px); }
        }

        .hiw-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 820px;
          margin: 0 auto;
        }

        .hiw-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(14,165,233,0.35);
          border-radius: 10px;
          padding: 7px 16px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0369A1;
          margin-bottom: 28px;
          backdrop-filter: blur(8px);
        }

        .hiw-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #0EA5E9;
          animation: hiw-blink 1.4s infinite;
        }

        @keyframes hiw-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .hiw-hero-title {
          font-size: clamp(2.8rem, 6.5vw, 5.2rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #0F172A;
          margin: 0 0 8px;
        }

        .hiw-hero-title-accent {
          font-size: clamp(2rem, 4.5vw, 3.6rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #1a2e4a;
          margin: 0 0 24px;
        }

        .hiw-hero-title-accent span { color: #0EA5E9; }

        .hiw-hero-sub {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #4A6580;
          max-width: 580px;
          margin: 0 auto 36px;
        }

        .hiw-hero-ctas {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .hiw-btn-dark {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1a2e4a;
          color: white;
          padding: 15px 32px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(26,46,74,0.25);
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .hiw-btn-dark:hover {
          background: #152540;
          transform: translateY(-3px);
          box-shadow: 0 16px 36px rgba(26,46,74,0.3);
        }

        .hiw-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.8);
          border: 1.5px solid #CBD5E1;
          color: #334155;
          padding: 15px 32px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s;
        }

        .hiw-btn-outline:hover {
          border-color: #0EA5E9;
          color: #0369A1;
          background: rgba(224,242,254,0.9);
          transform: translateY(-3px);
        }

        /* ─── STATS ─────────────────────────────────────────────── */
        .hiw-stats {
          background: linear-gradient(135deg, #1a2e4a 0%, #0c2040 100%);
          position: relative;
          overflow: hidden;
        }

        .hiw-stats-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .hiw-stats-inner {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        @media (max-width: 700px) {
          .hiw-stats-inner { grid-template-columns: repeat(2, 1fr); }
        }

        .hiw-stat {
          padding: 36px 24px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
        }

        .hiw-stat:last-child { border-right: none; }

        .hiw-stat-value {
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: white;
          line-height: 1;
        }

        .hiw-stat-value span { color: #0EA5E9; }

        .hiw-stat-label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-top: 6px;
        }

        /* ─── SHARED SECTION WRAPPER ─────────────────────────────── */
        .hiw-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 90px 24px;
        }

        .hiw-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0EA5E9;
          margin-bottom: 14px;
        }

        .hiw-eyebrow::before {
          content: "";
          width: 20px; height: 2px;
          background: #0EA5E9;
          border-radius: 2px;
        }

        .hiw-section-title {
          font-size: clamp(1.9rem, 4vw, 2.8rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #0F172A;
          max-width: 680px;
          line-height: 1.15;
        }

        .hiw-section-sub {
          margin-top: 14px;
          font-size: 1rem;
          line-height: 1.8;
          color: #4A6580;
          max-width: 540px;
        }

        /* ─── STEPS ─────────────────────────────────────────────── */
        .hiw-step-grid {
          margin-top: 56px;
          display: grid;
          gap: 0;
        }

        @media (min-width: 900px) {
          .hiw-step-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .hiw-step {
          padding: 0 28px 0 0;
          position: relative;
        }

        @media (max-width: 899px) {
          .hiw-step {
            display: flex;
            gap: 20px;
            align-items: flex-start;
            padding: 24px 0;
            border-bottom: 1px solid #E2E8F0;
          }
          .hiw-step:last-child { border-bottom: none; }
        }

        .hiw-step-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: white;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(15,23,42,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          flex-shrink: 0;
          color: #0369A1;
          transition: border-color 0.25s, box-shadow 0.25s;
          position: relative;
        }

        .hiw-step:hover .hiw-step-icon-wrap {
          border-color: rgba(14,165,233,0.4);
          box-shadow: 0 4px 20px rgba(14,165,233,0.14);
        }

        .hiw-step-num {
          position: absolute;
          top: -9px; right: -9px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #1a2e4a;
          color: white;
          font-size: 0.6rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hiw-step-content { flex: 1; }

        .hiw-step-tag {
          display: inline-block;
          font-size: 0.67rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0369A1;
          background: #E0F2FE;
          border: 1px solid rgba(14,165,233,0.25);
          border-radius: 100px;
          padding: 2px 10px;
          margin-bottom: 8px;
        }

        .hiw-step-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .hiw-step-body {
          font-size: 0.88rem;
          line-height: 1.75;
          color: #64748B;
        }

        .hiw-step-connector {
          display: none;
        }

        @media (min-width: 900px) {
          .hiw-step-connector {
            display: block;
            position: absolute;
            top: 30px;
            left: 72px; right: 0;
            height: 1px;
            background: linear-gradient(90deg, rgba(14,165,233,0.3), rgba(14,165,233,0.05));
            pointer-events: none;
          }
          .hiw-step:last-child .hiw-step-connector { display: none; }
        }

        /* ─── FLOW DIAGRAM ──────────────────────────────────────── */
        .hiw-flow {
          margin-top: 48px;
          background: white;
          border: 1px solid rgba(14,165,233,0.2);
          border-radius: 20px;
          padding: 28px 36px;
          box-shadow: 0 4px 24px rgba(14,165,233,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .hiw-flow { flex-direction: column; padding: 24px 20px; }
        }

        .hiw-flow-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .hiw-flow-circle {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a2e4a, #0c2040);
          color: white;
          font-size: 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(26,46,74,0.2);
        }

        .hiw-flow-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #334155;
          text-align: center;
        }

        .hiw-flow-arrow {
          color: #CBD5E1;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .hiw-flow-arrow { transform: rotate(90deg); }
        }

        /* ─── DARK TRACKS SECTION ───────────────────────────────── */
        .hiw-dark {
          background: linear-gradient(135deg, #1a2e4a 0%, #0c2040 100%);
          position: relative;
          overflow: hidden;
        }

        .hiw-dark-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .hiw-dark .hiw-section-title { color: white; }
        .hiw-dark .hiw-section-sub   { color: rgba(255,255,255,0.55); }
        .hiw-dark .hiw-eyebrow        { color: #38BDF8; }
        .hiw-dark .hiw-eyebrow::before { background: #38BDF8; }

        .hiw-tracks-grid {
          margin-top: 48px;
          display: grid;
          gap: 20px;
        }

        @media (min-width: 900px) {
          .hiw-tracks-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .hiw-track {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 32px;
          transition: border-color 0.25s, background 0.25s;
        }

        .hiw-track:hover {
          border-color: rgba(14,165,233,0.4);
          background: rgba(255,255,255,0.08);
        }

        .hiw-track-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .hiw-track-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(14,165,233,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hiw-track-for {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .hiw-track-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: white;
          letter-spacing: -0.01em;
          margin-top: 2px;
        }

        .hiw-track-points {
          list-style: none;
          padding: 0; margin: 0;
          display: grid;
          gap: 14px;
        }

        .hiw-track-point {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .hiw-track-check {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: rgba(14,165,233,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .hiw-track-point-label {
          font-size: 0.88rem;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin-bottom: 2px;
        }

        .hiw-track-point-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
        }

        /* ─── PILLARS ───────────────────────────────────────────── */
        .hiw-pillar-grid {
          margin-top: 48px;
          display: grid;
          gap: 18px;
        }

        @media (min-width: 900px) {
          .hiw-pillar-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .hiw-pillar {
          background: white;
          border: 1px solid rgba(14,165,233,0.2);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 24px rgba(14,165,233,0.06);
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }

        .hiw-pillar:hover {
          border-color: rgba(14,165,233,0.4);
          box-shadow: 0 16px 40px rgba(14,165,233,0.12);
          transform: translateY(-4px);
        }

        .hiw-pillar-icon {
          width: 48px; height: 48px;
          border-radius: 13px;
          background: #E0F2FE;
          color: #0369A1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .hiw-pillar-label {
          font-size: 1.1rem;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .hiw-pillar-body {
          font-size: 0.88rem;
          line-height: 1.75;
          color: #64748B;
          margin: 0;
        }

        /* ─── CTA ───────────────────────────────────────────────── */
        .hiw-cta-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px 100px;
        }

        .hiw-cta-card {
          background: linear-gradient(135deg, #1a2e4a 0%, #0c2040 100%);
          border: 1px solid rgba(14,165,233,0.15);
          border-radius: 24px;
          padding: 64px 56px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }

        .hiw-cta-card::before {
          content: "";
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 50% 80% at -5% 50%, rgba(14,165,233,0.15), transparent 55%);
          pointer-events: none;
        }

        .hiw-cta-card-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .hiw-cta-text {
          position: relative; z-index: 2;
          flex: 1; min-width: 260px;
        }

        .hiw-cta-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #38BDF8;
          margin-bottom: 14px;
        }

        .hiw-cta-eyebrow::before {
          content: "";
          width: 16px; height: 2px;
          background: #38BDF8;
        }

        .hiw-cta-title {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          color: white;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .hiw-cta-title span { color: #0EA5E9; }

        .hiw-cta-sub {
          font-size: 0.95rem;
          line-height: 1.75;
          color: rgba(255,255,255,0.55);
          max-width: 420px;
        }

        .hiw-cta-actions {
          position: relative; z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-shrink: 0;
        }

        .hiw-cta-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #0EA5E9;
          color: white;
          padding: 15px 34px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(14,165,233,0.3);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }

        .hiw-cta-btn-primary:hover {
          background: #0284C7;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(14,165,233,0.4);
        }

        .hiw-cta-btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.75);
          padding: 15px 34px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
        }

        .hiw-cta-btn-ghost:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.3);
          color: white;
          transform: translateY(-2px);
        }

        /* ─── RESPONSIVE ─────────────────────────────────────────── */
        @media (max-width: 640px) {
          .hiw-section { padding: 60px 20px; }
          .hiw-hero { padding: 72px 20px 60px; }
          .hiw-cta-card { padding: 40px 24px; }
          .hiw-cta-wrap { padding: 0 20px 64px; }
          .hiw-stat { padding: 24px 16px; }
          .hiw-stat-value { font-size: 1.8rem; }
          .hiw-track { padding: 24px; }
          .hiw-pillar { padding: 22px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hiw-hero">
        <div className="hiw-hero-orb-1" />
        <div className="hiw-hero-orb-2" />

        <div className="hiw-hero-inner">
          <div className="hiw-badge">
            <span className="hiw-badge-dot" />
            How it works
          </div>

          <h1 className="hiw-hero-title">Beyond Skills,</h1>
          <h2 className="hiw-hero-title-accent">
            Into <span>Opportunity.</span>
          </h2>

          <p className="hiw-hero-sub">
            HireSmart unifies preparation, verified assessment, and intelligent
            hiring into one seamless journey — so every candidate gets a fair
            shot and every company hires with confidence.
          </p>

          {/* <div className="hiw-hero-ctas">
            <Link href="/student/register" className="hiw-btn-dark">
              Start as Student
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/company/register" className="hiw-btn-outline">
              For Companies
            </Link>
          </div> */}
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="hiw-stats">
        <div className="hiw-stats-grid-bg" />
        <div className="hiw-stats-inner">
          {stats.map((s) => {
            const num = s.value.replace(/[^0-9.]/g, "");
            const suffix = s.value.replace(/[0-9.]/g, "");
            return (
              <div key={s.label} className="hiw-stat">
                <div className="hiw-stat-value">{num}<span>{suffix}</span></div>
                <div className="hiw-stat-label">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STEPS ── */}
      <section className="hiw-section">
        <div className="hiw-eyebrow">The Process</div>
        <h2 className="hiw-section-title">From profile to offer in four clear steps</h2>
        <p className="hiw-section-sub">
          Every applicant follows the same verified path. No hidden stages,
          no ambiguous feedback — just a clean, transparent journey.
        </p>

        <div className="hiw-step-grid">
          {steps.map((step) => (
            <div key={step.num} className="hiw-step">
              <div className="hiw-step-icon-wrap">
                <span className="hiw-step-num">{step.num}</span>
                {step.icon}
              </div>
              <div className="hiw-step-connector" aria-hidden />
              <div className="hiw-step-content">
                <span className="hiw-step-tag">{step.tag}</span>
                <div className="hiw-step-title">{step.title}</div>
                <div className="hiw-step-body">{step.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="hiw-flow">
          {steps.map((step, i) => (
            <div key={step.num} className="hiw-flow-group">
              <div className="hiw-flow-node">
                <div className="hiw-flow-circle">{i + 1}</div>
                <div className="hiw-flow-label">{step.title}</div>
              </div>
              {i < steps.length - 1 && (
                <div className="hiw-flow-arrow" aria-hidden>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── TRACKS (dark) ── */}
      <div className="hiw-dark">
        <div className="hiw-dark-grid" />
        <section className="hiw-section">
          <div className="hiw-eyebrow">Two Paths, One Platform</div>
          <h2 className="hiw-section-title">Built for both sides of the table</h2>
          <p className="hiw-section-sub">
            Whether you&apos;re chasing your first internship or building your next
            team — HireSmart is designed around your workflow.
          </p>

          <div className="hiw-tracks-grid">
            {tracks.map((track) => (
              <div key={track.audience} className="hiw-track">
                <div className="hiw-track-header">
                  <div className="hiw-track-icon">
                    <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                      {track.audience === "Candidates" ? (
                        <>
                          <circle cx="12" cy="7" r="4" stroke="#38BDF8" strokeWidth="2" />
                          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                        </>
                      ) : (
                        <>
                          <rect x="2" y="7" width="20" height="14" rx="2" stroke="#38BDF8" strokeWidth="2" />
                          <path d="M8 7V5a4 4 0 018 0v2" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                          <path d="M9 13l2 2 4-4" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      )}
                    </svg>
                  </div>
                  <div>
                    <div className="hiw-track-for">For</div>
                    <div className="hiw-track-title">{track.audience}</div>
                  </div>
                </div>

                <ul className="hiw-track-points">
                  {track.points.map((point) => (
                    <li key={point.label} className="hiw-track-point">
                      <div className="hiw-track-check">
                        <svg viewBox="0 0 10 10" fill="none" style={{ width: 10, height: 10 }}>
                          <path d="M2 5l2.5 2.5L8 3" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <div className="hiw-track-point-label">{point.label}</div>
                        <div className="hiw-track-point-desc">{point.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── PILLARS ── */}
      <section className="hiw-section">
        <div className="hiw-eyebrow">Why it works</div>
        <h2 className="hiw-section-title">Built on clarity, integrity, and growth</h2>
        <p className="hiw-section-sub">
          Three principles shape everything we build — protecting candidates,
          empowering companies, and raising the bar for everyone.
        </p>

        <div className="hiw-pillar-grid">
          {pillars.map((pillar) => (
            <div key={pillar.label} className="hiw-pillar">
              <div className="hiw-pillar-icon">{pillar.icon}</div>
              <div className="hiw-pillar-label">{pillar.label}</div>
              <p className="hiw-pillar-body">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="hiw-cta-wrap">
        <div className="hiw-cta-card">
          <div className="hiw-cta-card-grid" aria-hidden />

          <div className="hiw-cta-text">
            <div className="hiw-cta-eyebrow">Ready to start?</div>
            <h2 className="hiw-cta-title">
              Experience <span>HireSmart</span> today.
            </h2>
            <p className="hiw-cta-sub">
              Join thousands of candidates and hiring teams already using
              HireSmart to prepare smarter and hire with confidence.
            </p>
          </div>

          <div className="hiw-cta-actions">
            <Link href="/student/register" className="hiw-cta-btn-primary">
             Start As Student
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/company/register" className="hiw-cta-btn-ghost">
              Start As Company
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
