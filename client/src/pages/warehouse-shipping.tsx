import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  PackageIcon, 
  Search as SearchIcon, 
  Send as SendIcon, 
  Loader2, 
  RefreshCw,
  Clock,
  CheckIcon,
  PrinterIcon,
  TruckIcon,
  AlertCircleIcon,
  FileIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
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
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
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
      
      console.log(`Fetching shipments from ${url}`);
      const response = await fetch(url);
      
      console.log(`Shipments API response status: ${response.status}`);
      
      if (!response.ok) {
        // Clone the response to read it twice
        const responseClone = response.clone();
        let errorText = "";
        try {
          const errorData = await responseClone.json();
          errorText = JSON.stringify(errorData);
        } catch (e) {
          errorText = await response.text();
        }
        console.error(`Failed to fetch shipments: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch shipments: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Fetched shipments data:", data);
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
    console.log("Fetching shipping carriers...");
    try {
      const response = await fetch("/api/warehouse/shipping/carriers");
      
      console.log(`Carriers API response status: ${response.status}`);
      
      if (!response.ok) {
        // Clone the response to read it twice
        const responseClone = response.clone();
        let errorText = "";
        try {
          const errorData = await responseClone.json();
          errorText = JSON.stringify(errorData);
        } catch (e) {
          try {
            errorText = await response.text();
          } catch (textError) {
            errorText = "Could not extract error details from response";
          }
        }
        console.error(`Failed to fetch carriers: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch carriers: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched ${data.length} shipping carriers`);
      setCarriers(data);
    } catch (error: any) {
      console.error("Error fetching carriers:", error);
      toast({
        title: "Error",
        description: `Failed to load shipping carriers: ${error.message || "Unknown error"}`,
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
    console.log(`Generating manifest for shipment ${shipmentId}...`);
    setIsManifestLoading(true);
    try {
      const response = await fetch(`/api/warehouse/shipments/${shipmentId}/manifest`);
      
      console.log(`Manifest API response status: ${response.status}`);
      
      if (!response.ok) {
        // Clone the response to read it twice
        const responseClone = response.clone();
        let errorText = "";
        try {
          const errorData = await responseClone.json();
          errorText = JSON.stringify(errorData);
        } catch (e) {
          try {
            errorText = await response.text();
          } catch (textError) {
            errorText = "Could not extract error details from response";
          }
        }
        console.error(`Failed to generate manifest: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to generate manifest: ${response.status} ${response.statusText}`);
      }
      
      let data;
      try {
        data = await response.json();
        console.log("Manifest data generated:", data);
      } catch (parseError) {
        console.error("Error parsing manifest response:", parseError);
        throw new Error("Could not parse server response for manifest");
      }
      
      setManifest(data);
      toast({
        title: "Success",
        description: "Shipping manifest generated successfully.",
      });
    } catch (error: any) {
      console.error("Error generating manifest:", error);
      toast({
        title: "Error",
        description: `Failed to generate shipping manifest: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsManifestLoading(false);
    }
  };

  const updateShipment = async (id: number, data: any) => {
    console.log(`Starting to update shipment ${id} with data:`, data);
    setIsUpdating(true);
    try {
      // Create a safe copy of the data to send
      const safeData = {
        carrier: data.carrier || "",
        service: data.service || "",
        trackingNumber: data.trackingNumber || ""
      };
      
      console.log(`Sending update request for shipment ${id} with safe data:`, safeData);
      
      const response = await fetch(`/api/warehouse/shipments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(safeData),
      });
      
      console.log(`Update shipment API response status: ${response.status}`);
      
      // Clone the response so we can read it multiple times if needed
      const responseClone = response.clone();
      
      if (!response.ok) {
        let errorText = "";
        try {
          const errorData = await responseClone.json();
          errorText = JSON.stringify(errorData);
        } catch (e) {
          errorText = await response.text();
        }
        console.error(`Failed to update shipment: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to update shipment: ${response.status} ${response.statusText}`);
      }
      
      let updatedShipment;
      try {
        updatedShipment = await response.json();
        console.log("Updated shipment data:", updatedShipment);
      } catch (error) {
        console.error("Error parsing response JSON:", error);
        throw new Error("Failed to parse server response");
      }
      
      // Update the state with the new shipment data
      setShipments(shipments.map(s => s.id === id ? updatedShipment : s));
      setSelectedShipment(updatedShipment);
      
      toast({
        title: "Success",
        description: "Shipment updated successfully.",
      });
      
      return updatedShipment;
    } catch (error: any) {
      console.error("Error updating shipment:", error);
      toast({
        title: "Error",
        description: `Failed to update shipment: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmShipment = async (id: number) => {
    console.log(`Starting to confirm shipment ${id}`);
    setIsConfirming(true);
    
    try {
      console.log(`Sending confirm request for shipment ${id}`);
      
      // Create a specific try/catch block for the fetch operation
      let response;
      try {
        response = await fetch(`/api/warehouse/shipments/${id}/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        console.log(`Confirm shipment API response status: ${response.status}`);
      } catch (fetchError: any) {
        console.error("Network error during shipment confirmation:", fetchError);
        throw new Error(`Network error: ${fetchError.message || "Failed to connect to server"}`);
      }
      
      // Clone the response so we can read it multiple times if needed
      const responseClone = response.clone();
      
      if (!response.ok) {
        let errorText = "";
        try {
          const errorData = await responseClone.json();
          errorText = JSON.stringify(errorData);
        } catch (e) {
          try {
            errorText = await response.text();
          } catch (textError) {
            errorText = "Could not extract error details from response";
          }
        }
        console.error(`Failed to confirm shipment: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to confirm shipment: ${response.status} ${response.statusText}`);
      }
      
      let confirmedShipment;
      try {
        confirmedShipment = await response.json();
        console.log("Confirmed shipment data:", confirmedShipment);
      } catch (parseError) {
        console.error("Error parsing confirmed shipment response:", parseError);
        throw new Error("Could not parse server response for confirmed shipment");
      }
      
      // Only update state if we got valid shipment data
      if (confirmedShipment && confirmedShipment.id) {
        setShipments(prevShipments => prevShipments.map(s => s.id === id ? confirmedShipment : s));
        setSelectedShipment(confirmedShipment);
        
        toast({
          title: "Success",
          description: "Shipment confirmed and marked as shipped.",
        });
      } else {
        console.error("Invalid confirmed shipment data received:", confirmedShipment);
        throw new Error("Server returned invalid shipment data");
      }
      
      return confirmedShipment;
    } catch (error: any) {
      console.error("Error confirming shipment:", error);
      toast({
        title: "Error",
        description: `Failed to confirm shipment: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
      throw error; // Re-throw so calling code can handle it
    } finally {
      setIsConfirming(false);
    }
  };

  const handlePrintLabels = () => {
    console.log("Starting label printing process...");
    setIsPrinting(true);
    
    // In a real application, we would make an API call to a print service here
    try {
      // Simulate successful communication with printer service
      setTimeout(() => {
        console.log("Print job completed successfully");
        setIsPrinting(false);
        toast({
          title: "Success",
          description: "Shipping labels sent to printer.",
        });
      }, 1500);
    } catch (error: any) {
      console.error("Error sending print job:", error);
      setIsPrinting(false);
      toast({
        title: "Printing Error",
        description: `Failed to print shipping labels: ${error.message || "Unknown printing error"}`,
        variant: "destructive",
      });
    }
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
    try {
      // Safely parse the carrier ID to an integer
      const id = parseInt(carrierId);
      if (isNaN(id)) {
        console.warn(`Invalid carrier ID format: ${carrierId}`);
        return [];
      }
      
      const carrier = carriers.find(c => c.id === id);
      if (!carrier) {
        console.warn(`Carrier not found with ID: ${id}`);
        return [];
      }
      
      console.log(`Found ${carrier.services.length} services for carrier: ${carrier.name}`);
      return carrier.services || [];
    } catch (error) {
      console.error("Error in getCarrierServices:", error);
      return [];
    }
  };

  const handleConfirmAndShip = async (shipment: WarehouseShipment) => {
    console.log("handleConfirmAndShip called with shipment:", shipment);
    console.log("Selected carrier:", selectedCarrier);
    console.log("Selected service:", selectedService);
    console.log("Tracking number:", trackingNumber);
    
    // Validate required inputs
    if (!selectedCarrier || !selectedCarrier.trim()) {
      console.log("Missing carrier information");
      toast({
        title: "Missing information",
        description: "Please select a shipping carrier.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedService || !selectedService.trim()) {
      console.log("Missing service information");
      toast({
        title: "Missing information",
        description: "Please select a shipping service.",
        variant: "destructive"
      });
      return;
    }
    
    if (!trackingNumber || !trackingNumber.trim()) {
      console.log("Missing tracking number");
      toast({
        title: "Missing information",
        description: "Please enter a tracking number.",
        variant: "destructive"
      });
      return;
    }
    
    // Get the full carrier name and service name for display and debugging
    const carrierObject = carriers.find(c => c.id.toString() === selectedCarrier);
    if (!carrierObject) {
      console.error(`Carrier not found with ID: ${selectedCarrier}`);
      toast({
        title: "Error",
        description: "Selected carrier was not found. Please try selecting again.",
        variant: "destructive"
      });
      return;
    }
    
    const carrierName = carrierObject.name;
    
    const services = getCarrierServices(selectedCarrier);
    const serviceObject = services.find(s => s.id.toString() === selectedService);
    if (!serviceObject) {
      console.error(`Service not found with ID: ${selectedService} for carrier: ${selectedCarrier}`);
      toast({
        title: "Error",
        description: "Selected shipping service was not found. Please try selecting again.",
        variant: "destructive"
      });
      return;
    }
    
    const serviceName = serviceObject.name;
    
    console.log(`Updating shipment ${shipment.id} with carrier: ${carrierName}, service: ${serviceName}`);
    
    try {
      // First update the shipment details
      const updatedShipment = await updateShipment(shipment.id, {
        carrier: carrierName,
        service: serviceName,
        trackingNumber: trackingNumber
      });
      
      console.log("Shipment updated successfully:", updatedShipment);
      console.log(`Now confirming shipment ${shipment.id}`);
      
      // Then confirm the shipment
      const confirmedShipment = await confirmShipment(shipment.id);
      
      console.log("Shipment confirmed successfully:", confirmedShipment);
      toast({
        title: "Shipment Confirmed",
        description: "The shipment has been confirmed and marked as shipped."
      });
      
      // Refresh the shipments list after confirmation
      fetchShipments();
      
    } catch (error: any) {
      console.error("Error processing shipment:", error);
      toast({
        title: "Error",
        description: `Failed to process shipment: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
    }
  };

  // This section was removed because it was a duplicate declaration

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold">Warehouse Shipping</h1>
            <p className="text-muted-foreground">Manage outgoing packages and prepare shipments</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search by tracking #, order ID..."
                className="pl-8 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
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
              className="w-full sm:w-auto"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Shipping-specific metrics cards - distinct from dashboard */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Card className="w-full sm:w-auto flex-1 border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-800">Shipping Hub</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Shipments</p>
                  <p className="text-2xl font-bold">{shipments.filter(s => s.status === "pending").length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-md">
                  <PackageIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full sm:w-auto flex-1 border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-800">Outbound Metrics</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shipped Today</p>
                  <p className="text-2xl font-bold">{shipments.filter(s => s.status === "shipped" && s.shippingDate && new Date(s.shippingDate).toDateString() === new Date().toDateString()).length}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-md">
                  <TruckIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full sm:w-auto flex-1 border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-purple-800">Carrier Performance</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Carriers</p>
                  <p className="text-2xl font-bold">{carriers.filter(c => c.status === "active").length}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-md">
                  <SendIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full sm:w-auto flex-1 border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-amber-800">Shipment Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processing Time</p>
                  <p className="text-2xl font-bold">14 min</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-md">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="outgoing">
        <TabsList className="mb-4">
          <TabsTrigger value="outgoing">Outgoing Shipments</TabsTrigger>
          <TabsTrigger value="incoming">Incoming Shipments</TabsTrigger>
          <TabsTrigger value="completed">Completed Shipments</TabsTrigger>
        </TabsList>

        <TabsContent value="outgoing">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Outgoing Shipments</CardTitle>
                <CardDescription>
                  Manage and process shipments that need to be confirmed and dispatched to customers.
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="ml-auto">
                    <PackageIcon className="h-4 w-4 mr-2" />
                    Create Shipment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Shipment</DialogTitle>
                    <DialogDescription>
                      Create a new outgoing shipment for a completed order
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="orderNumber" className="text-right">
                        Order ID
                      </Label>
                      <Input
                        id="orderNumber"
                        defaultValue=""
                        placeholder="Enter order number"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="carrier" className="text-right">
                        Carrier
                      </Label>
                      <Select defaultValue="">
                        <SelectTrigger id="carrier" className="col-span-3">
                          <SelectValue placeholder="Select shipping carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          {carriers.map((carrier) => (
                            <SelectItem key={carrier.id} value={carrier.id.toString()}>
                              {carrier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="recipient" className="text-right">
                        Recipient
                      </Label>
                      <Input
                        id="recipient"
                        defaultValue=""
                        placeholder="Recipient name"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      toast({
                        title: "Feature Coming Soon",
                        description: "The shipment creation feature will be available in the next update."
                      });
                    }}>
                      Create Shipment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                                        
                                        <div className="flex flex-col space-y-4 pt-4">
                                          <Button
                                            variant="default"
                                            onClick={() => handleConfirmAndShip(selectedShipment)}
                                            disabled={isUpdating || isConfirming || !selectedCarrier || !selectedService || !trackingNumber}
                                            className="w-full"
                                          >
                                            {isUpdating || isConfirming ? (
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                              <SendIcon className="h-4 w-4 mr-2" />
                                            )}
                                            Confirm & Ship
                                          </Button>
                                          
                                          <div className="flex space-x-2">
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
                                                  onClick={() => selectedShipment && generateManifest(selectedShipment.id)}
                                                  disabled={!selectedShipment}
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
                                                    {selectedShipment 
                                                      ? `Shipping manifest details for order #${selectedShipment.customerOrderId}` 
                                                      : 'Shipping manifest details'}
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

        <TabsContent value="incoming">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Shipments</CardTitle>
              <CardDescription>
                Manage and track shipments arriving from suppliers or returns from customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expected Arrival</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          <span className="mt-2 block text-sm text-gray-500">Loading incoming shipments...</span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <TruckIcon className="h-10 w-10 text-gray-400 mb-2" />
                            <h3 className="text-lg font-medium">No incoming shipments</h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                              There are currently no incoming shipments to display.
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4"
                              onClick={() => {
                                toast({
                                  title: "Feature Coming Soon",
                                  description: "The ability to register incoming shipments will be available in a future update."
                                });
                              }}
                            >
                              Register New Arrival
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
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
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  handleShipmentSelect(shipment);
                                  toast({
                                    title: "View Shipment Details",
                                    description: "Shipment details view is coming soon."
                                  });
                                }}
                              >
                                View
                              </Button>
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