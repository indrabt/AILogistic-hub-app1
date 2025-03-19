import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DriverSidebarLayout from "@/components/layouts/DriverSidebarLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Route as RouteType, WeatherAlert } from "@shared/types";
import { MapPin, Clock, Calendar, TruckIcon, Navigation, AlertTriangle, CheckCircle, Volume2, VolumeX, Mic, MicOff } from "lucide-react";

export default function DriverNavigation() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RouteType | null>(null);
  const [eta, setEta] = useState("18:45");
  const [progress, setProgress] = useState(42);
  const [navigationMode, setNavigationMode] = useState<"map" | "ar" | "list">("map");
  const [closestLandmark, setClosestLandmark] = useState("Sydney Olympic Park");
  const [distanceToNextTurn, setDistanceToNextTurn] = useState("1.2 km");
  const [nextInstruction, setNextInstruction] = useState("Turn right onto Parramatta Road");
  const [trafficStatus, setTrafficStatus] = useState<"light" | "moderate" | "heavy">("moderate");
  const [fuelConsumption, setFuelConsumption] = useState("6.8 L/100km");
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  
  // Map canvas ref
  const mapCanvasRef = useRef<HTMLDivElement>(null);

  // Fetch current route data
  const { data: routesData = [], isLoading: loadingRoutes } = useQuery<RouteType[]>({
    queryKey: ["/api/routes"],
  });

  // Fetch weather alerts
  const { data: alertsData = [], isLoading: loadingAlerts } = useQuery<WeatherAlert[]>({
    queryKey: ["/api/weather/alerts"],
  });

  // Set active route from the first available route
  useEffect(() => {
    if (routesData.length > 0 && !activeRoute) {
      setActiveRoute(routesData[0]);
    }
    
    // Filter severe weather alerts
    if (alertsData.length > 0) {
      const filtered = alertsData.filter(alert => alert.severity === "severe" && alert.affectedShipments && alert.affectedShipments > 0);
      setWeatherAlerts(filtered.slice(0, 3));
    }
  }, [routesData, alertsData, activeRoute]);

  // Simulate route progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newValue = prev + Math.random() * 2;
        return newValue > 100 ? 100 : newValue;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Draw a simple map visualization 
  useEffect(() => {
    if (mapCanvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = mapCanvasRef.current.clientWidth;
      canvas.height = 320;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw route line
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 5;
        
        // Create a simple route path
        ctx.moveTo(50, 160);
        ctx.lineTo(150, 160);
        ctx.lineTo(150, 80);
        ctx.lineTo(300, 80);
        ctx.lineTo(300, 200);
        ctx.lineTo(400, 200);
        
        ctx.stroke();
        
        // Draw current position
        const progressPosition = Math.min(progress / 100, 1);
        let posX = 50, posY = 160;
        
        if (progressPosition <= 0.2) {
          posX = 50 + progressPosition * 5 * 100;
        } else if (progressPosition <= 0.4) {
          posX = 150;
          posY = 160 - (progressPosition - 0.2) * 5 * 80;
        } else if (progressPosition <= 0.6) {
          posX = 150 + (progressPosition - 0.4) * 5 * 150;
          posY = 80;
        } else if (progressPosition <= 0.8) {
          posX = 300;
          posY = 80 + (progressPosition - 0.6) * 5 * 120;
        } else {
          posX = 300 + (progressPosition - 0.8) * 5 * 100;
          posY = 200;
        }
        
        // Draw truck icon at current position
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(posX, posY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw key locations
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.arc(50, 160, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(400, 200, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Add location labels
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px sans-serif';
        ctx.fillText('Warehouse', 35, 180);
        ctx.fillText('Customer Site', 380, 220);
        
        // Add the canvas to the map container
        mapCanvasRef.current.innerHTML = '';
        mapCanvasRef.current.appendChild(canvas);
      }
    }
  }, [progress, mapCanvasRef.current]);

  // Toggle functions
  const toggleAudio = () => setAudioEnabled(!audioEnabled);
  const toggleVoiceCommands = () => setVoiceCommandsEnabled(!voiceCommandsEnabled);
  
  // Get traffic status color
  const getTrafficColor = (status: string) => {
    switch (status) {
      case "light": return "text-green-500";
      case "moderate": return "text-amber-500";
      case "heavy": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <DriverSidebarLayout>
      <div className="container mx-auto p-4 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Navigation</h1>
            <p className="text-muted-foreground">Real-time route guidance</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleAudio}
              title={audioEnabled ? "Mute voice guidance" : "Enable voice guidance"}
            >
              {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleVoiceCommands}
              title={voiceCommandsEnabled ? "Disable voice commands" : "Enable voice commands"}
            >
              {voiceCommandsEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button variant="outline" size="sm">End Navigation</Button>
          </div>
        </header>

        {activeRoute && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1 md:col-span-2 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-xl font-bold">
                    {activeRoute.name}
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">ETA: {eta}</Badge>
                    <Badge className={
                      progress < 30 
                        ? "bg-red-100 text-red-800" 
                        : progress < 70 
                          ? "bg-amber-100 text-amber-800" 
                          : "bg-green-100 text-green-800"
                    }>
                      {progress.toFixed(0)}% completed
                    </Badge>
                  </div>
                </div>
                
                <Progress value={progress} className="h-2" />
                
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>{activeRoute.origin}</span>
                  <span>{activeRoute.destination}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pb-0">
                <Tabs defaultValue="map" onValueChange={(v: any) => setNavigationMode(v)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="map">Map</TabsTrigger>
                    <TabsTrigger value="ar">AR View</TabsTrigger>
                    <TabsTrigger value="list">Directions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="map">
                    <div ref={mapCanvasRef} className="min-h-[320px] bg-gray-50 dark:bg-gray-800 rounded-md"></div>
                  </TabsContent>
                  
                  <TabsContent value="ar">
                    <div className="min-h-[320px] bg-gray-50 dark:bg-gray-800 rounded-md flex flex-col items-center justify-center p-4">
                      <Navigation className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-center text-muted-foreground">
                        AR navigation view would appear here on a mobile device.
                        <br />
                        Mount your phone to continue in AR mode.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="list">
                    <div className="min-h-[320px] bg-white dark:bg-gray-950 rounded-md p-4 space-y-4 overflow-y-auto">
                      <div className="flex items-center gap-2 p-2 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">1</div>
                        <div>
                          <p className="font-medium">Start from {activeRoute.origin}</p>
                          <p className="text-sm text-muted-foreground">Head east for 800m</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">2</div>
                        <div>
                          <p className="font-medium">Turn left onto Olympic Boulevard</p>
                          <p className="text-sm text-muted-foreground">Continue for 1.4km</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                        <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white">3</div>
                        <div>
                          <p className="font-medium">Turn right onto Parramatta Road</p>
                          <p className="text-sm text-muted-foreground">Continue for 3.2km through traffic</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 border-l-4 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white">4</div>
                        <div>
                          <p className="font-medium">Turn left onto Harris Street</p>
                          <p className="text-sm text-muted-foreground">Continue for 750m</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 border-l-4 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white">5</div>
                        <div>
                          <p className="font-medium">Arrive at {activeRoute.destination}</p>
                          <p className="text-sm text-muted-foreground">Your destination will be on the right</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardContent className="pt-4">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">Next Direction</h3>
                      <p className="text-xl font-bold">{nextInstruction}</p>
                      <p className="text-sm text-muted-foreground">In {distanceToNextTurn}</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-muted-foreground">Current area</span>
                      <span className="font-medium">{closestLandmark}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Route Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-medium">{activeRoute.distance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated arrival</p>
                      <p className="font-medium">{activeRoute.eta}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Traffic conditions</p>
                    <p className={`font-medium ${getTrafficColor(trafficStatus)}`}>
                      {trafficStatus.charAt(0).toUpperCase() + trafficStatus.slice(1)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fuel consumption</p>
                    <p className="font-medium">{fuelConsumption}</p>
                  </div>
                </CardContent>
              </Card>
              
              {weatherAlerts.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Weather Alerts
                    </CardTitle>
                    <CardDescription>Potential impacts on your route</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {weatherAlerts.map((alert) => (
                      <Alert key={alert.id} variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="font-medium">{alert.title}</AlertTitle>
                        <AlertDescription className="text-sm mt-1">
                          {alert.description}
                        </AlertDescription>
                        <div className="flex justify-between mt-2 text-xs">
                          <span>{alert.region}</span>
                          <span>{alert.time}</span>
                        </div>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DriverSidebarLayout>
  );
}