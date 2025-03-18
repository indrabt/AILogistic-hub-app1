/**
 * ML Interface - Node.js interface to Python ML models
 * 
 * This module provides functions to interact with the ML models
 * either directly (using child_process) or via API calls.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import { log } from './vite';

const execAsync = promisify(exec);

// Define prediction request interfaces
interface MLPredictionRequest {
  model: 'flood' | 'route';
  features: Record<string, any>;
}

// Define prediction response interfaces
interface MLPredictionResponse {
  success: boolean;
  prediction?: any;
  error?: string;
}

// Define model info interface
interface MLModelInfo {
  name: string;
  type: string;
  description: string;
  accuracy: number;
  features: string[];
}

// ML API configuration
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5050';
const USE_API = process.env.USE_ML_API === 'true';

/**
 * Get ML model prediction using either API or direct Python execution
 */
export async function getPrediction(request: MLPredictionRequest): Promise<MLPredictionResponse> {
  try {
    log(`Getting prediction for model: ${request.model}`, 'ml');

    // Choose between API and direct Python execution
    return USE_API 
      ? await getPredictionViaAPI(request)
      : await getPredictionViaPython(request);
  } catch (error) {
    log(`Error getting prediction: ${error}`, 'ml');
    return {
      success: false,
      error: `Failed to get prediction: ${error}`
    };
  }
}

/**
 * Get ML model prediction via API
 */
async function getPredictionViaAPI(request: MLPredictionRequest): Promise<MLPredictionResponse> {
  try {
    const endpoint = `${ML_API_URL}/predict/${request.model}`;
    const response = await axios.post(endpoint, request.features);

    if (response.status === 200 && response.data.success) {
      log(`Prediction received from API for ${request.model}`, 'ml');
      return {
        success: true,
        prediction: response.data.prediction
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Unknown API error'
      };
    }
  } catch (error) {
    log(`API prediction error: ${error}`, 'ml');
    return {
      success: false,
      error: `API prediction failed: ${error}`
    };
  }
}

/**
 * Get ML model prediction via direct Python execution
 */
async function getPredictionViaPython(request: MLPredictionRequest): Promise<MLPredictionResponse> {
  try {
    // Convert features to JSON string for command line
    const featuresJson = JSON.stringify(request.features).replace(/"/g, '\\"');
    
    // Construct Python command
    let pythonCommand: string;
    
    if (request.model === 'flood') {
      pythonCommand = `python ml_models/flood_prediction.py predict '${featuresJson}'`;
    } else if (request.model === 'route') {
      pythonCommand = `python ml_models/route_optimization.py predict '${featuresJson}'`;
    } else {
      return {
        success: false,
        error: `Unknown model: ${request.model}`
      };
    }
    
    // Execute Python script
    const { stdout, stderr } = await execAsync(pythonCommand);
    
    if (stderr) {
      log(`Python stderr: ${stderr}`, 'ml');
    }
    
    // Parse output
    const result = JSON.parse(stdout.trim());
    
    if (result.success) {
      log(`Prediction received from Python for ${request.model}`, 'ml');
      return {
        success: true,
        prediction: result.prediction
      };
    } else {
      return {
        success: false,
        error: result.error || 'Unknown Python execution error'
      };
    }
  } catch (error) {
    log(`Python prediction error: ${error}`, 'ml');
    return {
      success: false,
      error: `Python prediction failed: ${error}`
    };
  }
}

/**
 * Get information about available ML models
 */
export async function getModelInfo(modelType?: string): Promise<MLModelInfo[]> {
  try {
    if (USE_API) {
      // Get model info via API
      const endpoint = `${ML_API_URL}/models/info${modelType ? `?type=${modelType}` : ''}`;
      const response = await axios.get(endpoint);
      
      if (response.status === 200) {
        return response.data.models;
      }
      
      return [];
    } else {
      // Hard-coded model info when API is not available
      const models: MLModelInfo[] = [
        {
          name: 'Western Sydney Flood Prediction',
          type: 'flood',
          description: 'Predicts flood risk and impact on logistics operations in Western Sydney areas',
          accuracy: 0.942,
          features: [
            'rainfall_mm_24h',
            'rainfall_mm_72h',
            'river_level_m',
            'soil_moisture',
            'temperature_c',
            'wind_speed_kmh',
            'elevation_m',
            'distance_to_river_km',
            'impervious_surface_pct',
            'drainage_capacity'
          ]
        },
        {
          name: 'Route Optimization',
          type: 'route',
          description: 'Optimizes delivery routes based on traffic, weather, and historical data',
          accuracy: 0.892,
          features: [
            'time_of_day',
            'day_of_week',
            'distance_km',
            'is_holiday',
            'rainfall_mm',
            'temperature',
            'traffic_index',
            'road_type',
            'construction_zones',
            'special_events'
          ]
        }
      ];
      
      // Filter by type if provided
      if (modelType) {
        return models.filter(model => model.type === modelType);
      }
      
      return models;
    }
  } catch (error) {
    log(`Error fetching model info: ${error}`, 'ml');
    return [];
  }
}

/**
 * Trigger ML model training
 */
export async function trainModel(modelType: 'flood' | 'route'): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    if (USE_API) {
      // Train model via API
      const endpoint = `${ML_API_URL}/models/train`;
      const response = await axios.post(endpoint, { model: modelType });
      
      if (response.status === 200) {
        return {
          success: true,
          message: response.data.message
        };
      }
      
      return {
        success: false,
        error: response.data.error || 'Unknown API error'
      };
    } else {
      // Train model via Python execution
      const pythonCommand = `python ml_models/${modelType === 'flood' ? 'flood_prediction.py' : 'route_optimization.py'} train`;
      
      const { stdout, stderr } = await execAsync(pythonCommand);
      
      if (stderr) {
        log(`Python stderr during training: ${stderr}`, 'ml');
      }
      
      const result = JSON.parse(stdout.trim());
      
      if (result.success) {
        return {
          success: true,
          message: result.message
        };
      }
      
      return {
        success: false,
        error: result.error || 'Unknown Python execution error'
      };
    }
  } catch (error) {
    log(`Error training model: ${error}`, 'ml');
    return {
      success: false,
      error: `Training failed: ${error}`
    };
  }
}

