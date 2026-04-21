"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const formatDate = (value: string | Date) => {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatRole = (role: string) =>
  role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function PrepQuizHistoryPage() {
  const router = useRouter();
  const { data, isLoading } = api.prepQuiz.getMyAttempts.useQuery();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#0F172A] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <main className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0F172A]/5 border border-[#0F172A]/10 text-[9px] font-bold text-[#0F172A] uppercase tracking-[0.2em] mb-3">
              <span className="w-1 h-1 rounded-full bg-[#0F172A] animate-pulse"></span>
              Attempt History
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0F172A] mb-3">
              My Quiz Attempts
            </h1>
            <p className="text-slate-400 text-[13px] max-w-xl leading-relaxed font-medium">
              Review past assessments, track progress, and revisit answers any time.
            </p>
          </div>

          <button
            onClick={() => router.push("/prep-quiz")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-900 transition"
          >
            Back to quizzes
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7M4 12h16"/></svg>
          </button>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="p-10 text-center text-sm text-slate-500">Loading attempts...</div>
          ) : !data?.length ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-sm font-semibold text-slate-700">No attempts yet</p>
              <p className="mt-2 text-xs text-slate-500">Start a quiz to see your results here.</p>
              <button
                onClick={() => router.push("/prep-quiz")}
                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Start a quiz
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {data.map((attempt) => {
                const total = attempt._count?.answers ?? 0;
                const accuracy = total ? Math.round((attempt.score / total) * 100) : 0;

                return (
                  <div
                    key={attempt.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">{formatRole(attempt.role)}</p>
                        <h2 className="mt-2 text-base font-semibold text-slate-900">Score {attempt.score} / {total}</h2>
                        <p className="mt-1 text-xs text-slate-500">Completed on {formatDate(attempt.createdAt)}</p>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-3">
                        <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                          {accuracy}% accuracy
                        </div>
                        <button
                          onClick={() => router.push(`/prep-quiz/result/${attempt.id}`)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:shadow-[0_16px_30px_rgba(15,23,42,0.18)] transition"
                        >
                          Review answers
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
