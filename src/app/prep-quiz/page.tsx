//src/app/prep-quiz/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function QuizListPage() {
  const router = useRouter();

  const quizzes = [
    {
      id: "se",
      title: "Software Engineering",
      description: "Master core SE concepts including SDLC, design patterns, and architecture.",
    },
    {
      id: "ds",
      title: "Data Structures",
      description: "Strengthen your problem-solving with arrays, trees, graphs, and more.",
    },
    {
      id: "algo",
      title: "Algorithms",
      description: "Practice sorting, searching, and advanced algorithmic techniques.",
    },
    {
      id: "db",
      title: "Databases",
      description: "Learn SQL, normalization, indexing, and database design concepts.",
    },
    {
      id: "os",
      title: "Operating Systems",
      description: "Understand processes, memory management, scheduling, and concurrency.",
    },
    {
      id: "net",
      title: "Computer Networks",
      description: "Explore protocols, TCP/IP, OSI model, and networking fundamentals.",
    },
    {
      id: "web",
      title: "Web Development",
      description: "Test your knowledge in frontend and backend web technologies.",
    },
    {
      id: "oop",
      title: "Object-Oriented Programming",
      description: "Master OOP concepts like inheritance, polymorphism, and encapsulation.",
    },
    {
      id: "ai",
      title: "Artificial Intelligence",
      description: "Introduction to AI concepts, machine learning basics, and logic systems.",
    },
    {
      id: "cyber",
      title: "Cyber Security",
      description: "Learn about threats, encryption, authentication, and system security.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0F172A] selection:bg-[#0F172A] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Modern Header - Refined & Compact */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0F172A]/5 border border-[#0F172A]/10 text-[9px] font-bold text-[#0F172A] uppercase tracking-[0.2em] mb-3">
            <span className="w-1 h-1 rounded-full bg-[#0F172A] animate-pulse"></span>
            Assessment Center
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0F172A] mb-3">
            Technical Prep Hub
          </h1>
          <p className="text-slate-400 text-[13px] max-w-xl leading-relaxed font-medium">
            Challenge yourself with industry-standard assessments. Identify knowledge gaps and master your technical interviews.
          </p>
          </div>
          <button
            onClick={() => router.push("/prep-quiz/history")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-900 transition"
          >
            View quiz history
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 12h14"/></svg>
          </button>
        </div>

        {/* QUIZ GRID - Modern Cards with Off-White Tint */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group relative bg-[#E2E8F0] rounded-[32px] border border-slate-200/60 p-8 hover:bg-white hover:border-slate-300 hover:shadow-[0_30px_70px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Abstract Background Decoration */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-white/20 rounded-full group-hover:bg-[#0F172A]/5 transition-colors duration-500"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-[#0F172A]/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                </div>

                <h2 className="text-[17px] font-bold text-[#0F172A] mb-3 leading-tight">
                  {quiz.title}
                </h2>

                <p className="text-slate-400 text-[13px] leading-relaxed mb-8 font-medium line-clamp-2">
                  {quiz.description}
                </p>

                {/* QUIZ DETAILS - Small Badges */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-100">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    20 Items
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-100">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Unlimited
                  </div>
                </div>
              </div>

              {/* BUTTON - Refined White/Blue Style matching Footer Color #0F172A */}
              <button
                onClick={() => router.push(`/prep-quiz/${quiz.id}`)}
                className="relative z-10 w-full py-4 bg-white border-2 border-slate-200 text-[#0F172A] rounded-[20px] font-bold text-[13px] shadow-sm hover:border-[#0F172A]/20 hover:bg-white active:scale-[0.98] transition-all transform flex items-center justify-center gap-2 group"
              >
                Start Preparation
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </button>
            </div>
          ))}
        </div>





      </main>
    </div>
  );
}
