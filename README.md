# Smart Manufacturing Digital Twin

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)](https://fastapi.tiangolo.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r158-blue.svg)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A **production-grade Digital Twin platform** for smart manufacturing. This repository provides a 3D visualization of a factory floor integrated with real-time IoT sensor data, enabling monitoring, predictive maintenance, and operational optimization.

## 🚀 Features

- **3D Visualization**: Interactive Three.js-based rendering of factory assets and floor layout.
- **Real-time IoT Integration**: FastAPI backend for ingesting and streaming sensor data (via WebSockets).
- **Sensor Overlays**: Live data badges (temperature, motor speed, vibration) overlaid on 3D models.
- **Predictive Alerts**: Anomaly detection logic to flag potential machine failures.
- **Digital Shadow**: Synchronized state between physical assets and their digital counterparts.
- **Containerized**: Modular Docker setup for easy deployment.

## 📁 Project Structure

```
smart-manufacturing-digital-twin/
├── backend/          # FastAPI IoT engine
├── frontend/         # Three.js 3D dashboard
├── docs/             # API documentation and architecture
├── tests/            # Integration and unit tests
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml
└── requirements.txt
```

## 🛠️ Quick Start

```bash
# Clone
git clone https://github.com/Shivay00001/smart-manufacturing-digital-twin.git

# Run with Docker Compose
docker-compose up --build
```

## 📄 License

MIT License
