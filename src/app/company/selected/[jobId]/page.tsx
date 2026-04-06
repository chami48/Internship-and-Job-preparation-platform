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
  userId: string;
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
    userId: "user_sandani_001",
    name: "Sandani Chamoda",
    role: "Data Scientist",
    jobId: "1",
    stage: "Offer",
    status: "Accepted",
    score: 92,
    appliedAt: "2026-03-10",
    location: "Remote",
    email: "sandani.chamoda@gmail.com",
    phone: "+94 76 987 6543",
    tags: ["Python", "NLP", "FastAPI"],
    note: "Offer signed",
  },
  {
    id: "c2",
    userId: "user_methma_002",
    name: "Methma Sankalpani",
    role: "Frontend Engineer",
    jobId: "1",
    stage: "Interview",
    status: "Shortlisted",
    score: 88,
    appliedAt: "2026-03-12",
    location: "Colombo, LK",
    email: "methma.sankalpani@gmail.com",
    phone: "+94 72 456 7890",
    tags: ["React", "TypeScript"],
    note: "Panel interview this week",
  },
  {
    id: "c3",
    userId: "user_nilumi_003",
    name: "Nilumi Dakshika",
    role: "ML Engineer",
    jobId: "1",
    stage: "Interview",
    status: "Shortlisted",
    score: 89,
    appliedAt: "2026-03-08",
    location: "Remote",
    email: "nilumi.dakshika@gmail.com",
    phone: "+94 77 234 5678",
    tags: ["TensorFlow", "PyTorch", "Python"],
    note: "Strong ML fundamentals",
  },
  {
    id: "c4",
    userId: "user_dilmi_004",
    name: "Dilmi Chamya",
    role: "AI Research Intern",
    jobId: "1",
    stage: "Assessment",
    status: "Shortlisted",
    score: 85,
    appliedAt: "2026-03-09",
    location: "Colombo, LK",
    email: "dilmi.chamya@gmail.com",
    phone: "+94 72 345 6789",
    tags: ["Deep Learning", "Computer Vision", "Python"],
    note: "Passed technical assessment",
  },
  {
    id: "c5",
    userId: "user_nirmi_005",
    name: "Nirmi Kawmada",
    role: "Backend Engineer",
    jobId: "1",
    stage: "Interview",
    status: "Shortlisted",
    score: 87,
    appliedAt: "2026-03-07",
    location: "Remote",
    email: "nirmi.kawmada@gmail.com",
    phone: "+94 77 456 7890",
    tags: ["Python", "FastAPI", "PostgreSQL"],
    note: "Good system design skills",
  },
  {
    id: "c6",
    userId: "user_dasuni_006",
    name: "Dasuni Tharaki",
    role: "Data Engineer",
    jobId: "1",
    stage: "Assessment",
    status: "Pending",
    score: 81,
    appliedAt: "2026-03-11",
    location: "Colombo, LK",
    email: "dasuni.tharaki@gmail.com",
    phone: "+94 71 567 8901",
    tags: ["SQL", "Spark", "Python"],
    note: "Awaiting assessment results",
  },
  {
    id: "c7",
    userId: "user_sadeesha_007",
    name: "Sadeesha Nelumi",
    role: "AI Engineer",
    jobId: "1",
    stage: "Interview",
    status: "Shortlisted",
    score: 90,
    appliedAt: "2026-03-06",
    location: "Remote",
    email: "sadeesha.nelumi@gmail.com",
    phone: "+94 76 678 9012",
    tags: ["Machine Learning", "NLP", "Python"],
    note: "Excellent problem solving",
  },
  {
    id: "c8",
    userId: "user_kavya_008",
    name: "Kavya Rathod",
    role: "ML Developer",
    jobId: "1",
    stage: "Assessment",
    status: "Shortlisted",
    score: 84,
    appliedAt: "2026-03-13",
    location: "Colombo, LK",
    email: "kavya.rathod@gmail.com",
    phone: "+94 72 789 0123",
    tags: ["Scikit-learn", "Python", "Data Analysis"],
    note: "Good foundation, needs mentoring",
  },
  {
    id: "c9",
    userId: "user_priya_009",
    name: "Priya Desai",
    role: "AI Research Associate",
    jobId: "1",
    stage: "Interview",
    status: "Pending",
    score: 86,
    appliedAt: "2026-03-14",
    location: "Remote",
    email: "priya.desai@gmail.com",
    phone: "+94 77 890 1234",
    tags: ["Research", "Python", "Mathematics"],
    note: "Interview scheduled for next week",
  },
  {
    id: "c10",
    userId: "user_anusha_010",
    name: "Anusha Jayasurya",
    role: "Data Scientist",
    jobId: "1",
    stage: "Assessment",
    status: "Shortlisted",
    score: 83,
    appliedAt: "2026-03-15",
    location: "Colombo, LK",
    email: "anusha.jayasurya@gmail.com",
    phone: "+94 71 901 2345",
    tags: ["Statistics", "Python", "Analytics"],
    note: "Strong analytical skills",
  },
  {
    id: "c11",
    userId: "user_radhika_011",
    name: "Radhika Perera",
    role: "ML Engineer Intern",
    jobId: "1",
    stage: "Interview",
    status: "Shortlisted",
    score: 88,
    appliedAt: "2026-03-16",
    location: "Remote",
    email: "radhika.perera@gmail.com",
    phone: "+94 76 012 3456",
    tags: ["PyTorch", "Deep Learning", "Python"],
    note: "Promising candidate",
  },
  {
    id: "c12",
    userId: "user_anushka_012",
    name: "Anushka Silva",
    role: "AI Developer",
    jobId: "1",
    stage: "Assessment",
    status: "Pending",
    score: 82,
    appliedAt: "2026-03-17",
    location: "Colombo, LK",
    email: "anushka.silva@gmail.com",
    phone: "+94 72 123 4567",
    tags: ["Python", "AI", "Algorithm"],
    note: "In assessment phase",
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const scheduleInterview = api.interview.schedule.useMutation();

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Date validation
    if (!form.date) {
      errors.date = "Date is required";
    } else {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = "Date must be in the future";
      }
    }

    // Time validation
    if (!form.time) {
      errors.time = "Time is required";
    } else if (form.date) {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // If date is today, check if time is in the future
      if (selectedDate.getTime() === today.getTime()) {
        const [hours, minutes] = form.time.split(":").map(Number);
        const now = new Date();
        const selectedTime = new Date();
        selectedTime.setHours(hours, minutes, 0, 0);
        
        if (selectedTime <= now) {
          errors.time = "Time must be in the future";
        }
      }
    }

    // Link/Location validation
    if (!form.link) {
      errors.link = form.mode === "Remote" ? "Meeting link is required" : "Location is required";
    } else if (form.mode === "Remote") {
      // Validate URL format
      try {
        new URL(form.link);
      } catch {
        errors.link = "Please enter a valid URL (e.g., https://meet.google.com/...)";
      }
    } else {
      // Onsite mode - just check it's not empty (already done above)
      if (form.link.trim().length < 3) {
        errors.link = "Location must be at least 3 characters";
      }
    }

    // Notes validation
    if (form.notes && form.notes.length > 500) {
      errors.notes = "Notes must be less than 500 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    setFieldErrors({});
    setSubmitError(null);
    setModalOpen(true);
  };

  const fillDemoSchedule = () => {
    // Generate a future date (3 days from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    const dateStr = futureDate.toISOString().split("T")[0];

    // Set time to 10:00 AM
    const timeStr = "10:00";

    setForm({
      date: dateStr,
      time: timeStr,
      mode: "Remote",
      link: "https://meet.google.com/abc-defg-hij",
      notes: "Technical round interview. Discuss project experience, problem-solving approach, and technical stack knowledge.",
    });
    setFieldErrors({});
  };

  const submitSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeCandidate || !job) return;
    setSubmitError(null);

    // Validate form before submission
    if (!validateForm()) {
      setSubmitError("Please fix the errors above");
      return;
    }

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
                      <button 
                        onClick={() => router.push("/student/profile")}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-[#0F3D5E] border border-[#0F3D5E]/30 rounded-lg hover:bg-[#EFF6FF] transition">
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
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={fillDemoSchedule}
                  className="text-slate-500 hover:text-slate-700 text-sm font-semibold px-2 py-1 hover:bg-slate-100 rounded transition"
                  title="Fill form with demo data"
                >
                  ✨ Demo
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

            <form className="space-y-4" onSubmit={submitSchedule}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={form.date}
                    onChange={(e) => {
                      setForm({ ...form, date: e.target.value });
                      setFieldErrors({ ...fieldErrors, date: "" });
                    }}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3AB6D9]/30 focus:border-[#3AB6D9] outline-none ${
                      fieldErrors.date ? "border-red-500 bg-red-50" : "border-slate-200"
                    }`}
                  />
                  {fieldErrors.date && (
                    <p className="text-xs text-red-600 font-semibold">{fieldErrors.date}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Time</label>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => {
                      setForm({ ...form, time: e.target.value });
                      setFieldErrors({ ...fieldErrors, time: "" });
                    }}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3AB6D9]/30 focus:border-[#3AB6D9] outline-none ${
                      fieldErrors.time ? "border-red-500 bg-red-50" : "border-slate-200"
                    }`}
                  />
                  {fieldErrors.time && (
                    <p className="text-xs text-red-600 font-semibold">{fieldErrors.time}</p>
                  )}
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
                    onChange={(e) => {
                      setForm({ ...form, link: e.target.value });
                      setFieldErrors({ ...fieldErrors, link: "" });
                    }}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3AB6D9]/30 focus:border-[#3AB6D9] outline-none ${
                      fieldErrors.link ? "border-red-500 bg-red-50" : "border-slate-200"
                    }`}
                  />
                  {fieldErrors.link && (
                    <p className="text-xs text-red-600 font-semibold">{fieldErrors.link}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Notes for email</label>
                <textarea
                  rows={3}
                  placeholder="Add agenda or instructions (sent in email)."
                  value={form.notes}
                  onChange={(e) => {
                    setForm({ ...form, notes: e.target.value });
                    setFieldErrors({ ...fieldErrors, notes: "" });
                  }}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3AB6D9]/30 focus:border-[#3AB6D9] outline-none ${
                    fieldErrors.notes ? "border-red-500 bg-red-50" : "border-slate-200"
                  }`}
                />
                <div className="flex justify-between items-center">
                  {fieldErrors.notes && (
                    <p className="text-xs text-red-600 font-semibold">{fieldErrors.notes}</p>
                  )}
                  <p className="text-xs text-slate-500">{form.notes.length}/500</p>
                </div>
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
