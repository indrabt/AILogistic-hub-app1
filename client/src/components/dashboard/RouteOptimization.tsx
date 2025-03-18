import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Route } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

interface OptimizationItem {
  id: number;
  name: string;
  description: string;
  saved: string;
}

const RouteOptimization = () => {
  const { data: optimizationData, isLoading } = useQuery({
    queryKey: ["/api/routes/optimizations"],
  });

  const { data: optimizationMetrics } = useQuery({
    queryKey: ["/api/routes/metrics"],
  });

  const optimizationPercentage = 75; // This would come from the API in a real implementation
  const optimizationTarget = 85;
  
  return (
    <Card className="shadow h-full">
      <CardHeader className="p-4 border-b border-gray-200 flex-row flex items-center justify-between space-y-0">
        <CardTitle className="font-bold text-gray-800">Route Optimization</CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary focus:outline-none">
          <MoreVertical size={18} />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Optimized Routes</span>
            <span className="text-green-500 text-sm font-bold">+12%</span>
          </div>
          <Progress value={optimizationPercentage} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Current: {optimizationPercentage}%</span>
            <span>Target: {optimizationTarget}%</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Optimizations</h4>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading optimizations...</span>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-100 pb-2 mb-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Route className="text-green-600 mr-2" size={16} />
                    <span className="text-sm">Penrith to Sydney CBD</span>
                  </div>
                  <span className="text-green-500 text-xs">-45 min</span>
                </div>
                <p className="text-xs text-gray-500 ml-6">Rerouted to avoid construction on M4 Motorway</p>
              </div>
              
              <div className="border-b border-gray-100 pb-2 mb-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Route className="text-green-600 mr-2" size={16} />
                    <span className="text-sm">Liverpool to Parramatta</span>
                  </div>
                  <span className="text-green-500 text-xs">-30 min</span>
                </div>
                <p className="text-xs text-gray-500 ml-6">Traffic-optimized departure time</p>
              </div>
            </>
          )}
          
          <Button variant="link" className="text-primary text-sm font-medium mt-2 px-0">
            View All Optimizations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteOptimization;
