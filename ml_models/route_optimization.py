"""
Route Optimization ML Model for Western Sydney Logistics
-------------------------------------------------------
This model uses historical traffic and delivery data to optimize 
delivery routes in the Western Sydney area.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import psycopg2
from psycopg2.extras import execute_values
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/logs/route_optimization.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('route_optimization')

class RouteOptimizationModel:
    """Route optimization model using RandomForest algorithm"""
    
    def __init__(self):
        """Initialize the model"""
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'time_of_day', 'day_of_week', 'is_holiday', 'rainfall_mm',
            'temperature', 'traffic_index', 'road_type', 'distance_km', 
            'construction_zones', 'special_events'
        ]
        self.model_path = '/app/ml_models/route_optimization_model.joblib'
        self.conn = None
        self.connect_db()
        
    def connect_db(self):
        """Connect to the PostgreSQL database"""
        try:
            db_url = os.environ.get('DATABASE_URL')
            if not db_url:
                logger.warning("DATABASE_URL not found, using default connection parameters")
                db_url = "postgresql://ailogistics:passwordToChange@timescaledb:5432/ai_logistics_hub"
                
            self.conn = psycopg2.connect(db_url)
            logger.info("Connected to database successfully")
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            raise
    
    def load_training_data(self):
        """Load training data from the database"""
        try:
            if not self.conn or self.conn.closed:
                self.connect_db()
                
            query = """
                SELECT * FROM ml_data.training_data 
                WHERE data_type = 'route_optimization'
                ORDER BY time_point DESC
                LIMIT 10000
            """
            
            logger.info("Fetching training data from database")
            df = pd.read_sql(query, self.conn)
            
            if df.empty:
                logger.warning("No training data found. Using synthetic data for demonstration")
                # Generate synthetic data for demonstration
                return self._generate_synthetic_data()
            
            # Extract features and labels from JSONB
            X = pd.json_normalize([json.loads(f) if isinstance(f, str) else f 
                                for f in df['features']])
            y = pd.json_normalize([json.loads(f) if isinstance(f, str) else f 
                               for f in df['labels']])['travel_time_minutes']
            
            return X, y
            
        except Exception as e:
            logger.error(f"Error loading training data: {e}")
            # Fall back to synthetic data for demonstration
            return self._generate_synthetic_data()
    
    def _generate_synthetic_data(self):
        """Generate synthetic data for demonstration purposes"""
        logger.info("Generating synthetic training data")
        np.random.seed(42)
        n_samples = 1000
        
        X = pd.DataFrame({
            'time_of_day': np.random.randint(0, 24, n_samples),
            'day_of_week': np.random.randint(0, 7, n_samples),
            'is_holiday': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
            'rainfall_mm': np.random.exponential(scale=2, size=n_samples),
            'temperature': np.random.normal(22, 5, n_samples),
            'traffic_index': np.random.normal(50, 20, n_samples),
            'road_type': np.random.randint(1, 4, n_samples),
            'distance_km': np.random.uniform(1, 30, n_samples),
            'construction_zones': np.random.poisson(lam=0.5, size=n_samples),
            'special_events': np.random.choice([0, 1], n_samples, p=[0.95, 0.05])
        })
        
        # Influence of features on travel time (simplified model)
        y = (
            X['distance_km'] * 2 +                       # Base time (2 min per km)
            X['traffic_index'] / 10 +                    # Traffic impact
            X['rainfall_mm'] * 0.5 +                     # Weather impact
            X['construction_zones'] * 5 +                # Construction zones
            X['special_events'] * 15 +                   # Special events
            np.where(X['is_holiday'] == 1, 10, 0) +      # Holiday impact
            np.where(X['time_of_day'].between(7, 9), 15, 
                    np.where(X['time_of_day'].between(16, 18), 20, 0)) +  # Peak hours
            np.random.normal(0, 5, n_samples)            # Random noise
        )
        
        return X, y
    
    def train(self):
        """Train the route optimization model"""
        try:
            X, y = self.load_training_data()
            
            # Split the data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Standardize features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train the model
            logger.info("Training RandomForest model")
            self.model = RandomForestRegressor(
                n_estimators=100, 
                max_depth=15,
                random_state=42,
                n_jobs=-1
            )
            self.model.fit(X_train_scaled, y_train)
            
            # Evaluate the model
            train_score = self.model.score(X_train_scaled, y_train)
            test_score = self.model.score(X_test_scaled, y_test)
            logger.info(f"Model trained. Train R²: {train_score:.4f}, Test R²: {test_score:.4f}")
            
            # Save feature importances
            if self.conn and not self.conn.closed:
                self._save_feature_importance()
            
            # Save the model
            self.save_model()
            
            return {
                'train_score': train_score,
                'test_score': test_score,
                'model_path': self.model_path
            }
            
        except Exception as e:
            logger.error(f"Error training model: {e}")
            raise
    
    def _save_feature_importance(self):
        """Save feature importance values to database"""
        try:
            if not self.model:
                logger.warning("No model available to extract feature importances")
                return
                
            # Get model ID from database
            cursor = self.conn.cursor()
            cursor.execute(
                "SELECT id FROM ml_data.predictive_models WHERE name = 'Parramatta Route Optimization' LIMIT 1"
            )
            result = cursor.fetchone()
            
            if not result:
                logger.warning("Model 'Parramatta Route Optimization' not found in database")
                return
                
            model_id = result[0]
            
            # Prepare feature importance data
            importances = self.model.feature_importances_
            feature_importance_data = []
            
            for feature_name, importance in zip(self.feature_names, importances):
                feature_importance_data.append((
                    model_id,
                    feature_name,
                    float(importance)
                ))
            
            # Insert into database
            insert_query = """
                INSERT INTO ml_data.feature_importance 
                (model_id, feature_name, importance_value)
                VALUES %s
                ON CONFLICT DO NOTHING
            """
            
            execute_values(cursor, insert_query, feature_importance_data)
            self.conn.commit()
            logger.info(f"Saved feature importances for {len(feature_importance_data)} features")
            
        except Exception as e:
            logger.error(f"Error saving feature importances: {e}")
            self.conn.rollback()
    
    def predict(self, features):
        """Make predictions for route optimization"""
        try:
            if not self.model:
                self.load_model()
                
            # Ensure features are in correct format
            df = pd.DataFrame([features])
            
            # Check if all required features are present
            missing_features = set(self.feature_names) - set(df.columns)
            if missing_features:
                logger.warning(f"Missing features: {missing_features}. Using defaults.")
                for feature in missing_features:
                    df[feature] = 0
                    
            # Ensure correct order of features
            df = df[self.feature_names]
            
            # Scale features
            df_scaled = self.scaler.transform(df)
            
            # Make prediction
            travel_time = float(self.model.predict(df_scaled)[0])
            
            # Save prediction to database if connected
            if self.conn and not self.conn.closed:
                self._save_prediction(features, travel_time)
            
            return {
                'travel_time_minutes': travel_time,
                'features_used': self.feature_names
            }
            
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            raise
    
    def _save_prediction(self, features, prediction):
        """Save prediction to database"""
        try:
            # Get model ID
            cursor = self.conn.cursor()
            cursor.execute(
                "SELECT id FROM ml_data.predictive_models WHERE name = 'Parramatta Route Optimization' LIMIT 1"
            )
            result = cursor.fetchone()
            
            if not result:
                logger.warning("Model 'Parramatta Route Optimization' not found in database")
                return
                
            model_id = result[0]
            
            # Prepare prediction data
            prediction_data = {
                'input_features': features,
                'travel_time_minutes': prediction
            }
            
            # Insert prediction
            cursor.execute(
                """
                INSERT INTO ml_data.model_predictions 
                (model_id, model_name, prediction_type, confidence, prediction_data)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    model_id, 
                    'Parramatta Route Optimization', 
                    'routing', 
                    0.89, 
                    json.dumps(prediction_data)
                )
            )
            
            self.conn.commit()
            logger.info("Saved prediction to database")
            
        except Exception as e:
            logger.error(f"Error saving prediction: {e}")
            self.conn.rollback()
    
    def save_model(self):
        """Save the model to disk"""
        try:
            if not self.model:
                logger.warning("No model to save")
                return False
                
            model_data = {
                'model': self.model,
                'scaler': self.scaler,
                'feature_names': self.feature_names
            }
            
            joblib.dump(model_data, self.model_path)
            logger.info(f"Model saved to {self.model_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving model: {e}")
            return False
    
    def load_model(self):
        """Load the model from disk"""
        try:
            if not os.path.exists(self.model_path):
                logger.warning(f"Model file not found at {self.model_path}. Training new model.")
                self.train()
                return
                
            model_data = joblib.load(self.model_path)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            logger.info(f"Model loaded from {self.model_path}")
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            logger.info("Training new model instead")
            self.train()


if __name__ == "__main__":
    # Example usage
    logger.info("Initializing Route Optimization Model")
    model = RouteOptimizationModel()
    
    # Train or load model
    if not os.path.exists(model.model_path):
        logger.info("Training new model")
        result = model.train()
        logger.info(f"Training completed: {result}")
    else:
        logger.info("Loading existing model")
        model.load_model()
    
    # Make a sample prediction
    sample_features = {
        'time_of_day': 8,  # Morning rush hour
        'day_of_week': 1,  # Monday
        'is_holiday': 0,   # Not a holiday
        'rainfall_mm': 0.5, # Light rain
        'temperature': 22, # 22°C
        'traffic_index': 65, # Moderate traffic
        'road_type': 2,    # Secondary road
        'distance_km': 15, # 15 km route
        'construction_zones': 1, # One construction zone
        'special_events': 0 # No special events
    }
    
    prediction = model.predict(sample_features)
    logger.info(f"Sample prediction: {prediction}")
    
    logger.info("Route Optimization Model initialized and ready for use")