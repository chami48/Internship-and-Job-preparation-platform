"use client";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  scoreFilter: string;
  onScoreChange: (range: string) => void;
}

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  scoreFilter,
  onScoreChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      >
        <option value="all">All Statuses</option>
        <option value="PASS">Pass Only</option>
        <option value="FAIL">Fail Only</option>
      </select>

      {/* Score range filter */}
      <select
        value={scoreFilter}
        onChange={(e) => onScoreChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      >
        <option value="all">All Scores</option>
        <option value="90-100">90–100%</option>
        <option value="70-89">70–89%</option>
        <option value="50-69">50–69%</option>
        <option value="0-49">Below 50%</option>
      </select>
    </div>
  );
}
