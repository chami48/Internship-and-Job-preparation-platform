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
  // Frontend Job
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
  // Backend Job
  "app-ai-101": {
    applicationId: "app-ai-101",
    studentName: "Kasun Silva",
    examTitle: "AI Evaluation - Backend Engineer",
    date: "26 Mar 2026",
    status: "PASS",
    totalScore: 91,
    maxScore: 100,
    percentage: 91,
    cutoff: 75,
    aiFeedback:
      "Excellent backend design and strong database skills. Demonstrates advanced API security knowledge.",
    cvUploadUnlocked: true,
  },
  "app-ai-102": {
    applicationId: "app-ai-102",
    studentName: "Sewwandi Jayasuriya",
    examTitle: "AI Evaluation - Backend Engineer",
    date: "26 Mar 2026",
    status: "FAIL",
    totalScore: 62,
    maxScore: 100,
    percentage: 62,
    cutoff: 75,
    aiFeedback:
      "Good understanding of REST, but needs to improve error handling and async patterns.",
    cvUploadUnlocked: false,
  },
  // Data Analyst Job
  "app-ai-201": {
    applicationId: "app-ai-201",
    studentName: "Tharindu Abeysekara",
    examTitle: "AI Evaluation - Data Analyst",
    date: "27 Mar 2026",
    status: "PASS",
    totalScore: 88,
    maxScore: 100,
    percentage: 88,
    cutoff: 80,
    aiFeedback:
      "Strong data wrangling and visualization skills. Excellent use of pandas and matplotlib.",
    cvUploadUnlocked: true,
  },
  "app-ai-202": {
    applicationId: "app-ai-202",
    studentName: "Ishara Madushani",
    examTitle: "AI Evaluation - Data Analyst",
    date: "27 Mar 2026",
    status: "FAIL",
    totalScore: 59,
    maxScore: 100,
    percentage: 59,
    cutoff: 80,
    aiFeedback:
      "Basic analysis is correct, but needs to improve on data cleaning and reporting.",
    cvUploadUnlocked: false,
  },
};

export const mockEvaluationDetails: Record<string, MockQuestionEvaluation[]> = {
  // Frontend
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
  ],
  // Backend
  "app-ai-101": [
    {
      id: "qeval-101-1",
      questionNumber: 1,
      questionText: "Explain the difference between SQL and NoSQL databases.",
      studentAnswer: "SQL is relational, NoSQL is non-relational.",
      expectedAnswer: "SQL uses structured tables and schemas, NoSQL is schema-less and document or key-value based.",
      score: 18,
      maxMarks: 20,
      aiFeedback: "Good summary, could mention scalability and transaction differences."
    },
    {
      id: "qeval-101-2",
      questionNumber: 2,
      questionText: "How do you secure a REST API?",
      studentAnswer: "Use JWT and HTTPS.",
      expectedAnswer: "Authentication, authorization, HTTPS, input validation, rate limiting, and logging.",
      score: 19,
      maxMarks: 20,
      aiFeedback: "Strong answer, but could mention rate limiting and logging."
    }
  ],
  "app-ai-102": [
    {
      id: "qeval-102-1",
      questionNumber: 1,
      questionText: "What is an ORM?",
      studentAnswer: "Object Relational Mapper.",
      expectedAnswer: "ORM maps database tables to objects in code, simplifying CRUD operations.",
      score: 12,
      maxMarks: 20,
      aiFeedback: "Correct, but needs more detail and examples."
    }
  ],
  // Data Analyst
  "app-ai-201": [
    {
      id: "qeval-201-1",
      questionNumber: 1,
      questionText: "How do you handle missing data in pandas?",
      studentAnswer: "Use dropna or fillna.",
      expectedAnswer: "dropna, fillna, interpolation, or custom imputation methods.",
      score: 17,
      maxMarks: 20,
      aiFeedback: "Good, but could mention interpolation."
    }
  ],
  "app-ai-202": [
    {
      id: "qeval-202-1",
      questionNumber: 1,
      questionText: "What is data normalization?",
      studentAnswer: "Scaling data to a range.",
      expectedAnswer: "Rescaling features to a standard range, often 0-1 or -1 to 1.",
      score: 10,
      maxMarks: 20,
      aiFeedback: "Needs more detail and context."
    }
  ],
};

