import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, clearAuth } from "../../auth/authService";
import { useUser } from "../../../contexts/UserContext";
import apiClient from "../../../services/apiClient";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const accessToken = getAccessToken();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    const fetchStocks = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await apiClient.get("/stocks");
        setStocks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load stock data. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, [accessToken]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    navigate("/login");
  };

  if (!accessToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Stock Pilot</h1>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm hover:shadow-md transition"
            >
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.fullName || "User avatar"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                  {user?.fullName
                    ? user.fullName
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "U"}
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                {user?.fullName || "User"}
              </span>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 z-20 mt-3 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.fullName || "User avatar"}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                      {user?.fullName
                        ? user.fullName
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-900 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
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

        <section className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Market Watchlist</h2>
              <p className="text-gray-600">
                Latest stock data from the server.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-gray-600">Loading stocks...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : stocks.length === 0 ? (
            <div className="text-gray-600">No stock data available.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {stock.logoUrl ? (
                      <img
                        src={stock.logoUrl}
                        alt={`${stock.symbol} logo`}
                        className="h-14 w-14 rounded-xl object-contain bg-white"
                        onError={(e) => {
                          e.currentTarget.src = "";
                          e.currentTarget.alt = "Logo unavailable";
                        }}
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-200 text-lg font-semibold text-gray-700">
                        {stock.symbol?.slice(0, 2) || "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">
                        {stock.exchange || "Exchange unavailable"}
                      </p>
                      <h3 className="text-xl font-semibold">
                        {stock.name || stock.symbol}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Industry:</span>{" "}
                    {stock.industry || "N/A"}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Price:</span>{" "}
                    {stock.currency || "USD"} {stock.price ?? "N/A"}
                  </p>
                  {stock.websiteUrl ? (
                    <a
                      href={stock.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit company site
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Website not available
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
