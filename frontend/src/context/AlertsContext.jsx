import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const AlertsContext = createContext();

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const socketRef = useRef(null);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  // Fetch alerts from API with JWT
  const fetchAlerts = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log("No token found, skipping alerts fetch");
        setAlerts([]); // Clear alerts when no token
        return;
      }
      
      const res = await axios.get("http://127.0.0.1:8000/api/alerts/", {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      const data = Array.isArray(res.data) ? res.data : [];
      console.log("📊 Fetched alerts from API:", data.length);
      setAlerts(data);
    } catch (err) {
      if (err.response?.status === 401) {
        console.error("Authentication failed, redirecting to login");
        localStorage.clear();
        window.location.href = '/login';
      } else {
        console.error("Error fetching alerts:", err);
      }
    }
  };

  useEffect(() => {
    // Fetch existing alerts on load
    fetchAlerts();

    // Listen for storage changes (when user logs in/out from another tab or same tab)
    const handleStorageChange = (e) => {
      if (e.key === 'access_token' || e.key === 'isAuthenticated' || e.key === 'user') {
        console.log("🔄 Auth changed, refreshing alerts...");
        fetchAlerts();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    const handleAuthChange = () => {
      console.log("🔄 Auth change event received, refreshing alerts...");
      fetchAlerts();
    };
    window.addEventListener('auth-change', handleAuthChange);

    // WebSocket connection for real-time alerts
    const socket = new WebSocket("ws://localhost:8000/ws/alerts/");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected for alerts");
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    socket.onmessage = (event) => {
      try {
        const alert = JSON.parse(event.data);
        console.log("📨 New alert received:", alert);
        
        // Add to alerts state
        setAlerts((prev) => {
          // Check if alert already exists
          if (prev.some(a => a.id === alert.id)) return prev;
          
          // Play sound
          const audio = new Audio("/alert.mp3");
          audio.play().catch(e => console.log("Audio play failed:", e));
          
          // Add new alert at the beginning
          return [alert, ...prev];
        });
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  return (
    <AlertsContext.Provider value={{ alerts, setAlerts, fetchAlerts }}>
      {children}
    </AlertsContext.Provider>
  );
}

export const useAlerts = () => useContext(AlertsContext);