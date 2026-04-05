//smart-screening\src\app\apply\[jobId]\page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const SECTIONS = [
  { id: "personal", label: "Personal", short: "01", icon: "◈" },
  { id: "education", label: "Education", short: "02", icon: "◉" },
  { id: "projects", label: "Projects", short: "03", icon: "◆" },
  { id: "skills", label: "Skills", short: "04", icon: "◐" },
  { id: "scenario", label: "Scenario", short: "05", icon: "◎" },
] as const;

const SCENARIO_QUESTIONS = [
  {
    id: "q1",
    tag: "System Design",
    question:
      "You are working on a project, and a feature you developed is not working as expected. What steps would you take to identify and fix the issue?",
  },
  {
    id: "q2",
    tag: "Crisis Management",
    question:
      "You have multiple assignment deadlines and a project to complete, but you are running out of time. How would you manage your tasks?",
  },
  {
    id: "q3",
    tag: "Collaboration",
    question:
      "You are working in a group project, but one team member is not contributing properly. How would you handle this situation?",
  },
] as const;

type Project = {
  name: string;
  details: string;
};

type FormState = {
  // Personal
  fullName: string;
  email: string;
  mobile: string;
  linkedin: string;
  github: string;
  portfolio: string;

  // Education
  university: string;
  degree: string;
  specialization: string;
  cgpa: string;
  awards: string;

  // Projects (dynamic)
  projects: Project[];

  // Skills
  programmingLanguages: string;
  frameworks: string;
  softwareProficiency: string;

  // Scenario
  q1: string;
  q2: string;
  q3: string;
};
type Specialization =
  | "SE"
  | "DS"
  | "CYBER_SECURITY"
  | "NETWORKING"
  | "AI";

