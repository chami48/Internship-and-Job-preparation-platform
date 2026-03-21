"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .hs-footer {
          background: #0F172A;
          position: relative;
          overflow: hidden;
          font-family: 'Space Grotesk', sans-serif;
          border-top: 1px solid rgba(14,165,233,0.15);
        }

        /* subtle grid overlay */
        .hs-footer-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* top accent line */
        .hs-footer-accent {
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent);
          pointer-events: none;
        }

        /* ambient glow */
        .hs-footer-glow {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          filter: blur(80px);
        }
        .hs-footer-glow-1 {
          top: -20%;
          right: -8%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%);
          animation: hs-float 18s ease-in-out infinite;
        }
        .hs-footer-glow-2 {
          bottom: -15%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%);
          animation: hs-float 22s ease-in-out infinite reverse;
        }
        @keyframes hs-float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(24px); }
        }

        .hs-footer-inner {
          position: relative;
          z-index: 10;
          max-width: 1120px;
          margin: 0 auto;
          padding: 72px 32px 40px;
        }

        /* ── BRAND BLOCK ── */
        .hs-f-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          margin-bottom: 20px;
        }
        .hs-f-logo-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0EA5E9, #38BDF8);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(14,165,233,0.3);
        }
        .hs-f-logo-badge span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          font-weight: 700;
          color: white;
          letter-spacing: 0.04em;
        }
        .hs-f-logo-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .hs-f-logo-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem;
          font-weight: 500;
          color: #0EA5E9;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .hs-f-desc {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.75;
          max-width: 280px;
          margin-bottom: 28px;
        }

        /* ── STATUS PILL ── */
        .hs-f-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(14,165,233,0.25);
          border-radius: 999px;
          padding: 6px 14px;
          background: rgba(14,165,233,0.07);
        }
        .hs-f-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0EA5E9;
          animation: hs-blink 1.4s ease-in-out infinite;
        }
        @keyframes hs-blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.2; }
        }
        .hs-f-status span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #38BDF8;
        }

        /* ── COLUMNS ── */
        .hs-f-col-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hs-f-col-label::before {
          content: '';
          display: block;
          width: 16px;
          height: 1px;
          background: rgba(14,165,233,0.5);
          flex-shrink: 0;
        }
        .hs-f-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .hs-f-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s, gap 0.2s;
          letter-spacing: -0.01em;
        }
        .hs-f-link::before {
          content: '→';
          font-size: 0.7rem;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.2s, transform 0.2s;
          color: #0EA5E9;
        }
        .hs-f-link:hover {
          color: white;
          gap: 10px;
        }
        .hs-f-link:hover::before {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── DIVIDER ── */
        .hs-f-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(14,165,233,0.25), rgba(14,165,233,0.05) 60%, transparent);
          margin: 48px 0 32px;
        }

        /* ── BOTTOM ── */
        .hs-f-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .hs-f-copy {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          font-weight: 500;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.06em;
        }
        .hs-f-tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.25);
        }
        .hs-f-tagline-heart {
          color: #0EA5E9;
          animation: hs-heartbeat 1.6s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes hs-heartbeat {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }

        /* ── GRID LAYOUT ── */
        .hs-f-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 0;
        }
        @media (max-width: 900px) {
          .hs-f-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
        }
        @media (max-width: 560px) {
          .hs-f-grid { grid-template-columns: 1fr; gap: 28px; }
          .hs-footer-inner { padding: 48px 20px 32px; }
          .hs-f-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="hs-footer">
        <div className="hs-footer-grid" />
        <div className="hs-footer-accent" />
        <div className="hs-footer-glow hs-footer-glow-1" />
        <div className="hs-footer-glow hs-footer-glow-2" />

        <div className="hs-footer-inner">
          <div className="hs-f-grid">

            {/* ── Brand ── */}
            <div>
              <a href="/" className="hs-f-logo">
                <div className="hs-f-logo-badge">
                  <span>HS</span>
                </div>
                <div>
                  <div className="hs-f-logo-name">HireSmart</div>
                  <div className="hs-f-logo-sub">Innovation 2050</div>
                </div>
              </a>
              <p className="hs-f-desc">
                Future-ready screening platform where ambitious candidates prove their skills and unlock opportunities with leading enterprises.
              </p>
              <div className="hs-f-status">
                <span className="hs-f-status-dot" />
                <span>All systems operational</span>
              </div>
            </div>

            {/* ── Platform ── */}
            <div className="hs-f-col">
              <div className="hs-f-col-label">Platform</div>
              <ul>
                {["Roadmaps", "Mock Exams", "Resume Builder", "Company Guides", "Courses"].map(item => (
                  <li key={item}><a href="#" className="hs-f-link">{item}</a></li>
                ))}
              </ul>
            </div>

            {/* ── Company ── */}
            <div className="hs-f-col">
              <div className="hs-f-col-label">Company</div>
              <ul>
                {["About", "Blog", "Careers", "Contact", "Newsroom"].map(item => (
                  <li key={item}><a href="#" className="hs-f-link">{item}</a></li>
                ))}
              </ul>
            </div>

            {/* ── Legal ── */}
            <div className="hs-f-col">
              <div className="hs-f-col-label">Legal</div>
              <ul>
                {["Privacy", "Terms", "Cookies", "Security"].map(item => (
                  <li key={item}><a href="#" className="hs-f-link">{item}</a></li>
                ))}
              </ul>
            </div>

          </div>

          <div className="hs-f-divider" />

          <div className="hs-f-bottom">
            <span className="hs-f-copy">© {new Date().getFullYear()} HireSmart. All rights reserved.</span>
            <span className="hs-f-tagline">
              Built with <span className="hs-f-tagline-heart">♥</span> for the next generation of innovators
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}