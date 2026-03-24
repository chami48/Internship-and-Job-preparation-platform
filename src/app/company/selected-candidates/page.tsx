"use client";

import {
  Briefcase,
  Users,
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
  CalendarClock,
  LayoutDashboard,
  Calendar,
  UserCircle,
  LogOut,
  Bell,
  Plus,
  Menu,
  X
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

interface Candidate {
  id: string;
  name: string;
  role: string;
  jobId: string;
  jobTitle: string;
  stage: "Offer" | "Interview" | "Assessment";
  status: "Accepted" | "Shortlisted" | "Pending";
  score: number;
  appliedAt: string;
  location: string;
  email: string;
  phone: string;
  tags: string[];
  note: string;
}

// TODO: Replace `mockCandidates` with real backend data when ready.
// Example (uncomment and wire to your query):
// const { data: candidates = [], isLoading } = api.selectedCandidates.byCompany.useQuery({ companyId });
// Then remove `mockCandidates` and replace `candidateList` below with the real `candidates`.
const mockCandidates: Candidate[] = [
  {
    id: "c1",
    name: "Ava Thompson",
    role: "Data Scientist",
    jobId: "1",
    jobTitle: "AI Engineer Intern",
    stage: "Offer",
    status: "Accepted",
    score: 92,
    appliedAt: "2026-03-10",
    location: "Remote",
    email: "ava.thompson@example.com",
    phone: "+1 202 555 0108",
    tags: ["Python", "NLP", "FastAPI"],
    note: "Offer signed",
  },
  {
    id: "c2",
    name: "Liam Carter",
    role: "Frontend Engineer",
    jobId: "2",
    jobTitle: "ML Specialist",
    stage: "Interview",
    status: "Shortlisted",
    score: 88,
    appliedAt: "2026-03-12",
    location: "Colombo, LK",
    email: "liam.carter@example.com",
    phone: "+94 71 234 5678",
    tags: ["React", "TypeScript"],
    note: "Strong portfolio",
  },
];

const jobMeta: Record<string, { title: string; location: string }> = {
  "1": { title: "AI Engineer Intern", location: "Remote" },
  "2": { title: "ML Specialist", location: "Colombo HQ" },
};

export default function SelectedCandidatesPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = React.useState<string | null>(null);
  const { data: company } = api.company.getProfile.useQuery(
    { companyId: companyId ?? "" },
    { enabled: !!companyId },
  );
  const companyName = company?.name || "Company";
  const [search, setSearch] = React.useState("");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);

  const handleLogout = () => router.push('/company/comlogin');
  const handleCreateJob = () => router.push('/company/create-job');

  // Switch this to the real backend result when available.
  const candidateList = mockCandidates;

  const groupedByJob = Object.values(
    candidateList.reduce<Record<string, { jobId: string; jobTitle: string; location: string; count: number }>>(
      (acc, c) => {
        let entry = acc[c.jobId];
        if (!entry) {
          entry = acc[c.jobId] = {
            jobId: c.jobId,
            jobTitle: jobMeta[c.jobId]?.title ?? c.jobTitle,
            location: jobMeta[c.jobId]?.location ?? "",
            count: 0,
          };
        }
        entry.count++;
        return acc;
      },
      {}
    )
  ).filter((job) =>
    job.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-[#0F172A] selection:bg-[#3AB6D9]/30">

      {/* Navbar - Full Width at Top */}
      <header className="h-16 sm:h-20 bg-white sticky top-0 z-30 border-b border-slate-200 shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-12">

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 text-[#0F172A] hover:bg-[#F4F7FB] rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Dashboard Logo */}
        <div className="hidden md:flex items-center gap-3 mr-4">
          <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-white font-bold text-sm">
            HS
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#3AB6D9]"></div>
          </div>
          <span className="text-lg font-bold text-[#0F172A] tracking-tight">HireSmart</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#0F75A8]/30 bg-white text-[#0F75A8] shadow-sm transition-all hover:shadow-md hover:-translate-y-[1px]">
            <Bell size={18} className="sm:w-[22px] sm:h-[22px]" />
          </button>
          <div className="hidden md:flex items-center gap-2 text-right leading-tight border-l border-[#E2E8F0] pl-3 sm:pl-4">
            <span className="text-sm font-semibold text-[#475569]">Welcome</span>
            <span className="text-sm font-bold text-[#0F172A] truncate max-w-[140px]">{companyName}</span>
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-slate-200 rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer hover:ring-2 ring-[#1F7FB2] transition-all shadow-sm">
              <img src="/logos/company-logo-jpg.jpg" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 top-16 sm:top-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 sticky lg:sticky top-16 sm:top-20 left-0 w-64 sm:w-68 flex flex-col h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden z-50 lg:z-10 transition-transform duration-300 ease-in-out lg:shrink-0 border-r border-[#0B1527]`}
          style={{
            background: "linear-gradient(145deg, #0F172A 0%, #0C1A33 60%, #0D2340 100%)"
          }}
        >
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all z-20"
          >
            <X size={20} />
          </button>

          {/* Navigation */}
          <nav className="flex-1 px-4 sm:px-6 space-y-2 sm:space-y-3 mt-4 sm:mt-6 relative z-10">
            {[
              { name: 'Dashboard', icon: LayoutDashboard, onClick: () => { router.push('/company/dashboard'); setSidebarOpen(false); } },
              { name: 'My Job Posts', icon: Briefcase, onClick: () => { router.push('/company/my-jobs'); setSidebarOpen(false); } },
              { name: 'Selected Candidates', icon: Users, active: true, onClick: undefined },
              { name: 'Interviews', icon: Calendar, onClick: () => { router.push('/company/interviews'); setSidebarOpen(false); } },
              { name: 'Company Profile', icon: UserCircle, onClick: () => { router.push('/company/profile'); setSidebarOpen(false); } },
            ].map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  item.active
                    ? 'bg-[#E2E8F0] text-[#0F172A] shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon
                  size={20}
                  className={item.active ? 'text-[#0F172A]' : 'text-white/70'}
                />
                {item.name}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-t border-white/10 relative z-10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all group border border-red-500/20"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-12 space-y-6 sm:space-y-8 lg:space-y-12 bg-[#F8FAFF] text-[#0F172A] rounded-t-3xl shadow-inner">
            <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#3AB6D9] bg-[#3AB6D9]/10 w-fit mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3AB6D9]"></span>
            <span className="text-xs font-semibold text-[#0F172A]">Candidate Selection • Finalist tracking enabled</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-0" style={{
            background: "linear-gradient(135deg, #0F172A, #0EA5E9)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Finalists by job post
          </h1>
          <p className="text-[#475569] text-sm sm:text-base max-w-2xl leading-relaxed font-medium">Manage selected candidates and track their progress through the hiring pipeline.</p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search job"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {groupedByJob.map((job) => (
            <div
              key={job.jobId}
              onClick={() => router.push(`/company/selected/${job.jobId}`)}
              className="bg-white border rounded-xl p-6 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#0F3D5E] text-white flex items-center justify-center rounded-lg">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{job.jobTitle}</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin size={14} /> {job.location}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-slate-600">
                  👥 {job.count} finalists
                </p>
                <span className="text-sm font-semibold text-[#0F3D5E]">
                  View →
                </span>
              </div>
            </div>
          ))}

          {groupedByJob.length === 0 && (
            <div className="col-span-full text-center text-slate-500">
              No jobs found
            </div>
          )}
        </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}