"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Calendar,
  Pencil,
  Trash2,
  Search,
  ChevronRight,
  LayoutDashboard,
  UserCircle,
  LogOut,
  Bell,
  Plus,
  Menu,
  X,
  BarChart3
} from "lucide-react";
import Swal from "sweetalert2";
import { api } from "~/trpc/react";

// Role → icon emoji mapping for visual variety
const ROLE_ICON: Record<string, string> = {
  SOFTWARE_ENGINEER: "💻",
  UX_ENGINEER: "🎨",
  PROJECT_MANAGER: "📋",
};

// Level accent colors (within the existing palette)
const LEVEL_STYLE: Record<string, string> = {
  JUNIOR: "bg-[#EFF6FF] text-[#1D4ED8]",
  MID:    "bg-[#F0FDF4] text-[#15803D]",
  SENIOR: "bg-[#FFF7ED] text-[#C2410C]",
};

const TYPE_STYLE: Record<string, string> = {
  FULL_TIME:   "bg-[#EFF6FF] text-[#1F7FB2]",
  INTERNSHIP:  "bg-[#F5F3FF] text-[#7C3AED]",
};

// Mock jobs for demo
const MOCK_JOBS = [
  {
    id: "demo-1",
    title: "Senior React Developer",
    location: "Colombo, Sri Lanka",
    role: "SOFTWARE_ENGINEER",
    type: "FULL_TIME",
    level: "SENIOR",
    salary: "LKR 280,000 - 320,000",
    tags: "React, TypeScript, Node.js",
    slots: 3,
    deadline: new Date("2026-05-15"),
    createdAt: new Date(),
    updatedAt: new Date(),
    companyId: "demo",
  },
  {
    id: "demo-2",
    title: "Frontend Engineer Intern",
    location: "Colombo, Sri Lanka",
    role: "SOFTWARE_ENGINEER",
    type: "INTERNSHIP",
    level: "JUNIOR",
    salary: "Stipend - LKR 15,000",
    tags: "React, JavaScript, Tailwind",
    slots: 5,
    deadline: new Date("2026-04-30"),
    createdAt: new Date(),
    updatedAt: new Date(),
    companyId: "demo",
  },
  {
    id: "demo-3",
    title: "Product Designer",
    location: "Colombo, Sri Lanka",
    role: "UX_ENGINEER",
    type: "FULL_TIME",
    level: "MID",
    salary: "LKR 150,000 - 180,000",
    tags: "Figma, Design Systems, UX",
    slots: 2,
    deadline: new Date("2026-05-20"),
    createdAt: new Date(),
    updatedAt: new Date(),
    companyId: "demo",
  },
  {
    id: "demo-4",
    title: "DevOps Engineer",
    location: "Colombo, Sri Lanka",
    role: "SOFTWARE_ENGINEER",
    type: "FULL_TIME",
    level: "MID",
    salary: "LKR 200,000 - 240,000",
    tags: "AWS, Docker, Kubernetes",
    slots: 3,
    deadline: new Date("2026-06-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
    companyId: "demo",
  },
  {
    id: "demo-5",
    title: "UX Researcher Intern",
    location: "Colombo, Sri Lanka",
    role: "UX_ENGINEER",
    type: "INTERNSHIP",
    level: "JUNIOR",
    salary: "Stipend - LKR 13,000",
    tags: "User Research, Testing",
    slots: 4,
    deadline: new Date("2026-04-20"),
    createdAt: new Date(),
    updatedAt: new Date(),
    companyId: "demo",
  },
  {
    id: "demo-6",
    title: "Project Manager",
    location: "Colombo, Sri Lanka",
    role: "PROJECT_MANAGER",
    type: "FULL_TIME",
    level: "MID",
    salary: "LKR 160,000 - 190,000",
    tags: "Agile, Scrum, Leadership",
    slots: 2,
    deadline: new Date("2026-05-25"),
    createdAt: new Date(),
    updatedAt: new Date(),
    companyId: "demo",
  },
];

function isExpired(deadline: Date | null) {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function daysLeft(deadline: Date | null): string | null {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (diff < 0) return null;
  if (diff === 0) return "Closes today";
  return `${diff}d left`;
}

function fmtDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default function MyJobsPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: company } = api.company.getProfile.useQuery(
    { companyId: companyId ?? "" },
    { enabled: !!companyId },
  );
  const companyName = company?.name || "Company";

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);

  const { data: jobs = [], isLoading, refetch } = api.job.listByCompany.useQuery(
    { companyId: companyId ?? "" },
    { enabled: !!companyId },
  );

  // Combine with mock jobs for demo
  const allJobs = [...(jobs || []), ...MOCK_JOBS];

  const deleteJob = api.job.delete.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const handleLogout = () => router.push('/company/comlogin');
  const handleCreateJob = () => router.push('/company/create-job');
  const handleDelete = async (jobId: string) => {
    if (!companyId) return;
    const result = await Swal.fire({
      title: "Delete this job post?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
    });
    if (!result.isConfirmed) return;
    deleteJob.mutate({ id: jobId, companyId });
  };

  const active     = allJobs.filter((j) => !isExpired(j.deadline)).length;
  const expired    = allJobs.filter((j) => isExpired(j.deadline)).length;
  const noDeadline = allJobs.filter((j) => !j.deadline).length;

  const filtered = allJobs.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType  === "ALL" || job.type  === filterType;
    const matchLevel  = filterLevel === "ALL" || job.level === filterLevel;
    return matchSearch && matchType && matchLevel;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-base font-medium">
        Loading your job posts…
      </div>
    );
  }

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
              { name: 'My Job Posts', icon: Briefcase, active: true, onClick: undefined },
              { name: 'Selected Candidates', icon: Users, onClick: () => { router.push('/company/selected-candidates'); setSidebarOpen(false); } },
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
            <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#3AB6D9] bg-[#3AB6D9]/10 w-fit mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3AB6D9]"></span>
            <span className="text-xs font-semibold text-[#0F172A]">Job Management • Post tracking enabled</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-0" style={{
            background: "linear-gradient(135deg, #0F172A, #0EA5E9)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Roles you published
          </h1>
          <p className="text-[#475569] text-sm sm:text-base max-w-2xl leading-relaxed font-medium">7 listings across your pipeline</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[ 
            { label: "Active", value: active },
            { label: "Expired", value: expired },
            { label: "No deadline", value: noDeadline },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-[#0F3D5E] text-white flex items-center justify-center rounded-lg">
                <Users size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search job title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3AB6D9]/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#3AB6D9]/30"
            >
              <option value="ALL">All types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#3AB6D9]/30"
            >
              <option value="ALL">All levels</option>
              <option value="JUNIOR">Junior</option>
              <option value="MID">Mid</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>
        </div>

        {/* Jobs */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed rounded-xl p-12 text-center text-slate-500 shadow-sm">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold">No job posts found.</p>
            <p className="text-base mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map((job) => {
              const exp  = isExpired(job.deadline);
              const left = daysLeft(job.deadline);

              return (
                <div
                  key={job.id}
                  onClick={() => router.push(`/company/my-jobs/${job.id}`)}
                  className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col gap-2"
                >
                  {/* Header: Title + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-[#0F172A] leading-tight">{job.title}</h2>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${exp ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                      {exp ? "Expired" : "Active"}
                    </span>
                  </div>

                  {/* Meta: Location, Type, Level */}
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border bg-slate-50 text-slate-600">
                      <MapPin size={12} className="text-slate-400" /> {job.location}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border ${TYPE_STYLE[job.type]}`}>
                      <Briefcase size={12} /> {job.type.replace("_", " ")}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border ${LEVEL_STYLE[job.level]}`}>
                      <Clock size={12} /> {job.level}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {job.tags.split(",").slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-[#F4F7FB] text-slate-600 text-xs px-2 py-0.5 rounded-full">
                        {tag.trim()}
                      </span>
                    ))}
                    {job.tags.split(",").length > 3 && (
                      <span className="text-xs text-slate-400 px-2 py-0.5">+{job.tags.split(",").length - 3}</span>
                    )}
                  </div>

                  {/* Footer: Deadline + Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Calendar size={12} />
                      <span>{exp ? `Closed` : left ?? `Closes`} {fmtDate(job.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/company/my-jobs/${job.id}?performance=1`); }}
                        title="Check performance"
                        className="inline-flex items-center justify-center p-1.5 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition"
                      >
                        <BarChart3 size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/company/my-jobs/${job.id}/edit`); }}
                        title="Edit job post"
                        className="inline-flex items-center justify-center p-1.5 text-[#1F7FB2] border border-[#1F7FB2]/30 rounded-lg hover:bg-[#EFF8FF] transition"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(job.id);
                        }}
                        title="Delete job post"
                        className="inline-flex items-center justify-center p-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/company/my-jobs/${job.id}`); }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#1F7FB2] rounded-lg hover:bg-[#1a6f9e] transition"
                      >
                        View <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
