"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";

interface Candidate {
  id: string;
  name: string;
  email: string;
  appliedRole: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: "PASS" | "FAIL";
  evaluatedAt: string;
}

interface CandidateTableProps {
  candidates: Candidate[];
  jobId: string;
}

export default function CandidateTable({ candidates, jobId }: CandidateTableProps) {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-white rounded-5xl border border-[#E2E8F0]">
        <div className="w-16 h-16 rounded-2xl bg-[#F4F7FB] border border-[#E2E8F0] flex items-center justify-center text-3xl mx-auto mb-4">
          📋
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-[#64748B]">
          No candidates match the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-5xl overflow-hidden shadow-sm">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F4F7FB]/50 border-b border-[#E2E8F0]">
              {["Candidate", "Applied Role", "Score", "Percentage", "Status", "Date", "Action"].map((h) => (
                <th
                  key={h}
                  className="px-8 py-5 text-left text-xs font-black uppercase tracking-widest text-[#64748B] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F4F7FB]/30 transition-colors duration-150"
              >
                <td className="px-8 py-6">
                  <div>
                    <p className="font-black text-[#0F172A] text-sm m-0">{c.name}</p>
                    <p className="text-xs text-[#64748B] m-0 mt-0.5 font-medium">{c.email}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-black uppercase tracking-widest text-[#1F7FB2] bg-[#EFF6FF] border border-[#3AB6D9]/20 px-3 py-1.5 rounded-full">
                    {c.appliedRole}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-black text-[#0F172A]">
                    {c.score}/{c.maxScore}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <div className="text-sm font-black text-[#0F172A] mb-1.5">
                      {c.percentage.toFixed(1)}%
                    </div>
                    <div className="h-1.5 w-20 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(c.percentage, 100)}%`,
                          background:
                            c.percentage >= 70
                              ? "linear-gradient(90deg,#22C55E,#16A34A)"
                              : c.percentage >= 50
                              ? "linear-gradient(90deg,#EAB308,#CA8A04)"
                              : "linear-gradient(90deg,#EF4444,#DC2626)",
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <StatusBadge status={c.status} size="sm" />
                </td>
                <td className="px-8 py-6 text-xs font-semibold text-[#64748B] whitespace-nowrap">
                  {c.evaluatedAt}
                </td>
                <td className="px-8 py-6">
                  <Link
                    href={`/ai/candidate/${c.id}?jobId=${jobId}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all duration-200 hover:brightness-110 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#0F3D5E,#2C89B8)" }}
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden p-4 flex flex-col gap-3">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="border border-[#E2E8F0] rounded-4xl p-6 bg-[#F4F7FB]/40 hover:bg-[#F4F7FB] transition-colors duration-150"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-black text-[#0F172A] text-sm m-0">{c.name}</p>
                <p className="text-xs text-[#64748B] m-0 mt-0.5 font-medium">{c.email}</p>
              </div>
              <StatusBadge status={c.status} size="sm" />
            </div>
            <div className="flex gap-3 justify-between items-center">
              <span className="text-sm font-black text-[#0F172A]">
                {c.score}/{c.maxScore} · {c.percentage.toFixed(1)}%
              </span>
              <Link
                href={`/ai/candidate/${c.id}?jobId=${jobId}`}
                className="px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ background: "linear-gradient(135deg,#0F3D5E,#2C89B8)" }}
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
