"use client";

interface StatusBadgeProps {
  status: "PASS" | "FAIL" | "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  size?: "sm" | "md" | "lg";
}

const config = {
  PASS:       { bg: "#DCFCE7", color: "#15803D", border: "#BBF7D0", dot: "#22C55E", label: "PASS" },
  FAIL:       { bg: "#FEE2E2", color: "#B91C1C", border: "#FECACA", dot: "#EF4444", label: "FAIL" },
  PENDING:    { bg: "#FEF9C3", color: "#A16207", border: "#FEF08A", dot: "#EAB308", label: "PENDING" },
  PROCESSING: { bg: "#DBEAFE", color: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6", label: "PROCESSING" },
  COMPLETED:  { bg: "#DCFCE7", color: "#15803D", border: "#BBF7D0", dot: "#22C55E", label: "COMPLETED" },
  FAILED:     { bg: "#FEE2E2", color: "#B91C1C", border: "#FECACA", dot: "#EF4444", label: "FAILED" },
};

const sizeClasses = {
  sm: "text-[10px] px-3 py-1",
  md: "text-[10px] px-4 py-1.5",
  lg: "text-xs px-5 py-2",
};

const dotSizeClasses = {
  sm: "w-1.5 h-1.5",
  md: "w-1.5 h-1.5",
  lg: "w-2 h-2",
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-black uppercase tracking-widest border ${sizeClasses[size]}`}
      style={{ background: c.bg, color: c.color, borderColor: c.border }}
    >
      <span
        className={`rounded-full flex-shrink-0 ${dotSizeClasses[size]}`}
        style={{ background: c.dot }}
      />
      {c.label}
    </span>
  );
}
