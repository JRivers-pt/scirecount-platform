const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow frontend access
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Mock Data for TD2000 and VS125 Devices
// Storing this in memory for now. In production, fetch from PostgreSQL.
let devices = [
    {
        deviceId: 'VS125-29384',
        name: 'Entrada Principal',
        status: 'online',
        lineCrossing: { in: 1450, out: 1200 },
        occupancy: 250,
        lastUpdate: new Date().toISOString(),
        model: 'VS125'
    },
    {
        deviceId: 'VS125-99283',
        name: 'Salida Cafetería',
        status: 'online',
        lineCrossing: { in: 800, out: 950 },
        occupancy: -150, // Just a simulation artifact, should handle logic better
        lastUpdate: new Date().toISOString(),
        model: 'VS125'
    },
    {
        deviceId: 'TD2000-55102',
        name: 'Pasillo Central (TD2000)',
        status: 'online',
        lineCrossing: { in: 340, out: 310 },
        occupancy: 30,
        lastUpdate: new Date().toISOString(),
        model: 'TD2000'
    }
];

// API Endpoints
app.get('/api/devices', (req, res) => {
    res.json(devices);
});

// Real-time Simulation Loop
// Endpoint to receive real data from TD2000 Sensor
// Configure your TD2000 to POST JSON to: http://<YOUR_PC_IP>:3000/api/sensors/td2000
app.post('/api/sensors/td2000', (req, res) => {
    const data = req.body;
    console.log('Received TD2000 data:', data);

    // Expected standard payload structure (adapting to what typical sensors send)
    // If your TD2000 sends a specific format, we can adjust this mapping.
    // Assuming structure: { deviceId: "...", in: 10, out: 5, occupancy: 5 }

    // 1. Identify Device
    const deviceId = data.deviceId || data.mac || 'TD2000-DEFAULT';

    let deviceIndex = devices.findIndex(d => d.deviceId === deviceId);

    // 2. If new device, register it
    if (deviceIndex === -1) {
        devices.push({
            deviceId: deviceId,
            name: data.deviceName || 'New Sensor TD2000',
            status: 'online',
            lineCrossing: {
                in: Number(data.in) || 0,
                out: Number(data.out) || 0
            },
            occupancy: Number(data.occupancy) || (Number(data.in || 0) - Number(data.out || 0)),
            lastUpdate: new Date().toISOString(),
            model: 'TD2000'
        });
        deviceIndex = devices.length - 1;
    } else {
        // 3. Update existing device
        // Support both "total counts" vs "increment" logic. 
        // For now, assuming sensor sends TOTAL counts. If it sends increments, we'd add +=.
        const d = devices[deviceIndex];

        // Check if payload has 'in'/'out' or 'lineCrossing' object
        const inCount = data.lineCrossing?.in ?? data.in ?? d.lineCrossing.in;
        const outCount = data.lineCrossing?.out ?? data.out ?? d.lineCrossing.out;

        d.lineCrossing.in = Number(inCount);
        d.lineCrossing.out = Number(outCount);

        // Recalculate occupancy if explicitly sent, otherwise derive
        if (data.occupancy !== undefined) {
            d.occupancy = Number(data.occupancy);
        } else {
            d.occupancy = Math.max(0, d.lineCrossing.in - d.lineCrossing.out);
        }

        d.status = 'online';
        d.lastUpdate = new Date().toISOString();
    }

    // 4. Broadcast update to Frontend
    io.emit('devices_update', devices);

    res.status(200).json({ status: 'success', message: 'Data processed' });
});

// Remove old simulation loop
// setInterval(() => { ... }, 3000);

io.on('connection', (socket) => {
    console.log('a user connected');
    // Send initial data
    socket.emit('devices_update', devices);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
