import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  BarChart3, 
  Package2, 
  CheckCircle2, 
  Clock,
  Search,
  RefreshCw,
  CloudRain,
  Plane,
  Waves,
  PlaneTakeoff,
  Car,
  Warehouse as WarehouseIcon,
  ShieldAlert,
  PanelTop,
  Wind
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getQueryFn } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { InventoryAlert, Shipment, WeatherAlert, WeatherEvent } from "@shared/types";

export default function WarehouseDashboard() {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setLocation] = useLocation();
  const [selectedTransportMode, setSelectedTransportMode] = useState<string>("truck");

  useEffect(() => {
    // Check if user is logged in
    const userJson = sessionStorage.getItem("user");
    if (!userJson) {
      setLocation("/login");
      return;
    }

    const userData = JSON.parse(userJson);
    setUser(userData);

    // If not a warehouse staff, redirect to appropriate dashboard
    if (userData.role !== "warehouse_staff") {
      if (userData.role === "driver") {
        setLocation("/driver-dashboard");
      } else if (userData.role === "business_owner") {
        setLocation("/business-dashboard");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [setLocation]);

  const { data: inventoryAlerts = [] } = useQuery<InventoryAlert[]>({
    queryKey: ["/api/inventory/alerts"],
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

  const { data: weatherEvents = [] } = useQuery<WeatherEvent[]>({
    queryKey: ["/api/weather/events"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Filter incoming shipments (for demonstration purposes)
  const incomingShipments = (shipments as Shipment[]).filter(s => s.status === "on-schedule").slice(0, 4);
  
  // Filter outgoing shipments (for demonstration purposes)
  const outgoingShipments = (shipments as Shipment[]).filter(s => s.status !== "delivered").slice(0, 4);
  
  // Implementation of search functionality
  const filteredInventoryAlerts = (inventoryAlerts as InventoryAlert[]).filter(alert =>
    alert.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Critical weather alerts for predictive supply chain resilience
  const criticalWeatherAlerts = (weatherAlerts as WeatherAlert[])
    .filter(alert => alert.severity === "severe")
    .slice(0, 3);
  
  // Handle marking an item as picked
  const handleMarkAsPicked = (shipmentId: string) => {
    toast({
      title: "Item Picked",
      description: `Shipment ${shipmentId} has been marked as picked`,
    });
  };

  // Handle marking an item as packed
  const handleMarkAsPacked = (shipmentId: string) => {
    toast({
      title: "Item Packed",
      description: `Shipment ${shipmentId} has been marked as packed`,
    });
  };

  // Handle restocking an item
  const handleRestock = (product: string, location: string) => {
    toast({
      title: "Restock Order Submitted",
      description: `Restock order for ${product} at ${location} has been submitted`,
    });
  };
  
  // Handle transport mode selection
  const handleTransportModeChange = (mode: string) => {
    setSelectedTransportMode(mode);
    toast({
      title: "Transport Mode Updated",
      description: `Loading instructions updated for ${mode} transport`,
    });
  };
  
  // Handle responding to weather alert
  const handleWeatherAlertAction = (alertTitle: string) => {
    toast({
      title: "Action Taken",
      description: `Inventory adjusted for "${alertTitle}" weather event`,
    });
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Warehouse Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        
        <Button variant="outline" onClick={() => setLocation("/login")}>Sign Out</Button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">24</div>
              <Truck className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground">14 need picking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{(inventoryAlerts as InventoryAlert[]).length}</div>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground">
              {(inventoryAlerts as InventoryAlert[]).filter(a => a.severity === "critical").length} critical items
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">78%</div>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </div>
            <Progress value={78} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Items Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">126</div>
              <Package2 className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Inventory Alerts</CardTitle>
            <div className="flex mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or locations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="ml-2">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventoryAlerts.slice(0, 5).map((alert: InventoryAlert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.product}</TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={alert.percentage} 
                          className={`h-2 w-20 ${
                            alert.severity === "critical" 
                              ? "[--progress-fill:theme(colors.red.500)]" 
                              : alert.severity === "low" 
                              ? "[--progress-fill:theme(colors.amber.500)]" 
                              : "[--progress-fill:theme(colors.green.500)]"
                          }`}
                        />
                        <span className="text-xs">{alert.current}/{alert.minimum}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          alert.severity === "critical" 
                            ? "destructive" 
                            : alert.severity === "low" 
                            ? "outline" 
                            : "default"
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRestock(alert.product, alert.location)}
                      >
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Picking Tasks</span>
                <span className="text-sm text-blue-600 font-medium">18 pending</span>
              </div>
              <Progress value={65} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>14 completed</span>
                <span>Target: 30</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Packing Tasks</span>
                <span className="text-sm text-green-600 font-medium">6 pending</span>
              </div>
              <Progress value={80} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>24 completed</span>
                <span>Target: 30</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Inventory Tasks</span>
                <span className="text-sm text-amber-600 font-medium">12 pending</span>
              </div>
              <Progress value={30} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>9 completed</span>
                <span>Target: 30</span>
              </div>
            </div>
            
            <Button className="w-full">View All Tasks</Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="incoming">Incoming Shipments</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing Shipments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incoming" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomingShipments.map((shipment: Shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.shipmentId}</TableCell>
                      <TableCell>{shipment.origin}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            shipment.status === "on-schedule" 
                              ? "default" 
                              : shipment.status === "delayed" 
                              ? "destructive" 
                              : "outline"
                          }
                        >
                          {shipment.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{shipment.eta}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleMarkAsPicked(shipment.shipmentId)}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Receive</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outgoing" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outgoingShipments.map((shipment: Shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.shipmentId}</TableCell>
                      <TableCell>{shipment.destination}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            shipment.status === "on-schedule" 
                              ? "default" 
                              : shipment.status === "delayed" 
                              ? "destructive" 
                              : "outline"
                          }
                        >
                          {shipment.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            shipment.priority === "high" 
                              ? "destructive" 
                              : shipment.priority === "medium" 
                              ? "default" 
                              : "outline"
                          }
                        >
                          {shipment.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleMarkAsPicked(shipment.shipmentId)}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Pick</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleMarkAsPacked(shipment.shipmentId)}
                          >
                            <Package className="h-3 w-3" />
                            <span>Pack</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Weather Alerts - Predictive Supply Chain Resilience Feature */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Predictive Supply Chain Resilience</h2>
        
        {criticalWeatherAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalWeatherAlerts.map((alert) => (
              <Card key={alert.id} className="border-red-200 bg-red-50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="destructive" className="mb-2">Severe Alert</Badge>
                      <CardTitle className="text-base">{alert.title}</CardTitle>
                    </div>
                    <CloudRain className="h-5 w-5 text-red-500" />
                  </div>
                  <CardDescription className="text-red-800">
                    {alert.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Clock className="h-4 w-4" />
                    <span>{alert.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4" />
                    <span>{alert.affectedShipments} shipments affected</span>
                  </div>
                  <div className="text-sm mt-3">
                    <p className="font-medium">Recommendations:</p>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      <li>Relocate vulnerable inventory</li>
                      <li>Inform drivers about potential delays</li>
                      <li>Prepare alternative dispatching plan</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleWeatherAlertAction(alert.title)}
                  >
                    Take Action
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertTitle>No Critical Weather Alerts</AlertTitle>
            <AlertDescription>
              All supply routes are currently operating normally.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Multi-Modal Logistics Orchestration Feature */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Multi-Modal Logistics</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transport Mode Selection</CardTitle>
            <CardDescription>
              Select transport mode for prepared shipments to ensure correct loading procedures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={`cursor-pointer border-2 transition-all ${selectedTransportMode === 'truck' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => handleTransportModeChange('truck')}>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Truck className={`h-10 w-10 mb-2 ${selectedTransportMode === 'truck' ? 'text-blue-500' : 'text-gray-500'}`} />
                  <p className="font-medium">Road Transport</p>
                  <p className="text-xs text-muted-foreground mt-1">Standard palletized loading</p>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer border-2 transition-all ${selectedTransportMode === 'plane' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => handleTransportModeChange('plane')}>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <PlaneTakeoff className={`h-10 w-10 mb-2 ${selectedTransportMode === 'plane' ? 'text-blue-500' : 'text-gray-500'}`} />
                  <p className="font-medium">Air Freight</p>
                  <p className="text-xs text-muted-foreground mt-1">ULD container loading</p>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer border-2 transition-all ${selectedTransportMode === 'uav' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => handleTransportModeChange('uav')}>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Wind className={`h-10 w-10 mb-2 ${selectedTransportMode === 'uav' ? 'text-blue-500' : 'text-gray-500'}`} />
                  <p className="font-medium">UAV Delivery</p>
                  <p className="text-xs text-muted-foreground mt-1">Lightweight packaging required</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <PanelTop className="h-4 w-4" />
                Loading Instructions for {selectedTransportMode === 'truck' ? 'Road Transport' : selectedTransportMode === 'plane' ? 'Air Freight' : 'UAV Delivery'}:
              </h3>
              <div className="text-sm space-y-2">
                {selectedTransportMode === 'truck' && (
                  <>
                    <p>• Use standard pallets and secure with straps</p>
                    <p>• Heavy items on bottom, fragile on top</p>
                    <p>• Ensure weight is distributed evenly across the trailer</p>
                    <p>• Apply Western Sydney specific securing for M7/M4 motorway transit</p>
                  </>
                )}
                {selectedTransportMode === 'plane' && (
                  <>
                    <p>• Use airport-approved Unit Load Devices only</p>
                    <p>• Follow weight restrictions strictly (max 6800kg per ULD)</p>
                    <p>• Complete dangerous goods declaration if applicable</p>
                    <p>• Prepare for Western Sydney Airport handling requirements</p>
                  </>
                )}
                {selectedTransportMode === 'uav' && (
                  <>
                    <p>• Max package weight: 2.5kg per unit</p>
                    <p>• Wind-resistant packaging required</p>
                    <p>• Affix correct QR codes for drone scanning</p>
                    <p>• Use Sydney urban drone corridor approved packaging</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}