"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function InactivityCheck() {
  useEffect(() => {
    const last = localStorage.getItem("lastActivity");

    // 🔥 Case 1: Browser closed → no activity stored
    if (!last) {
      console.log("No activity found → logging out");
      signOut({ callbackUrl: "/student/login" });
      return;
    }

    const diff = Date.now() - Number(last);

    // 🔥 Case 2: Inactive for 1 minute (for testing)
    if (diff > 60 * 1000) {
      console.log("User inactive → logging out");
      signOut({ callbackUrl: "/student/login" });
    }
  }, []);

  return null;
}