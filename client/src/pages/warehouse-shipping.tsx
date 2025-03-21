import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { CheckIcon, Loader2, PackageIcon, PrinterIcon, SearchIcon, TruckIcon, AlertCircleIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { getCurrentUser } from "@/utils/auth";

interface WarehouseShipment {
  id: number;
  customerOrderId: number;
  status: "pending" | "partially_shipped" | "shipped" | "delivered" | "cancelled";
  carrier: string;
  service: string;
  trackingNumber?: string;
  shippingCost?: number;
  shippingDate?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  packages: ShipmentPackage[];
  shippingAddress: ShippingAddress;
  notes?: string;
}

interface ShipmentPackage {
  id: number;
  packingTaskId: number;
  packageType: string;
  length: number;
  width: number;
  height: number;
  dimensionUnit: string;
  weight: number;
  weightUnit: string;
  trackingNumber?: string;
  carrier?: string;
  service?: string;
  status: "packed" | "labeled" | "shipped";
  createdAt: string;
  shippedAt?: string;
  notes?: string;
}

interface ShippingAddress {
  id: number;
  shipmentId: number;
  recipientName: string;
  company?: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  email?: string;
}

interface ShippingCarrier {
  id: number;
  name: string;
  code: string;
  accountNumber?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: "active" | "inactive";
  trackingUrlTemplate?: string;
  services: ShippingService[];
  notes?: string;
}

interface ShippingService {
  id: number;
  carrierId: number;
  name: string;
  code: string;
  description?: string;
  estimatedTransitDays: number;
  domesticInternational: "domestic" | "international" | "both";
  costMultiplier: number;
  baseRate: number;
  currencyCode: string;
  status: "active" | "inactive";
  restrictions?: {
    maxWeight?: number;
    weightUnit?: string;
    maxDimensions?: {
      length: number;
      width: number;
      height: number;
      dimensionUnit: string;
    };
  };
}

interface ShippingManifest {
  id: number;
  shipmentId: number;
  generatedAt: string;
  carriers: string[];
  packageCount: number;
  totalWeight: number;
  weightUnit: string;
  manifestItems: ManifestItem[];
}

interface ManifestItem {
  packageId: number;
  trackingNumber: string;
  carrier: string;
  service: string;
  recipient: string;
  destination: string;
  weight: number;
  dimensions: string;
}

export default function WarehouseShipping() {
  const [shipments, setShipments] = useState<WarehouseShipment[]>([]);
  const [carriers, setCarriers] = useState<ShippingCarrier[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<WarehouseShipment | null>(null);
  const [manifest, setManifest] = useState<ShippingManifest | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isManifestLoading, setIsManifestLoading] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const { toast } = useToast();
  const user = getCurrentUser();

  useEffect(() => {
    fetchShipments();
    fetchCarriers();
  }, [filterStatus]);

  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      const url = filterStatus === "all" 
        ? "/api/warehouse/shipments" 
        : `/api/warehouse/shipments?status=${filterStatus}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch shipments");
      }
      
      const data = await response.json();
      setShipments(data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast({
        title: "Error",
        description: "Failed to load shipments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarriers = async () => {
    try {
      const response = await fetch("/api/warehouse/shipping/carriers");
      
      if (!response.ok) {
        throw new Error("Failed to fetch carriers");
      }
      
      const data = await response.json();
      setCarriers(data);
    } catch (error) {
      console.error("Error fetching carriers:", error);
      toast({
        title: "Error",
        description: "Failed to load shipping carriers. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShipmentSelect = (shipment: WarehouseShipment) => {
    setSelectedShipment(shipment);
    setSelectedCarrier(shipment.carrier || "");
    setSelectedService(shipment.service || "");
    setTrackingNumber(shipment.trackingNumber || "");
  };

  const generateManifest = async (shipmentId: number) => {
    setIsManifestLoading(true);
    try {
      const response = await fetch(`/api/warehouse/shipments/${shipmentId}/manifest`);
      
      if (!response.ok) {
        throw new Error("Failed to generate manifest");
      }
      
      const data = await response.json();
      setManifest(data);
    } catch (error) {
      console.error("Error generating manifest:", error);
      toast({
        title: "Error",
        description: "Failed to generate shipping manifest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsManifestLoading(false);
    }
  };

  const updateShipment = async (id: number, data: any) => {
    try {
      const response = await fetch(`/api/warehouse/shipments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update shipment");
      }
      
      const updatedShipment = await response.json();
      setShipments(shipments.map(s => s.id === id ? updatedShipment : s));
      setSelectedShipment(updatedShipment);
      
      toast({
        title: "Success",
        description: "Shipment updated successfully.",
      });
    } catch (error) {
      console.error("Error updating shipment:", error);
      toast({
        title: "Error",
        description: "Failed to update shipment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmShipment = async (id: number) => {
    setIsConfirming(true);
    try {
      const response = await fetch(`/api/warehouse/shipments/${id}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to confirm shipment");
      }
      
      const confirmedShipment = await response.json();
      setShipments(shipments.map(s => s.id === id ? confirmedShipment : s));
      setSelectedShipment(confirmedShipment);
      
      toast({
        title: "Success",
        description: "Shipment confirmed and marked as shipped.",
      });
    } catch (error) {
      console.error("Error confirming shipment:", error);
      toast({
        title: "Error",
        description: "Failed to confirm shipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handlePrintLabels = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      toast({
        title: "Success",
        description: "Shipping labels sent to printer.",
      });
    }, 1500);
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = searchQuery === "" || 
      shipment.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${shipment.customerOrderId}`.includes(searchQuery) ||
      shipment.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.shippingAddress.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending": return "outline";
      case "partially_shipped": return "secondary";
      case "shipped": return "default";
      case "delivered": return "default";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const getCarrierServices = (carrierId: string) => {
    const carrier = carriers.find(c => c.id === parseInt(carrierId));
    return carrier?.services || [];
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Warehouse Shipping</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search shipments..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shipments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partially_shipped">Partially Shipped</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={fetchShipments}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Refresh"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="completed">Completed Shipments</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Pending and In-Progress Shipments</CardTitle>
              <CardDescription>
                Manage and process shipments that need to be confirmed and dispatched.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Packages</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          <span className="mt-2 block text-sm text-gray-500">Loading shipments...</span>
                        </TableCell>
                      </TableRow>
                    ) : filteredShipments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <PackageIcon className="h-10 w-10 text-gray-400 mb-2" />
                            <h3 className="text-lg font-medium">No shipments found</h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                              There are no shipments matching your current filters.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredShipments
                        .filter(s => ["pending", "partially_shipped"].includes(s.status))
                        .map((shipment) => (
                          <TableRow key={shipment.id}>
                            <TableCell className="font-medium">{shipment.customerOrderId}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(shipment.status)}>
                                {shipment.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>{shipment.shippingAddress.recipientName}</TableCell>
                            <TableCell>{shipment.carrier}</TableCell>
                            <TableCell>{shipment.trackingNumber || "-"}</TableCell>
                            <TableCell>{shipment.packages.length}</TableCell>
                            <TableCell>
                              {shipment.shippingDate 
                                ? format(new Date(shipment.shippingDate), "MMM d, yyyy") 
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleShipmentSelect(shipment)}
                                  >
                                    Manage
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="sm:max-w-md">
                                  <SheetHeader>
                                    <SheetTitle>Manage Shipment #{selectedShipment?.id}</SheetTitle>
                                  </SheetHeader>
                                  {selectedShipment && (
                                    <div className="py-4">
                                      <div className="space-y-4">
                                        <div className="flex justify-between">
                                          <h3 className="text-sm font-medium">Order #{selectedShipment.customerOrderId}</h3>
                                          <Badge variant={getStatusBadgeVariant(selectedShipment.status)}>
                                            {selectedShipment.status.replace("_", " ")}
                                          </Badge>
                                        </div>
                                        
                                        <div className="bg-gray-50 p-3 rounded-md">
                                          <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
                                          <p className="text-sm">
                                            {selectedShipment.shippingAddress.recipientName}<br />
                                            {selectedShipment.shippingAddress.company && 
                                              <>{selectedShipment.shippingAddress.company}<br /></>
                                            }
                                            {selectedShipment.shippingAddress.streetAddress1}<br />
                                            {selectedShipment.shippingAddress.streetAddress2 && 
                                              <>{selectedShipment.shippingAddress.streetAddress2}<br /></>
                                            }
                                            {selectedShipment.shippingAddress.city}, {selectedShipment.shippingAddress.state} {selectedShipment.shippingAddress.postalCode}<br />
                                            {selectedShipment.shippingAddress.country}
                                          </p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="carrier">Shipping Carrier</Label>
                                          <Select
                                            value={selectedCarrier}
                                            onValueChange={(value) => {
                                              setSelectedCarrier(value);
                                              setSelectedService("");
                                            }}
                                          >
                                            <SelectTrigger id="carrier">
                                              <SelectValue placeholder="Select carrier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {carriers.map((carrier) => (
                                                <SelectItem 
                                                  key={carrier.id} 
                                                  value={carrier.id.toString()}
                                                >
                                                  {carrier.name}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        
                                        {selectedCarrier && (
                                          <div className="space-y-2">
                                            <Label htmlFor="service">Shipping Service</Label>
                                            <Select
                                              value={selectedService}
                                              onValueChange={setSelectedService}
                                            >
                                              <SelectTrigger id="service">
                                                <SelectValue placeholder="Select service" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {getCarrierServices(selectedCarrier).map((service) => (
                                                  <SelectItem 
                                                    key={service.id} 
                                                    value={service.id.toString()}
                                                  >
                                                    {service.name} ({service.estimatedTransitDays} days)
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        )}
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="tracking">Tracking Number</Label>
                                          <Input 
                                            id="tracking" 
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            placeholder="Enter tracking number" 
                                          />
                                        </div>
                                        
                                        <h4 className="text-sm font-medium pt-2">Packages ({selectedShipment.packages.length})</h4>
                                        <div className="border rounded-md divide-y">
                                          {selectedShipment.packages.map((pkg) => (
                                            <div key={pkg.id} className="p-3">
                                              <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium">Package #{pkg.id}</span>
                                                <Badge variant={pkg.status === "shipped" ? "default" : "outline"}>
                                                  {pkg.status}
                                                </Badge>
                                              </div>
                                              <div className="text-sm grid grid-cols-2 gap-1">
                                                <span className="text-gray-500">Type:</span>
                                                <span>{pkg.packageType}</span>
                                                <span className="text-gray-500">Dimensions:</span>
                                                <span>{pkg.length}x{pkg.width}x{pkg.height} {pkg.dimensionUnit}</span>
                                                <span className="text-gray-500">Weight:</span>
                                                <span>{pkg.weight} {pkg.weightUnit}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        
                                        <div className="flex space-x-2 pt-4">
                                          <Button
                                            variant="outline"
                                            onClick={handlePrintLabels}
                                            disabled={isPrinting}
                                            className="flex-1"
                                          >
                                            {isPrinting ? (
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                              <PrinterIcon className="h-4 w-4 mr-2" />
                                            )}
                                            Print Labels
                                          </Button>
                                          
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => generateManifest(selectedShipment.id)}
                                              >
                                                {isManifestLoading ? (
                                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                  <FileIcon className="h-4 w-4 mr-2" />
                                                )}
                                                Manifest
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md">
                                              <DialogHeader>
                                                <DialogTitle>Shipping Manifest</DialogTitle>
                                                <DialogDescription>
                                                  Shipping manifest details for order #{selectedShipment.customerOrderId}
                                                </DialogDescription>
                                              </DialogHeader>
                                              {manifest ? (
                                                <div className="space-y-4">
                                                  <div className="flex justify-between">
                                                    <div>
                                                      <p className="text-sm font-medium">Manifest #{manifest.id}</p>
                                                      <p className="text-sm text-gray-500">
                                                        Generated: {format(new Date(manifest.generatedAt), "MMM d, yyyy h:mm a")}
                                                      </p>
                                                    </div>
                                                    <div className="text-right">
                                                      <p className="text-sm font-medium">{manifest.packageCount} Packages</p>
                                                      <p className="text-sm text-gray-500">
                                                        Total Weight: {manifest.totalWeight} {manifest.weightUnit}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  
                                                  <Separator />
                                                  
                                                  <div className="space-y-2">
                                                    <h4 className="text-sm font-medium">Carriers</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                      {manifest.carriers.map((carrier, index) => (
                                                        <Badge key={index} variant="outline">{carrier}</Badge>
                                                      ))}
                                                    </div>
                                                  </div>
                                                  
                                                  <div className="space-y-2">
                                                    <h4 className="text-sm font-medium">Packages</h4>
                                                    <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                                                      {manifest.manifestItems.map((item, index) => (
                                                        <div key={index} className="p-3 text-sm">
                                                          <div className="flex justify-between mb-1">
                                                            <span className="font-medium">
                                                              Package #{item.packageId}
                                                            </span>
                                                            <span className="text-gray-500">
                                                              {item.weight} {manifest.weightUnit}
                                                            </span>
                                                          </div>
                                                          <div className="grid grid-cols-2 gap-1">
                                                            <span className="text-gray-500">Tracking:</span>
                                                            <span>{item.trackingNumber}</span>
                                                            <span className="text-gray-500">Carrier:</span>
                                                            <span>{item.carrier} - {item.service}</span>
                                                            <span className="text-gray-500">Recipient:</span>
                                                            <span>{item.recipient}</span>
                                                            <span className="text-gray-500">Destination:</span>
                                                            <span>{item.destination}</span>
                                                            <span className="text-gray-500">Dimensions:</span>
                                                            <span>{item.dimensions}</span>
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                  
                                                  <DialogFooter>
                                                    <Button
                                                      variant="outline"
                                                      onClick={handlePrintLabels}
                                                      disabled={isPrinting}
                                                    >
                                                      {isPrinting ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                      ) : (
                                                        <PrinterIcon className="h-4 w-4 mr-2" />
                                                      )}
                                                      Print Manifest
                                                    </Button>
                                                  </DialogFooter>
                                                </div>
                                              ) : (
                                                <div className="flex flex-col items-center justify-center py-6">
                                                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                                  <p className="mt-2 text-sm text-gray-500">
                                                    Generating manifest...
                                                  </p>
                                                </div>
                                              )}
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                        
                                        <div className="pt-4">
                                          <Button
                                            className="w-full"
                                            disabled={
                                              isConfirming || 
                                              !selectedCarrier || 
                                              !selectedService || 
                                              selectedShipment.packages.length === 0 ||
                                              selectedShipment.status === "shipped" ||
                                              selectedShipment.status === "delivered" ||
                                              selectedShipment.status === "cancelled"
                                            }
                                            onClick={() => {
                                              updateShipment(selectedShipment.id, {
                                                carrier: carriers.find(c => c.id.toString() === selectedCarrier)?.name,
                                                service: getCarrierServices(selectedCarrier).find(s => s.id.toString() === selectedService)?.name,
                                                trackingNumber
                                              }).then(() => {
                                                if (trackingNumber) {
                                                  confirmShipment(selectedShipment.id);
                                                }
                                              });
                                            }}
                                          >
                                            {isConfirming ? (
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                              <TruckIcon className="h-4 w-4 mr-2" />
                                            )}
                                            {selectedShipment.status === "shipped" ? "Already Shipped" : "Confirm Shipment"}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </SheetContent>
                              </Sheet>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Shipments</CardTitle>
              <CardDescription>
                View and track shipments that have been shipped or delivered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Shipped Date</TableHead>
                      <TableHead>Est. Delivery</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          <span className="mt-2 block text-sm text-gray-500">Loading shipments...</span>
                        </TableCell>
                      </TableRow>
                    ) : filteredShipments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <PackageIcon className="h-10 w-10 text-gray-400 mb-2" />
                            <h3 className="text-lg font-medium">No shipments found</h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                              There are no completed shipments matching your current filters.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredShipments
                        .filter(s => ["shipped", "delivered"].includes(s.status))
                        .map((shipment) => (
                          <TableRow key={shipment.id}>
                            <TableCell className="font-medium">{shipment.customerOrderId}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(shipment.status)}>
                                {shipment.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>{shipment.shippingAddress.recipientName}</TableCell>
                            <TableCell>{shipment.carrier}</TableCell>
                            <TableCell>
                              {shipment.trackingNumber || "-"}
                            </TableCell>
                            <TableCell>
                              {shipment.shippingDate 
                                ? format(new Date(shipment.shippingDate), "MMM d, yyyy") 
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {shipment.estimatedDeliveryDate 
                                ? format(new Date(shipment.estimatedDeliveryDate), "MMM d, yyyy") 
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleShipmentSelect(shipment)}
                                  >
                                    View
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="sm:max-w-md">
                                  <SheetHeader>
                                    <SheetTitle>Shipment Details #{selectedShipment?.id}</SheetTitle>
                                  </SheetHeader>
                                  {selectedShipment && (
                                    <div className="py-4">
                                      <div className="space-y-4">
                                        <div className="flex justify-between">
                                          <h3 className="text-sm font-medium">Order #{selectedShipment.customerOrderId}</h3>
                                          <Badge variant={getStatusBadgeVariant(selectedShipment.status)}>
                                            {selectedShipment.status.replace("_", " ")}
                                          </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-y-2">
                                          <span className="text-sm text-gray-500">Carrier:</span>
                                          <span className="text-sm">{selectedShipment.carrier}</span>
                                          
                                          <span className="text-sm text-gray-500">Service:</span>
                                          <span className="text-sm">{selectedShipment.service}</span>
                                          
                                          <span className="text-sm text-gray-500">Tracking Number:</span>
                                          <span className="text-sm">{selectedShipment.trackingNumber || "N/A"}</span>
                                          
                                          <span className="text-sm text-gray-500">Shipping Date:</span>
                                          <span className="text-sm">
                                            {selectedShipment.shippingDate 
                                              ? format(new Date(selectedShipment.shippingDate), "MMM d, yyyy") 
                                              : "N/A"}
                                          </span>
                                          
                                          <span className="text-sm text-gray-500">Est. Delivery:</span>
                                          <span className="text-sm">
                                            {selectedShipment.estimatedDeliveryDate 
                                              ? format(new Date(selectedShipment.estimatedDeliveryDate), "MMM d, yyyy") 
                                              : "N/A"}
                                          </span>
                                          
                                          <span className="text-sm text-gray-500">Actual Delivery:</span>
                                          <span className="text-sm">
                                            {selectedShipment.actualDeliveryDate 
                                              ? format(new Date(selectedShipment.actualDeliveryDate), "MMM d, yyyy") 
                                              : "N/A"}
                                          </span>
                                        </div>
                                        
                                        <div className="bg-gray-50 p-3 rounded-md">
                                          <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
                                          <p className="text-sm">
                                            {selectedShipment.shippingAddress.recipientName}<br />
                                            {selectedShipment.shippingAddress.company && 
                                              <>{selectedShipment.shippingAddress.company}<br /></>
                                            }
                                            {selectedShipment.shippingAddress.streetAddress1}<br />
                                            {selectedShipment.shippingAddress.streetAddress2 && 
                                              <>{selectedShipment.shippingAddress.streetAddress2}<br /></>
                                            }
                                            {selectedShipment.shippingAddress.city}, {selectedShipment.shippingAddress.state} {selectedShipment.shippingAddress.postalCode}<br />
                                            {selectedShipment.shippingAddress.country}
                                          </p>
                                        </div>
                                        
                                        <h4 className="text-sm font-medium pt-2">Packages ({selectedShipment.packages.length})</h4>
                                        <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                                          {selectedShipment.packages.map((pkg) => (
                                            <div key={pkg.id} className="p-3">
                                              <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium">Package #{pkg.id}</span>
                                                <Badge variant={pkg.status === "shipped" ? "default" : "outline"}>
                                                  {pkg.status}
                                                </Badge>
                                              </div>
                                              <div className="text-sm grid grid-cols-2 gap-1">
                                                <span className="text-gray-500">Type:</span>
                                                <span>{pkg.packageType}</span>
                                                <span className="text-gray-500">Dimensions:</span>
                                                <span>{pkg.length}x{pkg.width}x{pkg.height} {pkg.dimensionUnit}</span>
                                                <span className="text-gray-500">Weight:</span>
                                                <span>{pkg.weight} {pkg.weightUnit}</span>
                                                {pkg.trackingNumber && (
                                                  <>
                                                    <span className="text-gray-500">Tracking:</span>
                                                    <span>{pkg.trackingNumber}</span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        
                                        <div className="flex space-x-2 pt-4">
                                          <Button
                                            variant="outline"
                                            onClick={() => generateManifest(selectedShipment.id)}
                                            className="flex-1"
                                          >
                                            <FileIcon className="h-4 w-4 mr-2" />
                                            View Manifest
                                          </Button>
                                          
                                          <Button
                                            variant="outline"
                                            onClick={handlePrintLabels}
                                            disabled={isPrinting}
                                            className="flex-1"
                                          >
                                            {isPrinting ? (
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                              <PrinterIcon className="h-4 w-4 mr-2" />
                                            )}
                                            Print Labels
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </SheetContent>
                              </Sheet>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Missing Lucide icon definitions
const FileIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
};