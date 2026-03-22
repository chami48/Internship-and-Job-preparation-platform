"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .hs-footer {
          --hs-bg: #0F172A;
          --hs-accent: #0EA5E9;
          --hs-text: rgba(255,255,255,0.85);
          --hs-muted: rgba(255,255,255,0.55);
          --hs-dim: rgba(255,255,255,0.35);

          background: radial-gradient(1200px 420px at 10% 0%, rgba(14,165,233,0.12), transparent 55%),
                      radial-gradient(900px 380px at 90% 10%, rgba(14,165,233,0.08), transparent 60%),
                      var(--hs-bg);
          position: relative;
          overflow: hidden;
          font-family: 'Space Grotesk', sans-serif;
          border-top: 1px solid rgba(14,165,233,0.2);
        }

        /* Subtle grid overlay */
        .hs-footer-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
          background-size: 56px 56px;
          opacity: 0.7;
          pointer-events: none;
        }

        .hs-footer-accent {
          position: absolute;
          top: 0;
          left: 8%;
          right: 8%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(14,165,233,0.65), transparent);
        }

        .hs-footer-orb {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(14,165,233,0.18), transparent 70%);
          filter: blur(2px);
          pointer-events: none;
        }

        .hs-footer-orb.left { top: -120px; left: -80px; }
        .hs-footer-orb.right { bottom: -140px; right: -60px; }

        /* ── INNER ── */
        .hs-footer-inner {
          position: relative;
          z-index: 10;
          max-width: 1120px;
          margin: 0 auto;
          padding: 72px 32px 36px;
        }

        /* ── BRAND ── */
        .hs-f-logo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          margin-bottom: 18px;
        }

        .hs-f-logo-mark {
          width: 12px;
          height: 12px;
          border-radius: 3px;
          background: linear-gradient(135deg, rgba(14,165,233,0.95), rgba(255,255,255,0.9));
          box-shadow: 0 0 14px rgba(14,165,233,0.45);
        }

        .hs-f-logo-name {
          font-size: 1.60rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
        }

        .hs-f-logo-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.66rem;
          font-weight: 600;
          color: var(--hs-accent);
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .hs-f-desc {
          font-size: 0.95rem;
          color: var(--hs-muted);
          line-height: 1.8;
          max-width: 320px;
          margin-bottom: 26px;
        }

        /* ── COLUMN LABEL ── */
        .hs-f-col-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 16px;
        }

        /* ── LINKS ── */
        .hs-f-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 10px;
        }

        .hs-f-link {
          font-size: 0.95rem;
          color: var(--hs-muted);
          text-decoration: none;
          position: relative;
          transition: color 0.2s, transform 0.2s;
        }

        .hs-f-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0;
          height: 1px;
          background: rgba(14,165,233,0.7);
          transition: width 0.2s ease;
        }

        .hs-f-link:hover {
          color: white;
          transform: translateX(2px);
        }

        .hs-f-link:hover::after {
          width: 20px;
        }

        /* ── BOTTOM ── */
        .hs-f-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin: 36px 0 20px;
        }

        .hs-f-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hs-f-copy {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--hs-dim);
        }

        .hs-f-tagline {
          font-size: 0.9rem;
          color: var(--hs-dim);
        }

        /* ── GRID ── */
        .hs-f-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 56px;
        }

        @media (max-width: 900px) {
          .hs-f-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }

        @media (max-width: 560px) {
          .hs-f-grid { grid-template-columns: 1fr; }
          .hs-footer-inner { padding: 48px 20px 32px; }
          .hs-f-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="hs-footer">
        <div className="hs-footer-grid" />
        <div className="hs-footer-accent" />
        <div className="hs-footer-orb left" />
        <div className="hs-footer-orb right" />

        <div className="hs-footer-inner">
          <div className="hs-f-grid">

            {/* Brand */}
            <div>
              <a href="/" className="hs-f-logo">
                <span className="hs-f-logo-mark" aria-hidden="true" />
                <div>
                  <div className="hs-f-logo-name">HireSmart</div>
                  <div className="hs-f-logo-sub">Innovation 2026</div>
                </div>
              </a>

              <p className="hs-f-desc">
                Future-ready screening platform where candidates prove their
                skills and unlock real career opportunities.
              </p>
            </div>

            {/* Platform */}
            <div>
              <div className="hs-f-col-label">Platform</div>
              <ul className="hs-f-list">
                <li><Link href="/about" className="hs-f-link">About HireSmart</Link></li>
                <li><Link href="/how-it-works" className="hs-f-link">How It Works</Link></li>
                <li><Link href="/contact" className="hs-f-link">Contact</Link></li>
                <li><Link href="/#" className="hs-f-link">Help Center</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="hs-f-col-label">Legal</div>
              <ul className="hs-f-list">
                <li><Link href="/privacy-policy" className="hs-f-link">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hs-f-link">Terms & Conditions</Link></li>
              </ul>
            </div>

          </div>

          <div className="hs-f-divider" />

          <div className="hs-f-bottom">
            <span className="hs-f-copy">© {new Date().getFullYear()} HireSmart. All rights reserved.</span>
            <span className="hs-f-tagline">
              Built for the next generation of innovators
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}