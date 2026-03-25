"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Pencil, Check, X, Building2, Mail, CalendarDays,
  Briefcase, ShieldCheck, FileText, MapPin, Users, Plus, Phone,
  ExternalLink, LayoutGrid, Settings, ChevronRight, Bell, LogOut, ChevronLeft, Star
} from "lucide-react";
import { api } from "~/trpc/react";

/* ─── helpers ───────────────────────────────────────────── */
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
function daysLeft(deadline: Date | null | string | undefined) {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (diff < 0) return "Closed";
  if (diff === 0) return "Today";
  return `${diff}d left`;
}

const HOLIDAYS: Record<string, string> = {
  "2026-01-01": "New Year's Day",
  "2026-04-14": "New Year Festival",
  "2026-05-01": "Labour Day",
};

type Tab = "overview" | "jobs" | "settings";

export default function CompanyProfilePage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [editMode, setEditMode] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftDesc, setDraftDesc] = useState("");
  // @ts-ignore
  const [draftLogo, setDraftLogo] = useState("");
  const [saveError, setSaveError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const handleLogout = () => router.push('/company/comlogin');

  useEffect(() => { setCompanyId(localStorage.getItem("companyId")); }, []);

  const { data: company, isLoading, refetch } = api.company.getProfile.useQuery(
    { companyId: companyId ?? "" },
    { enabled: !!companyId },
  );
  const { data: jobs } = api.job.listByCompany.useQuery(
    { companyId: companyId ?? "" },
    { enabled: !!companyId },
  );
  const updateProfile = api.company.updateProfile.useMutation();

  useEffect(() => {
    if (company) {
      setDraftName(company.name);
      setDraftDesc(company.description ?? "");
      // @ts-ignore
      setDraftLogo(company.logo ?? "");
    }
  }, [company]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const handleSave = async () => {
    setSaveError("");
    if (!draftName.trim()) { setSaveError("Company name is required."); return; }
    try {
      await updateProfile.mutateAsync({
        companyId: companyId!,
        name: draftName.trim(),
        description: draftDesc.trim() || undefined,
        logo: draftLogo.trim() || undefined
      });
      await refetch();
      setEditMode(false);
    } catch (e: unknown) { setSaveError(e instanceof Error ? e.message : "Save failed."); }
  };

  const handleCancel = () => {
    if (company) {
      setDraftName(company.name);
      setDraftDesc(company.description ?? "");
      // @ts-ignore
      setDraftLogo(company.logo ?? "");
    }
    setSaveError(""); setEditMode(false);
  };

  if (isLoading || !company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2E8F0] border-t-[#1F7FB2]" />
          <p className="text-sm font-semibold text-[#94A3B8]">Loading profile…</p>
        </div>
      </div>
    );
  }

  const activeJobs = (jobs ?? []).filter(j => !j.deadline || new Date(j.deadline) >= new Date());
  const companyName = company.name || "IFS";
  const initStr = initials(company.name);

  const buildCalendar = (anchor: Date) => {
    const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    const weeks: Date[][] = [];
    const ptr = new Date(start);
    for (let w = 0; w < 6; w++) {
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(new Date(ptr));
        ptr.setDate(ptr.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  };

  const weeks = buildCalendar(calendarMonth);
  const monthLabel = calendarMonth.toLocaleString(undefined, { month: "long", year: "numeric" });
  const today = new Date();
  const isWeekend = (day: Date) => day.getDay() === 0 || day.getDay() === 6;

  /* ── tab classes ── */
  const tabCls = (t: Tab) =>
    `px-5 py-2.5 text-sm font-bold rounded-xl transition-all shadow-sm ${
      tab === t
        ? "bg-gradient-to-r from-[#0F75A8] via-[#0EA5E9] to-[#6366F1] text-white shadow-md shadow-[#0EA5E9]/30"
        : "text-[#64748B] hover:bg-white/80 hover:text-[#0F172A] hover:shadow"
    }`;

  return (
    <div className="min-h-screen font-sans text-[#0F172A] bg-gradient-to-b from-[#ECF4FF] via-[#F8FBFF] to-[#E9F0FF] [background:radial-gradient(circle_at_20%_20%,#D9F1FF_0,transparent_38%),radial-gradient(circle_at_80%_0,#FFE6F4_0,transparent_38%),radial-gradient(circle_at_80%_80%,#E7E9FF_0,transparent_34%)]">

      {/* Navbar */}
      <header className="h-16 sm:h-20 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-12 bg-white/85 backdrop-blur border-b border-white/70 shadow-md shadow-[#0EA5E9]/10">
        <div className="flex items-center gap-3 mr-4">
          <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-white font-bold text-sm">
            HS
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#3AB6D9]"></div>
          </div>
          <span className="text-lg font-bold text-[#0F172A] tracking-tight">HireSmart</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#0F75A8]/30 bg-white text-[#0F75A8] shadow-sm transition-all hover:shadow-md hover:-translate-y-[1px]">
            <Bell size={18} className="sm:w-[22px] sm:h-[22px]" />
          </button>
          <div className="hidden md:flex items-center gap-2 text-right leading-tight border-l border-[#E2E8F0] pl-3 sm:pl-4">
            <span className="text-sm font-semibold text-[#475569]">Welcome</span>
            <span className="text-sm font-bold text-[#0F172A] truncate max-w-[140px]">{companyName}</span>
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="w-9 h-9 sm:w-11 sm:h-11 bg-slate-200 rounded-xl lg:rounded-2xl overflow-hidden hover:ring-2 ring-[#1F7FB2] transition-all shadow-sm"
              >
                <img src="/logos/company-logo-jpg.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white/95 backdrop-blur shadow-xl shadow-[#0EA5E9]/20 p-2">
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 🔥 NEW HERO WITH BANNER */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src="/logos/com-banner3.jpeg"
          alt="Company Banner"
          className="absolute w-full h-full object-cover"
        />

        {/* overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />

        {/* bottom accent line */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#818CF8]" />
      </div>

      {/* ── ORIGINAL profile identity strip ── */}
      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <div className="absolute -top-12 left-8 flex h-24 w-24 overflow-hidden items-center justify-center rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#1F7FB2] text-3xl font-extrabold text-white shadow-xl ring-4 ring-white bg-white">
          {/* @ts-ignore */}
          {company.logo ? (
            <img src={(company as any).logo} alt="Company Logo" className="h-full w-full object-cover" />
          ) : (
            initStr
          )}
        </div>

        <div className="ml-32 flex items-end justify-between pt-3 pb-5 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#0F172A] to-[#0F75A8] bg-clip-text text-transparent">
                {company.name}
              </h1>
              {company.isVerified && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                  <ShieldCheck size={10} /> Verified
                </span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-5 text-sm text-[#475569]">
              <span className="flex items-center gap-1.5 text-[#0F75A8] font-semibold">
                <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                4.8 · 128 reviews
              </span>
              <span className="flex items-center gap-2"><Mail size={14} />{company.email}</span>
              <span className="flex items-center gap-2"><CalendarDays size={14} />Joined {fmtDate(company.createdAt)}</span>
              <span className="flex items-center gap-2"><Briefcase size={14} />{company._count.jobs} job{company._count.jobs !== 1 ? "s" : ""} posted</span>
            </div>
          </div>
          <div className="flex items-center gap-3 relative">
            <div className="relative" onMouseLeave={() => setCalendarOpen(false)}>
              <button
                type="button"
                onClick={() => setCalendarOpen((v) => !v)}
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-[#0F75A8]/40 bg-white text-[#0F75A8] shadow-sm transition-all hover:shadow-md hover:-translate-y-[1px]"
              >
                <CalendarDays size={18} />
              </button>
              {calendarOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/80 p-3 z-20 bg-[radial-gradient(circle_at_20%_20%,#E0F2FF,transparent_35%),radial-gradient(circle_at_80%_0,#FEF3C7,transparent_30%),radial-gradient(circle_at_50%_80%,#E0F7F4,transparent_25%)]">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                      className="p-1 rounded-lg hover:bg-slate-100"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-semibold text-[#0F172A]">{monthLabel}</span>
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                      className="p-1 rounded-lg hover:bg-slate-100"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                      <div key={d} className="text-center py-1 first:text-rose-500 last:text-rose-500">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm">
                    {weeks.flat().map((day) => {
                      const key = day.toISOString().slice(0, 10);
                      const inMonth = day.getMonth() === calendarMonth.getMonth();
                      const isToday = day.toDateString() === today.toDateString();
                      const holidayLabel = HOLIDAYS[key];
                      const isSelected = selectedDay && day.toDateString() === selectedDay.toDateString();
                      return (
                        <button
                          type="button"
                          key={day.toISOString()}
                          onClick={() => setSelectedDay(new Date(day))}
                          className={`h-10 rounded-lg border flex items-center justify-center relative transition text-xs font-semibold ${
                            isSelected
                              ? "bg-[#0F75A8] text-white border-[#0F75A8] shadow"
                              : holidayLabel
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : inMonth
                                  ? "bg-white text-slate-700"
                                  : "bg-slate-50 text-slate-400"
                          } ${isToday && !isSelected ? "ring-1 ring-[#0F75A8] border-[#0F75A8]/60" : ""} ${isWeekend(day) && !isSelected && !holidayLabel ? "text-rose-500" : ""}`}
                        >
                          <span>{day.getDate()}</span>
                          {holidayLabel && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute bottom-1"></span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    {selectedDay ? selectedDay.toDateString() : "Select a date"}
                    {selectedDay && HOLIDAYS[selectedDay.toISOString().slice(0, 10)] && (
                      <div className="text-emerald-600 font-semibold">
                        {HOLIDAYS[selectedDay.toISOString().slice(0, 10)]}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => router.push("/company/create-job")}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0F75A8] via-[#0EA5E9] to-[#6366F1] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0EA5E9]/30 transition-all hover:brightness-110">
              <Plus size={14} /> Post a Job
            </button>
          </div>
        </div>
      </div>

      {/* ── ORIGINAL tab bar ── */}
      <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-5">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/90 backdrop-blur shadow-lg shadow-[#0EA5E9]/10 p-1.5 w-fit">
            <button className={tabCls("overview")} onClick={() => setTab("overview")}>
              <span className="flex items-center gap-1.5"><LayoutGrid size={13} />Overview</span>
            </button>
            <button className={tabCls("jobs")} onClick={() => setTab("jobs")}>
              <span className="flex items-center gap-1.5"><Briefcase size={13} />Job Posts{jobs ? ` (${jobs.length})` : ""}</span>
            </button>
            <button className={tabCls("settings")} onClick={() => setTab("settings")}>
              <span className="flex items-center gap-1.5"><Settings size={13} />Edit Profile</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => router.push("/company/dashboard")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md shadow-[#0EA5E9]/10 transition-all hover:bg-white"
            aria-label="Back to dashboard"
            title="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* error banner */}
        {saveError && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            ⚠ {saveError}
          </div>
        )}

        {/* ════════ OVERVIEW TAB ════════ */}
        {tab === "overview" && (
          <div className="flex flex-col gap-5">

            {/* ── Main 2+1 grid ── */}
            <div className="grid grid-cols-3 gap-5">

              {/* Left 2-col */}
              <div className="col-span-2 flex flex-col gap-5">

                {/* About */}
                <div className="rounded-2xl bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-[#0EA5E9]/10 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9] bg-gradient-to-r from-white to-[#F0F9FF]">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full bg-[#1F7FB2] block" />
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">About</h3>
                    </div>
                    <button onClick={() => setTab("settings")}
                      className="flex items-center gap-1 text-xs font-semibold text-[#1F7FB2] hover:text-[#0284C7] transition-colors">
                      <Pencil size={11} /> Edit
                    </button>
                  </div>
                  <div className="px-6 py-5">
                    {company.description
                      ? <p className="text-sm leading-relaxed text-[#475569]">{company.description}</p>
                      : (
                        <div className="flex flex-col items-center py-5 gap-2 text-center">
                          <FileText size={24} className="text-[#CBD5E1]" />
                          <p className="text-sm text-[#94A3B8]">No description added yet.</p>
                          <button onClick={() => setTab("settings")} className="text-xs font-bold text-[#1F7FB2] hover:underline">Add one in Edit Profile →</button>
                        </div>
                      )}
                  </div>
                </div>

                {/* Recent Jobs */}
                <div className="rounded-2xl bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-[#0EA5E9]/10 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9] bg-gradient-to-r from-white to-[#F8FBFF]">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full bg-[#1F7FB2] block" />
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">Recent Job Posts</h3>
                    </div>
                    <button onClick={() => setTab("jobs")}
                      className="flex items-center gap-1 text-xs font-semibold text-[#1F7FB2] hover:text-[#0284C7] transition-colors">
                      View all <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="px-6 py-4">
                    {(jobs ?? []).length === 0 ? (
                      <div className="flex flex-col items-center py-6 gap-2 text-center">
                        <Briefcase size={24} className="text-[#CBD5E1]" />
                        <p className="text-sm text-[#94A3B8]">No jobs posted yet.</p>
                        <button onClick={() => router.push("/company/create-job")}
                          className="text-xs font-bold text-[#1F7FB2] hover:underline">Post your first job →</button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {(jobs ?? []).slice(0, 3).map((j) => {
                          const dl = daysLeft(j.deadline);
                          const closed = dl === "Closed";
                          return (
                            <div key={j.id}
                              onClick={() => router.push(`/company/my-jobs/${j.id}`)}
                              className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/70 bg-gradient-to-r from-white to-[#F4F9FF] px-4 py-3 transition-all shadow-sm hover:shadow-md hover:-translate-y-[1px] hover:border-[#1F7FB2]/40">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#0369A1] shrink-0">
                                  <Briefcase size={13} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-[#0F172A] group-hover:text-[#1F7FB2] transition-colors">{j.title}</p>
                                  <p className="text-xs text-[#94A3B8]">{j.location} · {j.type?.replace("_", " ")}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {dl && (
                                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${closed ? "bg-red-50 text-red-500" : "bg-[#DCFCE7] text-emerald-600"}`}>
                                    {dl}
                                  </span>
                                )}
                                <ChevronRight size={13} className="text-[#CBD5E1] group-hover:text-[#1F7FB2] transition-colors" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info + Culture side by side */}
                <div className="grid grid-cols-2 gap-4">

                  {/* Info */}
                  <div className="rounded-2xl bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-[#0EA5E9]/10 overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center gap-2 bg-gradient-to-r from-white to-[#F0F9FF]">
                      <span className="w-1 h-4 rounded-full bg-[#1F7FB2] block" />
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">Info</h3>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                      {[
                        { icon: <Users size={13} />, label: "Industry", value: "Technology & Software" },
                        { icon: <MapPin size={13} />, label: "Location", value: "Colombo, Sri Lanka" },
                        { icon: <ExternalLink size={13} />, label: "Website", value: "www.itech.lk" },
                      ].map(({ icon, label, value }) => (
                        <div key={label} className="flex items-center gap-2 text-sm">
                          <span className="text-[#1F7FB2] shrink-0">{icon}</span>
                          <span className="text-[#94A3B8] text-xs w-16 shrink-0">{label}:</span>
                          <span className="text-[#0F172A] text-xs font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Culture */}
                  <div className="rounded-2xl bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-[#0EA5E9]/10 overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center gap-2 bg-gradient-to-r from-white to-[#F8FBFF]">
                      <span className="w-1 h-4 rounded-full bg-[#1F7FB2] block" />
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">Culture</h3>
                    </div>
                    <div className="px-5 py-4 space-y-3 text-sm text-[#475569]">
                      {[
                        { label: "Values", value: "Innovation, Integrity, Excellence" },
                        { label: "Benefits", value: "Remote Work, Health Insurance, Training" },
                        { label: "Tech Stack", value: "React, Next.js, TypeScript, Prisma" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-start gap-2">
                          <span className="text-[#94A3B8] text-xs w-20 shrink-0">{label}:</span>
                          <span className="text-[#0F172A] text-xs font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 1-col sidebar */}
              <div className="flex flex-col gap-4">

                {/* Stat cards */}
                {[
                  { icon: <Briefcase size={15} />, label: "Total Posts", value: company._count.jobs, accent: "bg-[#E0F2FE] text-[#0369A1]" },
                  { icon: <Users size={15} />, label: "Active Listings", value: activeJobs.length, accent: "bg-[#DCFCE7] text-emerald-600" },
                  { icon: <CalendarDays size={15} />, label: "Member Since", value: fmtDate(company.createdAt), accent: "bg-[#EEF2FF] text-indigo-500" },
                  { icon: <ShieldCheck size={15} />, label: "Status", value: company.isVerified ? "Verified ✓" : "Unverified", accent: company.isVerified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600" },
                ].map(({ icon, label, value, accent }) => (
                  <div key={label} className="rounded-2xl bg-white/90 backdrop-blur border border-white/80 px-4 py-3.5 shadow-lg shadow-[#0EA5E9]/10 flex items-center gap-3">
                    <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${accent}`}>{icon}</div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">{label}</p>
                      <p className="text-sm font-extrabold text-[#0F172A] mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}

                {/* Social */}
                <div className="rounded-2xl bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-[#0EA5E9]/10 overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center gap-2 bg-gradient-to-r from-white to-[#F0F9FF]">
                    <span className="w-1 h-4 rounded-full bg-[#1F7FB2] block" />
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">Social</h3>
                  </div>
                  <div className="px-5 py-4 flex flex-col gap-2">
                    {[
                      { platform: "LinkedIn", url: "https://linkedin.com/company/hiresmart", color: "text-blue-600" },
                      { platform: "Facebook", url: "https://facebook.com/hiresmart", color: "text-blue-500" },
                      { platform: "Instagram", url: "https://instagram.com/hiresmart", color: "text-pink-600" },
                    ].map(({ platform, url, color }) => (
                      <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#1F7FB2] hover:bg-[#EFF6FF] hover:border-[#1F7FB2]/30 transition-all">
                        <span className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${color}`} /> {platform}</span>
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ════════ JOBS TAB ════════ */}
        {tab === "jobs" && (
          <div className="flex flex-col gap-3">
            {(jobs ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white py-16 text-center">
                <Briefcase size={32} className="mb-3 text-[#CBD5E1]" />
                <p className="text-sm font-bold text-[#94A3B8]">No jobs posted yet</p>
                <button onClick={() => router.push("/company/create-job")}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-[#1F7FB2] px-4 py-2 text-sm font-bold text-white hover:bg-[#1668A0] transition-colors">
                  <Plus size={14} /> Post your first job
                </button>
              </div>
            ) : (jobs ?? []).map((j) => {
              const dl = daysLeft(j.deadline);
              const closed = dl === "Closed";
              const isIntern = j.type?.toLowerCase().includes("intern");
              return (
                <div key={j.id}
                  onClick={() => router.push(`/company/my-jobs/${j.id}`)}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/80 bg-gradient-to-r from-white to-[#F4F9FF] px-6 py-5 shadow-md shadow-[#0EA5E9]/5 transition-all hover:border-[#1F7FB2]/40 hover:shadow-lg hover:-translate-y-[1px]">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${isIntern ? "bg-[#EEF2FF]" : "bg-[#E0F2FE]"}`}>
                      {isIntern ? "🎓" : "💼"}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A] group-hover:text-[#1F7FB2] transition-colors">{j.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                        <span className="flex items-center gap-1"><MapPin size={11} />{j.location}</span>
                        <span className="flex items-center gap-1"><Briefcase size={11} />{j.type?.replace("_", " ")}</span>
                        {j.salary && <span>💰 {j.salary}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {dl && (
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${closed ? "bg-red-50 text-red-500" : "bg-[#DCFCE7] text-emerald-600"}`}>
                        {dl}
                      </span>
                    )}
                    <ChevronRight size={15} className="text-[#CBD5E1] group-hover:text-[#1F7FB2] transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════════ SETTINGS TAB ════════ */}
        {tab === "settings" && (
          <div className="max-w-2xl flex flex-col gap-5">

            {/* Company Details */}
            <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#1F7FB2] block" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">Company Details</h3>
              </div>
              <div className="px-6 py-5 flex flex-col gap-5">

                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#64748B]">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  {editMode ? (
                    <input
                      className="w-full rounded-xl border-2 border-[#1F7FB2] bg-[#F0F9FF] px-4 py-2.5 text-sm font-semibold text-[#0F172A] outline-none focus:shadow-[0_0_0_3px_rgba(31,127,178,0.12)] transition-shadow"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      placeholder="Company Name"
                    />
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-2.5 text-sm font-semibold text-[#0F172A]">
                      {company.name}
                      <button onClick={() => setEditMode(true)} className="text-[#94A3B8] hover:text-[#1F7FB2] transition-colors"><Pencil size={13} /></button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Work Email</label>
                  <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-2.5 text-sm text-[#94A3B8]">
                    <Mail size={13} />{company.email}
                    <span className="ml-auto text-[10px] font-bold bg-slate-100 text-[#94A3B8] px-2 py-0.5 rounded-full">Read-only</span>
                  </div>
                </div>

                {/* Logo */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Logo Image Path</label>
                  {editMode ? (
                    <input
                      className="w-full rounded-xl border-2 border-[#1F7FB2] bg-[#F0F9FF] px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:shadow-[0_0_0_3px_rgba(31,127,178,0.12)] transition-shadow"
                      value={draftLogo}
                      onChange={(e) => setDraftLogo(e.target.value)}
                      placeholder="/logos/your-company-logo.png"
                    />
                  ) : (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-2.5 text-sm text-[#475569]">
                      <span className="truncate">
                        {/* @ts-ignore */}
                        {company.logo ? company.logo : <span className="italic text-[#CBD5E1]">No logo set.</span>}
                      </span>
                      <button onClick={() => setEditMode(true)} className="shrink-0 text-[#94A3B8] hover:text-[#1F7FB2] transition-colors"><Pencil size={13} /></button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Description</label>
                  {editMode ? (
                    <textarea
                      className="w-full resize-none rounded-xl border-2 border-[#1F7FB2] bg-[#F0F9FF] px-4 py-3 text-sm text-[#0F172A] outline-none focus:shadow-[0_0_0_3px_rgba(31,127,178,0.12)] transition-shadow"
                      rows={5}
                      value={draftDesc}
                      onChange={(e) => setDraftDesc(e.target.value)}
                      placeholder="Tell candidates what makes your company great…"
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-3 text-sm text-[#475569]">
                      <span>{company.description ?? <span className="italic text-[#CBD5E1]">No description yet.</span>}</span>
                      <button onClick={() => setEditMode(true)} className="mt-0.5 shrink-0 text-[#94A3B8] hover:text-[#1F7FB2] transition-colors"><Pencil size={13} /></button>
                    </div>
                  )}
                </div>

                {editMode && (
                  <div className="flex gap-3 pt-1">
                    <button onClick={handleCancel}
                      className="flex-1 rounded-xl border border-[#E2E8F0] py-2.5 text-sm font-bold text-[#64748B] hover:bg-[#F4F7FB] transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={updateProfile.isPending}
                      className="flex-1 rounded-xl bg-[#1F7FB2] py-2.5 text-sm font-bold text-white hover:bg-[#1668A0] disabled:opacity-60 transition-colors">
                      {updateProfile.isPending ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#1F7FB2] block" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">Account Info</h3>
              </div>
              <div className="px-6 py-1 divide-y divide-[#F1F5F9]">
                {[
                  {
                    label: "Verification Status",
                    value: (
                      <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${company.isVerified ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
                        {company.isVerified ? <><ShieldCheck size={9} /> Verified</> : "⚠ Not Verified"}
                      </span>
                    )
                  },
                  { label: "Member Since", value: <span className="font-bold text-[#0F172A]">{fmtDate(company.createdAt)}</span> },
                  { label: "Total Jobs Posted", value: <span className="font-bold text-[#0F172A]">{company._count.jobs}</span> },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3.5 text-sm">
                    <span className="text-[#64748B] font-medium">{label}</span>
                    {value}
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-100 bg-red-50/40 p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 mb-3">Danger Zone</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">Sign out of your account</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">You will be redirected to the login page.</p>
                </div>
                <button onClick={handleLogout}
                  className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pb-16" />
      </div>
    </div>
  );
}
