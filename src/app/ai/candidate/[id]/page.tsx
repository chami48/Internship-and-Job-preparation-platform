"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import StatusBadge from "../../components/StatusBadge";
import FeedbackBox from "../../components/FeedbackBox";
import QuestionReviewCard from "../../components/QuestionReviewCard";

function CandidateDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const applicationId = params.id as string;
  const jobId = searchParams.get("jobId") ?? "";

  const { data, isLoading, error } = api.ai.getCandidateDetail.useQuery(
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
        Loading candidate profile…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-[#FEE2E2] border border-[#FECACA] rounded-4xl p-8 text-center">
        <p className="text-[#B91C1C] font-bold text-sm mb-6">⚠️ {error.message}</p>
        <Link
          href={jobId ? `/ai/filtered-candidates?jobId=${jobId}` : "/company/dashboard"}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold text-white shadow-xl transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg,#0F3D5E,#2C89B8)" }}
        >
          Back
        </Link>
      </div>
    );
  }

  const isEmpty = !data;
  const isPassed = data?.status === "PASS";

  const profileFields: { label: string; value: string | null | undefined }[] = isEmpty ? [] : [
    { label: "University",     value: data.university },
    { label: "Degree",         value: data.degree },
    { label: "Specialization", value: String(data.specialization).replace(/_/g, " ") },
    { label: "CGPA",           value: data.cgpa },
    { label: "Languages",      value: data.programmingLanguages },
    { label: "Frameworks",     value: data.frameworks },
    { label: "Phone",          value: data.phone },
  ];

  const links: { label: string; value: string | null | undefined; icon: string }[] = isEmpty ? [] : [
    { label: "LinkedIn",  value: data.linkedin,  icon: "💼" },
    { label: "GitHub",    value: data.github,    icon: "🐙" },
    { label: "Portfolio", value: data.portfolio, icon: "🌐" },
  ];

  return (
    <div className="p-12">

      {/* Back link */}
      <Link
        href={jobId ? `/ai/filtered-candidates?jobId=${jobId}` : "/company/dashboard"}
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#64748B] hover:text-[#1F7FB2] transition-colors duration-200 mb-6 no-underline"
      >
        ← Back to Candidates
      </Link>

      {/* Section tag */}
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F7FB2]/20 bg-[#1F7FB2]/5 text-xs font-black uppercase tracking-widest text-[#1F7FB2]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F7FB2] animate-pulse" />
          Recruiter View — AI Candidate Profile
        </span>
      </div>

      {/* Hero profile card */}
      <div
        className="rounded-5xl p-10 mb-6 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #0F3D5E 55%, #1F7FB2 100%)",
          boxShadow: "0 20px 60px rgba(15,23,42,0.25)",
        }}
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
        <div className="relative z-10">
          <div className="flex flex-wrap gap-5 items-start justify-between">
            <div className="flex gap-5 items-start">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg,#1F7FB2,#3AB6D9)",
                  boxShadow: "0 8px 24px rgba(58,182,217,0.35)",
                }}
              >
                {isEmpty ? "?" : data.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/40 m-0 mb-1">
                  AI Candidate Profile
                </p>
                <h1 className="text-4xl font-black tracking-tight leading-none m-0">
                  {isEmpty ? "—" : data.name}
                </h1>
                <p className="text-sm text-white/50 font-medium m-0 mt-1">
                  {isEmpty ? "No candidate data available" : `${data.email}${data.phone ? ` · ${data.phone}` : ""}`}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {!isEmpty && <StatusBadge status={data.status} size="lg" />}
              <span className="text-xs text-white/40 font-medium">
                {isEmpty ? "—" : `Evaluated ${data.evaluationDate}`}
              </span>
            </div>
          </div>

          {/* Score chips */}
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              { label: "Total Score", value: isEmpty ? "—" : `${data.totalScore}/${data.maxScore}`, color: "#3AB6D9" },
              { label: "Percentage",  value: isEmpty ? "—" : `${data.percentage.toFixed(1)}%`,      color: isEmpty ? "#94A3B8" : isPassed ? "#4ADE80" : "#F87171" },
              { label: "Cutoff",      value: isEmpty ? "—" : `${data.cutoff}%`,                     color: "#A78BFA" },
              { label: "Role",        value: isEmpty ? "—" : data.appliedRole,                       color: "#FBBF24" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex-1 basis-28 rounded-2xl px-5 py-4 border"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  borderColor: "rgba(255,255,255,0.12)",
                }}
              >
                <p className="text-xs font-black uppercase tracking-widest text-white/40 m-0">{s.label}</p>
                <p className="text-xl font-black m-0 mt-1" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile + AI columns */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5 mb-6">

        {/* Profile info */}
        <div className="bg-white border border-[#E2E8F0] rounded-4xl p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-[#64748B] mb-5">
            Profile Details
          </p>
          {isEmpty ? (
            <div className="flex flex-col gap-3">
              {["University", "Degree", "Specialization", "CGPA", "Languages", "Frameworks"].map((label) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-black uppercase tracking-widest text-[#94A3B8]">{label}</span>
                  <span className="text-sm font-bold text-[#CBD5E1]">—</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {profileFields.map(
                (f) =>
                  f.value && (
                    <div key={f.label} className="flex flex-col gap-0.5">
                      <span className="text-xs font-black uppercase tracking-widest text-[#94A3B8]">
                        {f.label}
                      </span>
                      <span className="text-sm font-bold text-[#334155]">{f.value}</span>
                    </div>
                  ),
              )}
            </div>
          )}

          {/* External links */}
          {!isEmpty && links.some((l) => l.value) && (
            <div className="mt-5 flex flex-col gap-2">
              {links.map(
                (l) =>
                  l.value && (
                    <a
                      key={l.label}
                      href={l.value.startsWith("http") ? l.value : `https://${l.value}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-[#F4F7FB] border border-[#E2E8F0] rounded-2xl text-xs font-black uppercase tracking-widest text-[#1F7FB2] no-underline hover:bg-[#EFF6FF] transition-colors duration-200"
                    >
                      {l.icon} {l.label}
                    </a>
                  ),
              )}
            </div>
          )}

          {/* CV badge */}
          {!isEmpty && data.cvUploadGranted && (
            <div className="mt-5 px-4 py-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl text-xs font-black uppercase tracking-widest text-[#15803D]">
              🔓 CV Upload Granted
            </div>
          )}
        </div>

        {/* Score bar + Feedback + Shortlist */}
        <div className="flex flex-col gap-5">

          {/* Score breakdown */}
          <div className="bg-white border border-[#E2E8F0] rounded-4xl p-8 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-[#64748B] mb-5">
              Score Breakdown
            </p>
            <div className="flex justify-between mb-3">
              <span className="text-sm font-bold text-[#475569]">Performance vs Cutoff</span>
              <span
                className="text-sm font-black"
                style={{ color: isEmpty ? "#94A3B8" : isPassed ? "#15803D" : "#B91C1C" }}
              >
                {isEmpty ? "—" : `${data.percentage.toFixed(1)}%`}
              </span>
            </div>
            <div className="relative h-3 bg-[#F1F5F9] rounded-full overflow-visible mb-2">
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
                    className="absolute -top-1 -bottom-1 w-0.5 bg-[#8B5CF6] rounded-sm"
                    style={{ left: `${data.cutoff}%` }}
                  />
                </>
              )}
            </div>
            <p className="text-xs font-medium text-[#64748B] mt-2">
              {isEmpty ? "Score bar will appear after evaluation." : `Purple line = ${data.cutoff}% cutoff threshold`}
            </p>
          </div>

          {/* AI Feedback */}
          <FeedbackBox
            feedback={isEmpty ? "AI evaluation summary will appear here once the candidate has been evaluated." : data.aiFeedback}
            title="AI Overall Evaluation Summary"
            type="ai"
          />

          {/* Shortlist eligibility */}
          <div
            className="rounded-4xl p-8 flex items-center justify-between gap-4 flex-wrap border"
            style={isEmpty
              ? { background: "linear-gradient(135deg,#F8FAFC,#F1F5F9)", borderColor: "#E2E8F0" }
              : {
                  background: isPassed
                    ? "linear-gradient(135deg,#F0FDF4,#DCFCE7)"
                    : "linear-gradient(135deg,#FFF7ED,#FEE2E2)",
                  borderColor: isPassed ? "#BBF7D0" : "#FECACA",
                }
            }
          >
            <div>
              <p
                className="font-black text-sm m-0"
                style={{ color: isEmpty ? "#64748B" : isPassed ? "#15803D" : "#B91C1C" }}
              >
                {isEmpty ? "📋 Eligibility Pending" : isPassed ? "✅ Eligible for Shortlisting" : "❌ Does Not Meet Cutoff"}
              </p>
              <p className="text-xs text-[#64748B] m-0 mt-1.5 font-medium">
                {isEmpty
                  ? "Shortlist eligibility will be determined after AI evaluation."
                  : isPassed
                    ? "This candidate passed the AI evaluation."
                    : "Candidate did not meet the minimum score threshold."}
              </p>
            </div>
            <span
              className="px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white cursor-default whitespace-nowrap"
              style={{ background: isEmpty ? "#CBD5E1" : isPassed ? "#15803D" : "#9CA3AF" }}
            >
              {isEmpty ? "Pending" : isPassed ? "Shortlist" : "Not Eligible"}
            </span>
          </div>
        </div>
      </div>

      {/* Per-question breakdown */}
      {!isEmpty && data.answers.length > 0 && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#64748B] mb-5">
            Question-by-Question Breakdown
          </p>
          <div className="flex flex-col gap-5">
            {data.answers.map((a) => (
              <QuestionReviewCard key={a.id} {...a} />
            ))}
          </div>
        </div>
      )}

      {isEmpty && (
        <div className="bg-white border border-[#E2E8F0] rounded-4xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#F4F7FB] border border-[#E2E8F0] flex items-center justify-center text-3xl mx-auto mb-4">
            📋
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-[#64748B]">
            No evaluation data available
          </p>
          <p className="text-sm text-[#94A3B8] font-medium mt-2">
            Question-by-question results will appear here after the candidate is evaluated.
          </p>
        </div>
      )}
    </div>
  );
}

export default function CandidateDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen text-sm text-[#64748B] font-semibold">
          Loading…
        </div>
      }
    >
      <CandidateDetailContent />
    </Suspense>
  );
}
