/**
 * Warehouse Receiving Page
 * 
 * This page handles the receiving functionality for the warehouse management system:
 * - Create and view inbound orders
 * - Record received items
 * - Document discrepancies
 * - Initiate put-away process
 */
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, CheckCircle, AlertTriangle, FileBarChart, PackageOpen, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Types
import { InboundOrder, InboundOrderItem, ReceivingDiscrepancy, PutAwayTask } from '../shared/warehouse-types';

// API request helper
import { apiRequest } from '../lib/queryClient';

// Form schemas
const inboundOrderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  supplierName: z.string().min(1, "Supplier name is required"),
  supplierReference: z.string().min(1, "Supplier reference is required"),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
  status: z.enum(["pending", "received", "partial", "completed", "cancelled"]),
  notes: z.string().optional(),
});

const inboundOrderItemSchema = z.object({
  inboundOrderId: z.number(),
  sku: z.string().min(1, "SKU is required"),
  productName: z.string().min(1, "Product name is required"),
  expectedQuantity: z.number().min(1, "Expected quantity must be at least 1"),
  receivedQuantity: z.number().default(0),
  batchNumber: z.string().optional(),
  lotNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z.enum(["pending", "received", "partial", "rejected"]).default("pending"),
  storageLocation: z.string().optional(),
});

const discrepancySchema = z.object({
  inboundOrderItemId: z.number(),
  type: z.enum(["quantity_mismatch", "damaged", "wrong_item", "quality_issue", "missing"]),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  reportedBy: z.string().min(1, "Reporter name is required"),
  status: z.enum(["open", "resolved", "escalated"]).default("open"),
  resolutionNotes: z.string().optional(),
});

// Import our new components
import { BarcodeScanner } from '../components/warehouse/barcode-scanner';
import { DocumentGenerator } from '../components/warehouse/document-generator';
import { ImageUploader } from '../components/warehouse/image-uploader';

