"use client";

import { useEffect } from "react";

export default function ActivityTracker() {
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    const handleUnload = () => {
      localStorage.removeItem("lastActivity");
    };

    window.addEventListener("click", updateActivity);
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("scroll", updateActivity);
    window.addEventListener("beforeunload", handleUnload);

    updateActivity(); // initial

    return () => {
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("beforeunload", handleUnload); // ✅ FIX
    };
  }, []);

  return null;
}