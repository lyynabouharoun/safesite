import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-dark-base">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main 
          key={location.pathname}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}