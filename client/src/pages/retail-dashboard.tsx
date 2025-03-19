import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart2, 
  Calendar, 
  CloudSun, 
  Truck, 
  Tag, 
  PackageOpen, 
  Users, 
  Recycle, 
  Settings, 
  FileText,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocketContext } from "@/contexts/WebSocketContext";

export default function RetailDashboard() {
  const { toast } = useToast();
  const { status: wsStatus } = useWebSocketContext();
  const [activeFeature, setActiveFeature] = useState('demand');
  const [pickupDialogOpen, setPickupDialogOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<number | null>(null);
  
  const handleSchedulePickup = () => {
    setPickupDialogOpen(true);
  };
  
  const schedulePickup = (farmerId: number, date: string, items: string) => {
    // In a real app, this would make an API call
    toast({
      title: "Pickup Scheduled",
      description: `Your pickup has been scheduled for ${date}`,
    });
    setPickupDialogOpen(false);
  };

  // Sample data for widgets
  const weatherForecast = {
    today: { temp: 28, condition: 'Sunny', icon: '☀️' },
    tomorrow: { temp: 32, condition: 'Hot', icon: '🔥' },
    nextDay: { temp: 30, condition: 'Partly Cloudy', icon: '⛅' },
  };

  const upcomingEvents = [
    { id: 1, name: 'Penrith Festival', date: 'Nov 15, 2025', expectedImpact: 'High' },
    { id: 2, name: 'Local Triathlon', date: 'Oct 5, 2025', expectedImpact: 'Medium' },
    { id: 3, name: 'School Holiday Start', date: 'Dec 18, 2025', expectedImpact: 'Medium' }
  ];

  const inventoryAlerts = [
    { id: 1, product: 'Milk 2L', status: 'Expiring in 7 days', quantity: 24, action: 'Apply 20% discount' },
    { id: 2, product: 'Apples', status: 'Low Stock', quantity: 5, action: 'Order more' },
    { id: 3, product: 'Water Bottles', status: 'High Demand Expected', quantity: 48, action: 'Increase stock by 100' }
  ];

  const localFarmers = [
    { id: 1, name: 'Johnson Family Farm', products: ['Tomatoes', 'Cucumbers'], distance: '15km' },
    { id: 2, name: 'Hawkesbury Fresh', products: ['Apples', 'Pears'], distance: '22km' },
    { id: 3, name: 'Western Dairy', products: ['Milk', 'Cheese'], distance: '8km' }
  ];

  // Feature card data
  const featureData = {
    demand: {
      title: 'Demand Prediction',
      description: 'AI-driven insights for weather & event based stocking',
      icon: <CloudSun className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Weather Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-2xl">{weatherForecast.today.icon}</div>
                    <div className="text-sm font-medium mt-1">Today</div>
                    <div className="text-lg">{weatherForecast.today.temp}°C</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">{weatherForecast.tomorrow.icon}</div>
                    <div className="text-sm font-medium mt-1">Tomorrow</div>
                    <div className="text-lg">{weatherForecast.tomorrow.temp}°C</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">{weatherForecast.nextDay.icon}</div>
                    <div className="text-sm font-medium mt-1">Wednesday</div>
                    <div className="text-lg">{weatherForecast.nextDay.temp}°C</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="font-medium text-sm">Stock Recommendations:</div>
                  <ul className="mt-1 text-sm">
                    <li className="flex items-center">
                      <span className="text-green-600 mr-1">↑</span> +100 Water bottles
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-1">↑</span> +30 Ice creams
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {upcomingEvents.map(event => (
                    <li key={event.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-muted-foreground">{event.date}</div>
                      </div>
                      <Badge 
                        variant={
                          event.expectedImpact === 'High' ? 'destructive' : 
                          event.expectedImpact === 'Medium' ? 'default' : 'outline'
                        }
                      >
                        {event.expectedImpact}
                      </Badge>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-3">View Stock Recommendations</Button>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Pre-Built Templates</CardTitle>
              <CardDescription>Templates for quick setup based on common scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start">
                  <CloudSun className="h-4 w-4 mr-2" />
                  Hot Weather Template
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Festival Template
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  School Holiday Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    sourcing: {
      title: 'Local Sourcing',
      description: 'Connect with nearby farmers for fresh, affordable produce',
      icon: <Truck className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Nearby Farmers</CardTitle>
              <CardDescription>Sources within 50km of your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {localFarmers.map(farmer => (
                  <div key={farmer.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{farmer.name}</h4>
                        <p className="text-sm text-muted-foreground">{farmer.distance} away</p>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm font-medium">Products: </span>
                      <span className="text-sm">{farmer.products.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" onClick={handleSchedulePickup}>
                <Truck className="h-4 w-4 mr-2" /> Schedule Pickup
              </Button>
              
              <Dialog open={pickupDialogOpen} onOpenChange={setPickupDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule a Pickup</DialogTitle>
                    <DialogDescription>
                      Schedule a pickup from one of your local farmers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="farmer" className="text-right">
                        Farmer
                      </Label>
                      <Select
                        onValueChange={(value) => setSelectedFarmer(parseInt(value))}
                        defaultValue=""
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a farmer" />
                        </SelectTrigger>
                        <SelectContent>
                          {localFarmers.map((farmer) => (
                            <SelectItem key={farmer.id} value={farmer.id.toString()}>
                              {farmer.name} ({farmer.distance})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        className="col-span-3"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right">
                        Time
                      </Label>
                      <Input id="time" type="time" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="items" className="text-right">
                        Items
                      </Label>
                      <Input id="items" placeholder="e.g., 10kg Apples, 5kg Tomatoes" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPickupDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      if (selectedFarmer) {
                        const dateInput = document.getElementById('date') as HTMLInputElement;
                        const timeInput = document.getElementById('time') as HTMLInputElement;
                        const itemsInput = document.getElementById('items') as HTMLInputElement;
                        
                        const date = dateInput?.value;
                        const time = timeInput?.value;
                        const items = itemsInput?.value;
                        
                        if (date && time && items) {
                          const dateTimeStr = `${date} at ${time}`;
                          schedulePickup(selectedFarmer, dateTimeStr, items);
                        } else {
                          toast({
                            title: "Missing Information",
                            description: "Please fill in all the fields",
                            variant: "destructive",
                          });
                        }
                      } else {
                        toast({
                          title: "Missing Information",
                          description: "Please select a farmer",
                          variant: "destructive",
                        });
                      }
                    }}>
                      Schedule
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Upcoming Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Hawkesbury Fresh</h4>
                    <p className="text-sm">Scheduled for tomorrow, 10:00 AM</p>
                  </div>
                  <Badge>Confirmed</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Order:</p>
                  <p className="text-sm">20kg Apples, 15kg Pears</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Modify</Button>
                  <Button variant="destructive" size="sm">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    pricing: {
      title: 'Dynamic Pricing',
      description: 'Smart price adjustments based on demand and sourcing',
      icon: <Tag className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Price Recommendations</CardTitle>
              <CardDescription>Based on local farmer savings and market rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Carrots (1kg)</h4>
                      <p className="text-sm text-green-600">10% below market rate</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$1.50/kg</div>
                      <div className="text-sm text-muted-foreground line-through">$1.70/kg</div>
                    </div>
                  </div>
                  <Button size="sm" className="mt-2 w-full">Apply to Square POS</Button>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Water Bottles (500ml)</h4>
                      <p className="text-sm text-amber-600">High demand expected (Festival)</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$2.25</div>
                      <div className="text-sm text-muted-foreground line-through">$2.00</div>
                    </div>
                  </div>
                  <Button size="sm" className="mt-2 w-full">Apply to Square POS</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Bundle Promotions</CardTitle>
              <CardDescription>Special offers based on events and inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-3 mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Triathlon Special</h4>
                    <p className="text-sm">Water bottle + Energy bar</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Save 15%</Badge>
                </div>
                <div className="mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Regular price:</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Bundle price:</span>
                    <span>$4.25</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full">Create Bundle in Square</Button>
              </div>
              <Button className="w-full">Create New Bundle</Button>
            </CardContent>
          </Card>
        </div>
      )
    },
    inventory: {
      title: 'Inventory Tracker',
      description: 'Smart management of perishables with expiry alerts',
      icon: <PackageOpen className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Inventory Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventoryAlerts.map(alert => (
                  <div key={alert.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{alert.product}</h4>
                        <p className="text-sm text-amber-600">{alert.status}</p>
                      </div>
                      <Badge variant="outline">{alert.quantity} units</Badge>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm">{alert.action}</span>
                      <Button size="sm">Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">FIFO Compliance</CardTitle>
              <CardDescription>First In, First Out stock management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Progress value={85} className="h-2" />
                  <span className="text-sm font-medium">85%</span>
                </div>
                <p className="text-sm">85% of stock is being sold in FIFO order. 15% of products may be at risk of improper rotation.</p>
                <Button variant="outline" className="w-full">View FIFO Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    loyalty: {
      title: 'Loyalty Program',
      description: 'Retain customers with pre-built loyalty systems',
      icon: <Users className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Loyalty Program Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Standard Program</h4>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Points per $1:</span>
                    <span className="font-medium">1 point</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reward threshold:</span>
                    <span className="font-medium">50 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reward:</span>
                    <span className="font-medium">Free item (up to $5)</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Active members:</span>
                    <span className="font-medium">124</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rewards redeemed (30 days):</span>
                    <span>37</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">Modify Program</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Special Event Promotion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Penrith Festival Double Points</h4>
                    <p className="text-sm text-muted-foreground">Nov 15-16, 2025</p>
                  </div>
                  <Badge>Scheduled</Badge>
                </div>
                <p className="text-sm">Double points for all purchases during the festival weekend. Projected to increase sales by 15%.</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button variant="destructive" size="sm" className="flex-1">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    waste: {
      title: 'Waste Management',
      description: 'Reduce waste through donations and composting',
      icon: <Recycle className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Waste Reduction Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">50kg</div>
                    <div className="text-sm text-muted-foreground">Donated</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">20kg</div>
                    <div className="text-sm text-muted-foreground">Composted</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">15%</div>
                    <div className="text-sm text-muted-foreground">Waste Reduced</div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Donation Schedule</h4>
                  <div className="mt-2 text-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Foodbank Penrith</span>
                      <span>Every Monday, 5PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Local Shelter</span>
                      <span>Every Thursday, 6PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Waste Reduction Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Order Less Milk</h4>
                      <p className="text-sm">Historically high spoilage rate</p>
                    </div>
                    <Badge variant="outline">10% Reduction</Badge>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <Button size="sm" variant="outline">Ignore</Button>
                    <Button size="sm">Apply to Order</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Set up Composting</h4>
                      <p className="text-sm">Penrith Council pickup available</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Easy Setup</Badge>
                  </div>
                  <Button size="sm" className="mt-2 w-full">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    integration: {
      title: 'Integration Kit',
      description: 'Connect with Square POS and logistics features',
      icon: <Settings className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Connected Systems</CardTitle>
              <CardDescription>Current integrations status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-black rounded-md flex items-center justify-center text-white font-bold">S</div>
                    <div>
                      <h4 className="font-medium">Square POS</h4>
                      <p className="text-sm text-green-600">Connected and syncing</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Settings</Button>
                </div>
                
                <div className="border rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center text-white">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Route Optimization</h4>
                      <p className="text-sm text-green-600">Connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Settings</Button>
                </div>
                
                <div className="border rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-amber-500 rounded-md flex items-center justify-center text-white">
                      <CloudSun className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Weather Data</h4>
                      <p className="text-sm text-green-600">Connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Add New Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center justify-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span>Xero Accounting</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center justify-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>Staff Scheduling</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    training: {
      title: 'Staff Training',
      description: 'In-app guides and tutorials for employees',
      icon: <FileText className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Training Videos</CardTitle>
              <CardDescription>Quick 5-minute guides for staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Inventory Management</h4>
                      <p className="text-sm">5 min · Basic tutorial</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">90% Completed</Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="flex-1">View Stats</Button>
                    <Button size="sm" className="flex-1">Watch</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">FIFO Stocking</h4>
                      <p className="text-sm">3 min · Essential stock rotation</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">70% Completed</Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="flex-1">View Stats</Button>
                    <Button size="sm" className="flex-1">Watch</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Square POS Basics</h4>
                      <p className="text-sm">7 min · Complete guide</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">100% Completed</Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="flex-1">View Stats</Button>
                    <Button size="sm" className="flex-1">Watch</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Quick Reference Cheat Sheets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center justify-center gap-2">
                  <PackageOpen className="h-6 w-6" />
                  <span>Stock Rotation Guide</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center justify-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>Loyalty Program Cheat Sheet</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center justify-center gap-2">
                  <Tag className="h-6 w-6" />
                  <span>Discount Application Guide</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center justify-center gap-2">
                  <Settings className="h-6 w-6" />
                  <span>Troubleshooting Square POS</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Retail Dashboard</h1>
          <p className="text-muted-foreground">Manage your store operations with AI-powered tools</p>
        </div>
        
        <div className="flex items-center gap-3">
          {wsStatus === 'open' ? (
            <div className="flex items-center text-green-600">
              <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
              <span className="text-sm">Live Updates</span>
            </div>
          ) : (
            <div className="flex items-center text-amber-600">
              <div className="h-2 w-2 rounded-full bg-amber-600 mr-2" />
              <span className="text-sm">Reconnecting...</span>
            </div>
          )}
          
          <Button variant="outline" onClick={() => toast({ title: "Refreshed", description: "Dashboard data has been updated" })}>
            Refresh
          </Button>
        </div>
      </header>
      
      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Sales</p>
              <p className="text-2xl font-bold">$1,624</p>
              <div className="flex items-center text-sm text-green-600">
                <span className="mr-1">↑</span>12% from yesterday
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
              <p className="text-2xl font-bold">$12,450</p>
              <div className="flex items-center text-sm text-amber-600">
                <span className="mr-1">↓</span>3% from last week
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <PackageOpen className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Loyalty Members</p>
              <p className="text-2xl font-bold">124</p>
              <div className="flex items-center text-sm text-green-600">
                <span className="mr-1">↑</span>5 new this week
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Waste Reduction</p>
              <p className="text-2xl font-bold">15%</p>
              <div className="flex items-center text-sm text-green-600">
                <span className="mr-1">↑</span>3% this month
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Recycle className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 border rounded-lg p-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-full">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Milk Expiration Alert</h4>
                <p className="text-sm">24 units of 2L Milk will expire in 7 days. Apply 20% discount.</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">Dismiss</Button>
            </div>
            <div className="flex items-start gap-3 border rounded-lg p-3">
              <div className="p-2 bg-green-100 text-green-800 rounded-full">
                <CloudSun className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Hot Weather Forecast</h4>
                <p className="text-sm">32°C expected tomorrow. Increase water and ice cream stock.</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">Dismiss</Button>
            </div>
            <div className="flex items-start gap-3 border rounded-lg p-3">
              <div className="p-2 bg-red-100 text-red-800 rounded-full">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Low Stock Warning</h4>
                <p className="text-sm">Apples (5 units) and Bananas (3 units) are running low.</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">Dismiss</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Features Section */}
      <div className="space-y-4">
        <Tabs defaultValue="sourcing" onValueChange={setActiveFeature} className="space-y-4">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 h-auto">
            <TabsTrigger value="demand" className="flex flex-col h-auto py-2 px-3">
              <CloudSun className="h-4 w-4 mb-1" />
              <span className="text-xs">Demand</span>
            </TabsTrigger>
            <TabsTrigger value="sourcing" className="flex flex-col h-auto py-2 px-3">
              <Truck className="h-4 w-4 mb-1" />
              <span className="text-xs">Sourcing</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex flex-col h-auto py-2 px-3">
              <Tag className="h-4 w-4 mb-1" />
              <span className="text-xs">Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex flex-col h-auto py-2 px-3">
              <PackageOpen className="h-4 w-4 mb-1" />
              <span className="text-xs">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex flex-col h-auto py-2 px-3">
              <Users className="h-4 w-4 mb-1" />
              <span className="text-xs">Loyalty</span>
            </TabsTrigger>
            <TabsTrigger value="waste" className="flex flex-col h-auto py-2 px-3">
              <Recycle className="h-4 w-4 mb-1" />
              <span className="text-xs">Waste</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex flex-col h-auto py-2 px-3">
              <Settings className="h-4 w-4 mb-1" />
              <span className="text-xs">Integrate</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex flex-col h-auto py-2 px-3">
              <FileText className="h-4 w-4 mb-1" />
              <span className="text-xs">Training</span>
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(featureData).map(([key, feature]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                {feature.icon}
                <div>
                  <h2 className="text-xl font-bold">{feature.title}</h2>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
              {feature.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}