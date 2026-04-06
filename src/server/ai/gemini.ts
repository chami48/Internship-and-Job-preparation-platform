import { GoogleGenerativeAI } from "@google/generative-ai";

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
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  const wantsDescriptionFill = input.description.trim().length < 50;
  const wantsBenefitsFill = !input.benefits?.trim();

  try {
    const parsed = JSON.parse(cleaned) as Partial<JobImproveOutput>;

    let improvedDescription = (parsed.improvedDescription ?? input.description).trim();
    let improvedBenefits = (parsed.improvedBenefits ?? input.benefits ?? "").trim();

    if (wantsDescriptionFill && improvedDescription.length < 80) {
      improvedDescription = buildDescriptionFromContext(input);
    }

    if (wantsBenefitsFill && improvedBenefits.length < 20) {
      improvedBenefits = buildBenefitsFromContext(input);
    }

    return {
      improvedDescription,
      improvedResponsibilities: (parsed.improvedResponsibilities ?? input.responsibilities).trim(),
      improvedRequirements: (parsed.improvedRequirements ?? input.requirements).trim(),
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
  } catch {
    // Safe fallback if model output is not valid JSON.
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
}
