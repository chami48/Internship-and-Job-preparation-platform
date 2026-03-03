//smart-screening\prisma\seed.ts
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
  prompt: "What will `typeof []` return in JavaScript?",
  options: [
    { key: "A", text: "array" },
    { key: "B", text: "object" },
    { key: "C", text: "list" },
    { key: "D", text: "undefined" },
  ],
  correctKey: "B",
});

  await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "JavaScript",
  difficulty: Difficulty.EASY,
  prompt: "Which function converts an object into a JSON string?",
  options: [
    { key: "A", text: "JSON.parse()" },
    { key: "B", text: "JSON.stringify()" },
    { key: "C", text: "JSON.convert()" },
    { key: "D", text: "JSON.objectify()" },
  ],
  correctKey: "B",
});

  await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "JavaScript",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is a closure in JavaScript?",
  options: [
    { key: "A", text: "A function inside a loop" },
    { key: "B", text: "A function that remembers variables from outer scope" },
    { key: "C", text: "An async function" },
    { key: "D", text: "A global variable" },
  ],
  correctKey: "B",
});

  await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "JavaScript",
  difficulty: Difficulty.MEDIUM,
  prompt: "What does `Promise.all()` do?",
  options: [
    { key: "A", text: "Runs promises sequentially" },
    { key: "B", text: "Waits for all promises to resolve or one to reject" },
    { key: "C", text: "Cancels all promises" },
    { key: "D", text: "Returns first resolved promise only" },
  ],
  correctKey: "B",
});

  await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "TypeScript",
  difficulty: Difficulty.EASY,
  prompt: "What does TypeScript compile to?",
  options: [
    { key: "A", text: "Java" },
    { key: "B", text: "C++" },
    { key: "C", text: "JavaScript" },
    { key: "D", text: "Python" },
  ],
  correctKey: "C",
});

  await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "TypeScript",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is the purpose of generics in TypeScript?",
  options: [
    { key: "A", text: "Improve runtime speed" },
    { key: "B", text: "Enable reusable components with type safety" },
    { key: "C", text: "Replace interfaces" },
    { key: "D", text: "Remove type checking" },
  ],
  correctKey: "B",
});

  await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "JavaScript",
  difficulty: Difficulty.MEDIUM,
  prompt: "What will `0 == false` return?",
  options: [
    { key: "A", text: "true" },
    { key: "B", text: "false" },
    { key: "C", text: "undefined" },
    { key: "D", text: "error" },
  ],
  correctKey: "A",
});

  // Add more to reach 12 quickly
  await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "JavaScript",
  difficulty: Difficulty.HARD,
  prompt: "What is event bubbling?",
  options: [
    { key: "A", text: "Event moves from child to parent elements" },
    { key: "B", text: "Event stops at target element" },
    { key: "C", text: "Event moves from parent to child" },
    { key: "D", text: "Event reloads page" },
  ],
  correctKey: "A",
});

  await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "TypeScript",
  difficulty: Difficulty.MEDIUM,
  prompt: "What does `readonly` keyword do?",
  options: [
    { key: "A", text: "Allows reassignment" },
    { key: "B", text: "Prevents modification after initialization" },
    { key: "C", text: "Deletes property" },
    { key: "D", text: "Makes variable global" },
  ],
  correctKey: "B",
});

  await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Debugging",
  difficulty: Difficulty.MEDIUM,
  prompt: "A function works locally but fails in production. What steps would you take to debug?",
  rubric:
    "Expect checking environment variables, build differences, logs, API endpoints, version mismatches, error stack traces.",
});

  await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Algorithms",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is the worst-case time complexity of quicksort?",
  options: [
    { key: "A", text: "O(n)" },
    { key: "B", text: "O(log n)" },
    { key: "C", text: "O(n²)" },
    { key: "D", text: "O(n log n)" },
  ],
  correctKey: "C",
});

  await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Data Structures",
  difficulty: Difficulty.EASY,
  prompt: "Which data structure uses LIFO principle?",
  options: [
    { key: "A", text: "Queue" },
    { key: "B", text: "Stack" },
    { key: "C", text: "Tree" },
    { key: "D", text: "Graph" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Node.js",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is the purpose of `process.env`?",
  options: [
    { key: "A", text: "Access environment variables" },
    { key: "B", text: "Create database" },
    { key: "C", text: "Handle HTTP requests" },
    { key: "D", text: "Compile code" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "APIs",
  difficulty: Difficulty.MEDIUM,
  prompt: "Which HTTP status code means 'Created'?",
  options: [
    { key: "A", text: "200" },
    { key: "B", text: "201" },
    { key: "C", text: "400" },
    { key: "D", text: "500" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Databases",
  difficulty: Difficulty.MEDIUM,
  prompt: "What does normalization reduce?",
  options: [
    { key: "A", text: "Redundant data" },
    { key: "B", text: "Security" },
    { key: "C", text: "Network speed" },
    { key: "D", text: "RAM usage" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Security",
  difficulty: Difficulty.HARD,
  prompt: "Which attack involves injecting malicious JavaScript into web pages?",
  options: [
    { key: "A", text: "SQL Injection" },
    { key: "B", text: "XSS" },
    { key: "C", text: "CSRF" },
    { key: "D", text: "DDoS" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "System Design",
  difficulty: Difficulty.HARD,
  prompt: "How would you design a URL shortening service?",
  rubric:
    "Expect database schema, unique ID generation, hashing, scalability, caching, rate limiting.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "React",
  difficulty: Difficulty.EASY,
  prompt: "What hook is used for side effects?",
  options: [
    { key: "A", text: "useState" },
    { key: "B", text: "useEffect" },
    { key: "C", text: "useMemo" },
    { key: "D", text: "useContext" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "React",
  difficulty: Difficulty.MEDIUM,
  prompt: "What does dependency array in useEffect control?",
  options: [
    { key: "A", text: "Component styling" },
    { key: "B", text: "When effect re-runs" },
    { key: "C", text: "API security" },
    { key: "D", text: "JS compilation" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Performance",
  difficulty: Difficulty.MEDIUM,
  prompt: "A page loads slowly due to large images. What improvements would you suggest?",
  rubric:
    "Expect compression, lazy loading, CDN, optimized formats, caching.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Node.js",
  difficulty: Difficulty.EASY,
  prompt: "What is the purpose of package.json?",
  options: [
    { key: "A", text: "Store HTML files" },
    { key: "B", text: "Manage project dependencies and scripts" },
    { key: "C", text: "Compile TypeScript" },
    { key: "D", text: "Run database queries" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Node.js",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is non-blocking I/O?",
  options: [
    { key: "A", text: "Code that runs synchronously" },
    { key: "B", text: "Operations that don’t block execution thread" },
    { key: "C", text: "Stopping server execution" },
    { key: "D", text: "Blocking database access" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Backend",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you handle validation in an API endpoint?",
  rubric:
    "Expect request validation, schema validation (Zod/Joi), return proper status codes, avoid trusting client input.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "APIs",
  difficulty: Difficulty.MEDIUM,
  prompt: "Which HTTP method should be idempotent?",
  options: [
    { key: "A", text: "POST" },
    { key: "B", text: "PUT" },
    { key: "C", text: "PATCH" },
    { key: "D", text: "CONNECT" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Databases",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is a foreign key used for?",
  options: [
    { key: "A", text: "Improve UI" },
    { key: "B", text: "Link two tables together" },
    { key: "C", text: "Encrypt database" },
    { key: "D", text: "Delete records automatically" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "SQL",
  difficulty: Difficulty.MEDIUM,
  prompt: "Which clause groups rows with same values?",
  options: [
    { key: "A", text: "ORDER BY" },
    { key: "B", text: "GROUP BY" },
    { key: "C", text: "WHERE" },
    { key: "D", text: "LIMIT" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Database",
  difficulty: Difficulty.HARD,
  prompt: "How would you optimize a slow SQL query?",
  rubric:
    "Expect indexing, analyzing execution plan, avoiding SELECT *, proper joins, caching.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Git",
  difficulty: Difficulty.EASY,
  prompt: "Which command stages changes?",
  options: [
    { key: "A", text: "git push" },
    { key: "B", text: "git add" },
    { key: "C", text: "git merge" },
    { key: "D", text: "git pull" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Git",
  difficulty: Difficulty.MEDIUM,
  prompt: "What does 'git merge' do?",
  options: [
    { key: "A", text: "Deletes branch" },
    { key: "B", text: "Combines branches" },
    { key: "C", text: "Rewrites history" },
    { key: "D", text: "Stages files" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Version Control",
  difficulty: Difficulty.MEDIUM,
  prompt: "A merge conflict occurs. How do you resolve it?",
  rubric:
    "Expect reviewing conflicting sections, manually editing, testing changes, committing resolved version.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Security",
  difficulty: Difficulty.MEDIUM,
  prompt: "What does HTTPS provide?",
  options: [
    { key: "A", text: "Encryption of data in transit" },
    { key: "B", text: "Faster website" },
    { key: "C", text: "Better UI" },
    { key: "D", text: "Database backup" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Security",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is rate limiting used for?",
  options: [
    { key: "A", text: "Improve CSS" },
    { key: "B", text: "Prevent abuse and brute force attacks" },
    { key: "C", text: "Increase memory" },
    { key: "D", text: "Change UI" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Authentication",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you implement login authentication?",
  rubric:
    "Expect hashing passwords, verifying credentials, issuing JWT/session token, secure cookies.",
});


await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Data Structures",
  difficulty: Difficulty.MEDIUM,
  prompt: "Which data structure is best for fast lookups?",
  options: [
    { key: "A", text: "Array" },
    { key: "B", text: "Linked List" },
    { key: "C", text: "Hash Map" },
    { key: "D", text: "Stack" },
  ],
  correctKey: "C",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Algorithms",
  difficulty: Difficulty.EASY,
  prompt: "Binary search requires the array to be:",
  options: [
    { key: "A", text: "Sorted" },
    { key: "B", text: "Unsorted" },
    { key: "C", text: "Reversed" },
    { key: "D", text: "Duplicated" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Problem Solving",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you detect duplicate values in an array?",
  rubric:
    "Expect using Set, hash map, sorting and comparing neighbors.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "React",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is memoization used for?",
  options: [
    { key: "A", text: "Improve styling" },
    { key: "B", text: "Prevent unnecessary recalculations" },
    { key: "C", text: "Delete memory" },
    { key: "D", text: "Restart component" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "React",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is the purpose of key prop in lists?",
  options: [
    { key: "A", text: "Improve CSS" },
    { key: "B", text: "Help React identify elements efficiently" },
    { key: "C", text: "Encrypt components" },
    { key: "D", text: "Connect to database" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Frontend",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you improve accessibility in a form?",
  rubric:
    "Expect labels, aria attributes, keyboard navigation, proper contrast, validation messages.",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Deployment",
  difficulty: Difficulty.HARD,
  prompt: "What steps are involved in deploying a web application?",
  rubric:
    "Expect build process, environment config, server setup, CI/CD pipeline, monitoring.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Architecture",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is separation of concerns?",
  options: [
    { key: "A", text: "Combining all logic in one file" },
    { key: "B", text: "Dividing system into distinct responsibilities" },
    { key: "C", text: "Separating frontend from internet" },
    { key: "D", text: "Using multiple databases" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Architecture",
  difficulty: Difficulty.MEDIUM,
  prompt: "Why would you use MVC pattern?",
  rubric:
    "Expect separation of model, view, controller; maintainability; scalability; cleaner structure.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Caching",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is the main benefit of caching?",
  options: [
    { key: "A", text: "Increase database size" },
    { key: "B", text: "Reduce repeated expensive operations" },
    { key: "C", text: "Improve CSS layout" },
    { key: "D", text: "Encrypt data" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Scalability",
  difficulty: Difficulty.HARD,
  prompt: "Horizontal scaling means:",
  options: [
    { key: "A", text: "Upgrading server hardware" },
    { key: "B", text: "Adding more machines" },
    { key: "C", text: "Reducing database size" },
    { key: "D", text: "Optimizing CSS" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Performance",
  difficulty: Difficulty.HARD,
  prompt: "Your API is slow under heavy traffic. What strategies would you apply?",
  rubric:
    "Expect load balancing, caching, indexing, optimizing queries, rate limiting, horizontal scaling.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Testing",
  difficulty: Difficulty.EASY,
  prompt: "Unit testing focuses on:",
  options: [
    { key: "A", text: "Testing whole application at once" },
    { key: "B", text: "Testing individual functions/components" },
    { key: "C", text: "Manual browser testing" },
    { key: "D", text: "Deploying code" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Testing",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is mocking used for in tests?",
  options: [
    { key: "A", text: "Improving UI" },
    { key: "B", text: "Simulating dependencies" },
    { key: "C", text: "Deleting functions" },
    { key: "D", text: "Speeding up database" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Testing",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you test an API endpoint?",
  rubric:
    "Expect unit tests, integration tests, status code validation, edge cases, mocking DB.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Concurrency",
  difficulty: Difficulty.HARD,
  prompt: "Race conditions occur when:",
  options: [
    { key: "A", text: "Two processes access shared data simultaneously" },
    { key: "B", text: "Database crashes" },
    { key: "C", text: "UI loads slowly" },
    { key: "D", text: "Git conflicts happen" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Memory",
  difficulty: Difficulty.MEDIUM,
  prompt: "A memory leak happens when:",
  options: [
    { key: "A", text: "Memory is not released after use" },
    { key: "B", text: "RAM is upgraded" },
    { key: "C", text: "Server restarts" },
    { key: "D", text: "API is called twice" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Debugging",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you identify a memory leak in Node.js?",
  rubric:
    "Expect heap snapshots, monitoring memory usage, profiling tools.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "REST",
  difficulty: Difficulty.MEDIUM,
  prompt: "REST APIs are stateless because:",
  options: [
    { key: "A", text: "Server stores session in memory" },
    { key: "B", text: "Each request contains necessary information" },
    { key: "C", text: "They don’t use HTTP" },
    { key: "D", text: "They are slower" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "GraphQL",
  difficulty: Difficulty.MEDIUM,
  prompt: "GraphQL allows clients to:",
  options: [
    { key: "A", text: "Request only required data" },
    { key: "B", text: "Only POST requests" },
    { key: "C", text: "Ignore server schema" },
    { key: "D", text: "Delete database" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "API Design",
  difficulty: Difficulty.HARD,
  prompt: "Design an API for uploading user profile pictures.",
  rubric:
    "Expect POST endpoint, validation, file size limits, authentication, storage strategy.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Docker",
  difficulty: Difficulty.MEDIUM,
  prompt: "Docker is primarily used for:",
  options: [
    { key: "A", text: "UI styling" },
    { key: "B", text: "Containerizing applications" },
    { key: "C", text: "Database indexing" },
    { key: "D", text: "Writing tests" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "CI/CD",
  difficulty: Difficulty.MEDIUM,
  prompt: "CI/CD pipelines automate:",
  options: [
    { key: "A", text: "Deployment and testing" },
    { key: "B", text: "UI design" },
    { key: "C", text: "Manual reviews" },
    { key: "D", text: "Database normalization" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "CI/CD",
  difficulty: Difficulty.MEDIUM,
  prompt: "Why are automated tests important in CI pipelines?",
  rubric:
    "Expect early bug detection, reliability, faster development cycles.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Security",
  difficulty: Difficulty.HARD,
  prompt: "What is the principle of least privilege?",
  options: [
    { key: "A", text: "Give all permissions to users" },
    { key: "B", text: "Grant minimum required access" },
    { key: "C", text: "Remove authentication" },
    { key: "D", text: "Encrypt CSS" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Load Balancing",
  difficulty: Difficulty.HARD,
  prompt: "A load balancer distributes traffic to:",
  options: [
    { key: "A", text: "One server only" },
    { key: "B", text: "Multiple backend servers" },
    { key: "C", text: "Database tables" },
    { key: "D", text: "Frontend components" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Scalability",
  difficulty: Difficulty.HARD,
  prompt: "How would you scale a chat application?",
  rubric:
    "Expect WebSockets, horizontal scaling, message queues, database optimization.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Data Structures",
  difficulty: Difficulty.MEDIUM,
  prompt: "Which structure is best for hierarchical data?",
  options: [
    { key: "A", text: "Stack" },
    { key: "B", text: "Queue" },
    { key: "C", text: "Tree" },
    { key: "D", text: "Array" },
  ],
  correctKey: "C",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Algorithms",
  difficulty: Difficulty.MEDIUM,
  prompt: "Breadth-first search uses:",
  options: [
    { key: "A", text: "Stack" },
    { key: "B", text: "Queue" },
    { key: "C", text: "Hash Map" },
    { key: "D", text: "Heap" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Algorithms",
  difficulty: Difficulty.MEDIUM,
  prompt: "Explain how depth-first search works.",
  rubric:
    "Expect recursion or stack usage, exploring deep before siblings.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Big-O",
  difficulty: Difficulty.MEDIUM,
  prompt: "Which is fastest for large n?",
  options: [
    { key: "A", text: "O(n²)" },
    { key: "B", text: "O(n log n)" },
    { key: "C", text: "O(n³)" },
    { key: "D", text: "O(2ⁿ)" },
  ],
  correctKey: "B",
});
await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Design Principles",
  difficulty: Difficulty.MEDIUM,
  prompt: "What does DRY stand for?",
  options: [
    { key: "A", text: "Do Run Yourself" },
    { key: "B", text: "Don't Repeat Yourself" },
    { key: "C", text: "Data Runtime Yield" },
    { key: "D", text: "Dynamic Resource Yield" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Code Quality",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you refactor a very large function?",
  rubric:
    "Expect breaking into smaller functions, improving naming, removing duplication, adding tests.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "OOP",
  difficulty: Difficulty.EASY,
  prompt: "Encapsulation means:",
  options: [
    { key: "A", text: "Hiding internal details" },
    { key: "B", text: "Exposing everything" },
    { key: "C", text: "Deleting classes" },
    { key: "D", text: "Making variables global" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "OOP",
  difficulty: Difficulty.MEDIUM,
  prompt: "Inheritance allows:",
  options: [
    { key: "A", text: "Code reuse between classes" },
    { key: "B", text: "Database indexing" },
    { key: "C", text: "Memory allocation" },
    { key: "D", text: "Removing functions" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "System Design",
  difficulty: Difficulty.HARD,
  prompt: "Design a basic notification system.",
  rubric:
    "Expect database schema, event triggers, queue system, delivery mechanism.",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Production Issues",
  difficulty: Difficulty.HARD,
  prompt: "Production server crashes unexpectedly. What is your action plan?",
  rubric:
    "Expect logs analysis, monitoring tools, rollback strategy, communication, root cause analysis.",
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