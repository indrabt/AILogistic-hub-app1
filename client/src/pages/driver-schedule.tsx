import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useLocation } from "wouter";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getQueryFn } from "@/lib/queryClient";
import { Route } from "@shared/types";
import DriverSidebarLayout from "@/components/layouts/DriverSidebarLayout";

export default function DriverSchedule() {
  const [user, setUser] = useState<any>(null);
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

  const content = (
    <div className="container mx-auto p-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Weekly Schedule</h1>
        <p className="text-muted-foreground">View your upcoming deliveries</p>
      </header>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" /> This Week
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
                  <div className="p-3 text-center text-muted">
                    No deliveries scheduled
                  </div>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-3 font-medium">Friday, March 24</div>
                <div className="divide-y">
                  <div className="p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">Liverpool Regional Route</div>
                      <Badge className={getStatusBadgeClass("on-schedule")}>
                        Scheduled
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Warehouse → Liverpool
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <DriverSidebarLayout>
      {content}
    </DriverSidebarLayout>
  );
}