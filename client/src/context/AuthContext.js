import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { data } = await authAPI.getProfile();
        if (data.success) {
          setUser(data.data);
        } else {
          localStorage.removeItem("token");
        }
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await authAPI.login({ email, password });
      
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.data);
        return data;
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await authAPI.register(userData);
      
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.data);
        return data;
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      setError(null);
      const { data } = await authAPI.updateProfile(updatedData);
      
      if (data.success) {
        setUser(data.data);
        return data;
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Update failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setError(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    checkUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;