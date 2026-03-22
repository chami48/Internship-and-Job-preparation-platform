"use client";

interface FeedbackBoxProps {
  title?: string;
  feedback: string;
  variant?: "info" | "success" | "warning";
}

const variantStyles = {
  info: "border-sky-200 bg-sky-50/60",
  success: "border-emerald-200 bg-emerald-50/60",
  warning: "border-amber-200 bg-amber-50/60",
};

const iconMap = {
  info: "💡",
  success: "✅",
  warning: "⚠️",
};

export default function FeedbackBox({
  title = "AI Feedback",
  feedback,
  variant = "info",
}: FeedbackBoxProps) {
  return (
    <div className={`rounded-2xl border p-5 ${variantStyles[variant]}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{iconMap[variant]}</span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          {title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{feedback}</p>
    </div>
  );
}
