//prisma/preQuiz.seed.ts
import { PrismaClient, PrepQuizRole } from "../generated/prisma";

const prisma = new PrismaClient();

type QuestionInput = {
  role: PrepQuizRole;
  question: string;
  explanation: string;
  options: {
    key: string;
    text: string;
    isCorrect: boolean;
  }[];
};

const questions: QuestionInput[] = [
  
  // ================= SOFTWARE ENGINEER (40 PROFESSIONAL QUESTIONS) =================

{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "You are designing a high-traffic web application. Which architecture is most suitable to ensure scalability and independent deployment of services?",
  explanation: "Microservices allow independent scaling and deployment.",
  options: [
    { key: "A", text: "Monolithic architecture", isCorrect: false },
    { key: "B", text: "Microservices architecture", isCorrect: true },
    { key: "C", text: "Client-side rendering only", isCorrect: false },
    { key: "D", text: "Static architecture", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is the primary purpose of normalization in database design?",
  explanation: "Normalization reduces redundancy and improves data integrity.",
  options: [
    { key: "A", text: "Increase redundancy", isCorrect: false },
    { key: "B", text: "Reduce redundancy and improve integrity", isCorrect: true },
    { key: "C", text: "Speed up UI rendering", isCorrect: false },
    { key: "D", text: "Improve CSS performance", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which data structure would you use to implement a priority queue efficiently?",
  explanation: "Heap provides efficient priority queue operations.",
  options: [
    { key: "A", text: "Array", isCorrect: false },
    { key: "B", text: "Linked List", isCorrect: false },
    { key: "C", text: "Heap", isCorrect: true },
    { key: "D", text: "Stack", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "You notice that a function in your system has a time complexity of O(n^2). What is the most effective way to optimize it?",
  explanation: "Using better algorithms or data structures reduces complexity.",
  options: [
    { key: "A", text: "Increase hardware resources", isCorrect: false },
    { key: "B", text: "Refactor using efficient algorithm", isCorrect: true },
    { key: "C", text: "Add more loops", isCorrect: false },
    { key: "D", text: "Ignore performance", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is the key benefit of using asynchronous programming in backend systems?",
  explanation: "Async improves performance by handling multiple tasks concurrently.",
  options: [
    { key: "A", text: "Blocks execution", isCorrect: false },
    { key: "B", text: "Improves concurrency and responsiveness", isCorrect: true },
    { key: "C", text: "Reduces memory usage only", isCorrect: false },
    { key: "D", text: "Eliminates bugs", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "In object-oriented programming, what does encapsulation achieve?",
  explanation: "Encapsulation hides internal state and protects data.",
  options: [
    { key: "A", text: "Code duplication", isCorrect: false },
    { key: "B", text: "Data hiding and abstraction", isCorrect: true },
    { key: "C", text: "Faster UI rendering", isCorrect: false },
    { key: "D", text: "Database optimization", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "You are debugging a production issue. What should be your first step?",
  explanation: "Reproducing the issue is critical.",
  options: [
    { key: "A", text: "Rewrite code", isCorrect: false },
    { key: "B", text: "Reproduce the issue", isCorrect: true },
    { key: "C", text: "Deploy new version", isCorrect: false },
    { key: "D", text: "Ignore logs", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which design pattern ensures a class has only one instance?",
  explanation: "Singleton restricts instantiation.",
  options: [
    { key: "A", text: "Factory", isCorrect: false },
    { key: "B", text: "Singleton", isCorrect: true },
    { key: "C", text: "Observer", isCorrect: false },
    { key: "D", text: "Decorator", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is the role of middleware in backend frameworks?",
  explanation: "Middleware processes requests before reaching handlers.",
  options: [
    { key: "A", text: "Stores data", isCorrect: false },
    { key: "B", text: "Handles request/response flow", isCorrect: true },
    { key: "C", text: "Designs UI", isCorrect: false },
    { key: "D", text: "Compiles code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which HTTP method is idempotent?",
  explanation: "GET does not change server state.",
  options: [
    { key: "A", text: "POST", isCorrect: false },
    { key: "B", text: "GET", isCorrect: true },
    { key: "C", text: "PATCH", isCorrect: false },
    { key: "D", text: "CONNECT", isCorrect: false },
  ],
},

// --- MEDIUM + SCENARIO ---
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "You are building a caching layer to improve performance. Which tool is most suitable?",
  explanation: "Redis is commonly used for caching.",
  options: [
    { key: "A", text: "MongoDB", isCorrect: false },
    { key: "B", text: "Redis", isCorrect: true },
    { key: "C", text: "MySQL", isCorrect: false },
    { key: "D", text: "GraphQL", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What problem does indexing solve in databases?",
  explanation: "Indexing improves query speed.",
  options: [
    { key: "A", text: "Data redundancy", isCorrect: false },
    { key: "B", text: "Slow query performance", isCorrect: true },
    { key: "C", text: "UI issues", isCorrect: false },
    { key: "D", text: "Security issues", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "In distributed systems, what is eventual consistency?",
  explanation: "Data becomes consistent over time.",
  options: [
    { key: "A", text: "Immediate consistency", isCorrect: false },
    { key: "B", text: "Consistency achieved over time", isCorrect: true },
    { key: "C", text: "No consistency", isCorrect: false },
    { key: "D", text: "Database crash", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which algorithm is best for shortest path in weighted graphs?",
  explanation: "Dijkstra is optimal for positive weights.",
  options: [
    { key: "A", text: "DFS", isCorrect: false },
    { key: "B", text: "BFS", isCorrect: false },
    { key: "C", text: "Dijkstra", isCorrect: true },
    { key: "D", text: "Binary Search", isCorrect: false },
  ],
},

// --- HARD ---
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "You are handling millions of requests per second. Which technique helps distribute load effectively?",
  explanation: "Load balancing distributes traffic.",
  options: [
    { key: "A", text: "Caching only", isCorrect: false },
    { key: "B", text: "Load balancing", isCorrect: true },
    { key: "C", text: "Single server", isCorrect: false },
    { key: "D", text: "Manual routing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is CAP theorem?",
  explanation: "Consistency, Availability, Partition tolerance tradeoff.",
  options: [
    { key: "A", text: "Security model", isCorrect: false },
    { key: "B", text: "Distributed system tradeoff", isCorrect: true },
    { key: "C", text: "Database schema", isCorrect: false },
    { key: "D", text: "API pattern", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is a race condition?",
  explanation: "Occurs when multiple threads access shared data.",
  options: [
    { key: "A", text: "Slow execution", isCorrect: false },
    { key: "B", text: "Concurrent data conflict", isCorrect: true },
    { key: "C", text: "Database failure", isCorrect: false },
    { key: "D", text: "Memory leak", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is the purpose of unit testing?",
  explanation: "Ensures individual components work correctly.",
  options: [
    { key: "A", text: "Deploy app", isCorrect: false },
    { key: "B", text: "Test individual components", isCorrect: true },
    { key: "C", text: "Design UI", isCorrect: false },
    { key: "D", text: "Monitor server", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which data structure is best for fast lookups?",
  explanation: "Hash maps provide O(1) lookup.",
  options: [
    { key: "A", text: "Array", isCorrect: false },
    { key: "B", text: "Hash Map", isCorrect: true },
    { key: "C", text: "Linked List", isCorrect: false },
    { key: "D", text: "Stack", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is dependency injection?",
  explanation: "Inject dependencies instead of creating them.",
  options: [
    { key: "A", text: "Hardcoding", isCorrect: false },
    { key: "B", text: "Providing dependencies externally", isCorrect: true },
    { key: "C", text: "Database linking", isCorrect: false },
    { key: "D", text: "UI styling", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "You are designing a system that must handle frequent read operations with minimal latency. Which approach would best optimize performance?",
  explanation: "Caching frequently accessed data reduces latency.",
  options: [
    { key: "A", text: "Use caching (e.g., Redis)", isCorrect: true },
    { key: "B", text: "Increase database normalization", isCorrect: false },
    { key: "C", text: "Use only relational database", isCorrect: false },
    { key: "D", text: "Disable indexing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is the main advantage of using a message queue in distributed systems?",
  explanation: "Queues decouple services and improve scalability.",
  options: [
    { key: "A", text: "Tight coupling between services", isCorrect: false },
    { key: "B", text: "Improved decoupling and scalability", isCorrect: true },
    { key: "C", text: "Faster UI rendering", isCorrect: false },
    { key: "D", text: "Direct database access", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which sorting algorithm has the best average-case time complexity of O(n log n)?",
  explanation: "Merge sort and quicksort both achieve O(n log n).",
  options: [
    { key: "A", text: "Bubble sort", isCorrect: false },
    { key: "B", text: "Insertion sort", isCorrect: false },
    { key: "C", text: "Merge sort", isCorrect: true },
    { key: "D", text: "Selection sort", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "You are experiencing deadlocks in a multi-threaded application. What is a common strategy to prevent them?",
  explanation: "Consistent lock ordering avoids deadlocks.",
  options: [
    { key: "A", text: "Increase thread count", isCorrect: false },
    { key: "B", text: "Use consistent lock ordering", isCorrect: true },
    { key: "C", text: "Ignore synchronization", isCorrect: false },
    { key: "D", text: "Restart application", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is the purpose of using indexes in a database?",
  explanation: "Indexes improve search performance.",
  options: [
    { key: "A", text: "Reduce storage size", isCorrect: false },
    { key: "B", text: "Improve query performance", isCorrect: true },
    { key: "C", text: "Increase redundancy", isCorrect: false },
    { key: "D", text: "Enhance UI", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "In RESTful APIs, what does statelessness mean?",
  explanation: "Each request contains all required info.",
  options: [
    { key: "A", text: "Server stores session data", isCorrect: false },
    { key: "B", text: "Each request is independent", isCorrect: true },
    { key: "C", text: "Client stores nothing", isCorrect: false },
    { key: "D", text: "Database is removed", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which design principle suggests that a class should have only one reason to change?",
  explanation: "Single Responsibility Principle.",
  options: [
    { key: "A", text: "Open/Closed Principle", isCorrect: false },
    { key: "B", text: "Single Responsibility Principle", isCorrect: true },
    { key: "C", text: "Liskov Substitution", isCorrect: false },
    { key: "D", text: "Dependency Inversion", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "You need to ensure high availability in your system. Which approach is most effective?",
  explanation: "Redundancy ensures system uptime.",
  options: [
    { key: "A", text: "Single server setup", isCorrect: false },
    { key: "B", text: "Redundant systems with failover", isCorrect: true },
    { key: "C", text: "Disable backups", isCorrect: false },
    { key: "D", text: "Manual monitoring only", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is the main purpose of load balancing?",
  explanation: "Distributes traffic evenly.",
  options: [
    { key: "A", text: "Store data", isCorrect: false },
    { key: "B", text: "Distribute requests across servers", isCorrect: true },
    { key: "C", text: "Increase code complexity", isCorrect: false },
    { key: "D", text: "Reduce database size", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which of the following is a NoSQL database?",
  explanation: "MongoDB is document-based NoSQL.",
  options: [
    { key: "A", text: "MySQL", isCorrect: false },
    { key: "B", text: "PostgreSQL", isCorrect: false },
    { key: "C", text: "MongoDB", isCorrect: true },
    { key: "D", text: "Oracle", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is horizontal scaling?",
  explanation: "Adding more machines to handle load.",
  options: [
    { key: "A", text: "Increase RAM", isCorrect: false },
    { key: "B", text: "Add more servers", isCorrect: true },
    { key: "C", text: "Optimize code only", isCorrect: false },
    { key: "D", text: "Remove services", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which concept ensures that a system continues to operate despite failures?",
  explanation: "Fault tolerance handles failures.",
  options: [
    { key: "A", text: "Latency", isCorrect: false },
    { key: "B", text: "Fault tolerance", isCorrect: true },
    { key: "C", text: "Throughput", isCorrect: false },
    { key: "D", text: "Bandwidth", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "You are optimizing a database query that is slow due to joins. What is a possible solution?",
  explanation: "Indexes improve join performance.",
  options: [
    { key: "A", text: "Remove joins", isCorrect: false },
    { key: "B", text: "Add indexes", isCorrect: true },
    { key: "C", text: "Increase UI speed", isCorrect: false },
    { key: "D", text: "Restart server", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is a memory leak?",
  explanation: "Unused memory not released.",
  options: [
    { key: "A", text: "Data loss", isCorrect: false },
    { key: "B", text: "Unreleased memory", isCorrect: true },
    { key: "C", text: "Slow network", isCorrect: false },
    { key: "D", text: "Database crash", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which tool is commonly used for version control?",
  explanation: "Git is standard version control.",
  options: [
    { key: "A", text: "Docker", isCorrect: false },
    { key: "B", text: "Git", isCorrect: true },
    { key: "C", text: "Jenkins", isCorrect: false },
    { key: "D", text: "Kubernetes", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is the purpose of CI/CD pipelines?",
  explanation: "Automates testing and deployment.",
  options: [
    { key: "A", text: "Manual coding", isCorrect: false },
    { key: "B", text: "Automate build and deployment", isCorrect: true },
    { key: "C", text: "UI design", isCorrect: false },
    { key: "D", text: "Database storage", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which principle allows extending functionality without modifying existing code?",
  explanation: "Open/Closed Principle.",
  options: [
    { key: "A", text: "Single Responsibility", isCorrect: false },
    { key: "B", text: "Open/Closed Principle", isCorrect: true },
    { key: "C", text: "Encapsulation", isCorrect: false },
    { key: "D", text: "Abstraction", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is the role of a reverse proxy?",
  explanation: "Routes requests and improves performance/security.",
  options: [
    { key: "A", text: "Store data", isCorrect: false },
    { key: "B", text: "Route client requests to servers", isCorrect: true },
    { key: "C", text: "Compile code", isCorrect: false },
    { key: "D", text: "Design UI", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "Which algorithm technique uses divide and conquer?",
  explanation: "Merge sort divides and merges.",
  options: [
    { key: "A", text: "Linear search", isCorrect: false },
    { key: "B", text: "Merge sort", isCorrect: true },
    { key: "C", text: "Bubble sort", isCorrect: false },
    { key: "D", text: "Selection sort", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.SOFTWARE_ENGINEER,
  question: "What is the purpose of logging in production systems?",
  explanation: "Logs help debugging and monitoring.",
  options: [
    { key: "A", text: "Increase UI speed", isCorrect: false },
    { key: "B", text: "Track system behavior and errors", isCorrect: true },
    { key: "C", text: "Replace testing", isCorrect: false },
    { key: "D", text: "Reduce memory", isCorrect: false },
  ],
},




// ================= FRONTEND DEVELOPER (30 PROFESSIONAL QUESTIONS) =================

{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "You are building a responsive web application. Which CSS approach is best suited to handle different screen sizes efficiently?",
  explanation: "Media queries enable responsive layouts.",
  options: [
    { key: "A", text: "Inline styles", isCorrect: false },
    { key: "B", text: "Media queries", isCorrect: true },
    { key: "C", text: "Fixed layouts", isCorrect: false },
    { key: "D", text: "Tables", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the main purpose of the virtual DOM in React?",
  explanation: "Virtual DOM improves performance by minimizing direct DOM updates.",
  options: [
    { key: "A", text: "Store data permanently", isCorrect: false },
    { key: "B", text: "Improve rendering performance", isCorrect: true },
    { key: "C", text: "Replace backend", isCorrect: false },
    { key: "D", text: "Handle database queries", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "You notice unnecessary re-renders in your React app. What is the best optimization technique?",
  explanation: "Memoization reduces unnecessary renders.",
  options: [
    { key: "A", text: "useEffect everywhere", isCorrect: false },
    { key: "B", text: "React.memo / useMemo", isCorrect: true },
    { key: "C", text: "Inline functions", isCorrect: false },
    { key: "D", text: "Remove state", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which HTML element is semantically correct for navigation links?",
  explanation: "<nav> is used for navigation sections.",
  options: [
    { key: "A", text: "<div>", isCorrect: false },
    { key: "B", text: "<nav>", isCorrect: true },
    { key: "C", text: "<span>", isCorrect: false },
    { key: "D", text: "<section>", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What problem does lazy loading solve?",
  explanation: "Lazy loading improves performance by loading resources on demand.",
  options: [
    { key: "A", text: "Database performance", isCorrect: false },
    { key: "B", text: "Initial load time reduction", isCorrect: true },
    { key: "C", text: "Code duplication", isCorrect: false },
    { key: "D", text: "Security issues", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which CSS layout is best for one-dimensional layouts?",
  explanation: "Flexbox is ideal for one-dimensional layouts.",
  options: [
    { key: "A", text: "Grid", isCorrect: false },
    { key: "B", text: "Flexbox", isCorrect: true },
    { key: "C", text: "Float", isCorrect: false },
    { key: "D", text: "Table", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the purpose of useEffect in React?",
  explanation: "Handles side effects such as API calls.",
  options: [
    { key: "A", text: "Manage state", isCorrect: false },
    { key: "B", text: "Handle side effects", isCorrect: true },
    { key: "C", text: "Render UI", isCorrect: false },
    { key: "D", text: "Store data", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "You are fetching data from an API. Which approach prevents unnecessary re-fetching?",
  explanation: "Dependency array controls re-runs.",
  options: [
    { key: "A", text: "No dependencies", isCorrect: false },
    { key: "B", text: "Proper dependency array in useEffect", isCorrect: true },
    { key: "C", text: "Fetch inside render", isCorrect: false },
    { key: "D", text: "Global variable", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is accessibility (a11y) in frontend development?",
  explanation: "Ensures usability for all users.",
  options: [
    { key: "A", text: "UI styling", isCorrect: false },
    { key: "B", text: "Making apps usable for all users", isCorrect: true },
    { key: "C", text: "Backend logic", isCorrect: false },
    { key: "D", text: "Database optimization", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which tool is used for state management in large React apps?",
  explanation: "Redux helps manage global state.",
  options: [
    { key: "A", text: "HTML", isCorrect: false },
    { key: "B", text: "Redux", isCorrect: true },
    { key: "C", text: "CSS", isCorrect: false },
    { key: "D", text: "SQL", isCorrect: false },
  ],
},

// --- MEDIUM / SCENARIO ---
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "You need to share state between deeply nested components. What is the best approach?",
  explanation: "Context API avoids prop drilling.",
  options: [
    { key: "A", text: "Prop drilling", isCorrect: false },
    { key: "B", text: "Context API", isCorrect: true },
    { key: "C", text: "Local state only", isCorrect: false },
    { key: "D", text: "Inline variables", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the main benefit of code splitting?",
  explanation: "Reduces bundle size and improves performance.",
  options: [
    { key: "A", text: "Increase bundle size", isCorrect: false },
    { key: "B", text: "Load code on demand", isCorrect: true },
    { key: "C", text: "Improve database speed", isCorrect: false },
    { key: "D", text: "Fix bugs", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which HTTP status indicates resource not found?",
  explanation: "404 means not found.",
  options: [
    { key: "A", text: "200", isCorrect: false },
    { key: "B", text: "404", isCorrect: true },
    { key: "C", text: "500", isCorrect: false },
    { key: "D", text: "301", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is hydration in modern frontend frameworks?",
  explanation: "Attaching event listeners to server-rendered HTML.",
  options: [
    { key: "A", text: "CSS loading", isCorrect: false },
    { key: "B", text: "Making HTML interactive", isCorrect: true },
    { key: "C", text: "Database sync", isCorrect: false },
    { key: "D", text: "API caching", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "You are optimizing images for performance. What is the best approach?",
  explanation: "Use modern formats and lazy loading.",
  options: [
    { key: "A", text: "Use large images", isCorrect: false },
    { key: "B", text: "Compress and lazy load images", isCorrect: true },
    { key: "C", text: "Disable images", isCorrect: false },
    { key: "D", text: "Use only PNG", isCorrect: false },
  ],
},

// --- HARD ---
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the difference between CSR and SSR?",
  explanation: "CSR renders on client, SSR on server.",
  options: [
    { key: "A", text: "No difference", isCorrect: false },
    { key: "B", text: "CSR = client, SSR = server rendering", isCorrect: true },
    { key: "C", text: "SSR is frontend only", isCorrect: false },
    { key: "D", text: "CSR uses database", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which hook is used to persist values without re-render?",
  explanation: "useRef does not trigger re-render.",
  options: [
    { key: "A", text: "useState", isCorrect: false },
    { key: "B", text: "useRef", isCorrect: true },
    { key: "C", text: "useEffect", isCorrect: false },
    { key: "D", text: "useMemo", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is tree shaking?",
  explanation: "Removes unused code from bundle.",
  options: [
    { key: "A", text: "Code splitting", isCorrect: false },
    { key: "B", text: "Removing unused code", isCorrect: true },
    { key: "C", text: "Minification", isCorrect: false },
    { key: "D", text: "Compilation", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which CSS property controls stacking order?",
  explanation: "z-index controls stacking.",
  options: [
    { key: "A", text: "position", isCorrect: false },
    { key: "B", text: "z-index", isCorrect: true },
    { key: "C", text: "display", isCorrect: false },
    { key: "D", text: "overflow", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the purpose of debouncing?",
  explanation: "Limits function calls.",
  options: [
    { key: "A", text: "Increase calls", isCorrect: false },
    { key: "B", text: "Limit frequent executions", isCorrect: true },
    { key: "C", text: "Improve UI design", isCorrect: false },
    { key: "D", text: "Database caching", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is throttling?",
  explanation: "Limits execution rate.",
  options: [
    { key: "A", text: "Run continuously", isCorrect: false },
    { key: "B", text: "Limit execution frequency", isCorrect: true },
    { key: "C", text: "Delay execution", isCorrect: false },
    { key: "D", text: "Stop execution", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which browser API is used for storing key-value pairs locally?",
  explanation: "localStorage stores data in browser.",
  options: [
    { key: "A", text: "sessionStorage", isCorrect: false },
    { key: "B", text: "localStorage", isCorrect: true },
    { key: "C", text: "cookies", isCorrect: false },
    { key: "D", text: "cache API", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the purpose of service workers?",
  explanation: "Enable offline capabilities and caching.",
  options: [
    { key: "A", text: "Database management", isCorrect: false },
    { key: "B", text: "Offline support and caching", isCorrect: true },
    { key: "C", text: "UI rendering", isCorrect: false },
    { key: "D", text: "State management", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which CSS unit is relative to root element?",
  explanation: "rem is relative to root.",
  options: [
    { key: "A", text: "px", isCorrect: false },
    { key: "B", text: "rem", isCorrect: true },
    { key: "C", text: "%", isCorrect: false },
    { key: "D", text: "vh", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is hydration mismatch?",
  explanation: "Difference between server and client render.",
  options: [
    { key: "A", text: "CSS issue", isCorrect: false },
    { key: "B", text: "Mismatch between SSR and client render", isCorrect: true },
    { key: "C", text: "Database issue", isCorrect: false },
    { key: "D", text: "API failure", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "You are building a form-heavy application. What is the best way to manage complex form state in React?",
  explanation: "Libraries like React Hook Form simplify form handling and validation.",
  options: [
    { key: "A", text: "Manual DOM manipulation", isCorrect: false },
    { key: "B", text: "React Hook Form / Formik", isCorrect: true },
    { key: "C", text: "Inline variables", isCorrect: false },
    { key: "D", text: "CSS only", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the main benefit of using TypeScript in frontend development?",
  explanation: "TypeScript adds static typing and improves code reliability.",
  options: [
    { key: "A", text: "Faster runtime execution", isCorrect: false },
    { key: "B", text: "Static type checking", isCorrect: true },
    { key: "C", text: "Better CSS styling", isCorrect: false },
    { key: "D", text: "Automatic deployment", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "You need to prevent unnecessary API calls while typing in a search input. What technique should you use?",
  explanation: "Debouncing delays execution until user stops typing.",
  options: [
    { key: "A", text: "Throttling", isCorrect: false },
    { key: "B", text: "Debouncing", isCorrect: true },
    { key: "C", text: "Memoization", isCorrect: false },
    { key: "D", text: "Polling", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the purpose of the key prop in React lists?",
  explanation: "Keys help React efficiently update elements.",
  options: [
    { key: "A", text: "Style elements", isCorrect: false },
    { key: "B", text: "Identify list items uniquely", isCorrect: true },
    { key: "C", text: "Store data", isCorrect: false },
    { key: "D", text: "Handle API calls", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which approach improves performance when rendering large lists?",
  explanation: "Virtualization renders only visible items.",
  options: [
    { key: "A", text: "Render all items", isCorrect: false },
    { key: "B", text: "List virtualization (e.g., react-window)", isCorrect: true },
    { key: "C", text: "Inline loops", isCorrect: false },
    { key: "D", text: "Use CSS grid", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is event delegation in JavaScript?",
  explanation: "Attaching event listener to parent to handle children.",
  options: [
    { key: "A", text: "Handling events individually", isCorrect: false },
    { key: "B", text: "Using parent listener for child elements", isCorrect: true },
    { key: "C", text: "Stopping events", isCorrect: false },
    { key: "D", text: "Async events", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which HTTP method is typically used to update existing resources?",
  explanation: "PUT or PATCH updates resources.",
  options: [
    { key: "A", text: "GET", isCorrect: false },
    { key: "B", text: "POST", isCorrect: false },
    { key: "C", text: "PUT/PATCH", isCorrect: true },
    { key: "D", text: "DELETE", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the purpose of the viewport meta tag?",
  explanation: "Controls layout on mobile devices.",
  options: [
    { key: "A", text: "SEO optimization", isCorrect: false },
    { key: "B", text: "Responsive design control", isCorrect: true },
    { key: "C", text: "JavaScript execution", isCorrect: false },
    { key: "D", text: "Database connection", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "You want to persist user authentication state on refresh. What is the best approach?",
  explanation: "Tokens stored in cookies/localStorage persist sessions.",
  options: [
    { key: "A", text: "useState only", isCorrect: false },
    { key: "B", text: "Store token in localStorage or cookies", isCorrect: true },
    { key: "C", text: "Console log", isCorrect: false },
    { key: "D", text: "CSS variables", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is Cross-Site Scripting (XSS)?",
  explanation: "XSS injects malicious scripts into web pages.",
  options: [
    { key: "A", text: "Database attack", isCorrect: false },
    { key: "B", text: "Script injection attack", isCorrect: true },
    { key: "C", text: "Network issue", isCorrect: false },
    { key: "D", text: "Performance issue", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which technique helps improve perceived performance while data loads?",
  explanation: "Skeleton loaders improve UX.",
  options: [
    { key: "A", text: "Blocking UI", isCorrect: false },
    { key: "B", text: "Skeleton loading screens", isCorrect: true },
    { key: "C", text: "Disable UI", isCorrect: false },
    { key: "D", text: "Console logs", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the difference between controlled and uncontrolled components in React?",
  explanation: "Controlled uses state, uncontrolled uses DOM.",
  options: [
    { key: "A", text: "No difference", isCorrect: false },
    { key: "B", text: "Controlled uses React state", isCorrect: true },
    { key: "C", text: "Uncontrolled uses API", isCorrect: false },
    { key: "D", text: "Both same", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "Which browser API allows background tasks and caching for offline apps?",
  explanation: "Service workers enable offline capabilities.",
  options: [
    { key: "A", text: "WebSocket", isCorrect: false },
    { key: "B", text: "Service Worker", isCorrect: true },
    { key: "C", text: "Fetch API", isCorrect: false },
    { key: "D", text: "DOM API", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is the main use of Intersection Observer API?",
  explanation: "Detects element visibility.",
  options: [
    { key: "A", text: "Handle clicks", isCorrect: false },
    { key: "B", text: "Detect element visibility in viewport", isCorrect: true },
    { key: "C", text: "Store data", isCorrect: false },
    { key: "D", text: "Make API calls", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FRONTEND_DEVELOPER,
  question: "What is hydration error commonly caused by in SSR apps?",
  explanation: "Mismatch between server and client output.",
  options: [
    { key: "A", text: "CSS loading", isCorrect: false },
    { key: "B", text: "Mismatch between server and client render", isCorrect: true },
    { key: "C", text: "API timeout", isCorrect: false },
    { key: "D", text: "Database issue", isCorrect: false },
  ],
},



// ================= BACKEND DEVELOPER (40 PROFESSIONAL QUESTIONS) =================

{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is the primary responsibility of a backend server in a web application?",
  explanation: "Backend handles business logic, database operations, and APIs.",
  options: [
    { key: "A", text: "Styling UI", isCorrect: false },
    { key: "B", text: "Handling business logic and data processing", isCorrect: true },
    { key: "C", text: "Rendering HTML only", isCorrect: false },
    { key: "D", text: "Managing CSS", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "Which HTTP method is typically used to create a new resource?",
  explanation: "POST is used to create new resources.",
  options: [
    { key: "A", text: "GET", isCorrect: false },
    { key: "B", text: "POST", isCorrect: true },
    { key: "C", text: "PUT", isCorrect: false },
    { key: "D", text: "DELETE", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is the purpose of middleware in backend frameworks?",
  explanation: "Middleware processes requests before reaching route handlers.",
  options: [
    { key: "A", text: "Store data", isCorrect: false },
    { key: "B", text: "Handle request/response flow", isCorrect: true },
    { key: "C", text: "Render UI", isCorrect: false },
    { key: "D", text: "Compile code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "Which database type is best suited for handling unstructured data?",
  explanation: "NoSQL databases like MongoDB handle unstructured data.",
  options: [
    { key: "A", text: "Relational DB", isCorrect: false },
    { key: "B", text: "NoSQL DB", isCorrect: true },
    { key: "C", text: "Flat files", isCorrect: false },
    { key: "D", text: "Spreadsheets", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What does statelessness mean in REST APIs?",
  explanation: "Each request contains all necessary information.",
  options: [
    { key: "A", text: "Server stores session", isCorrect: false },
    { key: "B", text: "Each request is independent", isCorrect: true },
    { key: "C", text: "Client stores nothing", isCorrect: false },
    { key: "D", text: "Database stores session", isCorrect: false },
  ],
},

// --- SCENARIO ---
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "Your API response time is slow due to repeated database queries. What is the best solution?",
  explanation: "Caching reduces repeated DB calls.",
  options: [
    { key: "A", text: "Increase server CPU", isCorrect: false },
    { key: "B", text: "Implement caching (e.g., Redis)", isCorrect: true },
    { key: "C", text: "Remove database", isCorrect: false },
    { key: "D", text: "Use more loops", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "You need to ensure secure user authentication. Which method is most commonly used?",
  explanation: "JWT is widely used for authentication.",
  options: [
    { key: "A", text: "Plain text passwords", isCorrect: false },
    { key: "B", text: "JWT tokens", isCorrect: true },
    { key: "C", text: "CSS validation", isCorrect: false },
    { key: "D", text: "HTML forms only", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is database indexing used for?",
  explanation: "Indexes improve query performance.",
  options: [
    { key: "A", text: "Increase storage", isCorrect: false },
    { key: "B", text: "Speed up queries", isCorrect: true },
    { key: "C", text: "Reduce memory", isCorrect: false },
    { key: "D", text: "Improve UI", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is the purpose of transactions in databases?",
  explanation: "Transactions ensure data consistency.",
  options: [
    { key: "A", text: "Speed up UI", isCorrect: false },
    { key: "B", text: "Maintain data integrity", isCorrect: true },
    { key: "C", text: "Render pages", isCorrect: false },
    { key: "D", text: "Store logs", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "Which status code indicates server error?",
  explanation: "500 indicates server-side failure.",
  options: [
    { key: "A", text: "200", isCorrect: false },
    { key: "B", text: "404", isCorrect: false },
    { key: "C", text: "500", isCorrect: true },
    { key: "D", text: "301", isCorrect: false },
  ],
},

// --- MEDIUM ---
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is horizontal scaling?",
  explanation: "Adding more servers.",
  options: [
    { key: "A", text: "Increase RAM", isCorrect: false },
    { key: "B", text: "Add more servers", isCorrect: true },
    { key: "C", text: "Optimize UI", isCorrect: false },
    { key: "D", text: "Reduce code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is load balancing?",
  explanation: "Distributes traffic across servers.",
  options: [
    { key: "A", text: "Store data", isCorrect: false },
    { key: "B", text: "Distribute requests", isCorrect: true },
    { key: "C", text: "Compile code", isCorrect: false },
    { key: "D", text: "UI design", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is a RESTful API?",
  explanation: "Follows REST principles.",
  options: [
    { key: "A", text: "Database", isCorrect: false },
    { key: "B", text: "Web service using HTTP", isCorrect: true },
    { key: "C", text: "Frontend tool", isCorrect: false },
    { key: "D", text: "Compiler", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "Which tool is used for containerization?",
  explanation: "Docker packages applications.",
  options: [
    { key: "A", text: "Git", isCorrect: false },
    { key: "B", text: "Docker", isCorrect: true },
    { key: "C", text: "Figma", isCorrect: false },
    { key: "D", text: "Postman", isCorrect: false },
  ],
},

// --- HARD / SYSTEM DESIGN ---
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "In distributed systems, what is eventual consistency?",
  explanation: "Data becomes consistent over time.",
  options: [
    { key: "A", text: "Immediate consistency", isCorrect: false },
    { key: "B", text: "Consistency over time", isCorrect: true },
    { key: "C", text: "No consistency", isCorrect: false },
    { key: "D", text: "Data loss", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is a race condition?",
  explanation: "Concurrent access causing conflicts.",
  options: [
    { key: "A", text: "Slow network", isCorrect: false },
    { key: "B", text: "Concurrent conflict", isCorrect: true },
    { key: "C", text: "Memory issue", isCorrect: false },
    { key: "D", text: "UI bug", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "Which approach improves API security?",
  explanation: "Authentication + HTTPS.",
  options: [
    { key: "A", text: "Open access", isCorrect: false },
    { key: "B", text: "Authentication + HTTPS", isCorrect: true },
    { key: "C", text: "Disable logs", isCorrect: false },
    { key: "D", text: "Plain text data", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is the role of a reverse proxy?",
  explanation: "Routes requests and adds security.",
  options: [
    { key: "A", text: "Store data", isCorrect: false },
    { key: "B", text: "Route requests to servers", isCorrect: true },
    { key: "C", text: "Render UI", isCorrect: false },
    { key: "D", text: "Compile code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is database sharding?",
  explanation: "Splitting database across servers.",
  options: [
    { key: "A", text: "Backup system", isCorrect: false },
    { key: "B", text: "Splitting data across nodes", isCorrect: true },
    { key: "C", text: "Indexing", isCorrect: false },
    { key: "D", text: "Caching", isCorrect: false },
  ],
},

// --- add remaining to reach 40 ---
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is API rate limiting?",
  explanation: "Limits number of requests.",
  options: [
    { key: "A", text: "Unlimited requests", isCorrect: false },
    { key: "B", text: "Limit requests per user", isCorrect: true },
    { key: "C", text: "Database scaling", isCorrect: false },
    { key: "D", text: "UI control", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is a microservices architecture?",
  explanation: "System split into small services.",
  options: [
    { key: "A", text: "Single app", isCorrect: false },
    { key: "B", text: "Multiple independent services", isCorrect: true },
    { key: "C", text: "Frontend only", isCorrect: false },
    { key: "D", text: "Database only", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is the purpose of logging?",
  explanation: "Track system behavior.",
  options: [
    { key: "A", text: "Improve UI", isCorrect: false },
    { key: "B", text: "Debug and monitor system", isCorrect: true },
    { key: "C", text: "Store data", isCorrect: false },
    { key: "D", text: "Compile code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is connection pooling?",
  explanation: "Reuse DB connections.",
  options: [
    { key: "A", text: "Create new connection always", isCorrect: false },
    { key: "B", text: "Reuse existing connections", isCorrect: true },
    { key: "C", text: "Delete DB", isCorrect: false },
    { key: "D", text: "UI caching", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is serialization?",
  explanation: "Convert object to transferable format.",
  options: [
    { key: "A", text: "Encrypt data", isCorrect: false },
    { key: "B", text: "Convert object to JSON", isCorrect: true },
    { key: "C", text: "Delete data", isCorrect: false },
    { key: "D", text: "Render UI", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is API versioning?",
  explanation: "Manage API changes safely.",
  options: [
    { key: "A", text: "Delete API", isCorrect: false },
    { key: "B", text: "Maintain multiple API versions", isCorrect: true },
    { key: "C", text: "UI update", isCorrect: false },
    { key: "D", text: "Database change", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is a webhook?",
  explanation: "Event-based HTTP callback.",
  options: [
    { key: "A", text: "Database query", isCorrect: false },
    { key: "B", text: "Event-triggered HTTP request", isCorrect: true },
    { key: "C", text: "UI event", isCorrect: false },
    { key: "D", text: "Cache", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is idempotency?",
  explanation: "Same request produces same result.",
  options: [
    { key: "A", text: "Different output each time", isCorrect: false },
    { key: "B", text: "Same result for repeated requests", isCorrect: true },
    { key: "C", text: "Random result", isCorrect: false },
    { key: "D", text: "No output", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BACKEND_DEVELOPER,
  question: "What is a cron job?",
  explanation: "Scheduled task execution.",
  options: [
    { key: "A", text: "Manual task", isCorrect: false },
    { key: "B", text: "Scheduled job", isCorrect: true },
    { key: "C", text: "UI event", isCorrect: false },
    { key: "D", text: "Database query", isCorrect: false },
  ],
},


// ================= FULLSTACK DEVELOPER (30 PROFESSIONAL QUESTIONS) =================

{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "You are building a fullstack application. What is the main advantage of separating frontend and backend into different services?",
  explanation: "Separation improves scalability and maintainability.",
  options: [
    { key: "A", text: "Reduces code size only", isCorrect: false },
    { key: "B", text: "Improves scalability and separation of concerns", isCorrect: true },
    { key: "C", text: "Removes need for database", isCorrect: false },
    { key: "D", text: "Faster UI rendering only", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "Which approach allows sharing logic between frontend and backend in a TypeScript-based application?",
  explanation: "Shared types improve consistency.",
  options: [
    { key: "A", text: "Duplicate code", isCorrect: false },
    { key: "B", text: "Shared types/interfaces", isCorrect: true },
    { key: "C", text: "Inline scripts", isCorrect: false },
    { key: "D", text: "CSS reuse", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is the purpose of an API layer in a fullstack app?",
  explanation: "API connects frontend and backend.",
  options: [
    { key: "A", text: "UI rendering", isCorrect: false },
    { key: "B", text: "Communication between client and server", isCorrect: true },
    { key: "C", text: "Database storage", isCorrect: false },
    { key: "D", text: "Styling", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "You need to handle user authentication across frontend and backend. What is the best approach?",
  explanation: "JWT or session-based auth is standard.",
  options: [
    { key: "A", text: "Store passwords in frontend", isCorrect: false },
    { key: "B", text: "Use JWT or session-based authentication", isCorrect: true },
    { key: "C", text: "Use CSS tokens", isCorrect: false },
    { key: "D", text: "Hardcode users", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "Which technique improves performance by loading data only when needed?",
  explanation: "Lazy loading reduces unnecessary data fetching.",
  options: [
    { key: "A", text: "Preloading everything", isCorrect: false },
    { key: "B", text: "Lazy loading", isCorrect: true },
    { key: "C", text: "Inline scripts", isCorrect: false },
    { key: "D", text: "Blocking rendering", isCorrect: false },
  ],
},

// --- SCENARIO ---
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "Your frontend is making too many API calls causing performance issues. What is the best solution?",
  explanation: "Debouncing or batching reduces API calls.",
  options: [
    { key: "A", text: "Increase API calls", isCorrect: false },
    { key: "B", text: "Debounce or batch requests", isCorrect: true },
    { key: "C", text: "Remove backend", isCorrect: false },
    { key: "D", text: "Use console logs", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "You need to keep frontend and backend data consistent. What approach helps?",
  explanation: "State synchronization ensures consistency.",
  options: [
    { key: "A", text: "Ignore backend updates", isCorrect: false },
    { key: "B", text: "Use centralized state management", isCorrect: true },
    { key: "C", text: "Manual refresh only", isCorrect: false },
    { key: "D", text: "CSS sync", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "You are building a dashboard with real-time updates. Which technology is most suitable?",
  explanation: "WebSockets enable real-time communication.",
  options: [
    { key: "A", text: "HTTP polling", isCorrect: false },
    { key: "B", text: "WebSockets", isCorrect: true },
    { key: "C", text: "Static HTML", isCorrect: false },
    { key: "D", text: "CSS animations", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is the benefit of server-side rendering (SSR)?",
  explanation: "SSR improves SEO and initial load.",
  options: [
    { key: "A", text: "Slower load", isCorrect: false },
    { key: "B", text: "Better SEO and faster initial render", isCorrect: true },
    { key: "C", text: "Removes backend", isCorrect: false },
    { key: "D", text: "Only for CSS", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "Which database approach is best when your app requires strict relationships between data?",
  explanation: "Relational DBs enforce relationships.",
  options: [
    { key: "A", text: "NoSQL", isCorrect: false },
    { key: "B", text: "Relational database", isCorrect: true },
    { key: "C", text: "Flat files", isCorrect: false },
    { key: "D", text: "Local storage", isCorrect: false },
  ],
},

// --- MEDIUM ---
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is CORS and why is it important?",
  explanation: "CORS controls cross-origin requests.",
  options: [
    { key: "A", text: "Database tool", isCorrect: false },
    { key: "B", text: "Security mechanism for cross-origin requests", isCorrect: true },
    { key: "C", text: "UI library", isCorrect: false },
    { key: "D", text: "Testing tool", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "Which method is used to update partial resources in REST APIs?",
  explanation: "PATCH updates partially.",
  options: [
    { key: "A", text: "GET", isCorrect: false },
    { key: "B", text: "PATCH", isCorrect: true },
    { key: "C", text: "POST", isCorrect: false },
    { key: "D", text: "DELETE", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is environment configuration used for?",
  explanation: "Separates dev, test, and production settings.",
  options: [
    { key: "A", text: "UI styling", isCorrect: false },
    { key: "B", text: "Manage different environment settings", isCorrect: true },
    { key: "C", text: "Database schema", isCorrect: false },
    { key: "D", text: "Frontend routing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is API pagination used for?",
  explanation: "Handles large datasets efficiently.",
  options: [
    { key: "A", text: "Delete data", isCorrect: false },
    { key: "B", text: "Limit data per request", isCorrect: true },
    { key: "C", text: "Improve UI design", isCorrect: false },
    { key: "D", text: "Store files", isCorrect: false },
  ],
},

// --- HARD ---
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "You are scaling a fullstack app. What architecture supports independent deployment of frontend and backend?",
  explanation: "Microservices or decoupled architecture.",
  options: [
    { key: "A", text: "Monolith", isCorrect: false },
    { key: "B", text: "Microservices / decoupled", isCorrect: true },
    { key: "C", text: "Static site", isCorrect: false },
    { key: "D", text: "Single server", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is caching used for in fullstack apps?",
  explanation: "Reduces repeated computations and DB calls.",
  options: [
    { key: "A", text: "Increase load", isCorrect: false },
    { key: "B", text: "Improve performance", isCorrect: true },
    { key: "C", text: "Delete data", isCorrect: false },
    { key: "D", text: "Improve UI", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is GraphQL used for?",
  explanation: "Flexible data fetching.",
  options: [
    { key: "A", text: "Styling", isCorrect: false },
    { key: "B", text: "Querying APIs efficiently", isCorrect: true },
    { key: "C", text: "Database storage", isCorrect: false },
    { key: "D", text: "Testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "Which strategy helps reduce bundle size in frontend apps?",
  explanation: "Code splitting reduces bundle size.",
  options: [
    { key: "A", text: "Add more code", isCorrect: false },
    { key: "B", text: "Code splitting", isCorrect: true },
    { key: "C", text: "Inline scripts", isCorrect: false },
    { key: "D", text: "Disable caching", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is the role of CI/CD in fullstack development?",
  explanation: "Automates build, test, deployment.",
  options: [
    { key: "A", text: "Manual deployment", isCorrect: false },
    { key: "B", text: "Automate development pipeline", isCorrect: true },
    { key: "C", text: "UI design", isCorrect: false },
    { key: "D", text: "Database design", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is the purpose of API gateway?",
  explanation: "Central entry point for APIs.",
  options: [
    { key: "A", text: "UI rendering", isCorrect: false },
    { key: "B", text: "Route and manage API requests", isCorrect: true },
    { key: "C", text: "Database storage", isCorrect: false },
    { key: "D", text: "Testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is optimistic UI update?",
  explanation: "UI updates before server confirms.",
  options: [
    { key: "A", text: "Wait for server", isCorrect: false },
    { key: "B", text: "Update UI immediately", isCorrect: true },
    { key: "C", text: "Disable UI", isCorrect: false },
    { key: "D", text: "Reload page", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is rate limiting used for?",
  explanation: "Prevents abuse of APIs.",
  options: [
    { key: "A", text: "Increase traffic", isCorrect: false },
    { key: "B", text: "Control API usage", isCorrect: true },
    { key: "C", text: "Improve UI", isCorrect: false },
    { key: "D", text: "Store data", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is serverless architecture?",
  explanation: "Runs code without managing servers.",
  options: [
    { key: "A", text: "Manual servers", isCorrect: false },
    { key: "B", text: "Cloud-managed execution", isCorrect: true },
    { key: "C", text: "Local apps", isCorrect: false },
    { key: "D", text: "Static hosting", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.FULLSTACK_DEVELOPER,
  question: "What is data validation used for?",
  explanation: "Ensures data correctness.",
  options: [
    { key: "A", text: "UI design", isCorrect: false },
    { key: "B", text: "Ensure correct input", isCorrect: true },
    { key: "C", text: "Database scaling", isCorrect: false },
    { key: "D", text: "Testing", isCorrect: false },
  ],
},




// ================= QA ENGINEER (40 PROFESSIONAL QUESTIONS) =================

{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is the primary goal of software testing?",
  explanation: "Testing ensures quality by identifying defects before release.",
  options: [
    { key: "A", text: "Write code", isCorrect: false },
    { key: "B", text: "Identify defects and ensure quality", isCorrect: true },
    { key: "C", text: "Deploy application", isCorrect: false },
    { key: "D", text: "Design UI", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is the difference between verification and validation?",
  explanation: "Verification checks if built right, validation checks right product.",
  options: [
    { key: "A", text: "Same thing", isCorrect: false },
    { key: "B", text: "Verification = build right, Validation = right product", isCorrect: true },
    { key: "C", text: "Validation only UI", isCorrect: false },
    { key: "D", text: "Verification only DB", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "Which type of testing focuses on individual components?",
  explanation: "Unit testing validates small components.",
  options: [
    { key: "A", text: "Integration testing", isCorrect: false },
    { key: "B", text: "Unit testing", isCorrect: true },
    { key: "C", text: "System testing", isCorrect: false },
    { key: "D", text: "Acceptance testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is regression testing?",
  explanation: "Ensures new changes don’t break existing features.",
  options: [
    { key: "A", text: "Testing new features only", isCorrect: false },
    { key: "B", text: "Re-testing existing functionality after changes", isCorrect: true },
    { key: "C", text: "UI testing", isCorrect: false },
    { key: "D", text: "Load testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is a test case?",
  explanation: "Defines inputs, steps, and expected results.",
  options: [
    { key: "A", text: "Bug report", isCorrect: false },
    { key: "B", text: "Set of steps to verify functionality", isCorrect: true },
    { key: "C", text: "Code file", isCorrect: false },
    { key: "D", text: "Deployment script", isCorrect: false },
  ],
},

// --- SCENARIO ---
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "You found a critical bug in production. What is the FIRST action?",
  explanation: "Reproduce and understand issue before fixing.",
  options: [
    { key: "A", text: "Ignore it", isCorrect: false },
    { key: "B", text: "Reproduce the issue", isCorrect: true },
    { key: "C", text: "Delete code", isCorrect: false },
    { key: "D", text: "Deploy immediately", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "A feature works in development but fails in production. What should you check first?",
  explanation: "Environment differences are common causes.",
  options: [
    { key: "A", text: "UI design", isCorrect: false },
    { key: "B", text: "Environment configuration differences", isCorrect: true },
    { key: "C", text: "CSS styling", isCorrect: false },
    { key: "D", text: "Fonts", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "You need to test how system behaves under heavy load. Which testing type is used?",
  explanation: "Load testing checks performance under traffic.",
  options: [
    { key: "A", text: "Unit testing", isCorrect: false },
    { key: "B", text: "Load testing", isCorrect: true },
    { key: "C", text: "UI testing", isCorrect: false },
    { key: "D", text: "Smoke testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "A bug occurs only occasionally and is hard to reproduce. What type of bug is this?",
  explanation: "Intermittent bugs are inconsistent.",
  options: [
    { key: "A", text: "Critical bug", isCorrect: false },
    { key: "B", text: "Intermittent bug", isCorrect: true },
    { key: "C", text: "UI bug", isCorrect: false },
    { key: "D", text: "Minor bug", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "Which testing ensures system meets business requirements?",
  explanation: "Acceptance testing validates requirements.",
  options: [
    { key: "A", text: "Unit testing", isCorrect: false },
    { key: "B", text: "Acceptance testing", isCorrect: true },
    { key: "C", text: "Integration testing", isCorrect: false },
    { key: "D", text: "Regression testing", isCorrect: false },
  ],
},

// --- AUTOMATION ---
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is the purpose of test automation?",
  explanation: "Automation speeds up repetitive testing.",
  options: [
    { key: "A", text: "Manual testing only", isCorrect: false },
    { key: "B", text: "Automate repetitive tests", isCorrect: true },
    { key: "C", text: "Write backend code", isCorrect: false },
    { key: "D", text: "Design UI", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "Which tool is commonly used for UI automation testing?",
  explanation: "Selenium automates browser testing.",
  options: [
    { key: "A", text: "MySQL", isCorrect: false },
    { key: "B", text: "Selenium", isCorrect: true },
    { key: "C", text: "Docker", isCorrect: false },
    { key: "D", text: "Git", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is CI/CD in testing?",
  explanation: "Automates build and test pipelines.",
  options: [
    { key: "A", text: "Manual testing", isCorrect: false },
    { key: "B", text: "Automated integration and deployment", isCorrect: true },
    { key: "C", text: "Database setup", isCorrect: false },
    { key: "D", text: "UI design", isCorrect: false },
  ],
},

// --- MEDIUM ---
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is boundary value analysis?",
  explanation: "Tests edge values of input ranges.",
  options: [
    { key: "A", text: "Testing middle values", isCorrect: false },
    { key: "B", text: "Testing edge values", isCorrect: true },
    { key: "C", text: "Testing UI", isCorrect: false },
    { key: "D", text: "Testing DB", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is equivalence partitioning?",
  explanation: "Divides input into valid groups.",
  options: [
    { key: "A", text: "Random testing", isCorrect: false },
    { key: "B", text: "Divide inputs into groups", isCorrect: true },
    { key: "C", text: "Load testing", isCorrect: false },
    { key: "D", text: "Security testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is smoke testing?",
  explanation: "Basic test to check system stability.",
  options: [
    { key: "A", text: "Full testing", isCorrect: false },
    { key: "B", text: "Basic functionality check", isCorrect: true },
    { key: "C", text: "Performance testing", isCorrect: false },
    { key: "D", text: "Security testing", isCorrect: false },
  ],
},

// --- HARD ---
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is a test pyramid?",
  explanation: "Strategy prioritizing unit tests over UI tests.",
  options: [
    { key: "A", text: "UI testing model", isCorrect: false },
    { key: "B", text: "Testing strategy structure", isCorrect: true },
    { key: "C", text: "Database model", isCorrect: false },
    { key: "D", text: "API structure", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is flaky test?",
  explanation: "Test that gives inconsistent results.",
  options: [
    { key: "A", text: "Always pass", isCorrect: false },
    { key: "B", text: "Inconsistent result test", isCorrect: true },
    { key: "C", text: "Slow test", isCorrect: false },
    { key: "D", text: "Manual test", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is test coverage?",
  explanation: "Measures how much code is tested.",
  options: [
    { key: "A", text: "UI design", isCorrect: false },
    { key: "B", text: "Amount of code tested", isCorrect: true },
    { key: "C", text: "Number of bugs", isCorrect: false },
    { key: "D", text: "Deployment speed", isCorrect: false },
  ],
},

// --- fill to 40 ---
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is exploratory testing?",
  explanation: "Testing without predefined cases.",
  options: [
    { key: "A", text: "Scripted testing", isCorrect: false },
    { key: "B", text: "Ad-hoc testing approach", isCorrect: true },
    { key: "C", text: "Automation only", isCorrect: false },
    { key: "D", text: "Load testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is defect lifecycle?",
  explanation: "Stages a bug goes through.",
  options: [
    { key: "A", text: "UI cycle", isCorrect: false },
    { key: "B", text: "Bug life stages", isCorrect: true },
    { key: "C", text: "Database flow", isCorrect: false },
    { key: "D", text: "Code flow", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is severity vs priority?",
  explanation: "Severity = impact, Priority = urgency.",
  options: [
    { key: "A", text: "Same", isCorrect: false },
    { key: "B", text: "Severity = impact, Priority = urgency", isCorrect: true },
    { key: "C", text: "Priority = impact", isCorrect: false },
    { key: "D", text: "Severity = urgency", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is API testing?",
  explanation: "Testing backend endpoints.",
  options: [
    { key: "A", text: "UI testing", isCorrect: false },
    { key: "B", text: "Testing APIs directly", isCorrect: true },
    { key: "C", text: "CSS testing", isCorrect: false },
    { key: "D", text: "Manual testing only", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is performance testing?",
  explanation: "Evaluates system under load.",
  options: [
    { key: "A", text: "UI test", isCorrect: false },
    { key: "B", text: "Test system performance", isCorrect: true },
    { key: "C", text: "Database test", isCorrect: false },
    { key: "D", text: "Security test", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is usability testing?",
  explanation: "Checks user experience.",
  options: [
    { key: "A", text: "Backend test", isCorrect: false },
    { key: "B", text: "User experience testing", isCorrect: true },
    { key: "C", text: "Database test", isCorrect: false },
    { key: "D", text: "Security test", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is security testing?",
  explanation: "Finds vulnerabilities.",
  options: [
    { key: "A", text: "UI design", isCorrect: false },
    { key: "B", text: "Identify security flaws", isCorrect: true },
    { key: "C", text: "Database scaling", isCorrect: false },
    { key: "D", text: "Performance test", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is stress testing?",
  explanation: "Tests system beyond limits.",
  options: [
    { key: "A", text: "Normal load", isCorrect: false },
    { key: "B", text: "Extreme load testing", isCorrect: true },
    { key: "C", text: "UI test", isCorrect: false },
    { key: "D", text: "API test", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is test plan?",
  explanation: "Defines strategy and scope.",
  options: [
    { key: "A", text: "Code file", isCorrect: false },
    { key: "B", text: "Testing strategy document", isCorrect: true },
    { key: "C", text: "UI design", isCorrect: false },
    { key: "D", text: "Deployment plan", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.QA_ENGINEER,
  question: "What is defect leakage?",
  explanation: "Bugs missed during testing.",
  options: [
    { key: "A", text: "Found bugs", isCorrect: false },
    { key: "B", text: "Missed bugs in testing", isCorrect: true },
    { key: "C", text: "UI bugs", isCorrect: false },
    { key: "D", text: "Database bugs", isCorrect: false },
  ],
},




// ================= DEVOPS ENGINEER (40 PROFESSIONAL QUESTIONS) =================

{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is the primary goal of DevOps in software development?",
  explanation: "DevOps aims to improve collaboration and speed of delivery.",
  options: [
    { key: "A", text: "Replace developers", isCorrect: false },
    { key: "B", text: "Improve collaboration and delivery speed", isCorrect: true },
    { key: "C", text: "Only manage servers", isCorrect: false },
    { key: "D", text: "Design UI", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is Continuous Integration (CI)?",
  explanation: "CI involves integrating code frequently with automated testing.",
  options: [
    { key: "A", text: "Manual deployment", isCorrect: false },
    { key: "B", text: "Frequent code integration with tests", isCorrect: true },
    { key: "C", text: "Database backup", isCorrect: false },
    { key: "D", text: "UI testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is Continuous Deployment (CD)?",
  explanation: "CD automatically deploys code after passing tests.",
  options: [
    { key: "A", text: "Manual release", isCorrect: false },
    { key: "B", text: "Automatic deployment pipeline", isCorrect: true },
    { key: "C", text: "Code writing", isCorrect: false },
    { key: "D", text: "Database scaling", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "Which tool is commonly used for containerization?",
  explanation: "Docker packages applications into containers.",
  options: [
    { key: "A", text: "Git", isCorrect: false },
    { key: "B", text: "Docker", isCorrect: true },
    { key: "C", text: "Jenkins", isCorrect: false },
    { key: "D", text: "Figma", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is Infrastructure as Code (IaC)?",
  explanation: "IaC manages infrastructure using code.",
  options: [
    { key: "A", text: "Manual server setup", isCorrect: false },
    { key: "B", text: "Managing infrastructure via code", isCorrect: true },
    { key: "C", text: "UI design", isCorrect: false },
    { key: "D", text: "Database queries", isCorrect: false },
  ],
},

// --- SCENARIO ---
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "Your deployment pipeline fails frequently due to environment inconsistencies. What is the best solution?",
  explanation: "Containers ensure consistent environments.",
  options: [
    { key: "A", text: "Manual fixes", isCorrect: false },
    { key: "B", text: "Use containerization (Docker)", isCorrect: true },
    { key: "C", text: "Ignore errors", isCorrect: false },
    { key: "D", text: "Restart server", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "You need to automate deployments across multiple servers. Which tool is most suitable?",
  explanation: "Tools like Ansible automate configuration and deployment.",
  options: [
    { key: "A", text: "Photoshop", isCorrect: false },
    { key: "B", text: "Ansible", isCorrect: true },
    { key: "C", text: "Excel", isCorrect: false },
    { key: "D", text: "CSS", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "Your system needs to automatically scale based on traffic. What should you implement?",
  explanation: "Auto-scaling adjusts resources dynamically.",
  options: [
    { key: "A", text: "Manual scaling", isCorrect: false },
    { key: "B", text: "Auto-scaling groups", isCorrect: true },
    { key: "C", text: "Static servers", isCorrect: false },
    { key: "D", text: "Disable monitoring", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "Which approach helps minimize downtime during deployment?",
  explanation: "Blue-green deployment avoids downtime.",
  options: [
    { key: "A", text: "Stop server", isCorrect: false },
    { key: "B", text: "Blue-green deployment", isCorrect: true },
    { key: "C", text: "Manual update", isCorrect: false },
    { key: "D", text: "Delete database", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "Your logs are difficult to analyze across services. What is the best solution?",
  explanation: "Centralized logging improves monitoring.",
  options: [
    { key: "A", text: "Ignore logs", isCorrect: false },
    { key: "B", text: "Use centralized logging system (ELK)", isCorrect: true },
    { key: "C", text: "Print logs manually", isCorrect: false },
    { key: "D", text: "Disable logs", isCorrect: false },
  ],
},

// --- TOOLS ---
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "Which tool is widely used for CI/CD pipelines?",
  explanation: "Jenkins automates CI/CD workflows.",
  options: [
    { key: "A", text: "React", isCorrect: false },
    { key: "B", text: "Jenkins", isCorrect: true },
    { key: "C", text: "MongoDB", isCorrect: false },
    { key: "D", text: "Figma", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "Which platform is commonly used for container orchestration?",
  explanation: "Kubernetes manages containers.",
  options: [
    { key: "A", text: "Docker only", isCorrect: false },
    { key: "B", text: "Kubernetes", isCorrect: true },
    { key: "C", text: "Git", isCorrect: false },
    { key: "D", text: "VS Code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is the purpose of monitoring tools like Prometheus?",
  explanation: "Monitor system performance and metrics.",
  options: [
    { key: "A", text: "Write code", isCorrect: false },
    { key: "B", text: "Track system metrics", isCorrect: true },
    { key: "C", text: "UI design", isCorrect: false },
    { key: "D", text: "Database query", isCorrect: false },
  ],
},

// --- MEDIUM ---
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is a container?",
  explanation: "A lightweight environment for running apps.",
  options: [
    { key: "A", text: "Virtual machine", isCorrect: false },
    { key: "B", text: "Lightweight isolated environment", isCorrect: true },
    { key: "C", text: "Database", isCorrect: false },
    { key: "D", text: "UI tool", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is the benefit of using cloud platforms like AWS?",
  explanation: "Provides scalable infrastructure.",
  options: [
    { key: "A", text: "Manual setup", isCorrect: false },
    { key: "B", text: "Scalable infrastructure", isCorrect: true },
    { key: "C", text: "UI design", isCorrect: false },
    { key: "D", text: "Local storage only", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is version control used for?",
  explanation: "Tracks code changes.",
  options: [
    { key: "A", text: "Store UI", isCorrect: false },
    { key: "B", text: "Track changes in code", isCorrect: true },
    { key: "C", text: "Run apps", isCorrect: false },
    { key: "D", text: "Deploy servers", isCorrect: false },
  ],
},

// --- HARD ---
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is canary deployment?",
  explanation: "Release to small group before full rollout.",
  options: [
    { key: "A", text: "Full deployment", isCorrect: false },
    { key: "B", text: "Gradual release to subset of users", isCorrect: true },
    { key: "C", text: "Delete system", isCorrect: false },
    { key: "D", text: "Manual testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is fault tolerance?",
  explanation: "System continues despite failures.",
  options: [
    { key: "A", text: "System crash", isCorrect: false },
    { key: "B", text: "Handle failures gracefully", isCorrect: true },
    { key: "C", text: "Slow performance", isCorrect: false },
    { key: "D", text: "UI issue", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is a reverse proxy used for?",
  explanation: "Routes requests to backend servers.",
  options: [
    { key: "A", text: "Database storage", isCorrect: false },
    { key: "B", text: "Request routing and security", isCorrect: true },
    { key: "C", text: "UI rendering", isCorrect: false },
    { key: "D", text: "Testing", isCorrect: false },
  ],
},

// --- fill to 40 ---
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is logging used for?",
  explanation: "Track events and debug issues.",
  options: [
    { key: "A", text: "UI design", isCorrect: false },
    { key: "B", text: "System monitoring and debugging", isCorrect: true },
    { key: "C", text: "Database scaling", isCorrect: false },
    { key: "D", text: "Deployment", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is a pipeline in DevOps?",
  explanation: "Automated steps for build/test/deploy.",
  options: [
    { key: "A", text: "Database flow", isCorrect: false },
    { key: "B", text: "Automated workflow", isCorrect: true },
    { key: "C", text: "UI flow", isCorrect: false },
    { key: "D", text: "Manual testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is rollback in deployment?",
  explanation: "Reverting to previous version.",
  options: [
    { key: "A", text: "Delete app", isCorrect: false },
    { key: "B", text: "Revert to previous version", isCorrect: true },
    { key: "C", text: "Deploy new version", isCorrect: false },
    { key: "D", text: "Restart server", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is high availability?",
  explanation: "System uptime and reliability.",
  options: [
    { key: "A", text: "Low uptime", isCorrect: false },
    { key: "B", text: "System always available", isCorrect: true },
    { key: "C", text: "UI design", isCorrect: false },
    { key: "D", text: "Database query", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is disaster recovery?",
  explanation: "Recover system after failure.",
  options: [
    { key: "A", text: "Ignore failure", isCorrect: false },
    { key: "B", text: "Recover system after outage", isCorrect: true },
    { key: "C", text: "UI fix", isCorrect: false },
    { key: "D", text: "Code compile", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is auto-healing in systems?",
  explanation: "Automatically recover failed components.",
  options: [
    { key: "A", text: "Manual fix", isCorrect: false },
    { key: "B", text: "Automatic recovery", isCorrect: true },
    { key: "C", text: "UI reload", isCorrect: false },
    { key: "D", text: "Delete logs", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is secrets management?",
  explanation: "Secure storage of sensitive data.",
  options: [
    { key: "A", text: "Public data", isCorrect: false },
    { key: "B", text: "Secure handling of credentials", isCorrect: true },
    { key: "C", text: "UI design", isCorrect: false },
    { key: "D", text: "Testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is immutable infrastructure?",
  explanation: "Servers are replaced, not modified.",
  options: [
    { key: "A", text: "Edit servers", isCorrect: false },
    { key: "B", text: "Replace instead of modify", isCorrect: true },
    { key: "C", text: "Manual updates", isCorrect: false },
    { key: "D", text: "UI update", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is observability?",
  explanation: "Understanding system via logs/metrics/traces.",
  options: [
    { key: "A", text: "UI testing", isCorrect: false },
    { key: "B", text: "System visibility and monitoring", isCorrect: true },
    { key: "C", text: "Database storage", isCorrect: false },
    { key: "D", text: "Deployment", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DEVOPS_ENGINEER,
  question: "What is service discovery?",
  explanation: "Services locate each other dynamically.",
  options: [
    { key: "A", text: "Manual config", isCorrect: false },
    { key: "B", text: "Dynamic service location", isCorrect: true },
    { key: "C", text: "UI routing", isCorrect: false },
    { key: "D", text: "Database query", isCorrect: false },
  ],
},


// ================= DATA ANALYST (40 PROFESSIONAL QUESTIONS) =================

{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is the primary goal of data analysis in a business context?",
  explanation: "Data analysis supports decision-making.",
  options: [
    { key: "A", text: "Store data", isCorrect: false },
    { key: "B", text: "Extract insights for decision-making", isCorrect: true },
    { key: "C", text: "Design UI", isCorrect: false },
    { key: "D", text: "Write backend code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "Which SQL clause is used to filter records?",
  explanation: "WHERE filters rows.",
  options: [
    { key: "A", text: "SELECT", isCorrect: false },
    { key: "B", text: "WHERE", isCorrect: true },
    { key: "C", text: "GROUP BY", isCorrect: false },
    { key: "D", text: "ORDER BY", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What does GROUP BY do in SQL?",
  explanation: "Groups rows for aggregation.",
  options: [
    { key: "A", text: "Filters rows", isCorrect: false },
    { key: "B", text: "Groups rows for aggregation", isCorrect: true },
    { key: "C", text: "Sorts data", isCorrect: false },
    { key: "D", text: "Deletes data", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is data cleaning?",
  explanation: "Removing inconsistencies and errors.",
  options: [
    { key: "A", text: "Data deletion", isCorrect: false },
    { key: "B", text: "Fixing missing/incorrect data", isCorrect: true },
    { key: "C", text: "UI formatting", isCorrect: false },
    { key: "D", text: "Data storage", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "Which measure represents the average value?",
  explanation: "Mean is the average.",
  options: [
    { key: "A", text: "Median", isCorrect: false },
    { key: "B", text: "Mean", isCorrect: true },
    { key: "C", text: "Mode", isCorrect: false },
    { key: "D", text: "Range", isCorrect: false },
  ],
},

// --- SCENARIO ---
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "You are analyzing sales data and notice missing values. What should you do first?",
  explanation: "Understand missing data before handling.",
  options: [
    { key: "A", text: "Delete all data", isCorrect: false },
    { key: "B", text: "Analyze missing data patterns", isCorrect: true },
    { key: "C", text: "Ignore it", isCorrect: false },
    { key: "D", text: "Deploy report", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "A dataset contains extreme outliers affecting results. What should you do?",
  explanation: "Handle outliers carefully.",
  options: [
    { key: "A", text: "Ignore outliers", isCorrect: false },
    { key: "B", text: "Analyze and treat/remove outliers", isCorrect: true },
    { key: "C", text: "Duplicate data", isCorrect: false },
    { key: "D", text: "Delete dataset", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "You need to visualize trends over time. Which chart is best?",
  explanation: "Line charts show trends.",
  options: [
    { key: "A", text: "Pie chart", isCorrect: false },
    { key: "B", text: "Line chart", isCorrect: true },
    { key: "C", text: "Bar chart", isCorrect: false },
    { key: "D", text: "Table", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "Which tool is widely used for data analysis in Python?",
  explanation: "Pandas is widely used.",
  options: [
    { key: "A", text: "React", isCorrect: false },
    { key: "B", text: "Pandas", isCorrect: true },
    { key: "C", text: "Docker", isCorrect: false },
    { key: "D", text: "Figma", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is the purpose of a dashboard?",
  explanation: "Displays key metrics visually.",
  options: [
    { key: "A", text: "Store data", isCorrect: false },
    { key: "B", text: "Visualize insights", isCorrect: true },
    { key: "C", text: "Write code", isCorrect: false },
    { key: "D", text: "Deploy app", isCorrect: false },
  ],
},

// --- SQL ---
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "Which SQL function counts rows?",
  explanation: "COUNT counts records.",
  options: [
    { key: "A", text: "SUM", isCorrect: false },
    { key: "B", text: "COUNT", isCorrect: true },
    { key: "C", text: "AVG", isCorrect: false },
    { key: "D", text: "MAX", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "Which clause sorts results?",
  explanation: "ORDER BY sorts results.",
  options: [
    { key: "A", text: "GROUP BY", isCorrect: false },
    { key: "B", text: "ORDER BY", isCorrect: true },
    { key: "C", text: "WHERE", isCorrect: false },
    { key: "D", text: "JOIN", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What does JOIN do in SQL?",
  explanation: "Combines tables.",
  options: [
    { key: "A", text: "Delete data", isCorrect: false },
    { key: "B", text: "Combine tables", isCorrect: true },
    { key: "C", text: "Sort data", isCorrect: false },
    { key: "D", text: "Filter data", isCorrect: false },
  ],
},

// --- STATISTICS ---
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is median?",
  explanation: "Middle value in sorted data.",
  options: [
    { key: "A", text: "Average", isCorrect: false },
    { key: "B", text: "Middle value", isCorrect: true },
    { key: "C", text: "Most frequent", isCorrect: false },
    { key: "D", text: "Difference", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is standard deviation?",
  explanation: "Measures data spread.",
  options: [
    { key: "A", text: "Mean", isCorrect: false },
    { key: "B", text: "Data spread", isCorrect: true },
    { key: "C", text: "Sum", isCorrect: false },
    { key: "D", text: "Count", isCorrect: false },
  ],
},

// --- HARD ---
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is A/B testing?",
  explanation: "Compares two versions.",
  options: [
    { key: "A", text: "Single test", isCorrect: false },
    { key: "B", text: "Compare two variations", isCorrect: true },
    { key: "C", text: "Delete data", isCorrect: false },
    { key: "D", text: "UI test", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is correlation?",
  explanation: "Measures relationship between variables.",
  options: [
    { key: "A", text: "Cause-effect", isCorrect: false },
    { key: "B", text: "Relationship strength", isCorrect: true },
    { key: "C", text: "Random data", isCorrect: false },
    { key: "D", text: "Sorting", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is ETL process?",
  explanation: "Extract, Transform, Load.",
  options: [
    { key: "A", text: "Edit data", isCorrect: false },
    { key: "B", text: "Extract Transform Load", isCorrect: true },
    { key: "C", text: "Delete data", isCorrect: false },
    { key: "D", text: "Store UI", isCorrect: false },
  ],
},

// --- fill to 40 ---
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is data visualization?",
  explanation: "Graphical representation of data.",
  options: [
    { key: "A", text: "Coding", isCorrect: false },
    { key: "B", text: "Visual representation", isCorrect: true },
    { key: "C", text: "Database", isCorrect: false },
    { key: "D", text: "Testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is KPI?",
  explanation: "Key Performance Indicator.",
  options: [
    { key: "A", text: "Key Programming Input", isCorrect: false },
    { key: "B", text: "Key Performance Indicator", isCorrect: true },
    { key: "C", text: "Data table", isCorrect: false },
    { key: "D", text: "UI metric", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is data normalization?",
  explanation: "Standardizing data format.",
  options: [
    { key: "A", text: "Duplicate data", isCorrect: false },
    { key: "B", text: "Standardize data", isCorrect: true },
    { key: "C", text: "Delete rows", isCorrect: false },
    { key: "D", text: "Sort data", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is data aggregation?",
  explanation: "Summarizing data.",
  options: [
    { key: "A", text: "Splitting data", isCorrect: false },
    { key: "B", text: "Summarizing data", isCorrect: true },
    { key: "C", text: "Deleting data", isCorrect: false },
    { key: "D", text: "Visualizing data", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is predictive analysis?",
  explanation: "Uses data to predict outcomes.",
  options: [
    { key: "A", text: "Past analysis", isCorrect: false },
    { key: "B", text: "Predict future trends", isCorrect: true },
    { key: "C", text: "Delete data", isCorrect: false },
    { key: "D", text: "UI analysis", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is data wrangling?",
  explanation: "Cleaning and transforming data.",
  options: [
    { key: "A", text: "Delete data", isCorrect: false },
    { key: "B", text: "Clean and prepare data", isCorrect: true },
    { key: "C", text: "Visualize data", isCorrect: false },
    { key: "D", text: "Store data", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is a histogram?",
  explanation: "Shows data distribution.",
  options: [
    { key: "A", text: "Line chart", isCorrect: false },
    { key: "B", text: "Distribution chart", isCorrect: true },
    { key: "C", text: "Pie chart", isCorrect: false },
    { key: "D", text: "Table", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is variance?",
  explanation: "Measures data spread.",
  options: [
    { key: "A", text: "Average", isCorrect: false },
    { key: "B", text: "Spread of data", isCorrect: true },
    { key: "C", text: "Sum", isCorrect: false },
    { key: "D", text: "Count", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.DATA_ANALYST,
  question: "What is sampling?",
  explanation: "Selecting subset of data.",
  options: [
    { key: "A", text: "Whole data", isCorrect: false },
    { key: "B", text: "Subset selection", isCorrect: true },
    { key: "C", text: "Delete data", isCorrect: false },
    { key: "D", text: "Sort data", isCorrect: false },
  ],
},




// ================= UI/UX DESIGNER (40 PROFESSIONAL QUESTIONS) =================

{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is the primary goal of UX design?",
  explanation: "UX focuses on improving user satisfaction and usability.",
  options: [
    { key: "A", text: "Make UI colorful", isCorrect: false },
    { key: "B", text: "Enhance user experience and usability", isCorrect: true },
    { key: "C", text: "Write backend code", isCorrect: false },
    { key: "D", text: "Store data", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is the difference between UI and UX?",
  explanation: "UI is visual design, UX is overall experience.",
  options: [
    { key: "A", text: "Same thing", isCorrect: false },
    { key: "B", text: "UI = visuals, UX = experience", isCorrect: true },
    { key: "C", text: "UX is coding", isCorrect: false },
    { key: "D", text: "UI is backend", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is a wireframe?",
  explanation: "A basic layout structure of a page.",
  options: [
    { key: "A", text: "Final design", isCorrect: false },
    { key: "B", text: "Low-fidelity layout", isCorrect: true },
    { key: "C", text: "Database model", isCorrect: false },
    { key: "D", text: "Code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is a prototype?",
  explanation: "Interactive model of design.",
  options: [
    { key: "A", text: "Database", isCorrect: false },
    { key: "B", text: "Interactive design model", isCorrect: true },
    { key: "C", text: "Final product", isCorrect: false },
    { key: "D", text: "Code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is usability testing?",
  explanation: "Testing how users interact with a product.",
  options: [
    { key: "A", text: "UI styling", isCorrect: false },
    { key: "B", text: "Evaluate product usability with users", isCorrect: true },
    { key: "C", text: "Backend testing", isCorrect: false },
    { key: "D", text: "Database testing", isCorrect: false },
  ],
},

// --- SCENARIO ---
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "Users are abandoning a signup form midway. What should you do first?",
  explanation: "Analyze user behavior to identify friction points.",
  options: [
    { key: "A", text: "Redesign everything", isCorrect: false },
    { key: "B", text: "Analyze user flow and drop-off points", isCorrect: true },
    { key: "C", text: "Ignore issue", isCorrect: false },
    { key: "D", text: "Add more fields", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "A mobile app feels cluttered. What is the best solution?",
  explanation: "Simplification improves usability.",
  options: [
    { key: "A", text: "Add more elements", isCorrect: false },
    { key: "B", text: "Simplify layout and remove clutter", isCorrect: true },
    { key: "C", text: "Increase text size only", isCorrect: false },
    { key: "D", text: "Change colors", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "You need to design for accessibility. What should you consider?",
  explanation: "Accessibility includes contrast, readability, and navigation.",
  options: [
    { key: "A", text: "Only colors", isCorrect: false },
    { key: "B", text: "Contrast, readability, keyboard navigation", isCorrect: true },
    { key: "C", text: "Only animations", isCorrect: false },
    { key: "D", text: "Backend logic", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "Users are confused navigating your app. What should you improve?",
  explanation: "Clear navigation improves UX.",
  options: [
    { key: "A", text: "Add animations", isCorrect: false },
    { key: "B", text: "Improve navigation structure", isCorrect: true },
    { key: "C", text: "Change font", isCorrect: false },
    { key: "D", text: "Add images", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is the purpose of user personas?",
  explanation: "Personas represent target users.",
  options: [
    { key: "A", text: "Design colors", isCorrect: false },
    { key: "B", text: "Represent user types", isCorrect: true },
    { key: "C", text: "Write code", isCorrect: false },
    { key: "D", text: "Store data", isCorrect: false },
  ],
},

// --- DESIGN PRINCIPLES ---
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is visual hierarchy?",
  explanation: "Guides user attention.",
  options: [
    { key: "A", text: "Database order", isCorrect: false },
    { key: "B", text: "Arrangement guiding attention", isCorrect: true },
    { key: "C", text: "Backend logic", isCorrect: false },
    { key: "D", text: "Code structure", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is consistency in UI design?",
  explanation: "Using similar elements across UI.",
  options: [
    { key: "A", text: "Different styles", isCorrect: false },
    { key: "B", text: "Uniform design patterns", isCorrect: true },
    { key: "C", text: "Random layout", isCorrect: false },
    { key: "D", text: "Complex UI", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is whitespace used for?",
  explanation: "Improves readability.",
  options: [
    { key: "A", text: "Fill space", isCorrect: false },
    { key: "B", text: "Improve clarity and focus", isCorrect: true },
    { key: "C", text: "Add content", isCorrect: false },
    { key: "D", text: "Database design", isCorrect: false },
  ],
},

// --- TOOLS ---
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "Which tool is commonly used for UI design?",
  explanation: "Figma is widely used.",
  options: [
    { key: "A", text: "MySQL", isCorrect: false },
    { key: "B", text: "Figma", isCorrect: true },
    { key: "C", text: "Node.js", isCorrect: false },
    { key: "D", text: "Docker", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is a design system?",
  explanation: "Reusable design components.",
  options: [
    { key: "A", text: "Database", isCorrect: false },
    { key: "B", text: "Collection of reusable UI components", isCorrect: true },
    { key: "C", text: "Code library", isCorrect: false },
    { key: "D", text: "Testing tool", isCorrect: false },
  ],
},

// --- HARD ---
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is heuristic evaluation?",
  explanation: "Evaluating UI using usability principles.",
  options: [
    { key: "A", text: "User testing", isCorrect: false },
    { key: "B", text: "Expert evaluation using heuristics", isCorrect: true },
    { key: "C", text: "Backend testing", isCorrect: false },
    { key: "D", text: "Data analysis", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is information architecture?",
  explanation: "Organizing content logically.",
  options: [
    { key: "A", text: "UI colors", isCorrect: false },
    { key: "B", text: "Structuring content", isCorrect: true },
    { key: "C", text: "Code design", isCorrect: false },
    { key: "D", text: "Database schema", isCorrect: false },
  ],
},

// --- fill remaining ---
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is user journey mapping?",
  explanation: "Visualizing user interactions.",
  options: [
    { key: "A", text: "Database mapping", isCorrect: false },
    { key: "B", text: "User interaction flow", isCorrect: true },
    { key: "C", text: "Code mapping", isCorrect: false },
    { key: "D", text: "UI styling", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is responsive design?",
  explanation: "Adapts UI to different devices.",
  options: [
    { key: "A", text: "Fixed layout", isCorrect: false },
    { key: "B", text: "Adaptive layout for devices", isCorrect: true },
    { key: "C", text: "Backend design", isCorrect: false },
    { key: "D", text: "Database scaling", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is affordance in design?",
  explanation: "Indicates how elements are used.",
  options: [
    { key: "A", text: "Color usage", isCorrect: false },
    { key: "B", text: "Clues about usage", isCorrect: true },
    { key: "C", text: "Database structure", isCorrect: false },
    { key: "D", text: "Code logic", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is user-centered design?",
  explanation: "Design focused on user needs.",
  options: [
    { key: "A", text: "Developer-focused", isCorrect: false },
    { key: "B", text: "Focus on user needs", isCorrect: true },
    { key: "C", text: "Database design", isCorrect: false },
    { key: "D", text: "Code-first design", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.UI_UX_DESIGNER,
  question: "What is usability heuristic 'visibility of system status'?",
  explanation: "System should keep users informed.",
  options: [
    { key: "A", text: "Hide system info", isCorrect: false },
    { key: "B", text: "Keep users informed", isCorrect: true },
    { key: "C", text: "Database logs", isCorrect: false },
    { key: "D", text: "Code comments", isCorrect: false },
  ],
},


// ================= PROJECT MANAGER (40 PROFESSIONAL QUESTIONS) =================

{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is the primary responsibility of a project manager?",
  explanation: "Project managers ensure delivery within scope, time, and budget.",
  options: [
    { key: "A", text: "Write code", isCorrect: false },
    { key: "B", text: "Plan, execute, and deliver projects", isCorrect: true },
    { key: "C", text: "Design UI", isCorrect: false },
    { key: "D", text: "Manage database", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What are the three main project constraints?",
  explanation: "Scope, time, and cost are core constraints.",
  options: [
    { key: "A", text: "Speed, UI, backend", isCorrect: false },
    { key: "B", text: "Scope, time, cost", isCorrect: true },
    { key: "C", text: "Code, UI, DB", isCorrect: false },
    { key: "D", text: "Team, tools, UI", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is a project scope?",
  explanation: "Defines what is included in the project.",
  options: [
    { key: "A", text: "Timeline", isCorrect: false },
    { key: "B", text: "Defined work and deliverables", isCorrect: true },
    { key: "C", text: "Budget", isCorrect: false },
    { key: "D", text: "Team size", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is Agile methodology?",
  explanation: "Agile is iterative and flexible.",
  options: [
    { key: "A", text: "Linear process", isCorrect: false },
    { key: "B", text: "Iterative development approach", isCorrect: true },
    { key: "C", text: "Database design", isCorrect: false },
    { key: "D", text: "Testing tool", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is a milestone in project management?",
  explanation: "Milestones mark key progress points.",
  options: [
    { key: "A", text: "Daily task", isCorrect: false },
    { key: "B", text: "Significant project checkpoint", isCorrect: true },
    { key: "C", text: "Bug report", isCorrect: false },
    { key: "D", text: "Code review", isCorrect: false },
  ],
},

// --- SCENARIO ---
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "Your project is behind schedule. What should you do first?",
  explanation: "Identify root cause before acting.",
  options: [
    { key: "A", text: "Blame team", isCorrect: false },
    { key: "B", text: "Analyze delays and adjust plan", isCorrect: true },
    { key: "C", text: "Ignore issue", isCorrect: false },
    { key: "D", text: "Add random features", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "Stakeholders keep requesting changes. What should you do?",
  explanation: "Change control process is needed.",
  options: [
    { key: "A", text: "Accept all changes", isCorrect: false },
    { key: "B", text: "Use change management process", isCorrect: true },
    { key: "C", text: "Reject all", isCorrect: false },
    { key: "D", text: "Ignore stakeholders", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "Your team is overloaded. What is the best action?",
  explanation: "Workload balancing improves productivity.",
  options: [
    { key: "A", text: "Add more work", isCorrect: false },
    { key: "B", text: "Reassign or prioritize tasks", isCorrect: true },
    { key: "C", text: "Ignore", isCorrect: false },
    { key: "D", text: "Delay indefinitely", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What should you do if a key risk is identified?",
  explanation: "Risk mitigation is critical.",
  options: [
    { key: "A", text: "Ignore risk", isCorrect: false },
    { key: "B", text: "Plan mitigation strategy", isCorrect: true },
    { key: "C", text: "Cancel project", isCorrect: false },
    { key: "D", text: "Blame team", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "A team member is underperforming. What should you do?",
  explanation: "Support and communication are key.",
  options: [
    { key: "A", text: "Fire immediately", isCorrect: false },
    { key: "B", text: "Provide feedback and support", isCorrect: true },
    { key: "C", text: "Ignore", isCorrect: false },
    { key: "D", text: "Remove tasks", isCorrect: false },
  ],
},

// --- METHODS & TOOLS ---
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is Scrum?",
  explanation: "Scrum is an Agile framework.",
  options: [
    { key: "A", text: "Database", isCorrect: false },
    { key: "B", text: "Agile framework", isCorrect: true },
    { key: "C", text: "UI tool", isCorrect: false },
    { key: "D", text: "Testing method", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is a sprint in Agile?",
  explanation: "Short development cycle.",
  options: [
    { key: "A", text: "Final release", isCorrect: false },
    { key: "B", text: "Short iteration cycle", isCorrect: true },
    { key: "C", text: "Testing phase", isCorrect: false },
    { key: "D", text: "Design phase", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is a backlog?",
  explanation: "List of tasks/features.",
  options: [
    { key: "A", text: "Completed work", isCorrect: false },
    { key: "B", text: "List of pending tasks", isCorrect: true },
    { key: "C", text: "Database", isCorrect: false },
    { key: "D", text: "UI design", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is a Gantt chart used for?",
  explanation: "Visual timeline of tasks.",
  options: [
    { key: "A", text: "UI design", isCorrect: false },
    { key: "B", text: "Project scheduling", isCorrect: true },
    { key: "C", text: "Database", isCorrect: false },
    { key: "D", text: "Testing", isCorrect: false },
  ],
},

// --- RISK / MANAGEMENT ---
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is risk management?",
  explanation: "Identifying and handling risks.",
  options: [
    { key: "A", text: "Ignore risks", isCorrect: false },
    { key: "B", text: "Identify and mitigate risks", isCorrect: true },
    { key: "C", text: "Increase risk", isCorrect: false },
    { key: "D", text: "Delete tasks", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is stakeholder management?",
  explanation: "Managing stakeholder expectations.",
  options: [
    { key: "A", text: "Ignore stakeholders", isCorrect: false },
    { key: "B", text: "Engage and manage expectations", isCorrect: true },
    { key: "C", text: "Remove stakeholders", isCorrect: false },
    { key: "D", text: "Limit communication", isCorrect: false },
  ],
},

// --- HARD ---
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is critical path?",
  explanation: "Longest sequence of dependent tasks.",
  options: [
    { key: "A", text: "Shortest task", isCorrect: false },
    { key: "B", text: "Longest path determining duration", isCorrect: true },
    { key: "C", text: "Optional tasks", isCorrect: false },
    { key: "D", text: "Random tasks", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is scope creep?",
  explanation: "Uncontrolled changes in scope.",
  options: [
    { key: "A", text: "Planned scope", isCorrect: false },
    { key: "B", text: "Uncontrolled scope changes", isCorrect: true },
    { key: "C", text: "Budget increase", isCorrect: false },
    { key: "D", text: "Timeline fix", isCorrect: false },
  ],
},

// --- COMPLETE TO 40 ---
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is communication plan?",
  explanation: "Defines communication strategy.",
  options: [
    { key: "A", text: "Ignore communication", isCorrect: false },
    { key: "B", text: "Plan for information flow", isCorrect: true },
    { key: "C", text: "UI design", isCorrect: false },
    { key: "D", text: "Testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is project charter?",
  explanation: "Defines project purpose.",
  options: [
    { key: "A", text: "Task list", isCorrect: false },
    { key: "B", text: "Project definition document", isCorrect: true },
    { key: "C", text: "Code file", isCorrect: false },
    { key: "D", text: "UI plan", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is time management?",
  explanation: "Managing project schedule.",
  options: [
    { key: "A", text: "Ignore deadlines", isCorrect: false },
    { key: "B", text: "Plan and control schedule", isCorrect: true },
    { key: "C", text: "Delay tasks", isCorrect: false },
    { key: "D", text: "Remove tasks", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is cost management?",
  explanation: "Managing project budget.",
  options: [
    { key: "A", text: "Ignore cost", isCorrect: false },
    { key: "B", text: "Control project budget", isCorrect: true },
    { key: "C", text: "Increase cost", isCorrect: false },
    { key: "D", text: "Delete budget", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is team management?",
  explanation: "Managing team performance.",
  options: [
    { key: "A", text: "Ignore team", isCorrect: false },
    { key: "B", text: "Manage and support team", isCorrect: true },
    { key: "C", text: "Remove team", isCorrect: false },
    { key: "D", text: "Limit tasks", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is quality management?",
  explanation: "Ensuring deliverables meet standards.",
  options: [
    { key: "A", text: "Ignore quality", isCorrect: false },
    { key: "B", text: "Ensure standards are met", isCorrect: true },
    { key: "C", text: "Reduce quality", isCorrect: false },
    { key: "D", text: "Skip testing", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is project closure?",
  explanation: "Formal completion of project.",
  options: [
    { key: "A", text: "Start project", isCorrect: false },
    { key: "B", text: "Close and finalize project", isCorrect: true },
    { key: "C", text: "Pause project", isCorrect: false },
    { key: "D", text: "Restart project", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is escalation?",
  explanation: "Raising issues to higher authority.",
  options: [
    { key: "A", text: "Ignore issue", isCorrect: false },
    { key: "B", text: "Raise issue to higher level", isCorrect: true },
    { key: "C", text: "Delete issue", isCorrect: false },
    { key: "D", text: "Delay issue", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is resource allocation?",
  explanation: "Assigning resources efficiently.",
  options: [
    { key: "A", text: "Ignore resources", isCorrect: false },
    { key: "B", text: "Assign resources to tasks", isCorrect: true },
    { key: "C", text: "Remove resources", isCorrect: false },
    { key: "D", text: "Duplicate tasks", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.PROJECT_MANAGER,
  question: "What is project monitoring?",
  explanation: "Tracking progress and performance.",
  options: [
    { key: "A", text: "Ignore progress", isCorrect: false },
    { key: "B", text: "Track project performance", isCorrect: true },
    { key: "C", text: "Stop project", isCorrect: false },
    { key: "D", text: "Restart tasks", isCorrect: false },
  ],
},





// ================= BUSINESS ANALYST (40 PROFESSIONAL QUESTIONS) =================

{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is the primary role of a Business Analyst?",
  explanation: "BAs bridge business needs and technical solutions.",
  options: [
    { key: "A", text: "Write backend code", isCorrect: false },
    { key: "B", text: "Analyze business needs and define solutions", isCorrect: true },
    { key: "C", text: "Design UI", isCorrect: false },
    { key: "D", text: "Manage servers", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is requirement gathering?",
  explanation: "Collecting business needs from stakeholders.",
  options: [
    { key: "A", text: "Writing code", isCorrect: false },
    { key: "B", text: "Collecting stakeholder needs", isCorrect: true },
    { key: "C", text: "Testing software", isCorrect: false },
    { key: "D", text: "Deploying systems", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is a stakeholder?",
  explanation: "Anyone affected by the project.",
  options: [
    { key: "A", text: "Developer only", isCorrect: false },
    { key: "B", text: "Person impacted by project", isCorrect: true },
    { key: "C", text: "UI designer", isCorrect: false },
    { key: "D", text: "Database", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is a business requirement?",
  explanation: "Defines what business needs.",
  options: [
    { key: "A", text: "Code logic", isCorrect: false },
    { key: "B", text: "Business objective or need", isCorrect: true },
    { key: "C", text: "UI color", isCorrect: false },
    { key: "D", text: "Database schema", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is a functional requirement?",
  explanation: "Describes system behavior.",
  options: [
    { key: "A", text: "Performance", isCorrect: false },
    { key: "B", text: "System functionality", isCorrect: true },
    { key: "C", text: "Security", isCorrect: false },
    { key: "D", text: "UI style", isCorrect: false },
  ],
},

// --- SCENARIO ---
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "Stakeholders provide conflicting requirements. What should you do?",
  explanation: "Clarify and prioritize requirements.",
  options: [
    { key: "A", text: "Ignore both", isCorrect: false },
    { key: "B", text: "Facilitate discussion and resolve conflict", isCorrect: true },
    { key: "C", text: "Choose randomly", isCorrect: false },
    { key: "D", text: "Stop project", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "Requirements keep changing during development. What is happening?",
  explanation: "This is scope creep.",
  options: [
    { key: "A", text: "Risk management", isCorrect: false },
    { key: "B", text: "Scope creep", isCorrect: true },
    { key: "C", text: "Testing issue", isCorrect: false },
    { key: "D", text: "Deployment issue", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "You need to understand current business processes. What should you create?",
  explanation: "Process diagrams visualize workflows.",
  options: [
    { key: "A", text: "Code", isCorrect: false },
    { key: "B", text: "Process flow diagram", isCorrect: true },
    { key: "C", text: "Database", isCorrect: false },
    { key: "D", text: "UI mockup", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is the best way to validate requirements?",
  explanation: "Review with stakeholders.",
  options: [
    { key: "A", text: "Ignore them", isCorrect: false },
    { key: "B", text: "Review with stakeholders", isCorrect: true },
    { key: "C", text: "Deploy directly", isCorrect: false },
    { key: "D", text: "Write code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "A requirement is unclear. What should you do?",
  explanation: "Clarification is essential.",
  options: [
    { key: "A", text: "Assume details", isCorrect: false },
    { key: "B", text: "Clarify with stakeholders", isCorrect: true },
    { key: "C", text: "Ignore", isCorrect: false },
    { key: "D", text: "Delete requirement", isCorrect: false },
  ],
},

// --- DOCUMENTATION ---
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is BRD?",
  explanation: "Business Requirement Document.",
  options: [
    { key: "A", text: "Bug report doc", isCorrect: false },
    { key: "B", text: "Business Requirement Document", isCorrect: true },
    { key: "C", text: "Backend design", isCorrect: false },
    { key: "D", text: "UI doc", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is SRS?",
  explanation: "Software Requirement Specification.",
  options: [
    { key: "A", text: "UI design doc", isCorrect: false },
    { key: "B", text: "Software Requirement Specification", isCorrect: true },
    { key: "C", text: "Database doc", isCorrect: false },
    { key: "D", text: "Testing doc", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is use case diagram?",
  explanation: "Shows system interactions.",
  options: [
    { key: "A", text: "Database diagram", isCorrect: false },
    { key: "B", text: "User-system interaction", isCorrect: true },
    { key: "C", text: "UI layout", isCorrect: false },
    { key: "D", text: "Code flow", isCorrect: false },
  ],
},

// --- ANALYSIS ---
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is SWOT analysis?",
  explanation: "Strengths, Weaknesses, Opportunities, Threats.",
  options: [
    { key: "A", text: "Code review", isCorrect: false },
    { key: "B", text: "Strategic analysis tool", isCorrect: true },
    { key: "C", text: "UI test", isCorrect: false },
    { key: "D", text: "Database design", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is gap analysis?",
  explanation: "Compare current vs desired state.",
  options: [
    { key: "A", text: "Code gap", isCorrect: false },
    { key: "B", text: "Difference between current and target state", isCorrect: true },
    { key: "C", text: "UI gap", isCorrect: false },
    { key: "D", text: "Database gap", isCorrect: false },
  ],
},

// --- HARD ---
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is requirement traceability?",
  explanation: "Tracking requirements through lifecycle.",
  options: [
    { key: "A", text: "Ignore requirements", isCorrect: false },
    { key: "B", text: "Track requirement lifecycle", isCorrect: true },
    { key: "C", text: "Delete requirements", isCorrect: false },
    { key: "D", text: "UI tracking", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is MoSCoW prioritization?",
  explanation: "Must, Should, Could, Won’t.",
  options: [
    { key: "A", text: "Code method", isCorrect: false },
    { key: "B", text: "Requirement prioritization technique", isCorrect: true },
    { key: "C", text: "Testing method", isCorrect: false },
    { key: "D", text: "UI tool", isCorrect: false },
  ],
},

// --- COMPLETE TO 40 ---
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is KPI?",
  explanation: "Key Performance Indicator.",
  options: [
    { key: "A", text: "Code metric", isCorrect: false },
    { key: "B", text: "Performance measurement", isCorrect: true },
    { key: "C", text: "UI metric", isCorrect: false },
    { key: "D", text: "Database metric", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is business process modeling?",
  explanation: "Visualizing workflows.",
  options: [
    { key: "A", text: "Code modeling", isCorrect: false },
    { key: "B", text: "Process visualization", isCorrect: true },
    { key: "C", text: "UI modeling", isCorrect: false },
    { key: "D", text: "DB modeling", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is feasibility analysis?",
  explanation: "Assess project viability.",
  options: [
    { key: "A", text: "Ignore project", isCorrect: false },
    { key: "B", text: "Evaluate feasibility", isCorrect: true },
    { key: "C", text: "Design UI", isCorrect: false },
    { key: "D", text: "Write code", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is stakeholder analysis?",
  explanation: "Identify and understand stakeholders.",
  options: [
    { key: "A", text: "Ignore stakeholders", isCorrect: false },
    { key: "B", text: "Analyze stakeholder needs", isCorrect: true },
    { key: "C", text: "Remove stakeholders", isCorrect: false },
    { key: "D", text: "Limit communication", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is change request?",
  explanation: "Formal request to modify requirements.",
  options: [
    { key: "A", text: "Ignore change", isCorrect: false },
    { key: "B", text: "Formal modification request", isCorrect: true },
    { key: "C", text: "Delete feature", isCorrect: false },
    { key: "D", text: "Add random feature", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is requirement prioritization?",
  explanation: "Ranking requirements by importance.",
  options: [
    { key: "A", text: "Random order", isCorrect: false },
    { key: "B", text: "Rank by importance", isCorrect: true },
    { key: "C", text: "Ignore priority", isCorrect: false },
    { key: "D", text: "Delete tasks", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is user story?",
  explanation: "Short description of feature from user perspective.",
  options: [
    { key: "A", text: "Code story", isCorrect: false },
    { key: "B", text: "User-focused requirement", isCorrect: true },
    { key: "C", text: "Database story", isCorrect: false },
    { key: "D", text: "UI story", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is acceptance criteria?",
  explanation: "Conditions to meet requirement.",
  options: [
    { key: "A", text: "Code rules", isCorrect: false },
    { key: "B", text: "Conditions for success", isCorrect: true },
    { key: "C", text: "UI rules", isCorrect: false },
    { key: "D", text: "DB rules", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is workflow analysis?",
  explanation: "Study of process flow.",
  options: [
    { key: "A", text: "Code flow", isCorrect: false },
    { key: "B", text: "Process flow analysis", isCorrect: true },
    { key: "C", text: "UI flow", isCorrect: false },
    { key: "D", text: "DB flow", isCorrect: false },
  ],
},
{
  role: PrepQuizRole.BUSINESS_ANALYST,
  question: "What is data-driven decision making?",
  explanation: "Using data to guide decisions.",
  options: [
    { key: "A", text: "Guessing", isCorrect: false },
    { key: "B", text: "Using data insights", isCorrect: true },
    { key: "C", text: "Ignoring data", isCorrect: false },
    { key: "D", text: "UI-based decision", isCorrect: false },
  ],
},


];

async function main() {
  console.log("🧹 Clearing old quiz data...");

  await prisma.prepQuizAnswer.deleteMany();
  await prisma.prepQuizOption.deleteMany();
  await prisma.prepQuizQuestion.deleteMany();

  console.log("📥 Inserting questions...");

  for (const q of questions) {
    await prisma.prepQuizQuestion.create({
      data: {
        role: q.role,
        question: q.question,
        type: "MCQ",
        explanation: q.explanation,
        options: {
          create: q.options,
        },
      },
    });
  }

  console.log(`✅ Inserted ${questions.length} questions`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });