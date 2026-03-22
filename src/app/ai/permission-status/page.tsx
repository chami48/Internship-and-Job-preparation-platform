"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "../components/StatusBadge";
import ScoreCard from "../components/ScoreCard";
import { api } from "~/trpc/react";

function PermissionStatusPageInner() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId") ?? "";

  const { data, isLoading, error } = api.ai.getPermissionStatus.useQuery(
    { applicationId },
    { enabled: !!applicationId },
  );

  if (!applicationId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/ai"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-sky-500"
          >
            ← Back to AI Module
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Permission Status
          </h1>
          <p className="mt-1 text-sm text-slate-500">Your evaluation outcome and next steps</p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
            ⏳
          </div>
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pending
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-800">No Application Context</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            Select or open an evaluated application to view pass/fail permission status and next steps.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-4">
          <ScoreCard label="Your Score" value="--%" accent="amber" icon={<span>📊</span>} />
          <ScoreCard label="Cutoff" value="--%" accent="amber" icon={<span>🎯</span>} />
          <ScoreCard label="CV Upload" value="--" accent="amber" icon={<span>🔒</span>} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-700">🗺️ Next Steps</h3>
          <p className="text-sm text-slate-500">
            After evaluation, this section will display required actions for your application.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
          <span className="ml-3 text-sm text-slate-500">Loading permission status...</span>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-red-500">{error?.message ?? "Permission status not found."}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <Link
          href={`/ai/result?applicationId=${applicationId}`}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-sky-500"
        >
          ← Back to Exam Result
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Permission Status
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Your evaluation outcome and next steps
        </p>
      </div>

      {/* Status hero */}
      <div
        className={`mb-8 rounded-2xl border p-8 text-center ${
          data.passed
            ? "border-emerald-200 bg-linear-to-b from-emerald-50 to-white"
            : "border-red-200 bg-linear-to-b from-red-50 to-white"
        }`}
      >
        <div
          className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-4xl ${
            data.passed ? "bg-emerald-100" : "bg-red-100"
          }`}
        >
          {data.passed ? "🎉" : "📋"}
        </div>
        <StatusBadge status={data.passed ? "PASS" : "FAIL"} size="lg" />
        <h2 className="mt-4 text-xl font-bold text-slate-800">
          {data.passed ? "Evaluation Passed!" : "Evaluation Not Passed"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          {data.message}
        </p>
      </div>

      {/* Score summary */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <ScoreCard
          label="Your Score"
          value={`${data.percentage.toFixed(1)}%`}
          accent={data.passed ? "green" : "red"}
          icon={<span>📊</span>}
        />
        <ScoreCard
          label="Cutoff"
          value={`${data.cutoff}%`}
          accent="amber"
          icon={<span>🎯</span>}
        />
        <ScoreCard
          label="CV Upload"
          value={data.cvUploadUnlocked ? "Unlocked" : "Locked"}
          accent={data.cvUploadUnlocked ? "green" : "red"}
          icon={<span>{data.cvUploadUnlocked ? "🔓" : "🔒"}</span>}
        />
      </div>

      {/* Next steps */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
          <span>🗺️</span> Next Steps
        </h3>
        <div className="space-y-3">
          {data.nextSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  data.passed ? "bg-emerald-500" : "bg-slate-400"
                }`}
              >
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {data.passed ? (
          <>
            <Link
              href="/ai/filtered-candidates"
              className="flex-1 rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-sky-500"
            >
              View Filtered Candidates →
            </Link>
            <Link
              href={`/ai/evaluation-details?applicationId=${applicationId}`}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-sky-400 hover:text-sky-500"
            >
              Review Evaluation Details
            </Link>
          </>
        ) : (
          <>
            <Link
              href={`/ai/evaluation-details?applicationId=${applicationId}`}
              className="flex-1 rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-sky-500"
            >
              Review Feedback →
            </Link>
            <Link
              href="/ai"
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-sky-400 hover:text-sky-500"
            >
              Back to AI Module
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function PermissionStatusPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
          </div>
        </main>
      }
    >
      <PermissionStatusPageInner />
    </Suspense>
  );
}
