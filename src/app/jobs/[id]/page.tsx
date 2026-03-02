import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await db.job.findUnique({ where: { id: params.id } });
  if (!job) return notFound();

  return (
    <main className="min-h-[calc(100vh-140px)] bg-white px-4 py-14">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          {job.title}
        </h1>

        <p className="mt-2 text-slate-600">
          {job.company} • {job.location}
        </p>

        {/* Type & Level */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Type</div>
            <div className="mt-1 font-medium text-slate-900">
              {job.type}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Level</div>
            <div className="mt-1 font-medium text-slate-900">
              {job.level}
            </div>
          </div>
        </div>

        {/* Next Step */}
        <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <div className="text-sm font-semibold text-slate-900">
            Next Step
          </div>
          <div className="mt-2 text-sm text-slate-700">
            CV Details → Rules/Agreement → Secure Exam
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <Link
            href={`/apply/${job.id}`}
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
          >
            Apply Now
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}