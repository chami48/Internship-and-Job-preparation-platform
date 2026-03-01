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

export default function JobsPage() {
  const { data, isLoading, error } = api.job.list.useQuery();

  return (
    <main className="min-h-screen bg-[#07060a]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-white">Browse Jobs</h1>
        <p className="mt-2 text-sm text-white/60">
          Data is coming from SQLite (Prisma). Your friend can extend later.
        </p>

        {isLoading && <p className="mt-6 text-white/70">Loading...</p>}
        {error && <p className="mt-6 text-red-400">{error.message}</p>}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {data?.map((job) => {
            const tags = job.tags
              ? job.tags.split(",").map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={job.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="text-lg font-semibold text-white">{job.title}</div>
                <div className="mt-1 text-sm text-white/60">
                  {job.company} • {job.location}
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
      </div>
    </main>
  );
}