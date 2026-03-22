"use client";

interface EvaluatedQuestion {
  id: string | number;
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  expectedAnswer: string;
  score: number;
  maxMarks: number;
  aiFeedback: string;
}

interface QuestionReviewCardProps {
  question: EvaluatedQuestion;
}

export default function QuestionReviewCard({
  question,
}: QuestionReviewCardProps) {
  const scorePercent = (question.score / question.maxMarks) * 100;
  const scoreColor =
    scorePercent >= 80
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : scorePercent >= 50
        ? "text-amber-600 bg-amber-50 border-amber-200"
        : "text-red-600 bg-red-50 border-red-200";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
            Q{question.questionNumber}
          </span>
          <h3 className="text-sm font-semibold text-slate-800">
            {question.questionText}
          </h3>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${scoreColor}`}
        >
          {question.score}/{question.maxMarks}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-4 p-5">
        {/* Student answer */}
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Your Answer
          </p>
          <p className="rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
            {question.studentAnswer}
          </p>
        </div>

        {/* Expected answer */}
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Expected Answer
          </p>
          <p className="rounded-xl bg-sky-50/60 p-3 text-sm leading-relaxed text-slate-700">
            {question.expectedAnswer}
          </p>
        </div>

        {/* AI feedback */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <span>🤖</span> AI Feedback
          </p>
          <p className="text-sm leading-relaxed text-amber-800">
            {question.aiFeedback}
          </p>
        </div>
      </div>
    </div>
  );
}
