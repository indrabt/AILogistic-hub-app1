import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "primary" | "accent" | "secondary" | "default";
}

const ActivityTypeColors = {
  primary: "border-primary bg-primary",
  accent: "border-orange-500 bg-orange-500",
  secondary: "border-green-600 bg-green-600",
  default: "border-gray-400 bg-gray-400"
};

const RecentActivity = () => {
  const { data: activities = [], isLoading } = useQuery<ActivityItem[]>({
    queryKey: ["/api/activities"],
  });

  return (
    <Card className="shadow h-full">
      <CardHeader className="p-4 border-b border-gray-200 flex-row flex items-center justify-between space-y-0">
        <CardTitle className="font-bold text-gray-800">Recent Activity</CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary focus:outline-none">
          <MoreVertical size={18} />
        </Button>
      </CardHeader>
      <CardContent className="p-4 max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading activity...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <>
            {/* This would map over real data in a production implementation */}
            <div className="mb-4 relative pl-6 pb-4 border-l-2 border-primary last:border-l-0 last:pb-0">
              <div className="absolute -left-1.5 top-0">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">Shipment #A4589 delivered</p>
                  <p className="text-xs text-gray-500">Package delivered to 123 George St, Sydney CBD</p>
                </div>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
            </div>
            
            <div className="mb-4 relative pl-6 pb-4 border-l-2 border-orange-500 last:border-l-0 last:pb-0">
              <div className="absolute -left-1.5 top-0">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">Route modification alert</p>
                  <p className="text-xs text-gray-500">5 routes modified due to weather conditions</p>
                </div>
                <span className="text-xs text-gray-500">4 hours ago</span>
              </div>
            </div>
            
            <div className="mb-4 relative pl-6 pb-4 border-l-2 border-green-600 last:border-l-0 last:pb-0">
              <div className="absolute -left-1.5 top-0">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">New shipment created</p>
                  <p className="text-xs text-gray-500">Shipment #B7813 created from Sydney to Melbourne</p>
                </div>
                <span className="text-xs text-gray-500">6 hours ago</span>
              </div>
            </div>
            
            <div className="mb-4 relative pl-6 pb-0 last:border-l-0 last:pb-0">
              <div className="absolute -left-1.5 top-0">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">System update completed</p>
                  <p className="text-xs text-gray-500">New route optimization algorithm deployed</p>
                </div>
                <span className="text-xs text-gray-500">12 hours ago</span>
              </div>
            </div>
            
            <Button variant="link" className="text-primary text-sm font-medium mt-2 px-0">
              View All Activity
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
