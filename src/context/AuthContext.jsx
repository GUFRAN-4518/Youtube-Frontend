import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";

export const AuthContext = createContext();

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // 🌟 FIX: Show the full-page loader instead of a blank screen!
  if (loading) return <FullPageLoader text="Authenticating..." />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/users/current-user");
        setUser(res.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const res = await api.post("/users/login", {
        email,
        password,
      });

      setUser(res.data.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout Function
  const logout = async () => {
    try {
      await api.post("/users/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};