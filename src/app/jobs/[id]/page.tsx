import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Users,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";

const ROLE_ICON: Record<string, string> = {
  SOFTWARE_ENGINEER: "💻",
  UX_ENGINEER: "🎨",
  PROJECT_MANAGER: "📋",
};

const LEVEL_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  JUNIOR:  { bg: "rgba(59,130,246,0.1)",  color: "#2563EB", label: "Junior"  },
  MID:     { bg: "rgba(16,185,129,0.1)",  color: "#059669", label: "Mid"     },
  SENIOR:  { bg: "rgba(249,115,22,0.1)",  color: "#EA580C", label: "Senior"  },
};

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  FULL_TIME:   { bg: "rgba(14,165,233,0.1)",  color: "#0369A1" },
  INTERNSHIP:  { bg: "rgba(129,140,248,0.1)", color: "#6366F1" },
};

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function isExpired(deadline: Date | null | undefined): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid #E2E8F0",
      borderRadius: 20,
      padding: "28px 32px",
      boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ width: 3, height: 20, background: "#0EA5E9", borderRadius: 2, flexShrink: 0 }} />
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "#0F172A",
          letterSpacing: "-0.01em",
          margin: 0,
        }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function TextBlock({ text }: { text?: string | null }) {
  if (!text) return (
    <p style={{ fontSize: "0.875rem", color: "#CBD5E1", fontStyle: "italic" }}>No information provided.</p>
  );
  const lines = text.split("\n").filter(Boolean);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {lines.map((line, i) =>
        line.startsWith("-") ? (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{
              marginTop: 6, width: 6, height: 6, borderRadius: "50%",
              background: "#0EA5E9", flexShrink: 0,
            }} />
            <span style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.7, fontFamily: "'Space Grotesk', sans-serif" }}>
              {line.slice(1).trim()}
            </span>
          </div>
        ) : (
          <p key={i} style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.75, fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
            {line}
          </p>
        )
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 0",
      borderBottom: "1px solid #F1F5F9",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: "rgba(14,165,233,0.08)",
        border: "1px solid rgba(14,165,233,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, color: "#0EA5E9",
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", margin: 0 }}>{label}</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#0F172A", margin: 0, marginTop: 1 }}>{value}</p>
      </div>
    </div>
  );
}

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = await db.job.findUnique({
    where: { id: params.id },
    include: { company: true },
  });

  if (!job) return notFound();

  const exp = isExpired(job.deadline);
  const tags = job.tags
    ? job.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const levelInfo = LEVEL_STYLE[job.level] ?? { bg: "#F1F5F9", color: "#475569", label: job.level };
  const typeInfo  = TYPE_STYLE[job.type]   ?? { bg: "#F1F5F9", color: "#475569" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .jd-main {
          min-height: 100vh;
          background: #F0F6FF;
          font-family: 'Space Grotesk', sans-serif;
          padding: 40px 20px 80px;
        }

        /* ── HERO HEADER ── */
        .jd-hero {
          position: relative;
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 28px;
          box-shadow: 0 4px 24px rgba(15,23,42,0.06);
        }
        .jd-hero-strip {
          height: 5px;
          width: 100%;
        }
        .jd-hero-body {
          padding: 32px 36px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 24px;
          align-items: center;
        }

        /* role icon */
        .jd-role-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: #EFF6FF;
          border: 1px solid rgba(14,165,233,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          flex-shrink: 0;
        }

        /* badge row */
        .jd-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border-radius: 999px;
          padding: 4px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── SIDEBAR CARD ── */
        .jd-sidebar-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(15,23,42,0.04);
        }
        .jd-sidebar-header {
          padding: 16px 20px;
          background: #0F172A;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* ── SKILL TAG ── */
        .jd-skill-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(14,165,233,0.08);
          border: 1px solid rgba(14,165,233,0.2);
          color: #0369A1;
          border-radius: 8px;
          padding: 5px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          transition: background 0.2s, border-color 0.2s;
        }
        .jd-skill-tag:hover {
          background: rgba(14,165,233,0.15);
          border-color: rgba(14,165,233,0.4);
        }

        /* ── CTA BANNER ── */
        .jd-cta {
          margin-top: 28px;
          background: #0F172A;
          border-radius: 20px;
          padding: 28px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          position: relative;
          overflow: hidden;
        }
        .jd-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .jd-cta-glow {
          position: absolute;
          top: -40%;
          right: -5%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        /* buttons */
        .jd-btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
          z-index: 1;
        }
        .jd-btn-back:hover {
          background: rgba(255,255,255,0.1);
          color: white;
          border-color: rgba(255,255,255,0.2);
        }
        .jd-btn-apply {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0EA5E9, #38BDF8);
          color: white;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(14,165,233,0.3);
          transition: all 0.25s;
          position: relative;
          z-index: 1;
          letter-spacing: -0.01em;
        }
        .jd-btn-apply:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(14,165,233,0.4);
        }

        /* ── DEADLINE PROGRESS ── */
        .jd-deadline-bar {
          height: 4px;
          background: #F1F5F9;
          border-radius: 999px;
          margin-top: 6px;
          overflow: hidden;
        }
        .jd-deadline-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #0EA5E9, #38BDF8);
          transition: width 0.6s ease;
        }

        .jd-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: #64748B;
          text-decoration: none;
          transition: color 0.2s;
        }
        .jd-back-link:hover { color: #0EA5E9; }

        @media (max-width: 900px) {
          .jd-hero-body { grid-template-columns: auto 1fr; }
          .jd-hero-status { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .jd-hero-body { padding: 20px; gap: 16px; }
          .jd-cta { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <main className="jd-main">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* ── BACK LINK ── */}
          <Link href="/" className="jd-back-link">
            <ArrowLeft size={15} />
            Back to Jobs
          </Link>

          {/* ── HERO ── */}
          <div className="jd-hero">
            {/* colour strip */}
            <div className="jd-hero-strip" style={{
              background: exp
                ? "linear-gradient(90deg, #F87171, #EF4444)"
                : "linear-gradient(90deg, #0EA5E9, #38BDF8, #818CF8)",
            }} />

            <div className="jd-hero-body">
              {/* Icon */}
              <div className="jd-role-icon">
                {ROLE_ICON[job.role] ?? "💼"}
              </div>

              {/* Title block */}
              <div>
                <h1 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                  fontWeight: 700,
                  color: "#0F172A",
                  letterSpacing: "-0.03em",
                  margin: "0 0 6px",
                }}>
                  {job.title}
                </h1>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.9rem",
                  color: "#64748B",
                  margin: "0 0 14px",
                }}>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>{job.company.name}</span>
                  <span style={{ margin: "0 8px", color: "#CBD5E1" }}>·</span>
                  {job.location}
                </p>

                {/* Badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {/* Status */}
                  <span className="jd-badge" style={{
                    background: exp ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                    color: exp ? "#DC2626" : "#059669",
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                    {exp ? "Expired" : "Active"}
                  </span>

                  {/* Type */}
                  <span className="jd-badge" style={{ background: typeInfo.bg, color: typeInfo.color }}>
                    {job.type.replace("_", " ")}
                  </span>

                  {/* Level */}
                  <span className="jd-badge" style={{ background: levelInfo.bg, color: levelInfo.color }}>
                    {levelInfo.label}
                  </span>

                  {/* Slots */}
                  {job.slots && (
                    <span className="jd-badge" style={{ background: "#F1F5F9", color: "#475569" }}>
                      <Users size={9} /> {job.slots} openings
                    </span>
                  )}
                </div>
              </div>

              {/* Deadline (top-right) */}
              {job.deadline && (
                <div style={{
                  textAlign: "right", flexShrink: 0,
                  background: "#F8FAFF", border: "1px solid #E2E8F0",
                  borderRadius: 14, padding: "14px 18px", minWidth: 160,
                }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 4px" }}>
                    Deadline
                  </p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.875rem", fontWeight: 700, color: exp ? "#EF4444" : "#0F172A", margin: 0 }}>
                    {fmtDate(job.deadline)}
                  </p>
                  <div className="jd-deadline-bar" style={{ marginTop: 8 }}>
                    <div className="jd-deadline-fill" style={{
                      width: exp ? "100%" : "65%",
                      background: exp ? "linear-gradient(90deg, #F87171, #EF4444)" : undefined,
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── MAIN GRID ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>

            {/* LEFT – Content sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Section title="Job Description">
                <TextBlock text={job.description} />
              </Section>

              <Section title="Responsibilities">
                <TextBlock text={job.responsibilities} />
              </Section>

              <Section title="Requirements">
                <TextBlock text={job.requirements} />
              </Section>

              {job.benefits && (
                <Section title="Benefits & Perks">
                  <TextBlock text={job.benefits} />
                </Section>
              )}
            </div>

            {/* RIGHT – Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Job Info card */}
              <div className="jd-sidebar-card">
                <div className="jd-sidebar-header">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                    Job Details
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 600, color: "#0EA5E9", letterSpacing: "0.08em" }}>
                    #{job.id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div style={{ padding: "4px 20px 12px" }}>
                  <InfoRow icon={<MapPin size={15} />} label="Location" value={job.location} />
                  {job.salary && (
                    <InfoRow icon={<DollarSign size={15} />} label="Salary" value={job.salary} />
                  )}
                  <InfoRow
                    icon={<Calendar size={15} />}
                    label="Deadline"
                    value={job.deadline ? fmtDate(job.deadline) : "No deadline"}
                  />
                  {job.slots && (
                    <InfoRow icon={<Users size={15} />} label="Openings" value={`${job.slots} positions`} />
                  )}
                  <div style={{ paddingTop: 4 }}>
                    <InfoRow icon={<Briefcase size={15} />} label="Employment Type" value={job.type.replace("_", " ")} />
                  </div>
                </div>
              </div>

              {/* Company card */}
              <div style={{
                background: "white", border: "1px solid #E2E8F0", borderRadius: 20,
                padding: "20px", boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
              }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 14 }}>
                  Company
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "linear-gradient(135deg, #0EA5E9, #38BDF8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "0.8rem",
                    color: "white", flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(14,165,233,0.25)",
                  }}>
                    {job.company.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#0F172A", margin: 0 }}>
                      {job.company.name}
                    </p>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: "#94A3B8", margin: 0, marginTop: 2 }}>
                      {job.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills card */}
              {tags.length > 0 && (
                <div style={{
                  background: "white", border: "1px solid #E2E8F0", borderRadius: 20,
                  padding: "20px", boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <Tag size={13} color="#0EA5E9" />
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", margin: 0 }}>
                      Required Skills
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {tags.map((tag) => (
                      <span key={tag} className="jd-skill-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ── CTA BANNER ── */}
          <div className="jd-cta">
            <div className="jd-cta-glow" />
            <div style={{ position: "relative", zIndex: 1 }}>
              {!exp ? (
                <>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "white", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                    Ready to apply?
                  </p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", margin: 0 }}>
                    Submit your CV details and complete the skill assessment to proceed.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>
                    Applications Closed
                  </p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.3)", margin: 0 }}>
                    This job posting has passed its deadline.
                  </p>
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", position: "relative", zIndex: 1 }}>
              <Link href="/" className="jd-btn-back">
                <ArrowLeft size={14} />
                Back to Jobs
              </Link>
              {!exp && (
                <Link href={`/apply/${job.id}`} className="jd-btn-apply">
                  Apply Now
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}