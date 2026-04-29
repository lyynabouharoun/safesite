import { useNavigate } from "react-router-dom";
import { useState } from "react";

let globalUser = null;

export default function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleAuthSuccess = (user) => {
  const safeUser = {
    email: user.email,
    name: user.name || user.email.split("@")[0],
  };

  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("user", JSON.stringify(safeUser));

  navigate("/dashboard");
};

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8002/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        handleAuthSuccess({
          email,
          name: email.split("@")[0],
        });
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      alert("Auth Service Offline");
    }
  };

  const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

  const logout = () => {
    localStorage.clear();
    globalUser = null;
    navigate("/login");
  };

  return { login, handleAuthSuccess, getUser, logout };
}