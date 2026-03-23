"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { signIn } from "next-auth/react";

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

export default function StudentLoginPage() {
  const router = useRouter();

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    toast.fire({
      icon: "success",
      iconColor: "#16A34A",
      title: "Login successful!",
    });
    setTimeout(() => router.push("/home"), 2200);
  };

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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
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

      <div className="auth-shell" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
              Student Access
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "white", margin: 0, lineHeight: 1.2, letterSpacing: "-0.03em" }}>
              Welcome back,<br />
              <span style={{ color: "#0EA5E9" }}>future professional</span>
            </h1>

            <p style={{ marginTop: 14, fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 400 }}>
              Sign in to continue your applications, take exams, and track your career progress.
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "📌", text: "Continue saved applications" },
              { icon: "🧪", text: "Take your pending assessments" },
              { icon: "📊", text: "Track all interview outcomes" },
              { icon: "🔐", text: "Secure sign-in for student accounts" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ position: "relative", zIndex: 1, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
            New here?{" "}
            <Link href="/student/register" style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 600 }}>
              Create account →
            </Link>
          </div>
        </div>

        <div className="auth-right">
          <div style={{ width: "100%", maxWidth: 460 }}>
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.025em" }}>
                Sign in to your student account
              </h2>
              <p style={{ marginTop: 6, fontSize: "0.82rem", color: "#94A3B8", fontWeight: 400 }}>
                Use the same credentials you used during registration.
              </p>
            </div>

            {error && (
              <div style={{ background: "#FFF1F2", border: "1.5px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: "0.8rem", color: "#DC2626", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={labelStyle}>SLIIT Email <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  className="reg-input"
                  type="email"
                  style={inputStyle}
                  placeholder="ITXXXXXXX@my.sliit.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Password <span style={{ color: "#EF4444" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <input
                    className="reg-input"
                    type={showPw ? "text" : "password"}
                    style={{ ...inputStyle, paddingRight: 42 }}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                className="reg-btn"
                disabled={isSubmitting}
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
                {isSubmitting ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.75rem", color: "#94A3B8" }}>
              Don&apos;t have an account?{" "}
              <Link href="/student/register" style={{ color: "#0EA5E9", fontWeight: 700, textDecoration: "none" }}>
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}