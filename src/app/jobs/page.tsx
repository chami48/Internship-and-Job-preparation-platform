//smart-screening\src\app\jobs\page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

interface JobCardProps {
  id: string;
  title: string;
  company: { name: string; email: string };
  location: string;
  type: string;
  level: string;
  role: string;
  salary?: string | null;
  tags: string;
  applied?: boolean;
  examSubmitted?: boolean;
  terminated?: boolean;
}

function StatusBadge({
  applied,
  examSubmitted,
  terminated,
}: {
  applied?: boolean;
  examSubmitted?: boolean;
  terminated?: boolean;
}) {
  if (terminated) {
    return (
      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
        Terminated
      </span>
    );
  }

  if (examSubmitted) {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        Submitted
      </span>
    );
  }

  if (applied) {
    return (
      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
        Applied
      </span>
    );
  }

  return null;
}

function JobTypeIcon({ type }: { type: string }) {
  return (
    <div
      className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        type === "INTERNSHIP"
          ? "bg-sky-100 text-sky-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {type === "INTERNSHIP" ? "📚 Internship" : "💼 Full-time"}
    </div>
  );
}

function LevelBadge({ level }: { level: string }) {
  const colors = {
    JUNIOR: "bg-indigo-100 text-indigo-700",
    MID: "bg-amber-100 text-amber-700",
    SENIOR: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        colors[level as keyof typeof colors] || "bg-gray-100 text-gray-700"
      }`}
    >
      {level}
    </span>
  );
}

function SkillTag({ text }: { text: string }) {
  return (
    <span className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
      {text}
    </span>
  );
}

function JobCard({ job }: { job: JobCardProps }) {
  const tags = job.tags
    ? job.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <Link href={`/jobs/${job.id}`}>
      <article className="group relative h-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              {job.company.name}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 group-hover:text-slate-950">
              {job.title}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge
              applied={job.applied}
              examSubmitted={job.examSubmitted}
              terminated={job.terminated}
            />
            <JobTypeIcon type={job.type} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
            <span>📍</span>
            {job.location}
          </span>
          <LevelBadge level={job.level} />
        </div>

        <div className="mt-5 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Role Focus
          </p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {job.role.replace(/_/g, " ")}
          </p>
          {job.salary && (
            <p className="mt-2 text-xs text-slate-500">
              Salary: <span className="font-semibold text-slate-700">{job.salary}</span>
            </p>
          )}
        </div>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, idx) => (
              <SkillTag key={idx} text={tag} />
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-slate-500">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">
            View Details
          </span>
          <span className="text-xs text-slate-500">Open in job page →</span>
        </div>
      </article>
    </Link>
  );
}

export default function JobsPage() {
  const { data, isLoading, error } = api.job.list.useQuery();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = data?.filter((job) => {
    const matchesType = !selectedType || job.type === selectedType;
    const matchesLevel = !selectedLevel || job.level === selectedLevel;

    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesLevel && matchesSearch;
  });

  const jobTypes = ["INTERNSHIP", "FULL_TIME"];
  const jobLevels = ["JUNIOR", "MID", "SENIOR"];

  const filterButton = (active: boolean) =>
    `rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
      active
        ? "bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.22)]"
        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
    }`;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(99,102,241,0.12),_transparent_35%),radial-gradient(circle_at_80%_40%,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute -left-20 top-6 h-36 w-36 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute right-0 top-12 h-24 w-24 rounded-full bg-emerald-100/60 blur-2xl" />
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              Smart Screening
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-5xl">
              Find roles built for your next move.
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Curated internships and full-time roles from high-growth teams with
              structured screening and instant feedback.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Search roles
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Search job title, company, or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-slate-300 focus:outline-none"
              />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                {filteredJobs?.length || 0} roles
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Quick filters
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={filterButton(!selectedType)}
              >
                All types
              </button>
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={filterButton(selectedType === type)}
                >
                  {type.replace("_", " ")}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLevel(null)}
                className={filterButton(!selectedLevel)}
              >
                All levels
              </button>
              {jobLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={filterButton(selectedLevel === level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading && <p className="text-sm text-slate-500">Loading jobs...</p>}
        {error && <p className="text-sm text-red-600">{error.message}</p>}

        {!isLoading && !error && (
          <>
            {filteredJobs && filteredJobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={{
                      id: job.id,
                      title: job.title,
                      company: job.company,
                      location: job.location,
                      type: job.type,
                      level: job.level,
                      role: job.role,
                      salary: job.salary,
                      tags: job.tags,
                      applied: job.applied,
                      examSubmitted: job.examSubmitted,
                      terminated: job.terminated,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <p className="text-lg font-medium text-slate-600">
                  No jobs found matching your criteria
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try resetting filters or widening the search.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

        :root {
          --jobs-heading: 'Sora', sans-serif;
          --jobs-body: 'Manrope', sans-serif;
        }

        main {
          font-family: var(--jobs-body);
        }

        h1, h2, h3 {
          font-family: var(--jobs-heading);
        }
      `}</style>
    </main>
  );
}