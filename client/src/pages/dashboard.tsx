import { useState } from "react";
import { Calendar, DownloadIcon, Warehouse, Clock, AlertTriangle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MetricCard from "@/components/dashboard/MetricCard";
import SupplyChainMap from "@/components/dashboard/SupplyChainMap";
import WeatherImpact from "@/components/dashboard/WeatherImpact";
import DemandForecast from "@/components/dashboard/DemandForecast";
import RouteOptimization from "@/components/dashboard/RouteOptimization";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DataIntegration from "@/components/dashboard/DataIntegration";
import QuickHelp from "@/components/dashboard/QuickHelp";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("7");
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600">Overview of your logistics operations</p>
      </div>

      {/* Date Range Picker */}
      <div className="flex justify-between items-center mb-6">
        <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1">
          <Calendar className="text-gray-500 mr-2 h-4 w-4" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="text-sm text-gray-600 bg-transparent border-none shadow-none h-auto py-1 w-40">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-3">
          {/* Order Management Direct Access Button */}
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              console.log("Direct navigation to Order Management from Dashboard");
              console.log("Current location:", window.location.href);
              console.log("Current pathname:", window.location.pathname);
              console.log("Navigation timestamp:", new Date().toISOString());
              // Using direct DOM navigation as a workaround for router issues
              window.location.href = "/order-management";
            }}
          >
            Order Management
          </Button>
          
          <Button variant="secondary" className="bg-green-700 hover:bg-green-800 text-white">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Active Shipments"
          value="247"
          icon={<Warehouse size={24} />}
          change={{ value: "12% from last week", trend: "up" }}
          iconBgColor="bg-primary-light bg-opacity-10"
          iconColor="text-primary"
        />
        
        <MetricCard
          title="On-Time Delivery"
          value="94%"
          icon={<Clock size={24} />}
          change={{ value: "3% from last week", trend: "up" }}
          iconBgColor="bg-green-100"
          iconColor="text-green-700"
        />
        
        <MetricCard
          title="Delay Alerts"
          value="18"
          icon={<AlertTriangle size={24} />}
          change={{ value: "5% from last week", trend: "up" }}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-500"
        />
        
        <MetricCard
          title="Avg. Shipping Cost"
          value="$1,247"
          icon={<DollarSign size={24} />}
          change={{ value: "2% from last week", trend: "down" }}
          iconBgColor="bg-gray-200"
          iconColor="text-gray-700"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SupplyChainMap />
        </div>
        <WeatherImpact />
      </div>
      
      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DemandForecast />
        <RouteOptimization />
        <RecentActivity />
      </div>

      {/* Data Upload Section */}
      <DataIntegration />
      
      {/* Help & Resources */}
      <QuickHelp />
    </div>
  );
}
