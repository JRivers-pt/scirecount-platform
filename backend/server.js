const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const sequelize = require('./database');
const Device = require('./models/Device');
const DeviceLog = require('./models/DeviceLog');
const Client = require('./models/Client');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Helper to format device for frontend
const formatDevice = (d) => ({
    deviceId: d.deviceId,
    name: d.name,
    status: d.status,
    lineCrossing: { in: d.lastIn, out: d.lastOut },
    occupancy: d.currentOccupancy,
    lastUpdate: d.lastUpdate,
    model: d.model
});

// API Endpoints
app.get('/api/devices', async (req, res) => {
    try {
        const devices = await Device.findAll();
        res.json(devices.map(formatDevice));
    } catch (error) {
        console.error("Error fetching devices:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Clients API
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/clients', async (req, res) => {
    try {
        const client = await Client.create(req.body);
        res.json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Reports API
app.get('/api/reports', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;
        const where = {};

        if (deviceId) where.deviceId = deviceId;
        if (startDate && endDate) {
            const { Op } = require('sequelize');
            where.timestamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const logs = await DeviceLog.findAll({
            where,
            order: [['timestamp', 'DESC']],
            limit: 100 // Cap for now
        });

        res.json(logs);
    } catch (error) {
        console.error("Report Error:", error);
        res.status(500).json({ error: "Failed to generate report" });
    }
});

// Real Data Ingestion (TD2000 / Webhook)
app.post('/api/sensors/td2000', async (req, res) => {
    const data = req.body;
    console.log('Received Sensor Data:', data);

    const deviceId = data.deviceId || data.mac || 'TD2000-DEFAULT';
    const inCount = Number(data.lineCrossing?.in ?? data.in ?? 0);
    const outCount = Number(data.lineCrossing?.out ?? data.out ?? 0);
    const occupancy = data.occupancy !== undefined
        ? Number(data.occupancy)
        : Math.max(0, inCount - outCount);

    try {
        // 1. Find or Create Device
        let [device, created] = await Device.findOrCreate({
            where: { deviceId },
            defaults: {
                name: data.deviceName || 'New Sensor',
                model: 'TD2000',
                status: 'online',
                lastIn: inCount,
                lastOut: outCount,
                currentOccupancy: occupancy
            }
        });

        // 2. Update if exists
        if (!created) {
            device.lastIn = inCount;
            device.lastOut = outCount;
            device.currentOccupancy = occupancy;
            device.status = 'online';
            device.lastUpdate = new Date();
            await device.save();
        }

        // 3. Log History (Critical for Reports)
        await DeviceLog.create({
            deviceId: device.deviceId,
            inCount: inCount,
            outCount: outCount,
            occupancy: occupancy
        });

        // 4. broadcast to socket
        const allDevices = await Device.findAll();
        io.emit('devices_update', allDevices.map(formatDevice));

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error("Error processing sensor data:", error);
        res.status(500).json({ error: "Database error" });
    }
});

io.on('connection', async (socket) => {
    console.log('User connected');
    // Send current state
    const devices = await Device.findAll();
    socket.emit('devices_update', devices.map(formatDevice));
});

// Sync DB and Start Server
sequelize.sync().then(() => {
    console.log('Database synced (SQLite)');
    // Create Default Users/Clients if empty (Optional, can do later)
    server.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
