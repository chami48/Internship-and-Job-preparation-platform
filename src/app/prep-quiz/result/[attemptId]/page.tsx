//src/app/prep-quiz/result/[attemptId]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();

  const attemptId = params.attemptId as string;

  const { data, isLoading } = api.prepQuiz.getAttempt.useQuery({
    attemptId,
  });

  if (isLoading) {
    return <div className="p-10 text-center">Loading result...</div>;
  }

  if (!data) {
    return <div className="p-10 text-center">Result not found</div>;
  }

  const { attempt, questions } = data;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto bg-white border rounded-lg p-6 shadow-sm mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Quiz Result</h1>

        <p className="text-4xl font-bold text-gray-800">
          {attempt.score} / {questions.length}
        </p>
      </div>

      {/* QUESTIONS REVIEW */}
      <div className="max-w-4xl mx-auto space-y-4">

        {questions.map((q: any, index: number) => {
          const userAnswer = q.userAnswer;
          const correctKey = q.options.find((o: any) => o.isCorrect)?.key;
          const isAnswered = !!q.isAnswered;

          return (
            <div 
              key={q.id} 
              className={`border rounded-lg p-5 shadow-sm
                ${isAnswered ? "bg-white" : "bg-yellow-50 border-yellow-300"}
              `}
            >

              <div className="flex items-start justify-between mb-3">
                <h2 className="font-semibold flex-1">
                  Question {index + 1}: {q.question}
                </h2>
                {!isAnswered && (
                  <span className="ml-2 px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
                    ⚠ NOT ANSWERED
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {q.options.map((opt: any) => {
                  const isUser = userAnswer === opt.key;
                  const isCorrect = opt.key === correctKey;

                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded border text-sm
                        ${isCorrect ? "bg-green-100 border-green-400" : ""}
                        ${isUser && !isCorrect ? "bg-red-100 border-red-400" : ""}
                        ${!isAnswered && !isCorrect ? "bg-white border-gray-200" : ""}
                      `}
                    >
                      {opt.text}

                      {isCorrect && (
                        <span className="ml-2 text-green-600 font-semibold">
                          ✔ Correct
                        </span>
                      )}

                      {isUser && !isCorrect && (
                        <span className="ml-2 text-red-600 font-semibold">
                          ✗ Your Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Explanation: {q.explanation}
              </p>
            </div>
          );
        })}

      </div>

      {/* ACTION */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-between">
        <button
          onClick={() => router.push("/prep-quiz")}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>

        <button
          onClick={() => router.push("/prep-quiz")}
          className="px-4 py-2 border rounded"
        >
          Try Again
        </button>
      </div>

    </div>
  );
}