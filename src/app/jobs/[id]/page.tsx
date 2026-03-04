import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";

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
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-semibold text-slate-600">Level</div>
            <div className="mt-2 text-lg font-bold text-slate-900">
              {job.level}
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
        </div>
      </div>
    </main>
  );
}