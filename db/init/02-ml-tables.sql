-- Create schema for machine learning data
CREATE SCHEMA IF NOT EXISTS ml_data;

-- Create predictive models table
CREATE TABLE IF NOT EXISTS ml_data.predictive_models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('demand', 'routing', 'inventory', 'weather', 'custom')),
    accuracy NUMERIC(5,2),
    last_trained TIMESTAMPTZ,
    status VARCHAR(50) CHECK (status IN ('active', 'training', 'draft')),
    features TEXT[],
    model_path VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create model predictions table (time-series)
CREATE TABLE IF NOT EXISTS ml_data.model_predictions (
    id SERIAL PRIMARY KEY,
    model_id INTEGER REFERENCES ml_data.predictive_models(id) ON DELETE CASCADE,
    model_name VARCHAR(255),
    prediction_type VARCHAR(50) CHECK (prediction_type IN ('demand', 'routing', 'inventory', 'weather', 'custom')),
    confidence NUMERIC(5,2),
    prediction_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable for time-series analysis
SELECT create_hypertable('ml_data.model_predictions', 'created_at', if_not_exists => TRUE);

-- Create prediction insights table
CREATE TABLE IF NOT EXISTS ml_data.prediction_insights (
    id SERIAL PRIMARY KEY,
    prediction_id INTEGER REFERENCES ml_data.model_predictions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    importance VARCHAR(50) CHECK (importance IN ('critical', 'high', 'medium', 'low')),
    related_entity VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create prediction impacts table
CREATE TABLE IF NOT EXISTS ml_data.prediction_impacts (
    id SERIAL PRIMARY KEY,
    prediction_id INTEGER REFERENCES ml_data.model_predictions(id) ON DELETE CASCADE,
    area VARCHAR(255) NOT NULL,
    metric VARCHAR(255) NOT NULL,
    impact VARCHAR(50) CHECK (impact IN ('positive', 'negative', 'neutral')),
    value NUMERIC(10,2),
    unit VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create anomaly detections table (time-series)
CREATE TABLE IF NOT EXISTS ml_data.anomaly_detections (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    severity VARCHAR(50) CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    category VARCHAR(50) CHECK (category IN ('demand', 'supply', 'logistics', 'weather', 'other')),
    status VARCHAR(50) CHECK (status IN ('new', 'investigating', 'resolved')),
    affected_areas TEXT[],
    resolution TEXT
);

-- Convert to hypertable for time-series analysis
SELECT create_hypertable('ml_data.anomaly_detections', 'detected_at', if_not_exists => TRUE);

-- Create scenario analyses table
CREATE TABLE IF NOT EXISTS ml_data.scenario_analyses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    probability NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scenario variables table
CREATE TABLE IF NOT EXISTS ml_data.scenario_variables (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER REFERENCES ml_data.scenario_analyses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    value VARCHAR(255),
    type VARCHAR(50) CHECK (type IN ('demand', 'supply', 'logistics', 'weather', 'cost', 'other'))
);

-- Create scenario outcomes table
CREATE TABLE IF NOT EXISTS ml_data.scenario_outcomes (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER REFERENCES ml_data.scenario_analyses(id) ON DELETE CASCADE,
    metric VARCHAR(255) NOT NULL,
    value NUMERIC(10,2),
    change NUMERIC(10,2),
    impact VARCHAR(50) CHECK (impact IN ('positive', 'negative', 'neutral'))
);

-- Create resilience forecasts table
CREATE TABLE IF NOT EXISTS ml_data.resilience_forecasts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    forecast_type VARCHAR(50) CHECK (forecast_type IN ('demand', 'disaster', 'delay')),
    probability NUMERIC(5,2),
    impact VARCHAR(50) CHECK (impact IN ('low', 'medium', 'high', 'critical')),
    time_window VARCHAR(255),
    affected_regions TEXT[],
    suggested_actions TEXT[],
    accuracy NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory recommendations table
CREATE TABLE IF NOT EXISTS ml_data.inventory_recommendations (
    id SERIAL PRIMARY KEY,
    forecast_id INTEGER REFERENCES ml_data.resilience_forecasts(id) ON DELETE CASCADE,
    product VARCHAR(255) NOT NULL,
    current_level INTEGER NOT NULL,
    recommended_level INTEGER NOT NULL,
    priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high')),
    location VARCHAR(255) NOT NULL,
    rationale TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create historical data table for training (time-series)
CREATE TABLE IF NOT EXISTS ml_data.training_data (
    id SERIAL PRIMARY KEY,
    data_type VARCHAR(50) NOT NULL,
    time_point TIMESTAMPTZ NOT NULL,
    features JSONB NOT NULL,
    labels JSONB,
    source VARCHAR(255),
    batch_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable for time-series analysis
SELECT create_hypertable('ml_data.training_data', 'time_point', if_not_exists => TRUE);

-- Create model performance metrics table (time-series)
CREATE TABLE IF NOT EXISTS ml_data.model_performance (
    id SERIAL PRIMARY KEY,
    model_id INTEGER REFERENCES ml_data.predictive_models(id) ON DELETE CASCADE,
    metric_name VARCHAR(255) NOT NULL,
    metric_value NUMERIC(10,4) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable for time-series analysis
SELECT create_hypertable('ml_data.model_performance', 'timestamp', if_not_exists => TRUE);

-- Create continuous aggregate for model performance trends
CREATE MATERIALIZED VIEW IF NOT EXISTS ml_data.model_performance_trends
WITH (timescaledb.continuous) AS
SELECT 
    model_id,
    time_bucket('1 day', timestamp) AS day,
    AVG(metric_value) AS avg_value,
    MIN(metric_value) AS min_value,
    MAX(metric_value) AS max_value
FROM ml_data.model_performance
GROUP BY model_id, day;

-- Create feature importance table
CREATE TABLE IF NOT EXISTS ml_data.feature_importance (
    id SERIAL PRIMARY KEY,
    model_id INTEGER REFERENCES ml_data.predictive_models(id) ON DELETE CASCADE,
    feature_name VARCHAR(255) NOT NULL,
    importance_value NUMERIC(10,4) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create weather impact analysis table (time-series)
CREATE TABLE IF NOT EXISTS ml_data.weather_impacts (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) CHECK (event_type IN ('storm', 'fog', 'snow', 'rain', 'extreme-heat', 'flood')),
    region VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    impact_score NUMERIC(5,2),
    affected_routes INTEGER,
    delay_minutes INTEGER,
    alternate_routes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable for time-series analysis
SELECT create_hypertable('ml_data.weather_impacts', 'start_time', if_not_exists => TRUE);

-- Create digital twins table
CREATE TABLE IF NOT EXISTS ml_data.digital_twins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client_id INTEGER,
    status VARCHAR(50) CHECK (status IN ('initializing', 'active', 'simulating', 'archived')),
    accuracy NUMERIC(5,2),
    components JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create digital twin scenarios table
CREATE TABLE IF NOT EXISTS ml_data.digital_twin_scenarios (
    id SERIAL PRIMARY KEY,
    twin_id INTEGER REFERENCES ml_data.digital_twins(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parameters JSONB,
    status VARCHAR(50) CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create digital twin results table
CREATE TABLE IF NOT EXISTS ml_data.digital_twin_results (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER REFERENCES ml_data.digital_twin_scenarios(id) ON DELETE CASCADE,
    metric VARCHAR(255) NOT NULL,
    baseline NUMERIC(10,2),
    projected NUMERIC(10,2),
    change VARCHAR(50),
    confidence NUMERIC(5,2),
    recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function to update timestamp on ML tables
CREATE TRIGGER update_predictive_models_timestamp
BEFORE UPDATE ON ml_data.predictive_models
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_scenario_analyses_timestamp
BEFORE UPDATE ON ml_data.scenario_analyses
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_resilience_forecasts_timestamp
BEFORE UPDATE ON ml_data.resilience_forecasts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_digital_twins_timestamp
BEFORE UPDATE ON ml_data.digital_twins
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Create indexes for ML data tables
CREATE INDEX IF NOT EXISTS idx_predictive_models_type ON ml_data.predictive_models(type);
CREATE INDEX IF NOT EXISTS idx_predictive_models_status ON ml_data.predictive_models(status);
CREATE INDEX IF NOT EXISTS idx_model_predictions_model_id ON ml_data.model_predictions(model_id);
CREATE INDEX IF NOT EXISTS idx_model_predictions_type ON ml_data.model_predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_anomaly_detections_status ON ml_data.anomaly_detections(status);
CREATE INDEX IF NOT EXISTS idx_anomaly_detections_category ON ml_data.anomaly_detections(category);
CREATE INDEX IF NOT EXISTS idx_resilience_forecasts_type ON ml_data.resilience_forecasts(forecast_type);
CREATE INDEX IF NOT EXISTS idx_resilience_forecasts_impact ON ml_data.resilience_forecasts(impact);
CREATE INDEX IF NOT EXISTS idx_training_data_type ON ml_data.training_data(data_type);
CREATE INDEX IF NOT EXISTS idx_weather_impacts_region ON ml_data.weather_impacts(region);
CREATE INDEX IF NOT EXISTS idx_weather_impacts_event_type ON ml_data.weather_impacts(event_type);
CREATE INDEX IF NOT EXISTS idx_digital_twins_status ON ml_data.digital_twins(status);

-- Insert some sample ML models for Western Sydney logistics
INSERT INTO ml_data.predictive_models (name, description, type, accuracy, last_trained, status, features)
VALUES 
    ('Western Sydney Flood Prediction', 'Predicts flood risks in Western Sydney areas and potential impacts on logistics operations', 'weather', 94.2, NOW() - INTERVAL '3 days', 'active', ARRAY['rainfall_mm', 'river_levels', 'historical_patterns', 'terrain_data', 'infrastructure_vulnerability']),
    ('Parramatta Route Optimization', 'Optimizes delivery routes in the Parramatta area based on traffic patterns', 'routing', 89.2, NOW() - INTERVAL '5 days', 'active', ARRAY['traffic_patterns', 'time_of_day', 'historical_delivery_times', 'construction_zones', 'special_events']),
    ('Penrith Warehouse Inventory Prediction', 'Predicts inventory needs for Penrith warehouse based on seasonal demand', 'inventory', 91.5, NOW() - INTERVAL '7 days', 'active', ARRAY['historical_orders', 'seasonal_patterns', 'local_events', 'supplier_lead_times', 'stock_thresholds'])
ON CONFLICT DO NOTHING;