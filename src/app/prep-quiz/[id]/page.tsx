//src/app/prep-quiz/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";

export default function QuizLandingPage() {
  const params = useParams();
  const router = useRouter();

  const quizId = params.id as string;

  const quizzes: any = {
    se: {
      title: "Software Engineering Mastery",
      subtitle:
        "Practice real-world software engineering concepts including SDLC, design patterns, and system design.",
    },
    ds: {
      title: "Data Structures Prep",
      subtitle:
        "Strengthen your problem-solving with arrays, trees, graphs, and more.",
    },
    algo: {
      title: "Algorithms Deep Dive",
      subtitle:
        "Master sorting, searching, and advanced algorithmic techniques.",
    },
    db: {
      title: "Database Systems",
      subtitle:
        "Learn SQL, normalization, indexing, and database design principles.",
    },
    os: {
      title: "Operating Systems",
      subtitle:
        "Understand memory management, scheduling, and process handling.",
    },
    net: {
      title: "Computer Networks",
      subtitle:
        "Explore TCP/IP, OSI model, and networking fundamentals.",
    },
    web: {
      title: "Web Development",
      subtitle:
        "Test your frontend and backend development knowledge.",
    },
    oop: {
      title: "Object-Oriented Programming",
      subtitle:
        "Master OOP principles like inheritance, encapsulation, and polymorphism.",
    },
    ai: {
      title: "Artificial Intelligence",
      subtitle:
        "Introduction to AI, machine learning basics, and logic systems.",
    },
    cyber: {
      title: "Cyber Security",
      subtitle:
        "Learn about threats, encryption, and secure systems.",
    },
  };

  const quiz = quizzes[quizId];

  if (!quiz) {
    return <div className="p-10 text-center">Quiz not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0F172A] selection:bg-[#0F172A] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Hero Section - Refined & Minimalist */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content: Structured & Clean */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0F172A]/5 border border-[#0F172A]/10 text-[9px] font-bold text-[#0F172A] uppercase tracking-[0.2em] mb-5">
              <span className="w-1 h-1 rounded-full bg-[#0F172A] animate-pulse"></span>
              Technical Assessment
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] mb-5 leading-tight">
              {quiz.title}
            </h1>

            <p className="text-slate-400 text-[14px] md:text-[15px] max-w-lg leading-relaxed font-medium mb-8">
              {quiz.subtitle}
            </p>

            {/* Assessment Meta - Smaller & Clean Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                20 Questions
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                15 Minutes
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Verified
              </div>
            </div>

            {/* PRIMARY CTA - Refined Button Font */}
            <button
              onClick={() => router.push(`/prep-quiz/${quizId}/start`)}
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#0F172A] text-white rounded-[18px] font-bold text-[13px] shadow-lg shadow-[#0F172A]/15 hover:shadow-[#0F172A]/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Assessment
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>
          </div>

          {/* Right Content: Compact Visual */}
          <div className="relative group lg:block hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#F1F5F9] rounded-full blur-3xl opacity-60"></div>
            
            <div className="relative p-3 bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.04)] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"
                alt="Assessment Visual"
                className="w-full h-[380px] object-cover rounded-[24px]"
              />
              {/* Overlay Badge - Small Font */}
              <div className="absolute bottom-8 left-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg mb-2">
                <p className="text-[#0F172A] font-bold text-[11px] leading-tight italic">"The best way to predict your future is to create it."</p>
                <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mt-1">— Prep Center</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid - Super Clean & Minimalist */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="group p-8 bg-[#F8FAFC] hover:bg-white rounded-[32px] border border-slate-100 transition-all duration-500">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0F172A] mb-6 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-2 uppercase tracking-tight">Industry Standard</h3>
            <p className="text-slate-400 text-[12px] leading-relaxed font-medium">Curated questions encountered in real technical interviews at top-tier companies.</p>
          </div>

          <div className="group p-8 bg-[#F8FAFC] hover:bg-white rounded-[32px] border border-slate-100 transition-all duration-500">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0F172A] mb-6 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-2 uppercase tracking-tight">Adaptive Insight</h3>
            <p className="text-slate-400 text-[12px] leading-relaxed font-medium">Immediate clarity with detailed explanations for every answer during your test session.</p>
          </div>

          <div className="group p-8 bg-[#F8FAFC] hover:bg-white rounded-[32px] border border-slate-100 transition-all duration-500">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0F172A] mb-6 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
            </div>
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-2 uppercase tracking-tight">Performance Hub</h3>
            <p className="text-slate-400 text-[12px] leading-relaxed font-medium">Track your growth over multiple attempts and zero in on improvement areas.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
