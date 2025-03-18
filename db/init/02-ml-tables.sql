-- Set search path
SET search_path TO ai_logistics, public;

-- Hyper-local routing data
CREATE TABLE IF NOT EXISTS hyper_local_routes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  region VARCHAR(100) NOT NULL,
  traffic_conditions VARCHAR(50),
  weather_conditions VARCHAR(100),
  fuel_savings VARCHAR(50),
  time_reduction VARCHAR(50),
  route_efficiency DOUBLE PRECISION,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  edge_device_status VARCHAR(50),
  metadata JSONB
);

-- Construction zones (affecting routes)
CREATE TABLE IF NOT EXISTS construction_zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  impact VARCHAR(50) NOT NULL,
  description TEXT,
  hyper_local_route_id INTEGER REFERENCES hyper_local_routes(id)
);

-- Route telemetry data (time-series data)
CREATE TABLE IF NOT EXISTS route_telemetry (
  id SERIAL PRIMARY KEY,
  route_id INTEGER,
  vehicle_id INTEGER,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  traffic_density VARCHAR(50),
  recorded_at TIMESTAMPTZ NOT NULL,
  fuel_consumption DOUBLE PRECISION,
  road_condition VARCHAR(50),
  metadata JSONB
);

-- Create hypertable for route telemetry
SELECT create_hypertable('route_telemetry', 'recorded_at');

-- Feature engineering table for ML
CREATE TABLE IF NOT EXISTS feature_engineering (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  feature_type VARCHAR(50) NOT NULL,
  source_table VARCHAR(100),
  transformation_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Computed features (time-series data)
CREATE TABLE IF NOT EXISTS computed_features (
  id SERIAL PRIMARY KEY,
  feature_id INTEGER REFERENCES feature_engineering(id),
  entity_id INTEGER,
  entity_type VARCHAR(50),
  value_numeric DOUBLE PRECISION,
  value_text TEXT,
  computed_at TIMESTAMPTZ NOT NULL,
  is_anomaly BOOLEAN DEFAULT FALSE,
  anomaly_score DOUBLE PRECISION
);

-- Create hypertable for computed features
SELECT create_hypertable('computed_features', 'computed_at');

-- Autonomous vehicle data
CREATE TABLE IF NOT EXISTS autonomous_vehicles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  autonomy_level INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  battery_level INTEGER,
  next_maintenance TIMESTAMPTZ,
  current_route_id INTEGER,
  cargo_capacity VARCHAR(50),
  operational_hours INTEGER,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Time-series sensor data from autonomous vehicles
CREATE TABLE IF NOT EXISTS vehicle_sensor_data (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES autonomous_vehicles(id),
  sensor_type VARCHAR(50) NOT NULL,
  value_numeric DOUBLE PRECISION,
  value_text TEXT,
  recorded_at TIMESTAMPTZ NOT NULL,
  metadata JSONB
);

-- Create hypertable for vehicle sensor data
SELECT create_hypertable('vehicle_sensor_data', 'recorded_at');

-- ML training jobs
CREATE TABLE IF NOT EXISTS ml_training_jobs (
  id SERIAL PRIMARY KEY,
  model_id INTEGER REFERENCES ml_models(id),
  status VARCHAR(50) NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  training_parameters JSONB,
  validation_metrics JSONB,
  logs TEXT
);

-- Continuous learning feedback
CREATE TABLE IF NOT EXISTS ml_feedback (
  id SERIAL PRIMARY KEY,
  model_id INTEGER REFERENCES ml_models(id),
  prediction_id INTEGER REFERENCES ml_predictions(id),
  actual_outcome TEXT,
  feedback_source VARCHAR(50),
  feedback_time TIMESTAMPTZ DEFAULT NOW(),
  incorporated BOOLEAN DEFAULT FALSE
);

-- Create indexes for ML-specific query patterns
CREATE INDEX IF NOT EXISTS idx_route_telemetry_vehicle_id ON route_telemetry (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_computed_features_entity ON computed_features (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_sensor_data_vehicle_id ON vehicle_sensor_data (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_ml_feedback_model_id ON ml_feedback (model_id);

-- Function to update ML model accuracy based on feedback
CREATE OR REPLACE FUNCTION update_model_accuracy()
RETURNS TRIGGER AS $$
DECLARE
  model_id_val INTEGER;
  accuracy_val DOUBLE PRECISION;
BEGIN
  model_id_val := NEW.model_id;
  
  -- Calculate new accuracy value based on feedback
  SELECT AVG(
    CASE 
      WHEN p.prediction_type = 'demand' THEN 
        (1.0 - ABS(EXTRACT(EPOCH FROM (f.feedback_time - p.prediction_time)) / 86400.0))
      ELSE 0.8
    END
  ) INTO accuracy_val
  FROM ml_predictions p
  JOIN ml_feedback f ON p.id = f.prediction_id
  WHERE p.model_id = model_id_val;
  
  -- Update the model accuracy
  UPDATE ml_models 
  SET accuracy = accuracy_val
  WHERE id = model_id_val;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ML feedback
CREATE TRIGGER update_model_accuracy_trigger
AFTER INSERT ON ml_feedback
FOR EACH ROW
EXECUTE FUNCTION update_model_accuracy();