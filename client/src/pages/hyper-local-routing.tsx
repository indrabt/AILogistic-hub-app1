import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Navigation, Map, AlertTriangle, Clock, PieChart, BarChart3, TrendingUp, Activity, Route } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "../lib/queryClient";
import { cn } from "../lib/utils";

// Define interfaces based on shared/types.ts
interface ConstructionZone {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  impact: "low" | "medium" | "high";
  description: string;
}

interface HyperLocalRoutingData {
  id: number;
  name: string;
  status: "active" | "scheduled" | "completed";
  region: string;
  trafficConditions: "light" | "moderate" | "heavy" | "gridlock";
  weatherConditions: string;
  constructionZones: ConstructionZone[];
  fuelSavings: string;
  timeReduction: string;
  routeEfficiency: number;
  lastUpdated: string;
  edgeDeviceStatus: "online" | "offline" | "degraded";
}

export default function HyperLocalRouting() {
  const [activeTab, setActiveTab] = useState("routes");
  
  // Fetch hyper-local routes
  const { data: routes, isLoading: isLoadingRoutes } = useQuery({
    queryKey: ["/api/hyper-local/routes"],
    queryFn: () => apiRequest<HyperLocalRoutingData[]>("/api/hyper-local/routes")
  });
  
  // Fetch construction zones
  const { data: constructionZones, isLoading: isLoadingZones } = useQuery({
    queryKey: ["/api/hyper-local/construction-zones"],
    queryFn: () => apiRequest<ConstructionZone[]>("/api/hyper-local/construction-zones")
  });

  // Route status color mapping
  const statusColorMap: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  };

  // Traffic condition color mapping
  const trafficColorMap: Record<string, string> = {
    light: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    heavy: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    gridlock: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  // Construction zone impact color mapping
  const impactColorMap: Record<string, string> = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  // Edge device status color mapping
  const deviceStatusColorMap: Record<string, string> = {
    online: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    offline: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    degraded: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
  };

  // Mock real-time map data (in a real implementation, this would be fetched from an API)
  const mockMapComponent = (
    <div className="w-full h-72 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <Map className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Interactive route map would appear here</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Showing real-time traffic and construction data</p>
      </div>
    </div>
  );

  // Mock performance metrics chart (in a real implementation, this would be fetched from an API)
  const mockPerformanceChart = (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Performance metrics chart would appear here</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Showing route efficiency and fuel savings data</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hyper-Local Route Optimization</h1>
        <p className="text-muted-foreground mt-2">
          Real-time route optimization with edge computing and local data processing.
        </p>
      </div>

      <Tabs defaultValue="routes" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">Active Routes</TabsTrigger>
          <TabsTrigger value="construction">Construction Zones</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="routes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Route className="mr-2 h-5 w-5" />
                  Hyper-Local Routes
                </CardTitle>
                <CardDescription>
                  Routes are dynamically optimized based on local conditions and edge device data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRoutes ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Region</TableHead>
                          <TableHead>Traffic</TableHead>
                          <TableHead>Device Status</TableHead>
                          <TableHead>Last Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {routes?.map((route) => (
                          <TableRow key={route.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">{route.name}</TableCell>
                            <TableCell>
                              <Badge className={statusColorMap[route.status]}>
                                {route.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{route.region}</TableCell>
                            <TableCell>
                              <Badge className={trafficColorMap[route.trafficConditions]}>
                                {route.trafficConditions}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={deviceStatusColorMap[route.edgeDeviceStatus]}>
                                {route.edgeDeviceStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(route.lastUpdated).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Route Insights
                </CardTitle>
                <CardDescription>
                  Key insights and metrics for optimized routes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRoutes ? (
                  <div className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {routes?.slice(0, 3).map((route) => (
                      <div key={route.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{route.name}</span>
                          <Badge className={statusColorMap[route.status]}>
                            {route.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fuel Savings:</span>
                            <span className="text-green-600 dark:text-green-400">{route.fuelSavings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time Reduction:</span>
                            <span className="text-green-600 dark:text-green-400">{route.timeReduction}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Efficiency:</span>
                            <span>{route.routeEfficiency}%</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">View Details</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Real-Time Route Map
              </CardTitle>
              <CardDescription>
                Live map showing current routes, traffic conditions, and construction zones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockMapComponent}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="construction" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Construction Zones
                </CardTitle>
                <CardDescription>
                  Active construction zones affecting route optimization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingZones ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Impact</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {constructionZones?.map((zone) => (
                          <TableRow key={zone.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">{zone.name}</TableCell>
                            <TableCell>
                              <Badge className={impactColorMap[zone.impact]}>
                                {zone.impact}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(zone.startDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(zone.endDate).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs truncate">{zone.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Timeline
                </CardTitle>
                <CardDescription>
                  Construction zone timeline and impact duration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingZones ? (
                  <div className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {constructionZones?.slice(0, 4).map((zone) => (
                      <div key={zone.id} className="flex items-center space-x-4">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          zone.impact === "high" ? "bg-red-500" : 
                          zone.impact === "medium" ? "bg-yellow-500" : "bg-green-500"
                        )} />
                        <div className="flex-1 space-y-1">
                          <div className="font-medium text-sm">{zone.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(zone.startDate).toLocaleDateString()} - {new Date(zone.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Construction Zone Map
              </CardTitle>
              <CardDescription>
                Map view of all active construction zones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockMapComponent}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Route Efficiency Metrics
                </CardTitle>
                <CardDescription>
                  Performance analytics for hyper-local route optimization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockPerformanceChart}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Traffic Condition Analysis
                </CardTitle>
                <CardDescription>
                  Analysis of traffic conditions and their impact on routes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockPerformanceChart}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="mr-2 h-5 w-5" />
                Overall Route Optimization Impact
              </CardTitle>
              <CardDescription>
                Analysis of cost savings, time reduction, and environmental impact.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">28%</div>
                  <div className="text-sm text-muted-foreground">Average Fuel Savings</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">32 min</div>
                  <div className="text-sm text-muted-foreground">Average Time Saved</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">89%</div>
                  <div className="text-sm text-muted-foreground">Route Optimization Rate</div>
                </div>
              </div>

              {mockPerformanceChart}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}