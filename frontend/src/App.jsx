import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cameras from "./pages/cameras";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AlertsProvider } from "./context/AlertsContext";

function P({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <AlertsProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<P><Dashboard /></P>} />
        <Route path="/cameras" element={<P><Cameras /></P>} />
        <Route path="/history" element={<P><History /></P>} />
        <Route path="/profile" element={<P><Profile /></P>} />        <Route path="/notifications" element={<P><Notifications /></P>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </AlertsProvider>
  );
}