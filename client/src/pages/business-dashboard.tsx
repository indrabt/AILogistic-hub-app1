import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  FileText,
  CalendarClock,
  Target,
  ArrowUp,
  ArrowDown,
  Truck,
  ShieldCheck,
  Leaf,
  BarChart2,
  Activity,
  Users,
  CreditCard,
} from "lucide-react";

export default function BusinessDashboard() {
  const [timeRange, setTimeRange] = useState("monthly");

  // Revenue data
  const revenueData = [
    { month: "Jan", revenue: 420000, target: 400000 },
    { month: "Feb", revenue: 440000, target: 420000 },
    { month: "Mar", revenue: 455000, target: 440000 },
    { month: "Apr", revenue: 480000, target: 460000 },
    { month: "May", revenue: 495000, target: 480000 },
    { month: "Jun", revenue: 510000, target: 500000 },
  ];

  // Customer acquisition data
  const customerData = [
    { month: "Jan", customers: 5 },
    { month: "Feb", customers: 8 },
    { month: "Mar", customers: 12 },
    { month: "Apr", customers: 15 },
    { month: "May", customers: 18 },
    { month: "Jun", customers: 24 },
  ];

  // Cost reduction data
  const costReductionData = [
    { name: "Fuel Efficiency", value: 35 },
    { name: "Route Optimization", value: 25 },
    { name: "Inventory Management", value: 20 },
    { name: "Automation", value: 15 },
    { name: "Other", value: 5 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF"];

  // Key performance metrics
  const performanceMetrics = [
    {
      title: "Monthly Revenue",
      value: "$510,000",
      change: "+6.3%",
      trend: "up",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Client Retention",
      value: "94%",
      change: "+2.5%",
      trend: "up",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Avg. Contract Value",
      value: "$18,200",
      change: "+12.8%",
      trend: "up",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "Operating Expenses",
      value: "$215,000",
      change: "-3.2%",
      trend: "down",
      icon: <Activity className="h-4 w-4" />,
    },
  ];

  // Business insights
  const businessInsights = [
    {
      title: "Expanding Western Sydney Partnerships",
      description:
        "New agreements with 5 warehouse facilities in the M5/M7 corridor will increase capacity by 28%",
      impact: "high",
      category: "opportunity",
    },
    {
      title: "Autonomous Fleet ROI",
      description:
        "First phase of autonomous vehicle deployment showing 31% better ROI than projected",
      impact: "high",
      category: "performance",
    },
    {
      title: "Subscription Model Growth",
      description:
        "Mid-tier subscription package adoption increased 42% after adding real-time inventory analytics",
      impact: "medium",
      category: "revenue",
    },
    {
      title: "Competitor Analysis",
      description:
        "Major competitor entering Western Sydney market in Q4 with similar AI-driven solution",
      impact: "medium",
      category: "threat",
    },
  ];

  // Top client performance
  const topClients = [
    {
      name: "Westfield Distribution",
      industry: "Retail",
      mrr: "$32,000",
      growth: "+15%",
      satisfaction: 96,
    },
    {
      name: "Sydney Fresh Foods",
      industry: "Grocery",
      mrr: "$28,500",
      growth: "+8%",
      satisfaction: 92,
    },
    {
      name: "ParaMedical Supplies",
      industry: "Healthcare",
      mrr: "$27,200",
      growth: "+21%",
      satisfaction: 97,
    },
    {
      name: "BuildIt Construction",
      industry: "Construction",
      mrr: "$24,600",
      growth: "+5%",
      satisfaction: 88,
    },
    {
      name: "Sydney Metro Transit",
      industry: "Transportation",
      mrr: "$22,000",
      growth: "+12%",
      satisfaction: 90,
    },
  ];

  // Market opportunity metrics
  const marketOpportunities = [
    {
      segment: "Healthcare Logistics",
      potentialRevenue: "$2.2M",
      marketShare: "8%",
      growthRate: "18%",
      competitionLevel: "Medium",
    },
    {
      segment: "Food & Beverage",
      potentialRevenue: "$3.5M",
      marketShare: "12%",
      growthRate: "15%",
      competitionLevel: "High",
    },
    {
      segment: "Construction Materials",
      potentialRevenue: "$2.8M",
      marketShare: "6%",
      growthRate: "10%",
      competitionLevel: "Low",
    },
    {
      segment: "Retail Distribution",
      potentialRevenue: "$4.1M",
      marketShare: "14%",
      growthRate: "12%",
      competitionLevel: "Medium",
    },
  ];

  // Impact of AI on Business
  const aiBusinessImpact = [
    {
      category: "Cost Reduction",
      percentage: 32,
      description:
        "Route optimization and predictive maintenance reducing operational costs",
    },
    {
      category: "Revenue Growth",
      percentage: 24,
      description:
        "AI-powered demand forecasting enabling better inventory management and sales",
    },
    {
      category: "Customer Satisfaction",
      percentage: 38,
      description:
        "Real-time tracking and accurate ETAs improving client experience",
    },
    {
      category: "Operational Efficiency",
      percentage: 45,
      description:
        "Automated scheduling and resource allocation improving throughput",
    },
  ];

  // Calculate impact color based on category
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Calculate category color based on type
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "opportunity":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "threat":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "performance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "revenue":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Executive overview of business performance, market opportunities, and
          strategic insights.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={timeRange === "weekly" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant={timeRange === "monthly" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("monthly")}
        >
          Monthly
        </Button>
        <Button
          variant={timeRange === "quarterly" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("quarterly")}
        >
          Quarterly
        </Button>
        <Button
          variant={timeRange === "yearly" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("yearly")}
        >
          Yearly
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {metric.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                </div>
                <div
                  className={`p-2 rounded-full ${
                    metric.trend === "up"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {metric.icon}
                </div>
              </div>
              <div className="flex items-center mt-4">
                {metric.trend === "up" ? (
                  <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-orange-600 mr-1" />
                )}
                <span
                  className={
                    metric.trend === "up" ? "text-green-600" : "text-orange-600"
                  }
                >
                  {metric.change}
                </span>
                <span className="text-muted-foreground text-xs ml-2">
                  vs previous period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Financial Performance</TabsTrigger>
          <TabsTrigger value="clients">Clients & Market</TabsTrigger>
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
          <TabsTrigger value="ai-impact">AI Business Impact</TabsTrigger>
        </TabsList>

        {/* Financial Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Revenue vs. Target
                </CardTitle>
                <CardDescription>
                  Monthly revenue performance against targets
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => ["$" + value.toLocaleString(), ""]}
                    />
                    <Legend />
                    <Bar
                      name="Revenue"
                      dataKey="revenue"
                      fill="#0088FE"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      name="Target"
                      dataKey="target"
                      fill="#82ca9d"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5" />
                  Cost Reduction Sources
                </CardTitle>
                <CardDescription>
                  AI-enabled savings distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costReductionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {costReductionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Contribution"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Business Goals Progress
              </CardTitle>
              <CardDescription>
                Quarterly business objectives progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Q2 Revenue Target ($3M)
                    </span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      New Client Acquisition (30)
                    </span>
                    <span className="text-sm font-medium">73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Cost Reduction Goal (15%)
                    </span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Sydney Market Expansion
                    </span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      AI Feature Development
                    </span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients & Market Tab */}
        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Customer Acquisition
                </CardTitle>
                <CardDescription>
                  New client growth over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={customerData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      name="New Clients"
                      dataKey="customers"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Client Satisfaction
                </CardTitle>
                <CardDescription>
                  Overall satisfaction by service area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Route Optimization
                      </span>
                      <span className="text-sm font-medium">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Weather Prediction
                      </span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        AI Supply Chain
                      </span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Customer Support
                      </span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Platform Usability
                      </span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base font-normal">
                  Top Performing Clients
                </CardTitle>
                <CardDescription>
                  Clients with highest revenue and growth
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-muted-foreground">
                  <div>Client</div>
                  <div>Industry</div>
                  <div>Monthly Revenue</div>
                  <div>YoY Growth</div>
                  <div>Satisfaction</div>
                </div>
                <div className="divide-y divide-border rounded-md border">
                  {topClients.map((client, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-5 gap-4 p-4 text-sm items-center"
                    >
                      <div className="font-medium">{client.name}</div>
                      <div>{client.industry}</div>
                      <div>{client.mrr}</div>
                      <div className="text-green-600">{client.growth}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={client.satisfaction}
                            className="w-16 h-2"
                          />
                          <span>{client.satisfaction}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base font-normal">
                  Market Opportunities
                </CardTitle>
                <CardDescription>
                  Potential growth segments for expansion
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Detailed Analysis
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-muted-foreground">
                  <div>Market Segment</div>
                  <div>Potential Revenue</div>
                  <div>Current Share</div>
                  <div>Growth Rate</div>
                  <div>Competition</div>
                </div>
                <div className="divide-y divide-border rounded-md border">
                  {marketOpportunities.map((opportunity, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-5 gap-4 p-4 text-sm items-center"
                    >
                      <div className="font-medium">{opportunity.segment}</div>
                      <div>{opportunity.potentialRevenue}</div>
                      <div>{opportunity.marketShare}</div>
                      <div className="text-green-600">
                        {opportunity.growthRate}
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            opportunity.competitionLevel === "High"
                              ? "bg-red-100 text-red-800"
                              : opportunity.competitionLevel === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {opportunity.competitionLevel}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategic Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Business Insights
                </CardTitle>
                <CardDescription>
                  AI-generated strategic insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{insight.title}</h3>
                        <div className="flex space-x-2">
                          <Badge
                            className={getImpactColor(insight.impact)}
                            variant="secondary"
                          >
                            {insight.impact}
                          </Badge>
                          <Badge
                            className={getCategoryColor(insight.category)}
                            variant="secondary"
                          >
                            {insight.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarClock className="mr-2 h-5 w-5" />
                  Strategic Timeline
                </CardTitle>
                <CardDescription>
                  Upcoming business milestones and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-8 space-y-8">
                  <div className="absolute inset-0 left-4 w-px bg-muted" />

                  <div className="relative">
                    <div className="absolute -left-8 p-1 rounded-full bg-green-200">
                      <div className="h-2 w-2 rounded-full bg-green-600" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-medium text-sm">
                        New Client Portal Launch
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        August 15, 2025
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Release of redesigned client dashboard with enhanced AI
                        analytics visibility
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-8 p-1 rounded-full bg-blue-200">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-medium text-sm">
                        Western Sydney Expo
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        September 5-7, 2025
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Showcasing our AI Logistics Hub at the Western Sydney
                        Business Technology Expo
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-8 p-1 rounded-full bg-purple-200">
                      <div className="h-2 w-2 rounded-full bg-purple-600" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-medium text-sm">
                        Autonomous Fleet Expansion
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        October 1, 2025
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Phase 2 rollout of autonomous delivery vehicles covering
                        Eastern Suburbs and Inner West
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-8 p-1 rounded-full bg-amber-200">
                      <div className="h-2 w-2 rounded-full bg-amber-600" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-medium text-sm">
                        Quarterly Stakeholder Meeting
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        October 15, 2025
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Q3 performance review and Q4 strategy alignment with key
                        stakeholders
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-8 p-1 rounded-full bg-red-200">
                      <div className="h-2 w-2 rounded-full bg-red-600" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-medium text-sm">Full Product Launch</h3>
                      <p className="text-xs text-muted-foreground">
                        January 15, 2026
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Official launch of the complete AI Logistics Hub platform
                        with all 10 key features
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Risk Assessment
              </CardTitle>
              <CardDescription>
                Critical business risks and mitigation strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-full bg-red-100">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <h3 className="font-medium">Competitor Market Entry</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    Major logistics tech provider entering Western Sydney with
                    similar AI solutions in Q4 2025
                  </p>
                  <div className="pl-8 space-y-2">
                    <p className="text-sm font-medium">Mitigation:</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>
                        Accelerate development of proprietary route optimization
                        algorithms
                      </li>
                      <li>
                        Strengthen existing client relationships with enhanced
                        service offerings
                      </li>
                      <li>
                        Exclusive partnerships with regional transport providers
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-full bg-amber-100">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <h3 className="font-medium">Regulatory Changes</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    New NSW transport regulations affecting autonomous vehicle
                    operations expected in 2026
                  </p>
                  <div className="pl-8 space-y-2">
                    <p className="text-sm font-medium">Mitigation:</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>
                        Active participation in industry regulatory discussions
                      </li>
                      <li>
                        Flexible fleet management system supporting multiple
                        vehicle types
                      </li>
                      <li>
                        Compliance team monitoring legislative developments
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-full bg-blue-100">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium">Technology Adoption</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    Slower than anticipated adoption of advanced AI features by
                    mid-market clients
                  </p>
                  <div className="pl-8 space-y-2">
                    <p className="text-sm font-medium">Mitigation:</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>
                        Simplified onboarding and training materials for
                        non-technical users
                      </li>
                      <li>
                        Tiered feature rollout based on client technical maturity
                      </li>
                      <li>Dedicated client success team for mid-market segment</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-full bg-purple-100">
                      <AlertTriangle className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium">Infrastructure Investment</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    Higher than projected cloud computing costs for AI models as
                    usage scales
                  </p>
                  <div className="pl-8 space-y-2">
                    <p className="text-sm font-medium">Mitigation:</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>
                        Model optimization to reduce computational requirements
                      </li>
                      <li>
                        Hybrid cloud strategy leveraging reserved instances for
                        predictable workloads
                      </li>
                      <li>Edge computing deployment for time-sensitive tasks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Business Impact Tab */}
        <TabsContent value="ai-impact" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  AI Business Impact
                </CardTitle>
                <CardDescription>
                  Areas where AI is driving business value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {aiBusinessImpact.map((impact, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-sm">
                          {impact.category}
                        </h3>
                        <span className="text-sm font-bold">
                          {impact.percentage}%
                        </span>
                      </div>
                      <Progress value={impact.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {impact.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5" />
                  Sustainability Impact
                </CardTitle>
                <CardDescription>
                  Environmental benefits from AI logistics optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Truck className="h-10 w-10 text-green-600 mr-4" />
                      <div>
                        <h3 className="font-bold text-lg">28%</h3>
                        <p className="text-sm text-muted-foreground">
                          Reduction in CO2 emissions
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs. Last Year
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-bold text-lg">215,000</h3>
                      <p className="text-sm text-muted-foreground">
                        Fewer km traveled
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-bold text-lg">32%</h3>
                      <p className="text-sm text-muted-foreground">
                        Less fuel consumption
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-bold text-lg">42%</h3>
                      <p className="text-sm text-muted-foreground">
                        Reduction in empty miles
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-bold text-lg">62</h3>
                      <p className="text-sm text-muted-foreground">
                        Tons of paper saved
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Sustainability Certifications:
                    </h3>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">ISO 14001</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Green Logistics</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Carbon Neutral</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                ROI by AI Feature
              </CardTitle>
              <CardDescription>
                Return on investment for key AI technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium text-muted-foreground">
                  <div>AI Feature</div>
                  <div>Implementation Cost</div>
                  <div>Annual Return</div>
                  <div>ROI</div>
                </div>
                <div className="divide-y divide-border rounded-md border">
                  <div className="grid grid-cols-4 gap-4 p-4 text-sm items-center">
                    <div className="font-medium">
                      Hyper-Local Route Optimization
                    </div>
                    <div>$325,000</div>
                    <div>$785,000</div>
                    <div className="text-green-600">242%</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-4 text-sm items-center">
                    <div className="font-medium">
                      Predictive Supply Chain Resilience
                    </div>
                    <div>$280,000</div>
                    <div>$520,000</div>
                    <div className="text-green-600">186%</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-4 text-sm items-center">
                    <div className="font-medium">
                      Sustainable AI-Driven Operations
                    </div>
                    <div>$210,000</div>
                    <div>$345,000</div>
                    <div className="text-green-600">164%</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-4 text-sm items-center">
                    <div className="font-medium">
                      Integrated Cybersecurity Suite
                    </div>
                    <div>$195,000</div>
                    <div>$285,000</div>
                    <div className="text-green-600">146%</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-4 text-sm items-center">
                    <div className="font-medium">
                      Multi-Modal Logistics Orchestration
                    </div>
                    <div>$350,000</div>
                    <div>$620,000</div>
                    <div className="text-green-600">177%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}