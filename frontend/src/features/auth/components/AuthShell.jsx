const AuthShell = ({ children, eyebrow, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
          <section className="hidden lg:block">
            <div className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-400 text-sm font-black text-slate-950">
                SP
              </span>
              <div>
                <p className="text-lg font-semibold text-white">Stock Pilot</p>
                <p className="text-xs text-slate-400">Trading simulator</p>
              </div>
            </div>
            <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-white">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
              {subtitle}
            </p>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {["Live prices", "Portfolio", "Wallet"].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="text-sm font-semibold text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full rounded-lg border border-white/10 bg-[#0b1728] p-5 shadow-2xl shadow-black/30 sm:p-8">
            <div className="mb-7 lg:hidden">
              <div className="inline-flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-sm font-black text-slate-950">
                  SP
                </span>
                <div>
                  <p className="text-lg font-semibold text-white">Stock Pilot</p>
                  <p className="text-xs text-slate-400">Trading simulator</p>
                </div>
              </div>
            </div>
            {children}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
