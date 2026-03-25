"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

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

export default function StudentRegisterPage() {
  const router = useRouter();
  const sendOtp = api.student.auth.sendOtp.useMutation();
  const register = api.student.auth.register.useMutation();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentIdError, setStudentIdError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [degree, setDegree] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [formError, setFormError] = useState("");
  const [otpError, setOtpError] = useState("");

  const strength = pwStrength(password);

  const validateName = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    return /^[A-Za-z.\s]+$/.test(trimmed) ? "" : "Full name can contain letters, spaces, and dots only.";
  };

  const validateStudentId = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    return /^IT\d{8}$/.test(trimmed) ? "" : "Student ID must be IT followed by 8 digits.";
  };

  const validateEmail = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    return /^IT\d{8}@my\.sliit\.lk$/i.test(trimmed)
      ? ""
      : "Use your SLIIT email (IT12345678@my.sliit.lk).";
  };

  const fillMockData = () => {
    const mockName = "M.Sandani Chamoda";
    const mockStudentId = "IT23832480";
    const mockEmail = "it23832480@my.sliit.lk";
    const mockPassword = "Sandani@07";

    setName(mockName);
    setStudentId(mockStudentId);
    setEmail(mockEmail);
    setDegree("BSc IT");
    setYear("3");
    setPassword(mockPassword);
    setConfirmPassword(mockPassword);
    setNameError(validateName(mockName));
    setStudentIdError(validateStudentId(mockStudentId));
    setEmailError(validateEmail(mockEmail));
    setFormError("");
    setOtpError("");
    setOtpSent(false);
  };

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !studentId.trim() || !email.trim() || !degree || !year || !password) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const currentNameError = validateName(name);
    if (currentNameError) {
      setFormError(currentNameError);
      setNameError(currentNameError);
      return;
    }

    const currentStudentIdError = validateStudentId(studentId);
    if (currentStudentIdError) {
      setFormError(currentStudentIdError);
      setStudentIdError(currentStudentIdError);
      return;
    }

    const currentEmailError = validateEmail(email);
    if (currentEmailError) {
      setFormError(currentEmailError);
      setEmailError(currentEmailError);
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
      await sendOtp.mutateAsync({ email });
      setOtpSent(true);
    } catch (error: unknown) {
      console.error(error);
      setFormError(error instanceof Error ? error.message : "Failed to send OTP.");
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError("");
    if (otp.length < 4) {
      setOtpError("Please enter a valid OTP.");
      return;
    }
    try {
      await register.mutateAsync({
        name,
        studentId,
        email,
        password,
        degree,
        year,
        otp,
      });
      router.push("/student/login");
    } catch (error: unknown) {
      console.error(error);
      setOtpError(error instanceof Error ? error.message : "Registration failed.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "#E2E8F0",
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

  return (
    <>
      <style>{`
        .reg-input:focus { border-color: #0EA5E9 !important; box-shadow: 0 0 0 3px rgba(14,165,233,0.12) !important; background: #fff !important; }
        .reg-input::placeholder { color: #CBD5E1; }
        .reg-btn:hover:not(:disabled) { background: #0284C7 !important; box-shadow: 0 6px 20px rgba(14,165,233,0.35) !important; transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .reg-btn { transition: background 0.2s, box-shadow 0.2s, transform 0.18s; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFF",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            flex: "0 0 420px",
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
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(14,165,233,0.15)",
              border: "1px solid rgba(14,165,233,0.3)",
              borderRadius: 6,
              padding: "5px 12px",
              marginBottom: 20,
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "#38BDF8",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#38BDF8" }} />
              For Students
            </div>

            <h1 style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "white",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
            }}>
              Build your career<br />
              <span style={{ color: "#0EA5E9" }}>with confidence</span> today.
            </h1>

            <p style={{ marginTop: 14, fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 400 }}>
              Register, verify via OTP, and unlock internships, jobs, and smart screening exams.
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "🎓", text: "Access internships and graduate jobs" },
              { icon: "🛡️", text: "Secure student email verification" },
              { icon: "🧠", text: "Take role-based skill assessments" },
              { icon: "📈", text: "Track your applications in one place" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ position: "relative", zIndex: 1, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
            Already registered?{" "}
            <Link href="/student/login" style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 600 }}>
              Sign in →
            </Link>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: 520 }}>
            {!otpSent ? (
              <>
                <div style={{ marginBottom: "2rem" }}>
                  <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.025em" }}>
                    Create your student account
                  </h2>
                  <p style={{ marginTop: 6, fontSize: "0.82rem", color: "#94A3B8", fontWeight: 400 }}>
                    Use your SLIIT email. We&apos;ll send an OTP before completing registration.
                  </p>
                </div>

                {formError && (
                  <div style={{ background: "#FFF1F2", border: "1.5px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: "0.8rem", color: "#DC2626", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                    ⚠ {formError}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                  <button
                    type="button"
                    onClick={fillMockData}
                    style={{
                      border: "1px solid #E2E8F0",
                      background: "white",
                      color: "#0F172A",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "8px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Fill Sample Data
                  </button>
                </div>

                <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {(() => {
                    const emailLocal = email.split("@")[0] ?? "";
                    return (
                      <>
                  <div>
                    <label style={labelStyle}>Full Name <span style={{ color: "#EF4444" }}>*</span></label>
                    <input
                      className="reg-input"
                      style={{
                        ...inputStyle,
                        ...(nameError ? { borderColor: "#FCA5A5", background: "#FFF8F8" } : {}),
                      }}
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => {
                        const value = e.target.value;
                        setName(value);
                        setNameError(validateName(value));
                      }}
                      onBlur={(e) => setNameError(validateName(e.target.value))}
                      required
                    />
                    {nameError && (
                      <p style={{ marginTop: 5, fontSize: "0.7rem", color: "#EF4444", fontWeight: 600 }}>{nameError}</p>
                    )}
                  </div>

                  <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
                    <div>
                      <label style={labelStyle}>Student ID <span style={{ color: "#EF4444" }}>*</span></label>
                      <input
                        className="reg-input"
                        style={{
                          ...inputStyle,
                          ...(studentIdError ? { borderColor: "#FCA5A5", background: "#FFF8F8" } : {}),
                        }}
                        type="text"
                        placeholder="ITXXXXXXX"
                        name="studentId"
                        autoComplete="off"
                        maxLength={10}
                        value={studentId}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          setStudentId(value);
                          setStudentIdError(validateStudentId(value));
                        }}
                        onBlur={(e) => setStudentIdError(validateStudentId(e.target.value))}
                        required
                      />
                      {studentIdError && (
                        <p style={{ marginTop: 5, fontSize: "0.7rem", color: "#EF4444", fontWeight: 600 }}>{studentIdError}</p>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Year of Study <span style={{ color: "#EF4444" }}>*</span></label>
                      <select className="reg-input" style={inputStyle} value={year} onChange={(e) => setYear(e.target.value)} required>
                        <option value="">Select year</option>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>SLIIT Email <span style={{ color: "#EF4444" }}>*</span></label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        ...inputStyle,
                        ...(emailError ? { borderColor: "#FCA5A5", background: "#FFF8F8" } : {}),
                        padding: "0 14px",
                        gap: 6,
                      }}
                    >
                      <input
                        className="reg-input"
                        style={{
                          border: "none",
                          background: "transparent",
                          outline: "none",
                          padding: "11px 0",
                          flex: 1,
                          fontSize: "0.875rem",
                          color: "#0F172A",
                        }}
                        type="text"
                        placeholder="IT12345678"
                        name="email"
                        autoComplete="email"
                        value={emailLocal}
                        maxLength={10}
                        onChange={(e) => {
                          const rawValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                          const normalized = rawValue ? `${rawValue}@my.sliit.lk` : "";
                          setEmail(normalized);
                          setEmailError(validateEmail(normalized));
                        }}
                        onBlur={(e) => {
                          const rawValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                          const normalized = rawValue ? `${rawValue}@my.sliit.lk` : "";
                          setEmail(normalized);
                          setEmailError(validateEmail(normalized));
                        }}
                        required
                      />
                      <span style={{ color: "#CBD5E1", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        @my.sliit.lk
                      </span>
                    </div>
                    {emailError && (
                      <p style={{ marginTop: 5, fontSize: "0.7rem", color: "#EF4444", fontWeight: 600 }}>{emailError}</p>
                    )}
                  </div>
                      </>
                    );
                  })()}

                  <div>
                    <label style={labelStyle}>Degree Program <span style={{ color: "#EF4444" }}>*</span></label>
                    <select className="reg-input" style={inputStyle} value={degree} onChange={(e) => setDegree(e.target.value)} required>
                      <option value="">Select degree program</option>
                      <option value="BSc IT">BSc IT</option>
                      <option value="BSc SE">Software Engineering</option>
                      <option value="BSc CS">Computer Science</option>
                      <option value="BSc DS">Data Science</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Password <span style={{ color: "#EF4444" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="reg-input"
                        style={{ ...inputStyle, paddingRight: 42 }}
                        type={showPw ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
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

                    {password.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                height: 3,
                                borderRadius: 2,
                                background: i <= strength.score ? strength.color : "#E2E8F0",
                                transition: "background 0.25s",
                              }}
                            />
                          ))}
                        </div>
                        {strength.label && (
                          <p style={{ marginTop: 4, fontSize: "0.68rem", fontWeight: 600, color: strength.color }}>{strength.label} password</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Confirm Password <span style={{ color: "#EF4444" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="reg-input"
                        style={{
                          ...inputStyle,
                          paddingRight: 42,
                          ...(confirmPassword && password !== confirmPassword ? { borderColor: "#FCA5A5", background: "#FFF8F8" } : {}),
                          ...(confirmPassword && password === confirmPassword ? { borderColor: "#86EFAC" } : {}),
                        }}
                        type={showCpw ? "text" : "password"}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
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
                    {confirmPassword && password !== confirmPassword && (
                      <p style={{ marginTop: 5, fontSize: "0.7rem", color: "#EF4444", fontWeight: 600 }}>Passwords don&apos;t match</p>
                    )}
                    {confirmPassword && password === confirmPassword && (
                      <p style={{ marginTop: 5, fontSize: "0.7rem", color: "#10B981", fontWeight: 600 }}>✓ Passwords match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="reg-btn"
                    disabled={sendOtp.isPending}
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
                    {sendOtp.isPending ? "Sending OTP..." : "Create Account & Get OTP →"}
                  </button>
                </form>

                <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.75rem", color: "#94A3B8" }}>
                  Already have an account?{" "}
                  <Link href="/student/login" style={{ color: "#0EA5E9", fontWeight: 700, textDecoration: "none" }}>
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #E0F2FE, #BAE6FD)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      margin: "0 auto 16px",
                      boxShadow: "0 4px 20px rgba(14,165,233,0.2)",
                    }}
                  >
                    ✉️
                  </div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.025em" }}>
                    Verify your email
                  </h2>
                  <p style={{ marginTop: 8, fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.6 }}>
                    We sent a 6-digit OTP to<br />
                    <strong style={{ color: "#0F172A" }}>{email}</strong>
                  </p>
                </div>

                {otpError && (
                  <div style={{ background: "#FFF1F2", border: "1.5px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: "0.8rem", color: "#DC2626", fontWeight: 500, textAlign: "center" }}>
                    ⚠ {otpError}
                  </div>
                )}

                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>One-Time Password</label>
                    <input
                      className="reg-input"
                      style={{ ...inputStyle, textAlign: "center", fontSize: "1.6rem", letterSpacing: "0.25em", fontWeight: 700, height: 60 }}
                      placeholder="······"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                  </div>

                  <button
                    type="submit"
                    className="reg-btn"
                    disabled={register.isPending || otp.length < 4}
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
                      cursor: "pointer"}}
                  >
                    {register.isPending ? "Verifying..." : "Verify OTP & Register →"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.78rem",
                      color: "#94A3B8",
                      fontWeight: 600,
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    ← Back to registration
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}