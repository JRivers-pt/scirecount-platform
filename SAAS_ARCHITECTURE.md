# ScireCount SaaS Architecture

## 1. High-Level Concept
To sell this as a service, ScireCount acts as the central "Brain".
- **Clients** (Retailers, Malls) pay a subscription.
- **You** ship the VS125 sensor to them.
- **They** plug it in, log into ScireCount, and enter the Serial Number to "claim" it.
- **Data** flows from their site -> Milesight Cloud/Your Broker -> ScireCount Database.

## 2. Multi-Tenancy Strategy
We use **Logical Isolation** in a shared database. Every record in the database has a `tenant_id`.

- **Super Admin (You)**: Can see all tenants, manage billing, global settings.
- **Tenant Admin (Client)**: Can only see devices and users with their `tenant_id`.

## 3. The Data Pipeline (The "Engine")
Reliability is key for a paid service.
1.  **Ingestion**: An **MQTT Cluster** (e.g., EMQX or VerneMQ) receives data from thousands of VS125 sensors simultaneously.
2.  **Processing**: A worker service (Node.js/Go) validates the payload and checks if the device belongs to a paying tenant.
3.  **Storage**:
    *   **Hot Data**: Redis (for real-time dashboard numbers).
    *   **Historical Data**: TimescaleDB (PostgreSQL) for storing years of visit/occupancy counts efficiently.

## 4. Device Provisioning Flow ("Plug & Play")
To scale sales, onboarding must be automatic:
1.  You add the device MAC address to a "Whitelabel Inventory" in the DB.
2.  Client receives device, logs in, goes to "Devices > Add New".
3.  Client scans QR Code (MAC Address).
4.  Backend links that MAC address to the Client's `tenant_id`.
5.  Data starts appearing on their dashboard immediately.

## 5. Security Checklist
- **Device Auth**: Ensure sensors connect via TLS (MQTTS).
- **User Auth**: Use Auth0 or AWS Cognito for robust user management (MFA, SSO).
- **API Limits**: Rate-limit the API so one big client doesn't crash the server for everyone else.
