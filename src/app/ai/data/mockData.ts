export type PassFailStatus = "PASS" | "FAIL";

export interface MockResult {
  applicationId: string;
  studentName: string;
  examTitle: string;
  date: string;
  status: PassFailStatus;
  totalScore: number;
  maxScore: number;
  percentage: number;
  cutoff: number;
  aiFeedback: string;
  cvUploadUnlocked: boolean;
}

export interface MockQuestionEvaluation {
  id: string;
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  expectedAnswer: string;
  score: number;
  maxMarks: number;
  aiFeedback: string;
}

export interface MockPermissionStatus {
  passed: boolean;
  message: string;
  nextSteps: string[];
  percentage: number;
  cutoff: number;
  status: "COMPLETED" | "PROCESSING" | "FAILED";
}

export interface MockCandidateSummary {
  id: string;
  name: string;
  email: string;
  appliedRole: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: PassFailStatus;
  evaluatedAt: string;
}

export interface MockCandidateDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university?: string;
  degree?: string;
  specialization?: string;
  cgpa?: string;
  programmingLanguages?: string;
  frameworks?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  appliedRole: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  cutoff: number;
  status: PassFailStatus;
  evaluationDate: string;
  aiFeedback: string;
  cvUploadGranted: boolean;
  answers: MockQuestionEvaluation[];
}

const DEFAULT_APPLICATION_ID = "app-ai-001";
const DEFAULT_JOB_ID = "job-ai-frontend-001";

export const mockResults: Record<string, MockResult> = {
  "app-ai-001": {
    applicationId: "app-ai-001",
    studentName: "Nethmi Perera",
    examTitle: "AI Evaluation - Frontend Engineer",
    date: "24 Mar 2026",
    status: "PASS",
    totalScore: 84,
    maxScore: 100,
    percentage: 84,
    cutoff: 70,
    aiFeedback:
      "Strong practical problem solving and good understanding of React patterns. Minor gaps in performance optimization, but overall delivery is production ready.",
    cvUploadUnlocked: true,
  },
  "app-ai-002": {
    applicationId: "app-ai-002",
    studentName: "Ashen Fernando",
    examTitle: "AI Evaluation - Frontend Engineer",
    date: "24 Mar 2026",
    status: "FAIL",
    totalScore: 58,
    maxScore: 100,
    percentage: 58,
    cutoff: 70,
    aiFeedback:
      "Understands core syntax, but missed key requirements in architecture and testing depth. Needs stronger reasoning around trade-offs.",
    cvUploadUnlocked: false,
  },
};

