import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  DollarSign,
  Tag,
  ChevronRight,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ROLE_ICON: Record<string, string> = {
  SOFTWARE_ENGINEER: "💻",
  UX_ENGINEER: "🎨",
  PROJECT_MANAGER: "📋",
};

const LEVEL_STYLE: Record<string, { bg: string; color: string; border: string; label: string }> = {
  JUNIOR:  { bg: "rgba(59,130,246,0.08)",  color: "#2563EB", border: "rgba(59,130,246,0.2)", label: "Junior"  },
  MID:     { bg: "rgba(16,185,129,0.08)",  color: "#059669", border: "rgba(16,185,129,0.2)", label: "Mid-Level" },
  SENIOR:  { bg: "rgba(249,115,22,0.08)",  color: "#EA580C", border: "rgba(249,115,22,0.2)", label: "Senior"  },
};

const TYPE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  FULL_TIME:   { bg: "rgba(14,165,233,0.08)",  color: "#0369A1", border: "rgba(14,165,233,0.2)" },
  INTERNSHIP:  { bg: "rgba(129,140,248,0.08)", color: "#6366F1", border: "rgba(129,140,248,0.2)" },
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
      border: "1px solid #E8EDF5",
      borderRadius: 16,
      padding: "28px 32px",
      boxShadow: "0 1px 4px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <span style={{ width: 3, height: 18, background: "linear-gradient(180deg, #0EA5E9, #38BDF8)", borderRadius: 2, flexShrink: 0 }} />
        <h3 style={{
          fontSize: "0.825rem",
          fontWeight: 700,
          color: "#0F172A",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          margin: 0,
        }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function TextBlock({ text }: { text?: string | null }) {
  if (!text) return (
    <p style={{ fontSize: "0.875rem", color: "#CBD5E1", fontStyle: "italic", margin: 0 }}>No information provided.</p>
  );
  const lines = text.split("\n").filter(Boolean);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {lines.map((line, i) =>
        line.startsWith("-") ? (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{
              marginTop: 7, width: 5, height: 5, borderRadius: "50%",
              background: "#0EA5E9", flexShrink: 0,
            }} />
            <span style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.75 }}>
              {line.slice(1).trim()}
            </span>
          </div>
        ) : (
          <p key={i} style={{ fontSize: "0.9rem", color: "#475569", lineHeight: "1.8", margin: 0 }}>
            {line}
          </p>
        )
      )}
    </div>
  );
}

