"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, MapPin, Briefcase, Clock, Users, Calendar,
  DollarSign, Tag, CheckCircle2, ListChecks, Gift, FileText, Pencil, BarChart3, Eye,
} from "lucide-react";
import { api } from "~/trpc/react";

const ROLE_ICON: Record<string, string> = {
  SOFTWARE_ENGINEER: "💻",
  UX_ENGINEER: "🎨",
  PROJECT_MANAGER: "📋",
};

const LEVEL_STYLE: Record<string, string> = {
  JUNIOR: "bg-[#EFF6FF] text-[#1D4ED8]",
  MID:    "bg-[#F0FDF4] text-[#15803D]",
  SENIOR: "bg-[#FFF7ED] text-[#C2410C]",
};

const TYPE_STYLE: Record<string, string> = {
  FULL_TIME:  "bg-[#EFF6FF] text-[#1F7FB2]",
  INTERNSHIP: "bg-[#F5F3FF] text-[#7C3AED]",
};

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function isExpired(deadline: Date | null | undefined): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#1F7FB2]">{icon}</span>
        <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function TextBlock({ text }: { text: string }) {
  return (
    <div className="space-y-1.5">
      {text.split("\n").filter(Boolean).map((line, i) => (
        <p key={i} className="text-sm text-slate-600 leading-relaxed">
          {line.startsWith("-") ? (
            <span className="flex gap-2"><span className="text-[#1F7FB2] font-bold mt-0.5">•</span><span>{line.slice(1).trim()}</span></span>
          ) : line}
        </p>
      ))}
    </div>
  );
}

