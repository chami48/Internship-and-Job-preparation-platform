"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { api } from "~/trpc/react";
import { showAlert } from "~/app/components/common/alert";

const JOB_ROLES = ["SOFTWARE_ENGINEER", "UX_ENGINEER", "PROJECT_MANAGER"] as const;
const JOB_TYPES = ["INTERNSHIP", "FULL_TIME"] as const;
const JOB_LEVELS = ["JUNIOR", "MID", "SENIOR"] as const;

export default function CreateJobPage() {
  const router = useRouter();
  const createJob = api.job.create.useMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

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
  const [salaryError, setSalaryError] = useState("");
  const [slotsError, setSlotsError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    
    if (name === "slots") {
      const digitsOnly = value.replace(/\D/g, "");
      const trimmed = digitsOnly.slice(0, 3);
      setForm((prev) => ({ ...prev, slots: trimmed }));
      if (trimmed.startsWith("0") && trimmed.length > 0) {
        setSlotsError("Number of openings cannot start with 0.");
      } else {
        setSlotsError("");
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    const errors = { ...fieldErrors };

    if (name === "title") {
      if (!value.trim()) {
        errors.title = "Job title is required";
      } else if (value.trim().length < 3) {
        errors.title = "Job title must be at least 3 characters";
      } else if (value.trim().length > 100) {
        errors.title = "Job title must not exceed 100 characters";
      } else {
        delete errors.title;
      }
    }

    if (name === "location") {
      if (!value.trim()) {
        errors.location = "Location is required";
      } else if (value.trim().length < 2) {
        errors.location = "Location must be at least 2 characters";
      } else {
        delete errors.location;
      }
    }

    if (name === "tags") {
      if (!value.trim()) {
        errors.tags = "Skills/tags are required";
      } else if (value.trim().split(",").length < 2) {
        errors.tags = "Please add at least 2 skills (comma-separated)";
      } else {
        delete errors.tags;
      }
    }

    if (name === "description") {
      if (!value.trim()) {
        errors.description = "Description is required";
      } else if (value.trim().length < 20) {
        errors.description = "Description must be at least 20 characters";
      } else if (value.trim().length > 1000) {
        errors.description = "Description must not exceed 1000 characters";
      } else {
        delete errors.description;
      }
    }

    if (name === "responsibilities") {
      if (!value.trim()) {
        errors.responsibilities = "Responsibilities are required";
      } else if (value.trim().length < 20) {
        errors.responsibilities = "Responsibilities must be at least 20 characters";
      } else if (value.trim().length > 1000) {
        errors.responsibilities = "Responsibilities must not exceed 1000 characters";
      } else {
        delete errors.responsibilities;
      }
    }

    if (name === "requirements") {
      if (!value.trim()) {
        errors.requirements = "Requirements are required";
      } else if (value.trim().length < 20) {
        errors.requirements = "Requirements must be at least 20 characters";
      } else if (value.trim().length > 1000) {
        errors.requirements = "Requirements must not exceed 1000 characters";
      } else {
        delete errors.requirements;
      }
    }

    if (name === "salary") {
      const nextValue = value.trim();
      if (!nextValue) {
        setSalaryError("");
        delete errors.salary;
      } else if (!/\d/.test(nextValue)) {
        setSalaryError("Salary must include at least one number.");
        errors.salary = "Invalid salary format";
      } else if (/^-\s*\d/.test(nextValue)) {
        setSalaryError("Salary cannot be a negative value.");
        errors.salary = "Salary cannot be negative";
      } else if (nextValue.length > 50) {
        errors.salary = "Salary must not exceed 50 characters";
        setSalaryError("Salary format too long");
      } else {
        setSalaryError("");
        delete errors.salary;
      }
    }

    if (name === "deadline") {
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          errors.deadline = "Deadline must be today or a future date";
        } else {
          delete errors.deadline;
        }
      }
    }

    setFieldErrors(errors);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.title.trim()) errors.title = "Job title is required";
      if (form.title.trim().length < 3) errors.title = "Job title must be at least 3 characters";
      if (form.title.trim().length > 100) errors.title = "Job title must not exceed 100 characters";
      
      if (!form.location.trim()) errors.location = "Location is required";
      if (form.location.trim().length < 2) errors.location = "Location must be at least 2 characters";
      
      if (!form.tags.trim()) errors.tags = "Skills/tags are required";
      if (form.tags.trim().split(",").length < 2) errors.tags = "Please add at least 2 skills";
      
      if (salaryError) errors.salary = salaryError;
      if (slotsError) errors.slots = slotsError;
      
      if (form.slots && Number(form.slots) < 1) errors.slots = "Number of openings must be at least 1";
    }

    if (currentStep === 2) {
      if (!form.description.trim()) errors.description = "Description is required";
      if (form.description.trim().length < 20) errors.description = "Description must be at least 20 characters";
      if (form.description.trim().length > 1000) errors.description = "Description must not exceed 1000 characters";
      
      if (!form.responsibilities.trim()) errors.responsibilities = "Responsibilities are required";
      if (form.responsibilities.trim().length < 20) errors.responsibilities = "Responsibilities must be at least 20 characters";
      if (form.responsibilities.trim().length > 1000) errors.responsibilities = "Responsibilities must not exceed 1000 characters";
      
      if (!form.requirements.trim()) errors.requirements = "Requirements are required";
      if (form.requirements.trim().length < 20) errors.requirements = "Requirements must be at least 20 characters";
      if (form.requirements.trim().length > 1000) errors.requirements = "Requirements must not exceed 1000 characters";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.fire({
        icon: "warning",
        title: "Please fix the errors above before continuing.",
      });
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleDemoFill = () => {
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 30);
    const deadlineStr = `${deadlineDate.getFullYear()}-${String(deadlineDate.getMonth() + 1).padStart(2, "0")}-${String(deadlineDate.getDate()).padStart(2, "0")}`;

    setForm({
      title: "Software Engineer",
      location: "Colombo, Sri Lanka",
      role: "SOFTWARE_ENGINEER",
      type: "FULL_TIME",
      level: "MID",
      tags: "React, Node.js, TypeScript, MongoDB, Docker",
      salary: "LKR 150,000 - 200,000",
      description: "We are looking for a talented Software Engineer to join our dynamic team. You will work on cutting-edge technologies and contribute to building scalable applications that impact thousands of users.",
      responsibilities: "• Develop and maintain full-stack web applications\n• Write clean, efficient, and well-documented code\n• Collaborate with cross-functional teams\n• Participate in code reviews and testing\n• Troubleshoot and optimize application performance",
      requirements: "• 2-4 years of software development experience\n• Proficiency in React and Node.js\n• Strong understanding of TypeScript\n• Experience with MongoDB and Docker\n• Good problem-solving and communication skills\n• Bachelor's degree in Computer Science or equivalent",
      benefits: "Competitive salary, Health insurance, Flexible work hours, Remote work opportunity, Professional development support",
      deadline: deadlineStr,
      slots: "2",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation of all fields
    const errors: Record<string, string> = {};

    // Step 1 validations
    if (!form.title.trim()) errors.title = "Job title is required";
    else if (form.title.trim().length < 3) errors.title = "Job title must be at least 3 characters";
    else if (form.title.trim().length > 100) errors.title = "Job title must not exceed 100 characters";
    
    if (!form.location.trim()) errors.location = "Location is required";
    else if (form.location.trim().length < 2) errors.location = "Location must be at least 2 characters";
    
    if (!form.tags.trim()) errors.tags = "Skills/tags are required";
    else if (form.tags.trim().split(",").length < 2) errors.tags = "Please add at least 2 skills";
    
    if (!form.deadline) errors.deadline = "Application deadline is required";
    else {
      const deadlineDate = new Date(form.deadline);
      const minDate = new Date();
      minDate.setHours(0, 0, 0, 0);
      if (deadlineDate < minDate) errors.deadline = "Deadline cannot be in the past";
    }
    
    // Step 2 validations
    if (!form.description.trim()) errors.description = "Description is required";
    else if (form.description.trim().length < 20) errors.description = "Description must be at least 20 characters";
    else if (form.description.trim().length > 1000) errors.description = "Description must not exceed 1000 characters";
    
    if (!form.responsibilities.trim()) errors.responsibilities = "Responsibilities are required";
    else if (form.responsibilities.trim().length < 20) errors.responsibilities = "Responsibilities must be at least 20 characters";
    else if (form.responsibilities.trim().length > 1000) errors.responsibilities = "Responsibilities must not exceed 1000 characters";
    
    if (!form.requirements.trim()) errors.requirements = "Requirements are required";
    else if (form.requirements.trim().length < 20) errors.requirements = "Requirements must be at least 20 characters";
    else if (form.requirements.trim().length > 1000) errors.requirements = "Requirements must not exceed 1000 characters";

    // Step 3 validations
    if (salaryError) errors.salary = salaryError;
    if (slotsError) errors.slots = slotsError;
    if (!form.slots || Number(form.slots) < 1) errors.slots = "Number of openings must be at least 1";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.fire({
        icon: "error",
        title: "Please fix all validation errors before submitting.",
      });
      return;
    }

    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      void showAlert({
        icon: "warning",
        text: "Not logged in. Please log in first.",
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
          void showAlert({
            icon: "success",
            text: "Job post created successfully!",
          });
          router.push("/company/my-jobs");
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
            {currentStep === 1 && (
              <button
                onClick={() => router.push("/company/dashboard")}
                className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                aria-label="Back to dashboard"
                title="Back to dashboard"
              >
                <ArrowLeft size={18} />
              </button>
            )}
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
                  maxLength={100}
                  className={`border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50 ${
                    fieldErrors.title ? "border-red-500 focus:ring-red-500" : "border-slate-300"
                  }`}
                  placeholder="e.g. Frontend Developer"
                />
                {fieldErrors.title && <p className="text-xs text-red-600">{fieldErrors.title}</p>}
                {!fieldErrors.title && <span className="text-xs text-slate-500">Lead with the role you want candidates to see first. ({form.title.length}/100)</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm text-slate-700">Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  maxLength={100}
                  className={`border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50 ${
                    fieldErrors.location ? "border-red-500 focus:ring-red-500" : "border-slate-300"
                  }`}
                  placeholder="e.g. Colombo, Sri Lanka"
                />
                {fieldErrors.location && <p className="text-xs text-red-600">{fieldErrors.location}</p>}
                {!fieldErrors.location && <span className="text-xs text-slate-500">Specify onsite city or note remote/hybrid here. ({form.location.length}/100)</span>}
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
                maxLength={200}
                className={`border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50 ${
                  fieldErrors.tags ? "border-red-500 focus:ring-red-500" : "border-slate-300"
                }`}
                placeholder="e.g. React, TypeScript, Node.js"
              />
              {fieldErrors.tags && <p className="text-xs text-red-600">{fieldErrors.tags}</p>}
              {!fieldErrors.tags && <span className="text-xs text-slate-500">Comma separate so candidates can find the role faster. ({form.tags.length}/200)</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-slate-700">Salary (optional)</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  // Allow only digits, commas, and spaces
                  target.value = target.value.replace(/[^0-9,\s]/g, '');
                }}
                maxLength={50}
                className={`border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50 ${
                  fieldErrors.salary ? "border-red-500 focus:ring-red-500" : "border-slate-300"
                }`}
                placeholder="e.g. LKR 80000 or 80000 120000"
              />
              {fieldErrors.salary && <p className="text-xs text-red-600">{fieldErrors.salary}</p>}
            </div>
          </>
        )}

        {/* Step 2: Job Details */}
        {currentStep === 2 && (
          <>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-slate-700">Description *</label>
              <div className="flex justify-between items-end gap-2">
                <span className="text-xs text-slate-500">Min 20 characters</span>
                <span className="text-xs font-semibold text-slate-600">{form.description.length}/1000</span>
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                className={`border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50 ${
                  fieldErrors.description ? "border-red-500 focus:ring-red-500" : "border-slate-300"
                }`}
                placeholder="Brief overview of the job..."
              />
              {fieldErrors.description && <p className="text-xs text-red-600">{fieldErrors.description}</p>}
              {!fieldErrors.description && <span className="text-xs text-slate-500">Help candidates understand the role at a glance.</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-slate-700">Responsibilities *</label>
              <div className="flex justify-between items-end gap-2">
                <span className="text-xs text-slate-500">Min 20 characters</span>
                <span className="text-xs font-semibold text-slate-600">{form.responsibilities.length}/1000</span>
              </div>
              <textarea
                name="responsibilities"
                value={form.responsibilities}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                className={`border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50 ${
                  fieldErrors.responsibilities ? "border-red-500 focus:ring-red-500" : "border-slate-300"
                }`}
                placeholder="Key responsibilities..."
              />
              {fieldErrors.responsibilities && <p className="text-xs text-red-600">{fieldErrors.responsibilities}</p>}
              {!fieldErrors.responsibilities && <span className="text-xs text-slate-500">List the main duties they'll handle daily.</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-slate-700">Requirements *</label>
              <div className="flex justify-between items-end gap-2">
                <span className="text-xs text-slate-500">Min 20 characters</span>
                <span className="text-xs font-semibold text-slate-600">{form.requirements.length}/1000</span>
              </div>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                className={`border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50 ${
                  fieldErrors.requirements ? "border-red-500 focus:ring-red-500" : "border-slate-300"
                }`}
                placeholder="Required skills and qualifications..."
              />
              {fieldErrors.requirements && <p className="text-xs text-red-600">{fieldErrors.requirements}</p>}
              {!fieldErrors.requirements && <span className="text-xs text-slate-500">Include education, experience, and technical skills.</span>}
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
                  min={todayStr}
                  className={`border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50 ${
                    fieldErrors.deadline ? "border-red-500 focus:ring-red-500" : "border-slate-300"
                  }`}
                />
                {fieldErrors.deadline && <p className="text-xs text-red-600">{fieldErrors.deadline}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm text-slate-700">Number of Openings (optional)</label>
                <input
                  type="number"
                  name="slots"
                  value={form.slots}
                  onChange={handleChange}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    // Limit to 3 digits
                    if (target.value.length > 3) {
                      target.value = target.value.slice(0, 3);
                    }
                    // Remove leading zeros
                    if (target.value.startsWith('0') && target.value.length > 1) {
                      target.value = target.value.replace(/^0+/, '');
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "e" || event.key === "E" || event.key === "-" || event.key === "+") {
                      event.preventDefault();
                    }
                  }}
                  min={1}
                  max={999}
                  inputMode="numeric"
                  className={`border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3AB6D9] bg-slate-50 ${
                    fieldErrors.slots ? "border-red-500 focus:ring-red-500" : "border-slate-300"
                  }`}
                  placeholder="e.g. 3"
                />
                {fieldErrors.slots && <p className="text-xs text-red-600">{fieldErrors.slots}</p>}
                {!fieldErrors.slots && form.slots && <span className="text-xs text-slate-500">Range: 1-999 openings</span>}
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

      {/* Demo Button */}
      <button
        onClick={handleDemoFill}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0EA5E9, #0284C7)",
          border: "none",
          color: "white",
          fontSize: "1.5rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(14,165,233,0.35)",
          transition: "background 0.2s, box-shadow 0.2s, transform 0.18s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #0284C7, #0164A7)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(14,165,233,0.45)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #0EA5E9, #0284C7)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(14,165,233,0.35)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
        title="Fill demo job data"
      >
        ✨
      </button>
    </div>
  );
}
