// smart-screening\src\app\components\common\Header.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          transition: color 0.3s ease;
          font-size: 0.95rem;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #0EA5E9, #38BDF8);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link:hover {
          color: #0EA5E9;
        }
        .nav-link:hover::after {
          width: 100%;
        }

        .header-glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(14, 165, 233, 0.15);
          box-shadow: 0 4px 30px rgba(15, 23, 42, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .header-glass.scrolled {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 48px rgba(14, 165, 233, 0.12);
          border-color: rgba(14, 165, 233, 0.25);
        }

        .btn-primary {
          background: linear-gradient(135deg, #0F172A, #0EA5E9);
          color: white;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(14, 165, 233, 0.2);
          border: none;
          cursor: pointer;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(14, 165, 233, 0.35);
        }

        .btn-secondary {
          border: 1.5px solid rgba(14, 165, 233, 0.3);
          background: rgba(255, 255, 255, 0.7);
          color: #0F172A;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
        }
        .btn-secondary:hover {
          border-color: #0EA5E9;
          background: rgba(224, 242, 254, 0.8);
          color: #0EA5E9;
        }

        .logo-glow {
          animation: logoPulse 3s ease-in-out infinite;
        }
        @keyframes logoPulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(14, 165, 233, 0.3)); }
          50% { filter: drop-shadow(0 0 16px rgba(14, 165, 233, 0.6)); }
        }
      `}</style>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "header-glass scrolled" : "header-glass"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="logo-glow inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white font-bold text-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-sky-400/20 to-sky-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">HS</span>
              <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-sky-400 opacity-80"></div>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold tracking-tight text-slate-1000 leading-none group-hover:text-sky-500 transition-colors duration-300">
                HireSmart
              </div>
              <div className="text-xs font-semibold text-sky-500 tracking-widest mt-0.5"></div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/student" className="nav-link">
              Features
            </Link>
            <Link href="/company" className="nav-link">
              Roadmaps
            </Link>
            <Link href="/exam" className="nav-link">
              Pricing
            </Link>
            <Link href="/ai" className="nav-link">
              Blog
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Link href="/api/auth/signin" className="btn-secondary hidden sm:inline-block">
              Log in
            </Link>
            <Link href="/student" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}