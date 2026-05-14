import { useState } from "react";
import { Link } from "react-router-dom";

const AuthForm = ({
  type = "login",
  onSubmit,
  isLoading = false,
  error = null,
  onNavigate,
}) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const isRegister = type === "register";

  const validateForm = () => {
    const errors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Name validation for register
    if (isRegister) {
      if (!form.name.trim()) {
        errors.name = "Full name is required";
      } else if (form.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onSubmit(form);
  };

  const InputField = ({ name, type, placeholder, label }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        disabled={isLoading}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${
          validationErrors[name]
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-transparent"
        } disabled:bg-gray-100 disabled:cursor-not-allowed`}
      />
      {validationErrors[name] && (
        <p className="text-red-500 text-xs mt-1">{validationErrors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          {isRegister ? "Sign up to get started" : "Sign in to your account"}
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isRegister && (
          <InputField
            name="name"
            type="text"
            placeholder="John Doe"
            label="Full Name"
          />
        )}

        <InputField
          name="email"
          type="email"
          placeholder="your@email.com"
          label="Email Address"
        />

        <InputField
          name="password"
          type="password"
          placeholder="••••••••"
          label="Password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : isRegister ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </button>

        <div className="mt-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <p className="text-sm text-center mt-6 text-gray-600">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-black font-semibold hover:underline"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-black font-semibold hover:underline"
              >
                Create one
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
