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
  AlertTriangle,
  Calendar,
  CloudLightning,
  Droplets,
  FileWarning,
  Warehouse,
  BarChart3,
  Lightbulb,
  Shield,
  Truck,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface ResilienceForecast {
  id: number;
  name: string;
  forecastType: "demand" | "disaster" | "delay";
  probability: number;
  impact: "low" | "medium" | "high" | "critical";
  timeWindow: string;
  affectedRegions: string[];
  suggestedActions: string[];
  alternateRoutes: number[];
  inventoryRecommendations: InventoryRecommendation[];
  accuracy: number;
}

interface InventoryRecommendation {
  id: number;
  product: string;
  currentLevel: number;
  recommendedLevel: number;
  priority: "low" | "medium" | "high";
  location: string;
  rationale: string;
}

export default function SupplyChainResilience() {
  const [activeTab, setActiveTab] = useState("forecasts");

  // Fetch resilience forecasts
  const { data: forecasts, isLoading: isLoadingForecasts } = useQuery<ResilienceForecast[]>({
    queryKey: ["/api/resilience/forecasts"]
  });

  // Fetch inventory recommendations
  const { data: inventoryRecommendations, isLoading: isLoadingRecommendations } = useQuery<InventoryRecommendation[]>({
    queryKey: ["/api/resilience/inventory-recommendations"]
  });

  // Impact color mapping
  const impactColorMap: Record<string, string> = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  // Forecast type icon mapping
  const forecastTypeIcon: Record<string, React.ReactNode> = {
    demand: <Warehouse className="h-5 w-5" />,
    disaster: <CloudLightning className="h-5 w-5" />,
    delay: <Clock className="h-5 w-5" />
  };

  // Priority color mapping
  const priorityColorMap: Record<string, string> = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  // Mock visualization components (to be replaced with actual charts)
  const mockRiskHeatmap = (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Risk Heatmap Visualization</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Showing probability and impact of supply chain disruptions</p>
      </div>
    </div>
  );

  const mockTimelineGraph = (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <Calendar className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Timeline Visualization</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Showing forecast events over time</p>
      </div>
    </div>
  );

  const mockInventoryGraph = (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Inventory Optimization Chart</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Comparing current vs. recommended inventory levels</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Predictive Supply Chain Resilience</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered disruption forecasting and proactive risk mitigation strategies.
        </p>
      </div>

      <Tabs defaultValue="forecasts" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecasts">Disruption Forecasts</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Recommendations</TabsTrigger>
          <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forecasts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileWarning className="mr-2 h-5 w-5" />
                  Disruption Forecasts
                </CardTitle>
                <CardDescription>
                  AI-predicted disruption events with impact assessment and mitigation strategies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingForecasts ? (
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
                          <TableHead>Forecast</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Probability</TableHead>
                          <TableHead>Impact</TableHead>
                          <TableHead>Time Window</TableHead>
                          <TableHead>Accuracy</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {forecasts && forecasts.map((forecast: ResilienceForecast) => (
                          <TableRow key={forecast.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">{forecast.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {forecastTypeIcon[forecast.forecastType]}
                                <span className="capitalize">{forecast.forecastType}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={forecast.probability} className="w-16 h-2" />
                                <span>{forecast.probability}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={impactColorMap[forecast.impact]}>
                                {forecast.impact}
                              </Badge>
                            </TableCell>
                            <TableCell>{forecast.timeWindow}</TableCell>
                            <TableCell>{forecast.accuracy}%</TableCell>
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
                  <Shield className="mr-2 h-5 w-5" />
                  Resilience Metrics
                </CardTitle>
                <CardDescription>
                  Key metrics for supply chain resilience assessment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Overall Resilience Score</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Disruption Preparedness</span>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Recovery Capability</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Risk Visibility</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Supply Network Diversity</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Risk Assessment Timeline
              </CardTitle>
              <CardDescription>
                Timeline visualization of predicted disruption events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockTimelineGraph}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Warehouse className="mr-2 h-5 w-5" />
                  Inventory Recommendations
                </CardTitle>
                <CardDescription>
                  AI-recommended inventory adjustments to mitigate predicted risks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecommendations ? (
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
                          <TableHead>Product</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Current Level</TableHead>
                          <TableHead>Recommended</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inventoryRecommendations && inventoryRecommendations.map((item: InventoryRecommendation) => (
                          <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">{item.product}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{item.currentLevel}</TableCell>
                            <TableCell className={item.recommendedLevel > item.currentLevel ? "text-green-600" : "text-red-600"}>
                              {item.recommendedLevel}
                            </TableCell>
                            <TableCell>
                              <Badge className={priorityColorMap[item.priority]}>
                                {item.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">View Details</Button>
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
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Recommendation Insights
                </CardTitle>
                <CardDescription>
                  Key insights behind inventory recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecommendations ? (
                  <div className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <h4 className="font-medium">Supply Shortage Risk</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Potential raw material shortages from Western Sydney suppliers due to predicted weather events.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">Logistics Disruption</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Transport disruptions on M12 Corridor may affect delivery times for 5 key products.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">Weather Impact</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Forecasted heavy rainfall in Western Sydney may impact warehousing operations in Penrith area.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Inventory Optimization Analysis
              </CardTitle>
              <CardDescription>
                Comparison of current vs. recommended inventory levels by category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockInventoryGraph}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Risk Heatmap
                </CardTitle>
                <CardDescription>
                  Visualization of supply chain risks by probability and impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockRiskHeatmap}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Risk Mitigation Status
                </CardTitle>
                <CardDescription>
                  Status of actions taken to mitigate identified risks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <h4 className="font-medium">Alternative Supplier Onboarding</h4>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      3 new suppliers onboarded for critical components to reduce single-source dependency.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <h4 className="font-medium">Buffer Stock Increase</h4>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Increasing safety stock levels for high-risk components by 25%.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <h4 className="font-medium">Transport Route Diversification</h4>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Not Started</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Identifying alternative transport routes for deliveries from Western Sydney Airport.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <h4 className="font-medium">Supplier Risk Assessment</h4>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive risk assessment completed for all tier-1 suppliers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Resilience Improvement Recommendations
              </CardTitle>
              <CardDescription>
                AI-generated recommendations to improve supply chain resilience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium text-center mb-2">Short-Term Actions</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Increase buffer stock for critical components</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Deploy real-time monitoring at high-risk supplier locations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Implement priority-based inventory allocation</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium text-center mb-2">Medium-Term Actions</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Develop alternative logistics routes through Western Sydney</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Implement supplier diversification for high-risk materials</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Deploy regional inventory staging strategy</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium text-center mb-2">Long-Term Strategy</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Implement blockchain-based supply chain transparency</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Develop distributed manufacturing capabilities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Implement AI-driven inventory optimization across network</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}