"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { api } from "~/trpc/react";

/* ── tiny Eye icons ────────────────────────────────────── */
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

/* ── password strength ──────────────────────────────────── */
function pwStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "#E2E8F0" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { score: 0, label: "", color: "#E2E8F0" },
    { score: 1, label: "Weak", color: "#EF4444" },
    { score: 2, label: "Fair", color: "#F59E0B" },
    { score: 3, label: "Good", color: "#0EA5E9" },
    { score: 4, label: "Strong", color: "#10B981" },
  ];
  return map[s] ?? map[0]!;
}

export default function RegisterCompany() {
  const router = useRouter();
  const createCompany = api.company.create.useMutation();
  const verifyOtp = api.company.verifyOtp.useMutation();

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    timer: 2200,
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [formError, setFormError] = useState("");
  const [otpError, setOtpError] = useState("");

  const strength = pwStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!name.trim() || !email.trim() || !password) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    try {
      await createCompany.mutateAsync({ name, email, password, description });
      setShowOtp(true);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  };

  const handleVerifyOtp = () => {
    setOtpError("");
    verifyOtp.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast
            .fire({
              icon: "success",
              iconColor: "#16A34A",
              title: "Registration successful! Please log in.",
            })
            .then(() => router.push("/company/comlogin"));
        },
        onError: (err) => setOtpError(err.message),
      },
    );
  };

  /* ── shared input style ───────────────────────────────── */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #E2E8F0",
    borderRadius: 10,
    fontSize: "0.875rem",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .reg-input:focus { border-color: #0EA5E9 !important; box-shadow: 0 0 0 3px rgba(14,165,233,0.12) !important; background: #fff !important; }
        .reg-input::placeholder { color: #CBD5E1; }
        .reg-btn:hover:not(:disabled) { background: #0284C7 !important; box-shadow: 0 6px 20px rgba(14,165,233,0.35) !important; transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .reg-btn { transition: background 0.2s, box-shadow 0.2s, transform 0.18s; }
        .otp-input { text-align: center; font-size: 1.6rem; letter-spacing: 0.25em; font-weight: 700; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#F8FAFF",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#38BDF8", animation: "pulse 1.5s infinite" }} />
                For Employers
              </div>
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "2rem", fontWeight: 800,
                color: "white", margin: 0, lineHeight: 1.2,
                letterSpacing: "-0.03em",
              }}>
                Start hiring<br />
                <span style={{ color: "#0EA5E9" }}>smarter</span> today.
              </h1>
              <p style={{
                marginTop: 14, fontSize: "0.85rem", color: "rgba(255,255,255,0.5)",
                lineHeight: 1.7, fontWeight: 400,
              }}>
                Post jobs, find top talent, and manage your pipeline — all in one place.
              </p>
            </div>
          </div>

          {/* feature list */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "✅", text: "Post internships & full-time roles" },
              { icon: "🎯", text: "Reach pre-screened candidates" },
              { icon: "🔒", text: "OTP-verified company accounts" },
              { icon: "📊", text: "Track applications in real time" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* bottom link */}
          <div style={{ position: "relative", zIndex: 1, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
            Already registered?{" "}
            <Link href="/company/comlogin" style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 600 }}>
              Sign in →
            </Link>
          </div>
        </div>

        {/* ── RIGHT PANEL (form) ────────────────────────────── */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "3rem 2rem",
          paddingTop: "5rem",
          overflowY: "auto",
        }}>
          <div style={{ width: "100%", maxWidth: 480 }}>

            {!showOtp ? (
              <>
                {/* header */}
                <div style={{ marginBottom: "2rem" }}>
                  <h2 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "1.6rem", fontWeight: 800, color: "#0F172A",
                    margin: 0, letterSpacing: "-0.025em",
                  }}>Create your company account</h2>
                  <p style={{ marginTop: 6, fontSize: "0.82rem", color: "#94A3B8", fontWeight: 400 }}>
                    Fill in your details — an OTP will be sent to verify your email.
                  </p>
                </div>

                {/* error banner */}
                {formError && (
                  <div style={{
                    background: "#FFF1F2", border: "1.5px solid #FCA5A5",
                    borderRadius: 10, padding: "10px 14px", marginBottom: 20,
                    fontSize: "0.8rem", color: "#DC2626", fontWeight: 500,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    ⚠ {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* Company Name */}
                  <div>
                    <label style={labelStyle}>Company Name <span style={{ color: "#EF4444" }}>*</span></label>
                    <input
                      className="reg-input"
                      style={inputStyle}
                      placeholder="Acme Corp"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>Work Email <span style={{ color: "#EF4444" }}>*</span></label>
                    <input
                      className="reg-input"
                      style={inputStyle}
                      type="email"
                      placeholder="hr@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label style={labelStyle}>Company Description <span style={{ color: "#94A3B8", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                    <textarea
                      className="reg-input"
                      style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                      placeholder="Tell candidates what makes your company great…"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label style={labelStyle}>Password <span style={{ color: "#EF4444" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="reg-input"
                        style={{ ...inputStyle, paddingRight: 42 }}
                        type={showPw ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center" }}>
                        <EyeIcon open={showPw} />
                      </button>
                    </div>
                    {/* strength bar */}
                    {password.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{
                              flex: 1, height: 3, borderRadius: 2,
                              background: i <= strength.score ? strength.color : "#E2E8F0",
                              transition: "background 0.25s",
                            }} />
                          ))}
                        </div>
                        {strength.label && (
                          <p style={{ marginTop: 4, fontSize: "0.68rem", fontWeight: 600, color: strength.color }}>{strength.label} password</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={labelStyle}>Confirm Password <span style={{ color: "#EF4444" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="reg-input"
                        style={{
                          ...inputStyle, paddingRight: 42,
                          ...(confirmPassword && password !== confirmPassword ? { borderColor: "#FCA5A5", background: "#FFF8F8" } : {}),
                          ...(confirmPassword && password === confirmPassword ? { borderColor: "#86EFAC" } : {}),
                        }}
                        type={showCpw ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button type="button" onClick={() => setShowCpw(!showCpw)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center" }}>
                        <EyeIcon open={showCpw} />
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p style={{ marginTop: 5, fontSize: "0.7rem", color: "#EF4444", fontWeight: 600 }}>Passwords don&apos;t match</p>
                    )}
                    {confirmPassword && password === confirmPassword && (
                      <p style={{ marginTop: 5, fontSize: "0.7rem", color: "#10B981", fontWeight: 600 }}>✓ Passwords match</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="reg-btn"
                    disabled={createCompany.isPending}
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
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {createCompany.isPending ? "Creating account…" : "Create Account & Get OTP →"}
                  </button>

                </form>

                <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.75rem", color: "#94A3B8" }}>
                  Already have an account?{" "}
                  <Link href="/company/comlogin" style={{ color: "#0EA5E9", fontWeight: 700, textDecoration: "none" }}>
                    Sign in
                  </Link>
                </p>
              </>

            ) : (
              /* ── OTP STEP ─────────────────────────────────── */
              <>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg, #E0F2FE, #BAE6FD)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.8rem", margin: "0 auto 16px",
                    boxShadow: "0 4px 20px rgba(14,165,233,0.2)",
                  }}>✉️</div>
                  <h2 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "1.5rem", fontWeight: 800, color: "#0F172A",
                    margin: 0, letterSpacing: "-0.025em",
                  }}>Check your email</h2>
                  <p style={{ marginTop: 8, fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.6 }}>
                    We sent a 6-digit OTP to<br />
                    <strong style={{ color: "#0F172A" }}>{email}</strong>
                  </p>
                </div>

                {otpError && (
                  <div style={{
                    background: "#FFF1F2", border: "1.5px solid #FCA5A5",
                    borderRadius: 10, padding: "10px 14px", marginBottom: 20,
                    fontSize: "0.8rem", color: "#DC2626", fontWeight: 500,
                    textAlign: "center",
                  }}>
                    ⚠ {otpError}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>One-Time Password</label>
                    <input
                      className="reg-input otp-input"
                      style={{ ...inputStyle, textAlign: "center", fontSize: "1.6rem", letterSpacing: "0.25em", fontWeight: 700, height: 60 }}
                      placeholder="······"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                  </div>

                  <button
                    type="button"
                    className="reg-btn"
                    disabled={verifyOtp.isPending || otp.length < 4}
                    onClick={handleVerifyOtp}
                    style={{
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
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {verifyOtp.isPending ? "Verifying…" : "Verify & Continue →"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtp(false)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      textDecoration: "underline", textUnderlineOffset: 3,
                    }}
                  >
                    ← Back to registration
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
