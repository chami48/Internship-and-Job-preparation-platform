//src/app/prep-quiz/result/[attemptId]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();

  const attemptId = params.attemptId as string;

  const { data, isLoading } = api.prepQuiz.getAttempt.useQuery({
    attemptId,
  });

  if (isLoading) {
    return <div className="p-10 text-center">Loading result...</div>;
  }

  if (!data) {
    return <div className="p-10 text-center">Result not found</div>;
  }

  const { attempt, questions } = data;
  const total = questions.length;
  const answered = questions.filter((q: any) => !!q.userAnswer).length;
  const correct = questions.filter((q: any) => {
    const correctKey = q.options.find((o: any) => o.isCorrect)?.key;
    return q.userAnswer && q.userAnswer === correctKey;
  }).length;
  const incorrect = answered - correct;
  const unanswered = total - answered;
  const scorePercent = total === 0 ? 0 : Math.round((attempt.score / total) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-7 py-6 md:px-10 md:py-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300 font-semibold">Quiz Result</p>
                <h1 className="mt-2 text-2xl font-semibold">{attempt.role} Assessment</h1>
                <p className="mt-2 text-sm text-slate-300">
                  Review your answers and see where to improve.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Score</p>
                  <p className="mt-1 text-3xl font-semibold">
                    {attempt.score} / {total}
                  </p>
                  <p className="text-xs text-slate-300">{scorePercent}% accuracy</p>
                </div>
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl font-semibold">{scorePercent}%</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-t border-slate-100">
            <div className="p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Total</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{total}</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Correct</p>
              <p className="mt-2 text-lg font-semibold text-emerald-600">{correct}</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Incorrect</p>
              <p className="mt-2 text-lg font-semibold text-rose-500">{incorrect}</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Unanswered</p>
              <p className="mt-2 text-lg font-semibold text-amber-500">{unanswered}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Detailed Review</h2>
            <p className="text-xs text-slate-500">Small hints are highlighted for quick scanning.</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Correct
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500" /> Your answer
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> Unanswered
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {questions.map((q: any, index: number) => {
            const userAnswer = q.userAnswer;
            const correctKey = q.options.find((o: any) => o.isCorrect)?.key;
            const isAnswered = !!q.isAnswered;
            const isCorrect = userAnswer && userAnswer === correctKey;

            return (
              <div
                key={q.id}
                className={`border rounded-2xl p-5 md:p-6 shadow-sm bg-white ${
                  !isAnswered ? "border-amber-200 bg-amber-50/50" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Question {index + 1}</p>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900 leading-relaxed">{q.question}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      !isAnswered
                        ? "bg-amber-200 text-amber-900"
                        : isCorrect
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {!isAnswered ? "Unanswered" : isCorrect ? "Correct" : "Needs review"}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {q.options.map((opt: any) => {
                    const isUser = userAnswer === opt.key;
                    const isCorrectOption = opt.key === correctKey;

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-xs md:text-sm ${
                          isCorrectOption
                            ? "border-emerald-300 bg-emerald-50"
                            : isUser
                            ? "border-rose-300 bg-rose-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                          {opt.key}
                        </span>
                        <span className="flex-1 text-slate-700">{opt.text}</span>
                        {isCorrectOption && (
                          <span className="text-emerald-600 text-xs font-semibold">Correct</span>
                        )}
                        {isUser && !isCorrectOption && (
                          <span className="text-rose-600 text-xs font-semibold">Your answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Explanation:</span> {q.explanation || "No explanation provided."}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => router.push("/prep-quiz")}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => router.push("/prep-quiz")}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:shadow-lg transition"
          >
            Try Another Quiz
          </button>
        </div>
      </main>
    </div>
  );
}