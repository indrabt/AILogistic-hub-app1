import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, Route as RouteIcon, MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface WeatherAlert {
  id: number;
  severity: "severe" | "advisory";
  title: string;
  description: string;
  time: string;
  affectedShipments?: number;
}

const WeatherImpact = () => {
  const { data: weatherAlerts = [], isLoading } = useQuery({
    queryKey: ["/api/weather/alerts"],
  });

  const getAlertIcon = (severity: string) => {
    return <AlertTriangle className={severity === "severe" ? "text-red-500" : "text-orange-500"} size={18} />;
  };

  const getAlertTitle = (severity: string) => {
    return severity === "severe" ? "Severe Weather Alert" : "Weather Advisory";
  };

  return (
    <Card className="shadow h-full">
      <CardHeader className="p-4 border-b border-gray-200 flex-row flex items-center justify-between space-y-0">
        <CardTitle className="font-bold text-gray-800">Weather Impact</CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary focus:outline-none">
          <MoreVertical size={18} />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading weather alerts...</span>
          </div>
        ) : weatherAlerts.length === 0 ? (
          <div className="text-center p-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No weather alerts at this time</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <AlertTriangle className="text-red-500 mr-1" size={18} />
                  <span className="font-medium text-red-500">Severe Weather Alert</span>
                </div>
                <span className="text-xs text-gray-500">12:30 PM</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Heavy snowfall expected in the Northeast region affecting 14 active shipments.
              </p>
              <div className="flex mt-1">
                <Button variant="link" size="sm" className="text-xs h-auto p-0 text-primary mr-3" asChild>
                  <a className="flex items-center"><Eye className="mr-1" size={12} />View Details</a>
                </Button>
                <Button variant="link" size="sm" className="text-xs h-auto p-0 text-primary" asChild>
                  <a className="flex items-center"><RouteIcon className="mr-1" size={12} />Suggest Routes</a>
                </Button>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <AlertTriangle className="text-orange-500 mr-1" size={18} />
                  <span className="font-medium text-orange-500">Weather Advisory</span>
                </div>
                <span className="text-xs text-gray-500">09:15 AM</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Fog reducing visibility along West Coast routes. Expected delays of 1-2 hours.
              </p>
              <div className="flex mt-1">
                <Button variant="link" size="sm" className="text-xs h-auto p-0 text-primary mr-3" asChild>
                  <a className="flex items-center"><Eye className="mr-1" size={12} />View Details</a>
                </Button>
                <Button variant="link" size="sm" className="text-xs h-auto p-0 text-primary" asChild>
                  <a className="flex items-center"><RouteIcon className="mr-1" size={12} />Suggest Routes</a>
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-2">
              <Button variant="link" className="text-primary text-sm font-medium">
                View All Weather Alerts
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherImpact;
