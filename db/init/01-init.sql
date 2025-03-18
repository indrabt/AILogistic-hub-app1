-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Create schema
CREATE SCHEMA IF NOT EXISTS ai_logistics;

-- Set search path
SET search_path TO ai_logistics, public;

-- User table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weather events table (time-series data)
CREATE TABLE IF NOT EXISTS weather_events (
  id SERIAL PRIMARY KEY,
  event_time TIMESTAMPTZ NOT NULL,
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  region VARCHAR(100) NOT NULL,
  affected_routes INT,
  description TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  metadata JSONB
);

-- Create hypertable for time-series data
SELECT create_hypertable('weather_events', 'event_time');

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  distance VARCHAR(50),
  eta VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Shipments table (time-series data)
CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  shipment_id VARCHAR(50) NOT NULL UNIQUE,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  eta VARCHAR(50),
  priority VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Supply chain nodes
CREATE TABLE IF NOT EXISTS supply_chain_nodes (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  inventory INTEGER,
  metadata JSONB
);

-- Inventory readings (time-series data)
CREATE TABLE IF NOT EXISTS inventory_readings (
  id SERIAL PRIMARY KEY,
  node_id INTEGER REFERENCES supply_chain_nodes(id),
  product VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  reading_time TIMESTAMPTZ NOT NULL,
  minimum_threshold INTEGER
);

-- Create hypertable for time-series inventory data
SELECT create_hypertable('inventory_readings', 'reading_time');

-- ML models table
CREATE TABLE IF NOT EXISTS ml_models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  accuracy DOUBLE PRECISION,
  last_trained TIMESTAMPTZ,
  status VARCHAR(50) NOT NULL,
  features JSONB,
  model_data BYTEA,
  metadata JSONB
);

-- ML predictions table (time-series data)
CREATE TABLE IF NOT EXISTS ml_predictions (
  id SERIAL PRIMARY KEY,
  model_id INTEGER REFERENCES ml_models(id),
  prediction_time TIMESTAMPTZ NOT NULL,
  prediction_type VARCHAR(50) NOT NULL,
  confidence DOUBLE PRECISION,
  insights JSONB,
  impact_areas JSONB
);

-- Create hypertable for time-series prediction data
SELECT create_hypertable('ml_predictions', 'prediction_time');

-- Default users (for testing)
INSERT INTO users (username, password, role, name) VALUES
  ('warehouse1', '$2b$10$xxxxxxxxxxx', 'warehouse_staff', 'Warehouse Staff 1'),
  ('driver1', '$2b$10$xxxxxxxxxxx', 'driver', 'Driver 1'),
  ('manager1', '$2b$10$xxxxxxxxxxx', 'logistics_manager', 'Logistics Manager 1'),
  ('owner1', '$2b$10$xxxxxxxxxxx', 'business_owner', 'Business Owner 1'),
  ('sales1', '$2b$10$xxxxxxxxxxx', 'sales', 'Sales Representative 1')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_weather_events_region ON weather_events (region);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes (status);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments (status);
CREATE INDEX IF NOT EXISTS idx_ml_models_type ON ml_models (type);
CREATE INDEX IF NOT EXISTS idx_supply_chain_nodes_type ON supply_chain_nodes (type);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW(); 
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for shipments table
CREATE TRIGGER update_shipment_timestamp
BEFORE UPDATE ON shipments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();