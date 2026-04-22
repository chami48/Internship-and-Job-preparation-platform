"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import CandidateTable from "../components/CandidateTable";
import SearchFilterBar from "../components/SearchFilterBar";
import { Users, CheckCircle2, XCircle, BarChart2, Briefcase, ChevronRight } from "lucide-react";

function FilteredCandidatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramJobId = searchParams.get("jobId") ?? "";
  const [jobId, setJobId] = useState(paramJobId);

  useEffect(() => {
    if (!paramJobId) {
      try {
        const saved = localStorage.getItem("ai_last_job_id") ?? "";
        if (saved) setJobId(saved);
      } catch (_) { /* ignore */ }
    } else {
      setJobId(paramJobId);
      try { localStorage.setItem("ai_last_job_id", paramJobId); } catch (_) { /* ignore */ }
    }
  }, [paramJobId]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PASS" | "FAIL">("ALL");
  const [minScore, setMinScore] = useState("");

  const { data: jobsData, isLoading: jobsLoading } = api.ai.getJobs.useQuery();

  const { data, isLoading, error } = api.ai.getFilteredCandidates.useQuery(
    {
      jobId,
      statusFilter,
      minScore: minScore ? Number(minScore) : undefined,
      search: search || undefined,
    },
    { enabled: !!jobId },
  );

  // Job selector screen — shown when no jobId is set
  if (!jobId) {
    return (
      <div className="p-12">
        {/* Section tag */}
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F7FB2]/20 bg-[#1F7FB2]/5 text-xs font-black uppercase tracking-widest text-[#1F7FB2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F7FB2] animate-pulse" />
            Recruiter View
          </span>
        </div>

        {/* Header */}
        <div
          className="rounded-5xl p-10 text-white mb-8 relative overflow-hidden"
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
            <h1 className="text-4xl font-black tracking-tight leading-none mb-2">Filtered Candidates</h1>
            <p className="text-white/40 text-sm font-medium mt-1">Select a job role to view evaluated candidates</p>
          </div>
        </div>

        {/* Job list */}
        <div className="bg-white border border-[#E2E8F0] rounded-4xl p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-[#64748B] mb-5">
            Select a Job Role
          </p>
          {jobsLoading ? (
            <div className="flex justify-center items-center py-12 gap-3 text-[#64748B] text-sm font-semibold">
              <svg className="animate-spin w-5 h-5 text-[#1F7FB2]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading jobs…
            </div>
          ) : !jobsData || jobsData.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase size={32} className="text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-sm font-bold text-[#64748B]">No jobs found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {jobsData.map((job) => (
                <button
                  key={job.id}
                  onClick={() => {
                    setJobId(job.id);
                    try { localStorage.setItem("ai_last_job_id", job.id); } catch (_) { /* ignore */ }
                    router.push(`/ai/filtered-candidates?jobId=${job.id}`);
                  }}
                  className="w-full flex items-center justify-between px-6 py-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:border-[#1F7FB2]/30 hover:shadow-md transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#1F7FB2]/20 flex items-center justify-center">
                      <Briefcase size={16} className="text-[#1F7FB2]" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#0F172A]">{job.title}</p>
                      <p className="text-xs text-[#94A3B8] font-medium mt-0.5 uppercase tracking-wider">
                        {job.type?.replace("_", " ")} · {job.level}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#94A3B8] group-hover:text-[#1F7FB2] transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const selectedJob = jobsData?.find((j) => j.id === jobId);
  const candidates = data ?? [];
  const passCount = candidates.filter((c) => c.status === "PASS").length;
  const failCount = candidates.filter((c) => c.status === "FAIL").length;
  const avgPct =
    candidates.length > 0
      ? candidates.reduce((s, c) => s + c.percentage, 0) / candidates.length
      : 0;

  const stats = [
    { label: "Total Evaluated", value: candidates.length,       icon: <Users size={22} />,        accent: "#1F7FB2" },
    { label: "Passed",          value: passCount,               icon: <CheckCircle2 size={22} />, accent: "#22C55E" },
    { label: "Failed",          value: failCount,               icon: <XCircle size={22} />,      accent: "#EF4444" },
    { label: "Avg Score",       value: `${avgPct.toFixed(1)}%`, icon: <BarChart2 size={22} />,    accent: "#8B5CF6" },
  ];

  return (
    <div className="p-12">

      {/* Back links */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/company/dashboard"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#64748B] hover:text-[#1F7FB2] transition-colors duration-200 no-underline"
        >
          ← Company Dashboard
        </Link>
        <span className="text-[#CBD5E1] text-xs">|</span>
        <button
          onClick={() => {
            setJobId("");
            try { localStorage.removeItem("ai_last_job_id"); } catch { /* ignore */ }
            router.push("/ai/filtered-candidates");
          }}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#64748B] hover:text-[#1F7FB2] transition-colors duration-200"
        >
          <Briefcase size={12} />
          Change Job
        </button>
      </div>

      {/* Section tag */}
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F7FB2]/20 bg-[#1F7FB2]/5 text-xs font-black uppercase tracking-widest text-[#1F7FB2]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F7FB2] animate-pulse" />
          Recruiter View — AI Filtered
        </span>
      </div>

      {/* Header */}
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
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight leading-none mb-2">
            Filtered Candidates
          </h1>
          <p className="text-white/40 text-sm font-medium mt-1">
            {selectedJob != null ? (
              <>
                Evaluated applicants for{" "}
                <span className="text-white/70 font-bold">{selectedJob.title}</span>
              </>
            ) : (
              "AI-evaluated applicants for this job role"
            )}
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[#E2E8F0] rounded-4xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-black uppercase tracking-widest text-[#64748B]">
                {s.label}
              </span>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `${s.accent}15`, border: `1px solid ${s.accent}30`, color: s.accent }}
              >
                {s.icon}
              </div>
            </div>
            <div className="text-4xl font-black text-[#0F172A] leading-none" style={{ color: s.accent }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5">
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          minScore={minScore}
          onMinScoreChange={setMinScore}
          totalCount={candidates.length}
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-50 gap-3 text-[#64748B] text-sm font-semibold">
          <svg className="animate-spin w-5 h-5 text-[#1F7FB2]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading candidates…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-4xl p-8 text-[#B91C1C] font-bold text-sm">
          ⚠️ {error.message}
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <CandidateTable candidates={candidates} jobId={jobId} />
      )}
    </div>
  );
}

export default function FilteredCandidatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen text-sm text-[#64748B] font-semibold">
          Loading…
        </div>
      }
    >
      <FilteredCandidatesContent />
    </Suspense>
  );
}
