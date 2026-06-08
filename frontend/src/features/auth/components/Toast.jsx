import { useEffect, useState } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const toneClass = {
    success: "bg-emerald-400 text-slate-950",
    error: "bg-red-500 text-white",
    info: "bg-sky-500 text-white",
  }[type];

  return (
    <div
      className={`fixed right-4 top-4 z-50 rounded-lg px-5 py-3 text-sm font-semibold shadow-2xl ${toneClass}`}
      style={{
        animation: "slideIn 0.3s ease-in-out",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {message}
    </div>
  );
};

export default Toast;
