import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cameras from "./pages/cameras";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AlertsProvider } from "./context/AlertsContext";

export default function App() {
  return (
    <AlertsProvider>
      <Routes>

        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cameras"
          element={
            <ProtectedRoute>
              <Cameras />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </AlertsProvider>
  );
}