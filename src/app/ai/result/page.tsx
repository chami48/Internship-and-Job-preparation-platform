"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import ScoreCard from "../components/ScoreCard";
import StatusBadge from "../components/StatusBadge";
import FeedbackBox from "../components/FeedbackBox";
import { Target, BarChart2, CheckCircle2, XCircle, Ruler, FileText } from "lucide-react";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramId = searchParams.get("applicationId") ?? "";

  // Fall back to localStorage if no URL param
  const [applicationId, setApplicationId] = useState(paramId);

  useEffect(() => {
    if (!paramId) {
      try {
        const saved = localStorage.getItem("ai_last_application_id") ?? "";
        if (saved) setApplicationId(saved);
      } catch (_) { /* ignore */ }
    } else {
      setApplicationId(paramId);
    }
  }, [paramId]);

  const { data, isLoading, error } = api.ai.getResult.useQuery(
    { applicationId },
    { enabled: !!applicationId },
  );

  // Always fetch history so the panel is available
  const { data: history } = api.ai.getMyEvaluations.useQuery();

  const [showHistory, setShowHistory] = useState(false);

  // If no applicationId at all and history loaded → auto-expand history
  useEffect(() => {
    if (!applicationId && history && history.length > 0) {
      setShowHistory(true);
    }
  }, [applicationId, history]);

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

  // History panel component (reused below in two places)
  const historyHasOtherItems = history && history.filter((h) => h.applicationId !== applicationId).length > 0;
  const HistoryPanel = () => {
    const items = history?.filter((h) => h.applicationId !== applicationId) ?? [];
    if (items.length === 0) return null;
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-4xl p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-[#64748B] mb-5">
          Other Evaluations
        </p>
        <div className="flex flex-col gap-3">
          {items.map((h) => (
            <Link
              key={h.applicationId}
              href={`/ai/result?applicationId=${h.applicationId}`}
              className="flex items-center justify-between px-5 py-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:shadow-md transition-all duration-200 no-underline"
            >
              <div>
                <p className="text-sm font-black text-[#0F172A] m-0">{h.jobTitle}</p>
                <p className="text-xs text-[#94A3B8] m-0 mt-0.5 font-medium">{h.evaluatedAt}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-black px-3 py-1 rounded-full"
                  style={{
                    background: h.passed ? "#DCFCE7" : "#FEE2E2",
                    color: h.passed ? "#15803D" : "#B91C1C",
                  }}
                >
                  {h.passed ? "PASS" : "FAIL"} · {h.percentage.toFixed(1)}%
                </span>
                <span className="text-[#94A3B8] text-xs font-bold">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // If no applicationId and we have history → show history as primary content
  if (!applicationId && history && history.length > 0) {
    return (
      <div className="p-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F7FB2]/20 bg-[#1F7FB2]/5 text-xs font-black uppercase tracking-widest text-[#1F7FB2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F7FB2] animate-pulse" />
            My Evaluations
          </span>
        </div>
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
          <div className="relative z-10">
            <h1 className="text-4xl font-black tracking-tight leading-none mb-2">Exam Results</h1>
            <p className="text-white/40 text-sm font-medium mt-1">Select an evaluation to view details</p>
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-4xl p-8 shadow-sm">
          <div className="flex flex-col gap-3">
            {history.map((h) => (
              <Link
                key={h.applicationId}
                href={`/ai/result?applicationId=${h.applicationId}`}
                className="flex items-center justify-between px-5 py-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:shadow-md transition-all duration-200 no-underline"
              >
                <div>
                  <p className="text-sm font-black text-[#0F172A] m-0">{h.jobTitle}</p>
                  <p className="text-xs text-[#94A3B8] m-0 mt-0.5 font-medium">{h.evaluatedAt}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-black px-3 py-1 rounded-full"
                    style={{
                      background: h.passed ? "#DCFCE7" : "#FEE2E2",
                      color: h.passed ? "#15803D" : "#B91C1C",
                    }}
                  >
                    {h.passed ? "PASS" : "FAIL"} · {h.percentage.toFixed(1)}%
                  </span>
                  <span className="text-[#94A3B8] text-xs font-bold">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          icon={<Target size={22} />}
          accent="#1F7FB2"
          highlight
        />
        <ScoreCard
          label="Percentage"
          value={isEmpty ? "—" : `${data.percentage.toFixed(1)}%`}
          subtext="Overall performance"
          icon={<BarChart2 size={22} />}
          accent={isPassed ? "#22C55E" : "#EF4444"}
          highlight
        />
        <ScoreCard
          label="Status"
          value={isEmpty ? "—" : isPassed ? "PASSED" : "FAILED"}
          subtext={isEmpty ? "Awaiting result" : isPassed ? "Above cutoff" : "Below cutoff"}
          icon={isEmpty ? <FileText size={22} /> : isPassed ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
          accent={isPassed ? "#22C55E" : "#EF4444"}
        />
        <ScoreCard
          label="Cutoff"
          value={isEmpty ? "—" : `${data.cutoff}%`}
          subtext="Minimum required"
          icon={<Ruler size={22} />}
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

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
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

      {/* Other Evaluations history (only shown if there are other evaluations besides current) */}
      {historyHasOtherItems && (
        <div>
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#64748B] hover:text-[#1F7FB2] transition-colors duration-200 mb-4"
          >
            <span>{showHistory ? "▾" : "▸"}</span>
            Other Evaluations ({history!.filter((h) => h.applicationId !== applicationId).length})
          </button>
          {showHistory && <HistoryPanel />}
        </div>
      )}
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
