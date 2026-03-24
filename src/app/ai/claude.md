the current repositary is internship  selection , this group project have 4 members and there are 4 modules in this project and i am doing AI Evaluation & Candidate Filtering Module and i am 
Student Exam Result page
Student Evaluation Details page
Student Permission Status page
Filtered Candidates page for company/recruiter
Candidate Details page for recruiter/admin 


Build frontend for the AI Evaluation & Candidate Filtering Module in a group project. Use the existing project structure and do not modify unrelated files or other team members’ modules. I only want frontend UI pages and reusable components for my module. Use Next.js, TypeScript, and Tailwind CSS. Keep the code clean, modern, responsive, and Create separate reusable components where appropriate.use same color code other members used and for my pages looks advanced and animated website looks eye catching 

Create a responsive student exam result page for an AI Evaluation & Candidate Filtering module using Next.js + TypeScript + Tailwind CSS. The page should include:
- a page title "Exam Result"
- summary cards for Total Score, Percentage, Status, and Cutoff
- a clear PASS or FAIL badge
- a feedback section with AI summary feedback
- a section showing whether CV upload is unlocked or locked
- a button to view detailed evaluation
Use clean card-based UI, modern spacing, rounded corners.


Create a student evaluation details page in Next.js + TypeScript + Tailwind CSS. This page should show a list of evaluated questions. For each question show:
- question number
- question text
- student answer
- model/expected answer
- score received
- maximum marks
- AI feedback
Design it as clean stacked cards, mobile responsive, with good readability. Use reusable components. 


Create a responsive permission status page for students after AI evaluation using Next.js + TypeScript + Tailwind CSS. Show:
- a success state when the student passed and CV upload is unlocked
- a failure state when the student did not meet the cutoff
- a clear status message
- a progress/next-step section
- buttons for next actions
The UI should look modern, professional. conditional rendering for pass/fail.


Create a company/recruiter dashboard page for filtered candidates using Next.js + TypeScript + Tailwind CSS. The page should include:
- page title
- search bar
- filter dropdowns for status and score range
- a table or card layout of qualified candidates
- columns for candidate name, applied role, score, percentage, status, and action button
- responsive design for desktop and mobile



Create a candidate details page for a recruiter dashboard using Next.js + TypeScript + Tailwind CSS. Show:
- candidate profile summary
- applied role
- final score
- percentage
- pass/fail status
- section-wise evaluation summary
- list of answers with AI feedback
- an action area for shortlist/review status display only
Use a professional admin dashboard style with clean cards and responsive layout. Use reusable UI components.


Create reusable frontend components for an AI Evaluation & Candidate Filtering module using Next.js + TypeScript + Tailwind CSS. Components needed:
- ScoreCard
- StatusBadge
- FeedbackBox
- QuestionReviewCard
- CandidateTable
- SearchFilterBar
Keep the components reusable, typed with interfaces, responsive, and styled consistently. 

Suggest a clean frontend folder structure for the AI Evaluation & Candidate Filtering Module only, inside an existing Next.js app. I need pages for student results, evaluation details, permission status, recruiter filtered candidates, and candidate details. Also include a components folder and mock data folder. Do not affect unrelated modules.

Only create new files for my module or update files that belong directly to my AI Evaluation & Candidate Filtering frontend. Do not edit shared layout, navbar, footer, header, home page, jobs page, or any unrelated files unless I explicitly ask. // 


and now i have to do the backend for this pages and , note that my part i only AI section which means D:\internship\Internship-and-Job-preparation-platform\src\app\ai   , if want to edit anything or create only under this path sections

now i have to do the backend for my ai part which is Student Exam Result page
Student Evaluation Details page
Student Permission Status page
Filtered Candidates page for company/recruiter
Candidate Details page for recruiter/admin for this pages and , and if i want to do the ai evalution which means the 01 – Exam Submission Received

Answers Locked & Sent for Evaluation
Candidate ID Matched

