// smart-screening\src\app\components\common\Header.tsx
import Link from "next/link";
import HeaderAuthControls from "~/app/components/common/HeaderAuthControls";

export default function Header() {
  return (
    <header data-app-header className="sticky top-0 z-50 border-b border-slate-200 bg-white relative">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-7 py-5">
        <a href="http://localhost:3000/home" className="flex items-center gap-3 ml-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm relative">
            HS
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-sky-400 opacity-60"></div>
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-bold tracking-tight leading-none bg-gradient-to-r from-[#0b1f4a] via-[#102a63] to-[#1c3d7a] bg-clip-text text-transparent">
              HireSmart
            </div>
          </div>
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-sm text-slate-600 md:flex">
          <Link className="font-medium hover:text-slate-900 transition-colors" href="#jobs">
            Opportunities
          </Link>
          <Link className="font-medium hover:text-slate-900 transition-colors" href="/prep-quiz">
            Interview Preparation
          </Link>
          <Link className="font-medium hover:text-slate-900 transition-colors" href="/contact">
            Contact Us
          </Link>
        </nav>

        <div className="mr-4">
          <HeaderAuthControls />
        </div>
      </div>
    </header>
  );
}