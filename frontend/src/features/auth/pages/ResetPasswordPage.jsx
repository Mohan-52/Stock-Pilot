import { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Toast from "../components/Toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setToast({
      type: "info",
      message: "Password reset API is not available yet.",
    });
  };

  return (
    <AuthShell
      eyebrow="New password"
      title="Set a secure Stock Pilot password."
      subtitle="A focused reset screen using the same spacing, controls, borders, and dark trading dashboard palette."
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
        Reset password
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-white">
        Choose a new password
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        Use at least 6 characters to secure your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-12 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
          placeholder="New password"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="min-h-12 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
          placeholder="Confirm password"
        />
        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Save password
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Back to{" "}
        <Link
          to="/login"
          className="font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          sign in
        </Link>
      </p>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AuthShell>
  );
};

export default ResetPasswordPage;
