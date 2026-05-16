import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient, { getAccessToken, clearAuth } from "../services/apiClient";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/me");
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load user details.");
      clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener("authTokenChanged", handleAuthChange);
    return () => {
      window.removeEventListener("authTokenChanged", handleAuthChange);
    };
  }, []);

  const refreshUser = async () => {
    await loadUser();
  };

  const value = useMemo(
    () => ({ user, setUser, loading, error, refreshUser }),
    [user, loading, error],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
