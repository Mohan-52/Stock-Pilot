import { Link, useLocation } from "react-router-dom";
import {
  Briefcase,
  CalendarClock,
  LayoutDashboard,
  Star,
  Wallet,
} from "lucide-react";
import NotificationBell from "../../notifications/components/NotificationBell";

const navItems = [
  { to: "/dashboard", label: "Market", icon: LayoutDashboard },
  { to: "/watchlist", label: "Watchlist", icon: Star },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/dashboard/sips", label: "SIPs", icon: CalendarClock },
  { to: "/wallet", label: "Wallet", icon: Wallet },
];

const TradingLayout = ({ children, actions, eyebrow, title, subtitle }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#08111f]/95 px-3 py-2 backdrop-blur lg:inset-y-0 lg:left-0 lg:right-auto lg:w-64 lg:border-r lg:border-t-0 lg:px-4 lg:py-6">
        <Link to="/dashboard" className="hidden items-center gap-3 px-2 lg:flex">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-sm font-black text-slate-950">
            SP
          </span>
          <span>
            <span className="block text-lg font-semibold">Stock Pilot</span>
            <span className="block text-xs text-slate-400">
              Trading simulator
            </span>
          </span>
        </Link>

        <nav className="grid grid-cols-5 gap-1 sm:gap-2 lg:mt-8 lg:grid-cols-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition lg:justify-start ${
                  active
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs sm:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-h-screen pb-24 lg:pb-0 lg:pl-64">
        <header className="border-b border-white/10 bg-[#091525]/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  {eyebrow}
                </p>
              )}
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <NotificationBell />
              {actions}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default TradingLayout;
