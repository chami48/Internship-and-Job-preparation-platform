"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Clock, Unlock, Lock } from "lucide-react";

const PAGE_STYLES = `
  @keyframes pulse-ring {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34,197,94,0.45); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 20px rgba(34,197,94,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34,197,94,0); }
  }
  @keyframes pulse-ring-red {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239,68,68,0.45); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 20px rgba(239,68,68,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239,68,68,0); }
  }
  @keyframes pulse-ring-gray {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(148,163,184,0.45); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 20px rgba(148,163,184,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(148,163,184,0); }
  }
  .pulse-green { animation: pulse-ring 2s ease-in-out infinite; }
  .pulse-red   { animation: pulse-ring-red 2s ease-in-out infinite; }
  .pulse-gray  { animation: pulse-ring-gray 2s ease-in-out infinite; }
`;

const EMPTY_STEPS = [
  "Complete your exam to receive evaluation results",
  "Your score will be compared against the job cutoff",
  "CV upload access is granted automatically on pass",
  "Check back here after your evaluation is complete",
];

function PermissionStatusContent() {
  const searchParams = useSearchParams();
  const paramId = searchParams.get("applicationId") ?? "";
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

  const { data, isLoading, error } = api.ai.getPermissionStatus.useQuery(
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
        Checking permission status…
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

  const isEmpty = !data || isNotFound;
  const isPassed = data?.passed ?? false;

  const nextSteps = isEmpty ? EMPTY_STEPS : data.nextSteps;
  const message = isEmpty
    ? "Submit your exam and complete AI evaluation to see your permission status here."
    : data.message;

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
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest"
          style={isEmpty
            ? { borderColor: "rgba(148,163,184,0.3)", background: "rgba(148,163,184,0.05)", color: "#64748B" }
            : {
                borderColor: isPassed ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)",
                background:  isPassed ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
                color:       isPassed ? "#15803D" : "#B91C1C",
              }
          }
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: isEmpty ? "#94A3B8" : isPassed ? "#22C55E" : "#EF4444" }}
          />
          Permission Status
        </span>
      </div>

      {/* Main status card */}
      <div
        className="rounded-5xl p-10 text-center mb-6 border"
        style={isEmpty
          ? {
              background: "linear-gradient(135deg,#F8FAFC 0%,#F1F5F9 100%)",
              borderColor: "#E2E8F0",
              boxShadow: "0 20px 60px rgba(15,23,42,0.06)",
            }
          : {
              background: isPassed
                ? "linear-gradient(135deg,#F0FDF4 0%,#DCFCE7 100%)"
                : "linear-gradient(135deg,#FFF7ED 0%,#FEE2E2 100%)",
              borderColor: isPassed ? "#86EFAC" : "#FECACA",
              boxShadow: isPassed
                ? "0 20px 60px rgba(34,197,94,0.12)"
                : "0 20px 60px rgba(239,68,68,0.12)",
            }
        }
      >
        {/* Animated pulse icon */}
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 ${isEmpty ? "pulse-gray" : isPassed ? "pulse-green" : "pulse-red"}`}
          style={{ background: isEmpty ? "#E2E8F0" : isPassed ? "#22C55E" : "#EF4444" }}
        >
          {isEmpty
            ? <Clock size={40} className="text-slate-400" />
            : isPassed
            ? <Unlock size={40} className="text-white" />
            : <Lock size={40} className="text-white" />
          }
        </div>

        {/* Status pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border text-xs font-black uppercase tracking-widest"
          style={isEmpty
            ? { background: "#F1F5F9", borderColor: "#E2E8F0", color: "#64748B" }
            : {
                background:  isPassed ? "#DCFCE7" : "#FEE2E2",
                borderColor: isPassed ? "#BBF7D0" : "#FECACA",
                color:       isPassed ? "#15803D" : "#B91C1C",
              }
          }
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isEmpty ? "#94A3B8" : isPassed ? "#22C55E" : "#EF4444" }}
          />
          {isEmpty ? "Awaiting Evaluation" : `CV Upload ${isPassed ? "Unlocked" : "Locked"}`}
        </div>

        <h1 className="text-4xl font-black text-[#0F172A] tracking-tight leading-tight mb-3">
          {isEmpty ? "No Result Yet" : isPassed ? "Congratulations! 🎉" : "Not Qualified Yet"}
        </h1>
        <p className="text-sm text-[#475569] leading-relaxed max-w-md mx-auto mb-8 font-medium">
          {message}
        </p>

        {/* Score row */}
        <div className="inline-flex items-center gap-6 bg-white border border-[#E2E8F0] rounded-2xl px-8 py-5">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#64748B] m-0">Your Score</p>
            <p
              className="text-4xl font-black m-0 mt-1 leading-none"
              style={{ color: isEmpty ? "#94A3B8" : isPassed ? "#15803D" : "#B91C1C" }}
            >
              {isEmpty ? "—" : `${data.percentage.toFixed(1)}%`}
            </p>
          </div>
          <div className="w-px h-10 bg-[#E2E8F0]" />
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#64748B] m-0">Cutoff</p>
            <p className="text-4xl font-black text-[#8B5CF6] m-0 mt-1 leading-none">
              {isEmpty ? "—" : `${data.cutoff}%`}
            </p>
          </div>
          <div className="w-px h-10 bg-[#E2E8F0]" />
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#64748B] m-0">Eval Status</p>
            <p className="text-sm font-black text-[#0F172A] m-0 mt-1">
              {isEmpty ? "PENDING" : data.status}
            </p>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="bg-white border border-[#E2E8F0] rounded-4xl p-8 mb-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-[#64748B] mb-5">
          {isEmpty ? "What to Expect" : isPassed ? "Your Next Steps" : "How to Improve"}
        </p>
        <div className="flex flex-col gap-3">
          {nextSteps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 bg-[#F4F7FB] rounded-2xl border border-[#E2E8F0]"
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 border"
                style={isEmpty
                  ? { background: "#F1F5F9", color: "#64748B", borderColor: "#E2E8F0" }
                  : {
                      background:  isPassed ? "#DCFCE7" : "#FEF9C3",
                      color:       isPassed ? "#15803D" : "#A16207",
                      borderColor: isPassed ? "#BBF7D0" : "#FEF08A",
                    }
                }
              >
                {i + 1}
              </span>
              <span className="text-sm text-[#334155] font-medium leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {isEmpty || !isPassed ? (
          <>
            <Link
              href={`/ai/evaluation-details?applicationId=${applicationId}`}
              className="flex-1 min-w-40 px-8 py-4 rounded-2xl text-sm font-black text-white text-center shadow-xl transition-all duration-200 hover:brightness-110 active:scale-[0.98] no-underline"
              style={{ background: "linear-gradient(135deg,#0F3D5E,#2C89B8)" }}
            >
              {isEmpty ? "View Evaluation Details" : "Review Feedback →"}
            </Link>
            <Link
              href="/home"
              className="flex-1 min-w-40 px-8 py-4 rounded-2xl text-sm font-black text-[#0F172A] text-center bg-white border border-[#E2E8F0] transition-all duration-200 hover:shadow-lg active:scale-[0.98] no-underline"
            >
              Browse Other Jobs
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/student/profile"
              className="flex-1 min-w-40 px-8 py-4 rounded-2xl text-sm font-black text-white text-center transition-all duration-200 hover:brightness-110 active:scale-[0.98] no-underline"
              style={{ background: "#15803D" }}
            >
              Upload CV Now →
            </Link>
            <Link
              href={`/ai/evaluation-details?applicationId=${applicationId}`}
              className="flex-1 min-w-40 px-8 py-4 rounded-2xl text-sm font-black text-[#0F172A] text-center bg-white border border-[#E2E8F0] transition-all duration-200 hover:shadow-lg active:scale-[0.98] no-underline"
            >
              View Evaluation Details
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PermissionStatusPage() {
  return (
    <>
      <style>{PAGE_STYLES}</style>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen text-sm text-[#64748B] font-semibold">
            Loading…
          </div>
        }
      >
        <PermissionStatusContent />
      </Suspense>
    </>
  );
}
