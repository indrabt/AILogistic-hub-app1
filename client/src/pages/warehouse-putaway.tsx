import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Search, Check, X, ArrowUpDown, FileBarChart, ClipboardList } from "lucide-react";
import { PutAwayTask, StorageLocation } from "@/shared/warehouse-types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WarehousePutaway() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [navigationFlags, setNavigationFlags] = useState<{[key: string]: boolean | string}>({});
  
  // Debug check for navigation flags on component mount
  useEffect(() => {
    console.log('WarehousePutaway component mounted');
    
    // Check all potential navigation flags in session storage
    const flags = {
      directWarehouseAccess: sessionStorage.getItem("directWarehouseAccess") === "true",
      directWarehousePutawayAccess: sessionStorage.getItem("directWarehousePutawayAccess") === "true",
      directWarehouseReceivingAccess: sessionStorage.getItem("directWarehouseReceivingAccess") === "true",
      directWarehouseDashboardAccess: sessionStorage.getItem("directWarehouseDashboardAccess") === "true",
      bypassRouter: sessionStorage.getItem("bypassRouter") === "true",
      warehouseAccessMethod: sessionStorage.getItem("warehouseAccessMethod") || "unknown"
    };
    
    setNavigationFlags(flags);
    
    console.log(`Navigation flags: directWarehouseAccess=${flags.directWarehouseAccess}, directWarehousePutawayAccess=${flags.directWarehousePutawayAccess}, bypassRouter=${flags.bypassRouter}`);
    
    // Ensure the page was navigated to properly
    if (!flags.directWarehouseAccess && !flags.directWarehousePutawayAccess && !flags.bypassRouter) {
      console.warn('Warning: Accessing warehouse-putaway without navigation flags');
      toast({
        title: 'Navigation Warning',
        description: 'You may have accessed this page incorrectly. Try using the sidebar navigation.',
        variant: 'destructive',
      });
    }
    
    // Clear flags after successful navigation
    return () => {
      console.log('WarehousePutaway component unmounted, clearing navigation flags');
      sessionStorage.removeItem("directWarehousePutawayAccess");
    };
  }, [toast]);

  // Fetch put-away tasks
  const { data: putAwayTasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['/api/warehouse/put-away-tasks', statusFilter],
    queryFn: async () => {
      const url = statusFilter
        ? `/api/warehouse/put-away-tasks?status=${statusFilter}`
        : '/api/warehouse/put-away-tasks';
      const response = await apiRequest('GET', url);
      return response;
    }
  });

  // Fetch available storage locations
  const { data: storageLocations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['/api/warehouse/storage-locations'],
    queryFn: async () => {
      const url = '/api/warehouse/storage-locations?status=available';
      const response = await apiRequest('GET', url);
      return response;
    }
  });

  // Complete put-away task mutation
  const completePutAwayTaskMutation = useMutation({
    mutationFn: (data: { taskId: number, locationId: number }) => {
      return apiRequest('PATCH', `/api/warehouse/put-away-tasks/${data.taskId}/complete`, {
        locationId: data.locationId
      });
    },
    onSuccess: () => {
      toast({
        title: "Task Completed",
        description: "The put-away task has been completed successfully.",
      });
      setCompleteDialogOpen(false);
      setSelectedTaskId(null);
      setSelectedLocationId(null);
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse/put-away-tasks'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete put-away task.",
        variant: "destructive",
      });
    }
  });

  // Filtered tasks based on search query
  const filteredTasks = putAwayTasks.filter((task: PutAwayTask) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      task.sku.toLowerCase().includes(searchLower) ||
      task.productName.toLowerCase().includes(searchLower) ||
      task.suggestedLocation?.name.toLowerCase().includes(searchLower) ||
      (task.assignedTo && task.assignedTo.toLowerCase().includes(searchLower))
    );
  });

  // Complete task handler
  const onCompleteTask = () => {
    if (!selectedTaskId || !selectedLocationId) {
      toast({
        title: "Error",
        description: "Please select a valid storage location.",
        variant: "destructive",
      });
      return;
    }

    completePutAwayTaskMutation.mutate({
      taskId: selectedTaskId,
      locationId: selectedLocationId
    });
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Toggle debug view
  const toggleDebugView = () => {
    setShowDebug(!showDebug);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Put-Away Management</h1>
        <div className="flex flex-col space-y-2">
          <p className="text-muted-foreground">Manage and track put-away tasks for received inventory items</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleDebugView}
            className="self-end"
          >
            {showDebug ? "Hide Debug" : "Show Debug"}
          </Button>
        </div>
      </div>
      
      {/* Debug Information Panel */}
      {showDebug && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">Navigation Debug Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            {Object.entries(navigationFlags).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 border-b border-blue-100 pb-1">
                <span className="font-semibold">{key}:</span>
                <span className={typeof value === 'boolean' && value ? "text-green-600" : 
                                 typeof value === 'string' && value !== "unknown" ? "text-blue-600" : "text-red-600"}>
                  {typeof value === 'boolean' ? value.toString() : value}
                </span>
              </div>
            ))}
            <div className="col-span-full mt-2">
              <p className="text-xs text-blue-700">
                {navigationFlags.directWarehousePutawayAccess ? 
                  "✅ Navigation flags set correctly" : 
                  "⚠️ Missing required navigation flags"}
              </p>
            </div>
            <div className="col-span-full mt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Test direct navigation via warehouse-direct.html
                  window.location.href = "/warehouse-direct.html?target=putaway&test=true&t=" + new Date().getTime();
                }}
              >
                Test Direct Page Navigation
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Test manual flag setting
                  sessionStorage.removeItem("directWarehouseDashboardAccess");
                  sessionStorage.removeItem("directWarehouseReceivingAccess");
                  sessionStorage.removeItem("directWarehousePutawayAccess");
                  
                  // Set navigation flags for put-away access
                  sessionStorage.setItem("directWarehousePutawayAccess", "true");
                  sessionStorage.setItem("directWarehouseAccess", "true");
                  sessionStorage.setItem("bypassRouter", "true");
                  sessionStorage.setItem("warehouseAccessMethod", "debug-test");
                  
                  // Refresh the page to test navigation
                  window.location.reload();
                }}
              >
                Test Flag Setting
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Put-Away Tasks</CardTitle>
          <CardDescription>
            View and manage tasks for putting away received items to their storage locations
          </CardDescription>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by SKU, product, or location"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTasks ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No tasks found matching your search." : "No put-away tasks available."}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Suggested Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task: PutAwayTask) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">#{task.id}</TableCell>
                      <TableCell>{task.sku}</TableCell>
                      <TableCell>{task.productName}</TableCell>
                      <TableCell>{task.quantity}</TableCell>
                      <TableCell>
                        {task.suggestedLocation?.name || "Not assigned"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.assignedTo || "Unassigned"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          {task.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTaskId(task.id);
                                setCompleteDialogOpen(true);
                              }}
                            >
                              <ClipboardList className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          
                          {task.status === "in_progress" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTaskId(task.id);
                                setCompleteDialogOpen(true);
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Mark Complete
                            </Button>
                          )}
                          
                          {task.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                            >
                              <Check className="h-4 w-4 mr-1 text-green-500" />
                              Completed
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complete Put-Away Task Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Put-Away Task</DialogTitle>
            <DialogDescription>
              Confirm the final storage location for this item
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Select value={selectedLocationId?.toString() || ""} onValueChange={(value) => setSelectedLocationId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select storage location" />
                </SelectTrigger>
                <SelectContent>
                  {storageLocations.map((location: StorageLocation) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name} ({location.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" placeholder="Add any relevant notes..." />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={onCompleteTask}
              disabled={completePutAwayTaskMutation.isPending || !selectedLocationId}
            >
              {completePutAwayTaskMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Complete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}