import { useState } from "react";

const PasswordStep = ({
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  onRegister,
  isRegistering = false,
  errors = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordValid = password && password.length >= 6;
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isFormValid = isPasswordValid && passwordsMatch;

  return (
    <div className="w-full">
      <h3 className="mb-3 text-center text-lg font-semibold text-white">
        Create Your Account
      </h3>
      <p className="mb-6 text-center text-sm text-slate-400">
        Set a strong password to secure your account
      </p>

      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={isRegistering}
          className={`min-h-12 w-full rounded-lg border bg-white/5 px-3 pr-14 text-sm text-white outline-none transition placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.password
              ? "border-red-400 focus:border-red-300"
              : "border-white/10 focus:border-emerald-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={isRegistering}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 transition hover:text-white disabled:opacity-50"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {errors.password && (
        <p className="mb-4 text-sm text-red-300">{errors.password}</p>
      )}

      <div className="relative mb-6">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          disabled={isRegistering}
          className={`min-h-12 w-full rounded-lg border bg-white/5 px-3 pr-14 text-sm text-white outline-none transition placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.confirmPassword
              ? "border-red-400 focus:border-red-300"
              : "border-white/10 focus:border-emerald-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          disabled={isRegistering}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 transition hover:text-white disabled:opacity-50"
        >
          {showConfirmPassword ? "Hide" : "Show"}
        </button>
      </div>
      {errors.confirmPassword && (
        <p className="mb-4 text-sm text-red-300">{errors.confirmPassword}</p>
      )}

      {!passwordsMatch && password.length > 0 && (
        <p className="mb-4 text-sm text-red-300">Passwords do not match</p>
      )}

      <button
        onClick={onRegister}
        disabled={!isFormValid || isRegistering}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRegistering ? "Creating Account..." : "Create Account"}
      </button>
    </div>
  );
};

export default PasswordStep;
