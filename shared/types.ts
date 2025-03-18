import { User } from "./schema";

// Dashboard types
export interface MetricData {
  activeShipments: {
    value: number;
    change: string;
    trend: "up" | "down";
  };
  onTimeDelivery: {
    value: string;
    change: string;
    trend: "up" | "down";
  };
  delayAlerts: {
    value: number;
    change: string;
    trend: "up" | "down";
  };
  avgShippingCost: {
    value: string;
    change: string;
    trend: "up" | "down";
  };
}

export interface MapLocation {
  id: number;
  type: "distribution" | "transit" | "delay";
  lat: number;
  lng: number;
  name: string;
  status?: string;
}

export interface WeatherAlert {
  id: number;
  severity: "severe" | "advisory";
  title: string;
  description: string;
  time: string;
  affectedShipments?: number;
  region: string;
}

export interface ForecastData {
  lastWeek: {
    value: number;
    label: string;
  };
  currentWeek: {
    value: number;
    label: string;
  };
  nextWeek: {
    value: number;
    label: string;
  };
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

export interface RouteOptimization {
  id: number;
  name: string;
  description: string;
  saved: string;
}

export interface RouteMetrics {
  optimizedPercentage: number;
  target: number;
  improvement: string;
}

export interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "primary" | "accent" | "secondary" | "default";
}

// Route types
export interface Route {
  id: number;
  name: string;
  origin: string;
  destination: string;
  status: "optimized" | "delayed" | "standard";
  savings?: string;
  eta: string;
  distance: string;
}

// Supply Chain types
export interface SupplyChainNode {
  id: number;
  type: "distribution" | "regional" | "local";
  name: string;
  location: string;
  lat: number;
  lng: number;
  inventory: number;
}

export interface Shipment {
  id: number;
  shipmentId: string;
  origin: string;
  destination: string;
  status: "on-schedule" | "delayed" | "delivered";
  eta: string;
  priority: "high" | "medium" | "normal";
}

export interface InventoryAlert {
  id: number;
  product: string;
  location: string;
  current: number;
  minimum: number;
  severity: "critical" | "low" | "normal";
  percentage: number;
}

// Demand Forecasting types
export interface ProductForecast {
  id: number;
  category: string;
  subcategory: string;
  current: number;
  next: number;
  trend: "up" | "down";
  percentage: number;
  confidence: "high" | "medium" | "low";
  confidenceValue: number;
}

// Weather Impact types
export interface WeatherEvent {
  id: number;
  type: "storm" | "fog" | "snow" | "rain" | "extreme-heat" | "flood";
  severity: "severe" | "moderate" | "minor";
  region: string;
  affectedRoutes: number;
  startTime: string;
  endTime: string;
  description: string;
}

export interface WeatherImpactMetrics {
  activeAlerts: number;
  affectedShipments: number;
  averageDelay: string;
  riskLevel: "high" | "medium" | "low";
}

export interface AlternativeRoute {
  id: number;
  originalRoute: string;
  alternativeRoute: string;
  timeSaved: string;
  weatherCondition: string;
  confidence: number;
}

// Reports types
export interface Report {
  id: number;
  name: string;
  type: "logistics" | "inventory" | "forecast" | "routes" | "custom";
  lastGenerated: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "custom";
  format: "pdf" | "csv" | "excel";
  size: string;
}

// Settings types
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    defaultView: "overview" | "routes" | "supply-chain";
    refreshRate: number;
  };
  display: {
    theme: "light" | "dark" | "system";
    density: "compact" | "comfortable" | "spacious";
  };
  integration: {
    erp: boolean;
    weather: boolean;
    analytics: boolean;
  };
}