export const mockEvaluationDetails: Record<string, MockQuestionEvaluation[]> = {
  "app-ai-001": [
    {
      id: "qeval-1",
      questionNumber: 1,
      questionText: "Explain how you would optimize a large candidate table in React.",
      studentAnswer:
        "I would add pagination and memoization and also split rows into reusable components.",
      expectedAnswer:
        "Use pagination/virtualization, memoization, stable keys, and avoid expensive renders with selective updates.",
      score: 18,
      maxMarks: 20,
      aiFeedback:
        "Good answer with practical techniques. Mentioning virtualization libraries and profiler usage would make it stronger.",
    },
    {
      id: "qeval-2",
      questionNumber: 2,
      questionText: "Describe the difference between controlled and uncontrolled inputs.",
      studentAnswer:
        "Controlled inputs keep state in React while uncontrolled use refs and DOM values.",
      expectedAnswer:
        "Controlled inputs bind value to state; uncontrolled relies on DOM with refs for access.",
      score: 16,
      maxMarks: 20,
      aiFeedback:
        "Correct conceptual distinction with concise explanation. Could include trade-offs and validation implications.",
    },
    {
      id: "qeval-3",
      questionNumber: 3,
      questionText: "How would you secure file upload workflows in a web app?",
      studentAnswer:
        "Validate file type and size, scan files, and keep upload permissions role-based.",
      expectedAnswer:
        "Validate MIME and size, virus scan, signed URLs, ACL checks, and isolate storage paths.",
      score: 15,
      maxMarks: 20,
      aiFeedback:
        "Solid baseline controls. Missed signed URL handling and storage isolation best practices.",
    },
    {
      id: "qeval-4",
      questionNumber: 4,
      questionText: "Write a strategy for CI checks before deployment.",
      studentAnswer:
        "Run lint, type-check, tests and build in CI. Block deploy on failures.",
      expectedAnswer:
        "Gate deploy with lint, type checks, unit/integration tests, build, and optional security scans.",
      score: 17,
      maxMarks: 20,
      aiFeedback:
        "Well structured and correct. Mentioning rollback and environment parity would improve completeness.",
    },
    {
      id: "qeval-5",
      questionNumber: 5,
      questionText: "How do you balance readability and performance in frontend code?",
      studentAnswer:
        "I optimize only bottlenecks and keep code readable by default.",
      expectedAnswer:
        "Prefer readable code first, profile bottlenecks, then optimize with measurable impact.",
      score: 18,
      maxMarks: 20,
      aiFeedback:
        "Strong engineering judgement and pragmatic optimization approach.",
    },
  ],
  "app-ai-002": [
    {
      id: "qeval-6",
      questionNumber: 1,
      questionText: "Explain how to design a reusable component system.",
      studentAnswer: "Create components and props.",
      expectedAnswer:
        "Define design tokens, typed props, composition patterns, and usage boundaries with documentation.",
      score: 11,
      maxMarks: 20,
      aiFeedback:
        "Too brief. Lacks details on typing, composition patterns, and consistency controls.",
    },
    {
      id: "qeval-7",
      questionNumber: 2,
      questionText: "How do you debug slow page loads in Next.js?",
      studentAnswer: "Check network and optimize images.",
      expectedAnswer:
        "Use Web Vitals and profiling to inspect bundle size, hydration, image strategy, and server timings.",
      score: 12,
      maxMarks: 20,
      aiFeedback:
        "Mentions valid starting points but misses systematic profiling workflow.",
    },
  ],
};

export const mockPermissionByApplicationId: Record<string, MockPermissionStatus> = {
  "app-ai-001": {
    passed: true,
    message: "You passed the AI cutoff. CV upload is unlocked for this application.",
    nextSteps: [
      "Upload your updated CV from your student profile.",
      "Keep your portfolio and GitHub links up to date.",
      "Monitor recruiter messages for interview scheduling.",
      "Prepare to discuss your project architecture decisions.",
    ],
    percentage: 84,
    cutoff: 70,
    status: "COMPLETED",
  },
  "app-ai-002": {
    passed: false,
    message: "You are below the current cutoff. CV upload remains locked for now.",
    nextSteps: [
      "Review question-level feedback in detail.",
      "Focus on system design and testing explanation quality.",
      "Attempt a mock test and improve answer structure.",
      "Reapply after strengthening weak areas.",
    ],
    percentage: 58,
    cutoff: 70,
    status: "COMPLETED",
  },
};

export const mockCandidatesByJobId: Record<string, MockCandidateSummary[]> = {
  "job-ai-frontend-001": [
    {
      id: "app-ai-001",
      name: "Nethmi Perera",
      email: "nethmi.perera@email.com",
      appliedRole: "Frontend Engineer",
      score: 84,
      maxScore: 100,
      percentage: 84,
      status: "PASS",
      evaluatedAt: "24 Mar 2026",
    },
    {
      id: "app-ai-002",
      name: "Ashen Fernando",
      email: "ashen.fernando@email.com",
      appliedRole: "Frontend Engineer",
      score: 58,
      maxScore: 100,
      percentage: 58,
      status: "FAIL",
      evaluatedAt: "24 Mar 2026",
    },
    {
      id: "app-ai-003",
      name: "Dinithi Jayawardena",
      email: "dinithi.jayawardena@email.com",
      appliedRole: "Frontend Engineer",
      score: 76,
      maxScore: 100,
      percentage: 76,
      status: "PASS",
      evaluatedAt: "25 Mar 2026",
    },
    {
      id: "app-ai-004",
      name: "Ravindu Wickramasinghe",
      email: "ravindu.w@email.com",
      appliedRole: "Frontend Engineer",
      score: 69,
      maxScore: 100,
      percentage: 69,
      status: "FAIL",
      evaluatedAt: "25 Mar 2026",
    },
  ],
};

