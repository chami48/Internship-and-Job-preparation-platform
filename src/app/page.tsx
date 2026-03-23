import Link from "next/link";

const featureCards = [
  {
    title: "AI Interview Drills",
    description:
      "Practice with role-aware question flows and receive structured feedback before the real interview.",
  },
  {
    title: "Verified Skill Exams",
    description:
      "Timed assessments for internship and job tracks with anti-cheat controls and confidence scoring.",
  },
  {
    title: "Career-Ready Profiles",
    description:
      "Build a student profile recruiters can review quickly, including links, projects, and exam outcomes.",
  },
];

const pathSteps = [
  "Create your account and complete your profile",
  "Apply to internships or jobs that match your skills",
  "Take assessments and prepare with AI interview practice",
  "Track status updates and improve continuously",
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-[#fbfcff] text-slate-900">
      <style>{`
        .landing-shell {
          background-image:
            radial-gradient(circle at 10% 10%, rgba(3, 105, 161, 0.08), transparent 30%),
            radial-gradient(circle at 85% 5%, rgba(15, 23, 42, 0.08), transparent 30%),
            linear-gradient(#fbfcff, #f3f7ff);
        }

        .display-font {
          letter-spacing: -0.03em;
        }

        .hero-pop {
          animation: heroPop 620ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .stagger-in {
          animation: staggerIn 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .float-orb {
          animation: floatOrb 6s ease-in-out infinite;
        }

        .grid-dot {
          background-image: radial-gradient(circle, rgba(15, 23, 42, 0.14) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        @keyframes heroPop {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes staggerIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatOrb {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 grid-dot opacity-20" />
      <div className="float-orb pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-sky-200/50 blur-2xl" />
      <div className="float-orb pointer-events-none absolute -right-12 bottom-24 h-56 w-56 rounded-full bg-indigo-200/40 blur-2xl" />

      <section className="landing-shell relative mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="hero-pop inline-flex rounded-full border border-sky-300 bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-800">
              Smart Hiring Journey
            </span>

            <h1 className="display-font hero-pop mt-5 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              Connecting Skilled Students 
              <span className="block text-sky-600">With Smart Companies</span>
            </h1>

            <p
              className="stagger-in mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg"
              style={{ animationDelay: "120ms" }}
            >
              HireSmart connects preparation, skill evaluation, and recruitment into one focused platform for students and companies.
            </p>
            <p
              className="stagger-in mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg"
              style={{ animationDelay: "120ms" }}
            >
             Begin Your Journey by Registering Today,
            </p>

            <div className="stagger-in mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "220ms" }}>
              <Link
                href="/student/register"
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-sky-600"
              >
                Student
              </Link>
              <Link
                href="/company/register"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-700 transition-colors hover:border-sky-400 hover:text-sky-700"
              >
                Company
              </Link>
            </div>
          </div>

          <div className="stagger-in rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur" style={{ animationDelay: "180ms" }}>
            <h2 className="display-font text-2xl font-semibold text-slate-900">Platform Snapshot</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="display-font text-3xl font-bold text-slate-900">1200+</p>
                <p className="mt-1 text-sm text-slate-600">Student Accounts</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="display-font text-3xl font-bold text-slate-900">340+</p>
                <p className="mt-1 text-sm text-slate-600">Active Openings</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="display-font text-3xl font-bold text-slate-900">92%</p>
                <p className="mt-1 text-sm text-slate-600">Exam Completion</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="display-font text-3xl font-bold text-slate-900">24/7</p>
                <p className="mt-1 text-sm text-slate-600">AI Preparation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <h2 className="display-font text-3xl font-semibold text-slate-900 md:text-4xl">What You Get</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featureCards.map((card, index) => (
            <article
              key={card.title}
              className="stagger-in rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-100 transition-transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 120 + 120}ms` }}
            >
              <h3 className="display-font text-xl font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10">
          <h2 className="display-font text-3xl font-semibold text-slate-900 md:text-4xl">How It Works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {pathSteps.map((step, index) => (
              <div key={step} className="stagger-in flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4" style={{ animationDelay: `${index * 100 + 140}ms` }}>
                <div className="display-font inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}