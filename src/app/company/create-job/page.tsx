"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { api } from "~/trpc/react";

const JOB_ROLES = ["SOFTWARE_ENGINEER", "UX_ENGINEER", "PROJECT_MANAGER"] as const;
const JOB_TYPES = ["INTERNSHIP", "FULL_TIME"] as const;
const JOB_LEVELS = ["JUNIOR", "MID", "SENIOR"] as const;

export default function CreateJobPage() {
  const router = useRouter();
  const createJob = api.job.create.useMutation();
  const [currentStep, setCurrentStep] = useState(1);

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    background: "#F8FBFF",
    color: "#0F172A",
    iconColor: "#EF4444",
    customClass: {
      popup: "hs-toast",
      title: "text-[13px] font-semibold leading-tight",
      closeButton: "text-red-500 hover:text-red-600",
      icon: "border-2 border-[#EF4444] scale-95",
    },
  });

  const [form, setForm] = useState({
    title: "",
    location: "",
    role: "SOFTWARE_ENGINEER",
    type: "INTERNSHIP",
    level: "JUNIOR",
    tags: "",
    salary: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    deadline: "",
    slots: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields before submitting
    if (!form.title || !form.location || !form.tags || !form.description || !form.responsibilities || !form.requirements) {
      toast.fire({
        icon: "warning",
        title: "Please fill in all required fields before posting.",
      });
      return;
    }

    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      toast.fire({
        icon: "error",
        title: "Not logged in. Please log in first.",
      });
      router.push("/company/comlogin");
      return;
    }

    createJob.mutate(
      {
        companyId,
        title: form.title,
        location: form.location,
        role: form.role as (typeof JOB_ROLES)[number],
        type: form.type as (typeof JOB_TYPES)[number],
        level: form.level as (typeof JOB_LEVELS)[number],
        tags: form.tags,
        salary: form.salary || undefined,
        description: form.description,
        responsibilities: form.responsibilities,
        requirements: form.requirements,
        benefits: form.benefits || undefined,
        deadline: form.deadline || undefined,
        slots: form.slots ? parseInt(form.slots) : undefined,
      },
      {
        onSuccess: () => {
          toast.fire({
            icon: "success",
            title: "Job post created successfully!",
          });
          router.push("/company/dashboard");
        },
        onError: (err) => {
          toast.fire({
            icon: "error",
            title: err.message,
          });
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-8 sm:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-1.5 mb-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#3AB6D9] bg-[#3AB6D9]/10 w-fit mb-1">
                <span className="w-2 h-2 rounded-full bg-[#3AB6D9]"></span>
                <span className="text-xs font-semibold text-[#0F172A]">Hiring</span>
              </div>
              <h1
                className="text-4xl font-extrabold tracking-tight leading-tight mb-0"
                style={{
                  background: "linear-gradient(135deg, #0F172A, #0EA5E9)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Create Job Post
              </h1>
              <p className="text-[#475569] text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
                Step {currentStep} of 3 — Complete each section to publish your job posting
              </p>
            </div>
            <button
              onClick={() => router.push("/company/dashboard")}
              className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              aria-label="Back to dashboard"
              title="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </button>
          </div>
        </div>

      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-8 px-4 mt-20">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center flex-1 relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all z-10 ${
                step <= currentStep
                  ? "bg-gradient-to-r from-[#0F172A] to-[#0F75A8] text-white shadow-md"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {step}
            </div>
            <div
              className={`text-[11px] font-semibold mt-2 ${
                step <= currentStep ? "text-[#0F75A8]" : "text-slate-400"
              }`}
            >
              {step === 1 && "Job Basics"}
              {step === 2 && "Job Details"}
              {step === 3 && "Timeline"}
            </div>
            {step < 3 && (
              <div
                className={`absolute top-5 left-[calc(50%+1.25rem)] w-[calc(100%-2.5rem)] h-1 ${
                  step <= currentStep
                    ? "bg-gradient-to-r from-[#0F172A] to-[#0F75A8]"
                    : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7 bg-white/95 border border-slate-300 shadow-lg shadow-slate-200/70 rounded-2xl p-8 backdrop-blur">

        {/* Step 1: Job Basics */}
        {currentStep === 1 && (
          <>
            <div className="flex items-center justify-between pb-1">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#0F75A8]">Basics</div>
              <div className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-300">Visible to candidates</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm text-slate-700">Job Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                  placeholder="e.g. Frontend Developer"
                />
                <span className="text-xs text-slate-500">Lead with the role you want candidates to see first.</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm text-slate-700">Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                  placeholder="e.g. Colombo, Sri Lanka"
                />
                <span className="text-xs text-slate-500">Specify onsite city or note remote/hybrid here.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#0F75A8]">Role specifics</div>
              <div className="text-[11px] font-semibold text-slate-500">Choose what applicants will see first</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm text-slate-700">Role *</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                >
                  {JOB_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm text-slate-700">Type *</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm text-slate-700">Level *</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                >
                  {JOB_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-slate-700">Tags *</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                placeholder="e.g. React, TypeScript, Node.js"
              />
              <span className="text-xs text-slate-500">Comma separate so candidates can find the role faster.</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-slate-700">Salary (optional)</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                placeholder="e.g. LKR 80,000 - 120,000"
              />
            </div>
          </>
        )}

        {/* Step 2: Job Details */}
        {currentStep === 2 && (
          <>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-slate-700">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                placeholder="Brief overview of the job..."
              />
              <span className="text-xs text-slate-500">Help candidates understand the role at a glance.</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-slate-700">Responsibilities *</label>
              <textarea
                name="responsibilities"
                value={form.responsibilities}
                onChange={handleChange}
                rows={4}
                className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                placeholder="Key responsibilities..."
              />
              <span className="text-xs text-slate-500">List the main duties they'll handle daily.</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-slate-700">Requirements *</label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={4}
                className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                placeholder="Required skills and qualifications..."
              />
              <span className="text-xs text-slate-500">Include education, experience, and technical skills.</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-slate-700">Benefits (optional)</label>
              <textarea
                name="benefits"
                value={form.benefits}
                onChange={handleChange}
                rows={3}
                className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                placeholder="e.g. Health insurance, flexible hours..."
              />
            </div>
          </>
        )}

        {/* Step 3: Timeline */}
        {currentStep === 3 && (
          <>
            <div className="flex items-center justify-between pb-1">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#0F75A8]">Timeline</div>
              <div className="text-[11px] font-semibold text-slate-500">Optional scheduling controls</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm text-slate-700">Application Deadline (optional)</label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm text-slate-700">Number of Openings (optional)</label>
                <input
                  type="number"
                  name="slots"
                  value={form.slots}
                  onChange={handleChange}
                  min={1}
                  className="border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50"
                  placeholder="e.g. 3"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-900 font-semibold">Ready to publish?</p>
              <p className="text-xs text-blue-800 mt-1">Review your job posting before clicking Post Job. You can edit it later.</p>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="inline-flex items-center justify-center bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-full hover:bg-slate-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#0F172A] to-[#0F75A8] text-white font-semibold py-3 px-6 rounded-full shadow-md hover:brightness-110 transition-all"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={createJob.isPending}
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#0F172A] to-[#0F75A8] text-white font-semibold py-3 px-6 rounded-full shadow-md hover:brightness-110 transition-all disabled:opacity-60"
            >
              {createJob.isPending ? "Posting..." : "Post Job"}
            </button>
          )}
        </div>

      </form>
      </div>
    </div>
  );
}
