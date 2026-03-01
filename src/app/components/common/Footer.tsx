// smart-screening\src\app\components\common\Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Internship & Job Preparation Platform
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Smart role-based screening to reduce CV overload and help students
              prove skills before interviews.
            </p>
          </div>

          <div className="text-sm text-gray-600">
            <div className="font-semibold text-gray-900">Modules</div>
            <ul className="mt-2 space-y-2">
              <li>Company Posting & Management</li>
              <li>Student Profile & Preparation</li>
              <li>Secure Skill Exam</li>
              <li>AI Evaluation & Filtering</li>
            </ul>
          </div>

          <div className="text-sm text-gray-600">
            <div className="font-semibold text-gray-900">Contact</div>
            <p className="mt-2">SLIIT • ITPM Project</p>
            <p className="mt-1 text-gray-500">© {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-gray-200 pt-6 text-xs text-gray-500 md:flex-row">
          <p>Built with T3 Stack • Next.js • tRPC • Prisma</p>
          <p>Designed for clean, modern UX</p>
        </div>
      </div>
    </footer>
  );
}