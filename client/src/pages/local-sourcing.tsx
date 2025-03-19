import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LocalSourcing() {
  const { toast } = useToast();
  const [selectedFarmer, setSelectedFarmer] = useState<number | null>(null);
  
  // Sample data for farmers
  const localFarmers = [
    { id: 1, name: 'Johnson Family Farm', products: ['Tomatoes', 'Cucumbers'], distance: '15km' },
    { id: 2, name: 'Hawkesbury Fresh', products: ['Apples', 'Pears'], distance: '22km' },
    { id: 3, name: 'Western Dairy', products: ['Milk', 'Cheese'], distance: '8km' },
    { id: 4, name: 'Sydney Greens', products: ['Lettuce', 'Spinach', 'Kale'], distance: '12km' },
    { id: 5, name: 'Blue Mountains Honey', products: ['Honey', 'Beeswax'], distance: '30km' }
  ];
  
  const upcomingDeliveries = [
    { id: 1, farm: 'Hawkesbury Fresh', date: 'Tomorrow, 10:00 AM', items: '20kg Apples, 15kg Pears', status: 'Confirmed' },
    { id: 2, farm: 'Western Dairy', date: 'Thursday, 8:30 AM', items: '40L Milk, 5kg Cheese', status: 'Scheduled' }
  ];

  const schedulePickup = (farmerId: number, date: string, time: string, items: string) => {
    // In a real app, this would make an API call
    toast({
      title: "Pickup Scheduled",
      description: `Your pickup from ${localFarmers.find(f => f.id === farmerId)?.name} has been scheduled for ${date} at ${time}`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Local Sourcing</h1>
          <p className="text-muted-foreground">Connect with nearby farmers for fresh, affordable produce</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nearby Farmers</CardTitle>
            <CardDescription>Sources within 50km of your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {localFarmers.map(farmer => (
              <div key={farmer.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{farmer.name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" /> {farmer.distance} away
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Schedule Pickup</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule a Pickup</DialogTitle>
                        <DialogDescription>
                          Schedule a pickup from {farmer.name}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date" className="text-right">
                            Date
                          </Label>
                          <Input
                            id={`date-${farmer.id}`}
                            type="date"
                            className="col-span-3"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="time" className="text-right">
                            Time
                          </Label>
                          <Input id={`time-${farmer.id}`} type="time" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="items" className="text-right">
                            Items
                          </Label>
                          <Input 
                            id={`items-${farmer.id}`} 
                            placeholder="e.g., 10kg Apples, 5kg Tomatoes" 
                            className="col-span-3" 
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => {
                          const dateInput = document.getElementById(`date-${farmer.id}`) as HTMLInputElement;
                          const timeInput = document.getElementById(`time-${farmer.id}`) as HTMLInputElement;
                          const itemsInput = document.getElementById(`items-${farmer.id}`) as HTMLInputElement;
                          
                          const date = dateInput?.value;
                          const time = timeInput?.value;
                          const items = itemsInput?.value;
                          
                          if (date && time && items) {
                            schedulePickup(farmer.id, date, time, items);
                          } else {
                            toast({
                              title: "Missing Information",
                              description: "Please fill in all the fields",
                              variant: "destructive",
                            });
                          }
                        }}>
                          Schedule
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">Products: </span>
                  <span className="text-sm">{farmer.products.join(', ')}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDeliveries.map(delivery => (
                <div key={delivery.id} className="border rounded-lg p-3 mb-3 last:mb-0 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{delivery.farm}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" /> {delivery.date}
                      </div>
                    </div>
                    <Badge>{delivery.status}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order:</p>
                    <p className="text-sm">{delivery.items}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Modify</Button>
                    <Button variant="destructive" size="sm">Cancel</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Benefits of Local Sourcing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Fresher Produce</p>
                    <p className="text-sm text-muted-foreground">Reduced travel time means fresher products with longer shelf life</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Cost Savings</p>
                    <p className="text-sm text-muted-foreground">10-20% cost reduction by cutting out middlemen</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Community Support</p>
                    <p className="text-sm text-muted-foreground">Creating jobs and supporting the local Western Sydney economy</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Environmental Impact</p>
                    <p className="text-sm text-muted-foreground">Reduced carbon footprint with shorter transportation distances</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}