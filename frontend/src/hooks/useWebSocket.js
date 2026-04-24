import { useEffect, useRef, useState } from "react";

export default function useWebSocket(url) {
  const ws = useRef(null);
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => setConnected(true);

    ws.current.onmessage = (event) => {
      try {
        setData(JSON.parse(event.data));
      } catch {
        setData(event.data);
      }
    };

    ws.current.onclose = () => setConnected(false);

    return () => ws.current.close();
  }, [url]);

  const send = (msg) => {
    if (ws.current?.readyState === 1) {
      ws.current.send(JSON.stringify(msg));
    }
  };

  return { data, connected, send };
}