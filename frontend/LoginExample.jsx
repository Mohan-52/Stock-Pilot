// Example usage of the Login component
// This shows how to integrate the login page into your React Router setup

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import { getAccessToken } from "./services/apiClient";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
