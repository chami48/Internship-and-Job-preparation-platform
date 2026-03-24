"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import ScoreCard from "../components/ScoreCard";
import StatusBadge from "../components/StatusBadge";
import FeedbackBox from "../components/FeedbackBox";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicationId = searchParams.get("applicationId") ?? "";

  const { data, isLoading, error } = api.ai.getResult.useQuery(
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
        Loading your results…
      </div>
    );
  }

  const isNotFound = error?.data?.code === "NOT_FOUND";

  if (error && !isNotFound) {
    return (
      <div className="text-center py-16 px-6">
        <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-4xl p-8 max-w-md mx-auto">
          <p className="text-[#B91C1C] font-bold text-sm mb-6">⚠️ {error.message}</p>
          <button
            onClick={() => router.push("/home")}
            className="px-8 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg,#0F3D5E,#2C89B8)" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isPassed = data?.status === "PASS";
  const isEmpty = !data || isNotFound;

  return (
    <div className="p-12">

      {/* Section tag */}
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F7FB2]/20 bg-[#1F7FB2]/5 text-xs font-black uppercase tracking-widest text-[#1F7FB2]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F7FB2] animate-pulse" />
          Student Result
        </span>
      </div>

      {/* Header card */}
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
        {/* Glow orb */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(58,182,217,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight leading-none mb-2">Exam Result</h1>
            {data?.studentName && (
              <p className="text-[#3AB6D9] font-black text-base mt-1">{data.studentName}</p>
            )}
            <p className="text-white/40 text-sm font-medium mt-1">
              {isEmpty ? "—" : `${data.examTitle} · ${data.date}`}
            </p>
          </div>
          {!isEmpty && <StatusBadge status={data.status} size="lg" />}
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <ScoreCard
          label="Total Score"
          value={isEmpty ? "—" : `${data.totalScore}/${data.maxScore}`}
          subtext="Points earned"
          icon="🎯"
          accent="#1F7FB2"
          highlight
        />
        <ScoreCard
          label="Percentage"
          value={isEmpty ? "—" : `${data.percentage.toFixed(1)}%`}
          subtext="Overall performance"
          icon="📊"
          accent={isPassed ? "#22C55E" : "#EF4444"}
          highlight
        />
        <ScoreCard
          label="Status"
          value={isEmpty ? "—" : isPassed ? "PASSED" : "FAILED"}
          subtext={isEmpty ? "Awaiting result" : isPassed ? "Above cutoff" : "Below cutoff"}
          icon={isEmpty ? "📋" : isPassed ? "✅" : "❌"}
          accent={isPassed ? "#22C55E" : "#EF4444"}
        />
        <ScoreCard
          label="Cutoff"
          value={isEmpty ? "—" : `${data.cutoff}%`}
          subtext="Minimum required"
          icon="📏"
          accent="#8B5CF6"
        />
      </div>

      {/* Performance bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-4xl p-8 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#64748B]">
            Performance vs Cutoff
          </span>
          <span className="text-xs font-black text-[#64748B]">
            {isEmpty ? "— / — cutoff" : `${data.percentage.toFixed(1)}% / ${data.cutoff}% cutoff`}
          </span>
        </div>
        <div className="relative h-3 bg-[#F1F5F9] rounded-full overflow-visible">
          {!isEmpty && (
            <>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(data.percentage, 100)}%`,
                  background: isPassed
                    ? "linear-gradient(90deg,#22C55E,#16A34A)"
                    : "linear-gradient(90deg,#EF4444,#DC2626)",
                }}
              />
              <div
                className="absolute -top-1 -bottom-1 w-0.5 rounded-sm bg-[#8B5CF6]"
                style={{ left: `${data.cutoff}%` }}
              />
              <div
                className="absolute text-[10px] font-black text-[#8B5CF6] whitespace-nowrap tracking-widest"
                style={{ top: -22, left: `${data.cutoff}%`, transform: "translateX(-50%)" }}
              >
                CUTOFF
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Feedback */}
      <div className="mb-6">
        <FeedbackBox
          feedback={isEmpty ? "AI evaluation feedback will appear here once your exam has been evaluated." : data.aiFeedback}
          title="AI Evaluation Summary"
          type="ai"
        />
      </div>

      {/* CV Upload status */}
      <div
        className="rounded-4xl p-8 mb-8 flex items-center justify-between gap-4 flex-wrap border"
        style={{
          background: "linear-gradient(135deg,#F8FAFC 0%,#F1F5F9 100%)",
          borderColor: "#E2E8F0",
          ...(isEmpty ? {} : {
            background: data.cvUploadUnlocked
              ? "linear-gradient(135deg,#F0FDF4 0%,#DCFCE7 100%)"
              : "linear-gradient(135deg,#FFF7ED 0%,#FEE2E2 100%)",
            borderColor: data.cvUploadUnlocked ? "#BBF7D0" : "#FECACA",
          }),
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border"
            style={isEmpty
              ? { background: "#F1F5F9", borderColor: "#E2E8F0" }
              : { background: data.cvUploadUnlocked ? "#DCFCE7" : "#FEE2E2", borderColor: data.cvUploadUnlocked ? "#86EFAC" : "#FECACA" }
            }
          >
            {isEmpty ? "📋" : data.cvUploadUnlocked ? "🔓" : "🔒"}
          </div>
          <div>
            <p className="font-black text-sm m-0 text-[#64748B]">
              {isEmpty ? "CV Upload Status" : `CV Upload ${data.cvUploadUnlocked ? "Unlocked" : "Locked"}`}
            </p>
            <p className="text-xs text-[#94A3B8] m-0 mt-1 font-medium">
              {isEmpty
                ? "Status will be available after evaluation."
                : data.cvUploadUnlocked
                  ? "You may now upload your CV and continue the process."
                  : "You must meet the cutoff to unlock CV upload."}
            </p>
          </div>
        </div>
        {!isEmpty && data.cvUploadUnlocked && (
          <Link
            href="/student/profile"
            className="px-6 py-3 rounded-2xl text-sm font-black text-white whitespace-nowrap transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ background: "#15803D" }}
          >
            Upload CV →
          </Link>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/ai/evaluation-details?applicationId=${applicationId}`}
          className="flex-1 min-w-45 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-black text-white text-center shadow-xl transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg,#0F3D5E,#2C89B8)" }}
        >
          View Detailed Evaluation →
        </Link>
        <Link
          href={`/ai/permission-status?applicationId=${applicationId}`}
          className="flex-1 min-w-45 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-black text-[#0F172A] text-center bg-white border border-[#E2E8F0] transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
        >
          Check Permission Status
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen text-sm text-[#64748B] font-semibold">
          Loading…
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
