//smart-screening\src\app\exam\[jobId]\page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useEffect, useRef, useState, useCallback } from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type QuestionType = {
  id: string;
  prompt: string;
  type: "MCQ" | "SCENARIO";
  options: { id: string; key: string; text: string }[];
};
type ViolationType =
  | "FULLSCREEN_EXIT"
  | "TAB_SWITCH"
  | "COPY_PASTE_RIGHTCLICK"
  | "SCREENSHOT_ATTEMPT"
  | "DEV_TOOLS";

interface ViolationEvent {
  type: ViolationType;
  message: string;
  timestamp: Date;
}

const MAX_VIOLATIONS = 3;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const violationLabel: Record<ViolationType, string> = {
  FULLSCREEN_EXIT: "Exited fullscreen mode",
  TAB_SWITCH: "Switched to another tab or window",
  COPY_PASTE_RIGHTCLICK: "Copy / Paste / Right-click attempt",
  SCREENSHOT_ATTEMPT: "Screenshot attempt detected",
  DEV_TOOLS: "Developer tools opened",
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function ExamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get("appId");

  const { data, isLoading } = api.exam.getQuestions.useQuery(
  {
    applicationId: appId!,
  },
  {
    enabled: !!appId,
  }
);

const questions = data as QuestionType[] | undefined;

  const submitExam = api.exam.submit.useMutation();
  const logViolationMutation = api.exam.logViolation.useMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [violations, setViolations] = useState<ViolationEvent[]>([]);
  const [activeAlert, setActiveAlert] = useState<ViolationEvent | null>(null);
  const [terminated, setTerminated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [startingExam, setStartingExam] = useState(false);

  const [totalTimeLeft, setTotalTimeLeft] = useState(25 * 60);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const alertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submittedRef = useRef(false);

  // ─────────────────────────────────────────────
  // FULLSCREEN HELPERS
  // ─────────────────────────────────────────────
  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({ navigationUI: "hide" });
      }
    } catch { /* ignore */ }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch { /* ignore */ }
  }, []);

  // ─────────────────────────────────────────────
  // CAMERA
  // ─────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraAllowed(true);
      return true;
    } catch {
      setCameraError("Camera access is required to take this exam. Please allow camera access and try again.");
      setCameraAllowed(false);
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  }, []);

  

  // ─────────────────────────────────────────────
  // VIOLATION SYSTEM
  // ─────────────────────────────────────────────
  const triggerViolation = useCallback(
  (type: ViolationType) => {
    setViolations((prev) => {
      const count = prev.length + 1;

      const event: ViolationEvent = {
        type,
        message: violationLabel[type],
        timestamp: new Date(),
      };

      const next = [...prev, event];

      // 🔥 SAVE TO DATABASE
      if (appId) {
        logViolationMutation.mutate(
  {
    applicationId: appId,
    type,
    message: violationLabel[type],
  },
  {
    onSuccess: (data) => {
      if (data.terminated) {
        setTerminated(true);
      }
    },
  }
);
      }

      setActiveAlert(event);
      window.focus();

      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = setTimeout(() => setActiveAlert(null), 6000);

      if (count >= MAX_VIOLATIONS) {
        setTerminated(true);
        stopCamera();

        setTimeout(async () => {
          await exitFullscreen();
          setTimeout(() => router.push("/"), 600);
        }, 3500);
      } else {
        if (!document.fullscreenElement) {
        enterFullscreen();}
      }

      return next;
    });
  },
  [
    appId,
    logViolationMutation,
    enterFullscreen,
    exitFullscreen,
    stopCamera,
    router,
  ]
);

  // ─────────────────────────────────────────────
  // ANTI-CHEAT — only active during exam
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted) return;
    const handler = () => {
      if (!document.fullscreenElement) triggerViolation("FULLSCREEN_EXIT");
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [examStarted, triggerViolation]);

  useEffect(() => {
    if (!examStarted) return;
    const onVisibility = () => {
      if (document.hidden) triggerViolation("TAB_SWITCH");
    };
    const onBlur = () => triggerViolation("TAB_SWITCH");
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
    };
  }, [examStarted, triggerViolation]);

  useEffect(() => {
    if (!examStarted) return;
    const block = (e: Event) => {
      e.preventDefault();
      triggerViolation("COPY_PASTE_RIGHTCLICK");
    };
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("paste", block);
    document.addEventListener("contextmenu", block);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("contextmenu", block);
    };
  }, [examStarted, triggerViolation]);

  useEffect(() => {
    if (!examStarted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        triggerViolation("SCREENSHOT_ATTEMPT");
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        ["s", "p", "u", "i", "j", "c", "v", "x", "a"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        if (["c", "v", "x"].includes(e.key.toLowerCase()))
          triggerViolation("COPY_PASTE_RIGHTCLICK");
      }
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        triggerViolation("DEV_TOOLS");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [examStarted, triggerViolation]);

  useEffect(() => {
    if (!examStarted) return;
    let devOpen = false;
    const check = () => {
      const w = window.outerWidth - window.innerWidth > 160;
      const h = window.outerHeight - window.innerHeight > 160;
      if ((w || h) && !devOpen) {
        devOpen = true;
        triggerViolation("DEV_TOOLS");
      } else if (!w && !h) {
        devOpen = false;
      }
    };
    const id = setInterval(check, 1500);
    return () => clearInterval(id);
  }, [examStarted, triggerViolation]);

  // DEV TOOLS DETECTION
useEffect(() => {
  if (!examStarted) return;
  let devOpen = false;
  const check = () => {
    const w = window.outerWidth - window.innerWidth > 160;
    const h = window.outerHeight - window.innerHeight > 160;
    if ((w || h) && !devOpen) {
      devOpen = true;
      triggerViolation("DEV_TOOLS");
    } else if (!w && !h) {
      devOpen = false;
    }
  };
  const id = setInterval(check, 1500);
  return () => clearInterval(id);
}, [examStarted, triggerViolation]);

// ─────────────────────────────────────────────
// BLOCK PAGE REFRESH (F5 / CTRL+R)
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// BLOCK REFRESH + ESC + PRINTSCREEN
// ─────────────────────────────────────────────
useEffect(() => {
  if (!examStarted) return;

  const preventKeys = (e: KeyboardEvent) => {

    // REFRESH BLOCK
    if (
      e.key === "F5" ||
      (e.ctrlKey && e.key.toLowerCase() === "r") ||
      (e.metaKey && e.key.toLowerCase() === "r")
    ) {
      e.preventDefault();
      triggerViolation("TAB_SWITCH");
    }

    // ESC KEY BLOCK (exit fullscreen)
    if (e.key === "Escape") {
  e.preventDefault();
  triggerViolation("FULLSCREEN_EXIT");
  document.documentElement.requestFullscreen();
}

    // PRINT SCREEN BLOCK
    if (e.key === "PrintScreen") {
      e.preventDefault();
      triggerViolation("SCREENSHOT_ATTEMPT");
    }

  };

  document.addEventListener("keydown", preventKeys);

  return () => {
    document.removeEventListener("keydown", preventKeys);
  };

}, [examStarted, triggerViolation]);

// ─────────────────────────────────────────────
// BLOCK NEW TAB / NEW WINDOW
// ─────────────────────────────────────────────
useEffect(() => {
  if (!examStarted) return;

  const blockShortcuts = (e: KeyboardEvent) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      ["t", "n"].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      triggerViolation("TAB_SWITCH");
    }
  };

  document.addEventListener("keydown", blockShortcuts);

  return () => {
    document.removeEventListener("keydown", blockShortcuts);
  };
}, [examStarted, triggerViolation]);

  // ─────────────────────────────────────────────
  // TOTAL TIMER
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted) return;
    const timer = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted]);

  // ─────────────────────────────────────────────
