import { useEffect, useRef } from "react";

export default function AlertPanel({ alerts = [] }) {

    const prevCountRef = useRef(0);
    const isFirstLoad = useRef(true); // 👈 ADD THIS

   

    const getStyle = (type) => {
        switch (type) {
            case "weapon":
                return "bg-red-900/20 border-red-500 text-red-300";
            case "suspicious_object":
                return "bg-orange-900/20 border-orange-500 text-orange-300";
            default:
                return "bg-gray-900/20 border-gray-500 text-gray-300";
        }
    };

    const getLabel = (type) => {
        switch (type) {
            case "weapon":
                return "🔴 Weapon Detected";
            case "suspicious_object":
                return "🟠 Suspicious Object";
            default:
                return "⚪ Unknown";
        }
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <h2 className="text-lg font-bold mb-3 text-blue-200">
                🚨 Live Alerts
            </h2>

            {alerts.length === 0 && (
                <p className="text-blue-300/50 text-sm">
                    No alerts yet
                </p>
            )}

            <div className="flex-1 overflow-y-auto space-y-2">
                {alerts.map((alert, index) => {
                    const type = alert.type || "unknown";
                    const confidence = alert.confidence ?? 0;

                    return (
                        <div
                            key={alert.id || alert.timestamp || index}
                            className={`p-3 rounded border backdrop-blur-md ${getStyle(type)}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">
                                    {getLabel(type)}
                                </span>

                                <span className="text-xs opacity-60">
                                    {alert.timestamp
                                        ? new Date(alert.timestamp).toLocaleTimeString()
                                        : new Date().toLocaleTimeString()}
                                </span>
                            </div>

                            <div className="mt-1 text-sm">
                                Confidence:{" "}
                                <b>
                                    {(confidence * 100).toFixed(1)}%
                                </b>
                            </div>

                            <div className="text-xs opacity-60 mt-1">
                                Camera: {alert.camera || "CAM-01"}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}