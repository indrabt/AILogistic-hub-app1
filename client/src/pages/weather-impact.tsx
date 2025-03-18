import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Cloud, DownloadIcon, Calendar, Eye, Route as RouteIcon, CheckCircle, Droplet, Wind, Snowflake, Sun, AlertOctagon } from "lucide-react";
import { WeatherEvent, WeatherImpactMetrics, AlternativeRoute } from "@shared/types";
import { Badge } from "@/components/ui/badge";

export default function WeatherImpact() {
  const [region, setRegion] = useState("all");
  const [severity, setSeverity] = useState("all");

  const { data: weatherEvents = [], isLoading: loadingEvents } = useQuery<WeatherEvent[]>({
    queryKey: ["/api/weather/events"],
  });

  const { data: metrics, isLoading: loadingMetrics } = useQuery<WeatherImpactMetrics>({
    queryKey: ["/api/weather/metrics"],
  });

  const { data: alternativeRoutes = [], isLoading: loadingRoutes } = useQuery<AlternativeRoute[]>({
    queryKey: ["/api/weather/alternative-routes"],
  });

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case "snow":
        return <Snowflake className="h-5 w-5" />;
      case "rain":
        return <Droplet className="h-5 w-5" />;
      case "fog":
        return <Cloud className="h-5 w-5" />;
      case "storm":
        return <AlertOctagon className="h-5 w-5" />;
      case "extreme-heat":
        return <Sun className="h-5 w-5" />;
      case "flood":
        return <Droplet className="h-5 w-5" />;
      default:
        return <Cloud className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-800";
      case "moderate":
        return "bg-orange-100 text-orange-800";
      case "minor":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Weather Impact</h2>
        <p className="text-gray-600">Monitor and manage weather impacts on your supply chain</p>
      </div>

      {/* Filters and Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1">
            <Calendar className="text-gray-500 mr-2 h-4 w-4" />
            <Select defaultValue="7">
              <SelectTrigger className="text-sm text-gray-600 bg-transparent border-none shadow-none h-auto py-1 w-40">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Today</SelectItem>
                <SelectItem value="7">Next 7 days</SelectItem>
                <SelectItem value="30">Next 30 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="text-sm text-gray-600 bg-transparent border-none shadow-none h-auto py-1 w-40">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="northeast">Northeast</SelectItem>
                <SelectItem value="southeast">Southeast</SelectItem>
                <SelectItem value="midwest">Midwest</SelectItem>
                <SelectItem value="west">West Coast</SelectItem>
                <SelectItem value="southwest">Southwest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1">
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="text-sm text-gray-600 bg-transparent border-none shadow-none h-auto py-1 w-40">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button variant="secondary" className="bg-green-700 hover:bg-green-800 text-white">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Weather Impact Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Weather Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{metrics?.activeAlerts || 0}</div>
              <AlertTriangle className="text-orange-500 h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Affected Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.affectedShipments || 0}</div>
            <p className="text-sm text-gray-500">Out of 247 active shipments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Delay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.averageDelay || "0 hours"}</div>
            <p className="text-sm text-gray-500">Due to weather conditions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold capitalize mr-2">{metrics?.riskLevel || "low"}</div>
              <div className={`w-3 h-3 rounded-full ${metrics?.riskLevel === "high" ? "bg-red-500" : metrics?.riskLevel === "medium" ? "bg-orange-500" : "bg-green-500"}`}></div>
            </div>
            <Progress value={metrics?.riskLevel === "high" ? 90 : metrics?.riskLevel === "medium" ? 60 : 30} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Weather Map & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Weather Impact Map</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 bg-gray-100 rounded relative">
              {/* This would be a real map implementation in production */}
              <svg className="w-full h-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 800 400">
                <rect width="100%" height="100%" fill="#edf2f7" />
                
                {/* US Map outline */}
                <path d="M100,100 C200,80 300,90 400,110 C500,130 600,120 700,140" stroke="#d1d5db" strokeWidth="20" fill="none" />
                
                {/* Weather events */}
                <circle cx="200" cy="100" r="20" fill="rgba(239, 68, 68, 0.6)" />
                <text x="200" y="100" textAnchor="middle" fill="white" fontSize="10">NE</text>
                
                <circle cx="500" cy="120" r="15" fill="rgba(251, 146, 60, 0.6)" />
                <text x="500" y="120" textAnchor="middle" fill="white" fontSize="10">W</text>
                
                <circle cx="350" cy="140" r="12" fill="rgba(234, 179, 8, 0.6)" />
                <text x="350" y="140" textAnchor="middle" fill="white" fontSize="10">SE</text>
                
                {/* Routes */}
                <path d="M200,100 L350,140" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M500,120 L350,140" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
              
              {/* Map Legend */}
              <div className="absolute bottom-3 right-3 bg-white p-2 rounded shadow-md text-xs">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Severe</span>
                </div>
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Minor</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Weather Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="alerts" className="w-full">
              <div className="border-b border-gray-200 px-4 py-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
                  <TabsTrigger value="forecast">Forecast</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="alerts" className="m-0">
                {loadingEvents ? (
                  <div className="flex items-center justify-center p-8">
                    <svg className="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading weather alerts...</span>
                  </div>
                ) : weatherEvents.length === 0 ? (
                  <div className="text-center p-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">No active weather alerts</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {weatherEvents
                      .filter(event => region === "all" || event.region.toLowerCase() === region.toLowerCase())
                      .filter(event => severity === "all" || event.severity === severity)
                      .map(event => (
                      <li key={event.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${event.severity === "severe" ? "bg-red-100 text-red-600" : event.severity === "moderate" ? "bg-orange-100 text-orange-600" : "bg-yellow-100 text-yellow-600"}`}>
                              {getWeatherIcon(event.type)}
                            </span>
                            <div>
                              <p className="font-medium">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>
                              <p className="text-sm text-gray-500">{event.region} Region</p>
                            </div>
                          </div>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <p>Time: <span className="font-medium">{formatDate(event.startTime)} - {formatDate(event.endTime)}</span></p>
                          <span className="mx-2">•</span>
                          <p>Affected Routes: <span className="font-medium">{event.affectedRoutes}</span></p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
              
              <TabsContent value="forecast" className="m-0">
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <Snowflake className="h-6 w-6 text-blue-500 mr-2" />
                    <div>
                      <p className="font-medium">Winter Storm Warning</p>
                      <p className="text-sm text-gray-500">Northeast Region (Tomorrow)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <Cloud className="h-6 w-6 text-gray-500 mr-2" />
                    <div>
                      <p className="font-medium">Fog Advisory</p>
                      <p className="text-sm text-gray-500">West Coast (Next 48 hours)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Wind className="h-6 w-6 text-teal-500 mr-2" />
                    <div>
                      <p className="font-medium">High Wind Watch</p>
                      <p className="text-sm text-gray-500">Midwest (72+ hours)</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Alternative Routes */}
      <Card className="mb-6">
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Suggested Alternative Routes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingRoutes ? (
            <div className="flex items-center justify-center p-8">
              <svg className="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading alternative routes...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Original Route</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Alternative Route</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Weather Condition</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Time Saved</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Confidence</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alternativeRoutes.map(route => (
                    <tr key={route.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4 text-sm">{route.originalRoute}</td>
                      <td className="p-4 text-sm font-medium text-primary">{route.alternativeRoute}</td>
                      <td className="p-4 text-sm">{route.weatherCondition}</td>
                      <td className="p-4 text-sm text-green-600">{route.timeSaved}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Progress value={route.confidence} className="h-2 w-20 mr-2" />
                          <span className="text-sm">{route.confidence}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="text-xs flex items-center">
                            <Eye className="h-3 w-3 mr-1" /> View
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs flex items-center text-green-600 hover:text-green-700 border-green-600 hover:border-green-700 hover:bg-green-50">
                            <RouteIcon className="h-3 w-3 mr-1" /> Apply
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route Detail */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Affected Routes Detail</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Route Map */}
            <div className="h-60 bg-gray-100 rounded relative flex items-center justify-center">
              {/* This would be a real map implementation in production */}
              <svg viewBox="0 0 400 200" className="h-full w-full">
                <rect width="100%" height="100%" fill="#f3f4f6" />
                <circle cx="80" cy="100" r="8" fill="#1a237e" />
                <circle cx="320" cy="100" r="8" fill="#1a237e" />
                
                <path d="M80,100 C160,60 240,140 320,100" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" fill="none" />
                <path d="M80,100 C160,140 240,60 320,100" stroke="#10b981" strokeWidth="3" fill="none" />
                
                <rect x="120" y="80" width="160" height="40" fill="rgba(239, 68, 68, 0.2)" rx="10" />
                <text x="200" y="105" textAnchor="middle" fill="#ef4444" fontSize="12">Weather Impact Zone</text>
              </svg>
            </div>
            
            {/* Route Details */}
            <div>
              <h3 className="font-medium mb-4">I-95 North to I-84 East</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Weather Condition</p>
                <div className="flex items-center">
                  <Snowflake className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium">Heavy Snow (8-12 inches)</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Estimated Delay</p>
                <div className="flex items-center">
                  <span className="font-medium text-red-600">2.5 - 3 hours</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Affected Shipments</p>
                <div className="flex items-center">
                  <span className="font-medium">12 shipments</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Alternative Route Savings</p>
                <div className="flex items-center">
                  <span className="font-medium text-green-600">Up to 45 minutes</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-6">
                <Button className="bg-primary hover:bg-primary/90">
                  <RouteIcon className="h-4 w-4 mr-2" /> Apply Alternative Route
                </Button>
                <Button variant="outline">
                  View Shipment Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
