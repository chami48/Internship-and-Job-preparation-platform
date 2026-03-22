// ─── Types ──────────────────────────────────────────────────────

export interface ExamResult {
  studentName: string;
  examTitle: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  cutoff: number;
  status: "PASS" | "FAIL";
  date: string;
  aiFeedback: string;
  cvUploadUnlocked: boolean;
}

export interface EvaluatedQuestion {
  id: number;
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  expectedAnswer: string;
  score: number;
  maxMarks: number;
  aiFeedback: string;
}

export interface PermissionStatusData {
  passed: boolean;
  score: number;
  cutoff: number;
  percentage: number;
  message: string;
  cvUploadUnlocked: boolean;
  nextSteps: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  appliedRole: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: "PASS" | "FAIL";
}

export interface CandidateDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedRole: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: "PASS" | "FAIL";
  evaluationDate: string;
  sections: { name: string; score: number; maxScore: number }[];
  answers: EvaluatedQuestion[];
  shortlistStatus: "Shortlisted" | "Under Review" | "Rejected";
}

// ─── Mock Data ──────────────────────────────────────────────────

export const studentExamResult: ExamResult = {
  studentName: "Aisha Sharma",
  examTitle: "Frontend Developer Assessment",
  totalScore: 78,
  maxScore: 100,
  percentage: 78,
  cutoff: 60,
  status: "PASS",
  date: "2026-03-10",
  aiFeedback:
    "Strong understanding of React fundamentals and component architecture. Good grasp of state management patterns. Could improve on CSS layout techniques and accessibility best practices. Overall a well-rounded performance demonstrating readiness for a junior-to-mid level frontend role.",
  cvUploadUnlocked: true,
};

