import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import apiClient, { setAccessToken } from "../../../services/apiClient";
import AuthShell from "../components/AuthShell";

const inputClass = (hasError) =>
  `block min-h-12 w-full rounded-lg border bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60 ${
    hasError
      ? "border-red-400 focus:border-red-300"
      : "border-white/10 focus:border-emerald-300"
  }`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const validateForm = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiClient.post("/auth/login", formData);

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        setToast({ message: "Login successful. Redirecting...", type: "success" });

        setTimeout(() => {
          navigate(
            response.data.profileCompleted === false
              ? "/complete-profile"
              : "/dashboard",
          );
        }, 800);
      } else {
        setErrors({ general: "Invalid login response. Please try again." });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({ general: "Invalid email or password. Please try again." });
      } else if (error.response?.status === 429) {
        setErrors({ general: "Too many login attempts. Please try again later." });
      } else {
        setErrors({
          general:
            error.response?.data?.message ||
            (error.message === "Network Error"
              ? "Network error. Please check your connection."
              : "Login failed. Please try again."),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Secure access"
      title="Sign in to your trading dashboard."
      subtitle="Manage your simulated portfolio, watch live prices, and practice trades in a focused dark workspace."
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Welcome back
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Use your Stock Pilot account to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        {errors.general && (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {errors.general}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-200">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`${inputClass(errors.email)} pl-10`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-200">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`${inputClass(errors.password)} pl-10 pr-12`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white disabled:cursor-not-allowed"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-300">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to Stock Pilot?{" "}
        <Link
          to="/register"
          className="font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          Create an account
        </Link>
      </p>

      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-lg px-5 py-3 text-sm font-semibold shadow-2xl ${
            toast.type === "success"
              ? "bg-emerald-400 text-slate-950"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </AuthShell>
  );
};

export default LoginPage;
