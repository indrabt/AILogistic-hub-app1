import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize, MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface MapLocation {
  id: number;
  type: "distribution" | "transit" | "delay";
  lat: number;
  lng: number;
  name: string;
}

const SupplyChainMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { data: locations, isLoading } = useQuery({
    queryKey: ["/api/locations"],
  });

  useEffect(() => {
    // This would be replaced with actual map implementation
    // such as Mapbox or Leaflet in a production environment
    if (mapContainerRef.current) {
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [mapContainerRef]);

  return (
    <Card className="shadow">
      <CardHeader className="p-4 border-b border-gray-200 flex-row flex items-center justify-between space-y-0">
        <CardTitle className="font-bold text-gray-800">Supply Chain Map</CardTitle>
        <div className="flex">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary focus:outline-none mr-2">
            <Maximize size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary focus:outline-none">
            <MoreVertical size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div 
          ref={mapContainerRef}
          className="h-80 w-full bg-gray-100 rounded relative"
        >
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500 mt-2">Loading supply chain map...</p>
            </div>
          ) : (
            <div className="absolute inset-0">
              {/* In a real implementation, this would be replaced with an actual map component */}
              <svg className="w-full h-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 800 400">
                <rect width="100%" height="100%" fill="#edf2f7" />
                <path d="M100,200 C150,100 250,100 300,200 S450,300 500,200 S650,100 700,200" stroke="#1a237e" strokeWidth="2" fill="none" />
                <circle cx="100" cy="200" r="8" fill="#4CAF50" />
                <circle cx="300" cy="200" r="8" fill="#2196F3" />
                <circle cx="500" cy="200" r="8" fill="#2196F3" />
                <circle cx="700" cy="200" r="8" fill="#F44336" />
              </svg>
            </div>
          )}
          
          {/* Map Legend */}
          <div className="absolute bottom-3 right-3 bg-white p-2 rounded shadow-md text-xs">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Distribution Center</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>In Transit</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Delay Alert</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplyChainMap;
