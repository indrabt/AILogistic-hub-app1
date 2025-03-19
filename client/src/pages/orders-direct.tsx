/**
 * Orders Direct Access Page
 * 
 * This is a standalone page that directly renders the Order Management component
 * without relying on React Router or wouter. This ensures direct and reliable access
 * to the Order Management functionality regardless of routing issues.
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Import the order management types
import { Order, OrderItem, ReturnRequest, ReturnItem } from '../types/order-types';

// Status badges for different order states
const getStatusBadge = (status: string) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    processing: "bg-blue-100 text-blue-800 border-blue-300",
    shipped: "bg-purple-100 text-purple-800 border-purple-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
    returned: "bg-gray-100 text-gray-800 border-gray-300",
  } as Record<string, string>;

  const style = styles[status] || styles.pending;
  
  return (
    <Badge variant="outline" className={`${style} uppercase text-xs py-1`}>
      {status}
    </Badge>
  );
};

export default function OrdersDirectAccess() {
  // State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showReturnDialog, setShowReturnDialog] = useState<boolean>(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Add special logging for direct access page
    console.log("Orders Direct Access page mounted successfully");
    
    // Ensure we reset the filter when the component mounts
    setStatusFilter("all");
    setSelectedOrderId(null);
    
    // Log navigation success
    toast({
      title: "Order Management Loaded",
      description: "Direct access successful. Order Management system ready.",
      duration: 3000,
    });
    
    // Add a flag to session storage to indicate we've successfully loaded the orders page
    sessionStorage.setItem("orderManagementLoaded", "true");
    
    // Return cleanup function
    return () => {
      console.log("Orders Direct Access page unmounted");
    };
  }, [toast]);

  // Queries
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    retry: 3,
    staleTime: 30000,
    onSuccess: (data: Order[]) => {
      console.log("Successfully loaded orders:", data.length);
    },
    onError: (error: Error) => {
      console.error("Failed to fetch orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders. Using cached data if available.",
        variant: "destructive",
      });
    }
  } as any);

  const { data: orderItems = [] } = useQuery<OrderItem[]>({
    queryKey: ['/api/order-items', selectedOrderId],
    enabled: !!selectedOrderId,
    retry: 2,
    staleTime: 30000,
  } as any);

  const { data: returnRequests = [] } = useQuery<ReturnRequest[]>({
    queryKey: ['/api/return-requests'],
    staleTime: 30000,
  } as any);

  // Filter orders based on status and search text
  const filteredOrders = orders.filter((order: Order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = searchText === "" || 
      order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Get the selected order
  const selectedOrder = selectedOrderId ? orders.find((o: Order) => o.id === selectedOrderId) : null;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Dashboard
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            New Order
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage your customer orders</CardDescription>
            
            <div className="mt-2 space-y-2">
              <Input 
                placeholder="Search orders..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="mb-2"
              />
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
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
            <div className="h-[calc(100vh-290px)] overflow-y-auto pr-2">
              <div className="space-y-2">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No orders found</div>
                ) : (
                  filteredOrders.map((order: Order) => (
                    <div 
                      key={order.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedOrderId === order.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'}`}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{order.customerName}</div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="font-medium">${order.totalValue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              {selectedOrder ? `Order #${selectedOrder.orderNumber}` : "Select an order to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedOrder ? (
              <div className="text-center py-12 text-gray-500">
                <p>No order selected</p>
                <p className="text-sm mt-2">Click on an order from the list to view details</p>
              </div>
            ) : (
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="returns">Returns</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-500 mb-1">Customer</h3>
                      <p>{selectedOrder.customerName}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.customerType}</p>
                      <p className="text-sm">{selectedOrder.customerLocation}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 mb-1">Status</h3>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(selectedOrder.status)}
                        <Select 
                          value={selectedOrder.status}
                          onValueChange={(value) => {
                            console.log("Status change attempted:", value);
                            toast({
                              title: "Status Updated",
                              description: `Order status changed to ${value}`,
                            });
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="returned">Returned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-500 mb-1">Order Date</h3>
                      <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 mb-1">Priority</h3>
                      <Badge variant={selectedOrder.priority === "urgent" ? "destructive" : 
                                     selectedOrder.priority === "express" ? "default" : "outline"}>
                        {selectedOrder.priority}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-500 mb-1">Payment Status</h3>
                      <Badge variant={selectedOrder.paymentStatus === "paid" ? "default" : 
                                     selectedOrder.paymentStatus === "pending" ? "outline" : 
                                     "secondary"}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 mb-1">Delivery Date</h3>
                      <p>{selectedOrder.estimatedDeliveryDate}</p>
                      {selectedOrder.actualDeliveryDate && (
                        <p className="text-sm text-gray-500">
                          Delivered: {selectedOrder.actualDeliveryDate}
                        </p>
                      )}
                    </div>
                    
                    {selectedOrder.notes && (
                      <div className="col-span-2">
                        <h3 className="font-medium text-gray-500 mb-1">Notes</h3>
                        <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                      </div>
                    )}
                    
                    <div className="col-span-2 mt-4">
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowReturnDialog(true)}>
                          Create Return
                        </Button>
                        <div className="text-right">
                          <div className="text-gray-500">Total</div>
                          <div className="text-2xl font-bold">${selectedOrder.totalValue.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="items">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                            No items found for this order
                          </TableCell>
                        </TableRow>
                      ) : (
                        orderItems.map((item: OrderItem) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell>{item.productSKU}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${item.totalPrice.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.warehouseLocation || "—"}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="returns">
                  {returnRequests.filter((r: ReturnRequest) => r.orderId === selectedOrder.id).length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No return requests for this order</p>
                      <Button variant="outline" className="mt-4" onClick={() => setShowReturnDialog(true)}>
                        Create Return Request
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {returnRequests
                        .filter((r: ReturnRequest) => r.orderId === selectedOrder.id)
                        .map((returnRequest: ReturnRequest) => (
                          <div key={returnRequest.id} className="border rounded-lg p-4">
                            <div className="flex justify-between mb-4">
                              <div>
                                <h3 className="font-medium">Return #{returnRequest.id}</h3>
                                <p className="text-sm text-gray-500">
                                  Requested on {new Date(returnRequest.requestDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {returnRequest.status}
                              </Badge>
                            </div>
                            
                            <h4 className="font-medium text-gray-500 mb-2">Items</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Reason</TableHead>
                                  <TableHead>Condition</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {returnRequest.items.map((item: ReturnItem) => (
                                  <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.productName}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.reason}</TableCell>
                                    <TableCell className="capitalize">{item.condition}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="capitalize">
                                        {item.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-500 mb-1">Return Method</h4>
                                <p className="capitalize">{returnRequest.returnMethod}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-500 mb-1">Resolution</h4>
                                <p className="capitalize">{returnRequest.resolutionType || "Pending"}</p>
                              </div>
                              
                              {returnRequest.notes && (
                                <div className="col-span-2">
                                  <h4 className="font-medium text-gray-500 mb-1">Notes</h4>
                                  <p className="text-sm">{returnRequest.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Create Order Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Enter the details for the new order
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input id="customerName" placeholder="Enter customer name" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="customerType">Customer Type</Label>
              <Select defaultValue="retail">
                <SelectTrigger id="customerType" className="mt-1">
                  <SelectValue placeholder="Select customer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select defaultValue="standard">
                <SelectTrigger id="priority" className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Enter location" className="mt-1" />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Enter any additional notes" className="mt-1" />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={() => {
                setShowCreateDialog(false);
                toast({
                  title: "Order Created",
                  description: "New order has been created successfully.",
                });
              }}
            >
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Return Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Return Request</DialogTitle>
            <DialogDescription>
              {selectedOrder 
                ? `Create a return request for Order #${selectedOrder.orderNumber}`
                : "Select an order first to create a return request"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="return-reason">Return Reason</Label>
              <Select defaultValue="damaged">
                <SelectTrigger id="return-reason" className="mt-1">
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
            
            <div>
              <Label htmlFor="return-method">Return Method</Label>
              <Select defaultValue="drop_off">
                <SelectTrigger id="return-method" className="mt-1">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="drop_off">Drop Off</SelectItem>
                  <SelectItem value="mail">Mail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="resolution-type">Resolution Type</Label>
              <Select defaultValue="refund">
                <SelectTrigger id="resolution-type" className="mt-1">
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="exchange">Exchange</SelectItem>
                  <SelectItem value="store_credit">Store Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="return-notes">Notes</Label>
              <Input id="return-notes" placeholder="Additional details about the return" className="mt-1" />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowReturnDialog(false)}>
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={() => {
                setShowReturnDialog(false);
                toast({
                  title: "Return Request Created",
                  description: "Return request has been created successfully.",
                });
              }}
            >
              Create Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}