// DETECT BROWSER MINIMIZE
// ─────────────────────────────────────────────
useEffect(() => {
  if (!examStarted) return;

  const handleVisibility = () => {
    if (document.hidden) {
      triggerViolation("TAB_SWITCH");
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}, [examStarted, triggerViolation]);

  // ─────────────────────────────────────────────
// DETECT WINDOW RESIZE / SPLIT SCREEN
// ─────────────────────────────────────────────
useEffect(() => {
  if (!examStarted) return;

  const detectResize = () => {
    const widthRatio = window.innerWidth / screen.width;

    if (widthRatio < 0.8) {
      triggerViolation("TAB_SWITCH");
    }
  };

  window.addEventListener("resize", detectResize);

  return () => {
    window.removeEventListener("resize", detectResize);
  };
}, [examStarted, triggerViolation]);

  // ─────────────────────────────────────────────
  // PER-QUESTION TIMER
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted || !questions) return;
    const q = questions[currentIndex];
    if (!q) return;
    const time = q.type === "MCQ" ? 2 * 60 : 5 * 60;
    setQuestionTimeLeft(time);
    const timer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          goNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, questions, examStarted]);

  // ─────────────────────────────────────────────
  // NAVIGATION — forward only
  // ─────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (!questions) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleAutoSubmit();
    }
  }, [currentIndex, questions]);

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────
  const handleAutoSubmit = useCallback(async () => {
    if (submittedRef.current || !appId) return;
    submittedRef.current = true;
    setSubmitted(true);
    stopCamera();

    const formatted = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
    try {
      await submitExam.mutateAsync({ applicationId: appId, answers: formatted });
    } finally {
      await exitFullscreen(); // ← exit fullscreen before redirect
      setTimeout(() => router.push("/?submitted=true"), 600);
    }
  }, [appId, answers, submitExam, stopCamera, exitFullscreen, router]);

  // ─────────────────────────────────────────────
  // START EXAM — fullscreen starts ONLY here
  // ─────────────────────────────────────────────
  const handleStartExam = async () => {
    setStartingExam(true);
    setCameraError(null);
    const camOk = await startCamera();
    if (!camOk) {
      setStartingExam(false);
      return;
    }
    await enterFullscreen(); // ← fullscreen begins here, NOT before
    setExamStarted(true);
    setStartingExam(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, [stopCamera]);

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────
  if (isLoading || !questions) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-medium">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // PRE-START SCREEN — normal window, no fullscreen
  // ─────────────────────────────────────────────
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 tracking-widest uppercase mb-0.5">
                  Technical Assessment
                </p>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">
                  Role Based Examination
                </h1>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              This is a proctored online assessment. Please review all requirements
              carefully before starting. Once begun, the exam cannot be paused.
            </p>
          </div>

          {/* Rules card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 mb-5">
            {[
              {
                icon: (
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: "Total duration",
                value: "25 minutes — auto-submits when time expires",
              },
              {
                icon: (
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                  </svg>
                ),
                label: "Question timing",
                value: "Multiple choice: 2 min each · Essay / Scenario: 5 min each",
              },
              {
                icon: (
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.894L15 14M3 8a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2V10a2 2 0 00-2-2H3z" />
                  </svg>
                ),
                label: "Camera monitoring",
                value: "Webcam must remain on and visible throughout the exam",
              },
              {
                icon: (
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                label: "Fullscreen required",
                value: "Exam runs in fullscreen — exiting counts as a violation",
              },
              {
                icon: (
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ),
                label: "Restricted actions",
                value: "No copy, paste, screenshots, tab switching, or dev tools",
              },
              {
                icon: (
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ),
                label: "Violation policy",
                value: "3 violations result in immediate automatic termination",
                highlight: true,
              },
            ].map((r, i) => (
              <div key={i} className={`flex items-start gap-4 px-5 py-4 ${r.highlight ? "bg-amber-50/60" : ""}`}>
                <div className="mt-0.5 flex-shrink-0">{r.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{r.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{r.value}</p>
                </div>
              </div>
            ))}
          </div>

          {cameraError && (
            <div className="mb-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{cameraError}</p>
            </div>
          )}

          <button
            onClick={handleStartExam}
            disabled={startingExam}
            className="w-full py-3.5 bg-slate-900 hover:bg-sky-500 disabled:bg-slate-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {startingExam ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Preparing exam...
              </>
            ) : (
              "Begin Assessment →"
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">
            By starting, you agree to the proctoring and monitoring requirements above.
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // TERMINATED — normal window after exit
  // ─────────────────────────────────────────────
  if (terminated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Exam Terminated</h1>
          <p className="text-slate-500 text-sm mb-1">
            You reached the maximum number of violations.
          </p>
          <p className="text-slate-400 text-xs">Redirecting to home page...</p>
          <div className="mt-5 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // SUBMITTED — normal window after exit
  // ─────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Submitted Successfully</h1>
          <p className="text-slate-500 text-sm">Your answers have been recorded. Redirecting...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // MAIN EXAM UI — fullscreen, light professional
  // ─────────────────────────────────────────────
  const currentQ = questions[currentIndex];
  const violationCount = violations.length;
  const qTotal = currentQ?.type === "MCQ" ? 120 : 300;
  const qPercent = Math.round((questionTimeLeft / qTotal) * 100);
  const totalPercent = Math.round((totalTimeLeft / (25 * 60)) * 100);
  const totalLow = totalTimeLeft < 300;
  const totalMid = totalTimeLeft < 600;
  const qLow = questionTimeLeft < 30;
  const qMid = questionTimeLeft < 60;

  return (
    <main
      className="min-h-screen bg-slate-50 text-slate-800"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      {/* ── VIOLATION ALERT BANNER ── */}
      {activeAlert && (
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
          <div
            className="w-full max-w-2xl bg-white border-2 border-red-400 rounded-2xl px-6 py-4 shadow-xl shadow-red-100/60"
            style={{ animation: "slideDown 0.25s ease" }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  violationCount === 1
                    ? "bg-amber-100"
                    : violationCount === 2
                    ? "bg-orange-100"
                    : "bg-red-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    violationCount === 1
                      ? "text-amber-500"
                      : violationCount === 2
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-slate-800 text-sm">
                    Violation Detected — Attempt {violationCount} of {MAX_VIOLATIONS}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      violationCount === 1
                        ? "bg-amber-100 text-amber-700"
                        : violationCount === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {violationCount === 1
                      ? "WARNING"
                      : violationCount === 2
                      ? "FINAL WARNING"
                      : "TERMINATED"}
                  </span>
                </div>
                <p className="text-slate-600 text-sm">{activeAlert.message}</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {violationCount < MAX_VIOLATIONS
                    ? `You have ${MAX_VIOLATIONS - violationCount} attempt${
                        MAX_VIOLATIONS - violationCount > 1 ? "s" : ""
                      } remaining before automatic termination.`
                    : "Your exam has been terminated. You will be redirected shortly."}
                </p>
              </div>
            </div>
            {/* Attempt progress bar */}
            <div className="flex gap-1.5 mt-3 ml-14">
              {Array.from({ length: MAX_VIOLATIONS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i < violationCount ? "bg-red-400" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">

          {/* Left: branding + progress */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                Technical Assessment
              </span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-200 ${
                    i < currentIndex
                      ? "w-2 h-2 bg-green-500"
                      : i === currentIndex
                      ? "w-3 h-2 bg-blue-600"
                      : "w-2 h-2 bg-slate-300"
                  }`}
                />
              ))}
              <span className="text-xs text-slate-400 font-medium ml-1">
                {currentIndex + 1}/{questions.length}
              </span>
            </div>
          </div>

          {/* Center: total time ring */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-11 h-11">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <circle
                  cx="22" cy="22" r="18" fill="none"
                  stroke={totalLow ? "#ef4444" : totalMid ? "#f97316" : "#2563eb"}
                  strokeWidth="3.5"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - totalPercent / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
                />
              </svg>
              <span
                className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold font-mono ${
                  totalLow ? "text-red-600" : totalMid ? "text-orange-600" : "text-slate-700"
                }`}
              >
                {formatTime(totalTimeLeft)}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                Total Time
              </p>
              <p className={`text-xs font-semibold mt-0.5 ${totalLow ? "text-red-600" : "text-slate-600"}`}>
                {totalLow ? "⚠ Low time" : "Remaining"}
              </p>
            </div>
          </div>

          {/* Right: violations + camera */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Violations
              </span>
              {Array.from({ length: MAX_VIOLATIONS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                    i < violationCount
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="w-px h-6 bg-slate-200" />

            {/* Camera feed */}
            <div className="relative">
              <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 shadow-sm">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                {!cameraAllowed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.894L15 14M3 8a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2V10a2 2 0 00-2-2H3z" />
                    </svg>
                  </div>
                )}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  cameraAllowed ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── QUESTION AREA ── */}
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Question meta */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase border ${
                currentQ?.type === "MCQ"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-violet-50 text-violet-700 border-violet-200"
              }`}
            >
              {currentQ?.type === "MCQ" ? "Multiple Choice" : "Scenario / Essay"}
            </span>
            <span className="text-slate-400 text-sm">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Per-question timer */}
          <div className="flex items-center gap-2">
            <div className="w-28 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  qLow ? "bg-red-500" : qMid ? "bg-orange-400" : "bg-blue-500"
                }`}
                style={{ width: `${qPercent}%` }}
              />
            </div>
            <span
              className={`text-sm font-bold font-mono tabular-nums w-10 ${
                qLow ? "text-red-600" : qMid ? "text-orange-500" : "text-slate-600"
              }`}
            >
              {formatTime(questionTimeLeft)}
            </span>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-5">
          <p className="text-slate-800 text-base leading-relaxed font-medium mb-7">
            {currentQ?.prompt}
          </p>

          {/* MCQ options */}
          {currentQ?.type === "MCQ" && (
            <div className="space-y-2.5">
              {currentQ.options.map((opt: { id: string; key: string; text: string }) => {
                const sel = answers[currentQ.id] === opt.key;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border cursor-pointer transition-all duration-150 group ${
                      sel
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-slate-50/40 hover:border-blue-300 hover:bg-blue-50/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQ.id}
                      value={opt.key}
                      checked={sel}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        sel
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-300 group-hover:border-blue-400"
                      }`}
                    >
                      {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold w-5 text-center tabular-nums ${
                          sel ? "text-blue-600" : "text-slate-400"
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className={`text-sm ${sel ? "text-blue-800 font-medium" : "text-slate-700"}`}>
                        {opt.text}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {/* Essay / Scenario */}
          {currentQ?.type === "SCENARIO" && (
            <div>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                rows={9}
                placeholder="Write your detailed response here. Cover edge cases, trade-offs, and engineering best practices..."
                value={answers[currentQ.id] ?? ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                }
                style={{ WebkitUserSelect: "text", userSelect: "text" }}
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-slate-400">
                  Explain your reasoning clearly. Quality over quantity.
                </p>
                <p className="text-xs text-slate-400 tabular-nums">
                  {(answers[currentQ.id] ?? "").length} chars
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            {violationCount > 0 && (
              <p className="text-xs text-red-500 font-medium">
                ⚠ {violationCount} violation{violationCount > 1 ? "s" : ""} recorded
              </p>
            )}
          </div>
          <button
            onClick={goNext}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-sky-500 text-white font-medium rounded-2xl transition-colors text-sm disabled:opacity-50"
          >
            {currentIndex < questions.length - 1 ? "Next Question →" : "Submit Exam ✓"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::selection { background: transparent; }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </main>
  );
}