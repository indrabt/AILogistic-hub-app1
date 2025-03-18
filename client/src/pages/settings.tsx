import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UserSettings } from "@shared/types";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, User, Bell, LayoutDashboard, Palette, Link, Shield, Clock, Database, Cloud } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  
  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<UserSettings>) => {
      const response = await apiRequest("PATCH", "/api/settings", updatedSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated",
        description: "Your settings have been successfully saved.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSaveSettings = (section: string, data: any) => {
    let updatedSettings: Partial<UserSettings> = {};
    
    switch (section) {
      case "notifications":
        updatedSettings = { notifications: data };
        break;
      case "dashboard":
        updatedSettings = { dashboard: data };
        break;
      case "display":
        updatedSettings = { display: data };
        break;
      case "integration":
        updatedSettings = { integration: data };
        break;
    }
    
    updateSettingsMutation.mutate(updatedSettings);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200">
              <div className="px-6">
                <TabsList className="flex h-14 space-x-4 p-0 bg-transparent">
                  <TabsTrigger value="account" className="flex items-center gap-2 px-3 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2 px-3 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center gap-2 px-3 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Palette className="h-4 w-4" />
                    <span>Appearance</span>
                  </TabsTrigger>
                  <TabsTrigger value="integration" className="flex items-center gap-2 px-3 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Link className="h-4 w-4" />
                    <span>Integrations</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <TabsContent value="account" className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-medium">Alex Johnson</h3>
                    <p className="text-sm text-gray-500 mb-4">Logistics Manager</p>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" defaultValue="Alex" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" defaultValue="Johnson" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="alex.johnson@example.com" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="(555) 123-4567" className="mt-1" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mt-6 mb-4">Security</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label htmlFor="currentPassword">Current password</Label>
                      <Input id="currentPassword" type="password" className="mt-1" />
                    </div>
                    <div></div>
                    <div>
                      <Label htmlFor="newPassword">New password</Label>
                      <Input id="newPassword" type="password" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input id="confirmPassword" type="password" className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline">Cancel</Button>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="p-6">
              <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
              <p className="text-sm text-gray-500 mb-6">Configure how you want to receive notifications</p>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications.email} 
                      onCheckedChange={(checked) => {
                        handleSaveSettings("notifications", {
                          ...settings?.notifications,
                          email: checked
                        });
                      }}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications.push} 
                      onCheckedChange={(checked) => {
                        handleSaveSettings("notifications", {
                          ...settings?.notifications,
                          push: checked
                        });
                      }}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">Receive text messages for critical alerts</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications.sms} 
                      onCheckedChange={(checked) => {
                        handleSaveSettings("notifications", {
                          ...settings?.notifications,
                          sms: checked
                        });
                      }}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-8 mb-4">Notification Types</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Shipment Updates</h4>
                      <p className="text-sm text-gray-500">Status changes to your shipments</p>
                    </div>
                    <div className="flex gap-2">
                      <Switch defaultChecked id="shipment-updates" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Weather Alerts</h4>
                      <p className="text-sm text-gray-500">Severe weather affecting your routes</p>
                    </div>
                    <div className="flex gap-2">
                      <Switch defaultChecked id="weather-alerts" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Inventory Alerts</h4>
                      <p className="text-sm text-gray-500">Low inventory warnings</p>
                    </div>
                    <div className="flex gap-2">
                      <Switch defaultChecked id="inventory-alerts" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">System Updates</h4>
                      <p className="text-sm text-gray-500">Updates about the platform</p>
                    </div>
                    <div className="flex gap-2">
                      <Switch id="system-updates" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Dashboard Layout</h3>
                  <p className="text-sm text-gray-500 mb-6">Configure your default dashboard view</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="defaultView">Default View</Label>
                      <Select 
                        defaultValue={settings?.dashboard.defaultView}
                        onValueChange={(value: "overview" | "routes" | "supply-chain") => {
                          handleSaveSettings("dashboard", {
                            ...settings?.dashboard,
                            defaultView: value
                          });
                        }}
                      >
                        <SelectTrigger id="defaultView" className="mt-1">
                          <SelectValue placeholder="Select default view" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overview">Overview</SelectItem>
                          <SelectItem value="routes">Routes</SelectItem>
                          <SelectItem value="supply-chain">Supply Chain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="refreshRate">Data Refresh Rate (minutes)</Label>
                      <Select 
                        defaultValue={settings?.dashboard.refreshRate.toString()}
                        onValueChange={(value) => {
                          handleSaveSettings("dashboard", {
                            ...settings?.dashboard,
                            refreshRate: parseInt(value)
                          });
                        }}
                      >
                        <SelectTrigger id="refreshRate" className="mt-1">
                          <SelectValue placeholder="Select refresh rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 minute</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mt-8 mb-4">Time & Date</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc-5">
                        <SelectTrigger id="timezone" className="mt-1">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                          <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                          <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="utc+0">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <RadioGroup defaultValue="mm-dd-yyyy" className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mm-dd-yyyy" id="mm-dd-yyyy" />
                          <Label htmlFor="mm-dd-yyyy" className="font-normal">MM/DD/YYYY (US)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dd-mm-yyyy" id="dd-mm-yyyy" />
                          <Label htmlFor="dd-mm-yyyy" className="font-normal">DD/MM/YYYY (EU)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yyyy-mm-dd" id="yyyy-mm-dd" />
                          <Label htmlFor="yyyy-mm-dd" className="font-normal">YYYY-MM-DD (ISO)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Display Settings</h3>
                  <p className="text-sm text-gray-500 mb-6">Customize the visual appearance of the platform</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Theme</Label>
                      <RadioGroup 
                        defaultValue={settings?.display.theme}
                        onValueChange={(value: "light" | "dark" | "system") => {
                          handleSaveSettings("display", {
                            ...settings?.display,
                            theme: value
                          });
                        }}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light" />
                          <Label htmlFor="light" className="font-normal">Light Mode</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dark" id="dark" />
                          <Label htmlFor="dark" className="font-normal">Dark Mode</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="system" id="system" />
                          <Label htmlFor="system" className="font-normal">System Default</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label>Density</Label>
                      <RadioGroup 
                        defaultValue={settings?.display.density}
                        onValueChange={(value: "compact" | "comfortable" | "spacious") => {
                          handleSaveSettings("display", {
                            ...settings?.display,
                            density: value
                          });
                        }}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="compact" id="compact" />
                          <Label htmlFor="compact" className="font-normal">Compact</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="comfortable" id="comfortable" />
                          <Label htmlFor="comfortable" className="font-normal">Comfortable</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="spacious" id="spacious" />
                          <Label htmlFor="spacious" className="font-normal">Spacious</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Color Blind Mode</Label>
                          <p className="text-sm text-gray-500">Use color patterns that are accessible to color blind users</p>
                        </div>
                        <Switch id="color-blind-mode" />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Animations</Label>
                          <p className="text-sm text-gray-500">Enable or disable UI animations</p>
                        </div>
                        <Switch id="animations" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="integration" className="p-6">
              <h3 className="text-lg font-medium mb-4">Connected Services</h3>
              <p className="text-sm text-gray-500 mb-6">Manage external service connections and API integrations</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center mr-4">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">ERP System</h4>
                      <p className="text-sm text-gray-500">Connect to your enterprise data</p>
                    </div>
                  </div>
                  <div>
                    <Switch 
                      checked={settings?.integration.erp} 
                      onCheckedChange={(checked) => {
                        handleSaveSettings("integration", {
                          ...settings?.integration,
                          erp: checked
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center mr-4">
                      <Cloud className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Weather API</h4>
                      <p className="text-sm text-gray-500">Real-time weather updates</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Connected</span>
                    <Switch 
                      checked={settings?.integration.weather} 
                      onCheckedChange={(checked) => {
                        handleSaveSettings("integration", {
                          ...settings?.integration,
                          weather: checked
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center mr-4">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Analytics Platform</h4>
                      <p className="text-sm text-gray-500">Advanced data analysis</p>
                    </div>
                  </div>
                  <div>
                    <Switch 
                      checked={settings?.integration.analytics} 
                      onCheckedChange={(checked) => {
                        handleSaveSettings("integration", {
                          ...settings?.integration,
                          analytics: checked
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-8 mb-4">API Keys</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">Personal API Key</Label>
                  <div className="flex mt-1">
                    <Input id="apiKey" type="password" defaultValue="sk_live_TK6kWHf38NCJ9sn2Xs3U78Q9" className="rounded-r-none" />
                    <Button variant="outline" className="rounded-l-none">Copy</Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Last used: Yesterday at 14:23</p>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button variant="outline" className="mr-2">
                    <Shield className="mr-2 h-4 w-4" />
                    Regenerate API Key
                  </Button>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
