import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
import { Settings, Box, RefreshCcw, CheckCircle, AlertCircle, Undo2, TerminalSquare, Tag, Package, ShoppingBag, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IntegrationKit() {
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);
  const [loadingConnect, setLoadingConnect] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [selectedTab, setSelectedTab] = useState("inventory");
  
  const handleConnectSquare = () => {
    setLoadingConnect(true);
    
    // Simulate API connection
    setTimeout(() => {
      setLoadingConnect(false);
      setConnected(true);
      toast({
        title: "Connected to Square",
        description: "Your Square account has been successfully connected.",
      });
    }, 1500);
  };
  
  const handleSync = () => {
    setSyncInProgress(true);
    
    // Simulate sync process
    setTimeout(() => {
      setSyncInProgress(false);
      toast({
        title: "Sync Complete",
        description: "Your local sourcing data has been synchronized with Square.",
      });
    }, 2000);
  };
  
  const handleDisconnect = () => {
    setConnected(false);
    toast({
      title: "Disconnected from Square",
      description: "Your Square account has been disconnected.",
      variant: "destructive",
    });
  };
  
  // Sample data for integration demonstrations
  const localProduceItems = [
    { id: 1, name: 'Organic Tomatoes', supplier: 'Johnson Family Farm', squareItemId: 'SQ7123456', price: '$4.99/kg', inSync: true },
    { id: 2, name: 'Fresh Apples', supplier: 'Hawkesbury Fresh', squareItemId: 'SQ7123457', price: '$3.50/kg', inSync: true },
    { id: 3, name: 'Organic Milk', supplier: 'Western Dairy', squareItemId: 'SQ7123458', price: '$5.25/L', inSync: false },
    { id: 4, name: 'Local Honey', supplier: 'Blue Mountains Honey', squareItemId: 'SQ7123459', price: '$8.75/jar', inSync: true },
    { id: 5, name: 'Fresh Lettuce', supplier: 'Sydney Greens', squareItemId: 'SQ7123460', price: '$2.99/each', inSync: false },
  ];
  
  const recentTransactions = [
    { id: 1, date: '2025-03-18 15:30', items: ['Organic Tomatoes (2kg)', 'Fresh Apples (1.5kg)'], total: '$16.23', synced: true },
    { id: 2, date: '2025-03-18 14:15', items: ['Organic Milk (2L)', 'Local Honey (1 jar)'], total: '$19.25', synced: true },
    { id: 3, date: '2025-03-18 11:45', items: ['Fresh Lettuce (3)', 'Organic Tomatoes (1kg)'], total: '$13.96', synced: true },
  ];
  
  const scheduledDeliveries = [
    { id: 1, date: '2025-03-20', supplier: 'Johnson Family Farm', items: 'Tomatoes, Cucumbers', status: 'Scheduled' },
    { id: 2, date: '2025-03-21', supplier: 'Hawkesbury Fresh', items: 'Apples, Pears', status: 'Scheduled' },
    { id: 3, date: '2025-03-19', supplier: 'Western Dairy', items: 'Milk, Cheese', status: 'Processing' },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Square Integration</h1>
          <p className="text-muted-foreground">Connect your local sourcing with Square's POS and inventory system</p>
        </div>
        
        {connected ? (
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1 items-center">
              <CheckCircle className="h-3.5 w-3.5" />
              Connected
            </Badge>
            <Button variant="outline" size="sm" onClick={handleDisconnect}>Disconnect</Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSync}
              disabled={syncInProgress}
            >
              {syncInProgress ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={handleConnectSquare} disabled={loadingConnect}>
            {loadingConnect ? "Connecting..." : "Connect to Square"}
          </Button>
        )}
      </div>
      
      {!connected ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connect Your Square Account</CardTitle>
            <CardDescription>
              Integrate your local sourcing with Square to seamlessly manage inventory, 
              sales, and transactions for your locally sourced products.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 flex flex-col items-center text-center space-y-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Inventory Sync</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically update Square inventory when you receive deliveries from local suppliers
                </p>
              </div>
              
              <div className="border rounded-lg p-4 flex flex-col items-center text-center space-y-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Seamless Sales</h3>
                <p className="text-sm text-muted-foreground">
                  Record all local produce sales in Square with proper labeling and supplier attribution
                </p>
              </div>
              
              <div className="border rounded-lg p-4 flex flex-col items-center text-center space-y-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Delivery Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track scheduled deliveries and automatically create receiving records in Square
                </p>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">To connect your Square account:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Click the "Connect to Square" button above</li>
                <li>Sign in with your Square account credentials</li>
                <li>Authorize this application to access your Square data</li>
                <li>Select which locations and data types you want to sync</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue={selectedTab} className="mb-6" onValueChange={setSelectedTab}>
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Local Produce Inventory</CardTitle>
                  <CardDescription>
                    Manage your locally sourced products in Square inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-5 bg-muted p-3 rounded-t-lg">
                      <div className="font-medium text-sm">Product</div>
                      <div className="font-medium text-sm">Local Supplier</div>
                      <div className="font-medium text-sm">Square Item ID</div>
                      <div className="font-medium text-sm">Retail Price</div>
                      <div className="font-medium text-sm text-right">Status</div>
                    </div>
                    <Separator />
                    {localProduceItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="grid grid-cols-5 p-3 items-center">
                          <div>{item.name}</div>
                          <div className="text-sm">{item.supplier}</div>
                          <div className="text-sm font-mono">{item.squareItemId}</div>
                          <div>{item.price}</div>
                          <div className="text-right">
                            {item.inSync ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Synced
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                Out of Sync
                              </Badge>
                            )}
                          </div>
                        </div>
                        {index < localProduceItems.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Undo2 className="h-4 w-4 mr-2" />
                      Reset All
                    </Button>
                    <Button variant="default" size="sm">
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Sync Inventory
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Local produce sales recorded in Square
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-4 bg-muted p-3 rounded-t-lg">
                      <div className="font-medium text-sm">Date & Time</div>
                      <div className="font-medium text-sm">Items</div>
                      <div className="font-medium text-sm">Total</div>
                      <div className="font-medium text-sm text-right">Status</div>
                    </div>
                    <Separator />
                    {recentTransactions.map((transaction, index) => (
                      <div key={transaction.id}>
                        <div className="grid grid-cols-4 p-3">
                          <div className="text-sm">{transaction.date}</div>
                          <div className="text-sm">
                            <ul>
                              {transaction.items.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>{transaction.total}</div>
                          <div className="text-right">
                            {transaction.synced ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Recorded
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                        {index < recentTransactions.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      <TerminalSquare className="h-4 w-4 mr-2" />
                      View All Transactions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="deliveries" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Deliveries</CardTitle>
                  <CardDescription>
                    Upcoming local produce deliveries to receive into Square
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-4 bg-muted p-3 rounded-t-lg">
                      <div className="font-medium text-sm">Delivery Date</div>
                      <div className="font-medium text-sm">Supplier</div>
                      <div className="font-medium text-sm">Items</div>
                      <div className="font-medium text-sm text-right">Status</div>
                    </div>
                    <Separator />
                    {scheduledDeliveries.map((delivery, index) => (
                      <div key={delivery.id}>
                        <div className="grid grid-cols-4 p-3">
                          <div className="text-sm">{delivery.date}</div>
                          <div className="text-sm">{delivery.supplier}</div>
                          <div className="text-sm">{delivery.items}</div>
                          <div className="text-right">
                            <Badge 
                              variant="outline" 
                              className={delivery.status === 'Processing' 
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                              }
                            >
                              {delivery.status}
                            </Badge>
                          </div>
                        </div>
                        {index < scheduledDeliveries.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-receive" />
                      <Label htmlFor="auto-receive">Auto-receive in Square</Label>
                    </div>
                    <Button variant="default" size="sm">
                      <Tag className="h-4 w-4 mr-2" />
                      Create Receiving Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Square Integration Settings</CardTitle>
              <CardDescription>Configure how your local sourcing data syncs with Square</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto-sync inventory</h3>
                      <p className="text-sm text-muted-foreground">Update Square inventory when local produce arrives</p>
                    </div>
                    <Switch defaultChecked id="auto-sync-inventory" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto-create items</h3>
                      <p className="text-sm text-muted-foreground">Create new items in Square when new local produce is added</p>
                    </div>
                    <Switch defaultChecked id="auto-create-items" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Supplier attribution</h3>
                      <p className="text-sm text-muted-foreground">Show supplier info on Square receipts and item descriptions</p>
                    </div>
                    <Switch defaultChecked id="supplier-attribution" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Local produce category</h3>
                      <p className="text-sm text-muted-foreground">Create a special category in Square for locally sourced items</p>
                    </div>
                    <Switch defaultChecked id="local-category" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Sales reporting</h3>
                      <p className="text-sm text-muted-foreground">Generate special reports on local produce sales</p>
                    </div>
                    <Switch defaultChecked id="sales-reporting" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto-ordering</h3>
                      <p className="text-sm text-muted-foreground">Create pickup requests when inventory is low</p>
                    </div>
                    <Switch defaultChecked id="auto-ordering" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}