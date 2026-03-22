"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ScoreCard from "../components/ScoreCard";
import StatusBadge from "../components/StatusBadge";
import FeedbackBox from "../components/FeedbackBox";
import { api } from "~/trpc/react";

function StudentExamResultPageInner() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId") ?? "";

  const { data: result, isLoading, error } = api.ai.getResult.useQuery(
    { applicationId },
    { enabled: !!applicationId },
  );

  if (!applicationId) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/ai"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-sky-500"
          >
            ← Back to AI Module
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Exam Result
          </h1>
          <p className="mt-1 text-sm text-slate-500">No evaluation selected</p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <ScoreCard label="Total Score" value="--/--" icon={<span>📊</span>} accent="sky" />
          <ScoreCard label="Percentage" value="--%" icon={<span>📈</span>} accent="amber" />
          <ScoreCard label="Status" value="--" icon={<span>⏳</span>} accent="amber" />
          <ScoreCard label="Cutoff" value="--%" subtitle="Minimum required" icon={<span>🎯</span>} accent="amber" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
            📭
          </div>
          <h2 className="text-lg font-semibold text-slate-800">No Result Yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            We could not find an application context. Once an exam is evaluated, the full result will appear here.
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
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
          <span className="ml-3 text-sm text-slate-500">Loading result...</span>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-red-500">{error?.message ?? "Result not found."}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <Link
          href="/ai"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-sky-500"
        >
          ← Back to AI Module
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Exam Result
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {result.examTitle} &middot; {result.date}
        </p>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ScoreCard
          label="Total Score"
          value={`${result.totalScore}/${result.maxScore}`}
          icon={<span>📊</span>}
          accent="sky"
        />
        <ScoreCard
          label="Percentage"
          value={`${result.percentage.toFixed(1)}%`}
          icon={<span>📈</span>}
          accent={result.percentage >= result.cutoff ? "green" : "red"}
        />
        <ScoreCard
          label="Status"
          value={result.status}
          icon={<span>{result.status === "PASS" ? "✅" : "❌"}</span>}
          accent={result.status === "PASS" ? "green" : "red"}
        />
        <ScoreCard
          label="Cutoff"
          value={`${result.cutoff}%`}
          subtitle="Minimum required"
          icon={<span>🎯</span>}
          accent="amber"
        />
      </div>

      {/* Pass / Fail badge */}
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${
            result.status === "PASS"
              ? "bg-emerald-100 text-emerald-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {result.status === "PASS" ? "🏆" : "📉"}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">
              {result.studentName}
            </h2>
            <StatusBadge status={result.status} size="lg" />
          </div>
          <p className="mt-0.5 text-sm text-slate-500">
            You scored <span className="font-semibold">{result.percentage.toFixed(1)}%</span>{" "}
            with a cutoff of {result.cutoff}%.
          </p>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="mb-8">
        <FeedbackBox
          title="AI Summary Feedback"
          feedback={result.aiFeedback}
          variant={result.status === "PASS" ? "success" : "warning"}
        />
      </div>

      {/* CV Upload Status */}
      <div
        className={`mb-8 rounded-2xl border p-5 ${
          result.cvUploadUnlocked
            ? "border-emerald-200 bg-emerald-50/40"
            : "border-red-200 bg-red-50/40"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {result.cvUploadUnlocked ? "🔓" : "🔒"}
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              CV Upload{" "}
              {result.cvUploadUnlocked ? "Unlocked" : "Locked"}
            </h3>
            <p className="text-xs text-slate-500">
              {result.cvUploadUnlocked
                ? "You can now upload your CV/Resume to proceed with applications."
                : "Pass the evaluation to unlock CV upload and apply for positions."}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/ai/evaluation-details?applicationId=${applicationId}`}
          className="flex-1 rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-sky-500"
        >
          View Detailed Evaluation →
        </Link>
        <Link
          href={`/ai/permission-status?applicationId=${applicationId}`}
          className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-sky-400 hover:text-sky-500"
        >
          View Permission Status
        </Link>
      </div>
    </main>
  );
}

export default function StudentExamResultPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
          </div>
        </main>
      }
    >
      <StudentExamResultPageInner />
    </Suspense>
  );
}
