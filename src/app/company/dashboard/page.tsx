"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
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
  CheckCircle2,
  TrendingUp,
  Eye,
  ArrowRight
} from 'lucide-react';

export default function CompanyDashboard() {
  const router = useRouter();

  const handleLogout = () => router.push('/company/comlogin');
  const handleCreateJob = () => router.push('/company/create-job');

  return (
    <div className="flex min-h-screen bg-[#F4F7FB] font-sans text-[#0F172A] selection:bg-[#3AB6D9]/30">
      
      {/* Sidebar - Fixed Position */}
      <aside className="w-72 bg-white border-r border-[#E2E8F0] flex flex-col fixed top-16 h-[calc(100vh-4rem)] z-20">
        <nav className="flex-1 px-6 space-y-2 mt-4">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, active: true, onClick: undefined },
            { name: 'My Job Posts', icon: Briefcase, onClick: () => router.push('/company/my-jobs') },
            { name: 'Selected Candidates', icon: Users, onClick: undefined },
            { name: 'Interviews', icon: Calendar, onClick: undefined },
            { name: 'Company Profile', icon: UserCircle, onClick: () => router.push('/company/profile') },
          ].map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                item.active 
                  ? 'bg-[#1F7FB2] text-white shadow-md shadow-blue-900/10' 
                  : 'text-[#64748B] hover:bg-[#F4F7FB] hover:text-[#0F172A]'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-[#E2E8F0]">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area - Full Width */}
      <main className="flex-1 ml-72 flex flex-col min-w-0">
        
        {/* Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl sticky top-16 z-10 border-b border-[#E2E8F0] flex items-center justify-between px-12">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
            <input 
              type="text" 
              placeholder="Search jobs or candidates..." 
              className="w-full pl-12 pr-4 py-3 bg-[#F4F7FB] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#3AB6D9]/50 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-8">
            <button onClick={handleCreateJob} className="bg-gradient-to-r from-[#0F3D5E] to-[#2C89B8] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-[#1F7FB2]/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2">
              <Plus size={18} strokeWidth={3} />
              Create Job Post
            </button>

            <div className="flex items-center gap-4 border-l border-[#E2E8F0] pl-8">
              <button className="relative p-2.5 text-[#64748B] hover:bg-[#F4F7FB] rounded-xl transition-colors">
                <Bell size={22} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-11 h-11 bg-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 ring-[#1F7FB2] transition-all">
                <img src="https://ui-avatars.com/api/?name=Hire+Smart&background=0F3D5E&color=fff" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-12 space-y-12">
          
          {/* Welcome Header */}
          <section>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F7FB2]/20 bg-[#1F7FB2]/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3AB6D9] animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-widest text-[#1F7FB2]">Exam Filtering Active</span>
            </div>
            <h1 className="text-5xl font-black text-[#0F172A] mb-4 tracking-tight">
              Beyond Skills <span className="text-[#1F7FB2]">Into Potential</span>
            </h1>
            <p className="text-[#64748B] text-xl font-medium max-w-3xl">
              Automated exam-based filtering. We deliver the top 20 verified candidates for every role.
            </p>
          </section>

          {/* Large Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[
              { label: 'Total Job Posts', value: '18', icon: Briefcase, color: '#3B82F6' },
              { label: 'Qualified Candidates', value: '124', icon: Users, color: '#8B5CF6' },
              { label: 'Interviews Scheduled', value: '42', icon: Calendar, color: '#F59E0B' },
              { label: 'Filtering Rate', value: 'Top 20', icon: TrendingUp, color: '#10B981' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-[#E2E8F0] shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                    <stat.icon size={28} />
                  </div>
                </div>
                <h3 className="text-[#64748B] text-sm font-bold uppercase tracking-widest">{stat.label}</h3>
                <p className="text-4xl font-black text-[#0F172A] mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Your Jobs Table */}
            <div className="lg:col-span-8 space-y-10">
              <div className="bg-white rounded-[40px] border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-[#E2E8F0] flex justify-between items-center">
                  <h2 className="text-2xl font-black text-[#0F172A]">Your Jobs</h2>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-widest">
                    Active Pipeline <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F4F7FB]/50 border-b border-[#E2E8F0]">
                        <th className="px-8 py-5 text-xs font-black uppercase text-[#64748B]">Job Name</th>
                        <th className="px-8 py-5 text-xs font-black uppercase text-[#64748B]">Status</th>
                        <th className="px-8 py-5 text-xs font-black uppercase text-[#64748B]">Review Status</th>
                        <th className="px-8 py-5 text-xs font-black uppercase text-[#64748B] text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {[
                        { name: 'AI Engineer Intern', status: 'Active', review: 'To Review', id: 1 },
                        { name: 'ML Specialist', status: 'Closed', review: 'Not Reviewed', id: 2 },
                        { name: 'Data Scientist', status: 'Closed', review: 'Reviewed', id: 3 },
                      ].map((job) => (
                        <tr key={job.id} className="hover:bg-[#F4F7FB]/30 transition-colors">
                          <td className="px-8 py-6 font-bold text-[#0F172A]">{job.name}</td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${
                              job.status === 'Active' 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : 'bg-red-100 text-red-700 border-red-200'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${
                              job.review === 'To Review' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                              job.review === 'Not Reviewed' ? 'bg-green-100 text-green-700 border-green-200' :
                              'bg-red-100 text-red-700 border-red-200'
                            }`}>
                              {job.review}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-center gap-3">
                               <button className="p-2 text-[#1F7FB2] hover:bg-[#1F7FB2]/10 rounded-lg transition-all" title="View Candidates">
                                 <Eye size={18} />
                               </button>
                               <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Post">
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
              <div className="bg-[#0F172A] rounded-[40px] p-10 text-white relative shadow-2xl overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="md:col-span-1">
                    <h3 className="text-2xl font-black mb-3 text-[#3AB6D9]">Smart Filter</h3>
                    <p className="text-slate-400 font-medium">Top 20 candidates are automatically invited to upload CVs after the exam.</p>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-lg">
                    <div className="text-center">
                      <Zap className="mx-auto mb-2 text-[#F59E0B]" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stage 1</p>
                      <p className="text-sm font-bold">Exam Result</p>
                    </div>
                    <ArrowRight size={16} className="text-slate-600" />
                    <div className="text-center">
                      <Users className="mx-auto mb-2 text-[#3AB6D9]" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stage 2</p>
                      <p className="text-sm font-bold">Filter Top 20</p>
                    </div>
                    <ArrowRight size={16} className="text-slate-600" />
                    <div className="text-center">
                      <ShieldCheck className="mx-auto mb-2 text-[#10B981]" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stage 3</p>
                      <p className="text-sm font-bold">CV Upload</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#1F7FB2] opacity-20 blur-[120px]"></div>
              </div>
            </div>

            {/* Right Column: Company Snapshot */}
            <div className="lg:col-span-4 space-y-10">
              <div className="bg-white p-10 rounded-[40px] border border-[#E2E8F0] shadow-sm">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1F7FB2] to-[#3AB6D9] rounded-[32px] flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl shadow-blue-500/20">
                    TC
                  </div>
                  <h3 className="text-2xl font-black text-[#0F172A]">TechCorp Inc.</h3>
                  <p className="text-[#64748B] font-medium text-sm">Pro Member since 2026</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#F4F7FB] flex items-center justify-between border border-[#E2E8F0]/50">
                    <span className="text-sm font-bold text-[#64748B]">Filtering Logic</span>
                    <span className="text-xs font-black text-[#1F7FB2] uppercase">Top 20 Exam</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F4F7FB] flex items-center justify-between border border-[#E2E8F0]/50">
                    <span className="text-sm font-bold text-[#64748B]">Verified Hires</span>
                    <span className="text-sm font-black text-[#10B981]">12 Hired</span>
                  </div>
                </div>
                <button className="w-full mt-8 bg-[#0F172A] text-white py-4 rounded-2xl font-bold hover:brightness-125 transition-all shadow-lg shadow-black/10">
                  Update Profile
                </button>
              </div>

              {/* Recruitment Advice */}
              <div className="bg-gradient-to-br from-[#0F3D5E] to-[#2C89B8] p-10 rounded-[40px] text-white shadow-2xl">
                <ShieldCheck size={32} className="mb-6 text-[#3AB6D9]" />
                <h4 className="text-xl font-black mb-4 tracking-tight">Post-Exam Protocol</h4>
                <p className="text-blue-50/80 text-sm font-medium leading-relaxed mb-8">
                  Once a job closes, candidates are ranked. Review the CVs of the top 20 verified performers to schedule interviews.
                </p>
                <button className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}