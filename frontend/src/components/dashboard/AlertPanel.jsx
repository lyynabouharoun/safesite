import { useEffect, useRef } from "react";

export default function AlertPanel({ alerts = [] }) {
    const prevCountRef = useRef(0);
    const isFirstLoad = useRef(true);

    const getStyle = (alert) => {
        // Based on confidence level
        const confidence = alert.confidence || 0;
        if (confidence > 0.7) {
            return "bg-red-900/20 border-red-500 text-red-300";
        } else if (confidence > 0.5) {
            return "bg-orange-900/20 border-orange-500 text-orange-300";
        }
        return "bg-yellow-900/20 border-yellow-500 text-yellow-300";
    };

    const getLabel = (alert) => {
        const prediction = alert.prediction || alert.type;
        const confidence = alert.confidence || 0;
        
        if (prediction === "Violence" || alert.type === "violence") {
            return `🔴 VIOLENCE DETECTED - ${(confidence * 100).toFixed(1)}%`;
        } else if (prediction === "violence" || alert.type === "suspicious") {
            return `🟠 Suspicious Activity - ${(confidence * 100).toFixed(1)}%`;
        }
        return `⚠️ Alert - ${(confidence * 100).toFixed(1)}%`;
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
                    return (
                        <div
                            key={alert.id || alert.timestamp || index}
                            className={`p-3 rounded border backdrop-blur-md ${getStyle(alert)} animate-pulse`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">
                                    {getLabel(alert)}
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
                                    {((alert.confidence || 0) * 100).toFixed(1)}%
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