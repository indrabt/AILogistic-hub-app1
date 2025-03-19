import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Truck, 
  MapPin, 
  Clock, 
  PackageOpen, 
  ArrowUpDown, 
  Check, 
  AlertTriangle, 
  CalendarClock, 
  Calendar, 
  SquarePen
} from "lucide-react";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getQueryFn } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Shipment, Route, WeatherAlert } from "@shared/types";

type DriverStatus = "available" | "on-delivery" | "break" | "off-duty";

export default function DriverDashboard() {
  const [user, setUser] = useState<any>(null);
  const [driverStatus, setDriverStatus] = useState<DriverStatus>("available");
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [location, setLocation] = useLocation();
  const [activeView, setActiveView] = useState<string>("dashboard");
  
  // Check for URL parameters to determine active view
  useEffect(() => {
    // Check if we should show schedule view
    if (location.includes("?view=schedule")) {
      setActiveView("schedule");
    } else {
      setActiveView("dashboard");
    }
  }, [location]);

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
  
  const { data: weatherAlerts = [] } = useQuery<WeatherAlert[]>({
    queryKey: ["/api/weather/alerts"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Driver's assigned routes (for demonstration purposes, we'll filter by ID < 3)
  const assignedRoutes = (routes as Route[]).filter(route => route.id < 3);
  
  // Current shipment (for demonstration purposes, we'll use the first shipment)
  const currentShipment = (shipments as Shipment[])[0];
  
  // Route status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimized":
        return "text-green-600";
      case "delayed":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };
  
  // Status badge color
  const getShipmentStatusColor = (status: string) => {
    switch (status) {
      case "on-schedule":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      case "delivered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Driver status handler
  const handleStatusChange = (newStatus: DriverStatus) => {
    setDriverStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Your status is now set to ${newStatus.replace('-', ' ')}`,
    });
  };
  
  // Complete delivery handler
  const handleCompleteDelivery = () => {
    toast({
      title: "Delivery Completed",
      description: "The delivery has been marked as completed successfully",
    });
  };
  
  // Report issue handler
  const handleReportIssue = () => {
    toast({
      title: "Issue Reported",
      description: "Your report has been submitted. Dispatch will contact you shortly.",
      variant: "destructive",
    });
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <span>Current Delivery</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentShipment ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">Shipment ID</p>
                    <p>{currentShipment.shipmentId}</p>
                  </div>
                  <Badge className={getShipmentStatusColor(currentShipment.status)}>
                    {currentShipment.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">From</p>
                      <p className="text-sm">{currentShipment.origin}</p>
                    </div>
                  </div>
                  
                  <div className="ml-2 h-6 border-l-2 border-dashed border-gray-300"></div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">To</p>
                      <p className="text-sm">{currentShipment.destination}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">ETA</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{currentShipment.eta}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Priority</p>
                    <Badge variant={currentShipment.priority === "high" ? "destructive" : "outline"}>
                      {currentShipment.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button 
                    className="w-full flex items-center gap-1" 
                    onClick={handleCompleteDelivery}
                  >
                    <Check className="h-4 w-4" />
                    <span>Complete</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-1"
                    onClick={handleReportIssue}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Report Issue</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No active deliveries
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-blue-600" />
              <span>Route Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignedRoutes.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {assignedRoutes[0].name}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Distance:</span>
                    <span className="font-medium">{assignedRoutes[0].distance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ETA:</span>
                    <span className="font-medium">{assignedRoutes[0].eta}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span className={`font-medium ${getStatusColor(assignedRoutes[0].status)}`}>
                      {assignedRoutes[0].status}
                    </span>
                  </div>
                  
                  {assignedRoutes[0].savings && (
                    <div className="flex justify-between text-sm">
                      <span>Savings:</span>
                      <span className="font-medium text-green-600">{assignedRoutes[0].savings}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Completion</p>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-right mt-1 text-gray-500">75% complete</p>
                </div>
                
                <Button variant="outline" className="w-full">View Full Route</Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No routes assigned
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Weather Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(weatherAlerts as WeatherAlert[]).length > 0 ? (
              <div className="space-y-4 max-h-[250px] overflow-y-auto">
                {(weatherAlerts as WeatherAlert[]).map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Badge variant={alert.severity === "severe" ? "destructive" : "default"}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{alert.time}</span>
                      {alert.affectedShipments && (
                        <span>{alert.affectedShipments} shipments affected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No weather alerts
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Routes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Route Name</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedRoutes.map((route: Route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.id}</TableCell>
                      <TableCell>{route.name}</TableCell>
                      <TableCell>{route.origin}</TableCell>
                      <TableCell>{route.destination}</TableCell>
                      <TableCell>{route.eta}</TableCell>
                      <TableCell>
                        <Badge className={getShipmentStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-32 text-gray-500">
                No completed routes in the last 7 days
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Route Name</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Distance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(routes as Route[]).slice(0, 5).map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.id}</TableCell>
                      <TableCell>{route.name}</TableCell>
                      <TableCell>{route.origin}</TableCell>
                      <TableCell>{route.destination}</TableCell>
                      <TableCell>
                        <Badge className={getShipmentStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{route.distance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}