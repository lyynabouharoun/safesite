import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

const FAKE_USER = {
  email: "operator@safesite.io",
  password: "safesite123",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      setUser({ email });
      navigate("/dashboard");
    } else {
      alert("Invalid credentials.\nEmail: operator@safesite.io\nPassword: safesite123");
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}