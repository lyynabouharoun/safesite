import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Helper to dispatch auth change event
  const dispatchAuthChange = () => {
    window.dispatchEvent(new Event('auth-change'));
    // Also trigger storage event for cross-tab sync
    window.dispatchEvent(new Event('storage'));
  };

  const handleAuthSuccess = (user, tokens) => {
    const safeUser = {
      email: user.email,
      name: user.name || user.email.split("@")[0],
    };

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(safeUser));
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    
    // Dispatch events to trigger alert refresh
    dispatchAuthChange();
    
    navigate("/dashboard");
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8002/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        handleAuthSuccess({ email }, { access: data.access, refresh: data.refresh });
        return true;
      } else {
        throw new Error(data.detail || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;
    
    try {
      const response = await fetch("http://localhost:8002/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        dispatchAuthChange();
        return data.access;
      }
    } catch (error) {
      console.error("Token refresh failed");
    }
    return null;
  };

  const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  const logout = () => {
    localStorage.clear();
    dispatchAuthChange();
    navigate("/login");
  };

  return { login, handleAuthSuccess, getUser, logout, refreshToken, getAccessToken };
}