export const evaluatedQuestions: EvaluatedQuestion[] = [
  {
    id: 1,
    questionNumber: 1,
    questionText:
      "Explain the virtual DOM in React and how it improves performance.",
    studentAnswer:
      "The virtual DOM is a lightweight copy of the actual DOM. React creates a virtual representation and compares it with the previous version using a diffing algorithm. Only the changed parts are updated in the real DOM, which is faster than re-rendering the entire page.",
    expectedAnswer:
      "The virtual DOM is an in-memory representation of the real DOM. React uses reconciliation to compare the new virtual DOM with the previous snapshot, computing the minimal set of changes (diffing). It then batches these updates and applies them to the real DOM efficiently, reducing costly DOM manipulations.",
    score: 9,
    maxMarks: 10,
    aiFeedback:
      "Excellent explanation covering the core concept. Mentioned diffing algorithm correctly. Could have elaborated on batching of updates and reconciliation process.",
  },
  {
    id: 2,
    questionNumber: 2,
    questionText:
      "What is the difference between useEffect and useLayoutEffect?",
    studentAnswer:
      "useEffect runs after the browser paints the screen while useLayoutEffect runs before the paint. useLayoutEffect is useful when you need to read layout from the DOM and synchronously re-render.",
    expectedAnswer:
      "useEffect fires asynchronously after the browser has painted, making it suitable for data fetching and subscriptions. useLayoutEffect fires synchronously after all DOM mutations but before the browser has painted, useful for measuring DOM elements and applying layout changes without visual flicker.",
    score: 8,
    maxMarks: 10,
    aiFeedback:
      "Good understanding of the timing difference. Could have mentioned specific use cases like preventing visual flicker with useLayoutEffect.",
  },
  {
    id: 3,
    questionNumber: 3,
    questionText: "Describe the CSS Box Model and its components.",
    studentAnswer:
      "The CSS Box Model consists of content, padding, border, and margin. Content is the inner area, padding is space between content and border, border wraps the padding, and margin is the outer space.",
    expectedAnswer:
      "The CSS Box Model describes how elements are rendered. Each element is a box with four areas: content (the actual content), padding (transparent space around content), border (surrounds padding), and margin (transparent outer space). The box-sizing property controls whether width/height includes padding and border (border-box) or just content (content-box).",
    score: 7,
    maxMarks: 10,
    aiFeedback:
      "Correct basic explanation. Missing the important distinction between content-box and border-box box-sizing, which is critical for layout work.",
  },
  {
    id: 4,
    questionNumber: 4,
    questionText:
      "What are closures in JavaScript? Provide a practical example.",
    studentAnswer:
      "A closure is when a function remembers the variables from its outer scope even after the outer function has finished executing. For example, a counter function that returns an increment function — the inner function still has access to the count variable.",
    expectedAnswer:
      "A closure is a function that retains access to its lexical scope even when executed outside that scope. Example: function makeCounter() { let count = 0; return () => ++count; } — the returned function closes over `count`. Closures enable data privacy, partial application, and function factories.",
    score: 9,
    maxMarks: 10,
    aiFeedback:
      "Strong conceptual answer with a good practical example. Could have mentioned additional use cases like data privacy and partial application.",
  },
  {
    id: 5,
    questionNumber: 5,
    questionText:
      "Explain how TypeScript generics work and when you would use them.",
    studentAnswer:
      "Generics let you write functions or components that work with any type while still being type-safe. You define a type parameter like T and use it throughout. For example, a function that returns the first element of an array of any type.",
    expectedAnswer:
      "Generics provide a way to create reusable components that work over a variety of types. Using type parameters (e.g., <T>), you can write functions, classes, and interfaces that are type-safe without committing to a specific type. They enable constraints (extends), defaults, and are essential for utility types, container abstractions, and API response typing.",
    score: 8,
    maxMarks: 10,
    aiFeedback:
      "Good foundational understanding. Could have discussed generic constraints, default types, and real-world patterns like API response wrappers.",
  },
  {
    id: 6,
    questionNumber: 6,
    questionText:
      "What is server-side rendering (SSR) in Next.js and how does it differ from static generation (SSG)?",
    studentAnswer:
      "SSR generates HTML on each request on the server while SSG generates HTML at build time. SSR is good for dynamic content that changes frequently, SSG is better for static pages that don't change often.",
    expectedAnswer:
      "SSR (Server-Side Rendering) generates HTML at request time using getServerSideProps, ideal for frequently updated or personalized content. SSG (Static Site Generation) pre-renders at build time using getStaticProps, offering better performance through CDN caching. Next.js also supports ISR (Incremental Static Regeneration) which combines both approaches.",
    score: 7,
    maxMarks: 10,
    aiFeedback:
      "Correct high-level comparison. Should have mentioned the specific Next.js functions (getServerSideProps, getStaticProps) and ISR as a hybrid approach.",
  },
  {
    id: 7,
    questionNumber: 7,
    questionText:
      "How do you handle state management in a large React application?",
    studentAnswer:
      "For large apps, I would use React Context for global state, useReducer for complex state logic, and consider external libraries like Redux Toolkit or Zustand for scalable state management. Local state stays in components with useState.",
    expectedAnswer:
      "State management strategies include: local state (useState/useReducer) for component-level data, React Context for shared low-frequency state, and external stores (Redux Toolkit, Zustand, Jotai) for complex global state. Server state is best handled by TanStack Query or SWR. The choice depends on state update frequency, sharing scope, and complexity.",
    score: 8,
    maxMarks: 10,
    aiFeedback:
      "Solid answer covering multiple approaches. Could have distinguished between client state and server state, and mentioned tools like React Query for server-state management.",
  },
  {
    id: 8,
    questionNumber: 8,
    questionText:
      "What is accessibility (a11y) in web development and name three techniques to improve it.",
    studentAnswer:
      "Accessibility means making websites usable for everyone including people with disabilities. Three techniques: use semantic HTML elements, add alt text to images, and ensure keyboard navigation works properly.",
    expectedAnswer:
      "Web accessibility ensures equal access for users with disabilities, guided by WCAG standards. Key techniques: semantic HTML (header, nav, main, etc.), ARIA attributes for dynamic content, alt text for images, keyboard navigation support, sufficient color contrast, focus management, and screen reader testing.",
    score: 7,
    maxMarks: 10,
    aiFeedback:
      "Correct techniques mentioned. Could have referenced WCAG guidelines, ARIA attributes, color contrast ratios, and focus management for a more comprehensive answer.",
  },
];

