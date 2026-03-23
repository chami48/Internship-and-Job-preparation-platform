"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  Video,
  Clock3,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Mail,
  Phone,
  LayoutDashboard,
  Briefcase,
  Calendar,
  UserCircle,
  LogOut,
  Bell,
  Plus,
  Menu,
  X
} from "lucide-react";

interface Interview {
  id: string;
  candidate: string;
  jobTitle: string;
  stage: "Screen" | "Technical" | "Final";
  type: "Onsite" | "Remote";
  scheduledAt: string; // ISO date
  timezone: string;
  location: string;
  interviewer: string;
  status: "Scheduled" | "Confirmed" | "Reschedule";
  contact: { email: string; phone: string };
}

const interviews: Interview[] = [
  {
    id: "i1",
    candidate: "Ava Thompson",
    jobTitle: "AI Engineer Intern",
    stage: "Final",
    type: "Remote",
    scheduledAt: "2026-03-24T09:30:00Z",
    timezone: "GMT+5:30",
    location: "Google Meet",
    interviewer: "Priya (Lead ML)",
    status: "Confirmed",
    contact: { email: "ava@example.com", phone: "+1 202 555 0108" },
  },
  {
    id: "i2",
    candidate: "Liam Carter",
    jobTitle: "Frontend Engineer",
    stage: "Technical",
    type: "Onsite",
    scheduledAt: "2026-03-26T07:00:00Z",
    timezone: "GMT+5:30",
    location: "Colombo HQ - Room 3B",
    interviewer: "Amal (FE Lead)",
    status: "Scheduled",
    contact: { email: "liam@example.com", phone: "+94 71 234 5678" },
  },
  {
    id: "i3",
    candidate: "Sophia Nguyen",
    jobTitle: "Product Analyst",
    stage: "Screen",
    type: "Remote",
    scheduledAt: "2026-03-22T15:00:00Z",
    timezone: "GMT+5:30",
    location: "Zoom",
    interviewer: "Carla (PM)",
    status: "Reschedule",
    contact: { email: "sophia@example.com", phone: "+1 415 555 0136" },
  },
  {
    id: "i4",
    candidate: "Noah Silva",
    jobTitle: "AI Engineer Intern",
    stage: "Screen",
    type: "Remote",
    scheduledAt: "2026-03-23T08:00:00Z",
    timezone: "GMT+5:30",
    location: "Zoom",
    interviewer: "Ruwan (AI Hiring)",
    status: "Scheduled",
    contact: { email: "noah.silva@example.com", phone: "+94 77 456 7890" },
  },
  {
    id: "i5",
    candidate: "Emma Rodriguez",
    jobTitle: "AI Engineer Intern",
    stage: "Technical",
    type: "Onsite",
    scheduledAt: "2026-03-25T11:30:00Z",
    timezone: "GMT+5:30",
    location: "Colombo HQ - Lab 1",
    interviewer: "Shehan (ML Engineer)",
    status: "Confirmed",
    contact: { email: "emma.rod@example.com", phone: "+1 917 555 2211" },
  },
  {
    id: "i6",
    candidate: "Daniel Kim",
    jobTitle: "AI Engineer Intern",
    stage: "Technical",
    type: "Remote",
    scheduledAt: "2026-03-28T14:00:00Z",
    timezone: "GMT+5:30",
    location: "Google Meet",
    interviewer: "Anjali (Data Science)",
    status: "Scheduled",
    contact: { email: "daniel.k@example.com", phone: "+1 312 555 1180" },
  },
  {
    id: "i7",
    candidate: "Mia Patel",
    jobTitle: "AI Engineer Intern",
    stage: "Final",
    type: "Onsite",
    scheduledAt: "2026-04-02T09:00:00Z",
    timezone: "GMT+5:30",
    location: "Colombo HQ - Boardroom",
    interviewer: "Priya (Lead ML)",
    status: "Confirmed",
    contact: { email: "mia.patel@example.com", phone: "+94 76 123 4567" },
  },
  {
    id: "i8",
    candidate: "Ethan Wright",
    jobTitle: "AI Engineer Intern",
    stage: "Screen",
    type: "Remote",
    scheduledAt: "2026-03-30T07:30:00Z",
    timezone: "GMT+5:30",
    location: "Teams",
    interviewer: "Ruwan (AI Hiring)",
    status: "Scheduled",
    contact: { email: "ethan.w@example.com", phone: "+1 503 555 0198" },
  },
];

