-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Create schema for application data
CREATE SCHEMA IF NOT EXISTS app_data;

-- Create users table
CREATE TABLE IF NOT EXISTS app_data.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(50) CHECK (role IN ('warehouse_staff', 'logistics_manager', 'driver', 'sales', 'business_owner')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create session store table
CREATE TABLE IF NOT EXISTS app_data.sessions (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_expire_idx ON app_data.sessions (expire);

-- Create routes table
CREATE TABLE IF NOT EXISTS app_data.routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('optimized', 'delayed', 'standard')),
    savings VARCHAR(50),
    eta TIMESTAMPTZ,
    distance VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hyper-local routes table (optimized for time-series data)
CREATE TABLE IF NOT EXISTS app_data.hyper_local_routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('active', 'scheduled', 'completed')),
    region VARCHAR(255) NOT NULL,
    traffic_conditions VARCHAR(50) CHECK (traffic_conditions IN ('light', 'moderate', 'heavy', 'gridlock')),
    weather_conditions VARCHAR(255),
    fuel_savings VARCHAR(50),
    time_reduction VARCHAR(50),
    route_efficiency NUMERIC(5,2),
    edge_device_status VARCHAR(50) CHECK (edge_device_status IN ('online', 'offline', 'degraded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable (TimescaleDB feature for optimized time-series)
SELECT create_hypertable('app_data.hyper_local_routes', 'created_at', if_not_exists => TRUE);

-- Create construction zones table
CREATE TABLE IF NOT EXISTS app_data.construction_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude NUMERIC(10,6) NOT NULL,
    longitude NUMERIC(10,6) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    impact VARCHAR(50) CHECK (impact IN ('low', 'medium', 'high')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create relation table between routes and construction zones
CREATE TABLE IF NOT EXISTS app_data.route_construction_zones (
    route_id INTEGER REFERENCES app_data.hyper_local_routes(id) ON DELETE CASCADE,
    zone_id INTEGER REFERENCES app_data.construction_zones(id) ON DELETE CASCADE,
    PRIMARY KEY (route_id, zone_id)
);

-- Create weather events table
CREATE TABLE IF NOT EXISTS app_data.weather_events (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) CHECK (type IN ('storm', 'fog', 'snow', 'rain', 'extreme-heat', 'flood')),
    severity VARCHAR(50) CHECK (severity IN ('severe', 'moderate', 'minor')),
    region VARCHAR(255) NOT NULL,
    affected_routes INTEGER,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable for efficient time-series queries
SELECT create_hypertable('app_data.weather_events', 'start_time', if_not_exists => TRUE);

-- Create schema for warehouse operations
CREATE SCHEMA IF NOT EXISTS warehouse;

-- Create inventory table
CREATE TABLE IF NOT EXISTS warehouse.inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory_history table for tracking changes (time-series)
CREATE TABLE IF NOT EXISTS warehouse.inventory_history (
    id SERIAL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    location VARCHAR(255) NOT NULL,
    operation VARCHAR(50) CHECK (operation IN ('add', 'remove', 'transfer', 'adjust')),
    user_id INTEGER REFERENCES app_data.users(id),
    operation_time TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable for time-series analysis
SELECT create_hypertable('warehouse.inventory_history', 'operation_time', if_not_exists => TRUE);

-- Create shipments table
CREATE TABLE IF NOT EXISTS warehouse.shipments (
    id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(255) NOT NULL UNIQUE,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('on-schedule', 'delayed', 'delivered')),
    eta TIMESTAMPTZ,
    priority VARCHAR(50) CHECK (priority IN ('high', 'medium', 'normal')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shipment_tracking table for real-time location updates (time-series)
CREATE TABLE IF NOT EXISTS warehouse.shipment_tracking (
    id SERIAL,
    shipment_id VARCHAR(255) REFERENCES warehouse.shipments(shipment_id),
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),
    status VARCHAR(50),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable for time-series location tracking
SELECT create_hypertable('warehouse.shipment_tracking', 'timestamp', if_not_exists => TRUE);

-- Create schema for sustainability metrics
CREATE SCHEMA IF NOT EXISTS sustainability;

-- Create emissions table (time-series)
CREATE TABLE IF NOT EXISTS sustainability.emissions (
    id SERIAL,
    route_id INTEGER,
    vehicle_id INTEGER,
    co2_grams NUMERIC(10,2),
    distance_km NUMERIC(10,2),
    fuel_used_liters NUMERIC(10,2),
    empty_miles_percent NUMERIC(5,2),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable for time-series analysis
SELECT create_hypertable('sustainability.emissions', 'timestamp', if_not_exists => TRUE);

-- Create continuous aggregate for daily emission summaries
CREATE MATERIALIZED VIEW IF NOT EXISTS sustainability.daily_emissions
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 day', timestamp) AS day,
    SUM(co2_grams) AS total_co2_grams,
    SUM(distance_km) AS total_distance_km,
    SUM(fuel_used_liters) AS total_fuel_used_liters,
    AVG(empty_miles_percent) AS avg_empty_miles_percent
FROM sustainability.emissions
GROUP BY day;

-- Create sustainability recommendations table
CREATE TABLE IF NOT EXISTS sustainability.recommendations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    potential_impact VARCHAR(255),
    difficulty VARCHAR(50) CHECK (difficulty IN ('easy', 'medium', 'complex')),
    time_to_implement VARCHAR(255),
    cost_savings VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial sample users if they don't exist
INSERT INTO app_data.users (username, password, name, role)
VALUES 
    ('warehouse1', '$2b$10$7JgyvNZI.VDXDxy0ReLKQu9Nxw2OWbgVOjFe4MZ3kbYQ1EjZS/5jK', 'Warehouse Staff', 'warehouse_staff'),
    ('manager1', '$2b$10$7JgyvNZI.VDXDxy0ReLKQu9Nxw2OWbgVOjFe4MZ3kbYQ1EjZS/5jK', 'Logistics Manager', 'logistics_manager'),
    ('driver1', '$2b$10$7JgyvNZI.VDXDxy0ReLKQu9Nxw2OWbgVOjFe4MZ3kbYQ1EjZS/5jK', 'Delivery Driver', 'driver'),
    ('sales1', '$2b$10$7JgyvNZI.VDXDxy0ReLKQu9Nxw2OWbgVOjFe4MZ3kbYQ1EjZS/5jK', 'Sales Representative', 'sales'),
    ('owner1', '$2b$10$7JgyvNZI.VDXDxy0ReLKQu9Nxw2OWbgVOjFe4MZ3kbYQ1EjZS/5jK', 'Business Owner', 'business_owner')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_routes_origin_dest ON app_data.routes(origin, destination);
CREATE INDEX IF NOT EXISTS idx_hyper_local_routes_region ON app_data.hyper_local_routes(region);
CREATE INDEX IF NOT EXISTS idx_weather_events_region ON app_data.weather_events(region);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON warehouse.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON warehouse.inventory(location);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON warehouse.shipments(status);

-- Function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON app_data.users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_routes_timestamp
BEFORE UPDATE ON app_data.routes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_hyper_local_routes_timestamp
BEFORE UPDATE ON app_data.hyper_local_routes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_inventory_timestamp
BEFORE UPDATE ON warehouse.inventory
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_shipments_timestamp
BEFORE UPDATE ON warehouse.shipments
FOR EACH ROW EXECUTE FUNCTION update_timestamp();