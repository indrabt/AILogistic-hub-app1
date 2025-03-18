import { users, type User, type InsertUser } from "@shared/schema";
import {
  MetricData,
  MapLocation,
  WeatherAlert,
  ForecastData,
  RouteOptimization,
  RouteMetrics,
  ActivityItem,
  Route,
  SupplyChainNode,
  Shipment,
  InventoryAlert,
  ProductForecast,
  WeatherEvent,
  WeatherImpactMetrics,
  AlternativeRoute,
  Report,
  UserSettings,
  PredictiveModel,
  ModelPrediction,
  AnomalyDetection,
  ScenarioAnalysis
} from "@shared/types";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dashboard data
  getDashboardMetrics(): Promise<MetricData>;
  getSupplyChainLocations(): Promise<MapLocation[]>;
  getWeatherAlerts(): Promise<WeatherAlert[]>;
  getDemandForecast(): Promise<ForecastData>;
  getRouteOptimizations(): Promise<RouteOptimization[]>;
  getRouteMetrics(): Promise<RouteMetrics>;
  getRecentActivities(): Promise<ActivityItem[]>;
  
  // Route optimization data
  getRoutes(): Promise<Route[]>;
  getRouteById(id: number): Promise<Route | undefined>;
  
  // Supply chain data
  getSupplyChainNodes(): Promise<SupplyChainNode[]>;
  getShipments(): Promise<Shipment[]>;
  getInventoryAlerts(): Promise<InventoryAlert[]>;
  
  // Demand forecasting data
  getProductForecasts(category?: string): Promise<ProductForecast[]>;
  
  // Weather impact data
  getWeatherEvents(): Promise<WeatherEvent[]>;
  getWeatherImpactMetrics(): Promise<WeatherImpactMetrics>;
  getAlternativeRoutes(): Promise<AlternativeRoute[]>;
  
  // Reports data
  getReports(): Promise<Report[]>;
  
  // Settings data
  getUserSettings(): Promise<UserSettings>;
  updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings>;
  
  // AI Predictive Analytics data
  getPredictiveModels(): Promise<PredictiveModel[]>;
  getPredictiveModelById(id: number): Promise<PredictiveModel | undefined>;
  createPredictiveModel(model: Omit<PredictiveModel, 'id'>): Promise<PredictiveModel>;
  updatePredictiveModel(id: number, model: Partial<PredictiveModel>): Promise<PredictiveModel | undefined>;
  deletePredictiveModel(id: number): Promise<boolean>;
  
  getModelPredictions(modelId?: number): Promise<ModelPrediction[]>;
  getModelPredictionById(id: number): Promise<ModelPrediction | undefined>;
  createModelPrediction(prediction: Omit<ModelPrediction, 'id'>): Promise<ModelPrediction>;
  
  getAnomalyDetections(status?: string): Promise<AnomalyDetection[]>;
  resolveAnomaly(id: number, resolution: string): Promise<AnomalyDetection | undefined>;
  
  getScenarioAnalyses(): Promise<ScenarioAnalysis[]>;
  getScenarioAnalysisById(id: number): Promise<ScenarioAnalysis | undefined>;
  createScenarioAnalysis(scenario: Omit<ScenarioAnalysis, 'id'>): Promise<ScenarioAnalysis>;
  runPredictiveAnalysis(data: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private metrics: MetricData;
  private locations: MapLocation[];
  private weatherAlerts: WeatherAlert[];
  private forecastData: ForecastData;
  private routeOptimizations: RouteOptimization[];
  private routeMetrics: RouteMetrics;
  private activities: ActivityItem[];
  private routes: Route[];
  private supplyChainNodes: SupplyChainNode[];
  private shipments: Shipment[];
  private inventoryAlerts: InventoryAlert[];
  private productForecasts: ProductForecast[];
  private weatherEvents: WeatherEvent[];
  private weatherImpactMetrics: WeatherImpactMetrics;
  private alternativeRoutes: AlternativeRoute[];
  private reports: Report[];
  private userSettings: UserSettings;
  
  // AI Predictive Analytics data
  private predictiveModels: PredictiveModel[];
  private modelPredictions: ModelPrediction[];
  private anomalyDetections: AnomalyDetection[];
  private scenarioAnalyses: ScenarioAnalysis[];
  
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Initialize with empty data structures
    // Initialize AI predictive analytics data
    this.predictiveModels = [
      {
        id: 1,
        name: "Demand Forecasting AI",
        description: "Advanced ML model for predicting product demand across categories",
        type: "demand",
        accuracy: 93.5,
        lastTrained: "2023-02-10",
        status: "active",
        features: ["Historical sales", "Seasonality", "Market trends", "Promotional events"]
      },
      {
        id: 2,
        name: "Route Optimization AI",
        description: "Neural network for real-time route optimization considering weather and traffic",
        type: "routing",
        accuracy: 89.2,
        lastTrained: "2023-02-05",
        status: "active",
        features: ["Distance", "Weather conditions", "Traffic patterns", "Fuel consumption"]
      },
      {
        id: 3,
        name: "Inventory Management AI",
        description: "Predictive model for optimal inventory levels and reordering",
        type: "inventory",
        accuracy: 91.7,
        lastTrained: "2023-01-25",
        status: "active",
        features: ["Stock levels", "Supplier lead times", "Seasonal demand", "Storage costs"]
      },
      {
        id: 4,
        name: "Weather Impact Prediction",
        description: "AI model that predicts severe weather impacts on logistics operations",
        type: "weather",
        accuracy: 87.4,
        lastTrained: "2023-02-12",
        status: "active",
        features: ["Weather forecasts", "Historical delays", "Route vulnerability", "Shipment priority"]
      },
      {
        id: 5,
        name: "Custom Risk Assessment",
        description: "Custom AI model for supply chain risk assessment and mitigation",
        type: "custom",
        accuracy: 85.9,
        lastTrained: "2023-01-15",
        status: "training",
        features: ["Supplier data", "Geopolitical factors", "Commodity prices", "Transportation modes"]
      }
    ];
    
    this.modelPredictions = [
      {
        id: 1,
        modelId: 1,
        modelName: "Demand Forecasting AI",
        createdAt: "2023-02-15T09:30:00",
        predictionType: "demand",
        confidence: 92.4,
        insights: [
          {
            id: 1,
            title: "Increased Apparel Demand",
            description: "Predicted 12% increase in apparel demand over next 30 days",
            importance: "high",
            relatedEntity: "Apparel"
          },
          {
            id: 2,
            title: "Seasonal Electronics Decline",
            description: "Expected 5% reduction in electronics demand due to seasonal patterns",
            importance: "medium",
            relatedEntity: "Electronics"
          }
        ],
        impactAreas: [
          {
            area: "Inventory",
            metric: "Stock levels",
            impact: "positive",
            value: 15,
            unit: "%"
          },
          {
            area: "Revenue",
            metric: "Sales forecast",
            impact: "positive",
            value: 8.5,
            unit: "%"
          }
        ]
      },
      {
        id: 2,
        modelId: 2,
        modelName: "Route Optimization AI",
        createdAt: "2023-02-14T14:45:00",
        predictionType: "routing",
        confidence: 88.7,
        insights: [
          {
            id: 3,
            title: "Northeast Route Congestion",
            description: "Predicted heavy traffic on I-95 corridor due to construction",
            importance: "critical",
            relatedEntity: "Northeast Routes"
          }
        ],
        impactAreas: [
          {
            area: "Delivery Time",
            metric: "On-time delivery",
            impact: "negative",
            value: 12.5,
            unit: "%"
          },
          {
            area: "Cost",
            metric: "Fuel usage",
            impact: "negative",
            value: 8.2,
            unit: "%"
          }
        ]
      }
    ];
    
    this.anomalyDetections = [
      {
        id: 1,
        title: "Unusual Delivery Delay Pattern",
        description: "AI has detected an unusual pattern of delivery delays in the Chicago region",
        detectedAt: "2023-02-15T10:23:00",
        severity: "high",
        category: "logistics",
        status: "investigating",
        affectedAreas: ["Chicago Distribution Center", "Midwest Deliveries"]
      },
      {
        id: 2,
        title: "Unexpected Inventory Fluctuation",
        description: "Significant unexpected deviation in inventory levels for electronic components",
        detectedAt: "2023-02-14T16:30:00",
        severity: "medium",
        category: "supply",
        status: "new",
        affectedAreas: ["Electronics Inventory", "Manufacturing Schedule"]
      },
      {
        id: 3,
        title: "Demand Forecast Anomaly",
        description: "Unusual spike in demand forecasted for furniture category",
        detectedAt: "2023-02-13T09:15:00",
        severity: "low",
        category: "demand",
        status: "resolved",
        affectedAreas: ["Furniture Category", "Inventory Planning"]
      }
    ];
    
    this.scenarioAnalyses = [
      {
        id: 1,
        name: "Northeast Snowstorm Scenario",
        description: "Impact analysis of severe snowstorm in the Northeast region",
        createdAt: "2023-02-15T08:00:00",
        variables: [
          {
            name: "Snow Accumulation",
            value: "12-18 inches",
            type: "weather"
          },
          {
            name: "Duration",
            value: "36 hours",
            type: "weather"
          },
          {
            name: "Affected Routes",
            value: 14,
            type: "logistics"
          }
        ],
        outcomes: [
          {
            metric: "Delivery Delays",
            value: 48,
            change: 32,
            impact: "negative"
          },
          {
            metric: "Alternative Routes Used",
            value: 8,
            change: 8,
            impact: "positive"
          }
        ],
        probability: 75
      },
      {
        id: 2,
        name: "Supply Chain Disruption",
        description: "Analysis of major supplier disruption on inventory and operations",
        createdAt: "2023-02-10T14:30:00",
        variables: [
          {
            name: "Disruption Length",
            value: "2 weeks",
            type: "supply"
          },
          {
            name: "Affected Categories",
            value: "Electronics, Components",
            type: "supply"
          },
          {
            name: "Available Alternatives",
            value: 3,
            type: "supply"
          }
        ],
        outcomes: [
          {
            metric: "Inventory Levels",
            value: 35,
            change: -65,
            impact: "negative"
          },
          {
            metric: "Production Impact",
            value: 40,
            change: -60,
            impact: "negative"
          },
          {
            metric: "Revenue Impact",
            value: 82,
            change: -18,
            impact: "negative"
          }
        ],
        probability: 30
      }
    ];
    this.metrics = {
      activeShipments: { value: 247, change: "12% from last week", trend: "up" },
      onTimeDelivery: { value: "94%", change: "3% from last week", trend: "up" },
      delayAlerts: { value: 18, change: "5% from last week", trend: "up" },
      avgShippingCost: { value: "$1,247", change: "2% from last week", trend: "down" }
    };
    
    this.locations = [
      { id: 1, type: "distribution", lat: 41.8781, lng: -87.6298, name: "Chicago Distribution Center" },
      { id: 2, type: "distribution", lat: 34.0522, lng: -118.2437, name: "Los Angeles Distribution Center" },
      { id: 3, type: "transit", lat: 39.7392, lng: -104.9903, name: "Denver Transit Hub" },
      { id: 4, type: "transit", lat: 32.7767, lng: -96.7970, name: "Dallas Transit Hub" },
      { id: 5, type: "delay", lat: 40.7128, lng: -74.0060, name: "New York Delivery Center" }
    ];
    
    this.weatherAlerts = [
      {
        id: 1,
        severity: "severe",
        title: "Severe Weather Alert",
        description: "Heavy snowfall expected in the Northeast region affecting 14 active shipments.",
        time: "12:30 PM",
        affectedShipments: 14,
        region: "Northeast"
      },
      {
        id: 2,
        severity: "advisory",
        title: "Weather Advisory",
        description: "Fog reducing visibility along West Coast routes. Expected delays of 1-2 hours.",
        time: "09:15 AM",
        affectedShipments: 8,
        region: "West Coast"
      }
    ];
    
    this.forecastData = {
      lastWeek: { value: 421, label: "units" },
      currentWeek: { value: 465, label: "units" },
      nextWeek: { value: 503, label: "units" },
      chartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Demand",
            data: [420, 430, 448, 470, 460, 475, 490],
            borderColor: "#1a237e",
            backgroundColor: "rgba(26, 35, 126, 0.1)"
          }
        ]
      }
    };
    
    this.routeOptimizations = [
      { id: 1, name: "Chicago to Detroit", description: "Rerouted to avoid construction on I-94", saved: "-45 min" },
      { id: 2, name: "Dallas to Houston", description: "Traffic-optimized departure time", saved: "-30 min" }
    ];
    
    this.routeMetrics = {
      optimizedPercentage: 75,
      target: 85,
      improvement: "+12%"
    };
    
    this.activities = [
      { id: 1, title: "Shipment #A4589 delivered", description: "Package delivered to 1234 Main St, New York", time: "2 hours ago", type: "primary" },
      { id: 2, title: "Route modification alert", description: "5 routes modified due to weather conditions", time: "4 hours ago", type: "accent" },
      { id: 3, title: "New shipment created", description: "Shipment #B7813 created from LA to Miami", time: "6 hours ago", type: "secondary" },
      { id: 4, title: "System update completed", description: "New route optimization algorithm deployed", time: "12 hours ago", type: "default" }
    ];
    
    this.routes = [
      { id: 1, name: "RT-8294", origin: "Chicago, IL", destination: "Detroit, MI", status: "optimized", savings: "45 min", eta: "Today, 4:30 PM", distance: "280 mi" },
      { id: 2, name: "RT-7512", origin: "Dallas, TX", destination: "Houston, TX", status: "optimized", savings: "30 min", eta: "Today, 5:15 PM", distance: "240 mi" },
      { id: 3, name: "RT-6351", origin: "Los Angeles, CA", destination: "San Francisco, CA", status: "delayed", savings: "-20 min", eta: "Tomorrow, 11:00 AM", distance: "380 mi" },
      { id: 4, name: "RT-5437", origin: "New York, NY", destination: "Boston, MA", status: "standard", savings: "0 min", eta: "Today, 7:45 PM", distance: "220 mi" }
    ];
    
    this.supplyChainNodes = [
      { id: 1, type: "distribution", name: "Chicago DC", location: "Chicago, IL", lat: 41.8781, lng: -87.6298, inventory: 12500 },
      { id: 2, type: "distribution", name: "Los Angeles DC", location: "Los Angeles, CA", lat: 34.0522, lng: -118.2437, inventory: 15700 },
      { id: 3, type: "regional", name: "Denver RC", location: "Denver, CO", lat: 39.7392, lng: -104.9903, inventory: 5200 },
      { id: 4, type: "regional", name: "Dallas RC", location: "Dallas, TX", lat: 32.7767, lng: -96.7970, inventory: 4800 },
      { id: 5, type: "local", name: "NYC LC", location: "New York, NY", lat: 40.7128, lng: -74.0060, inventory: 2300 },
      { id: 6, type: "local", name: "Miami LC", location: "Miami, FL", lat: 25.7617, lng: -80.1918, inventory: 1800 }
    ];
    
    this.shipments = [
      { id: 1, shipmentId: "A4589", origin: "Chicago, IL", destination: "Detroit, MI", status: "on-schedule", eta: "Today, 4:30 PM", priority: "high" },
      { id: 2, shipmentId: "B7813", origin: "Los Angeles, CA", destination: "Miami, FL", status: "delayed", eta: "Tomorrow, 10:15 AM", priority: "medium" },
      { id: 3, shipmentId: "C3921", origin: "New York, NY", destination: "Boston, MA", status: "on-schedule", eta: "Tomorrow, 2:45 PM", priority: "normal" }
    ];
    
    this.inventoryAlerts = [
      { id: 1, product: "Electronic Components", location: "Chicago Distribution Center", current: 52, minimum: 200, severity: "critical", percentage: 26 },
      { id: 2, product: "Packaging Supplies", location: "Dallas Regional Center", current: 120, minimum: 200, severity: "low", percentage: 60 },
      { id: 3, product: "Winter Clothing", location: "Boston Local Center", current: 85, minimum: 150, severity: "low", percentage: 56 }
    ];
    
    this.productForecasts = [
      { id: 1, category: "Electronics", subcategory: "Smart devices, components", current: 1245, next: 1380, trend: "up", percentage: 10.8, confidence: "high", confidenceValue: 92 },
      { id: 2, category: "Apparel", subcategory: "Clothing, accessories", current: 3850, next: 4220, trend: "up", percentage: 9.6, confidence: "high", confidenceValue: 89 },
      { id: 3, category: "Furniture", subcategory: "Home, office furnishings", current: 920, next: 880, trend: "down", percentage: 4.3, confidence: "medium", confidenceValue: 76 },
      { id: 4, category: "Food & Beverage", subcategory: "Perishable goods", current: 5120, next: 5230, trend: "up", percentage: 2.1, confidence: "high", confidenceValue: 88 }
    ];
    
    this.weatherEvents = [
      { id: 1, type: "snow", severity: "severe", region: "Northeast", affectedRoutes: 14, startTime: "2023-02-15T12:00:00", endTime: "2023-02-16T03:00:00", description: "Heavy snowfall with accumulation of 8-12 inches expected" },
      { id: 2, type: "fog", severity: "moderate", region: "West Coast", affectedRoutes: 8, startTime: "2023-02-15T06:00:00", endTime: "2023-02-15T11:00:00", description: "Dense fog reducing visibility to less than 1/4 mile" },
      { id: 3, type: "rain", severity: "minor", region: "Southeast", affectedRoutes: 5, startTime: "2023-02-15T14:00:00", endTime: "2023-02-15T20:00:00", description: "Heavy rain causing minor flooding in low-lying areas" }
    ];
    
    this.weatherImpactMetrics = {
      activeAlerts: 3,
      affectedShipments: 27,
      averageDelay: "2.4 hours",
      riskLevel: "medium"
    };
    
    this.alternativeRoutes = [
      { id: 1, originalRoute: "I-95 North", alternativeRoute: "US-1 North", timeSaved: "45 min", weatherCondition: "Heavy Snow", confidence: 87 },
      { id: 2, originalRoute: "I-5 South", alternativeRoute: "CA-101 South", timeSaved: "30 min", weatherCondition: "Dense Fog", confidence: 92 },
      { id: 3, originalRoute: "I-75 South", alternativeRoute: "US-41 South", timeSaved: "15 min", weatherCondition: "Heavy Rain", confidence: 78 }
    ];
    
    this.reports = [
      { id: 1, name: "Monthly Logistics Performance", type: "logistics", lastGenerated: "2023-01-31", frequency: "monthly", format: "pdf", size: "2.4 MB" },
      { id: 2, name: "Weekly Inventory Status", type: "inventory", lastGenerated: "2023-02-12", frequency: "weekly", format: "excel", size: "1.8 MB" },
      { id: 3, name: "Q1 Demand Forecast", type: "forecast", lastGenerated: "2023-01-15", frequency: "quarterly", format: "pdf", size: "3.2 MB" },
      { id: 4, name: "Route Optimization Summary", type: "routes", lastGenerated: "2023-02-14", frequency: "daily", format: "csv", size: "1.1 MB" },
      { id: 5, name: "Custom Supply Chain Analysis", type: "custom", lastGenerated: "2023-01-20", frequency: "custom", format: "excel", size: "4.5 MB" }
    ];
    
    this.userSettings = {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      dashboard: {
        defaultView: "overview",
        refreshRate: 5
      },
      display: {
        theme: "light",
        density: "comfortable"
      },
      integration: {
        erp: false,
        weather: true,
        analytics: false
      }
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Dashboard data methods
  async getDashboardMetrics(): Promise<MetricData> {
    return this.metrics;
  }

  async getSupplyChainLocations(): Promise<MapLocation[]> {
    return this.locations;
  }

  async getWeatherAlerts(): Promise<WeatherAlert[]> {
    return this.weatherAlerts;
  }

  async getDemandForecast(): Promise<ForecastData> {
    return this.forecastData;
  }

  async getRouteOptimizations(): Promise<RouteOptimization[]> {
    return this.routeOptimizations;
  }

  async getRouteMetrics(): Promise<RouteMetrics> {
    return this.routeMetrics;
  }

  async getRecentActivities(): Promise<ActivityItem[]> {
    return this.activities;
  }

  // Route optimization data methods
  async getRoutes(): Promise<Route[]> {
    return this.routes;
  }

  async getRouteById(id: number): Promise<Route | undefined> {
    return this.routes.find(route => route.id === id);
  }

  // Supply chain data methods
  async getSupplyChainNodes(): Promise<SupplyChainNode[]> {
    return this.supplyChainNodes;
  }

  async getShipments(): Promise<Shipment[]> {
    return this.shipments;
  }

  async getInventoryAlerts(): Promise<InventoryAlert[]> {
    return this.inventoryAlerts;
  }

  // Demand forecasting data methods
  async getProductForecasts(category?: string): Promise<ProductForecast[]> {
    if (category && category !== 'all') {
      return this.productForecasts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    return this.productForecasts;
  }

  // Weather impact data methods
  async getWeatherEvents(): Promise<WeatherEvent[]> {
    return this.weatherEvents;
  }

  async getWeatherImpactMetrics(): Promise<WeatherImpactMetrics> {
    return this.weatherImpactMetrics;
  }

  async getAlternativeRoutes(): Promise<AlternativeRoute[]> {
    return this.alternativeRoutes;
  }

  // Reports data methods
  async getReports(): Promise<Report[]> {
    return this.reports;
  }

  // Settings data methods
  async getUserSettings(): Promise<UserSettings> {
    return this.userSettings;
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    this.userSettings = {
      ...this.userSettings,
      ...(settings.notifications && { notifications: { ...this.userSettings.notifications, ...settings.notifications } }),
      ...(settings.dashboard && { dashboard: { ...this.userSettings.dashboard, ...settings.dashboard } }),
      ...(settings.display && { display: { ...this.userSettings.display, ...settings.display } }),
      ...(settings.integration && { integration: { ...this.userSettings.integration, ...settings.integration } })
    };
    return this.userSettings;
  }
}

export const storage = new MemStorage();
