import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthShell from "../components/AuthShell";
import Toast from "../components/Toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setToast({
      type: "info",
      message: "Password reset API is not available yet.",
    });
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Recover access to Stock Pilot."
      subtitle="This screen is styled with the same dashboard system and ready to connect when a reset API exists."
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
        Forgot password
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-white">Reset access</h1>
      <p className="mt-2 text-sm text-slate-400">
        Enter your account email to start password recovery.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-200">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`min-h-12 w-full rounded-lg border bg-white/5 px-3 pl-10 text-sm text-white outline-none transition placeholder:text-slate-500 ${
                error
                  ? "border-red-400 focus:border-red-300"
                  : "border-white/10 focus:border-emerald-300"
              }`}
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        </div>

        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Continue
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Remembered it?{" "}
        <Link
          to="/login"
          className="font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          Sign in
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

export default ForgotPasswordPage;
