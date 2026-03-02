// smart-screening\src\app\components\common\Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-5 mb-12 pb-8 border-b border-white/10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-slate-900 font-bold text-xs">
                HS
              </div>
              <span className="text-lg font-bold text-white">HireSmart</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              The smartest way to prepare for internships and jobs — built for ambitious students.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Roadmaps</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Mock Interviews</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Resume Builder</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Company Guides</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Skill Courses</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-sky-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/30 md:flex-row">
          <p>© {new Date().getFullYear()} HireSmart Inc. All rights reserved.</p>
          <p>Built with <span className="text-sky-400">♥</span> for students everywhere</p>
        </div>
      </div>
    </footer>
  );
}