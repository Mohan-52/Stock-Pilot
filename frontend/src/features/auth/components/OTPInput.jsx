import { useRef, useEffect } from "react";

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
    <div className="flex gap-2 justify-center mb-6">
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
          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      ))}
    </div>
  );
};

export default OTPInput;
