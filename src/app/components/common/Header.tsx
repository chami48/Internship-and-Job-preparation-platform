// smart-screening\src\app\components\common\Header.tsx
import Link from "next/link";
import HeaderAuthControls from "~/app/components/common/HeaderAuthControls";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3" />

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link className="font-medium hover:text-slate-900 transition-colors" href="/student">
            Features
          </Link>
          <Link className="font-medium hover:text-slate-900 transition-colors" href="/company">
            Roadmaps
          </Link>
          <Link className="font-medium hover:text-slate-900 transition-colors" href="/exam">
            Pricing
          </Link>
          <Link className="font-medium hover:text-slate-900 transition-colors" href="/ai">
            Blog
          </Link>
        </nav>

        <HeaderAuthControls />
      </div>
    </header>
  );
}