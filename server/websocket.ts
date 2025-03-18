/**
 * WebSocket Server for Real-Time Updates
 * 
 * This module provides real-time updates to clients via WebSockets.
 * It ensures delivery status updates with ≤5-second latency.
 */

import { Server as HttpServer } from 'http';
import WebSocket from 'ws';
import { log } from './vite';
import { storage } from './storage';
import { 
  getModelInfo, 
  getPrediction,
  getRealtimeData
} from './ml-interface';

// Define message types
type MessageType = 
  | 'DELIVERY_UPDATE'
  | 'WEATHER_ALERT'
  | 'TRAFFIC_UPDATE'
  | 'INVENTORY_ALERT'
  | 'AI_INSIGHT'
  | 'ANOMALY_DETECTION'
  | 'SYSTEM_MESSAGE';

// Define client connection info
interface ClientConnection {
  ws: WebSocket;
  userId?: number;
  role?: string;
  regions?: string[];
  lastActivity: Date;
}

export class WebSocketServer {
  private wss: WebSocket.Server;
  private clients: Map<WebSocket, ClientConnection> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  
  constructor(server: HttpServer) {
    this.wss = new WebSocket.Server({ server });
    this.initialize();
  }
  
  private initialize() {
    log('WebSocket server initialized', 'websocket');
    
    this.wss.on('connection', (ws: WebSocket) => {
      this.handleConnection(ws);
    });
    
    // Start periodic updates
    this.startPeriodicUpdates();
  }
  
