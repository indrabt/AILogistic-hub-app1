/**
 * Order Management Type Definitions
 * 
 * This file contains types specifically for the Order Management system
 * that mirrors the shared types but is local to the frontend to avoid
 * import issues with direct standalone pages.
 */

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerType: "retail" | "wholesale" | "distributor" | "internal";
  customerLocation: string;
  createdAt: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  items: OrderItem[];
  totalValue: number;
  priority: "standard" | "express" | "urgent";
  notes?: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  assignedShipmentId?: string;
  paymentStatus: "pending" | "paid" | "partially_paid" | "refunded";
  invoiceNumber?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSKU: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  warehouseLocation?: string;
  status: "pending" | "allocated" | "picked" | "packed" | "shipped";
}

export interface ReturnRequest {
  id: number;
  orderId: number;
  orderNumber: string;
  customerName: string;
  requestDate: string;
  status: "requested" | "approved" | "received" | "inspected" | "processed" | "rejected";
  reason: "damaged" | "incorrect_item" | "unwanted" | "defective" | "other";
  items: ReturnItem[];
  returnMethod: "pickup" | "drop_off" | "mail";
  returnShippingLabel?: string;
  resolutionType?: "refund" | "exchange" | "store_credit";
  notes?: string;
}

export interface ReturnItem {
  id: number;
  orderItemId: number;
  productName: string;
  quantity: number;
  reason: string;
  condition: "unopened" | "opened" | "damaged" | "defective";
  status: "pending" | "approved" | "received" | "rejected";
  resolution?: string;
}