"""
AI Logistics Hub - ML API
-------------------------
REST API for interacting with machine learning models.
"""

import os
import sys
import json
import logging
from datetime import datetime
import subprocess
from flask import Flask, request, jsonify
from flood_prediction import FloodPredictionModel
from route_optimization import RouteOptimizationModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/logs/ml_api.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger('ml_api')

app = Flask(__name__)

# Initialize models
flood_model = None
route_model = None

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models': {
            'flood_prediction': flood_model is not None,
            'route_optimization': route_model is not None
        }
    })

@app.route('/predict/flood', methods=['POST'])
def predict_flood():
    """Predict flood risk and impact on logistics"""
    try:
        # Initialize model if needed
        global flood_model
        if flood_model is None:
            flood_model = FloodPredictionModel()
            flood_model.load_model()
        
        # Get features from request
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Validate required fields
        required_fields = ['rainfall_mm_24h', 'rainfall_mm_72h', 'river_level_m']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
            
        # Make prediction
        prediction = flood_model.predict(data)
        
        return jsonify({
            'prediction': prediction,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in flood prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict/route', methods=['POST'])
def predict_route():
    """Predict travel time for a route"""
    try:
        # Initialize model if needed
        global route_model
        if route_model is None:
            route_model = RouteOptimizationModel()
            route_model.load_model()
        
        # Get features from request
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Validate required fields
        required_fields = ['time_of_day', 'day_of_week', 'distance_km']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
            
        # Make prediction
        prediction = route_model.predict(data)
        
        return jsonify({
            'prediction': prediction,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in route prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/models/train', methods=['POST'])
def train_model():
    """Train or retrain a model"""
    try:
        data = request.json
        if not data or 'model_type' not in data:
            return jsonify({'error': 'Model type not specified'}), 400
            
        model_type = data['model_type']
        
        if model_type == 'flood':
            # Initialize model if needed
            global flood_model
            if flood_model is None:
                flood_model = FloodPredictionModel()
                
            # Train model
            result = flood_model.train()
            return jsonify({
                'status': 'success',
                'model': 'flood_prediction',
                'training_results': result,
                'timestamp': datetime.now().isoformat()
            })
            
        elif model_type == 'route':
            # Initialize model if needed
            global route_model
            if route_model is None:
                route_model = RouteOptimizationModel()
                
            # Train model
            result = route_model.train()
            return jsonify({
                'status': 'success',
                'model': 'route_optimization',
                'training_results': result,
                'timestamp': datetime.now().isoformat()
            })
            
        else:
            return jsonify({'error': f'Unknown model type: {model_type}'}), 400
            
    except Exception as e:
        logger.error(f"Error training model: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/models/info', methods=['GET'])
def model_info():
    """Get information about available models"""
    try:
        # Get model type parameter
        model_type = request.args.get('type')
        
        info = {
            'available_models': [
                {
                    'name': 'Western Sydney Flood Prediction',
                    'type': 'weather',
                    'description': 'Predicts flood risks in Western Sydney areas',
                    'accuracy': 94.2,
                    'features': [
                        'rainfall_mm_24h', 'rainfall_mm_72h', 'river_level_m',
                        'soil_moisture', 'temperature_c', 'wind_speed_kmh',
                        'elevation_m', 'distance_to_river_km', 'impervious_surface_pct',
                        'drainage_capacity'
                    ]
                },
                {
                    'name': 'Parramatta Route Optimization',
                    'type': 'routing',
                    'description': 'Optimizes delivery routes in the Parramatta area',
                    'accuracy': 89.2,
                    'features': [
                        'time_of_day', 'day_of_week', 'is_holiday', 'rainfall_mm',
                        'temperature', 'traffic_index', 'road_type', 'distance_km', 
                        'construction_zones', 'special_events'
                    ]
                }
            ],
            'timestamp': datetime.now().isoformat()
        }
        
        # Filter by model type if specified
        if model_type:
            info['available_models'] = [
                model for model in info['available_models'] 
                if model['type'] == model_type
            ]
            
        return jsonify(info)
        
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/schedule', methods=['POST'])
def schedule_training():
    """Schedule model training using cron jobs"""
    try:
        data = request.json
        if not data or 'model_type' not in data or 'schedule' not in data:
            return jsonify({'error': 'Model type or schedule not specified'}), 400
            
        model_type = data['model_type']
        schedule = data['schedule']
        
        # Validate cron expression
        if not _is_valid_cron(schedule):
            return jsonify({'error': 'Invalid cron expression'}), 400
            
        # Example: Could add to system crontab, but in Docker we would use a different approach
        # For demonstration, we'll just return the command that would be scheduled
        
        command = f"curl -X POST -H 'Content-Type: application/json' -d '{{\
            \"model_type\": \"{model_type}\"\
        }}' http://localhost:5050/models/train"
        
        return jsonify({
            'status': 'success',
            'message': 'Training scheduled (example)',
            'model_type': model_type,
            'schedule': schedule,
            'command': command,
            'note': 'In production, this would add the job to a task scheduler',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error scheduling training: {e}")
        return jsonify({'error': str(e)}), 500

def _is_valid_cron(expression):
    """Validate a cron expression (simplified)"""
    parts = expression.split()
    return len(parts) == 5

if __name__ == '__main__':
    # Initialize models at startup
    try:
        logger.info("Initializing ML models...")
        flood_model = FloodPredictionModel()
        flood_model.load_model()
        
        route_model = RouteOptimizationModel()
        route_model.load_model()
        
        logger.info("ML models initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing models: {e}")
        logger.info("Will initialize models on first request")
    
    # Get port from environment or use default
    port = int(os.environ.get('ML_API_PORT', 5050))
    
    # Start the Flask app
    logger.info(f"Starting ML API on port {port}")
    app.run(host='0.0.0.0', port=port)