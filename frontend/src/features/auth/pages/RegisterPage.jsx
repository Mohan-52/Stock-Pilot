import { useState } from "react";
import { registerUser, sendOTP, verifyOTP } from "../authAPI";
import EmailStep from "../components/EmailStep";
import OTPVerificationStep from "../components/OTPVerificationStep";
import PasswordStep from "../components/PasswordStep";
import Toast from "../components/Toast";

const RegisterPage = () => {
  // Step states
  const [currentStep, setCurrentStep] = useState("email"); // email, otp, password
  const [email, setEmail] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading and error states
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

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
      await registerUser({
        email: verifiedEmail,
        password,
      });

      showToast("Account created successfully", "success");

      // Reset form
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-8 text-center">Create Account</h2>

        {/* Progress indicator */}
        <div className="flex justify-between mb-8">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === "email"
                ? "bg-black text-white"
                : currentStep === "otp" || currentStep === "password"
                  ? "bg-black text-white"
                  : "bg-gray-300"
            }`}
          >
            1
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-300 mt-4"></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === "otp" || currentStep === "password"
                ? "bg-black text-white"
                : "bg-gray-300"
            }`}
          >
            2
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-300 mt-4"></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === "password" ? "bg-black text-white" : "bg-gray-300"
            }`}
          >
            3
          </div>
        </div>

        {/* Step content */}
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

        {/* Back button for otp and password steps */}
        {currentStep !== "email" && (
          <button
            onClick={handleBack}
            disabled={
              isSendingOTP || isVerifyingOTP || isResendingOTP || isRegistering
            }
            className="w-full mt-4 text-center text-sm text-gray-600 hover:text-black disabled:opacity-50"
          >
            ← Back
          </button>
        )}

        {/* Toast notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
