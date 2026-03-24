"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const featureIcons = [
    (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M8 21h8m-4-4v4m6-8a6 6 0 0 0-12 0v3h12v-3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 13l2 2 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M6 3h12a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 7h8M8 11h5M8 15h8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9L12 3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  ];

  const serviceIcons = [
    (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M6 14l3 3 9-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 7h8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M4 7h16M7 7V4m10 3V4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M5 10h14v9H5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M5 19V5h14v14H5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 15l6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M9 9h6v6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M5 5h14v6H5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M7 15h10M7 19h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M4 18l6-6 4 4 6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 6h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 3v6m0 6v6M6 12h12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M7 7h10v10H7z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  ];

  return (
    <main className="bg-white text-slate-900">

      {/* ───────── HERO ───────── */}
  <section className="relative h-screen w-full overflow-hidden bg-white">
 
      {/* BACKGROUND IMAGE — fully visible */}
      <Image
        src="/images/hero.jpeg"
        alt="Hero"
        fill
        priority
        className="object-cover object-top"
      />

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[60%] bg-white/30 backdrop-blur-[6px]"
        style={{ maskImage: "linear-gradient(to right, black 0%, black 55%, transparent 100%)" }}
      />
 
      {/* CONTENT */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="mx-auto max-w-6xl px-6 w-full">
          <div className="max-w-xl">
 
            <p className="text-sm uppercase tracking-widest text-[#0F1E44] font-semibold">
              Join HireSmart
            </p>
 
            <h1 className="mt-4 text-4xl font-bold leading-tight text-[#0F1E44] md:text-6xl">
              Prepare for Interviews. <br />
              Prove Your Skills. <br />
              <span className="text-sky-700">Get Hired.</span>
            </h1>
 
            <p className="mt-6 text-lg text-[#0F1E44]/70">
              Practice real interview questions, take verified assessments,
              and stand out to top companies — all in one platform.
            </p>
 
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/student/register"
                className="rounded-lg bg-[#0F1E44] px-6 py-3 text-white font-semibold hover:bg-[#38BDF8] hover:text-[#0F1E44] transition-colors duration-200"
              >
                STUDENT
              </Link>
              <Link
                href="/company/register"
                className="rounded-lg border-2 border-[#0F1E44] px-6 py-3 text-[#0F1E44] font-semibold hover:bg-[#0F1E44] hover:text-white transition-colors duration-200"
              >
                COMPANY
              </Link>
            </div>
 
          </div>
        </div>
      </div>
    </section>

      {/* ───────── FEATURES ───────── */}
      <section className="bg-slate-50/70 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Why HireSmart
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
                Tools Built for Real Hiring Outcomes
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Internships & Jobs",
                desc: "Students discover internships and jobs matched to their skills and career goals in one place.",
              },
              {
                title: "Secure Skill Assessments",
                desc: "High-integrity, proctored exams replace CVs with verified, job-ready proof of ability.",
              },
              {
                title: "AI Shortlisting & Prep",
                desc: "AI helps filter and shortlist candidates, and students get free interview prep to perform better.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                  index === 1 ? "md:-translate-y-3" : ""
                }`}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-slate-900">
                  {featureIcons[index]}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ABOUT ───────── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 items-center">
          <Image
            src="/images/about.jpeg"
            alt="About"
            width={500}
            height={400}
            className="rounded-2xl object-cover shadow-lg shadow-slate-200"
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              About HireSmart
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
              A Smarter Way to Prepare for Your Career
            </h2>

            <p className="mt-6 text-sm leading-6 text-slate-600">
              We connect internships and jobs with verified skill proof, so students are evaluated on ability, not just a CV.
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              From secure assessments to guided interview preparation, HireSmart makes every step feel confident and professional.
            </p>

            <Link
              href="/student/register"
              className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 text-white hover:bg-sky-600"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── SERVICES ───────── */}
<section className="bg-[#f6f7fb] py-20">
  <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-[1fr_2fr_1fr] gap-10 items-start">

    {/* LEFT CONTENT */}
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        Our Services
      </p>

      <h2 className="mt-4 text-3xl font-semibold text-slate-900 leading-snug">
        We Have Best Services for Your Career
      </h2>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        HireSmart connects real jobs with verified skills, helping students stand out and companies hire better.
      </p>

      <Link
        href="/how-it-works"
        className="mt-6 inline-block bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#172554]"
      >
        More Details
      </Link>
    </div>

    {/* SERVICES GRID */}
    <div className="grid grid-cols-2 gap-x-10 gap-y-10 md:grid-cols-3">

      {[
        "Internship Discovery",
        "Skill-Based Exams",
        "AI Shortlisting",
        "Interview Practice",
        "Recruiter Insights",
        "Career Profiles",
      ].map((title) => (
        <div key={title} className="flex flex-col items-start">
          
          <div className="mb-3 text-2xl text-slate-700">
            •
          </div>

          <h3 className="text-base font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-2 text-sm text-slate-600 leading-6">
            HireSmart provides structured tools to improve skills and connect candidates with the right opportunities.
          </p>
        </div>
      ))}

    </div>

    {/* RIGHT IMAGE */}
    <div className="hidden md:block">
      <Image
        src="/images/services.jpg"
        alt="Services"
        width={350}
        height={500}
        className="h-full w-full object-cover rounded-lg"
      />
    </div>

  </div>
</section>

      {/* ───────── CTA ───────── */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-slate-900 shadow-lg shadow-slate-200/60 md:px-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Get Started
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
                  Start Your Career Journey Today
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  Create your profile, take secure assessments, and get shortlisted faster with HireSmart.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/student/register"
                  className="rounded-lg bg-[#0F1E44] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#38BDF8] hover:text-[#0F1E44]"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/company/register"
                  className="rounded-lg border border-[#0F1E44] px-6 py-3 text-sm font-semibold text-[#0F1E44] transition-colors hover:bg-[#0F1E44] hover:text-white"
                >
                  Hire Talent
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}