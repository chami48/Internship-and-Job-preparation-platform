import Link from "next/link";

const pages = [
  {
    title: "Student Exam Result",
    description: "View your AI-evaluated exam score, pass/fail status, and AI feedback summary.",
    href: "/ai/result",
    icon: "📊",
    accent: "sky" as const,
  },
  {
    title: "Evaluation Details",
    description: "Question-by-question review with your answers, expected answers, and AI feedback.",
    href: "/ai/evaluation-details",
    icon: "📝",
    accent: "amber" as const,
  },
  {
    title: "Permission Status",
    description: "Check whether you passed and if CV upload is unlocked for job applications.",
    href: "/ai/permission-status",
    icon: "🔓",
    accent: "green" as const,      
  },
  {
    title: "Filtered Candidates",
    description: "Recruiter dashboard – search, filter, and review AI-evaluated candidates.",
    href: "/ai/filtered-candidates",
    icon: "👥",
    accent: "slate" as const, 
  },
  {
    title: "Candidate Details",
    description: "In-depth candidate profile with section scores, answers, and recruiter actions.",
    href: "/ai/candidate/1",
    icon: "🧑‍💼",
    accent: "sky" as const,
  },
];

const accentBorder: Record<string, string> = {
  sky: "hover:border-sky-400",
  amber: "hover:border-amber-400",
  green: "hover:border-emerald-400",
  slate: "hover:border-slate-400",
};

const accentBg: Record<string, string> = {
  sky: "bg-sky-100 text-sky-600",
  amber: "bg-amber-100 text-amber-600",
  green: "bg-emerald-100 text-emerald-600",
  slate: "bg-slate-100 text-slate-600",
};

export default function AiHomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white">
          🤖
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          AI Evaluation & Candidate Filtering
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
          Module 4 – AI-powered exam evaluation, smart candidate scoring, and
          recruiter filtering dashboard. Navigate to any page below.
        </p>
      </div>

      {/* Page cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className={`group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md ${accentBorder[page.accent]}`}
          >
            <div
              className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-xl ${accentBg[page.accent]}`}
            >
              {page.icon}
            </div>
            <h2 className="text-base font-bold text-slate-800 group-hover:text-sky-500 transition-colors">
              {page.title}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {page.description}
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-slate-400 group-hover:text-sky-500 transition-colors">
              Open →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
