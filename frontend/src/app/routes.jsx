import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProfileCompletionPage from "../features/auth/pages/ProfileCompletionPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import WalletPage from "../features/wallet/pages/WalletPage";
import PortfolioPositionsPage from "../features/trading/pages/PortfolioPositionsPage";
import StockDetailPage from "../features/trading/pages/StockDetailPage";
import WatchlistPage from "../features/trading/pages/WatchlistPage";
import SipsPage from "../features/sips/pages/SipsPage";
import ReportsPage from "../features/reports/pages/ReportsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/complete-profile" element={<ProfileCompletionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/sips" element={<SipsPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/portfolio" element={<PortfolioPositionsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/stocks/:symbol" element={<StockDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
