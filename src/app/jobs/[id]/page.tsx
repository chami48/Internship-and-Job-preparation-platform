import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";
import { ArrowLeft, MapPin, Briefcase, Clock, Users, Calendar, DollarSign, Tag } from "lucide-react";

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

  const tags = job.tags
    ? job.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const requirements = job.requirements
    ? job.requirements.split("\n").filter((r) => r.trim())
    : [];

  const responsibilities = job.responsibilities
    ? job.responsibilities.split("\n").filter((r) => r.trim())
    : [];

  const benefits = job.benefits
    ? job.benefits.split("\n").filter((b) => b.trim())
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/jobs"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Jobs
          </Link>

          <div className="mt-6 flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900">{job.title}</h1>
              <p className="mt-2 text-lg text-slate-600">{job.company.name}</p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                  <span>📍</span>
                  <span className="font-medium text-slate-900">
                    {job.location}
                  </span>
                </div>

                <div
                  className={`rounded-lg px-4 py-2 font-semibold ${
                    job.type === "INTERNSHIP"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {job.type === "INTERNSHIP" ? "📚 Internship" : "💼 Full-time"}
                </div>

                <div className="rounded-lg bg-amber-100 px-4 py-2 font-semibold text-amber-700">
                  {job.level}
                </div>

                {job.salary && (
                  <div className="rounded-lg bg-emerald-100 px-4 py-2 font-semibold text-emerald-700">
                    💰 {job.salary}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Quick Summary */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-semibold text-slate-600">Position</div>
            <div className="mt-2 text-lg font-bold text-slate-900">
              {job.role.replace(/_/g, " ")}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-semibold text-slate-600">Type</div>
            <div className="mt-2 text-lg font-bold text-slate-900">
              {job.type}
            </div>
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
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function isExpired(deadline: Date | null | undefined): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function TextBlock({ text }: { text: string }) {
  const lines = text.split("\n").filter(Boolean);
  return (
    <div className="space-y-2">
      {lines.map((line, i) =>
        line.startsWith("-") ? (
          <div key={i} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
            <span className="text-sky-500 font-bold mt-0.5">•</span>
            <span>{line.slice(1).trim()}</span>
          </div>
        ) : (
          <p key={i} className="text-sm text-slate-600 leading-relaxed">{line}</p>
        )
      )}
    </div>
  );
}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-semibold text-slate-600">Level</div>
            <div className="mt-2 text-lg font-bold text-slate-900">
              {job.level}
export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await db.job.findUnique({ where: { id }, include: { company: true } });
  if (!job) return notFound();

  const exp = isExpired(job.deadline);

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
          <div className={`h-1.5 w-full ${exp ? "bg-gradient-to-r from-red-400 to-red-500" : "bg-gradient-to-r from-sky-400 to-blue-600"}`} />
          <div className="p-6 flex items-start gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                {ROLE_ICON[job.role] ?? "💼"}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
                <p className="text-sm text-slate-500 mt-1">{job.company.name} · {job.location}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${exp ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {exp ? "Expired" : "Active"}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${TYPE_STYLE[job.type] ?? "bg-slate-100 text-slate-600"}`}>
                    <Briefcase size={11} />{job.type.replace("_", " ")}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${LEVEL_STYLE[job.level] ?? "bg-slate-100 text-slate-600"}`}>
                    <Clock size={11} />{job.level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">About This Role</h2>
          <div className="mt-4 space-y-4 text-slate-700 whitespace-pre-wrap">
            {job.description}
          </div>
        </div>

        {/* Responsibilities */}
        {responsibilities.length > 0 && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Key Responsibilities
            </h2>
            <ul className="mt-4 space-y-3">
              {responsibilities.map((resp, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700">
                  <span className="flex-shrink-0 text-blue-600">✓</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {requirements.length > 0 && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Requirements</h2>
            <ul className="mt-4 space-y-3">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700">
                  <span className="flex-shrink-0 text-emerald-600">→</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits */}
        {benefits.length > 0 && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Benefits</h2>
            <ul className="mt-4 space-y-3">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700">
                  <span className="flex-shrink-0 text-yellow-600">⭐</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills/Tags */}
        {tags.length > 0 && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Required Skills
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Company Info */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">About Company</h2>
          <div className="mt-4">
            <p className="text-lg font-semibold text-slate-900">
              {job.company.name}
            </p>
            {job.company.description && (
              <p className="mt-3 text-slate-700 whitespace-pre-wrap">
                {job.company.description}
              </p>
            )}
            <p className="mt-4 text-sm text-slate-600">{job.company.email}</p>
          </div>
        </div>

        {/* Application Steps */}
        <div className="mb-8 rounded-2xl border-2 border-blue-200 bg-blue-50 p-8">
          <h3 className="text-lg font-bold text-slate-900">Application Process</h3>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-slate-900">Submit Your CV</p>
                <p className="text-sm text-slate-600">
                  Provide your resume and basic information
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 text-white font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-slate-900">Assessment</p>
                <p className="text-sm text-slate-600">
                  Complete a secure screening exam
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 text-white font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-slate-900">Interview</p>
                <p className="text-sm text-slate-600">
                  Meet with our team for a final interview
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <Link
            href={`/apply/${job.id}`}
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Apply Now
          </Link>

          <Link
            href="/jobs"
            className="rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back to Jobs
          </Link>
        <div className="grid grid-cols-3 gap-6">

          {/* Left: main content */}
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

          {/* Right: quick info */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Info</h3>

              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-sky-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="text-sm font-semibold text-slate-800">{job.location}</p>
                </div>
              </div>

              {job.salary && (
                <div className="flex items-start gap-3">
                  <DollarSign size={15} className="text-sky-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Salary</p>
                    <p className="text-sm font-semibold text-slate-800">{job.salary}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar size={15} className={`mt-0.5 shrink-0 ${exp ? "text-red-400" : "text-sky-500"}`} />
                <div>
                  <p className="text-xs text-slate-400">Deadline</p>
                  <p className={`text-sm font-semibold ${exp ? "text-red-500" : "text-slate-800"}`}>
                    {job.deadline ? fmtDate(job.deadline) : "No deadline"}
                  </p>
                </div>
              </div>

              {job.slots && (
                <div className="flex items-start gap-3">
                  <Users size={15} className="text-sky-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Openings</p>
                    <p className="text-sm font-semibold text-slate-800">{job.slots} position{job.slots > 1 ? "s" : ""}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={13} className="text-sky-500" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skills &amp; Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.tags.split(",").map((tag) => (
                  <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom action bar — full width */}
        <div className="mt-6 bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            {!exp ? (
              <>
                <p className="text-white font-bold text-base">Ready to apply?</p>
                <p className="text-slate-400 text-sm mt-0.5">Submit your CV and complete a skill assessment.</p>
              </>
            ) : (
              <p className="text-slate-400 text-sm">This job posting has closed.</p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-slate-300 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </Link>
            {!exp && (
              <Link
                href={`/apply/${job.id}`}
                className="bg-sky-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-sky-400 transition-colors"
              >
                Apply Now →
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}