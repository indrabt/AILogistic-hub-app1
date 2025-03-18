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

// AI Predictive Analytics types
export interface PredictiveModel {
  id: number;
  name: string;
  description: string;
  type: "demand" | "routing" | "inventory" | "weather" | "custom";
  accuracy: number;
  lastTrained: string;
  status: "active" | "training" | "draft";
  features: string[];
}

export interface ModelPrediction {
  id: number;
  modelId: number;
  modelName: string;
  createdAt: string;
  predictionType: "demand" | "routing" | "inventory" | "weather" | "custom";
  confidence: number;
  insights: PredictionInsight[];
  impactAreas: PredictionImpact[];
}

export interface PredictionInsight {
  id: number;
  title: string;
  description: string;
  importance: "critical" | "high" | "medium" | "low";
  relatedEntity?: string;
}

export interface PredictionImpact {
  area: string;
  metric: string;
  impact: "positive" | "negative" | "neutral";
  value: number;
  unit: string;
}

export interface AnomalyDetection {
  id: number;
  title: string;
  description: string;
  detectedAt: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "demand" | "supply" | "logistics" | "weather" | "other";
  status: "new" | "investigating" | "resolved";
  affectedAreas: string[];
}

export interface ScenarioAnalysis {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  variables: ScenarioVariable[];
  outcomes: ScenarioOutcome[];
  probability: number;
}

export interface ScenarioVariable {
  name: string;
  value: string | number;
  type: "demand" | "supply" | "logistics" | "weather" | "cost" | "other";
}

