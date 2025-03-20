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

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Put-Away Management</h1>
        <p className="text-muted-foreground">Manage and track put-away tasks for received inventory items</p>
      </div>

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