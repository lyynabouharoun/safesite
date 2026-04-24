import useWebSocket from "../../hooks/useWebSocket";

export default function AlertPanel() {
    const alerts = useWebSocket("ws://127.0.0.1:8000/ws/alerts/");

    const getStyle = (type) => {
        switch (type) {
            case "weapon":
                return "bg-red-100 border-red-500 text-red-700";
            case "suspicious_object":
                return "bg-orange-100 border-orange-500 text-orange-700";
            default:
                return "bg-gray-100 border-gray-300 text-gray-700";
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
            <h2 className="text-lg font-bold mb-3">🚨 Live Alerts</h2>

            {/* Empty state */}
            {alerts.length === 0 && (
                <p className="text-gray-500 text-sm">No alerts yet</p>
            )}

            {/* Alerts list */}
            <div className="flex-1 overflow-y-auto">
                {alerts.map((alert, index) => (
                    <div
                        key={index}
                        className={`p-3 mb-2 rounded border shadow-sm transition-all ${getStyle(alert.type)}`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">
                                {getLabel(alert.type)}
                            </span>
                            <span className="text-xs opacity-70">
                                {new Date().toLocaleTimeString()}
                            </span>
                        </div>

                        <div className="mt-1 text-sm">
                            Confidence:{" "}
                            <b>{(alert.confidence * 100).toFixed(1)}%</b>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}