function InfoRow({ icon, label, value, last }: { icon: React.ReactNode; label: string; value: string; last?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "13px 0",
      borderBottom: last ? "none" : "1px solid #F1F5F9",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: "rgba(14,165,233,0.07)",
        border: "1px solid rgba(14,165,233,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, color: "#0EA5E9",
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", margin: 0 }}>{label}</p>
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1E293B", margin: 0, marginTop: 2 }}>{value}</p>
      </div>
    </div>
  );
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const job = await db.job.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!job) return notFound();

  const exp = isExpired(job.deadline);
  const tags = job.tags
    ? job.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const application = session?.user?.id
    ? await db.application.findFirst({
        where: {
          userId: session.user.id,
          jobId: job.id,
        },
        select: { id: true, examSubmitted: true, terminationReason: true },
      })
    : null;
  const examSubmitted = application?.examSubmitted ?? false;
  const terminated = application?.terminationReason === "VIOLATION" && !examSubmitted;
  const hasApplication = Boolean(application?.id);

  const levelInfo = LEVEL_STYLE[job.level] ?? { bg: "#F1F5F9", color: "#475569", border: "#E2E8F0", label: job.level };
  const typeInfo  = TYPE_STYLE[job.type]   ?? { bg: "#F1F5F9", color: "#475569", border: "#E2E8F0" };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .jd-page {
          min-height: 100vh;
          background: #F5F7FA;
          padding: 36px 24px 80px;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
        }

        .jd-container {
          max-width: 1080px;
          margin: 0 auto;
        }

        /* ── BACK LINK ── */
        .jd-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 24px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748B;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: color 0.2s;
          padding: 6px 12px;
          border-radius: 8px;
          background: white;
          border: 1px solid #E8EDF5;
          box-shadow: 0 1px 3px rgba(15,23,42,0.04);
        }
        .jd-back:hover { color: #0EA5E9; border-color: rgba(14,165,233,0.3); }

        /* ── HERO ── */
        .jd-hero {
          background: white;
          border: 1px solid #E8EDF5;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(15,23,42,0.05), 0 8px 32px rgba(15,23,42,0.04);
        }
        .jd-hero-accent {
          height: 4px;
          width: 100%;
        }
        .jd-hero-inner {
          padding: 32px 36px;
          display: grid;
          grid-template-columns: 72px 1fr auto;
          gap: 24px;
          align-items: flex-start;
        }
        .jd-role-icon {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: linear-gradient(135deg, #EFF6FF 0%, #E0F2FE 100%);
          border: 1px solid rgba(14,165,233,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.9rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(14,165,233,0.1);
        }

        /* ── BADGES ── */
        .jd-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: 1px solid transparent;
        }
        .jd-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        /* ── DEADLINE BOX ── */
        .jd-deadline-box {
          text-align: right;
          background: #FAFBFF;
          border: 1px solid #E8EDF5;
          border-radius: 14px;
          padding: 16px 20px;
          min-width: 168px;
          flex-shrink: 0;
        }
        .jd-deadline-bar {
          height: 3px;
          background: #F1F5F9;
          border-radius: 999px;
          margin-top: 10px;
          overflow: hidden;
        }
        .jd-deadline-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.6s ease;
        }

        /* ── GRID ── */
        .jd-grid {
          display: grid;
          grid-template-columns: 1fr 308px;
          gap: 20px;
          align-items: start;
        }
        .jd-left { display: flex; flex-direction: column; gap: 16px; }
        .jd-right { display: flex; flex-direction: column; gap: 16px; }

        /* ── SIDEBAR CARDS ── */
        .jd-card {
          background: white;
          border: 1px solid #E8EDF5;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03);
        }
        .jd-card-header {
          padding: 14px 20px;
          background: #0F172A;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .jd-card-body { padding: 4px 20px 12px; }

        /* ── SKILL TAG ── */
        .jd-skill {
          display: inline-flex;
          align-items: center;
          background: rgba(14,165,233,0.07);
          border: 1px solid rgba(14,165,233,0.18);
          color: #0369A1;
          border-radius: 7px;
          padding: 5px 11px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: background 0.15s, border-color 0.15s;
        }
        .jd-skill:hover {
          background: rgba(14,165,233,0.13);
          border-color: rgba(14,165,233,0.35);
        }

        /* ── CTA BANNER ── */
        .jd-cta {
          margin-top: 20px;
          background: #0B1120;
          border-radius: 18px;
          padding: 30px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        }
        .jd-cta-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
        }
        .jd-cta-glow {
          position: absolute;
          top: -60%;
          right: -8%;
          width: 340px;
          height: 340px;
          background: radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }

        /* ── BUTTONS ── */
        .jd-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          font-size: 0.825rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
          z-index: 1;
        }
        .jd-btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          color: white;
          border-color: rgba(255,255,255,0.18);
        }
        .jd-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 26px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%);
          color: white;
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(14,165,233,0.35);
          transition: all 0.2s;
          position: relative;
          z-index: 1;
          letter-spacing: -0.01em;
          border: none;
          cursor: pointer;
        }
        .jd-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(14,165,233,0.45);
        }
        .jd-btn-disabled {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 26px;
          border-radius: 10px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.35);
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: not-allowed;
          position: relative;
          z-index: 1;
        }

        /* ── DIVIDER ── */
        .jd-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #E8EDF5 20%, #E8EDF5 80%, transparent);
          margin: 4px 0;
        }

        @media (max-width: 900px) {
          .jd-grid { grid-template-columns: 1fr; }
          .jd-right { order: -1; }
          .jd-hero-inner { grid-template-columns: 72px 1fr; }
          .jd-deadline-box { grid-column: 1 / -1; text-align: left; }
        }
        @media (max-width: 640px) {
          .jd-page { padding: 20px 16px 60px; }
          .jd-hero-inner { padding: 20px; gap: 14px; }
          .jd-cta { flex-direction: column; align-items: flex-start; padding: 24px 20px; }
        }
      `}</style>

      <main className="jd-page">
        <div className="jd-container">

          {/* ── BACK LINK ── */}
          <Link href="/home" className="jd-back">
            <ArrowLeft size={13} />
            Back to Jobs
          </Link>

          {/* ── HERO ── */}
          <div className="jd-hero">
            <div className="jd-hero-accent" style={{
              background: exp
                ? "linear-gradient(90deg, #F87171, #EF4444)"
                : "linear-gradient(90deg, #0EA5E9 0%, #38BDF8 50%, #818CF8 100%)",
            }} />

            <div className="jd-hero-inner">
              {/* Role Icon */}
              <div className="jd-role-icon">
                {ROLE_ICON[job.role] ?? "💼"}
              </div>

              {/* Title + Meta */}
              <div>
                <h1 style={{
                  fontSize: "clamp(1.35rem, 2.5vw, 1.8rem)",
                  fontWeight: 800,
                  color: "#0B1120",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  margin: "0 0 8px",
                }}>
                  {job.title}
                </h1>

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                  <Building2 size={13} color="#94A3B8" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>{job.company.name}</span>
                  <span style={{ color: "#CBD5E1", fontSize: "0.75rem" }}>·</span>
                  <MapPin size={12} color="#94A3B8" />
                  <span style={{ fontSize: "0.875rem", color: "#64748B" }}>{job.location}</span>
                </div>

                {/* Badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <span className="jd-badge" style={{
                    background: exp ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                    color: exp ? "#DC2626" : "#059669",
                    borderColor: exp ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)",
                  }}>
                    <span className="jd-badge-dot" />
                    {exp ? "Closed" : "Active"}
                  </span>

                  <span className="jd-badge" style={{ background: typeInfo.bg, color: typeInfo.color, borderColor: typeInfo.border }}>
                    <Briefcase size={9} />
                    {job.type.replace("_", " ")}
                  </span>

                  <span className="jd-badge" style={{ background: levelInfo.bg, color: levelInfo.color, borderColor: levelInfo.border }}>
                    {levelInfo.label}
                  </span>

                  {job.slots && (
                    <span className="jd-badge" style={{ background: "#F8FAFC", color: "#64748B", borderColor: "#E2E8F0" }}>
                      <Users size={9} />
                      {job.slots} {job.slots === 1 ? "opening" : "openings"}
                    </span>
                  )}
                </div>
              </div>

              {/* Deadline box */}
              {job.deadline && (
                <div className="jd-deadline-box">
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 5px" }}>
                    Deadline
                  </p>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: exp ? "#EF4444" : "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>
                    {fmtDate(job.deadline)}
                  </p>
                  <div className="jd-deadline-bar">
                    <div className="jd-deadline-fill" style={{
                      width: exp ? "100%" : "65%",
                      background: exp
                        ? "linear-gradient(90deg, #F87171, #EF4444)"
                        : "linear-gradient(90deg, #0EA5E9, #38BDF8)",
                    }} />
                  </div>
                  {exp && (
                    <p style={{ fontSize: "0.65rem", color: "#EF4444", margin: "6px 0 0", fontWeight: 600 }}>Applications closed</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="jd-grid">

            {/* LEFT – Content */}
            <div className="jd-left">
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
            <div className="jd-right">

              {/* Job Details card */}
              <div className="jd-card">
                <div className="jd-card-header">
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                    Job Details
                  </span>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#38BDF8", letterSpacing: "0.06em", fontFamily: "monospace" }}>
                    #{job.id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="jd-card-body">
                  <InfoRow icon={<MapPin size={14} />} label="Location" value={job.location} />
                  {job.salary && (
                    <InfoRow icon={<DollarSign size={14} />} label="Salary" value={job.salary} />
                  )}
                  <InfoRow
                    icon={<Calendar size={14} />}
                    label="Deadline"
                    value={job.deadline ? fmtDate(job.deadline) : "No deadline"}
                  />
                  {job.slots && (
                    <InfoRow icon={<Users size={14} />} label="Openings" value={`${job.slots} position${job.slots > 1 ? "s" : ""}`} />
                  )}
                  <InfoRow icon={<Briefcase size={14} />} label="Employment Type" value={job.type.replace("_", " ")} last />
                </div>
              </div>

              {/* Company card */}
              <div className="jd-card" style={{ padding: 20 }}>
                <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 16, marginTop: 0 }}>
                  About the Company
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: "linear-gradient(135deg, #0EA5E9, #38BDF8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "0.85rem",
                    color: "white", flexShrink: 0,
                    boxShadow: "0 4px 14px rgba(14,165,233,0.28)",
                    letterSpacing: "-0.02em",
                  }}>
                    {job.company.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A", margin: "0 0 3px", letterSpacing: "-0.01em" }}>
                      {job.company.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={11} color="#94A3B8" />
                      <p style={{ fontSize: "0.75rem", color: "#94A3B8", margin: 0 }}>{job.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills card */}
              {tags.length > 0 && (
                <div className="jd-card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                    <Tag size={12} color="#0EA5E9" />
                    <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", margin: 0 }}>
                      Required Skills
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {tags.map((tag) => (
                      <span key={tag} className="jd-skill">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ── CTA BANNER ── */}
          <div className="jd-cta">
            <div className="jd-cta-grid" />
            <div className="jd-cta-glow" />

            <div style={{ position: "relative", zIndex: 1 }}>
              {!exp ? (
                <>
                  <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "white", margin: "0 0 5px", letterSpacing: "-0.02em" }}>
                    Interested in this role?
                  </p>
                  <p style={{ fontSize: "0.825rem", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>
                    Submit your application and complete the skill assessment to proceed.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: "rgba(255,255,255,0.45)", margin: "0 0 5px" }}>
                    Applications Closed
                  </p>
                  <p style={{ fontSize: "0.825rem", color: "rgba(255,255,255,0.25)", margin: 0 }}>
                    This posting has passed its deadline.
                  </p>
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", position: "relative", zIndex: 1, flexShrink: 0 }}>
              <Link href="/home" className="jd-btn-ghost">
                <ArrowLeft size={13} />
                Back
              </Link>

              {!exp && !examSubmitted && !terminated && (
                <Link
                  href={
                    hasApplication && application?.id
                      ? `/exam/${job.id}?appId=${application.id}`
                      : `/apply/${job.id}`
                  }
                  className="jd-btn-primary"
                >
                  Apply Now
                  <ChevronRight size={15} />
                </Link>
              )}

              {!exp && examSubmitted && (
                <button type="button" disabled className="jd-btn-disabled">
                  <CheckCircle2 size={14} />
                  Exam Submitted
                </button>
              )}

              {!exp && terminated && !examSubmitted && (
                <button type="button" disabled className="jd-btn-disabled">
                  <XCircle size={14} />
                  Terminated
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
