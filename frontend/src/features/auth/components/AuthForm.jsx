import { useState } from "react";
import { Link } from "react-router-dom";

const InputField = ({
  name,
  type,
  placeholder,
  label,
  value,
  onChange,
  disabled,
  error,
}) => (
  <div className="mb-4">
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-lg border px-4 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-black ${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:border-transparent"
      } disabled:cursor-not-allowed disabled:bg-gray-100`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const AuthForm = ({ type = "login", onSubmit, isLoading = false, error = null }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const isRegister = type === "register";

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (isRegister) {
      if (!form.name.trim()) {
        errors.name = "Full name is required";
      } else if (form.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
      }
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((previous) => ({ ...previous, [name]: "" }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onSubmit(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
      >
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          {isRegister ? "Sign up to get started" : "Sign in to your account"}
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400 bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isRegister && (
          <InputField
            name="name"
            type="text"
            placeholder="John Doe"
            label="Full Name"
            value={form.name}
            onChange={handleChange}
            disabled={isLoading}
            error={validationErrors.name}
          />
        )}

        <InputField
          name="email"
          type="email"
          placeholder="your@email.com"
          label="Email Address"
          value={form.email}
          onChange={handleChange}
          disabled={isLoading}
          error={validationErrors.email}
        />

        <InputField
          name="password"
          type="password"
          placeholder="Password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          disabled={isLoading}
          error={validationErrors.password}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-lg bg-black py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
        </button>

        <div className="mt-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-black hover:underline">
                Sign In
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-black hover:underline"
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
