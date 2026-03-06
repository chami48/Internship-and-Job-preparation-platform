import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";
import { ArrowLeft, MapPin, Briefcase, Clock, Users, Calendar, DollarSign, Tag } from "lucide-react";

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