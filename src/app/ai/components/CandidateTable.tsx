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
}

interface CandidateTableProps {
  candidates: Candidate[];
}

export default function CandidateTable({ candidates }: CandidateTableProps) {
  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
        <span className="text-4xl">📭</span>
        <p className="mt-3 text-sm font-medium text-slate-400">
          No candidates found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Candidate
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Applied Role
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Score
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Percentage
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((c) => (
              <tr
                key={c.id}
                className="transition-colors hover:bg-slate-50/60"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.email}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600">{c.appliedRole}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">
                  {c.score}/{c.maxScore}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-800">
                  {c.percentage}%
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={c.status} size="sm" />
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/ai/candidate/${c.id}`}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-500"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-400">{c.email}</p>
              </div>
              <StatusBadge status={c.status} size="sm" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-slate-400">Role</p>
                <p className="font-medium text-slate-700">{c.appliedRole}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Score</p>
                <p className="font-medium text-slate-700">
                  {c.score}/{c.maxScore} ({c.percentage}%)
                </p>
              </div>
            </div>
            <Link
              href={`/ai/candidate/${c.id}`}
              className="mt-3 block w-full rounded-lg bg-slate-900 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-sky-500"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
