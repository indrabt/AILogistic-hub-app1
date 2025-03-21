import { users, type User, type InsertUser, type UserRole, type LoginUser } from "@shared/schema";
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
  ScenarioAnalysis,
  // Order Management imports
  Order,
  OrderItem,
  ReturnRequest,
  ReturnItem,
  // New features imports
  HyperLocalRoutingData,
  ConstructionZone,
  ResilienceForecast,
  InventoryRecommendation,
  SustainabilityMetrics,
  SustainabilityRecommendation,
  SecurityAlert,
  SecurityCompliance,
  MultiModalRoute,
  TransportSegment,
  SMEClient,
  SubscriptionTier,
  DigitalTwin,
  DigitalTwinComponent,
  DigitalTwinScenario,
  DigitalTwinResult,
  AutonomousVehicle,
  FleetMetrics,
  DashboardInsight,
  ClientDashboardSettings,
  Partnership,
  GrantApplication
} from "@shared/types";
import type {
  InboundOrder, InboundOrderItem, ReceivingDiscrepancy, PutAwayTask,
  InventoryItem, InventoryLocation, StorageLocation, InventoryMovement,
  PickTask, PickTaskItem, PickBatch, PackingTask, PackingTaskItem,
  ShipmentPackage, CycleCountTask, CycleCountItem, YardAppointment,
  DockDoor, CrossDockingTask, CrossDockingItem
} from "@shared/warehouse-types";

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
  
  // Order Management data
  getOrders(status?: string): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: Omit<Order, 'id'>): Promise<Order>;
  updateOrder(id: number, order: Partial<Order>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: Omit<OrderItem, 'id'>): Promise<OrderItem>;
  updateOrderItem(id: number, item: Partial<OrderItem>): Promise<OrderItem | undefined>;
  
  getReturnRequests(status?: string): Promise<ReturnRequest[]>;
  getReturnRequestById(id: number): Promise<ReturnRequest | undefined>;
  createReturnRequest(request: Omit<ReturnRequest, 'id'>): Promise<ReturnRequest>;
  updateReturnRequest(id: number, request: Partial<ReturnRequest>): Promise<ReturnRequest | undefined>;
  
  getReturnItems(returnId: number): Promise<ReturnItem[]>;
  createReturnItem(item: Omit<ReturnItem, 'id'>): Promise<ReturnItem>;
  updateReturnItem(id: number, item: Partial<ReturnItem>): Promise<ReturnItem | undefined>;
  
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

  // 1. Hyper-Local Route Optimization with Real-Time Adaptation
  getHyperLocalRoutes(): Promise<HyperLocalRoutingData[]>;
  getHyperLocalRouteById(id: number): Promise<HyperLocalRoutingData | undefined>;
  getConstructionZones(region?: string): Promise<ConstructionZone[]>;
  updateRouteWithRealTimeData(routeId: number, data: Partial<HyperLocalRoutingData>): Promise<HyperLocalRoutingData>;
  
  // 2. Predictive Supply Chain Resilience
  getResilienceForecasts(): Promise<ResilienceForecast[]>;
  getResilienceForecastById(id: number): Promise<ResilienceForecast | undefined>;
  getInventoryRecommendations(forecastId?: number): Promise<InventoryRecommendation[]>;
  createResilienceForecast(forecast: Omit<ResilienceForecast, 'id'>): Promise<ResilienceForecast>;
  
  // 3. Sustainable AI-Driven Operations
  getSustainabilityMetrics(): Promise<SustainabilityMetrics>;
  getSustainabilityRecommendations(): Promise<SustainabilityRecommendation[]>;
  updateSustainabilityMetrics(metrics: Partial<SustainabilityMetrics>): Promise<SustainabilityMetrics>;
  
  // 4. Integrated Cybersecurity Suite
  getSecurityAlerts(status?: string): Promise<SecurityAlert[]>;
  updateSecurityAlert(id: number, update: Partial<SecurityAlert>): Promise<SecurityAlert | undefined>;
  getSecurityCompliance(): Promise<SecurityCompliance[]>;
  
  // 5. Multi-Modal Logistics Orchestration
  getMultiModalRoutes(): Promise<MultiModalRoute[]>;
  getMultiModalRouteById(id: number): Promise<MultiModalRoute | undefined>;
  getTransportSegments(routeId: number): Promise<TransportSegment[]>;
  createMultiModalRoute(route: Omit<MultiModalRoute, 'id'>): Promise<MultiModalRoute>;
  
  // 6. SME-Centric Customization and Affordability
  getSMEClients(): Promise<SMEClient[]>;
  getSMEClientById(id: number): Promise<SMEClient | undefined>;
  getSubscriptionTiers(): Promise<SubscriptionTier[]>;
  
  // 7. Digital Twin for Scenario Planning
  getDigitalTwins(clientId?: number): Promise<DigitalTwin[]>;
  getDigitalTwinById(id: number): Promise<DigitalTwin | undefined>;
  runDigitalTwinScenario(twinId: number, scenario: Omit<DigitalTwinScenario, 'id' | 'results'>): Promise<DigitalTwinScenario>;
  
  // 8. Autonomous Fleet Integration
  getAutonomousVehicles(): Promise<AutonomousVehicle[]>;
  getAutonomousVehicleById(id: number): Promise<AutonomousVehicle | undefined>;
  getFleetMetrics(): Promise<FleetMetrics>;
  updateAutonomousVehicle(id: number, update: Partial<AutonomousVehicle>): Promise<AutonomousVehicle | undefined>;
  
  // 9. Real-Time Client Dashboard with AI Insights
  getDashboardInsights(clientId?: number): Promise<DashboardInsight[]>;
  getClientDashboardSettings(clientId: number): Promise<ClientDashboardSettings | undefined>;
  updateClientDashboardSettings(clientId: number, settings: Partial<ClientDashboardSettings>): Promise<ClientDashboardSettings | undefined>;
  
  // 10. Partnerships and Ecosystem Integration
  getPartnerships(): Promise<Partnership[]>;
  getPartnershipById(id: number): Promise<Partnership | undefined>;
  getGrantApplications(status?: string): Promise<GrantApplication[]>;
  createPartnership(partnership: Omit<Partnership, 'id'>): Promise<Partnership>;
  
  // Warehouse Management System APIs
  
  // 1. Receiving Feature
  getInboundOrders(status?: string): Promise<InboundOrder[]>;
  getInboundOrderById(id: number): Promise<InboundOrder | undefined>;
  createInboundOrder(order: Omit<InboundOrder, 'id'>): Promise<InboundOrder>;
  updateInboundOrder(id: number, order: Partial<InboundOrder>): Promise<InboundOrder | undefined>;
  deleteInboundOrder(id: number): Promise<boolean>;
  
  getInboundOrderItems(orderId: number): Promise<InboundOrderItem[]>;
  createInboundOrderItem(item: Omit<InboundOrderItem, 'id'>): Promise<InboundOrderItem>;
  updateInboundOrderItem(id: number, item: Partial<InboundOrderItem>): Promise<InboundOrderItem | undefined>;
  
  getReceivingDiscrepancies(itemId: number): Promise<ReceivingDiscrepancy[]>;
  createReceivingDiscrepancy(discrepancy: Omit<ReceivingDiscrepancy, 'id'>): Promise<ReceivingDiscrepancy>;
  updateReceivingDiscrepancy(id: number, discrepancy: Partial<ReceivingDiscrepancy>): Promise<ReceivingDiscrepancy | undefined>;
  
  // 2. Put-Away Feature
  getPutAwayTasks(status?: string): Promise<PutAwayTask[]>;
  getPutAwayTaskById(id: number): Promise<PutAwayTask | undefined>;
  createPutAwayTask(task: Omit<PutAwayTask, 'id'>): Promise<PutAwayTask>;
  updatePutAwayTask(id: number, task: Partial<PutAwayTask>): Promise<PutAwayTask | undefined>;
  completePutAwayTask(id: number, locationId: number): Promise<PutAwayTask | undefined>;
  
  // 3. Inventory Tracking Feature
  getInventoryItems(category?: string): Promise<InventoryItem[]>;
  getInventoryItemById(id: number): Promise<InventoryItem | undefined>;
  getInventoryItemBySku(sku: string): Promise<InventoryItem | undefined>;
  updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | undefined>;
  
  getInventoryLocations(itemId: number): Promise<InventoryLocation[]>;
  getInventoryItemsByLocation(locationId: number): Promise<InventoryLocation[]>;
  
  getStorageLocations(status?: string): Promise<StorageLocation[]>;
  getStorageLocationById(id: number): Promise<StorageLocation | undefined>;
  updateStorageLocation(id: number, location: Partial<StorageLocation>): Promise<StorageLocation | undefined>;
  
  getInventoryMovements(itemId?: number, type?: string): Promise<InventoryMovement[]>;
  createInventoryMovement(movement: Omit<InventoryMovement, 'id'>): Promise<InventoryMovement>;
  
  // 4. Picking Feature
  getPickTasks(status?: string): Promise<PickTask[]>;
  getPickTaskById(id: number): Promise<PickTask | undefined>;
  createPickTask(task: Omit<PickTask, 'id'>): Promise<PickTask>;
  updatePickTask(id: number, task: Partial<PickTask>): Promise<PickTask | undefined>;
  
  getPickTaskItems(taskId: number): Promise<PickTaskItem[]>;
  updatePickTaskItem(id: number, item: Partial<PickTaskItem>): Promise<PickTaskItem | undefined>;
  completePickTaskItem(id: number, pickedQuantity: number, locationId: number): Promise<PickTaskItem | undefined>;
  
  getPickBatches(status?: string): Promise<PickBatch[]>;
  createPickBatch(batch: Omit<PickBatch, 'id'>): Promise<PickBatch>;
  
  // 5. Packing Feature
  getPackingTasks(status?: string): Promise<PackingTask[]>;
  getPackingTaskById(id: number): Promise<PackingTask | undefined>;
  createPackingTask(task: Omit<PackingTask, 'id'>): Promise<PackingTask>;
  updatePackingTask(id: number, task: Partial<PackingTask>): Promise<PackingTask | undefined>;
  
  getPackingTaskItems(taskId: number): Promise<PackingTaskItem[]>;
  updatePackingTaskItem(id: number, item: Partial<PackingTaskItem>): Promise<PackingTaskItem | undefined>;
  
  getShipmentPackages(packingTaskId: number): Promise<ShipmentPackage[]>;
  createShipmentPackage(pkg: Omit<ShipmentPackage, 'id'>): Promise<ShipmentPackage>;
  updateShipmentPackage(id: number, pkg: Partial<ShipmentPackage>): Promise<ShipmentPackage | undefined>;
  
  // 6. Shipping Feature
  getShipments(status?: string): Promise<Shipment[]>;
  getShipmentById(id: number): Promise<Shipment | undefined>;
  getShipmentByOrderId(orderId: number): Promise<Shipment | undefined>;
  createShipment(shipment: Omit<Shipment, 'id'>): Promise<Shipment>;
  updateShipment(id: number, shipment: Partial<Shipment>): Promise<Shipment | undefined>;
  
  getShippingAddresses(shipmentId: number): Promise<ShippingAddress[]>;
  getShippingAddressById(id: number): Promise<ShippingAddress | undefined>;
  createShippingAddress(address: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress>;
  updateShippingAddress(id: number, address: Partial<ShippingAddress>): Promise<ShippingAddress | undefined>;
  
  getShippingCarriers(): Promise<ShippingCarrier[]>;
  getShippingCarrierById(id: number): Promise<ShippingCarrier | undefined>;
  getShippingServices(carrierId: number): Promise<ShippingService[]>;
  getShippingServiceById(id: number): Promise<ShippingService | undefined>;
  
  generateShippingManifest(shipmentId: number): Promise<{url: string}>;
  confirmShipment(shipmentId: number): Promise<Shipment | undefined>;
}

