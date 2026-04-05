"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, Briefcase, Clock, Users, Calendar,
  DollarSign, Tag, CheckCircle2, ListChecks, Gift, FileText, Pencil,
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

  const { data: job, isLoading, isError } = api.job.byId.useQuery({ id: jobId });

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
