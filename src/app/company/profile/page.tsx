"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Pencil, Check, X, Building2, Mail, CalendarDays,
  Briefcase, ShieldCheck, FileText, MapPin, Users, Plus,
  ExternalLink, LayoutGrid, Settings,
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

type Tab = "overview" | "jobs" | "settings";

export default function CompanyProfilePage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [editMode, setEditMode] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftDesc, setDraftDesc] = useState("");
  const [saveError, setSaveError] = useState("");

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
    if (company) { setDraftName(company.name); setDraftDesc(company.description ?? ""); }
  }, [company]);

  const handleSave = async () => {
    setSaveError("");
    if (!draftName.trim()) { setSaveError("Company name is required."); return; }
    try {
      await updateProfile.mutateAsync({ companyId: companyId!, name: draftName.trim(), description: draftDesc.trim() || undefined });
      await refetch();
      setEditMode(false);
    } catch (e: unknown) { setSaveError(e instanceof Error ? e.message : "Save failed."); }
  };

  const handleCancel = () => {
    if (company) { setDraftName(company.name); setDraftDesc(company.description ?? ""); }
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
  const initStr = initials(company.name);

  /* ── tab classes ── */
  const tabCls = (t: Tab) =>
    `px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
      tab === t
        ? "bg-[#1F7FB2] text-white shadow-sm"
        : "text-[#64748B] hover:bg-[#F4F7FB] hover:text-[#0F172A]"
    }`;

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-[#0F172A]">

      {/* ── sticky top bar ──────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E2E8F0] bg-white/90 px-8 py-3.5 backdrop-blur-md shadow-sm">
        <button onClick={() => router.push("/company/dashboard")}
          className="flex items-center gap-2 text-sm font-bold text-[#64748B] transition-colors hover:text-[#0F172A]">
          <ArrowLeft size={15} /> Back to Dashboard
        </button>
        <span className="text-sm font-extrabold tracking-tight text-[#0F172A]">Company Profile</span>
        {!editMode ? (
          <button onClick={() => { setTab("settings"); setEditMode(true); }}
            className="flex items-center gap-2 rounded-xl bg-[#1F7FB2] px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1668A0]">
            <Pencil size={13} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel}
              className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-bold text-[#64748B] hover:bg-[#F4F7FB] transition-colors">
              <X size={13} /> Cancel
            </button>
            <button onClick={handleSave} disabled={updateProfile.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-60 transition-all">
              <Check size={13} />
              {updateProfile.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </header>

      {/* ── hero cover ──────────────────────────────────────── */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#0C2340] to-[#0F172A]">
        {/* dot grid */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(14,165,233,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* glow */}
        <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full opacity-30" style={{ background: "radial-gradient(ellipse, rgba(14,165,233,0.4) 0%, transparent 70%)", filter: "blur(40px)" }} />
        {/* accent bar */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#818CF8]" />
      </div>

      {/* ── profile identity strip ──────────────────────────── */}
      <div className="relative mx-auto max-w-5xl px-8">
        {/* avatar — overlaps cover */}
        <div className="absolute -top-12 left-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#1F7FB2] text-3xl font-extrabold text-white shadow-xl ring-4 ring-white">
          {initStr}
        </div>

        <div className="ml-32 flex items-end justify-between pt-3 pb-5 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">{company.name}</h1>
              {company.isVerified && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                  <ShieldCheck size={10} /> Verified
                </span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5"><Mail size={12} />{company.email}</span>
              <span className="flex items-center gap-1.5"><CalendarDays size={12} />Joined {fmtDate(company.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Briefcase size={12} />{company._count.jobs} job{company._count.jobs !== 1 ? "s" : ""} posted</span>
            </div>
          </div>
          <button onClick={() => router.push("/company/create-job")}
            className="flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#0284C7] hover:shadow-md">
            <Plus size={14} /> Post a Job
          </button>
        </div>
      </div>

      {/* ── tab bar ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-8 pt-5">
        <div className="mb-8 flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-sm w-fit">
          <button className={tabCls("overview")} onClick={() => setTab("overview")}>
            <span className="flex items-center gap-1.5"><LayoutGrid size={13} />Overview</span>
          </button>
          <button className={tabCls("jobs")} onClick={() => setTab("jobs")}>
            <span className="flex items-center gap-1.5"><Briefcase size={13} />Job Posts{jobs ? ` (${jobs.length})` : ""}</span>
          </button>
          <button className={tabCls("settings")} onClick={() => setTab("settings")}>
            <span className="flex items-center gap-1.5"><Settings size={13} />Settings</span>
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
          <div className="grid grid-cols-3 gap-6">
            {/* left col */}
            <div className="col-span-2 flex flex-col gap-6">

              {/* About */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <FileText size={15} className="text-[#1F7FB2]" />
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">About</h3>
                </div>
                {company.description
                  ? <p className="text-sm leading-relaxed text-[#475569]">{company.description}</p>
                  : <p className="text-sm italic text-[#CBD5E1]">No description yet. Go to Settings to add one.</p>}
              </div>

              {/* Recent jobs preview */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase size={15} className="text-[#1F7FB2]" />
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">Recent Job Posts</h3>
                  </div>
                  <button onClick={() => setTab("jobs")} className="text-xs font-bold text-[#1F7FB2] hover:underline flex items-center gap-1">
                    View all <ExternalLink size={11} />
                  </button>
                </div>
                {(jobs ?? []).length === 0 ? (
                  <p className="text-sm italic text-[#CBD5E1]">No jobs posted yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {(jobs ?? []).slice(0, 3).map((j) => {
                      const dl = daysLeft(j.deadline);
                      const closed = dl === "Closed";
                      return (
                        <div key={j.id}
                          onClick={() => router.push(`/company/my-jobs/${j.id}`)}
                          className="flex cursor-pointer items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-3 transition-all hover:border-[#1F7FB2]/40 hover:bg-[#EFF6FF]">
                          <div>
                            <p className="text-sm font-bold text-[#0F172A]">{j.title}</p>
                            <p className="text-xs text-[#94A3B8]">{j.location} · {j.type?.replace("_", " ")}</p>
                          </div>
                          {dl && (
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${closed ? "bg-red-50 text-red-500" : "bg-[#E0F2FE] text-[#0369A1]"}`}>
                              {dl}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* right col */}
            <div className="flex flex-col gap-4">
              {/* stats */}
              {[
                { icon: <Briefcase size={15} />, label: "Total Posts", value: company._count.jobs },
                { icon: <Users size={15} />, label: "Active Listings", value: activeJobs.length },
                { icon: <CalendarDays size={15} />, label: "Member Since", value: fmtDate(company.createdAt) },
                { icon: <Building2 size={15} />, label: "Account Status", value: company.isVerified ? "✓ Verified" : "Unverified" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3.5 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0369A1]">{icon}</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">{label}</p>
                    <p className="text-sm font-bold text-[#0F172A]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ JOBS TAB ════════ */}
        {tab === "jobs" && (
          <div className="flex flex-col gap-4">
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
                  className="flex cursor-pointer items-start justify-between rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 shadow-sm transition-all hover:border-[#1F7FB2]/40 hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${isIntern ? "bg-[#EEF2FF]" : "bg-[#E0F2FE]"}`}>
                      {isIntern ? "🎓" : "💼"}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">{j.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                        <span className="flex items-center gap-1"><MapPin size={11} />{j.location}</span>
                        <span className="flex items-center gap-1"><Briefcase size={11} />{j.type?.replace("_", " ")}</span>
                        {j.salary && <span>💰 {j.salary}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {dl && (
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${closed ? "bg-red-50 text-red-500" : "bg-[#E0F2FE] text-[#0369A1]"}`}>
                        {dl}
                      </span>
                    )}
                    <span className="text-[10px] text-[#CBD5E1]">Click to view →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════════ SETTINGS TAB ════════ */}
        {tab === "settings" && (
          <div className="max-w-2xl flex flex-col gap-6">

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">Company Details</h3>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#64748B]">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  {editMode ? (
                    <input
                      className="w-full rounded-xl border-2 border-[#0EA5E9] bg-[#F0F9FF] px-4 py-2.5 text-sm font-semibold text-[#0F172A] outline-none focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] transition-shadow"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      placeholder="Company Name"
                    />
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-2.5 text-sm font-semibold text-[#0F172A]">
                      {company.name}
                      <button onClick={() => setEditMode(true)} className="text-[#1F7FB2] hover:text-[#0EA5E9]"><Pencil size={13} /></button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#64748B]">
                    Work Email
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-2.5 text-sm text-[#94A3B8]">
                    <Mail size={13} />{company.email}
                    <span className="ml-auto text-[10px] font-bold text-[#94A3B8]">Cannot be changed</span>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#64748B]">
                    Description
                  </label>
                  {editMode ? (
                    <textarea
                      className="w-full resize-none rounded-xl border-2 border-[#0EA5E9] bg-[#F0F9FF] px-4 py-3 text-sm text-[#0F172A] outline-none focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] transition-shadow"
                      rows={5}
                      value={draftDesc}
                      onChange={(e) => setDraftDesc(e.target.value)}
                      placeholder="Tell candidates what makes your company great…"
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-3 text-sm text-[#475569]">
                      <span>{company.description ?? <span className="italic text-[#CBD5E1]">No description yet.</span>}</span>
                      <button onClick={() => setEditMode(true)} className="mt-0.5 shrink-0 text-[#1F7FB2] hover:text-[#0EA5E9]"><Pencil size={13} /></button>
                    </div>
                  )}
                </div>

                {editMode && (
                  <div className="flex gap-3 pt-2">
                    <button onClick={handleCancel}
                      className="flex-1 rounded-xl border border-[#E2E8F0] py-2.5 text-sm font-bold text-[#64748B] hover:bg-[#F4F7FB] transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={updateProfile.isPending}
                      className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-60 transition-colors">
                      {updateProfile.isPending ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* account info */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">Account Info</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] font-medium">Verification Status</span>
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${company.isVerified ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
                    {company.isVerified ? <><ShieldCheck size={10} /> Verified</> : "⚠ Not Verified"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] font-medium">Member Since</span>
                  <span className="font-bold text-[#0F172A]">{fmtDate(company.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] font-medium">Total Jobs Posted</span>
                  <span className="font-bold text-[#0F172A]">{company._count.jobs}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        <div className="pb-16" />
      </div>
    </div>
  );
}