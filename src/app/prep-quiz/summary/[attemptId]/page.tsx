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

  const getTopicLabel = (text: string) => {
    const value = text.toLowerCase();

    if (/react|jsx|component|hook|state|props/.test(value)) return "React & UI";
    if (/sql|database|query|table|schema|index/.test(value)) return "SQL & Databases";
    if (/array|linked list|stack|queue|tree|graph|hash|map/.test(value)) return "Data Structures";
    if (/algorithm|time complexity|big o|sort|search|recursion/.test(value)) return "Algorithms";
    if (/api|http|rest|request|response|status code/.test(value)) return "Web Fundamentals";
    if (/oop|class|object|inheritance|polymorphism|encapsulation/.test(value)) return "OOP & Design";
    if (/test|unit|integration|mock|assert/.test(value)) return "Testing";
    if (/network|tcp|udp|dns|latency/.test(value)) return "Networking";
    if (/security|auth|encrypt|hashing|jwt|csrf/.test(value)) return "Security";
    if (/docker|ci\/cd|pipeline|deploy|devops/.test(value)) return "DevOps";

    return "General";
  };

  const topicStats = questions.reduce(
    (acc: Record<string, { total: number; correct: number }>, q: any) => {
      const topic = getTopicLabel(q.question || "");
      const correctKey = q.options.find((o: any) => o.isCorrect)?.key;
      const isCorrect = q.userAnswer && q.userAnswer === correctKey;

      const current = acc[topic] || { total: 0, correct: 0 };
      current.total += 1;
      if (isCorrect) current.correct += 1;
      acc[topic] = current;

      return acc;
    },
    {}
  );

  const clampPercent = (value: number) => Math.min(95, Math.max(5, value));

  const topicRows = Object.entries(topicStats).map(([topic, stat]) => {
    const accuracyBase = stat.total === 0
      ? 0
      : Math.round(((stat.correct + 1) / (stat.total + 2)) * 100);

    return { topic, ...stat, accuracy: clampPercent(accuracyBase) };
  });

  const strengths = [...topicRows].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3);
  const weaknesses = [...topicRows].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  const recommendedTopic = weaknesses[0]?.topic || strengths[0]?.topic || "Mixed Practice";

  const topicToQuizMap: Record<string, { id: string; title: string }> = {
    "React & UI": { id: "web", title: "Web Development" },
    "SQL & Databases": { id: "db", title: "Databases" },
    "Data Structures": { id: "ds", title: "Data Structures" },
    Algorithms: { id: "algo", title: "Algorithms" },
    "Web Fundamentals": { id: "web", title: "Web Development" },
    "OOP & Design": { id: "oop", title: "Object-Oriented Programming" },
    Testing: { id: "se", title: "Software Engineering" },
    Networking: { id: "net", title: "Computer Networks" },
    Security: { id: "cyber", title: "Cyber Security" },
    DevOps: { id: "se", title: "Software Engineering" },
    General: { id: "se", title: "Software Engineering" },
  };

  const recommendedQuiz = topicToQuizMap[recommendedTopic] ?? {
    id: "se",
    title: "Software Engineering",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#0F172A] selection:text-white">
      <style>{`
        :root {
          --quiz-ink: #0F172A;
          --quiz-soft: #F8FAFC;
          --quiz-card: #FFFFFF;
          --quiz-muted: #64748B;
          --quiz-accent: #0EA5E9;
          --quiz-accent-2: #22C55E;
        }
        .summary-shell { font-family: var(--font-sans), ui-sans-serif, system-ui; }
        .summary-fade { animation: summaryFade 0.7s ease-out both; }
        @keyframes summaryFade {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .glass-card {
          background: #F1F5F9;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
        }
        .score-ring {
          background: conic-gradient(#0EA5E9 ${scorePercent}%, rgba(148, 163, 184, 0.2) 0);
        }
      `}</style>

      <main className="summary-shell max-w-4xl mx-auto px-6 py-12">
        <div className="summary-fade relative">
          <div className="glass-card rounded-[22px] p-7 md:p-9">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-[var(--quiz-ink)]">Assessment Completed</h1>
              <p className="mt-2 text-xs text-[var(--quiz-muted)]">
                You have finished the {attempt.role.replace(/_/g, " ")} evaluation.
              </p>
            </div>

            <div className="mt-7 flex flex-col items-center">
              <div className="relative h-36 w-36 rounded-full score-ring p-[7px]">
                <div className="h-full w-full rounded-full bg-white flex flex-col items-center justify-center shadow-[0_12px_30px_rgba(15,23,42,0.1)]">
                  <span className="text-3xl font-semibold text-[var(--quiz-ink)]">{scorePercent}%</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Score</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500 font-semibold">
                {attempt.score} / {total} Points
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total", value: total, color: "text-[var(--quiz-ink)]" },
                { label: "Correct", value: correct, color: "text-emerald-600" },
                { label: "Incorrect", value: incorrect, color: "text-rose-500" },
                { label: "Unanswered", value: unanswered, color: "text-amber-500" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-[#F8FAFC] px-4 py-3 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">{stat.label}</p>
                  <p className={`mt-2 text-base font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Top strengths</p>
              <p className="mt-2 text-xs text-slate-500">Highest accuracy topics based on this attempt.</p>
              <div className="mt-4 space-y-3">
                {strengths.map((row) => (
                  <div key={row.topic} className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2">
                    <span className="text-xs font-semibold text-emerald-700">{row.topic}</span>
                    <span className="text-[11px] font-semibold text-emerald-700">{row.accuracy}%</span>
                  </div>
                ))}
                {!strengths.length && (
                  <p className="text-xs text-slate-400">Answer more questions to unlock strengths.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Focus areas</p>
              <p className="mt-2 text-xs text-slate-500">Lowest accuracy topics to improve next.</p>
              <div className="mt-4 space-y-3">
                {weaknesses.map((row) => (
                  <div key={row.topic} className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/60 px-3 py-2">
                    <span className="text-xs font-semibold text-rose-700">{row.topic}</span>
                    <span className="text-[11px] font-semibold text-rose-700">{row.accuracy}%</span>
                  </div>
                ))}
                {!weaknesses.length && (
                  <p className="text-xs text-slate-400">Great job! No weak areas detected.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Recommended next quiz</p>
              <p className="mt-2 text-xs text-slate-500">Targeted practice based on your results.</p>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-800">{recommendedQuiz.title} Focus</p>
                <p className="mt-2 text-[11px] text-slate-500">
                  Targeted practice based on your lowest accuracy topics.
                </p>
              </div>
              <button
                onClick={() => router.push(`/prep-quiz/${recommendedQuiz.id}`)}
                className="mt-4 w-full px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:shadow-[0_16px_30px_rgba(15,23,42,0.18)] transition"
              >
                Start recommended quiz
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push(`/prep-quiz/result/${attemptId}`)}
              className="w-full sm:w-auto px-7 py-3 bg-[#0F172A] text-white rounded-xl font-semibold text-xs hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-all"
            >
              Review Detailed Results
            </button>
            <button
              onClick={() => router.push("/prep-quiz")}
              className="w-full sm:w-auto px-7 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
