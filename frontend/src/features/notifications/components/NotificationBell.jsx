import { useEffect, useRef, useState } from "react";
import { Bell, Check, CheckCheck, CircleAlert } from "lucide-react";
import { useNotificationContext } from "../context/NotificationContext";

const formatNotificationTime = (createdAt) => {
  if (!createdAt) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdAt));
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
  } = useNotificationContext();

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const badge = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="relative grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white ring-2 ring-[#091525]">
            {badge}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-white/10 bg-[#0d1b2d] shadow-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div>
              <h2 className="font-semibold text-white">Notifications</h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                <span
                  className={`h-2 w-2 rounded-full ${
                    connectionStatus === "connected"
                      ? "bg-emerald-300"
                      : connectionStatus === "connecting"
                        ? "bg-amber-300"
                        : "bg-slate-500"
                  }`}
                />
                Live updates {connectionStatus}
              </p>
            </div>
            <button
              type="button"
              onClick={() => markAllAsRead()}
              disabled={unreadCount === 0 || isMarkingAllAsRead}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 transition hover:text-emerald-200 disabled:cursor-not-allowed disabled:text-slate-600"
            >
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              Mark all read
            </button>
          </div>

          <div className="max-h-[28rem] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3 p-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-lg bg-white/[0.05]"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <CircleAlert className="mx-auto h-6 w-6 text-red-300" />
                <p className="mt-2 text-sm text-red-100">
                  Unable to load notifications.
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto h-7 w-7 text-slate-500" />
                <p className="mt-3 text-sm font-semibold text-slate-200">
                  You are all caught up
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  New activity will appear here instantly.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                  }}
                  className={`flex w-full gap-3 border-b border-white/[0.07] p-4 text-left transition last:border-b-0 hover:bg-white/[0.05] ${
                    notification.isRead ? "bg-transparent" : "bg-emerald-400/[0.06]"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                      notification.isRead
                        ? "bg-white/[0.06] text-slate-500"
                        : "bg-emerald-400/15 text-emerald-300"
                    }`}
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-white">
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
                      )}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-slate-400">
                      {notification.message}
                    </span>
                    <span className="mt-2 block text-xs text-slate-500">
                      {formatNotificationTime(notification.createdAt)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
