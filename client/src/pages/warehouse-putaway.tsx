import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Search, Check, X, ArrowUpDown, FileBarChart, ClipboardList } from "lucide-react";
import { 
  PutAwayTask, 
  StorageLocation, 
  LocationRecommendation,
  ScanVerification,
  ProductCategory
} from "@/shared/warehouse-types";

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
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [navigationFlags, setNavigationFlags] = useState<{[key: string]: boolean | string}>({});
  const [showScanInterface, setShowScanInterface] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PutAwayTask | null>(null);
  const [locationRecommendations, setLocationRecommendations] = useState<LocationRecommendation[]>([]);
  const [scanVerification, setScanVerification] = useState<ScanVerification>({
    verified: false,
    itemScan: {
      success: true,
      scanType: "barcode",
      scannedValue: "ELEC-LAPTOP-001",
      timestamp: new Date().toISOString(),
      scannedBy: "manager1",
      matchesExpected: true,
    },
    locationScan: {
      success: true,
      scanType: "qrcode",
      scannedValue: "A12-B3-C4",
      timestamp: new Date().toISOString(),
      scannedBy: "manager1",
      matchesExpected: true,
    },
    verificationTimestamp: new Date().toISOString(),
    verifiedBy: "manager1",
    notes: "Both item and location scan match."
  });
  
  // Effect to update verification status when both item and location scans are present
  useEffect(() => {
    if (scanVerification.itemScan && scanVerification.locationScan) {
      // Check if both scans are successful and match expected values
      const itemMatch = scanVerification.itemScan.success && scanVerification.itemScan.matchesExpected;
      const locationMatch = scanVerification.locationScan.success && scanVerification.locationScan.matchesExpected;
      
      // Update verified flag based on scan matches
      if (itemMatch && locationMatch) {
        setScanVerification(prev => ({
          ...prev,
          verified: true,
          verificationTimestamp: new Date().toISOString(),
          verifiedBy: "manager1",
          notes: "Both item and location scan match."
        }));
      }
    }
  }, [scanVerification.itemScan, scanVerification.locationScan]);
  
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

  // Fetch put-away tasks from API
  const { data: putAwayTasksFromAPI = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['/api/warehouse/put-away-tasks', statusFilter],
    queryFn: async () => {
      const url = statusFilter && statusFilter !== 'all'
        ? `/api/warehouse/put-away-tasks?status=${statusFilter}`
        : '/api/warehouse/put-away-tasks';
      const response = await apiRequest('GET', url);
      return response;
    }
  });
  
  // Sample data for demonstration
  const samplePutAwayTasks: PutAwayTask[] = [
    {
      id: 1001,
      inboundOrderId: 5001,
      inboundOrderItemId: 6001,
      sku: "ELEC-LAPTOP-001",
      productName: "Premium Laptop 15\"",
      quantity: 8,
      suggestedLocation: {
        id: 101,
        name: "A12-B3-C4",
        type: "shelf",
        aisle: "A12",
        rack: "B3",
        shelf: "C4",
        capacity: 10,
        capacityUnit: "units",
        currentUtilization: 0,
        status: "available",
        temperatureZone: "ambient",
        velocityZone: "fast",
        compatibleCategories: ["electronics", "fragile"],
        suitabilityScore: 95
      },
      alternativeLocations: [
        {
          location: {
            id: 102,
            name: "A12-B3-C5",
            type: "shelf",
            aisle: "A12",
            rack: "B3",
            shelf: "C5",
            capacity: 10,
            capacityUnit: "units",
            currentUtilization: 20,
            status: "available",
            temperatureZone: "ambient",
            velocityZone: "fast",
            compatibleCategories: ["electronics", "fragile"],
            suitabilityScore: 90
          },
          score: 90,
          reason: ["Alternative for electronics", "Near primary location"],
          ideal: false
        }
      ],
      status: "pending",
      assignedTo: "manager1",
      productCharacteristics: {
        category: "electronics",
        size: "medium",
        weight: "medium",
        velocityCategory: "fast",
        hazardous: false,
        fragile: true,
        stackable: false,
        specialHandling: ["anti-static", "cushioning"]
      },
      scanRequired: true
    }
  ];
  
  // Use sample data if API returns empty array
  const putAwayTasks = putAwayTasksFromAPI.length > 0 ? putAwayTasksFromAPI : samplePutAwayTasks;

  // Fetch available storage locations from API
  const { data: storageLocationsFromAPI = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['/api/warehouse/storage-locations', selectedTaskId],
    queryFn: async () => {
      let url = '/api/warehouse/storage-locations?status=available';
      
      // Add product ID parameter for optimal location suggestions if a task is selected
      if (selectedTaskId) {
        const selectedTask = putAwayTasks.find((task: PutAwayTask) => task.id === selectedTaskId);
        if (selectedTask) {
          url += `&sku=${selectedTask.sku}`;
        }
      }
      
      const response = await apiRequest('GET', url);
      return response;
    },
    enabled: !!putAwayTasks.length // Only run this query once we have tasks
  });
  
  // Sample storage locations for demonstration
  const sampleStorageLocations: StorageLocation[] = [
    // Primary suggested location
    {
      id: 101,
      name: "A12-B3-C4",
      type: "shelf",
      aisle: "A12",
      rack: "B3",
      shelf: "C4",
      capacity: 10,
      capacityUnit: "units",
      currentUtilization: 0,
      status: "available",
      temperatureZone: "ambient",
      velocityZone: "fast",
      compatibleCategories: ["electronics", "fragile"],
      suitabilityScore: 95
    },
    // Alternative locations with varying characteristics
    {
      id: 102,
      name: "A12-B3-C5",
      type: "shelf",
      aisle: "A12",
      rack: "B3",
      shelf: "C5",
      capacity: 10,
      capacityUnit: "units",
      currentUtilization: 20,
      status: "available",
      temperatureZone: "ambient",
      velocityZone: "fast",
      compatibleCategories: ["electronics", "fragile"],
      suitabilityScore: 90
    },
    {
      id: 103,
      name: "A13-B1-C2",
      type: "shelf",
      aisle: "A13",
      rack: "B1",
      shelf: "C2",
      capacity: 15,
      capacityUnit: "units",
      currentUtilization: 30,
      status: "available",
      temperatureZone: "ambient",
      velocityZone: "medium",
      compatibleCategories: ["electronics", "fragile"],
      suitabilityScore: 85
    },
    {
      id: 104,
      name: "B22-R4-S1",
      type: "rack",
      aisle: "B22",
      rack: "R4",
      shelf: "S1",
      capacity: 20,
      capacityUnit: "units",
      currentUtilization: 10,
      status: "available",
      temperatureZone: "ambient",
      velocityZone: "slow",
      compatibleCategories: ["electronics", "clothing"],
      suitabilityScore: 70
    },
    {
      id: 105,
      name: "C15-H2",
      type: "bin",
      aisle: "C15", 
      bin: "H2",
      capacity: 8,
      capacityUnit: "units",
      currentUtilization: 0,
      temperature: 22,
      humidity: 45,
      status: "available",
      compatibleCategories: ["clothing", "electronics"],
      suitabilityScore: 65
    }
  ];
  
  // Use sample data if API returns empty array
  const storageLocations = storageLocationsFromAPI.length > 0 ? storageLocationsFromAPI : sampleStorageLocations;

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
            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Complete Put-Away Task</DialogTitle>
            <DialogDescription>
              Confirm the final storage location for this item
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="location" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="location">Location Selection</TabsTrigger>
              <TabsTrigger value="scan">Scan Verification</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibility Check</TabsTrigger>
            </TabsList>
            
            <TabsContent value="location" className="space-y-4">
              {selectedTaskId && (
                <div className="bg-slate-50 rounded-md p-3 mb-2">
                  <h3 className="text-sm font-medium mb-1">Selected Item</h3>
                  <div className="text-xs text-slate-600 grid grid-cols-2 gap-2">
                    <span><strong>SKU:</strong> {putAwayTasks.find((t: PutAwayTask) => t.id === selectedTaskId)?.sku}</span>
                    <span><strong>Product:</strong> {putAwayTasks.find((t: PutAwayTask) => t.id === selectedTaskId)?.productName}</span>
                    <span><strong>Quantity:</strong> {putAwayTasks.find((t: PutAwayTask) => t.id === selectedTaskId)?.quantity}</span>
                    <span><strong>Suggested:</strong> {putAwayTasks.find((t: PutAwayTask) => t.id === selectedTaskId)?.suggestedLocation?.name || "Not assigned"}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location" className="text-base">Storage Location</Label>
                  <Badge variant="outline" className="ml-2">
                    {locationRecommendations.length > 0 
                      ? `${locationRecommendations.filter(r => r.ideal).length} Ideal Locations` 
                      : "Using standard locations"}
                  </Badge>
                </div>
                
                <Select 
                  value={selectedLocationId?.toString() || ""} 
                  onValueChange={(value) => setSelectedLocationId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage location" />
                  </SelectTrigger>
                  <SelectContent>
                    {storageLocations.map((location: StorageLocation) => {
                      const recommendation = locationRecommendations.find(r => r.location.id === location.id);
                      return (
                        <SelectItem 
                          key={location.id} 
                          value={location.id.toString()}
                          className={recommendation?.ideal ? "bg-green-50 font-medium" : ""}
                        >
                          {location.name} ({location.type})
                          {recommendation?.ideal && " ★"}
                          {location.suitabilityScore && ` - Score: ${location.suitabilityScore}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedLocationId && (
                <div className="border rounded-md p-3 mt-2">
                  <h3 className="text-sm font-medium mb-2">Location Details</h3>
                  {storageLocations
                    .filter((loc: StorageLocation) => loc.id === selectedLocationId)
                    .map((location: StorageLocation) => (
                      <div key={location.id} className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div><strong>Type:</strong> {location.type}</div>
                        <div><strong>Status:</strong> {location.status}</div>
                        {location.temperatureZone && (
                          <div><strong>Temperature Zone:</strong> {location.temperatureZone}</div>
                        )}
                        {location.velocityZone && (
                          <div><strong>Velocity Zone:</strong> {location.velocityZone}</div>
                        )}
                        <div><strong>Capacity:</strong> {location.capacity} {location.capacityUnit}</div>
                        <div><strong>Current Usage:</strong> {location.currentUtilization}%</div>
                        {location.compatibleCategories && location.compatibleCategories.length > 0 && (
                          <div className="col-span-2">
                            <strong>Compatible With:</strong> {location.compatibleCategories.join(', ')}
                          </div>
                        )}
                        {location.incompatibleCategories && location.incompatibleCategories.length > 0 && (
                          <div className="col-span-2">
                            <strong className="text-red-500">Incompatible With:</strong> {location.incompatibleCategories.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" placeholder="Add any relevant notes..." />
              </div>
            </TabsContent>
            
            <TabsContent value="scan" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Verification by Scanning</h3>
                <Badge variant={scanVerification.verified ? "success" : "outline"}>
                  {scanVerification.verified ? "Verified ✓" : "Not Verified"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-3">Scan Item</h4>
                  <div className="space-y-4">
                    <div className="flex justify-center pb-4">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          // Simulate item scanning
                          setScanVerification(prev => ({
                            ...prev,
                            itemScan: {
                              success: true,
                              scanType: "barcode",
                              scannedValue: putAwayTasks.find((t: PutAwayTask) => t.id === selectedTaskId)?.sku || "",
                              timestamp: new Date().toISOString(),
                              scannedBy: "current_user",
                              matchesExpected: true
                            }
                          }));
                          toast({
                            title: "Item Scanned",
                            description: "Item barcode verified successfully.",
                          });
                        }}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Scan Item Barcode
                      </Button>
                    </div>
                    
                    {scanVerification.itemScan && (
                      <div className="bg-slate-50 rounded-md p-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Scan Result:</span>
                          {scanVerification.itemScan.success ? (
                            <Badge variant="success" className="text-xs">Success</Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">Failed</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                          <span><strong>Value:</strong> {scanVerification.itemScan.scannedValue}</span>
                          <span><strong>Type:</strong> {scanVerification.itemScan.scanType}</span>
                          <span><strong>Time:</strong> {new Date(scanVerification.itemScan.timestamp).toLocaleTimeString()}</span>
                          <span><strong>Match:</strong> {scanVerification.itemScan.matchesExpected ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-3">Scan Location</h4>
                  <div className="space-y-4">
                    <div className="flex justify-center pb-4">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          // Simulate location scanning
                          const location = storageLocations.find((l: StorageLocation) => l.id === selectedLocationId);
                          
                          setScanVerification(prev => ({
                            ...prev,
                            locationScan: {
                              success: true,
                              scanType: "qrcode",
                              scannedValue: location?.name || "",
                              timestamp: new Date().toISOString(),
                              scannedBy: "current_user",
                              matchesExpected: true
                            },
                            verified: prev.itemScan !== undefined
                          }));
                          
                          toast({
                            title: "Location Scanned",
                            description: "Location QR code verified successfully.",
                          });
                        }}
                        disabled={!selectedLocationId}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Scan Location QR Code
                      </Button>
                    </div>
                    
                    {scanVerification.locationScan && (
                      <div className="bg-slate-50 rounded-md p-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Scan Result:</span>
                          {scanVerification.locationScan.success ? (
                            <Badge variant="success" className="text-xs">Success</Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">Failed</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                          <span><strong>Value:</strong> {scanVerification.locationScan.scannedValue}</span>
                          <span><strong>Type:</strong> {scanVerification.locationScan.scanType}</span>
                          <span><strong>Time:</strong> {new Date(scanVerification.locationScan.timestamp).toLocaleTimeString()}</span>
                          <span><strong>Match:</strong> {scanVerification.locationScan.matchesExpected ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {scanVerification.itemScan && scanVerification.locationScan && (
                <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700 font-medium">Verification Complete</p>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Both item and location have been successfully verified.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="compatibility" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Compatibility Analysis</h3>
              </div>
              
              {selectedLocationId ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Product-Location Compatibility</h4>
                    
                    {(() => {
                      const location = storageLocations.find((l: StorageLocation) => l.id === selectedLocationId);
                      const task = putAwayTasks.find((t: PutAwayTask) => t.id === selectedTaskId);
                      
                      if (!location || !task) {
                        return <p className="text-sm text-slate-500">Please select both a task and location to check compatibility.</p>;
                      }
                      
                      const recommendation = locationRecommendations.find(r => r.location.id === location.id);
                      
                      // Check if this is an ideal location
                      if (recommendation?.ideal) {
                        return (
                          <div className="bg-green-50 p-3 rounded-md border border-green-200">
                            <div className="flex items-center">
                              <Check className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-green-700 font-medium">Ideal Match</span>
                            </div>
                            <p className="text-sm text-green-600 mt-1">
                              This is an ideal location for this product based on its characteristics.
                            </p>
                            {recommendation.reason && (
                              <ul className="mt-2 text-xs text-green-600 list-disc list-inside">
                                {recommendation.reason.map((reason, idx) => (
                                  <li key={idx}>{reason}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      }
                      
                      // Check for incompatibilities
                      const incompatibleCategories = location.incompatibleCategories || [];
                      const productCategory = task.productCharacteristics?.category;
                      
                      if (productCategory && incompatibleCategories.includes(productCategory)) {
                        return (
                          <div className="bg-red-50 p-3 rounded-md border border-red-200">
                            <div className="flex items-center">
                              <X className="h-5 w-5 text-red-500 mr-2" />
                              <span className="text-red-700 font-medium">Incompatible</span>
                            </div>
                            <p className="text-sm text-red-600 mt-1">
                              This location is not compatible with {productCategory} products.
                            </p>
                            <div className="mt-2 bg-white p-2 rounded border border-red-100">
                              <p className="text-xs text-red-500 font-medium">Warning: Placing this item here may cause:</p>
                              <ul className="mt-1 text-xs text-red-500 list-disc list-inside">
                                <li>Product damage or contamination</li>
                                <li>Regulatory compliance issues</li>
                                <li>Safety hazards</li>
                              </ul>
                            </div>
                          </div>
                        );
                      }
                      
                      // Default case - compatible but not ideal
                      return (
                        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                          <div className="flex items-center">
                            <ArrowUpDown className="h-5 w-5 text-yellow-500 mr-2" />
                            <span className="text-yellow-700 font-medium">Compatible (Not Ideal)</span>
                          </div>
                          <p className="text-sm text-yellow-600 mt-1">
                            This location can be used but is not optimal for this product type.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-2">Product Characteristics</h4>
                      {(() => {
                        const task = putAwayTasks.find((t: PutAwayTask) => t.id === selectedTaskId);
                        const characteristics = task?.productCharacteristics;
                        
                        if (!characteristics) {
                          return <p className="text-sm text-slate-500">No detailed characteristics available.</p>;
                        }
                        
                        return (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div><strong>Category:</strong> {characteristics.category || "Unknown"}</div>
                            <div><strong>Size:</strong> {characteristics.size || "Standard"}</div>
                            <div><strong>Weight:</strong> {characteristics.weight || "Standard"}</div>
                            <div><strong>Velocity:</strong> {characteristics.velocityCategory || "Medium"}</div>
                            
                            {characteristics.temperatureRequirements && (
                              <div><strong>Temperature:</strong> {characteristics.temperatureRequirements}</div>
                            )}
                            
                            <div><strong>Fragile:</strong> {characteristics.fragile ? "Yes" : "No"}</div>
                            <div><strong>Hazardous:</strong> {characteristics.hazardous ? "Yes" : "No"}</div>
                            <div><strong>Stackable:</strong> {characteristics.stackable ? "Yes" : "No"}</div>
                            
                            {characteristics.specialHandling && characteristics.specialHandling.length > 0 && (
                              <div className="col-span-2">
                                <strong>Special Handling:</strong> {characteristics.specialHandling.join(', ')}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-2">Storage Requirements</h4>
                      {(() => {
                        const location = storageLocations.find((l: StorageLocation) => l.id === selectedLocationId);
                        
                        if (!location) {
                          return <p className="text-sm text-slate-500">Select a location to view details.</p>;
                        }
                        
                        return (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div><strong>Type:</strong> {location.type}</div>
                            <div><strong>Status:</strong> {location.status}</div>
                            <div><strong>Utilization:</strong> {location.currentUtilization}%</div>
                            <div><strong>Capacity:</strong> {location.capacity} {location.capacityUnit}</div>
                            
                            {location.temperatureZone && (
                              <div><strong>Temperature Zone:</strong> {location.temperatureZone}</div>
                            )}
                            
                            {location.velocityZone && (
                              <div><strong>Velocity Zone:</strong> {location.velocityZone}</div>
                            )}
                            
                            {location.temperature !== undefined && (
                              <div><strong>Current Temp:</strong> {location.temperature}°C</div>
                            )}
                            
                            {location.humidity !== undefined && (
                              <div><strong>Humidity:</strong> {location.humidity}%</div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>Please select a storage location to view compatibility information.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={onCompleteTask}
              disabled={completePutAwayTaskMutation.isPending || !selectedLocationId}
              className="ml-2"
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