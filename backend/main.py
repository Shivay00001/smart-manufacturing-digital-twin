from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List, Dict
import asyncio
import json
import random

app = FastAPI(title="Smart Manufacturing Digital Twin API")

# Store active websocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async struct_connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# Mock asset data
assets = {
    "motor_01": {"temp": 45.2, "speed": 1200, "status": "nominal"},
    "robotic_arm_01": {"position": [1.2, 0.5, 0], "status": "active"},
    "conveyor_01": {"speed": 0.5, "status": "nominal"}
}

@app.get("/api/assets")
async def get_assets():
    return assets

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.struct_connect(websocket)
    try:
        while True:
            # Simulate real-time sensor updates
            update = {
                "motor_01": {
                    "temp": 45 + random.uniform(-2, 2),
                    "speed": 1200 + random.uniform(-10, 10)
                },
                "robotic_arm_01": {
                    "vibration": random.uniform(0.1, 0.5)
                }
            }
            await websocket.send_text(json.dumps(update))
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/health")
async def health():
    return {"status": "ok"}
