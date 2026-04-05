//smart-screening\src\app\exam\[jobId]\page.tsx
"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import { useSession } from "next-auth/react";


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
  | "DEV_TOOLS"
  | "FACE_NOT_DETECTED"
  | "MULTIPLE_FACES";

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
  FACE_NOT_DETECTED: "No face detected in camera",
  MULTIPLE_FACES: "Multiple faces detected in camera",
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function ExamPage() {
  const { data: session, status } = useSession();

  const { data: verificationData, isLoading: verificationLoading } =
    api.verification.getMyVerification.useQuery();

  const router = useRouter();
  const params = useParams<{ jobId: string }>();
  const searchParams = useSearchParams();

  const jobId = params.jobId;
  const appId = searchParams.get("appId") ?? "";
  const verificationPath =
    jobId && appId ? `/apply?jobId=${jobId}&appId=${appId}` : "/apply";

  const terminateApplication = api.application.terminate.useMutation();

  const identityFailCountRef = useRef(0);
  const previousFacePositionRef = useRef<number | null>(null);
  const terminationTriggeredRef = useRef(false);

  const { data, isLoading } = api.exam.getQuestions.useQuery(
  { applicationId: appId },
  { enabled: appId.length > 0 }
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
  const lookingAwayCounterRef = useRef(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const alertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const referenceDescriptorRef = useRef<Float32Array | null>(null);
  const submittedRef = useRef(false);

  // ─────────────────────────────────────────────
  // FULLSCREEN HELPERS
  // ─────────────────────────────────────────────
  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({
          navigationUI: "hide",
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      /* ignore */
    }
  }, []);

  // ─────────────────────────────────────────────
  // CAMERA
  // ─────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraAllowed(true);
      return true;
    } catch {
      setCameraError(
        "Camera access is required to take this exam. Please allow camera access and try again.",
      );
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
  const terminateNow = useCallback(async () => {
    if (terminationTriggeredRef.current) return;
    terminationTriggeredRef.current = true;

    setTerminated(true);
    stopCamera();

    if (appId) {
      await terminateApplication.mutateAsync({
        applicationId: appId,
        reason: "VIOLATION",
      });
    }

    await exitFullscreen();
    router.push("/home");
  }, [appId, terminateApplication, exitFullscreen, router, stopCamera]);

  const triggerViolation = useCallback(
    (type: ViolationType) => {
      if (type === "FULLSCREEN_EXIT") {
        void terminateNow();
      }

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
                console.log("Violation saved:", data);
              },
              onError: (err) => {
                console.log("Violation error:", err);
              },
            },
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
            setTimeout(() => router.push("/home"), 600);
          }, 3500);
        } else {
          if (!document.fullscreenElement) {
            enterFullscreen();
          }
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
      terminateNow,
    ],
  );

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      console.log("Face monitoring model loaded");
    };

    loadModels();
  }, []);

  // ─────────────────────────────────────────────
  // ANTI-CHEAT — only active during exam
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted) return;
    const handler = () => {
      if (!document.fullscreenElement && !submittedRef.current) {
        triggerViolation("FULLSCREEN_EXIT");
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [examStarted, triggerViolation]);

  useEffect(() => {
    if (!examStarted) return;
    const onVisibility = () => {
      if (document.hidden && !submittedRef.current) triggerViolation("TAB_SWITCH");
    };
    const onBlur = () => { if (!submittedRef.current) triggerViolation("TAB_SWITCH"); };
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
        navigator.clipboard.writeText("").catch(() => {});
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        ["s", "p", "u", "i", "j", "c", "v", "x", "a"].includes(
          e.key.toLowerCase(),
        )
      ) {
        e.preventDefault();
        if (["c", "v", "x"].includes(e.key.toLowerCase()))
          triggerViolation("COPY_PASTE_RIGHTCLICK");
      }
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["i", "j", "c"].includes(e.key.toLowerCase()))
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
  // useEffect(() => {
  //   if (!examStarted) return;
  //   let devOpen = false;
  //   const check = () => {
  //     const w = window.outerWidth - window.innerWidth > 160;
  //     const h = window.outerHeight - window.innerHeight > 160;
  //     if ((w || h) && !devOpen) {
  //       devOpen = true;
  //       triggerViolation("DEV_TOOLS");
  //     } else if (!w && !h) {
  //       devOpen = false;
  //     }
  //   };
  //   const id = setInterval(check, 1500);
  //   return () => clearInterval(id);
  // }, [examStarted, triggerViolation]);

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
  // AI FACE MONITORING
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted) return;

    let noFaceCounter = 0;
    let multipleFaceCounter = 0;

    const detectFaces = async () => {
      if (noFaceCounter >= 2) {
        triggerViolation("FACE_NOT_DETECTED");
        noFaceCounter = 0;
      }

      if (!videoRef.current) return;

      try {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 320,
              scoreThreshold: 0.3,
            }),
          )
          .withFaceLandmarks();

        console.log("Faces detected:", detections.length);

        if (detections.length === 1) {
          const landmarks = detections[0]!.landmarks;
          const nose = landmarks.getNose();
          const jaw = landmarks.getJawOutline();

          const noseX = nose[3]!.x;
          const jawLeft = jaw[0]!.x;
          const jawRight = jaw[16]!.x;

          const faceCenter = (jawLeft + jawRight) / 2;

          const deviation = Math.abs(noseX - faceCenter);

          if (deviation > 35) {
            lookingAwayCounterRef.current += 1;

            console.log(
              "⚠ Looking away detected:",
              lookingAwayCounterRef.current,
            );

            if (lookingAwayCounterRef.current >= 3) {
              triggerViolation("FACE_NOT_DETECTED");
              lookingAwayCounterRef.current = 0;
            }
          } else {
            lookingAwayCounterRef.current = 0;
          }
        }

        // ❌ No face detected
        if (detections.length === 0) {
          noFaceCounter++;

          console.log("No face counter:", noFaceCounter);
        } else {
          // reduce slowly instead of reset
          noFaceCounter = Math.max(0, noFaceCounter - 1);
        }

        // ❌ Multiple faces detected
        if (detections.length > 1) {
          multipleFaceCounter++;

          console.log("Multiple face counter:", multipleFaceCounter);

          if (multipleFaceCounter >= 2) {
            triggerViolation("MULTIPLE_FACES");
            multipleFaceCounter = 0;
          }
        } else {
          multipleFaceCounter = Math.max(0, multipleFaceCounter - 1);
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }
    };

    const interval = setInterval(detectFaces, 2000); // check every 4 seconds

    return () => clearInterval(interval);
  }, [examStarted, triggerViolation]);

  // ─────────────────────────────────────────────
  // CONTINUOUS IDENTITY VERIFICATION
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted) return;
    if (!referenceDescriptorRef.current) return;

    const verifyIdentity = async () => {
      if (!videoRef.current) return;

      try {
        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 320,
              scoreThreshold: 0.3,
            }),
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) return;

        if (!referenceDescriptorRef.current) return;

        const distance = faceapi.euclideanDistance(
          referenceDescriptorRef.current,
          detection.descriptor,
        );

        console.log("Live identity distance:", distance);

        if (distance > 0.55) {
          identityFailCountRef.current += 1;

          console.log(
            "⚠ Identity verification failed attempt:",
            identityFailCountRef.current,
          );

          if (identityFailCountRef.current < 3) {
            alert(
              `Face verification failed. Attempt ${identityFailCountRef.current}/3. Please look at the camera properly.`,
            );
            return;
          }

          console.log(
            "❌ Identity verification failed 3 times. Terminating exam.",
          );

          if (!appId) return;

await terminateApplication.mutateAsync({
  applicationId: appId,
  reason: "FACE_MISMATCH",
});

          alert("Face verification failed 3 times. Exam terminated.");

          router.push("/home");
        }
      } catch (err) {
        console.error("Identity verification error:", err);
      }
    };

    const interval = setInterval(verifyIdentity, 20000); // every 20 seconds

    return () => clearInterval(interval);
  }, [examStarted, triggerViolation, terminateApplication, router, appId]);

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

    let lastViolation = 0;

    const detectResize = () => {
      const widthRatio = window.innerWidth / screen.width;

      if (widthRatio < 0.8) {
        const now = Date.now();

        if (now - lastViolation > 4000) {
          lastViolation = now;
          triggerViolation("TAB_SWITCH");
        }
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

  if (Object.keys(answers).length === 0) {
    alert("You must answer at least one question before submitting.");
    return;
  }

  submittedRef.current = true;
  setSubmitted(true);
  stopCamera();

  const formatted = Object.entries(answers).map(([questionId, answer]) => ({
    questionId: questionId as string,
    answer: answer as string,
  }));

  try {
    await submitExam.mutateAsync({
      applicationId: appId,
      answers: formatted,
    });
  } finally {
    await exitFullscreen(); // exit fullscreen before redirect
    setTimeout(() => router.push(`/ai/evaluate?applicationId=${appId}`), 600);
  }
}, [appId, answers, submitExam, stopCamera, exitFullscreen, router]);

  // ─────────────────────────────────────────────
  // START EXAM — fullscreen starts ONLY here
  // ─────────────────────────────────────────────

  const compareFaces = async () => {
    console.log("VIDEO:", videoRef.current);
    console.log("ID IMAGE:", verificationData?.idImageUrl);
    console.log("VERIFICATION DATA:", verificationData);

    if (!videoRef.current || !verificationData?.idImageUrl) {
      console.log("Missing video or ID image");
      return false;
    }

    try {
      console.log("Loading ID image...");
      const img = await faceapi.fetchImage(verificationData.idImageUrl);

      console.log("Detecting face in ID image...");
      const idDetection = await faceapi
        .detectSingleFace(
          img,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.3,
          }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!idDetection) {
        console.log("❌ ID face NOT detected");
        return false;
      }

      // HEAD MOVEMENT CHECK (anti-photo spoof)
      const currentX = idDetection.detection.box.x;

      if (previousFacePositionRef.current !== null) {
        const movement = Math.abs(currentX - previousFacePositionRef.current);

        if (movement < 2) {
          console.log("⚠ Face not moving — possible photo or screen");
        }
      }

      previousFacePositionRef.current = currentX;

      // LIVENESS CHECK — detect blinking
      const leftEye = idDetection?.landmarks.getLeftEye();
      const rightEye = idDetection?.landmarks.getRightEye();

      if (leftEye && rightEye) {
        const leftEyeOpen = Math.abs(leftEye[1]!.y - leftEye[5]!.y);
        const rightEyeOpen = Math.abs(rightEye[1]!.y - rightEye[5]!.y);

        if (leftEyeOpen < 2 || rightEyeOpen < 2) {
          console.log("👁 Blink detected (real person)");
        }
      }

      console.log("ID face detected");

      console.log("Detecting face in LIVE camera...");
      // wait until camera frame is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let liveDetection = null;

      for (let i = 0; i < 3; i++) {
        liveDetection = await faceapi
          .detectSingleFace(
            videoRef.current!,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 320,
              scoreThreshold: 0.2,
            }),
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (liveDetection) break;

        console.log("Retrying face detection...");
        await new Promise((r) => setTimeout(r, 800));
      }

      if (!liveDetection) {
        console.log("❌ LIVE face NOT detected");
        return false;
      }

      console.log("LIVE face detected");

      // Save descriptor for continuous monitoring
      referenceDescriptorRef.current = liveDetection.descriptor;
      console.log("Comparing faces...");

      if (!referenceDescriptorRef.current) return false;
      const distance = faceapi.euclideanDistance(
        idDetection.descriptor,
        liveDetection.descriptor,
      );

      console.log("✅ Face distance:", distance);

      return distance < 0.55; // temporarily relaxed
    } catch (err) {
      console.error("Face compare error:", err);
      return false;
    }
  };

  const handleStartExam = async () => {
    if (verificationLoading) {
      alert("Checking verification. Please wait...");
      return;
    }

    if (!verificationData || verificationData.userId !== session?.user.id) {
      alert("You must verify your identity before taking the exam.");
      router.push(verificationPath);
      return;
    }

    if (!verificationData.idImageUrl) {
      alert("Your ID image is missing. Please verify again.");
      router.push(verificationPath);
      return;
    }

    setStartingExam(true);
    setCameraError(null);

    // ✅ 1. ENTER FULLSCREEN FIRST (must be inside click)
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      alert("Fullscreen is required to start the exam.");
      setStartingExam(false);
      return;
    }

    // ✅ 2. THEN start camera
    const camOk = await startCamera();

    if (videoRef.current) {
      await videoRef.current.play();
    }

    if (!camOk) {
      await document.exitFullscreen(); // 🔥 exit fullscreen if camera fails
      setStartingExam(false);
      return;
    }

    // Wait until video fully ready
    if (videoRef.current) {
      const video = videoRef.current;

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
        };

        const checkReady = () => {
          if (video.readyState === 4) {
            resolve();
          } else {
            requestAnimationFrame(checkReady);
          }
        };

        checkReady();
      });

      // extra delay for stable frame
      await new Promise((r) => setTimeout(r, 1500));
    }

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]);

    await new Promise((r) => setTimeout(r, 1000));
    const match = await compareFaces();

    if (!match) {
      alert("Face does not match ID. Exam terminated.");
      stopCamera();
      setStartingExam(false);
      router.push("/home");
      return;
    }

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
  // AUTH GUARD
  // ─────────────────────────────────────────────

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (!session) {
    router.push("/student/login");
    return null;
  }

  if (session.user.role !== "STUDENT") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Only students can access this exam.
      </div>
    );
  }

  if (!appId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Invalid exam link.
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // VERIFICATION GUARD
  // ─────────────────────────────────────────────
  if (!verificationLoading && !verificationData) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
          <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.10),_transparent_38%)]" />

              <div className="relative">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-sky-700 uppercase">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Identity Check Pending
                </div>

                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                  Complete verification before accessing the assessment.
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                  Your exam session is locked until your identity verification is
                  completed. This protects exam integrity and ensures your
                  assessment can be submitted without interruption.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => router.push(verificationPath)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
                  >
                    Go to Verification
                    <span aria-hidden="true">→</span>
                  </button>

                  <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    Estimated time: 2-3 minutes
                  </div>
                </div>
              </div>
            </section>

            <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-sky-600">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11Zm-5 9a5 5 0 0110 0M19 10v6m3-3h-6"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                Before you continue
              </h2>

              <div className="mt-6 space-y-3">
                {[
                  "Use the same account and device you plan to use for the exam.",
                  "Keep a clear photo ID and a well-lit camera view ready.",
                  "Return here after verification to unlock the exam session.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-400" />
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm font-medium text-amber-700">
                  Access to the assessment becomes available immediately after
                  successful verification.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }
  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────
  if (isLoading || !questions) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">
            Loading assessment...
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // PRE-START SCREEN — normal window, no fullscreen
  // ─────────────────────────────────────────────
  if (!examStarted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-xl">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          {/* Header */}
          <div className="mb-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="mb-0.5 text-xs font-semibold tracking-widest text-blue-600 uppercase">
                  Technical Assessment
                </p>
                <h1 className="text-xl leading-tight font-bold text-slate-800">
                  Role Based Examination
                </h1>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              This is a proctored online assessment. Please review all
              requirements carefully before starting. Once begun, the exam
              cannot be paused.
            </p>
          </div>

          {/* Rules card */}
          <div className="mb-5 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {[
              {
                icon: (
                  <svg
                    className="h-4 w-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                label: "Total duration",
                value: "25 minutes — auto-submits when time expires",
              },
              {
                icon: (
                  <svg
                    className="h-4 w-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                    />
                  </svg>
                ),
                label: "Question timing",
                value:
                  "Multiple choice: 2 min each · Essay / Scenario: 5 min each",
              },
              {
                icon: (
                  <svg
                    className="h-4 w-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.894L15 14M3 8a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2V10a2 2 0 00-2-2H3z"
                    />
                  </svg>
                ),
                label: "Camera monitoring",
                value: "Webcam must remain on and visible throughout the exam",
              },
              {
                icon: (
                  <svg
                    className="h-4 w-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ),
                label: "Fullscreen required",
                value:
                  "Exam runs in fullscreen — exiting counts as a violation",
              },
              {
                icon: (
                  <svg
                    className="h-4 w-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                ),
                label: "Restricted actions",
                value:
                  "No copy, paste, screenshots, tab switching, or dev tools",
              },
              {
                icon: (
                  <svg
                    className="h-4 w-4 text-amber-500"
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
                ),
                label: "Violation policy",
                value: "3 violations result in immediate automatic termination",
                highlight: true,
              },
            ].map((r, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 px-5 py-4 ${r.highlight ? "bg-amber-50/60" : ""}`}
              >
                <div className="mt-0.5 flex-shrink-0">{r.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {r.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {r.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {cameraError && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-600">{cameraError}</p>
            </div>
          )}

          {verificationData && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              ✅ Identity verified. You can start the assessment.
            </div>
          )}
          <button
            onClick={handleStartExam}
            disabled={startingExam || !verificationData}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-sky-500 hover:shadow-xl disabled:bg-slate-700"
          >
            {startingExam ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Preparing exam...
              </>
            ) : (
              "Begin Assessment →"
            )}
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            By starting, you agree to the proctoring and monitoring requirements
            above.
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-100">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-800">
            Exam Terminated
          </h1>
          <p className="mb-1 text-sm text-slate-500">
            You reached the maximum number of violations.
          </p>
          <p className="text-xs text-slate-400">Redirecting to home page...</p>
          <div className="mt-5 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-red-400"
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        {/* Camera for Face Detection */}
        <div className="fixed right-4 bottom-4 h-36 w-48 overflow-hidden rounded-lg border shadow-lg"></div>

        <div className="max-w-sm text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-green-200 bg-green-100">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-800">
            Submitted Successfully
          </h1>
          <p className="text-sm text-slate-500">
            Your answers have been recorded. Redirecting...
          </p>
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
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
          <div
            className="w-full max-w-2xl rounded-2xl border-2 border-red-400 bg-white px-6 py-4 shadow-xl shadow-red-100/60"
            style={{ animation: "slideDown 0.25s ease" }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                  violationCount === 1
                    ? "bg-amber-100"
                    : violationCount === 2
                      ? "bg-orange-100"
                      : "bg-red-100"
                }`}
              >
                <svg
                  className={`h-5 w-5 ${
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
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">
                    Violation Detected — Attempt {violationCount} of{" "}
                    {MAX_VIOLATIONS}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
                <p className="text-sm text-slate-600">{activeAlert.message}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {violationCount < MAX_VIOLATIONS
                    ? `You have ${MAX_VIOLATIONS - violationCount} attempt${
                        MAX_VIOLATIONS - violationCount > 1 ? "s" : ""
                      } remaining before automatic termination.`
                    : "Your exam has been terminated. You will be redirected shortly."}
                </p>
              </div>
            </div>
            {/* Attempt progress bar */}
            <div className="mt-3 ml-14 flex gap-1.5">
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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          {/* Left: branding + progress */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                <svg
                  className="h-3.5 w-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold whitespace-nowrap text-slate-700">
                Technical Assessment
              </span>
            </div>
            <div className="hidden h-4 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-200 ${
                    i < currentIndex
                      ? "h-2 w-2 bg-green-500"
                      : i === currentIndex
                        ? "h-2 w-3 bg-blue-600"
                        : "h-2 w-2 bg-slate-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-xs font-medium text-slate-400">
                {currentIndex + 1}/{questions.length}
              </span>
            </div>
          </div>

          {/* Center: total time ring */}
          <div className="flex items-center gap-2.5">
            <div className="relative h-11 w-11">
              <svg className="h-11 w-11 -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3.5"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke={
                    totalLow ? "#ef4444" : totalMid ? "#f97316" : "#2563eb"
                  }
                  strokeWidth="3.5"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - totalPercent / 100)}`}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-dashoffset 1s linear, stroke 0.5s",
                  }}
                />
              </svg>
              <span
                className={`absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold ${
                  totalLow
                    ? "text-red-600"
                    : totalMid
                      ? "text-orange-600"
                      : "text-slate-700"
                }`}
              >
                {formatTime(totalTimeLeft)}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] leading-none font-semibold tracking-wider text-slate-400 uppercase">
                Total Time
              </p>
              <p
                className={`mt-0.5 text-xs font-semibold ${totalLow ? "text-red-600" : "text-slate-600"}`}
              >
                {totalLow ? "⚠ Low time" : "Remaining"}
              </p>
            </div>
          </div>

          {/* Right: violations + camera */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="hidden text-[10px] font-semibold tracking-wider text-slate-400 uppercase sm:block">
                Violations
              </span>
              {Array.from({ length: MAX_VIOLATIONS }).map((_, i) => (
                <div
                  key={i}
                  className={`flex h-5 w-5 items-center justify-center rounded-md border-2 text-[10px] font-bold transition-all ${
                    i < violationCount
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* Camera feed */}
            <div className="relative">
              <div className="h-12 w-16 overflow-hidden rounded-lg border border-slate-300 bg-slate-100 shadow-sm">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full scale-x-[-1] object-cover"
                />
                {!cameraAllowed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.894L15 14M3 8a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2V10a2 2 0 00-2-2H3z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div
                className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-white ${
                  cameraAllowed ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── QUESTION AREA ── */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Question meta */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`rounded-lg border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
                currentQ?.type === "MCQ"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-violet-200 bg-violet-50 text-violet-700"
              }`}
            >
              {currentQ?.type === "MCQ"
                ? "Multiple Choice"
                : "Scenario / Essay"}
            </span>
            <span className="text-sm text-slate-400">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Per-question timer */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  qLow ? "bg-red-500" : qMid ? "bg-orange-400" : "bg-blue-500"
                }`}
                style={{ width: `${qPercent}%` }}
              />
            </div>
            <span
              className={`w-10 font-mono text-sm font-bold tabular-nums ${
                qLow
                  ? "text-red-600"
                  : qMid
                    ? "text-orange-500"
                    : "text-slate-600"
              }`}
            >
              {formatTime(questionTimeLeft)}
            </span>
          </div>
        </div>

        {/* Question card */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-7 text-base leading-relaxed font-medium text-slate-800">
            {currentQ?.prompt}
          </p>

          {/* MCQ options */}
          {currentQ?.type === "MCQ" && (
            <div className="space-y-2.5">
              {currentQ.options.map(
                (opt: { id: string; key: string; text: string }) => {
                  const sel = answers[currentQ.id] === opt.key;
                  return (
                    <label
                      key={opt.id}
                      className={`group flex cursor-pointer items-center gap-4 rounded-xl border px-5 py-3.5 transition-all duration-150 ${
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
                          setAnswers((prev) => ({
                            ...prev,
                            [currentQ.id]: e.target.value,
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          sel
                            ? "border-blue-600 bg-blue-600"
                            : "border-slate-300 group-hover:border-blue-400"
                        }`}
                      >
                        {sel && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-5 text-center text-xs font-bold tabular-nums ${
                            sel ? "text-blue-600" : "text-slate-400"
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span
                          className={`text-sm ${sel ? "font-medium text-blue-800" : "text-slate-700"}`}
                        >
                          {opt.text}
                        </span>
                      </div>
                    </label>
                  );
                },
              )}
            </div>
          )}

          {/* Essay / Scenario */}
          {currentQ?.type === "SCENARIO" && (
            <div>
              <textarea
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 placeholder-slate-400 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={9}
                placeholder="Write your detailed response here. Cover edge cases, trade-offs, and engineering best practices..."
                value={answers[currentQ.id] ?? ""}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQ.id]: e.target.value,
                  }))
                }
                style={{ WebkitUserSelect: "text", userSelect: "text" }}
              />
              <div className="mt-2 flex justify-between">
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
              <p className="text-xs font-medium text-red-500">
                ⚠ {violationCount} violation{violationCount > 1 ? "s" : ""}{" "}
                recorded
              </p>
            )}
          </div>
          <button
            onClick={goNext}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-sky-500 disabled:opacity-50"
          >
            {currentIndex < questions.length - 1
              ? "Next Question →"
              : "Submit Exam ✓"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        ::selection {
          background: transparent;
        }
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </main>
  );
}
