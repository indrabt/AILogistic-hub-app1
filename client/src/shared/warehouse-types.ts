// Types imported from shared warehouse types
export type InventoryStatus = "received" | "stored" | "picked" | "packed" | "shipped" | "returned";
export type StorageLocationType = "aisle" | "rack" | "bin" | "shelf" | "bulk" | "staging";
export type DiscrepancyType = "quantity_mismatch" | "damaged" | "wrong_item" | "quality_issue" | "missing";
export type PriorityLevel = "low" | "medium" | "high" | "urgent";
export type CountingMethod = "full" | "cycle" | "partial" | "audit";

export interface CycleCountTask {
  id: number;
  name: string;
  countingMethod: CountingMethod;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignedTo?: string;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  locations: number[];
  items: CycleCountItem[];
  notes?: string;
}

export interface CycleCountItem {
  id: number;
  cycleCountTaskId: number;
  inventoryItemId: number;
  locationId: number;
  sku: string;
  productName: string;
  expectedQuantity: number;
  actualQuantity?: number;
  discrepancy?: number;
  status: "pending" | "counted" | "adjusted" | "investigation";
  countedBy?: string;
  countedAt?: string;
  notes?: string;
  adjustmentReason?: string;
  approvedBy?: string;
  approvedAt?: string;
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
}