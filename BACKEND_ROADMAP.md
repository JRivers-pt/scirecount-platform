# Backend Roadmap for TechScire Solutions

To move **ScireCount** from Prototype to Production with Milesight VS125 integration, the following architecture is required.

## 1. The Stack
We recommend a modern, scalable stack:
- **Runtime**: Node.js (v20+) or Python (FastAPI).
- **Database**: PostgreSQL (best for relational data like Users, Centers) + TimescaleDB (best for high-frequency sensor time-series data).
- **Communication**: MQTT Broker (Mosquitto) for handling thousands of sensors effectively.

## 2. Infrastructure Requirements
You will need a Virtual Private Server (VPS) or Cloud Instance (AWS/DigitalOcean):
- **CPU**: 2 Cores
- **RAM**: 4GB
- **Storage**: 50GB SSD

## 3. Data Flow
1. **Sensor (VS125)** detects a person.
2. **Sensor** sends JSON payload via MQTT to `mqtt.scirecount.com`.
3. **Backend Service** subscribes to MQTT topic, parses the JSON (`line_crossing`, `occupancy`).
4. **Backend Service** saves record to **PostgreSQL**.
5. **Backend Service** pushes update to **Frontend** via **Socket.io** (so the number changes on the screen instantly).

## 4. API Endpoints Needed
Your backend developers should implement these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Validate user and return JWT Token. |
| GET | `/api/devices` | List all sensors assigned to the user. |
| GET | `/api/stats/summary` | Get 'Total Visits' for the Dashboard cards. |
| POST | `/api/webhook/vs125` | (Optional) If not using MQTT, receive HTTP POST from sensors. |

## 5. Next Development Step
**Recommendation**: Build a minimal "Mock Backend" using **Node.js + Express** in this same project to simulate the API and finalize the frontend integration.
