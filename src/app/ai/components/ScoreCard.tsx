"use client";

import type { ReactNode } from "react";

interface ScoreCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  accent?: string;
  highlight?: boolean;
}

export default function ScoreCard({
  label,
  value,
  subtext,
  icon,
  accent = "#1F7FB2",
  highlight = false,
}: ScoreCardProps) {
  return (
    <div
      className="relative bg-white rounded-4xl border border-[#E2E8F0] p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-default"
      style={{
        boxShadow: highlight
          ? `0 8px 32px ${accent}20`
          : "0 2px 12px rgba(15,23,42,0.05)",
        background: highlight
          ? `linear-gradient(135deg, ${accent}12 0%, ${accent}06 100%)`
          : "white",
        borderColor: highlight ? `${accent}40` : "#E2E8F0",
      }}
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-[32px]"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}70)` }}
      />

      <div className="flex items-start justify-between mb-5">
        <span className="text-xs font-black uppercase tracking-widest text-[#64748B]">
          {label}
        </span>
        {icon && (
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: accent }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="text-4xl font-black text-[#0F172A] leading-none tracking-tight mb-2">
        {value}
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-[#64748B] font-semibold">{subtext}</p>
      )}
    </div>
  );
}