export const permissionStatusPass: PermissionStatusData = {
  passed: true,
  score: 78,
  cutoff: 60,
  percentage: 78,
  message:
    "Congratulations! You have successfully passed the AI evaluation. Your CV upload is now unlocked.",
  cvUploadUnlocked: true,
  nextSteps: [
    "Upload your CV/Resume to complete your profile",
    "Browse and apply to matching job positions",
    "Prepare for upcoming interviews",
    "Review your detailed evaluation feedback",
  ],
};

export const permissionStatusFail: PermissionStatusData = {
  passed: false,
  score: 42,
  cutoff: 60,
  percentage: 42,
  message:
    "Unfortunately, you did not meet the minimum cutoff score. Please review the feedback and try again.",
  cvUploadUnlocked: false,
  nextSteps: [
    "Review detailed evaluation feedback",
    "Study the recommended topics",
    "Practice with sample questions",
    "Retake the assessment when ready",
  ],
};

export const filteredCandidates: Candidate[] = [
  {
    id: "1",
    name: "Aisha Sharma",
    email: "aisha.sharma@email.com",
    appliedRole: "Frontend Developer",
    score: 78,
    maxScore: 100,
    percentage: 78,
    status: "PASS",
  },
  {
    id: "2",
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    appliedRole: "Backend Developer",
    score: 85,
    maxScore: 100,
    percentage: 85,
    status: "PASS",
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    appliedRole: "Full Stack Developer",
    score: 92,
    maxScore: 100,
    percentage: 92,
    status: "PASS",
  },
  {
    id: "4",
    name: "Arjun Mehta",
    email: "arjun.mehta@email.com",
    appliedRole: "Frontend Developer",
    score: 45,
    maxScore: 100,
    percentage: 45,
    status: "FAIL",
  },
  {
    id: "5",
    name: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    appliedRole: "UI/UX Designer",
    score: 71,
    maxScore: 100,
    percentage: 71,
    status: "PASS",
  },
  {
    id: "6",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    appliedRole: "Backend Developer",
    score: 38,
    maxScore: 100,
    percentage: 38,
    status: "FAIL",
  },
  {
    id: "7",
    name: "Ananya Reddy",
    email: "ananya.reddy@email.com",
    appliedRole: "DevOps Engineer",
    score: 88,
    maxScore: 100,
    percentage: 88,
    status: "PASS",
  },
  {
    id: "8",
    name: "Karan Joshi",
    email: "karan.joshi@email.com",
    appliedRole: "Full Stack Developer",
    score: 63,
    maxScore: 100,
    percentage: 63,
    status: "PASS",
  },
];

export const candidateDetailData: CandidateDetail = {
  id: "1",
  name: "Aisha Sharma",
  email: "aisha.sharma@email.com",
  phone: "+91 98765 43210",
  appliedRole: "Frontend Developer",
  totalScore: 78,
  maxScore: 100,
  percentage: 78,
  status: "PASS",
  evaluationDate: "2026-03-10",
  shortlistStatus: "Under Review",
  sections: [
    { name: "React & Components", score: 17, maxScore: 20 },
    { name: "JavaScript Fundamentals", score: 17, maxScore: 20 },
    { name: "CSS & Layout", score: 14, maxScore: 20 },
    { name: "TypeScript", score: 16, maxScore: 20 },
    { name: "Next.js & SSR", score: 14, maxScore: 20 },
  ],
  answers: evaluatedQuestions,
};
