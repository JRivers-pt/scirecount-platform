// This service manages the communication with the Backend API and real-time updates
import { io, Socket } from 'socket.io-client';

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
    model?: string; // Added model field for TD2000 distinction
}

class DeviceServiceImpl {
    private socket: Socket | null = null;
    private listeners: ((data: DeviceData[]) => void)[] = [];
    private currentData: DeviceData[] = [];

    constructor() {
        // Initialize connection
        this.connect();
    }

    private connect() {
        // Connect to the backend server
        // Use environment variable if available, otherwise localhost
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        console.log(`Connecting to Backend at: ${API_URL}`);

        this.socket = io(API_URL);

        this.socket.on('connect', () => {
            console.log('Connected to backend WebSocket');
        });

        this.socket.on('devices_update', (data: any[]) => {
            // Transform string dates back to Date objects if needed, 
            // though for display mostly strings are fine, strict typing wants Date
            const parsedData = data.map(d => ({
                ...d,
                lastUpdate: new Date(d.lastUpdate)
            }));

            this.currentData = parsedData;
            this.notifyListeners(parsedData);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from backend');
        });
    }

    // Allow components (like Dashboard) to subscribe to updates
    subscribe(callback: (data: DeviceData[]) => void) {
        this.listeners.push(callback);

        // return current data immediately if available
        if (this.currentData.length > 0) {
            callback(this.currentData);
        }

        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners(data: DeviceData[]) {
        this.listeners.forEach(l => l(data));
    }

    // Fallback for manual fetch if needed
    async getAllDevices(): Promise<DeviceData[]> {
        if (this.currentData.length > 0) return this.currentData;
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const res = await fetch(`${API_URL}/api/devices`);
            const data = await res.json();
            return data.map((d: any) => ({ ...d, lastUpdate: new Date(d.lastUpdate) }));
        } catch (error) {
            console.error("Failed to fetch devices", error);
            return [];
        }
    }
}

export const deviceService = new DeviceServiceImpl();
