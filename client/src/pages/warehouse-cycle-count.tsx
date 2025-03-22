import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  ClipboardCheck, 
  Search, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  Warehouse,
  ArrowRightCircle,
  XCircle,
  Plus,
  Filter,
  Check,
  CalendarClock,
  ListFilter,
  BarChart3,
  Clipboard,
  ClipboardList
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CycleCountTask, CycleCountItem, StorageLocation } from "../shared/warehouse-types";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function WarehouseCycleCount() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState<string>("");
  
  // Fetch cycle count tasks
  const { data: cycleTasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['/api/warehouse/cycle-counts'],
    enabled: activeTab === "tasks",
  });
  
  // Fetch storage locations for creating new cycle count
  const { data: locations } = useQuery({
    queryKey: ['/api/warehouse/storage-locations'],
    enabled: showCreateDialog,
  });
  
  // Fetch specific task details
  const { data: selectedTask, isLoading: isLoadingSelectedTask } = useQuery({
    queryKey: ['/api/warehouse/cycle-counts', selectedTaskId],
    enabled: !!selectedTaskId,
  });
  
  // Fetch cycle count items for the selected task
  const { data: cycleItems, isLoading: isLoadingItems } = useQuery({
    queryKey: ['/api/warehouse/cycle-counts', selectedTaskId, 'items'],
    enabled: !!selectedTaskId,
    queryFn: async () => {
      const response = await fetch(`/api/warehouse/cycle-counts/${selectedTaskId}/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch cycle count items');
      }
      return response.json();
    }
  });

  // Create a new cycle count task
  const createCycleCountMutation = useMutation({
    mutationFn: async (newCycleCount: any) => {
      const response = await fetch('/api/warehouse/cycle-counts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCycleCount),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create cycle count task');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse/cycle-counts'] });
      setShowCreateDialog(false);
      toast({
        title: "Cycle Count Created",
        description: "The cycle count task has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Cycle Count",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Start a cycle count task
  const startCycleCountMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await fetch(`/api/warehouse/cycle-counts/${taskId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start cycle count task');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse/cycle-counts'] });
      if (selectedTaskId) {
        queryClient.invalidateQueries({ queryKey: ['/api/warehouse/cycle-counts', selectedTaskId] });
      }
      toast({
        title: "Cycle Count Started",
        description: "You can now begin counting items.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Start Cycle Count",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Complete a cycle count task
  const completeCycleCountMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await fetch(`/api/warehouse/cycle-counts/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete cycle count task');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse/cycle-counts'] });
      if (selectedTaskId) {
        queryClient.invalidateQueries({ queryKey: ['/api/warehouse/cycle-counts', selectedTaskId] });
      }
      toast({
        title: "Cycle Count Completed",
        description: "The cycle count has been marked as complete.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Complete Cycle Count",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Apply inventory adjustments from cycle count
  const applyAdjustmentsMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await fetch(`/api/warehouse/cycle-counts/${taskId}/apply-adjustments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply adjustments');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse/cycle-counts'] });
      if (selectedTaskId) {
        queryClient.invalidateQueries({ queryKey: ['/api/warehouse/cycle-counts', selectedTaskId] });
      }
      toast({
        title: "Adjustments Applied",
        description: `${data.adjustedItems.length} inventory items have been adjusted based on cycle count.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Apply Adjustments",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update a cycle count item (record actual count)
  const updateCycleCountItemMutation = useMutation({
    mutationFn: async ({ id, actualQuantity }: { id: number, actualQuantity: number }) => {
      const response = await fetch(`/api/warehouse/cycle-count-items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actualQuantity,
          countedBy: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') || '{}').username : 'warehouse-staff',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update count');
      }
      
      return response.json();
    },
    onSuccess: () => {
      if (selectedTaskId) {
        // Invalidate the specific items query to fetch updated data
        queryClient.invalidateQueries({ queryKey: ['/api/warehouse/cycle-counts', selectedTaskId, 'items'] });
        // Also invalidate the task query as the progress may have changed
        queryClient.invalidateQueries({ queryKey: ['/api/warehouse/cycle-counts', selectedTaskId] });
      }
      setSelectedItemId(null);
      setCurrentQuantity("");
      toast({
        title: "Count Recorded",
        description: "The item count has been recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Record Count",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Filter cycle count tasks based on search term and status
  const filteredTasks = cycleTasks ? (cycleTasks as CycleCountTask[]).filter(task => {
    const matchesSearch = searchTerm === '' || 
      task.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) : [];
  
  // Handle creating a new cycle count task
  const handleCreateCycleCount = (data: any) => {
    createCycleCountMutation.mutate({
      name: data.name,
      countingMethod: data.countingMethod,
      scheduledDate: format(new Date(data.scheduledDate), 'yyyy-MM-dd'),
      locations: data.locations,
      notes: data.notes || ""
    });
  };
  
  // Handle recording an item count
  const handleRecordCount = () => {
    if (!selectedItemId || !currentQuantity) return;
    
    const actualQuantity = parseInt(currentQuantity);
    if (isNaN(actualQuantity) || actualQuantity < 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity.",
        variant: "destructive",
      });
      return;
    }
    
    updateCycleCountItemMutation.mutate({
      id: selectedItemId,
      actualQuantity
    });
  };
  
  // Handle viewing a task's details
  const handleViewTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setActiveTab("details");
  };
  
  // Calculate progress for a task
  const calculateProgress = (items: CycleCountItem[]) => {
    if (!items || items.length === 0) return 0;
    const countedItems = items.filter(item => 
      item.status === "counted" || item.status === "adjusted" || item.status === "investigation"
    ).length;
    return Math.round((countedItems / items.length) * 100);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
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
      case "counted":
        return "bg-green-100 text-green-800";
      case "investigation":
        return "bg-orange-100 text-orange-800";
      case "adjusted":
        return "bg-purple-100 text-purple-800";
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
            onClick={() => setShowCreateDialog(true)}
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
            <ClipboardList className="mr-2 h-4 w-4" />
            Cycle Count Tasks
          </TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedTaskId}>
            <Clipboard className="mr-2 h-4 w-4" />
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
          
          {isLoadingTasks ? (
            <div className="flex justify-center items-center py-8">
              <p>Loading cycle count tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-background/50 border rounded-lg p-8 text-center">
              <ClipboardCheck className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium text-lg mb-2">No Cycle Count Tasks Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? "Try changing your search criteria or filters"
                  : "Create your first cycle count task to get started"}
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Cycle Count
              </Button>
            </div>
          ) : (
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
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <CalendarClock className="h-4 w-4 mr-1.5" />
                          Scheduled for:
                        </span>
                        <span className="font-medium">{formatDate(task.scheduledDate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Package className="h-4 w-4 mr-1.5" />
                          Items to count:
                        </span>
                        <span className="font-medium">{task.items?.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Warehouse className="h-4 w-4 mr-1.5" />
                          Locations:
                        </span>
                        <span className="font-medium">{task.locations?.length || 0}</span>
                      </div>
                      {task.assignedTo && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Assigned to:</span>
                          <span className="font-medium">{task.assignedTo}</span>
                        </div>
                      )}
                      
                      {task.items && task.items.length > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress:</span>
                            <span className="font-medium">
                              {calculateProgress(task.items)}% Complete
                            </span>
                          </div>
                          <Progress value={calculateProgress(task.items)} className="h-2" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewTask(task.id)}>
                      View Details
                    </Button>
                    
                    {task.status === "pending" && (
                      <Button 
                        size="sm" 
                        onClick={() => startCycleCountMutation.mutate(task.id)}
                        disabled={startCycleCountMutation.isPending}
                      >
                        Start Count
                      </Button>
                    )}
                    
                    {task.status === "in_progress" && (
                      <Button 
                        size="sm" 
                        onClick={() => completeCycleCountMutation.mutate(task.id)}
                        disabled={completeCycleCountMutation.isPending}
                      >
                        Complete
                      </Button>
                    )}
                    
                    {task.status === "completed" && (
                      <Button 
                        size="sm"
                        variant="outline" 
                        onClick={() => applyAdjustmentsMutation.mutate(task.id)}
                        disabled={applyAdjustmentsMutation.isPending}
                      >
                        Apply Adjustments
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          {selectedTaskId && (
            <>
              {isLoadingSelectedTask ? (
                <div className="flex justify-center items-center py-8">
                  <p>Loading task details...</p>
                </div>
              ) : !selectedTask ? (
                <Alert variant="destructive">
                  <AlertTitle>Task Not Found</AlertTitle>
                  <AlertDescription>
                    The selected cycle count task could not be found.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle>Task Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{selectedTask.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Method:</span>
                            <span className="font-medium">
                              {selectedTask.countingMethod === "cycle" ? "Cycle Count" : 
                               selectedTask.countingMethod === "full" ? "Full Inventory Count" : 
                               selectedTask.countingMethod === "partial" ? "Partial Count" : 
                               "Audit Count"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className={getStatusBadge(selectedTask.status)}>
                              {selectedTask.status === "pending" ? "Pending" :
                               selectedTask.status === "in_progress" ? "In Progress" :
                               selectedTask.status === "completed" ? "Completed" :
                               "Cancelled"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Scheduled Date:</span>
                            <span className="font-medium">{formatDate(selectedTask.scheduledDate)}</span>
                          </div>
                          {selectedTask.assignedTo && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Assigned To:</span>
                              <span className="font-medium">{selectedTask.assignedTo}</span>
                            </div>
                          )}
                          {selectedTask.startedAt && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Started At:</span>
                              <span className="font-medium">{formatDate(selectedTask.startedAt)}</span>
                            </div>
                          )}
                          {selectedTask.completedAt && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Completed At:</span>
                              <span className="font-medium">{formatDate(selectedTask.completedAt)}</span>
                            </div>
                          )}
                          {selectedTask.notes && (
                            <div className="mt-2">
                              <span className="text-muted-foreground">Notes:</span>
                              <p className="mt-1">{selectedTask.notes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTaskId(null);
                            setActiveTab("tasks");
                          }}
                        >
                          Back to Tasks
                        </Button>
                        
                        {selectedTask.status === "pending" && (
                          <Button 
                            size="sm" 
                            onClick={() => startCycleCountMutation.mutate(selectedTask.id)}
                            disabled={startCycleCountMutation.isPending}
                          >
                            Start Count
                          </Button>
                        )}
                        
                        {selectedTask.status === "in_progress" && (
                          <Button 
                            size="sm" 
                            onClick={() => completeCycleCountMutation.mutate(selectedTask.id)}
                            disabled={completeCycleCountMutation.isPending}
                          >
                            Complete
                          </Button>
                        )}
                        
                        {selectedTask.status === "completed" && (
                          <Button 
                            size="sm"
                            variant="outline" 
                            onClick={() => applyAdjustmentsMutation.mutate(selectedTask.id)}
                            disabled={applyAdjustmentsMutation.isPending}
                          >
                            Apply Adjustments
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                    
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle>Count Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoadingItems ? (
                          <div className="flex justify-center items-center py-4">
                            <p>Loading items...</p>
                          </div>
                        ) : !cycleItems || cycleItems.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">No items assigned to this task</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Items:</span>
                              <span className="font-medium">{cycleItems.length}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Counted Items:</span>
                              <span className="font-medium">
                                {cycleItems.filter(item => 
                                  item.status === "counted" || 
                                  item.status === "adjusted" || 
                                  item.status === "investigation"
                                ).length}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Remaining:</span>
                              <span className="font-medium">
                                {cycleItems.filter(item => item.status === "pending").length}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Discrepancies Found:</span>
                              <span className="font-medium">
                                {cycleItems.filter(item => 
                                  item.status === "investigation" || 
                                  (item.discrepancy !== undefined && item.discrepancy !== 0)
                                ).length}
                              </span>
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Progress:</span>
                                <span className="font-medium">
                                  {calculateProgress(cycleItems)}% Complete
                                </span>
                              </div>
                              <Progress value={calculateProgress(cycleItems)} className="h-2" />
                            </div>
                            
                            {cycleItems.some(item => item.discrepancy !== undefined && item.discrepancy < 0) && (
                              <Alert className="mt-4 bg-orange-50 text-orange-800 border-orange-200">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Negative Discrepancies Found</AlertTitle>
                                <AlertDescription>
                                  Some items have less inventory than expected. Review and adjust inventory as needed.
                                </AlertDescription>
                              </Alert>
                            )}
                            
                            {cycleItems.some(item => item.discrepancy !== undefined && item.discrepancy > 0) && (
                              <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Positive Discrepancies Found</AlertTitle>
                                <AlertDescription>
                                  Some items have more inventory than expected. Review and adjust inventory as needed.
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Item Details</CardTitle>
                        <div className="flex items-center">
                          <div className="text-xs flex gap-2">
                            <Badge variant="outline" className="bg-orange-50 text-orange-800 hover:bg-orange-50">
                              Discrepancy
                            </Badge>
                            <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-50">
                              Match
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoadingItems ? (
                        <div className="flex justify-center items-center py-4">
                          <p>Loading items...</p>
                        </div>
                      ) : !cycleItems || cycleItems.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">No items assigned to this task</p>
                        </div>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead className="text-center">Expected Qty</TableHead>
                                <TableHead className="text-center">Actual Qty</TableHead>
                                <TableHead className="text-center">Discrepancy</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {cycleItems.map((item) => (
                                <TableRow key={item.id} className={
                                  item.discrepancy !== undefined && item.discrepancy !== 0
                                    ? "bg-orange-50/30"
                                    : item.status === "counted" || item.status === "adjusted"
                                      ? "bg-green-50/30"
                                      : ""
                                }>
                                  <TableCell className="font-medium">{item.sku}</TableCell>
                                  <TableCell>{item.productName}</TableCell>
                                  <TableCell className="text-center">{item.expectedQuantity}</TableCell>
                                  <TableCell className="text-center">
                                    {item.actualQuantity !== undefined ? item.actualQuantity : "-"}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {item.discrepancy !== undefined ? (
                                      <span className={
                                        item.discrepancy === 0
                                          ? "text-green-600"
                                          : item.discrepancy > 0
                                            ? "text-blue-600"
                                            : "text-red-600"
                                      }>
                                        {item.discrepancy > 0 ? `+${item.discrepancy}` : item.discrepancy}
                                      </span>
                                    ) : "-"}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getStatusBadge(item.status)}>
                                      {item.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {selectedTask.status === "in_progress" && item.status === "pending" && (
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedItemId(item.id);
                                          setCurrentQuantity("");
                                        }}
                                      >
                                        Count
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Count Accuracy Rate</CardTitle>
                <CardDescription>Inventory accuracy performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold mb-2">96.8%</div>
                  <p className="text-xs text-muted-foreground mb-4">Based on last 10 cycle counts</p>
                  <Progress value={96.8} className="h-2 w-full" />
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Target:</p>
                      <p className="font-medium">98%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trend:</p>
                      <p className="font-medium text-green-600">+0.3%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Counts:</p>
                      <p className="font-medium">47</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Count:</p>
                      <p className="font-medium">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discrepancy Analysis</CardTitle>
                <CardDescription>Most common inventory issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Overstock</div>
                      <div className="text-xs text-muted-foreground">Items with positive discrepancy</div>
                    </div>
                    <div className="font-medium">34.2%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Missing Stock</div>
                      <div className="text-xs text-muted-foreground">Items with negative discrepancy</div>
                    </div>
                    <div className="font-medium">42.6%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Misplaced Stock</div>
                      <div className="text-xs text-muted-foreground">Items found in wrong location</div>
                    </div>
                    <div className="font-medium">18.9%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Data Entry Errors</div>
                      <div className="text-xs text-muted-foreground">Records corrected after verification</div>
                    </div>
                    <div className="font-medium">4.3%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inventory Value Impact</CardTitle>
                <CardDescription>Financial effects of cycle counts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Total Adjustments Value</span>
                      <span className="font-medium">$12,487.53</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Last 30 days</span>
                      <span className="text-red-500">-$3,241.22</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Avg. Adjustment per Count</span>
                      <span className="font-medium">$265.69</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Trend</span>
                      <span className="text-green-500">-12.4%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Most Adjusted Category</span>
                      <span className="font-medium">Electronics</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Adjustment Value</span>
                      <span className="text-red-500">$4,832.14</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Create New Cycle Count Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Cycle Count</DialogTitle>
            <DialogDescription>
              Set up a new cycle count task for inventory verification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Count Name</Label>
              <Input
                id="name"
                placeholder="Enter a descriptive name"
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="method">Counting Method</Label>
              <Select defaultValue="cycle">
                <SelectTrigger>
                  <SelectValue placeholder="Select counting method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cycle">Cycle Count</SelectItem>
                  <SelectItem value="full">Full Inventory Count</SelectItem>
                  <SelectItem value="partial">Partial Count</SelectItem>
                  <SelectItem value="audit">Audit Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="scheduled-date">Scheduled Date</Label>
              <Input
                id="scheduled-date"
                type="date"
                defaultValue={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="locations">Warehouse Locations</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select locations to count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="zone-a">Zone A</SelectItem>
                  <SelectItem value="zone-b">Zone B</SelectItem>
                  <SelectItem value="zone-c">Zone C</SelectItem>
                  <SelectItem value="bulk-storage">Bulk Storage</SelectItem>
                  <SelectItem value="high-value">High Value Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add any additional notes or instructions"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Cycle Count</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Record Count Dialog */}
      <Dialog open={!!selectedItemId} onOpenChange={(open) => !open && setSelectedItemId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Item Count</DialogTitle>
            <DialogDescription>
              Enter the actual quantity counted for this item.
            </DialogDescription>
          </DialogHeader>
          
          {selectedItemId && cycleItems && (
            <div className="py-4">
              <div className="mb-4 space-y-1">
                <p className="font-medium">{cycleItems.find(item => item.id === selectedItemId)?.productName}</p>
                <p className="text-sm text-muted-foreground">
                  SKU: {cycleItems.find(item => item.id === selectedItemId)?.sku}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="mt-2">Expected Quantity:</Label>
                  <span className="font-medium text-lg">
                    {cycleItems.find(item => item.id === selectedItemId)?.expectedQuantity}
                  </span>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="actual-quantity">Actual Quantity</Label>
                  <Input
                    id="actual-quantity"
                    type="number"
                    min="0"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItemId(null)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleRecordCount}
              disabled={!currentQuantity || updateCycleCountItemMutation.isPending}
            >
              Record Count
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}