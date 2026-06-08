import { useRef } from "react";

const OTPInput = ({ value, onChange, length = 6, disabled = false }) => {
  const inputRefs = useRef([]);

  const handleChange = (index, val) => {
    // Only allow numeric input
    if (!/^\d*$/.test(val)) return;

    const newOtp = value.split("");
    newOtp[index] = val;
    const otpString = newOtp.join("");

    onChange(otpString.slice(0, length));

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="mb-6 flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          inputMode="numeric"
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="h-12 w-10 rounded-lg border border-white/10 bg-white/5 text-center text-xl font-bold text-white outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-12"
        />
      ))}
    </div>
  );
};

export default OTPInput;
