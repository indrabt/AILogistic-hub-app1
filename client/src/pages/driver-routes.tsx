import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DriverSidebarLayout from "@/components/layouts/DriverSidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Route as RouteType } from "@shared/types";
import { MapPin, Clock, Calendar, TruckIcon, AlertTriangle, CheckCircle } from "lucide-react";

export default function DriverRoutes() {
  const [routeFilter, setRouteFilter] = useState("");
  const [activeTab, setActiveTab] = useState("today");

  const { data: routesData = [], isLoading } = useQuery<RouteType[]>({
    queryKey: ["/api/routes"],
  });

  // Filter routes by date and search term
  const filterRoutes = (routes: RouteType[]) => {
    const filtered = routes.filter(route => {
      const matchesSearch = route.name.toLowerCase().includes(routeFilter.toLowerCase()) || 
                          route.origin.toLowerCase().includes(routeFilter.toLowerCase()) ||
                          route.destination.toLowerCase().includes(routeFilter.toLowerCase());
      
      // Filter by date tab
      if (activeTab === "today") {
        // Simulating today's routes - in a real app, we would use actual date comparison
        return matchesSearch && (route.id % 3 === 0);
      } else if (activeTab === "upcoming") {
        // Simulating upcoming routes
        return matchesSearch && (route.id % 3 === 1);
      } else if (activeTab === "completed") {
        // Simulating completed routes
        return matchesSearch && (route.id % 3 === 2);
      }
      
      return matchesSearch;
    });
    
    return filtered;
  };

  const filteredRoutes = filterRoutes(routesData);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimized":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "delayed":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimized":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "delayed":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
  };

  const formatStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <DriverSidebarLayout>
      <div className="container mx-auto p-4 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">My Routes</h1>
          <p className="text-muted-foreground">View and manage your delivery routes</p>
        </header>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <Tabs 
              defaultValue="today" 
              className="w-full sm:w-auto"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search routes..."
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-gray-100 dark:bg-gray-800"></CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded mb-4"></div>
                    <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800 rounded mb-4"></div>
                    <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRoutes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-medium mb-2">No routes found</h3>
                <p className="text-muted-foreground">
                  {routeFilter ? 'Try adjusting your search terms.' : 'You have no routes for this period.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRoutes.map((route) => (
                <Card key={route.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{route.name}</CardTitle>
                      <Badge className={getStatusColor(route.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(route.status)}
                          {formatStatusText(route.status)}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Origin</span>
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="h-4 w-4" />
                          {route.origin}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Destination</span>
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="h-4 w-4" />
                          {route.destination}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">ETA</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-4 w-4" />
                          {route.eta}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Distance</span>
                        <span className="flex items-center gap-1 font-medium">
                          <TruckIcon className="h-4 w-4" />
                          {route.distance}
                        </span>
                      </div>
                    </div>
                    
                    {route.status === "optimized" && route.savings && (
                      <div className="bg-green-50 dark:bg-green-900/10 p-2 rounded-md">
                        <span className="text-green-700 dark:text-green-400 text-sm font-medium">
                          Optimized savings: {route.savings}
                        </span>
                      </div>
                    )}
                    
                    <div className="pt-2 flex justify-between">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      
                      {activeTab !== "completed" && (
                        <Button size="sm">
                          Start Navigation
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DriverSidebarLayout>
  );
}