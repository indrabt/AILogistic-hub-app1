/**
 * Warehouse Management System Type Definitions for Client
 * 
 * This file contains types for the Warehouse Management System 
 * used in the client-side components.
 */

// Common warehouse-related enums
export type InventoryStatus = "received" | "stored" | "picked" | "packed" | "shipped" | "returned";
export type StorageLocationType = "aisle" | "rack" | "bin" | "shelf" | "bulk" | "staging";
export type DiscrepancyType = "quantity_mismatch" | "damaged" | "wrong_item" | "quality_issue" | "missing";
export type PriorityLevel = "low" | "medium" | "high" | "urgent";
export type CountingMethod = "full" | "cycle" | "partial" | "audit";
export type ProductCategory = "electronics" | "clothing" | "food" | "beverages" | "chemicals" | "fragile" | "heavy" | "bulky" | "hazardous";
export type TemperatureZone = "ambient" | "chilled" | "frozen" | "heated";
export type VelocityCategory = "fast" | "medium" | "slow";
export type ScanType = "barcode" | "qrcode" | "rfid" | "manual";

// Scanning and verification interfaces
export interface ScanResult {
  success: boolean;
  scanType: ScanType;
  scannedValue: string;
  timestamp: string;
  scannedBy: string;
  matchesExpected: boolean;
  errorMessage?: string;
}

export interface ScanVerification {
  itemScan?: ScanResult;
  locationScan?: ScanResult;
  verified: boolean;
  verificationTimestamp?: string;
  verifiedBy?: string;
  notes?: string;
}

// 1. Receiving Feature
export interface InboundOrder {
  id: number;
  orderNumber: string;
  supplierName: string;
  supplierReference: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: "pending" | "received" | "partial" | "completed" | "cancelled";
  createdAt: string;
  createdBy: string;
  notes?: string;
  items: InboundOrderItem[];
}

export interface InboundOrderItem {
  id: number;
  inboundOrderId: number;
  sku: string;
  productName: string;
  expectedQuantity: number;
  receivedQuantity: number;
  batchNumber?: string;
  lotNumber?: string;
  expiryDate?: string;
  status: "pending" | "received" | "partial" | "rejected";
  storageLocation?: string;
  discrepancies: ReceivingDiscrepancy[];
}

export interface ReceivingDiscrepancy {
  id: number;
  inboundOrderItemId: number;
  type: DiscrepancyType;
  description: string;
  quantity: number;
  attachmentUrl?: string;
  reportedBy: string;
  reportedAt: string;
  status: "open" | "resolved" | "escalated";
  resolutionNotes?: string;
}

// 2. Put-Away Feature
export interface LocationRecommendation {
  location: StorageLocation;
  score: number;
  reason: string[];
  ideal: boolean;
}

export interface PutAwayTask {
  id: number;
  inboundOrderId: number;
  inboundOrderItemId: number;
  sku: string;
  productName: string;
  quantity: number;
  suggestedLocation: StorageLocation;
  alternativeLocations?: LocationRecommendation[];
  actualLocation?: StorageLocation;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  productCharacteristics?: ProductCharacteristics;
  scanRequired?: boolean;
}

// 3. Inventory Tracking Feature
export interface ProductCharacteristics {
  category: ProductCategory;
  size: "small" | "medium" | "large" | "xlarge";
  weight: "light" | "medium" | "heavy";
  temperatureRequirements?: TemperatureZone;
  velocityCategory: VelocityCategory;
  hazardous: boolean;
  fragile: boolean;
  stackable: boolean;
  specialHandling?: string[];
}

export interface InventoryItem {
  id: number;
  sku: string;
  productName: string;
  category: string;
  totalQuantity: number;
  allocatedQuantity: number;
  availableQuantity: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  locations: InventoryLocation[];
  attributes: InventoryItemAttribute[];
  lastUpdatedAt: string;
  productCharacteristics?: ProductCharacteristics;
}

