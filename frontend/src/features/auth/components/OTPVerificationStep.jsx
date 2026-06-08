import { useState, useEffect } from "react";
import OTPInput from "./OTPInput";

const OTPVerificationStep = ({
  email,
  onVerifySuccess,
  onResend,
  isVerifying = false,
  isResending = false,
}) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const canResend = timeLeft <= 0;

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleResend = () => {
    setOtp("");
    setTimeLeft(60);
    onResend();
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerifySuccess(otp);
    }
  };

  return (
    <div className="w-full">
      <h3 className="mb-3 text-center text-lg font-semibold text-white">
        Verify Your Email
      </h3>
      <p className="mb-6 text-center text-sm text-slate-400">
        We've sent a 6-digit OTP to{" "}
        <span className="font-semibold text-slate-200">{email}</span>
      </p>

      <OTPInput
        value={otp}
        onChange={setOtp}
        length={6}
        disabled={isVerifying}
      />

      <button
        onClick={handleVerify}
        disabled={otp.length !== 6 || isVerifying}
        className="mb-4 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="text-center">
        <p className="mb-2 text-sm text-slate-400">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-emerald-300 transition hover:text-emerald-200 disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <>
              Resend OTP in{" "}
              <span className="font-semibold text-slate-200">{timeLeft}s</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default OTPVerificationStep;
