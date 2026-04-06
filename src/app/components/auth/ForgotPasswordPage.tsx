"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

type Variant = "student" | "company";

type ForgotPasswordPageProps = {
  variant: Variant;
};

export default function ForgotPasswordPage({ variant }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [step, setStep] = useState<"request" | "verify" | "done">("request");
  const [error, setError] = useState("");

  const studentRequest = api.student.auth.requestPasswordReset.useMutation();
  const studentReset = api.student.auth.resetPassword.useMutation();
  const companyRequest = api.company.requestPasswordReset.useMutation();
  const companyReset = api.company.resetPassword.useMutation();

  const requestMutation = variant === "student" ? studentRequest : companyRequest;
  const resetMutation = variant === "student" ? studentReset : companyReset;

  const copy =
    variant === "student"
      ? {
          badge: "Student Access",
          title: "Reset your student password",
          subtitle: "We will send an OTP to your registered email.",
          leftTitle: "Get back on track",
          leftAccent: "in minutes",
          leftDesc: "Verify your email and set a new password to continue your applications.",
          loginHref: "/student/login",
          loginLabel: "Return to student login →",
          emailLabel: "SLIIT Email",
          emailPlaceholder: "ITXXXXXXX@my.sliit.lk",
          featureList: [
            { icon: "🔐", text: "Secure OTP verification" },
            { icon: "🧪", text: "Access your pending assessments" },
            { icon: "📊", text: "Track application progress" },
            { icon: "📌", text: "Keep your profile updated" },
          ],
        }
      : {
          badge: "Employer Portal",
          title: "Reset your company password",
          subtitle: "We will send an OTP to your registered email.",
          leftTitle: "Welcome back",
          leftAccent: "employers",
          leftDesc: "Verify your work email and set a new password to access your dashboard.",
          loginHref: "/company/comlogin",
          loginLabel: "Return to company login →",
          emailLabel: "Work Email",
          emailPlaceholder: "hr@company.com",
          featureList: [
            { icon: "📋", text: "Manage all active job posts" },
            { icon: "👥", text: "Review & shortlist applicants" },
            { icon: "📊", text: "Track your hiring pipeline" },
            { icon: "🔔", text: "Stay notified on updates" },
          ],
        };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #E2E8F0",
    borderRadius: 10,
    fontSize: "0.875rem",
    color: "#0F172A",
    background: "#F8FAFF",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#64748B",
    marginBottom: 6,
  };

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email.");
      return;
    }

    if (variant === "student" && !email.endsWith("@my.sliit.lk")) {
      setError("Please use your SLIIT student email.");
      return;
    }

    try {
      await requestMutation.mutateAsync({ email });
      setStep("verify");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetMutation.mutateAsync({ email, otp, newPassword });
      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    }
  };

  return (
    <>
      <style>{`
        .reg-input:focus { border-color: #0EA5E9 !important; box-shadow: 0 0 0 3px rgba(14,165,233,0.12) !important; background: #fff !important; }
        .reg-input::placeholder { color: #CBD5E1; }
        .reg-btn:hover:not(:disabled) { background: #0284C7 !important; box-shadow: 0 6px 20px rgba(14,165,233,0.35) !important; transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .reg-btn { transition: background 0.2s, box-shadow 0.2s, transform 0.18s; }
        .auth-shell { min-height: 100vh; display: flex; align-items: stretch; background: #F8FAFF; }
        .auth-left { flex: 0 0 420px; }
        .auth-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 3rem 2rem; overflow-y: auto; }
        @media (max-width: 980px) {
          .auth-shell { display: block; }
          .auth-left { display: none; }
          .auth-right { min-height: 100vh; padding: 2rem 1.2rem; }
        }
      `}</style>

      <div className="auth-shell">
        <div
          className="auth-left"
          style={{
            background: "linear-gradient(145deg, #0F172A 0%, #0C1A33 60%, #0D2340 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "3rem 2.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(14,165,233,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 6, padding: "5px 12px", marginBottom: 20, fontSize: "0.65rem", fontWeight: 700, color: "#38BDF8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#38BDF8" }} />
              {copy.badge}
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "white", margin: 0, lineHeight: 1.2, letterSpacing: "-0.03em" }}>
              {copy.leftTitle}
              <br />
              <span style={{ color: "#0EA5E9" }}>{copy.leftAccent}</span>
            </h1>

            <p style={{ marginTop: 14, fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 400 }}>
              {copy.leftDesc}
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {copy.featureList.map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ position: "relative", zIndex: 1, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
            <Link href={copy.loginHref} style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 600 }}>
              {copy.loginLabel}
            </Link>
          </div>
        </div>

        <div className="auth-right">
          <div style={{ width: "100%", maxWidth: 460 }}>
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.025em" }}>
                {copy.title}
              </h2>
              <p style={{ marginTop: 6, fontSize: "0.82rem", color: "#94A3B8", fontWeight: 400 }}>
                {copy.subtitle}
              </p>
            </div>

            {error && (
              <div style={{ background: "#FFF1F2", border: "1.5px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: "0.8rem", color: "#DC2626", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                ⚠ {error}
              </div>
            )}

            {step === "request" && (
              <form onSubmit={handleRequestOtp} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={labelStyle}>{copy.emailLabel}</label>
                  <input
                    className="reg-input"
                    type="email"
                    style={inputStyle}
                    placeholder={copy.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="reg-btn"
                  disabled={requestMutation.isPending}
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "13px",
                    background: "linear-gradient(135deg, #0EA5E9, #0284C7)",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                  }}
                >
                  {requestMutation.isPending ? "Sending OTP..." : "Send OTP →"}
                </button>
              </form>
            )}

            {step === "verify" && (
              <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={labelStyle}>OTP Code</label>
                  <input
                    className="reg-input"
                    style={inputStyle}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="reg-input"
                      type={showPw ? "text" : "password"}
                      style={{ ...inputStyle, paddingRight: 42 }}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center" }}
                    >
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="reg-input"
                      type={showCpw ? "text" : "password"}
                      style={{ ...inputStyle, paddingRight: 42 }}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCpw(!showCpw)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center" }}
                    >
                      <EyeIcon open={showCpw} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="reg-btn"
                  disabled={resetMutation.isPending}
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "13px",
                    background: "linear-gradient(135deg, #0EA5E9, #0284C7)",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                  }}
                >
                  {resetMutation.isPending ? "Resetting..." : "Reset Password →"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("request")}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#64748B",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Change email
                </button>
              </form>
            )}

            {step === "done" && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.6rem" }}>✅</div>
                <h3 style={{ marginTop: 12, fontSize: "1.1rem", fontWeight: 800, color: "#0F172A" }}>
                  Password updated successfully
                </h3>
                <p style={{ marginTop: 6, fontSize: "0.82rem", color: "#94A3B8" }}>
                  You can now sign in with your new password.
                </p>
                <Link
                  href={copy.loginHref}
                  style={{
                    display: "inline-flex",
                    marginTop: 16,
                    padding: "10px 18px",
                    background: "linear-gradient(135deg, #0EA5E9, #0284C7)",
                    color: "white",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  Back to login →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
