import { Routes, Route, Navigate } from "react-router-dom";
import Login        from "./pages/Login";
import Dashboard    from "./pages/Dashboard";
import Cameras      from "./pages/Cameras";
import Alerts       from "./pages/Alerts";
import History      from "./pages/History";
import Settings     from "./pages/Settings";
import Profile      from "./pages/Profile";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./routes/ProtectedRoute";

function P({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"         element={<Login />} />
      <Route path="/dashboard"     element={<P><Dashboard /></P>} />
      <Route path="/cameras"       element={<P><Cameras /></P>} />
      <Route path="/alerts"        element={<P><Alerts /></P>} />
      <Route path="/history"       element={<P><History /></P>} />
      <Route path="/settings"      element={<P><Settings /></P>} />
      <Route path="/profile"       element={<P><Profile /></P>} />
      <Route path="/notifications" element={<P><Notifications /></P>} />
      <Route path="*"              element={<Navigate to="/login" replace />} />
    </Routes>
  );
}