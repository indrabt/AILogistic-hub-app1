import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Warehouse,
  Package,
  Truck,
  Factory,
  Building,
  User,
  Users,
  Map,
  Clock,
  DollarSign,
  Leaf,
  ShieldCheck,
  BarChart3,
  Calendar,
  Navigation,
  ArrowUpDown,
  BrainCircuit,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function WesternSydneyUsers() {
  // Define user personas
  const userTypes = [
    {
      id: "sme",
      title: "Small & Medium Enterprises",
      description: "Retail and E-commerce businesses in Western Sydney",
      icon: <Package className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800",
      percentage: 70,
      customers: "Thousands of local retailers and e-commerce businesses",
      growth: "+15% annual growth with Western Sydney expansion",
    },
    {
      id: "warehouse",
      title: "Warehouse & 3PL Providers",
      description: "Logistics operations near Badgerys Creek and Parramatta",
      icon: <Warehouse className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800",
      percentage: 60,
      customers: "Dozens of warehouse operators with new airport demand",
      growth: "+28% projected growth with airport operations",
    },
    {
      id: "manufacturing",
      title: "Manufacturing & Industrial",
      description: "Manufacturers in Blacktown and Wetherill Park",
      icon: <Factory className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-800",
      percentage: 45,
      customers: "Hundreds of manufacturers in Western Sydney's industrial zones",
      growth: "+10% growth tied to export market expansion",
    },
    {
      id: "delivery",
      title: "Local Delivery Services",
      description: "Couriers and small fleets serving Western Sydney",
      icon: <Truck className="h-5 w-5" />,
      color: "bg-green-100 text-green-800",
      percentage: 65,
      customers: "Hundreds of local delivery operators and courier services",
      growth: "+25% growth driven by e-commerce in the region",
    },
    {
      id: "government",
      title: "Government & Public Sector",
      description: "Local councils and NSW transport agencies",
      icon: <Building className="h-5 w-5" />,
      color: "bg-red-100 text-red-800",
      percentage: 35,
      customers: "5-10 key government contracts with high value potential",
      growth: "Steady growth tied to infrastructure development",
    },
  ];

  // Define user roles (different actors)
  const userRoles = [
    {
      id: "warehouse-staff",
      title: "Warehouse Staff",
      description: "Manage inventory, prepare shipments, and coordinate with drivers",
      features: [
        {
          id: 2,
          name: "Predictive Supply Chain Resilience",
          benefit: "Alerts them to stock up or shift inventory before disruptions (e.g., floods)",
        },
        {
          id: 5,
          name: "Multi-Modal Logistics Orchestration",
          benefit: "Guides them on loading for road, drone, or air transport",
        },
        {
          id: 9,
          name: "Real-Time Client Dashboard",
          benefit: "Shows shipment readiness status",
        },
      ],
      workflow: "Use dashboard on warehouse tablets to execute AI recommendations",
      icon: <Warehouse className="h-5 w-5" />,
      painPoints: ["Last-minute rushes", "Unclear instructions", "Frequent errors"],
      benefits: "Fewer last-minute rushes, clearer instructions, reduced errors",
    },
    {
      id: "logistics-managers",
      title: "Logistics Managers",
      description: "Oversee supply chain operations, optimize workflows, and ensure timely deliveries",
      features: [
        {
          id: 1,
          name: "Hyper-Local Route Optimization",
          benefit: "Plans efficient routes for drivers/drones",
        },
        {
          id: 7,
          name: "Digital Twin for Scenario Planning",
          benefit: "Simulates 'what-if' scenarios (e.g., airport delays) for better decisions",
        },
        {
          id: 3,
          name: "Sustainable AI-Driven Operations",
          benefit: "Tracks carbon impact and adjusts operations",
        },
      ],
      workflow: "Access full platform via desktop or mobile app for planning and oversight",
      icon: <User className="h-5 w-5" />,
      painPoints: ["Inefficient routes", "Inability to predict issues", "Environmental compliance"],
      benefits: "Data-driven decisions, cost savings, compliance with green goals",
    },
    {
      id: "drivers",
      title: "Drivers (Human & Autonomous)",
      description: "Deliver goods to clients, either manually or via autonomous vehicles",
      features: [
        {
          id: 1,
          name: "Hyper-Local Route Optimization",
          benefit: "Provides real-time, traffic-adjusted routes via in-vehicle systems",
        },
        {
          id: 8,
          name: "Autonomous Fleet Integration",
          benefit: "Coordinates with autonomous trucks/drones, managing handoffs or maintenance alerts",
        },
        {
          id: 9,
          name: "Real-Time Client Dashboard",
          benefit: "Updates delivery status on the go",
        },
      ],
      workflow: "Use mobile app or vehicle-integrated AI for navigation and updates",
      icon: <Truck className="h-5 w-5" />,
      painPoints: ["Traffic delays", "Inefficient routes", "Communication gaps"],
      benefits: "Less time on the road, safer routes, seamless autonomy transition",
    },
    {
      id: "salespeople",
      title: "Salespeople",
      description: "Sell logistics services to clients, pitch efficiency and cost benefits",
      features: [
        {
          id: 6,
          name: "SME-Centric Customization",
          benefit: "Highlights affordable, tailored options for SMEs",
        },
        {
          id: 9,
          name: "Real-Time Client Dashboard",
          benefit: "Demos actionable insights to prospects",
        },
        {
          id: 3,
          name: "Sustainable AI-Driven Operations",
          benefit: "Emphasizes eco-friendly selling points",
        },
      ],
      workflow: "Use demo dashboards and case studies from the platform in sales meetings",
      icon: <DollarSign className="h-5 w-5" />,
      painPoints: ["Proving ROI", "Meeting diverse client needs", "Competitor differentiation"],
      benefits: "Tangible proof of value, stronger pitches, alignment with client priorities",
    },
    {
      id: "business-owners",
      title: "Business Owners",
      description: "Invest in the solution, oversee ROI, and set strategic goals",
      features: [
        {
          id: 4,
          name: "Integrated Cybersecurity Suite",
          benefit: "Ensures data security, protecting their reputation",
        },
        {
          id: 10,
          name: "Partnerships and Ecosystem Integration",
          benefit: "Leverages grants and local ties for growth",
        },
        {
          id: 9,
          name: "Real-Time Client Dashboard",
          benefit: "Monitors overall performance via executive dashboard",
        },
      ],
      workflow: "Review high-level reports and insights via executive dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      painPoints: ["Cost control", "Investment ROI", "Competitive pressures"],
      benefits: "Data security, local partnerships, comprehensive performance monitoring",
    },
  ];

  // Feature list with details
  const features = [
    {
      id: 1,
      name: "Hyper-Local Route Optimization",
      description: "Real-time route planning with Western Sydney traffic patterns and construction zones",
      icon: <Navigation />,
      benefits: [
        "Reduce fuel costs by up to 25%",
        "Decrease delivery times by 30% in congested areas",
        "Navigate Western Sydney's changing infrastructure landscape",
      ],
      westernSydneyRelevance: "Tailored for Western Sydney's unique mix of industrial areas, residential growth zones, and the M12 corridor",
      idealFor: ["Local Delivery Services", "Logistics Managers", "Warehouse & 3PL Providers"],
    },
    {
      id: 2,
      name: "Predictive Supply Chain Resilience",
      description: "Forecast disruptions specific to Western Sydney weather and infrastructure",
      icon: <AlertTriangle />,
      benefits: [
        "Anticipate flooding impacts on Hawkesbury-Nepean corridor",
        "Prepare for heat waves affecting refrigerated transport",
        "Adjust to Western Sydney Airport construction and road works",
      ],
      westernSydneyRelevance: "Focuses on Western Sydney's unique weather patterns and rapid infrastructure development",
      idealFor: ["Manufacturing & Industrial", "Warehouse Staff", "Government & Public Sector"],
    },
    {
      id: 3,
      name: "Sustainable AI-Driven Operations",
      description: "Reduce carbon footprint while meeting Western Sydney sustainability goals",
      icon: <Leaf />,
      benefits: [
        "Reduce carbon emissions by up to 28%",
        "Meet Western Sydney Council environmental targets",
        "Lower operational costs through efficiency",
      ],
      westernSydneyRelevance: "Aligned with Western Sydney's green infrastructure initiatives and sustainability targets",
      idealFor: ["Manufacturing & Industrial", "Government & Public Sector", "Salespeople"],
    },
    {
      id: 4,
      name: "Integrated Cybersecurity Suite",
      description: "Protect sensitive logistics data with Australian-compliant security",
      icon: <ShieldCheck />,
      benefits: [
        "Australian Privacy Principles compliance",
        "Secure integration with Western Sydney Airport systems",
        "Protection against supply chain cyber threats",
      ],
      westernSydneyRelevance: "Security standards aligned with requirements for Western Sydney Airport and NSW Government contracts",
      idealFor: ["Business Owners", "Warehouse & 3PL Providers", "Government & Public Sector"],
    },
    {
      id: 5,
      name: "Multi-Modal Logistics Orchestration",
      description: "Coordinate across road, rail, air, and drone transport in Western Sydney",
      icon: <ArrowUpDown />,
      benefits: [
        "Seamless integration with Western Sydney Airport freight",
        "Optimize handoffs between transport modes",
        "Real-time visibility across all transport methods",
      ],
      westernSydneyRelevance: "Built for Western Sydney's unique position as a multi-modal hub with the new airport, M12, and rail links",
      idealFor: ["Warehouse & 3PL Providers", "Warehouse Staff", "Logistics Managers"],
    },
    {
      id: 6,
      name: "SME-Centric Customization",
      description: "Affordable, scalable solutions for Western Sydney's small businesses",
      icon: <Package />,
      benefits: [
        "Flexible pricing starting at $5,000/month",
        "Modular features tailored to business size",
        "Quick 2-week implementation for SMEs",
      ],
      westernSydneyRelevance: "Designed for Western Sydney's diverse SME landscape, where 70% of businesses are small",
      idealFor: ["Small & Medium Enterprises", "Salespeople", "Business Owners"],
    },
    {
      id: 7,
      name: "Digital Twin for Scenario Planning",
      description: "Simulate Western Sydney logistics scenarios before implementation",
      icon: <Map />,
      benefits: [
        "Test Western Sydney Airport integration scenarios",
        "Prepare for M12 Motorway traffic patterns",
        "Simulate weather impacts on Penrith-Parramatta corridor",
      ],
      westernSydneyRelevance: "Digital recreation of Western Sydney's unique geography, infrastructure, and business centers",
      idealFor: ["Logistics Managers", "Warehouse & 3PL Providers", "Government & Public Sector"],
    },
    {
      id: 8,
      name: "Autonomous Fleet Integration",
      description: "Prepare for and deploy autonomous vehicles in Western Sydney",
      icon: <Truck />,
      benefits: [
        "Integration with autonomous zones in Western Sydney",
        "Compliance with NSW autonomous vehicle regulations",
        "Phased implementation aligned with infrastructure",
      ],
      westernSydneyRelevance: "Mapped to Western Sydney's dedicated autonomous vehicle testing areas and future-focused infrastructure",
      idealFor: ["Local Delivery Services", "Drivers", "Warehouse & 3PL Providers"],
    },
    {
      id: 9,
      name: "Real-Time Client Dashboard",
      description: "Customizable visualization of logistics operations across Western Sydney",
      icon: <LayoutDashboard />,
      benefits: [
        "Real-time tracking on Western Sydney map overlay",
        "Customizable KPIs for different business types",
        "Mobile-optimized for on-the-go management",
      ],
      westernSydneyRelevance: "Visualization focused on Western Sydney geography and business districts with local landmarks",
      idealFor: ["All User Types", "All Roles"],
    },
    {
      id: 10,
      name: "Partnerships and Ecosystem Integration",
      description: "Connect with Western Sydney businesses, councils, and educational institutions",
      icon: <Users />,
      benefits: [
        "Access to Western Sydney University research",
        "Integration with Western Sydney Airport systems",
        "Participation in Western Sydney innovation grants",
      ],
      westernSydneyRelevance: "Built on partnerships with Western Sydney councils, airport authority, and regional business groups",
      idealFor: ["Business Owners", "Government & Public Sector", "Manufacturing & Industrial"],
    },
  ];

  // Case studies showcasing Western Sydney success stories
  const caseStudies = [
    {
      title: "Penrith Fresh Foods",
      category: "SME Retail",
      challenge: "Struggled with high delivery costs and inconsistent delivery times across the Western Sydney region.",
      solution: "Implemented Hyper-Local Route Optimization and SME-Centric customization package.",
      results: [
        "27% reduction in delivery costs",
        "On-time delivery improved from 72% to 94%",
        "Expanded delivery radius by 15km without adding vehicles"
      ],
      location: "Penrith",
      roi: "243% ROI within 6 months",
      quote: "The system paid for itself in less than two quarters. Our customers love the predictable delivery windows, and we're saving thousands on fuel and overtime.",
      spokesperson: "Sarah Chen, Operations Manager"
    },
    {
      title: "Western Logistics Partners",
      category: "Warehouse & 3PL",
      challenge: "Needed to prepare for Western Sydney Airport integration while managing current operations efficiently.",
      solution: "Deployed Digital Twin for Scenario Planning and Multi-Modal Logistics Orchestration.",
      results: [
        "Successfully simulated 12 airport integration scenarios",
        "Reduced cross-dock processing time by 35%",
        "Decreased empty miles by 42%"
      ],
      location: "Badgerys Creek",
      roi: "186% ROI within 12 months",
      quote: "The digital twin has been transformative in preparing for the airport opening. We've identified and solved problems before they happen, rather than reacting afterward.",
      spokesperson: "Michael Rodriguez, Logistics Director"
    },
    {
      title: "BuildSmart Manufacturing",
      category: "Manufacturing & Industrial",
      challenge: "Frequent supply chain disruptions from weather events and supplier issues affecting production.",
      solution: "Implemented Predictive Supply Chain Resilience and Sustainable AI-Driven Operations.",
      results: [
        "Zero production stoppages in 8 months (down from 7 incidents)",
        "32% reduction in idle time",
        "28% decrease in carbon emissions"
      ],
      location: "Wetherill Park",
      roi: "205% ROI within 9 months",
      quote: "The predictive alerts have given us 3-5 days of lead time on potential disruptions, which is all we need to adjust sourcing or scheduling to stay operational.",
      spokesperson: "David Thompson, Supply Chain Manager"
    },
    {
      title: "Western Express Couriers",
      category: "Local Delivery Services",
      challenge: "Rising fuel costs and difficulty competing with larger delivery services in Western Sydney.",
      solution: "Adopted Hyper-Local Route Optimization and beginning transition to Autonomous Fleet Integration.",
      results: [
        "34% reduction in fuel costs",
        "Increased deliveries per driver by 28%",
        "Successfully piloted 2 autonomous vehicles in limited zones"
      ],
      location: "Liverpool",
      roi: "278% ROI within 6 months",
      quote: "As a small local business, we couldn't afford complex systems before. This solution scaled to our needs and budget while delivering benefits we thought only the big companies could get.",
      spokesperson: "James Patel, Owner"
    },
    {
      title: "Blacktown City Council",
      category: "Government & Public Sector",
      challenge: "Needed to improve municipal service delivery while meeting sustainability targets.",
      solution: "Implemented Sustainable AI-Driven Operations and Partnerships and Ecosystem Integration.",
      results: [
        "22% reduction in municipal fleet emissions",
        "Improved waste collection efficiency by 18%",
        "Integrated with 3 local education initiatives"
      ],
      location: "Blacktown",
      roi: "163% ROI within 12 months",
      quote: "The system has helped us meet our environmental commitments while actually improving service levels to residents. The data insights have transformed our planning processes.",
      spokesperson: "Councillor Emma Wright, Technology Initiative Lead"
    },
  ];

  const [activeTab, setActiveTab] = useState("user-types");
  const [selectedUserType, setSelectedUserType] = useState("sme");
  const [selectedRole, setSelectedRole] = useState("logistics-managers");

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Western Sydney Users</h1>
        <p className="text-muted-foreground mt-2">
          Tailored logistics solutions for Western Sydney's unique business landscape, with particular focus on the upcoming Western Sydney Airport opening in 2026.
        </p>
      </div>

      {/* Key market drivers for Western Sydney */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Population Growth</p>
                <h3 className="text-2xl font-bold">3 Million</h3>
                <p className="text-sm text-muted-foreground">by 2036</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Western Sydney Airport</p>
                <h3 className="text-2xl font-bold">2026</h3>
                <p className="text-sm text-muted-foreground">Opening Date</p>
              </div>
              <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">SME Business Rate</p>
                <h3 className="text-2xl font-bold">70%</h3>
                <p className="text-sm text-muted-foreground">of local businesses</p>
              </div>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Logistics Growth</p>
                <h3 className="text-2xl font-bold">28%</h3>
                <p className="text-sm text-muted-foreground">projected increase</p>
              </div>
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main tabs for different views */}
      <Tabs defaultValue="user-types" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user-types">Target User Types</TabsTrigger>
          <TabsTrigger value="user-roles">User Roles & Workflows</TabsTrigger>
          <TabsTrigger value="case-studies">Western Sydney Case Studies</TabsTrigger>
        </TabsList>

        {/* User Types Tab */}
        <TabsContent value="user-types" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 space-y-4">
              {userTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedUserType === type.id ? "border-primary ring-1 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedUserType(type.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${type.color}`}>
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{type.title}</h3>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {userTypes.find((t) => t.id === selectedUserType)?.icon}
                    <span className="ml-2">
                      {userTypes.find((t) => t.id === selectedUserType)?.title}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {userTypes.find((t) => t.id === selectedUserType)?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Market Size</h3>
                    <p className="text-sm">
                      {userTypes.find((t) => t.id === selectedUserType)?.customers}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Western Sydney Growth Projection</h3>
                    <p className="text-sm">
                      {userTypes.find((t) => t.id === selectedUserType)?.growth}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">Market Penetration Target</h3>
                      <span className="text-sm font-medium">
                        {userTypes.find((t) => t.id === selectedUserType)?.percentage}%
                      </span>
                    </div>
                    <Progress
                      value={userTypes.find((t) => t.id === selectedUserType)?.percentage}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Key Features for This User Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {features
                        .filter((f) =>
                          f.idealFor.includes(
                            userTypes.find((t) => t.id === selectedUserType)?.title || ""
                          )
                        )
                        .map((feature) => (
                          <div
                            key={feature.id}
                            className="flex items-start space-x-2 p-3 border rounded-md"
                          >
                            <div className="p-1 rounded-full bg-primary/10 text-primary mt-0.5">
                              {feature.icon}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                {feature.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {feature.benefits[0]}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Pain Points Addressed</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {selectedUserType === "sme" && (
                        <>
                          <Badge variant="outline" className="justify-start">
                            <DollarSign className="mr-1 h-3 w-3" /> High shipping costs
                          </Badge>
                          <Badge variant="outline" className="justify-start">
                            <Clock className="mr-1 h-3 w-3" /> Unpredictable delays
                          </Badge>
                          <Badge variant="outline" className="justify-start">
                            <BrainCircuit className="mr-1 h-3 w-3" /> Limited tech resources
                          </Badge>
                        </>
                      )}
                      {selectedUserType === "warehouse" && (
                        <>
                          <Badge variant="outline" className="justify-start">
                            <Package className="mr-1 h-3 w-3" /> Inefficient inventory
                          </Badge>
                          <Badge variant="outline" className="justify-start">
                            <Map className="mr-1 h-3 w-3" /> Airport integration
                          </Badge>
                          <Badge variant="outline" className="justify-start">
                            <ShieldCheck className="mr-1 h-3 w-3" /> Data security
                          </Badge>
                        </>
                      )}
                      {selectedUserType === "manufacturing" && (
                        <>
                          <Badge variant="outline" className="justify-start">
                            <AlertTriangle className="mr-1 h-3 w-3" /> Supply disruptions
                          </Badge>
                          <Badge variant="outline" className="justify-start">
                            <DollarSign className="mr-1 h-3 w-3" /> Energy costs
                          </Badge>
                          <Badge variant="outline" className="justify-start">
                            <Leaf className="mr-1 h-3 w-3" /> Compliance pressure
                          </Badge>
                        </>
                      )}
                      {selectedUserType === "delivery" && (
                        <>
                          <Badge variant="outline" className="justify-start">
                            <DollarSign className="mr-1 h-3 w-3" /> Fuel expenses
                          </Badge>
                          <Badge variant="outline" className="justify-start">
                            <Clock className="mr-1 h-3 w-3" /> Traffic delays
                          </Badge>
                          <Badge variant="outline" className="justify-start">
                            <Users className="mr-1 h-3 w-3" /> Scaling capacity
                          </Badge>
                        </>
                      )}
                      {selectedUserType === "government" && (
                        <>
                          <Badge variant="outline" className="justify-start">
                            <Leaf className="mr-1 h-3 w-3" /> Environmental targets
                          </Badge>
                          <Badge variant="outline" className="justify-start">
                            <AlertTriangle className="mr-1 h-3 w-3" /> Disaster preparedness
                          </Badge>
                          <Badge variant="outline" className="justify-start">
                            <Map className="mr-1 h-3 w-3" /> Infrastructure efficiency
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* User Roles Tab */}
        <TabsContent value="user-roles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {userRoles.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedRole === role.id ? "border-primary ring-1 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        {role.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{role.title}</h3>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {userRoles.find((r) => r.id === selectedRole)?.icon}
                    <span className="ml-2">
                      {userRoles.find((r) => r.id === selectedRole)?.title}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {userRoles.find((r) => r.id === selectedRole)?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Key Features Used</h3>
                    <div className="space-y-4">
                      {userRoles
                        .find((r) => r.id === selectedRole)
                        ?.features.map((feature) => (
                          <div
                            key={feature.id}
                            className="flex items-start space-x-3 p-4 border rounded-md"
                          >
                            <div className="p-1.5 rounded-full bg-primary/10 text-primary mt-0.5">
                              {
                                features.find((f) => f.id === feature.id)?.icon
                              }
                            </div>
                            <div>
                              <h4 className="font-medium">{feature.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {feature.benefit}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Daily Workflow</h3>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="text-sm">
                        {userRoles.find((r) => r.id === selectedRole)?.workflow}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Pain Points Addressed</h3>
                    <div className="flex flex-wrap gap-2">
                      {userRoles
                        .find((r) => r.id === selectedRole)
                        ?.painPoints.map((point, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-md"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm">{point}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Western Sydney Context</h3>
                    {selectedRole === "warehouse-staff" && (
                      <p className="text-sm text-muted-foreground">
                        Warehouse staff in Western Sydney face unique challenges with the upcoming airport integration and increasing e-commerce demand. Our tools provide clarity on incoming weather events affecting the Hawkesbury region and simplify coordination with multi-modal transport options.
                      </p>
                    )}
                    {selectedRole === "logistics-managers" && (
                      <p className="text-sm text-muted-foreground">
                        Logistics managers in Western Sydney need to navigate complex infrastructure changes, including the M12 corridor development and Western Sydney Airport construction. Our tools provide specific insights into local traffic patterns and help optimize across the region's multiple transport hubs.
                      </p>
                    )}
                    {selectedRole === "drivers" && (
                      <p className="text-sm text-muted-foreground">
                        Drivers in Western Sydney contend with rapid urban development, changing road conditions, and increasing congestion. Our navigation systems are specifically mapped to Western Sydney's evolving road network and include real-time updates on local construction projects.
                      </p>
                    )}
                    {selectedRole === "salespeople" && (
                      <p className="text-sm text-muted-foreground">
                        Sales teams serving Western Sydney businesses need to demonstrate clear ROI and tailored solutions for the diverse local market. Our platform provides Sydney-specific case studies and customizable demos that showcase local routes and real-world scenarios relevant to prospective clients.
                      </p>
                    )}
                    {selectedRole === "business-owners" && (
                      <p className="text-sm text-muted-foreground">
                        Business owners in Western Sydney are focused on positioning for growth with the upcoming airport while managing current operational costs. Our executive dashboards highlight regional opportunities, local competitive advantages, and integration with Western Sydney's business ecosystem.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Case Studies Tab */}
        <TabsContent value="case-studies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((study, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{study.title}</CardTitle>
                      <CardDescription>{study.category}</CardDescription>
                    </div>
                    <Badge>{study.location}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Challenge</h3>
                    <p className="text-sm text-muted-foreground">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Solution</h3>
                    <p className="text-sm text-muted-foreground">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Results</h3>
                    <ul className="space-y-1">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm italic">{study.quote}</p>
                    <p className="text-sm font-medium mt-2">— {study.spokesperson}</p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {study.roi}
                    </Badge>
                    <Button variant="outline" size="sm">View Full Case Study</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Features Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Key Features for Western Sydney</h2>
          <p className="text-muted-foreground mt-1">
            Solutions specifically designed for Western Sydney's unique logistics landscape
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {features.map((feature) => (
            <AccordionItem
              key={feature.id}
              value={`feature-${feature.id}`}
              className="border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground text-left">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-12">
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Benefits</h4>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Western Sydney Relevance</h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.westernSydneyRelevance}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Ideal For</h4>
                    <div className="flex flex-wrap gap-2">
                      {feature.idealFor.map((user, idx) => (
                        <Badge key={idx} variant="secondary">
                          {user}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Call to Action */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Ready to optimize your Western Sydney logistics?</h2>
              <p>
                Join the growing number of Western Sydney businesses preparing for the region's transportation revolution with the AI Logistics Hub.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">Request Demo</Button>
                <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  View Pricing
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                <p>Tailored for Western Sydney's unique geography and business landscape</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                <p>Ready for Western Sydney Airport integration (2026)</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                <p>Affordable packages starting at $5,000/month</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                <p>Implementation in as little as 2 weeks</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}