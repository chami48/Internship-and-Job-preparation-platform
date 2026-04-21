import { GoogleGenerativeAI } from "@google/generative-ai";

// Default Gemini instance for most features
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

interface ScenarioEvalInput {
  questionPrompt: string;
  rubric: string;
  studentAnswer: string;
  maxMarks: number;
}

interface ScenarioEvalResult {
  score: number;
  feedback: string;
}

/**
 * Use Gemini to evaluate a SCENARIO-type answer against the rubric.
 * Returns a score (0 to maxMarks) and feedback string.
 */
export async function evaluateScenarioAnswer(
  input: ScenarioEvalInput,
): Promise<ScenarioEvalResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an expert exam evaluator. Evaluate the student's answer against the rubric/model answer.

Question: ${input.questionPrompt}

Rubric / Model Answer: ${input.rubric}

Student's Answer: ${input.studentAnswer}

Maximum Marks: ${input.maxMarks}

Instructions:
- Compare the student's answer semantically with the rubric. Accept different wording if the meaning is correct.
- Award partial marks for partially correct answers.
- Score must be between 0 and ${input.maxMarks}.
- Provide brief, constructive feedback (2-3 sentences).

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{"score": <number>, "feedback": "<string>"}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as ScenarioEvalResult;
    // Clamp score to valid range
    parsed.score = Math.max(0, Math.min(input.maxMarks, parsed.score));
    return parsed;
  } catch {
    // If Gemini returns unparseable output, give 0 with error note
    return {
      score: 0,
      feedback: "AI evaluation could not parse response. Manual review recommended.",
    };
  }
}

interface OverallFeedbackInput {
  questionResults: { questionPrompt: string; score: number; maxMarks: number }[];
  percentage: number;
  passed: boolean;
}

interface JobImproveInput {
  title: string;
  role: string;
  type: string;
  level: string;
  location: string;
  tags: string;
  salary?: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits?: string;
}

interface JobImproveOutput {
  improvedDescription: string;
  improvedResponsibilities: string;
  improvedRequirements: string;
  improvedBenefits: string;
  recruiterTips: string[];
}

function isGeminiQuotaOrRateError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("429") ||
    message.includes("too many requests") ||
    message.includes("quota") ||
    message.includes("rate limit")
  );
}

function toReadable(value: string): string {
  return value.replace(/_/g, " ").toLowerCase();
}

function buildDescriptionFromContext(input: JobImproveInput): string {
  const role = toReadable(input.role);
  const type = toReadable(input.type);
  const level = toReadable(input.level);
  const location = input.location.trim() || "our team";
  const keySkills = input.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");

  return `We are hiring a ${level} ${input.title} (${role}) for a ${type} role based in ${location}. You will collaborate with product, design, and engineering teams to build reliable, user-focused features and improve delivery quality. The role is ideal for candidates who can take ownership, communicate clearly, and solve practical product problems. Strong familiarity with ${keySkills || "modern web technologies"} will help you succeed in this position.`;
}

function buildBenefitsFromContext(input: JobImproveInput): string {
  const base = [
    "Health insurance",
    "Flexible working hours",
    "Learning and certification support",
    "Career growth opportunities",
  ];

  const type = input.type.toUpperCase();
  const level = input.level.toUpperCase();

  if (type === "INTERNSHIP") {
    base.unshift("Mentorship from senior engineers");
    base.push("Possibility of full-time conversion");
  }

  if (level === "SENIOR") {
    base.push("Leadership and strategic ownership opportunities");
  }

  return Array.from(new Set(base)).join(", ");
}

function normalizeBullets(text: string, fallbackItems: string[]): string {
  const items = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•\s]+/, "").trim())
    .filter(Boolean);

  const merged = items.length > 0 ? items : fallbackItems;
  const limited = merged.slice(0, 6);

  while (limited.length < 4 && fallbackItems[limited.length]) {
    limited.push(fallbackItems[limited.length] || "");
  }

  return limited.map((item) => `• ${item}`).join("\n");
}

function buildResponsibilitiesFromContext(input: JobImproveInput): string {
  const fallback = [
    "Design, develop, and maintain scalable application features.",
    "Collaborate with product, design, and QA teams to deliver releases.",
    "Write clean, testable, and maintainable code following best practices.",
    "Troubleshoot issues, optimize performance, and support production stability.",
    "Participate in code reviews and contribute to engineering standards.",
  ];

  return normalizeBullets(input.responsibilities, fallback);
}

function buildRequirementsFromContext(input: JobImproveInput): string {
  const skillHints = input.tags
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  const fallback = [
    `Proficiency in ${skillHints.join(", ") || "relevant modern technologies"}.`,
    "Strong problem-solving, communication, and collaboration skills.",
    "Hands-on experience building and maintaining production-ready software.",
    "Ability to write clean code and contribute to code quality practices.",
    "Bachelor's degree in Computer Science or equivalent practical experience.",
  ];

  return normalizeBullets(input.requirements, fallback);
}

function buildJobImproveFallback(input: JobImproveInput): JobImproveOutput {
  const description =
    input.description.trim().length < 80
      ? buildDescriptionFromContext(input)
      : `${input.description.trim()} The ideal candidate is proactive, quality-focused, and comfortable working in a collaborative environment.`;

  const improvedBenefits = input.benefits?.trim()
    ? input.benefits.trim()
    : buildBenefitsFromContext(input);

  return {
    improvedDescription: description,
    improvedResponsibilities: buildResponsibilitiesFromContext(input),
    improvedRequirements: buildRequirementsFromContext(input),
    improvedBenefits,
    recruiterTips: [
      "Add a transparent salary range to increase trust and conversion.",
      "Keep responsibilities and requirements concise with 4 to 6 bullet points.",
      "Highlight team culture, learning support, and growth opportunities.",
    ],
  };
}

