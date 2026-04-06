"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { showAlert } from "~/app/components/common/alert";

export default function AgreementPage({
  params: paramsPromise,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const { jobId } = React.use(params);
  const searchParams = useSearchParams();
  const appId = searchParams.get("appId");

  const [checked, setChecked] = useState(false);

  const handleStart = () => {
    if (!checked) {
      void showAlert({
        icon: "warning",
        text: "You must agree before continuing.",
      });
      return;
    }

    if (!appId) {
      void showAlert({
        icon: "error",
        text: "Application ID missing. Please re-apply.",
      });
      return;
    }

    // ✅ FIXED HERE
    router.push(`/exam/${jobId}?appId=${appId}`);
  };

  return (
    <main className="min-h-[calc(100vh-140px)] bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,_#f8fafc,_#eef2f7)] px-4 py-14">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
            Pre-Exam Agreement
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
            Exam Rules & Consent
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Review the proctoring rules before you verify your identity.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section>
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
                <p className="text-xs font-semibold tracking-[0.24em] text-sky-700 uppercase">
                  Mandatory Rules
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {[
                    "Fullscreen mode is mandatory.",
                    "Tab switching or opening other apps is not allowed.",
                    "Copy / Paste is disabled.",
                    "3 violations will terminate the exam.",
                    "Time limit: 25 minutes.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                Your webcam and activity will be monitored throughout the assessment.
              </div>
            </section>

            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Agreement Confirmation
                  </p>
                  <p className="text-xs text-slate-500">
                    Required to continue
                  </p>
                </div>
              </div>

              <label className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-700">
                  I agree to follow all exam rules and accept that violations can
                  end the assessment immediately.
                </span>
              </label>

              <button
                onClick={handleStart}
                className="mt-6 w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-500 disabled:opacity-50"
              >
                Verify Identification
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}