export default function WarehouseReceiving() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [discrepancyDialogOpen, setDiscrepancyDialogOpen] = useState(false);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [putAwayDialogOpen, setPutAwayDialogOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanTarget, setScanTarget] = useState<'sku' | 'location' | null>(null);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Fetch inbound orders
  const { 
    data: inboundOrders = [], 
    isLoading: isLoadingOrders 
  } = useQuery<InboundOrder[]>({
    queryKey: ['/api/warehouse/inbound-orders'],
    queryFn: () => apiRequest('/api/warehouse/inbound-orders'),
  });

  // Fetch inbound order items when an order is selected
  const { 
    data: orderItems = [], 
    isLoading: isLoadingItems 
  } = useQuery<InboundOrderItem[]>({
    queryKey: ['/api/warehouse/inbound-orders', selectedOrderId, 'items'],
    queryFn: () => apiRequest(`/api/warehouse/inbound-orders/${selectedOrderId}/items`),
    enabled: !!selectedOrderId,
  });

  // Fetch discrepancies when an item is selected
  const { 
    data: discrepancies = [], 
    isLoading: isLoadingDiscrepancies 
  } = useQuery<ReceivingDiscrepancy[]>({
    queryKey: ['/api/warehouse/receiving-discrepancies', selectedItemId],
    queryFn: () => apiRequest(`/api/warehouse/receiving-discrepancies/${selectedItemId}`),
    enabled: !!selectedItemId,
  });

  // Create inbound order mutation
  const createInboundOrderMutation = useMutation({
    mutationFn: (data: z.infer<typeof inboundOrderSchema>) => {
      return apiRequest('POST', '/api/warehouse/inbound-orders', {
        ...data,
        createdBy: JSON.parse(sessionStorage.getItem('user') || '{}').username || 'system',
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Created",
        description: "The inbound order has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse/inbound-orders'] });
      inboundOrderForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create inbound order.",
        variant: "destructive",
      });
    }
  });

  // Create order item mutation
  const createOrderItemMutation = useMutation({
    mutationFn: (data: z.infer<typeof inboundOrderItemSchema>) => {
      return apiRequest('POST', '/api/warehouse/inbound-order-items', data);
    },
    onSuccess: () => {
      toast({
        title: "Item Added",
        description: "The item has been added to the order.",
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/warehouse/inbound-orders', selectedOrderId, 'items'] 
      });
      setNewItemDialogOpen(false);
      orderItemForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to order.",
        variant: "destructive",
      });
    }
  });

  // Create discrepancy mutation
  const createDiscrepancyMutation = useMutation({
    mutationFn: (data: z.infer<typeof discrepancySchema>) => {
      return apiRequest('POST', '/api/warehouse/receiving-discrepancies', data);
    },
    onSuccess: () => {
      toast({
        title: "Discrepancy Recorded",
        description: "The discrepancy has been recorded successfully.",
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/warehouse/receiving-discrepancies', selectedItemId] 
      });
      setDiscrepancyDialogOpen(false);
      discrepancyForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record discrepancy.",
        variant: "destructive",
      });
    }
  });

  // Update order item mutation (for receiving)
  const updateOrderItemMutation = useMutation({
    mutationFn: (data: { id: number, updates: Partial<InboundOrderItem> }) => {
      return apiRequest('PATCH', `/api/warehouse/inbound-order-items/${data.id}`, data.updates);
    },
    onSuccess: () => {
      toast({
        title: "Item Received",
        description: "The item has been received successfully.",
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/warehouse/inbound-orders', selectedOrderId, 'items'] 
      });
      setReceiveDialogOpen(false);
      // Also update the order status if needed
      checkAndUpdateOrderStatus();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to receive item.",
        variant: "destructive",
      });
    }
  });

  // Create put-away task mutation
  const createPutAwayTaskMutation = useMutation({
    mutationFn: (itemId: number) => {
      const item = orderItems.find(i => i.id === itemId);
      if (!item) throw new Error("Item not found");
      
      return apiRequest('POST', '/api/warehouse/put-away-tasks', {
        inboundOrderId: item.inboundOrderId,
        inboundOrderItemId: item.id,
        sku: item.sku,
        productName: item.productName,
        quantity: item.receivedQuantity,
        status: "pending",
        suggestedLocation: {
          id: 1, // This would typically come from an algorithm
          name: "Aisle A, Rack 3, Bin 2",
          type: "bin",
          aisle: "A",
          rack: "3",
          bin: "2",
          capacity: 1000,
          capacityUnit: "kg",
          currentUtilization: 30,
          status: "available"
        }
      });
    },
    onSuccess: () => {
      toast({
        title: "Put-Away Task Created",
        description: "The put-away task has been created successfully.",
      });
      setPutAwayDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create put-away task.",
        variant: "destructive",
      });
    }
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: (data: { id: number, status: "pending" | "received" | "partial" | "completed" | "cancelled" }) => {
      return apiRequest('PATCH', `/api/warehouse/inbound-orders/${data.id}`, { status: data.status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse/inbound-orders'] });
    }
  });

  // Check and update order status based on item statuses
  const checkAndUpdateOrderStatus = () => {
    if (!selectedOrderId || !orderItems.length) return;
    
    const allReceived = orderItems.every(item => item.status === "received");
    const anyReceived = orderItems.some(item => item.status === "received" || item.status === "partial");
    const anyRejected = orderItems.some(item => item.status === "rejected");
    
    let newStatus: "pending" | "received" | "partial" | "completed" = "pending";
    
    if (allReceived) {
      newStatus = "completed";
    } else if (anyReceived) {
      newStatus = "partial";
    }
    
    const selectedOrder = inboundOrders.find(o => o.id === selectedOrderId);
    if (selectedOrder && selectedOrder.status !== newStatus) {
      updateOrderStatusMutation.mutate({ id: selectedOrderId, status: newStatus });
    }
  };

  // Create forms
  const inboundOrderForm = useForm<z.infer<typeof inboundOrderSchema>>({
    resolver: zodResolver(inboundOrderSchema),
    defaultValues: {
      orderNumber: "",
      supplierName: "",
      supplierReference: "",
      expectedDeliveryDate: format(new Date(), 'yyyy-MM-dd'),
      status: "pending",
      notes: "",
    },
  });

  const orderItemForm = useForm<z.infer<typeof inboundOrderItemSchema>>({
    resolver: zodResolver(inboundOrderItemSchema),
    defaultValues: {
      sku: "",
      productName: "",
      expectedQuantity: 1,
      receivedQuantity: 0,
      status: "pending",
    },
  });

  const discrepancyForm = useForm<z.infer<typeof discrepancySchema>>({
    resolver: zodResolver(discrepancySchema),
    defaultValues: {
      type: "quantity_mismatch",
      description: "",
      quantity: 1,
      reportedBy: JSON.parse(sessionStorage.getItem('user') || '{}').username || '',
      status: "open",
      resolutionNotes: "",
    },
  });

  const receiveItemForm = useForm({
    defaultValues: {
      receivedQuantity: 0,
      status: "received",
      storageLocation: "",
      batchNumber: "",
      lotNumber: "",
      expiryDate: ""
    }
  });

  // Set the order ID for the item form when a new item is being added
  useEffect(() => {
    if (selectedOrderId) {
      orderItemForm.setValue('inboundOrderId', selectedOrderId);
    }
  }, [selectedOrderId, orderItemForm]);

  // Set the item ID for the discrepancy form when a new discrepancy is being added
  useEffect(() => {
    if (selectedItemId) {
      discrepancyForm.setValue('inboundOrderItemId', selectedItemId);

      // Also set default values for receive item form
      const selectedItem = orderItems.find(item => item.id === selectedItemId);
      if (selectedItem) {
        receiveItemForm.setValue('receivedQuantity', selectedItem.expectedQuantity);
        receiveItemForm.setValue('batchNumber', selectedItem.batchNumber || '');
        receiveItemForm.setValue('lotNumber', selectedItem.lotNumber || '');
        receiveItemForm.setValue('expiryDate', selectedItem.expiryDate || '');
        receiveItemForm.setValue('storageLocation', selectedItem.storageLocation || '');
      }
    }
  }, [selectedItemId, orderItems, discrepancyForm, receiveItemForm]);

  // Handle form submissions
  const onCreateInboundOrder = (data: z.infer<typeof inboundOrderSchema>) => {
    createInboundOrderMutation.mutate(data);
  };

  const onAddOrderItem = (data: z.infer<typeof inboundOrderItemSchema>) => {
    createOrderItemMutation.mutate(data);
  };

  const onAddDiscrepancy = (data: z.infer<typeof discrepancySchema>) => {
    createDiscrepancyMutation.mutate(data);
  };

  const onReceiveItem = (data: any) => {
    if (!selectedItemId) return;
    
    updateOrderItemMutation.mutate({ 
      id: selectedItemId,
      updates: {
        receivedQuantity: data.receivedQuantity,
        status: data.status,
        storageLocation: data.storageLocation,
        batchNumber: data.batchNumber,
        lotNumber: data.lotNumber,
        expiryDate: data.expiryDate
      }
    });
  };

  const onCreatePutAwayTask = () => {
    if (!selectedItemId) return;
    createPutAwayTaskMutation.mutate(selectedItemId);
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "received": return "bg-green-100 text-green-800";
      case "partial": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "open": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "escalated": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Warehouse Receiving</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/warehouse-dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="orders" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Inbound Orders</TabsTrigger>
          <TabsTrigger 
            value="items" 
            disabled={!selectedOrderId}
          >
            Order Items
          </TabsTrigger>
          <TabsTrigger 
            value="discrepancies" 
            disabled={!selectedItemId}
          >
            Discrepancies
          </TabsTrigger>
        </TabsList>

        {/* Inbound Orders Tab */}
        <TabsContent value="orders" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inbound Order Form */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Create Inbound Order</CardTitle>
                <CardDescription>
                  Enter the details of the incoming shipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...inboundOrderForm}>
                  <form
                    id="inbound-order-form"
                    onSubmit={inboundOrderForm.handleSubmit(onCreateInboundOrder)}
                    className="space-y-4"
                  >
                    <FormField
                      control={inboundOrderForm.control}
                      name="orderNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Number</FormLabel>
                          <FormControl>
                            <Input placeholder="PO12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={inboundOrderForm.control}
                      name="supplierName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supplier Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Supplier Co." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={inboundOrderForm.control}
                      name="supplierReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supplier Reference</FormLabel>
                          <FormControl>
                            <Input placeholder="REF789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={inboundOrderForm.control}
                      name="expectedDeliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Delivery Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={inboundOrderForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="received">Received</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={inboundOrderForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional information"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit"
                  form="inbound-order-form"
                  disabled={createInboundOrderMutation.isPending}
                  className="w-full"
                >
                  {createInboundOrderMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Order
                </Button>
              </CardFooter>
            </Card>

            {/* Inbound Orders List */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Inbound Orders</CardTitle>
                <CardDescription>
                  View and manage inbound orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : inboundOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No inbound orders found</p>
                    <p className="text-sm text-muted-foreground">Create a new order to get started</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Expected Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inboundOrders.map((order) => (
                          <TableRow 
                            key={order.id}
                            className={selectedOrderId === order.id ? "bg-muted" : ""}
                          >
                            <TableCell>{order.orderNumber}</TableCell>
                            <TableCell>{order.supplierName}</TableCell>
                            <TableCell>{format(new Date(order.expectedDeliveryDate), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={getStatusColor(order.status)}
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrderId(order.id);
                                  setActiveTab("items");
                                }}
                              >
                                View Items
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Order Items Tab */}
        <TabsContent value="items" className="py-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {selectedOrderId && (
                    <>
                      Order #{inboundOrders.find(o => o.id === selectedOrderId)?.orderNumber || ''}
                    </>
                  )}
                </CardDescription>
              </div>
              <Dialog open={newItemDialogOpen} onOpenChange={setNewItemDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>
                      Add a new item to this inbound order
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...orderItemForm}>
                    <form
                      id="order-item-form"
                      onSubmit={orderItemForm.handleSubmit(onAddOrderItem)}
                      className="space-y-4"
                    >
                      <FormField
                        control={orderItemForm.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <Input placeholder="SKU123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={orderItemForm.control}
                        name="productName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Product name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={orderItemForm.control}
                        name="expectedQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={orderItemForm.control}
                        name="batchNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batch Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="BATCH123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={orderItemForm.control}
                        name="lotNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lot Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="LOT456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={orderItemForm.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewItemDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      form="order-item-form"
                      disabled={createOrderItemMutation.isPending}
                    >
                      {createOrderItemMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Add Item
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingItems ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No items in this order</p>
                  <p className="text-sm text-muted-foreground">Add items to start the receiving process</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Expected Qty</TableHead>
                        <TableHead>Received Qty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow 
                          key={item.id}
                          className={selectedItemId === item.id ? "bg-muted" : ""}
                        >
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.expectedQuantity}</TableCell>
                          <TableCell>{item.receivedQuantity}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={getStatusColor(item.status)}
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedItemId(item.id);
                                  setActiveTab("discrepancies");
                                }}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Issues
                              </Button>
                              
                              <Dialog open={receiveDialogOpen && selectedItemId === item.id} onOpenChange={(open) => {
                                setReceiveDialogOpen(open);
                                if (open) setSelectedItemId(item.id);
                              }}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={item.status === "received"}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Receive
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Receive Item</DialogTitle>
                                    <DialogDescription>
                                      Record details of the received item
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <form
                                    id="receive-item-form"
                                    onSubmit={receiveItemForm.handleSubmit(onReceiveItem)}
                                    className="space-y-4"
                                  >
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="receivedQuantity">Received Quantity</Label>
                                        <Input
                                          id="receivedQuantity"
                                          type="number"
                                          min="0"
                                          {...receiveItemForm.register('receivedQuantity', { 
                                            valueAsNumber: true 
                                          })}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                          onValueChange={(value) => receiveItemForm.setValue('status', value)}
                                          defaultValue={receiveItemForm.getValues('status')}
                                        >
                                          <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="received">Received</SelectItem>
                                            <SelectItem value="partial">Partial</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="storageLocation">Storage Location</Label>
                                      <Input
                                        id="storageLocation"
                                        placeholder="A1-B2-C3"
                                        {...receiveItemForm.register('storageLocation')}
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="batchNumber">Batch Number</Label>
                                        <Input
                                          id="batchNumber"
                                          {...receiveItemForm.register('batchNumber')}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="lotNumber">Lot Number</Label>
                                        <Input
                                          id="lotNumber"
                                          {...receiveItemForm.register('lotNumber')}
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="expiryDate">Expiry Date</Label>
                                      <Input
                                        id="expiryDate"
                                        type="date"
                                        {...receiveItemForm.register('expiryDate')}
                                      />
                                    </div>
                                  </form>

                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setReceiveDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button 
                                      type="submit"
                                      form="receive-item-form"
                                      disabled={updateOrderItemMutation.isPending}
                                    >
                                      {updateOrderItemMutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      )}
                                      Confirm Receipt
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Dialog open={putAwayDialogOpen && selectedItemId === item.id} onOpenChange={(open) => {
                                setPutAwayDialogOpen(open);
                                if (open) setSelectedItemId(item.id);
                              }}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={item.status !== "received"}
                                  >
                                    <FileBarChart className="h-4 w-4 mr-1" />
                                    Put Away
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Create Put-Away Task</DialogTitle>
                                    <DialogDescription>
                                      This will create a task to put this item away
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium">SKU</p>
                                        <p className="text-sm">{item.sku}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Product</p>
                                        <p className="text-sm">{item.productName}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium">Quantity</p>
                                        <p className="text-sm">{item.receivedQuantity}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Storage Location</p>
                                        <p className="text-sm">{item.storageLocation || "Not specified"}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium">Suggested Location</p>
                                      <p className="text-sm">Aisle A, Rack 3, Bin 2</p>
                                    </div>
                                  </div>

                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setPutAwayDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button 
                                      onClick={onCreatePutAwayTask}
                                      disabled={createPutAwayTaskMutation.isPending}
                                    >
                                      {createPutAwayTaskMutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      )}
                                      Create Put-Away Task
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discrepancies Tab */}
        <TabsContent value="discrepancies" className="py-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Discrepancies</CardTitle>
                <CardDescription>
                  {selectedItemId && (
                    <>
                      Item: {orderItems.find(i => i.id === selectedItemId)?.productName || ''}
                    </>
                  )}
                </CardDescription>
              </div>
              <Dialog open={discrepancyDialogOpen} onOpenChange={setDiscrepancyDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Discrepancy
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report Discrepancy</DialogTitle>
                    <DialogDescription>
                      Record an issue with the received item
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...discrepancyForm}>
                    <form
                      id="discrepancy-form"
                      onSubmit={discrepancyForm.handleSubmit(onAddDiscrepancy)}
                      className="space-y-4"
                    >
                      <FormField
                        control={discrepancyForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issue Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select issue type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="quantity_mismatch">Quantity Mismatch</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                                <SelectItem value="wrong_item">Wrong Item</SelectItem>
                                <SelectItem value="quality_issue">Quality Issue</SelectItem>
                                <SelectItem value="missing">Missing</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={discrepancyForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the issue"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={discrepancyForm.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Affected Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={discrepancyForm.control}
                        name="reportedBy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reported By</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={discrepancyForm.control}
                        name="resolutionNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Resolution Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Notes about how to resolve this issue"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDiscrepancyDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      form="discrepancy-form"
                      disabled={createDiscrepancyMutation.isPending}
                    >
                      {createDiscrepancyMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Report Issue
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingDiscrepancies ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : discrepancies.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No issues reported</p>
                  <p className="text-sm text-muted-foreground">Record any discrepancies with the received items</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {discrepancies.map((discrepancy) => (
                        <TableRow key={discrepancy.id}>
                          <TableCell>
                            <Badge variant="outline">
                              {discrepancy.type.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>{discrepancy.description}</TableCell>
                          <TableCell>{discrepancy.quantity}</TableCell>
                          <TableCell>{discrepancy.reportedBy}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={getStatusColor(discrepancy.status)}
                            >
                              {discrepancy.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(discrepancy.reportedAt), 'dd/MM/yyyy')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}