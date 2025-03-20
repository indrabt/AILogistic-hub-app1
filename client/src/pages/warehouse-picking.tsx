import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Search, Check, X, ArrowUpDown, PackageCheck, Barcode, Clock, Filter, Package2 } from "lucide-react";
import { 
  PickTask, 
  PickTaskItem,
  ScanVerification,
  ScanType,
  ScanResult,
  PriorityLevel
} from "@/shared/warehouse-types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Badge,
} from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";

export default function WarehousePicking() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // States
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<PickTask | null>(null);
  const [selectedItem, setSelectedItem] = useState<PickTaskItem | null>(null);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [scanVerification, setScanVerification] = useState<ScanVerification>({
    verified: false
  });
  const [scannedQuantity, setScannedQuantity] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  useEffect(() => {
    // Check if user is logged in
    const userJson = sessionStorage.getItem("user");
    if (!userJson) {
      setLocation("/login");
      return;
    }

    const userData = JSON.parse(userJson);
    setUser(userData);

    // Check if this navigation came through our direct link approach
    const usingDirectAccess = sessionStorage.getItem("usingDirectWarehouseAccess");
    const directPickingAccess = sessionStorage.getItem("directWarehousePickingAccess");
    
    // Skip role-based redirect if coming through direct link or is warehouse staff
    if (userData.role !== "warehouse_staff" && !usingDirectAccess && !directPickingAccess) {
      if (userData.role === "driver") {
        setLocation("/driver-dashboard");
      } else if (userData.role === "business_owner") {
        setLocation("/business-dashboard");
      } else {
        setLocation("/dashboard");
      }
    }
    
    // Set a flag to indicate we've accessed this page successfully
    sessionStorage.setItem("directWarehousePickingAccess", "true");
  }, [setLocation]);

  // API Queries
  const { 
    data: pickTasks = [], 
    isLoading: isTasksLoading 
  } = useQuery<PickTask[]>({
    queryKey: ["/api/warehouse/pick-tasks"],
    queryFn: () => apiRequest("/api/warehouse/pick-tasks"),
  });

  const { 
    data: pickTaskItems = [], 
    isLoading: isTaskItemsLoading
  } = useQuery<PickTaskItem[]>({
    queryKey: ["/api/warehouse/pick-task-items", selectedTask?.id],
    queryFn: () => selectedTask 
      ? apiRequest(`/api/warehouse/pick-task-items?taskId=${selectedTask.id}`) 
      : Promise.resolve([]),
    enabled: !!selectedTask,
  });

  // Complete pick item mutation
  const completePickItemMutation = useMutation({
    mutationFn: (data: { id: number, pickedQuantity: number, locationId: number }) => {
      return apiRequest(
        `/api/warehouse/pick-task-items/${data.id}/complete`, 
        { method: "PUT" }, 
        {
          pickedQuantity: data.pickedQuantity,
          locationId: data.locationId
        }
      );
    },
    onSuccess: () => {
      toast({
        title: "Item Picked",
        description: "Item has been successfully picked"
      });
      
      // Clear states
      setScanVerification({ verified: false });
      setScannedQuantity(0);
      setSelectedItem(null);
      setScanDialogOpen(false);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/warehouse/pick-task-items", selectedTask?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/warehouse/pick-tasks"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to complete picking: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Pick task update mutation (to mark as in-progress/completed)
  const updatePickTaskMutation = useMutation({
    mutationFn: (data: { id: number, status: string, assignedTo?: string }) => {
      const updateData = {
        status: data.status,
        assignedTo: data.assignedTo || user?.username,
        ...(data.status === "in_progress" ? { startedAt: new Date().toISOString() } : {}),
        ...(data.status === "completed" ? { completedAt: new Date().toISOString() } : {})
      };
      
      return apiRequest(
        `/api/warehouse/pick-tasks/${data.id}`,
        { method: "PATCH" },
        updateData
      );
    },
    onSuccess: () => {
      toast({
        title: "Task Updated",
        description: "Pick task status has been updated"
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/warehouse/pick-tasks"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Simulate barcode scanning
  const handleScan = () => {
    // In a real app, this would connect to a barcode scanner
    // For demo purposes, we simulate a successful scan
    const mockScanResult: ScanResult = {
      success: true,
      scanType: "barcode",
      scannedValue: selectedItem?.sku || "",
      timestamp: new Date().toISOString(),
      scannedBy: user?.username || "current_user",
      matchesExpected: true
    };

    const mockLocationScan: ScanResult = {
      success: true,
      scanType: "barcode",
      scannedValue: `LOC-${selectedItem?.locationId || ""}`,
      timestamp: new Date().toISOString(),
      scannedBy: user?.username || "current_user",
      matchesExpected: true
    };

    // Update verification state
    setScanVerification({
      itemScan: mockScanResult,
      locationScan: mockLocationScan,
      verified: true,
      verificationTimestamp: new Date().toISOString(),
      verifiedBy: user?.username || "current_user"
    });
    
    // Set default quantity
    setScannedQuantity(selectedItem?.quantity || 0);
  };

  // Handle starting a picking task
  const handleStartTask = (task: PickTask) => {
    updatePickTaskMutation.mutate({
      id: task.id,
      status: "in_progress",
      assignedTo: user?.username
    });
    setSelectedTask(task);
  };

  // Handle completing a picking task
  const handleCompleteTask = (task: PickTask) => {
    // Check if all items are picked
    const allItemsPicked = (pickTaskItems as PickTaskItem[]).every(
      item => item.status === "picked" || item.status === "unavailable"
    );

    if (!allItemsPicked) {
      toast({
        title: "Cannot Complete Task",
        description: "Not all items have been picked or marked as unavailable",
        variant: "destructive"
      });
      return;
    }

    updatePickTaskMutation.mutate({
      id: task.id,
      status: "completed"
    });
    setSelectedTask(null);
  };

  // Handle completing a pick item
  const handleCompletePicking = () => {
    if (!selectedItem || !scanVerification.verified) {
      toast({
        title: "Cannot Complete",
        description: "Verification failed or no item selected",
        variant: "destructive"
      });
      return;
    }

    completePickItemMutation.mutate({
      id: selectedItem.id,
      pickedQuantity: scannedQuantity,
      locationId: selectedItem.locationId
    });
  };

  // Handle marking item as unavailable
  const handleMarkUnavailable = (item: PickTaskItem) => {
    completePickItemMutation.mutate({
      id: item.id,
      pickedQuantity: 0,
      locationId: item.locationId
    });
    
    toast({
      title: "Item Marked as Unavailable",
      description: `${item.productName} has been marked as unavailable`
    });
  };

  // Filter tasks based on search query and filter selections
  const filteredTasks = (pickTasks as PickTask[]).filter(task => {
    // Status filter
    if (statusFilter !== "all" && task.status !== statusFilter) {
      return false;
    }
    
    // Priority filter
    if (priorityFilter !== "all" && task.priority !== priorityFilter) {
      return false;
    }
    
    // Search query
    return task.id.toString().includes(searchQuery) || 
      (task.customerOrderId.toString().includes(searchQuery));
  });

  // Display loading state
  if (isTasksLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading picking tasks...</span>
      </div>
    );
  }

  // Priority colors
  const getPriorityColor = (priority: PriorityLevel) => {
    switch(priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Warehouse Picking</h1>
          <p className="text-muted-foreground">Efficiently manage picking tasks and orders</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/warehouse-dashboard")}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => setLocation("/login")}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5" />
              Picking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Pending Tasks</span>
              <span className="font-bold">{(pickTasks as PickTask[]).filter(t => t.status === "pending").length}</span>
            </div>
            <div className="flex justify-between">
              <span>In Progress</span>
              <span className="font-bold">{(pickTasks as PickTask[]).filter(t => t.status === "in_progress").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed Today</span>
              <span className="font-bold">{(pickTasks as PickTask[]).filter(t => t.status === "completed").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Urgent Priority</span>
              <span className="font-bold text-red-500">{(pickTasks as PickTask[]).filter(t => t.priority === "urgent").length}</span>
            </div>
          </CardContent>
          <CardFooter>
            <div className="space-y-2 w-full">
              <div className="flex justify-between text-sm">
                <span>Daily Progress</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Picking Tasks</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 mt-2">
              <div className="flex flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by task ID or order ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <span className="flex items-center">
                      <Filter className="h-4 w-4 mr-1" />
                      Status
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[120px]">
                    <span className="flex items-center">
                      <ArrowUpDown className="h-4 w-4 mr-1" />
                      Priority
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No tasks match your current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task: PickTask) => (
                    <TableRow 
                      key={task.id} 
                      className={task.id === selectedTask?.id ? "bg-primary/10" : ""}
                    >
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>{task.customerOrderId}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-2 ${getPriorityColor(task.priority)}`}></div>
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      </TableCell>
                      <TableCell>{task.items?.length || 0} items</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            task.status === "completed" 
                              ? "success" 
                              : task.status === "in_progress" 
                              ? "default" 
                              : task.status === "cancelled" 
                              ? "destructive" 
                              : "outline"
                          }
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.status === "pending" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStartTask(task)}
                          >
                            Start Picking
                          </Button>
                        )}
                        {task.status === "in_progress" && (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedTask(task)}
                            >
                              View Details
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleCompleteTask(task)}
                            >
                              Complete
                            </Button>
                          </div>
                        )}
                        {task.status === "completed" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                          >
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedTask && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Task #{selectedTask.id} Details</CardTitle>
                <CardDescription>
                  Order #{selectedTask.customerOrderId} • 
                  Due: {new Date(selectedTask.dueDate).toLocaleDateString()} •
                  Status: {selectedTask.status.replace('_', ' ')}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>
                <X className="h-4 w-4 mr-1" />
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isTaskItemsLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Loading items...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(pickTaskItems as PickTaskItem[]).map((item: PickTaskItem) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <span className="font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded text-xs">
                          {item.locationName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "picked" 
                              ? "success" 
                              : item.status === "unavailable" 
                              ? "destructive" 
                              : "outline"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setScanDialogOpen(true);
                              }}
                            >
                              <Barcode className="h-4 w-4 mr-1" />
                              Scan & Pick
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkUnavailable(item)}
                            >
                              Mark Unavailable
                            </Button>
                          </div>
                        )}
                        {(item.status === "picked" || item.status === "unavailable") && (
                          <div className="flex gap-2 items-center">
                            {item.status === "picked" ? (
                              <>
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-muted-foreground">
                                  Picked {item.pickedQuantity} from {item.locationName}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Marked as unavailable
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {selectedTask.status === "in_progress" && (
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={() => handleCompleteTask(selectedTask)}
                disabled={(pickTaskItems as PickTaskItem[]).some(
                  item => item.status === "pending"
                )}
              >
                Complete Picking Task
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {/* Scan Dialog */}
      <Dialog open={scanDialogOpen} onOpenChange={setScanDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Item & Location</DialogTitle>
            <DialogDescription>
              Scan the barcode on the item and its location to verify and pick
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Product Details:</label>
              <div className="border p-3 rounded-md">
                <p className="font-medium">{selectedItem?.productName}</p>
                <p className="text-sm font-mono text-muted-foreground">{selectedItem?.sku}</p>
                <p className="text-sm">Location: {selectedItem?.locationName}</p>
                <p className="text-sm">Required Quantity: {selectedItem?.quantity}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {!scanVerification.verified ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleScan}
                >
                  <Barcode className="mr-2 h-4 w-4" />
                  Simulate Barcode Scan
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Verification:</label>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <span>Item and location successfully verified</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Picked Quantity:</label>
                    <Input 
                      type="number" 
                      value={scannedQuantity} 
                      onChange={(e) => setScannedQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                      min={0}
                      max={selectedItem?.quantity || 0}
                    />
                    {scannedQuantity < (selectedItem?.quantity || 0) && (
                      <p className="text-sm text-amber-500">
                        This is a partial pick. The remaining quantity will stay as pending.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setScanDialogOpen(false);
                setScanVerification({ verified: false });
                setScannedQuantity(0);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!scanVerification.verified || scannedQuantity <= 0}
              onClick={handleCompletePicking}
            >
              Confirm Pick
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}