export class MemStorage implements IStorage {
  // Order Management methods
  async getOrders(status?: string): Promise<Order[]> {
    if (status) {
      return this.orders.filter(order => order.status === status);
    }
    return this.orders;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.find(order => order.id === id);
  }

  async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: this.orders.length > 0 ? Math.max(...this.orders.map(o => o.id)) + 1 : 1
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<Order>): Promise<Order | undefined> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return undefined;
    
    this.orders[index] = {
      ...this.orders[index],
      ...order
    };
    return this.orders[index];
  }

  async deleteOrder(id: number): Promise<boolean> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return false;
    
    this.orders.splice(index, 1);
    return true;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const order = await this.getOrderById(orderId);
    return order ? order.items : [];
  }

  async createOrderItem(item: Omit<OrderItem, 'id'>): Promise<OrderItem> {
    const newItem: OrderItem = {
      ...item,
      id: this.orderItems.length > 0 ? Math.max(...this.orderItems.map(i => i.id)) + 1 : 1
    };
    this.orderItems.push(newItem);
    return newItem;
  }

  async updateOrderItem(id: number, item: Partial<OrderItem>): Promise<OrderItem | undefined> {
    const index = this.orderItems.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    
    this.orderItems[index] = {
      ...this.orderItems[index],
      ...item
    };
    return this.orderItems[index];
  }

  async getReturnRequests(status?: string): Promise<ReturnRequest[]> {
    if (status) {
      return this.returnRequests.filter(request => request.status === status);
    }
    return this.returnRequests;
  }

  async getReturnRequestById(id: number): Promise<ReturnRequest | undefined> {
    return this.returnRequests.find(request => request.id === id);
  }

  async createReturnRequest(request: Omit<ReturnRequest, 'id'>): Promise<ReturnRequest> {
    const newRequest: ReturnRequest = {
      ...request,
      id: this.returnRequests.length > 0 ? Math.max(...this.returnRequests.map(r => r.id)) + 1 : 1
    };
    this.returnRequests.push(newRequest);
    return newRequest;
  }

  async updateReturnRequest(id: number, request: Partial<ReturnRequest>): Promise<ReturnRequest | undefined> {
    const index = this.returnRequests.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    
    this.returnRequests[index] = {
      ...this.returnRequests[index],
      ...request
    };
    return this.returnRequests[index];
  }

  async getReturnItems(returnId: number): Promise<ReturnItem[]> {
    const returnRequest = await this.getReturnRequestById(returnId);
    return returnRequest ? returnRequest.items : [];
  }

  async createReturnItem(item: Omit<ReturnItem, 'id'>): Promise<ReturnItem> {
    const newItem: ReturnItem = {
      ...item,
      id: this.returnItems.length > 0 ? Math.max(...this.returnItems.map(i => i.id)) + 1 : 1
    };
    this.returnItems.push(newItem);
    return newItem;
  }

  async updateReturnItem(id: number, item: Partial<ReturnItem>): Promise<ReturnItem | undefined> {
    const index = this.returnItems.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    
    this.returnItems[index] = {
      ...this.returnItems[index],
      ...item
    };
    return this.returnItems[index];
  }

  // Warehouse Management System Methods - Receiving Feature
  
  async getInboundOrders(status?: string): Promise<InboundOrder[]> {
    if (status) {
      return this.inboundOrders.filter(order => order.status === status);
    }
    return this.inboundOrders;
  }

  async getInboundOrderById(id: number): Promise<InboundOrder | undefined> {
    return this.inboundOrders.find(order => order.id === id);
  }

  async createInboundOrder(order: Omit<InboundOrder, 'id'>): Promise<InboundOrder> {
    const newOrder: InboundOrder = {
      ...order,
      id: this.inboundOrders.length > 0 ? Math.max(...this.inboundOrders.map(o => o.id)) + 1 : 1,
      items: order.items || []
    };
    this.inboundOrders.push(newOrder);
    return newOrder;
  }

  async updateInboundOrder(id: number, order: Partial<InboundOrder>): Promise<InboundOrder | undefined> {
    const index = this.inboundOrders.findIndex(o => o.id === id);
    if (index === -1) return undefined;
    
    this.inboundOrders[index] = {
      ...this.inboundOrders[index],
      ...order
    };
    return this.inboundOrders[index];
  }

  async deleteInboundOrder(id: number): Promise<boolean> {
    const index = this.inboundOrders.findIndex(o => o.id === id);
    if (index === -1) return false;
    
    this.inboundOrders.splice(index, 1);
    // Also delete associated items
    this.inboundOrderItems = this.inboundOrderItems.filter(item => item.inboundOrderId !== id);
    return true;
  }

  async getInboundOrderItems(orderId: number): Promise<InboundOrderItem[]> {
    return this.inboundOrderItems.filter(item => item.inboundOrderId === orderId);
  }

  async createInboundOrderItem(item: Omit<InboundOrderItem, 'id'>): Promise<InboundOrderItem> {
    const newItem: InboundOrderItem = {
      ...item,
      id: this.inboundOrderItems.length > 0 ? Math.max(...this.inboundOrderItems.map(i => i.id)) + 1 : 1,
      discrepancies: item.discrepancies || []
    };
    this.inboundOrderItems.push(newItem);
    
    // Update the inbound order's items array
    const order = this.inboundOrders.find(o => o.id === item.inboundOrderId);
    if (order) {
      order.items.push(newItem);
    }
    
    return newItem;
  }

  async updateInboundOrderItem(id: number, item: Partial<InboundOrderItem>): Promise<InboundOrderItem | undefined> {
    const index = this.inboundOrderItems.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    
    this.inboundOrderItems[index] = {
      ...this.inboundOrderItems[index],
      ...item
    };
    
    // Update the item in the inbound order's items array
    const order = this.inboundOrders.find(o => o.id === this.inboundOrderItems[index].inboundOrderId);
    if (order) {
      const orderItemIndex = order.items.findIndex(i => i.id === id);
      if (orderItemIndex !== -1) {
        order.items[orderItemIndex] = this.inboundOrderItems[index];
      }
    }
    
    return this.inboundOrderItems[index];
  }

  async getReceivingDiscrepancies(itemId: number): Promise<ReceivingDiscrepancy[]> {
    return this.receivingDiscrepancies.filter(d => d.inboundOrderItemId === itemId);
  }

  async createReceivingDiscrepancy(discrepancy: Omit<ReceivingDiscrepancy, 'id'>): Promise<ReceivingDiscrepancy> {
    const newDiscrepancy: ReceivingDiscrepancy = {
      ...discrepancy,
      id: this.receivingDiscrepancies.length > 0 ? Math.max(...this.receivingDiscrepancies.map(d => d.id)) + 1 : 1
    };
    this.receivingDiscrepancies.push(newDiscrepancy);
    
    // Update the inbound order item's discrepancies array
    const item = this.inboundOrderItems.find(i => i.id === discrepancy.inboundOrderItemId);
    if (item) {
      item.discrepancies.push(newDiscrepancy);
    }
    
    return newDiscrepancy;
  }

  async updateReceivingDiscrepancy(id: number, discrepancy: Partial<ReceivingDiscrepancy>): Promise<ReceivingDiscrepancy | undefined> {
    const index = this.receivingDiscrepancies.findIndex(d => d.id === id);
    if (index === -1) return undefined;
    
    this.receivingDiscrepancies[index] = {
      ...this.receivingDiscrepancies[index],
      ...discrepancy
    };
    
    // Update the discrepancy in the inbound order item's discrepancies array
    const item = this.inboundOrderItems.find(i => i.id === this.receivingDiscrepancies[index].inboundOrderItemId);
    if (item) {
      const discrepancyIndex = item.discrepancies.findIndex(d => d.id === id);
      if (discrepancyIndex !== -1) {
        item.discrepancies[discrepancyIndex] = this.receivingDiscrepancies[index];
      }
    }
    
    return this.receivingDiscrepancies[index];
  }
  
  // Warehouse Management System Methods - Put-Away Feature
  
  async getPutAwayTasks(status?: string): Promise<PutAwayTask[]> {
    if (status) {
      return this.putAwayTasks.filter(task => task.status === status);
    }
    return this.putAwayTasks;
  }

  async getPutAwayTaskById(id: number): Promise<PutAwayTask | undefined> {
    return this.putAwayTasks.find(task => task.id === id);
  }

  async createPutAwayTask(task: Omit<PutAwayTask, 'id'>): Promise<PutAwayTask> {
    const newTask: PutAwayTask = {
      ...task,
      id: this.putAwayTasks.length > 0 ? Math.max(...this.putAwayTasks.map(t => t.id)) + 1 : 1
    };
    this.putAwayTasks.push(newTask);
    return newTask;
  }

  async updatePutAwayTask(id: number, task: Partial<PutAwayTask>): Promise<PutAwayTask | undefined> {
    const index = this.putAwayTasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    this.putAwayTasks[index] = {
      ...this.putAwayTasks[index],
      ...task
    };
    return this.putAwayTasks[index];
  }

  async completePutAwayTask(id: number, locationId: number): Promise<PutAwayTask | undefined> {
    const task = await this.getPutAwayTaskById(id);
    if (!task) return undefined;
    
    const location = await this.getStorageLocationById(locationId);
    if (!location) return undefined;
    
    // Update task status
    task.status = "completed";
    task.actualLocation = location;
    task.completedAt = new Date().toISOString();
    
    // Create inventory movement record
    await this.createInventoryMovement({
      inventoryItemId: 0, // This would need to be the actual inventory item ID
      fromLocationId: 4, // Assuming Receiving Area has ID 4
      toLocationId: locationId,
      quantity: task.quantity,
      type: "put_away",
      referenceNumber: `PUTAWAY-${id}`,
      referenceType: "put_away_task",
      performedBy: task.assignedTo || "system",
      performedAt: task.completedAt,
      notes: `Put-away task ${id} completed`
    });
    
    return task;
  }
  
  // Warehouse Management System Methods - Inventory Tracking Feature
  
  async getInventoryItems(category?: string): Promise<InventoryItem[]> {
    if (category) {
      return this.inventoryItems.filter(item => item.category === category);
    }
    return this.inventoryItems;
  }

  async getInventoryItemById(id: number): Promise<InventoryItem | undefined> {
    return this.inventoryItems.find(item => item.id === id);
  }

  async getInventoryItemBySku(sku: string): Promise<InventoryItem | undefined> {
    return this.inventoryItems.find(item => item.sku === sku);
  }

  async updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const index = this.inventoryItems.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    
    this.inventoryItems[index] = {
      ...this.inventoryItems[index],
      ...item
    };
    return this.inventoryItems[index];
  }

  async getInventoryLocations(itemId: number): Promise<InventoryLocation[]> {
    return this.inventoryLocations.filter(loc => loc.inventoryItemId === itemId);
  }

  async getInventoryItemsByLocation(locationId: number): Promise<InventoryLocation[]> {
    return this.inventoryLocations.filter(loc => loc.locationId === locationId);
  }

  async getStorageLocations(status?: string): Promise<StorageLocation[]> {
    if (status) {
      return this.storageLocations.filter(loc => loc.status === status);
    }
    return this.storageLocations;
  }

  async getStorageLocationById(id: number): Promise<StorageLocation | undefined> {
    return this.storageLocations.find(loc => loc.id === id);
  }

  async updateStorageLocation(id: number, location: Partial<StorageLocation>): Promise<StorageLocation | undefined> {
    const index = this.storageLocations.findIndex(l => l.id === id);
    if (index === -1) return undefined;
    
    this.storageLocations[index] = {
      ...this.storageLocations[index],
      ...location
    };
    return this.storageLocations[index];
  }

  async getInventoryMovements(itemId?: number, type?: string): Promise<InventoryMovement[]> {
    let movements = this.inventoryMovements;
    
    if (itemId) {
      movements = movements.filter(m => m.inventoryItemId === itemId);
    }
    
    if (type) {
      movements = movements.filter(m => m.type === type);
    }
    
    return movements;
  }

  async createInventoryMovement(movement: Omit<InventoryMovement, 'id'>): Promise<InventoryMovement> {
    const newMovement: InventoryMovement = {
      ...movement,
      id: this.inventoryMovements.length > 0 ? Math.max(...this.inventoryMovements.map(m => m.id)) + 1 : 1
    };
    this.inventoryMovements.push(newMovement);
    return newMovement;
  }
  
  // Warehouse Management System Methods - Picking Feature
  
  async getPickTasks(status?: string): Promise<PickTask[]> {
    if (status) {
      return this.pickTasks.filter(task => task.status === status);
    }
    return this.pickTasks;
  }

  async getPickTaskById(id: number): Promise<PickTask | undefined> {
    return this.pickTasks.find(task => task.id === id);
  }

  async createPickTask(task: Omit<PickTask, 'id'>): Promise<PickTask> {
    const newTask: PickTask = {
      ...task,
      id: this.pickTasks.length > 0 ? Math.max(...this.pickTasks.map(t => t.id)) + 1 : 1,
      items: task.items || []
    };
    this.pickTasks.push(newTask);
    return newTask;
  }

  async updatePickTask(id: number, task: Partial<PickTask>): Promise<PickTask | undefined> {
    const index = this.pickTasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    this.pickTasks[index] = {
      ...this.pickTasks[index],
      ...task
    };
    return this.pickTasks[index];
  }

  async getPickTaskItems(taskId: number): Promise<PickTaskItem[]> {
    const task = await this.getPickTaskById(taskId);
    return task ? task.items : [];
  }

  async updatePickTaskItem(id: number, item: Partial<PickTaskItem>): Promise<PickTaskItem | undefined> {
    // First, find which pick task contains this item
    let targetTask: PickTask | undefined;
    let itemIndex = -1;
    
    for (const task of this.pickTasks) {
      itemIndex = task.items.findIndex(i => i.id === id);
      if (itemIndex !== -1) {
        targetTask = task;
        break;
      }
    }
    
    if (!targetTask || itemIndex === -1) return undefined;
    
    // Update the item
    targetTask.items[itemIndex] = {
      ...targetTask.items[itemIndex],
      ...item
    };
    
    return targetTask.items[itemIndex];
  }

  async completePickTaskItem(id: number, pickedQuantity: number, locationId: number): Promise<PickTaskItem | undefined> {
    // First, find which pick task contains this item
    let targetTask: PickTask | undefined;
    let itemIndex = -1;
    
    for (const task of this.pickTasks) {
      itemIndex = task.items.findIndex(i => i.id === id);
      if (itemIndex !== -1) {
        targetTask = task;
        break;
      }
    }
    
    if (!targetTask || itemIndex === -1) return undefined;
    
    // Update the item status
    targetTask.items[itemIndex].status = pickedQuantity >= targetTask.items[itemIndex].quantity ? "picked" : "partial";
    targetTask.items[itemIndex].pickedQuantity = pickedQuantity;
    targetTask.items[itemIndex].pickedLocationId = locationId;
    targetTask.items[itemIndex].pickedAt = new Date().toISOString();
    
    // Create inventory movement record
    await this.createInventoryMovement({
      inventoryItemId: 0, // This would need to be the actual inventory item ID
      fromLocationId: locationId,
      toLocationId: undefined, // To be determined at packing stage
      quantity: pickedQuantity,
      type: "picking",
      referenceNumber: `PICK-${targetTask.id}-${id}`,
      referenceType: "pick_task",
      performedBy: targetTask.assignedTo || "system",
      performedAt: targetTask.items[itemIndex].pickedAt!,
      notes: `Pick task item ${id} completed with quantity ${pickedQuantity}`
    });
    
    // Check if all items in the task are picked
    const allItemsCompleted = targetTask.items.every(i => i.status === "picked" || i.status === "unavailable");
    if (allItemsCompleted) {
      targetTask.status = "completed";
      targetTask.completedAt = new Date().toISOString();
    }
    
    return targetTask.items[itemIndex];
  }

  async getPickBatches(status?: string): Promise<PickBatch[]> {
    if (status) {
      return this.pickBatches.filter(batch => batch.status === status);
    }
    return this.pickBatches;
  }

  async createPickBatch(batch: Omit<PickBatch, 'id'>): Promise<PickBatch> {
    const newBatch: PickBatch = {
      ...batch,
      id: this.pickBatches.length > 0 ? Math.max(...this.pickBatches.map(b => b.id)) + 1 : 1,
      tasks: batch.tasks || []
    };
    this.pickBatches.push(newBatch);
    return newBatch;
  }
  
  // Warehouse Management System Methods - Packing Feature
  
  async getPackingTasks(status?: string): Promise<PackingTask[]> {
    if (status) {
      return this.packingTasks.filter(task => task.status === status);
    }
    return this.packingTasks;
  }

  async getPackingTaskById(id: number): Promise<PackingTask | undefined> {
    return this.packingTasks.find(task => task.id === id);
  }

  async createPackingTask(task: Omit<PackingTask, 'id'>): Promise<PackingTask> {
    const newTask: PackingTask = {
      ...task,
      id: this.packingTasks.length > 0 ? Math.max(...this.packingTasks.map(t => t.id)) + 1 : 1,
      items: task.items || [],
      packages: task.packages || []
    };
    this.packingTasks.push(newTask);
    return newTask;
  }

  async updatePackingTask(id: number, task: Partial<PackingTask>): Promise<PackingTask | undefined> {
    const index = this.packingTasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    this.packingTasks[index] = {
      ...this.packingTasks[index],
      ...task
    };
    return this.packingTasks[index];
  }

  async getPackingTaskItems(taskId: number): Promise<PackingTaskItem[]> {
    const task = await this.getPackingTaskById(taskId);
    return task ? task.items : [];
  }

  async updatePackingTaskItem(id: number, item: Partial<PackingTaskItem>): Promise<PackingTaskItem | undefined> {
    // First, find which packing task contains this item
    let targetTask: PackingTask | undefined;
    let itemIndex = -1;
    
    for (const task of this.packingTasks) {
      itemIndex = task.items.findIndex(i => i.id === id);
      if (itemIndex !== -1) {
        targetTask = task;
        break;
      }
    }
    
    if (!targetTask || itemIndex === -1) return undefined;
    
    // Update the item
    targetTask.items[itemIndex] = {
      ...targetTask.items[itemIndex],
      ...item
    };
    
    return targetTask.items[itemIndex];
  }

  async getShipmentPackages(packingTaskId: number): Promise<ShipmentPackage[]> {
    const task = await this.getPackingTaskById(packingTaskId);
    return task ? task.packages : [];
  }

  async createShipmentPackage(pkg: Omit<ShipmentPackage, 'id'>): Promise<ShipmentPackage> {
    const newPackage: ShipmentPackage = {
      ...pkg,
      id: this.shipmentPackages.length > 0 ? Math.max(...this.shipmentPackages.map(p => p.id)) + 1 : 1
    };
    this.shipmentPackages.push(newPackage);
    
    // Add package to the packing task
    const task = this.packingTasks.find(t => t.id === pkg.packingTaskId);
    if (task) {
      task.packages.push(newPackage);
    }
    
    return newPackage;
  }

  async updateShipmentPackage(id: number, pkg: Partial<ShipmentPackage>): Promise<ShipmentPackage | undefined> {
    const index = this.shipmentPackages.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.shipmentPackages[index] = {
      ...this.shipmentPackages[index],
      ...pkg
    };
    
    // Update the package in the packing task's packages array
    const task = this.packingTasks.find(t => t.id === this.shipmentPackages[index].packingTaskId);
    if (task) {
      const packageIndex = task.packages.findIndex(p => p.id === id);
      if (packageIndex !== -1) {
        task.packages[packageIndex] = this.shipmentPackages[index];
      }
    }
    
    return this.shipmentPackages[index];
  }
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
  
  // Order Management data
  private orders: Order[];
  private orderItems: OrderItem[];
  private returnRequests: ReturnRequest[];
  private returnItems: ReturnItem[];
  
  // AI Predictive Analytics data
  private predictiveModels: PredictiveModel[];
  private modelPredictions: ModelPrediction[];
  private anomalyDetections: AnomalyDetection[];
  private scenarioAnalyses: ScenarioAnalysis[];
  
  // 1. Hyper-Local Route Optimization with Real-Time Adaptation
  private hyperLocalRoutes: HyperLocalRoutingData[];
  private constructionZones: ConstructionZone[];
  
  // 2. Predictive Supply Chain Resilience
  private resilienceForecasts: ResilienceForecast[];
  private inventoryRecommendations: InventoryRecommendation[];
  
  // Warehouse Management System data
  private inboundOrders: InboundOrder[];
  private inboundOrderItems: InboundOrderItem[];
  private receivingDiscrepancies: ReceivingDiscrepancy[];
  private putAwayTasks: PutAwayTask[];
  private inventoryItems: InventoryItem[];
  private inventoryLocations: InventoryLocation[];
  private storageLocations: StorageLocation[];
  private inventoryMovements: InventoryMovement[];
  private pickTasks: PickTask[];
  private pickTaskItems: PickTaskItem[];
  private pickBatches: PickBatch[];
  private packingTasks: PackingTask[];
  private packingTaskItems: PackingTaskItem[];
  private shipmentPackages: ShipmentPackage[];
  
  // 3. Sustainable AI-Driven Operations
  private sustainabilityMetrics: SustainabilityMetrics;
  private sustainabilityRecommendations: SustainabilityRecommendation[];
  
  // 4. Integrated Cybersecurity Suite
  private securityAlerts: SecurityAlert[];
  private securityCompliance: SecurityCompliance[];
  
  // 5. Multi-Modal Logistics Orchestration
  private multiModalRoutes: MultiModalRoute[];
  private transportSegments: TransportSegment[];
  
  // 6. SME-Centric Customization and Affordability
  private smeClients: SMEClient[];
  private subscriptionTiers: SubscriptionTier[];
  
  // 7. Digital Twin for Scenario Planning
  private digitalTwins: DigitalTwin[];
  
  // 8. Autonomous Fleet Integration
  private autonomousVehicles: AutonomousVehicle[];
  private fleetMetrics: FleetMetrics;
  
  // 9. Real-Time Client Dashboard with AI Insights
  private dashboardInsights: DashboardInsight[];
  private clientDashboardSettings: ClientDashboardSettings[];
  
  // 10. Partnerships and Ecosystem Integration
  private partnerships: Partnership[];
  private grantApplications: GrantApplication[];
  
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 6; // Start with ID 6 to account for our 5 predefined users
    
    // Initialize Warehouse Management System arrays with sample data
    
    // Initialize storage locations
    this.storageLocations = [
      {
        id: 1,
        name: "Aisle A - Rack 1",
        type: "rack",
        aisle: "A",
        rack: "1",
        capacity: 1000,
        capacityUnit: "kg",
        currentUtilization: 600,
        status: "available"
      },
      {
        id: 2,
        name: "Aisle A - Rack 2",
        type: "rack",
        aisle: "A",
        rack: "2",
        capacity: 1000,
        capacityUnit: "kg",
        currentUtilization: 800,
        status: "available"
      },
      {
        id: 3,
        name: "Aisle B - Rack 1",
        type: "rack",
        aisle: "B",
        rack: "1",
        capacity: 1000,
        capacityUnit: "kg",
        currentUtilization: 300,
        status: "available"
      },
      {
        id: 4,
        name: "Receiving Area",
        type: "staging",
        capacity: 5000,
        capacityUnit: "kg",
        currentUtilization: 1000,
        status: "available"
      }
    ];
    
    // Initialize inbound orders
    this.inboundOrders = [
      {
        id: 1,
        orderNumber: "INB-2025-0001",
        supplierName: "Tech Components Ltd",
        supplierReference: "PO-2025-56789",
        expectedDeliveryDate: "2025-03-21",
        status: "pending",
        createdAt: new Date().toISOString(),
        createdBy: "warehouse1",
        notes: "Priority electronics delivery",
        items: []
      },
      {
        id: 2,
        orderNumber: "INB-2025-0002",
        supplierName: "Office Supplies Co",
        supplierReference: "PO-2025-12345",
        expectedDeliveryDate: "2025-03-22",
        status: "pending",
        createdAt: new Date().toISOString(),
        createdBy: "warehouse1",
        items: []
      }
    ];
    
    // Initialize inbound order items
    this.inboundOrderItems = [
      {
        id: 1,
        inboundOrderId: 1,
        sku: "TECH-MON-24",
        productName: "24-inch Monitor",
        expectedQuantity: 20,
        receivedQuantity: 0,
        status: "pending",
        discrepancies: []
      },
      {
        id: 2,
        inboundOrderId: 1,
        sku: "TECH-KB-01",
        productName: "Wireless Keyboard",
        expectedQuantity: 30,
        receivedQuantity: 0,
        status: "pending",
        discrepancies: []
      },
      {
        id: 3,
        inboundOrderId: 2,
        sku: "OFF-PAPER-A4",
        productName: "A4 Paper (Reams)",
        expectedQuantity: 50,
        receivedQuantity: 0,
        status: "pending",
        discrepancies: []
      }
    ];
    
    // Link inbound order items to their orders
    this.inboundOrders[0].items = [this.inboundOrderItems[0], this.inboundOrderItems[1]];
    this.inboundOrders[1].items = [this.inboundOrderItems[2]];
    
    // Initialize empty arrays for other warehouse data
    this.receivingDiscrepancies = [];
    this.putAwayTasks = [];
    this.inventoryItems = [];
    this.inventoryLocations = [];
    this.inventoryMovements = [];
    this.pickTasks = [];
    this.pickTaskItems = [];
    this.pickBatches = [];
    this.packingTasks = [];
    this.packingTaskItems = [];
    this.shipmentPackages = [];
    
    // Initialize Order Management arrays with sample data
    this.orders = [
      {
        id: 1,
        orderNumber: "ORD-2025-0001",
        customerName: "Sydney Tech Solutions",
        customerType: "wholesale",
        customerLocation: "Sydney CBD",
        createdAt: "2025-03-15T09:30:00",
        status: "processing",
        items: [],
        totalValue: 4250.00,
        priority: "express",
        notes: "Requires special handling for electronics",
        estimatedDeliveryDate: "2025-03-20",
        paymentStatus: "paid",
        invoiceNumber: "INV-2025-0001"
      },
      {
        id: 2,
        orderNumber: "ORD-2025-0002",
        customerName: "Western Sydney Retail",
        customerType: "retail",
        customerLocation: "Penrith",
        createdAt: "2025-03-16T11:45:00",
        status: "pending",
        items: [],
        totalValue: 1875.50,
        priority: "standard",
        estimatedDeliveryDate: "2025-03-22",
        paymentStatus: "pending",
      },
      {
        id: 3,
        orderNumber: "ORD-2025-0003",
        customerName: "Parramatta Medical Supplies",
        customerType: "distributor",
        customerLocation: "Parramatta",
        createdAt: "2025-03-17T08:15:00",
        status: "shipped",
        items: [],
        totalValue: 6430.75,
        priority: "urgent",
        estimatedDeliveryDate: "2025-03-19",
        actualDeliveryDate: undefined,
        assignedShipmentId: "SHP-2025-0045",
        paymentStatus: "paid",
        invoiceNumber: "INV-2025-0003"
      }
    ];
    
    this.orderItems = [
      {
        id: 1,
        productId: 101,
        productName: "Enterprise Server X7",
        productSKU: "SVR-X7-1TB",
        quantity: 2,
        unitPrice: 1250.00,
        totalPrice: 2500.00,
        warehouseLocation: "Sydney-W-A12",
        status: "allocated"
      },
      {
        id: 2,
        productId: 102,
        productName: "Network Switch Pro",
        productSKU: "NSW-P-24PT",
        quantity: 5,
        unitPrice: 350.00,
        totalPrice: 1750.00,
        warehouseLocation: "Sydney-W-B08",
        status: "allocated"
      },
      {
        id: 3,
        productId: 203,
        productName: "Retail POS Terminal",
        productSKU: "POS-T3-STD",
        quantity: 3,
        unitPrice: 625.50,
        totalPrice: 1876.50,
        warehouseLocation: "Penrith-E-C14",
        status: "pending"
      },
      {
        id: 4,
        productId: 305,
        productName: "Medical-Grade Tablet",
        productSKU: "MED-TAB-12",
        quantity: 10,
        unitPrice: 529.95,
        totalPrice: 5299.50,
        warehouseLocation: "Sydney-N-D22",
        status: "picked"
      },
      {
        id: 5,
        productId: 306,
        productName: "Sterilization Equipment",
        productSKU: "MED-STE-A2",
        quantity: 2,
        unitPrice: 565.50,
        totalPrice: 1131.00,
        warehouseLocation: "Sydney-N-D24",
        status: "picked"
      }
    ];
    
    // Link order items to their respective orders
    this.orders[0].items = [this.orderItems[0], this.orderItems[1]];
    this.orders[1].items = [this.orderItems[2]];
    this.orders[2].items = [this.orderItems[3], this.orderItems[4]];
    
    this.returnRequests = [
      {
        id: 1,
        orderId: 1,
        orderNumber: "ORD-2025-0001",
        customerName: "Sydney Tech Solutions",
        requestDate: "2025-03-18T14:25:00",
        status: "requested",
        reason: "defective",
        items: [],
        returnMethod: "drop_off",
        notes: "Customer reports server overheating issues"
      }
    ];
    
    this.returnItems = [
      {
        id: 1,
        orderItemId: 1,
        productName: "Enterprise Server X7",
        quantity: 1,
        reason: "Device overheating after 30 minutes of operation",
        condition: "defective",
        status: "pending"
      }
    ];
    
    // Link return items to their respective return requests
    this.returnRequests[0].items = [this.returnItems[0]];
    
    // Initialize with predefined users for testing
    this.users.set(1, {
      id: 1,
      username: "driver1",
      password: "password",
      role: "driver" as UserRole,
      name: "John Driver",
      email: "driver@example.com",
      permissions: ["view_routes", "update_delivery_status"],
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: "light",
        dashboardView: "routes",
        notifications: true
      }
    });
    
    this.users.set(2, {
      id: 2,
      username: "warehouse1",
      password: "password",
      role: "warehouse_staff" as UserRole,
      name: "Sarah Warehouse",
      email: "warehouse@example.com",
      permissions: ["manage_inventory", "process_shipments"],
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: "light",
        dashboardView: "inventory",
        notifications: true
      }
    });
    
    this.users.set(3, {
      id: 3,
      username: "owner1",
      password: "password",
      role: "business_owner" as UserRole,
      name: "Alex Smith",
      email: "owner@example.com",
      permissions: ["view_all", "manage_users", "financial_reports"],
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: "light",
        dashboardView: "overview",
        notifications: true
      }
    });
    
    this.users.set(4, {
      id: 4,
      username: "manager1",
      password: "password",
      role: "logistics_manager" as UserRole,
      name: "Mike Manager",
      email: "manager@example.com",
      permissions: ["manage_routes", "manage_drivers", "view_reports"],
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: "light",
        dashboardView: "logistics",
        notifications: true
      }
    });
    
    this.users.set(5, {
      id: 5,
      username: "sales1",
      password: "password",
      role: "sales" as UserRole,
      name: "Emily Sales",
      email: "sales@example.com",
      permissions: ["view_customers", "manage_quotes", "view_reports"],
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: "light",
        dashboardView: "customers",
        notifications: true
      }
    });
    
    // Initialize with empty data structures
    // Initialize AI predictive analytics data
    this.predictiveModels = [
      {
        id: 1,
        name: "Demand Forecasting AI",
        description: "Advanced ML model for predicting product demand across categories",
        type: "demand",
        accuracy: 93.5,
        lastTrained: "2025-02-10",
        status: "active",
        features: ["Historical sales", "Seasonality", "Market trends", "Promotional events"]
      },
      {
        id: 2,
        name: "Route Optimization AI",
        description: "Neural network for real-time route optimization considering weather and traffic",
        type: "routing",
        accuracy: 89.2,
        lastTrained: "2025-02-05",
        status: "active",
        features: ["Distance", "Weather conditions", "Traffic patterns", "Fuel consumption"]
      },
      {
        id: 3,
        name: "Inventory Management AI",
        description: "Predictive model for optimal inventory levels and reordering",
        type: "inventory",
        accuracy: 91.7,
        lastTrained: "2025-01-25",
        status: "active",
        features: ["Stock levels", "Supplier lead times", "Seasonal demand", "Storage costs"]
      },
      {
        id: 4,
        name: "Weather Impact Prediction",
        description: "AI model that predicts severe weather impacts on logistics operations",
        type: "weather",
        accuracy: 87.4,
        lastTrained: "2025-02-12",
        status: "active",
        features: ["Weather forecasts", "Historical delays", "Route vulnerability", "Shipment priority"]
      },
      {
        id: 5,
        name: "Custom Risk Assessment",
        description: "Custom AI model for supply chain risk assessment and mitigation",
        type: "custom",
        accuracy: 85.9,
        lastTrained: "2025-01-15",
        status: "training",
        features: ["Supplier data", "Geopolitical factors", "Commodity prices", "Transportation modes"]
      },
      {
        id: 6,
        name: "Hawkesbury-Nepean Flood Prediction System",
        description: "Specialized AI model for predicting flood impacts on Western Sydney logistics corridors",
        type: "weather",
        accuracy: 94.2,
        lastTrained: "2025-03-10",
        status: "active",
        features: ["Rainfall data", "River gauges", "Topographical mapping", "Infrastructure vulnerability", "Historical flood patterns", "Warragamba Dam levels"]
      }
    ];
    
    this.modelPredictions = [
      {
        id: 1,
        modelId: 1,
        modelName: "Demand Forecasting AI",
        createdAt: "2025-03-15T09:30:00",
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
        createdAt: "2025-03-14T14:45:00",
        predictionType: "routing",
        confidence: 88.7,
        insights: [
          {
            id: 3,
            title: "M4 Motorway Congestion",
            description: "Predicted heavy traffic on M4 corridor due to construction",
            importance: "critical",
            relatedEntity: "Western Sydney Routes"
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
      },
      {
        id: 3,
        modelId: 6,
        modelName: "Hawkesbury-Nepean Flood Prediction System",
        createdAt: "2025-03-18T06:30:00",
        predictionType: "weather",
        confidence: 94.2,
        insights: [
          {
            id: 4,
            title: "Imminent Flood Risk",
            description: "Potential for localized flooding in Windsor, Richmond, and Penrith areas within 48 hours due to heavy rainfall and rising Warragamba Dam levels",
            importance: "critical",
            relatedEntity: "Western Sydney Logistics Network"
          },
          {
            id: 5,
            title: "M4 Vulnerability",
            description: "High probability (87%) of M4 motorway partial closures between Penrith and Eastern Creek due to anticipated flood conditions",
            importance: "high",
            relatedEntity: "Western Sydney Routes"
          },
          {
            id: 6,
            title: "Distribution Center Impact",
            description: "Moderate risk to Western Sydney Distribution Center access roads based on predicted water levels",
            importance: "medium",
            relatedEntity: "Western Sydney Distribution Center"
          }
        ],
        impactAreas: [
          {
            area: "Logistics",
            metric: "Delivery routes",
            impact: "negative",
            value: 42,
            unit: "%"
          },
          {
            area: "Operations",
            metric: "Distribution center access",
            impact: "negative",
            value: 25,
            unit: "%"
          },
          {
            area: "Scheduling",
            metric: "Delivery timeframes",
            impact: "negative",
            value: 68,
            unit: "%"
          }
        ]
      }
    ];
    
    this.anomalyDetections = [
      {
        id: 1,
        title: "Unusual Delivery Delay Pattern",
        description: "AI has detected an unusual pattern of delivery delays in the Western Sydney region",
        detectedAt: "2023-02-15T10:23:00",
        severity: "high",
        category: "logistics",
        status: "investigating",
        affectedAreas: ["Western Sydney Distribution Center", "Parramatta Deliveries"]
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
        name: "Blue Mountains Severe Rain Scenario",
        description: "Impact analysis of severe rainfall and flooding in the Blue Mountains region",
        createdAt: "2025-03-10T08:00:00",
        variables: [
          {
            name: "Rainfall",
            value: "120-180mm",
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
        createdAt: "2025-02-10T14:30:00",
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
      },
      {
        id: 3,
        name: "Hawkesbury-Nepean Flood Response Plan",
        description: "Comprehensive scenario analysis of major flooding event in Hawkesbury-Nepean Valley and impact on Western Sydney logistics",
        createdAt: "2025-03-18T06:15:00",
        variables: [
          {
            name: "Rainfall",
            value: "150-200mm",
            type: "weather"
          },
          {
            name: "Warragamba Dam Level",
            value: "97.5%",
            type: "weather"
          },
          {
            name: "Flood Duration",
            value: "72 hours",
            type: "weather"
          },
          {
            name: "Affected Distribution Centers",
            value: 2,
            type: "logistics"
          },
          {
            name: "Critical Route Closures",
            value: 8,
            type: "logistics"
          },
          {
            name: "Bridge Accessibility",
            value: "Limited",
            type: "logistics"
          }
        ],
        outcomes: [
          {
            metric: "Distribution Center Accessibility",
            value: 40,
            change: -60,
            impact: "negative"
          },
          {
            metric: "Western Sydney Delivery Times",
            value: 185,
            change: 85,
            impact: "negative"
          },
          {
            metric: "Rerouting Efficiency",
            value: 68,
            change: -32,
            impact: "negative"
          },
          {
            metric: "Additional Fuel Costs",
            value: 127,
            change: 27,
            impact: "negative"
          },
          {
            metric: "Eastern Distribution Center Utilization",
            value: 142,
            change: 42,
            impact: "positive"
          }
        ],
        probability: 82
      }
    ];
    this.metrics = {
      activeShipments: { value: 247, change: "12% from last week", trend: "up" },
      onTimeDelivery: { value: "94%", change: "3% from last week", trend: "up" },
      delayAlerts: { value: 18, change: "5% from last week", trend: "up" },
      avgShippingCost: { value: "$1,247", change: "2% from last week", trend: "down" }
    };
    
    this.locations = [
      { id: 1, type: "distribution", lat: -33.7486, lng: 150.9942, name: "Western Sydney Distribution Center" },
      { id: 2, type: "distribution", lat: -33.8688, lng: 151.2093, name: "Sydney Distribution Center" },
      { id: 3, type: "transit", lat: -37.8136, lng: 144.9631, name: "Melbourne Transit Hub" },
      { id: 4, type: "transit", lat: -27.4698, lng: 153.0251, name: "Brisbane Transit Hub" },
      { id: 5, type: "delay", lat: -34.9285, lng: 138.6007, name: "Adelaide Delivery Center" }
    ];
    
    this.weatherAlerts = [
      {
        id: 1,
        severity: "severe",
        title: "Severe Weather Alert",
        description: "Heavy rainfall and flooding expected in the Hawkesbury-Nepean region affecting 14 active shipments.",
        time: "12:30 PM",
        affectedShipments: 14,
        region: "Western Sydney"
      },
      {
        id: 2,
        severity: "advisory",
        title: "Weather Advisory",
        description: "Bushfire smoke reducing visibility along coastal routes. Expected delays of 1-2 hours.",
        time: "09:15 AM",
        affectedShipments: 8,
        region: "NSW Coast"
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
      { id: 1, name: "Penrith to Sydney CBD", description: "Rerouted to avoid construction on M4 Motorway", saved: "-45 min" },
      { id: 2, name: "Liverpool to Parramatta", description: "Traffic-optimized departure time", saved: "-30 min" }
    ];
    
    this.routeMetrics = {
      optimizedPercentage: 75,
      target: 85,
      improvement: "+12%"
    };
    
    this.activities = [
      { id: 1, title: "Shipment #A4589 delivered", description: "Package delivered to 123 George Street, Sydney CBD", time: "2 hours ago", type: "primary" },
      { id: 2, title: "Route modification alert", description: "5 routes modified due to flooding in Western Sydney", time: "4 hours ago", type: "accent" },
      { id: 3, title: "New shipment created", description: "Shipment #B7813 created from Sydney to Melbourne", time: "6 hours ago", type: "secondary" },
      { id: 4, title: "System update completed", description: "New route optimization algorithm deployed for Western Sydney area", time: "12 hours ago", type: "default" }
    ];
    
    this.routes = [
      { id: 1, name: "RT-8294", origin: "Penrith, NSW", destination: "Sydney CBD, NSW", status: "optimized", savings: "45 min", eta: "Today, 4:30 PM", distance: "55 km" },
      { id: 2, name: "RT-7512", origin: "Liverpool, NSW", destination: "Parramatta, NSW", status: "optimized", savings: "30 min", eta: "Today, 5:15 PM", distance: "25 km" },
      { id: 3, name: "RT-6351", origin: "Sydney, NSW", destination: "Melbourne, VIC", status: "delayed", savings: "-20 min", eta: "Tomorrow, 11:00 AM", distance: "880 km" },
      { id: 4, name: "RT-5437", origin: "Sydney, NSW", destination: "Brisbane, QLD", status: "standard", savings: "0 min", eta: "Today, 7:45 PM", distance: "910 km" }
    ];
    
    this.supplyChainNodes = [
      { id: 1, type: "distribution", name: "Western Sydney DC", location: "Penrith, NSW", lat: -33.7486, lng: 150.6942, inventory: 12500 },
      { id: 2, type: "distribution", name: "Sydney DC", location: "Sydney, NSW", lat: -33.8688, lng: 151.2093, inventory: 15700 },
      { id: 3, type: "regional", name: "Melbourne RC", location: "Melbourne, VIC", lat: -37.8136, lng: 144.9631, inventory: 5200 },
      { id: 4, type: "regional", name: "Brisbane RC", location: "Brisbane, QLD", lat: -27.4698, lng: 153.0251, inventory: 4800 },
      { id: 5, type: "local", name: "Parramatta LC", location: "Parramatta, NSW", lat: -33.8150, lng: 151.0011, inventory: 2300 },
      { id: 6, type: "local", name: "Liverpool LC", location: "Liverpool, NSW", lat: -33.9200, lng: 150.9212, inventory: 1800 }
    ];
    
    this.shipments = [
      { id: 1, shipmentId: "A4589", origin: "Penrith, NSW", destination: "Sydney CBD, NSW", status: "on-schedule", eta: "Today, 4:30 PM", priority: "high" },
      { id: 2, shipmentId: "B7813", origin: "Sydney, NSW", destination: "Melbourne, VIC", status: "delayed", eta: "Tomorrow, 10:15 AM", priority: "medium" },
      { id: 3, shipmentId: "C3921", origin: "Brisbane, QLD", destination: "Sydney, NSW", status: "on-schedule", eta: "Tomorrow, 2:45 PM", priority: "normal" }
    ];
    
    this.inventoryAlerts = [
      { id: 1, product: "Electronic Components", location: "Western Sydney Distribution Center", current: 52, minimum: 200, severity: "critical", percentage: 26 },
      { id: 2, product: "Packaging Supplies", location: "Parramatta Regional Center", current: 120, minimum: 200, severity: "low", percentage: 60 },
      { id: 3, product: "Summer Clothing", location: "Liverpool Local Center", current: 85, minimum: 150, severity: "low", percentage: 56 }
    ];
    
    this.productForecasts = [
      { id: 1, category: "Electronics", subcategory: "Smart devices, components", current: 1245, next: 1380, trend: "up", percentage: 10.8, confidence: "high", confidenceValue: 92 },
      { id: 2, category: "Apparel", subcategory: "Clothing, accessories", current: 3850, next: 4220, trend: "up", percentage: 9.6, confidence: "high", confidenceValue: 89 },
      { id: 3, category: "Furniture", subcategory: "Home, office furnishings", current: 920, next: 880, trend: "down", percentage: 4.3, confidence: "medium", confidenceValue: 76 },
      { id: 4, category: "Food & Beverage", subcategory: "Perishable goods", current: 5120, next: 5230, trend: "up", percentage: 2.1, confidence: "high", confidenceValue: 88 }
    ];
    
    this.weatherEvents = [
      { id: 1, type: "flood", severity: "severe", region: "Hawkesbury-Nepean Valley", affectedRoutes: 14, startTime: "2025-03-15T12:00:00", endTime: "2025-03-18T03:00:00", description: "Heavy rainfall causing significant flooding in the Hawkesbury-Nepean Valley" },
      { id: 2, type: "fog", severity: "moderate", region: "Blue Mountains", affectedRoutes: 8, startTime: "2025-03-18T06:00:00", endTime: "2025-03-18T11:00:00", description: "Dense fog reducing visibility to less than 500 meters on mountain roads" },
      { id: 3, type: "extreme-heat", severity: "severe", region: "Western Sydney", affectedRoutes: 5, startTime: "2025-03-20T10:00:00", endTime: "2025-03-20T18:00:00", description: "Extreme heat with temperatures exceeding 40°C affecting road conditions and vehicle performance" }
    ];
    
    this.weatherImpactMetrics = {
      activeAlerts: 3,
      affectedShipments: 27,
      averageDelay: "2.4 hours",
      riskLevel: "medium"
    };
    
    this.alternativeRoutes = [
      { id: 1, originalRoute: "M4 Motorway", alternativeRoute: "Great Western Highway", timeSaved: "45 min", weatherCondition: "Flooding", confidence: 87 },
      { id: 2, originalRoute: "M7 Motorway", alternativeRoute: "Westlink M7 Alternate", timeSaved: "30 min", weatherCondition: "Dense Fog", confidence: 92 },
      { id: 3, originalRoute: "M5 Motorway", alternativeRoute: "King Georges Road", timeSaved: "15 min", weatherCondition: "Heavy Rain", confidence: 78 }
    ];
    
    this.reports = [
      { id: 1, name: "Monthly Logistics Performance", type: "logistics", lastGenerated: "2025-02-28", frequency: "monthly", format: "pdf", size: "2.4 MB" },
      { id: 2, name: "Weekly Inventory Status", type: "inventory", lastGenerated: "2025-03-15", frequency: "weekly", format: "excel", size: "1.8 MB" },
      { id: 3, name: "Q1 Demand Forecast", type: "forecast", lastGenerated: "2025-01-15", frequency: "quarterly", format: "pdf", size: "3.2 MB" },
      { id: 4, name: "Western Sydney Route Optimization", type: "routes", lastGenerated: "2025-03-17", frequency: "daily", format: "csv", size: "1.1 MB" },
      { id: 5, name: "Supply Chain Resilience Analysis", type: "custom", lastGenerated: "2025-03-10", frequency: "custom", format: "excel", size: "4.5 MB" }
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
    
    // Initialize Hyper-Local Route Optimization data
    this.hyperLocalRoutes = [
      {
        id: 1,
        name: "Western Sydney M12 Corridor",
        status: "active",
        region: "Western Sydney",
        trafficConditions: "moderate",
        weatherConditions: "Clear",
        constructionZones: [
          {
            id: 1,
            name: "M12 Motorway Construction",
            latitude: -33.8688,
            longitude: 151.0578,
            startDate: "2023-11-15",
            endDate: "2025-06-30",
            impact: "high",
            description: "Major motorway construction impacting multiple logistics routes"
          }
        ],
        fuelSavings: "15.2%",
        timeReduction: "22 min",
        routeEfficiency: 87,
        lastUpdated: "2025-03-18T08:45:00",
        edgeDeviceStatus: "online"
      },
      {
        id: 2,
        name: "Parramatta-Penrith Route",
        status: "active",
        region: "Western Sydney",
        trafficConditions: "heavy",
        weatherConditions: "Light rain",
        constructionZones: [],
        fuelSavings: "12.7%",
        timeReduction: "18 min",
        routeEfficiency: 83,
        lastUpdated: "2025-03-18T09:15:00",
        edgeDeviceStatus: "online"
      }
    ];
    
    this.constructionZones = [
      {
        id: 1,
        name: "M12 Motorway Construction",
        latitude: -33.8688,
        longitude: 151.0578,
        startDate: "2023-11-15",
        endDate: "2025-06-30",
        impact: "high",
        description: "Major motorway construction impacting multiple logistics routes"
      },
      {
        id: 2,
        name: "Badgerys Creek Airport Access",
        latitude: -33.8825,
        longitude: 150.7500,
        startDate: "2024-05-20",
        endDate: "2025-12-15",
        impact: "medium",
        description: "Construction of access roads to Western Sydney Airport"
      }
    ];
    
    // Initialize Predictive Supply Chain Resilience data
    this.resilienceForecasts = [
      {
        id: 1,
        name: "Flood Risk Assessment",
        forecastType: "disaster",
        probability: 68,
        impact: "high",
        timeWindow: "72 hours",
        affectedRegions: ["Hawkesbury-Nepean Valley", "Western Sydney"],
        suggestedActions: [
          "Reroute deliveries away from flood-prone areas",
          "Increase inventory at Eastern Sydney distribution centers",
          "Activate emergency delivery protocols"
        ],
        alternateRoutes: [3, 5, 7],
        inventoryRecommendations: [
          {
            id: 1,
            product: "Household Essentials",
            currentLevel: 5200,
            recommendedLevel: 7500,
            priority: "high",
            location: "Eastern Sydney Distribution Center",
            rationale: "Anticipated surge demand due to flood warnings"
          }
        ],
        accuracy: 92
      },
      {
        id: 2,
        name: "Heat Wave Impact",
        forecastType: "disaster",
        probability: 85,
        impact: "medium",
        timeWindow: "7 days",
        affectedRegions: ["Western Sydney", "Blue Mountains"],
        suggestedActions: [
          "Schedule deliveries during early morning hours",
          "Ensure cooling systems in vehicles and warehouses",
          "Prioritize temperature-sensitive inventory"
        ],
        alternateRoutes: [2, 4],
        inventoryRecommendations: [
          {
            id: 2,
            product: "Perishable Goods",
            currentLevel: 3800,
            recommendedLevel: 3000,
            priority: "medium",
            location: "Penrith Distribution Center",
            rationale: "Reduce stock of heat-sensitive items in affected locations"
          }
        ],
        accuracy: 89
      }
    ];
    
    this.inventoryRecommendations = [
      {
        id: 1,
        product: "Household Essentials",
        currentLevel: 5200,
        recommendedLevel: 7500,
        priority: "high",
        location: "Eastern Sydney Distribution Center",
        rationale: "Anticipated surge demand due to flood warnings"
      },
      {
        id: 2,
        product: "Perishable Goods",
        currentLevel: 3800,
        recommendedLevel: 3000,
        priority: "medium",
        location: "Penrith Distribution Center",
        rationale: "Reduce stock of heat-sensitive items in affected locations"
      },
      {
        id: 3,
        product: "Emergency Supplies",
        currentLevel: 1200,
        recommendedLevel: 2500,
        priority: "high",
        location: "Liverpool Distribution Center",
        rationale: "Bushfire season preparedness recommended by AI forecast"
      }
    ];
    
    // Initialize Sustainable AI-Driven Operations data
    this.sustainabilityMetrics = {
      id: 1,
      totalCarbonEmissions: 12450,
      emissionReduction: "18.5%",
      energyEfficiency: 82,
      emptyMilesPercentage: 13.2,
      carbonOffsets: 3200,
      sustainabilityScore: 78,
      recommendations: [
        {
          id: 1,
          title: "Route Consolidation",
          description: "Consolidate deliveries to neighboring suburbs to reduce empty miles",
          potentialImpact: "5% reduction in carbon emissions",
          difficulty: "medium",
          timeToImplement: "4-6 weeks",
          costSavings: "$15,000 monthly"
        },
        {
          id: 2,
          title: "Electric Vehicle Adoption",
          description: "Transition 20% of the fleet to electric vehicles",
          potentialImpact: "12% reduction in carbon emissions",
          difficulty: "complex",
          timeToImplement: "12-18 months",
          costSavings: "$120,000 annually"
        }
      ]
    };
    
    this.sustainabilityRecommendations = [
      {
        id: 1,
        title: "Route Consolidation",
        description: "Consolidate deliveries to neighboring suburbs to reduce empty miles",
        potentialImpact: "5% reduction in carbon emissions",
        difficulty: "medium",
        timeToImplement: "4-6 weeks",
        costSavings: "$15,000 monthly"
      },
      {
        id: 2,
        title: "Electric Vehicle Adoption",
        description: "Transition 20% of the fleet to electric vehicles",
        potentialImpact: "12% reduction in carbon emissions",
        difficulty: "complex",
        timeToImplement: "12-18 months",
        costSavings: "$120,000 annually"
      },
      {
        id: 3,
        title: "Solar-Powered Warehouses",
        description: "Install solar panels on warehouse facilities",
        potentialImpact: "20% reduction in facility energy costs",
        difficulty: "complex",
        timeToImplement: "6-8 months",
        costSavings: "$85,000 annually"
      }
    ];
    
    // Initialize Integrated Cybersecurity Suite data
    this.securityAlerts = [
      {
        id: 1,
        type: "phishing",
        severity: "high",
        timestamp: "2025-03-17T14:32:00",
        description: "Sophisticated phishing attempt targeting logistics management credentials",
        status: "investigating",
        affectedSystems: ["Email Server", "User Authentication"],
        mitigationSteps: [
          "Reset affected user passwords",
          "Enable 2FA for all users",
          "Block sender domains"
        ],
        responseTime: "45 seconds"
      },
      {
        id: 2,
        type: "suspicious_access",
        severity: "medium",
        timestamp: "2025-03-18T02:15:00",
        description: "Multiple failed login attempts from unrecognized IP address",
        status: "resolved",
        affectedSystems: ["Admin Portal"],
        mitigationSteps: [
          "IP address blocked",
          "Account lockout protocols activated",
          "Security audit performed"
        ],
        responseTime: "38 seconds"
      }
    ];
    
    this.securityCompliance = [
      {
        id: 1,
        framework: "australian_privacy",
        status: "compliant",
        lastAudit: "2025-02-10",
        findings: [],
        nextAuditDue: "2025-08-10",
        responsibleParty: "Cybersecurity Team"
      },
      {
        id: 2,
        framework: "iso_27001",
        status: "partially_compliant",
        lastAudit: "2025-01-15",
        findings: [
          "Mobile device management not fully implemented",
          "Disaster recovery testing overdue"
        ],
        nextAuditDue: "2025-07-15",
        responsibleParty: "IT Compliance Officer"
      }
    ];
    
    // Initialize Multi-Modal Logistics Orchestration data
    this.multiModalRoutes = [
      {
        id: 1,
        name: "Sydney-to-Penrith Multi-Modal",
        status: "in_progress",
        originType: "warehouse",
        destinationType: "customer",
        transportModes: [
          {
            id: 1,
            mode: "truck",
            origin: "Sydney Port",
            destination: "Western Sydney Distribution Center",
            distance: "35 km",
            duration: "45 min",
            cost: "$120",
            status: "completed",
            carrier: "FastLogistics"
          },
          {
            id: 2,
            mode: "drone",
            origin: "Western Sydney Distribution Center",
            destination: "Penrith Business Park",
            distance: "15 km",
            duration: "20 min",
            cost: "$85",
            status: "in_transit",
            carrier: "AeroDrone"
          }
        ],
        totalDistance: "50 km",
        totalDuration: "65 min",
        totalCost: "$205",
        co2Emissions: "15.2 kg",
        reliability: 92
      }
    ];
    
    this.transportSegments = [
      {
        id: 1,
        mode: "truck",
        origin: "Sydney Port",
        destination: "Western Sydney Distribution Center",
        distance: "35 km",
        duration: "45 min",
        cost: "$120",
        status: "completed",
        carrier: "FastLogistics"
      },
      {
        id: 2,
        mode: "drone",
        origin: "Western Sydney Distribution Center",
        destination: "Penrith Business Park",
        distance: "15 km",
        duration: "20 min",
        cost: "$85",
        status: "in_transit",
        carrier: "AeroDrone"
      },
      {
        id: 3,
        mode: "rail",
        origin: "Sydney Port",
        destination: "Western Sydney Intermodal Terminal",
        distance: "45 km",
        duration: "30 min",
        cost: "$95",
        status: "pending",
        carrier: "SydneyRail"
      }
    ];
    
    // Initialize SME-Centric Customization and Affordability data
    this.smeClients = [
      {
        id: 1,
        name: "Western Sydney Fresh Produce",
        industry: "Food & Agriculture",
        size: "medium",
        subscribedModules: ["Route Optimization", "Weather Impact", "Demand Forecasting"],
        monthlyFee: 5500,
        onboardingDate: "2025-01-15",
        deploymentDuration: "10 days",
        activeUsers: 12,
        satisfaction: 92,
        apiUsage: 2450
      },
      {
        id: 2,
        name: "Parramatta Medical Supplies",
        industry: "Healthcare",
        size: "small",
        subscribedModules: ["Route Optimization", "Supply Chain"],
        monthlyFee: 3200,
        onboardingDate: "2025-02-20",
        deploymentDuration: "7 days",
        activeUsers: 5,
        satisfaction: 88,
        apiUsage: 1200
      }
    ];
    
    this.subscriptionTiers = [
      {
        id: 1,
        name: "Starter",
        price: 2000,
        billingCycle: "monthly",
        features: ["Route Optimization", "Basic Weather Alerts", "5 User Accounts"],
        maxUsers: 5,
        apiCallLimit: 5000,
        storageLimit: "50 GB",
        supportLevel: "basic"
      },
      {
        id: 2,
        name: "Professional",
        price: 5000,
        billingCycle: "monthly",
        features: ["All Starter Features", "Demand Forecasting", "Supply Chain Visibility", "Multi-Modal Options", "15 User Accounts"],
        maxUsers: 15,
        apiCallLimit: 20000,
        storageLimit: "200 GB",
        supportLevel: "standard"
      },
      {
        id: 3,
        name: "Enterprise",
        price: 12000,
        billingCycle: "monthly",
        features: ["All Professional Features", "AI Predictive Analytics", "Digital Twin", "Custom Integrations", "Unlimited Users"],
        maxUsers: 100,
        apiCallLimit: 100000,
        storageLimit: "1 TB",
        supportLevel: "premium"
      }
    ];
    
    // Initialize Digital Twin for Scenario Planning data
    this.digitalTwins = [
      {
        id: 1,
        name: "Western Sydney Distribution Network",
        clientId: 1,
        status: "active",
        accuracy: 92,
        lastUpdated: "2025-03-15",
        components: [
          {
            id: 1,
            type: "warehouse",
            name: "Penrith Distribution Center",
            properties: {
              capacity: "15000 sqm",
              inventory: 12500,
              staffing: 45
            },
            connections: [2, 3]
          },
          {
            id: 2,
            type: "vehicle",
            name: "Delivery Fleet A",
            properties: {
              vehicles: 12,
              capacity: "120 ton",
              fuelEfficiency: "12L/100km"
            },
            connections: [1, 4]
          }
        ],
        scenarios: [
          {
            id: 1,
            name: "Peak Season Demand Surge",
            description: "Simulation of holiday season demand increase",
            parameters: {
              demandIncrease: "35%",
              duration: "6 weeks",
              staffingIncrease: "20%"
            },
            results: [
              {
                metric: "Warehouse Utilization",
                baseline: 65,
                projected: 92,
                change: "+27%",
                confidence: 88,
                recommendation: "Secure temporary overflow storage"
              },
              {
                metric: "Delivery Time",
                baseline: 24,
                projected: 36,
                change: "+50%",
                confidence: 85,
                recommendation: "Implement night shifts for deliveries"
              }
            ],
            createdAt: "2025-03-10",
            status: "completed"
          }
        ]
      }
    ];
    
    // Initialize Autonomous Fleet Integration data
    this.autonomousVehicles = [
      {
        id: 1,
        name: "AV-Truck-001",
        type: "truck",
        autonomyLevel: 3,
        status: "en_route",
        currentLocation: {
          lat: -33.8688,
          lng: 151.1058
        },
        batteryLevel: 78,
        nextMaintenance: "2025-04-15",
        currentRoute: 3,
        cargoCapacity: "12 tonnes",
        operationalHours: 3120
      },
      {
        id: 2,
        name: "Delivery-Drone-005",
        type: "drone",
        autonomyLevel: 4,
        status: "charging",
        currentLocation: {
          lat: -33.7486,
          lng: 150.9942
        },
        batteryLevel: 22,
        nextMaintenance: "2025-03-30",
        currentRoute: null,
        cargoCapacity: "5 kg",
        operationalHours: 580
      }
    ];
    
    this.fleetMetrics = {
      totalVehicles: 48,
      autonomousPercentage: 12,
      averageUtilization: 76,
      maintenanceEfficiency: 92,
      fuelSavings: "14.5%",
      incidentRate: 0.5,
      averageDeliveryTime: "32 minutes"
    };
    
    // Initialize Real-Time Client Dashboard with AI Insights data
    this.dashboardInsights = [
      {
        id: 1,
        title: "Route Efficiency Opportunity",
        description: "AI has identified potential for 15% improvement in Penrith-Liverpool routes by adjusting departure times",
        insightType: "efficiency",
        priority: "high",
        relatedMetrics: ["Fuel Consumption", "Delivery Time", "Cost per Delivery"],
        suggestedActions: [
          "Adjust departure schedule to 6:30 AM instead of 7:15 AM",
          "Reroute through M7 instead of local roads during peak hours"
        ],
        generatedAt: "2025-03-18T08:15:00"
      },
      {
        id: 2,
        title: "Demand Forecast Alert",
        description: "Predicted 22% spike in construction materials deliveries for Western Sydney area in next 2 weeks",
        insightType: "trend",
        priority: "medium",
        relatedMetrics: ["Order Volume", "Warehouse Capacity", "Fleet Utilization"],
        suggestedActions: [
          "Temporarily reassign 4 vehicles from eastern routes",
          "Extend warehouse operating hours to accommodate increased volume"
        ],
        generatedAt: "2025-03-18T07:30:00"
      }
    ];
    
    this.clientDashboardSettings = [
      {
        id: 1,
        clientId: 1,
        visibleWidgets: ["RouteMap", "DeliveryStatus", "WeatherAlerts", "FleetOverview", "CarbonFootprint"],
        refreshInterval: 5,
        alertThresholds: {
          delayWarning: 15,
          criticalDelay: 30,
          lowInventory: 25,
          fuelEfficiency: 85
        },
        favoriteReports: [2, 5],
        customKpis: ["On-time performance", "Cost per mile", "Customer satisfaction"]
      }
    ];
    
    // Initialize Partnerships and Ecosystem Integration data
    this.partnerships = [
      {
        id: 1,
        partnerName: "Western Sydney University",
        partnerType: "university",
        status: "active",
        startDate: "2024-09-01",
        endDate: null,
        projectFocus: ["AI Research", "Logistics Optimization", "Sustainability Analytics"],
        contactPerson: "Prof. Sarah Johnson",
        dataShared: ["Anonymized Route Data", "Traffic Patterns", "Emissions Metrics"],
        benefitsRealized: ["Improved AI Models", "Academic Publications", "Talent Recruitment"]
      },
      {
        id: 2,
        partnerName: "Transport for NSW",
        partnerType: "government",
        status: "active",
        startDate: "2024-11-15",
        endDate: null,
        projectFocus: ["Smart Traffic Management", "Infrastructure Planning"],
        contactPerson: "Michael Chen",
        dataShared: ["Congestion Data", "Route Optimization Insights"],
        benefitsRealized: ["Improved Traffic Flow", "Reduced Emissions", "Better Road Planning"]
      }
    ];
    
    this.grantApplications = [
      {
        id: 1,
        name: "Sustainable Logistics Innovation Grant",
        organization: "NSW Environmental Authority",
        amount: 250000,
        status: "approved",
        submissionDate: "2024-10-15",
        decisionDate: "2025-01-20",
        projectTimeline: "18 months",
        requiredDeliverables: [
          "Quarterly emissions reduction reports",
          "Electric vehicle integration plan",
          "Community impact assessment"
        ]
      },
      {
        id: 2,
        name: "Smart Cities Transportation Technology Grant",
        organization: "Federal Innovation Fund",
        amount: 500000,
        status: "under_review",
        submissionDate: "2025-02-10",
        decisionDate: null,
        projectTimeline: "24 months",
        requiredDeliverables: [
          "Edge AI implementation for traffic management",
          "Autonomous vehicle integration protocol",
          "Public-private partnership framework"
        ]
      }
    ];
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
    // Ensure role is properly typed as UserRole
    const typedRole = insertUser.role as UserRole;
    
    // Create a new user object matching the User schema
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      role: typedRole,
      name: insertUser.name,
      email: insertUser.email || null,
      permissions: [],
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: "light",
        dashboardView: "overview",
        notifications: true
      }
    };
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

  // AI Predictive Analytics methods
  async getPredictiveModels(): Promise<PredictiveModel[]> {
    return this.predictiveModels;
  }

  async getPredictiveModelById(id: number): Promise<PredictiveModel | undefined> {
    return this.predictiveModels.find(model => model.id === id);
  }

  async createPredictiveModel(model: Omit<PredictiveModel, 'id'>): Promise<PredictiveModel> {
    const newId = this.predictiveModels.length > 0 
      ? Math.max(...this.predictiveModels.map(m => m.id)) + 1 
      : 1;
    
    const newModel: PredictiveModel = {
      ...model,
      id: newId
    };
    
    this.predictiveModels.push(newModel);
    return newModel;
  }

  async updatePredictiveModel(id: number, model: Partial<PredictiveModel>): Promise<PredictiveModel | undefined> {
    const index = this.predictiveModels.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    
    this.predictiveModels[index] = {
      ...this.predictiveModels[index],
      ...model
    };
    
    return this.predictiveModels[index];
  }

  async deletePredictiveModel(id: number): Promise<boolean> {
    const initialLength = this.predictiveModels.length;
    this.predictiveModels = this.predictiveModels.filter(m => m.id !== id);
    return initialLength > this.predictiveModels.length;
  }

  async getModelPredictions(modelId?: number): Promise<ModelPrediction[]> {
    if (modelId) {
      return this.modelPredictions.filter(p => p.modelId === modelId);
    }
    return this.modelPredictions;
  }

  async getModelPredictionById(id: number): Promise<ModelPrediction | undefined> {
    return this.modelPredictions.find(p => p.id === id);
  }

  async createModelPrediction(prediction: Omit<ModelPrediction, 'id'>): Promise<ModelPrediction> {
    const newId = this.modelPredictions.length > 0 
      ? Math.max(...this.modelPredictions.map(p => p.id)) + 1 
      : 1;
    
    const newPrediction: ModelPrediction = {
      ...prediction,
      id: newId
    };
    
    this.modelPredictions.push(newPrediction);
    return newPrediction;
  }

  async getAnomalyDetections(status?: string): Promise<AnomalyDetection[]> {
    if (status) {
      return this.anomalyDetections.filter(a => a.status === status);
    }
    return this.anomalyDetections;
  }

  async resolveAnomaly(id: number, resolution: string): Promise<AnomalyDetection | undefined> {
    const index = this.anomalyDetections.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    this.anomalyDetections[index] = {
      ...this.anomalyDetections[index],
      status: "resolved",
      description: `${this.anomalyDetections[index].description} - Resolution: ${resolution}`
    };
    
    return this.anomalyDetections[index];
  }

  async getScenarioAnalyses(): Promise<ScenarioAnalysis[]> {
    return this.scenarioAnalyses;
  }

  async getScenarioAnalysisById(id: number): Promise<ScenarioAnalysis | undefined> {
    return this.scenarioAnalyses.find(s => s.id === id);
  }

  async createScenarioAnalysis(scenario: Omit<ScenarioAnalysis, 'id'>): Promise<ScenarioAnalysis> {
    const newId = this.scenarioAnalyses.length > 0 
      ? Math.max(...this.scenarioAnalyses.map(s => s.id)) + 1 
      : 1;
    
    const newScenario: ScenarioAnalysis = {
      ...scenario,
      id: newId
    };
    
    this.scenarioAnalyses.push(newScenario);
    return newScenario;
  }

  async runPredictiveAnalysis(data: any): Promise<any> {
    // In a real implementation, this would connect to an AI service
    // For now, we'll return a simulated prediction based on the input data
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock prediction result based on the input data type
    if (data.type === "demand") {
      return {
        type: "demand_prediction",
        confidence: 92.7,
        prediction: {
          categories: [
            { name: "Electronics", change: 8.5, direction: "increase" },
            { name: "Apparel", change: 12.3, direction: "increase" },
            { name: "Furniture", change: -3.2, direction: "decrease" }
          ],
          factors: [
            "Seasonal trend upward for electronics and apparel",
            "Market indicators suggest furniture demand cooling"
          ],
          timeframe: "30 days"
        }
      };
    } else if (data.type === "routing") {
      return {
        type: "route_optimization",
        confidence: 89.4,
        prediction: {
          optimizedRoutes: [
            { from: "Penrith, NSW", to: "Sydney CBD, NSW", timeSaved: "52 minutes", fuelSaved: "12%" },
            { from: "Liverpool, NSW", to: "Parramatta, NSW", timeSaved: "45 minutes", fuelSaved: "9%" }
          ],
          weatherImpacts: [
            { region: "Blue Mountains, NSW", severity: "moderate", recommendation: "Delay shipments by 24 hours" }
          ]
        }
      };
    } else if (data.type === "inventory") {
      return {
        type: "inventory_prediction",
        confidence: 90.8,
        prediction: {
          recommendations: [
            { product: "Electronics", action: "increase", amount: "15%" },
            { product: "Winter Clothing", action: "decrease", amount: "10%" }
          ],
          risks: [
            { product: "Electronics", risk: "stockout", probability: "high" },
            { product: "Perishables", risk: "overstocking", probability: "medium" }
          ]
        }
      };
    } else {
      return {
        type: "general_prediction",
        confidence: 85.3,
        prediction: {
          insights: [
            "Consider increasing warehouse capacity in Western Sydney region",
            "Monitor supplier delivery times for potential disruptions",
            "Weather patterns may impact Blue Mountains delivery schedules"
          ],
          timeline: "90 days",
          reliability: "medium"
        }
      };
    }
  }

  // 1. Hyper-Local Route Optimization with Real-Time Adaptation
  async getHyperLocalRoutes(): Promise<HyperLocalRoutingData[]> {
    return this.hyperLocalRoutes;
  }

  async getHyperLocalRouteById(id: number): Promise<HyperLocalRoutingData | undefined> {
    return this.hyperLocalRoutes.find(route => route.id === id);
  }

  async getConstructionZones(region?: string): Promise<ConstructionZone[]> {
    if (region) {
      return this.constructionZones.filter(zone => 
        this.hyperLocalRoutes.some(route => 
          route.region === region && 
          route.constructionZones.some(routeZone => routeZone.id === zone.id)
        )
      );
    }
    return this.constructionZones;
  }

  async updateRouteWithRealTimeData(routeId: number, data: Partial<HyperLocalRoutingData>): Promise<HyperLocalRoutingData> {
    const routeIndex = this.hyperLocalRoutes.findIndex(route => route.id === routeId);
    if (routeIndex === -1) {
      throw new Error(`Route with ID ${routeId} not found`);
    }

    this.hyperLocalRoutes[routeIndex] = {
      ...this.hyperLocalRoutes[routeIndex],
      ...data,
      lastUpdated: new Date().toISOString()
    };

    return this.hyperLocalRoutes[routeIndex];
  }

  // 2. Predictive Supply Chain Resilience
  async getResilienceForecasts(): Promise<ResilienceForecast[]> {
    return this.resilienceForecasts;
  }

  async getResilienceForecastById(id: number): Promise<ResilienceForecast | undefined> {
    return this.resilienceForecasts.find(forecast => forecast.id === id);
  }

  async getInventoryRecommendations(forecastId?: number): Promise<InventoryRecommendation[]> {
    if (forecastId) {
      const forecast = this.resilienceForecasts.find(f => f.id === forecastId);
      return forecast?.inventoryRecommendations || [];
    }
    return this.inventoryRecommendations;
  }

  async createResilienceForecast(forecast: Omit<ResilienceForecast, 'id'>): Promise<ResilienceForecast> {
    const id = this.resilienceForecasts.length > 0 
      ? Math.max(...this.resilienceForecasts.map(f => f.id)) + 1 
      : 1;
    
    const newForecast: ResilienceForecast = {
      ...forecast,
      id
    };
    
    this.resilienceForecasts.push(newForecast);
    return newForecast;
  }

  // 3. Sustainable AI-Driven Operations
  async getSustainabilityMetrics(): Promise<SustainabilityMetrics> {
    return this.sustainabilityMetrics;
  }

  async getSustainabilityRecommendations(): Promise<SustainabilityRecommendation[]> {
    return this.sustainabilityRecommendations;
  }

  async updateSustainabilityMetrics(metrics: Partial<SustainabilityMetrics>): Promise<SustainabilityMetrics> {
    this.sustainabilityMetrics = {
      ...this.sustainabilityMetrics,
      ...metrics
    };

    return this.sustainabilityMetrics;
  }

  // 4. Integrated Cybersecurity Suite
  async getSecurityAlerts(status?: string): Promise<SecurityAlert[]> {
    if (status) {
      return this.securityAlerts.filter(alert => alert.status === status);
    }
    return this.securityAlerts;
  }

  async updateSecurityAlert(id: number, update: Partial<SecurityAlert>): Promise<SecurityAlert | undefined> {
    const alertIndex = this.securityAlerts.findIndex(alert => alert.id === id);
    if (alertIndex === -1) {
      return undefined;
    }

    this.securityAlerts[alertIndex] = {
      ...this.securityAlerts[alertIndex],
      ...update
    };

    return this.securityAlerts[alertIndex];
  }

  async getSecurityCompliance(): Promise<SecurityCompliance[]> {
    return this.securityCompliance;
  }

  // 5. Multi-Modal Logistics Orchestration
  async getMultiModalRoutes(): Promise<MultiModalRoute[]> {
    return this.multiModalRoutes;
  }

  async getMultiModalRouteById(id: number): Promise<MultiModalRoute | undefined> {
    return this.multiModalRoutes.find(route => route.id === id);
  }

  async getTransportSegments(routeId: number): Promise<TransportSegment[]> {
    const route = this.multiModalRoutes.find(r => r.id === routeId);
    if (route) {
      return route.transportModes;
    }
    return [];
  }

  async createMultiModalRoute(route: Omit<MultiModalRoute, 'id'>): Promise<MultiModalRoute> {
    const id = this.multiModalRoutes.length > 0 
      ? Math.max(...this.multiModalRoutes.map(r => r.id)) + 1 
      : 1;
    
    const newRoute: MultiModalRoute = {
      ...route,
      id
    };
    
    this.multiModalRoutes.push(newRoute);
    return newRoute;
  }

  // 6. SME-Centric Customization and Affordability
  async getSMEClients(): Promise<SMEClient[]> {
    return this.smeClients;
  }

  async getSMEClientById(id: number): Promise<SMEClient | undefined> {
    return this.smeClients.find(client => client.id === id);
  }

  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    return this.subscriptionTiers;
  }

  // 7. Digital Twin for Scenario Planning
  async getDigitalTwins(clientId?: number): Promise<DigitalTwin[]> {
    if (clientId) {
      return this.digitalTwins.filter(twin => twin.clientId === clientId);
    }
    return this.digitalTwins;
  }

  async getDigitalTwinById(id: number): Promise<DigitalTwin | undefined> {
    return this.digitalTwins.find(twin => twin.id === id);
  }

  async runDigitalTwinScenario(twinId: number, scenario: Omit<DigitalTwinScenario, 'id' | 'results'>): Promise<DigitalTwinScenario> {
    const twinIndex = this.digitalTwins.findIndex(twin => twin.id === twinId);
    if (twinIndex === -1) {
      throw new Error(`Digital Twin with ID ${twinId} not found`);
    }

    // Generate random scenario ID
    const scenarioId = this.digitalTwins[twinIndex].scenarios.length > 0
      ? Math.max(...this.digitalTwins[twinIndex].scenarios.map(s => s.id)) + 1
      : 1;

    // Simulate the results generation based on the parameters
    const simulatedResults: DigitalTwinResult[] = [
      {
        metric: "Warehouse Utilization",
        baseline: 65,
        projected: 85,
        change: "+20%",
        confidence: 90,
        recommendation: "Increase storage capacity"
      },
      {
        metric: "Delivery Time",
        baseline: 45,
        projected: 32,
        change: "-29%",
        confidence: 85,
        recommendation: "Implement optimized routing algorithm"
      }
    ];

    const newScenario: DigitalTwinScenario = {
      ...scenario,
      id: scenarioId,
      results: simulatedResults,
      status: "completed"
    };

    this.digitalTwins[twinIndex].scenarios.push(newScenario);
    return newScenario;
  }

  // 8. Autonomous Fleet Integration
  async getAutonomousVehicles(): Promise<AutonomousVehicle[]> {
    return this.autonomousVehicles;
  }

  async getAutonomousVehicleById(id: number): Promise<AutonomousVehicle | undefined> {
    return this.autonomousVehicles.find(vehicle => vehicle.id === id);
  }

  async getFleetMetrics(): Promise<FleetMetrics> {
    return this.fleetMetrics;
  }

  async updateAutonomousVehicle(id: number, update: Partial<AutonomousVehicle>): Promise<AutonomousVehicle | undefined> {
    const vehicleIndex = this.autonomousVehicles.findIndex(vehicle => vehicle.id === id);
    if (vehicleIndex === -1) {
      return undefined;
    }

    this.autonomousVehicles[vehicleIndex] = {
      ...this.autonomousVehicles[vehicleIndex],
      ...update
    };

    return this.autonomousVehicles[vehicleIndex];
  }

  // 9. Real-Time Client Dashboard with AI Insights
  async getDashboardInsights(clientId?: number): Promise<DashboardInsight[]> {
    // In a real implementation, we would filter by client
    // For now, return all insights
    return this.dashboardInsights;
  }

  async getClientDashboardSettings(clientId: number): Promise<ClientDashboardSettings | undefined> {
    return this.clientDashboardSettings.find(settings => settings.clientId === clientId);
  }

  async updateClientDashboardSettings(clientId: number, settings: Partial<ClientDashboardSettings>): Promise<ClientDashboardSettings | undefined> {
    const settingsIndex = this.clientDashboardSettings.findIndex(s => s.clientId === clientId);
    if (settingsIndex === -1) {
      return undefined;
    }

    this.clientDashboardSettings[settingsIndex] = {
      ...this.clientDashboardSettings[settingsIndex],
      ...settings
    };

    return this.clientDashboardSettings[settingsIndex];
  }

  // 10. Partnerships and Ecosystem Integration
  async getPartnerships(): Promise<Partnership[]> {
    return this.partnerships;
  }

  async getPartnershipById(id: number): Promise<Partnership | undefined> {
    return this.partnerships.find(partnership => partnership.id === id);
  }

  async getGrantApplications(status?: string): Promise<GrantApplication[]> {
    if (status) {
      return this.grantApplications.filter(app => app.status === status);
    }
    return this.grantApplications;
  }

  async createPartnership(partnership: Omit<Partnership, 'id'>): Promise<Partnership> {
    const id = this.partnerships.length > 0 
      ? Math.max(...this.partnerships.map(p => p.id)) + 1 
      : 1;
    
    const newPartnership: Partnership = {
      ...partnership,
      id
    };
    
    this.partnerships.push(newPartnership);
    return newPartnership;
  }
}

export const storage = new MemStorage();
