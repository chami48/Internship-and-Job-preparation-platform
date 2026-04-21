import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

// Model priority list — falls back down the list on 503 / overload errors
const MODEL_FALLBACK_LIST = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

/**
 * Call Gemini with automatic retry (exponential backoff) and model fallback.
 * Retries up to 3 times per model, then falls back to the next model in the list.
 */
async function callGeminiWithRetry(
  prompt: string,
  maxRetries = 3,
): Promise<string> {
  let lastError: unknown;

  for (const modelName of MODEL_FALLBACK_LIST) {
    const model = genAI.getGenerativeModel({ model: modelName });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (err: unknown) {
        lastError = err;
        const isOverload =
          err instanceof Error &&
          (err.message.includes("503") ||
            err.message.includes("Service Unavailable") ||
            err.message.includes("overloaded") ||
            err.message.includes("high demand") ||
            err.message.includes("429") ||
            err.message.includes("Too Many Requests"));

        if (!isOverload) {
          // Non-recoverable error — stop retrying this model
          break;
        }

        if (attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s …
          const delayMs = Math.pow(2, attempt) * 1000;
          console.warn(
            `[Gemini] ${modelName} attempt ${attempt} failed (overloaded). Retrying in ${delayMs}ms…`,
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          console.warn(
            `[Gemini] ${modelName} exhausted ${maxRetries} attempts — trying next model fallback.`,
          );
        }
      }
    }
  }

  // All models failed — rethrow last error
  throw lastError;
}

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
 * Uses retry logic + model fallback to handle 503 overload errors.
 */
export async function evaluateScenarioAnswer(
  input: ScenarioEvalInput,
): Promise<ScenarioEvalResult> {
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

  try {
    const text = await callGeminiWithRetry(prompt);

    // Strip markdown code fences if present
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned) as ScenarioEvalResult;
    // Clamp score to valid range
    parsed.score = Math.max(0, Math.min(input.maxMarks, parsed.score));
    return parsed;
  } catch (err) {
    console.error("[Gemini] evaluateScenarioAnswer failed:", err);
    // Return a safe fallback rather than crashing the whole evaluation
    return {
      score: 0,
      feedback:
        "AI evaluation could not be completed at this time. Manual review recommended.",
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
 * Uses retry logic + model fallback to handle 503 overload errors.
 */
export async function generateOverallFeedback(
  input: OverallFeedbackInput,
): Promise<string> {
  const breakdown = input.questionResults
    .map((q, i) => `Q${i + 1}: ${q.score}/${q.maxMarks} — "${q.questionPrompt.slice(0, 80)}"`)
    .join("\n");

  const prompt = `You are an expert exam evaluator. Based on the following exam results, write a brief overall feedback paragraph (3-4 sentences) for the student.

Score breakdown:
${breakdown}

Overall percentage: ${input.percentage.toFixed(1)}%
Result: ${input.passed ? "PASSED" : "FAILED"}

Write constructive, professional feedback summarizing strengths and areas for improvement. Do not use markdown formatting. Respond with only the feedback paragraph.`;

  try {
    return await callGeminiWithRetry(prompt);
  } catch (err) {
    console.error("[Gemini] generateOverallFeedback failed:", err);
    // Return a generic fallback — evaluation still completes
    return input.passed
      ? "Well done! You have passed the evaluation. Continue to build on your strengths and review any areas where you lost marks."
      : "You did not meet the cutoff score for this evaluation. Please review the feedback for each question and focus on the areas where you need improvement.";
  }
}
