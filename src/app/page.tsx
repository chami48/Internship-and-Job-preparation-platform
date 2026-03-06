"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

/* ─── Tag chip ───────────────────────────────────────────── */
function Tag({ text }: { text: string }) {
  return (
    <span
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "#E0F2FE",
        border: "1px solid rgba(14,165,233,0.3)",
        color: "#0369A1",
        borderRadius: "100px",
        padding: "2px 10px",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
  );
}

/* ─── Animated counter ───────────────────────────────────── */
function Counter({ to, label, suffix = "+" }: { to: number; label: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = Math.max(1, Math.ceil(to / 50));
    const id = setInterval(() => {
      v += step;
      if (v >= to) { setVal(to); clearInterval(id); } else setVal(v);
    }, 25);
    return () => clearInterval(id);
  }, [to]);

  return (
    <div className="flex flex-col items-start">
      <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "2.4rem", fontWeight: 700, color: "white", lineHeight: 1 }}>
        {val.toLocaleString()}<span style={{ color: "#0EA5E9" }}>{suffix}</span>
      </span>
      <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 5 }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Job Card ───────────────────────────────────────────── */
function daysLeft(deadline: Date | null | undefined): string | null {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (diff < 0) return "Closed";
  if (diff === 0) return "Closes today";
  return `${diff}d left`;
}