export interface InventoryLocation {
  id: number;
  inventoryItemId: number;
  locationId: number;
  quantity: number;
  status: InventoryStatus;
  batchNumber?: string;
  lotNumber?: string;
  expiryDate?: string;
  lastUpdatedAt: string;
}

export interface InventoryItemAttribute {
  id: number;
  inventoryItemId: number;
  name: string;
  value: string;
}

export interface StorageLocation {
  id: number;
  name: string;
  type: StorageLocationType;
  aisle?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
  capacity: number;
  capacityUnit: string;
  currentUtilization: number;
  temperature?: number;
  humidity?: number;
  specialAttributes?: Record<string, string>;
  status: "available" | "full" | "reserved" | "maintenance" | "blocked";
  temperatureZone?: TemperatureZone;
  velocityZone?: VelocityCategory;
  compatibleCategories?: ProductCategory[];
  incompatibleCategories?: ProductCategory[];
  suitabilityScore?: number;
}

export interface InventoryMovement {
  id: number;
  inventoryItemId: number;
  fromLocationId?: number;
  toLocationId?: number;
  quantity: number;
  type: "receiving" | "put_away" | "picking" | "packing" | "shipping" | "adjustment" | "transfer";
  referenceNumber?: string;
  referenceType?: string;
  performedBy: string;
  performedAt: string;
  notes?: string;
}

// 4. Picking Feature
export interface PickTask {
  id: number;
  customerOrderId: number;
  batchId?: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignedTo?: string;
  priority: PriorityLevel;
  dueDate: string;
  startedAt?: string;
  completedAt?: string;
  items: PickTaskItem[];
}

export interface PickTaskItem {
  id: number;
  pickTaskId: number;
  orderItemId: number;
  sku: string;
  productName: string;
  quantity: number;
  locationId: number;
  locationName: string;
  status: "pending" | "picked" | "partial" | "substituted" | "unavailable";
  pickedQuantity: number;
  pickedLocationId?: number;
  batchNumber?: string;
  lotNumber?: string;
  expiryDate?: string;
  pickedAt?: string;
  notes?: string;
}

// 5. Packing Feature
export interface PackingTask {
  id: number;
  customerOrderId: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  items: PackingTaskItem[];
  packages: ShipmentPackage[];
}

export interface PackingTaskItem {
  id: number;
  packingTaskId: number;
  pickTaskItemId: number;
  sku: string;
  productName: string;
  quantity: number;
  packedQuantity: number;
  packageId?: number;
  status: "pending" | "packed" | "partial";
  packedAt?: string;
  notes?: string;
}

export interface ShipmentPackage {
  id: number;
  packingTaskId: number;
  packageType: string;
  length: number;
  width: number;
  height: number;
  dimensionUnit: string;
  weight: number;
  weightUnit: string;
  trackingNumber?: string;
  carrier?: string;
  service?: string;
  status: "packed" | "labeled" | "shipped";
  createdAt: string;
  shippedAt?: string;
  notes?: string;
}

// 6. Shipping Feature
export interface Shipment {
  id: number;
  customerOrderId: number;
  status: "pending" | "partially_shipped" | "shipped" | "delivered" | "cancelled";
  carrier: string;
  service: string;
  trackingNumber?: string;
  shippingCost?: number;
  shippingDate?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  packages: ShipmentPackage[];
  shippingAddress: ShippingAddress;
  manifestGenerated?: boolean;
  manifestUrl?: string;
  notes?: string;
}

export interface ShippingAddress {
  id: number;
  shipmentId: number;
  recipientName: string;
  company?: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  email?: string;
}

export interface ShippingCarrier {
  id: number;
  name: string;
  code: string;
  services: ShippingService[];
  active: boolean;
  logo?: string;
  trackingUrlTemplate?: string;
}

export interface ShippingService {
  id: number;
  carrierId: number;
  name: string;
  code: string;
  description?: string;
  estimatedDeliveryDays: number;
  domestic: boolean;
  international: boolean;
  active: boolean;
}