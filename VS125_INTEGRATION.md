# Milesight VS125 Integration Guide

## Overview
To get data from the VS125 sensor into **ScireCount**, you have two main options depending on your network infrastructure.

### Option A: HTTP Push (Recommended for Local/Intranet)
If your sensors are on the same network as the server, configure the VS125 to push data via HTTP POST.

1. **Access VS125 Web GUI**: Log in to the device IP.
2. **Navigate to**: `Data Transfer` -> `HTTP`.
3. **URL**: Point to your ScireCount Backend (e.g., `http://192.168.1.100:3000/api/webhook`).
4. **Format**: Select `JSON`.

**Sample Payload from VS125:**
```json
{
  "device_name": "VS125-Front",
  "mac": "24:E1:24:...",
  "line_crossing": {
    "in": 124,
    "out": 100
  },
  "timestamp": "2025-12-10T14:00:00Z"
}
```

### Option B: MQTT (Recommended for Scalability)
If you manage many sensors, use an MQTT Broker (like Mosquitto).

1. **Access VS125 Web GUI**: `Data Transfer` -> `MQTT`.
2. **Broker Address**: IP of your MQTT Broker.
3. **Topic**: `scirecount/devices/vs125/uplink`.

## ScireCount Backend Implementation
To act as the "middleman", you will need a small backend service running alongside this React app.

**Simple Node.js Listener Example:**
```javascript
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/webhook', (req, res) => {
  const data = req.body;
  console.log("Received VS125 Data:", data);
  
  // TODO: Forward this data to the React Frontend via WebSocket (Socket.io)
  
  res.status(200).send('OK');
});

app.listen(3000, () => console.log('Listener running on port 3000'));
```
