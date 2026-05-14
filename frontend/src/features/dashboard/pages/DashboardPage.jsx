import { useNavigate } from "react-router-dom";
import { getAccessToken, clearAuth } from "../../auth/authService";

const DashboardPage = () => {
  const navigate = useNavigate();

  // Check if user is authenticated
  if (!getAccessToken()) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Stock Pilot</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to Stock Pilot</h2>
          <p className="text-gray-600 mb-6">
            You have successfully logged in. This is your dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Portfolio</h3>
              <p className="text-gray-600">Manage your stock portfolio</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Market Data</h3>
              <p className="text-gray-600">Track market movements</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Analysis</h3>
              <p className="text-gray-600">View stock analysis</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
