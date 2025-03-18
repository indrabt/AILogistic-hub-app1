
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Package2, Truck, AlertTriangle } from "lucide-react";

export default function WarehouseStaffDashboard() {
  const { data: inventory } = useQuery({ queryKey: ["/api/inventory"] });
  const { data: alerts } = useQuery({ queryKey: ["/api/resilience/forecasts"] });
  const { data: shipments } = useQuery({ queryKey: ["/api/shipments"] });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Warehouse Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package2 className="h-8 w-8 text-blue-500" />
              <span className="text-2xl ml-2">{shipments?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drivers En Route</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-green-500" />
              <span className="text-2xl ml-2">5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <span className="text-2xl ml-2">{alerts?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {alerts?.map(alert => (
        <Alert key={alert.id} variant={alert.severity === "severe" ? "destructive" : "default"}>
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Pending Actions</h3>
        <div className="space-y-2">
          {inventory?.map(item => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium">{item.product}</p>
                <p className="text-sm text-muted-foreground">Current: {item.current} | Minimum: {item.minimum}</p>
              </div>
              <Button variant="outline">Restock</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
