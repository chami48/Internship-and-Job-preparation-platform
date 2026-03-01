// smart-screening\src\app\components\common\Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-200">
            ⚡
          </span>
          <div className="leading-tight">
            <div className="text-4xl font-black tracking-tight text-gray-900 leading-none">
  HireSmart
</div>
            <div className="text-xs text-gray-500">Smart Screening Platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
          <Link className="hover:text-gray-900" href="/student">
            Students
          </Link>
          <Link className="hover:text-gray-900" href="/company">
            Companies
          </Link>
          <Link className="hover:text-gray-900" href="/exam">
            Skill Exam
          </Link>
          <Link className="hover:text-gray-900" href="/ai">
            AI Evaluation
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/api/auth/signin"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Sign in
          </Link>
          <Link
            href="/student"
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </header>
  );
}