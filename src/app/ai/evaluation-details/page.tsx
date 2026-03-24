"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import QuestionReviewCard from "../components/QuestionReviewCard";

function EvaluationDetailsContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId") ?? "";

  const { data, isLoading, error } = api.ai.getEvaluationDetails.useQuery(
    { applicationId },
    { enabled: !!applicationId },
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-75 gap-3 text-[#64748B] text-sm font-semibold">
        <svg className="animate-spin w-5 h-5 text-[#1F7FB2]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading evaluation details…
      </div>
    );
  }

  const isNotFound = error?.data?.code === "NOT_FOUND";

  if (error && !isNotFound) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-[#FEE2E2] border border-[#FECACA] rounded-4xl p-8 text-center">
        <p className="text-[#B91C1C] font-bold text-sm">⚠️ {error.message}</p>
      </div>
    );
  }

  const isEmpty = !data || data.length === 0 || isNotFound;
  const totalScore = isEmpty ? 0 : data.reduce((s, q) => s + q.score, 0);
  const maxScore = isEmpty ? 0 : data.reduce((s, q) => s + q.maxMarks, 0);
  const correctCount = isEmpty ? 0 : data.filter((q) => q.score === q.maxMarks).length;
  const partialCount = isEmpty ? 0 : data.filter((q) => q.score > 0 && q.score < q.maxMarks).length;
  const noCreditCount = isEmpty ? 0 : data.filter((q) => q.score === 0).length;

  return (
    <div className="p-12">

      {/* Back link */}
      <Link
        href={`/ai/result?applicationId=${applicationId}`}
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#64748B] hover:text-[#1F7FB2] transition-colors duration-200 mb-6 no-underline"
      >
        ← Back to Result
      </Link>

      {/* Section tag */}
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F7FB2]/20 bg-[#1F7FB2]/5 text-xs font-black uppercase tracking-widest text-[#1F7FB2]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F7FB2] animate-pulse" />
          AI Evaluation
        </span>
      </div>

      {/* Header + score chip */}
      <div
        className="rounded-5xl p-10 text-white mb-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #0F3D5E 55%, #1F7FB2 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(58,182,217,1) 1px,transparent 1px),linear-gradient(90deg,rgba(58,182,217,1) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(58,182,217,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight leading-none mb-2">
              Evaluation Details
            </h1>
            <p className="text-white/40 text-sm font-medium mt-1">
              {isEmpty
                ? "Per-question AI analysis · no questions yet"
                : `Per-question AI analysis · ${data.length} question${data.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-right">
            <p className="text-xs font-black uppercase tracking-widest text-white/40 m-0">Total Score</p>
            <p className="text-4xl font-black text-white m-0 leading-none mt-1">
              {isEmpty ? "—" : totalScore}
              {!isEmpty && <span className="text-xl font-bold text-white/40">/{maxScore}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Progress overview */}
      <div className="bg-white border border-[#E2E8F0] rounded-4xl px-8 py-6 mb-6 shadow-sm flex flex-wrap gap-6 items-center">
        {[
          { label: "Correct / Full Marks", count: correctCount, color: "#15803D", bg: "#DCFCE7", border: "#BBF7D0" },
          { label: "Partial Credit",       count: partialCount,  color: "#A16207", bg: "#FEF9C3", border: "#FEF08A" },
          { label: "No Credit",            count: noCreditCount, color: "#B91C1C", bg: "#FEE2E2", border: "#FECACA" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black border"
              style={{ background: s.bg, color: s.color, borderColor: s.border }}
            >
              {s.count}
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-[#64748B]">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Question cards or empty placeholder */}
      {isEmpty ? (
        <div className="bg-white border border-[#E2E8F0] rounded-4xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#F4F7FB] border border-[#E2E8F0] flex items-center justify-center text-3xl mx-auto mb-4">
            📭
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-[#64748B]">
            No evaluation details available yet
          </p>
          <p className="text-sm text-[#94A3B8] font-medium mt-2">
            Question-by-question results will appear here after evaluation.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {data.map((q) => (
            <QuestionReviewCard key={q.id} {...q} />
          ))}
        </div>
      )}

      {/* Bottom nav */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/ai/result?applicationId=${applicationId}`}
          className="flex-1 min-w-40 px-8 py-4 rounded-2xl text-sm font-black text-[#0F172A] text-center bg-white border border-[#E2E8F0] transition-all duration-200 hover:shadow-lg active:scale-[0.98] no-underline"
        >
          ← Back to Result
        </Link>
        <Link
          href={`/ai/permission-status?applicationId=${applicationId}`}
          className="flex-1 min-w-40 px-8 py-4 rounded-2xl text-sm font-black text-white text-center shadow-xl transition-all duration-200 hover:brightness-110 active:scale-[0.98] no-underline"
          style={{ background: "linear-gradient(135deg,#0F3D5E,#2C89B8)" }}
        >
          Check Permission Status →
        </Link>
      </div>
    </div>
  );
}

export default function EvaluationDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen text-sm text-[#64748B] font-semibold">
          Loading…
        </div>
      }
    >
      <EvaluationDetailsContent />
    </Suspense>
  );
}
