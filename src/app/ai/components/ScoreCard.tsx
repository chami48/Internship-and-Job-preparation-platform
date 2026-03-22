"use client";

interface ScoreCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  accent?: "sky" | "green" | "red" | "slate" | "amber";
}

const accentStyles = {
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  red: "border-red-200 bg-red-50 text-red-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
};

const iconBgStyles = {
  sky: "bg-sky-100 text-sky-600",
  green: "bg-emerald-100 text-emerald-600",
  red: "bg-red-100 text-red-600",
  slate: "bg-slate-100 text-slate-600",
  amber: "bg-amber-100 text-amber-600",
};

export default function ScoreCard({
  label,
  value,
  subtitle,
  icon,
  accent = "slate",
}: ScoreCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-shadow hover:shadow-md ${accentStyles[accent]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-60">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold leading-tight">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs font-medium opacity-50">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${iconBgStyles[accent]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
