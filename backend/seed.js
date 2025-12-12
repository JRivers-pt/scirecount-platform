const sequelize = require('./database');
const Device = require('./models/Device');
const DeviceLog = require('./models/DeviceLog');
const Client = require('./models/Client');

async function seed() {
    console.log('🌱 Starting Seed Process...');

    try {
        await sequelize.sync({ force: true }); // Reset DB
        console.log('✅ Database synced (cleared)');

        // 1. Create Clients
        console.log('Creating Clients...');
        const clients = await Client.bulkCreate([
            { name: 'TechStore Lisbon', email: 'manager@techstore.pt', plan: 'Enterprise', status: 'active', locationsCount: 2 },
            { name: 'FashionHub Porto', email: 'contact@fashionhub.pt', plan: 'Pro', status: 'active', locationsCount: 1 },
            { name: 'MegaMarket Co', email: 'admin@megamarket.com', plan: 'Starter', status: 'inactive', locationsCount: 0 }
        ]);
        console.log(`✅ Created ${clients.length} clients`);

        // 2. Create Devices
        console.log('Creating Devices...');
        const devices = await Device.bulkCreate([
            { deviceId: 'VS125-001', name: 'Main Entrance (Lisbon)', status: 'online', model: 'VS135', lastIn: 120, lastOut: 110, currentOccupancy: 10, lastUpdate: new Date() },
            { deviceId: 'VS125-002', name: 'Side Door (Lisbon)', status: 'online', model: 'VS135', lastIn: 45, lastOut: 40, currentOccupancy: 5, lastUpdate: new Date() },
            { deviceId: 'TD2000-001', name: 'Porto Store Floor', status: 'maintenance', model: 'TD2000', lastIn: 0, lastOut: 0, currentOccupancy: 0, lastUpdate: new Date(Date.now() - 86400000) }, // 1 day ago
            { deviceId: 'VS125-003', name: 'MegaMarket North', status: 'online', model: 'VS135', lastIn: 1200, lastOut: 1150, currentOccupancy: 50, lastUpdate: new Date() },
            { deviceId: 'VS125-004', name: 'MegaMarket South', status: 'offline', model: 'VS135', lastIn: 800, lastOut: 790, currentOccupancy: 10, lastUpdate: new Date(Date.now() - 3600000) } // 1 hour ago
        ]);
        console.log(`✅ Created ${devices.length} devices`);

        // 3. Generate Logs (Last 24 hours)
        console.log('Generating Historical Logs...');
        const logs = [];
        const now = new Date();

        // Helper to add random variance
        const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

        for (const device of devices) {
            // Generate entries for the last 12 hours, every 30 mins
            let currentIn = 0;
            let currentOut = 0;

            for (let i = 24; i >= 0; i--) {
                const time = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 min intervals

                // Simulate traffic curve (peak at noon and evening)
                const hour = time.getHours();
                const isPeak = (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 20);
                const trafficBase = isPeak ? 20 : 5;

                const newIn = randomInt(trafficBase, trafficBase + 10);
                const newOut = randomInt(Math.max(0, trafficBase - 5), trafficBase + 5);

                currentIn += newIn;
                currentOut += newOut;

                // Ensure occupancy doesn't go below 0
                const occupancy = Math.max(0, currentIn - currentOut);

                logs.push({
                    deviceId: device.deviceId,
                    inCount: newIn,
                    outCount: newOut,
                    occupancy: occupancy,
                    timestamp: time
                });
            }

            // Update device totals to match last log (roughly)
            device.lastIn = currentIn;
            device.lastOut = currentOut;
            device.currentOccupancy = Math.max(0, currentIn - currentOut);
            await device.save();
        }

        await DeviceLog.bulkCreate(logs);
        console.log(`✅ Created ${logs.length} historical logs`);

        console.log('🎉 Seed Complete! Ready for Demo.');
    } catch (error) {
        console.error('❌ Usage Error:', error);
    }
}

seed();
