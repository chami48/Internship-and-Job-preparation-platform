// "use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Users,
  Calendar,
  DollarSign,
  Tag,
  ChevronRight,
  CheckCircle2,
  XCircle,
  FileText,
  ListChecks,
  Gift,
} from "lucide-react";

const ROLE_ICON: Record<string, string> = {
  SOFTWARE_ENGINEER: "💻",
  UX_ENGINEER: "🎨",
  PROJECT_MANAGER: "📋",
};

const LEVEL_STYLE: Record<string, string> = {
  JUNIOR: "bg-[#EFF6FF] text-[#1D4ED8]",
  MID: "bg-[#F0FDF4] text-[#15803D]",
  SENIOR: "bg-[#FFF7ED] text-[#C2410C]",
};

const TYPE_STYLE: Record<string, string> = {
  FULL_TIME: "bg-[#EFF6FF] text-[#1F7FB2]",
  INTERNSHIP: "bg-[#F5F3FF] text-[#7C3AED]",
};

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isExpired(deadline: Date | null | undefined): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
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

function TextBlock({ text }: { text?: string | null }) {
  if (!text) return <p className="text-sm text-slate-400">No information provided.</p>;

  return (
    <div className="space-y-1.5">
      {text.split("\n").filter(Boolean).map((line, i) => (
        <p key={i} className="text-sm text-slate-600 leading-relaxed">
          {line.startsWith("-") ? (
            <span className="flex gap-2">
              <span className="text-[#1F7FB2] font-bold mt-0.5">•</span>
              <span>{line.slice(1).trim()}</span>
            </span>
          ) : (
            line
          )}
        </p>
      ))}
    </div>
  );
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();

  const job = await db.job.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!job) return notFound();

  const exp = isExpired(job.deadline);

  const tags = job.tags
    ? job.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const application = session?.user?.id
    ? await db.application.findFirst({
        where: {
          userId: session.user.id,
          jobId: job.id,
        },
        select: { id: true, examSubmitted: true, terminationReason: true },
      })
    : null;

  const examSubmitted = application?.examSubmitted ?? false;
  const terminated =
    application?.terminationReason === "VIOLATION" && !examSubmitted;
  const hasApplication = Boolean(application?.id);

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">

      {/* BACK */}
      <Link
        href="/home#jobs"
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1F7FB2] mb-6"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      {/* HEADER CARD */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden mb-6">
        <div
          className={`h-1.5 w-full ${
            exp
              ? "bg-gradient-to-r from-red-300 to-red-400"
              : "bg-gradient-to-r from-[#3AB6D9] to-[#1F7FB2]"
          }`}
        />

        <div className="p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-[#EFF6FF]">
              {ROLE_ICON[job.role] ?? "💼"}
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    exp
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {exp ? "Expired" : "Active"}
                </span>

                <span
                  className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-lg ${
                    TYPE_STYLE[job.type]
                  }`}
                >
                  <Briefcase size={13} />
                  {job.type.replace("_", " ")}
                </span>

                <span
                  className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-lg ${
                    LEVEL_STYLE[job.level]
                  }`}
                >
                  <Clock size={13} />
                  {job.level}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-400 font-medium shrink-0">
            Posted {fmtDate(job.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT SIDE */}
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

          {/* APPLY SECTION */}
          {!exp && (
            <div className="bg-[#0B1120] rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">
                  Interested in this role?
                </p>
                <p className="text-slate-400 text-sm">
                  Submit your application and complete the assessment.
                </p>
              </div>

              {!examSubmitted && !terminated && (
                <Link
                  href={
                    hasApplication && application?.id
                      ? `/exam/${job.id}?appId=${application.id}`
                      : `/apply/${job.id}`
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3AB6D9] to-[#1F7FB2] text-white font-bold rounded-xl"
                >
                  Apply Now
                  <ChevronRight size={16} />
                </Link>
              )}

              {examSubmitted && (
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl cursor-not-allowed">
                  <CheckCircle2 size={16} />
                  Exam Submitted
                </button>
              )}

              {terminated && (
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl cursor-not-allowed">
                  <XCircle size={16} />
                  Terminated
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4">

          {/* JOB INFO */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Job Info
            </h3>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#1F7FB2]" />
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {job.location}
                </p>
              </div>
            </div>

            {job.salary && (
              <div className="flex items-start gap-3">
                <DollarSign size={16} className="text-[#1F7FB2]" />
                <div>
                  <p className="text-xs text-slate-400">Salary</p>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {job.salary}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-[#1F7FB2]" />
              <div>
                <p className="text-xs text-slate-400">Deadline</p>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {job.deadline ? fmtDate(job.deadline) : "No deadline"}
                </p>
              </div>
            </div>

            {job.slots && (
              <div className="flex items-start gap-3">
                <Users size={16} className="text-[#1F7FB2]" />
                <div>
                  <p className="text-xs text-slate-400">Openings</p>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {job.slots} position{job.slots > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* TAGS */}
          {tags.length > 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={15} className="text-[#1F7FB2]" />
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Tags
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#F4F7FB] text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E2E8F0]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}