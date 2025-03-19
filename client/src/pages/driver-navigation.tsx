import { useState, useRef, useEffect, useCallback } from "react";
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
import { 
  MapPin, Clock, Calendar, TruckIcon, Navigation, AlertTriangle, 
  CheckCircle, Volume2, VolumeX, Mic, MicOff, Search, LocateFixed, 
  Compass, CircleOff
} from "lucide-react";

// Import from @react-google-maps/api but use mock implementation
// When a real API key is available, we can uncomment the actual imports
// import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer, Marker } from "@react-google-maps/api";
// import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

// Types for mocked Google Maps interfaces
interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface DirectionsResult {
  routes: Array<{
    legs: Array<{
      steps: Array<{
        instructions: string;
        distance: { text: string };
        duration: { text: string };
      }>;
      distance: { text: string };
      duration: { text: string };
    }>;
    overview_path: LatLngLiteral[];
  }>;
}

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
  const [directions, setDirections] = useState<DirectionsResult | null>(null);
  const [origin, setOrigin] = useState<LatLngLiteral>({ lat: -33.8688, lng: 151.2093 }); // Sydney
  const [destination, setDestination] = useState<LatLngLiteral>({ lat: -33.9173, lng: 151.2313 }); // Sydney Airport
  const [searchValue, setSearchValue] = useState("");
  const [showTraffic, setShowTraffic] = useState(true);
  const [showSatellite, setShowSatellite] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  
  // Map canvas ref
  const mapCanvasRef = useRef<HTMLDivElement>(null);

  // Mock for isLoaded from useJsApiLoader
  const [isLoaded, setIsLoaded] = useState(true);

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

  // Mock directions request - simulate fetching from Google Directions API
  const getDirections = useCallback(() => {
    // Mock DirectionsResult
    const mockDirections: DirectionsResult = {
      routes: [{
        legs: [{
          steps: [
            {
              instructions: "Head south on George St",
              distance: { text: "0.5 km" },
              duration: { text: "2 mins" }
            },
            {
              instructions: "Turn right onto Parramatta Road",
              distance: { text: "1.2 km" },
              duration: { text: "4 mins" }
            },
            {
              instructions: "Continue onto M1",
              distance: { text: "3.4 km" },
              duration: { text: "7 mins" }
            },
            {
              instructions: "Take exit 23 toward Sydney Airport",
              distance: { text: "0.8 km" },
              duration: { text: "1 min" }
            },
            {
              instructions: "Turn left onto Airport Drive",
              distance: { text: "1.1 km" },
              duration: { text: "3 mins" }
            }
          ],
          distance: { text: "7.0 km" },
          duration: { text: "17 mins" }
        }],
        overview_path: [
          { lat: -33.8688, lng: 151.2093 },
          { lat: -33.8788, lng: 151.2050 },
          { lat: -33.8899, lng: 151.1950 },
          { lat: -33.9000, lng: 151.2100 },
          { lat: -33.9173, lng: 151.2313 }
        ]
      }]
    };
    
    // Simulate API delay
    setTimeout(() => {
      setDirections(mockDirections);
      setNextInstruction(mockDirections.routes[0].legs[0].steps[1].instructions);
      setDistanceToNextTurn(mockDirections.routes[0].legs[0].steps[1].distance.text);
      setEta(`${new Date().getHours() + 1}:${String(new Date().getMinutes()).padStart(2, '0')}`);
    }, 500);
  }, [origin, destination]);
  
  // Get directions on component mount
  useEffect(() => {
    getDirections();
  }, [getDirections]);

  // Draw a Google Maps style visualization
  useEffect(() => {
    if (mapCanvasRef.current && directions) {
      const canvas = document.createElement('canvas');
      canvas.width = mapCanvasRef.current.clientWidth;
      canvas.height = 320;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Background color - simulate map or satellite view
        ctx.fillStyle = showSatellite ? '#2c3e50' : '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // If satellite view, add some texture
        if (showSatellite) {
          for (let i = 0; i < 300; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
            ctx.beginPath();
            ctx.arc(
              Math.random() * canvas.width, 
              Math.random() * canvas.height, 
              Math.random() * 3, 
              0, 
              Math.PI * 2
            );
            ctx.fill();
          }
        }
        
        // Grid lines for map view
        if (!showSatellite) {
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 0.5;
          
          // Horizontal grid lines
          for (let i = 0; i < canvas.height; i += 30) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
          }
          
          // Vertical grid lines
          for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
          }
        }
        
        // Draw route line (blue for normal, red if heavy traffic is showing)
        ctx.beginPath();
        ctx.strokeStyle = showTraffic && trafficStatus === 'heavy' ? '#ef4444' : '#3b82f6';
        ctx.lineWidth = 5;
        
        // Use the overview_path from directions
        const path = directions.routes[0].overview_path;
        
        // Scale the path to fit the canvas
        const minLat = Math.min(...path.map(p => p.lat));
        const maxLat = Math.max(...path.map(p => p.lat));
        const minLng = Math.min(...path.map(p => p.lng));
        const maxLng = Math.max(...path.map(p => p.lng));
        
        const latRange = maxLat - minLat;
        const lngRange = maxLng - minLng;
        
        // Add some padding
        const padding = 50;
        
        // Convert lat/lng to x/y coordinates
        const getX = (lng: number) => {
          return padding + ((lng - minLng) / lngRange) * (canvas.width - padding * 2);
        };
        
        const getY = (lat: number) => {
          // Flip Y axis as canvas 0,0 is top-left
          return padding + ((maxLat - lat) / latRange) * (canvas.height - padding * 2);
        };
        
        // Draw the path
        ctx.moveTo(getX(path[0].lng), getY(path[0].lat));
        
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(getX(path[i].lng), getY(path[i].lat));
        }
        
        ctx.stroke();
        
        // Calculate current position based on progress
        const progressPosition = Math.min(progress / 100, 1);
        const pathIndex = Math.floor(progressPosition * (path.length - 1));
        const nextIndex = Math.min(pathIndex + 1, path.length - 1);
        
        // Interpolate between current and next point
        const interpFactor = (progressPosition * (path.length - 1)) - pathIndex;
        const currentLat = path[pathIndex].lat + (path[nextIndex].lat - path[pathIndex].lat) * interpFactor;
        const currentLng = path[pathIndex].lng + (path[nextIndex].lng - path[pathIndex].lng) * interpFactor;
        
        // Draw current position (blue dot with white border)
        const posX = getX(currentLng);
        const posY = getY(currentLat);
        
        // Outer white circle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(posX, posY, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner blue circle for current location
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(posX, posY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw origin marker (green)
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(getX(path[0].lng), getY(path[0].lat), 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw destination marker (red)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(getX(path[path.length - 1].lng), getY(path[path.length - 1].lat), 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Add location labels
        ctx.fillStyle = showSatellite ? '#ffffff' : '#1f2937';
        ctx.font = '12px sans-serif';
        ctx.fillText('Origin', getX(path[0].lng) - 20, getY(path[0].lat) - 10);
        ctx.fillText('Destination', getX(path[path.length - 1].lng) - 40, getY(path[path.length - 1].lat) - 10);
        
        // Add Google Maps style UI elements
        
        // Zoom controls
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(canvas.width - 40, 100, 30, 60, 5);
        ctx.fill();
        
        ctx.fillStyle = '#1f2937';
        ctx.font = '16px sans-serif';
        ctx.fillText('+', canvas.width - 25, 120);
        
        ctx.beginPath();
        ctx.moveTo(canvas.width - 35, 130);
        ctx.lineTo(canvas.width - 15, 130);
        ctx.stroke();
        
        ctx.fillText('-', canvas.width - 25, 150);
        
        // Compass
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(canvas.width - 25, 50, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#1f2937';
        ctx.beginPath();
        ctx.moveTo(canvas.width - 25, 40);
        ctx.lineTo(canvas.width - 25, 60);
        ctx.moveTo(canvas.width - 35, 50);
        ctx.lineTo(canvas.width - 15, 50);
        ctx.stroke();
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(canvas.width - 25, 40);
        ctx.lineTo(canvas.width - 21, 46);
        ctx.lineTo(canvas.width - 29, 46);
        ctx.fill();
        
        // Add the canvas to the map container
        mapCanvasRef.current.innerHTML = '';
        mapCanvasRef.current.appendChild(canvas);
      }
    }
  }, [progress, showTraffic, showSatellite, trafficStatus, directions, mapCanvasRef.current]);

  // Toggle functions
  const toggleAudio = () => setAudioEnabled(!audioEnabled);
  const toggleVoiceCommands = () => setVoiceCommandsEnabled(!voiceCommandsEnabled);
  const toggleTraffic = () => setShowTraffic(!showTraffic);
  const toggleSatellite = () => setShowSatellite(!showSatellite);
  
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
            <p className="text-muted-foreground">Real-time route guidance with Google Maps integration</p>
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

        {/* Google Maps-like search interface */}
        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-9 pr-24" 
                placeholder="Search destination or enter address"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <div className="absolute right-3 top-2">
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Mic className="h-4 w-4 mr-1" />
                  <span className="text-xs">Voice</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  
                  <TabsContent value="map" className="relative">
                    <div ref={mapCanvasRef} className="min-h-[320px] bg-gray-50 dark:bg-gray-800 rounded-md"></div>
                    
                    {/* Google Maps-like overlay controls */}
                    <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white h-9 w-9 rounded-full shadow-md"
                        onClick={toggleTraffic}
                        title={showTraffic ? "Hide traffic" : "Show traffic"}
                      >
                        {showTraffic ? 
                          <div className="h-4 w-4 bg-red-500 rounded-sm opacity-70"></div> : 
                          <div className="h-4 w-4 bg-gray-300 rounded-sm"></div>
                        }
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white h-9 w-9 rounded-full shadow-md"
                        onClick={toggleSatellite}
                        title={showSatellite ? "Show map" : "Show satellite"}
                      >
                        {showSatellite ? 
                          <span className="text-xs font-bold">Map</span> : 
                          <span className="text-xs font-bold">Sat</span>
                        }
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white h-9 w-9 rounded-full shadow-md"
                        title="Recenter map"
                      >
                        <LocateFixed className="h-4 w-4" />
                      </Button>
                    </div>
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
                  
                  <Separator />
                  
                  {/* Map controls */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Map options</p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={showTraffic ? "default" : "outline"} 
                        size="sm"
                        onClick={toggleTraffic}
                        className="text-xs h-8"
                      >
                        {showTraffic ? "Traffic: On" : "Traffic: Off"}
                      </Button>
                      
                      <Button 
                        variant={showSatellite ? "default" : "outline"} 
                        size="sm"
                        onClick={toggleSatellite}
                        className="text-xs h-8"
                      >
                        {showSatellite ? "Satellite View" : "Map View"}
                      </Button>
                    </div>
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