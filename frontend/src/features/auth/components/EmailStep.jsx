const EmailStep = ({
  email,
  onChange,
  onSendOTP,
  isSending = false,
  error = "",
}) => {
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-center">Get Started</h3>
      <p className="text-gray-600 text-sm text-center mb-6">
        Enter your email to create an account
      </p>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-black"
        }`}
        disabled={isSending}
      />

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={() => onSendOTP(email)}
        disabled={!isValidEmail || isSending}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {isSending ? "Sending OTP..." : "Send OTP"}
      </button>
    </div>
  );
};

export default EmailStep;
