"use client";

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: "ALL" | "PASS" | "FAIL";
  onStatusChange: (val: "ALL" | "PASS" | "FAIL") => void;
  minScore: string;
  onMinScoreChange: (val: string) => void;
  totalCount?: number;
}

export default function SearchFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  minScore,
  onMinScoreChange,
  totalCount,
}: SearchFilterBarProps) {
  const statusColors: Record<string, { activeBg: string; activeColor: string; activeBorder: string }> = {
    ALL:  { activeBg: "#EFF6FF", activeColor: "#1F7FB2", activeBorder: "#3AB6D9" },
    PASS: { activeBg: "#DCFCE7", activeColor: "#15803D", activeBorder: "#BBF7D0" },
    FAIL: { activeBg: "#FEE2E2", activeColor: "#B91C1C", activeBorder: "#FECACA" },
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-4xl px-8 py-5 flex flex-wrap gap-4 items-center shadow-sm">
      {/* Search */}
      <div className="relative flex-1 min-w-50">
        <svg
          width="15"
          height="15"
          fill="none"
          stroke="#94A3B8"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#F4F7FB] border border-[#E2E8F0] rounded-2xl text-sm text-[#0F172A] font-medium outline-none focus:border-[#3AB6D9] focus:ring-2 focus:ring-[#3AB6D9]/20 transition-all placeholder:text-[#94A3B8]"
        />
      </div>

      {/* Status pills */}
      <div className="flex gap-2">
        {(["ALL", "PASS", "FAIL"] as const).map((s) => {
          const active = statusFilter === s;
          const c = statusColors[s]!;
          return (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all duration-200 hover:brightness-105 active:scale-95"
              style={{
                background: active ? c.activeBg : "transparent",
                color: active ? c.activeColor : "#94A3B8",
                borderColor: active ? c.activeBorder : "#E2E8F0",
              }}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Min score */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-black uppercase tracking-widest text-[#64748B] whitespace-nowrap">
          Min %
        </span>
        <input
          type="number"
          min={0}
          max={100}
          placeholder="0"
          value={minScore}
          onChange={(e) => onMinScoreChange(e.target.value)}
          className="w-16 px-3 py-3 bg-[#F4F7FB] border border-[#E2E8F0] rounded-2xl text-sm text-[#0F172A] font-bold outline-none focus:border-[#3AB6D9] focus:ring-2 focus:ring-[#3AB6D9]/20 transition-all"
        />
      </div>

      {totalCount !== undefined && (
        <span className="ml-auto text-xs font-black uppercase tracking-widest text-[#64748B] whitespace-nowrap">
          {totalCount} candidate{totalCount !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