export default function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [showPerformance, setShowPerformance] = useState(false);

  useEffect(() => {
    if (searchParams.get("performance") === "1") {
      setShowPerformance(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);

  const { data: job, isLoading, isError } = api.job.byId.useQuery({ id: jobId });

  const {
    data: performance,
    isLoading: performanceLoading,
    refetch: refetchPerformance,
  } = api.job.performance.useQuery(
    { jobId, companyId: companyId ?? "" },
    { enabled: !!companyId && showPerformance },
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-base font-medium">
        Loading job details…
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
        <div className="text-4xl">😕</div>
        <p className="font-semibold text-base">Job not found.</p>
        <button onClick={() => router.back()} className="text-sm text-[#1F7FB2] hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const exp = isExpired(job.deadline);

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">

      {/* Back + Edit row */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/company/my-jobs")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1F7FB2] transition-colors"
        >
          <ArrowLeft size={16} /> Back to My Job Posts
        </button>
        <div className="flex items-center gap-2">
          <a
            href={`/ai/filtered-candidates?jobId=${jobId}`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors no-underline"
            style={{ background: "linear-gradient(135deg,#0F3D5E,#2C89B8)" }}
          >
            🤖 View AI Candidates
          </a>
          <button
            onClick={() => router.push(`/company/my-jobs/${jobId}/edit`)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1F7FB2] border border-[#1F7FB2]/30 rounded-xl hover:bg-[#EFF8FF] transition-colors"
          >
            <Pencil size={14} /> Edit Job
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => {
            setShowPerformance((prev) => !prev);
            if (!showPerformance) {
              void refetchPerformance();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#0F172A] to-[#0F75A8] rounded-xl shadow-sm hover:brightness-110 transition-all"
        >
          <BarChart3 size={14} /> {showPerformance ? "Hide Performance" : "Check Performance"}
        </button>
      </div>

      {showPerformance && (
        <div className="mb-6 border border-[#DCE7F5] rounded-2xl p-6 bg-gradient-to-br from-white to-[#F7FBFF] shadow-sm">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A] inline-flex items-center gap-2">
                <BarChart3 size={16} className="text-[#0F75A8]" /> Job Performance Analytics
              </h3>
              <p className="text-xs text-slate-500 mt-1">Track visibility, conversion funnel, and screening outcomes.</p>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                performance?.healthLevel === "HIGH"
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : performance?.healthLevel === "MEDIUM"
                    ? "bg-amber-100 text-amber-700 border-amber-200"
                    : "bg-red-100 text-red-700 border-red-200"
              }`}
            >
              {performance?.healthLevel ?? "-"}
            </span>
          </div>

          {performanceLoading || !performance ? (
            <p className="text-sm text-slate-500">Loading performance metrics...</p>
          ) : (
            <>
              <div className="mb-4 rounded-xl border border-slate-200 p-4 bg-[#F8FAFC]">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Recruitment Funnel</p>
                {[
                  { label: "Applicants", value: performance.applicants, color: "bg-[#0F75A8]" },
                  { label: "Exam Submitted", value: performance.examSubmitted, color: "bg-[#3B82F6]" },
                  { label: "Evaluated", value: performance.evaluated, color: "bg-[#6366F1]" },
                  { label: "Passed", value: performance.passed, color: "bg-[#10B981]" },
                ].map((step) => {
                  const base = Math.max(performance.applicants, 1);
                  const width = Math.min(100, Math.round((step.value / base) * 100));
                  return (
                    <div key={step.label} className="mb-2.5 last:mb-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">{step.label}</span>
                        <span className="text-slate-500">{step.value}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className={`h-full ${step.color} transition-all duration-500`} style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="rounded-xl border border-[#DAE8F8] p-3 bg-white shadow-sm">
                  <p className="text-xs text-slate-500">Estimated Views</p>
                  <p className="text-lg font-bold text-[#0F172A] inline-flex items-center gap-1"><Eye size={15} /> {performance.estimatedViews}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Range: {performance.estimatedViewRange.min} - {performance.estimatedViewRange.max}</p>
                </div>
                <div className="rounded-xl border border-[#DAE8F8] p-3 bg-white shadow-sm">
                  <p className="text-xs text-slate-500">Applicants</p>
                  <p className="text-lg font-bold text-[#0F172A]">{performance.applicants}</p>
                </div>
                <div className="rounded-xl border border-[#DAE8F8] p-3 bg-white shadow-sm">
                  <p className="text-xs text-slate-500">Passed</p>
                  <p className="text-lg font-bold text-emerald-600">{performance.passed}</p>
                </div>
                <div className="rounded-xl border border-[#DAE8F8] p-3 bg-white shadow-sm">
                  <p className="text-xs text-slate-500">Failed</p>
                  <p className="text-lg font-bold text-red-600">{performance.failed}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl border border-[#DAE8F8] p-3 bg-white shadow-sm">
                  <p className="text-xs text-slate-500">Pass Rate</p>
                  <p className="text-lg font-bold text-[#0F172A]">{performance.passRate}%</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#1F7FB2] transition-all duration-500"
                      style={{ width: `${Math.min(performance.passRate, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-[#DAE8F8] p-3 bg-white shadow-sm">
                  <p className="text-xs text-slate-500">Job Health Score</p>
                  <p className="text-lg font-bold text-[#0F172A]">{performance.healthScore}/100</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        performance.healthLevel === "HIGH"
                          ? "bg-emerald-500"
                          : performance.healthLevel === "MEDIUM"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(performance.healthScore, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#DAE8F8] p-3 bg-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Insights</p>
                <ul className="space-y-1">
                  {performance.insights.map((insight, idx) => (
                    <li key={insight} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${idx === 0 ? "bg-[#0F75A8]" : "bg-slate-400"}`} />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── HEADER CARD ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden mb-6">
        <div className={`h-1.5 w-full ${exp ? "bg-gradient-to-r from-red-300 to-red-400" : "bg-gradient-to-r from-[#3AB6D9] to-[#1F7FB2]"}`} />
        <div className="p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${exp ? "bg-slate-100" : "bg-[#EFF6FF]"}`}>
              {ROLE_ICON[job.role] ?? "💼"}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${exp ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                  {exp ? "Expired" : "Active"}
                </span>
                <span className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-lg ${TYPE_STYLE[job.type]}`}>
                  <Briefcase size={13} />{job.type.replace("_", " ")}
                </span>
                <span className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-lg ${LEVEL_STYLE[job.level]}`}>
                  <Clock size={13} />{job.level}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium shrink-0">Posted {fmtDate(job.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* ── LEFT COLUMN (2/3): content sections ── */}
        <div className="col-span-2 flex flex-col gap-6">

          <Section icon={<FileText size={18} />} title="Description">
            <TextBlock text={job.description} />
          </Section>

          <Section icon={<ListChecks size={18} />} title="Responsibilities">
            <TextBlock text={job.responsibilities} />
          </Section>

          <Section icon={<CheckCircle2 size={18} />} title="Requirements">
            <TextBlock text={job.requirements} />
          </Section>

          {job.benefits && (
            <Section icon={<Gift size={18} />} title="Benefits">
              <TextBlock text={job.benefits} />
            </Section>
          )}
        </div>

        {/* ── RIGHT COLUMN (1/3): quick info ── */}
        <div className="flex flex-col gap-4">

          {/* Quick info card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Job Info</h3>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#1F7FB2] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 font-medium">Location</p>
                <p className="text-sm font-semibold text-[#0F172A]">{job.location}</p>
              </div>
            </div>

            {job.salary && (
              <div className="flex items-start gap-3">
                <DollarSign size={16} className="text-[#1F7FB2] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Salary</p>
                  <p className="text-sm font-semibold text-[#0F172A]">{job.salary}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar size={16} className={`mt-0.5 shrink-0 ${exp ? "text-red-400" : "text-[#1F7FB2]"}`} />
              <div>
                <p className="text-xs text-slate-400 font-medium">Deadline</p>
                <p className={`text-sm font-semibold ${exp ? "text-red-500" : "text-[#0F172A]"}`}>
                  {job.deadline ? fmtDate(job.deadline) : "No deadline"}
                </p>
              </div>
            </div>

            {job.slots && (
              <div className="flex items-start gap-3">
                <Users size={16} className="text-[#1F7FB2] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Openings</p>
                  <p className="text-sm font-semibold text-[#0F172A]">{job.slots} position{job.slots > 1 ? "s" : ""}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={15} className="text-[#1F7FB2]" />
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.tags.split(",").map((tag) => (
                <span key={tag} className="bg-[#F4F7FB] text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E2E8F0]">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
