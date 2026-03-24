"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const NAV = [
  { label: "My Result",           href: "/ai/result",              icon: "📊" },
  { label: "Evaluation Details",  href: "/ai/evaluation-details",  icon: "📋" },
  { label: "Permission Status",   href: "/ai/permission-status",   icon: "🔐" },
  { label: "Filtered Candidates", href: "/ai/filtered-candidates", icon: "👥" },
];

const PAGE_TRANSITION_STYLES = `
  @keyframes ai-page-in {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ai-page-enter {
    animation: ai-page-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
`;

export default function AILayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [animKey, setAnimKey] = useState(pathname);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setAnimKey(pathname);
    }
  }, [pathname]);

  return (
    <>
      <style>{PAGE_TRANSITION_STYLES}</style>
      <div className="flex min-h-screen bg-[#F4F7FB] font-sans text-[#0F172A]">

        {/* Sidebar — fixed, below root header */}
        <aside className="w-72 bg-white border-r border-[#E2E8F0] flex flex-col fixed top-16 h-[calc(100vh-4rem)] z-20">

          {/* Logo area */}
          <div className="px-6 py-5 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: "linear-gradient(135deg,#1F7FB2,#3AB6D9)" }}
              >
                🤖
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#64748B] leading-none">AI Module</p>
                <p className="text-sm font-black text-[#0F172A] leading-tight mt-0.5">Evaluation Hub</p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-6 space-y-2 mt-4 overflow-y-auto">
            {NAV.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 no-underline ${
                    isActive
                      ? "bg-[#1F7FB2] text-white shadow-md shadow-blue-900/10"
                      : "text-[#64748B] hover:bg-[#F4F7FB] hover:text-[#0F172A]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom — back to home */}
          <div className="p-6 border-t border-[#E2E8F0]">
            <Link
              href="/home"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#64748B] hover:bg-[#F4F7FB] hover:text-[#0F172A] rounded-xl transition-all duration-200 no-underline"
            >
              <span>🏠</span>
              Back to Home
            </Link>
          </div>
        </aside>

        {/* Main content — animated on route change */}
        <main className="flex-1 ml-72 flex flex-col min-w-0">
          <div key={animKey} className="ai-page-enter flex-1">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
