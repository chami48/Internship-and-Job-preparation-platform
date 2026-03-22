"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "../../components/StatusBadge";
import ScoreCard from "../../components/ScoreCard";
import FeedbackBox from "../../components/FeedbackBox";
import QuestionReviewCard from "../../components/QuestionReviewCard";
import { api } from "~/trpc/react";

export default function CandidateDetailPage() {
  const params = useParams();
  const applicationId = params.id as string;

  const { data: c, isLoading, error } = api.ai.getCandidateDetail.useQuery(
    { applicationId },
    { enabled: !!applicationId },
  );

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
          <span className="ml-3 text-sm text-slate-500">Loading candidate details...</span>
        </div>
      </main>
    );
  }

  if (error || !c) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-red-500">{error?.message ?? "Candidate not found."}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <Link
          href="/ai/filtered-candidates"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-sky-500"
        >
          ← Back to Filtered Candidates
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Candidate Details
        </h1>
      </div>

      {/* Profile summary */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: avatar + info */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
              {c.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{c.name}</h2>
              <p className="text-sm text-slate-500">{c.email}</p>
              {c.phone && <p className="text-xs text-slate-400">{c.phone}</p>}
            </div>
          </div>
          {/* Right: status badge */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={c.status} size="lg" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Applied Role:{" "}
            </span>
            <span className="font-medium text-slate-800">{c.appliedRole}</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Evaluation Date:{" "}
            </span>
            <span className="font-medium text-slate-800">
              {c.evaluationDate}
            </span>
          </div>
          {c.university && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                University:{" "}
              </span>
              <span className="font-medium text-slate-800">{c.university}</span>
            </div>
          )}
          {c.degree && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Degree:{" "}
              </span>
              <span className="font-medium text-slate-800">{c.degree}</span>
            </div>
          )}
        </div>
      </div>

      {/* Score summary cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ScoreCard
          label="Final Score"
          value={`${c.totalScore}/${c.maxScore}`}
          accent="sky"
          icon={<span>📊</span>}
        />
        <ScoreCard
          label="Percentage"
          value={`${c.percentage.toFixed(1)}%`}
          accent={c.percentage >= c.cutoff ? "green" : "red"}
          icon={<span>📈</span>}
        />
        <ScoreCard
          label="Status"
          value={c.status}
          accent={c.status === "PASS" ? "green" : "red"}
          icon={<span>{c.status === "PASS" ? "✅" : "❌"}</span>}
        />
        <ScoreCard
          label="Cutoff"
          value={`${c.cutoff}%`}
          accent="amber"
          icon={<span>🎯</span>}
        />
      </div>

      {/* AI overall feedback */}
      <div className="mb-8">
        <FeedbackBox
          title="Overall AI Assessment"
          feedback={c.aiFeedback}
          variant={c.status === "PASS" ? "success" : "warning"}
        />
      </div>

      {/* Answers with AI feedback */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
          📝 Detailed Answers & AI Feedback
        </h3>
        <div className="space-y-5">
          {c.answers.map((q) => (
            <QuestionReviewCard key={q.id} question={q} />
          ))}
        </div>
      </div>

      {/* Candidate profile details */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-700">
          📂 Candidate Profile
        </h3>
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          {c.programmingLanguages && (
            <div>
              <span className="font-semibold text-slate-600">Languages: </span>
              <span className="text-slate-800">{c.programmingLanguages}</span>
            </div>
          )}
          {c.frameworks && (
            <div>
              <span className="font-semibold text-slate-600">Frameworks: </span>
              <span className="text-slate-800">{c.frameworks}</span>
            </div>
          )}
          {c.cgpa && (
            <div>
              <span className="font-semibold text-slate-600">CGPA: </span>
              <span className="text-slate-800">{c.cgpa}</span>
            </div>
          )}
          {c.linkedin && (
            <div>
              <span className="font-semibold text-slate-600">LinkedIn: </span>
              <span className="text-slate-800">{c.linkedin}</span>
            </div>
          )}
          {c.github && (
            <div>
              <span className="font-semibold text-slate-600">GitHub: </span>
              <span className="text-slate-800">{c.github}</span>
            </div>
          )}
          {c.portfolio && (
            <div>
              <span className="font-semibold text-slate-600">Portfolio: </span>
              <span className="text-slate-800">{c.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/ai/filtered-candidates"
          className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-sky-400 hover:text-sky-500"
        >
          ← Back to Candidates
        </Link>
        <Link
          href="/ai"
          className="flex-1 rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-sky-500"
        >
          AI Module Home
        </Link>
      </div>
    </main>
  );
}
