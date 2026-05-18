import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProfileCompletionPage from "../features/auth/pages/ProfileCompletionPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import WalletPage from "../features/wallet/pages/WalletPage";
import PortfolioPositionsPage from "../features/trading/pages/PortfolioPositionsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/complete-profile" element={<ProfileCompletionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/portfolio" element={<PortfolioPositionsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
