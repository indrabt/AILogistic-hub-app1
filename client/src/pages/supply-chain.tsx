import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Truck, Package, ArrowRight, DownloadIcon, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function SupplyChain() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Supply Chain</h2>
        <p className="text-gray-600">End-to-end supply chain visualization and management</p>
      </div>

      {/* Filters and Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1">
            <Calendar className="text-gray-500 mr-2 h-4 w-4" />
            <Select defaultValue="7">
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
                <SelectValue placeholder="Product Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="apparel">Apparel</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button variant="secondary" className="bg-green-700 hover:bg-green-800 text-white">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Supply Chain Map */}
      <Card className="mb-6">
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle>Supply Chain Visualization</CardTitle>
            <Tabs defaultValue="map">
              <TabsList>
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="network">Network View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96 bg-gray-50 relative">
            {/* This would be a real map/visualization in production */}
            <svg viewBox="0 0 1000 400" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
              {/* Background grid */}
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#smallGrid)" />
              
              {/* Main distribution centers */}
              <circle cx="200" cy="150" r="20" fill="#1a237e" />
              <text x="200" y="150" textAnchor="middle" fill="white" fontSize="10">DC1</text>
              
              <circle cx="500" cy="200" r="20" fill="#1a237e" />
              <text x="500" y="200" textAnchor="middle" fill="white" fontSize="10">DC2</text>
              
              <circle cx="800" cy="120" r="20" fill="#1a237e" />
              <text x="800" y="120" textAnchor="middle" fill="white" fontSize="10">DC3</text>
              
              {/* Regional centers */}
              <circle cx="300" cy="250" r="15" fill="#00796b" />
              <text x="300" y="250" textAnchor="middle" fill="white" fontSize="8">RC1</text>
              
              <circle cx="600" cy="100" r="15" fill="#00796b" />
              <text x="600" y="100" textAnchor="middle" fill="white" fontSize="8">RC2</text>
              
              <circle cx="700" cy="300" r="15" fill="#00796b" />
              <text x="700" y="300" textAnchor="middle" fill="white" fontSize="8">RC3</text>
              
              {/* Local centers */}
              <circle cx="250" cy="300" r="10" fill="#ff9100" />
              <circle cx="350" cy="280" r="10" fill="#ff9100" />
              <circle cx="550" cy="50" r="10" fill="#ff9100" />
              <circle cx="650" cy="150" r="10" fill="#ff9100" />
              <circle cx="750" cy="250" r="10" fill="#ff9100" />
              <circle cx="850" cy="200" r="10" fill="#ff9100" />
              
              {/* Connections */}
              <line x1="200" y1="150" x2="300" y2="250" stroke="#1a237e" strokeWidth="3" />
              <line x1="500" y1="200" x2="600" y2="100" stroke="#1a237e" strokeWidth="3" />
              <line x1="500" y1="200" x2="700" y2="300" stroke="#1a237e" strokeWidth="3" />
              <line x1="800" y1="120" x2="600" y2="100" stroke="#1a237e" strokeWidth="3" />
              
              <line x1="300" y1="250" x2="250" y2="300" stroke="#00796b" strokeWidth="2" />
              <line x1="300" y1="250" x2="350" y2="280" stroke="#00796b" strokeWidth="2" />
              <line x1="600" y1="100" x2="550" y2="50" stroke="#00796b" strokeWidth="2" />
              <line x1="600" y1="100" x2="650" y2="150" stroke="#00796b" strokeWidth="2" />
              <line x1="700" y1="300" x2="750" y2="250" stroke="#00796b" strokeWidth="2" />
              <line x1="700" y1="300" x2="850" y2="200" stroke="#00796b" strokeWidth="2" />
              
              {/* Active shipments */}
              <circle cx="250" cy="200" r="5" fill="#f44336">
                <animate attributeName="cx" from="200" to="300" dur="5s" repeatCount="indefinite" />
                <animate attributeName="cy" from="150" to="250" dur="5s" repeatCount="indefinite" />
              </circle>
              <circle cx="550" cy="150" r="5" fill="#f44336">
                <animate attributeName="cx" from="500" to="600" dur="7s" repeatCount="indefinite" />
                <animate attributeName="cy" from="200" to="100" dur="7s" repeatCount="indefinite" />
              </circle>
              <circle cx="650" cy="210" r="5" fill="#f44336">
                <animate attributeName="cx" from="500" to="700" dur="10s" repeatCount="indefinite" />
                <animate attributeName="cy" from="200" to="300" dur="10s" repeatCount="indefinite" />
              </circle>
            </svg>
            
            {/* Map Legend */}
            <div className="absolute bottom-3 right-3 bg-white p-2 rounded shadow-md text-xs">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                <span>Distribution Center</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-green-700 mr-2"></div>
                <span>Regional Center</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>Local Center</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Active Shipment</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94%</div>
            <Progress value={94} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Inventory Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.4x</div>
            <div className="text-green-500 text-sm">+0.6x from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Supply Chain Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$2.1M</div>
            <div className="text-red-500 text-sm">+5% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Supplier Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <Progress value={87} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Shipments and Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Critical Shipments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-100">
              <li className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                      <Truck size={16} />
                    </span>
                    <div>
                      <p className="font-medium">Shipment #A4589</p>
                      <p className="text-sm text-gray-500">Penrith to Sydney CBD</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">On Schedule</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <p>ETA: <span className="font-medium">Today, 4:30 PM</span></p>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <p>Priority: <span className="font-medium text-red-600">High</span></p>
                </div>
              </li>
              <li className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                      <Truck size={16} />
                    </span>
                    <div>
                      <p className="font-medium">Shipment #B7813</p>
                      <p className="text-sm text-gray-500">Sydney to Melbourne</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Delayed</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <p>ETA: <span className="font-medium">Tomorrow, 10:15 AM</span></p>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <p>Priority: <span className="font-medium text-orange-600">Medium</span></p>
                </div>
              </li>
              <li className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                      <Truck size={16} />
                    </span>
                    <div>
                      <p className="font-medium">Shipment #C3921</p>
                      <p className="text-sm text-gray-500">Parramatta to Newcastle</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">On Schedule</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <p>ETA: <span className="font-medium">Tomorrow, 2:45 PM</span></p>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <p>Priority: <span className="font-medium text-green-600">Normal</span></p>
                </div>
              </li>
            </ul>
            <div className="p-4 border-t border-gray-100 text-center">
              <Button variant="link" className="text-primary">View All Shipments</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Low Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-100">
              <li className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 mr-3">
                      <AlertTriangle size={16} />
                    </span>
                    <div>
                      <p className="font-medium">Electronic Components</p>
                      <p className="text-sm text-gray-500">Sydney Distribution Center</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Critical</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <p>Current: <span className="font-medium">52 units</span></p>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <p>Minimum: <span className="font-medium">200 units</span></p>
                </div>
                <Progress value={26} className="h-2 mt-2" />
              </li>
              <li className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-3">
                      <AlertTriangle size={16} />
                    </span>
                    <div>
                      <p className="font-medium">Packaging Supplies</p>
                      <p className="text-sm text-gray-500">Parramatta Regional Center</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Low</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <p>Current: <span className="font-medium">120 units</span></p>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <p>Minimum: <span className="font-medium">200 units</span></p>
                </div>
                <Progress value={60} className="h-2 mt-2" />
              </li>
              <li className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-3">
                      <AlertTriangle size={16} />
                    </span>
                    <div>
                      <p className="font-medium">Winter Clothing</p>
                      <p className="text-sm text-gray-500">Liverpool Local Center</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Low</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <p>Current: <span className="font-medium">85 units</span></p>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <p>Minimum: <span className="font-medium">150 units</span></p>
                </div>
                <Progress value={56} className="h-2 mt-2" />
              </li>
            </ul>
            <div className="p-4 border-t border-gray-100 text-center">
              <Button variant="link" className="text-primary">View All Inventory Alerts</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
