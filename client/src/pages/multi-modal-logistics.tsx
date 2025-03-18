import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Train,
  Truck,
  Plane,
  Ship,
  MapPin,
  Navigation,
  Timer,
  DollarSign,
  BarChart3,
  Droplets,
  AlertTriangle,
  ArrowUpDown,
  BarChart2,
  Leaf,
  Route,
  Box,
  Boxes,
} from "lucide-react";

interface MultiModalRoute {
  id: number;
  name: string;
  status: "planned" | "in_progress" | "completed";
  originType: "warehouse" | "airport" | "port" | "distribution_center";
  destinationType: "warehouse" | "airport" | "port" | "distribution_center" | "customer";
  transportModes: TransportSegment[];
  totalDistance: string;
  totalDuration: string;
  totalCost: string;
  co2Emissions: string;
  reliability: number;
}

interface TransportSegment {
  id: number;
  mode: "truck" | "drone" | "air_freight" | "rail" | "last_mile";
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  cost: string;
  status: "pending" | "in_transit" | "completed" | "delayed";
  carrier: string;
}

export default function MultiModalLogistics() {
  const [activeTab, setActiveTab] = useState("routes");
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  // Fetch multi-modal routes
  const { data: routes, isLoading: isLoadingRoutes } = useQuery<MultiModalRoute[]>({
    queryKey: ["/api/multi-modal/routes"]
  });

  // Fetch transport segments for selected route
  const { data: segments, isLoading: isLoadingSegments } = useQuery<TransportSegment[]>({
    queryKey: ["/api/multi-modal/segments", selectedRouteId],
    enabled: !!selectedRouteId
  });

  // Get the currently selected route
  const selectedRoute = routes?.find(route => route.id === selectedRouteId);

  // Status color mapping
  const statusColorMap: Record<string, string> = {
    planned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  };

  // Segment status color mapping
  const segmentStatusColorMap: Record<string, string> = {
    pending: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
    in_transit: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    delayed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  // Transport mode icon mapping
  const transportModeIcon: Record<string, React.ReactNode> = {
    truck: <Truck className="h-5 w-5" />,
    drone: <Plane className="h-5 w-5 rotate-45" />,
    air_freight: <Plane className="h-5 w-5" />,
    rail: <Train className="h-5 w-5" />,
    last_mile: <Box className="h-5 w-5" />
  };

  // Mock performance metrics data
  const performanceMetrics = [
    {
      label: "On-Time Delivery",
      value: "92%",
      trend: "up",
      change: "+3%"
    },
    {
      label: "Cost Efficiency",
      value: "$0.87/km",
      trend: "up",
      change: "-5%"
    },
    {
      label: "Carbon Efficiency",
      value: "112g/km",
      trend: "up",
      change: "-8%"
    },
    {
      label: "Reliability Index",
      value: "94.2%",
      trend: "up",
      change: "+1.5%"
    }
  ];

  // Mock optimization recommendations
  const optimizationRecommendations = [
    {
      id: 1,
      title: "Western Sydney - Brisbane Route Modal Shift",
      description: "Shift 30% of current road freight to rail to reduce carbon emissions and costs",
      potentialSavings: "$45,000 / quarter",
      co2Reduction: "28 tonnes",
      difficulty: "medium"
    },
    {
      id: 2,
      title: "Last-Mile Drone Delivery Program",
      description: "Implement drone delivery for lightweight packages in Western Sydney suburbs",
      potentialSavings: "$32,000 / quarter",
      co2Reduction: "15 tonnes",
      difficulty: "complex"
    },
    {
      id: 3,
      title: "Port Botany to Eastern Creek Consolidation",
      description: "Consolidate shipments from Port Botany to reduce empty miles",
      potentialSavings: "$28,500 / quarter",
      co2Reduction: "19 tonnes",
      difficulty: "easy"
    }
  ];

  // Mock route map component
  const mockRouteMap = (
    <div className="w-full h-72 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Multi-Modal Route Map</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Interactive route visualization would appear here</p>
      </div>
    </div>
  );

  // Mock chart component
  const mockBarChart = (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Performance Chart</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Performance metrics visualization</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Multi-Modal Logistics Orchestration</h1>
        <p className="text-muted-foreground mt-2">
          Integrated planning and optimization across multiple transport modes for maximum efficiency.
        </p>
      </div>

      <Tabs defaultValue="routes" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">Route Planning</TabsTrigger>
          <TabsTrigger value="segments">Transport Segments</TabsTrigger>
          <TabsTrigger value="performance">Performance & Optimization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="routes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Route className="mr-2 h-5 w-5" />
                  Multi-Modal Routes
                </CardTitle>
                <CardDescription>
                  Routes utilizing multiple transport modes for optimal efficiency.
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
                          <TableHead>Route Name</TableHead>
                          <TableHead>Transport Modes</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Distance</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Reliability</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {routes && routes.map((route: MultiModalRoute) => (
                          <TableRow 
                            key={route.id} 
                            className={cn(
                              "cursor-pointer hover:bg-muted/50",
                              selectedRouteId === route.id && "bg-muted/50"
                            )}
                            onClick={() => setSelectedRouteId(route.id)}
                          >
                            <TableCell className="font-medium">{route.name}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                {route.transportModes.map((segment, idx) => (
                                  <div key={idx} className="rounded-full bg-muted p-1">
                                    {transportModeIcon[segment.mode]}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColorMap[route.status]}>
                                {route.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>{route.totalDistance}</TableCell>
                            <TableCell>{route.totalDuration}</TableCell>
                            <TableCell>{route.totalCost}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={route.reliability} className="w-16 h-2" />
                                <span>{route.reliability}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRouteId(route.id);
                                  setActiveTab("segments");
                                }}
                              >
                                View Segments
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowUpDown className="mr-2 h-5 w-5" />
                  Transport Mode Split
                </CardTitle>
                <CardDescription>
                  Distribution of transport modes in use.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4" />
                        <span className="text-sm">Truck</span>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Train className="h-4 w-4" />
                        <span className="text-sm">Rail</span>
                      </div>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Plane className="h-4 w-4" />
                        <span className="text-sm">Air Freight</span>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Plane className="h-4 w-4 rotate-45" />
                        <span className="text-sm">Drone</span>
                      </div>
                      <span className="text-sm font-medium">7%</span>
                    </div>
                    <Progress value={7} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Box className="h-4 w-4" />
                        <span className="text-sm">Last Mile</span>
                      </div>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Route Visualization
              </CardTitle>
              <CardDescription>
                Interactive map of selected multi-modal route.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockRouteMap}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          {selectedRoute ? (
            <>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedRoute.name}</h2>
                    <p className="text-muted-foreground text-sm">
                      {selectedRoute.originType.replace('_', ' ')} → {selectedRoute.destinationType.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedRoute.totalDistance}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedRoute.totalDuration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedRoute.totalCost}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Leaf className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedRoute.co2Emissions}</span>
                    </div>
                    <Badge className={statusColorMap[selectedRoute.status]}>
                      {selectedRoute.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ArrowUpDown className="mr-2 h-5 w-5" />
                    Transport Segments
                  </CardTitle>
                  <CardDescription>
                    Individual transport segments that make up the multi-modal route.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSegments ? (
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
                            <TableHead>Transport Mode</TableHead>
                            <TableHead>Origin → Destination</TableHead>
                            <TableHead>Carrier</TableHead>
                            <TableHead>Distance</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {segments && segments.map((segment: TransportSegment) => (
                            <TableRow key={segment.id} className="cursor-pointer hover:bg-muted/50">
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {transportModeIcon[segment.mode]}
                                  <span className="capitalize">{segment.mode.replace('_', ' ')}</span>
                                </div>
                              </TableCell>
                              <TableCell>{segment.origin} → {segment.destination}</TableCell>
                              <TableCell>{segment.carrier}</TableCell>
                              <TableCell>{segment.distance}</TableCell>
                              <TableCell>{segment.duration}</TableCell>
                              <TableCell>{segment.cost}</TableCell>
                              <TableCell>
                                <Badge className={segmentStatusColorMap[segment.status]}>
                                  {segment.status.replace('_', ' ')}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      Risk Factors
                    </CardTitle>
                    <CardDescription>
                      Potential risks affecting the transport segments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="rounded-full bg-white dark:bg-orange-800 p-2 flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Western Sydney Weather Alert</h4>
                          <p className="text-sm text-muted-foreground">Heavy rain forecast may delay drone operations</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <div className="rounded-full bg-white dark:bg-amber-800 p-2 flex-shrink-0">
                          <Truck className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">M12 Road Construction</h4>
                          <p className="text-sm text-muted-foreground">Ongoing construction may add 15-20 min to trucking segment</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="rounded-full bg-white dark:bg-blue-800 p-2 flex-shrink-0">
                          <Train className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Rail Schedule Change</h4>
                          <p className="text-sm text-muted-foreground">Potential schedule adjustment for rail segment #3</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Leaf className="mr-2 h-5 w-5 text-green-500" />
                      Environmental Impact
                    </CardTitle>
                    <CardDescription>
                      Carbon footprint and environmental metrics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Total CO₂ Emissions</span>
                          <span className="text-sm font-medium">{selectedRoute.co2Emissions}</span>
                        </div>
                        <Progress value={65} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">35% below industry average</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="border rounded-lg p-3">
                          <div className="text-sm text-muted-foreground mb-1">Emissions by Mode</div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                                <span>Rail</span>
                              </div>
                              <span>15%</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                                <span>Truck</span>
                              </div>
                              <span>58%</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                                <span>Air</span>
                              </div>
                              <span>25%</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                <span>Drone</span>
                              </div>
                              <span>2%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-3">
                          <div className="text-sm text-muted-foreground mb-1">Optimization Potential</div>
                          <div className="mt-2">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400">-18%</div>
                            <div className="text-xs text-muted-foreground">Potential CO₂ reduction</div>
                          </div>
                          <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs">
                            View optimization plan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                <Boxes className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-xl">No Route Selected</h3>
                <p className="text-muted-foreground mt-2">Select a route from the Route Planning tab to view its segments</p>
                <Button 
                  className="mt-6" 
                  onClick={() => setActiveTab("routes")}
                >
                  Go to Route Planning
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className={cn(
                      "text-sm flex items-center",
                      metric.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {metric.trend === "up" ? "↑" : "↓"} {metric.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Multi-modal transport performance analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockBarChart}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-green-500" />
                  Environmental Performance
                </CardTitle>
                <CardDescription>
                  Carbon footprint and emission trends.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockBarChart}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplets className="mr-2 h-5 w-5 text-blue-500" />
                Modal Optimization Recommendations
              </CardTitle>
              <CardDescription>
                AI-suggested optimizations to improve efficiency and reduce emissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationRecommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-100 text-green-800 whitespace-nowrap">
                          {rec.potentialSavings}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 whitespace-nowrap">
                          {rec.co2Reduction}
                        </Badge>
                        <Badge className={cn(
                          "whitespace-nowrap",
                          rec.difficulty === "easy" ? "bg-green-100 text-green-800" :
                          rec.difficulty === "medium" ? "bg-amber-100 text-amber-800" :
                          "bg-orange-100 text-orange-800"
                        )}>
                          {rec.difficulty} implementation
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="mr-2 h-5 w-5 text-green-500" />
                Carbon Emission Reduction Plan
              </CardTitle>
              <CardDescription>
                Strategic plan to reduce carbon emissions from multi-modal logistics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Emission Reduction Timeline</h3>
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-50 text-green-600">
                          Current: 18.5% Reduction
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-50 text-blue-600">
                          Target: 45% by 2026
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div style={{ width: "41%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Short-term Actions (2025)</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Shift 20% of road freight to rail in Western Sydney corridors</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Deploy electric vehicles for last-mile delivery in Sydney metro area</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Optimize load factors to reduce empty miles by 15%</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Mid-term Plan (2026)</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="rounded-full bg-blue-100 p-1 mr-2 mt-0.5">
                          <ArrowUpDown className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Implement drone delivery network for Western Sydney suburbs</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-blue-100 p-1 mr-2 mt-0.5">
                          <ArrowUpDown className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Transition 50% of truck fleet to hydrogen or electric power</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-blue-100 p-1 mr-2 mt-0.5">
                          <ArrowUpDown className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Develop multi-modal hubs at strategic locations in Greater Sydney</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Long-term Vision (2027+)</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="rounded-full bg-purple-100 p-1 mr-2 mt-0.5">
                          <Leaf className="h-3 w-3 text-purple-600" />
                        </div>
                        <span>Achieve carbon-neutral status for 80% of deliveries</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-purple-100 p-1 mr-2 mt-0.5">
                          <Leaf className="h-3 w-3 text-purple-600" />
                        </div>
                        <span>Deploy fully autonomous delivery vehicles in designated zones</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-purple-100 p-1 mr-2 mt-0.5">
                          <Leaf className="h-3 w-3 text-purple-600" />
                        </div>
                        <span>Implement blockchain-based carbon tracking for entire supply chain</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}