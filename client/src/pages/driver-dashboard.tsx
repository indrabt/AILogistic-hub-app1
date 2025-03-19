import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Truck, 
  MapPin, 
  Clock, 
  CalendarClock
} from "lucide-react";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getQueryFn } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Shipment, Route } from "@shared/types";

type DriverStatus = "available" | "on-delivery" | "break" | "off-duty";

export default function DriverDashboard() {
  const [user, setUser] = useState<any>(null);
  const [driverStatus, setDriverStatus] = useState<DriverStatus>("available");
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const userJson = sessionStorage.getItem("user");
    if (!userJson) {
      setLocation("/login");
      return;
    }

    const userData = JSON.parse(userJson);
    setUser(userData);

    // If not a driver, redirect to appropriate dashboard
    if (userData.role !== "driver") {
      if (userData.role === "business_owner") {
        setLocation("/business-dashboard");
      } else if (userData.role === "warehouse_staff") {
        setLocation("/warehouse-dashboard");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [setLocation]);

  const { data: routes = [] } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: shipments = [] } = useQuery<Shipment[]>({
    queryKey: ["/api/shipments"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Driver's assigned routes (for demonstration purposes, we'll filter by ID < 3)
  const assignedRoutes = (routes as Route[]).filter(route => route.id < 3);
  
  // Current shipment (for demonstration purposes, we'll use the first shipment)
  const currentShipment = (shipments as Shipment[])[0];
  
  // Handler function for status change
  const handleStatusChange = (newStatus: DriverStatus) => {
    setDriverStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Your status is now set to ${newStatus.replace('-', ' ')}`,
    });
  };
  
  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Helper for badge colors
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "on-schedule": return "bg-green-100 text-green-800";
      case "delayed": return "bg-red-100 text-red-800";
      case "delivered": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name || user.username}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select
              value={driverStatus}
              onValueChange={(value) => handleStatusChange(value as DriverStatus)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="on-delivery">On Delivery</SelectItem>
                <SelectItem value="break">On Break</SelectItem>
                <SelectItem value="off-duty">Off Duty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => setLocation("/login")}>Sign Out</Button>
        </div>
      </header>
      
      {/* Navigation buttons */}
      <div className="flex space-x-2 mb-4">
        <Button 
          variant="default"
          className="flex-1 sm:flex-initial"
        >
          <Truck className="mr-2 h-4 w-4" /> Dashboard
        </Button>
        <Button 
          variant="outline"
          onClick={() => setLocation("/driver-schedule")}
          className="flex-1 sm:flex-initial"
        >
          <CalendarClock className="mr-2 h-4 w-4" /> Schedule
        </Button>
      </div>
      
      {/* Dashboard content */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" /> Current Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentShipment ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{currentShipment.shipmentId}</p>
                      <p className="text-sm text-gray-500">
                        {currentShipment.origin} → {currentShipment.destination}
                      </p>
                    </div>
                    <Badge className={getStatusBadgeClass(currentShipment.status)}>
                      {currentShipment.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expected arrival</p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{currentShipment.eta}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 text-gray-500">
                  No active deliveries
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Routes card */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Routes</CardTitle>
            </CardHeader>
            <CardContent>
              {assignedRoutes.length > 0 ? (
                <div className="space-y-4">
                  {assignedRoutes.map((route) => (
                    <div key={route.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{route.name}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            <span>{route.origin} → {route.destination}</span>
                          </div>
                        </div>
                        <Badge className={getStatusBadgeClass(route.status)}>
                          {route.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 text-gray-500">
                  No routes assigned
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}