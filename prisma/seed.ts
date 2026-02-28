import { PrismaClient, Difficulty, JobRole, QuestionType } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Clear old (safe for dev)
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();

  // Helper to create MCQ
  const mcq = async (data: {
    role: JobRole;
    topic: string;
    difficulty: Difficulty;
    prompt: string;
    options: { key: string; text: string }[];
    correctKey: string;
    explanation?: string;
  }) => {
    return prisma.question.create({
      data: {
        role: data.role,
        topic: data.topic,
        difficulty: data.difficulty,
        type: QuestionType.MCQ,
        prompt: data.prompt,
        correctKey: data.correctKey,
        explanation: data.explanation,
        options: { create: data.options },
      },
    });
  };

  // Helper to create SCENARIO
  const scenario = async (data: {
    role: JobRole;
    topic: string;
    difficulty: Difficulty;
    prompt: string;
    rubric: string;
  }) => {
    return prisma.question.create({
      data: {
        role: data.role,
        topic: data.topic,
        difficulty: data.difficulty,
        type: QuestionType.SCENARIO,
        prompt: data.prompt,
        rubric: data.rubric,
      },
    });
  };

  // -------------------- SOFTWARE ENGINEER (12) --------------------
  await mcq({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "JavaScript",
    difficulty: Difficulty.EASY,
    prompt: "What does `===` mean in JavaScript?",
    options: [
      { key: "A", text: "Assignment" },
      { key: "B", text: "Strict equality (type + value)" },
      { key: "C", text: "Loose equality" },
      { key: "D", text: "Not equal" },
    ],
    correctKey: "B",
  });

  await mcq({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "Git",
    difficulty: Difficulty.EASY,
    prompt: "Which command creates a new branch and switches to it?",
    options: [
      { key: "A", text: "git branch new" },
      { key: "B", text: "git checkout -b new" },
      { key: "C", text: "git switch new --create" },
      { key: "D", text: "Both B and C" },
    ],
    correctKey: "D",
  });

  await mcq({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "Databases",
    difficulty: Difficulty.MEDIUM,
    prompt: "What is a primary key used for?",
    options: [
      { key: "A", text: "Store large files" },
      { key: "B", text: "Uniquely identify each row" },
      { key: "C", text: "Increase UI speed" },
      { key: "D", text: "Encrypt records" },
    ],
    correctKey: "B",
  });

  await mcq({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "Web",
    difficulty: Difficulty.MEDIUM,
    prompt: "Which HTTP method is typically used to update an existing resource?",
    options: [
      { key: "A", text: "GET" },
      { key: "B", text: "POST" },
      { key: "C", text: "PUT/PATCH" },
      { key: "D", text: "HEAD" },
    ],
    correctKey: "C",
  });

  await mcq({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "Security",
    difficulty: Difficulty.HARD,
    prompt: "Which is the best protection against SQL Injection?",
    options: [
      { key: "A", text: "String concatenation" },
      { key: "B", text: "Prepared statements / parameterized queries" },
      { key: "C", text: "More indexes" },
      { key: "D", text: "Using GET instead of POST" },
    ],
    correctKey: "B",
  });

  await scenario({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "System Design",
    difficulty: Difficulty.MEDIUM,
    prompt:
      "A user reports slow loading on the jobs page. List 3 steps you’d take to identify the bottleneck.",
    rubric:
      "Expect: check network waterfall/API latency, database query time, server logs, frontend profiling, caching/pagination improvements.",
  });

  await scenario({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "Debugging",
    difficulty: Difficulty.EASY,
    prompt:
      "Your build passes locally but fails on CI. What are 3 common causes and how do you check them?",
    rubric:
      "Expect: node/pnpm versions mismatch, missing env vars, lint/type errors, case-sensitive paths, OS differences; check CI logs and lockfile.",
  });

  // Add more to reach 12 quickly
  await mcq({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "TypeScript",
    difficulty: Difficulty.EASY,
    prompt: "TypeScript is mainly used to:",
    options: [
      { key: "A", text: "Add static typing to JavaScript" },
      { key: "B", text: "Replace HTML" },
      { key: "C", text: "Create databases" },
      { key: "D", text: "Run faster than JS automatically" },
    ],
    correctKey: "A",
  });

  await mcq({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "APIs",
    difficulty: Difficulty.MEDIUM,
    prompt: "What does REST mainly emphasize?",
    options: [
      { key: "A", text: "Resources and standard HTTP operations" },
      { key: "B", text: "Only GraphQL" },
      { key: "C", text: "Only WebSockets" },
      { key: "D", text: "Only SOAP" },
    ],
    correctKey: "A",
  });

  await mcq({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "Algorithms",
    difficulty: Difficulty.HARD,
    prompt: "Time complexity of binary search on a sorted array is:",
    options: [
      { key: "A", text: "O(n)" },
      { key: "B", text: "O(log n)" },
      { key: "C", text: "O(n log n)" },
      { key: "D", text: "O(1)" },
    ],
    correctKey: "B",
  });

  await scenario({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "Code Quality",
    difficulty: Difficulty.MEDIUM,
    prompt:
      "How would you reduce duplicated code in multiple pages that display job cards?",
    rubric:
      "Expect: extract reusable component, use shared props/types, move data fetching to a service, use composition and consistent styles.",
  });

  await mcq({
    role: JobRole.SOFTWARE_ENGINEER,
    topic: "Auth",
    difficulty: Difficulty.MEDIUM,
    prompt: "What is the purpose of an auth session/token?",
    options: [
      { key: "A", text: "Store images" },
      { key: "B", text: "Identify user between requests" },
      { key: "C", text: "Improve CSS" },
      { key: "D", text: "Create database tables" },
    ],
    correctKey: "B",
  });

  // -------------------- UX ENGINEER (12) --------------------
  await mcq({
    role: JobRole.UX_ENGINEER,
    topic: "UX Basics",
    difficulty: Difficulty.EASY,
    prompt: "What does 'UX' stand for?",
    options: [
      { key: "A", text: "User Experience" },
      { key: "B", text: "Universal Extension" },
      { key: "C", text: "User Export" },
      { key: "D", text: "UI Execution" },
    ],
    correctKey: "A",
  });

  await scenario({
    role: JobRole.UX_ENGINEER,
    topic: "User Research",
    difficulty: Difficulty.MEDIUM,
    prompt:
      "You notice students abandon the exam before starting. What research steps would you take?",
    rubric:
      "Expect: funnel analysis, interviews/surveys, usability testing, identify friction (rules page, fear, time), propose UI improvements.",
  });

  await mcq({
    role: JobRole.UX_ENGINEER,
    topic: "Design",
    difficulty: Difficulty.EASY,
    prompt: "A wireframe is mainly used to:",
    options: [
      { key: "A", text: "Decide database schema" },
      { key: "B", text: "Sketch layout and structure quickly" },
      { key: "C", text: "Run backend services" },
      { key: "D", text: "Encrypt passwords" },
    ],
    correctKey: "B",
  });

  // Add more quickly (keep short)
  await mcq({
    role: JobRole.UX_ENGINEER,
    topic: "Usability",
    difficulty: Difficulty.MEDIUM,
    prompt: "Which is a usability metric?",
    options: [
      { key: "A", text: "Task completion rate" },
      { key: "B", text: "CPU temperature" },
      { key: "C", text: "RAM speed" },
      { key: "D", text: "Git commit count" },
    ],
    correctKey: "A",
  });

  await scenario({
    role: JobRole.UX_ENGINEER,
    topic: "Accessibility",
    difficulty: Difficulty.HARD,
    prompt:
      "List key accessibility improvements for a job listing page (3–5 points).",
    rubric:
      "Expect: contrast, keyboard nav, ARIA labels, focus states, semantic HTML, alt text, readable font sizes, error messaging.",
  });

  // (fill to 12 with a few more)
  await mcq({
    role: JobRole.UX_ENGINEER,
    topic: "UI",
    difficulty: Difficulty.EASY,
    prompt: "What is a primary benefit of consistent spacing and typography?",
    options: [
      { key: "A", text: "Better readability and scannability" },
      { key: "B", text: "Faster internet" },
      { key: "C", text: "More database storage" },
      { key: "D", text: "Better encryption" },
    ],
    correctKey: "A",
  });

  await mcq({
    role: JobRole.UX_ENGINEER,
    topic: "Figma",
    difficulty: Difficulty.MEDIUM,
    prompt: "A design system in Figma typically includes:",
    options: [
      { key: "A", text: "Components, styles, and guidelines" },
      { key: "B", text: "Only images" },
      { key: "C", text: "Only code" },
      { key: "D", text: "Only database tables" },
    ],
    correctKey: "A",
  });

  await scenario({
    role: JobRole.UX_ENGINEER,
    topic: "Interaction Design",
    difficulty: Difficulty.MEDIUM,
    prompt:
      "A student accidentally closes the exam page. Suggest a safer UX flow.",
    rubric:
      "Expect: confirm before leaving, autosave answers, warnings, resume option (with integrity rules), clear states.",
  });

  // quick fillers
  await mcq({
    role: JobRole.UX_ENGINEER,
    topic: "Heuristics",
    difficulty: Difficulty.MEDIUM,
    prompt: "‘Visibility of system status’ means:",
    options: [
      { key: "A", text: "Hide loading indicators" },
      { key: "B", text: "Keep users informed with feedback" },
      { key: "C", text: "Disable buttons always" },
      { key: "D", text: "Use only icons" },
    ],
    correctKey: "B",
  });

  await mcq({
    role: JobRole.UX_ENGINEER,
    topic: "Research",
    difficulty: Difficulty.EASY,
    prompt: "A/B testing compares:",
    options: [
      { key: "A", text: "Two design variants to see which performs better" },
      { key: "B", text: "Two databases" },
      { key: "C", text: "Two laptops" },
      { key: "D", text: "Two internet providers" },
    ],
    correctKey: "A",
  });

  await mcq({
    role: JobRole.UX_ENGINEER,
    topic: "UX Writing",
    difficulty: Difficulty.EASY,
    prompt: "Good microcopy should be:",
    options: [
      { key: "A", text: "Clear and helpful" },
      { key: "B", text: "Long and complex" },
      { key: "C", text: "Only technical" },
      { key: "D", text: "Random" },
    ],
    correctKey: "A",
  });

  await scenario({
    role: JobRole.UX_ENGINEER,
    topic: "Usability Testing",
    difficulty: Difficulty.MEDIUM,
    prompt: "Write 3 usability test tasks for the job apply flow.",
    rubric:
      "Expect: find a job, open details, start application, fill profile, accept rules, start exam; tasks are measurable and clear.",
  });

  // -------------------- PROJECT MANAGER (12) --------------------
  await mcq({
    role: JobRole.PROJECT_MANAGER,
    topic: "Agile",
    difficulty: Difficulty.EASY,
    prompt: "A sprint is:",
    options: [
      { key: "A", text: "A fixed time-boxed iteration" },
      { key: "B", text: "A database index" },
      { key: "C", text: "A UI color theme" },
      { key: "D", text: "A server crash" },
    ],
    correctKey: "A",
  });

  await scenario({
    role: JobRole.PROJECT_MANAGER,
    topic: "Risk",
    difficulty: Difficulty.MEDIUM,
    prompt:
      "Your module depends on another team’s DB model (job posting). What is your plan to avoid delays?",
    rubric:
      "Expect: mock data, clear interface/contract, integration points, timeline buffer, frequent sync, fallback plan.",
  });

  await mcq({
    role: JobRole.PROJECT_MANAGER,
    topic: "Planning",
    difficulty: Difficulty.MEDIUM,
    prompt: "The purpose of a Gantt chart is to:",
    options: [
      { key: "A", text: "Show project schedule and dependencies" },
      { key: "B", text: "Store passwords" },
      { key: "C", text: "Design UI" },
      { key: "D", text: "Write code automatically" },
    ],
    correctKey: "A",
  });

  await scenario({
    role: JobRole.PROJECT_MANAGER,
    topic: "Communication",
    difficulty: Difficulty.EASY,
    prompt:
      "A teammate is not pushing code regularly. How do you handle it?",
    rubric:
      "Expect: 1:1 chat, understand blockers, set small tasks, define deadlines, pair programming, daily check-ins.",
  });

  // fillers to reach 12
  await mcq({
    role: JobRole.PROJECT_MANAGER,
    topic: "Scrum",
    difficulty: Difficulty.EASY,
    prompt: "Daily standup is mainly for:",
    options: [
      { key: "A", text: "Status sync and blockers" },
      { key: "B", text: "Writing full documentation" },
      { key: "C", text: "Database migrations" },
      { key: "D", text: "UI design only" },
    ],
    correctKey: "A",
  });

  await mcq({
    role: JobRole.PROJECT_MANAGER,
    topic: "Scope",
    difficulty: Difficulty.MEDIUM,
    prompt: "Scope creep means:",
    options: [
      { key: "A", text: "Unexpected expansion of requirements" },
      { key: "B", text: "Faster coding" },
      { key: "C", text: "More testing" },
      { key: "D", text: "Better UI" },
    ],
    correctKey: "A",
  });

  await scenario({
    role: JobRole.PROJECT_MANAGER,
    topic: "Stakeholders",
    difficulty: Difficulty.HARD,
    prompt:
      "Company wants strict exam rules, students complain it’s too strict. How do you balance?",
    rubric:
      "Expect: define policy, evidence-based decision, adjustable thresholds, transparency, user feedback, align with project goals.",
  });

  await mcq({
    role: JobRole.PROJECT_MANAGER,
    topic: "Metrics",
    difficulty: Difficulty.MEDIUM,
    prompt: "Which is a good KPI for your screening module?",
    options: [
      { key: "A", text: "Number of qualified applicants after exam" },
      { key: "B", text: "Laptop fan speed" },
      { key: "C", text: "Wallpaper color" },
      { key: "D", text: "Monitor size" },
    ],
    correctKey: "A",
  });

  await mcq({
    role: JobRole.PROJECT_MANAGER,
    topic: "Quality",
    difficulty: Difficulty.EASY,
    prompt: "Definition of Done usually includes:",
    options: [
      { key: "A", text: "Coded, tested, reviewed, and meets acceptance criteria" },
      { key: "B", text: "Only coded" },
      { key: "C", text: "Only documented" },
      { key: "D", text: "Only deployed" },
    ],
    correctKey: "A",
  });

  await scenario({
    role: JobRole.PROJECT_MANAGER,
    topic: "Timeline",
    difficulty: Difficulty.MEDIUM,
    prompt:
      "You have 1 week left. List the most important deliverables to secure marks.",
    rubric:
      "Expect: working end-to-end flow demo, CRUD/DB, secure mode rules, evaluation output, documentation, screenshots, small tests.",
  });

  await mcq({
    role: JobRole.PROJECT_MANAGER,
    topic: "Tools",
    difficulty: Difficulty.EASY,
    prompt: "Which tool is commonly used for issue tracking?",
    options: [
      { key: "A", text: "Jira/Trello" },
      { key: "B", text: "MS Paint" },
      { key: "C", text: "Calculator" },
      { key: "D", text: "Notepad only" },
    ],
    correctKey: "A",
  });

  await mcq({
    role: JobRole.PROJECT_MANAGER,
    topic: "Risk",
    difficulty: Difficulty.MEDIUM,
    prompt: "Risk response 'Mitigation' means:",
    options: [
      { key: "A", text: "Reduce probability or impact" },
      { key: "B", text: "Ignore it" },
      { key: "C", text: "Only report after failure" },
      { key: "D", text: "Increase uncertainty" },
    ],
    correctKey: "A",
  });

  console.log("✅ Seeded question bank successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });