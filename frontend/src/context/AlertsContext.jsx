import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const AlertsContext = createContext();

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const socketRef = useRef(null);

  // 1️⃣ LOAD INITIAL DATA
  const fetchAlerts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/alerts/");
      const data = res.data.reverse();

      setAlerts(data);
    } catch (err) {
      console.error(err);
    }
  };

 useEffect(() => {
  fetchAlerts();

  // 2️⃣ WEBSOCKET
  const socket = new WebSocket("ws://localhost:8000/ws/alerts/");
  socketRef.current = socket;

  // ✅ ADD THIS (debugging)
  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket error", err);
  };

  socket.onclose = () => {
    console.log("❌ WebSocket closed");
  };

  // existing message handler (keep it)
  socket.onmessage = (event) => {
    const alert = JSON.parse(event.data);

    const alertKey =
      alert.id ??
      `${alert.type}-${alert.timestamp}-${alert.camera}-${alert.confidence}`;

    setAlerts((prev) => {
      const exists = prev.some((a) => a._key === alertKey);

      if (exists) return prev;

      const audio = new Audio("/alert.mp3");
      audio.play().catch(() => {});

      return [
        { ...alert, _key: alertKey },
        ...prev,
      ].slice(0, 50);
    });
  };

  return () => socket.close();
}, []);

  return (
    <AlertsContext.Provider value={{ alerts, setAlerts, fetchAlerts }}>
      {children}
    </AlertsContext.Provider>
  );
}

export const useAlerts = () => useContext(AlertsContext);