
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Map, Clock } from "lucide-react";
import { Route } from "@/shared/types";

export default function CourierDashboard() {
  const { data: routes } = useQuery<Route[]>({ queryKey: ["/api/routes"] });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Courier Operations Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-500" />
              <span className="text-2xl ml-2">{routes?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Route Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Map className="h-8 w-8 text-green-500" />
              <span className="text-2xl ml-2">85%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500" />
              <span className="text-2xl ml-2">32m</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
