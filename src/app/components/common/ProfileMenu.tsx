"use client";

import Link from "next/link";
import { Bell, CheckCircle2, ClipboardCheck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";

type ProfileMenuProps = {
  isLoggedIn: boolean;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function ProfileMenu({ isLoggedIn, name, email, image }: ProfileMenuProps) {
  type NotificationItem = RouterOutputs["application"]["notifications"][number];
  const displayName = name ?? email ?? "User";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initials = useMemo(() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
    return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`.toUpperCase();
  }, [displayName]);

  const { data: notifications = [] } = api.application.notifications.useQuery(
    undefined,
    { enabled: isLoggedIn },
  );

  const displayNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [notifications]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const formatTime = (value: Date) => {
    const date = new Date(value);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="relative flex items-center gap-4 text-slate-800" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Notifications"
        aria-expanded={menuOpen}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" aria-hidden />
        {displayNotifications.length > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">
              Notifications
            </span>
            <span className="text-xs text-slate-500">
              {displayNotifications.length} new
            </span>
          </div>

          {displayNotifications.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500">
              No notifications yet.
            </div>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {displayNotifications.map((item: NotificationItem) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div className="mt-0.5">
                    <CheckCircle2
                      className={
                        item.status === "EXAM_TERMINATED"
                          ? "h-4 w-4 text-red-600"
                          : "h-4 w-4 text-emerald-600"
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={
                        item.status === "EXAM_TERMINATED"
                          ? "text-xs font-semibold text-red-600"
                          : "text-xs font-semibold text-slate-800"
                      }
                    >
                      {item.status === "EXAM_TERMINATED"
                        ? "Exam terminated"
                        : "Application submitted"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.jobTitle}
                    </div>
                    <div
                      className={
                        item.status === "EXAM_TERMINATED"
                          ? "mt-1 text-xs text-slate-700"
                          : "mt-1 text-xs text-slate-600"
                      }
                    >
                      {item.status === "EXAM_TERMINATED" ? (
                        "Exam terminated due to violations. Please contact support if needed."
                      ) : item.status === "EXAM_SUBMITTED" ? (
                        <>
                          <span className="text-emerald-600">Exam completed</span>
                          <span className="text-emerald-600"> successfully</span>. We will
                          inform you later about the interview process if selected.
                        </>
                      ) : (
                        "Applied successfully. You can now face exam."
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {formatTime(item.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Link
        href="/student/profile"
        className="flex items-center gap-2 text-slate-800 hover:text-slate-900"
      >
        <span className="max-w-40 truncate text-sm font-semibold text-slate-800">
          {displayName}
        </span>
        {image ? (
          <img
            src={image}
            alt={displayName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {initials}
          </span>
        )}
      </Link>
    </div>
  );
}
