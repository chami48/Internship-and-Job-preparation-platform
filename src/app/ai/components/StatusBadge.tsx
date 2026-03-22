"use client";

interface StatusBadgeProps {
  status: "PASS" | "FAIL" | "Shortlisted" | "Under Review" | "Rejected";
  size?: "sm" | "md" | "lg";
}

const statusStyles: Record<string, string> = {
  PASS: "bg-emerald-100 text-emerald-700 border-emerald-200",
  FAIL: "bg-red-100 text-red-700 border-red-200",
  Shortlisted: "bg-sky-100 text-sky-700 border-sky-200",
  "Under Review": "bg-amber-100 text-amber-700 border-amber-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${statusStyles[status] ?? "bg-slate-100 text-slate-700 border-slate-200"} ${sizeStyles[size]}`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          status === "PASS" || status === "Shortlisted"
            ? "bg-emerald-500"
            : status === "Under Review"
              ? "bg-amber-500"
              : "bg-red-500"
        }`}
      />
      {status}
    </span>
  );
}
