import { api } from "~/trpc/server";
import Link from "next/link";

export default async function StudentProfilePage() {
  const profile = await api.profile.getProfile();
  const jobs = await api.job.list();

  const skills = profile?.skills
    ? profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  const fields = [
    profile?.name,
    profile?.studentId,
    profile?.degree,
    profile?.year,
    profile?.skills,
    profile?.github,
    profile?.linkedin,
    profile?.portfolio,
    profile?.bio,
    profile?.image,
  ];

  const filledFields = fields.filter(Boolean).length;
  const completion = Math.round((filledFields / fields.length) * 100);
  const displayName = profile?.name ?? "Student";
  const displayDegree = profile?.degree ?? "Degree not added";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "ST";

  const completionItems = [
    { label: "Setup account", done: Boolean(profile?.name && profile?.email), bonus: "+10%" },
    { label: "Upload profile photo", done: Boolean(profile?.image), bonus: "+5%" },
    { label: "Add personal info", done: Boolean(profile?.studentId && profile?.year), bonus: "+10%" },
    { label: "Add skills", done: Boolean(profile?.skills), bonus: "+20%" },
    { label: "Add biography", done: Boolean(profile?.bio), bonus: "+15%" },
    {
      label: "Connect social links",
      done: Boolean(profile?.github || profile?.linkedin || profile?.portfolio),
      bonus: "+30%",
    },
  ];

  const recentActivities: Array<{
    title: string;
    subtitle: string;
    time: string;
    tone: "sky" | "emerald" | "indigo";
    status: "applied" | "interview" | "selected" | "rejected";
  }> = (jobs ?? [])
    .filter((job) => job.applied)
    .slice(0, 3)
    .map((job) => {
      const status = job.examSubmitted ? "interview" : "applied";

      return {
        title: job.title ?? "Job Application",
        subtitle: job.examSubmitted
          ? "Exam completed. Interview pending."
          : "Application submitted successfully",
        time: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently",
        tone: job.examSubmitted ? "emerald" : "sky",
        status,
      };
    });

  const finishedSteps = completionItems.filter((item) => item.done).length;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8 md:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        .profile-shell {
          font-family: 'Manrope', sans-serif;
        }

        .profile-grid-bg {
          background-image: radial-gradient(circle, rgba(14, 165, 233, 0.12) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .shine-card {
          position: relative;
          overflow: hidden;
        }

        .shine-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.5) 50%, transparent 80%);
          transform: translateX(-120%);
          transition: transform 0.9s ease;
          pointer-events: none;
        }

        .shine-card:hover::before {
          transform: translateX(120%);
        }
      `}</style>

      <div className="profile-grid-bg profile-shell mx-auto grid w-full max-w-7xl gap-6 rounded-3xl p-2 lg:grid-cols-[1.65fr_1fr]">
        <section className="space-y-6">
          <article className="shine-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                {profile?.image ? (
                  <img
                    src={profile.image}
                    alt={displayName}
                    className="h-24 w-24 rounded-3xl object-cover ring-4 ring-sky-100"
                  />
                ) : (
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 text-3xl font-bold text-white ring-4 ring-sky-100">
                    {initials}
                  </div>
                )}

                <div>
                  <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sky-700">
                    Student Profile
                  </p>
                  <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    {displayName}
                  </h1>
                  <p className="mt-1 text-sm font-medium text-slate-500">{displayDegree}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/student/profile/edit"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/jobs"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-700"
                >
                  Explore Jobs
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Completion</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{completion}%</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Fields Done</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{filledFields}/{fields.length}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Skills Added</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{skills.length}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Checklist</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{finishedSteps}/6</p>
              </article>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Email</p>
                <p className="mt-2 break-all text-sm font-semibold text-slate-900">{profile?.email ?? "Not added"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Student ID</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{profile?.studentId ?? "Not added"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Year</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{profile?.year ?? "Not added"}</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-base font-bold text-slate-900">Skills and Biography</h2>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Skills</p>
              {skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-sky-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No skills added yet.</p>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Bio</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {profile?.bio ?? "No bio added yet."}
              </p>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-base font-bold text-slate-900">Professional Links</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">GitHub</p>
                {profile?.github ? (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm font-semibold text-sky-700 underline"
                  >
                    {profile.github}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-slate-500">Not added</p>
                )}
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">LinkedIn</p>
                {profile?.linkedin ? (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm font-semibold text-sky-700 underline"
                  >
                    {profile.linkedin}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-slate-500">Not added</p>
                )}
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Portfolio</p>
                {profile?.portfolio ? (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm font-semibold text-sky-700 underline"
                  >
                    {profile.portfolio}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-slate-500">Not added</p>
                )}
              </article>
            </div>
          </article>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Completion Tracker</h2>
            <div className="mt-5 flex items-center gap-4">
              <div
                className="inline-flex h-28 w-28 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#22c55e ${completion * 3.6}deg, #e2e8f0 0deg)`,
                }}
              >
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-extrabold text-slate-900">
                  {completion}%
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{filledFields}/{fields.length} completed</p>
                <p className="mt-1">Keep going to unlock a stronger profile score.</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {completionItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                      {item.done ? "✓" : "x"}
                    </span>
                    <span className={`text-sm font-semibold ${item.done ? "text-slate-900" : "text-slate-500"}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{item.bonus}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Action Center</h2>
            <div className="mt-4 space-y-3">
              <Link
                href="/student/profile/edit"
                className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-sky-300 hover:text-sky-700"
              >
                Update profile details
              </Link>
              <Link
                href="/jobs"
                className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-sky-300 hover:text-sky-700"
              >
                Browse opportunities
              </Link>
              <Link
                href="/exam"
                className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-sky-300 hover:text-sky-700"
              >
                Start an assessment
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              A quick view of your latest progress and actions.
            </p>

            <div className="mt-4 space-y-3">
              {recentActivities.map((activity) => (
                <article
                  key={activity.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${
                        activity.tone === "sky"
                          ? "bg-sky-500"
                          : activity.tone === "emerald"
                          ? "bg-emerald-500"
                          : "bg-indigo-500"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{activity.subtitle}</p>
                      <div className="mt-3">
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          <span className="text-center">Applied</span>
                          <span className="text-center">Interview</span>
                          <span className="text-center">Decision</span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <div
                            className={`h-2 rounded-full ${
                              activity.status === "applied" ||
                              activity.status === "interview" ||
                              activity.status === "selected" ||
                              activity.status === "rejected"
                                ? "bg-sky-500"
                                : "bg-slate-200"
                            }`}
                          />
                          <div
                            className={`h-2 rounded-full ${
                              activity.status === "interview" ||
                              activity.status === "selected" ||
                              activity.status === "rejected"
                                ? "bg-amber-400"
                                : "bg-slate-200"
                            }`}
                          />
                          <div
                            className={`h-2 rounded-full ${
                              activity.status === "selected"
                                ? "bg-emerald-500"
                                : activity.status === "rejected"
                                ? "bg-rose-500"
                                : "bg-slate-200"
                            }`}
                          />
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}