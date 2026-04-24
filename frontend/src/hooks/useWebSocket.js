import { useEffect, useState, useRef } from "react";

export default function useWebSocket(url) {
    const [messages, setMessages] = useState([]);
    const audioRef = useRef(null);

    useEffect(() => {
        const socket = new WebSocket(url);

        // 🔊 Prepare audio once
        audioRef.current = new Audio("/alert.mp3");

        socket.onopen = () => {
            console.log("✅ WebSocket connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("🚨 ALERT:", data);

            // 🔊 Play sound safely
            if (audioRef.current) {
                audioRef.current.currentTime = 0; // restart sound
                audioRef.current.play().catch(() => {
                    // browser may block autoplay until user clicks
                });
            }

            // 🧠 Keep only last 10 alerts (prevents UI lag later)
            setMessages((prev) => [data, ...prev.slice(0, 9)]);
        };

        socket.onerror = (err) => {
            console.error("❌ WS Error:", err);
        };

        socket.onclose = () => {
            console.log("🔌 WebSocket closed");
        };

        return () => socket.close();
    }, [url]);

    return messages;
}