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
  Leaf,
  TrendingDown,
  BarChart3,
  Truck,
  Factory,
  AreaChart,
  Lightbulb,
  CheckCircle2,
  Timer,
  PiggyBank,
  Trees,
  Wind,
} from "lucide-react";

interface SustainabilityMetrics {
  id: number;
  totalCarbonEmissions: number;
  emissionReduction: string;
  energyEfficiency: number;
  emptyMilesPercentage: number;
  carbonOffsets: number;
  sustainabilityScore: number;
  recommendations: SustainabilityRecommendation[];
}

interface SustainabilityRecommendation {
  id: number;
  title: string;
  description: string;
  potentialImpact: string;
  difficulty: "easy" | "medium" | "complex";
  timeToImplement: string;
  costSavings: string;
}

export default function Sustainability() {
  const [activeTab, setActiveTab] = useState("metrics");

  // Fetch sustainability metrics
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery<SustainabilityMetrics>({
    queryKey: ["/api/sustainability/metrics"]
  });

  // Fetch sustainability recommendations
  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery<SustainabilityRecommendation[]>({
    queryKey: ["/api/sustainability/recommendations"]
  });

  // Difficulty color mapping
  const difficultyColorMap: Record<string, string> = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    complex: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
  };

  // Mock visualization components (to be replaced with actual charts)
  const mockEmissionsChart = (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <AreaChart className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Carbon Emissions Trend</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Historical and projected emissions data</p>
      </div>
    </div>
  );

  const mockEfficiencyChart = (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Efficiency Metrics Visualization</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Comparing energy efficiency across operations</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sustainable AI-Driven Operations</h1>
        <p className="text-muted-foreground mt-2">
          Optimize operations for environmental sustainability and cost efficiency.
        </p>
      </div>

      <Tabs defaultValue="metrics" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Sustainability Metrics</TabsTrigger>
          <TabsTrigger value="optimizations">Optimization Opportunities</TabsTrigger>
          <TabsTrigger value="reporting">Sustainability Reporting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="space-y-4">
          {isLoadingMetrics ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Sustainability Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="relative w-28 h-28">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            className="text-muted stroke-current" 
                            strokeWidth="10" 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="transparent"
                          ></circle>
                          <circle 
                            className="text-green-500 stroke-current" 
                            strokeWidth="10" 
                            strokeLinecap="round" 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="transparent"
                            strokeDasharray={metrics ? 251.2 : 0}
                            strokeDashoffset={metrics ? 251.2 - (251.2 * metrics.sustainabilityScore) / 100 : 251.2}
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                          {metrics?.sustainabilityScore}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Overall sustainability performance</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Carbon Emissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold">{metrics?.totalCarbonEmissions.toLocaleString()} kg</span>
                        <span className="text-green-600 text-sm flex items-center">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          {metrics?.emissionReduction}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Total CO₂ equivalent emissions (quarterly)</p>
                      <Progress value={65} className="h-2" />
                      <p className="text-xs text-muted-foreground">65% to reduction target</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Key Efficiency Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Energy Efficiency</span>
                          <span className="text-xs font-medium">{metrics?.energyEfficiency}%</span>
                        </div>
                        <Progress value={metrics?.energyEfficiency || 0} className="h-1" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Empty Miles</span>
                          <span className="text-xs font-medium">{metrics?.emptyMilesPercentage}%</span>
                        </div>
                        <Progress value={metrics?.emptyMilesPercentage || 0} className="h-1" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Carbon Offsets</span>
                          <span className="text-xs font-medium">{metrics?.carbonOffsets.toLocaleString()} kg</span>
                        </div>
                        <Progress value={metrics ? (metrics.carbonOffsets / metrics.totalCarbonEmissions) * 100 : 0} className="h-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Leaf className="mr-2 h-5 w-5 text-green-500" />
                      Carbon Emissions Trend
                    </CardTitle>
                    <CardDescription>
                      Historical and projected carbon emissions data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mockEmissionsChart}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Factory className="mr-2 h-5 w-5" />
                      Operational Efficiency Metrics
                    </CardTitle>
                    <CardDescription>
                      Efficiency metrics across various operational areas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mockEfficiencyChart}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                  Sustainability Recommendations
                </CardTitle>
                <CardDescription>
                  AI-generated recommendations to improve sustainability metrics.
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
                          <TableHead>Recommendation</TableHead>
                          <TableHead>Potential Impact</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Time to Implement</TableHead>
                          <TableHead>Cost Savings</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recommendations && recommendations.map((recommendation: SustainabilityRecommendation) => (
                          <TableRow key={recommendation.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">{recommendation.title}</TableCell>
                            <TableCell>{recommendation.potentialImpact}</TableCell>
                            <TableCell>
                              <Badge className={difficultyColorMap[recommendation.difficulty]}>
                                {recommendation.difficulty}
                              </Badge>
                            </TableCell>
                            <TableCell>{recommendation.timeToImplement}</TableCell>
                            <TableCell className="text-green-600">{recommendation.costSavings}</TableCell>
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
                  <Truck className="mr-2 h-5 w-5" />
                  Route Optimization Impact
                </CardTitle>
                <CardDescription>
                  Environmental impact of route optimization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-green-500" />
                      <h4 className="font-medium">Empty Miles Reduction</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      18.5% reduction in empty miles through AI-optimized routing in Western Sydney area.
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">Progress to Target</span>
                        <span className="text-xs font-medium">68%</span>
                      </div>
                      <Progress value={68} className="h-1" />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-blue-500" />
                      <h4 className="font-medium">Idle Time Optimization</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      22.3% reduction in vehicle idle time through predictive arrival scheduling.
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">Progress to Target</span>
                        <span className="text-xs font-medium">89%</span>
                      </div>
                      <Progress value={89} className="h-1" />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <PiggyBank className="h-4 w-4 text-purple-500" />
                      <h4 className="font-medium">Fuel Cost Savings</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      $125,000 quarterly savings from AI-optimized routing and reduced idle time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  Implementation Status
                </CardTitle>
                <CardDescription>
                  Status of sustainability initiatives.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <span className="text-sm font-medium">8</span>
                  </div>
                  <Progress value={40} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <span className="text-sm font-medium">6</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      <span className="text-sm">Planned</span>
                    </div>
                    <span className="text-sm font-medium">6</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trees className="mr-2 h-5 w-5 text-green-500" />
                  Environmental Impact
                </CardTitle>
                <CardDescription>
                  Quantified environmental benefits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="rounded-full bg-white dark:bg-slate-700 p-2">
                      <Leaf className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">125.7 tonnes</div>
                      <div className="text-xs text-muted-foreground">CO₂ emissions prevented quarterly</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="rounded-full bg-white dark:bg-slate-700 p-2">
                      <Wind className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">1,850 MWh</div>
                      <div className="text-xs text-muted-foreground">Renewable energy utilized</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="rounded-full bg-white dark:bg-slate-700 p-2">
                      <Trees className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">2,500+</div>
                      <div className="text-xs text-muted-foreground">Equivalent trees planted</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Sustainability Reports
              </CardTitle>
              <CardDescription>
                Generated sustainability reports for regulatory compliance and stakeholder communication.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Reporting Period</TableHead>
                      <TableHead>Framework</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Quarterly Emissions Report</TableCell>
                      <TableCell>Q1 2025</TableCell>
                      <TableCell>GHG Protocol</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </TableCell>
                      <TableCell>15 Mar 2025</TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Download</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Energy Efficiency Analysis</TableCell>
                      <TableCell>2025 YTD</TableCell>
                      <TableCell>ISO 50001</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </TableCell>
                      <TableCell>10 Mar 2025</TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Download</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Carbon Disclosure Project Report</TableCell>
                      <TableCell>2024</TableCell>
                      <TableCell>CDP</TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                      </TableCell>
                      <TableCell>05 Mar 2025</TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm">View Draft</Button>
                        <Button variant="outline" size="sm" disabled>Download</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Sustainability Performance Report</TableCell>
                      <TableCell>2024</TableCell>
                      <TableCell>GRI Standards</TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                      </TableCell>
                      <TableCell>28 Feb 2025</TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm">View Draft</Button>
                        <Button variant="outline" size="sm" disabled>Download</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Supply Chain Emissions Report</TableCell>
                      <TableCell>Q1 2025</TableCell>
                      <TableCell>Scope 3 GHG</TableCell>
                      <TableCell>
                        <Badge className="bg-slate-100 text-slate-800">Scheduled</Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm" disabled>View</Button>
                        <Button variant="outline" size="sm" disabled>Download</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  Compliance Status
                </CardTitle>
                <CardDescription>
                  Regulatory and voluntary sustainability compliance status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Australian Climate Active Certification</h4>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Next Review:</span>
                      <span>June 2025</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">National Greenhouse and Energy Reporting</h4>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Next Report Due:</span>
                      <span>October 2025</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">ISO 14001 Environmental Management</h4>
                      <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Certification Target:</span>
                      <span>August 2025</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Science-Based Targets Initiative</h4>
                      <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Commitment Stage:</span>
                      <span>Target Validation</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                  Reporting Insights
                </CardTitle>
                <CardDescription>
                  AI-generated insights from sustainability data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">Emission Hotspots Identified</h4>
                    <p className="text-sm text-muted-foreground">
                      Analysis reveals 35% of emissions are from Western Sydney distribution center operations. Recommend renewable energy transition by Q3 2025.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">Year-over-Year Improvement</h4>
                    <p className="text-sm text-muted-foreground">
                      18.3% reduction in carbon intensity (emissions per $M revenue) from previous year, exceeding 15% target.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">Competitive Benchmarking</h4>
                    <p className="text-sm text-muted-foreground">
                      Sustainability performance in top quartile compared to Australian logistics sector, but lags behind global leaders by 12%.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">Reporting Recommendation</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider adopting TCFD framework for climate risk financial disclosures to meet increasing investor demands.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}