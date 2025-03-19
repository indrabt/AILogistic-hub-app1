/**
 * Orders Direct Access Page (Minimal Version)
 * 
 * This is a simplified version of the orders direct page to fix duplicate declaration issues.
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Import the order management types
import { Order } from '../types/order-types';

export default function OrdersDirectMinimal() {
  // State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  const [isDirectAccessActive, setIsDirectAccessActive] = useState<boolean>(false);
  
  // Initialize hooks
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Component initialization
  useEffect(() => {
    // Log access details for diagnostics
    console.log("Orders Direct Minimal Page Accessed:", new Date().toISOString());
    
    // Record successful page load in session storage
    sessionStorage.setItem("orderManagementLoaded", "true");
    sessionStorage.setItem("orderManagementLoadTime", new Date().toISOString());
    
    setIsDirectAccessActive(true);
    
    // Log navigation success
    toast({
      title: "Order Management Loaded",
      description: "Successfully accessed via minimal page",
      variant: "default",
      duration: 3000,
    });
    
    // Return cleanup function
    return () => {
      console.log("Orders Direct Minimal page unmounted");
      sessionStorage.setItem("orderManagementUnloaded", new Date().toISOString());
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

  // Filter orders based on status and search text
  const filteredOrders = orders.filter((order: Order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = searchText === "" || 
      order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management (Minimal)</h1>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Dashboard
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage your customer orders</CardDescription>
          
          <div className="mt-2 space-y-2">
            <Input 
              placeholder="Search orders..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="mb-2"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[calc(100vh-290px)] overflow-y-auto pr-2">
            <div className="space-y-2">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No orders found</div>
              ) : (
                <div className="grid gap-4">
                  {filteredOrders.map((order: Order) => (
                    <div 
                      key={order.id}
                      className="p-3 border rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{order.customerName}</div>
                        </div>
                        <Badge variant="outline" className="uppercase text-xs py-1">
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="font-medium">${order.totalValue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}