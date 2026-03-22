"use client";

import Link from "next/link";

const sections = [
  {
    title: "Agreement to Terms",
    body: "By accessing HireSmart, you agree to these Terms & Conditions and our Privacy Policy. Your continued use of the platform constitutes your binding acceptance of all terms herein.",
  },
  {
    title: "Account Responsibilities",
    body: "You are solely responsible for maintaining accurate profile information and safeguarding your login credentials. Any activity under your account is your responsibility.",
  },
  {
    title: "Assessments & Integrity",
    body: "Assessments may include identity verification and AI-powered proctoring. Any form of cheating, impersonation, or integrity violation may result in immediate disqualification and account suspension.",
  },
  {
    title: "User Content",
    body: "You retain full ownership of your content. By submitting it, you grant HireSmart a non-exclusive license to display and process it strictly for recruitment and assessment purposes.",
  },
  {
    title: "Acceptable Use",
    body: "You agree not to misuse the platform, attempt to bypass security measures, reverse-engineer any system, or infringe upon the intellectual property or rights of any other party.",
  },
  {
    title: "Service Availability",
    body: "We strive for 99.9% uptime and continuous availability. Scheduled or emergency maintenance windows may cause brief interruptions, of which users will be notified in advance where possible.",
  },
  {
    title: "Termination",
    body: "HireSmart reserves the right to suspend or permanently terminate accounts that violate these terms, compromise platform integrity, or engage in fraudulent or harmful behaviour.",
  },
  {
    title: "Changes to Terms",
    body: "We may revise these terms periodically. Material changes will be communicated via email or in-app notification. Continued use of HireSmart after updates constitutes acceptance.",
  },
];

