import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  Users,
  Building,
  Server,
  TrendingUp,
  Percent,
  Calendar,
  CreditCard,
  Activity,
} from "lucide-react";

// Business metrics data types
interface BusinessMetrics {
  totalUsers: number;
  activeUsers: number;
  userGrowth: string;
  revenue: {
    monthly: number;
    quarterly: number;
    yearly: number;
    growth: string;
  };
  profits: {
    monthly: number;
    quarterly: number;
    yearly: number;
    margin: string;
  };
  costs: {
    server: number;
    personnel: number;
    marketing: number;
    other: number;
  };
  usersBySegment: {
    name: string;
    users: number;
    revenue: number;
  }[];
  revenueByProduct: {
    name: string;
    value: number;
    percentage: number;
  }[];
  monthlyData: {
    month: string;
    users: number;
    revenue: number;
    costs: number;
    profits: number;
  }[];
  churnRate: string;
  customerAcquisitionCost: number;
  lifetimeValue: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];

export default function BusinessMetrics() {
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    totalUsers: 428,
    activeUsers: 387,
    userGrowth: "+15.3%",
    revenue: {
      monthly: 2145000,
      quarterly: 6285000,
      yearly: 23450000,
      growth: "+18.7%"
    },
    profits: {
      monthly: 845000,
      quarterly: 2475000,
      yearly: 9250000,
      margin: "39.4%"
    },
    costs: {
      server: 245000,
      personnel: 685000,
      marketing: 175000,
      other: 195000
    },
    usersBySegment: [
      { name: "SMEs", users: 215, revenue: 1075000 },
      { name: "Warehouse & 3PL", users: 87, revenue: 652500 },
      { name: "Manufacturing", users: 53, revenue: 397500 },
      { name: "Delivery Services", users: 42, revenue: 168000 },
      { name: "Government", users: 31, revenue: 387500 }
    ],
    revenueByProduct: [
      { name: "Route Optimization", value: 724300, percentage: 33.8 },
      { name: "Supply Chain Resilience", value: 515900, percentage: 24.1 },
      { name: "Sustainability Suite", value: 268300, percentage: 12.5 },
      { name: "Cybersecurity", value: 214500, percentage: 10.0 },
      { name: "Multi-modal Logistics", value: 193000, percentage: 9.0 },
      { name: "Other Features", value: 229000, percentage: 10.6 }
    ],
    monthlyData: [
      { month: "Jan", users: 352, revenue: 1765000, costs: 1085000, profits: 680000 },
      { month: "Feb", users: 364, revenue: 1820000, costs: 1105000, profits: 715000 },
      { month: "Mar", users: 378, revenue: 1890000, costs: 1125000, profits: 765000 },
      { month: "Apr", users: 387, revenue: 1935000, costs: 1145000, profits: 790000 },
      { month: "May", users: 402, revenue: 2010000, costs: 1180000, profits: 830000 },
      { month: "Jun", users: 428, revenue: 2145000, costs: 1300000, profits: 845000 }
    ],
    churnRate: "3.2%",
    customerAcquisitionCost: 12500,
    lifetimeValue: 312500
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate cost breakdown percentages
  const totalCosts = metrics.costs.server + metrics.costs.personnel + metrics.costs.marketing + metrics.costs.other;
  const serverCostPercentage = (metrics.costs.server / totalCosts) * 100;
  const personnelCostPercentage = (metrics.costs.personnel / totalCosts) * 100;
  const marketingCostPercentage = (metrics.costs.marketing / totalCosts) * 100;
  const otherCostPercentage = (metrics.costs.other / totalCosts) * 100;

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Business Metrics</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" /> Last updated: June 30, 2025
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users & Growth</TabsTrigger>
            <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* User Metric Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">{metrics.userGrowth}</span> from last quarter
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>Active: {metrics.activeUsers}</div>
                      <div className="text-muted-foreground">
                        {Math.round((metrics.activeUsers / metrics.totalUsers) * 100)}%
                      </div>
                    </div>
                    <Progress value={(metrics.activeUsers / metrics.totalUsers) * 100} className="mt-1" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Revenue Metric Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.revenue.monthly)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">{metrics.revenue.growth}</span> from last month
                  </p>
                  <div className="mt-3 text-xs">
                    <div className="flex justify-between">
                      <span>Yearly Run Rate:</span>
                      <span className="font-medium">{formatCurrency(metrics.revenue.monthly * 12)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Profit Metric Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.profits.monthly)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">{metrics.profits.margin}</span> profit margin
                  </p>
                  <div className="mt-3 text-xs">
                    <div className="flex justify-between">
                      <span>Yearly Profit:</span>
                      <span className="font-medium">{formatCurrency(metrics.profits.yearly)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Server Cost Metric Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Server Costs</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.costs.server)}</div>
                  <p className="text-xs text-muted-foreground">
                    {serverCostPercentage.toFixed(1)}% of total costs
                  </p>
                  <div className="mt-3 text-xs">
                    <div className="flex justify-between">
                      <span>Cost per user:</span>
                      <span className="font-medium">
                        {formatCurrency(metrics.costs.server / metrics.activeUsers)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 mt-4 md:grid-cols-2">
              {/* Revenue Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Revenue, costs and profit over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={metrics.monthlyData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="#0088FE" />
                        <Bar dataKey="costs" name="Costs" fill="#FF8042" />
                        <Bar dataKey="profits" name="Profit" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Cost Breakdown */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>Monthly operational costs by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Server', value: metrics.costs.server },
                            { name: 'Personnel', value: metrics.costs.personnel },
                            { name: 'Marketing', value: metrics.costs.marketing },
                            { name: 'Other', value: metrics.costs.other },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'Server', value: metrics.costs.server },
                            { name: 'Personnel', value: metrics.costs.personnel },
                            { name: 'Marketing', value: metrics.costs.marketing },
                            { name: 'Other', value: metrics.costs.other },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((metrics.activeUsers / metrics.totalUsers) * 100)}% of total users
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.churnRate}</div>
                  <p className="text-xs text-muted-foreground">
                    Monthly user churn
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Acquisition Cost</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.customerAcquisitionCost)}</div>
                  <p className="text-xs text-muted-foreground">
                    Per new customer
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.lifetimeValue)}</div>
                  <p className="text-xs text-muted-foreground">
                    {(metrics.lifetimeValue / metrics.customerAcquisitionCost).toFixed(1)}x acquisition cost
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 mt-4 md:grid-cols-2">
              {/* User Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly active users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={metrics.monthlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" name="Users" stroke="#0088FE" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Users by Segment */}
              <Card>
                <CardHeader>
                  <CardTitle>Users by Segment</CardTitle>
                  <CardDescription>Distribution of users across business types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={metrics.usersBySegment}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" name="Users" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Financial Tab */}
          <TabsContent value="financial">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quarterly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.revenue.quarterly)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">{metrics.revenue.growth}</span> quarterly growth
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Annual Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.revenue.yearly)}</div>
                  <p className="text-xs text-muted-foreground">
                    Current fiscal year projection
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.profits.margin}</div>
                  <p className="text-xs text-muted-foreground">
                    Year to date
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Annual Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.profits.yearly)}</div>
                  <p className="text-xs text-muted-foreground">
                    Current fiscal year projection
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 mt-4 md:grid-cols-2">
              {/* Revenue by User Segment */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by User Segment</CardTitle>
                  <CardDescription>Distribution of revenue across business types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={metrics.usersBySegment}
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Revenue by Product */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Product</CardTitle>
                  <CardDescription>Feature contribution to monthly revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={metrics.revenueByProduct}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {metrics.revenueByProduct.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}