  private handleConnection(ws: WebSocket) {
    // Register new client
    this.clients.set(ws, { 
      ws, 
      lastActivity: new Date() 
    });
    
    log(`New WebSocket connection established. Total clients: ${this.clients.size}`, 'websocket');
    
    // Send welcome message
    this.sendToClient(ws, {
      type: 'SYSTEM_MESSAGE',
      message: 'Connected to Western Sydney AI Logistics Hub',
      timestamp: new Date().toISOString()
    });
    
    // Handle messages from client
    ws.on('message', (message: WebSocket.Data) => {
      try {
        const data = JSON.parse(message.toString());
        this.handleClientMessage(ws, data);
      } catch (error) {
        log(`Error parsing client message: ${error}`, 'websocket');
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      this.clients.delete(ws);
      log(`WebSocket connection closed. Total clients: ${this.clients.size}`, 'websocket');
    });
    
    // Handle errors
    ws.on('error', (error) => {
      log(`WebSocket error: ${error}`, 'websocket');
      this.clients.delete(ws);
    });
  }
  
  private handleClientMessage(ws: WebSocket, data: any) {
    // Update client info based on message
    const client = this.clients.get(ws);
    if (!client) return;
    
    client.lastActivity = new Date();
    
    // Handle authentication
    if (data.type === 'AUTH') {
      client.userId = data.userId;
      client.role = data.role;
      log(`Client authenticated: User ID ${data.userId}, Role: ${data.role}`, 'websocket');
      
      // Send confirmation
      this.sendToClient(ws, {
        type: 'SYSTEM_MESSAGE',
        message: `Authenticated as ${data.role}`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Handle subscription to regions
    if (data.type === 'SUBSCRIBE_REGIONS') {
      client.regions = data.regions;
      log(`Client subscribed to regions: ${data.regions.join(', ')}`, 'websocket');
      
      // Send confirmation
      this.sendToClient(ws, {
        type: 'SYSTEM_MESSAGE',
        message: `Subscribed to regions: ${data.regions.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Handle request for AI insights
    if (data.type === 'REQUEST_INSIGHTS') {
      this.generateAiInsights(client, data.context);
    }
  }
  
  private startPeriodicUpdates() {
    // Send updates every 5 seconds (to meet ≤5-second latency requirement)
    this.updateInterval = setInterval(() => {
      this.broadcastUpdates();
    }, 5000);
    
    // Clean up inactive connections every minute
    setInterval(() => {
      this.cleanInactiveConnections();
    }, 60000);
  }
  
  private async broadcastUpdates() {
    try {
      // Fetch latest delivery statuses
      const shipments = await storage.getShipments();
      
      // Fetch latest weather alerts
      const weatherAlerts = await storage.getWeatherAlerts();
      
      // Fetch latest inventory alerts
      const inventoryAlerts = await storage.getInventoryAlerts();
      
      // Get real-time weather and traffic data
      const realtimeData = getRealtimeData();
      
      // Broadcast to relevant clients
      this.clients.forEach((client, ws) => {
        // Skip clients that aren't authenticated
        if (!client.userId || !client.role) return;
        
        // Send delivery updates relevant to this client's role and regions
        this.sendRelevantDeliveryUpdates(client, shipments);
        
        // Send weather alerts relevant to this client's regions
        this.sendRelevantWeatherAlerts(client, weatherAlerts);
        
        // Send inventory alerts to warehouse staff and logistics managers
        if (client.role === 'warehouse_staff' || client.role === 'logistics_manager') {
          this.sendInventoryAlerts(client, inventoryAlerts);
        }
        
        // Send realtime data updates
        this.sendRealtimeDataUpdates(client, realtimeData);
      });
    } catch (error) {
      log(`Error broadcasting updates: ${error}`, 'websocket');
    }
  }
  
  private sendRelevantDeliveryUpdates(client: ClientConnection, shipments: any[]) {
    // Filter shipments based on client role and regions
    let relevantShipments = shipments;
    
    if (client.role === 'driver') {
      // Drivers only see their assigned deliveries
      // In a real application, we would filter by driverId
      relevantShipments = shipments.filter(s => s.status !== 'delivered');
    }
    
    if (client.regions && client.regions.length > 0) {
      // Filter by origin or destination in client's regions
      relevantShipments = relevantShipments.filter(s => 
        client.regions!.some(region => 
          s.origin.includes(region) || s.destination.includes(region)
        )
      );
    }
    
    // Send updates for relevant shipments
    for (const shipment of relevantShipments) {
      this.sendToClient(client.ws, {
        type: 'DELIVERY_UPDATE',
        data: shipment,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  private sendRelevantWeatherAlerts(client: ClientConnection, alerts: any[]) {
    // Filter alerts based on client regions
    let relevantAlerts = alerts;
    
    if (client.regions && client.regions.length > 0) {
      // Filter by region
      relevantAlerts = relevantAlerts.filter(a => 
        client.regions!.some(region => 
          a.region?.includes(region)
        )
      );
    }
    
    // Send updates for relevant alerts
    for (const alert of relevantAlerts) {
      this.sendToClient(client.ws, {
        type: 'WEATHER_ALERT',
        data: alert,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  private sendInventoryAlerts(client: ClientConnection, alerts: any[]) {
    // Filter alerts based on client regions
    let relevantAlerts = alerts;
    
    if (client.regions && client.regions.length > 0) {
      // Filter by location
      relevantAlerts = relevantAlerts.filter(a => 
        client.regions!.some(region => 
          a.location?.includes(region)
        )
      );
    }
    
    // Send updates for relevant alerts
    for (const alert of relevantAlerts) {
      this.sendToClient(client.ws, {
        type: 'INVENTORY_ALERT',
        data: alert,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  private sendRealtimeDataUpdates(client: ClientConnection, realtimeData: any) {
    // Filter data based on client regions
    if (client.regions && client.regions.length > 0) {
      const filteredWeather: any = { regions: {} };
      const filteredTraffic: any = { regions: {} };
      
      // Filter weather data
      for (const region in realtimeData.weather.regions) {
        if (client.regions.some(r => region.includes(r))) {
          filteredWeather.regions[region] = realtimeData.weather.regions[region];
        }
      }
      
      // Filter traffic data
      for (const route in realtimeData.traffic.regions) {
        if (client.regions.some(r => route.includes(r))) {
          filteredTraffic.regions[route] = realtimeData.traffic.regions[route];
        }
      }
      
      // Add timestamp
      filteredWeather.timestamp = realtimeData.weather.timestamp;
      filteredTraffic.timestamp = realtimeData.traffic.timestamp;
      
      // Send weather data if there are regions
      if (Object.keys(filteredWeather.regions).length > 0) {
        this.sendToClient(client.ws, {
          type: 'WEATHER_UPDATE',
          data: filteredWeather,
          timestamp: new Date().toISOString()
        });
      }
      
      // Send traffic data if there are regions
      if (Object.keys(filteredTraffic.regions).length > 0) {
        this.sendToClient(client.ws, {
          type: 'TRAFFIC_UPDATE',
          data: filteredTraffic,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // Send all data if no regions specified
      this.sendToClient(client.ws, {
        type: 'WEATHER_UPDATE',
        data: realtimeData.weather,
        timestamp: new Date().toISOString()
      });
      
      this.sendToClient(client.ws, {
        type: 'TRAFFIC_UPDATE',
        data: realtimeData.traffic,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  private async generateAiInsights(client: ClientConnection, context: any) {
    try {
      // Generate insights based on role, regions, and context
      let insights: any[] = [];
      
      // Different insights based on role
      if (client.role === 'driver') {
        // Route optimization insights
        if (context.route) {
          const routePrediction = await getPrediction({
            model: 'route',
            features: {
              time_of_day: new Date().getHours(),
              day_of_week: new Date().getDay(),
              distance_km: context.route.distance || 10,
              is_holiday: 0,
              rainfall_mm: context.weather?.rainfall || 0,
              temperature: context.weather?.temperature || 22,
              traffic_index: context.traffic?.congestion || 50,
              road_type: 2,
              construction_zones: context.construction?.zones?.length || 0,
              special_events: context.events?.active ? 1 : 0
            }
          });
          
          if (routePrediction.success) {
            insights.push({
              type: 'route_optimization',
              title: 'Route Time Prediction',
              description: `Based on current conditions, your route will take approximately ${Math.round(routePrediction.prediction.travel_time_minutes)} minutes.`,
              confidence: 0.89,
              action: 'Review recommended route',
              priority: 'high'
            });
          }
        }
        
        // Weather impact insights
        if (context.weather && context.location) {
          const floodPrediction = await getPrediction({
            model: 'flood',
            features: {
              rainfall_mm_24h: context.weather.rainfall_24h || 5,
              rainfall_mm_72h: context.weather.rainfall_72h || 15,
              river_level_m: context.weather.river_level || 1.2,
              soil_moisture: context.weather.soil_moisture || 0.4,
              temperature_c: context.weather.temperature || 22,
              wind_speed_kmh: context.weather.wind_speed || 10,
              elevation_m: context.location.elevation || 45,
              distance_to_river_km: context.location.distance_to_river || 3.5,
              impervious_surface_pct: 35,
              drainage_capacity: 0.8
            }
          });
          
          if (floodPrediction.success && floodPrediction.prediction.flood_probability > 0.3) {
            insights.push({
              type: 'weather_impact',
              title: 'Potential Weather Impact',
              description: `There is a ${Math.round(floodPrediction.prediction.flood_probability * 100)}% chance of flooding affecting your route. Consider alternative routes.`,
              confidence: 0.94,
              action: 'View alternative routes',
              priority: floodPrediction.prediction.flood_probability > 0.7 ? 'critical' : 'medium'
            });
          }
        }
      } else if (client.role === 'warehouse_staff') {
        // Inventory insights
        if (context.inventory) {
          const lowInventoryItems = context.inventory.filter((item: any) => item.quantity < item.minQuantity);
          
          if (lowInventoryItems.length > 0) {
            insights.push({
              type: 'inventory',
              title: 'Low Inventory Alert',
              description: `${lowInventoryItems.length} items are below minimum threshold. Restock recommended.`,
              confidence: 0.95,
              action: 'View low stock items',
              priority: 'high'
            });
          }
        }
        
        // Incoming shipment insights
        if (context.incomingShipments && context.incomingShipments.length > 0) {
          const delayedShipments = context.incomingShipments.filter((s: any) => s.status === 'delayed');
          
          if (delayedShipments.length > 0) {
            insights.push({
              type: 'shipment_delay',
              title: 'Incoming Shipment Delays',
              description: `${delayedShipments.length} incoming shipments are delayed. Adjust staffing accordingly.`,
              confidence: 0.92,
              action: 'View delayed shipments',
              priority: 'medium'
            });
          }
        }
      } else if (client.role === 'logistics_manager') {
        // Supply chain insights
        if (context.supplyChain) {
          // Check for disruptions
          const disruptedNodes = context.supplyChain.filter((node: any) => node.status === 'disrupted');
          
          if (disruptedNodes.length > 0) {
            insights.push({
              type: 'supply_chain',
              title: 'Supply Chain Disruption',
              description: `${disruptedNodes.length} supply chain nodes are disrupted. Implement contingency plan.`,
              confidence: 0.91,
              action: 'View disrupted nodes',
              priority: 'critical'
            });
          }
        }
        
        // Fleet insights
        if (context.fleet) {
          const idleVehicles = context.fleet.filter((v: any) => v.status === 'idle');
          
          if (idleVehicles.length > 3) {
            insights.push({
              type: 'fleet_utilization',
              title: 'Underutilized Fleet',
              description: `${idleVehicles.length} vehicles are currently idle. Consider reassignment.`,
              confidence: 0.88,
              action: 'View fleet utilization',
              priority: 'medium'
            });
          }
        }
        
        // Demand forecast insights
        if (context.demand) {
          insights.push({
            type: 'demand_forecast',
            title: 'Demand Spike Predicted',
            description: `${context.demand.nextWeek.value > context.demand.currentWeek.value ? 'Increase' : 'Decrease'} in demand expected next week. ${context.demand.nextWeek.value > context.demand.currentWeek.value ? 'Prepare additional resources.' : 'Consider reducing scheduled deliveries.'}`,
            confidence: 0.87,
            action: 'View demand forecast',
            priority: 'high'
          });
        }
      } else if (client.role === 'business_owner') {
        // Business metrics insights
        if (context.metrics) {
          // Profitability insights
          if (context.metrics.profits && context.metrics.costs) {
            const profitMargin = context.metrics.profits.monthly / (context.metrics.profits.monthly + context.metrics.costs.total) * 100;
            
            insights.push({
              type: 'profitability',
              title: 'Profit Margin Analysis',
              description: `Current profit margin is ${profitMargin.toFixed(1)}%. ${profitMargin < 15 ? 'Below target of 15%. Consider cost reduction strategies.' : 'Above target of 15%. Good performance.'}`,
              confidence: 0.93,
              action: 'View financial details',
              priority: profitMargin < 15 ? 'high' : 'low'
            });
          }
          
          // Customer insights
          if (context.metrics.customerAcquisitionCost && context.metrics.lifetimeValue) {
            const cltv = context.metrics.lifetimeValue / context.metrics.customerAcquisitionCost;
            
            insights.push({
              type: 'customer_value',
              title: 'Customer Lifetime Value',
              description: `LTV to CAC ratio is ${cltv.toFixed(1)}x. ${cltv < 3 ? 'Below target of 3x. Review acquisition strategy.' : 'Above target of 3x. Effective acquisition strategy.'}`,
              confidence: 0.90,
              action: 'View customer metrics',
              priority: cltv < 3 ? 'high' : 'low'
            });
          }
        }
      }
      
      // Send insights to client
      if (insights.length > 0) {
        this.sendToClient(client.ws, {
          type: 'AI_INSIGHT',
          data: {
            insights,
            context: 'current_conditions',
            timestamp: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        });
        
        log(`Sent ${insights.length} AI insights to client`, 'websocket');
      } else {
        this.sendToClient(client.ws, {
          type: 'SYSTEM_MESSAGE',
          message: 'No relevant insights available at this time',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      log(`Error generating AI insights: ${error}`, 'websocket');
      
      this.sendToClient(client.ws, {
        type: 'SYSTEM_MESSAGE',
        message: 'Failed to generate insights. Please try again later.',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  private cleanInactiveConnections() {
    const now = new Date();
    const inactiveTimeout = 15 * 60 * 1000; // 15 minutes
    
    for (const [ws, client] of this.clients.entries()) {
      const inactiveDuration = now.getTime() - client.lastActivity.getTime();
      
      if (inactiveDuration > inactiveTimeout) {
        log(`Closing inactive connection. Inactive for ${inactiveDuration / 1000} seconds`, 'websocket');
        ws.terminate();
        this.clients.delete(ws);
      }
    }
  }
  
  private sendToClient(ws: WebSocket, data: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }
  
  public broadcast(data: any) {
    for (const [ws, _] of this.clients.entries()) {
      this.sendToClient(ws, data);
    }
  }
  
  public shutdown() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.wss.close();
    log('WebSocket server shut down', 'websocket');
  }
}

let wsServer: WebSocketServer | null = null;

export function initializeWebSocketServer(server: HttpServer) {
  if (!wsServer) {
    wsServer = new WebSocketServer(server);
    log('WebSocket server started', 'websocket');
  }
  return wsServer;
}

export function getWebSocketServer() {
  return wsServer;
}