export interface ScenarioOutcome {
  metric: string;
  value: number;
  change: number;
  impact: "positive" | "negative" | "neutral";
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

// 1. Hyper-Local Route Optimization with Real-Time Adaptation
export interface HyperLocalRoutingData {
  id: number;
  name: string;
  status: "active" | "scheduled" | "completed";
  region: string;
  trafficConditions: "light" | "moderate" | "heavy" | "gridlock";
  weatherConditions: string;
  constructionZones: ConstructionZone[];
  fuelSavings: string;
  timeReduction: string;
  routeEfficiency: number;
  lastUpdated: string;
  edgeDeviceStatus: "online" | "offline" | "degraded";
}

export interface ConstructionZone {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  impact: "low" | "medium" | "high";
  description: string;
}

// 2. Predictive Supply Chain Resilience
export interface ResilienceForecast {
  id: number;
  name: string;
  forecastType: "demand" | "disaster" | "delay";
  probability: number;
  impact: "low" | "medium" | "high" | "critical";
  timeWindow: string;
  affectedRegions: string[];
  suggestedActions: string[];
  alternateRoutes: number[];
  inventoryRecommendations: InventoryRecommendation[];
  accuracy: number;
}

export interface InventoryRecommendation {
  id: number;
  product: string;
  currentLevel: number;
  recommendedLevel: number;
  priority: "low" | "medium" | "high";
  location: string;
  rationale: string;
}

// 3. Sustainable AI-Driven Operations
export interface SustainabilityMetrics {
  id: number;
  totalCarbonEmissions: number;
  emissionReduction: string;
  energyEfficiency: number;
  emptyMilesPercentage: number;
  carbonOffsets: number;
  sustainabilityScore: number;
  recommendations: SustainabilityRecommendation[];
}

export interface SustainabilityRecommendation {
  id: number;
  title: string;
  description: string;
  potentialImpact: string;
  difficulty: "easy" | "medium" | "complex";
  timeToImplement: string;
  costSavings: string;
}

// 4. Integrated Cybersecurity Suite
export interface SecurityAlert {
  id: number;
  type: "phishing" | "breach" | "malware" | "suspicious_access" | "other";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  description: string;
  status: "new" | "investigating" | "resolved" | "false_positive";
  affectedSystems: string[];
  mitigationSteps: string[];
  responseTime: string;
}

export interface SecurityCompliance {
  id: number;
  framework: "australian_privacy" | "gdpr" | "pci_dss" | "iso_27001" | "custom";
  status: "compliant" | "non_compliant" | "partially_compliant";
  lastAudit: string;
  findings: string[];
  nextAuditDue: string;
  responsibleParty: string;
}

// 5. Multi-Modal Logistics Orchestration
export interface MultiModalRoute {
  id: number;
  name: string;
  status: "planned" | "in_progress" | "completed";
  originType: "warehouse" | "airport" | "port" | "distribution_center";
  destinationType: "warehouse" | "airport" | "port" | "distribution_center" | "customer";
  transportModes: TransportSegment[];
  totalDistance: string;
  totalDuration: string;
  totalCost: string;
  co2Emissions: string;
  reliability: number;
}

export interface TransportSegment {
  id: number;
  mode: "truck" | "drone" | "air_freight" | "rail" | "last_mile";
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  cost: string;
  status: "pending" | "in_transit" | "completed" | "delayed";
  carrier: string;
}

// 6. SME-Centric Customization and Affordability
export interface SMEClient {
  id: number;
  name: string;
  industry: string;
  size: "micro" | "small" | "medium";
  subscribedModules: string[];
  monthlyFee: number;
  onboardingDate: string;
  deploymentDuration: string;
  activeUsers: number;
  satisfaction: number;
  apiUsage: number;
}

export interface SubscriptionTier {
  id: number;
  name: string;
  price: number;
  billingCycle: "monthly" | "quarterly" | "annually";
  features: string[];
  maxUsers: number;
  apiCallLimit: number;
  storageLimit: string;
  supportLevel: "basic" | "standard" | "premium";
}

// 7. Digital Twin for Scenario Planning
export interface DigitalTwin {
  id: number;
  name: string;
  clientId: number;
  status: "initializing" | "active" | "simulating" | "archived";
  accuracy: number;
  lastUpdated: string;
  components: DigitalTwinComponent[];
  scenarios: DigitalTwinScenario[];
}

export interface DigitalTwinComponent {
  id: number;
  type: "warehouse" | "vehicle" | "supplier" | "route" | "distribution_center";
  name: string;
  properties: Record<string, any>;
  connections: number[];
}

export interface DigitalTwinScenario {
  id: number;
  name: string;
  description: string;
  parameters: Record<string, any>;
  results: DigitalTwinResult[];
  createdAt: string;
  status: "pending" | "running" | "completed" | "failed";
}

export interface DigitalTwinResult {
  metric: string;
  baseline: number;
  projected: number;
  change: string;
  confidence: number;
  recommendation: string;
}

// 8. Autonomous Fleet Integration
export interface AutonomousVehicle {
  id: number;
  name: string;
  type: "truck" | "drone" | "robot" | "cart";
  autonomyLevel: 1 | 2 | 3 | 4 | 5;
  status: "idle" | "loading" | "en_route" | "unloading" | "charging" | "maintenance";
  currentLocation: {
    lat: number;
    lng: number;
  };
  batteryLevel: number;
  nextMaintenance: string;
  currentRoute: number | null;
  cargoCapacity: string;
  operationalHours: number;
}

export interface FleetMetrics {
  totalVehicles: number;
  autonomousPercentage: number;
  averageUtilization: number;
  maintenanceEfficiency: number;
  fuelSavings: string;
  incidentRate: number;
  averageDeliveryTime: string;
}

// 9. Real-Time Client Dashboard with AI Insights
export interface DashboardInsight {
  id: number;
  title: string;
  description: string;
  insightType: "cost_saving" | "efficiency" | "risk" | "opportunity" | "trend";
  priority: "low" | "medium" | "high";
  relatedMetrics: string[];
  suggestedActions: string[];
  generatedAt: string;
}

export interface ClientDashboardSettings {
  id: number;
  clientId: number;
  visibleWidgets: string[];
  refreshInterval: number;
  alertThresholds: Record<string, number>;
  favoriteReports: number[];
  customKpis: string[];
}

// 10. Partnerships and Ecosystem Integration
export interface Partnership {
  id: number;
  partnerName: string;
  partnerType: "university" | "government" | "technology" | "logistics" | "other";
  status: "active" | "pending" | "completed";
  startDate: string;
  endDate: string | null;
  projectFocus: string[];
  contactPerson: string;
  dataShared: string[];
  benefitsRealized: string[];
}

export interface GrantApplication {
  id: number;
  name: string;
  organization: string;
  amount: number;
  status: "drafting" | "submitted" | "under_review" | "approved" | "rejected";
  submissionDate: string | null;
  decisionDate: string | null;
  projectTimeline: string;
  requiredDeliverables: string[];
}
