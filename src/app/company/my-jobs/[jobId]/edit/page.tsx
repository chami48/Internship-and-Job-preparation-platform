"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "~/trpc/react";
import { showAlert } from "~/app/components/common/alert";

const JOB_ROLES = ["SOFTWARE_ENGINEER", "UX_ENGINEER", "PROJECT_MANAGER"] as const;
const JOB_TYPES = ["INTERNSHIP", "FULL_TIME"] as const;
const JOB_LEVELS = ["JUNIOR", "MID", "SENIOR"] as const;

const INPUT = "border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-[#3AB6D9]/40 focus:border-[#3AB6D9] transition w-full";
const LABEL = "text-sm font-semibold text-slate-700 mb-1 block";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className={LABEL}>{label}</label>
      {children}
    </div>
  );
}

export default function EditJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const router = useRouter();

  const { data: job, isLoading } = api.job.byId.useQuery({ id: jobId });
  const updateJob = api.job.update.useMutation();
  const utils = api.useUtils();

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

  // Pre-fill form once job data arrives
  useEffect(() => {
    if (!job) return;
    setForm({
      title: job.title,
      location: job.location,
      role: job.role,
      type: job.type,
      level: job.level,
      tags: job.tags,
      salary: job.salary ?? "",
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      benefits: job.benefits ?? "",
      deadline: job.deadline ? new Date(job.deadline).toISOString().slice(0, 10) : "",
      slots: job.slots?.toString() ?? "",
    });
  }, [job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateJob.mutate(
      {
        id: jobId,
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
        onSuccess: async () => {
          await utils.job.byId.invalidate({ id: jobId });
          await utils.job.listByCompany.invalidate();
          router.push(`/company/my-jobs/${jobId}`);
        },
        onError: (err) => {
          void showAlert({
            icon: "error",
            text: err.message,
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-base font-medium">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">

      {/* Back */}
      <button
        onClick={() => router.push(`/company/my-jobs/${jobId}`)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1F7FB2] transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to Job Details
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Edit Job Post</h1>
        <p className="text-sm text-slate-400 mt-1">Changes will be saved and reflected immediately.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Title + Location */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Job Title *">
            <input name="title" value={form.title} onChange={handleChange} required className={INPUT} placeholder="e.g. Frontend Developer" />
          </Field>
          <Field label="Location *">
            <input name="location" value={form.location} onChange={handleChange} required className={INPUT} placeholder="e.g. Colombo, Sri Lanka" />
          </Field>
        </div>

        {/* Role / Type / Level */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="Role *">
            <select name="role" value={form.role} onChange={handleChange} className={INPUT}>
              {JOB_ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
            </select>
          </Field>
          <Field label="Type *">
            <select name="type" value={form.type} onChange={handleChange} className={INPUT}>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
          </Field>
          <Field label="Level *">
            <select name="level" value={form.level} onChange={handleChange} className={INPUT}>
              {JOB_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
        </div>

        {/* Tags + Salary */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tags *">
            <input name="tags" value={form.tags} onChange={handleChange} required className={INPUT} placeholder="e.g. React, TypeScript" />
          </Field>
          <Field label="Salary (optional)">
            <input name="salary" value={form.salary} onChange={handleChange} className={INPUT} placeholder="e.g. LKR 80,000 - 120,000" />
          </Field>
        </div>

        {/* Description */}
        <Field label="Description *">
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className={INPUT} placeholder="Brief overview of the job…" />
        </Field>

        {/* Responsibilities */}
        <Field label="Responsibilities *">
          <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} required rows={4} className={INPUT} placeholder="Key responsibilities…" />
        </Field>

        {/* Requirements */}
        <Field label="Requirements *">
          <textarea name="requirements" value={form.requirements} onChange={handleChange} required rows={4} className={INPUT} placeholder="Required skills and qualifications…" />
        </Field>

        {/* Benefits */}
        <Field label="Benefits (optional)">
          <textarea name="benefits" value={form.benefits} onChange={handleChange} rows={3} className={INPUT} placeholder="e.g. Health insurance, flexible hours…" />
        </Field>

        {/* Deadline + Slots */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Application Deadline (optional)">
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className={INPUT} />
          </Field>
          <Field label="Number of Openings (optional)">
            <input type="number" name="slots" value={form.slots} onChange={handleChange} min={1} className={INPUT} placeholder="e.g. 3" />
          </Field>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={updateJob.isPending}
            className="flex items-center gap-2 bg-[#1F7FB2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1a6f9e] transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {updateJob.isPending ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/company/my-jobs/${jobId}`)}
            className="px-6 py-3 text-sm font-semibold text-slate-600 border border-[#E2E8F0] rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
