#!/usr/bin/env python3
"""
Start the ML API Server
----------------------
This script starts the Flask API server for the ML models.
"""

import os
import sys
import logging
from api import app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/logs/ml_api.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger('ml_api_server')

if __name__ == '__main__':
    # Get port from environment or use default
    port = int(os.environ.get('ML_API_PORT', 5050))
    
    # Log startup
    logger.info(f"Starting ML API server on port {port}")
    logger.info("Available endpoints:")
    logger.info("  GET  /health                - Health check")
    logger.info("  GET  /models/info           - Get model information")
    logger.info("  POST /predict/flood         - Make flood prediction")
    logger.info("  POST /predict/route         - Make route optimization prediction")
    logger.info("  POST /models/train          - Train or retrain a model")
    logger.info("  POST /schedule              - Schedule model training")
    
    # Start the server
    app.run(host='0.0.0.0', port=port, debug=False)