function JobCard({ job, index }: {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    level: string;
    tags: string[];
    salary?: string | null;
    deadline?: Date | null;
    slots?: number | null;
  };
  index: number;
}) {
  const isIntern = job.type?.toLowerCase().includes("intern");
  const left = daysLeft(job.deadline);
  const expired = left === "Closed";
  const visibleTags = job.tags.slice(0, 3);

  return (
    <div
      className="job-card"
      style={{
        animationDelay: `${index * 60}ms`,
        background: "white",
        border: "1px solid #E2E8F0",
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
        transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(14,165,233,0.35)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(14,165,233,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(15,23,42,0.06)";
      }}
    >
      {/* top colour strip */}
      <div style={{ height: 4, width: "100%", background: isIntern ? "linear-gradient(90deg,#818CF8,#A78BFA)" : "linear-gradient(90deg,#0EA5E9,#38BDF8)", flexShrink: 0 }} />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "1.25rem", gap: 0 }}>

        {/* Row 1: icon + badges */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{
            width: 40, height: 40, flexShrink: 0, borderRadius: 13,
            background: isIntern ? "#EEF2FF" : "#E0F2FE",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
          }}>
            {isIntern ? "🎓" : "💼"}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ borderRadius: "100px", padding: "2px 9px", fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", background: isIntern ? "#EEF2FF" : "#E0F2FE", color: isIntern ? "#6366F1" : "#0369A1", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {job.type.replace("_", " ")}
            </span>
            <span style={{ borderRadius: "100px", padding: "2px 9px", fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", background: "#F1F5F9", color: "#475569", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {job.level}
            </span>
          </div>
        </div>

        {/* Row 2: title + company/location */}
        <div style={{ marginTop: 12 }}>
          <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#0F172A", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
            {job.title}
          </h3>
          <p style={{ marginTop: 4, fontSize: "0.75rem", color: "#64748B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {job.company} &middot; {job.location}
          </p>
        </div>

        {/* Row 3: tags */}
        {visibleTags.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 5 }}>
            {visibleTags.map((t) => <Tag key={t} text={t} />)}
            {job.tags.length > 3 && (
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F1F5F9", color: "#94A3B8", borderRadius: "100px", padding: "2px 9px", fontSize: "10px", fontWeight: 600 }}>+{job.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Row 4: salary + deadline */}
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14 }}>
          <p style={{ fontSize: "0.72rem", color: "#94A3B8", fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>
            💰 <span style={{ fontWeight: 600, color: "#475569" }}>{job.salary ?? "Negotiable"}</span>
          </p>
          {left && (
            <p style={{ fontSize: "0.72rem", fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0, fontWeight: 600, color: expired ? "#EF4444" : "#0EA5E9" }}>
              ⏰ {left}
            </p>
          )}
          {!job.deadline && (
            <p style={{ fontSize: "0.72rem", fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0, color: "#94A3B8" }}>No deadline</p>
          )}
        </div>

        {/* Row 5: button */}
        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <Link
            href={`/jobs/${job.id}`}
            style={{
              display: "block", textAlign: "center",
              borderRadius: 10, padding: "9px 0", fontSize: "0.75rem",
              fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
              color: "white", background: "#0F172A", textDecoration: "none",
              transition: "background 0.2s, box-shadow 0.2s",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0EA5E9";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,165,233,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0F172A";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            View &amp; Apply →
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function HomePage() {
  const { data: jobs, isLoading, error } = api.job.list.useQuery();
  const [filter, setFilter] = useState<"all" | "internship" | "fulltime">("all");

  const filteredJobs = (jobs ?? []).filter((j) => {
    if (filter === "all") return true;
    const t = (j.type ?? "").toLowerCase();
    if (filter === "internship") return t.includes("intern");
    if (filter === "fulltime") return !t.includes("intern");
    return true;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        .job-card { animation: fadeUp 0.45s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-word { animation: wordIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes wordIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dot-grid {
          background-image: radial-gradient(circle, rgba(14,165,233,0.15) 1.2px, transparent 1.2px);
          background-size: 26px 26px;
        }

        .filter-btn {
          border: 1.5px solid #E2E8F0;
          background: white;
          color: #475569;
          border-radius: 999px;
          padding: 7px 18px;
          font-size: 11px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.18s;
        }
        .filter-btn:hover:not(.f-active) { border-color: #94A3B8; color: #0F172A; }
        .f-active-all  { border-color: #0EA5E9 !important; background: #E0F2FE !important; color: #0369A1 !important; }
        .f-active-intern { border-color: #818CF8 !important; background: #EEF2FF !important; color: #6366F1 !important; }
        .f-active-full { border-color: #0EA5E9 !important; background: #E0F2FE !important; color: #0369A1 !important; }

        .feature-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 2rem;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          box-shadow: 0 4px 24px rgba(15,23,42,0.06);
          position: relative;
          overflow: hidden;
        }
        .feature-card:hover {
          border-color: rgba(14,165,233,0.35);
          box-shadow: 0 12px 40px rgba(14,165,233,0.1);
          transform: translateY(-4px);
        }

        .how-num-ring::after {
          content: '';
          position: absolute; inset: -4px; border-radius: 50%;
          border: 2px dashed rgba(14,165,233,0.3);
          animation: spin 8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .eyebrow-blink { animation: blink 1.4s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .trending-row {
          display: flex; align-items: center; gap: 12px;
          border-radius: 12px; border: 1px solid #E2E8F0;
          background: #F8FAFF; padding: 12px 16px;
          font-size: 0.875rem; color: #475569;
          transition: border-color 0.2s, background 0.2s;
          cursor: default;
        }
        .trending-row:hover { border-color: rgba(14,165,233,0.3); background: #E0F2FE; color: #0F172A; }

        .progress-bar-fill {
          height: 100%; border-radius: 100px;
          background: linear-gradient(90deg, #0EA5E9, #38BDF8);
        }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#F8FAFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* Dot grid */}
        <div className="pointer-events-none fixed inset-0 z-0 dot-grid opacity-60" />

        {/* Sky glow */}
        <div className="pointer-events-none fixed left-1/2 top-0 z-0 -translate-x-1/2" style={{
          width: 900, height: 500,
          background: "radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-14">

          {/* ── HERO ── */}
          <section className="grid gap-12 md:grid-cols-[1fr_400px] md:items-center">
            {/* LEFT */}
            <div>
              {/* eyebrow */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#E0F2FE", border: "1px solid rgba(14,165,233,0.3)",
                borderRadius: 6, padding: "6px 14px", marginBottom: 24,
                fontSize: "0.72rem", fontWeight: 700, color: "#0369A1",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                <span className="eyebrow-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: "#0EA5E9", display: "inline-block" }} />
                HireSmart · Smart Screening
              </div>

              <h1 className="hero-word" style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.06, margin: 0 }}>
                <span className="hero-word block" style={{ fontSize: "clamp(3.2rem,6.5vw,5.5rem)", animationDelay: "0ms" }}>
                  HireSmart
                </span>
                <span className="hero-word block" style={{ fontSize: "clamp(1.8rem,3.8vw,2.8rem)", marginTop: 8, animationDelay: "80ms" }}>
                  Internship & Job{" "}
                  <em style={{ fontStyle: "normal", color: "#0EA5E9", position: "relative" }}>Platform</em>
                </span>
                <span className="hero-word block" style={{ fontSize: "clamp(1.4rem,2.6vw,2rem)", marginTop: 8, animationDelay: "160ms", color: "#475569", fontWeight: 600 }}>
                  for Skill-Based Hiring
                </span>
              </h1>

              <p style={{ marginTop: 20, maxWidth: 480, fontSize: "1.05rem", lineHeight: 1.78, color: "#475569", fontWeight: 400 }}>
                Candidates prove skills first with a secure exam. Only qualified students unlock CV upload and proceed to interviews.
              </p>

              {/* CTAs */}
              <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href="#jobs" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", borderRadius: 10,
                  background: "#0F172A", color: "white",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600, fontSize: "0.95rem", textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(15,23,42,0.15)",
                  transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0EA5E9";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(14,165,233,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0F172A";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,23,42,0.15)";
                  }}
                >
                  Browse Jobs
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
                <Link href="/how-it-works" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", borderRadius: 10,
                  border: "2px solid #E2E8F0", background: "white",
                  color: "#0F172A", fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600, fontSize: "0.95rem", textDecoration: "none",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0EA5E9"; e.currentTarget.style.color = "#0EA5E9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#0F172A"; }}
                >
                  How Smart Screening Works
                </Link>
              </div>

              {/* Trust row */}
              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", borderTop: "1px solid #E2E8F0", paddingTop: 24 }}>
                {["No credit card", "Free plan forever", "Cancel anytime"].map((t, i) => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "#94A3B8", fontWeight: 500 }}>
                    <span style={{ color: "#0EA5E9" }}>✓</span> {t}
                    {i < 2 && <span style={{ width: 1, height: 14, background: "#E2E8F0", display: "inline-block", marginLeft: 20 }} />}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{ background: "white", border: "1px solid rgba(14,165,233,0.25)", borderRadius: 20, padding: 24, boxShadow: "0 8px 40px rgba(14,165,233,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#0F172A", margin: 0 }}>
                  Trending Roles
                </p>
                <span style={{ borderRadius: 100, background: "#F1F5F9", padding: "4px 12px", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#94A3B8" }}>
                  Updated today
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Software Engineer", color: "#0EA5E9" },
                  { label: "UX Engineer",        color: "#818CF8" },
                  { label: "Project Manager",    color: "#38BDF8" },
                  { label: "Internship (Web)",   color: "#34D399" },
                ].map((r) => (
                  <div key={r.label} className="trending-row">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                    {r.label}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, borderRadius: 16, border: "1px solid rgba(14,165,233,0.2)", background: "linear-gradient(135deg, #E0F2FE, #BAE6FD)", padding: 16 }}>
                <p style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#0F172A", margin: "0 0 4px" }}>
                  HireSmart Pre-Screening
                </p>
                <p style={{ fontSize: "0.75rem", lineHeight: 1.6, color: "#475569", margin: "0 0 12px" }}>
                  Pass the assessment → unlock CV upload → proceed to interview stage.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                  {["Skill Exam", "CV Upload", "Interview"].map((s, i) => (
                    <span key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ borderRadius: 100, border: "1px solid rgba(14,165,233,0.4)", background: "white", padding: "2px 10px", fontSize: "0.65rem", fontWeight: 700, color: "#0369A1" }}>
                        {s}
                      </span>
                      {i < 2 && <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8" }}>→</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── STATS BANNER ── */}
          <section style={{ background: "#0F172A", borderRadius: 20, marginTop: 60, padding: "2.5rem 2rem", display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { to: 2400, label: "Active Roles" },
              { to: 14800, label: "Candidates" },
              { to: 320, label: "Companies" },
              { to: 91, label: "Avg Pass Rate", suffix: "%" },
            ].map((s, i) => (
              <div key={s.label} style={{
                flex: 1, minWidth: 120, textAlign: "center", padding: "1rem 1.5rem",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}>
                <Counter to={s.to} label={s.label} suffix={s.suffix ?? "+"} />
              </div>
            ))}
          </section>

          {/* ── FEATURE CARDS ── */}
          <section style={{ marginTop: 60 }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0EA5E9", marginBottom: 10 }}>
                <span style={{ width: 20, height: 2, background: "#0EA5E9", borderRadius: 2 }} />
                Platform Features
              </div>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(1.9rem,3vw,2.5rem)", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em", margin: 0 }}>
                Built for students who play to win
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: "🎯", label: "Fair Exams",     desc: "Randomised role-based questions ensure every candidate faces a unique, equal challenge." },
                { icon: "🔒", label: "Secure Mode",    desc: "Fullscreen lock + tab-switch detection keeps the screening process reliable and honest." },
                { icon: "🤖", label: "AI Evaluation",  desc: "Scenario answers scored objectively by our evaluation module in real time." },
              ].map((f) => (
                <div key={f.label} className="feature-card">
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: 16 }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "1.05rem", color: "#0F172A", marginBottom: 6 }}>
                    {f.label}
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── JOBS ── */}
          <section id="jobs" style={{ marginTop: 80, scrollMarginTop: 32 }}>
            <div style={{ marginBottom: 28, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 6 }}>
                  — Live from database (Prisma + SQLite)
                </p>
                <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em", margin: 0 }}>
                  Jobs for You
                </h2>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button onClick={() => setFilter("all")} className={`filter-btn ${filter === "all" ? "f-active f-active-all" : ""}`}>All Roles</button>
                <button onClick={() => setFilter("internship")} className={`filter-btn ${filter === "internship" ? "f-active f-active-intern" : ""}`}>Internships</button>
                <button onClick={() => setFilter("fulltime")} className={`filter-btn ${filter === "fulltime" ? "f-active f-active-full" : ""}`}>Full-time</button>
              </div>
            </div>

            {isLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "white", border: "1px solid #E2E8F0", borderRadius: 16, padding: "40px 24px", color: "#94A3B8", fontSize: "0.875rem" }}>
                <svg className="animate-spin" style={{ width: 16, height: 16, color: "#0EA5E9" }} viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading positions…
              </div>
            )}

            {error && (
              <div style={{ borderRadius: 16, border: "1px solid #FECACA", background: "#FEF2F2", padding: "20px 24px", fontSize: "0.875rem", color: "#EF4444" }}>
                Failed to load jobs: {error.message}
              </div>
            )}

            {!isLoading && !error && filteredJobs.length === 0 && (
              <div style={{ padding: "48px 0", textAlign: "center", fontSize: "0.875rem", color: "#94A3B8" }}>
                No positions match this filter.
              </div>
            )}

            {!isLoading && !error && filteredJobs.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((j, i) => (
                  <JobCard key={j.id} index={i} job={{ ...j, company: j.company?.name ?? "", tags: typeof j.tags === "string" ? j.tags.split(",").map((t) => t.trim()).filter(Boolean) : [], deadline: j.deadline, slots: j.slots }} />
                ))}
              </div>
            )}
          </section>

          {/* ── CTA BANNER ── */}
          <section style={{
            marginTop: 80, borderRadius: 24, padding: "5rem 4rem",
            background: "#0F172A", position: "relative", overflow: "hidden", textAlign: "center",
          }}>
            {/* glow */}
            <div style={{ position: "absolute", top: "-60%", left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: "radial-gradient(ellipse, rgba(14,165,233,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />
            {/* grid */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
                Ready to <em style={{ fontStyle: "normal", color: "#0EA5E9" }}>stand out?</em>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.7, fontSize: "0.95rem" }}>
                Take the skill exam today and unlock your profile for top employers.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/exam" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", borderRadius: 10,
                  background: "#0EA5E9", color: "white", textDecoration: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1rem",
                  boxShadow: "0 4px 24px rgba(14,165,233,0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 36px rgba(14,165,233,0.5)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(14,165,233,0.4)"; }}
                >
                  Start Skill Exam →
                </Link>
                <Link href="/how-it-works" style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "14px 28px", borderRadius: 10,
                  border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "1rem", textDecoration: "none",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0EA5E9"; e.currentTarget.style.color = "#0EA5E9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                >
                  How It Works
                </Link>
              </div>
              <p style={{ marginTop: 16, fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>
                No credit card required · Cancel anytime · Free plan available
              </p>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}