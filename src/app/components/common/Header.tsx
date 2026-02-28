import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            ⚡
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-white">
              Internship & Job Prep
            </div>
            <div className="text-xs text-white/60">Smart Screening Platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link className="hover:text-white" href="/student">
            Students
          </Link>
          <Link className="hover:text-white" href="/company">
            Companies
          </Link>
          <Link className="hover:text-white" href="/exam">
            Skill Exam
          </Link>
          <Link className="hover:text-white" href="/ai">
            AI Evaluation
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/api/auth/signin"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/15 hover:bg-white/15"
          >
            Sign in
          </Link>
          <Link
            href="/student"
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </header>
  );
}