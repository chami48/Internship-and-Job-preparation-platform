//smart-screening\prisma\seed.ts
import { PrismaClient, Difficulty, JobRole, QuestionType } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Clear old (safe for dev)
  //await prisma.option.deleteMany();
  //await prisma.question.deleteMany();

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

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "HTTP",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is the difference between PUT and PATCH?",
  options: [
    { key: "A", text: "PUT replaces entire resource, PATCH updates partially" },
    { key: "B", text: "PATCH replaces entire resource" },
    { key: "C", text: "PUT deletes resource" },
    { key: "D", text: "No difference" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "API Security",
  difficulty: Difficulty.HARD,
  prompt: "How would you prevent brute force login attacks?",
  rubric:
    "Expect rate limiting, account lockout, CAPTCHA, monitoring failed attempts.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Databases",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is ACID in databases?",
  options: [
    { key: "A", text: "Atomicity, Consistency, Isolation, Durability" },
    { key: "B", text: "Access, Control, Index, Data" },
    { key: "C", text: "Async, Cache, Index, Deploy" },
    { key: "D", text: "None of the above" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Transactions",
  difficulty: Difficulty.MEDIUM,
  prompt: "Why are transactions important in financial systems?",
  rubric:
    "Expect atomic operations, rollback on failure, data consistency.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Frontend Performance",
  difficulty: Difficulty.MEDIUM,
  prompt: "Lazy loading improves performance by:",
  options: [
    { key: "A", text: "Loading all assets immediately" },
    { key: "B", text: "Loading resources only when needed" },
    { key: "C", text: "Deleting unused files" },
    { key: "D", text: "Restarting browser" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Frontend Optimization",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you reduce bundle size in a React app?",
  rubric:
    "Expect code splitting, tree shaking, removing unused libraries, dynamic imports.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Concurrency",
  difficulty: Difficulty.HARD,
  prompt: "What is a deadlock?",
  options: [
    { key: "A", text: "Two processes waiting on each other indefinitely" },
    { key: "B", text: "Memory overflow" },
    { key: "C", text: "API timeout" },
    { key: "D", text: "Infinite loop" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "System Design",
  difficulty: Difficulty.HARD,
  prompt: "How would you design a file upload system that handles large files?",
  rubric:
    "Expect chunk uploads, validation, storage service, CDN, retry mechanism.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Authentication",
  difficulty: Difficulty.MEDIUM,
  prompt: "JWT tokens are typically stored in:",
  options: [
    { key: "A", text: "Local storage or cookies" },
    { key: "B", text: "CSS files" },
    { key: "C", text: "HTML tags" },
    { key: "D", text: "Database indexes" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Security",
  difficulty: Difficulty.HARD,
  prompt: "How would you secure an API against SQL injection?",
  rubric:
    "Expect parameterized queries, ORM usage, input validation.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Monitoring",
  difficulty: Difficulty.MEDIUM,
  prompt: "Why is logging important in production?",
  options: [
    { key: "A", text: "Improve UI" },
    { key: "B", text: "Track errors and monitor system behavior" },
    { key: "C", text: "Increase RAM" },
    { key: "D", text: "Change CSS" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Monitoring",
  difficulty: Difficulty.MEDIUM,
  prompt: "What metrics would you monitor in a backend server?",
  rubric:
    "Expect CPU usage, memory usage, response time, error rate.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Deployment",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is blue-green deployment?",
  options: [
    { key: "A", text: "Deploying UI twice" },
    { key: "B", text: "Two identical environments for zero downtime release" },
    { key: "C", text: "Deleting old servers" },
    { key: "D", text: "Manual deployment" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Deployment",
  difficulty: Difficulty.HARD,
  prompt: "How would you roll back a failed deployment?",
  rubric:
    "Expect version control tags, CI/CD rollback, database migration strategy.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Data Structures",
  difficulty: Difficulty.MEDIUM,
  prompt: "A heap is commonly used for:",
  options: [
    { key: "A", text: "Priority queues" },
    { key: "B", text: "Stacks" },
    { key: "C", text: "Graphs" },
    { key: "D", text: "Linked lists" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Algorithm Design",
  difficulty: Difficulty.HARD,
  prompt: "How would you detect a cycle in a linked list?",
  rubric:
    "Expect Floyd’s cycle detection algorithm (slow & fast pointers).",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Clean Code",
  difficulty: Difficulty.MEDIUM,
  prompt: "Good function names should:",
  options: [
    { key: "A", text: "Be short and unclear" },
    { key: "B", text: "Clearly describe purpose" },
    { key: "C", text: "Contain numbers" },
    { key: "D", text: "Be random" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Refactoring",
  difficulty: Difficulty.MEDIUM,
  prompt: "When should you refactor code?",
  rubric:
    "Expect when adding features, fixing bugs, improving readability.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "DevOps",
  difficulty: Difficulty.MEDIUM,
  prompt: "Infrastructure as Code means:",
  options: [
    { key: "A", text: "Managing infrastructure using code and automation" },
    { key: "B", text: "Writing frontend CSS" },
    { key: "C", text: "Manual server setup" },
    { key: "D", text: "Deleting servers" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Reliability",
  difficulty: Difficulty.HARD,
  prompt: "How would you design a system with high availability?",
  rubric:
    "Expect redundancy, load balancers, failover strategy, monitoring.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Networking",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is latency?",
  options: [
    { key: "A", text: "Data storage" },
    { key: "B", text: "Delay before data transfer begins" },
    { key: "C", text: "CPU speed" },
    { key: "D", text: "Memory allocation" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "API Design",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you version a public API?",
  rubric:
    "Expect URL versioning (/v1), backward compatibility, documentation.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Microservices",
  difficulty: Difficulty.HARD,
  prompt: "Microservices architecture promotes:",
  options: [
    { key: "A", text: "Single large codebase" },
    { key: "B", text: "Independent deployable services" },
    { key: "C", text: "Manual scaling only" },
    { key: "D", text: "No APIs" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Microservices",
  difficulty: Difficulty.HARD,
  prompt: "What are trade-offs of microservices?",
  rubric:
    "Expect complexity, communication overhead, scalability benefits.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Security",
  difficulty: Difficulty.MEDIUM,
  prompt: "Two-factor authentication improves security by:",
  options: [
    { key: "A", text: "Reducing password length" },
    { key: "B", text: "Adding additional verification step" },
    { key: "C", text: "Disabling login" },
    { key: "D", text: "Encrypting CSS" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Incident Response",
  difficulty: Difficulty.HARD,
  prompt: "A data breach is detected. What immediate actions should be taken?",
  rubric:
    "Expect isolate systems, notify stakeholders, investigate logs, patch vulnerability.",
});

await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Software Development",
  difficulty: Difficulty.EASY,
  prompt: "What is technical debt?",
  options: [
    { key: "A", text: "Borrowing money for servers" },
    { key: "B", text: "Future cost of quick or poor design decisions" },
    { key: "C", text: "Database error" },
    { key: "D", text: "Testing strategy" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Code Review",
  difficulty: Difficulty.MEDIUM,
  prompt: "What do you look for in a pull request review?",
  rubric:
    "Expect readability, correctness, security issues, performance, tests.",
});

await scenario({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Engineering Mindset",
  difficulty: Difficulty.HARD,
  prompt: "What makes a software system maintainable long-term?",
  rubric:
    "Expect clean architecture, documentation, testing, modularity, monitoring.",
});

 await mcq({
  role: JobRole.SOFTWARE_ENGINEER,
  topic: "Web Fundamentals",
  difficulty: Difficulty.EASY,
  prompt: "What does DNS do?",
  options: [
    { key: "A", text: "Encrypts data" },
    { key: "B", text: "Translates domain names to IP addresses" },
    { key: "C", text: "Stores passwords" },
    { key: "D", text: "Optimizes CSS" },
  ],
  correctKey: "B",
});

// -------------------- UX ENGINEER --------------------
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
  topic: "UX Fundamentals",
  difficulty: Difficulty.EASY,
  prompt: "What is the main goal of UX design?",
  options: [
    { key: "A", text: "Make websites colorful" },
    { key: "B", text: "Improve user satisfaction and usability" },
    { key: "C", text: "Increase server speed" },
    { key: "D", text: "Reduce database size" },
  ],
  correctKey: "B",
});

  await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UI Design",
  difficulty: Difficulty.EASY,
  prompt: "UI primarily focuses on:",
  options: [
    { key: "A", text: "User interface visuals and interactions" },
    { key: "B", text: "Backend APIs" },
    { key: "C", text: "Database queries" },
    { key: "D", text: "Server monitoring" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "User Flows",
  difficulty: Difficulty.MEDIUM,
  prompt: "A user flow diagram shows:",
  options: [
    { key: "A", text: "How users move through an application" },
    { key: "B", text: "Database structure" },
    { key: "C", text: "Server logs" },
    { key: "D", text: "API endpoints" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Navigation Design",
  difficulty: Difficulty.MEDIUM,
  prompt: "Users cannot find the apply button easily. What changes would you suggest?",
  rubric:
    "Expect visual hierarchy improvements, color emphasis, positioning, A/B testing.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Figma",
  difficulty: Difficulty.EASY,
  prompt: "Components in Figma help with:",
  options: [
    { key: "A", text: "Reusable UI elements" },
    { key: "B", text: "Server deployment" },
    { key: "C", text: "Database management" },
    { key: "D", text: "API security" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Responsive Design",
  difficulty: Difficulty.MEDIUM,
  prompt: "Responsive design ensures:",
  options: [
    { key: "A", text: "App works on different screen sizes" },
    { key: "B", text: "Database scales" },
    { key: "C", text: "Faster backend performance" },
    { key: "D", text: "More RAM usage" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Mobile UX",
  difficulty: Difficulty.MEDIUM,
  prompt: "What are key differences when designing for mobile vs desktop?",
  rubric:
    "Expect touch interactions, smaller screens, thumb zones, simplified layouts.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Heuristics",
  difficulty: Difficulty.MEDIUM,
  prompt: "‘Error prevention’ in UX means:",
  options: [
    { key: "A", text: "Allowing users to make mistakes freely" },
    { key: "B", text: "Designing to minimize user errors" },
    { key: "C", text: "Deleting error messages" },
    { key: "D", text: "Restarting system" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Information Architecture",
  difficulty: Difficulty.MEDIUM,
  prompt: "Information architecture organizes:",
  options: [
    { key: "A", text: "Content structure and navigation" },
    { key: "B", text: "Database queries" },
    { key: "C", text: "API requests" },
    { key: "D", text: "Server memory" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "User Personas",
  difficulty: Difficulty.MEDIUM,
  prompt: "How do user personas help in design decisions?",
  rubric:
    "Expect empathy building, target audience clarity, prioritizing features.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "A/B Testing",
  difficulty: Difficulty.MEDIUM,
  prompt: "A/B testing is used to:",
  options: [
    { key: "A", text: "Compare two design variations" },
    { key: "B", text: "Test database speed" },
    { key: "C", text: "Delete features" },
    { key: "D", text: "Encrypt UI" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Usability Testing",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you conduct a usability test for a job application flow?",
  rubric:
    "Expect defining tasks, observing users, collecting feedback, identifying friction points.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Metrics",
  difficulty: Difficulty.MEDIUM,
  prompt: "Task completion rate measures:",
  options: [
    { key: "A", text: "How many users successfully finish a task" },
    { key: "B", text: "Server response time" },
    { key: "C", text: "Number of UI components" },
    { key: "D", text: "Database speed" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Metrics",
  difficulty: Difficulty.MEDIUM,
  prompt: "Bounce rate indicates:",
  options: [
    { key: "A", text: "Users leaving after viewing one page" },
    { key: "B", text: "Server crash" },
    { key: "C", text: "Memory leak" },
    { key: "D", text: "Database timeout" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Metrics",
  difficulty: Difficulty.MEDIUM,
  prompt: "Bounce rate indicates:",
  options: [
    { key: "A", text: "Users leaving after viewing one page" },
    { key: "B", text: "Server crash" },
    { key: "C", text: "Memory leak" },
    { key: "D", text: "Database timeout" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Accessibility",
  difficulty: Difficulty.MEDIUM,
  prompt: "WCAG guidelines are related to:",
  options: [
    { key: "A", text: "Web accessibility standards" },
    { key: "B", text: "Database schema" },
    { key: "C", text: "Backend security" },
    { key: "D", text: "Cloud deployment" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Accessibility",
  difficulty: Difficulty.HARD,
  prompt: "Keyboard accessibility ensures:",
  options: [
    { key: "A", text: "Users can navigate without a mouse" },
    { key: "B", text: "UI loads faster" },
    { key: "C", text: "Server uses less RAM" },
    { key: "D", text: "Database is optimized" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Inclusive Design",
  difficulty: Difficulty.HARD,
  prompt: "How would you design for users with color blindness?",
  rubric:
    "Expect not relying on color alone, using patterns/icons, high contrast, accessibility testing.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Interaction Patterns",
  difficulty: Difficulty.MEDIUM,
  prompt: "Modal dialogs should be used:",
  options: [
    { key: "A", text: "For critical actions requiring attention" },
    { key: "B", text: "For every message" },
    { key: "C", text: "To display database logs" },
    { key: "D", text: "To improve server performance" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Interaction Design",
  difficulty: Difficulty.MEDIUM,
  prompt: "Progress indicators help users by:",
  options: [
    { key: "A", text: "Reducing uncertainty during long tasks" },
    { key: "B", text: "Speeding up database queries" },
    { key: "C", text: "Improving backend security" },
    { key: "D", text: "Reducing RAM usage" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Form Design",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you design error messages for better UX?",
  rubric:
    "Expect clear language, field-level feedback, suggestions for correction, avoiding technical jargon.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Psychology in UX",
  difficulty: Difficulty.MEDIUM,
  prompt: "Hick’s Law states that:",
  options: [
    { key: "A", text: "More choices increase decision time" },
    { key: "B", text: "Users love complex menus" },
    { key: "C", text: "Animations improve performance" },
    { key: "D", text: "Fonts affect server speed" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Psychology in UX",
  difficulty: Difficulty.MEDIUM,
  prompt: "Fitts’s Law relates to:",
  options: [
    { key: "A", text: "Target size and interaction time" },
    { key: "B", text: "Database scaling" },
    { key: "C", text: "API latency" },
    { key: "D", text: "Server caching" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "User Behavior",
  difficulty: Difficulty.MEDIUM,
  prompt: "Users rarely scroll below the fold. How would you redesign the page?",
  rubric:
    "Expect placing key actions above fold, visual cues, progressive disclosure.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Design Systems",
  difficulty: Difficulty.MEDIUM,
  prompt: "A design system ensures:",
  options: [
    { key: "A", text: "Consistency across products" },
    { key: "B", text: "Faster database queries" },
    { key: "C", text: "Better server scaling" },
    { key: "D", text: "Improved memory usage" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UI Consistency",
  difficulty: Difficulty.MEDIUM,
  prompt: "Consistency improves UX by:",
  options: [
    { key: "A", text: "Reducing learning curve" },
    { key: "B", text: "Increasing code size" },
    { key: "C", text: "Improving CPU speed" },
    { key: "D", text: "Encrypting assets" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Design Tokens",
  difficulty: Difficulty.HARD,
  prompt: "What are design tokens and why are they useful?",
  rubric:
    "Expect centralized values for color, spacing, typography, easier maintenance.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Animation",
  difficulty: Difficulty.MEDIUM,
  prompt: "Animations should be used to:",
  options: [
    { key: "A", text: "Guide user attention and provide feedback" },
    { key: "B", text: "Slow down website intentionally" },
    { key: "C", text: "Increase database load" },
    { key: "D", text: "Replace accessibility features" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Loading States",
  difficulty: Difficulty.MEDIUM,
  prompt: "Skeleton screens improve UX by:",
  options: [
    { key: "A", text: "Reducing perceived waiting time" },
    { key: "B", text: "Reducing server usage" },
    { key: "C", text: "Improving database indexing" },
    { key: "D", text: "Encrypting user data" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Performance Perception",
  difficulty: Difficulty.MEDIUM,
  prompt: "How can design improve perceived performance even if backend speed is same?",
  rubric:
    "Expect progress bars, skeleton loaders, optimistic UI updates.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Navigation",
  difficulty: Difficulty.MEDIUM,
  prompt: "Breadcrumb navigation helps users:",
  options: [
    { key: "A", text: "Understand location in hierarchy" },
    { key: "B", text: "Increase RAM usage" },
    { key: "C", text: "Improve API calls" },
    { key: "D", text: "Delete content" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Navigation Design",
  difficulty: Difficulty.HARD,
  prompt: "When would you use tabs vs accordion components?",
  rubric:
    "Expect tabs for parallel sections, accordion for progressive disclosure, mobile considerations.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Design to Development",
  difficulty: Difficulty.MEDIUM,
  prompt: "Why should designers understand frontend constraints?",
  options: [
    { key: "A", text: "To design unrealistic interfaces" },
    { key: "B", text: "To create feasible and implementable designs" },
    { key: "C", text: "To replace developers" },
    { key: "D", text: "To optimize databases" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Developer Collaboration",
  difficulty: Difficulty.MEDIUM,
  prompt: "Developers say your design is too complex to implement. What do you do?",
  rubric:
    "Expect discussion, understanding constraints, simplifying interactions, iterative refinement.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Responsive UX",
  difficulty: Difficulty.MEDIUM,
  prompt: "Mobile-first design means:",
  options: [
    { key: "A", text: "Designing for desktop first" },
    { key: "B", text: "Designing smallest screen first, then scaling up" },
    { key: "C", text: "Ignoring desktop users" },
    { key: "D", text: "Only building mobile apps" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Strategy",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is a pain point?",
  options: [
    { key: "A", text: "A feature users love" },
    { key: "B", text: "A recurring user problem or frustration" },
    { key: "C", text: "Database failure" },
    { key: "D", text: "Server overload" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "User Frustration",
  difficulty: Difficulty.MEDIUM,
  prompt: "Users complain that the onboarding process is too long. How would you improve it?",
  rubric:
    "Expect reducing steps, progressive disclosure, skip options, clearer guidance.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Cognitive Load",
  difficulty: Difficulty.MEDIUM,
  prompt: "Reducing cognitive load means:",
  options: [
    { key: "A", text: "Adding more options" },
    { key: "B", text: "Making tasks easier to understand" },
    { key: "C", text: "Increasing animation" },
    { key: "D", text: "Removing accessibility features" },
  ],
  correctKey: "B",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Error Handling",
  difficulty: Difficulty.MEDIUM,
  prompt: "Good error states should:",
  options: [
    { key: "A", text: "Blame the user" },
    { key: "B", text: "Clearly explain problem and solution" },
    { key: "C", text: "Use technical jargon" },
    { key: "D", text: "Hide the error" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Edge Cases",
  difficulty: Difficulty.HARD,
  prompt: "How would you design for empty states (no data available)?",
  rubric:
    "Expect helpful messaging, guidance, call-to-action, friendly tone.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Dark Mode",
  difficulty: Difficulty.MEDIUM,
  prompt: "Dark mode improves UX primarily by:",
  options: [
    { key: "A", text: "Reducing eye strain in low light" },
    { key: "B", text: "Increasing database speed" },
    { key: "C", text: "Reducing API calls" },
    { key: "D", text: "Improving server memory" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Theming",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you design a system that supports both light and dark themes?",
  rubric:
    "Expect design tokens, contrast testing, consistent color palettes.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Microcopy",
  difficulty: Difficulty.MEDIUM,
  prompt: "Microcopy refers to:",
  options: [
    { key: "A", text: "Small UI helper text guiding users" },
    { key: "B", text: "Database comments" },
    { key: "C", text: "Server logs" },
    { key: "D", text: "HTML structure" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Trust Design",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you increase user trust on a payment page?",
  rubric:
    "Expect security indicators, testimonials, clear pricing, transparent policies.",
});

  await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Usability",
  difficulty: Difficulty.MEDIUM,
  prompt: "What is usability?",
  options: [
    { key: "A", text: "How easy and efficient a product is to use" },
    { key: "B", text: "How colorful a UI is" },
    { key: "C", text: "How many buttons are used" },
    { key: "D", text: "How many animations exist" },
  ],
  correctKey: "A",
});

  await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Design Thinking",
  difficulty: Difficulty.MEDIUM,
  prompt: "The first stage of Design Thinking is:",
  options: [
    { key: "A", text: "Prototype" },
    { key: "B", text: "Test" },
    { key: "C", text: "Empathize" },
    { key: "D", text: "Deploy" },
  ],
  correctKey: "C",
});

  await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "User Research",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you gather user feedback before redesigning a dashboard?",
  rubric:
    "Expect surveys, interviews, usability tests, analytics review, identifying pain points.",
});

  
  await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Wireframing",
  difficulty: Difficulty.EASY,
  prompt: "A wireframe is used to:",
  options: [
    { key: "A", text: "Define layout structure without visual styling" },
    { key: "B", text: "Deploy application" },
    { key: "C", text: "Test backend APIs" },
    { key: "D", text: "Encrypt data" },
  ],
  correctKey: "A",
});

  await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Typography",
  difficulty: Difficulty.MEDIUM,
  prompt: "Why is typography important in UX?",
  options: [
    { key: "A", text: "Improves readability and hierarchy" },
    { key: "B", text: "Improves server performance" },
    { key: "C", text: "Reduces database size" },
    { key: "D", text: "Increases CPU usage" },
  ],
  correctKey: "A",
});

  await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Color Theory",
  difficulty: Difficulty.MEDIUM,
  prompt: "High contrast in UI helps with:",
  options: [
    { key: "A", text: "Accessibility and readability" },
    { key: "B", text: "Server caching" },
    { key: "C", text: "Database indexing" },
    { key: "D", text: "API performance" },
  ],
  correctKey: "A",
});

  await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Accessibility",
  difficulty: Difficulty.HARD,
  prompt: "How would you design a form accessible to visually impaired users?",
  rubric:
    "Expect proper labels, ARIA attributes, keyboard navigation, screen reader compatibility.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Interaction Design",
  difficulty: Difficulty.MEDIUM,
  prompt: "Micro-interactions are used to:",
  options: [
    { key: "A", text: "Provide subtle feedback to user actions" },
    { key: "B", text: "Store data" },
    { key: "C", text: "Replace backend APIs" },
    { key: "D", text: "Reduce CSS" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Feedback Systems",
  difficulty: Difficulty.MEDIUM,
  prompt: "Immediate feedback is important because:",
  options: [
    { key: "A", text: "It confirms user actions instantly" },
    { key: "B", text: "It reduces RAM" },
    { key: "C", text: "It speeds up database queries" },
    { key: "D", text: "It encrypts content" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Research",
  difficulty: Difficulty.MEDIUM,
  prompt: "Qualitative research provides:",
  options: [
    { key: "A", text: "In-depth insights into user behavior" },
    { key: "B", text: "Database indexing" },
    { key: "C", text: "Faster rendering" },
    { key: "D", text: "API response codes" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Quantitative Research",
  difficulty: Difficulty.MEDIUM,
  prompt: "What quantitative data would you collect to measure UX success?",
  rubric:
    "Expect conversion rate, task completion rate, error rate, retention.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Design Handoff",
  difficulty: Difficulty.MEDIUM,
  prompt: "A proper design handoff should include:",
  options: [
    { key: "A", text: "Design specs and interaction details" },
    { key: "B", text: "Only screenshots" },
    { key: "C", text: "Database schema" },
    { key: "D", text: "Server configuration" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Design Handoff",
  difficulty: Difficulty.HARD,
  prompt: "What problems happen when design documentation is incomplete?",
  rubric:
    "Expect misinterpretation, inconsistent UI, delays, rework.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Debt",
  difficulty: Difficulty.MEDIUM,
  prompt: "UX debt refers to:",
  options: [
    { key: "A", text: "Accumulated poor design decisions" },
    { key: "B", text: "Database storage" },
    { key: "C", text: "Server overload" },
    { key: "D", text: "Extra CSS files" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Design Systems",
  difficulty: Difficulty.HARD,
  prompt: "Atomic design methodology includes:",
  options: [
    { key: "A", text: "Atoms, molecules, organisms" },
    { key: "B", text: "Tables, rows, columns" },
    { key: "C", text: "Servers, clients, APIs" },
    { key: "D", text: "Files and folders" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Component Thinking",
  difficulty: Difficulty.MEDIUM,
  prompt: "Why is component-based design important in modern UI?",
  rubric:
    "Expect reusability, consistency, easier maintenance.",
});
await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Form UX",
  difficulty: Difficulty.MEDIUM,
  prompt: "Inline validation improves UX because:",
  options: [
    { key: "A", text: "Users get instant feedback" },
    { key: "B", text: "It reduces database load" },
    { key: "C", text: "It increases complexity" },
    { key: "D", text: "It removes CSS" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Search UX",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you improve search functionality in a job portal?",
  rubric:
    "Expect auto-suggestions, filters, typo tolerance, clear results display.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Evaluation",
  difficulty: Difficulty.MEDIUM,
  prompt: "Heuristic evaluation is:",
  options: [
    { key: "A", text: "Expert review using usability principles" },
    { key: "B", text: "Database stress testing" },
    { key: "C", text: "Server benchmarking" },
    { key: "D", text: "Code compilation" },
  ],
  correctKey: "A",
});
await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Design Ethics",
  difficulty: Difficulty.MEDIUM,
  prompt: "Dark patterns are:",
  options: [
    { key: "A", text: "Unethical design tactics manipulating users" },
    { key: "B", text: "Dark mode UI" },
    { key: "C", text: "Secure forms" },
    { key: "D", text: "Minimalistic design" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Ethical UX",
  difficulty: Difficulty.HARD,
  prompt: "How do you balance business goals with ethical UX?",
  rubric:
    "Expect transparency, user respect, avoiding manipulation, aligning KPIs ethically.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Accessibility",
  difficulty: Difficulty.MEDIUM,
  prompt: "Alt text is important for:",
  options: [
    { key: "A", text: "Screen readers describing images" },
    { key: "B", text: "Database indexing" },
    { key: "C", text: "CSS rendering" },
    { key: "D", text: "Server caching" },
  ],
  correctKey: "A",
});
await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Psychology",
  difficulty: Difficulty.MEDIUM,
  prompt: "Social proof influences users by:",
  options: [
    { key: "A", text: "Showing others’ positive experiences" },
    { key: "B", text: "Increasing server load" },
    { key: "C", text: "Deleting accounts" },
    { key: "D", text: "Hiding content" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Conversion Optimization",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you improve conversion on a signup page?",
  rubric:
    "Expect simplifying form, clear CTA, trust signals, testing variations.",
});
await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Navigation Patterns",
  difficulty: Difficulty.MEDIUM,
  prompt: "Hamburger menus are most suitable for:",
  options: [
    { key: "A", text: "Mobile navigation" },
    { key: "B", text: "Server routing" },
    { key: "C", text: "Database tables" },
    { key: "D", text: "Backend APIs" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Long-term UX Strategy",
  difficulty: Difficulty.HARD,
  prompt: "What makes a product’s UX sustainable over time?",
  rubric:
    "Expect consistency, design system, user feedback loop, scalability, accessibility compliance.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Product Thinking",
  difficulty: Difficulty.MEDIUM,
  prompt: "User-centered design prioritizes:",
  options: [
    { key: "A", text: "Business needs only" },
    { key: "B", text: "User needs and goals" },
    { key: "C", text: "Backend architecture" },
    { key: "D", text: "Database optimization" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Feature Prioritization",
  difficulty: Difficulty.MEDIUM,
  prompt: "You have limited time. How do you prioritize UX improvements?",
  rubric:
    "Expect impact vs effort analysis, user pain points, business value alignment.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Usability",
  difficulty: Difficulty.MEDIUM,
  prompt: "Affordance in UI means:",
  options: [
    { key: "A", text: "Visual cues indicating how an element works" },
    { key: "B", text: "Database structure" },
    { key: "C", text: "Server logs" },
    { key: "D", text: "API routes" },
  ],
  correctKey: "A",
});
await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Usability",
  difficulty: Difficulty.MEDIUM,
  prompt: "Affordance in UI means:",
  options: [
    { key: "A", text: "Visual cues indicating how an element works" },
    { key: "B", text: "Database structure" },
    { key: "C", text: "Server logs" },
    { key: "D", text: "API routes" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Writing",
  difficulty: Difficulty.MEDIUM,
  prompt: "Good UX writing should be:",
  options: [
    { key: "A", text: "Clear, concise, and helpful" },
    { key: "B", text: "Technical and complex" },
    { key: "C", text: "Very long paragraphs" },
    { key: "D", text: "Hidden in small text" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Trust Signals",
  difficulty: Difficulty.MEDIUM,
  prompt: "What visual elements increase credibility on a job portal?",
  rubric:
    "Expect testimonials, company logos, verified badges, professional layout.",
});
await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Research",
  difficulty: Difficulty.MEDIUM,
  prompt: "A usability test with 5 users can:",
  options: [
    { key: "A", text: "Identify majority of major usability issues" },
    { key: "B", text: "Replace backend testing" },
    { key: "C", text: "Fix database bugs" },
    { key: "D", text: "Deploy application" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "User Retention",
  difficulty: Difficulty.HARD,
  prompt: "How would you design features to increase user retention?",
  rubric:
    "Expect personalization, reminders, progress tracking, value reinforcement.",
});
await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Minimalism",
  difficulty: Difficulty.MEDIUM,
  prompt: "Minimalist design helps by:",
  options: [
    { key: "A", text: "Reducing distractions" },
    { key: "B", text: "Increasing database load" },
    { key: "C", text: "Removing accessibility" },
    { key: "D", text: "Slowing down UI" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Visual Hierarchy",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you emphasize the primary call-to-action?",
  rubric:
    "Expect contrast, size, placement, spacing, visual priority.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Accessibility",
  difficulty: Difficulty.MEDIUM,
  prompt: "Focus states are important because:",
  options: [
    { key: "A", text: "They show which element is active for keyboard users" },
    { key: "B", text: "They speed up server" },
    { key: "C", text: "They reduce CSS" },
    { key: "D", text: "They encrypt data" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Keyboard Navigation",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you test keyboard accessibility?",
  rubric:
    "Expect tab navigation testing, visible focus, logical order, screen reader testing.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Feedback Loops",
  difficulty: Difficulty.MEDIUM,
  prompt: "User feedback loops are important for:",
  options: [
    { key: "A", text: "Continuous improvement of product" },
    { key: "B", text: "Increasing RAM usage" },
    { key: "C", text: "Reducing backend APIs" },
    { key: "D", text: "Deleting UI components" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Feature Removal",
  difficulty: Difficulty.MEDIUM,
  prompt: "Users don’t use a feature you designed. What would you do?",
  rubric:
    "Expect data analysis, user interviews, iteration or removal decision.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Performance Perception",
  difficulty: Difficulty.MEDIUM,
  prompt: "Optimistic UI updates:",
  options: [
    { key: "A", text: "Update interface before server confirms" },
    { key: "B", text: "Wait for server always" },
    { key: "C", text: "Remove user feedback" },
    { key: "D", text: "Block UI interactions" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Error Recovery",
  difficulty: Difficulty.HARD,
  prompt: "How would you design undo functionality?",
  rubric:
    "Expect reversible actions, clear feedback, time-limited undo.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Consistency",
  difficulty: Difficulty.MEDIUM,
  prompt: "Platform conventions should be followed because:",
  options: [
    { key: "A", text: "Users are familiar with them" },
    { key: "B", text: "They improve backend speed" },
    { key: "C", text: "They reduce CSS" },
    { key: "D", text: "They encrypt data" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Cross-platform UX",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you maintain consistent UX across web and mobile?",
  rubric:
    "Expect shared design system, consistent branding, adaptive layouts.",
});
await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Gamification",
  difficulty: Difficulty.MEDIUM,
  prompt: "Gamification can improve engagement by:",
  options: [
    { key: "A", text: "Adding progress, rewards, achievements" },
    { key: "B", text: "Removing features" },
    { key: "C", text: "Increasing database size" },
    { key: "D", text: "Reducing security" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Motivation Design",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you motivate users to complete their profiles?",
  rubric:
    "Expect progress bars, reminders, incentives, simplified steps.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Feedback Timing",
  difficulty: Difficulty.MEDIUM,
  prompt: "Delayed feedback can cause:",
  options: [
    { key: "A", text: "User confusion and frustration" },
    { key: "B", text: "Faster loading" },
    { key: "C", text: "Database crash" },
    { key: "D", text: "Better UI" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Stress Testing UX",
  difficulty: Difficulty.HARD,
  prompt: "How would you design UX for high-stress situations (e.g., exam platform)?",
  rubric:
    "Expect clarity, minimal distractions, visible timers, clear instructions.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "Design Documentation",
  difficulty: Difficulty.MEDIUM,
  prompt: "Design documentation helps by:",
  options: [
    { key: "A", text: "Ensuring shared understanding among team" },
    { key: "B", text: "Increasing CSS size" },
    { key: "C", text: "Reducing API calls" },
    { key: "D", text: "Encrypting assets" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Stakeholder Communication",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you justify a UX decision to non-design stakeholders?",
  rubric:
    "Expect using data, user research, impact metrics, clear reasoning.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX KPIs",
  difficulty: Difficulty.MEDIUM,
  prompt: "Which is a UX KPI?",
  options: [
    { key: "A", text: "User satisfaction score" },
    { key: "B", text: "Database index size" },
    { key: "C", text: "Server CPU model" },
    { key: "D", text: "Code file length" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Product Iteration",
  difficulty: Difficulty.MEDIUM,
  prompt: "After launching a redesign, metrics dropped. What next?",
  rubric:
    "Expect analyzing data, gathering feedback, iterative improvements.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "International UX",
  difficulty: Difficulty.MEDIUM,
  prompt: "Designing for global audiences requires:",
  options: [
    { key: "A", text: "Localization and cultural awareness" },
    { key: "B", text: "More CSS files" },
    { key: "C", text: "Bigger database" },
    { key: "D", text: "Faster server" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "Localization",
  difficulty: Difficulty.HARD,
  prompt: "What challenges arise when designing multilingual interfaces?",
  rubric:
    "Expect text expansion, layout flexibility, cultural differences.",
});

await mcq({
  role: JobRole.UX_ENGINEER,
  topic: "UX Vision",
  difficulty: Difficulty.HARD,
  prompt: "A strong UX vision helps by:",
  options: [
    { key: "A", text: "Guiding long-term product consistency" },
    { key: "B", text: "Improving database indexing" },
    { key: "C", text: "Increasing RAM" },
    { key: "D", text: "Reducing API latency" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.UX_ENGINEER,
  topic: "UX Engineering Mindset",
  difficulty: Difficulty.HARD,
  prompt: "What qualities make a strong UI/UX Engineering Intern?",
  rubric:
    "Expect empathy, technical awareness, collaboration, continuous learning, user-first thinking.",
});

  // -------------------- PROJECT MANAGER (12) --------------------
  await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Project Fundamentals",
  difficulty: Difficulty.EASY,
  prompt: "What is a project?",
  options: [
    { key: "A", text: "Ongoing repetitive work" },
    { key: "B", text: "A temporary effort to create a unique product or service" },
    { key: "C", text: "A database system" },
    { key: "D", text: "A backend API" },
  ],
  correctKey: "B",
});

 await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Project Roles",
  difficulty: Difficulty.EASY,
  prompt: "The primary responsibility of a project manager is to:",
  options: [
    { key: "A", text: "Write code" },
    { key: "B", text: "Ensure project objectives are achieved" },
    { key: "C", text: "Design UI screens" },
    { key: "D", text: "Maintain database servers" },
  ],
  correctKey: "B",
});

  await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Agile",
  difficulty: Difficulty.EASY,
  prompt: "Scrum is a framework used in:",
  options: [
    { key: "A", text: "Agile project management" },
    { key: "B", text: "Database design" },
    { key: "C", text: "Graphic design" },
    { key: "D", text: "Server hosting" },
  ],
  correctKey: "A",
});

  await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Stakeholder Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "A stakeholder keeps requesting new features mid-project. How would you handle it?",
  rubric:
    "Expect scope discussion, change request process, prioritization, impact analysis.",
});

  // fillers to reach 12
 await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Planning",
  difficulty: Difficulty.MEDIUM,
  prompt: "A Gantt chart is mainly used to:",
  options: [
    { key: "A", text: "Visualize project schedule" },
    { key: "B", text: "Improve database performance" },
    { key: "C", text: "Write code" },
    { key: "D", text: "Design UI" },
  ],
  correctKey: "A",
});

  await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Agile",
  difficulty: Difficulty.MEDIUM,
  prompt: "A sprint retrospective is used to:",
  options: [
    { key: "A", text: "Deploy code" },
    { key: "B", text: "Reflect and improve team process" },
    { key: "C", text: "Design backend schema" },
    { key: "D", text: "Increase server RAM" },
  ],
  correctKey: "B",
});

 await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Team Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "Two team members are in conflict. What steps would you take?",
  rubric:
    "Expect mediation, listening, identifying root cause, aligning on goals.",
});

  await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Risk Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "Risk mitigation means:",
  options: [
    { key: "A", text: "Ignoring risks" },
    { key: "B", text: "Reducing likelihood or impact of risks" },
    { key: "C", text: "Increasing project scope" },
    { key: "D", text: "Deleting project plan" },
  ],
  correctKey: "B",
});

  await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Communication",
  difficulty: Difficulty.EASY,
  prompt: "Effective communication in a project ensures:",
  options: [
    { key: "A", text: "Better alignment and fewer misunderstandings" },
    { key: "B", text: "Higher database load" },
    { key: "C", text: "Slower development" },
    { key: "D", text: "More meetings only" },
  ],
  correctKey: "A",
});

  await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Deadlines",
  difficulty: Difficulty.MEDIUM,
  prompt: "The project is behind schedule. What actions would you take?",
  rubric:
    "Expect reprioritization, reallocation of resources, adjusting scope, stakeholder communication.",
});

  await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Scope",
  difficulty: Difficulty.MEDIUM,
  prompt: "Scope creep refers to:",
  options: [
    { key: "A", text: "Unexpected expansion of project requirements" },
    { key: "B", text: "Improving design quality" },
    { key: "C", text: "Reducing features" },
    { key: "D", text: "Database errors" },
  ],
  correctKey: "A",
});

  await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Agile Roles",
  difficulty: Difficulty.MEDIUM,
  prompt: "The Scrum Master primarily:",
  options: [
    { key: "A", text: "Removes impediments and facilitates Scrum process" },
    { key: "B", text: "Writes production code" },
    { key: "C", text: "Designs UI screens" },
    { key: "D", text: "Maintains database" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Resource Allocation",
  difficulty: Difficulty.MEDIUM,
  prompt: "A key developer becomes unavailable. How do you manage risk?",
  rubric:
    "Expect reassign tasks, adjust timeline, knowledge transfer, risk planning.",
});
await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "KPIs",
  difficulty: Difficulty.MEDIUM,
  prompt: "Which is a project KPI?",
  options: [
    { key: "A", text: "On-time delivery rate" },
    { key: "B", text: "Font size used" },
    { key: "C", text: "Server brand" },
    { key: "D", text: "Database color scheme" },
  ],
  correctKey: "A",
});
await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Quality",
  difficulty: Difficulty.MEDIUM,
  prompt: "Quality assurance focuses on:",
  options: [
    { key: "A", text: "Preventing defects" },
    { key: "B", text: "Fixing bugs only" },
    { key: "C", text: "Increasing RAM" },
    { key: "D", text: "Removing documentation" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Quality Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you ensure quality in a software project?",
  rubric:
    "Expect testing plans, reviews, standards, continuous monitoring.",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Budget",
  difficulty: Difficulty.MEDIUM,
  prompt: "Cost variance indicates:",
  options: [
    { key: "A", text: "Difference between planned and actual cost" },
    { key: "B", text: "UI responsiveness" },
    { key: "C", text: "Database speed" },
    { key: "D", text: "Server uptime" },
  ],
  correctKey: "A",
});
await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Documentation",
  difficulty: Difficulty.EASY,
  prompt: "Project documentation helps by:",
  options: [
    { key: "A", text: "Maintaining clarity and record of decisions" },
    { key: "B", text: "Reducing CSS" },
    { key: "C", text: "Encrypting APIs" },
    { key: "D", text: "Improving server speed" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Client Communication",
  difficulty: Difficulty.MEDIUM,
  prompt: "A client is unhappy with progress. How would you respond?",
  rubric:
    "Expect active listening, transparency, action plan, reassurance.",
});
await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Team Performance",
  difficulty: Difficulty.MEDIUM,
  prompt: "Velocity in Scrum measures:",
  options: [
    { key: "A", text: "Work completed per sprint" },
    { key: "B", text: "Server latency" },
    { key: "C", text: "UI load time" },
    { key: "D", text: "Database throughput" },
  ],
  correctKey: "A",
});
await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Agile Planning",
  difficulty: Difficulty.MEDIUM,
  prompt: "Sprint planning is used to:",
  options: [
    { key: "A", text: "Define sprint goals and tasks" },
    { key: "B", text: "Fix server bugs" },
    { key: "C", text: "Design UI themes" },
    { key: "D", text: "Upgrade database" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Backlog Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "The product backlog is owned by:",
  options: [
    { key: "A", text: "Product Owner" },
    { key: "B", text: "Database Admin" },
    { key: "C", text: "UI Designer" },
    { key: "D", text: "Client Only" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Backlog Prioritization",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you prioritize tasks in a backlog?",
  rubric:
    "Expect business value, urgency, risk, dependencies, stakeholder input.",
});
await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Risk Analysis",
  difficulty: Difficulty.MEDIUM,
  prompt: "Risk probability and impact matrix helps to:",
  options: [
    { key: "A", text: "Prioritize risks" },
    { key: "B", text: "Write backend logic" },
    { key: "C", text: "Design UI layouts" },
    { key: "D", text: "Optimize CSS" },
  ],
  correctKey: "A",
});
await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Estimation",
  difficulty: Difficulty.MEDIUM,
  prompt: "Story points measure:",
  options: [
    { key: "A", text: "Relative effort and complexity" },
    { key: "B", text: "Exact hours worked" },
    { key: "C", text: "Server speed" },
    { key: "D", text: "Database rows" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Estimation Issues",
  difficulty: Difficulty.MEDIUM,
  prompt: "The team consistently underestimates tasks. What would you improve?",
  rubric:
    "Expect better refinement, historical data, planning poker, buffer time.",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Leadership",
  difficulty: Difficulty.MEDIUM,
  prompt: "Servant leadership focuses on:",
  options: [
    { key: "A", text: "Supporting and empowering team members" },
    { key: "B", text: "Strict command control" },
    { key: "C", text: "Reducing meetings only" },
    { key: "D", text: "Increasing deadlines" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Stakeholders",
  difficulty: Difficulty.MEDIUM,
  prompt: "High power, high interest stakeholders should be:",
  options: [
    { key: "A", text: "Closely managed" },
    { key: "B", text: "Ignored" },
    { key: "C", text: "Given minimal updates" },
    { key: "D", text: "Removed from communication" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Stakeholder Communication",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you report project status to senior management?",
  rubric:
    "Expect concise summary, KPIs, risks, blockers, timeline updates.",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Change Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "A formal change request should include:",
  options: [
    { key: "A", text: "Impact on scope, cost, and timeline" },
    { key: "B", text: "UI screenshots only" },
    { key: "C", text: "Database backups" },
    { key: "D", text: "Server logs" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Monitoring",
  difficulty: Difficulty.MEDIUM,
  prompt: "Burndown charts track:",
  options: [
    { key: "A", text: "Remaining work in sprint" },
    { key: "B", text: "Server usage" },
    { key: "C", text: "Database memory" },
    { key: "D", text: "CSS files" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Team Motivation",
  difficulty: Difficulty.MEDIUM,
  prompt: "The team seems demotivated. What would you do?",
  rubric:
    "Expect recognition, clear goals, removing blockers, supportive leadership.",
});
await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Dependencies",
  difficulty: Difficulty.MEDIUM,
  prompt: "Task dependencies affect:",
  options: [
    { key: "A", text: "Project schedule sequencing" },
    { key: "B", text: "Database encryption" },
    { key: "C", text: "UI animations" },
    { key: "D", text: "Server hosting" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Communication Channels",
  difficulty: Difficulty.MEDIUM,
  prompt: "Daily stand-ups are primarily for:",
  options: [
    { key: "A", text: "Quick team synchronization" },
    { key: "B", text: "Long client presentations" },
    { key: "C", text: "Database tuning" },
    { key: "D", text: "Budget approval" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Escalation",
  difficulty: Difficulty.MEDIUM,
  prompt: "When should a problem be escalated to higher management?",
  rubric:
    "Expect when impact is high, beyond authority, major delays or risks.",
});
await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Risk Response",
  difficulty: Difficulty.MEDIUM,
  prompt: "Risk avoidance means:",
  options: [
    { key: "A", text: "Eliminating the risk entirely" },
    { key: "B", text: "Ignoring the risk" },
    { key: "C", text: "Increasing project scope" },
    { key: "D", text: "Reducing testing" },
  ],
  correctKey: "A",
});
await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Quality Control",
  difficulty: Difficulty.MEDIUM,
  prompt: "Quality control focuses on:",
  options: [
    { key: "A", text: "Identifying defects in deliverables" },
    { key: "B", text: "Increasing CSS" },
    { key: "C", text: "Deploying server" },
    { key: "D", text: "Removing documentation" },
  ],
  correctKey: "A",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Quality Control",
  difficulty: Difficulty.MEDIUM,
  prompt: "Quality control focuses on:",
  options: [
    { key: "A", text: "Identifying defects in deliverables" },
    { key: "B", text: "Increasing CSS" },
    { key: "C", text: "Deploying server" },
    { key: "D", text: "Removing documentation" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Time Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you manage overlapping deadlines?",
  rubric:
    "Expect prioritization, delegation, timeline adjustment, communication.",
});

await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Time Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "How would you manage overlapping deadlines?",
  rubric:
    "Expect prioritization, delegation, timeline adjustment, communication.",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Crisis Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "If a critical bug appears before release, the first step is to:",
  options: [
    { key: "A", text: "Ignore it and release anyway" },
    { key: "B", text: "Assess severity and impact" },
    { key: "C", text: "Blame the developer" },
    { key: "D", text: "Delete the feature" },
  ],
  correctKey: "B",
});

await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Release Pressure",
  difficulty: Difficulty.MEDIUM,
  prompt: "Management wants to release early, but quality is not stable. What do you do?",
  rubric:
    "Expect risk assessment, transparent communication, propose phased release or fix plan.",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Negotiation",
  difficulty: Difficulty.MEDIUM,
  prompt: "Successful negotiation requires:",
  options: [
    { key: "A", text: "Understanding both parties' interests" },
    { key: "B", text: "Forcing decisions" },
    { key: "C", text: "Avoiding communication" },
    { key: "D", text: "Increasing deadlines" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Client Expectations",
  difficulty: Difficulty.MEDIUM,
  prompt: "A client expects features outside agreed scope. How would you respond?",
  rubric:
    "Expect reviewing contract, change control, cost/time impact explanation.",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Delivery Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "Milestones are used to:",
  options: [
    { key: "A", text: "Track major progress points" },
    { key: "B", text: "Increase server speed" },
    { key: "C", text: "Design UI icons" },
    { key: "D", text: "Manage database size" },
  ],
  correctKey: "A",
});


await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Delivery Management",
  difficulty: Difficulty.MEDIUM,
  prompt: "Milestones are used to:",
  options: [
    { key: "A", text: "Track major progress points" },
    { key: "B", text: "Increase server speed" },
    { key: "C", text: "Design UI icons" },
    { key: "D", text: "Manage database size" },
  ],
  correctKey: "A",
});

await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Deadline Risk",
  difficulty: Difficulty.MEDIUM,
  prompt: "A key milestone may be missed. What actions would you take?",
  rubric:
    "Expect stakeholder communication, reallocation of resources, adjusting scope.",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Team Performance",
  difficulty: Difficulty.MEDIUM,
  prompt: "Low team productivity may result from:",
  options: [
    { key: "A", text: "Unclear goals and poor communication" },
    { key: "B", text: "Too much planning only" },
    { key: "C", text: "Database overload" },
    { key: "D", text: "CSS complexity" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Remote Teams",
  difficulty: Difficulty.MEDIUM,
  prompt: "How do you manage productivity in a remote team?",
  rubric:
    "Expect clear communication tools, regular check-ins, defined goals.",
});

await mcq({
  role: JobRole.PROJECT_MANAGER,
  topic: "Risk Register",
  difficulty: Difficulty.MEDIUM,
  prompt: "A risk register is used to:",
  options: [
    { key: "A", text: "Document and track risks" },
    { key: "B", text: "Design UI wireframes" },
    { key: "C", text: "Host APIs" },
    { key: "D", text: "Store CSS" },
  ],
  correctKey: "A",
});
await scenario({
  role: JobRole.PROJECT_MANAGER,
  topic: "Risk Monitoring",
  difficulty: Difficulty.MEDIUM,
  prompt: "How often should project risks be reviewed?",
  rubric:
    "Expect regularly during meetings, sprint reviews, and milestone checks.",
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