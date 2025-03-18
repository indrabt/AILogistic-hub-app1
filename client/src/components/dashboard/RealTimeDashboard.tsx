import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Activity, AlertTriangle, BarChart2, Clock, CloudRain, RefreshCw, TrendingUp, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MetricCard from "./MetricCard";

interface MetricData {
  activeShipments: {
    value: number;
    change: string;
    trend: "up" | "down";
  };
  onTimeDelivery: {
    value: string;
    change: string;
    trend: "up" | "down";
  };
  delayAlerts: {
    value: number;
    change: string;
    trend: "up" | "down";
  };
  avgShippingCost: {
    value: string;
    change: string;
    trend: "up" | "down";
  };
}

interface WeatherAlert {
  id: number;
  severity: "severe" | "advisory";
  title: string;
  description: string;
  time: string;
  affectedShipments?: number;
  region: string;
}

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "primary" | "accent" | "secondary" | "default";
}

interface AIInsight {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: 'delivery' | 'weather' | 'inventory' | 'route' | 'demand' | 'supply_chain';
  priority: 'critical' | 'high' | 'medium' | 'low';
  action?: string;
  confidence: number;
}

export default function RealTimeDashboard() {
  const { toast } = useToast();
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Fetch dashboard metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: refreshInterval,
  });

  // Fetch weather alerts
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/weather/alerts'],
    refetchInterval: refreshInterval,
  });

  // Fetch recent activities
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/activities'],
    refetchInterval: refreshInterval,
  });

  // Generate AI insights based on current data
  useEffect(() => {
    if (metrics && alerts && activities) {
      const newInsights: AIInsight[] = [];
      
      // Delivery insights
      if (metrics.delayAlerts.value > 3) {
        newInsights.push({
          id: Date.now() + 1,
          title: 'Delivery Delays Increasing',
          description: `${metrics.delayAlerts.value} deliveries are currently delayed. Consider allocating additional resources.`,
          timestamp: new Date().toISOString(),
          type: 'delivery',
          priority: metrics.delayAlerts.value > 10 ? 'critical' : 'high',
          confidence: 0.92,
          action: 'View delayed shipments'
        });
      }
      
      // Weather insights
      const severeAlerts = alerts.filter((alert: WeatherAlert) => alert.severity === 'severe');
      if (severeAlerts.length > 0) {
        newInsights.push({
          id: Date.now() + 2,
          title: 'Severe Weather Conditions',
          description: `${severeAlerts.length} severe weather alerts active. May affect ${severeAlerts.reduce((sum: number, a: WeatherAlert) => sum + (a.affectedShipments || 0), 0)} shipments.`,
          timestamp: new Date().toISOString(),
          type: 'weather',
          priority: 'critical',
          confidence: 0.96,
          action: 'View alternative routes'
        });
      }
      
      // On-time delivery insights
      const onTimePercentage = parseFloat(metrics.onTimeDelivery.value.replace('%', ''));
      if (onTimePercentage < 90) {
        newInsights.push({
          id: Date.now() + 3,
          title: 'On-Time Delivery Below Target',
          description: `Current on-time delivery rate at ${metrics.onTimeDelivery.value}. Target is 95%. Analyze affected routes.`,
          timestamp: new Date().toISOString(),
          type: 'delivery',
          priority: onTimePercentage < 85 ? 'high' : 'medium',
          confidence: 0.89,
          action: 'View performance analytics'
        });
      }
      
      // Update insights
      setInsights(newInsights);
      setLastUpdateTime(new Date());
    }
  }, [metrics, alerts, activities]);

  const handleRefreshClick = () => {
    toast({
      title: "Dashboard Refreshed",
      description: "Real-time data has been updated",
    });
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 hover:bg-red-600';
      case 'high': return 'bg-orange-500 hover:bg-orange-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'delivery': return <Truck className="h-5 w-5" />;
      case 'weather': return <CloudRain className="h-5 w-5" />;
      case 'inventory': return <BarChart2 className="h-5 w-5" />;
      case 'route': return <TrendingUp className="h-5 w-5" />;
      case 'demand': return <Activity className="h-5 w-5" />;
      case 'supply_chain': return <AlertTriangle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Real-Time Dashboard</h2>
          <p className="text-muted-foreground">
            Live updates with ≤5-second latency. Last updated: {lastUpdateTime.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={handleRefreshClick} variant="outline" size="sm" className="flex gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.length > 0 ? (
              insights.map((insight) => (
                <Card key={insight.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold">{insight.title}</CardTitle>
                      <Badge className={priorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      {getInsightIcon(insight.type)}
                      <span className="capitalize">{insight.type.replace('_', ' ')}</span>
                      <span className="text-muted-foreground mx-1">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(insight.timestamp).toLocaleTimeString()}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="mb-3">{insight.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Confidence: {(insight.confidence * 100).toFixed(0)}%
                      </span>
                      {insight.action && (
                        <Button size="sm" variant="default">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Insights Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>All systems are operating normally. No critical insights to display at this time.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metricsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))
            ) : metrics ? (
              <>
                <MetricCard
                  title="Active Shipments"
                  value={metrics.activeShipments.value.toString()}
                  icon={<Truck className="h-5 w-5" />}
                  change={{
                    value: metrics.activeShipments.change,
                    trend: metrics.activeShipments.trend
                  }}
                  iconBgColor="bg-blue-500/20"
                  iconColor="text-blue-500"
                />
                <MetricCard
                  title="On-Time Delivery"
                  value={metrics.onTimeDelivery.value}
                  icon={<Activity className="h-5 w-5" />}
                  change={{
                    value: metrics.onTimeDelivery.change,
                    trend: metrics.onTimeDelivery.trend
                  }}
                  iconBgColor="bg-green-500/20"
                  iconColor="text-green-500"
                />
                <MetricCard
                  title="Delay Alerts"
                  value={metrics.delayAlerts.value.toString()}
                  icon={<AlertTriangle className="h-5 w-5" />}
                  change={{
                    value: metrics.delayAlerts.change,
                    trend: metrics.delayAlerts.trend === 'up' ? 'down' : 'up' // Invert because fewer delays is better
                  }}
                  iconBgColor="bg-red-500/20"
                  iconColor="text-red-500"
                />
                <MetricCard
                  title="Avg Shipping Cost"
                  value={metrics.avgShippingCost.value}
                  icon={<BarChart2 className="h-5 w-5" />}
                  change={{
                    value: metrics.avgShippingCost.change,
                    trend: metrics.avgShippingCost.trend === 'up' ? 'down' : 'up' // Invert because lower cost is better
                  }}
                  iconBgColor="bg-purple-500/20"
                  iconColor="text-purple-500"
                />
              </>
            ) : (
              <Card className="col-span-full">
                <CardContent className="pt-6">
                  <p>Failed to load metrics data</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Real-time updates from the logistics network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {activitiesLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))
                ) : activities ? (
                  activities.map((activity: ActivityItem) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className={`rounded-full p-2 ${
                        activity.type === 'primary' 
                          ? 'bg-primary/20 text-primary' 
                          : activity.type === 'accent' 
                            ? 'bg-purple-500/20 text-purple-500' 
                            : activity.type === 'secondary' 
                              ? 'bg-blue-500/20 text-blue-500'
                              : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Failed to load activities</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Refresh Rate:</span> {refreshInterval/1000} seconds
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setRefreshInterval(2000)} 
            disabled={refreshInterval === 2000}
          >
            2s
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setRefreshInterval(5000)} 
            disabled={refreshInterval === 5000}
          >
            5s
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setRefreshInterval(10000)} 
            disabled={refreshInterval === 10000}
          >
            10s
          </Button>
        </div>
      </div>
    </div>
  );
}