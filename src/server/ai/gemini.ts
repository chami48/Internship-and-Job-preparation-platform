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
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

/**
 * Generate an overall AI summary feedback paragraph for the student.
 */
export async function generateOverallFeedback(
  input: OverallFeedbackInput,
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