export default function TermsAndConditionsPage() {
  const printDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const handleDownload = async () => {
    const response = await fetch("/api/terms-pdf");
    if (!response.ok) return;
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "HireSmart-Terms-and-Conditions.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="tc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .tc-root {
          font-family: 'Manrope', sans-serif;
          color: #0F172A;
          background:
            radial-gradient(circle at 15% 8%, rgba(14,165,233,0.11), transparent 38%),
            radial-gradient(circle at 88% 5%, rgba(14,165,233,0.07), transparent 32%),
            radial-gradient(circle at 50% 95%, rgba(14,165,233,0.06), transparent 35%),
            linear-gradient(120deg, #f7fbff 0%, #f3f7ff 45%, #f8fafc 100%);
          overflow-x: hidden;
        }

        /* ── HERO ─────────────────────────── */
        .tc-hero {
          position: relative;
          padding: 96px 24px 72px;
          overflow: hidden;
          background: linear-gradient(180deg, #ffffff 0%, #f3f9ff 100%);
        }

        .tc-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(14,165,233,0.07), transparent 55%),
            radial-gradient(circle at 72% 0%, rgba(14,165,233,0.11), transparent 38%);
          mask-image: radial-gradient(ellipse 75% 55% at 50% 0%, black 40%, transparent 88%);
          pointer-events: none;
        }

        .tc-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
        }

        .tc-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border-radius: 999px;
          padding: 6px 16px;
          border: 1px solid rgba(14,165,233,0.35);
          background: rgba(14,165,233,0.10);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0F172A;
          margin-bottom: 20px;
        }

        .tc-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #0EA5E9;
          animation: tc-blink 2.2s ease-in-out infinite;
        }

        @keyframes tc-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .tc-hero h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.4rem, 5.5vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0 0 18px;
          color: #0F172A;
        }

        .tc-hero h1 span {
          color: #0EA5E9;
        }

        .tc-hero-sub {
          max-width: 560px;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #475569;
          margin: 0 0 32px;
        }

        .tc-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .tc-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          background: #0F172A;
          color: white;
          font-family: 'Manrope', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }

        .tc-btn:hover {
          background: #1E293B;
          transform: translateY(-1px);
        }

        .tc-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          background: white;
          border: 1px solid rgba(15,23,42,0.14);
          color: #334155;
          font-family: 'Manrope', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
          box-shadow: 0 2px 8px rgba(15,23,42,0.05);
        }

        .tc-btn-ghost:hover {
          border-color: #0EA5E9;
          color: #0EA5E9;
          transform: translateY(-1px);
        }

        /* ── META STRIP ─────────────────────────── */
        .tc-meta-strip {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .tc-meta-strip-inner {
          margin-top: 40px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 24px;
          border-radius: 16px;
          background: white;
          border: 1px solid rgba(15,23,42,0.08);
          box-shadow: 0 4px 16px rgba(15,23,42,0.05);
        }

        .tc-meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .tc-meta-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #94A3B8;
        }

        .tc-meta-value {
          font-size: 0.92rem;
          font-weight: 600;
          color: #0F172A;
        }

        .tc-meta-divider {
          width: 1px;
          height: 32px;
          background: rgba(15,23,42,0.08);
        }

        /* ── BODY ─────────────────────────── */
        .tc-body {
          max-width: 1100px;
          margin: 48px auto 0;
          padding: 0 24px 100px;
        }

        .tc-section-label {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }

        .tc-section-label-text {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #94A3B8;
          white-space: nowrap;
        }

        .tc-section-label-line {
          flex: 1;
          height: 1px;
          background: rgba(15,23,42,0.08);
        }

        /* ── GRID ─────────────────────────── */
        .tc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 20px;
        }

        .tc-card {
          background: white;
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 20px;
          padding: 26px;
          box-shadow: 0 6px 20px rgba(15,23,42,0.05);
          transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
          position: relative;
          overflow: hidden;
        }

        .tc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #0EA5E9, rgba(14,165,233,0.2));
          border-radius: 20px 20px 0 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .tc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(15,23,42,0.09);
          border-color: rgba(14,165,233,0.2);
        }

        .tc-card:hover::before {
          transform: scaleX(1);
        }

        .tc-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .tc-card-num {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(14,165,233,0.08);
          border: 1px solid rgba(14,165,233,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0EA5E9;
        }

        .tc-card-index {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.8rem;
          font-weight: 700;
          color: rgba(15,23,42,0.05);
          line-height: 1;
          letter-spacing: -0.04em;
          user-select: none;
        }

        .tc-card h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 10px;
        }

        .tc-card p {
          font-size: 0.9rem;
          line-height: 1.8;
          color: #475569;
          margin: 0;
          padding-left: 12px;
          border-left: 2px solid rgba(14,165,233,0.25);
        }

        /* ── CTA STRIP ─────────────────────────── */
        .tc-cta {
          max-width: 1100px;
          margin: 0 auto 80px;
          padding: 0 24px;
        }

        .tc-cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          padding: 36px 40px;
          border-radius: 20px;
          background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%);
          box-shadow: 0 16px 48px rgba(15,23,42,0.18);
          position: relative;
          overflow: hidden;
        }

        .tc-cta-inner::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(14,165,233,0.12);
          pointer-events: none;
        }

        .tc-cta-inner::after {
          content: '';
          position: absolute;
          bottom: -60px; left: 10%;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: rgba(14,165,233,0.07);
          pointer-events: none;
        }

        .tc-cta-text {
          position: relative;
          z-index: 1;
        }

        .tc-cta-text h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: white;
          margin: 0 0 6px;
        }

        .tc-cta-text p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          margin: 0;
        }

        .tc-cta-btn {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          border-radius: 12px;
          background: white;
          color: #0F172A;
          font-family: 'Manrope', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .tc-cta-btn:hover {
          background: #f0f9ff;
          transform: translateY(-1px);
        }

        /* ── PRINT ─────────────────────────── */
        .tc-print-header { display: none; }

        @media print {
          .tc-root { background: white; }
          .tc-hero, .tc-meta-strip, .tc-section-label, .tc-cta { display: none !important; }
          .tc-body { margin: 0; padding: 0; }
          .tc-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .tc-card { border: 1px solid #E2E8F0; box-shadow: none; }
          .tc-card::before { display: none; }
          .tc-print-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 16px;
            margin-bottom: 24px;
            border-bottom: 1px solid #E2E8F0;
          }
          .tc-print-logo { display: flex; align-items: center; gap: 10px; font-weight: 700; }
          .tc-print-logo img { width: 32px; height: 32px; object-fit: contain; }
          .tc-print-meta { font-size: 0.8rem; color: #475569; text-align: right; line-height: 1.6; }
        }

        @media (max-width: 640px) {
          .tc-grid { grid-template-columns: 1fr; }
          .tc-cta-inner { flex-direction: column; }
          .tc-meta-divider { display: none; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────── */}
      <section className="tc-hero">
        <div className="tc-hero-inner">
          <div className="tc-badge">
            <span className="tc-badge-dot" />
            Legal Document
          </div>
          <h1>
            Terms &amp; <span>Conditions</span>
          </h1>
          <p className="tc-hero-sub">
            These terms outline the rules and responsibilities for using HireSmart.
            Please read them carefully before proceeding.
          </p>
          <div className="tc-hero-actions">
            <button className="tc-btn" type="button" onClick={handleDownload}>
              Download PDF
            </button>
            <Link href="/contact" className="tc-btn-ghost">
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* ── META STRIP ─────────────────────────── */}
      <div className="tc-meta-strip">
        <div className="tc-meta-strip-inner">
          <div className="tc-meta-item">
            <span className="tc-meta-label">Document</span>
            <span className="tc-meta-value">Terms &amp; Conditions</span>
          </div>
          <div className="tc-meta-divider" />
          <div className="tc-meta-item">
            <span className="tc-meta-label">Last Updated</span>
            <span className="tc-meta-value">March 2025</span>
          </div>
          <div className="tc-meta-divider" />
          <div className="tc-meta-item">
            <span className="tc-meta-label">Sections</span>
            <span className="tc-meta-value">8 clauses</span>
          </div>
          <div className="tc-meta-divider" />
          <div className="tc-meta-item">
            <span className="tc-meta-label">Contact</span>
            <span className="tc-meta-value">hiresmart31@gmail.com</span>
          </div>
        </div>
      </div>

      {/* ── SECTIONS ─────────────────────────── */}
      <div className="tc-body">
        {/* Print-only header */}
        <div className="tc-print-header">
          <div className="tc-print-logo">
            <img src="/uploads/logo%20(3).png" alt="HireSmart" />
            <span>HireSmart</span>
          </div>
          <div className="tc-print-meta">
            <div><strong>Terms & Conditions</strong></div>
            <div>hiresmart31@gmail.com</div>
            <div>Printed: {printDate}</div>
          </div>
        </div>

        <div className="tc-section-label">
          <span className="tc-section-label-text">All Clauses</span>
          <div className="tc-section-label-line" />
        </div>

        <div className="tc-grid">
          {sections.map((section, i) => (
            <div className="tc-card" key={section.title}>
              <div className="tc-card-head">
                <div className="tc-card-num">0{i + 1}</div>
                <span className="tc-card-index">0{i + 1}</span>
              </div>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ─────────────────────────── */}
      <div className="tc-cta">
        <div className="tc-cta-inner">
          <div className="tc-cta-text">
            <h3>Questions about these terms?</h3>
            <p>Reach out to our team and we will clarify anything you need.</p>
          </div>
          <Link href="/contact" className="tc-cta-btn">
            Contact Us
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
