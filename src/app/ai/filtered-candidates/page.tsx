"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CandidateTable from "../components/CandidateTable";
import SearchFilterBar from "../components/SearchFilterBar";
import { api } from "~/trpc/react";

function FilteredCandidatesPageInner() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") ?? "";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  // Map UI filters to API params
  const apiStatusFilter =
    statusFilter === "PASS" ? "PASS" as const
    : statusFilter === "FAIL" ? "FAIL" as const
    : "ALL" as const;

  const minScore = scoreFilter !== "all"
    ? Number(scoreFilter.split("-")[0])
    : undefined;

  const { data: candidates, isLoading, error } = api.ai.getFilteredCandidates.useQuery(
    {
      jobId,
      statusFilter: apiStatusFilter,
      minScore,
      search: searchQuery || undefined,
    },
    { enabled: !!jobId },
  );

  if (!jobId) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/ai"
              className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-sky-500"
            >
              ← Back to AI Module
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Filtered Candidates
            </h1>
            <p className="mt-1 text-sm text-slate-500">AI-evaluated candidates for open positions</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shown</span>
            <span className="text-xl font-bold text-sky-500">0</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
            👥
          </div>
          <h2 className="text-lg font-semibold text-slate-800">No Job Selected</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Candidate filtering requires a job context. Open this page from a job listing to view pass/fail candidates.
          </p>
          <Link
            href="/ai"
            className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
          >
            Go to AI Module
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
          <span className="ml-3 text-sm text-slate-500">Loading candidates...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-red-500">{error.message}</p>
      </main>
    );
  }

  const candidateList = candidates ?? [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/ai"
            className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-sky-500"
          >
            ← Back to AI Module
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Filtered Candidates
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            AI-evaluated candidates for open positions
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Shown
          </span>
          <span className="text-xl font-bold text-sky-500">
            {candidateList.length}
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          scoreFilter={scoreFilter}
          onScoreChange={setScoreFilter}
        />
      </div>

      {/* Table / Cards */}
      <CandidateTable candidates={candidateList} />

      {/* Bottom nav */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/ai"
          className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-sky-400 hover:text-sky-500"
        >
          ← Back to AI Module
        </Link>
      </div>
    </main>
  );
}

export default function FilteredCandidatesPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
          </div>
        </main>
      }
    >
      <FilteredCandidatesPageInner />
    </Suspense>
  );
}