02 – Intelligent AI Evaluation
Cutoff

04 – Candidate Filtering

Marks Pass/Fail
Compares with Model Answers
Handles Wording Varies (Semantic Analysis)

03 – Scoring & Cutoff Check

Calculates Final Score
Compares to Job 
Filters Best Candidates for Company View

05 – Result Generation & Permission

Generates Evaluation Result
Grants CV Upload Permission based on Pass/Fail       this is the structure of my part and and i am using gemini api key for this ai part and i want details(database details and question bank and more ) from others module , then only i can evaluate using ai model for calculations 


# AI Evaluation & Candidate Filtering Module — Backend Plan

## Context

Frontend for the AI Evaluation & Candidate Filtering Module is complete under `src/app/ai/`. All pages currently use mock data from `src/app/ai/data/mockData.ts`. The goal is to:
1. Add two new Prisma models to store AI evaluation results
2. Implement the `aiRouter` tRPC procedures (file already exists but is empty at `src/server/api/routers/ai/index.ts`)
3. Wire up the frontend pages to real data via tRPC

The project uses **tRPC + Prisma + Next.js App Router + NextAuth JWT**. All other routers (exam, application, job, student, company) are already working. The AI router is registered in `src/server/api/root.ts` already.

AI evaluation uses **Gemini API** (not OpenAI).

---

## Step 1 — Prisma Schema Changes (`prisma/schema.prisma`)

Add after the existing models. Do NOT modify any existing model except adding two reverse relations.

### New enum
```prisma
enum EvalStatus {
  PENDING      // exam submitted, not yet evaluated
  PROCESSING   // Gemini call in progress
  COMPLETED    // evaluation done
  FAILED       // error during evaluation
}
```

### New model: `EvaluationResult`
One record per Application. Stores the overall AI evaluation outcome.

```prisma
model EvaluationResult {
  id              String     @id @default(cuid())
  applicationId   String     @unique
  application     Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  totalScore      Float                      // sum of all question scores
  maxScore        Float                      // total possible marks
  percentage      Float                      // (totalScore / maxScore) * 100
  cutoff          Float                      // cutoff % used at time of evaluation
  passed          Boolean                    // percentage >= cutoff
  aiFeedback      String                     // overall AI-generated summary
  cvUploadGranted Boolean    @default(false) // unlocked if passed

  status          EvalStatus @default(PENDING)
  evaluatedAt     DateTime   @default(now())

  questionEvals   QuestionEvaluation[]

  @@index([applicationId])
}
```

### New model: `QuestionEvaluation`
One record per question in the exam. Stores per-question AI scoring and feedback.

```prisma
model QuestionEvaluation {
  id                  String           @id @default(cuid())
  evaluationResultId  String
  evaluationResult    EvaluationResult @relation(fields: [evaluationResultId], references: [id], onDelete: Cascade)

  questionId          String
  question            Question         @relation(fields: [questionId], references: [id])

  applicationId       String
  studentAnswer       String?          // copy of ExamAnswer.answer
  expectedAnswer      String?          // rubric or correctKey from Question
  scoreAwarded        Float            // 0 to maxMarks
  maxMarks            Float            // max marks for this question
  aiFeedback          String           // per-question AI feedback

  createdAt           DateTime         @default(now())

  @@index([evaluationResultId])
  @@index([applicationId])
}
```

### Reverse relations to add to existing models
```prisma
// In Application model — add:
evaluationResult  EvaluationResult?

// In Question model — add:
questionEvals     QuestionEvaluation[]
```

### Add `cutoff` field to `Job` model
The cutoff threshold (%) for passing is stored per job.
```prisma
// In Job model — add:
cutoff  Float  @default(60)
```
> Coordinate with Dakshika (Module 1/Job Management) since they own the Job model. This is a non-breaking additive change.

---

## Step 2 — Gemini Helper (`src/server/ai/gemini.ts`)

