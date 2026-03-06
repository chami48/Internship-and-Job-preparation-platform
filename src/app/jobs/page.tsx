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

        {/* Role & Skills */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-600">Role</p>
          <p className="text-sm text-slate-700">{job.role.replace(/_/g, " ")}</p>
        </div>

        {/* Skills Tags */}
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

        {/* CTA */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-200">
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
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900">
              Find Your Next Opportunity
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Browse internships and job positions from top companies
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          {/* Job Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedType === null
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              All Types
            </button>
            {jobTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedType === type
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {type === "INTERNSHIP" ? "📚 Internship" : "💼 Full-time"}
              </button>
            ))}
          </div>

          {/* Job Level Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLevel(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedLevel === null
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              All Levels
            </button>
            {jobLevels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedLevel === level
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-slate-600">
          Showing {filteredJobs?.length || 0} job
          {filteredJobs?.length !== 1 ? "s" : ""}
                <div className="text-lg font-semibold text-white">{job.title}</div>
                <div className="mt-1 text-sm text-white/60">
                  {job.company?.name} • {job.location}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Tag key={t} text={t} />
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="text-sm text-white/70">
                    <span className="text-white/50">Type:</span> {job.type} •{" "}
                    <span className="text-white/50">Level:</span> {job.level}
                  </div>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
            <p className="mt-4 text-slate-600">Loading opportunities...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-red-600">
              Error loading jobs: {error.message}
            </p>
          </div>
        )}

        {/* Jobs Grid */}
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
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                <p className="text-lg text-slate-600">
                  No jobs found matching your criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType(null);
                    setSelectedLevel(null);
                  }}
                  className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}