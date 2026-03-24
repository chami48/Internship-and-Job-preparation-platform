///src/app/prep-quiz/[id]/start/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();

  // ✅ SESSION
  const { data: session, status } = useSession();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  // ✅ redirect if not logged
  useEffect(() => {
    if (!session) {
      router.push("/api/auth/signin");
    }
  }, [session, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ loading state
  if (status === "loading") {
    return <div className="p-10 text-center">Checking session...</div>;
  }

  if (!session) return null;

  // =============================

  const idParam = params?.id as string | string[] | undefined;

  if (!idParam) {
    return <div className="p-10 text-center">Invalid Quiz</div>;
  }

  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (typeof id !== "string") {
    return <div className="p-10 text-center">Invalid Quiz ID</div>;
  }

  const roleMap: Record<string, string> = {
    se: "SOFTWARE_ENGINEER",
    ds: "DATA_ANALYST",
    algo: "SOFTWARE_ENGINEER",
    db: "BACKEND_DEVELOPER",
    os: "SOFTWARE_ENGINEER",
    net: "DEVOPS_ENGINEER",
    web: "FULLSTACK_DEVELOPER",
    oop: "SOFTWARE_ENGINEER",
    ai: "DATA_ANALYST",
    cyber: "DEVOPS_ENGINEER",
  };
  
  
  const role = roleMap[id] ?? "SOFTWARE_ENGINEER";

  const { data: questions, isLoading } =
    api.prepQuiz.getQuestions.useQuery({
      role: role as any,
    });

  const submitMutation = api.prepQuiz.submitQuiz.useMutation();

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="p-10 text-center text-red-500">
        No questions found ❌
      </div>
    );
  }

  const q = questions[current];

  if (!q) {
    return <div className="p-10 text-center">Question not available</div>;
  }

  const handleSelect = (key: string) => {
    setAnswers((prev) => ({
      ...prev,
      [q.id]: key,
    }));
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const submit = () => {
    if (Object.keys(answers).length === 0) {
      alert("Please answer at least one question");
      return;
    }

    // 📝 Get ALL question IDs (answered + unanswered)
    const allQuestionIds = questions.map(q => q.id);
    
    const formatted = Object.entries(answers).map(
      ([questionId, selectedKey]) => ({
        questionId,
        selectedKey,
      })
    );

    submitMutation.mutate(
      {
        role: role as any,
        answers: formatted,
        allQuestionIds, // ✅ Send all 20 question IDs
      },
      {
        onSuccess: (data) => {
          router.push(`/prep-quiz/summary/${data.attemptId}`);
        },
        onError: (err) => {
          console.error(err);
          alert("Submit failed ❌");
        },
      }
    );
  };

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.keys(flagged).filter((id) => flagged[id]).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0F172A] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold">Hire Smart - Prep Quiz</h1>
          <div className="text-sm">Time left <span className="font-semibold">{formatTime(timeLeft)}</span></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 p-6">

        {/* LEFT SIDEBAR - QUESTION INFO */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Question {current + 1}</p>
            
            <p className="text-xs text-gray-600 mb-4">
              {answers[q.id] ? "Answered" : "Not yet answered"}
            </p>

            <p className="text-xs text-gray-600 mb-4">
              Marked out of <br />
              <span className="font-semibold text-gray-900">1.00</span>
            </p>

            <button
              type="button"
              onClick={() =>
                setFlagged((prev) => ({
                  ...prev,
                  [q.id]: !prev[q.id],
                }))
              }
              className={`flex items-center gap-2 text-xs font-medium
                ${flagged[q.id] ? "text-red-600" : "text-gray-600"}
              `}
            >
              <span className="inline-flex items-center gap-1">
                <svg
                  viewBox="0 0 24 24"
                  className={`w-4 h-4 ${flagged[q.id] ? "text-red-500" : "text-gray-400"}`}
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 3a1 1 0 0 1 1 1v16a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zm2 1h8.2a1 1 0 0 1 .8.4l3 4a1 1 0 0 1 0 1.2l-3 4a1 1 0 0 1-.8.4H8V4z" />
                </svg>
                <span
                  className={`inline-block w-2 h-2 rounded-full
                    ${flagged[q.id] ? "bg-red-500" : "bg-gray-300"}
                  `}
                ></span>
              </span>
              Flag question
            </button>
          </div>
        </div>

        {/* MIDDLE SECTION - QUESTION & OPTIONS */}
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            {/* Question */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                {q.question}
              </h2>
            </div>

            {/* Options with Radio Buttons */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4 font-medium">Select one:</p>
              <div className="space-y-3">
                {q.options.map((opt: any) => {
                  const selected = answers[q.id] === opt.key;

                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition
                        ${selected
                          ? "bg-blue-50 border-blue-300"
                          : "bg-white border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`question_${q.id}`}
                        checked={selected}
                        onChange={() => handleSelect(opt.key)}
                        className="w-4 h-4 mt-0.5 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={prev}
                disabled={current === 0}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                ← Previous page
              </button>

              {current === questions.length - 1 ? (
                <button
                  onClick={submit}
                  disabled={submitMutation.isPending}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit"}
                </button>
              ) : (
                <button
                  onClick={next}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Next page →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - NAVIGATION & STATS */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-sm font-semibold text-gray-900 mb-4">Quiz navigation</p>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-1.5 mb-6">
              {questions.map((question: any, i: number) => {
                const answered = answers[question.id];
                const isCurrent = i === current;
                const isFlagged = !!flagged[question.id];

                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`relative w-full aspect-square text-xs font-semibold rounded transition border
                      ${isCurrent
                        ? "bg-blue-900 text-white border-blue-900"
                        : answered
                        ? "bg-gray-300 text-gray-900 border-gray-300"
                        : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                      }
                    `}
                  >
                    {i + 1}
                    {isFlagged && (
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">{answeredCount} answered</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{flaggedCount} flagged</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{questions.length - answeredCount} unanswered</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between">
                <span className="text-gray-600">{current + 1}/{questions.length} current position</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}