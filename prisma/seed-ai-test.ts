/**
 * AI Evaluation Test Data Seeder
 * Creates a test student, company, job, application, exam answers,
 * then triggers ai.evaluate so you can visit /ai/result?applicationId=xxx
 *
 * Run: npx tsx prisma/seed-ai-test.ts
 */
import { PrismaClient, JobRole, JobType, JobLevel, Specialization } from "../generated/prisma";
import { createHash } from "crypto";

const prisma = new PrismaClient();

// Simple hash for test passwords (NOT for production)
function hashPassword(pw: string): string {
  return createHash("sha256").update(pw).digest("hex");
}

async function main() {
  console.log("🌱 Seeding AI evaluation test data…");

  // ── 1. Company ──────────────────────────────────────────────────────────────
  let company = await prisma.company.findUnique({ where: { email: "test-company@hiresmart.dev" } });
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: "HireSmart Test Co.",
        email: "test-company@hiresmart.dev",
        password: hashPassword("Test1234!"),
        description: "Test company for AI evaluation seeding",
        isVerified: true,
      },
    });
    console.log("  ✅ Company created:", company.id);
  } else {
    console.log("  ⏭️  Company already exists:", company.id);
  }

  // ── 2. Job ───────────────────────────────────────────────────────────────────
  let job = await prisma.job.findFirst({ where: { companyId: company.id, title: "Software Engineer Intern (AI Test)" } });
  if (!job) {
    job = await prisma.job.create({
      data: {
        companyId: company.id,
        title: "Software Engineer Intern (AI Test)",
        location: "Remote",
        role: JobRole.SOFTWARE_ENGINEER,
        type: JobType.INTERNSHIP,
        level: JobLevel.JUNIOR,
        tags: "React,TypeScript,Node.js",
        description: "AI evaluation test job posting",
        responsibilities: "Build features, write tests",
        requirements: "CS degree, JavaScript knowledge",
        cutoff: 60,
      },
    });
    console.log("  ✅ Job created:", job.id);
  } else {
    console.log("  ⏭️  Job already exists:", job.id);
  }

  // ── 3. Student user ──────────────────────────────────────────────────────────
  let student = await prisma.user.findUnique({ where: { email: "test-student@hiresmart.dev" } });
  if (!student) {
    student = await prisma.user.create({
      data: {
        name: "Krishanth Test",
        email: "test-student@hiresmart.dev",
        password: hashPassword("Test1234!"),
        role: "STUDENT",
      },
    });
    console.log("  ✅ Student created:", student.id);
  } else {
    console.log("  ⏭️  Student already exists:", student.id);
  }

  // ── 4. Fetch questions for SE role (mix of MCQ + SCENARIO) ──────────────────
  const mcqQuestions = await prisma.question.findMany({
    where: { role: JobRole.SOFTWARE_ENGINEER, type: "MCQ" },
    include: { options: true },
    take: 4,
  });
  const scenarioQuestions = await prisma.question.findMany({
    where: { role: JobRole.SOFTWARE_ENGINEER, type: "SCENARIO" },
    include: { options: true },
    take: 2,
  });
  const questions = [...mcqQuestions, ...scenarioQuestions];

  if (questions.length === 0) {
    console.error("  ❌ No questions found! Run 'npx prisma db seed' first to seed the question bank.");
    process.exit(1);
  }
  console.log(`  ✅ Using ${questions.length} questions (${mcqQuestions.length} MCQ + ${scenarioQuestions.length} SCENARIO)`);

  // ── 5. Application ────────────────────────────────────────────────────────────
  let application = await prisma.application.findUnique({
    where: { userId_jobId: { userId: student.id, jobId: job.id } },
  });

  if (!application) {
    application = await prisma.application.create({
      data: {
        jobId: job.id,
        userId: student.id,
        role: JobRole.SOFTWARE_ENGINEER,
        fullName: "Krishanth Test",
        email: "test-student@hiresmart.dev",
        mobile: "+94771234567",
        university: "University of Moratuwa",
        degree: "BSc Computer Science",
        specialization: Specialization.SOFTWARE_ENGINEERING,
        cgpa: "3.75",
        programmingLanguages: "JavaScript, TypeScript, Python",
        frameworks: "React, Next.js, Express",
        linkedin: "linkedin.com/in/krishanth-test",
        github: "github.com/krishanth-test",
        examSubmitted: false,
      },
    });
    console.log("  ✅ Application created:", application.id);
  } else {
    console.log("  ⏭️  Application already exists:", application.id);
  }

  // ── 6. Exam Answers ────────────────────────────────────────────────────────────
  // Check if already answered
  const existingAnswers = await prisma.examAnswer.count({ where: { applicationId: application.id } });
  if (existingAnswers === 0) {
    for (const q of questions) {
      let answer: string;
      if (q.type === "MCQ") {
        // Answer correctly half the time
        const options = q.options;
        const correct = q.correctKey;
        const useCorrect = Math.random() > 0.4; // 60% correct rate
        answer = useCorrect ? (correct ?? options[0]!.key) : (options.find((o) => o.key !== correct)?.key ?? "A");
      } else {
        // SCENARIO — give a detailed, relevant answer
        const scenarioAnswers: Record<string, string> = {
          "A function works locally but fails in production":
            "I would start by checking environment variables and configuration differences between local and production. Then I would review the production logs to identify the specific error. Next, I would compare dependency versions and ensure all required services are running. I would also check network access, database connections, and any build-specific differences.",
          "URL shortening service":
            "I would design it with a database storing original URLs and unique short codes. For ID generation, I would use base62 encoding of an auto-incrementing ID or a random hash. The architecture includes a write endpoint to create short URLs and a read endpoint that redirects using an HTTP 301/302. For scalability I would add caching (Redis) for popular URLs and use a CDN.",
          "page loads slowly due to large images":
            "I would compress images using modern formats like WebP or AVIF. Implement lazy loading so images load only when in the viewport. Serve images through a CDN to reduce latency. Use responsive images with srcset for different screen sizes. Add proper cache headers and consider using image optimization tools in the build pipeline.",
        };
        // Match the question prompt to a known answer, or use a generic one
        const matchKey = Object.keys(scenarioAnswers).find(k => q.prompt.includes(k));
        answer = matchKey ? scenarioAnswers[matchKey]! :
          "I would analyze the problem carefully, identify the root cause, implement a clean and scalable solution following best practices, add proper error handling, write tests, and document the solution for future maintainability.";
      }

      await prisma.examAnswer.create({
        data: {
          questionId: q.id,
          applicationId: application.id,
          answer,
        },
      });
    }
    console.log(`  ✅ Created ${questions.length} exam answers`);
  } else {
    console.log(`  ⏭️  Exam answers already exist (${existingAnswers})`);
  }

  // ── 7. Mark exam as submitted ──────────────────────────────────────────────────
  if (!application.examSubmitted) {
    await prisma.application.update({
      where: { id: application.id },
      data: { examSubmitted: true },
    });
    console.log("  ✅ Exam marked as submitted");
  }

  // ── 8. Check/remove existing eval result to allow re-seeding ─────────────────
  const existingEval = await prisma.evaluationResult.findUnique({
    where: { applicationId: application.id },
  });
  if (existingEval) {
    // Delete it so we can re-run evaluation via the API
    await prisma.questionEvaluation.deleteMany({ where: { evaluationResultId: existingEval.id } });
    await prisma.evaluationResult.delete({ where: { id: existingEval.id } });
    console.log("  🗑️  Removed old evaluation result (ready for fresh evaluation)");
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ TEST DATA READY!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`\n  Application ID : ${application.id}`);
  console.log(`  Job ID         : ${job.id}`);
  console.log(`  Student email  : test-student@hiresmart.dev`);
  console.log(`  Student pass   : Test1234!`);
  console.log("\n  NEXT STEPS:");
  console.log(`  1. Call ai.evaluate via tRPC with applicationId: "${application.id}"`);
  console.log(`     Or POST to /api/trpc/ai.evaluate with body: { "0": { "json": { "applicationId": "${application.id}" } } }`);
  console.log(`  2. After evaluation, visit: /ai/result?applicationId=${application.id}`);
  console.log(`  3. Recruiter view: /ai/filtered-candidates?jobId=${job.id}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
