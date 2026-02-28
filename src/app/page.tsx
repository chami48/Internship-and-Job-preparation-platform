import Link from "next/link";
type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Internship" | "Full-time";
  level: "Junior" | "Mid" | "Senior";
  tags: string[];
  salary: string;
};

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer (Full Stack)",
    company: "NovaWorks",
    location: "Colombo • Hybrid",
    type: "Full-time",
    level: "Senior",
    tags: ["Next.js", "Node.js", "Prisma", "tRPC"],
    salary: "LKR 450K–650K",
  },
  {
    id: "2",
    title: "Senior Frontend Engineer (UI Systems)",
    company: "Orbit Labs",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    tags: ["React", "Design Systems", "Performance"],
    salary: "USD 4K–6K",
  },
  {
    id: "3",
    title: "Software Engineering Internship (Web)",
    company: "Zenith Digital",
    location: "Malabe • Onsite",
    type: "Internship",
    level: "Junior",
    tags: ["HTML/CSS", "React", "Basics of Git"],
    salary: "LKR 40K–80K",
  },
  {
    id: "4",
    title: "Product Manager (Tech)",
    company: "Astra Product Studio",
    location: "Colombo • Hybrid",
    type: "Full-time",
    level: "Mid",
    tags: ["Agile", "Roadmaps", "Stakeholders"],
    salary: "LKR 300K–450K",
  },
];

function Tag({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
      {text}
    </span>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-cyan-500/10 blur-2xl transition group-hover:from-fuchsia-500/30" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-white">{job.title}</div>
            <div className="mt-1 text-sm text-white/60">
              {job.company} • {job.location}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="rounded-xl bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/15">
              {job.type}
            </span>
            <span className="rounded-xl bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/15">
              {job.level}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.map((t) => (
            <Tag key={t} text={t} />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm text-white/70">
            <span className="text-white/50">Salary:</span> {job.salary}
          </div>

          <Link
  href={`/jobs/${job.id}`}
  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
>
  View & Apply
</Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-140px)] bg-[#07060a]">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600/25 via-fuchsia-600/10 to-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-cyan-500/15 to-violet-600/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-white/70 ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Smart Screening • Role-Based Skill Exams
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Internship & Job Preparation{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
                Platform
              </span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-white/70">
              A modern way to hire and apply: candidates prove skills first with a
              secure exam, then qualified students unlock CV upload and interviews.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-white/90">
                Browse Jobs
              </button>
              <button className="rounded-2xl bg-white/10 px-5 py-3 text-sm text-white ring-1 ring-white/15 hover:bg-white/15">
                How Smart Screening Works
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-white">Fair Exams</div>
                <div className="mt-1 text-xs text-white/60">
                  Randomized role-based questions
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-white">Secure Mode</div>
                <div className="mt-1 text-xs text-white/60">
                  Fullscreen + tab switch tracking
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-white">AI Evaluation</div>
                <div className="mt-1 text-xs text-white/60">
                  Scenario answers scored objectively
                </div>
              </div>
            </div>
          </div>

          {/* right panel */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">
                Trending Roles
              </div>
              <div className="text-xs text-white/60">Updated today</div>
            </div>

            <div className="mt-4 space-y-3">
              {[
                "Senior Software Engineer",
                "UI/UX Engineer",
                "Project Manager",
                "Full Stack Internship",
              ].map((r) => (
                <div
                  key={r}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80"
                >
                  {r}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
              <div className="text-sm font-semibold text-white">
                Smart Pre-Screening
              </div>
              <p className="mt-1 text-xs text-white/60">
                Pass the role-based assessment to unlock CV upload and proceed to
                interview stage.
              </p>
            </div>
          </div>
        </div>

        {/* jobs */}
        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Jobs for You</h2>
              <p className="mt-1 text-sm text-white/60">
                Clean, modern listings — start with skills, not only CVs.
              </p>
            </div>

            <div className="hidden gap-2 md:flex">
              <span className="rounded-xl bg-white/5 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10">
                Filter: Role
              </span>
              <span className="rounded-xl bg-white/5 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10">
                Filter: Location
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {jobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}