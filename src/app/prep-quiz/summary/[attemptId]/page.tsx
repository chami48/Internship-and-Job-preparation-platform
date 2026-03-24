//src/app/prep-quiz/summary/[attemptId]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function QuizSummaryPage() {
  const params = useParams();
  const router = useRouter();

  const attemptId = params.attemptId as string;

  const { data, isLoading } = api.prepQuiz.getAttempt.useQuery({
    attemptId,
  });

  if (isLoading) {
    return <div className="p-10 text-center">Loading summary...</div>;
  }

  if (!data) {
    return <div className="p-10 text-center">Summary not found</div>;
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#0F172A] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Card */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden mb-8">
          <div className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-[#0F172A]">Assessment Completed</h1>
            <p className="text-slate-500 text-sm mt-2">
              Well done! You have successfully finished the <span className="text-[#0F172A] font-semibold">{attempt.role}</span> evaluation.
            </p>

            <div className="mt-10 flex flex-col items-center">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64" cy="64" r="58"
                    stroke="currentColor" strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="64" cy="64" r="58"
                    stroke="currentColor" strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * scorePercent) / 100}
                    className="text-[#0F172A] transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#0F172A]">{scorePercent}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-100 divide-x divide-slate-100">
            <div className="p-6 text-center">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total</span>
              <span className="text-xl font-bold text-[#0F172A]">{total}</span>
            </div>
            <div className="p-6 text-center">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Correct</span>
              <span className="text-xl font-bold text-emerald-600">{correct}</span>
            </div>
            <div className="p-6 text-center">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Missed</span>
              <span className="text-xl font-bold text-rose-500">{incorrect}</span>
            </div>
            <div className="p-6 text-center">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Unanswered</span>
              <span className="text-xl font-bold text-amber-500">{unanswered}</span>
            </div>
          </div>
        </div>

        {/* Unified Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push(`/prep-quiz/result/${attemptId}`)}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0F172A] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
          >
            Review Detailed Results
          </button>
          <button
            onClick={() => router.push("/prep-quiz")}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#0F172A] border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Subtle Tip */}
        <div className="mt-12 p-5 bg-blue-50/50 rounded-xl border border-blue-100/50 flex gap-4 items-start">
           <div className="mt-1 p-2 bg-blue-500 rounded-lg text-white">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 10-2 0v1a1 1 0 102 0zM13.243 18.586a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM16 11.243l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414z" /></svg>
           </div>
           <div>
             <h4 className="text-sm font-semibold text-blue-900">Expert Tip</h4>
             <p className="text-xs text-blue-800/70 mt-1 leading-relaxed">
               Candidates who review their mistakes right after the test tend to perform 40% better on their next attempt. 
               Click "Review Detailed Results" to see where you can improve.
             </p>
           </div>
        </div>
      </main>
    </div>
  );
}
