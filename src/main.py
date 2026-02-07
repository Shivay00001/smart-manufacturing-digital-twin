
import asyncio
import json
import random
from fastapi import FastAPI, WebSocket, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from paho.mqtt import client as mqtt_client

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Mock MQTT setup (in a real app, this would connect to a broker)
# For this demo, we'll simulate sensor data internally and push via WebSocket
connected_clients = set()

@app.get("/")
async def get(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except Exception:
        connected_clients.remove(websocket)

async def sensor_simulation():
    """Simulates factory floor sensor data"""
    while True:
        data = {
            "machine_id": "CNC-001",
            "temperature": round(random.uniform(60, 90), 2),
            "vibration": round(random.uniform(0, 5), 2),
            "status": "OPERATIONAL" if random.random() > 0.05 else "MAINTENANCE"
        }
        
        if connected_clients:
            msg = json.dumps(data)
            # Broadcast to all connected clients
            await asyncio.gather(*[client.send_text(msg) for client in connected_clients])
            
        await asyncio.sleep(1)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(sensor_simulation())