export default function ApplyPage({ params: paramsPromise }: { params: Promise<{ jobId: string }> }) {
  const params = React.use(paramsPromise);
  const createApplication = api.application.create.useMutation();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(
    new Set(),
  );
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [linkErrors, setLinkErrors] = useState({
    linkedin: "",
    github: "",
  });

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    mobile: "",
    linkedin: "",
    github: "",
    portfolio: "",

    university: "SLIIT",
    degree: "BSc (Honors) Information Technology",
    specialization: "" as Specialization | "",
    cgpa: "",
    awards: "",

    projects: [{ name: "", details: "" }],

    programmingLanguages: "",
    frameworks: "",
    softwareProficiency: "",

    q1: "",
    q2: "",
    q3: "",
  });

  const progress = useMemo(() => {
    return Math.round((completedSections.size / SECTIONS.length) * 100);
  }, [completedSections.size]);

  const handleCgpaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;

    if (value === "") {
      setForm((prev) => ({ ...prev, cgpa: "" }));
      return;
    }

    value = value.replace(/[^0-9.]/g, "");

    if (value.startsWith(".")) {
      value = `0${value}`;
    }

    const parts = value.split(".");
    if (parts.length > 2) {
      value = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    const [intPart, decPart] = value.split(".");
    if (decPart && decPart.length > 2) {
      value = `${intPart}.${decPart.slice(0, 2)}`;
    }

    const num = Number(value);
    if (!Number.isNaN(num)) {
      if (num > 4) return;
      if (num < 0) value = "0";
    }

    setForm((prev) => ({ ...prev, cgpa: value }));
  };

  const handleCgpaBlur = () => {
    if (!form.cgpa.trim()) return;
    const num = Number(form.cgpa);
    if (Number.isNaN(num)) {
      setForm((prev) => ({ ...prev, cgpa: "" }));
      return;
    }

    const clamped = Math.min(4, Math.max(0, num));
    setForm((prev) => ({ ...prev, cgpa: clamped.toFixed(2) }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitized = value.replace(/[^a-zA-Z0-9@.]/g, "");
    setForm((prev) => ({ ...prev, [name as keyof FormState]: sanitized }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitized = value.replace(/[^a-zA-Z\s]/g, "");
    setForm((prev) => ({ ...prev, [name as keyof FormState]: sanitized }));
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const digits = value.replace(/\D/g, "");
    let local = digits.startsWith("94") ? digits.slice(2) : digits;
    local = local.slice(0, 9);
    const formatted = `+94${local}`;
    setForm((prev) => ({ ...prev, mobile: formatted }));
  };

  const handleLinkedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitized = value.replace(/[^a-zA-Z0-9._\-/:]/g, "");
    let error = "";

    if (sanitized !== value) {
      error = "Only letters, numbers, ., -, _, /, and : are allowed.";
    } else if (
      sanitized.length > 0 &&
      !/^(?:https:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9._-]+\/?$/.test(
        sanitized,
      )
    ) {
      error = "Use https//www.linkedin.com/in/yourname format.";
    }

    setLinkErrors((prev) => ({ ...prev, linkedin: error }));
    setForm((prev) => ({ ...prev, [name as keyof FormState]: sanitized }));
  };

  const handleGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitized = value.replace(/[^a-zA-Z0-9._\-/:]/g, "");
    let error = "";

    if (sanitized !== value) {
      error = "Only letters, numbers, ., -, _, /, and : are allowed.";
    } else if (
      sanitized.length > 0 &&
      !/^(?:https:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)?\/?$/.test(
        sanitized,
      )
    ) {
      error =
        "Use https//github.com/username or https://github.com/username/repo format.";
    }

    setLinkErrors((prev) => ({ ...prev, github: error }));
    setForm((prev) => ({ ...prev, [name as keyof FormState]: sanitized }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof FormState]: value }));
  };

  const isValidLinkedInUrl = (value: string) => {
    try {
      const url = new URL(value.startsWith("http") ? value : `https://${value}`);
      const host = url.hostname.toLowerCase();
      if (!host.endsWith("linkedin.com")) return false;
      return /^\/in\/[a-zA-Z0-9._-]+\/?$/.test(url.pathname);
    } catch {
      return false;
    }
  };

  const isValidGithubUrl = (value: string) => {
    try {
      const url = new URL(value.startsWith("http") ? value : `https://${value}`);
      const host = url.hostname.toLowerCase();
      if (!host.endsWith("github.com")) return false;
      return /^\/[a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)?\/?$/.test(
        url.pathname,
      );
    } catch {
      return false;
    }
  };

  // ✅ Projects handlers
  const addProject = () => {
    setForm((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: "", details: "" }],
    }));
  };

  const removeProject = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx),
    }));
  };

  const handleProjectChange = (
    idx: number,
    field: keyof Project,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p,
      ),
    }));
  };

  // ✅ Validation per step
  const validateCurrentStep = () => {
    if (activeSection === 0) {
      if (!form.fullName.trim()) return false;
      if (!form.email.trim()) return false;
      if (!/^\+94\d{9}$/.test(form.mobile)) return false;
      if (!form.linkedin.trim() || !isValidLinkedInUrl(form.linkedin))
        return false;
      if (!form.github.trim() || !isValidGithubUrl(form.github)) return false;
    }

    if (activeSection === 1) {
      if (!form.university.trim()) return false;
      if (!form.degree.trim()) return false;
      if (!form.specialization) return false;
      if (!form.cgpa.trim()) return false;
    }

    if (activeSection === 2) {
      // Require at least 1 project with name + details
      const first = form.projects[0];
      if (!first?.name.trim() || !first?.details.trim()) return false;
    }

    if (activeSection === 3) {
      if (!form.programmingLanguages.trim()) return false;
      if (!form.frameworks.trim()) return false;
      if (!form.softwareProficiency.trim()) return false;
    }

    if (activeSection === 4) {
      if (!form.q1.trim()) return false;
      if (!form.q2.trim()) return false;
      if (!form.q3.trim()) return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      alert("Please fill the required fields before continuing.");
      return;
    }

    setCompletedSections((prev) => new Set([...prev, activeSection]));

    if (activeSection < SECTIONS.length - 1) {
      setActiveSection((s) => s + 1);
      return;
    }

    // FINAL STEP — SAVE TO DATABASE
    try {
      const created = await createApplication.mutateAsync({
        jobId: params.jobId,

        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        linkedin: form.linkedin,
        github: form.github,
        portfolio: form.portfolio,

        university: form.university,
        degree: form.degree,
        specialization: form.specialization as Specialization,
        cgpa: form.cgpa,
        awards: form.awards,

        programmingLanguages: form.programmingLanguages,
        frameworks: form.frameworks,
        softwareProficiency: form.softwareProficiency,

        projects: form.projects,

        scenarios: [
          { questionKey: "q1", answer: form.q1 },
          { questionKey: "q2", answer: form.q2 },
          { questionKey: "q3", answer: form.q3 },
        ],
      });

      // 🔥 PASS APPLICATION ID
      router.push(`/apply/${params.jobId}/agreement?appId=${created.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to submit application.");
    }
  };

  const handleBack = () => {
    if (activeSection > 0) setActiveSection((s) => s - 1);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');

        :root{
          --bg: #f7f9fc;
          --surface: #ffffff;
          --border: #e2e8f0;
          --text: #0f172a;
          --muted: #64748b;
          --accent: #0ea5e9;
          --accent-strong: #0284c7;
          --shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
        }

        *{ box-sizing: border-box; }

        .apply-shell{
          background: radial-gradient(circle at top, rgba(14,165,233,0.12), transparent 45%),
            radial-gradient(circle at 20% 20%, rgba(99,102,241,0.10), transparent 35%),
            linear-gradient(180deg, #f8fafc, #eef2f7 60%, #e9edf5);
          color: var(--text);
          font-family: 'Manrope', sans-serif;
        }
        .title, .brandTitle{
          font-family: 'Sora', sans-serif;
        }

        .scan{ display:none; }

        .root{
          min-height: 100vh;
          display: grid;
          grid-template-columns: 280px 1fr;
        }

        .sidebar{
          position: sticky;
          top: 80px;
          height: calc(100vh - 80px);
          background: #f4f7fb;
          border-right: 1px solid var(--border);
          padding: 28px 0;
        }

        .brand{
          padding: 0 24px 24px;
          border-bottom: 1px solid var(--border);
        }

        .brandTag{
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-strong);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .brandTitle{
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
        }

        .progressWrap{
          padding: 20px 24px;
        }

        .progressLabel{
          display:flex;
          justify-content:space-between;
          font-size:12px;
          color: var(--muted);
          margin-bottom:8px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .bar{
          height:6px;
          background:#e2e8f0;
          border-radius:999px;
        }

        .barFill{
          height:100%;
          background: linear-gradient(90deg, #0ea5e9, #38bdf8);
          border-radius:999px;
          transition: width 0.4s ease;
        }

        .nav{
          padding: 0 16px;
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .navBtn{
          width:100%;
          padding:12px 14px;
          border-radius:14px;
          border:1px solid transparent;
          background:#fff;
          text-align:left;
          cursor:pointer;
          font-size:14px;
          font-weight:600;
          color: var(--text);
          display:flex;
          align-items:center;
          gap:12px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .navBtn:hover{
          border-color: rgba(14,165,233,0.2);
          color: var(--accent-strong);
        }

        .navBtn.active{
          background: #e0f2fe;
          border-color: rgba(14,165,233,0.4);
          box-shadow: 0 12px 30px rgba(14,165,233,0.12);
        }

        .navNum{
          width:28px;
          height:28px;
          border-radius:10px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: #f1f5f9;
          border:1px solid var(--border);
          font-size:12px;
          font-weight:700;
          color: var(--text);
        }

        .navBtn.active .navNum{
          border-color: var(--accent);
          background: #bae6fd;
        }

        .main{
          padding: 60px 80px;
          animation: fadeUp 0.5s ease;
        }

        @keyframes fadeUp{
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .eyebrow{
          font-size:12px;
          font-weight:700;
          color: var(--accent-strong);
          margin-bottom:10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .title{
          font-size: 44px;
          font-weight: 800;
          margin-bottom: 10px;
          line-height:1.05;
        }

        .highlight{
          color: var(--accent-strong);
        }

        .desc{
          color: var(--muted);
          margin-bottom: 30px;
          font-size: 15px;
        }

        .card{
          background: var(--surface);
          border: 1px solid rgba(148,163,184,0.35);
          border-radius: 20px;
          padding: 28px;
          box-shadow: var(--shadow);
        }

        .grid2{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
        }

        .span2{ grid-column: span 2; }

        .label{
          font-size:11px;
          font-weight:700;
          color: var(--muted);
          margin-bottom:6px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .required{
          color: #b42318;
          margin-left: 4px;
        }

        .optional{
          font-size:10px;
          font-weight:700;
          color: var(--muted);
          margin-left: 8px;
        }

        .input, .textarea{
          width:100%;
          border-radius:12px;
          padding:12px 14px;
          border:1px solid var(--border);
          background:#ffffff;
          font-size:14px;
          color: var(--text);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input:focus, .textarea:focus{
          outline:none;
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
        }

        .textarea{
          min-height:120px;
          resize:vertical;
        }

        .hint{
          margin-top:8px;
          font-size:11px;
          color: var(--muted);
          font-weight:600;
        }

        .projectBlock{
          border: 1px dashed rgba(148,163,184,0.5);
          border-radius: 16px;
          padding: 18px;
          background: #f8fafc;
        }

        .projectTop{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom: 12px;
        }

        .projectTitle{
          font-size: 13px;
          font-weight: 800;
          color: var(--text);
        }

        .miniBtn{
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: #fff;
          cursor: pointer;
          font-weight: 700;
          font-size: 12px;
        }

        .miniBtn:hover{
          border-color: rgba(14,165,233,0.4);
          color: var(--accent-strong);
        }

        .danger{
          color: #b42318;
          border-color: #f2c6c2;
          background: #fff5f5;
        }

        .actions{
          display:flex;
          justify-content:space-between;
          margin-top:32px;
        }

        .btn{
          padding:12px 24px;
          border-radius:16px;
          font-weight:600;
          cursor:pointer;
          border:1px solid var(--border);
          background:#fff;
          color: var(--text);
          transition: all 0.2s;
        }

        .btn:hover{
          border-color: var(--accent);
          color: var(--accent-strong);
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
        }

        .btnPrimary{
          background: #0f172a;
          color:#fff;
          border:none;
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.2);
        }

        .btnPrimary:hover{
          background: var(--accent-strong);
          color:#fff;
          box-shadow: 0 18px 36px rgba(14, 165, 233, 0.28);
        }

        .btnPrimary:disabled{
          background: #334155;
          cursor: not-allowed;
          opacity: 0.55;
        }

        @media (max-width: 900px){
          .root{ grid-template-columns:1fr; }
          .sidebar{ display:none; }
          .main{ padding:30px 20px; }
          .grid2{ grid-template-columns:1fr; }
          .span2{ grid-column: span 1; }
        }
      `}</style>

      <div className="apply-shell">
        <div className="scan" />
        <div className="root">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="brand">
              <div className="brandTag">◈ HireSmart • Application</div>
              <div className="brandTitle">HireSmart</div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "var(--muted)",
                  fontWeight: 600,
                }}
              >
                Smart Screening Platform
              </div>
            </div>

            <div className="progressWrap">
              <div className="progressLabel">
                <span>COMPLETION</span>
                <b>{progress}%</b>
              </div>
              <div className="bar">
                <div className="barFill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <nav className="nav">
              {SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  className={`navBtn ${activeSection === i ? "active" : ""} ${
                    completedSections.has(i) ? "done" : ""
                  }`}
                  onClick={() => setActiveSection(i)}
                  type="button"
                >
                  <span className="navNum">
                    {completedSections.has(i) ? "✓" : s.short}
                  </span>
                  <span>{s.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* MAIN */}
          <main className="main">
            {/* SECTION 0 */}
            {activeSection === 0 && (
              <>
                <div className="eyebrow">Step 01 of 05</div>
                <h1 className="title">
                  Personal <br />
                  <span className="highlight">Information</span>
                </h1>
                <p className="desc">
                  No CV upload. We collect structured information for fair
                  screening.
                </p>

                <div className="card">
                  <div className="grid2">
                    <div className="span2">
                      <div
                        className={`label ${
                          focusedField === "fullName" ? "focused" : ""
                        }`}
                      >
                        Full Name <span className="required">*</span>
                      </div>
                      <input
                        className="input"
                        name="fullName"
                        value={form.fullName}
                        placeholder="Your full name"
                        onChange={handleNameChange}
                        onFocus={() => setFocusedField("fullName")}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                    </div>

                    <div>
                      <div className="label">Email <span className="required">*</span></div>
                      <input
                        className="input"
                        name="email"
                        type="email"
                        value={form.email}
                        placeholder="you@example.com"
                        onChange={handleEmailChange}
                        required
                      />
                    </div>

                    <div>
                      <div className="label">Mobile Number <span className="required">*</span></div>
                      <input
                        className="input"
                        name="mobile"
                        type="tel"
                        inputMode="numeric"
                        value={form.mobile}
                        placeholder="+94 7X XXX XXXX"
                        onChange={handleMobileChange}
                        pattern="^\+94\d{9}$"
                        minLength={12}
                        maxLength={12}
                        required
                      />
                    </div>

                    <div>
                      <div className="label">LinkedIn Profile <span className="required">*</span></div>
                      <input
                        className="input"
                        name="linkedin"
                        value={form.linkedin}
                        placeholder="linkedin.com/in/yourname"
                        onChange={handleLinkedInChange}
                        pattern="^[a-zA-Z0-9._\-/:]+$"
                        required
                      />
                      {linkErrors.linkedin && (
                        <div className="hint" style={{ color: "#b42318" }}>
                          {linkErrors.linkedin}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="label">GitHub <span className="required">*</span></div>
                      <input
                        className="input"
                        name="github"
                        value={form.github}
                        placeholder="github.com/yourusername"
                        onChange={handleGithubChange}
                        pattern="^[a-zA-Z0-9._\-/:]+$"
                        required
                      />
                      {linkErrors.github && (
                        <div className="hint" style={{ color: "#b42318" }}>
                          {linkErrors.github}
                        </div>
                      )}
                    </div>

                    <div className="span2">
                      <div className="label">
                        Portfolio <span className="optional">(Optional)</span>
                      </div>
                      <input
                        className="input"
                        name="portfolio"
                        value={form.portfolio}
                        placeholder="yourportfolio.dev"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SECTION 1 */}
            {activeSection === 1 && (
              <>
                <div className="eyebrow">Step 02 of 05</div>
                <h1 className="title">
                  Education & <br />
                  <span className="highlight">Background</span>
                </h1>
                <p className="desc">
                  A quick academic snapshot helps match the right difficulty.
                </p>

                <div className="card">
                  <div className="grid2">
                    <div className="span2">
                      <div className="label">University / Institution <span className="required">*</span></div>
                      <input
                        className="input"
                        name="university"
                        value={form.university}
                        placeholder="e.g. SLIIT / University of Moratuwa"
                        onChange={handleChange}
                        disabled
                        required
                      />
                    </div>

                    <div>
                      <div className="label">Degree <span className="required">*</span></div>
                      <input
                        className="input"
                        name="degree"
                        value= {form.degree}
                        onChange={handleChange}
                        disabled
                        required
                      />
                    </div>

                    <div>
                      <div className="label">Specialization <span className="required">*</span></div>
                      <select
                        className="input"
                        name="specialization"
                        value={form.specialization}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Specialization</option>

                        <option value="INFORMATION_TECHNOLOGY">
                          Information Technology
                        </option>

                        <option value="SOFTWARE_ENGINEERING">
                          Software Engineering
                        </option>

                        <option value="CYBER_SECURITY">Cyber Security</option>

                        <option value="DATA_SCIENCE">Data Science</option>

                        <option value="COMPUTER_SCIENCE_NETWORK_ENGINEERING">
                          Computer Science & Network Engineering
                        </option>

                        <option value="INTERACTIVE_MEDIA">
                          Interactive Media
                        </option>
                      </select>
                    </div>

                    <div>
                      <div className="label">CGPA <span className="required">*</span></div>
                      <input
  className="input"
  name="cgpa"
  type="number"
  step="0.01"
  min="0"
  max="4"
  value={form.cgpa}
  placeholder="e.g. 3.75"
                        onChange={handleCgpaChange}
                        onBlur={handleCgpaBlur}
                        required
/>
                    </div>

                    <div>
                      <div className="label">
                        Awards <span className="optional">(Optional)</span>
                      </div>
                      <input
                        className="input"
                        name="awards"
                        value={form.awards}
                        placeholder="Dean's List, Hackathon Winner..."
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SECTION 2 (UPDATED ✅) */}
            {activeSection === 2 && (
              <>
                <div className="eyebrow">Step 03 of 05</div>
                <h1 className="title">
                  Projects & <br />
                  <span className="highlight">Experience</span>
                </h1>
                <p className="desc">
                  Add your academic projects (you can add multiple projects).
                </p>

                <div className="card">
                  <div className="projectTop">
                    <div className="projectTitle">Academic Projects</div>
                    <button
                      type="button"
                      className="miniBtn"
                      onClick={addProject}
                    >
                      + Add Project
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    {form.projects.map((p, idx) => (
                      <div key={idx} className="projectBlock">
                        <div className="projectTop">
                          <div className="projectTitle">Project {idx + 1}</div>
                          {form.projects.length > 1 && (
                            <button
                              type="button"
                              className="miniBtn danger"
                              onClick={() => removeProject(idx)}
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid2">
                          <div className="span2">
                            <div className="label">Project Name <span className="required">*</span></div>
                            <input
                              className="input"
                              value={p.name}
                              placeholder="Smart Library System"
                              onChange={(e) =>
                                handleProjectChange(idx, "name", e.target.value)
                              }
                              required={idx === 0}
                            />
                          </div>

                          <div className="span2">
                            <div className="label">Project Details <span className="required">*</span></div>
                            <textarea
                              className="textarea"
                              value={p.details}
                              placeholder={`Role: Full-stack dev
Stack: Next.js, Prisma, PostgreSQL
Impact: Reduced booking conflicts by 70%
GitHub: github.com/you/project`}
                              onChange={(e) =>
                                handleProjectChange(
                                  idx,
                                  "details",
                                  e.target.value,
                                )
                              }
                              required={idx === 0}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hint">
                    Tip: Add only your best 2–3 projects with clear impact.
                  </div>
                </div>
              </>
            )}

            {/* SECTION 3 */}
            {activeSection === 3 && (
              <>
                <div className="eyebrow">Step 04 of 05</div>
                <h1 className="title">
                  Technical & <br />
                  <span className="highlight">Tool Skills</span>
                </h1>
                <p className="desc">
                  Skills must be specific. This helps generate a role-based
                  assessment.
                </p>

                <div className="card">
                  <div className="grid2">
                    <div className="span2">
                      <div className="label">Programming Languages <span className="required">*</span></div>
                      <input
                        className="input"
                        name="programmingLanguages"
                        value={form.programmingLanguages}
                        placeholder="TypeScript, Java, Python, SQL..."
                        onChange={handleChange}
                        required
                      />
                      <div className="hint">
                        Comma separated (order by skill)
                      </div>
                    </div>

                    <div className="span2">
                      <div className="label">Frameworks / Stacks <span className="required">*</span></div>
                      <textarea
                        className="textarea"
                        name="frameworks"
                        value={form.frameworks}
                        placeholder="Next.js, React, Node.js, Spring Boot, Prisma..."
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="span2">
                      <div className="label">Software Proficiency <span className="required">*</span></div>
                      <input
                        className="input"
                        name="softwareProficiency"
                        value={form.softwareProficiency}
                        placeholder="Git, VS Code, Postman, Figma..."
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SECTION 4 */}
            {activeSection === 4 && (
              <>
                <div className="eyebrow">Step 05 of 05</div>
                <h1 className="title">
                  Scenario-Based <br />
                  <span className="highlight">Responses</span>
                </h1>
                <p className="desc">
                  Real-world problems. We assess thinking and clarity.
                </p>

                <div className="card">
                  {SCENARIO_QUESTIONS.map((q, idx) => (
                    <div key={q.id} style={{ marginBottom: 18 }}>
                      <div className="label">
                        {String(idx + 1).padStart(2, "0")} • {q.tag}
                        <span className="required">*</span>
                      </div>
                      <div style={{ fontWeight: 700, marginBottom: 10 }}>
                        {q.question}
                      </div>
                      <textarea
                        className="textarea"
                        name={q.id}
                        value={form[q.id as keyof FormState] as string}
                        placeholder="Explain your reasoning..."
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="actions">
              <button
                className="btn"
                type="button"
                onClick={handleBack}
                style={{
                  visibility: activeSection === 0 ? "hidden" : "visible",
                }}
              >
                ← Back
              </button>

              <button
                className="btn btnPrimary"
                type="button"
                onClick={handleNext}
              >
                {activeSection === SECTIONS.length - 1
                  ? "Continue to Agreement ✓"
                  : "Continue →"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
