"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

function Tag({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
      {text}
    </span>
  );
}

export default function JobsGrid() {
  const { data: jobs, isLoading, error } = api.job.list.useQuery();

  if (isLoading) return <div className="mt-6 text-white/70">Loading jobs...</div>;
  if (error) return <div className="mt-6 text-red-400">{error.message}</div>;
  if (!jobs?.length) return <div className="mt-6 text-white/70">No jobs found.</div>;

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
        >
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
             {job.tags
                ?.split(",")
       .map((t: string) => t.trim())
  .filter(Boolean)
  .map((t: string) => (
    <Tag key={t} text={t} />
  ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <Link
                href={`/jobs/${job.id}`}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
              >
                View & Apply
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}