/**
 * Get real-time weather and traffic data for Western Sydney
 * This is a mock implementation that would be replaced with actual API calls
 */
export function getRealtimeData() {
  // Mock implementation - in production this would connect to real APIs
  const now = new Date();
  
  // Mock weather data for Western Sydney regions
  const weather = {
    timestamp: now.toISOString(),
    regions: {
      'Parramatta': {
        temperature: 22 + Math.random() * 5,
        rainfall: Math.random() < 0.3 ? Math.random() * 5 : 0,
        wind_speed: 5 + Math.random() * 10,
        humidity: 60 + Math.random() * 20,
        conditions: Math.random() < 0.7 ? 'clear' : 'rain'
      },
      'Penrith': {
        temperature: 23 + Math.random() * 6,
        rainfall: Math.random() < 0.25 ? Math.random() * 8 : 0,
        wind_speed: 8 + Math.random() * 12,
        humidity: 55 + Math.random() * 25,
        conditions: Math.random() < 0.8 ? 'clear' : 'rain'
      },
      'Liverpool': {
        temperature: 22 + Math.random() * 5,
        rainfall: Math.random() < 0.2 ? Math.random() * 6 : 0,
        wind_speed: 6 + Math.random() * 8,
        humidity: 65 + Math.random() * 15,
        conditions: Math.random() < 0.75 ? 'clear' : 'rain'
      },
      'Blacktown': {
        temperature: 21 + Math.random() * 6,
        rainfall: Math.random() < 0.15 ? Math.random() * 7 : 0,
        wind_speed: 4 + Math.random() * 9,
        humidity: 60 + Math.random() * 20,
        conditions: Math.random() < 0.8 ? 'clear' : 'rain'
      },
      'Camden': {
        temperature: 20 + Math.random() * 7,
        rainfall: Math.random() < 0.3 ? Math.random() * 10 : 0,
        wind_speed: 7 + Math.random() * 15,
        humidity: 70 + Math.random() * 15,
        conditions: Math.random() < 0.7 ? 'clear' : 'rain'
      }
    }
  };
  
  // Mock traffic data for Western Sydney routes
  const traffic = {
    timestamp: now.toISOString(),
    regions: {
      'M4 Motorway': {
        congestion: 30 + Math.random() * 50,
        incidents: Math.random() < 0.2 ? 1 : 0,
        speed: 60 + Math.random() * 40,
        volume: 'medium'
      },
      'M7 Motorway': {
        congestion: 40 + Math.random() * 40,
        incidents: Math.random() < 0.15 ? 1 : 0,
        speed: 70 + Math.random() * 30,
        volume: 'high'
      },
      'Great Western Highway': {
        congestion: 50 + Math.random() * 30,
        incidents: Math.random() < 0.25 ? 1 : 0,
        speed: 50 + Math.random() * 30,
        volume: 'high'
      },
      'Parramatta Road': {
        congestion: 60 + Math.random() * 30,
        incidents: Math.random() < 0.3 ? 1 : 0,
        speed: 40 + Math.random() * 20,
        volume: 'very high'
      },
      'Elizabeth Drive': {
        congestion: 30 + Math.random() * 40,
        incidents: Math.random() < 0.2 ? 1 : 0,
        speed: 50 + Math.random() * 30,
        volume: 'medium'
      },
      'M12 Motorway': {
        congestion: 20 + Math.random() * 30,
        incidents: Math.random() < 0.1 ? 1 : 0,
        speed: 80 + Math.random() * 20,
        volume: 'low'
      },
      'The Northern Road': {
        congestion: 40 + Math.random() * 30,
        incidents: Math.random() < 0.2 ? 1 : 0,
        speed: 60 + Math.random() * 20,
        volume: 'medium'
      }
    }
  };
  
  return {
    weather,
    traffic
  };
}