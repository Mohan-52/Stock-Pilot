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
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
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
    setCanResend(false);
    onResend();
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerifySuccess(otp);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Verify Your Email
      </h3>
      <p className="text-gray-600 text-sm text-center mb-6">
        We've sent a 6-digit OTP to{" "}
        <span className="font-semibold">{email}</span>
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
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition mb-4"
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-black font-semibold hover:underline disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <>
              Resend OTP in <span className="font-semibold">{timeLeft}s</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default OTPVerificationStep;
