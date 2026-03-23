"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function CursorGlow() {
  const pathname = usePathname();
  const allowedPaths = [
    "/",
    "/home",
    "/about",
    "/how-it-works",
    "/contact",
    "/help-center",
    "/privacy-policy",
    "/terms-and-conditions",
  ];
  const isEnabled = (pathname ?? "") === "/"
    ? allowedPaths.includes("/")
    : allowedPaths.some((path) => (pathname ?? "") === path || (pathname ?? "").startsWith(`${path}/`));

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let rafId = 0;
    let latestX = 0;
    let latestY = 0;

    const update = () => {
      document.documentElement.style.setProperty("--cursor-x", `${latestX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${latestY}px`);
      rafId = 0;
    };

    const onMove = (event: MouseEvent) => {
      latestX = event.clientX;
      latestY = event.clientY;
      if (!rafId) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <style>{`
        :root {
          --cursor-x: 50vw;
          --cursor-y: 35vh;
        }

        .cursor-glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background: radial-gradient(
            360px circle at var(--cursor-x) var(--cursor-y),
            rgba(14,165,233,0.14),
            transparent 55%
          );
          transition: background 0.1s linear;
          mix-blend-mode: multiply;
        }

        @media (pointer: coarse) {
          .cursor-glow { display: none; }
        }
      `}</style>
      <div className="cursor-glow" aria-hidden="true" />
    </>
  );
}