Create a server-side helper. This is NOT under `src/app/ai/` — it belongs in `src/server/` with the other server utilities.

**Purpose**: Evaluate a single scenario/open-ended answer using Gemini.

```
src/server/ai/gemini.ts
```

Logic:
- Accept `{ questionPrompt, rubric, studentAnswer, maxMarks }`
- Call Gemini API (`@google/generative-ai` SDK) with a structured prompt
- Parse JSON response: `{ score: number, feedback: string }`
- For MCQ questions: skip Gemini — compare `studentAnswer === correctKey` directly (deterministic, score = maxMarks or 0)
- For SCENARIO questions: use Gemini semantic evaluation
- Env var: `GEMINI_API_KEY`

---

## Step 3 — AI tRPC Router (`src/server/api/routers/ai/index.ts`)

Replace the empty file with these procedures:

### `ai.evaluate` — `mutation`
**Trigger AI evaluation for a submitted exam.**
- Input: `{ applicationId: string }`
- Auth: `publicProcedure` (called server-side after exam submit, or by admin trigger)
- Steps:
  1. Fetch `Application` with `ExamAnswer[]` and `Job` (for cutoff)
  2. Check `examSubmitted === true`, check no existing `EvaluationResult` (prevent double eval)
  3. Create `EvaluationResult` with `status: PROCESSING`
  4. For each `ExamAnswer`, fetch the `Question` (type, prompt, correctKey, rubric, options)
  5. MCQ: score = `answer === correctKey ? maxMarks : 0` (no AI call)
  6. SCENARIO: call `evaluateWithGemini()` → get score + feedback
  7. Create all `QuestionEvaluation` records
  8. Calculate `totalScore`, `percentage`, compare to `job.cutoff` → set `passed`
  9. Generate overall `aiFeedback` summary via Gemini
  10. Update `EvaluationResult` with final values + `status: COMPLETED`
  11. Set `cvUploadGranted = passed`
- Returns: `{ success: true, evaluationResultId, passed, percentage }`

### `ai.getResult` — `query`
**Student result page data.**
- Input: `{ applicationId: string }`
- Auth: `protectedProcedure` (student must own the application)
- Returns: `EvaluationResult` fields (totalScore, maxScore, percentage, cutoff, passed, aiFeedback, cvUploadGranted, status)
- Used by: `src/app/ai/result/page.tsx`

### `ai.getEvaluationDetails` — `query`
**Per-question breakdown for evaluation details page.**
- Input: `{ applicationId: string }`
- Auth: `protectedProcedure`
- Returns: `QuestionEvaluation[]` joined with `Question.prompt`
- Each item: questionId, prompt, studentAnswer, expectedAnswer, scoreAwarded, maxMarks, aiFeedback
- Used by: `src/app/ai/evaluation-details/page.tsx`

### `ai.getPermissionStatus` — `query`
**Student permission status.**
- Input: `{ applicationId: string }`
- Auth: `protectedProcedure`
- Returns: `{ passed, cvUploadGranted, percentage, cutoff, status, message }`
- Used by: `src/app/ai/permission-status/page.tsx`

