import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  MapPin, 
  Truck,
  ArrowLeft
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
import { Route } from "@shared/types";

type DriverStatus = "available" | "on-delivery" | "break" | "off-duty";

export default function DriverSchedule() {
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

  // Driver's assigned routes (for demonstration purposes, we'll filter by ID < 3)
  const assignedRoutes = (routes as Route[]).filter(route => route.id < 3);
  
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
          <h1 className="text-3xl font-bold">Driver Schedule</h1>
          <p className="text-muted-foreground">Welcome back, {user.name || user.username}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select
              value={driverStatus}
              onValueChange={(value) => setDriverStatus(value as DriverStatus)}
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
      
      <div className="flex space-x-2 mb-4">
        <Button 
          variant="outline"
          onClick={() => setLocation("/driver-dashboard")}
          className="flex-1 sm:flex-initial"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Weekly Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-3 font-medium">Monday, March 20</div>
                <div className="divide-y">
                  {assignedRoutes.map((route) => (
                    <div key={`mon-${route.id}`} className="p-3">
                      <div className="flex justify-between">
                        <div className="font-medium">{route.name}</div>
                        <Badge className={getStatusBadgeClass(route.status)}>
                          {route.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {route.origin} → {route.destination}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-3 font-medium">Tuesday, March 21</div>
                <div className="divide-y">
                  <div className="p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">North Sydney Route</div>
                      <Badge className={getStatusBadgeClass("on-schedule")}>
                        Scheduled
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Warehouse → North Sydney
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-3 font-medium">Wednesday, March 22</div>
                <div className="divide-y">
                  <div className="p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">Parramatta Express</div>
                      <Badge className={getStatusBadgeClass("on-schedule")}>
                        Scheduled
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Distribution Center → Parramatta
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-3 font-medium">Thursday, March 23</div>
                <div className="divide-y">
                  <div className="p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">Eastern Suburbs Delivery</div>
                      <Badge className={getStatusBadgeClass("on-schedule")}>
                        Scheduled
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Distribution Center → Bondi
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-3 font-medium">Friday, March 24</div>
                <div className="divide-y">
                  <div className="p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">North Shore Circuit</div>
                      <Badge className={getStatusBadgeClass("on-schedule")}>
                        Scheduled
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Warehouse → Multiple Drop Points
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Availability Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-2">Preferred Start Time</p>
                  <Select defaultValue="08:00">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">6:00 AM</SelectItem>
                      <SelectItem value="07:00">7:00 AM</SelectItem>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="font-medium mb-2">Preferred End Time</p>
                  <Select defaultValue="17:00">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                      <SelectItem value="19:00">7:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-2">Days Off Requested</p>
                <div className="border rounded-md p-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">March 25 (Saturday)</Badge>
                    <Badge variant="outline">March 26 (Sunday)</Badge>
                    <Badge variant="outline">April 14 (Friday)</Badge>
                  </div>
                </div>
              </div>
              
              <Button className="w-full sm:w-auto">Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}