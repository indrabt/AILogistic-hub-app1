import { useState } from "react";
import { Calendar, DownloadIcon, MapPin, ArrowRight, TrendingDown, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function Routes() {
  const [dateRange, setDateRange] = useState("7");
  const [activeTab, setActiveTab] = useState("active");
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Route Optimization</h2>
          <p className="text-gray-600">Real-time route updates and optimization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab("active")}>
            <MapPin className="h-4 w-4 mr-2" />
            Active Routes
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("upcoming")}>
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Route Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Time Saved</span>
                <span className="text-green-600 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  45 min
                </span>
              </div>
              <Progress value={75} />
              <p className="text-sm text-muted-foreground">75% more efficient than standard routes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>12 Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>3 Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
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
          
          <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1">
            <Select defaultValue="all">
              <SelectTrigger className="text-sm text-gray-600 bg-transparent border-none shadow-none h-auto py-1 w-40">
                <SelectValue placeholder="Route Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="optimized">Optimized</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            Create New Route
          </Button>
          <Button variant="secondary" className="bg-green-700 hover:bg-green-800 text-white">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Routes
          </Button>
        </div>
      </div>

      {/* Optimization Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">143</div>
              <span className="text-green-500 text-sm">+12 this week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Optimization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <div className="text-3xl font-bold mr-2">78%</div>
              <span className="text-green-500 text-sm">+5% this week</span>
            </div>
            <Progress value={78} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Savings per Route</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">27 min</div>
              <span className="text-green-500 text-sm">+3 min</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Map Section */}
      <Card className="mb-6">
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Route Map Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-80 bg-gray-100 rounded relative">
            {/* This would be a real map implementation in production */}
            <svg className="w-full h-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 800 400">
              <rect width="100%" height="100%" fill="#edf2f7" />
              <path d="M100,100 L300,150 L500,120 L700,230" stroke="#1a237e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M100,100 L320,200 L520,170 L700,230" stroke="#00796b" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <circle cx="100" cy="100" r="10" fill="#4CAF50" />
              <circle cx="300" cy="150" r="8" fill="#2196F3" />
              <circle cx="500" cy="120" r="8" fill="#2196F3" />
              <circle cx="700" cy="230" r="10" fill="#F44336" />
            </svg>
            
            {/* Map Legend */}
            <div className="absolute bottom-3 right-3 bg-white p-2 rounded shadow-md text-xs">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Starting Point</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Waypoint</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Destination</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 bg-green-700 mr-2"></div>
                <span>Optimized Route</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routes List */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle>Routes</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="all">All Routes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Route ID</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Origin</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Destination</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Savings</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium">RT-8294</td>
                  <td className="p-4 text-sm">Chicago, IL</td>
                  <td className="p-4 text-sm">Detroit, MI</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Optimized</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-green-600">45 min</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium">RT-7512</td>
                  <td className="p-4 text-sm">Dallas, TX</td>
                  <td className="p-4 text-sm">Houston, TX</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Optimized</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-green-600">30 min</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium">RT-6351</td>
                  <td className="p-4 text-sm">Los Angeles, CA</td>
                  <td className="p-4 text-sm">San Francisco, CA</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-sm">Delayed</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-red-500">-20 min</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium">RT-5437</td>
                  <td className="p-4 text-sm">New York, NY</td>
                  <td className="p-4 text-sm">Boston, MA</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Standard</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">0 min</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
