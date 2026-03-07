"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userName =
    session?.user?.name?.split(" ")[0] ?? "User";

  return (
    <>
      <style>{`

      .nav-link{
        position:relative;
        font-weight:600;
        color:#334155;
        font-size:0.95rem;
        transition:all .25s ease;
      }

      .nav-link:hover{
        color:#0EA5E9;
      }

      .nav-link::after{
        content:'';
        position:absolute;
        bottom:-6px;
        left:0;
        width:0%;
        height:2px;
        background:linear-gradient(90deg,#0EA5E9,#38BDF8);
        transition:width .25s ease;
      }

      .nav-link:hover::after{
        width:100%;
      }

      .header-glass{
        backdrop-filter:blur(12px);
        background:rgba(255,255,255,0.85);
        border-bottom:1px solid rgba(14,165,233,0.15);
        transition:all .3s ease;
      }

      .header-glass.scrolled{
        background:rgba(255,255,255,0.95);
        box-shadow:0 10px 35px rgba(15,23,42,0.08);
      }

      .btn-primary{
        background:linear-gradient(135deg,#0F172A,#0EA5E9);
        color:white;
        padding:10px 24px;
        border-radius:12px;
        font-weight:600;
        font-size:.9rem;
        transition:all .25s ease;
      }

      .btn-primary:hover{
        transform:translateY(-2px);
      }

      .btn-outline{
        border:1.5px solid rgba(14,165,233,0.35);
        padding:10px 22px;
        border-radius:12px;
        font-weight:600;
        font-size:.9rem;
        color:#0F172A;
        transition:all .25s ease;
      }

      .btn-outline:hover{
        border-color:#0EA5E9;
        background:#E0F2FE;
        color:#0EA5E9;
      }

      .profile-btn{
        display:flex;
        align-items:center;
        gap:8px;
        padding:6px 12px;
        border-radius:12px;
        background:#F1F5F9;
        transition:all .25s ease;
      }

      .profile-btn:hover{
        background:#E2E8F0;
      }

      `}</style>

      <header className={`sticky top-0 z-50 ${scrolled ? "header-glass scrolled" : "header-glass"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white font-bold text-sm relative">
              HS
              <div className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-sky-400"></div>
            </div>

            <div className="leading-tight">
              <div className="text-lg font-bold text-slate-900">
                HireSmart
              </div>
              <div className="text-xs text-sky-500 font-semibold tracking-widest">
                SMART SCREENING
              </div>
            </div>
          </Link>

          {/* Navigation */}

          <nav className="hidden md:flex items-center gap-8">

            <Link href="/jobs" className="nav-link">
              Jobs
            </Link>

            <Link href="/internships" className="nav-link">
              Internships
            </Link>

            <Link href="/exam" className="nav-link">
              Skill Exam
            </Link>

            <Link href="/preparation" className="nav-link">
              Interview Prep
            </Link>

            <Link href="/companies" className="nav-link">
              For Companies
            </Link>

          </nav>

          {/* Right Side */}

          <div className="flex items-center gap-3">

            {!session ? (
              <>
                <Link href="/api/auth/signin" className="btn-outline">
                  Log in
                </Link>

                <Link href="/student/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {/* Welcome text */}

                <span className="text-sm font-medium text-slate-700">
                  Welcome, {userName}
                </span>

                {/* Profile */}

                <Link
                  href="/student/profile"
                  className="profile-btn"
                >
                  <User size={18} />
                </Link>

                {/* Logout */}

                <button
                  onClick={() => signOut()}
                  className="btn-outline"
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>
      </header>
    </>
  );
}