export const mockPermissionByApplicationId: Record<string, MockPermissionStatus> = {
  // Frontend
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
  // "app-ai-002" intentionally omitted (no permission status for failed frontend candidate)
  // Backend
  "app-ai-101": {
    passed: true,
    message: "You passed the backend cutoff. CV upload is unlocked for this application.",
    nextSteps: [
      "Upload your backend-focused CV.",
      "Prepare for API design interviews.",
      "Review advanced database topics."
    ],
    percentage: 91,
    cutoff: 75,
    status: "COMPLETED"
  },
  "app-ai-102": {
    passed: false,
    message: "You are below the backend cutoff. CV upload remains locked.",
    nextSteps: [
      "Review API security best practices.",
      "Practice with async/await patterns."
    ],
    percentage: 62,
    cutoff: 75,
    status: "COMPLETED"
  },
  // Data Analyst
  "app-ai-201": {
    passed: true,
    message: "You passed the data analyst cutoff. CV upload is unlocked.",
    nextSteps: [
      "Showcase your data projects.",
      "Prepare for SQL and visualization interviews."
    ],
    percentage: 88,
    cutoff: 80,
    status: "COMPLETED"
  },
  "app-ai-202": {
    passed: false,
    message: "You are below the data analyst cutoff. CV upload remains locked.",
    nextSteps: [
      "Practice data cleaning and reporting.",
      "Review pandas documentation."
    ],
    percentage: 59,
    cutoff: 80,
    status: "COMPLETED"
  },
  // Removed duplicate/invalid entry after last data analyst
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
  "job-ai-backend-001": [
    {
      id: "app-ai-101",
      name: "Kasun Silva",
      email: "kasun.silva@email.com",
      appliedRole: "Backend Engineer",
      score: 91,
      maxScore: 100,
      percentage: 91,
      status: "PASS",
      evaluatedAt: "26 Mar 2026",
    },
    {
      id: "app-ai-102",
      name: "Sewwandi Jayasuriya",
      email: "sewwandi.j@email.com",
      appliedRole: "Backend Engineer",
      score: 62,
      maxScore: 100,
      percentage: 62,
      status: "FAIL",
      evaluatedAt: "26 Mar 2026",
    }
  ],
  "job-ai-data-001": [
    {
      id: "app-ai-201",
      name: "Tharindu Abeysekara",
      email: "tharindu.abey@email.com",
      appliedRole: "Data Analyst",
      score: 88,
      maxScore: 100,
      percentage: 88,
      status: "PASS",
      evaluatedAt: "27 Mar 2026",
    },
    {
      id: "app-ai-202",
      name: "Ishara Madushani",
      email: "ishara.m@email.com",
      appliedRole: "Data Analyst",
      score: 59,
      maxScore: 100,
      percentage: 59,
      status: "FAIL",
      evaluatedAt: "27 Mar 2026",
    }
  ],
};

export const mockCandidateDetails: Record<string, MockCandidateDetail> = {
  // Frontend
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
  // "app-ai-002" intentionally omitted (no details for failed frontend candidate)
  // Backend
  "app-ai-101": {
    id: "app-ai-101",
    name: "Kasun Silva",
    email: "kasun.silva@email.com",
    phone: "+94 77 555 1234",
    university: "University of Peradeniya",
    degree: "BSc in Computer Engineering",
    specialization: "BACKEND_ENGINEERING",
    cgpa: "3.85",
    programmingLanguages: "Java, Python, SQL",
    frameworks: "Spring Boot, Express",
    linkedin: "linkedin.com/in/kasun-silva",
    github: "github.com/kasunsilva",
    portfolio: "kasunsilva.dev",
    appliedRole: "Backend Engineer",
    totalScore: 91,
    maxScore: 100,
    percentage: 91,
    cutoff: 75,
    status: "PASS",
    evaluationDate: "26 Mar 2026",
    aiFeedback: "Excellent backend design and strong database skills.",
    cvUploadGranted: true,
    answers: mockEvaluationDetails["app-ai-101"] ?? [],
  },
  "app-ai-102": {
    id: "app-ai-102",
    name: "Sewwandi Jayasuriya",
    email: "sewwandi.j@email.com",
    phone: "+94 71 888 4321",
    university: "University of Kelaniya",
    degree: "BSc in Computer Science",
    specialization: "BACKEND_ENGINEERING",
    cgpa: "3.22",
    programmingLanguages: "Python, Node.js",
    frameworks: "Express, FastAPI",
    linkedin: "linkedin.com/in/sewwandi-j",
    github: "github.com/sewwandij",
    portfolio: "sewwandij.com",
    appliedRole: "Backend Engineer",
    totalScore: 62,
    maxScore: 100,
    percentage: 62,
    cutoff: 75,
    status: "FAIL",
    evaluationDate: "26 Mar 2026",
    aiFeedback: "Needs to improve error handling and async patterns.",
    cvUploadGranted: false,
    answers: mockEvaluationDetails["app-ai-102"] ?? [],
  },
  // Data Analyst
  "app-ai-201": {
    id: "app-ai-201",
    name: "Tharindu Abeysekara",
    email: "tharindu.abey@email.com",
    phone: "+94 77 222 1111",
    university: "University of Sri Jayewardenepura",
    degree: "BSc in Data Science",
    specialization: "DATA_ANALYTICS",
    cgpa: "3.92",
    programmingLanguages: "Python, R, SQL",
    frameworks: "pandas, matplotlib, seaborn",
    linkedin: "linkedin.com/in/tharindu-abey",
    github: "github.com/tharinduabey",
    portfolio: "tharinduabey.com",
    appliedRole: "Data Analyst",
    totalScore: 88,
    maxScore: 100,
    percentage: 88,
    cutoff: 80,
    status: "PASS",
    evaluationDate: "27 Mar 2026",
    aiFeedback: "Strong data wrangling and visualization skills.",
    cvUploadGranted: true,
    answers: mockEvaluationDetails["app-ai-201"] ?? [],
  },
  "app-ai-202": {
    id: "app-ai-202",
    name: "Ishara Madushani",
    email: "ishara.m@email.com",
    phone: "+94 71 333 2222",
    university: "University of Ruhuna",
    degree: "BSc in Statistics",
    specialization: "DATA_ANALYTICS",
    cgpa: "3.18",
    programmingLanguages: "R, Python",
    frameworks: "ggplot2, pandas",
    linkedin: "linkedin.com/in/ishara-madushani",
    github: "github.com/isharam",
    portfolio: "isharam.com",
    appliedRole: "Data Analyst",
    totalScore: 59,
    maxScore: 100,
    percentage: 59,
    cutoff: 80,
    status: "FAIL",
    evaluationDate: "27 Mar 2026",
    aiFeedback: "Needs to improve on data cleaning and reporting.",
    cvUploadGranted: false,
    answers: mockEvaluationDetails["app-ai-202"] ?? [],
  }
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
