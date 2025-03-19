import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DriverSidebarLayout from "@/components/layouts/DriverSidebarLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Eye, Monitor, Sun, Moon, BatteryMedium, Phone } from "lucide-react";

export default function DriverSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: true,
      weatherAlerts: true,
      routeChanges: true,
      maintenanceReminders: false,
    },
    display: {
      theme: "light" as "light" | "dark" | "system",
      mapStyle: "standard" as "standard" | "satellite" | "traffic",
      fontSize: "medium" as "small" | "medium" | "large",
    },
    mobileApp: {
      dataUsage: "balanced" as "low" | "balanced" | "high",
      batteryOptimization: true,
      offlineNavigation: true,
      voiceGuidance: true,
    }
  });

  const saveSettings = () => {
    // API call would go here
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <DriverSidebarLayout>
      <div className="container mx-auto p-4 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your driver experience</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email notifications</Label>
                <Switch 
                  id="email-notifications" 
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, email: checked}
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push notifications</Label>
                <Switch 
                  id="push-notifications" 
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, push: checked}
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS notifications</Label>
                <Switch 
                  id="sms-notifications" 
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, sms: checked}
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="weather-alerts">Weather alerts</Label>
                <Switch 
                  id="weather-alerts" 
                  checked={settings.notifications.weatherAlerts}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, weatherAlerts: checked}
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="route-changes">Route change alerts</Label>
                <Switch 
                  id="route-changes" 
                  checked={settings.notifications.routeChanges}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, routeChanges: checked}
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-reminders">Maintenance reminders</Label>
                <Switch 
                  id="maintenance-reminders" 
                  checked={settings.notifications.maintenanceReminders}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, maintenanceReminders: checked}
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Display
              </CardTitle>
              <CardDescription>Customize your visual preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.display.theme}
                  onValueChange={(value: "light" | "dark" | "system") => 
                    setSettings({
                      ...settings,
                      display: {...settings.display, theme: value}
                    })
                  }
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="map-style">Map Style</Label>
                <Select
                  value={settings.display.mapStyle}
                  onValueChange={(value: "standard" | "satellite" | "traffic") => 
                    setSettings({
                      ...settings,
                      display: {...settings.display, mapStyle: value}
                    })
                  }
                >
                  <SelectTrigger id="map-style">
                    <SelectValue placeholder="Select map style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select
                  value={settings.display.fontSize}
                  onValueChange={(value: "small" | "medium" | "large") => 
                    setSettings({
                      ...settings,
                      display: {...settings.display, fontSize: value}
                    })
                  }
                >
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Mobile App Settings
              </CardTitle>
              <CardDescription>Configure your mobile app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-usage">Data Usage</Label>
                <Select
                  value={settings.mobileApp.dataUsage}
                  onValueChange={(value: "low" | "balanced" | "high") => 
                    setSettings({
                      ...settings,
                      mobileApp: {...settings.mobileApp, dataUsage: value}
                    })
                  }
                >
                  <SelectTrigger id="data-usage">
                    <SelectValue placeholder="Select data usage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Save Data)</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="high">High (Best Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="battery-optimization" className="flex items-center gap-2">
                  <BatteryMedium className="h-4 w-4" />
                  Battery optimization
                </Label>
                <Switch 
                  id="battery-optimization"
                  checked={settings.mobileApp.batteryOptimization}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    mobileApp: {...settings.mobileApp, batteryOptimization: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="offline-navigation">
                  Offline navigation
                </Label>
                <Switch 
                  id="offline-navigation"
                  checked={settings.mobileApp.offlineNavigation}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    mobileApp: {...settings.mobileApp, offlineNavigation: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="voice-guidance">
                  Voice guidance
                </Label>
                <Switch 
                  id="voice-guidance"
                  checked={settings.mobileApp.voiceGuidance}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    mobileApp: {...settings.mobileApp, voiceGuidance: checked}
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={saveSettings}>Save Changes</Button>
        </div>
      </div>
    </DriverSidebarLayout>
  );
}