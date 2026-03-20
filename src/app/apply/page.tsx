"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Tesseract from "tesseract.js";
import * as faceapi from "face-api.js";
import { User } from "lucide-react";

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const appId = searchParams.get("appId");
  const { data: session, status } = useSession();
  const router = useRouter();
  const utils = api.useUtils();

  const [fullName, setFullName] = useState("");
  const [detectedStudentId, setDetectedStudentId] = useState<string | null>(null);
  const [idImage, setIdImage] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [step, setStep] = useState<"form" | "processing">("form");
  const [redirectingAfterSubmit, setRedirectingAfterSubmit] = useState(false);

  const verification = api.verification.create.useMutation();
  const { data: existingVerification, isLoading: checkingVerification } =
    api.verification.getMyVerification.useQuery(undefined, { enabled: !!session });

  const { data: userStudentId } = api.verification.getStudentId.useQuery(
    undefined,
    { enabled: !!session }
  );

  const [role, setRole] = useState("SOFTWARE_ENGINEER");

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/student/login");
  }, [status, router]);

  useEffect(() => {
    if (!redirectingAfterSubmit && existingVerification && jobId && appId)
      router.push(`/exam/${jobId}?appId=${appId}`);
  }, [existingVerification, jobId, appId, redirectingAfterSubmit, router]);

  useEffect(() => {
  if (session?.user?.name) setFullName(session.user.name);
}, [session]);

  if (status === "loading" || checkingVerification) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="av-loading-screen">
          <div className="av-spinner" />
          <p className="av-loading-text">Checking verification status…</p>
        </div>
      </>
    );
  }

  if (!session) return null;

  if (session.user.role !== "STUDENT") {
    return (
      <>
        <style>{STYLES}</style>
        <div className="av-loading-screen">
          <p className="av-loading-text">Only students can access this page.</p>
        </div>
      </>
    );
  }

  if (!redirectingAfterSubmit && existingVerification) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="av-loading-screen">
          <div className="av-check-icon">✓</div>
          <p className="av-loading-text">Already verified — redirecting…</p>
        </div>
      </>
    );
  }

  const extractITNumber = async (file: File) => {
    const result = await Tesseract.recognize(file, "eng");
    const cleanedText = result.data.text.replace(/\s/g, "");
    const match = cleanedText.match(/IT\d{7,8}/i);
    return match ? match[0].toUpperCase() : null;
  };

  const extractFaceFromID = async (file: File) => {
    const img = await faceapi.bufferToImage(file);
    const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions());
    if (!detection) return null;
    const { x, y, width, height } = detection.box;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")?.drawImage(img, x, y, width, height, 0, 0, width, height);
    return canvas.toDataURL();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;
  const file = e.target.files[0];
  if (!file) return;

  setIdImage(file);
  setIdPreview(URL.createObjectURL(file));
  setOcrLoading(true);
  setDetectedStudentId(null);

  const itNumber = await extractITNumber(file);
  
  if (!itNumber) {
    alert("Could not detect IT number from ID card. Please try a clearer image.");
    setIdImage(null);
    setIdPreview(null);
    setOcrLoading(false);
    return;
  }

  // ✅ Cross-check detected IT number against User.studentId in DB
  if (userStudentId) {
    const detected = itNumber.replace(/\s/g, "").toUpperCase();
    const registered = userStudentId.replace(/\s/g, "").toUpperCase();

    if (detected !== registered) {
      alert(
        `Student ID mismatch!\n\nDetected on card: ${detected}\nYour registered ID: ${registered}\n\nPlease upload your own student ID card.`
      );
      setIdImage(null);
      setIdPreview(null);
      setOcrLoading(false);
      return;
    }
  }

  setDetectedStudentId(itNumber);

  // ✅ REMOVED the blocking alert for face detection here.
  // Face detection happens at exam start (compareFaces), not at upload time.
  // Just silently attempt it and store result — don't block the user.
  try {
    await extractFaceFromID(file);
  } catch {
    // silently ignore — face comparison is done live at exam start
  }

  setOcrLoading(false);
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!idImage) { alert("Please upload your ID image"); return; }
  if (!detectedStudentId) { alert("Could not detect IT number from ID card."); return; }

  // ✅ Final guard before submission
  if (userStudentId) {
    const detected = detectedStudentId.replace(/\s/g, "").toUpperCase();
    const registered = userStudentId.replace(/\s/g, "").toUpperCase();
    if (detected !== registered) {
      alert("Student ID on card does not match your registered account. Submission blocked.");
      return;
    }
  } else {
    // studentId not set on this account — block entirely
    alert("Your student ID is not registered in the system. Please contact admin.");
    return;
  }

  setLoading(true);
  setStep("processing");
  setRedirectingAfterSubmit(true);

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const base64 = reader.result as string;
      const createdVerification = await verification.mutateAsync({
        fullName,
        detectedStudentId,
        role,
        idImageUrl: base64,
      });
      utils.verification.getMyVerification.setData(
        undefined,
        createdVerification,
      );
      await utils.verification.getMyVerification.invalidate();

      if (jobId && appId) {
        router.replace(`/exam/${jobId}?appId=${appId}`);
      } else {
        router.replace("/home");
      }
    } catch (error) {
      console.error(error);
      setRedirectingAfterSubmit(false);
      setLoading(false);
      setStep("form");
      alert("Failed to submit verification.");
    }
  };
  reader.readAsDataURL(idImage);
};

  const ROLES = [
    { value: "SOFTWARE_ENGINEER", label: "Software Engineer", icon: "💻" },
    { value: "UX_ENGINEER",       label: "UX Engineer",       icon: "🎨" },
    { value: "PROJECT_MANAGER",   label: "Project Manager",   icon: "📋" },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <main className="av-main">
        {/* ambient orbs */}
        <div className="av-orb av-orb-1" />
        <div className="av-orb av-orb-2" />

        <div className="av-wrapper">

          {/* ── LEFT PANEL ── */}
          <div className="av-left">
            <div className="av-left-inner">
              {/* logo */}
              <div className="av-logo">
                <div className="av-logo-badge">HS</div>
                <div>
                  <div className="av-logo-name">HireSmart</div>
                  <div className="av-logo-sub">2026</div>
                </div>
              </div>

              <div className="av-left-divider" />

              <h2 className="av-left-title">Applicant<br/>Verification</h2>
              <p className="av-left-desc">
                We verify your identity using your student ID card to ensure a fair and secure assessment process.
              </p>

              {/* steps */}
              <div className="av-steps">
                {[
                  { num: "01", label: "Enter your details",       done: !!fullName },
                  { num: "02", label: "Upload student ID card",    done: !!idImage },
                  { num: "03", label: "ID number auto-detected",  done: !!detectedStudentId },
                  { num: "04", label: "Submit & start exam",      done: false },
                ].map((s, i) => (
                  <div key={i} className={`av-step ${s.done ? "av-step-done" : ""}`}>
                    <div className="av-step-num">{s.done ? "✓" : s.num}</div>
                    <span className="av-step-label">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* security badge */}
              <div className="av-security">
                <span className="av-security-icon">🔐</span>
                <span className="av-security-text">Your data is encrypted and processed securely. ID images are never stored permanently.</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="av-right">
            {step === "processing" ? (
              <div className="av-processing">
                <div className="av-spinner-lg" />
                <h3 className="av-processing-title">Preparing Assessment Access</h3>
                <p className="av-processing-desc">Please wait while we securely process your information…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="av-form">

                {/* heading */}
                <div className="av-form-header">
                  <span className="av-form-eyebrow">Identity Verification</span>
                  <h1 className="av-form-title">Identity Verification</h1>
                  <p className="av-form-subtitle">Fill in your details and upload your student ID to continue.</p>
                </div>

                {/* Full Name */}
                <div className="av-field">
                  <label className="av-label">Full Name</label>
                  <div className="av-input-wrap">
                    <svg className="av-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
  type="text"
  value={fullName}        // ← from session.user.name (User table)
  readOnly                // ← editing disabled
  className="av-input av-input-readonly"  // ← muted style
/>
                  </div>
                </div>

                {/* Role
                <div className="av-field">
                  <label className="av-label">Applying As</label>
                  <div className="av-role-grid">
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`av-role-btn ${role === r.value ? "av-role-active" : ""}`}
                      >
                        <span className="av-role-icon">{r.icon}</span>
                        <span className="av-role-label">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div> */}

                {/* ID Upload */}
                <div className="av-field">
                  <label className="av-label">Student ID Card</label>

                  {!idPreview ? (
                    <label className="av-upload-zone" htmlFor="id-upload">
                      <div className="av-upload-icon">
                        <svg width="24" height="24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                      </div>
                      <p className="av-upload-main">Click to upload ID card</p>
                      <p className="av-upload-sub">PNG, JPG up to 10MB — clear, well-lit photo</p>
                      <input
                        id="id-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        required
                      />
                    </label>
                  ) : (
                    <div className="av-preview-wrap">
                      <img src={idPreview} alt="ID Preview" className="av-preview-img" />
                      <button
                        type="button"
                        className="av-preview-remove"
                        onClick={() => { setIdPreview(null); setIdImage(null); setDetectedStudentId(null); }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* OCR Status */}
                {ocrLoading && (
                  <div className="av-ocr-status av-ocr-scanning">
                    <div className="av-spinner-sm" />
                    <span>Scanning ID for student number…</span>
                  </div>
                )}

                {detectedStudentId && !ocrLoading && (
                  <div className="av-ocr-status av-ocr-success">
                    <span className="av-ocr-check">✓</span>
                    <span>Detected: <strong>{detectedStudentId}</strong></span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || ocrLoading || !detectedStudentId}
                  className="av-submit"
                >
                  {loading ? (
                    <>
                      <div className="av-spinner-sm av-spinner-white" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Continue to Exam
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

                <p className="av-form-note">
                  By continuing you agree to our <a href="#">Privacy Policy</a> and fair assessment terms.
                </p>
              </form>
            )}
          </div>

        </div>
      </main>
    </>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── LAYOUT ── */
  .av-main {
    min-height: 100vh;
    background: #F0F6FF;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    position: relative;
    overflow: hidden;
    font-family: 'Space Grotesk', sans-serif;
  }

  /* orbs */
  .av-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(70px);
  }
  .av-orb-1 {
    width: 500px; height: 500px;
    top: -10%; right: -8%;
    background: radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%);
    animation: av-drift 18s ease-in-out infinite;
  }
  .av-orb-2 {
    width: 400px; height: 400px;
    bottom: 0; left: -10%;
    background: radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%);
    animation: av-drift 24s ease-in-out infinite reverse;
  }
  @keyframes av-drift {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(20px, 30px); }
  }

  /* wrapper */
  .av-wrapper {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 960px;
    display: grid;
    grid-template-columns: 340px 1fr;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(15,23,42,0.12), 0 0 0 1px rgba(14,165,233,0.1);
  }

  /* ── LEFT ── */
  .av-left {
    background: #0F172A;
    position: relative;
    overflow: hidden;
  }
  .av-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }
  .av-left-inner {
    position: relative;
    z-index: 1;
    padding: 40px 32px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* logo */
  .av-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }
  .av-logo-badge {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #0EA5E9, #38BDF8);
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 700; color: white;
    box-shadow: 0 4px 12px rgba(14,165,233,0.3);
  }
  .av-logo-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem; font-weight: 700; color: white;
    letter-spacing: -0.02em; line-height: 1;
  }
  .av-logo-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem; color: #0EA5E9;
    letter-spacing: 0.14em; text-transform: uppercase; margin-top: 2px;
  }

  .av-left-divider {
    height: 1px;
    background: linear-gradient(90deg, rgba(14,165,233,0.4), transparent);
    margin-bottom: 32px;
  }

  .av-left-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.6rem; font-weight: 800;
    color: white; letter-spacing: -0.03em;
    line-height: 1.1; margin-bottom: 14px;
  }
  .av-left-desc {
    font-size: 0.85rem; color: rgba(255,255,255,0.45);
    line-height: 1.7; margin-bottom: 36px;
  }

  /* steps */
  .av-steps {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
  }
  .av-step {
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0.45;
    transition: opacity 0.3s;
  }
  .av-step-done { opacity: 1; }
  .av-step-num {
    width: 28px; height: 28px;
    border-radius: 8px;
    border: 1px solid rgba(14,165,233,0.3);
    background: rgba(14,165,233,0.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem; font-weight: 700; color: #38BDF8;
    flex-shrink: 0;
  }
  .av-step-done .av-step-num {
    background: rgba(14,165,233,0.2);
    border-color: rgba(14,165,233,0.5);
    color: #0EA5E9;
  }
  .av-step-label {
    font-size: 0.82rem; color: rgba(255,255,255,0.7);
    font-weight: 500;
  }
  .av-step-done .av-step-label { color: white; }

  /* security */
  .av-security {
    margin-top: 32px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: rgba(14,165,233,0.07);
    border: 1px solid rgba(14,165,233,0.18);
    border-radius: 12px;
    padding: 14px 16px;
  }
  .av-security-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
  .av-security-text {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.4);
    line-height: 1.65;
  }

  /* ── RIGHT ── */
  .av-right {
    background: white;
    padding: 48px 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .av-form {
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  /* form header */
  .av-form-header { margin-bottom: 4px; }
  .av-form-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #0EA5E9; margin-bottom: 10px;
  }
  .av-form-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.55rem; font-weight: 800;
    color: #0F172A; letter-spacing: -0.03em;
    margin-bottom: 6px;
  }
  .av-form-subtitle {
    font-size: 0.875rem; color: #64748B; line-height: 1.6;
  }

  /* fields */
  .av-field { display: flex; flex-direction: column; gap: 8px; }
  .av-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8rem; font-weight: 600; color: #374151;
    letter-spacing: -0.01em;
  }

  /* text input */
  .av-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .av-input-icon {
    position: absolute; left: 14px; color: #94A3B8; flex-shrink: 0;
  }
  .av-input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    border: 1.5px solid #E2E8F0;
    border-radius: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem; color: #0F172A;
    background: #FAFBFF;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .av-input:focus {
    border-color: #0EA5E9;
    background: white;
    box-shadow: 0 0 0 4px rgba(14,165,233,0.08);
  }
  .av-input::placeholder { color: #CBD5E1; }

  /* role grid */
  .av-role-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .av-role-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 14px 8px;
    border: 1.5px solid #E2E8F0;
    border-radius: 14px;
    background: #FAFBFF;
    cursor: pointer;
    transition: all 0.2s;
  }
  .av-role-btn:hover {
    border-color: rgba(14,165,233,0.4);
    background: rgba(14,165,233,0.04);
  }
  .av-role-active {
    border-color: #0EA5E9 !important;
    background: rgba(14,165,233,0.07) !important;
    box-shadow: 0 0 0 4px rgba(14,165,233,0.06);
  }
  .av-role-icon { font-size: 1.3rem; }
  .av-role-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.68rem; font-weight: 600; color: #475569;
    text-align: center; line-height: 1.2;
  }
  .av-role-active .av-role-label { color: #0369A1; }

  /* upload zone */
  .av-upload-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 32px 20px;
    border: 2px dashed #CBD5E1;
    border-radius: 16px;
    background: #FAFBFF;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }
  .av-upload-zone:hover {
    border-color: #0EA5E9;
    background: rgba(14,165,233,0.03);
  }
  .av-upload-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    background: rgba(14,165,233,0.1);
    border: 1px solid rgba(14,165,233,0.2);
    display: flex; align-items: center; justify-content: center;
  }
  .av-upload-main {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.875rem; font-weight: 600; color: #0F172A;
  }
  .av-upload-sub {
    font-size: 0.75rem; color: #94A3B8;
  }

  /* preview */
  .av-preview-wrap {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    border: 1.5px solid #E2E8F0;
  }
  .av-preview-img {
    width: 100%; height: 160px;
    object-fit: cover; display: block;
  }
  .av-preview-remove {
    position: absolute;
    top: 10px; right: 10px;
    background: rgba(15,23,42,0.75);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 5px 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem; font-weight: 600;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: background 0.2s;
  }
  .av-preview-remove:hover { background: rgba(239,68,68,0.8); }

  /* OCR status */
  .av-ocr-status {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
  }
  .av-ocr-scanning {
    background: rgba(14,165,233,0.07);
    border: 1px solid rgba(14,165,233,0.2);
    color: #0369A1;
  }
  .av-ocr-success {
    background: rgba(16,185,129,0.07);
    border: 1px solid rgba(16,185,129,0.25);
    color: #065F46;
  }
  .av-ocr-check {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: rgba(16,185,129,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; color: #059669; flex-shrink: 0;
    font-weight: 700;
  }

  /* submit */
  .av-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px 24px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #0F172A, #1E293B);
    color: white;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem; font-weight: 700;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 8px 24px rgba(15,23,42,0.2);
    margin-top: 4px;
  }
  .av-submit:hover:not(:disabled) {
    background: linear-gradient(135deg, #0EA5E9, #38BDF8);
    box-shadow: 0 12px 32px rgba(14,165,233,0.3);
    transform: translateY(-2px);
  }
  .av-submit:disabled {
    opacity: 0.45; cursor: not-allowed; transform: none;
  }

  .av-form-note {
    text-align: center;
    font-size: 0.75rem; color: #94A3B8; line-height: 1.6;
  }
  .av-form-note a {
    color: #0EA5E9; text-decoration: none;
  }
  .av-form-note a:hover { text-decoration: underline; }

  /* ── SPINNERS ── */
  .av-spinner {
    width: 32px; height: 32px;
    border: 3px solid rgba(14,165,233,0.2);
    border-top-color: #0EA5E9;
    border-radius: 50%;
    animation: av-spin 0.8s linear infinite;
  }
  .av-spinner-sm {
    width: 14px; height: 14px;
    border: 2px solid rgba(14,165,233,0.3);
    border-top-color: #0EA5E9;
    border-radius: 50%;
    animation: av-spin 0.8s linear infinite;
    flex-shrink: 0;
  }
  .av-spinner-white {
    border-color: rgba(255,255,255,0.3);
    border-top-color: white;
  }
  .av-spinner-lg {
    width: 52px; height: 52px;
    border: 4px solid rgba(14,165,233,0.15);
    border-top-color: #0EA5E9;
    border-radius: 50%;
    animation: av-spin 0.9s linear infinite;
    margin-bottom: 20px;
  }
  @keyframes av-spin { to { transform: rotate(360deg); } }

  /* loading / processing screens */
  .av-loading-screen {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px;
    background: #F0F6FF;
    font-family: 'Space Grotesk', sans-serif;
  }
  .av-loading-text {
    font-size: 0.9rem; color: #64748B; font-weight: 500;
  }
  .av-check-icon {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: rgba(16,185,129,0.15);
    border: 2px solid rgba(16,185,129,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; color: #059669;
  }

  /* processing state */
  .av-processing {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
    width: 100%;
  }
  .av-processing-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.2rem; font-weight: 700; color: #0F172A;
    margin-bottom: 8px;
  }
  .av-processing-desc {
    font-size: 0.875rem; color: #64748B; line-height: 1.6;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 760px) {
    .av-wrapper { grid-template-columns: 1fr; }
    .av-left { display: none; }
    .av-right { padding: 36px 28px; }
  }
`;
