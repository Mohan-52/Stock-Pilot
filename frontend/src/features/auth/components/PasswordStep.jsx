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
      <h3 className="text-lg font-semibold mb-4 text-center">
        Create Your Account
      </h3>
      <p className="text-gray-600 text-sm text-center mb-6">
        Set a strong password to secure your account
      </p>

      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={isRegistering}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
            errors.password
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-black"
          } disabled:bg-gray-100`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={isRegistering}
          className="absolute right-3 top-3 text-gray-500 disabled:opacity-50"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm mb-4">{errors.password}</p>
      )}

      <div className="relative mb-6">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          disabled={isRegistering}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
            errors.confirmPassword
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-black"
          } disabled:bg-gray-100`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          disabled={isRegistering}
          className="absolute right-3 top-3 text-gray-500 disabled:opacity-50"
        >
          {showConfirmPassword ? "Hide" : "Show"}
        </button>
      </div>
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm mb-4">{errors.confirmPassword}</p>
      )}

      {!passwordsMatch && password.length > 0 && (
        <p className="text-red-500 text-sm mb-4">Passwords do not match</p>
      )}

      <button
        onClick={onRegister}
        disabled={!isFormValid || isRegistering}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {isRegistering ? "Creating Account..." : "Create Account"}
      </button>
    </div>
  );
};

export default PasswordStep;
