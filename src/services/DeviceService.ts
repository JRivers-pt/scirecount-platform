// This service manages the communication with Milesight VS125 devices
// In production, this would connect to your Backend API or MQTT Broker

export interface DeviceData {
    deviceId: string;
    name: string;
    status: 'online' | 'offline' | 'maintenance';
    lineCrossing: {
        in: number;
        out: number;
    };
    occupancy: number;
    lastUpdate: Date;
}

class MilesightService {
    private socket: WebSocket | null = null;
    private listeners: ((data: DeviceData[]) => void)[] = [];

    // Mock data to simulate the device connection
    private mockData: DeviceData[] = [
        {
            deviceId: 'VS125-29384',
            name: 'Entrada Principal',
            status: 'online',
            lineCrossing: { in: 1450, out: 1200 },
            occupancy: 45,
            lastUpdate: new Date(),
        },
        {
            deviceId: 'VS125-99283',
            name: 'Salida Cafetería',
            status: 'online',
            lineCrossing: { in: 800, out: 950 },
            occupancy: 12,
            lastUpdate: new Date(),
        }
    ];

    constructor() {
        // In a real app, successful initialization would start the WebSocket connection
        // this.connect(); 
    }

    // Connect to TechScire Real-time Backend
    connect(url: string) {
        this.socket = new WebSocket(url);

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Transform VS125 JSON payload to our app format
            this.notifyListeners(data);
        };
    }

    // Allow components (like Dashboard) to subscribe to updates
    subscribe(callback: (data: DeviceData[]) => void) {
        this.listeners.push(callback);
        // Send immediate data on subscribe
        callback(this.mockData);

        // Simulate real-time updates for demo purposes
        setInterval(() => {
            this.simulateNewEntrance();
            callback([...this.mockData]);
        }, 5000); // Update every 5 seconds

        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners(data: DeviceData[]) {
        this.listeners.forEach(l => l(data));
    }

    // Simulation helper
    private simulateNewEntrance() {
        const device = this.mockData[0];
        device.lineCrossing.in += Math.floor(Math.random() * 3);
        device.lineCrossing.out += Math.floor(Math.random() * 2);
        device.occupancy = device.lineCrossing.in - device.lineCrossing.out;
        device.lastUpdate = new Date();
    }
}

export const deviceService = new MilesightService();
