import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Check authentication status on mount and token change
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Set the token in headers before making the request
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      const { data } = await authAPI.checkAuth();
      setUser(data.data);
      setError(null);
    } catch (err) {
      console.error("Auth check failed:", err);
      // More detailed error handling
      if (err.message === "Network Error") {
        setError("Unable to connect to the server. Please check your connection.");
      } else {
        setError(err.response?.data?.message || "Authentication failed");
      }
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login({ email, password }); // response is the full Axios response

      // Check if the actual payload (token, user) exists within response.data.data
      if (response && response.data && response.data.data && response.data.data.token && response.data.data.user) {
        const { token, user: userData } = response.data.data; // Destructure from response.data.data

        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userData);
        setLoading(false);
        return true;
      } else {
        // Log the actual structure if it's still not as expected
        console.error(
          "Login failed: Server responded with 200 OK, but token/user not found in response.data.data.",
          response ? response.data : "No response object"
        );
        setError("Login failed: Unexpected response structure from server.");
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error("Login error details:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.isRateLimit ? err.message : "Invalid email or password. Please check console for details.");
      setError(message);
      setLoading(false);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authAPI.register(userData);
      const { token, user: newUser } = data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(newUser);
      setError(null);

      return newUser;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.errors?.map((e) => e.msg).join(", ") ||
        "Registration failed";
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setError(null);
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
