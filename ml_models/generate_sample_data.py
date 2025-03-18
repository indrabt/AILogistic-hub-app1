#!/usr/bin/env python3
"""
Generate Sample Data from ML Models
----------------------------------
This script generates sample data from the ML models for demonstration purposes.
It can be run directly or imported as a module.
"""

import os
import sys
import json
import random
import logging
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import argparse

# Add the current directory to the path so we can import the ML models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the ML models
from flood_prediction import FloodPredictionModel
from route_optimization import RouteOptimizationModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ml_models/sample_data_generation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('generate_sample_data')

# Western Sydney regions
WESTERN_SYDNEY_REGIONS = [
    'Penrith', 'Blacktown', 'Parramatta', 'Liverpool', 
    'Fairfield', 'Campbelltown', 'Camden', 'Windsor', 
    'Richmond', 'St Marys', 'Mount Druitt', 'Rouse Hill'
]

# Time periods
TIME_PERIODS = [
    'Morning Peak (7-9 AM)',
    'Midday (11 AM-1 PM)',
    'Afternoon Peak (4-6 PM)',
    'Evening (7-9 PM)',
    'Late Night (10 PM-12 AM)',
    'Early Morning (5-7 AM)'
]

def generate_flood_prediction_samples(count=10, output_file=None):
    """Generate sample data from the flood prediction model"""
    logger.info(f"Generating {count} flood prediction samples")
    
    try:
        # Initialize the model
        model = FloodPredictionModel()
        model.load_model()
        
        samples = []
        
        # Generate samples with varying risk levels
        for i in range(count):
            # Determine if this should be a high, medium, or low risk sample
            risk_type = random.choices(
                ['high', 'medium', 'low'],
                weights=[0.2, 0.3, 0.5],
                k=1
            )[0]
            
            # Base values for different risk types
            if risk_type == 'high':
                rainfall_24h = random.uniform(50, 100)
                rainfall_72h = random.uniform(120, 200)
                river_level = random.uniform(2.8, 4.0)
                soil_moisture = random.uniform(0.75, 0.95)
                elevation = random.uniform(2, 15)
                distance_to_river = random.uniform(0.1, 1.0)
                impervious_surface = random.uniform(70, 90)
                drainage_capacity = random.uniform(0.2, 0.4)
            elif risk_type == 'medium':
                rainfall_24h = random.uniform(20, 50)
                rainfall_72h = random.uniform(50, 120)
                river_level = random.uniform(1.8, 2.8)
                soil_moisture = random.uniform(0.5, 0.75)
                elevation = random.uniform(15, 30)
                distance_to_river = random.uniform(1.0, 2.5)
                impervious_surface = random.uniform(40, 70)
                drainage_capacity = random.uniform(0.4, 0.7)
            else:  # low
                rainfall_24h = random.uniform(0, 20)
                rainfall_72h = random.uniform(0, 50)
                river_level = random.uniform(0.5, 1.8)
                soil_moisture = random.uniform(0.2, 0.5)
                elevation = random.uniform(30, 60)
                distance_to_river = random.uniform(2.5, 5.0)
                impervious_surface = random.uniform(10, 40)
                drainage_capacity = random.uniform(0.7, 1.0)
            
            # Create the sample
            sample = {
                'rainfall_mm_24h': rainfall_24h,
                'rainfall_mm_72h': rainfall_72h,
                'river_level_m': river_level,
                'soil_moisture': soil_moisture,
                'temperature_c': random.uniform(15, 28),
                'wind_speed_kmh': random.uniform(5, 40),
                'elevation_m': elevation,
                'distance_to_river_km': distance_to_river,
                'impervious_surface_pct': impervious_surface,
                'drainage_capacity': drainage_capacity,
                'region': random.choice(WESTERN_SYDNEY_REGIONS)
            }
            
            # Get prediction
            prediction = model.predict(sample)
            
            # Combine sample and prediction
            result = {
                'input': sample,
                'prediction': prediction
            }
            
            samples.append(result)
        
        # Sort by flood probability (highest first)
        samples.sort(key=lambda x: x['prediction']['flood_probability'], reverse=True)
        
        # Write to file if specified
        if output_file:
            with open(output_file, 'w') as f:
                json.dump(samples, f, indent=2)
            logger.info(f"Wrote {len(samples)} flood prediction samples to {output_file}")
        
        return samples
    
    except Exception as e:
        logger.error(f"Error generating flood prediction samples: {e}")
        return []

