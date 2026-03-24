"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

/* ─── Tag chip ───────────────────────────────────────────── */
function Tag({ text }: { text: string }) {
  return (
    <span
      style={{
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
      <span style={{ fontSize: "2.4rem", fontWeight: 700, color: "white", lineHeight: 1 }}>
        {val.toLocaleString()}<span style={{ color: "#0EA5E9" }}>{suffix}</span>
      </span>
      <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 5 }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Job Card ───────────────────────────────────────────── */
function formatSalary(value?: string | null) {
  if (!value) return "Negotiable";
  const numeric = value.replace(/[^0-9.]/g, "");
  if (numeric && !/[a-zA-Z]/.test(value)) return `LKR ${numeric}`;
  return value;
}

function formatJobType(value?: string) {
  const t = (value ?? "").toLowerCase();
  if (t.includes("intern")) return "Internship";
  if (t.includes("part")) return "Part Time";
  if (t.includes("full")) return "Full Time";
  return value ?? "";
}

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
    createdAt?: string | Date | null;
    applied?: boolean;
    examSubmitted?: boolean;
    terminated?: boolean;
    terminationReason?: string | null;
    applicationId?: string | null;
  };
  index: number;
  role?: string;
}) {
  const router = useRouter();
  const shareText = `Check this job: ${job.title}`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin + `/jobs/${job.id}` : "";
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-GB")
    : "";

  return (
    <div
      className="job-card"
      onClick={() => router.push(`/jobs/${job.id}`)}
      style={{
        animationDelay: `${index * 60}ms`,
        background: "white",
        border: "1px solid #E5EAF1",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
        transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "1.1rem 1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 600 }}>
            {postedDate ? `Posted ${postedDate}` : ""}
          </span>
          <a
            href={shareUrl ? `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}` : "#"}
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              border: "1px solid #E2E8F0",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
              textDecoration: "none",
            }}
            aria-label="Share job"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
              <path d="M16 6l-4-4-4 4" />
              <path d="M12 2v14" />
            </svg>
          </a>
        </div>

        <div style={{ marginTop: 10 }}>
          <h3 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>
            {job.title}
          </h3>
          <p style={{ marginTop: 4, fontSize: "0.78rem", color: "#94A3B8" }}>{job.company}</p>
        </div>

        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", color: "#64748B", fontSize: "0.75rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {job.location}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1v22" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7H14a3.5 3.5 0 010 7H6" />
            </svg>
            {formatSalary(job.salary)}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7h18" />
              <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
              <rect x="3" y="7" width="18" height="13" rx="2" />
            </svg>
            {formatJobType(job.type)}
          </span>
        </div>

        <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 600, letterSpacing: "0.08em" }}>
            {job.level?.toUpperCase()}
          </span>
          {role === "STUDENT" ? (
            job.terminationReason === "FACE_MISMATCH" ? (
              <Link href={`/exam/${job.id}?appId=${job.applicationId}`} onClick={(e) => e.stopPropagation()} style={{ fontSize: "0.75rem", fontWeight: 700, color: "#B45309", textDecoration: "none" }}>
                Retry Verification
              </Link>
            ) : job.terminated ? (
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#DC2626" }}>Limit Exceeded</span>
            ) : job.examSubmitted ? (
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#15803D" }}>Exam Done ✓</span>
            ) : job.applied ? (
              <Link href={`/exam/${job.id}?appId=${job.applicationId}`} onClick={(e) => e.stopPropagation()} style={{ borderRadius: 8, padding: "6px 14px", fontSize: "0.75rem", fontWeight: 700, color: "white", background: "#38BDF8", textDecoration: "none" }}>
                Start Exam →
              </Link>
            ) : (
              <Link href={`/jobs/${job.id}`} onClick={(e) => e.stopPropagation()} style={{ borderRadius: 8, padding: "6px 14px", fontSize: "0.75rem", fontWeight: 700, color: "white", background: "#0F2544", textDecoration: "none" }}>
                Apply Now →
              </Link>
            )
          ) : role === "COMPANY" ? (
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8" }}>View Job Details</span>
          ) : (
            <Link href="/student/login" style={{ borderRadius: 8, padding: "6px 14px", fontSize: "0.75rem", fontWeight: 700, color: "white", background: "#0F2544", textDecoration: "none" }}>
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

  const allJobs = (jobs ?? []).map((j) => ({
    ...j,
    company:
      typeof (j as any).company === "object"
        ? (j as any).company?.name ?? "Unknown Company"
        : (j as any).company ?? "Unknown Company",
  }));

  const appliedCount = allJobs.filter((j) => j.applied).length;
  const examDoneCount = allJobs.filter((j) => j.examSubmitted).length;
  const openCount = allJobs.filter((j) => !j.applied && !j.terminated).length;
  const totalCount = allJobs.length;

  const recentRoles = [...allJobs]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 4);

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
        * { box-sizing: border-box; }

        .job-card { animation: fadeUp 0.45s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        
        .job-card:hover {
          border-color: rgba(14,165,233,0.4);
          box-shadow: 0 20px 48px rgba(14,165,233,0.12);
          transform: translateY(-6px);
        }

        .hero-word { animation: wordIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes wordIn {
          from { opacity: 0; transform: translateY(22px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(40px) translateX(20px); }
        }

        .eyebrow-blink { animation: blink 1.4s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        /* ── Live openings card ── */
        .live-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          position: absolute;
          inset: 0;
          z-index: 2;
          box-shadow: 0 20px 60px rgba(14,165,233,0.10), 0 4px 16px rgba(15,23,42,0.06);
          border: 1px solid rgba(14,165,233,0.15);
        }

        .live-row {
          display: flex;
          align-items: center;
          gap: 14px;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 0.88rem;
          font-weight: 500;
          color: #334155;
          transition: background 0.2s, border-color 0.2s;
          cursor: default;
          border: 1px solid transparent;
        }
        .live-row:hover {
          background: #F0F9FF;
          border-color: rgba(14,165,233,0.2);
        }
        .live-row-label {
          margin-left: auto;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94A3B8;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .filter-btn {
          border: 1.5px solid rgba(14,165,233,0.3);
          background: rgba(255,255,255,0.7);
          color: #475569;
          border-radius: 999px;
          padding: 7px 18px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.18s;
          backdrop-filter: blur(8px);
        }
        .filter-btn:hover:not(.f-active) { 
          border-color: #0EA5E9; 
          color: #0369A1;
          background: rgba(224,242,254,0.8);
        }
        .f-active-all  { border-color: #0EA5E9 !important; background: rgba(14,165,233,0.15) !important; color: #0369A1 !important; }
        .f-active-intern { border-color: #818CF8 !important; background: rgba(129,140,248,0.15) !important; color: #6366F1 !important; }
        .f-active-full { border-color: #0EA5E9 !important; background: rgba(14,165,233,0.15) !important; color: #0369A1 !important; }

        .feature-card {
          background: white;
          border: 1px solid rgba(14,165,233,0.2);
          border-radius: 24px;
          padding: 2.5rem;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 4px 24px rgba(14,165,233,0.06);
        }
        .feature-card:hover {
          border-color: rgba(14,165,233,0.4);
          box-shadow: 0 20px 48px rgba(14,165,233,0.12);
          transform: translateY(-6px);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-word { animation: none; }
        }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#EEF6FF", position: "relative", overflow: "hidden" }}>

        {/* Subtle gradient orbs */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{
            position: "absolute", top: "-10%", right: "-5%", width: 700, height: 700,
            background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)",
            borderRadius: "50%", filter: "blur(80px)",
            animation: "float 15s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "5%", left: "-8%", width: 500, height: 500,
            background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
            borderRadius: "50%", filter: "blur(80px)",
            animation: "float 18s ease-in-out infinite reverse",
          }} />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-16">

          {/* ── HERO ── */}
          <section className="grid gap-16 md:grid-cols-[1fr_460px] md:items-center" style={{ marginBottom: 80, minHeight: "78vh" }}>

            {/* LEFT */}
            <div>
              {/* eyebrow */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(14,165,233,0.35)",
                borderRadius: 10, padding: "7px 16px", marginBottom: 32,
                fontSize: "0.7rem", fontWeight: 700, color: "#0369A1",
                letterSpacing: "0.1em", textTransform: "uppercase",
                backdropFilter: "blur(8px)",
              }}>
                <span className="eyebrow-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: "#0EA5E9", display: "inline-block" }} />
                HireSmart
              </div>

              {/* Main headline — large like Screenshot 1 */}
              <h1 style={{ margin: 0, letterSpacing: "-0.03em", lineHeight: 1.02 }}>
                <span className="hero-word block" style={{
                  fontSize: "clamp(3.5rem, 6vw, 6.5rem)",
                  fontWeight: 700,
                  color: "#0F172A",
                  animationDelay: "0ms",
                }}>
                  Beyond Skills,
                </span>
                <span className="hero-word block" style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                  fontWeight: 700,
                  color: "#1a2e4a",
                  animationDelay: "80ms",
                  marginTop: 8,
                }}>
                  Into{" "}
                  <span style={{ color: "#0EA5E9" }}>Potential.</span>
                </span>
              </h1>

              <p style={{ marginTop: 24, maxWidth: 520, fontSize: "1.05rem", lineHeight: 1.8, color: "#4A6580", fontWeight: 400}}>
                The future-ready screening platform where candidates prove capabilities through intelligent, secure assessments. Your potential unlock starts here.
              </p>

              {/* CTAs — matching Screenshot 1 style */}
              <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href="#jobs" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "16px 36px", borderRadius: 12,
                  background: "#1a2e4a",
                  color: "white", fontWeight: 700, fontSize: "0.9rem",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(26,46,74,0.25)",
                  transition: "all 0.25s",
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 16px 36px rgba(26,46,74,0.3)";
                    e.currentTarget.style.background = "#152540";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,46,74,0.25)";
                    e.currentTarget.style.background = "#1a2e4a";
                  }}
                >
                  EXPLORE OPPORTUNITIES
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
                <Link href="/how-it-works" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "16px 36px", borderRadius: 12,
                  border: "1.5px solid #CBD5E1",
                  background: "rgba(255,255,255,0.8)",
                  color: "#334155", fontWeight: 700, fontSize: "0.9rem",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "all 0.25s",
                  backdropFilter: "blur(8px)",
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0EA5E9";
                    e.currentTarget.style.color = "#0369A1";
                    e.currentTarget.style.background = "rgba(224,242,254,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#CBD5E1";
                    e.currentTarget.style.color = "#334155";
                    e.currentTarget.style.background = "rgba(255,255,255,0.8)";
                  }}
                >
                  HOW IT WORKS
                </Link>
              </div>

              {/* scroll hint */}
              <div style={{ marginTop: 60, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#94A3B8" }}>
                  SCROLL TO EXPLORE
                </span>
                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ opacity: 0.4 }}>
                  <rect x="1" y="1" width="12" height="18" rx="6" stroke="#0EA5E9" strokeWidth="1.5" />
                  <circle cx="7" cy="6" r="2" fill="#0EA5E9">
                    <animate attributeName="cy" values="6;12;6" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </div>

            {/* RIGHT — dark card  */}
            <div style={{ position: "relative", height: 520 , width: 500 }}>
              {/* Shadow card behind */}
              <div style={{
                position: "absolute",
                top: 12, left: 12, right: -12, bottom: -12,
                borderRadius: 22,
                background: "rgba(14,165,233,0.07)",
                border: "1px solid rgba(14,165,233,0.1)",
                zIndex: 1,
              }} />

              {/* Main dark card */}
              <div className="live-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#071d3b" }}>
                    {role === "STUDENT" ? "YOUR OPPORTUNITIES" : "OPPORTUNITIES OVERVIEW"}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 999, padding: "4px 12px", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.25)", color: "#0EA5E9" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0EA5E9", display: "inline-block" }} />
                    {openCount} OPEN
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, marginBottom: 12 }}>
                  {[
                    { label: "Applied", value: appliedCount },
                    { label: "Exam Done", value: examDoneCount },
                    { label: "Open", value: openCount },
                    { label: "Total", value: totalCount },
                  ].map((item) => (
                    <div key={item.label} style={{ borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFC", padding: "8px 10px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8" }}>
                        {item.label}
                      </p>
                      <p style={{ margin: "6px 0 0", fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {recentRoles.length === 0 ? (
                    <div style={{ borderRadius: 14, border: "1px dashed #E2E8F0", padding: "18px", textAlign: "center", color: "#94A3B8", fontSize: "0.85rem" }}>
                      No roles available yet.
                    </div>
                  ) : (
                    recentRoles.map((job) => (
                      <div key={job.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 12, border: "1px solid #E2E8F0", background: "#FFFFFF", padding: "8px 12px" }}>
                        <div>
                          <p style={{ margin: 0, fontSize: "0.84rem", fontWeight: 700, color: "#0F172A" }}>
                            {job.title}
                          </p>
                          <p style={{ marginTop: 3, marginBottom: 0, fontSize: "0.7rem", color: "#94A3B8" }}>
                            {job.company}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "3px 8px", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(14,165,233,0.08)", color: "#0EA5E9" }}>
                            {formatJobType(job.type) || "Role"}
                          </span>
                          <p style={{ marginTop: 4, marginBottom: 0, fontSize: "0.65rem", color: "#94A3B8" }}>
                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-GB") : "Recently posted"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                  <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                    {role === "STUDENT" ? "Track your progress and apply faster." : "Overview of current roles."}
                  </span>
                  <Link
                    href="#jobs"
                    style={{
                      borderRadius: 10,
                      padding: "10px 16px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      border: "none",
                      background: "#0F172A",
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    View Roles →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── STATS SECTION ── */}
          <section style={{
            marginBottom: 100,
            background: "linear-gradient(135deg, #1a2e4a 0%, #0c2040 100%)",
            borderRadius: 28, padding: "4rem 2rem",
            border: "1px solid rgba(14,165,233,0.15)",
            position: "relative", overflow: "hidden",
          }}>
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
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, minWidth: 140, textAlign: "center", padding: "1.5rem" }}>
                  <Counter to={s.to} label={s.label} suffix={s.suffix ?? "+"} />
                </div>
              ))}
            </div>
          </section>

          {/* ── FEATURE CARDS ── */}
          <section style={{ marginBottom: 80 }}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0EA5E9", marginBottom: 12 }}>
                <span style={{ width: 20, height: 2, background: "#0EA5E9", borderRadius: 2 }} />
                Why HireSmart
              </div>
              <h2 style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em", margin: 0 }}>
                Next-generation talent screening
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { icon: "🎯", label: "Intelligent Exams", desc: "Randomized, role-specific assessments that adapt to candidate expertise level, ensuring fair competition." },
                { icon: "🔐", label: "Fort Knox Security", desc: "Advanced proctoring with fullscreen enforcement, tab-switch detection, and biometric verification." },
                { icon: "🤖", label: "AI Evaluation Engine", desc: "Real-time scenario scoring using neural networks for objective, bias-free candidate assessment." },
              ].map((f) => (
                <div key={f.label} className="feature-card">
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: 20 }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: "1.15rem", color: "#0F172A", marginBottom: 10 }}>
                    {f.label}
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── JOBS ── */}
          <section id="jobs" style={{ marginTop: 80, scrollMarginTop: 32 }}>
            <div style={{ marginBottom: 32, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0EA5E9", marginBottom: 8 }}>
                  📊 Database Powered by Prisma & SQLite
                </p>
                <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em", margin: 0 }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.8)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: 16, padding: "40px 24px", color: "#94A3B8", fontSize: "0.875rem" }}>
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

        </div>
      </main>
    </>
  );
}