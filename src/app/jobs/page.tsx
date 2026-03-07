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
}

function JobTypeIcon({ type }: { type: string }) {
  return (
    <div
      className={`rounded-lg px-3 py-1 text-xs font-semibold ${
        type === "INTERNSHIP"
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {type === "INTERNSHIP" ? "📚 Internship" : "💼 Full-time"}
    </div>
  );
}

function LevelBadge({ level }: { level: string }) {
  const colors = {
    JUNIOR: "bg-emerald-100 text-emerald-700",
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
    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
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
      <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{job.company.name}</p>
          </div>
          <JobTypeIcon type={job.type} />
        </div>

        {/* Location & Level */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <span>📍</span>
            <span>{job.location}</span>
          </div>
          <LevelBadge level={job.level} />
        </div>

        {/* Salary */}
        {job.salary && (
          <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-600">Salary</p>
            <p className="text-sm font-semibold text-slate-900">{job.salary}</p>
          </div>
        )}

        {/* Role */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-600">Role</p>
          <p className="text-sm text-slate-700">{job.role.replace(/_/g, " ")}</p>
        </div>

        {/* Skills */}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, idx) => (
              <SkillTag key={idx} text={tag} />
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-slate-600">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
            View Details →
          </span>
          <span className="text-xs text-slate-500">Click to learn more</span>
        </div>
      </div>
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Find Your Next Opportunity
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Browse internships and job positions from top companies
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType(null)}
              className="rounded-full bg-blue-600 px-4 py-2 text-white"
            >
              All Types
            </button>

            {jobTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="rounded-full border px-4 py-2"
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLevel(null)}
              className="rounded-full bg-blue-600 px-4 py-2 text-white"
            >
              All Levels
            </button>

            {jobLevels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className="rounded-full border px-4 py-2"
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 text-sm text-slate-600">
          Showing {filteredJobs?.length || 0} job
          {filteredJobs?.length !== 1 ? "s" : ""}
        </div>

        {/* Loading */}
        {isLoading && <p>Loading jobs...</p>}

        {/* Error */}
        {error && <p className="text-red-600">{error.message}</p>}

        {/* Jobs */}
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
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border bg-white p-12 text-center">
                <p className="text-lg text-slate-600">
                  No jobs found matching your criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}