"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ai-card { animation: fadeUp 0.4s ease both; }
`;

function EvaluateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [appId, setAppId] = useState(searchParams.get("applicationId") ?? "");
  const [result, setResult] = useState<{ success: boolean; passed: boolean; percentage: number; evaluationResultId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluate = api.ai.evaluate.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
      setResult(null);
    },
  });

  const handleEvaluate = () => {
    if (!appId.trim()) return;
    setResult(null);
    setError(null);
    evaluate.mutate({ applicationId: appId.trim() });
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "3rem 1rem" }}>
      <div className="ai-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.7)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 10, padding: "6px 14px", marginBottom: 16, fontSize: "0.65rem", fontWeight: 700, color: "#0369A1", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0EA5E9", display: "inline-block" }} />
          AI Evaluation Trigger
        </div>
        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>
          Trigger AI Evaluation
        </h1>
        <p style={{ marginTop: 8, color: "#94A3B8", fontSize: "0.875rem" }}>
          Enter an applicationId with a submitted exam to run Gemini AI evaluation.
        </p>
      </div>

      <div className="ai-card" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 20, padding: "1.75rem", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", animationDelay: "60ms" }}>
        <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
          Application ID
        </label>
        <input
          type="text"
          value={appId}
          onChange={(e) => setAppId(e.target.value)}
          placeholder="e.g. cmabcdef1234..."
          style={{ width: "100%", padding: "12px 14px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: "0.875rem", color: "#0F172A", outline: "none", marginBottom: 16, fontFamily: "monospace" }}
        />
        <button
          onClick={handleEvaluate}
          disabled={evaluate.isPending || !appId.trim()}
          style={{
            width: "100%",
            padding: "14px 24px",
            background: evaluate.isPending ? "#94A3B8" : "#1E3A5F",
            color: "white",
            borderRadius: 12,
            border: "none",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: evaluate.isPending || !appId.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {evaluate.isPending ? (
            <>
              <svg style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                <path fill="white" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Running Gemini AI Evaluation…
            </>
          ) : (
            "🤖 Run AI Evaluation"
          )}
        </button>
      </div>

      {error && (
        <div className="ai-card" style={{ marginTop: 20, background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 16, padding: "16px 20px", animationDelay: "0ms" }}>
          <p style={{ color: "#B91C1C", fontWeight: 700, fontSize: "0.875rem", margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {result && (
        <div className="ai-card" style={{ marginTop: 20, background: result.passed ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)" : "linear-gradient(135deg, #FFF7ED, #FEE2E2)", border: `1px solid ${result.passed ? "#BBF7D0" : "#FECACA"}`, borderRadius: 20, padding: "1.5rem", animationDelay: "0ms" }}>
          <p style={{ fontWeight: 800, fontSize: "1rem", color: result.passed ? "#15803D" : "#B91C1C", marginBottom: 12 }}>
            {result.passed ? "✅ PASSED" : "❌ FAILED"} — {result.percentage.toFixed(1)}%
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => router.push(`/ai/result?applicationId=${appId}`)}
              style={{ padding: "11px 20px", background: "#1E3A5F", color: "white", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}
            >
              View Student Result Page →
            </button>
            <button
              onClick={() => router.push(`/ai/evaluation-details?applicationId=${appId}`)}
              style={{ padding: "11px 20px", background: "white", color: "#1E3A5F", borderRadius: 12, border: "1.5px solid #CBD5E1", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}
            >
              View Evaluation Details →
            </button>
          </div>
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
        <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>Loading…</div>}>
          <EvaluateContent />
        </Suspense>
      </main>
    </>
  );
}
