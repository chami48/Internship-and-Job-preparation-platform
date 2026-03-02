"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AgreementPage({
  params,
}: {
  params: { jobId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get("appId");

  const [checked, setChecked] = useState(false);

  const handleStart = () => {
    if (!checked) {
      alert("You must agree before continuing.");
      return;
    }

    if (!appId) {
      alert("Application ID missing. Please re-apply.");
      return;
    }

    router.push(`/exam/${params.jobId}?appId=${appId}`);
  };

  return (
    <main className="min-h-[calc(100vh-140px)] bg-white px-4 py-14">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        
        <h1 className="text-3xl font-bold text-slate-900">
          Exam Rules & Agreement
        </h1>

        <p className="mt-2 text-slate-600">
          Please read carefully before starting your assessment.
        </p>

        {/* Rules */}
        <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-6">
          <ul className="list-disc space-y-3 pl-5 text-sm text-slate-700">
            <li>Fullscreen mode is mandatory.</li>
            <li>Tab switching is not allowed.</li>
            <li>Copy / Paste is disabled.</li>
            <li>3 violations will terminate the exam.</li>
            <li>Time limit: 30 minutes.</li>
          </ul>
        </div>

        {/* Checkbox */}
        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
          />
          <span className="text-sm text-slate-700">
            I agree to follow all exam rules.
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleStart}
          className="mt-8 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-sky-500 transition-colors disabled:opacity-50"
        >
          Start Assessment
        </button>
      </div>
    </main>
  );
}