"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

/* ─── Tag chip ───────────────────────────────────────────── */
function Tag({ text }: { text: string }) {
  return (
    <span
      className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-orange-600"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {text}
    </span>
  );
}

/* ─── Animated counter ───────────────────────────────────── */
function Counter({
  to,
  label,
  suffix = "+",
}: {
  to: number;
  label: string;
  suffix?: string;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let v = 0;
    const step = Math.max(1, Math.ceil(to / 50));
    const id = setInterval(() => {
      v += step;
      if (v >= to) {
        setVal(to);
        clearInterval(id);
      } else setVal(v);
    }, 25);

    return () => clearInterval(id);
  }, [to]);

  return (
    <div className="flex flex-col items-start">
      <span
        className="text-4xl font-black tabular-nums text-gray-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {val.toLocaleString()}
        {suffix}
      </span>
      <span
        className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Job Card ───────────────────────────────────────────── */
function JobCard({
  job,
  index,
}: {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    level: string;
    tags: string[];
    salary?: string | null;
  };
  index: number;
}) {
  const isIntern = job.type?.toLowerCase().includes("intern");

  return (
    <div
      className="job-card group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* top colour strip */}
      <div
        className={`h-1 w-full flex-shrink-0 ${
          isIntern
            ? "bg-gradient-to-r from-violet-400 to-fuchsia-400"
            : "bg-gradient-to-r from-orange-400 to-amber-400"
        }`}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg ${
              isIntern ? "bg-violet-50" : "bg-orange-50"
            }`}
          >
            {isIntern ? "🎓" : "💼"}
          </div>

          <div className="flex gap-1.5">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                isIntern
                  ? "bg-violet-50 text-violet-600"
                  : "bg-orange-50 text-orange-600"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {job.type}
            </span>
            <span
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-500"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {job.level}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <h3
            className="text-base font-bold leading-snug text-gray-900"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {job.title}
          </h3>
          <p
            className="mt-1 text-xs text-gray-400"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {job.company} · {job.location}
          </p>
        </div>

        {/* tags */}
        {job.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.tags.map((t) => (
              <Tag key={t} text={t} />
            ))}
          </div>
        )}

        {/* footer */}
        <div className="mt-auto flex items-center justify-between pt-5">
          <p
            className="text-xs text-gray-400"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Salary:{" "}
            <span className="font-semibold text-gray-700">
              {job.salary ?? "Negotiable"}
            </span>
          </p>

          <Link
            href={`/jobs/${job.id}`}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all ${
              isIntern
                ? "bg-violet-500 hover:bg-violet-600"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            View &amp; Apply →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function HomePage() {
  const { data: jobs, isLoading, error } = api.job.list.useQuery();
  const [filter, setFilter] = useState<"all" | "internship" | "fulltime">("all");

  const filteredJobs = (jobs ?? []).filter((j) => {
    if (filter === "all") return true;
    const t = (j.type ?? "").toLowerCase();
    if (filter === "internship") return t.includes("intern");
    if (filter === "fulltime") return !t.includes("intern");
    return true;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap');

        .job-card { animation: fadeUp 0.45s ease both; }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(14px)}
          to{opacity:1;transform:translateY(0)}
        }

        .hero-word { animation: wordIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes wordIn {
          from{opacity:0;transform:translateY(22px)}
          to{opacity:1;transform:translateY(0)}
        }

        .dot-grid {
          background-image: radial-gradient(circle, #e2e8f0 1.2px, transparent 1.2px);
          background-size: 26px 26px;
        }

        .filter-btn {
          border: 1.5px solid #e5e7eb;
          background: white;
          color: #6b7280;
          border-radius: 999px;
          padding: 7px 18px;
          font-size: 11px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.18s;
        }
        .filter-btn:hover:not(.f-active) { border-color: #d1d5db; color: #374151; }
        .f-active-all { border-color: #f97316 !important; background: #fff7ed !important; color: #ea580c !important; }
        .f-active-intern { border-color: #a78bfa !important; background: #f5f3ff !important; color: #7c3aed !important; }
        .f-active-full { border-color: #f97316 !important; background: #fff7ed !important; color: #ea580c !important; }

        .feature-card {
          background: white;
          border: 1.5px solid #f1f5f9;
          border-radius: 20px;
          padding: 24px 22px;
          transition: all 0.25s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .feature-card:hover {
          border-color: #fed7aa;
          box-shadow: 0 10px 32px rgba(249,115,22,0.08);
          transform: translateY(-3px);
        }
      `}</style>

      <main
        className="min-h-screen bg-[#f8fafc]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Subtle dot background */}
        <div className="pointer-events-none fixed inset-0 z-0 dot-grid opacity-70" />

        {/* Warm top gradient wash */}
        <div
          className="pointer-events-none fixed left-1/2 top-0 z-0 h-[480px] w-[1000px] -translate-x-1/2 rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(ellipse, #fb923c 0%, #fde68a 50%, transparent 75%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-14">
          {/* ── HERO ── */}
          <section className="grid gap-12 md:grid-cols-[1fr_400px] md:items-center">
            {/* LEFT */}
            <div>
              {/* eyebrow */}
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-orange-200 bg-orange-50 px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-600">
                  HireSmart · Smart Screening
                </span>
              </div>

              {/* heading */}
              <h1
  className="font-black tracking-tight text-gray-900"
  style={{ fontFamily: "'Poppins', sans-serif", lineHeight: "1.0" }}
>
  {/* Main Brand — VERY LARGE */}
  <span
    className="hero-word block text-[clamp(3.5rem,7vw,6rem)] leading-none"
    style={{ animationDelay: "0ms" }}
  >
    HireSmart
  </span>

  {/* Second Line — Smaller */}
  <span
    className="hero-word block text-[clamp(2rem,4vw,3rem)] mt-2"
    style={{ animationDelay: "80ms" }}
  >
    Internship &amp; Job{" "}
    <span
      style={{
        background:
          "linear-gradient(110deg, #f97316 0%, #fb923c 40%, #fbbf24 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Platform
    </span>
  </span>

  {/* Third Line — Even Smaller */}
  <span
    className="hero-word block text-[clamp(1.6rem,3vw,2.2rem)] mt-2"
    style={{ animationDelay: "160ms" }}
  >
    for Skill-Based Hiring
  </span>
</h1>

              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-gray-500">
                Candidates prove skills first with a secure exam. Only qualified students
                unlock CV upload and proceed to interviews.
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#jobs"
                  className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200/70 transition hover:bg-orange-600 hover:shadow-orange-300"
                >
                  Browse Jobs
                </a>
                <Link
                  href="/how-it-works"
                  className="rounded-2xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  How Smart Screening Works
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-10 flex flex-wrap gap-8 border-t border-gray-200/60 pt-8">
                <Counter to={2400} label="Active Roles" />
                <Counter to={14800} label="Candidates" />
                <Counter to={320} label="Companies" />
                <Counter to={91} label="Avg Pass Rate" suffix="%" />
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl shadow-gray-100">
              <div className="flex items-center justify-between">
                <p
                  className="text-sm font-bold text-gray-900"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Trending Roles
                </p>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Updated today
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  { label: "Software Engineer", dot: "bg-orange-400" },
                  { label: "UX Engineer", dot: "bg-violet-400" },
                  { label: "Project Manager", dot: "bg-sky-400" },
                  { label: "Internship (Web)", dot: "bg-emerald-400" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition hover:border-orange-100 hover:bg-orange-50"
                  >
                    <span className={`h-2 w-2 flex-shrink-0 rounded-full ${r.dot}`} />
                    {r.label}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
                <p
                  className="text-sm font-bold text-gray-900"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  HireSmart Pre-Screening
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Pass the assessment → unlock CV upload → proceed to interview stage.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {["Skill Exam", "CV Upload", "Interview"].map((s, i) => (
                    <span key={s} className="flex items-center gap-1.5">
                      <span className="rounded-full border border-orange-200 bg-white px-2.5 py-0.5 text-[10px] font-bold text-orange-600">
                        {s}
                      </span>
                      {i < 2 && (
                        <span className="text-[10px] font-bold text-gray-300">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── FEATURE CARDS ── */}
          <section className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: "🎯",
                label: "Fair Exams",
                desc: "Randomised role-based questions ensure every candidate faces a unique, equal challenge.",
              },
              {
                icon: "🔒",
                label: "Secure Mode",
                desc: "Fullscreen lock + tab-switch detection keeps the screening process reliable and honest.",
              },
              {
                icon: "🤖",
                label: "AI Evaluation",
                desc: "Scenario answers scored objectively by our evaluation module in real time.",
              },
            ].map((f) => (
              <div key={f.label} className="feature-card">
                <div className="mb-3 text-2xl">{f.icon}</div>
                <h3
                  className="text-sm font-bold text-gray-900"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {f.label}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </section>

          {/* ── JOBS ── */}
          <section id="jobs" className="mt-20 scroll-mt-8">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
                  — Live from database (Prisma + SQLite)
                </p>
                <h2
                  className="text-2xl font-black text-gray-900"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Jobs for You
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`filter-btn ${filter === "all" ? "f-active f-active-all" : ""}`}
                >
                  All Roles
                </button>
                <button
                  onClick={() => setFilter("internship")}
                  className={`filter-btn ${
                    filter === "internship" ? "f-active f-active-intern" : ""
                  }`}
                >
                  Internships
                </button>
                <button
                  onClick={() => setFilter("fulltime")}
                  className={`filter-btn ${filter === "fulltime" ? "f-active f-active-full" : ""}`}
                >
                  Full-time
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-6 py-10 text-sm text-gray-400">
                <svg className="h-4 w-4 animate-spin text-orange-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading positions…
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-500">
                Failed to load jobs: {error.message}
              </div>
            )}

            {!isLoading && !error && filteredJobs.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-400">
                No positions match this filter.
              </div>
            )}

            {!isLoading && !error && filteredJobs.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((j, i) => (
                  <JobCard
                    key={j.id}
                    index={i}
                    job={{
                      ...j,
                      tags: Array.isArray((j as any).tags)
                        ? ((j as any).tags as string[])
                        : [],
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── CTA BANNER ── */}
          <section className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-12 shadow-xl shadow-orange-200">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3
                  className="text-2xl font-black text-white"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Ready to stand out?
                </h3>
                <p className="mt-1.5 max-w-sm text-sm text-orange-100">
                  Take the skill exam today and unlock your profile for top employers.
                </p>
              </div>
              <Link
                href="/exam"
                className="flex-shrink-0 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-orange-600 shadow-lg transition hover:bg-orange-50"
              >
                Start Skill Exam →
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}