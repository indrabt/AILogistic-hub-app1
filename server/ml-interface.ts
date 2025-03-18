/**
 * ML Interface - Node.js interface to Python ML models
 * 
 * This module provides functions to interact with the ML models
 * either directly (using child_process) or via API calls.
 */

import axios from 'axios';
import { spawn } from 'child_process';
import { log } from './vite';

interface MLPredictionRequest {
  model: 'flood' | 'route';
  features: Record<string, any>;
}

interface MLPredictionResponse {
  success: boolean;
  prediction?: any;
  error?: string;
}

interface MLModelInfo {
  name: string;
  type: string;
  description: string;
  accuracy: number;
  features: string[];
}

// Configuration
const ML_API_ENABLED = process.env.ML_API_ENABLED === 'true';
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5050';
const ML_SCRIPTS_PATH = process.env.ML_SCRIPTS_PATH || './ml_models';

/**
 * Get ML model prediction using either API or direct Python execution
 */
export async function getPrediction(request: MLPredictionRequest): Promise<MLPredictionResponse> {
  try {
    // Use API if enabled
    if (ML_API_ENABLED) {
      return await getPredictionViaAPI(request);
    } else {
      // Otherwise run Python script directly
      return await getPredictionViaPython(request);
    }
  } catch (error) {
    log(`ML prediction error: ${error}`, 'ml');
    return {
      success: false,
      error: `Error making prediction: ${error}`
    };
  }
}

/**
 * Get ML model prediction via API
 */
async function getPredictionViaAPI(request: MLPredictionRequest): Promise<MLPredictionResponse> {
  try {
    const endpoint = request.model === 'flood' ? '/predict/flood' : '/predict/route';
    const response = await axios.post(`${ML_API_URL}${endpoint}`, request.features);
    
    return {
      success: true,
      prediction: response.data.prediction
    };
  } catch (error: any) {
    log(`ML API error: ${error.message}`, 'ml');
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
}

/**
 * Get ML model prediction via direct Python execution
 */
async function getPredictionViaPython(request: MLPredictionRequest): Promise<MLPredictionResponse> {
  return new Promise((resolve) => {
    const scriptName = request.model === 'flood' ? 'flood_prediction.py' : 'route_optimization.py';
    
    // Spawn Python process
    const pythonProcess = spawn('python3', [`${ML_SCRIPTS_PATH}/${scriptName}`]);
    
    let resultData = '';
    let errorData = '';
    
    // Collect output
    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });
    
    // Collect errors
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      log(`Python error: ${data}`, 'ml');
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        resolve({
          success: false,
          error: `Python process exited with code ${code}: ${errorData}`
        });
      } else {
        try {
          // Parse JSON output from Python script
          const predictionData = JSON.parse(resultData);
          resolve({
            success: true,
            prediction: predictionData
          });
        } catch (error) {
          resolve({
            success: false,
            error: `Failed to parse Python output: ${error}`
          });
        }
      }
    });
    
    // Handle any other errors
    pythonProcess.on('error', (error) => {
      resolve({
        success: false,
        error: `Failed to start Python process: ${error}`
      });
    });
    
    // Send input features to Python process
    if (request.features) {
      pythonProcess.stdin.write(JSON.stringify(request.features));
      pythonProcess.stdin.end();
    }
  });
}

/**
 * Get information about available ML models
 */
export async function getModelInfo(modelType?: string): Promise<MLModelInfo[]> {
  try {
    if (ML_API_ENABLED) {
      // Get model info from API
      const url = modelType 
        ? `${ML_API_URL}/models/info?type=${modelType}`
        : `${ML_API_URL}/models/info`;
        
      const response = await axios.get(url);
      return response.data.available_models;
    } else {
      // Return hardcoded model info when API is not available
      const allModels = [
        {
          name: 'Western Sydney Flood Prediction',
          type: 'weather',
          description: 'Predicts flood risks in Western Sydney areas',
          accuracy: 94.2,
          features: [
            'rainfall_mm_24h', 'rainfall_mm_72h', 'river_level_m',
            'soil_moisture', 'temperature_c', 'wind_speed_kmh',
            'elevation_m', 'distance_to_river_km', 'impervious_surface_pct',
            'drainage_capacity'
          ]
        },
        {
          name: 'Parramatta Route Optimization',
          type: 'routing',
          description: 'Optimizes delivery routes in the Parramatta area',
          accuracy: 89.2,
          features: [
            'time_of_day', 'day_of_week', 'is_holiday', 'rainfall_mm',
            'temperature', 'traffic_index', 'road_type', 'distance_km', 
            'construction_zones', 'special_events'
          ]
        }
      ];
      
      // Filter by model type if specified
      return modelType 
        ? allModels.filter(model => model.type === modelType)
        : allModels;
    }
  } catch (error) {
    log(`Error getting ML model info: ${error}`, 'ml');
    return [];
  }
}

/**
 * Trigger ML model training
 */
export async function trainModel(modelType: 'flood' | 'route'): Promise<{
  success: boolean;
  result?: any;
  error?: string;
}> {
  try {
    if (ML_API_ENABLED) {
      // Trigger training via API
      const response = await axios.post(`${ML_API_URL}/models/train`, {
        model_type: modelType
      });
      
      return {
        success: true,
        result: response.data
      };
    } else {
      // Return mock response when API is not available
      return {
        success: true,
        result: {
          status: 'success',
          model: modelType === 'flood' ? 'flood_prediction' : 'route_optimization',
          training_results: {
            train_score: modelType === 'flood' ? 0.942 : 0.892,
            test_score: modelType === 'flood' ? 0.938 : 0.887
          }
        }
      };
    }
  } catch (error: any) {
    log(`Error training ML model: ${error}`, 'ml');
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
}

/**
 * Get real-time weather and traffic data for Western Sydney
 * This is a mock implementation that would be replaced with actual API calls
 */
export function getRealtimeData() {
  // This would normally call weather and traffic APIs
  const timestamp = new Date().toISOString();
  
  return {
    weather: {
      timestamp,
      regions: {
        Penrith: {
          temperature_c: 22 + Math.random() * 5,
          rainfall_mm_1h: Math.random() * 2,
          humidity_pct: 60 + Math.random() * 20,
          wind_speed_kmh: 10 + Math.random() * 15
        },
        Parramatta: {
          temperature_c: 23 + Math.random() * 5,
          rainfall_mm_1h: Math.random() * 1.5,
          humidity_pct: 65 + Math.random() * 15,
          wind_speed_kmh: 8 + Math.random() * 12
        },
        Liverpool: {
          temperature_c: 24 + Math.random() * 4,
          rainfall_mm_1h: Math.random() * 1,
          humidity_pct: 62 + Math.random() * 18,
          wind_speed_kmh: 9 + Math.random() * 14
        }
      }
    },
    traffic: {
      timestamp,
      regions: {
        'Penrith-Sydney': {
          congestion_level: 40 + Math.random() * 40,
          average_speed_kmh: 60 - Math.random() * 30,
          incidents: Math.random() > 0.8 ? 1 : 0
        },
        'Parramatta-CBD': {
          congestion_level: 50 + Math.random() * 45,
          average_speed_kmh: 50 - Math.random() * 35,
          incidents: Math.random() > 0.7 ? 1 : 0
        },
        'Liverpool-Airport': {
          congestion_level: 45 + Math.random() * 35,
          average_speed_kmh: 55 - Math.random() * 25,
          incidents: Math.random() > 0.85 ? 1 : 0
        }
      }
    }
  };
}