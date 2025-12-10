-- Database Schema for ScireCount SaaS (PostgreSQL)

-- 1. TENANTS (Your Clients)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL, -- e.g. "Zara Madrid", "TechShop Co"
    subscription_plan VARCHAR(50) DEFAULT 'basic', -- 'basic', 'pro', 'enterprise'
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. USERS (Staff belonging to a Tenant)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id), -- The crucial link for security
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'viewer', -- 'admin', 'manager', 'viewer'
    full_name VARCHAR(100)
);

-- 3. LOCATIONS (Physical Stores/Sites)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL, -- "Main Entrance", "Loading Dock"
    address TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC'
);

-- 4. DEVICES (The VS125 Sensors)
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    location_id UUID REFERENCES locations(id),
    mac_address VARCHAR(17) UNIQUE NOT NULL, -- "24:E1:..."
    model VARCHAR(50) DEFAULT 'VS125',
    firmware_version VARCHAR(20),
    last_seen TIMESTAMP,
    status VARCHAR(20) DEFAULT 'offline' -- 'online', 'offline', 'maintenance'
);

-- 5. ANALYTICS (The Heavy Data)
-- Ideally use TimescaleDB hypertable for this
CREATE TABLE counting_events (
    time TIMESTAMPTZ NOT NULL,
    device_id UUID REFERENCES devices(id),
    tenant_id UUID REFERENCES tenants(id), -- Denormalized for query speed
    line_cross_in INTEGER DEFAULT 0,
    line_cross_out INTEGER DEFAULT 0,
    current_occupancy INTEGER,
    
    -- Partitioning index by time is critical for performance
    PRIMARY KEY (time, device_id)
);
