import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, CalendarIcon, Download, FileText, Filter, Plus, Printer, RefreshCw, Search, Share2, ChevronDown, FileBarChart, FileSpreadsheet, FilePieChart, FileQuestion } from "lucide-react";
import { Report } from "@shared/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportType, setReportType] = useState("all");

  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const getReportIcon = (type: string) => {
    switch (type) {
      case "logistics":
        return <FileBarChart className="h-10 w-10 text-primary-light" />;
      case "inventory":
        return <FilePieChart className="h-10 w-10 text-green-600" />;
      case "forecast":
        return <FileBarChart className="h-10 w-10 text-blue-600" />;
      case "routes":
        return <FileSpreadsheet className="h-10 w-10 text-orange-500" />;
      case "custom":
        return <FileQuestion className="h-10 w-10 text-purple-600" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "logistics":
        return "Logistics Performance";
      case "inventory":
        return "Inventory Status";
      case "forecast":
        return "Demand Forecast";
      case "routes":
        return "Route Analytics";
      case "custom":
        return "Custom Report";
      default:
        return "Report";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500 mr-2" />;
      case "excel":
        return <FileSpreadsheet className="h-4 w-4 text-green-600 mr-2" />;
      case "csv":
        return <FileText className="h-4 w-4 text-blue-500 mr-2" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500 mr-2" />;
    }
  };

  const filteredReports = reports
    .filter(report => report.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(report => reportType === "all" || report.type === reportType);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        <p className="text-gray-600">Generate and manage logistics reports</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search reports..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="text-sm text-gray-600 bg-transparent border-none shadow-none h-auto py-1 w-40">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="forecast">Forecasting</SelectItem>
                <SelectItem value="routes">Routes</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
          <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      {/* Reports Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reports.length}</div>
            <p className="text-sm text-gray-500">Generated this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Most Used Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Logistics Performance</div>
            <p className="text-sm text-gray-500">Downloaded 24 times</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-sm text-gray-500">Active schedules</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32.4 MB</div>
            <p className="text-sm text-gray-500">Of 1 GB allocated</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Card>
        <CardHeader className="border-b border-gray-200 p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Reports</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <svg className="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading reports...</span>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center p-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                  {filteredReports.map(report => (
                    <div key={report.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden">
                      <div className="p-6 flex items-start">
                        <div className="mr-4">
                          {getReportIcon(report.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{report.name}</h3>
                          <p className="text-sm text-gray-500 mb-3">{getReportTypeLabel(report.type)}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Last generated: {report.lastGenerated}</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          {getFormatIcon(report.format)}
                          <span className="text-xs text-gray-500">{report.format.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Printer className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent" className="m-0">
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Recently viewed reports</h3>
                  <p>View your recently accessed reports here</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="scheduled" className="m-0">
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Scheduled reports</h3>
                  <p>Manage your automated report schedules</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shared" className="m-0">
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <Share2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Shared reports</h3>
                  <p>View reports shared with you by your team</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Create Report Section */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle>Create New Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary-light bg-opacity-10 hover:bg-opacity-20 transition-colors border border-primary-light border-opacity-30 cursor-pointer">
              <BarChart3 className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium mb-1">Logistics Performance</h3>
              <p className="text-sm text-gray-600">Analyze delivery times, efficiency, and shipping costs</p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-100 hover:bg-green-200 transition-colors border border-green-200 cursor-pointer">
              <FileSpreadsheet className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-medium mb-1">Inventory Analysis</h3>
              <p className="text-sm text-gray-600">Track inventory levels, turnover rates, and forecasts</p>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors border border-blue-200 cursor-pointer">
              <FileBarChart className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-medium mb-1">Route Optimization</h3>
              <p className="text-sm text-gray-600">Measure route efficiency, fuel consumption, and time savings</p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">Or customize a report with specific metrics and parameters</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Create Custom Report <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Basic Report</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Advanced Analytics</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Scheduled Report</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