def generate_route_optimization_samples(count=10, output_file=None):
    """Generate sample data from the route optimization model"""
    logger.info(f"Generating {count} route optimization samples")
    
    try:
        # Initialize the model
        model = RouteOptimizationModel()
        model.load_model()
        
        samples = []
        
        # Generate samples for different regions, times, and conditions
        for i in range(count):
            # Pick a region
            region = random.choice(WESTERN_SYDNEY_REGIONS)
            
            # Pick a time period
            time_period = random.choice(TIME_PERIODS)
            
            # Determine time of day (0-23)
            if "Morning Peak" in time_period:
                time_of_day = random.randint(7, 9)
            elif "Midday" in time_period:
                time_of_day = random.randint(11, 13)
            elif "Afternoon Peak" in time_period:
                time_of_day = random.randint(16, 18)
            elif "Evening" in time_period:
                time_of_day = random.randint(19, 21)
            elif "Late Night" in time_period:
                time_of_day = random.randint(22, 23)
            else:
                time_of_day = random.randint(5, 7)
            
            # Day of week (0=Monday, 6=Sunday)
            day_of_week = random.randint(0, 6)
            
            # Is it a holiday?
            is_holiday = 1 if random.random() < 0.1 else 0
            
            # Weather conditions
            rainfall = random.uniform(0, 15)
            temperature = random.uniform(15, 30)
            
            # Traffic conditions (0-100, higher is worse)
            # Higher during peak hours and bad weather
            base_traffic = 30
            if "Peak" in time_period:
                base_traffic += 30
            if rainfall > 5:
                base_traffic += 15 
            if is_holiday:
                base_traffic -= 20
            if day_of_week >= 5:  # Weekend
                base_traffic -= 15
                
            traffic_index = max(0, min(100, base_traffic + random.uniform(-10, 10)))
            
            # Road type (1=highway, 2=major road, 3=local road)
            road_type = random.randint(1, 3)
            
            # Route distance
            distance_km = random.uniform(5, 30)
            
            # Construction zones and special events
            construction_zones = random.randint(0, 3)
            special_events = 1 if random.random() < 0.15 else 0
            
            # Create the sample
            sample = {
                'time_of_day': time_of_day,
                'day_of_week': day_of_week,
                'is_holiday': is_holiday,
                'rainfall_mm': rainfall,
                'temperature': temperature,
                'traffic_index': traffic_index,
                'road_type': road_type,
                'distance_km': distance_km,
                'construction_zones': construction_zones,
                'special_events': special_events,
                'region': region,
                'time_period': time_period
            }
            
            # Get prediction
            prediction = model.predict(sample)
            
            # Combine sample and prediction
            result = {
                'input': sample,
                'prediction': prediction
            }
            
            samples.append(result)
        
        # Sort by travel time (longest first)
        samples.sort(key=lambda x: x['prediction']['travel_time_minutes'], reverse=True)
        
        # Write to file if specified
        if output_file:
            with open(output_file, 'w') as f:
                json.dump(samples, f, indent=2)
            logger.info(f"Wrote {len(samples)} route optimization samples to {output_file}")
        
        return samples
    
    except Exception as e:
        logger.error(f"Error generating route optimization samples: {e}")
        return []

