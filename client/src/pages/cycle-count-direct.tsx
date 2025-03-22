import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, Package, Search, Filter, Plus, CalendarClock, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format } from "date-fns";

export default function CycleCountDirect() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock data for cycle count tasks
  const cycleTasks = [
    {
      id: 1,
      name: "Monthly Electronics Count",
      countingMethod: "cycle",
      status: "pending",
      scheduledDate: "2025-03-25",
      assignedTo: "John Doe",
      locations: [1, 2, 3],
      items: [
        { id: 101, sku: "ELEC-001", productName: "Smartphone", expectedQuantity: 50, status: "pending" },
        { id: 102, sku: "ELEC-002", productName: "Tablet", expectedQuantity: 25, status: "pending" },
        { id: 103, sku: "ELEC-003", productName: "Laptop", expectedQuantity: 15, status: "pending" }
      ]
    },
    {
      id: 2,
      name: "Weekly Food Inventory",
      countingMethod: "cycle",
      status: "in_progress",
      scheduledDate: "2025-03-22",
      assignedTo: "Jane Smith",
      startedAt: "2025-03-22T08:00:00",
      locations: [4, 5],
      items: [
        { id: 201, sku: "FOOD-001", productName: "Rice", expectedQuantity: 100, status: "counted", actualQuantity: 95 },
        { id: 202, sku: "FOOD-002", productName: "Pasta", expectedQuantity: 80, status: "pending" },
        { id: 203, sku: "FOOD-003", productName: "Cereal", expectedQuantity: 65, status: "counted", actualQuantity: 63 }
      ]
    },
    {
      id: 3,
      name: "Quarterly Full Inventory",
      countingMethod: "full",
      status: "completed",
      scheduledDate: "2025-03-15",
      assignedTo: "Robert Johnson",
      startedAt: "2025-03-15T09:00:00",
      completedAt: "2025-03-15T17:00:00",
      locations: [1, 2, 3, 4, 5, 6, 7, 8],
      items: [
        { id: 301, sku: "ELEC-001", productName: "Smartphone", expectedQuantity: 50, status: "counted", actualQuantity: 48 },
        { id: 302, sku: "ELEC-002", productName: "Tablet", expectedQuantity: 25, status: "counted", actualQuantity: 25 },
        { id: 303, sku: "FOOD-001", productName: "Rice", expectedQuantity: 100, status: "counted", actualQuantity: 92 }
      ]
    }
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Filter cycle count tasks based on search term and status
  const filteredTasks = cycleTasks.filter(task => {
    const matchesSearch = searchTerm === '' || 
      task.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate progress for a task
  const calculateProgress = (items: any[]) => {
    if (!items || items.length === 0) return 0;
    const countedItems = items.filter(item => 
      item.status === "counted" || item.status === "adjusted" || item.status === "investigation"
    ).length;
    return Math.round((countedItems / items.length) * 100);
  };

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Warehouse Cycle Counting</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage inventory accuracy through systematic cycle counts
          </p>
        </div>
        <div className="flex gap-2 space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Cycle Count</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Cycle Count Tasks
          </TabsTrigger>
          <TabsTrigger value="details" disabled={true}>
            <Package className="mr-2 h-4 w-4" />
            Count Details
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search cycle counts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {task.name}
                      </CardTitle>
                      <CardDescription>
                        {task.countingMethod === "cycle" ? "Cycle Count" : 
                         task.countingMethod === "full" ? "Full Inventory Count" : 
                         task.countingMethod === "partial" ? "Partial Count" : 
                         "Audit Count"}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusBadge(task.status)}>
                      {task.status === "pending" ? "Pending" :
                       task.status === "in_progress" ? "In Progress" :
                       task.status === "completed" ? "Completed" :
                       task.status === "cancelled" ? "Cancelled" : task.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center">
                        <CalendarClock className="h-4 w-4 mr-1.5" />
                        Scheduled for:
                      </span>
                      <span className="font-medium">{formatDate(task.scheduledDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span className="font-medium">{task.assignedTo}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items to count:</span>
                      <span className="font-medium">{task.items.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-medium">{calculateProgress(task.items)}%</span>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${calculateProgress(task.items)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button 
                        size="sm" 
                        className="mr-2"
                        disabled={task.status === "completed" || task.status === "cancelled"}
                      >
                        {task.status === "pending" ? "Start" : 
                         task.status === "in_progress" ? "Continue" : 
                         "View"}
                      </Button>
                      {task.status === "in_progress" && (
                        <Button 
                          size="sm"
                          variant="outline"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Cycle Count Analytics</CardTitle>
              <CardDescription>
                View metrics and trends from your cycle counts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Inventory Accuracy</h3>
                  <div className="h-64 border rounded flex items-center justify-center bg-gray-50">
                    <p className="text-muted-foreground">Analytics dashboard will be displayed here</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Discrepancy Trends</h3>
                  <div className="h-64 border rounded flex items-center justify-center bg-gray-50">
                    <p className="text-muted-foreground">Discrepancy chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}