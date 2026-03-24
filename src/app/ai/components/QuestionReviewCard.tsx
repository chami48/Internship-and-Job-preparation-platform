"use client";

import FeedbackBox from "./FeedbackBox";

interface QuestionReviewCardProps {
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  expectedAnswer: string;
  score: number;
  maxMarks: number;
  aiFeedback: string;
}

export default function QuestionReviewCard({
  questionNumber,
  questionText,
  studentAnswer,
  expectedAnswer,
  score,
  maxMarks,
  aiFeedback,
}: QuestionReviewCardProps) {
  const pct = maxMarks > 0 ? (score / maxMarks) * 100 : 0;
  const isGood = pct >= 70;
  const isMid = pct >= 40 && pct < 70;
  const scoreColor = isGood ? "#15803D" : isMid ? "#A16207" : "#B91C1C";
  const scoreBg = isGood ? "#DCFCE7" : isMid ? "#FEF9C3" : "#FEE2E2";
  const scoreBorder = isGood ? "#BBF7D0" : isMid ? "#FEF08A" : "#FECACA";
  const barGradient = isGood
    ? "linear-gradient(90deg, #22C55E, #16A34A)"
    : isMid
    ? "linear-gradient(90deg, #EAB308, #CA8A04)"
    : "linear-gradient(90deg, #EF4444, #DC2626)";

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-4xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div
        className="px-8 py-5 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg, #0F172A 0%, #1F3A5F 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black"
            style={{
              background: "rgba(58,182,217,0.2)",
              border: "1px solid rgba(58,182,217,0.4)",
              color: "#3AB6D9",
            }}
          >
            {questionNumber}
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-white/50">
            Question {questionNumber}
          </span>
        </div>
        <span
          className="rounded-full px-4 py-1.5 text-xs font-black border"
          style={{ background: scoreBg, color: scoreColor, borderColor: scoreBorder }}
        >
          {score}/{maxMarks} pts
        </span>
      </div>

      <div className="p-8 flex flex-col gap-6">
        {/* Question text */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#64748B] mb-2">
            Question
          </p>
          <p className="text-base text-[#0F172A] leading-relaxed font-medium m-0">
            {questionText}
          </p>
        </div>

        <div className="h-px bg-[#F1F5F9]" />

        {/* Score bar */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#64748B]">
              Score
            </span>
            <span className="text-xs font-black" style={{ color: scoreColor }}>
              {pct.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: barGradient }}
            />
          </div>
        </div>

        {/* Answer columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student answer */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#64748B] mb-2">
              Your Answer
            </p>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-sm text-[#334155] leading-relaxed min-h-15">
              {studentAnswer || (
                <span className="text-[#CBD5E1] italic">No answer provided</span>
              )}
            </div>
          </div>
          {/* Expected answer */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#64748B] mb-2">
              Expected Answer
            </p>
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 text-sm text-[#166534] leading-relaxed min-h-15">
              {expectedAnswer || (
                <span className="text-[#CBD5E1] italic">—</span>
              )}
            </div>
          </div>
        </div>

        {/* AI Feedback */}
        <FeedbackBox feedback={aiFeedback} type="ai" />
      </div>
    </div>
  );
}
