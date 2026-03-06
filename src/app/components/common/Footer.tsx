// smart-screening\src\app\components\common\Footer.tsx
"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-wrapper {
          background: linear-gradient(135deg, #0F172A 0%, rgba(14, 165, 233, 0.05) 100%);
          position: relative;
          overflow: hidden;
        }

        .footer-glow {
          position: absolute;
          pointer-events: none;
        }

        .footer-glow-1 {
          top: -20%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(80px);
          animation: float 15s ease-in-out infinite;
        }

        .footer-glow-2 {
          bottom: -10%;
          left: -15%;
          width: 500px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(14, 165, 233, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(80px);
          animation: float 18s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }

        .footer-content {
          position: relative;
          z-index: 10;
        }

        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .footer-logo-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0EA5E9, #38BDF8);
          color: white;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
        }

        .footer-logo-text {
          font-size: 1.2rem;
          font-weight: bold;
          color: white;
          transition: color 0.3s;
        }

        .footer-logo:hover .footer-logo-text {
          color: #38BDF8;
        }

        .footer-col h4 {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 14px;
        }

        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-col li {
          margin-bottom: 10px;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: inline-block;
        }

        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, #0EA5E9, #38BDF8);
          transition: width 0.3s ease;
        }

        .footer-link:hover {
          color: #38BDF8;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(14, 165, 233, 0.3), transparent);
          margin: 32px 0;
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: center;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85rem;
        }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
          }
        }

        .footer-heart {
          color: #0EA5E9;
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>

      <footer className="footer-wrapper">
        {/* Animated glows */}
        <div className="footer-glow footer-glow-1"></div>
        <div className="footer-glow footer-glow-2"></div>

        <div className="footer-content mx-auto max-w-6xl px-5 py-16">
          {/* Main Footer Grid */}
          <div className="grid gap-12 md:grid-cols-5 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="footer-logo">
                <div className="footer-logo-icon">HS</div>
                <div>
                  <div className="footer-logo-text">HireSmart</div>
                  <div className="text-xs font-semibold text-sky-400 tracking-widest">Innovation 2050</div>
                </div>
              </div>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs mt-4">
                Future-ready screening platform where ambitious students prove their skills and unlock opportunities with leading enterprises.
              </p>
            </div>

            {/* Platform Links */}
            <div className="footer-col">
              <h4>Platform</h4>
              <ul>
                <li><a href="#" className="footer-link">Roadmaps</a></li>
                <li><a href="#" className="footer-link">Mock Exams</a></li>
                <li><a href="#" className="footer-link">Resume Builder</a></li>
                <li><a href="#" className="footer-link">Company Guides</a></li>
                <li><a href="#" className="footer-link">Courses</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#" className="footer-link">About</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Contact</a></li>
                <li><a href="#" className="footer-link">Newsroom</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#" className="footer-link">Privacy</a></li>
                <li><a href="#" className="footer-link">Terms</a></li>
                <li><a href="#" className="footer-link">Cookies</a></li>
                <li><a href="#" className="footer-link">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider"></div>

          {/* Bottom Section */}
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} HireSmart. All rights reserved.</p>
            <p>Built with <span className="footer-heart">♥</span> for the next generation of innovators</p>
          </div>
        </div>
      </footer>
    </>
  );
}