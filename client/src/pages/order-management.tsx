import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Package2,
  Truck,
  RotateCcw,
  Clipboard,
  FileSpreadsheet,
  ArrowRightLeft,
  Plus,
  Search,
  Filter,
  RefreshCcw,
  Users,
  Calendar,
  MapPin,
  CheckCircle,
  CircleAlert,
  Clock,
  Loader2,
} from "lucide-react";
import type { Order, OrderItem, ReturnRequest, ReturnItem } from "@shared/types";

export default function OrderManagement() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Fetch Orders
  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/orders', statusFilter],
    queryFn: async () => {
      const url = statusFilter 
        ? `/api/orders?status=${statusFilter}` 
        : '/api/orders';
      return apiRequest(url);
    },
  });

  // Fetch Order Items for Selected Order
  const { data: orderItems = [] } = useQuery({
    queryKey: ['/api/orders/items', selectedOrderId],
    queryFn: async () => {
      if (!selectedOrderId) return [];
      return apiRequest(`/api/orders/${selectedOrderId}/items`);
    },
    enabled: !!selectedOrderId,
  });

  // Fetch Return Requests
  const { data: returnRequests = [] } = useQuery({
    queryKey: ['/api/return-requests'],
    queryFn: async () => {
      return apiRequest('/api/return-requests');
    },
  });

  // Create Order Mutation
  const createOrderMutation = useMutation({
    mutationFn: async (newOrder: Omit<Order, 'id'>) => {
      return apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify(newOrder),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order created",
        description: "The order has been successfully created.",
      });
      setCreateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error creating order",
        description: "There was a problem creating the order. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update Order Status Mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest<Order>(`/api/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order updated",
        description: "The order status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating order",
        description: "There was a problem updating the order. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete Order Mutation
  const deleteOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/orders/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order deleted",
        description: "The order has been permanently deleted.",
      });
      setDeleteConfirmOpen(false);
      setSelectedOrderId(null);
    },
    onError: (error) => {
      toast({
        title: "Error deleting order",
        description: "There was a problem deleting the order. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create Return Request Mutation
  const createReturnMutation = useMutation({
    mutationFn: async (newReturn: Omit<ReturnRequest, 'id'>) => {
      return apiRequest<ReturnRequest>('/api/return-requests', {
        method: 'POST',
        body: JSON.stringify(newReturn),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/return-requests'] });
      toast({
        title: "Return created",
        description: "The return request has been successfully created.",
      });
      setReturnDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error creating return",
        description: "There was a problem creating the return request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.customerLocation.toLowerCase().includes(searchLower)
    );
  });

  // Get the selected order
  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;

  // Get status badge style
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "outline" | "secondary" | "destructive"; icon: React.ReactNode }> = {
      pending: { variant: "outline", icon: <Clock size={14} /> },
      processing: { variant: "secondary", icon: <Loader2 size={14} className="animate-spin" /> },
      shipped: { variant: "default", icon: <Truck size={14} /> },
      delivered: { variant: "default", icon: <CheckCircle size={14} /> },
      cancelled: { variant: "destructive", icon: <CircleAlert size={14} /> },
      returned: { variant: "destructive", icon: <RotateCcw size={14} /> },
    };

    const badgeStyle = statusMap[status] || { variant: "outline", icon: null };

    return (
      <Badge variant={badgeStyle.variant} className="flex items-center gap-1">
        {badgeStyle.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Priority badge style
  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { variant: "outline" | "secondary" | "destructive"; }> = {
      standard: { variant: "outline" },
      express: { variant: "secondary" },
      urgent: { variant: "destructive" },
    };

    const badgeStyle = priorityMap[priority] || { variant: "outline" };

    return (
      <Badge variant={badgeStyle.variant}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  // Handle status update
  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateOrderMutation.mutate({ id: orderId, status: newStatus });
  };

  // Handle order deletion
  const handleDeleteOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDeleteConfirmOpen(true);
  };

  // Confirm delete order
  const confirmDeleteOrder = () => {
    if (selectedOrderId) {
      deleteOrderMutation.mutate(selectedOrderId);
    }
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage orders, process returns, and track deliveries
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)} size="sm">
            <Plus size={16} className="mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders List Panel */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Orders</CardTitle>
              <CardDescription>View and manage all orders</CardDescription>
              
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Search size={16} />
                  </Button>
                </div>
                
                <Select 
                  value={statusFilter || ""}
                  onValueChange={(value) => setStatusFilter(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-60">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : isError ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p>Error loading orders</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                    Try Again
                  </Button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Package2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {filteredOrders.map((order) => (
                    <Card 
                      key={order.id} 
                      className={`cursor-pointer ${selectedOrderId === order.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between">
                          <div className="font-medium">{order.orderNumber}</div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{order.customerName}</div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-sm">${order.totalValue.toFixed(2)}</div>
                          {getPriorityBadge(order.priority)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Details Panel */}
        <div className="md:col-span-2">
          <Card className="h-full">
            {!selectedOrder ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
                <Clipboard className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg">Select an order to view details</p>
              </div>
            ) : (
              <>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order #{selectedOrder.orderNumber}
                        {getStatusBadge(selectedOrder.status)}
                      </CardTitle>
                      <CardDescription>Created on {new Date(selectedOrder.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {['delivered', 'shipped'].includes(selectedOrder.status) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setReturnDialogOpen(true)}
                        >
                          <RotateCcw size={16} className="mr-2" />
                          Create Return
                        </Button>
                      )}
                      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete order #{selectedOrder.orderNumber}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteOrder}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="details">
                    <TabsList className="mb-4">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="items">Items</TabsTrigger>
                      <TabsTrigger value="returns">Returns</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-sm mb-1 flex items-center">
                            <Users size={16} className="mr-2 text-muted-foreground" />
                            Customer Information
                          </h3>
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div>
                                  <div className="text-sm text-muted-foreground">Name</div>
                                  <div>{selectedOrder.customerName}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">Type</div>
                                  <div className="capitalize">{selectedOrder.customerType}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">Location</div>
                                  <div className="flex items-center">
                                    <MapPin size={14} className="mr-1 text-muted-foreground" />
                                    {selectedOrder.customerLocation}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h3 className="font-medium text-sm mb-1 flex items-center">
                            <Calendar size={16} className="mr-2 text-muted-foreground" />
                            Delivery Information
                          </h3>
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div>
                                  <div className="text-sm text-muted-foreground">Delivery Priority</div>
                                  <div className="flex items-center">{getPriorityBadge(selectedOrder.priority)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">Estimated Delivery</div>
                                  <div>{new Date(selectedOrder.estimatedDeliveryDate).toLocaleDateString()}</div>
                                </div>
                                {selectedOrder.actualDeliveryDate && (
                                  <div>
                                    <div className="text-sm text-muted-foreground">Actual Delivery</div>
                                    <div>{new Date(selectedOrder.actualDeliveryDate).toLocaleDateString()}</div>
                                  </div>
                                )}
                                {selectedOrder.assignedShipmentId && (
                                  <div>
                                    <div className="text-sm text-muted-foreground">Shipment ID</div>
                                    <div>{selectedOrder.assignedShipmentId}</div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="sm:col-span-2">
                          <h3 className="font-medium text-sm mb-1 flex items-center">
                            <FileSpreadsheet size={16} className="mr-2 text-muted-foreground" />
                            Payment Information
                          </h3>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex flex-wrap justify-between gap-4">
                                <div>
                                  <div className="text-sm text-muted-foreground">Total Value</div>
                                  <div className="text-lg font-bold">${selectedOrder.totalValue.toFixed(2)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">Payment Status</div>
                                  <div className="capitalize">{selectedOrder.paymentStatus.replace('_', ' ')}</div>
                                </div>
                                {selectedOrder.invoiceNumber && (
                                  <div>
                                    <div className="text-sm text-muted-foreground">Invoice Number</div>
                                    <div>{selectedOrder.invoiceNumber}</div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {selectedOrder.notes && (
                          <div className="sm:col-span-2">
                            <h3 className="font-medium text-sm mb-1">Notes</h3>
                            <Card>
                              <CardContent className="p-4">
                                <p className="text-sm">{selectedOrder.notes}</p>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <h3 className="font-medium text-sm mb-2">Update Status</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedOrder.id, 'pending')}
                            disabled={selectedOrder.status === 'pending'}
                          >
                            Pending
                          </Button>
                          <Button 
                            variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}
                            disabled={selectedOrder.status === 'processing'}
                          >
                            Processing
                          </Button>
                          <Button 
                            variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedOrder.id, 'shipped')}
                            disabled={selectedOrder.status === 'shipped'}
                          >
                            Shipped
                          </Button>
                          <Button 
                            variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
                            disabled={selectedOrder.status === 'delivered'}
                          >
                            Delivered
                          </Button>
                          <Button 
                            variant={selectedOrder.status === 'cancelled' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')}
                            disabled={selectedOrder.status === 'cancelled'}
                          >
                            Cancelled
                          </Button>
                          <Button 
                            variant={selectedOrder.status === 'returned' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedOrder.id, 'returned')}
                            disabled={selectedOrder.status === 'returned'}
                          >
                            Returned
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="items">
                      {orderItems.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                          <Package2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No items found for this order</p>
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="p-0">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left p-3">Product</th>
                                    <th className="text-left p-3">SKU</th>
                                    <th className="text-left p-3">Qty</th>
                                    <th className="text-left p-3">Unit Price</th>
                                    <th className="text-left p-3">Total</th>
                                    <th className="text-left p-3">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orderItems.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-muted/50">
                                      <td className="p-3">{item.productName}</td>
                                      <td className="p-3">{item.productSKU}</td>
                                      <td className="p-3">{item.quantity}</td>
                                      <td className="p-3">${item.unitPrice.toFixed(2)}</td>
                                      <td className="p-3">${item.totalPrice.toFixed(2)}</td>
                                      <td className="p-3 capitalize">{item.status}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="returns">
                      {returnRequests.filter(r => r.orderId === selectedOrder.id).length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                          <RotateCcw className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No returns found for this order</p>
                          {['delivered', 'shipped'].includes(selectedOrder.status) && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setReturnDialogOpen(true)}
                            >
                              Create Return Request
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {returnRequests
                            .filter(r => r.orderId === selectedOrder.id)
                            .map((returnRequest) => (
                              <Card key={returnRequest.id}>
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">
                                      Return #{returnRequest.id}
                                    </CardTitle>
                                    <Badge 
                                      variant={returnRequest.status === 'rejected' ? 'destructive' : 'outline'}
                                      className="capitalize"
                                    >
                                      {returnRequest.status}
                                    </Badge>
                                  </div>
                                  <CardDescription>
                                    Requested on {new Date(returnRequest.requestDate).toLocaleDateString()}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Reason</h4>
                                      <p className="capitalize">{returnRequest.reason.replace('_', ' ')}</p>
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Return Method</h4>
                                      <p className="capitalize">{returnRequest.returnMethod.replace('_', ' ')}</p>
                                    </div>
                                    
                                    {returnRequest.resolutionType && (
                                      <div>
                                        <h4 className="text-sm font-medium mb-1">Resolution</h4>
                                        <p className="capitalize">{returnRequest.resolutionType.replace('_', ' ')}</p>
                                      </div>
                                    )}
                                    
                                    {returnRequest.notes && (
                                      <div>
                                        <h4 className="text-sm font-medium mb-1">Notes</h4>
                                        <p className="text-sm">{returnRequest.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Create Order Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Enter the order details. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="customerName" className="text-sm font-medium">
                  Customer Name *
                </label>
                <Input id="customerName" placeholder="Enter customer name" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="customerType" className="text-sm font-medium">
                  Customer Type *
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="customerLocation" className="text-sm font-medium">
                Customer Location *
              </label>
              <Input id="customerLocation" placeholder="Enter address" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority *
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="totalValue" className="text-sm font-medium">
                  Total Value *
                </label>
                <Input 
                  id="totalValue" 
                  placeholder="0.00"
                  type="number"
                  step="0.01" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="estimatedDelivery" className="text-sm font-medium">
                  Estimated Delivery Date *
                </label>
                <Input 
                  id="estimatedDelivery" 
                  type="date"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="paymentStatus" className="text-sm font-medium">
                  Payment Status *
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partially_paid">Partially Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <Input id="notes" placeholder="Add notes (optional)" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Return Dialog */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Return Request</DialogTitle>
            <DialogDescription>
              Create a return request for order #{selectedOrder?.orderNumber}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="returnReason" className="text-sm font-medium">
                Return Reason *
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="incorrect_item">Incorrect Item</SelectItem>
                  <SelectItem value="unwanted">Unwanted</SelectItem>
                  <SelectItem value="defective">Defective</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="returnMethod" className="text-sm font-medium">
                Return Method *
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="drop_off">Drop Off</SelectItem>
                  <SelectItem value="mail">Mail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="returnNotes" className="text-sm font-medium">
                Notes
              </label>
              <Input id="returnNotes" placeholder="Add notes (optional)" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Return Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}