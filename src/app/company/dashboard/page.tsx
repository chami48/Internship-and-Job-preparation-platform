"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { api } from "~/trpc/react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  UserCircle,
  LogOut,
  Bell,
  Search,
  Plus,
  Trash2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Eye,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

export default function CompanyDashboard() {
  const router = useRouter();
  const [companyId, setCompanyId] = React.useState<string | null>(null);
  const { data: company } = api.company.getProfile.useQuery(
    { companyId: companyId ?? "" },
    { enabled: !!companyId },
  );
  const companyName = company?.name || "Company";
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);

  const handleLogout = () => router.push('/company/comlogin');
  const handleCreateJob = () => router.push('/company/create-job');

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

        {/* Dashboard Logo (only here) */}
        <div className="hidden md:flex items-center gap-3 mr-4">
          <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-white font-bold text-sm">
            HS
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#3AB6D9]"></div>
          </div>
          <span className="text-lg font-bold text-[#0F172A] tracking-tight">HireSmart</span>
        </div>

        {/* Search Bar removed per request */}

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
  } lg:translate-x-0 sticky lg:sticky top-16 sm:top-20 left-0 w-72 sm:w-66 flex flex-col h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden z-50 lg:z-10 transition-transform duration-300 ease-in-out lg:shrink-0 border-r border-[#0B1527]`}
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
    { name: 'Dashboard', icon: LayoutDashboard, active: true, onClick: undefined },
    { name: 'My Job Posts', icon: Briefcase, onClick: () => { router.push('/company/my-jobs'); setSidebarOpen(false); } },
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

          {/* Mobile Search */}
          <div className="md:hidden p-4 bg-white border-b border-[#E2E8F0]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
              <input
                type="text"
                placeholder="Search jobs or candidates..."
                className="w-full pl-12 pr-4 py-3 bg-[#F4F7FB] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#3AB6D9]/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Dashboard Body */}
          <div className="p-4 sm:p-6 lg:p-12 space-y-6 sm:space-y-8 lg:space-y-12 bg-[#F8FAFF] text-[#0F172A] rounded-t-3xl shadow-inner">

            {/* Welcome Header */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#3AB6D9] bg-[#3AB6D9]/10 w-fit mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#3AB6D9]"></span>
                  <span className="text-xs font-semibold text-[#0F172A]">Live insights • Exam filtering enabled</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-0" style={{
                  background: "linear-gradient(135deg, #0F172A, #0EA5E9)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Hiring control center
                </h1>
                <p className="text-[#475569] text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
                  Monitor pipelines, scan performance, and launch roles from a single workspace.
                </p>
              </div>
              <button
                onClick={handleCreateJob}
                className="self-start sm:self-auto bg-[#0F3D5E] text-white px-5 sm:px-6 lg:px-7 py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-md hover:bg-[#0c2f49] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Plus size={18} strokeWidth={3} />
                <span>Create Job Post</span>
              </button>
            </section>

            {/* Large Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[
                { label: 'Total Job Posts', value: '18', icon: Briefcase, color: '#3B82F6' },
                { label: 'Qualified Candidates', value: '124', icon: Users, color: '#8B5CF6' },
                { label: 'Interviews Scheduled', value: '42', icon: Calendar, color: '#F59E0B' },
                { label: 'Filtering Rate', value: 'Top 20', icon: TrendingUp, color: '#10B981' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}14`, color: stat.color }}>
                      <stat.icon size={22} className="sm:w-[24px] sm:h-[24px]" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-600">{stat.label}</h3>
                  </div>
                  <p className="text-3xl sm:text-[32px] font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">

              {/* Left Column: Your Jobs Table */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-8 lg:space-y-10">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 lg:p-7 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Your Jobs</h2>
                      <p className="text-sm text-slate-500">Pipeline overview</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Live
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-left">
                          <th className="px-4 sm:px-6 lg:px-7 py-3 text-xs font-semibold uppercase text-slate-500">Job</th>
                          <th className="px-4 sm:px-6 lg:px-7 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                          <th className="px-4 sm:px-6 lg:px-7 py-3 text-xs font-semibold uppercase text-slate-500">Review</th>
                          <th className="px-4 sm:px-6 lg:px-7 py-3 text-xs font-semibold uppercase text-slate-500 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {[
                          { name: 'AI Engineer Intern', status: 'Active', review: 'To Review', id: 1 },
                          { name: 'ML Specialist', status: 'Closed', review: 'Not Reviewed', id: 2 },
                          { name: 'Data Scientist', status: 'Closed', review: 'Reviewed', id: 3 },
                        ].map((job) => (
                          <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 sm:px-6 lg:px-7 py-4 sm:py-5 text-sm font-semibold text-slate-900">{job.name}</td>
                            <td className="px-4 sm:px-6 lg:px-7 py-4 sm:py-5">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                                job.status === 'Active'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${job.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {job.status}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 lg:px-7 py-4 sm:py-5">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                                job.review === 'To Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                job.review === 'Not Reviewed' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                                'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                {job.review}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 lg:px-7 py-4 sm:py-5">
                              <div className="flex items-center justify-center gap-2 sm:gap-3">
                                <button className="p-2 text-[#0F3D5E] hover:bg-slate-100 rounded-md transition-all" title="View Candidates">
                                  <Eye size={18} />
                                </button>
                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-all" title="Delete Post">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Smart Screening Flow - Visual Logic Block */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-7 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Smart screening flow</h3>
                      <p className="text-sm text-slate-500 mt-1">Exam to shortlist to CV upload — automated with guardrails.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {[{ label: 'Exam scored', icon: Zap, color: 'text-amber-500' }, { label: 'Top 20 filtered', icon: Users, color: 'text-sky-600' }, { label: 'CV collected', icon: ShieldCheck, color: 'text-emerald-600' }].map((step, idx) => (
                        <React.Fragment key={step.label}>
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                            <step.icon size={18} className={step.color} />
                            <span className="text-sm font-semibold text-slate-800">{step.label}</span>
                          </div>
                          {idx < 2 && <ArrowRight size={16} className="hidden sm:block text-slate-400" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Company Snapshot */}
              <div className="lg:col-span-4 space-y-6 sm:space-y-7 lg:space-y-8">
                <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center">TC</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">TechCorp Inc.</h3>
                      <p className="text-sm text-slate-500">Pro member • since 2026</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <span className="text-sm font-medium text-slate-600">Filtering logic</span>
                      <span className="text-xs font-semibold text-slate-800">Top 20 exam</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <span className="text-sm font-medium text-slate-600">Verified hires</span>
                      <span className="text-sm font-semibold text-emerald-600">12 hired</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 bg-[#0F3D5E] text-white py-3 rounded-lg font-semibold hover:bg-[#0c2f49] transition-all text-sm">
                    Update profile
                  </button>
                </div>

                {/* Recruitment Advice */}
                <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck size={22} className="text-emerald-600" />
                    <h4 className="text-lg font-semibold text-slate-900">Post-exam protocol</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    When a job closes, ranked candidates move to review. Audit the top 20 verified performers before scheduling interviews.
                  </p>
                  <button className="w-full border border-slate-300 text-slate-800 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-all text-sm">
                    View checklist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
