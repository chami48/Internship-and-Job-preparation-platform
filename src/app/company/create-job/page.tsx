"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const JOB_ROLES = ["SOFTWARE_ENGINEER", "UX_ENGINEER", "PROJECT_MANAGER"] as const;
const JOB_TYPES = ["INTERNSHIP", "FULL_TIME"] as const;
const JOB_LEVELS = ["JUNIOR", "MID", "SENIOR"] as const;

export default function CreateJobPage() {
  const router = useRouter();
  const createJob = api.job.create.useMutation();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      alert("Not logged in. Please log in first.");
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
          alert("Job post created successfully!");
          router.push("/company/dashboard");
        },
        onError: (err) => {
          alert(err.message);
        },
      },
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8 text-[#0F172A]">Create Job Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-slate-700">Job Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]" placeholder="e.g. Frontend Developer" />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-slate-700">Location *</label>
          <input name="location" value={form.location} onChange={handleChange} required
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]" placeholder="e.g. Colombo, Sri Lanka" />
        </div>

        {/* Role / Type / Level */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-slate-700">Role *</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]">
              {JOB_ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-slate-700">Type *</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]">
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-slate-700">Level *</label>
            <select name="level" value={form.level} onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]">
              {JOB_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-slate-700">Tags *</label>
          <input name="tags" value={form.tags} onChange={handleChange} required
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]" placeholder="e.g. React, TypeScript, Node.js" />
        </div>

        {/* Salary */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-slate-700">Salary (optional)</label>
          <input name="salary" value={form.salary} onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]" placeholder="e.g. LKR 80,000 - 120,000" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-slate-700">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]" placeholder="Brief overview of the job..." />
        </div>

        {/* Responsibilities */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-slate-700">Responsibilities *</label>
          <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} required rows={4}
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]" placeholder="Key responsibilities..." />
        </div>

        {/* Requirements */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-slate-700">Requirements *</label>
          <textarea name="requirements" value={form.requirements} onChange={handleChange} required rows={4}
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]" placeholder="Required skills and qualifications..." />
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-slate-700">Benefits (optional)</label>
          <textarea name="benefits" value={form.benefits} onChange={handleChange} rows={3}
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]" placeholder="e.g. Health insurance, flexible hours..." />
        </div>

        {/* Deadline & Slots */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-slate-700">Application Deadline (optional)</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-slate-700">Number of Openings (optional)</label>
            <input type="number" name="slots" value={form.slots} onChange={handleChange} min={1}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9]" placeholder="e.g. 3" />
          </div>
        </div>

        <button type="submit" disabled={createJob.isPending}
          className="bg-[#1F7FB2] text-white font-bold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-50">
          {createJob.isPending ? "Posting..." : "Post Job"}
        </button>

      </form>
    </div>
  );
}