def generate_combined_scenarios(count=5, output_file=None):
    """Generate combined scenarios with both flood and route predictions"""
    logger.info(f"Generating {count} combined scenarios")
    
    try:
        scenarios = []
        
        # Generate more individual samples than we need for scenarios
        flood_samples = generate_flood_prediction_samples(count * 2)
        route_samples = generate_route_optimization_samples(count * 4)
        
        # Group by region
        flood_by_region = {}
        for sample in flood_samples:
            region = sample['input']['region']
            if region not in flood_by_region:
                flood_by_region[region] = []
            flood_by_region[region].append(sample)
        
        route_by_region = {}
        for sample in route_samples:
            region = sample['input']['region']
            if region not in route_by_region:
                route_by_region[region] = []
            route_by_region[region].append(sample)
        
        # Create combined scenarios for regions that have both types of data
        common_regions = set(flood_by_region.keys()) & set(route_by_region.keys())
        
        # If not enough common regions, use any regions
        if len(common_regions) < count:
            all_regions = list(set(flood_by_region.keys()) | set(route_by_region.keys()))
            common_regions = all_regions[:count]
        
        for i, region in enumerate(list(common_regions)[:count]):
            # Get flood data for this region
            region_flood = flood_by_region.get(region, [])[0] if region in flood_by_region else flood_samples[i % len(flood_samples)]
            
            # Get route data for this region (multiple routes)
            region_routes = route_by_region.get(region, [])[:3] if region in route_by_region else route_samples[i*3:(i+1)*3]
            
            # Create the scenario
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Calculate impact on routes
            flood_probability = region_flood['prediction']['flood_probability']
            flood_logistics_impact = region_flood['prediction']['logistics_impact']
            
            # Adjust route times based on flood impact
            for route in region_routes:
                original_time = route['prediction']['travel_time_minutes']
                flood_delay = 0
                
                if flood_probability > 0.7:  # High flood risk
                    flood_delay = original_time * 0.5  # 50% longer
                elif flood_probability > 0.4:  # Medium flood risk
                    flood_delay = original_time * 0.25  # 25% longer
                elif flood_probability > 0.2:  # Low flood risk
                    flood_delay = original_time * 0.1  # 10% longer
                
                route['prediction']['flood_adjusted_time'] = original_time + flood_delay
                route['prediction']['flood_delay_minutes'] = flood_delay
            
            scenario = {
                'region': region,
                'timestamp': timestamp,
                'weather_conditions': {
                    'rainfall_24h': region_flood['input']['rainfall_mm_24h'],
                    'rainfall_72h': region_flood['input']['rainfall_mm_72h'],
                    'temperature': region_flood['input']['temperature_c'],
                    'wind_speed': region_flood['input']['wind_speed_kmh']
                },
                'flood_prediction': {
                    'probability': region_flood['prediction']['flood_probability'],
                    'risk_level': region_flood['prediction']['flood_risk'],
                    'affected_areas': flood_logistics_impact.get('affected_areas', []),
                    'route_delays_minutes': flood_logistics_impact.get('route_delays_minutes', 0),
                    'affected_routes_percent': flood_logistics_impact.get('affected_routes_percent', 0),
                    'warehouse_access': flood_logistics_impact.get('warehouse_access', 'normal'),
                    'recommended_buffer_hours': flood_logistics_impact.get('recommended_buffer_hours', 0)
                },
                'route_predictions': [
                    {
                        'from': f"{region} Distribution Center",
                        'to': f"{route['input']['region']} Delivery Hub",
                        'distance_km': route['input']['distance_km'],
                        'time_period': route['input']['time_period'],
                        'traffic_index': route['input']['traffic_index'],
                        'construction_zones': route['input']['construction_zones'],
                        'normal_travel_time_minutes': route['prediction']['travel_time_minutes'],
                        'flood_adjusted_time_minutes': route['prediction']['flood_adjusted_time'],
                        'delay_minutes': route['prediction']['flood_delay_minutes']
                    } for route in region_routes
                ],
                'recommendations': [
                    f"Reschedule deliveries to avoid {flood_logistics_impact.get('affected_areas', [])[0]} area" if flood_logistics_impact.get('affected_areas', []) else "Normal delivery schedule recommended",
                    f"Add {flood_logistics_impact.get('recommended_buffer_hours', 0)} hour buffer to delivery estimates" if flood_logistics_impact.get('recommended_buffer_hours', 0) > 0 else "Standard delivery times apply",
                    "Consider alternative routes to bypass flooded areas" if flood_probability > 0.5 else "Primary routes clear for delivery"
                ]
            }
            
            scenarios.append(scenario)
        
        # Write to file if specified
        if output_file:
            with open(output_file, 'w') as f:
                json.dump(scenarios, f, indent=2)
            logger.info(f"Wrote {len(scenarios)} combined scenarios to {output_file}")
        
        return scenarios
    
    except Exception as e:
        logger.error(f"Error generating combined scenarios: {e}")
        return []

def main():
    """Main function to run the script from the command line"""
    parser = argparse.ArgumentParser(description='Generate sample data from ML models')
    parser.add_argument('--flood', type=int, default=0, help='Number of flood prediction samples to generate')
    parser.add_argument('--route', type=int, default=0, help='Number of route optimization samples to generate')
    parser.add_argument('--scenarios', type=int, default=0, help='Number of combined scenarios to generate')
    parser.add_argument('--output-dir', type=str, default='./sample_data', help='Directory to write output files')
    args = parser.parse_args()
    
    # Create output directory if it doesn't exist
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Generate the requested samples
    if args.flood > 0:
        output_file = os.path.join(args.output_dir, 'flood_predictions.json')
        generate_flood_prediction_samples(args.flood, output_file)
    
    if args.route > 0:
        output_file = os.path.join(args.output_dir, 'route_optimizations.json')
        generate_route_optimization_samples(args.route, output_file)
    
    if args.scenarios > 0:
        output_file = os.path.join(args.output_dir, 'combined_scenarios.json')
        generate_combined_scenarios(args.scenarios, output_file)
    
    logger.info("Sample data generation complete")

if __name__ == '__main__':
    main()