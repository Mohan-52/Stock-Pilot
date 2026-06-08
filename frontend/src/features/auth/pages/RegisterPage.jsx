import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser, sendOTP, verifyOTP } from "../authAPI";
import AuthShell from "../components/AuthShell";
import EmailStep from "../components/EmailStep";
import OTPVerificationStep from "../components/OTPVerificationStep";
import PasswordStep from "../components/PasswordStep";
import Toast from "../components/Toast";

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState("email");
  const [email, setEmail] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [toast, setToast] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateEmail = (emailValue) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  const handleSendOTP = async (emailValue) => {
    setEmailError("");

    if (!validateEmail(emailValue)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSendingOTP(true);
    try {
      await sendOTP(emailValue);
      setEmail(emailValue);
      setCurrentStep("otp");
      showToast("OTP sent successfully to your email", "success");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to send OTP. Please try again.";
      setEmailError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (otpValue) => {
    setIsVerifyingOTP(true);
    try {
      await verifyOTP(email, otpValue);
      setVerifiedEmail(email);
      setCurrentStep("password");
      showToast("Email verified successfully", "success");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Invalid OTP. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResendingOTP(true);
    try {
      await sendOTP(email);
      showToast("OTP resent successfully", "success");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to resend OTP. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsResendingOTP(false);
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsRegistering(true);
    try {
      await registerUser({ email: verifiedEmail, password });
      showToast("Account created successfully", "success");
      setCurrentStep("email");
      setEmail("");
      setVerifiedEmail("");
      setPassword("");
      setConfirmPassword("");
      setFormErrors({});
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "otp") {
      setCurrentStep("email");
      setEmail("");
    } else if (currentStep === "password") {
      setCurrentStep("otp");
    }
  };

  const stepIndex = currentStep === "email" ? 1 : currentStep === "otp" ? 2 : 3;

  return (
    <AuthShell
      eyebrow="New account"
      title="Create a Stock Pilot account."
      subtitle="Verify your email, secure your profile, and start practicing trades in a professional simulator."
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Create account
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">
          Join Stock Pilot
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Complete the steps below to set up your account.
        </p>
      </div>

      <div className="my-8 flex items-center justify-between">
        {[1, 2, 3].map((step) => (
          <div key={step} className="contents">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                stepIndex >= step
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-white/10 text-slate-400"
              }`}
            >
              {step}
            </div>
            {step < 3 && <div className="mx-2 h-px flex-1 bg-white/10" />}
          </div>
        ))}
      </div>

      {currentStep === "email" && (
        <EmailStep
          email={email}
          onChange={setEmail}
          onSendOTP={handleSendOTP}
          isSending={isSendingOTP}
          error={emailError}
        />
      )}

      {currentStep === "otp" && (
        <OTPVerificationStep
          email={email}
          onVerifySuccess={handleVerifyOTP}
          onResend={handleResendOTP}
          isVerifying={isVerifyingOTP}
          isResending={isResendingOTP}
        />
      )}

      {currentStep === "password" && (
        <PasswordStep
          password={password}
          onPasswordChange={setPassword}
          confirmPassword={confirmPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onRegister={handleRegister}
          isRegistering={isRegistering}
          errors={formErrors}
        />
      )}

      {currentStep !== "email" && (
        <button
          onClick={handleBack}
          disabled={
            isSendingOTP || isVerifyingOTP || isResendingOTP || isRegistering
          }
          className="mt-4 w-full text-center text-sm font-semibold text-slate-400 transition hover:text-white disabled:opacity-50"
        >
          Back
        </button>
      )}

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
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

export default RegisterPage;
