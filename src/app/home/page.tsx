//smart-screening\src\app\page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

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
function JobCard({
  job,
  index,
  role,
}: {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    level: string;
    tags: string[];
    salary?: string | null;
    
    applied?: boolean;
    examSubmitted?: boolean;
    terminated?: boolean;
    terminationReason?: string | null;
    applicationId?: string | null;
  };
  index: number;
  role?: string;
})  {
  const isIntern = job.type?.toLowerCase().includes("intern");

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
      <div style={{ height: 4, width: "100%", background: isIntern ? "linear-gradient(90deg, #818CF8, #A78BFA)" : "linear-gradient(90deg, #0EA5E9, #38BDF8)", flexShrink: 0 }} />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "1.25rem" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{
            width: 40, height: 40, flexShrink: 0, borderRadius: 13,
            background: isIntern ? "#EEF2FF" : "#E0F2FE",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem"
          }}>
            {isIntern ? "🎓" : "💼"}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{
              borderRadius: "100px", padding: "2px 10px", fontSize: 9,
              fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
              background: isIntern ? "#EEF2FF" : "#E0F2FE",
              color: isIntern ? "#6366F1" : "#0369A1",
            }}>
              {job.type}
            </span>
            <span style={{
              borderRadius: "100px", padding: "2px 10px", fontSize: 9,
              fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
              background: "#F1F5F9", color: "#475569",
            }}>
              {job.level}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>
            {job.title}
          </h3>
          <p style={{ marginTop: 4, fontSize: "0.75rem", color: "#94A3B8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {job.company} · {job.location}
          </p>
        </div>

        {job.tags?.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {job.tags.map((t) => <Tag key={t} text={t} />)}
          </div>
        )}

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20 }}>
          <p style={{ fontSize: "0.75rem", color: "#94A3B8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Salary: <span style={{ fontWeight: 600, color: "#475569" }}>{job.salary ?? "Negotiable"}</span>
          </p>
  {role === "STUDENT" ? (
  job.terminationReason === "FACE_MISMATCH" ? (
    <Link
      href={`/exam/${job.id}?appId=${job.applicationId}`}
      style={{
        borderRadius: 10,
        padding: "8px 16px",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: "#FEF3C7",
        color: "#92400E",
        textDecoration: "none",
      }}
    >
      Retry Verification
    </Link>
  ) : job.terminated ? (
    <button
      disabled
      style={{
        borderRadius: 10,
        padding: "8px 16px",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: "#FEE2E2",
        color: "#B91C1C",
        cursor: "not-allowed",
      }}
    >
      ✕ you exceeded the violation limit
    </button>
  ) : job.examSubmitted ? (
    <button
      disabled
      style={{
        borderRadius: 10,
        padding: "8px 16px",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: "#DCFCE7",
        color: "#15803D",
        cursor: "not-allowed",
      }}
    >
      ✓ Exam Completed
    </button>
  ) : job.applied ? (
    <Link
      href={`/exam/${job.id}?appId=${job.applicationId}`}
      style={{
        borderRadius: 10,
        padding: "8px 16px",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "white",
        background: "#0EA5E9",
        textDecoration: "none",
      }}
    >
      Start Exam
    </Link>
  ) : (
    <Link
     href={`/jobs/${job.id}`}
      style={{
        borderRadius: 10,
        padding: "8px 16px",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "white",
        background: "#0F172A",
        textDecoration: "none",
      }}
    >
      Apply →
    </Link>
  )
) : role === "COMPANY" ? (
  <button
    disabled
    style={{
      borderRadius: 10,
      padding: "8px 16px",
      fontSize: "0.75rem",
      fontWeight: 700,
      background: "#CBD5E1",
      color: "#64748B",
      cursor: "not-allowed",
    }}
  >
    View Job Details
  </button>
) : (
  <Link
    href="/student/login"
    style={{
      borderRadius: 10,
      padding: "8px 16px",
      fontSize: "0.75rem",
      fontWeight: 700,
      background: "#0EA5E9",
      color: "white",
      textDecoration: "none",
    }}
  >
    Login to Apply
  </Link>
)}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function HomePage() {

  const { data: session } = useSession();
  const role = session?.user?.role;

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

        * { box-sizing: border-box; }

        .job-card { animation: fadeUp 0.45s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-word { animation: wordIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes wordIn {
          from { opacity: 0; transform: translateY(22px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .floating { animation: floating 6s ease-in-out infinite; }
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .blur-in { animation: blurIn 0.6s ease-out; }
        @keyframes blurIn {
          from { opacity: 0; filter: blur(10px); }
          to { opacity: 1; filter: blur(0); }
        }

        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(14,165,233,0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(14,165,233,0.6)); }
        }

        .filter-btn {
          border: 1.5px solid rgba(14,165,233,0.3);
          background: rgba(255,255,255,0.7);
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
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
        }
        .filter-btn:hover:not(.f-active) { 
          border-color: #0EA5E9; 
          color: #0369A1;
          background: rgba(224,242,254,0.8);
        }
        .f-active-all  { border-color: #0EA5E9 !important; background: rgba(14,165,233,0.15) !important; color: #0369A1 !important; backdrop-filter: blur(8px); }
        .f-active-intern { border-color: #818CF8 !important; background: rgba(129,140,248,0.15) !important; color: #6366F1 !important; backdrop-filter: blur(8px); }
        .f-active-full { border-color: #0EA5E9 !important; background: rgba(14,165,233,0.15) !important; color: #0369A1 !important; backdrop-filter: blur(8px); }

        .glass-card {
          background: rgba(255,255,255,0.8);
          -webkit-backdrop-filter: blur(20px);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(14,165,233,0.2);
          border-radius: 24px;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 8px 32px rgba(15,23,42,0.08);
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.95);
          border-color: rgba(14,165,233,0.4);
          box-shadow: 0 20px 48px rgba(14,165,233,0.15);
          transform: translateY(-8px);
        }

        .feature-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(224,242,254,0.5) 100%);
          border: 1px solid rgba(14,165,233,0.25);
          border-radius: 24px;
          padding: 2.5rem;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 8px 32px rgba(14,165,233,0.08);
          position: relative;
          overflow: hidden;
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(14,165,233,0.05), transparent);
          pointer-events: none;
        }
        .feature-card:hover {
          border-color: rgba(14,165,233,0.4);
          box-shadow: 0 20px 48px rgba(14,165,233,0.12);
          transform: translateY(-8px);
          background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(224,242,254,0.7) 100%);
        }

        .eyebrow-blink { animation: blink 1.4s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .trending-row {
          display: flex; align-items: center; gap: 12px;
          border-radius: 12px; 
          border: 1px solid rgba(14,165,233,0.2);
          background: rgba(224,242,254,0.5); 
          padding: 12px 16px;
          font-size: 0.875rem; 
          color: #475569;
          transition: all 0.2s;
          cursor: default;
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
        }
        .trending-row:hover { 
          border-color: rgba(14,165,233,0.5); 
          background: rgba(14,165,233,0.1); 
          color: #0F172A; 
          transform: translateX(4px);
        }

        .progress-bar-fill {
          height: 100%; border-radius: 100px;
          background: linear-gradient(90deg, #0EA5E9, #38BDF8);
        }

        .scroll-fade {
          position: relative;
        }

        @media (prefers-reduced-motion: reduce) {
          .floating, .hero-word, .blur-in, .glow-pulse { animation: none; }
        }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#F8FAFF", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative", overflow: "hidden" }}>

        {/* Animated gradient orbs */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        }}>
          {/* Orb 1 */}
          <div style={{
            position: "absolute", top: "-10%", right: "-5%", width: 600, height: 600,
            background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
            borderRadius: "50%", filter: "blur(80px)",
            animation: "float 15s ease-in-out infinite",
          }} />
          {/* Orb 2 */}
          <div style={{
            position: "absolute", bottom: "10%", left: "-10%", width: 500, height: 500,
            background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)",
            borderRadius: "50%", filter: "blur(80px)",
            animation: "float 18s ease-in-out infinite reverse",
          }} />
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) translateX(0px); }
              50% { transform: translateY(40px) translateX(20px); }
            }
          `}</style>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-14">
      
          {/* ── HERO ── */}
          <section className="grid gap-16 md:grid-cols-[1fr_420px] md:items-center" style={{ marginBottom: 80 }}>
            {/* LEFT */}
            <div>
              {/* eyebrow */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(224,242,254,0.6)", 
                border: "1px solid rgba(14,165,233,0.4)",
                borderRadius: 12, padding: "8px 16px", marginBottom: 28,
                fontSize: "0.72rem", fontWeight: 700, color: "#0369A1",
                letterSpacing: "0.08em", textTransform: "uppercase",
                backdropFilter: "blur(8px)",
              }}>
                <span className="eyebrow-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: "#0EA5E9", display: "inline-block" }} />
                HireSmart
              </div>

              <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.05, margin: 0 }}>
                <span className="hero-word block" style={{ fontSize: "clamp(3.5rem,7vw,6rem)", animationDelay: "0ms" }}>
                  Beyond Skills
                </span>
                <span className="hero-word block" style={{ fontSize: "clamp(1.6rem,3.5vw,2.6rem)", marginTop: 12, animationDelay: "100ms", background: "linear-gradient(135deg, #0F172A, #0EA5E9)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Into Potential
                </span>
              </h1>

              <p style={{ marginTop: 24, maxWidth: 500, fontSize: "1.1rem", lineHeight: 1.8, color: "#475569", fontWeight: 400 }}>
                Future-ready screening platform where you prove your capabilities through intelligent, secure assessments. Your potential unlock starts here.
              </p>

              {/* CTAs */}
              <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href="#jobs" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "16px 32px", borderRadius: 14,
                  background: "linear-gradient(135deg, #0F172A, #0EA5E9)",
                  color: "white",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: "0.98rem", textDecoration: "none",
                  boxShadow: "0 12px 32px rgba(14,165,233,0.25)",
                  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 20px 48px rgba(14,165,233,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,165,233,0.25)";
                  }}
                >
                  Explore Opportunities
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
                <Link href="/how-it-works" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "16px 32px", borderRadius: 14,
                  border: "1.5px solid rgba(14,165,233,0.4)", 
                  background: "rgba(255,255,255,0.7)",
                  color: "#0F172A", fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: "0.98rem", textDecoration: "none",
                  transition: "all 0.3s",
                  backdropFilter: "blur(8px)",
                }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.borderColor = "#0EA5E9"; 
                    e.currentTarget.style.background = "rgba(224,242,254,0.8)";
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.borderColor = "rgba(14,165,233,0.4)"; 
                    e.currentTarget.style.background = "rgba(255,255,255,0.7)";
                  }}
                >
                  Learn More
                </Link>
              </div>

              {/* Trust badges */}
              <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                {["Enterprise Security", "AI-Powered", "Trusted by 300+"].map((t, i) => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}>
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(14,165,233,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#0EA5E9" }}>✓</span>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT - Glass Card Stack */}
            <div style={{ position: "relative", height: "100%", minHeight: 450 }}>
              {/* Back card */}
              <div style={{
                position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(14,165,233,0.08), transparent)",
                border: "1px solid rgba(14,165,233,0.15)", borderRadius: 24, backdropFilter: "blur(12px)",
                transform: "translateY(16px) translateX(16px)", zIndex: 1,
              }} />
              
              {/* Front card */}
              <div className="glass-card" style={{
                position: "absolute", inset: 0, zIndex: 2,
                background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.4) 100%)",
                padding: 28, backdropFilter: "blur(20px)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <p style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0F172A", margin: 0 }}>
                    🚀 Trending Now
                  </p>
                  <span style={{ borderRadius: 100, background: "rgba(14,165,233,0.1)", padding: "4px 14px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#0369A1", border: "1px solid rgba(14,165,233,0.2)" }}>
                    Live
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "AI Engineer", color: "#0EA5E9" },
                    { label: "ML Specialist", color: "#818CF8" },
                    { label: "Data Scientist", color: "#38BDF8" },
                    { label: "Tech Internship", color: "#34D399" },
                  ].map((r) => (
                    <div key={r.label} className="trending-row">
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                      {r.label}
                      <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#94A3B8" }}>→</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderRadius: 16, border: "1px solid rgba(14,165,233,0.3)", background: "rgba(224,242,254,0.4)", padding: 16, backdropFilter: "blur(8px)" }}>
                  <p style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#0F172A", margin: "0 0 8px" }}>
                    ⚡ Smart Screening Flow
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem", color: "#475569", fontWeight: 600 }}>
                    <span style={{ background: "rgba(14,165,233,0.2)", color: "#0369A1", padding: "2px 8px", borderRadius: 4 }}>Basic CV data enter & Secure role based exam</span>
                    <span style={{ color: "#0EA5E9", fontWeight: 700 }}>→</span>
                    <span style={{ background: "rgba(14,165,233,0.1)", color: "#0369A1", padding: "2px 8px", borderRadius: 4 }}>CV upload unlock</span>
                    <span style={{ color: "#0EA5E9", fontWeight: 700 }}>→</span>
                    <span style={{ background: "rgba(129,140,248,0.1)", color: "#6366F1", padding: "2px 8px", borderRadius: 4 }}>Interview</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── STATS SECTION ── */}
          <section style={{
            marginTop: 100, marginBottom: 100,
            background: "linear-gradient(135deg, #0F172A 0%, rgba(14,165,233,0.1) 100%)",
            borderRadius: 28, padding: "4rem 2rem", 
            border: "1px solid rgba(14,165,233,0.2)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Grid overlay */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px", pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "2rem" }}>
              {[
                { to: 2400, label: "Active Opportunities" },
                { to: 14800, label: "Talented Candidates" },
                { to: 320, label: "Partner Companies" },
                { to: 91, label: "Success Rate", suffix: "%" },
              ].map((s, i) => (
                <div key={s.label} style={{
                  flex: 1, minWidth: 140, textAlign: "center", padding: "1.5rem",
                }}>
                  <Counter to={s.to} label={s.label} suffix={s.suffix ?? "+"} />
                </div>
              ))}
            </div>
          </section>

          {/* ── FEATURE CARDS ── */}
          <section style={{ marginTop: 20, marginBottom: 80 }}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0EA5E9", marginBottom: 12 }}>
                <span style={{ width: 20, height: 2, background: "#0EA5E9", borderRadius: 2 }} />
                Why HireSmart 2050
              </div>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em", margin: 0 }}>
                Next-generation talent screening
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { icon: "🎯", label: "Intelligent Exams",     desc: "Randomized, role-specific assessments that adapt to candidate expertise level, ensuring fair competition." },
                { icon: "🔐", label: "Fort Knox Security",    desc: "Advanced proctoring with fullscreen enforcement, tab-switch detection, and biometric verification." },
                { icon: "🤖", label: "AI Evaluation Engine",  desc: "Real-time scenario scoring using neural networks for objective, bias-free candidate assessment." },
              ].map((f) => (
                <div key={f.label} className="feature-card" style={{ position: "relative" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, rgba(14,165,233,0.15), rgba(224,242,254,0.3))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: 20, border: "1px solid rgba(14,165,233,0.2)", position: "relative" }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#0F172A", marginBottom: 10 }}>
                    {f.label}
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── JOBS ── */}
          <section id="jobs" style={{ marginTop: 100, scrollMarginTop: 32 }}>
            <div style={{ marginBottom: 32, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0EA5E9", marginBottom: 8 }}>
                  📊 Database Powered by Prisma & SQLite
                </p>
                <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em", margin: 0 }}>
                  Opportunities Awaiting
                </h2>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <button onClick={() => setFilter("all")} className={`filter-btn ${filter === "all" ? "f-active f-active-all" : ""}`}>All Roles</button>
                <button onClick={() => setFilter("internship")} className={`filter-btn ${filter === "internship" ? "f-active f-active-intern" : ""}`}>Internships</button>
                <button onClick={() => setFilter("fulltime")} className={`filter-btn ${filter === "fulltime" ? "f-active f-active-full" : ""}`}>Full-time</button>
              </div>
            </div>

            {isLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.8)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: 16, padding: "40px 24px", color: "#94A3B8", fontSize: "0.875rem", backdropFilter: "blur(8px)" }}>
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
                  <JobCard
                    key={j.id}
                    index={i}
                    role={role}
                    job={{
                      ...j,
                      tags: Array.isArray((j as any).tags) ? ((j as any).tags as string[]) : [],
                      company:
  typeof (j as any).company === "object"
    ? (j as any).company?.name ?? "Unknown Company"
    : (j as any).company ?? "Unknown Company"
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── CTA BANNER ── */}
          <section style={{
            marginTop: 120, borderRadius: 32, padding: "6rem 4rem 5rem",
            background: "linear-gradient(135deg, #0F172A 0%, rgba(14,165,233,0.08) 100%)",
            position: "relative", overflow: "hidden", textAlign: "center",
            border: "1px solid rgba(14,165,233,0.2)",
          }}>
            {/* Animated orbs */}
            <div style={{
              position: "absolute", top: "-40%", left: "-10%", width: 600, height: 600,
              background: "radial-gradient(ellipse, rgba(14,165,233,0.15) 0%, transparent 70%)",
              borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-30%", right: "-5%", width: 500, height: 500,
              background: "radial-gradient(ellipse, rgba(14,165,233,0.1) 0%, transparent 70%)",
              borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.2rem,4.5vw,3.2rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", margin: "0 0 16px", lineHeight: 1.1 }}>
                Your Future <em style={{ fontStyle: "normal", color: "#38BDF8", textShadow: "0 0 30px rgba(56,189,248,0.3)" }}>starts here</em>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.8, fontSize: "1rem" }}>
                Step into the exam room. Prove your skills. Unlock your potential with leading enterprises ready to invest in talent.
              </p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
                <Link href="/exam" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "16px 36px", borderRadius: 14,
                  background: "linear-gradient(135deg, #0EA5E9, #38BDF8)", 
                  color: "white", textDecoration: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.05rem",
                  boxShadow: "0 16px 40px rgba(14,165,233,0.35)",
                  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = "translateY(-4px)"; 
                    e.currentTarget.style.boxShadow = "0 24px 56px rgba(14,165,233,0.45)";
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = "translateY(0)"; 
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(14,165,233,0.35)";
                  }}
                >
                  Begin Assessment →
                </Link>
                <Link href="/how-it-works" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "16px 36px", borderRadius: 14,
                  border: "1.5px solid rgba(255,255,255,0.25)", 
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.05rem", 
                  textDecoration: "none",
                  transition: "all 0.3s",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.borderColor = "#38BDF8"; 
                    e.currentTarget.style.color = "#38BDF8";
                    e.currentTarget.style.background = "rgba(56,189,248,0.1)";
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; 
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                >
                  Learn Process
                </Link>
              </div>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: 0 }}>
                💡 Secure assessment • Real-time evaluation • Transparent results
              </p>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}