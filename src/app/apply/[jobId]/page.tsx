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
      "You’re optimizing a backend service handling 10,000 req/sec, but CPU is ~80%. Explain your step-by-step diagnostic and resolution plan.",
  },
  {
    id: "q2",
    tag: "Crisis Management",
    question:
      "A critical production bug appears 30 minutes before launch. Fix requires a database migration. What do you do and why?",
  },
  {
    id: "q3",
    tag: "Collaboration",
    question:
      "You disagree with your team lead’s architectural decision and believe it will cause technical debt. How do you handle it professionally?",
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

export default function ApplyPage({ params }: { params: { jobId: string } }) {
  const createApplication = api.application.create.useMutation();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(
    new Set(),
  );
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    mobile: "",
    linkedin: "",
    github: "",
    portfolio: "",

    university: "",
    degree: "",
    specialization: "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof FormState]: value }));
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
      if (!form.fullName.trim() || !form.email.trim()) return false;
    }

    if (activeSection === 1) {
      if (!form.university.trim() || !form.degree.trim()) return false;
    }

    if (activeSection === 2) {
      // Require at least 1 project with name + details
      const first = form.projects[0];
      if (!first?.name.trim() || !first?.details.trim()) return false;
    }

    if (activeSection === 3) {
      if (!form.programmingLanguages.trim()) return false;
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
  specialization: form.specialization,
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
router.push(
  `/apply/${params.jobId}/agreement?appId=${created.id}`
);
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap');

        :root{
          --bg: #ffffff;
          --surface: #f8faff;
          --border: #e2e8f0;
          --text: #0f172a;
          --muted: #94a3b8;
          --accent: #0ea5e9;
        }

        *{ box-sizing: border-box; }

        .apply-shell{
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
}
  .title, .brandTitle{
  font-family: 'Poppins', sans-serif;
}

        .scan{ display:none; }

        .root{
          min-height: 100vh;
          display: grid;
          grid-template-columns: 260px 1fr;
        }

        .sidebar{
          position: sticky;
          top: 80px;
          height: calc(100vh - 80px);
          background: #fafbfc;
          border-right: 1px solid var(--border);
          padding: 28px 0;
        }

        .brand{
          padding: 0 24px 24px;
          border-bottom: 1px solid var(--border);
        }

        .brandTag{
          font-size: 11px;
          font-weight: 600;
          color: var(--accent);
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
        }

        .bar{
          height:4px;
          background:#f1f3f5;
          border-radius:4px;
        }

        .barFill{
          height:100%;
          background: var(--accent);
          border-radius:4px;
        }

        .nav{
          padding: 0 16px;
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .navBtn{
          width:100%;
          padding:10px 12px;
          border-radius:10px;
          border:1px solid transparent;
          background:#fff;
          text-align:left;
          cursor:pointer;
          font-size:14px;
          font-weight:600;
          color: var(--text);
          display:flex;
          align-items:center;
          gap:10px;
        }

        .navBtn:hover{
          background: var(--surface);
        }

        .navBtn.active{
          background: #e0f2fe;
          border-color: var(--accent);
        }

        .navNum{
          width:26px;
          height:26px;
          border-radius:8px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: var(--surface);
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
        }

        .eyebrow{
          font-size:12px;
          font-weight:700;
          color: var(--accent);
          margin-bottom:10px;
        }

        .title{
          font-size: 44px;
          font-weight: 800;
          margin-bottom: 10px;
          line-height:1.05;
        }

        .highlight{
          color: var(--accent);
        }

        .desc{
          color: var(--muted);
          margin-bottom: 30px;
          font-size: 14px;
        }

        .card{
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px;
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
        }

        .optional{
          font-size:10px;
          font-weight:700;
          color: var(--muted);
          margin-left: 8px;
        }

        .input, .textarea{
          width:100%;
          border-radius:10px;
          padding:12px 14px;
          border:1px solid var(--border);
          background:#ffffff;
          font-size:14px;
          color: var(--text);
        }

        .input:focus, .textarea:focus{
          outline:none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
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
          border: 1px dashed var(--border);
          border-radius: 14px;
          padding: 18px;
          background: #fff;
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
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #fff;
          cursor: pointer;
          font-weight: 700;
          font-size: 12px;
        }

        .miniBtn:hover{
          background: var(--surface);
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
          font-weight:500;
          cursor:pointer;
          border:1px solid var(--border);
          background:#fff;
          color: var(--text);
          transition: background-color 0.2s;
        }

        .btn:hover{
          border-color: var(--accent);
          color: var(--accent);
        }

        .btnPrimary{
          background: #0f172a;
          color:#fff;
          border:none;
        }

        .btnPrimary:hover{
          background: #0ea5e9;
          box-shadow: 0 4px 16px rgba(14, 165, 233, 0.18);
        }

        .btnPrimary:disabled{
          background: #334155;
          cursor: not-allowed;
          opacity: 0.5;
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
              <div className="brandTitle">
  HireSmart
</div>
<div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
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
                  No CV upload. We collect structured information for fair screening.
                </p>

                <div className="card">
                  <div className="grid2">
                    <div className="span2">
                      <div
                        className={`label ${
                          focusedField === "fullName" ? "focused" : ""
                        }`}
                      >
                        Full Name
                      </div>
                      <input
                        className="input"
                        name="fullName"
                        value={form.fullName}
                        placeholder="Your full name"
                        onChange={handleChange}
                        onFocus={() => setFocusedField("fullName")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>

                    <div>
                      <div className="label">Email</div>
                      <input
                        className="input"
                        name="email"
                        type="email"
                        value={form.email}
                        placeholder="you@example.com"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <div className="label">Mobile Number</div>
                      <input
                        className="input"
                        name="mobile"
                        value={form.mobile}
                        placeholder="+94 7X XXX XXXX"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <div className="label">LinkedIn Profile</div>
                      <input
                        className="input"
                        name="linkedin"
                        value={form.linkedin}
                        placeholder="linkedin.com/in/yourname"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <div className="label">GitHub</div>
                      <input
                        className="input"
                        name="github"
                        value={form.github}
                        placeholder="github.com/yourusername"
                        onChange={handleChange}
                      />
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
                      <div className="label">University / Institution</div>
                      <input
                        className="input"
                        name="university"
                        value={form.university}
                        placeholder="e.g. SLIIT / University of Moratuwa"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <div className="label">Degree</div>
                      <input
                        className="input"
                        name="degree"
                        value={form.degree}
                        placeholder="e.g. BSc (Hons) in IT"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <div className="label">Specialization</div>
                      <input
                        className="input"
                        name="specialization"
                        value={form.specialization}
                        placeholder="e.g. Software Engineering"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <div className="label">CGPA</div>
                      <input
                        className="input"
                        name="cgpa"
                        value={form.cgpa}
                        placeholder="e.g. 3.45 / 4.00"
                        onChange={handleChange}
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
                    <button type="button" className="miniBtn" onClick={addProject}>
                      + Add Project
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                            <div className="label">Project Name</div>
                            <input
                              className="input"
                              value={p.name}
                              placeholder="Smart Library System"
                              onChange={(e) =>
                                handleProjectChange(idx, "name", e.target.value)
                              }
                            />
                          </div>

                          <div className="span2">
                            <div className="label">Project Details</div>
                            <textarea
                              className="textarea"
                              value={p.details}
                              placeholder={`Role: Full-stack dev
Stack: Next.js, Prisma, PostgreSQL
Impact: Reduced booking conflicts by 70%
GitHub: github.com/you/project`}
                              onChange={(e) =>
                                handleProjectChange(idx, "details", e.target.value)
                              }
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
                  Skills must be specific. This helps generate a role-based assessment.
                </p>

                <div className="card">
                  <div className="grid2">
                    <div className="span2">
                      <div className="label">Programming Languages</div>
                      <input
                        className="input"
                        name="programmingLanguages"
                        value={form.programmingLanguages}
                        placeholder="TypeScript, Java, Python, SQL..."
                        onChange={handleChange}
                      />
                      <div className="hint">Comma separated (order by skill)</div>
                    </div>

                    <div className="span2">
                      <div className="label">Frameworks / Stacks</div>
                      <textarea
                        className="textarea"
                        name="frameworks"
                        value={form.frameworks}
                        placeholder="Next.js, React, Node.js, Spring Boot, Prisma..."
                        onChange={handleChange}
                      />
                    </div>

                    <div className="span2">
                      <div className="label">Software Proficiency</div>
                      <input
                        className="input"
                        name="softwareProficiency"
                        value={form.softwareProficiency}
                        placeholder="Git, VS Code, Postman, Figma..."
                        onChange={handleChange}
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
                style={{ visibility: activeSection === 0 ? "hidden" : "visible" }}
              >
                ← Back
              </button>

              <button className="btn btnPrimary" type="button" onClick={handleNext}>
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