/**
 * Generate an overall AI summary feedback paragraph for the student.
 */
export async function generateOverallFeedback(
  input: OverallFeedbackInput,
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const breakdown = input.questionResults
    .map((q, i) => `Q${i + 1}: ${q.score}/${q.maxMarks} — "${q.questionPrompt.slice(0, 80)}"`)
    .join("\n");

  const prompt = `You are an expert exam evaluator. Based on the following exam results, write a brief overall feedback paragraph (3-4 sentences) for the student.

Score breakdown:
${breakdown}

Overall percentage: ${input.percentage.toFixed(1)}%
Result: ${input.passed ? "PASSED" : "FAILED"}

Write constructive, professional feedback summarizing strengths and areas for improvement. Do not use markdown formatting. Respond with only the feedback paragraph.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

/**
 * Improve a recruiter job draft and return polished sections as JSON.
 */
export async function improveJobPostDraft(
  input: JobImproveInput,
): Promise<JobImproveOutput> {

  // Require NILUMI_API_KEY only when this feature is used
  if (!process.env.NILUMI_API_KEY) {
    throw new Error("NILUMI_API_KEY is required to improve job post with AI. Please set it in your .env file.");
  }
  const jobAnalyzerGenAI = new GoogleGenerativeAI(process.env.NILUMI_API_KEY);
  const model = jobAnalyzerGenAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an expert technical recruiter. Improve this job post draft.

Job Title: ${input.title}
Role: ${input.role}
Type: ${input.type}
Level: ${input.level}
Location: ${input.location}
Tags/Skills: ${input.tags}
Salary: ${input.salary ?? "Not provided"}

Draft Description:
${input.description}

Draft Responsibilities:
${input.responsibilities}

Draft Requirements:
${input.requirements}

Draft Benefits:
${input.benefits ?? "Not provided"}

Instructions:
- Keep wording professional and concise.
- Keep content realistic for a real hiring post.
- Return exactly 4 to 6 bullet points for responsibilities and requirements.
- If benefits are missing, create a strong default benefits section.
- If draft description is shorter than 50 characters, rewrite it into a clear 90-140 word description using the role, level, type, location, and tags.
- If benefits are missing, always return at least 4 concrete benefits.
- Return 3 short recruiter tips for improving candidate attraction.

Respond ONLY as valid JSON (no markdown, no code fence) with this exact shape:
{
  "improvedDescription": "...",
  "improvedResponsibilities": "...",
  "improvedRequirements": "...",
  "improvedBenefits": "...",
  "recruiterTips": ["...", "...", "..."]
}`;

  const wantsDescriptionFill = input.description.trim().length < 50;
  const wantsBenefitsFill = !input.benefits?.trim();

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    let parsed: Partial<JobImproveOutput>;

    try {
      parsed = JSON.parse(cleaned) as Partial<JobImproveOutput>;
    } catch {
      // If model returns non-JSON content, keep flow alive with deterministic fallback.
      return {
        improvedDescription: wantsDescriptionFill
          ? buildDescriptionFromContext(input)
          : input.description,
        improvedResponsibilities: input.responsibilities,
        improvedRequirements: input.requirements,
        improvedBenefits: wantsBenefitsFill
          ? buildBenefitsFromContext(input)
          : input.benefits ?? "",
        recruiterTips: [
          "Add a clearer, role-specific title.",
          "Include a salary range for transparency.",
          "Expand benefits to improve applicant interest.",
        ],
      };
    }

    const safeText = (value: unknown, fallback: string): string => {
      if (typeof value === "string") return value.trim();
      if (typeof value === "number" || typeof value === "boolean") return String(value).trim();
      if (Array.isArray(value)) {
        return value
          .map((entry) => (typeof entry === "string" ? entry : String(entry)))
          .join(", ")
          .trim();
      }
      return fallback.trim();
    };

    let improvedDescription = safeText(parsed.improvedDescription, input.description);
    let improvedBenefits = safeText(parsed.improvedBenefits, input.benefits ?? "");

    if (wantsDescriptionFill && improvedDescription.length < 80) {
      improvedDescription = buildDescriptionFromContext(input);
    }

    if (wantsBenefitsFill && improvedBenefits.length < 20) {
      improvedBenefits = buildBenefitsFromContext(input);
    }

    return {
      improvedDescription,
      improvedResponsibilities: safeText(parsed.improvedResponsibilities, input.responsibilities),
      improvedRequirements: safeText(parsed.improvedRequirements, input.requirements),
      improvedBenefits,
      recruiterTips:
        Array.isArray(parsed.recruiterTips) && parsed.recruiterTips.length > 0
          ? parsed.recruiterTips.slice(0, 5).map((tip) => String(tip))
          : [
              "Add a transparent salary range when possible.",
              "List 4 to 6 clear responsibilities.",
              "Highlight growth opportunities and team culture.",
            ],
    };
  } catch (error) {
    if (isGeminiQuotaOrRateError(error)) {
      return buildJobImproveFallback(input);
    }

    throw error;
  }
}
