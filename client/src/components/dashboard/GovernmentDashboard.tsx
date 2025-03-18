
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Leaf, ShieldAlert } from "lucide-react";
import { SustainabilityMetrics, SecurityAlert } from "@/shared/types";

export default function GovernmentDashboard() {
  const { data: sustainability } = useQuery<SustainabilityMetrics>({ queryKey: ["/api/sustainability/metrics"] });
  const { data: security } = useQuery<SecurityAlert[]>({ queryKey: ["/api/security/alerts"] });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Public Sector Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="text-2xl ml-2">Operational</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-2xl ml-2">{sustainability?.sustainabilityScore || 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShieldAlert className="h-8 w-8 text-red-500" />
              <span className="text-2xl ml-2">{security?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
