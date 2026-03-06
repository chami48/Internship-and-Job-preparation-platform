"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin, Clock, Users, Calendar, Pencil, Trash2, Search, ChevronRight } from "lucide-react";
import { api } from "~/trpc/react";

// Role → icon emoji mapping for visual variety
const ROLE_ICON: Record<string, string> = {
  SOFTWARE_ENGINEER: "💻",
  UX_ENGINEER: "🎨",
  PROJECT_MANAGER: "📋",
};

// Level accent colors (within the existing palette)
const LEVEL_STYLE: Record<string, string> = {
  JUNIOR: "bg-[#EFF6FF] text-[#1D4ED8]",
  MID:    "bg-[#F0FDF4] text-[#15803D]",
  SENIOR: "bg-[#FFF7ED] text-[#C2410C]",
};

const TYPE_STYLE: Record<string, string> = {
  FULL_TIME:   "bg-[#EFF6FF] text-[#1F7FB2]",
  INTERNSHIP:  "bg-[#F5F3FF] text-[#7C3AED]",
};

function isExpired(deadline: Date | null) {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function daysLeft(deadline: Date | null): string | null {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (diff < 0) return null;
  if (diff === 0) return "Closes today";
  return `${diff}d left`;
}

function fmtDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default function MyJobsPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterLevel, setFilterLevel] = useState("ALL");

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);

  const { data: jobs = [], isLoading } = api.job.listByCompany.useQuery(
    { companyId: companyId ?? "" },
    { enabled: !!companyId },
  );

  const active     = jobs.filter((j) => !isExpired(j.deadline)).length;
  const expired    = jobs.filter((j) => isExpired(j.deadline)).length;
  const noDeadline = jobs.filter((j) => !j.deadline).length;

  const filtered = jobs.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType  === "ALL" || job.type  === filterType;
    const matchLevel  = filterLevel === "ALL" || job.level === filterLevel;
    return matchSearch && matchType && matchLevel;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-base font-medium">
        Loading your job posts…
      </div>
    );
  }

  return (
    <div className="px-8 py-8">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">My Job Posts</h1>
          <p className="text-base text-slate-400 mt-0.5 font-medium">{jobs.length} listing{jobs.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* ── CONTROLS ROW ── */}
      <div className="flex gap-3 mb-7 items-stretch">

        {/* Search + Filters */}
        <div className="flex gap-2.5 items-stretch flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search job title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full pl-9 pr-4 border border-[#E2E8F0] rounded-xl text-base outline-none bg-white focus:ring-2 focus:ring-[#3AB6D9]/40 focus:border-[#3AB6D9] transition"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-[#E2E8F0] rounded-xl px-3 h-full text-base outline-none bg-white focus:ring-2 focus:ring-[#3AB6D9]/40 text-slate-600 font-medium shrink-0"
          >
            <option value="ALL">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="border border-[#E2E8F0] rounded-xl px-3 h-full text-base outline-none bg-white focus:ring-2 focus:ring-[#3AB6D9]/40 text-slate-600 font-medium shrink-0"
          >
            <option value="ALL">All Levels</option>
            <option value="JUNIOR">Junior</option>
            <option value="MID">Mid</option>
            <option value="SENIOR">Senior</option>
          </select>
        </div>

        {/* Summary pills */}
        <div className="flex gap-2.5 shrink-0">
          {[
            { label: "Active",      value: active,     bg: "bg-green-50",  border: "border-green-200", text: "text-green-700",  num: "text-green-600",  dot: "bg-green-400" },
            { label: "Expired",     value: expired,    bg: "bg-red-50",    border: "border-red-200",   text: "text-red-600",    num: "text-red-500",    dot: "bg-red-400" },
            { label: "No Deadline", value: noDeadline, bg: "bg-blue-50",   border: "border-blue-200",  text: "text-blue-700",   num: "text-blue-600",   dot: "bg-blue-400" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl px-4 py-2.5 flex items-center gap-3 min-w-[110px]`}>
              <span className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
              <div>
                <div className={`text-sm font-semibold ${s.text}`}>{s.label}</div>
                <div className={`text-xl font-black leading-none mt-0.5 ${s.num}`}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── JOB CARDS ── */}
      {filtered.length === 0 ? (
        <div className="col-span-2 flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-semibold">No job posts found.</p>
          <p className="text-base mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          {filtered.map((job) => {
            const exp  = isExpired(job.deadline);
            const left = daysLeft(job.deadline);

            return (
              <div
                key={job.id}
                onClick={() => router.push(`/company/my-jobs/${job.id}`)}
                className="group bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#3AB6D9]/40 transition-all duration-200 cursor-pointer flex flex-col"
              >
                {/* Top accent bar */}
                <div className={`h-1 w-full ${exp ? "bg-gradient-to-r from-red-300 to-red-400" : "bg-gradient-to-r from-[#3AB6D9] to-[#1F7FB2]"}`} />

                <div className="p-6 flex flex-col flex-1">

                  {/* Title row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${exp ? "bg-slate-100" : "bg-[#EFF6FF]"}`}>
                        {ROLE_ICON[job.role] ?? "💼"}
                      </div>
                      <div>
                        <h2 className="text-[17px] font-bold text-[#0F172A] leading-tight">{job.title}</h2>
                        <p className="text-sm text-slate-400 font-medium mt-0.5">Posted {fmtDate(job.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${exp ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                      {exp ? "Expired" : "Active"}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="flex items-center gap-1 text-sm text-slate-500 bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#F1F5F9]">
                      <MapPin size={13} className="text-slate-400" />{job.location}
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-lg ${TYPE_STYLE[job.type]}`}>
                      <Briefcase size={13} />{job.type.replace("_", " ")}
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-lg ${LEVEL_STYLE[job.level]}`}>
                      <Clock size={13} />{job.level}
                    </span>
                    {job.slots && (
                      <span className="flex items-center gap-1 text-sm text-slate-500 bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#F1F5F9]">
                        <Users size={13} className="text-slate-400" />{job.slots} opening{job.slots > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.tags.split(",").map((tag) => (
                      <span key={tag} className="bg-[#F4F7FB] text-slate-500 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {job.deadline ? (
                        <span className={`flex items-center gap-1 text-sm font-semibold ${exp ? "text-red-500" : "text-slate-500"}`}>
                          <Calendar size={13} />
                          {exp ? `Closed ${fmtDate(job.deadline)}` : left ?? `Closes ${fmtDate(job.deadline)}`}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 font-medium">No deadline</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/company/my-jobs/${job.id}/edit`); }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-[#1F7FB2] border border-[#1F7FB2]/30 rounded-lg hover:bg-[#EFF8FF] transition-colors"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/company/my-jobs/${job.id}`); }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-white bg-[#1F7FB2] rounded-lg hover:bg-[#1a6f9e] transition-colors"
                      >
                        View <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
