
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse, Truck, Package2, ArrowUpDown } from "lucide-react";
import { MultiModalRoute, WeatherAlert } from "@/shared/types";

export default function WarehouseOperatorDashboard() {
  const { data: routes } = useQuery<MultiModalRoute[]>({ queryKey: ["/api/routes/multi-modal"] });
  const { data: alerts } = useQuery<WeatherAlert[]>({ queryKey: ["/api/weather/alerts"] });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Warehouse Operations Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package2 className="h-8 w-8 text-blue-500" />
              <span className="text-2xl ml-2">{routes?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warehouse Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Warehouse className="h-8 w-8 text-green-500" />
              <span className="text-2xl ml-2">75%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Modal Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowUpDown className="h-8 w-8 text-purple-500" />
              <span className="text-2xl ml-2">{routes?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
