
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, TrendingUp, AlertTriangle } from "lucide-react";
import { ResilienceForecast } from "@/shared/types";

export default function ManufacturerDashboard() {
  const { data: forecasts } = useQuery<ResilienceForecast[]>({ queryKey: ["/api/resilience/forecasts"] });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manufacturing Operations Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Production Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Factory className="h-8 w-8 text-blue-500" />
              <span className="text-2xl ml-2">98%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <span className="text-2xl ml-2">Good</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl ml-2">{forecasts?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
