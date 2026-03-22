"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import QuestionReviewCard from "../components/QuestionReviewCard";
import { api } from "~/trpc/react";

function EvaluationDetailsPageInner() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId") ?? "";

  const { data: result } = api.ai.getResult.useQuery(
    { applicationId },
    { enabled: !!applicationId },
  );

  const { data: questions, isLoading, error } = api.ai.getEvaluationDetails.useQuery(
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
            Evaluation Details
          </h1>
          <p className="mt-1 text-sm text-slate-500">Question-by-question breakdown</p>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Questions</p>
            <p className="text-lg font-bold text-slate-800">0</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Score</p>
            <p className="text-lg font-bold text-slate-800">0/0</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Score</p>
            <p className="text-lg font-bold text-slate-800">0.0/0.0</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
            🗂️
          </div>
          <h2 className="text-lg font-semibold text-slate-800">No Evaluation Data</h2>
          <p className="mt-2 text-sm text-slate-500">
            This section will show detailed AI feedback once an evaluated application is selected.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
          <span className="ml-3 text-sm text-slate-500">Loading evaluation details...</span>
        </div>
      </main>
    );
  }

  if (error || !questions) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-red-500">{error?.message ?? "Evaluation details not found."}</p>
      </main>
    );
  }

  const totalScore = questions.reduce((s, q) => s + q.score, 0);
  const maxScore = questions.reduce((s, q) => s + q.maxMarks, 0);
  const avgScore = questions.length > 0 ? totalScore / questions.length : 0;
  const avgMax = questions.length > 0 ? maxScore / questions.length : 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <Link
          href={`/ai/result?applicationId=${applicationId}`}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-sky-500"
        >
          ← Back to Exam Result
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Evaluation Details
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {result?.examTitle ?? "Exam"} &middot; Detailed question-by-question review
        </p>
      </div>

      {/* Summary bar */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sm">
            📋
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Questions
            </p>
            <p className="text-lg font-bold text-slate-800">
              {questions.length}
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-sm">
            🏅
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Score
            </p>
            <p className="text-lg font-bold text-slate-800">
              {totalScore}/{maxScore}
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-sm">
            📊
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Avg Score
            </p>
            <p className="text-lg font-bold text-slate-800">
              {avgScore.toFixed(1)}/{avgMax.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-5">
        {questions.map((q) => (
          <QuestionReviewCard key={q.id} question={q} />
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/ai/result?applicationId=${applicationId}`}
          className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-sky-400 hover:text-sky-500"
        >
          ← Back to Result
        </Link>
        <Link
          href={`/ai/permission-status?applicationId=${applicationId}`}
          className="flex-1 rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-sky-500"
        >
          View Permission Status →
        </Link>
      </div>
    </main>
  );
}

export default function EvaluationDetailsPage() {
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
      <EvaluationDetailsPageInner />
    </Suspense>
  );
}