export const mockCandidateDetails: Record<string, MockCandidateDetail> = {
  "app-ai-001": {
    id: "app-ai-001",
    name: "Nethmi Perera",
    email: "nethmi.perera@email.com",
    phone: "+94 77 123 4567",
    university: "University of Moratuwa",
    degree: "BSc (Hons) in IT",
    specialization: "SOFTWARE_ENGINEERING",
    cgpa: "3.71",
    programmingLanguages: "TypeScript, JavaScript, Java",
    frameworks: "Next.js, React, Node.js",
    linkedin: "linkedin.com/in/nethmi-perera",
    github: "github.com/nethmiperera",
    portfolio: "nethmiperera.dev",
    appliedRole: "Frontend Engineer",
    totalScore: 84,
    maxScore: 100,
    percentage: 84,
    cutoff: 70,
    status: "PASS",
    evaluationDate: "24 Mar 2026",
    aiFeedback:
      "Candidate demonstrates strong frontend fundamentals and consistently clear implementation choices. Recommended for shortlist.",
    cvUploadGranted: true,
    answers: mockEvaluationDetails["app-ai-001"] ?? [],
  },
  "app-ai-002": {
    id: "app-ai-002",
    name: "Ashen Fernando",
    email: "ashen.fernando@email.com",
    phone: "+94 71 765 4321",
    university: "University of Colombo",
    degree: "BSc in Computer Science",
    specialization: "SOFTWARE_ENGINEERING",
    cgpa: "3.12",
    programmingLanguages: "JavaScript, Python",
    frameworks: "React, Express",
    linkedin: "linkedin.com/in/ashen-fernando",
    github: "github.com/ashenfernando",
    portfolio: "ashenfolio.web.app",
    appliedRole: "Frontend Engineer",
    totalScore: 58,
    maxScore: 100,
    percentage: 58,
    cutoff: 70,
    status: "FAIL",
    evaluationDate: "24 Mar 2026",
    aiFeedback:
      "Basic concepts are present, but the candidate should improve depth of architectural reasoning and structured response quality.",
    cvUploadGranted: false,
    answers: mockEvaluationDetails["app-ai-002"] ?? [],
  },
};

export function getMockResult(applicationId?: string | null): MockResult | null {
  if (!applicationId) {
    return mockResults[DEFAULT_APPLICATION_ID] ?? null;
  }
  return mockResults[applicationId] ?? null;
}

export function getMockEvaluationDetails(applicationId?: string | null): MockQuestionEvaluation[] {
  if (!applicationId) {
    return mockEvaluationDetails[DEFAULT_APPLICATION_ID] ?? [];
  }
  return mockEvaluationDetails[applicationId] ?? [];
}

export function getMockPermissionStatus(applicationId?: string | null): MockPermissionStatus | null {
  if (!applicationId) {
    return mockPermissionByApplicationId[DEFAULT_APPLICATION_ID] ?? null;
  }
  return mockPermissionByApplicationId[applicationId] ?? null;
}

export function getMockCandidates(jobId?: string | null): MockCandidateSummary[] {
  if (!jobId) {
    return mockCandidatesByJobId[DEFAULT_JOB_ID] ?? [];
  }
  return mockCandidatesByJobId[jobId] ?? [];
}

export function getMockCandidateDetail(applicationId?: string | null): MockCandidateDetail | null {
  if (!applicationId) {
    return mockCandidateDetails[DEFAULT_APPLICATION_ID] ?? null;
  }
  return mockCandidateDetails[applicationId] ?? null;
}

export const mockEvaluateRunResult = {
  success: true,
  passed: true,
  percentage: 84,
  evaluationResultId: "eval-ai-001",
} as const;

export const mockDemoIds = {
  applicationIds: Object.keys(mockResults),
  jobIds: Object.keys(mockCandidatesByJobId),
};
