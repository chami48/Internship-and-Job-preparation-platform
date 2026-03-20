"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import HeaderAuthControls from "~/app/components/common/HeaderAuthControls";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .hs-header {
          position: sticky;
          top: 0;
          z-index: 50;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
          font-family: 'Space Grotesk', sans-serif;
        }
        .hs-header.scrolled {
          background: rgba(255,255,255,0.92);
          border-bottom: 1px solid rgba(14,165,233,0.15);
          box-shadow: 0 4px 24px rgba(15,23,42,0.06);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .hs-header.top {
          background: rgba(240,246,255,0.85);
          border-bottom: 1px solid rgba(14,165,233,0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .hs-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 32px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* ── LOGO ── */
        .hs-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .hs-logo-badge {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .hs-logo:hover .hs-logo-badge {
          background: #0EA5E9;
        }
        .hs-logo-badge-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          color: white;
          letter-spacing: 0.04em;
        }
        .hs-logo-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0EA5E9;
          border: 2px solid white;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .hs-logo-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.0rem;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.02em;
          line-height: 1;
          transition: color 0.2s;
        }
        .hs-logo:hover .hs-logo-name { color: #0EA5E9; }
        .hs-logo-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          font-weight: 500;
          color: #94A3B8;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          line-height: 1;
          margin-top: 2px;
        }

        /* ── NAV ── */
        .hs-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .hs-nav-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.15rem;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          letter-spacing: -0.01em;
          position: relative;
        }
        .hs-nav-link:hover {
          color: #0F172A;
          background: rgba(14,165,233,0.08);
        }
        .hs-nav-link.active {
          color: #0EA5E9;
          background: rgba(14,165,233,0.1);
        }

        /* ── DIVIDER ── */
        .hs-nav-sep {
          width: 1px;
          height: 18px;
          background: #E2E8F0;
          margin: 0 8px;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .hs-nav { display: none; }
          .hs-inner { padding: 0 20px; }
        }
      `}</style>

      <header className={`hs-header ${scrolled ? "scrolled" : "top"}`}>
        <div className="hs-inner">

          {/* Logo */}
          <a href="/" className="hs-logo">
            <div className="hs-logo-badge">
              <span className="hs-logo-badge-text">HS</span>
              <span className="hs-logo-dot" />
            </div>
            <div>
              <div className="hs-logo-name">HireSmart</div>
              <div className="hs-logo-sub">2050</div>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hs-nav">
            <Link className="hs-nav-link" href="/student">Features</Link>
            <Link className="hs-nav-link" href="/company">Roadmaps</Link>
            <Link className="hs-nav-link" href="/exam">Pricing</Link>
            <Link className="hs-nav-link" href="/ai">Blog</Link>
            <div className="hs-nav-sep" />
          </nav>

          {/* Auth controls */}
          <HeaderAuthControls />
        </div>
      </header>
    </>
  );
}