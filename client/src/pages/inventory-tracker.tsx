import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart2, 
  BarcodeIcon, 
  FilePlus, 
  FileUp,
  MoreHorizontal, 
  Package, 
  Plus, 
  Smartphone, 
  Eye, 
  Pencil, 
  Trash, 
  Check,
  X,
  ShoppingCart,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function InventoryTracker() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("inventory");
  const [showAddItem, setShowAddItem] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSupplier, setProductSupplier] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [productExpiry, setProductExpiry] = useState("");
  const [productUnit, setProductUnit] = useState("item");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sample inventory data
  const [inventory, setInventory] = useState([
    { 
      id: 1, 
      name: 'Organic Tomatoes', 
      category: 'Produce', 
      supplier: 'Johnson Family Farm', 
      price: 4.99, 
      quantity: 25, 
      unit: 'kg', 
      barcode: '7891234567890', 
      lowStock: false,
      expiry: '2025-03-25'
    },
    { 
      id: 2, 
      name: 'Fresh Apples', 
      category: 'Produce', 
      supplier: 'Hawkesbury Fresh', 
      price: 3.50, 
      quantity: 42, 
      unit: 'kg', 
      barcode: '7891234567891', 
      lowStock: false,
      expiry: '2025-03-28'
    },
    { 
      id: 3, 
      name: 'Organic Milk', 
      category: 'Dairy', 
      supplier: 'Western Dairy', 
      price: 5.25, 
      quantity: 8, 
      unit: 'L', 
      barcode: '7891234567892', 
      lowStock: true,
      expiry: '2025-03-22'
    },
    { 
      id: 4, 
      name: 'Local Honey', 
      category: 'Pantry', 
      supplier: 'Blue Mountains Honey', 
      price: 8.75, 
      quantity: 15, 
      unit: 'jar', 
      barcode: '7891234567893', 
      lowStock: false,
      expiry: '2025-06-30'
    },
    { 
      id: 5, 
      name: 'Fresh Lettuce', 
      category: 'Produce', 
      supplier: 'Sydney Greens', 
      price: 2.99, 
      quantity: 5, 
      unit: 'each', 
      barcode: '7891234567894', 
      lowStock: true,
      expiry: '2025-03-21'
    },
  ]);
  
  // Categories for filtering
  const categories = ['Produce', 'Dairy', 'Pantry', 'Bakery', 'Meat', 'Frozen', 'Beverages'];
  
  // Sample suppliers
  const suppliers = ['Johnson Family Farm', 'Hawkesbury Fresh', 'Western Dairy', 'Blue Mountains Honey', 'Sydney Greens', 'Local Bakery'];
  
  // Sample units
  const units = ['item', 'kg', 'g', 'L', 'mL', 'jar', 'box', 'pack', 'each'];
  
  // Sample orders
  const orders = [
    { id: 1, date: '2025-03-18', supplier: 'Johnson Family Farm', items: ['Organic Tomatoes (10kg)', 'Cucumbers (5kg)'], status: 'Scheduled', total: '$89.50' },
    { id: 2, date: '2025-03-15', supplier: 'Western Dairy', items: ['Organic Milk (20L)', 'Cheese (5kg)'], status: 'Received', total: '$135.25' },
    { id: 3, date: '2025-03-12', supplier: 'Sydney Greens', items: ['Fresh Lettuce (15)', 'Spinach (5kg)'], status: 'Received', total: '$64.75' },
  ];
  
  // Low stock alerts
  const lowStockItems = inventory.filter(item => item.lowStock);
  
  // Filter inventory by category and search term
  const filteredInventory = inventory.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !productCategory || !productPrice || !productQuantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newItem = {
      id: inventory.length + 1,
      name: productName,
      category: productCategory,
      supplier: productSupplier,
      price: parseFloat(productPrice),
      quantity: parseInt(productQuantity),
      unit: productUnit,
      barcode: productBarcode || `7891234567${(inventory.length + 1).toString().padStart(3, '0')}`,
      lowStock: parseInt(productQuantity) < 10,
      expiry: productExpiry || '2025-04-30',
    };
    
    setInventory([...inventory, newItem]);
    
    toast({
      title: "Item Added",
      description: `${productName} has been added to your inventory.`,
    });
    
    // Reset form
    setProductName("");
    setProductCategory("");
    setProductSupplier("");
    setProductPrice("");
    setProductQuantity("");
    setProductBarcode("");
    setProductExpiry("");
    setProductUnit("item");
    setShowAddItem(false);
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setCsvFile(files[0]);
      
      // In a real app, we would process the CSV file here
      // For demo purposes, we'll just show a success toast
      toast({
        title: "File Uploaded",
        description: `${files[0].name} has been uploaded and processed. 8 items added to inventory.`,
      });
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const toggleCamera = () => {
    setCameraActive(!cameraActive);
    
    if (!cameraActive) {
      // In a real app, we would activate the camera here
      // For demo purposes, we'll just simulate a barcode scan after a delay
      setTimeout(() => {
        setProductBarcode('7891234567999');
        setCameraActive(false);
        
        toast({
          title: "Barcode Scanned",
          description: "Barcode 7891234567999 detected. Product information loaded.",
        });
      }, 2000);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Inventory Tracker</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your inventory with or without a POS system</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <Button variant="outline" onClick={() => setShowScanner(true)} className="flex-1 md:flex-none">
            <BarcodeIcon className="h-4 w-4 mr-2" />
            <span className="md:inline">Scan</span>
          </Button>
          <Button onClick={() => setShowAddItem(true)} className="flex-1 md:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            <span className="md:inline">Add Item</span>
          </Button>
        </div>
      </div>
      
      {/* Add Item Dialog */}
      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent className="sm:max-w-[600px] p-4 sm:p-6 h-[90vh] sm:h-auto overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Inventory Item</DialogTitle>
            <DialogDescription className="text-sm">
              Fill in the details for the new product. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-2 sm:py-4">
              {/* Mobile layout - stacked */}
              <div className="block sm:hidden space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-mobile" className="font-medium">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name-mobile"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-mobile" className="font-medium">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={productCategory}
                    onValueChange={setProductCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-mobile" className="font-medium">
                    Supplier <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={productSupplier}
                    onValueChange={setProductSupplier}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-mobile" className="font-medium">
                    Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price-mobile"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity-mobile" className="font-medium">
                    Quantity <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      id="quantity-mobile"
                      type="number"
                      min="0"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e.target.value)}
                      className="col-span-2"
                      placeholder="0"
                      required
                    />
                    <Select
                      value={productUnit}
                      onValueChange={setProductUnit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode-mobile" className="font-medium">
                    Barcode
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="barcode-mobile"
                      value={productBarcode}
                      onChange={(e) => setProductBarcode(e.target.value)}
                      placeholder="Scan or enter barcode"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={toggleCamera}
                      className="shrink-0"
                    >
                      <BarcodeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry-mobile" className="font-medium">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiry-mobile"
                    type="date"
                    value={productExpiry}
                    onChange={(e) => setProductExpiry(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Desktop layout - grid */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="col-span-3"
                    placeholder="Product name"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor="category" className="text-right">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={productCategory}
                    onValueChange={setProductCategory}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor="supplier" className="text-right">
                    Supplier <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={productSupplier}
                    onValueChange={setProductSupplier}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor="price" className="text-right">
                    Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="col-span-3"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity <span className="text-destructive">*</span>
                  </Label>
                  <div className="col-span-3 grid grid-cols-4 gap-2">
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e.target.value)}
                      className="col-span-3"
                      placeholder="0"
                      required
                    />
                    <Select
                      value={productUnit}
                      onValueChange={setProductUnit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor="barcode" className="text-right">
                    Barcode
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="barcode"
                      value={productBarcode}
                      onChange={(e) => setProductBarcode(e.target.value)}
                      placeholder="Scan or enter barcode"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={toggleCamera}
                      className="shrink-0"
                    >
                      <BarcodeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor="expiry" className="text-right">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={productExpiry}
                    onChange={(e) => setProductExpiry(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4 sm:mt-0">
              <Button type="button" variant="outline" onClick={() => setShowAddItem(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Scanner Dialog */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Scan Inventory Items</DialogTitle>
            <DialogDescription>
              Choose a scanning method to quickly add or update inventory items.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Card className="hover:bg-muted cursor-pointer transition-colors">
              <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                <BarcodeIcon className="h-12 w-12 text-primary mb-2" />
                <h3 className="font-medium">Use Device Camera</h3>
                <p className="text-sm text-muted-foreground">
                  Use your computer's webcam to scan barcodes directly
                </p>
                <Button variant="outline" className="mt-2" onClick={toggleCamera}>
                  {cameraActive ? "Cancel Scan" : "Start Scanning"}
                </Button>
                {cameraActive && (
                  <div className="mt-4 border rounded-md p-2 w-full aspect-video bg-muted relative flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p>Camera active... scanning for barcodes</p>
                      <p className="text-sm mt-2">Position barcode within the frame</p>
                    </div>
                    <div className="absolute inset-0 border-2 border-dashed border-primary/50 m-6 rounded-md"></div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="hover:bg-muted cursor-pointer transition-colors">
              <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                <Smartphone className="h-12 w-12 text-primary mb-2" />
                <h3 className="font-medium">Use Mobile App</h3>
                <p className="text-sm text-muted-foreground">
                  Scan with our mobile app and sync automatically
                </p>
                <Button variant="outline" className="mt-2">
                  Connect Phone
                </Button>
                <div className="mt-4 border rounded-md p-4 w-full aspect-square flex flex-col items-center justify-center">
                  <div className="bg-black p-3 rounded-md mb-2">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <path d="M10,10 L30,10 L30,30 L10,30 Z" fill="white" />
                      <path d="M70,10 L90,10 L90,30 L70,30 Z" fill="white" />
                      <path d="M10,70 L30,70 L30,90 L10,90 Z" fill="white" />
                      <path d="M40,40 L60,40 L60,60 L40,60 Z" fill="white" />
                      <path d="M70,70 L90,70 L90,90 L70,90 Z" fill="white" />
                      <path d="M40,10 L60,10 L60,30 L40,30 Z" fill="white" />
                      <path d="M10,40 L30,40 L30,60 L10,60 Z" fill="white" />
                      <path d="M70,40 L90,40 L90,60 L70,60 Z" fill="white" />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground">Scan this QR code with your phone</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="my-2">
            <Separator />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover:bg-muted cursor-pointer transition-colors">
              <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                <FileUp className="h-12 w-12 text-primary mb-2" />
                <h3 className="font-medium">Bulk Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Import inventory data from CSV or Excel file
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".csv,.xlsx,.xls" 
                  style={{ display: 'none' }} 
                  onChange={handleCsvUpload}
                />
                <Button variant="outline" className="mt-2" onClick={handleUploadClick}>
                  Upload File
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:bg-muted cursor-pointer transition-colors">
              <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                <FilePlus className="h-12 w-12 text-primary mb-2" />
                <h3 className="font-medium">Manual Entry</h3>
                <p className="text-sm text-muted-foreground">
                  Add items manually with detailed information
                </p>
                <Button variant="outline" className="mt-2" onClick={() => {
                  setShowScanner(false);
                  setShowAddItem(true);
                }}>
                  Add Manually
                </Button>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScanner(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Tabs defaultValue={activeTab} className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="inventory" className="text-xs md:text-sm">Inventory</TabsTrigger>
          <TabsTrigger value="orders" className="text-xs md:text-sm">
            <span className="hidden md:inline">Orders & Restocking</span>
            <span className="inline md:hidden">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs md:text-sm">
            <span className="hidden md:inline">Low Stock Alerts</span>
            <span className="inline md:hidden">Alerts</span>
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {lowStockItems.length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor="category-filter" className="whitespace-nowrap text-sm">Filter:</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-[180px] text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex w-full items-center space-x-2">
              <Input 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSearchTerm('')}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <Card>
            {/* Mobile Card View */}
            <div className="md:hidden">
              <CardContent className="p-4">
                {filteredInventory.length > 0 ? (
                  <div className="space-y-4">
                    {filteredInventory.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">Barcode: {item.barcode || 'N/A'}</div>
                          </div>
                          <Badge className={item.lowStock ? 'bg-red-100 text-red-800 border-red-300' : 'bg-green-100 text-green-800 border-green-300'}>
                            {item.lowStock ? 'Low Stock' : 'In Stock'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">Category</div>
                            <div>{item.category}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Supplier</div>
                            <div>{item.supplier}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Price</div>
                            <div>${item.price.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Quantity</div>
                            <div className={item.lowStock ? 'text-destructive font-medium' : ''}>
                              {item.quantity} {item.unit}
                              {item.lowStock && <AlertCircle className="h-3 w-3 text-destructive ml-1 inline" />}
                            </div>
                          </div>
                          {item.expiry && (
                            <div>
                              <div className="text-muted-foreground">Expiry</div>
                              <div>{item.expiry}</div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-2 border-t">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Package className="h-10 w-10 mb-2 text-muted-foreground" />
                    <p>No items found</p>
                    <p className="text-sm text-muted-foreground">Try a different search or filter</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="py-4 px-4 border-t flex flex-col sm:flex-row gap-3 justify-between">
                <div className="text-sm text-muted-foreground w-full text-center sm:text-left">
                  Showing {filteredInventory.length} of {inventory.length} items
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                  <Button variant="outline" size="sm" onClick={handleUploadClick} className="flex-1 sm:flex-none">
                    <FileUp className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                    Export
                  </Button>
                </div>
              </CardFooter>
            </div>
            
            {/* Desktop Table View */}
            <CardContent className="p-0 hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.barcode}</div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <span className={`${item.lowStock ? 'text-destructive' : ''}`}>
                              {item.quantity} {item.unit}
                            </span>
                            {item.lowStock && (
                              <AlertCircle className="h-4 w-4 text-destructive ml-1" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.expiry}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Package className="h-10 w-10 mb-2" />
                          <p>No items found</p>
                          <p className="text-sm">Try a different search or filter</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="py-4 px-6 border-t hidden md:flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredInventory.length} of {inventory.length} items
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleUploadClick}>
                  <FileUp className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Orders from your local suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{order.supplier}</h4>
                          <div className="text-sm text-muted-foreground">Order #{order.id} - {order.date}</div>
                        </div>
                        <Badge className={order.status === 'Received' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-blue-100 text-blue-800 border-blue-300'}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 mb-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">{item}</div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{order.total}</div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline">View All Orders</Button>
                <Button>New Order</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Auto-Restock Setup</CardTitle>
                <CardDescription>Configure automated ordering when items get low</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="grid gap-0.5">
                        <Label htmlFor="auto-order-status">Auto-ordering status</Label>
                        <p className="text-sm text-muted-foreground">Automatically place orders when stock is low</p>
                      </div>
                      <div className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">Enabled</div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Trigger thresholds</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-lg border p-2">
                          <div className="text-sm text-muted-foreground">Produce</div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">8 kg</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-lg border p-2">
                          <div className="text-sm text-muted-foreground">Dairy</div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">10 L</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-lg border p-2">
                          <div className="text-sm text-muted-foreground">Other</div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">15 units</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Preferred suppliers</Label>
                      <div className="space-y-2">
                        {suppliers.slice(0, 3).map((supplier, index) => (
                          <div key={index} className="flex items-center justify-between rounded-lg border p-2">
                            <span>{supplier}</span>
                            <div className="text-sm text-muted-foreground">Primary for {categories[index]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Order approval</Label>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center mb-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
                          <span className="font-medium">Orders under $100 auto-approved</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-amber-500 mr-2" />
                          <span className="font-medium">Orders over $100 require manual approval</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  Configure Auto-Restock Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Items that need to be restocked soon</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <div className="space-y-4">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-amber-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <h4 className="font-medium">{item.name}</h4>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Supplier: {item.supplier}</div>
                        </div>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                          Low Stock
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Current Stock</div>
                          <div className="font-medium">{item.quantity} {item.unit}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Expiry Date</div>
                          <div className="font-medium">{item.expiry}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Recommended Order</div>
                          <div className="font-medium">25 {item.unit}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Item
                        </Button>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="bg-green-100 text-green-800 p-3 rounded-full mb-3">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">All items well stocked</h3>
                  <p className="text-muted-foreground">
                    You have no low stock alerts at the moment
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  System will alert you when stock falls below your set thresholds
                </div>
                <Button variant="outline">
                  Configure Alerts
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expiry Monitoring</CardTitle>
              <CardDescription>Items approaching expiration date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <h4 className="font-medium">Fresh Lettuce</h4>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Supplier: Sydney Greens</div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    Expiring Soon
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">Expiry Date</div>
                  <div className="font-medium">2025-03-21 (2 days from now)</div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">Recommendation</div>
                  <div className="font-medium">Consider discount promotion for quick sale</div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Mark as Addressed
                  </Button>
                  <Button size="sm">
                    Create Promotion
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}