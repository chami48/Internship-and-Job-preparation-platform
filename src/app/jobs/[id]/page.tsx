//smart-screening\src\app\jobs\[id]\page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Users,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";

const ROLE_ICON: Record<string, string> = {
  SOFTWARE_ENGINEER: "💻",
  UX_ENGINEER: "🎨",
  PROJECT_MANAGER: "📋",
};

const LEVEL_STYLE: Record<string, string> = {
  JUNIOR: "bg-blue-50 text-blue-700",
  MID: "bg-green-50 text-green-700",
  SENIOR: "bg-orange-50 text-orange-700",
};

const TYPE_STYLE: Record<string, string> = {
  FULL_TIME: "bg-sky-50 text-sky-700",
  INTERNSHIP: "bg-purple-50 text-purple-700",
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
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function TextBlock({ text }: { text?: string | null }) {
  if (!text) return null;

  const lines = text.split("\n").filter(Boolean);

  return (
    <div className="space-y-2">
      {lines.map((line, i) =>
        line.startsWith("-") ? (
          <div key={i} className="flex gap-2 text-sm text-slate-600">
            <span className="text-sky-500 font-bold">•</span>
            <span>{line.slice(1).trim()}</span>
          </div>
        ) : (
          <p key={i} className="text-sm text-slate-600">{line}</p>
        )
      )}
    </div>
  );
}

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await db.job.findUnique({
    where: { id: params.id },
    include: { company: true },
  });

  if (!job) return notFound();

  const exp = isExpired(job.deadline);

  const tags = job.tags
    ? job.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl mb-6 shadow-sm">
          <div
            className={`h-1.5 ${
              exp
                ? "bg-gradient-to-r from-red-400 to-red-500"
                : "bg-gradient-to-r from-sky-400 to-blue-600"
            }`}
          />
          <div className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
              {ROLE_ICON[job.role] ?? "💼"}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
              <p className="text-sm text-slate-500">
                {job.company.name} · {job.location}
              </p>

              <div className="flex gap-2 mt-2 flex-wrap">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    exp
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {exp ? "Expired" : "Active"}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded ${TYPE_STYLE[job.type]}`}
                >
                  {job.type}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    LEVEL_STYLE[job.level]
                  }`}
                >
                  {job.level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-3 gap-6">

          {/* Left */}
          <div className="col-span-2 flex flex-col gap-5">
            <Section title="Description">
              <TextBlock text={job.description} />
            </Section>

            <Section title="Responsibilities">
              <TextBlock text={job.responsibilities} />
            </Section>

            <Section title="Requirements">
              <TextBlock text={job.requirements} />
            </Section>

            {job.benefits && (
              <Section title="Benefits">
                <TextBlock text={job.benefits} />
              </Section>
            )}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4">

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

              <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">
                Job Info
              </h3>

              <div className="flex items-center gap-2 mb-3">
                <MapPin size={15} className="text-sky-500" />
                <span className="text-sm">{job.location}</span>
              </div>

              {job.salary && (
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={15} className="text-sky-500" />
                  <span className="text-sm">{job.salary}</span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <Calendar size={15} className="text-sky-500" />
                <span className="text-sm">
                  {job.deadline ? fmtDate(job.deadline) : "No deadline"}
                </span>
              </div>

              {job.slots && (
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-sky-500" />
                  <span className="text-sm">{job.slots} openings</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={13} className="text-sky-500" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase">
                    Skills
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-slate-900 rounded-2xl p-6 flex items-center justify-between">

          <div>
            {!exp ? (
              <>
                <p className="text-white font-bold">Ready to apply?</p>
                <p className="text-slate-400 text-sm">
                  Submit CV and complete skill assessment.
                </p>
              </>
            ) : (
              <p className="text-slate-400 text-sm">
                This job posting has closed.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Link
              href="/jobs"
              className="flex items-center gap-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800"
            >
              <ArrowLeft size={14} /> Back
            </Link>

            {!exp && (
              <Link
                href={`/apply/${job.id}`}
                className="bg-sky-500 text-white px-5 py-2 rounded-lg hover:bg-sky-400"
              >
                Apply Now
              </Link>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}