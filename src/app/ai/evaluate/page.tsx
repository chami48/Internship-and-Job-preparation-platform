"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Zap, CheckCircle2, XCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes stepIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes progressFill {
    from { width: 0%; }
    to   { width: 100%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }

  .ai-card   { animation: fadeUp 0.45s ease both; }
  .step-item { animation: stepIn 0.35s ease both; }
`;

const STEPS = [
  "Receiving submitted answers",
  "Scoring MCQ questions",
  "Analysing scenario answers",
  "Generating overall feedback",
];

type EvalState = "idle" | "evaluating" | "done" | "error";

function EvaluateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlAppId = searchParams.get("applicationId") ?? "";

  // Manual-trigger fallback (admin use — shown only when no applicationId in URL)
  const [manualAppId, setManualAppId] = useState("");

  const [evalState, setEvalState] = useState<EvalState>("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<{
    success: boolean;
    passed: boolean;
    percentage: number;
    evaluationResultId: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasTriggered = useRef(false);

  const evaluate = api.ai.evaluate.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setEvalState("done");
      setActiveStep(STEPS.length);
    },
    onError: (err) => {
      const appId = urlAppId || manualAppId;
      if (err.message.includes("already been evaluated")) {
        // Background evaluation already ran — redirect to result
        router.push(`/ai/result?applicationId=${appId}`);
        return;
      }
      setErrorMsg(err.message);
      setEvalState("error");
    },
  });

  const triggerEvaluation = (applicationId: string) => {
    if (!applicationId.trim()) return;
    setEvalState("evaluating");
    setActiveStep(0);
    setResult(null);
    setErrorMsg(null);
    evaluate.mutate({ applicationId: applicationId.trim() });
  };

  // Animate steps while evaluating
  useEffect(() => {
    if (evalState !== "evaluating") return;
    const intervals: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      intervals.push(setTimeout(() => setActiveStep(i), i * 2800));
    });
    return () => intervals.forEach(clearTimeout);
  }, [evalState]);

  // Auto-trigger when applicationId is in the URL
  useEffect(() => {
    if (urlAppId && !hasTriggered.current) {
      hasTriggered.current = true;
      triggerEvaluation(urlAppId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlAppId]);

  // Auto-redirect to result page 1.5s after completion
  useEffect(() => {
    if (evalState !== "done" || !result) return;
    const appId = urlAppId || manualAppId;
    if (appId) {
      try { localStorage.setItem("ai_last_application_id", appId); } catch (_) { /* ignore */ }
    }
    const timer = setTimeout(() => {
      router.push(`/ai/result?applicationId=${appId}`);
    }, 1800);
    return () => clearTimeout(timer);
  }, [evalState, result, urlAppId, manualAppId, router]);

  const appId = urlAppId || manualAppId;
  const isAutoMode = Boolean(urlAppId);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 1rem" }}>

      {/* Header */}
      <div className="ai-card" style={{ marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.7)", border: "1px solid rgba(14,165,233,0.3)",
          borderRadius: 10, padding: "6px 14px", marginBottom: 16,
          fontSize: "0.65rem", fontWeight: 700, color: "#0369A1",
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0EA5E9", display: "inline-block", animation: "pulse 1.4s infinite" }} />
          AI Evaluation
        </div>
        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "2.2rem", fontWeight: 700, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
          {evalState === "evaluating" ? "Evaluating Your Exam…" :
           evalState === "done"       ? (result?.passed ? "Evaluation Complete ✓" : "Evaluation Complete") :
           evalState === "error"      ? "Evaluation Failed" :
           "AI Evaluation"}
        </h1>
        <p style={{ marginTop: 8, color: "#94A3B8", fontSize: "0.875rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {evalState === "evaluating"
            ? "Your answers are being evaluated. Please wait…"
            : evalState === "done"
            ? "Redirecting you to your result page…"
            : evalState === "error"
            ? "Something went wrong during evaluation."
            : "Trigger AI evaluation for a submitted exam."}
        </p>
      </div>

      {/* ── EVALUATING STATE ── */}
      {evalState === "evaluating" && (
        <div className="ai-card" style={{
          background: "white", border: "1px solid rgba(14,165,233,0.2)",
          borderRadius: 24, padding: "2rem", boxShadow: "0 4px 24px rgba(14,165,233,0.08)",
          animationDelay: "60ms",
        }}>
          {/* Big spinner */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{
              width: 72, height: 72,
              border: "4px solid #E0F2FE",
              borderTop: "4px solid #0EA5E9",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
            }} />
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: "#E0F2FE", borderRadius: 99, overflow: "hidden", marginBottom: 28 }}>
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #0EA5E9, #38BDF8)",
              borderRadius: 99,
              width: `${Math.min(((activeStep + 1) / STEPS.length) * 100, 95)}%`,
              transition: "width 2.5s ease",
            }} />
          </div>

          {/* Step list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {STEPS.map((label, i) => {
              const isDone    = i < activeStep;
              const isActive  = i === activeStep;
              const isPending = i > activeStep;
              return (
                <div
                  key={i}
                  className="step-item"
                  style={{ animationDelay: `${i * 80}ms`, display: "flex", alignItems: "center", gap: 14 }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 32, height: 32, flexShrink: 0, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isDone ? "#DCFCE7" : isActive ? "#E0F2FE" : "#F8FAFC",
                    border: `2px solid ${isDone ? "#86EFAC" : isActive ? "#0EA5E9" : "#E2E8F0"}`,
                    transition: "all 0.3s",
                  }}>
                    {isDone ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                    ) : isActive ? (
                      <svg style={{ width: 14, height: 14, animation: "spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(14,165,233,0.3)" strokeWidth="3" />
                        <path fill="#0EA5E9" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#CBD5E1", display: "inline-block" }} />
                    )}
                  </div>

                  {/* Label */}
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 700 : isDone ? 600 : 400,
                    color: isDone ? "#15803D" : isActive ? "#0F172A" : "#94A3B8",
                    transition: "all 0.3s",
                  }}>
                    {label}
                  </span>

                  {isActive && (
                    <span style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.08em", textTransform: "uppercase", animation: "pulse 1.2s infinite" }}>
                      IN PROGRESS
                    </span>
                  )}
                  {isDone && (
                    <span style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, color: "#15803D", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      DONE
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ marginTop: 24, textAlign: "center", fontSize: "0.75rem", color: "#CBD5E1", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            This may take 15–30 seconds
          </p>
        </div>
      )}

      {/* ── DONE STATE ── */}
      {evalState === "done" && result && (
        <div className="ai-card" style={{
          background: result.passed
            ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
            : "linear-gradient(135deg, #FFF7ED, #FEE2E2)",
          border: `1px solid ${result.passed ? "#86EFAC" : "#FECACA"}`,
          borderRadius: 24, padding: "2rem",
          animationDelay: "0ms",
        }}>
          {/* Icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: result.passed ? "#DCFCE7" : "#FEE2E2",
              border: `3px solid ${result.passed ? "#86EFAC" : "#FCA5A5"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem",
              animation: "float 3s ease-in-out infinite",
            }}>
              {result.passed
            ? <CheckCircle2 size={32} className="text-green-700" />
            : <XCircle size={32} className="text-red-700" />
          }
            </div>
          </div>

          <p style={{ textAlign: "center", fontFamily: "'Clash Display', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: result.passed ? "#15803D" : "#B91C1C", margin: 0 }}>
            {result.passed ? "PASSED" : "FAILED"} — {result.percentage.toFixed(1)}%
          </p>
          <p style={{ textAlign: "center", marginTop: 8, fontSize: "0.875rem", color: "#64748B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Redirecting to your result page…
          </p>

          {/* Manual redirect button in case auto-redirect is slow */}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => router.push(`/ai/result?applicationId=${appId}`)}
              style={{ padding: "13px 20px", background: "#1E3A5F", color: "white", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              View Result Now →
            </button>
            <button
              onClick={() => router.push(`/ai/evaluation-details?applicationId=${appId}`)}
              style={{ padding: "13px 20px", background: "white", color: "#1E3A5F", borderRadius: 12, border: "1.5px solid #CBD5E1", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              View Detailed Evaluation →
            </button>
          </div>
        </div>
      )}

      {/* ── ERROR STATE ── */}
      {evalState === "error" && (
        <div className="ai-card" style={{
          background: "#FEF2F2", border: "1px solid #FECACA",
          borderRadius: 20, padding: "1.5rem",
          animationDelay: "0ms",
        }}>
          <p style={{ color: "#B91C1C", fontWeight: 700, fontSize: "0.9rem", marginBottom: 16 }}>
            ⚠️ {errorMsg}
          </p>
          <button
            onClick={() => triggerEvaluation(appId)}
            style={{ padding: "11px 20px", background: "#1E3A5F", color: "white", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}
          >
            Retry Evaluation
          </button>
        </div>
      )}

      {/* ── MANUAL TRIGGER (admin fallback — only shown when no applicationId in URL) ── */}
      {!isAutoMode && evalState === "idle" && (
        <div className="ai-card" style={{
          background: "white", border: "1px solid #E2E8F0",
          borderRadius: 20, padding: "1.75rem",
          boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
          animationDelay: "60ms",
        }}>
          <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
            Application ID
          </label>
          <input
            type="text"
            value={manualAppId}
            onChange={(e) => setManualAppId(e.target.value)}
            placeholder="e.g. cmabcdef1234…"
            style={{ width: "100%", padding: "12px 14px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: "0.875rem", color: "#0F172A", outline: "none", marginBottom: 16, fontFamily: "monospace" }}
          />
          <button
            onClick={() => triggerEvaluation(manualAppId)}
            disabled={!manualAppId.trim()}
            style={{
              width: "100%", padding: "14px 24px",
              background: manualAppId.trim() ? "#1E3A5F" : "#94A3B8",
              color: "white", borderRadius: 12, border: "none",
              fontSize: "0.875rem", fontWeight: 700,
              cursor: manualAppId.trim() ? "pointer" : "not-allowed",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Zap size={14} /> Run Evaluation</span>
          </button>
        </div>
      )}

    </div>
  );
}

export default function EvaluatePage() {
  return (
    <>
      <style>{PAGE_STYLES}</style>
      <main style={{ minHeight: "100vh", background: "#EEF6FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Suspense fallback={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#94A3B8", fontSize: "0.875rem" }}>
            Loading…
          </div>
        }>
          <EvaluateContent />
        </Suspense>
      </main>
    </>
  );
}
