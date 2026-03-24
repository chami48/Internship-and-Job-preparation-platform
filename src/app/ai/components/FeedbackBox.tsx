"use client";

interface FeedbackBoxProps {
  feedback: string;
  title?: string;
  type?: "ai" | "info" | "success" | "warning";
}

const typeConfig = {
  ai: {
    icon: "🤖",
    bg: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)",
    border: "rgba(31,127,178,0.25)",
    titleColor: "#1F7FB2",
    label: "AI FEEDBACK",
  },
  info: {
    icon: "💡",
    bg: "linear-gradient(135deg, #F8FAFC 0%, #F4F7FB 100%)",
    border: "#E2E8F0",
    titleColor: "#475569",
    label: "FEEDBACK",
  },
  success: {
    icon: "✅",
    bg: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
    border: "rgba(34,197,94,0.25)",
    titleColor: "#15803D",
    label: "FEEDBACK",
  },
  warning: {
    icon: "⚠️",
    bg: "linear-gradient(135deg, #FFFBEB 0%, #FEF9C3 100%)",
    border: "rgba(234,179,8,0.25)",
    titleColor: "#A16207",
    label: "FEEDBACK",
  },
};

export default function FeedbackBox({ feedback, title, type = "ai" }: FeedbackBoxProps) {
  const c = typeConfig[type];
  return (
    <div
      className="rounded-4xl p-8"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
          style={{ background: `${c.border.replace("0.25", "0.15")}`, border: `1px solid ${c.border}` }}
        >
          {c.icon}
        </div>
        <span
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: c.titleColor }}
        >
          {title ?? c.label}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[#334155] m-0 font-medium">
        {feedback}
      </p>
    </div>
  );
}
