"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { api } from "~/trpc/react";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function LoginCompany() {
  const router = useRouter();
  const login = api.company.login.useMutation();

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    timer: 800,
    timerProgressBar: true,
    background: "#F8FBFF",
    color: "#0F172A",
    customClass: {
      popup: "hs-toast",
      title: "text-[13px] font-semibold leading-tight",
      closeButton: "text-red-500 hover:text-red-600",
      icon: "border-2 border-[#DCEAF6] scale-75",
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const validateEmail = (value: string): string => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setFieldErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setFieldErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    setError("");
  };

  const handleLogin = () => {
    setError("");
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setFieldErrors({ email: emailErr, password: passwordErr });

    if (emailErr || passwordErr) return;

    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("companyId", data.companyId);
          toast.fire({
            icon: "success",
            iconColor: "#16A34A",
            title: "Login successful!",
          });
          setTimeout(() => router.push("/company/dashboard"), 2200);
        },
        onError: (err) => setError(err.message),
      },
    );
  };

  const handleDemoFill = () => {
    setEmail("itechcom56@gmail.com");
    setPassword("iTechcom56#56#");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #CBD5E1",
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
    color: "#334155",
    marginBottom: 6,
  };

  return (
    <>
      <style>{`
        .reg-input:focus { border-color: #0EA5E9 !important; box-shadow: 0 0 0 3px rgba(14,165,233,0.12) !important; background: #fff !important; }
        .reg-input::placeholder { color: #94A3B8; }
        .reg-btn:hover:not(:disabled) { background: #0284C7 !important; box-shadow: 0 6px 20px rgba(14,165,233,0.35) !important; transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .reg-btn { transition: background 0.2s, box-shadow 0.2s, transform 0.18s; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#F8FAFF",
        display: "flex",
        alignItems: "stretch",
      }}>

        {/* ── LEFT PANEL ───────────────────────────────────── */}
        <div style={{
          flex: "0 0 420px",
          background: "linear-gradient(145deg, #0F172A 0%, #0C1A33 60%, #0D2340 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem 2.5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* glow orbs */}
          <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(14,165,233,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

          {/* top content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ marginTop: 0 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)",
                borderRadius: 6, padding: "5px 12px", marginBottom: 20,
                fontSize: "0.65rem", fontWeight: 700, color: "#38BDF8",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#38BDF8" }} />
                Employer Portal
              </div>
              <h1 style={{
                fontSize: "2rem", fontWeight: 800,
                color: "white", margin: 0, lineHeight: 1.2,
                letterSpacing: "-0.03em",
              }}>
                Welcome<br />
                <span style={{ color: "#0EA5E9" }}>back.</span>
              </h1>
              <p style={{
                marginTop: 14, fontSize: "0.85rem", color: "rgba(255,255,255,0.5)",
                lineHeight: 1.7, fontWeight: 400,
              }}>
                Sign in to manage your job posts, review applications, and find your next great hire.
              </p>
            </div>
          </div>

          {/* feature list */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "📋", text: "Manage all your active job posts" },
              { icon: "👥", text: "Review & shortlist applicants" },
              { icon: "📊", text: "Track application pipeline" },
              { icon: "🔔", text: "Get notified on new applications" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* bottom link */}
          <div style={{ position: "relative", zIndex: 1, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/company/register" style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 600 }}>
              Register →
            </Link>
          </div>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────── */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "3rem",
          paddingRight: "2rem",
          paddingBottom: "3rem",
          paddingLeft: "2rem",
        }}>
          <div style={{ width: "100%", maxWidth: 420, background: "#F0F7FF", padding: "2rem", borderRadius: 20, border: "1px solid #E0EEFF" }}>

            <div style={{ marginBottom: "2.75rem" }}>
              <h2 style={{
                fontSize: "1.75rem", fontWeight: 800, color: "#112847",
                margin: 0, letterSpacing: "-0.025em",
                fontFamily: "var(--font-plus-jakarta), ui-sans-serif, system-ui, sans-serif",
              }}>Sign in to your account</h2>
              <p style={{ marginTop: 6, fontSize: "0.82rem", color: "#64748B", fontWeight: 400 }}>
                Enter your credentials to access the employer dashboard.
              </p>
            </div>

            {/* error banner */}
            {error && (
              <div style={{
                background: "#FFF1F2", border: "1.5px solid #FCA5A5",
                borderRadius: 10, padding: "10px 14px", marginBottom: 20,
                fontSize: "0.8rem", color: "#DC2626", fontWeight: 500,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Email */}
              <div>
                <label style={labelStyle}>Work Email</label>
                <input
                  className="reg-input"
                  style={{
                    ...inputStyle,
                    ...(fieldErrors.email && { border: "1.5px solid #FCA5A5", background: "#FFF8F8" }),
                  }}
                  type="email"
                  placeholder="hr@company.com"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  maxLength={100}
                />
                {fieldErrors.email && (
                  <p style={{ marginTop: 5, fontSize: "0.75rem", color: "#DC2626", fontWeight: 600 }}>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="reg-input"
                    style={{
                      ...inputStyle,
                      paddingRight: 42,
                      ...(fieldErrors.password && { border: "1.5px solid #FCA5A5", background: "#FFF8F8" }),
                    }}
                    type={showPw ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    maxLength={50}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center" }}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                {fieldErrors.password && (
                  <p style={{ marginTop: 5, fontSize: "0.75rem", color: "#DC2626", fontWeight: 600 }}>
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link href="/company/forgot-password" style={{ fontSize: "0.75rem", color: "#0EA5E9", fontWeight: 600, textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="button"
                className="reg-btn"
                onClick={handleLogin}
                disabled={login.isPending}
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
                {login.isPending ? "Signing in…" : "Sign In →"}
              </button>

            </div>

            <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.75rem", color: "#94A3B8" }}>
              Don&apos;t have an account?{" "}
              <Link href="/company/register" style={{ color: "#0EA5E9", fontWeight: 700, textDecoration: "none" }}>
                Register your company
              </Link>
            </p>

          </div>
        </div>
      </div>

      {/* Demo Button */}
      <button
        onClick={handleDemoFill}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0EA5E9, #0284C7)",
          border: "none",
          color: "white",
          fontSize: "1.5rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(14,165,233,0.35)",
          transition: "background 0.2s, box-shadow 0.2s, transform 0.18s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #0284C7, #0164A7)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(14,165,233,0.45)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #0EA5E9, #0284C7)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(14,165,233,0.35)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
        title="Fill demo credentials"
      >
        ✨
      </button>
    </>
  );
}