### `ai.getFilteredCandidates` — `query`
**Recruiter filtered candidates list.**
- Input: `{ jobId: string, statusFilter?: "PASS"|"FAIL"|"ALL", minScore?: number, search?: string }`
- Auth: `publicProcedure` (company login is separate from NextAuth, so can't use protectedProcedure directly — use publicProcedure and validate companyId from input if needed)
- Returns: array of `{ applicationId, fullName, email, role, totalScore, maxScore, percentage, passed, evaluatedAt }`
- Used by: `src/app/ai/filtered-candidates/page.tsx`

### `ai.getCandidateDetail` — `query`
**Full candidate detail for recruiter.**
- Input: `{ applicationId: string }`
- Auth: `publicProcedure`
- Returns: full `EvaluationResult` + all `QuestionEvaluation[]` + student profile fields from `Application` (fullName, email, university, degree, specialization, cgpa, programmingLanguages, frameworks, linkedin, github, portfolio)
- Used by: `src/app/ai/candidate/[id]/page.tsx`

---

## Step 4 — Frontend Integration

Replace mock data imports with tRPC calls in each page. The tRPC client is already set up project-wide (`api` from `~/trpc/react`).

| Page | Mock data to replace | tRPC call |
|------|---------------------|-----------|
| `src/app/ai/result/page.tsx` | `mockExamResult` | `api.ai.getResult.useQuery({ applicationId })` |
| `src/app/ai/evaluation-details/page.tsx` | `mockEvaluatedQuestions` | `api.ai.getEvaluationDetails.useQuery({ applicationId })` |
| `src/app/ai/permission-status/page.tsx` | `mockPermissionStatus` | `api.ai.getPermissionStatus.useQuery({ applicationId })` |
| `src/app/ai/filtered-candidates/page.tsx` | `mockCandidates` | `api.ai.getFilteredCandidates.useQuery({ jobId, ... })` |
| `src/app/ai/candidate/[id]/page.tsx` | `mockCandidateDetail` | `api.ai.getCandidateDetail.useQuery({ applicationId: id })` |

Pages need to get `applicationId` / `jobId` from URL search params or route params (passed from exam module after submission).

---

## Files to Create / Modify

```
CREATE:
  src/server/ai/gemini.ts                          ← Gemini API helper

MODIFY:
  prisma/schema.prisma                             ← add 2 models, 1 enum, reverse relations, cutoff field
  src/server/api/routers/ai/index.ts               ← implement aiRouter (currently empty)
  src/app/ai/result/page.tsx                       ← replace mock with tRPC
  src/app/ai/evaluation-details/page.tsx           ← replace mock with tRPC
  src/app/ai/permission-status/page.tsx            ← replace mock with tRPC
  src/app/ai/filtered-candidates/page.tsx          ← replace mock with tRPC
  src/app/ai/candidate/[id]/page.tsx               ← replace mock with tRPC
```

> `.env` needs `GEMINI_API_KEY=...` added.
> Install `@google/generative-ai` package if not already present.

---

## Data Flow

```
Module 3 (exam.submit tRPC) → Application.examSubmitted = true + ExamAnswer rows saved
                                          ↓
                     ai.evaluate mutation triggered (after exam submit)
                                          ↓
             MCQ answers scored directly | SCENARIO answers → Gemini API
                                          ↓
         EvaluationResult + QuestionEvaluation[] saved to DB (status: COMPLETED)
                                          ↓
     Student: ai.getResult / ai.getEvaluationDetails / ai.getPermissionStatus
     Recruiter: ai.getFilteredCandidates / ai.getCandidateDetail
```

---

## Verification

1. Run `npx prisma migrate dev --name add_ai_evaluation` — confirm migration succeeds
2. Install `@google/generative-ai` if not present: `pnpm add @google/generative-ai`
3. Add `GEMINI_API_KEY` to `.env`
4. Use an existing test application with `examSubmitted = true` and `ExamAnswer` rows
5. Call `ai.evaluate` mutation with that `applicationId` — verify `EvaluationResult` row created in DB with `status: COMPLETED`
6. Visit `/ai/result?applicationId=xxx` — verify real scores render instead of mock data
7. Visit `/ai/filtered-candidates?jobId=xxx` — verify candidates appear with real scores
8. Verify MCQ scoring works without Gemini API calls
9. Verify SCENARIO scoring returns valid `score` (0–maxMarks) and non-empty `feedback` from Gemini


## important instruction
this implementation doesn't not effect others part(module) that's important things if any logic overrides try diffrent logic. we need only other memebers data , not for editing 

## prisma db file sql.lite 
add new datas to check the implementation

## gemini api key
AIzaSyByWALb3oa0XX6telxCfaGobW1vRxbglUc 

## after the implementation i need to test my ai evalution part 
