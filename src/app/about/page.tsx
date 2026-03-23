"use client";
import Link from "next/link";

const stats = [
	{ value: "1,200+", label: "Active Candidates", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
	{ value: "120+", label: "Partner Companies", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
	{ value: "3,400+", label: "Assessments Done", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
	{ value: "4.8/5", label: "Satisfaction Score", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
];

const features = [
	{
		icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
		title: "Verified Skill Exams",
		description: "Timed, role-focused assessments with anti-cheat controls ensure every score reflects genuine ability.",
		color: "#0EA5E9",
		bg: "rgba(14,165,233,0.08)",
	},
	{
		icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
		title: "AI Interview Drills",
		description: "Guided mock sessions with contextual feedback help candidates rehearse for the real thing, faster.",
		color: "#8B5CF6",
		bg: "rgba(139,92,246,0.08)",
	},
	{
		icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
		title: "Career-Ready Profiles",
		description: "One view for projects, certificates, and exam scores — candidates carry their proof everywhere.",
		color: "#10B981",
		bg: "rgba(16,185,129,0.08)",
	},
	{
		icon: "M13 10V3L4 14h7v7l9-11h-7z",
		title: "Instant Hiring Signals",
		description: "Employers get clear readiness scores and ranked shortlists so decisions happen in hours, not weeks.",
		color: "#F59E0B",
		bg: "rgba(245,158,11,0.08)",
	},
];

const timeline = [
	{ year: "2023", title: "The Idea", body: "A group of SLIIT students noticed that talent was being overlooked in traditional hiring. They set out to fix it." },
	{ year: "2024", title: "First Build", body: "An MVP launched with basic assessments and AI interview prep. Early adopters gave feedback that shaped the roadmap." },
	{ year: "2025", title: "Platform Growth", body: "120+ companies joined, 3,400+ assessments completed, and AI proctoring became a core feature." },
	{ year: "2026", title: "Today & Beyond", body: "Expanding globally, integrating deeper AI personalization, and building the fairest hiring ecosystem on the internet." },
];

// ── Add the photo filename (e.g. "dilmi.jpg") once uploaded to public/uploads/team/
const team = [
	{ name: "Dilmi Chamya",         role: "Exam & Question Lead",  initials: "DC", color: "#0EA5E9", photo: "dilmi.png" },
	{ name: "Nilumi Dakshika",      role: "Job Portal Lead",        initials: "ND", color: "#8B5CF6", photo: "nilumi.jpeg"},
	{ name: "Krishanth Christopher",role: "Interview AI Lead",       initials: "KC", color: "#10B981", photo: "krishanth1.jpeg" },
	{ name: "Sandani Chamoda",      role: "Profiles & Auth Lead",    initials: "SC", color: "#F59E0B", photo: "sandani.jpeg" },
];

const values = [
	{ label: "Fair by Design", desc: "Skills-first screening removes bias from day one.", icon: "⚖️" },
	{ label: "Transparency", desc: "Every score, every decision — explained and traceable.", icon: "🔍" },
	{ label: "Candidate Growth", desc: "Feedback loops that teach, not just judge.", icon: "📈" },
	{ label: "Employer Clarity", desc: "Data that makes great hiring fast and confident.", icon: "🎯" },
];

export default function AboutPage() {
	return (
		<main className="ab-root">
			<style>{`
				.ab-root {
					background: #F8FAFC;
					color: #0F172A;
					overflow-x: hidden;
				}

				/* ── HERO ── */
				.ab-hero {
					position: relative;
					background:
						radial-gradient(ellipse 900px 500px at 60% -10%, rgba(14,165,233,0.13), transparent 65%),
						radial-gradient(ellipse 600px 400px at -10% 80%, rgba(139,92,246,0.08), transparent 60%),
						linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%);
					padding: 80px 24px 100px;
					overflow: hidden;
				}

				.ab-hero-dots {
					position: absolute;
					inset: 0;
					background-image: radial-gradient(rgba(14,165,233,0.18) 1px, transparent 1px);
					background-size: 30px 30px;
					mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%);
					pointer-events: none;
				}

				.ab-hero-badge {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					border-radius: 999px;
					padding: 5px 14px 5px 8px;
					background: white;
					border: 1px solid rgba(14,165,233,0.3);
					box-shadow: 0 2px 8px rgba(14,165,233,0.12);
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.14em;
					text-transform: uppercase;
					color: #0F172A;
					margin-bottom: 28px;
				}

				.ab-hero-badge-dot {
					width: 8px;
					height: 8px;
					border-radius: 999px;
					background: #0EA5E9;
					animation: pulse-dot 2s ease-in-out infinite;
				}

				@keyframes pulse-dot {
					0%, 100% { opacity: 1; transform: scale(1); }
					50% { opacity: 0.6; transform: scale(1.3); }
				}

				.ab-hero-inner {
					position: relative;
					z-index: 1;
					max-width: 880px;
					margin: 0 auto;
					text-align: center;
				}

				.ab-display {
					letter-spacing: -0.03em;
				}

				.ab-hero-h1 {
					letter-spacing: -0.03em;
					font-size: clamp(2.4rem, 6vw, 4.2rem);
					font-weight: 700;
					line-height: 1.1;
					color: #0F172A;
				}

				.ab-hero-h1 span {
					background: linear-gradient(135deg, #0EA5E9, #6366F1);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}

				.ab-hero-sub {
					margin: 20px auto 0;
					max-width: 600px;
					font-size: 1.1rem;
					line-height: 1.8;
					color: #475569;
				}

				.ab-hero-ctas {
					margin-top: 36px;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
					gap: 12px;
				}

				.ab-btn-primary {
					border-radius: 12px;
					background: #0F172A;
					color: white;
					padding: 13px 28px;
					font-size: 0.875rem;
					font-weight: 700;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					text-decoration: none;
					transition: background 0.2s, transform 0.15s;
				}

				.ab-btn-primary:hover {
					background: #1E293B;
					transform: translateY(-1px);
				}

				.ab-btn-outline {
					border-radius: 12px;
					border: 1.5px solid #CBD5E1;
					background: white;
					color: #334155;
					padding: 13px 28px;
					font-size: 0.875rem;
					font-weight: 700;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					text-decoration: none;
					transition: border-color 0.2s, transform 0.15s;
				}

				.ab-btn-outline:hover {
					border-color: #94A3B8;
					transform: translateY(-1px);
				}

				/* ── STATS ── */
				.ab-stats-strip {
					background: white;
					border-top: 1px solid #E2E8F0;
					border-bottom: 1px solid #E2E8F0;
					padding: 0;
				}

				.ab-stats-inner {
					max-width: 1100px;
					margin: 0 auto;
					display: grid;
					grid-template-columns: repeat(4, 1fr);
					padding: 0 24px;
				}

				@media (max-width: 700px) {
					.ab-stats-inner { grid-template-columns: repeat(2, 1fr); }
				}

				.ab-stat-cell {
					padding: 36px 24px;
					display: flex;
					align-items: center;
					gap: 16px;
					border-right: 1px solid #E2E8F0;
				}

				.ab-stat-cell:last-child { border-right: none; }

				@media (max-width: 700px) {
					.ab-stat-cell:nth-child(2) { border-right: none; }
					.ab-stat-cell:nth-child(3) { border-right: 1px solid #E2E8F0; }
				}

				.ab-stat-icon {
					flex-shrink: 0;
					width: 44px;
					height: 44px;
					border-radius: 12px;
					background: #F0F9FF;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.ab-stat-icon svg {
					width: 22px;
					height: 22px;
					color: #0EA5E9;
					stroke: currentColor;
					fill: none;
					stroke-width: 1.8;
					stroke-linecap: round;
					stroke-linejoin: round;
				}

				.ab-stat-val {
					font-size: 1.6rem;
					font-weight: 700;
					letter-spacing: -0.02em;
					color: #0F172A;
					line-height: 1;
				}

				.ab-stat-lbl {
					font-size: 0.75rem;
					font-weight: 600;
					color: #94A3B8;
					text-transform: uppercase;
					letter-spacing: 0.1em;
					margin-top: 4px;
				}

				/* ── SECTION WRAPPER ── */
				.ab-section {
					max-width: 1100px;
					margin: 0 auto;
					padding: 80px 24px;
				}

				.ab-section-tag {
					display: inline-block;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.2em;
					text-transform: uppercase;
					color: #0EA5E9;
					margin-bottom: 12px;
				}

				.ab-section-h2 {
					letter-spacing: -0.03em;
					font-size: clamp(1.8rem, 4vw, 2.8rem);
					font-weight: 700;
					color: #0F172A;
					line-height: 1.15;
				}

				.ab-section-body {
					margin-top: 14px;
					font-size: 1.05rem;
					line-height: 1.8;
					color: #475569;
					max-width: 580px;
				}

				/* ── FEATURES GRID ── */
				.ab-features-grid {
					margin-top: 52px;
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 20px;
				}

				@media (max-width: 700px) {
					.ab-features-grid { grid-template-columns: 1fr; }
				}

				.ab-feat-card {
					background: white;
					border: 1px solid #E2E8F0;
					border-radius: 20px;
					padding: 28px;
					transition: box-shadow 0.2s, transform 0.2s;
				}

				.ab-feat-card:hover {
					box-shadow: 0 12px 40px rgba(15,23,42,0.09);
					transform: translateY(-3px);
				}

				.ab-feat-icon {
					width: 48px;
					height: 48px;
					border-radius: 14px;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 18px;
				}

				.ab-feat-icon svg {
					width: 24px;
					height: 24px;
					fill: none;
					stroke-width: 1.8;
					stroke-linecap: round;
					stroke-linejoin: round;
				}

				.ab-feat-title {
					font-size: 1.05rem;
					font-weight: 600;
					color: #0F172A;
					margin-bottom: 8px;
				}

				.ab-feat-desc {
					font-size: 0.9rem;
					line-height: 1.7;
					color: #64748B;
				}

				/* ── MISSION SPLIT ── */
				.ab-mission-bg {
					background: linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%);
					border-top: 1px solid #E2E8F0;
					border-bottom: 1px solid #E2E8F0;
				}

				.ab-mission-split {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 64px;
					align-items: center;
				}

				@media (max-width: 780px) {
					.ab-mission-split { grid-template-columns: 1fr; gap: 40px; }
				}

				.ab-values-list {
					display: grid;
					gap: 14px;
					margin-top: 36px;
				}

				.ab-value-row {
					display: flex;
					align-items: flex-start;
					gap: 16px;
					padding: 16px 20px;
					background: white;
					border: 1px solid #E2E8F0;
					border-radius: 14px;
					transition: box-shadow 0.15s;
				}

				.ab-value-row:hover {
					box-shadow: 0 4px 16px rgba(14,165,233,0.09);
				}

				.ab-value-emoji {
					font-size: 1.3rem;
					line-height: 1;
					flex-shrink: 0;
					margin-top: 2px;
				}

				.ab-value-label {
					font-size: 0.9rem;
					font-weight: 700;
					color: #0F172A;
				}

				.ab-value-desc {
					font-size: 0.85rem;
					color: #64748B;
					margin-top: 3px;
				}

				/* ── VISUAL PANEL (right side of mission) ── */
				.ab-visual-panel {
					position: relative;
					background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
					border-radius: 24px;
					padding: 40px;
					color: white;
					overflow: hidden;
					min-height: 380px;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
				}

				.ab-visual-panel::before {
					content: "";
					position: absolute;
					inset: 0;
					background:
						radial-gradient(circle at 15% 20%, rgba(14,165,233,0.25), transparent 50%),
						radial-gradient(circle at 85% 80%, rgba(99,102,241,0.2), transparent 50%);
					pointer-events: none;
				}

				.ab-visual-panel-grid {
					position: absolute;
					inset: 0;
					background-image:
						linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
						linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
					background-size: 40px 40px;
					pointer-events: none;
				}

				.ab-vp-chip {
					position: absolute;
					top: 28px;
					right: 28px;
					background: rgba(14,165,233,0.18);
					border: 1px solid rgba(14,165,233,0.35);
					border-radius: 999px;
					padding: 5px 12px;
					font-size: 0.7rem;
					font-weight: 700;
					letter-spacing: 0.14em;
					text-transform: uppercase;
					color: #7DD3FC;
				}

				.ab-vp-big {
					font-size: 3.5rem;
					font-weight: 700;
					letter-spacing: -0.04em;
					line-height: 1;
					color: white;
					position: relative;
					z-index: 1;
				}

				.ab-vp-big span {
					color: #38BDF8;
				}

				.ab-vp-label {
					font-size: 0.85rem;
					color: rgba(255,255,255,0.6);
					margin-top: 8px;
					position: relative;
					z-index: 1;
					line-height: 1.6;
				}

				/* ── TIMELINE ── */
				.ab-timeline {
					position: relative;
					padding-left: 36px;
					margin-top: 52px;
				}

				.ab-timeline::before {
					content: "";
					position: absolute;
					left: 9px;
					top: 8px;
					bottom: 8px;
					width: 2px;
					background: linear-gradient(180deg, #0EA5E9, #C7D2FE);
				}

				.ab-tl-item {
					position: relative;
					margin-bottom: 36px;
				}

				.ab-tl-item:last-child { margin-bottom: 0; }

				.ab-tl-dot {
					position: absolute;
					left: -32px;
					top: 6px;
					width: 20px;
					height: 20px;
					border-radius: 999px;
					background: white;
					border: 2px solid #0EA5E9;
					box-shadow: 0 0 0 4px rgba(14,165,233,0.12);
				}

				.ab-tl-year {
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.16em;
					text-transform: uppercase;
					color: #0EA5E9;
					margin-bottom: 4px;
				}

				.ab-tl-title {
					font-size: 1rem;
					font-weight: 600;
					color: #0F172A;
					margin-bottom: 6px;
				}

				.ab-tl-body {
					font-size: 0.88rem;
					line-height: 1.7;
					color: #64748B;
				}

				/* ── TEAM ── */
				.ab-team-grid {
					margin-top: 52px;
					display: grid;
					grid-template-columns: repeat(4, 1fr);
					gap: 24px;
				}

				@media (max-width: 780px) {
					.ab-team-grid { grid-template-columns: repeat(2, 1fr); }
				}

				@media (max-width: 420px) {
					.ab-team-grid { grid-template-columns: 1fr; }
				}

				.ab-team-card {
					background: white;
					border: 1px solid #E2E8F0;
					border-radius: 20px;
					overflow: hidden;
					text-align: center;
					transition: box-shadow 0.25s, transform 0.25s;
					display: flex;
					flex-direction: column;
				}

				.ab-team-card:hover {
					box-shadow: 0 20px 56px rgba(15,23,42,0.13);
					transform: translateY(-6px);
				}

				/* Photo area — fills the top of the card */
				.ab-team-photo-wrap {
					width: 100%;
					aspect-ratio: 3 / 4;
					overflow: hidden;
					background: #F1F5F9;
					position: relative;
					flex-shrink: 0;
				}

				.ab-team-photo-wrap img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					object-position: center top;
					display: block;
					transition: transform 0.35s ease;
				}

				.ab-team-card:hover .ab-team-photo-wrap img {
					transform: scale(1.04);
				}

				/* Placeholder when no photo is set */
				.ab-team-placeholder {
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 10px;
				}

				.ab-team-placeholder-initials {
					font-size: 2.2rem;
					font-weight: 700;
					color: white;
					line-height: 1;
				}

				.ab-team-placeholder-hint {
					font-size: 0.7rem;
					font-weight: 600;
					letter-spacing: 0.12em;
					text-transform: uppercase;
					color: rgba(255,255,255,0.65);
				}

				/* Info area below the photo */
				.ab-team-info {
					padding: 18px 16px 20px;
					border-top: 1px solid #F1F5F9;
				}

				.ab-team-name {
					font-size: 0.95rem;
					font-weight: 600;
					color: #0F172A;
					line-height: 1.3;
				}

				.ab-team-role {
					font-size: 0.78rem;
					color: #94A3B8;
					margin-top: 5px;
					font-weight: 500;
				}

				/* ── CTA ── */
				.ab-cta-bg {
					background:
						radial-gradient(ellipse 800px 500px at 10% 50%, rgba(14,165,233,0.1), transparent 60%),
						radial-gradient(ellipse 600px 400px at 90% 50%, rgba(99,102,241,0.08), transparent 60%),
						linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%);
					border-top: 1px solid #E2E8F0;
					position: relative;
					overflow: hidden;
				}

				.ab-cta-bg::before {
					content: "";
					position: absolute;
					inset: 0;
					background-image: radial-gradient(rgba(14,165,233,0.12) 1px, transparent 1px);
					background-size: 28px 28px;
					mask-image: radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 80%);
					pointer-events: none;
				}

				.ab-cta-inner {
					position: relative;
					z-index: 1;
					max-width: 1100px;
					margin: 0 auto;
					padding: 80px 24px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 40px;
					flex-wrap: wrap;
				}

				.ab-cta-h2 {
					letter-spacing: -0.03em;
					font-size: clamp(1.8rem, 4vw, 2.6rem);
					font-weight: 700;
					color: #0F172A;
					line-height: 1.15;
				}

				.ab-cta-sub {
					margin-top: 12px;
					font-size: 1rem;
					line-height: 1.75;
					color: #475569;
					max-width: 440px;
				}

				.ab-cta-actions {
					display: flex;
					align-items: center;
					gap: 12px;
					flex-shrink: 0;
					flex-wrap: wrap;
				}

				.ab-btn-white {
					border-radius: 12px;
					background: #0F172A;
					color: white;
					padding: 13px 28px;
					font-size: 0.875rem;
					font-weight: 700;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					text-decoration: none;
					transition: background 0.2s, transform 0.15s;
				}

				.ab-btn-white:hover {
					background: #1E293B;
					transform: translateY(-1px);
				}

				.ab-btn-ghost {
					border-radius: 12px;
					border: 1.5px solid #CBD5E1;
					background: white;
					color: #334155;
					padding: 13px 28px;
					font-size: 0.875rem;
					font-weight: 700;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					text-decoration: none;
					transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
				}

				.ab-btn-ghost:hover {
					border-color: #94A3B8;
					box-shadow: 0 4px 12px rgba(15,23,42,0.08);
					transform: translateY(-1px);
				}

				/* ── DIVIDER ── */
				.ab-hr {
					border: none;
					height: 1px;
					background: linear-gradient(90deg, transparent, #E2E8F0, transparent);
					margin: 0;
				}

				/* ── FADE-IN ── */
				.ab-fade {
					animation: ab-fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
				}

				@keyframes ab-fadeUp {
					from { opacity: 0; transform: translateY(18px); }
					to   { opacity: 1; transform: translateY(0); }
				}
			`}</style>

			{/* ── HERO ── */}
			<section className="ab-hero">
				<div className="ab-hero-dots" />
				<div className="ab-hero-inner ab-fade" style={{ animationDelay: "40ms" }}>
					<div className="ab-hero-badge">
						<span className="ab-hero-badge-dot" />
						About HireSmart
					</div>
					<h1 className="ab-hero-h1">
						Where talent meets<br />
						<span>opportunity, fairly.</span>
					</h1>
					<p className="ab-hero-sub">
						HireSmart is an intelligent screening platform that connects ambitious
						candidates with forward-thinking companies — through verified skills,
						not guesswork.
					</p>
					<div className="ab-hero-ctas">
						<Link href="/student/register" className="ab-btn-primary">
							Get Started Free
						</Link>
						<Link href="/company/register" className="ab-btn-outline">
							For Companies
						</Link>
					</div>
				</div>
			</section>

			{/* ── STATS ── */}
			<div className="ab-stats-strip ab-fade" style={{ animationDelay: "100ms" }}>
				<div className="ab-stats-inner">
					{stats.map((s) => (
						<div key={s.label} className="ab-stat-cell">
							<div className="ab-stat-icon">
								<svg viewBox="0 0 24 24" aria-hidden="true">
									<path d={s.icon} />
								</svg>
							</div>
							<div>
								<div className="ab-stat-val">{s.value}</div>
								<div className="ab-stat-lbl">{s.label}</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* ── FEATURES ── */}
			<div className="ab-section">
				<span className="ab-section-tag">What We Offer</span>
				<h2 className="ab-section-h2">Everything built for<br />skills-first hiring</h2>
				<p className="ab-section-body">
					Each module was designed from scratch for modern recruitment — not
					adapted from legacy tools.
				</p>
				<div className="ab-features-grid">
					{features.map((f) => (
						<div key={f.title} className="ab-feat-card">
							<div className="ab-feat-icon" style={{ background: f.bg }}>
								<svg viewBox="0 0 24 24" style={{ stroke: f.color }} aria-hidden="true">
									<path d={f.icon} />
								</svg>
							</div>
							<div className="ab-feat-title">{f.title}</div>
							<p className="ab-feat-desc">{f.description}</p>
						</div>
					))}
				</div>
			</div>

			<hr className="ab-hr" />

			{/* ── MISSION ── */}
			<div className="ab-mission-bg">
				<div className="ab-section">
					<div className="ab-mission-split">
						<div>
							<span className="ab-section-tag">Our Mission</span>
							<h2 className="ab-section-h2">Remove guesswork<br />from early careers</h2>
							<p className="ab-section-body">
								We believe every candidate deserves a fair shot. HireSmart strips away
								résumé noise and puts skills at the centre of every hiring decision.
							</p>
							<div className="ab-values-list">
								{values.map((v) => (
									<div key={v.label} className="ab-value-row">
										<span className="ab-value-emoji" aria-hidden="true">{v.icon}</span>
										<div>
											<div className="ab-value-label">{v.label}</div>
											<div className="ab-value-desc">{v.desc}</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="ab-visual-panel">
							<div className="ab-visual-panel-grid" />
							<span className="ab-vp-chip">Live Platform</span>
							<div style={{ position: "relative", zIndex: 1 }}>
								<div className="ab-vp-big">
									Skills<br /><span>first.</span>
								</div>
								<p className="ab-vp-label">
									Every score is earned, every shortlist is defensible,
									and every candidate leaves with feedback they can act on.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<hr className="ab-hr" />

			{/* ── STORY / TIMELINE ── */}
			<div className="ab-section">
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }} className="ab-timeline-split">
					<style>{`
						@media (max-width: 780px) {
							.ab-timeline-split { grid-template-columns: 1fr !important; gap: 40px !important; }
						}
					`}</style>
					<div>
						<span className="ab-section-tag">Our Story</span>
						<h2 className="ab-section-h2">Built from a real<br />problem we lived</h2>
						<p className="ab-section-body">
							We were students too. We applied to hundreds of internships and watched
							talented peers lose out to polished CVs. So we built the platform we
							wished existed.
						</p>
					</div>
					<div className="ab-timeline">
						{timeline.map((t) => (
							<div key={t.year} className="ab-tl-item">
								<div className="ab-tl-dot" />
								<div className="ab-tl-year">{t.year}</div>
								<div className="ab-tl-title">{t.title}</div>
								<p className="ab-tl-body">{t.body}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<hr className="ab-hr" />

			{/* ── TEAM ── */}
			<div style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
				<div className="ab-section">
					<span className="ab-section-tag">The Team</span>
					<h2 className="ab-section-h2">Made by students,<br />for students</h2>
					<p className="ab-section-body">
						A passionate team from SLIIT who turned a shared frustration into a
						platform thousands now rely on.
					</p>
					<div className="ab-team-grid">
						{team.map((m) => (
							<div key={m.name} className="ab-team-card">
								{/* ── Photo / Placeholder ── */}
								<div className="ab-team-photo-wrap">
									{m.photo ? (
										/* eslint-disable-next-line @next/next/no-img-element */
										<img src={`/uploads/team/${m.photo}`} alt={m.name} />
									) : (
										<div
											className="ab-team-placeholder"
											style={{ background: `linear-gradient(160deg, ${m.color}, ${m.color}88)` }}
										>
											<span className="ab-team-placeholder-initials">{m.initials}</span>
											<span className="ab-team-placeholder-hint">Photo coming</span>
										</div>
									)}
								</div>
								{/* ── Info ── */}
								<div className="ab-team-info">
									<div className="ab-team-name">{m.name}</div>
									<div className="ab-team-role">{m.role}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* ── CTA ── */}
			<div className="ab-cta-bg">
				<div className="ab-cta-inner">
					<div>
						<h2 className="ab-cta-h2">Ready to hire smarter?<br />Or prove your skills?</h2>
						<p className="ab-cta-sub">
							Join thousands of candidates and hiring teams already using HireSmart
							to prepare faster and hire with confidence.
						</p>
					</div>
					<div className="ab-cta-actions">
						<Link href="/student/register" className="ab-btn-white">
							Join as Student
						</Link>
						<Link href="/company/register" className="ab-btn-ghost">
							Partner with Us
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
