import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileX,
  LockKeyhole,
  AreaChart,
  Server,
  Users,
  Mail,
  Globe,
  Shield,
  BarChart3,
  Calendar,
} from "lucide-react";

interface SecurityAlert {
  id: number;
  type: "phishing" | "breach" | "malware" | "suspicious_access" | "other";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  description: string;
  status: "new" | "investigating" | "resolved" | "false_positive";
  affectedSystems: string[];
  mitigationSteps: string[];
  responseTime: string;
}

interface SecurityCompliance {
  id: number;
  framework: "australian_privacy" | "gdpr" | "pci_dss" | "iso_27001" | "custom";
  status: "compliant" | "non_compliant" | "partially_compliant";
  lastAudit: string;
  findings: string[];
  nextAuditDue: string;
  responsibleParty: string;
}

export default function Cybersecurity() {
  const [activeTab, setActiveTab] = useState("alerts");

  // Fetch security alerts
  const { data: securityAlerts, isLoading: isLoadingAlerts } = useQuery<SecurityAlert[]>({
    queryKey: ["/api/security/alerts"]
  });

  // Fetch security compliance
  const { data: securityCompliance, isLoading: isLoadingCompliance } = useQuery<SecurityCompliance[]>({
    queryKey: ["/api/security/compliance"]
  });

  // Security alert severity color mapping
  const severityColorMap: Record<string, string> = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  // Security alert type icon mapping
  const alertTypeIcon: Record<string, React.ReactNode> = {
    phishing: <Mail className="h-5 w-5" />,
    breach: <ShieldAlert className="h-5 w-5" />,
    malware: <FileX className="h-5 w-5" />,
    suspicious_access: <Users className="h-5 w-5" />,
    other: <AlertTriangle className="h-5 w-5" />
  };

  // Security alert status color mapping
  const statusColorMap: Record<string, string> = {
    new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    investigating: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    false_positive: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
  };

  // Compliance status color mapping
  const complianceStatusColorMap: Record<string, string> = {
    compliant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    non_compliant: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    partially_compliant: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
  };

  // Compliance framework readable names
  const frameworkNames: Record<string, string> = {
    australian_privacy: "Australian Privacy Principles",
    gdpr: "General Data Protection Regulation",
    pci_dss: "Payment Card Industry DSS",
    iso_27001: "ISO 27001",
    custom: "Custom Framework"
  };

  // Threat type distribution for mock chart
  const threatDistribution = [
    { type: "Phishing", count: 12 },
    { type: "Malware", count: 8 },
    { type: "Unauthorized Access", count: 5 },
    { type: "Data Breach", count: 2 },
    { type: "Other", count: 4 }
  ];

  // Mock chart components
  const mockSecurityTrendChart = (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <AreaChart className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Security Incidents Trend</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Historical security incident data</p>
      </div>
    </div>
  );

  const mockRiskAssessmentChart = (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Risk Assessment Visualization</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Security risk levels by category</p>
      </div>
    </div>
  );

  const mockComplianceTimeline = (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <Calendar className="h-12 w-12 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Compliance Timeline</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Upcoming audits and certification deadlines</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrated Cybersecurity Suite</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive security monitoring, threat detection, and compliance management.
        </p>
      </div>

      <Tabs defaultValue="alerts" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-50 dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-2xl font-bold">
                    {isLoadingAlerts ? <Skeleton className="h-8 w-16" /> : securityAlerts?.length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 dark:bg-red-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  <span className="text-2xl font-bold">
                    {isLoadingAlerts ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      securityAlerts?.filter(alert => alert.severity === "critical").length || 0
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 dark:bg-amber-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Investigations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-2xl font-bold">
                    {isLoadingAlerts ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      securityAlerts?.filter(alert => alert.status === "investigating").length || 0
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold">
                    {isLoadingAlerts ? <Skeleton className="h-8 w-16" /> : "5"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5" />
                Security Alerts
              </CardTitle>
              <CardDescription>
                Real-time security incidents requiring attention.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAlerts ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {securityAlerts && securityAlerts.map((alert: SecurityAlert) => (
                        <TableRow key={alert.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {alertTypeIcon[alert.type]}
                              <span className="capitalize">{alert.type.replace('_', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{alert.description}</TableCell>
                          <TableCell>
                            <Badge className={severityColorMap[alert.severity]}>
                              {alert.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColorMap[alert.status]}>
                              {alert.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AreaChart className="mr-2 h-5 w-5" />
                  Security Incidents Trend
                </CardTitle>
                <CardDescription>
                  Historical trend of security incidents over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockSecurityTrendChart}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Threat Distribution
                </CardTitle>
                <CardDescription>
                  Distribution of security threats by type.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threatDistribution.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{item.type}</span>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                      <Progress value={(item.count / Math.max(...threatDistribution.map(i => i.count))) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Compliance Status
              </CardTitle>
              <CardDescription>
                Current compliance status across various regulatory frameworks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCompliance ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Framework</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Audit</TableHead>
                        <TableHead>Next Audit Due</TableHead>
                        <TableHead>Responsible Party</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {securityCompliance && securityCompliance.map((item: SecurityCompliance) => (
                        <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{frameworkNames[item.framework]}</TableCell>
                          <TableCell>
                            <Badge className={complianceStatusColorMap[item.status]}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(item.lastAudit).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(item.nextAuditDue).toLocaleDateString()}</TableCell>
                          <TableCell>{item.responsibleParty}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Compliance Timeline
                </CardTitle>
                <CardDescription>
                  Timeline of upcoming compliance deadlines and audit schedules.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockComplianceTimeline}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Compliance Progress
                </CardTitle>
                <CardDescription>
                  Progress towards full compliance across frameworks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Australian Privacy Principles</span>
                      <span className="text-sm font-medium">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">ISO 27001</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">PCI DSS</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">GDPR</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Overall Compliance</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Compliance Action Items
              </CardTitle>
              <CardDescription>
                Required actions to maintain and improve compliance status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <h4 className="font-medium">ISO 27001 Gap Analysis</h4>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete gap analysis for new ISO 27001:2022 requirements.
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                    <span>Due: April 15, 2025</span>
                    <span>Owner: Security Team</span>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <h4 className="font-medium">Data Protection Impact Assessment</h4>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Conduct DPIA for new AI analytics feature as required by GDPR.
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                    <span>Due: March 31, 2025</span>
                    <span>Owner: Privacy Officer</span>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <h4 className="font-medium">Quarterly Penetration Testing</h4>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Conduct quarterly penetration testing as required by PCI DSS.
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                    <span>Due: March 1, 2025</span>
                    <span>Owner: Security Team</span>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <h4 className="font-medium">Privacy Policy Update</h4>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Update privacy policy to reflect changes in Australian Privacy Principles.
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                    <span>Completed: February 28, 2025</span>
                    <span>Owner: Legal Team</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security Risk Overview
                </CardTitle>
                <CardDescription>
                  Overall security risk assessment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        className="text-muted stroke-current" 
                        strokeWidth="10" 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent"
                      ></circle>
                      <circle 
                        className="text-amber-500 stroke-current" 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset="75.4"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">70%</div>
                        <div className="text-xs text-muted-foreground">Risk Mitigated</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Badge className="bg-amber-100 text-amber-800">Medium Risk</Badge>
                    <p className="text-xs text-muted-foreground mt-2">Based on 24 risk factors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Risk Assessment by Category
                </CardTitle>
                <CardDescription>
                  Security risk levels across different categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockRiskAssessmentChart}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Network Security
                </CardTitle>
                <CardDescription>
                  Risk assessment for network infrastructure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Firewall Configuration</span>
                      <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">VPN Security</span>
                      <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Network Monitoring</span>
                      <Badge className="bg-amber-100 text-amber-800">Medium Risk</Badge>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">IoT Device Security</span>
                      <Badge className="bg-orange-100 text-orange-800">High Risk</Badge>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5" />
                  Data Security
                </CardTitle>
                <CardDescription>
                  Risk assessment for data protection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Encryption</span>
                      <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Access Controls</span>
                      <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Data Classification</span>
                      <Badge className="bg-amber-100 text-amber-800">Medium Risk</Badge>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Third-party Data Sharing</span>
                      <Badge className="bg-amber-100 text-amber-800">Medium Risk</Badge>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Human Factor
                </CardTitle>
                <CardDescription>
                  Risk assessment for human-related security issues.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Security Training</span>
                      <Badge className="bg-amber-100 text-amber-800">Medium Risk</Badge>
                    </div>
                    <Progress value={55} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Phishing Awareness</span>
                      <Badge className="bg-amber-100 text-amber-800">Medium Risk</Badge>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Password Practices</span>
                      <Badge className="bg-amber-100 text-amber-800">Medium Risk</Badge>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Access Management</span>
                      <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Risk Mitigation Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered recommendations to mitigate identified security risks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <LockKeyhole className="h-4 w-4 text-red-500" />
                    <h4 className="font-medium">Implement Multi-Factor Authentication</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Deploy MFA for all administrative access to logistics systems to mitigate high risk of unauthorized access.
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                    <Button variant="outline" size="sm">Assign Task</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-amber-500" />
                    <h4 className="font-medium">Enhanced Security Training Program</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Implement quarterly security awareness training focusing on phishing and social engineering attacks.
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge className="bg-amber-100 text-amber-800">Medium Priority</Badge>
                    <Button variant="outline" size="sm">Assign Task</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Server className="h-4 w-4 text-amber-500" />
                    <h4 className="font-medium">Data Classification Protocol</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Implement formal data classification and handling procedures for logistics and customer data.
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge className="bg-amber-100 text-amber-800">Medium Priority</Badge>
                    <Button variant="outline" size="sm">Assign Task</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-red-500" />
                    <h4 className="font-medium">IoT Security Framework</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Develop and implement security framework for IoT devices used in fleet management and warehouses.
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                    <Button variant="outline" size="sm">Assign Task</Button>
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