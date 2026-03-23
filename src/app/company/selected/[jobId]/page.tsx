"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  MapPin,
  Mail,
  Phone,
  Trophy,
  ClipboardList,
  Video,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { api } from "~/trpc/react";

interface Candidate {
  id: string;
  name: string;
  role: string;
  jobId: string;
  stage: "Offer" | "Interview" | "Assessment";
  status: "Accepted" | "Shortlisted" | "Pending";
  score: number;
  appliedAt: string;
  location: string;
  email: string;
  phone: string;
  tags: string[];
  note: string;
}

const stageStyle: Record<Candidate["stage"], string> = {
  Offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Interview: "bg-blue-50 text-blue-700 border-blue-200",
  Assessment: "bg-amber-50 text-amber-700 border-amber-200",
};

const statusStyle: Record<Candidate["status"], string> = {
  Accepted: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Shortlisted: "text-blue-700 bg-blue-50 border-blue-200",
  Pending: "text-amber-700 bg-amber-50 border-amber-200",
};

// TODO: Replace `mockCandidates` and `jobMeta` with real backend data when ready.
// Example (uncomment and wire to your query):
// const { data: candidates = [] } = api.selectedCandidates.byJob.useQuery({ jobId });
// Then remove `mockCandidates`/`jobMeta` and use the real `candidates` list instead.
const mockCandidates: Candidate[] = [
  {
    id: "c1",
    name: "Ava Thompson",
    role: "Data Scientist",
    jobId: "1",
    stage: "Offer",
    status: "Accepted",
    score: 92,
    appliedAt: "2026-03-10",
    location: "Remote",
    email: "ava.thompson@example.com",
    phone: "+1 202 555 0108",
    tags: ["Python", "NLP", "FastAPI"],
    note: "Offer signed",
  },
  {
    id: "c2",
    name: "Liam Carter",
    role: "Frontend Engineer",
    jobId: "1",
    stage: "Interview",
    status: "Shortlisted",
    score: 88,
    appliedAt: "2026-03-12",
    location: "Colombo, LK",
    email: "liam.carter@example.com",
    phone: "+94 71 234 5678",
    tags: ["React", "TypeScript"],
    note: "Panel interview this week",
  },
];

const jobMeta: Record<string, { title: string; location: string }> = {
  "1": { title: "AI Engineer Intern", location: "Remote" },
  "2": { title: "ML Specialist", location: "Colombo HQ" },
};

export default function SelectedJobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = (params?.jobId as string) ?? "";

  const [modalOpen, setModalOpen] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [form, setForm] = useState({
    date: "",
    time: "",
    mode: "Remote",
    link: "",
    notes: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scheduleInterview = api.interview.schedule.useMutation();

  const candidates = mockCandidates.filter((c) => c.jobId === jobId);
  const job = jobMeta[jobId];

  const missing = !job || candidates.length === 0;

  const openSchedule = (c: Candidate) => {
    setActiveCandidate(c);
    setForm({
      date: "",
      time: "",
      mode: "Remote",
      link: "",
      notes: "",
    });
    setModalOpen(true);
  };

  const submitSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeCandidate || !job) return;
    setSubmitError(null);

    try {
      await scheduleInterview.mutateAsync({
        jobId,
        jobTitle: job.title,
        candidateId: activeCandidate.id,
        candidateName: activeCandidate.name,
        candidateEmail: activeCandidate.email,
        date: form.date,
        time: form.time,
        mode: form.mode as "Remote" | "Onsite",
        link: form.link,
        notes: form.notes || undefined,
      });

      setModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send invite";
      setSubmitError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] px-4 sm:px-8 py-8 text-[#0F172A]">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/company/selected-candidates")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F3D5E] hover:text-[#0c2f49]"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span className="text-sm text-slate-500">Selected candidates</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
                <ClipboardList size={16} /> Job overview
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {job?.title ?? "Job not found"}
              </h1>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} /> {job?.location ?? "Unknown location"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={14} /> {candidates.length} finalist{candidates.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-[#0F3D5E] rounded-lg hover:bg-[#0c2f49] transition shadow-sm">
                <CheckCircle2 size={16} /> Mark hire
              </button>
            </div>
          </div>
        </div>

        {missing ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
            No finalists found for this job yet.
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((c) => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0F3D5E] text-white font-bold flex items-center justify-center">
                      {c.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-[#0F172A]">{c.name}</h2>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${stageStyle[c.stage]}`}>
                          {c.stage}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle[c.status]}`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{c.role}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1"><MapPin size={14} /> {c.location}</span>
                        <span className="inline-flex items-center gap-1"><Mail size={14} /> {c.email}</span>
                        <span className="inline-flex items-center gap-1"><Phone size={14} /> {c.phone}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {c.tags.map((t) => (
                          <span key={t} className="text-xs font-semibold bg-[#F4F7FB] text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 min-w-[200px]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <Trophy size={16} className="text-amber-500" /> Score {c.score}
                    </div>
                    <p className="text-xs font-semibold text-slate-500">Applied {c.appliedAt}</p>
                    <div className="flex flex-wrap gap-2">
                      <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-[#0F3D5E] border border-[#0F3D5E]/30 rounded-lg hover:bg-[#EFF6FF] transition">
                        <Eye size={14} /> View profile
                      </button>
                      <button
                        onClick={() => openSchedule(c)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-white bg-[#1F7FB2] rounded-lg hover:bg-[#1a6f9e] transition"
                      >
                        <Video size={14} /> Schedule interview
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {c.note}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && activeCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Schedule interview</p>
                <h3 className="text-xl font-bold text-[#0F172A]">{activeCandidate.name}</h3>
                <p className="text-sm text-slate-500">{job?.title ?? "Job"}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={submitSchedule}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3AB6D9]/30 focus:border-[#3AB6D9] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Time</label>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3AB6D9]/30 focus:border-[#3AB6D9] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Mode</label>
                  <select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3AB6D9]/30 focus:border-[#3AB6D9] outline-none"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Meeting link / location</label>
                  <input
                    type="text"
                    required
                    placeholder={form.mode === "Remote" ? "https://meet..." : "HQ Room 3B"}
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3AB6D9]/30 focus:border-[#3AB6D9] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Notes for email</label>
                <textarea
                  rows={3}
                  placeholder="Add agenda or instructions (sent in email)."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3AB6D9]/30 focus:border-[#3AB6D9] outline-none"
                />
              </div>

              {submitError && (
                <p className="text-sm font-semibold text-red-600">{submitError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleInterview.isPending}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#1F7FB2] rounded-lg hover:bg-[#1a6f9e] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {scheduleInterview.isPending ? "Sending..." : "Send invite email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
