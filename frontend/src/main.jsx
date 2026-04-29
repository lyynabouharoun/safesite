import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="491409934255-t4340hqkqos46hld52eftq9v7m0egp89.apps.googleusercontent.com">
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);