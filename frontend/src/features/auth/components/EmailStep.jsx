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
      <h3 className="mb-3 text-center text-lg font-semibold text-white">
        Get started
      </h3>
      <p className="mb-6 text-center text-sm text-slate-400">
        Enter your email to create an account
      </p>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        className={`mb-4 min-h-12 w-full rounded-lg border bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? "border-red-400 focus:border-red-300"
            : "border-white/10 focus:border-emerald-300"
        }`}
        disabled={isSending}
      />

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      <button
        onClick={() => onSendOTP(email)}
        disabled={!isValidEmail || isSending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSending ? "Sending OTP..." : "Send OTP"}
      </button>
    </div>
  );
};

export default EmailStep;
