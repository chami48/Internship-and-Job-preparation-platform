import Link from "next/link";
import HeaderAuthControls from "~/app/components/common/HeaderAuthControls";

export default function HeaderLegacy() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3" />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-sm text-slate-600 md:flex">
          <Link className="font-medium hover:text-slate-900 transition-colors" href="/student">
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