const stagePill: Record<Interview["stage"], string> = {
  Screen: "bg-slate-100 text-slate-700 border-slate-200",
  Technical: "bg-blue-50 text-blue-700 border-blue-200",
  Final: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const statusBadge: Record<Interview["status"], string> = {
  Scheduled: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Reschedule: "bg-red-50 text-red-700 border-red-200",
};

const HOLIDAYS: Record<string, string> = {
  "2026-01-01": "New Year's Day",
  "2026-04-14": "New Year Festival",
  "2026-05-01": "Labour Day",
};

export default function InterviewsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const companyName = session?.user?.name || "IFS";
  const [search, setSearch] = React.useState("");
  const [stage, setStage] = React.useState<"ALL" | Interview["stage"]>("ALL");
  const [status, setStatus] = React.useState<"ALL" | Interview["status"]>("ALL");
  const [monthCursor, setMonthCursor] = React.useState(new Date());
  const [jobFilter, setJobFilter] = React.useState<string>("ALL");
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [expandedJobs, setExpandedJobs] = React.useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => router.push('/company/comlogin');
  const handleCreateJob = () => router.push('/company/create-job');

  const filtered = interviews.filter((i) => {
    const matchSearch = `${i.candidate} ${i.jobTitle}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStage = stage === "ALL" || i.stage === stage;
    const matchStatus = status === "ALL" || i.status === status;
    const matchJob = jobFilter === "ALL" || i.jobTitle === jobFilter;
    const matchDate =
      !selectedDate ||
      new Date(i.scheduledAt).toDateString() === selectedDate.toDateString();
    return matchSearch && matchStage && matchStatus && matchJob && matchDate;
  });

  const sortedByTime = [...filtered].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  const groupedByJob = sortedByTime.reduce<Record<string, Interview[]>>((acc, interview) => {
    const bucket = acc[interview.jobTitle] ?? (acc[interview.jobTitle] = []);
    bucket.push(interview);
    return acc;
  }, {});
  const groupedEntries = Object.entries(groupedByJob);

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const upcoming = sortedByTime.slice(0, 3);
  const todayInterviews = sortedByTime.filter((i) => isSameDay(new Date(i.scheduledAt), today));
  const isWeekend = (day: Date) => day.getDay() === 0 || day.getDay() === 6;

  const formatDay = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  };

  const calendarMatrix = React.useMemo(() => {
    const first = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());

    const weeks: Date[][] = [];
    const ptr = new Date(start);
    for (let w = 0; w < 6; w++) {
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(new Date(ptr));
        ptr.setDate(ptr.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }, [monthCursor]);

  const monthLabel = monthCursor.toLocaleString(undefined, { month: "long", year: "numeric" });

  const hasInterviewOn = React.useCallback(
    (date: Date) => {
      const key = date.toDateString();
      return sortedByTime.some((i) => new Date(i.scheduledAt).toDateString() === key);
    },
    [sortedByTime]
  );

  const jobOptions = React.useMemo(
    () => Array.from(new Set(interviews.map((i) => i.jobTitle))),
    []
  );

  return (
    <div className="min-h-screen bg-[#F4F8FB] font-sans text-[#0F172A] selection:bg-[#3AB6D9]/30">

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
              { name: 'Selected Candidates', icon: Users, onClick: () => { router.push('/company/selected-candidates'); setSidebarOpen(false); } },
              { name: 'Interviews', icon: Calendar, active: true, onClick: undefined },
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
      <div className="max-w-7xl mx-auto space-y-4">
        <header className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#3AB6D9] bg-[#3AB6D9]/10 w-fit mb-4">
                <span className="w-2 h-2 rounded-full bg-[#3AB6D9]"></span>
                <span className="text-xs font-semibold text-[#0F172A]">Interview Management • Scheduling enabled</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-0" style={{
                background: "linear-gradient(135deg, #0F172A, #0EA5E9)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Interviews
              </h1>
              <p className="text-[#475569] text-sm sm:text-base max-w-2xl leading-relaxed font-medium">Track interviews by day, job, and status.</p>
            </div>
            <CalendarClock className="text-[#1F7FB2]" />
          </div>
        </header>

        {/* Top grid: today/upcoming left, calendar right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: today + upcoming */}
          <div className="space-y-5">
            <div className="bg-[#F8FBFF] border border-[#E2E8F0] rounded-2xl shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
                <div className="text-sm font-semibold text-[#0F172A]">Today</div>
                <CalendarDays size={16} className="text-slate-400" />
              </div>
              <div className="px-5 py-4 space-y-4">
                {todayInterviews.map((i) => (
                  <div key={i.id} className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white/70 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0F3D5E] text-white flex flex-col items-center justify-center font-bold leading-none">
                        <span className="text-sm">{formatDay(i.scheduledAt).split(" ")[0]}</span>
                        <span className="text-[10px] tracking-wider opacity-80">{formatDay(i.scheduledAt).split(" ")[1]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{i.candidate}</p>
                        <p className="text-xs text-slate-500">{i.jobTitle} • {new Date(i.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold px-4 py-1.5 rounded-lg border border-[#BFD2E5] text-[#0F3D5E] bg-white hover:bg-[#EFF6FF] transition">
                      Join
                    </button>
                  </div>
                ))}
                {todayInterviews.length === 0 && (
                  <p className="text-xs text-slate-500 text-center">No interviews today.</p>
                )}
              </div>
            </div>

            <div className="bg-[#F8FBFF] border border-[#E2E8F0] rounded-2xl shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
                <div className="text-sm font-semibold text-[#0F172A]">Upcoming</div>
                <Clock3 size={16} className="text-slate-400" />
              </div>
              <div className="px-5 py-4 space-y-4">
                {upcoming.map((i) => (
                  <div key={i.id} className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white/70 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0F3D5E] text-white flex flex-col items-center justify-center font-bold leading-none">
                        <span className="text-sm">{formatDay(i.scheduledAt).split(" ")[0]}</span>
                        <span className="text-[10px] tracking-wider opacity-80">{formatDay(i.scheduledAt).split(" ")[1]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{i.candidate}</p>
                        <p className="text-xs text-slate-500">{i.jobTitle} • {new Date(i.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold px-4 py-1.5 rounded-lg border border-[#BFD2E5] text-[#0F3D5E] bg-white hover:bg-[#EFF6FF] transition">
                      Join
                    </button>
                  </div>
                ))}
                {upcoming.length === 0 && (
                  <p className="text-xs text-slate-500 text-center">No upcoming interviews.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: inline month calendar */}
          <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3 bg-[radial-gradient(circle_at_20%_20%,#E0F2FF,transparent_35%),radial-gradient(circle_at_80%_0,#FEF3C7,transparent_30%),radial-gradient(circle_at_50%_80%,#E0F7F4,transparent_25%)]">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
                className="p-1 rounded-lg border hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="text-sm font-semibold text-slate-700">{monthLabel}</div>
              <button
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
                className="p-1 rounded-lg border hover:bg-slate-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center py-1 first:text-rose-500 last:text-rose-500">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm">
              {calendarMatrix.flat().map((day) => {
                const inMonth = day.getMonth() === monthCursor.getMonth();
                const isToday = isSameDay(day, today);
                const hasInterview = hasInterviewOn(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const holidayLabel = HOLIDAYS[day.toISOString().slice(0, 10)];
                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(isSelected ? null : day)}
                    className={`h-10 rounded-lg border flex items-center justify-center relative transition text-xs font-semibold ${
                      isSelected
                        ? "bg-[#0F75A8] text-white border-[#0F75A8] shadow"
                        : holidayLabel
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : inMonth
                            ? "bg-white text-slate-700"
                            : "bg-slate-50 text-slate-400"
                    } ${isToday && !isSelected ? "ring-1 ring-[#0F75A8] border-[#0F75A8]/60" : ""} ${isWeekend(day) && !isSelected && !holidayLabel ? "text-rose-500" : ""}`}
                  >
                    <span>{day.getDate()}</span>
                    {hasInterview && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F7FB2] absolute bottom-1"></span>
                    )}
                    {holidayLabel && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1"></span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{selectedDate ? `Filtering: ${selectedDate.toDateString()}` : "No date filter"}</span>
              {selectedDate && (
                <button onClick={() => setSelectedDate(null)} className="text-[#1F7FB2] font-semibold">Clear</button>
              )}
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search candidate or job"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3AB6D9]/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#3AB6D9]/30"
            >
              <option value="ALL">All jobs</option>
              {jobOptions.map((job) => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as Interview["stage"] | "ALL")}
              className="border rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#3AB6D9]/30"
            >
              <option value="ALL">All stages</option>
              <option value="Screen">Screen</option>
              <option value="Technical">Technical</option>
              <option value="Final">Final</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Interview["status"] | "ALL")}
              className="border rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#3AB6D9]/30"
            >
              <option value="ALL">All statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Reschedule">Needs reschedule</option>
            </select>
          </div>
        </div>

        {/* Job-wise cards (collapsible, important by default) */}
        <div className="space-y-4">
          {groupedEntries.map(([jobTitle, jobInterviews]) => {
            const firstInterview = jobInterviews[0];
            if (!firstInterview) return null;

            const categorized = jobInterviews.reduce(
              (acc, interview) => {
                const date = new Date(interview.scheduledAt);
                if (isSameDay(date, today)) acc.today.push(interview);
                else if (isSameDay(date, tomorrow)) acc.tomorrow.push(interview);
                else acc.later.push(interview);
                return acc;
              },
              { today: [] as Interview[], tomorrow: [] as Interview[], later: [] as Interview[] }
            );

            const isExpanded = expandedJobs[jobTitle] ?? false;

            return (
              <div key={jobTitle} className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
                <button
                  className="w-full flex items-center justify-between gap-3 text-left"
                  onClick={() =>
                    setExpandedJobs((prev) => ({ ...prev, [jobTitle]: !isExpanded }))
                  }
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Job</p>
                    <h3 className="text-lg font-bold text-[#0F172A]">{jobTitle}</h3>
                    <p className="text-sm text-slate-500">{jobInterviews.length} interview{jobInterviews.length > 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                    <span>Today ({categorized.today.length})</span>
                    <span>Tomorrow ({categorized.tomorrow.length})</span>
                    <span>Later ({categorized.later.length})</span>
                    <span className="text-[#0F3D5E]">View all ({jobInterviews.length})</span>
                    <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="space-y-4 pt-1 border-t">
                    {([
                      ["Today", categorized.today],
                      ["Tomorrow", categorized.tomorrow],
                      ["Later", categorized.later],
                    ] as const).map(([label, list]) => (
                      <div key={label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-700">{label} ({list.length})</p>
                          {list.length > 0 && (
                            <button
                              onClick={() => router.push(`/company/my-jobs/${firstInterview.id}`)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0F3D5E] border border-[#0F3D5E]/30 rounded-lg hover:bg-[#EFF6FF] transition"
                            >
                              View job <ArrowRight size={12} />
                            </button>
                          )}
                        </div>

                        {list.length === 0 && (
                          <p className="text-xs text-slate-500">Nothing scheduled.</p>
                        )}

                        <div className="grid sm:grid-cols-2 gap-3">
                          {list.map((i) => (
                            <div key={i.id} className="border rounded-lg p-4 bg-slate-50/60 flex flex-col gap-3">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[#0F3D5E] text-white font-bold flex items-center justify-center">
                                  {i.candidate.slice(0, 1)}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-base font-bold text-[#0F172A]">{i.candidate}</h2>
                                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full border ${stagePill[i.stage]}`}>
                                      {i.stage}
                                    </span>
                                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full border ${statusBadge[i.status]}`}>
                                      {i.status === "Reschedule" ? "Needs reschedule" : i.status}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                                    <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {new Date(i.scheduledAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} ({i.timezone})</span>
                                    <span className="inline-flex items-center gap-1"><Video size={14} /> {i.type}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                                    <span className="inline-flex items-center gap-1"><MapPin size={14} /> {i.location}</span>
                                    <span className="inline-flex items-center gap-1"><Users size={14} /> {i.interviewer}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                                    <span className="inline-flex items-center gap-1"><Mail size={14} /> {i.contact.email}</span>
                                    <span className="inline-flex items-center gap-1"><Phone size={14} /> {i.contact.phone}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <button
                                  onClick={() => router.push(`/company/my-jobs/${i.id}`)}
                                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#0F3D5E] border border-[#0F3D5E]/30 rounded-lg hover:bg-[#EFF6FF] transition"
                                >
                                  Job details <ArrowRight size={12} />
                                </button>
                                <div className="flex gap-2">
                                  <button className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-white transition">
                                    Join room
                                  </button>
                                  {i.status === "Reschedule" && (
                                    <button className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                                      <XCircle size={12} /> Reschedule
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {groupedEntries.length === 0 && (
            <div className="bg-white border border-dashed rounded-xl p-10 text-center text-slate-500">
              No interviews match these filters yet. Try clearing filters or check again later.
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