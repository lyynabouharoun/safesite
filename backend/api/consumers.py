# api/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer


class AlertConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print("🔥 WS CONNECTED")
        await self.channel_layer.group_add("alerts", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        print("🔌 WS DISCONNECTED")
        await self.channel_layer.group_discard("alerts", self.channel_name)

    async def alert_message(self, event):
        raw = event.get("data", {})

        # ✅ Normalize data so frontend ALWAYS understands it
        data = {
            "id": raw.get("id"),
            "type": raw.get("type") or raw.get("class") or "unknown",
            "confidence": raw.get("confidence", 0),
            "message": raw.get("message", ""),
            "camera": raw.get("camera", "CAM-01"),
            "timestamp": raw.get("timestamp"),
        }

        print("📩 NORMALIZED ALERT:", data)  # DEBUG

        await self.send(text_data=json.dumps(data))