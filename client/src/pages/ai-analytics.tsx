import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  LineChart,
  AlertTriangle,
  Layers,
  ArrowRight,
  BrainCircuit,
  Lightbulb,
  BarChart4,
  Gauge,
  CircleDot
} from "lucide-react";

// Define types for the AI Analytics data
interface PredictiveModel {
  id: number;
  name: string;
  description: string;
  type: "demand" | "routing" | "inventory" | "weather" | "custom";
  accuracy: number;
  lastTrained: string;
  status: "active" | "training" | "draft";
  features: string[];
}

interface PredictionInsight {
  id: number;
  title: string;
  description: string;
  importance: "critical" | "high" | "medium" | "low";
  relatedEntity?: string;
}

interface PredictionImpact {
  area: string;
  metric: string;
  impact: "positive" | "negative" | "neutral";
  value: number;
  unit: string;
}

interface ModelPrediction {
  id: number;
  modelId: number;
  modelName: string;
  createdAt: string;
  predictionType: "demand" | "routing" | "inventory" | "weather" | "custom";
  confidence: number;
  insights: PredictionInsight[];
  impactAreas: PredictionImpact[];
}

interface AnomalyDetection {
  id: number;
  title: string;
  description: string;
  detectedAt: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "demand" | "supply" | "logistics" | "weather" | "other";
  status: "new" | "investigating" | "resolved";
  affectedAreas: string[];
}

interface ScenarioVariable {
  name: string;
  value: string | number;
  type: "demand" | "supply" | "logistics" | "weather" | "cost" | "other";
}

interface ScenarioOutcome {
  metric: string;
  value: number;
  change: number;
  impact: "positive" | "negative" | "neutral";
}

interface ScenarioAnalysis {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  variables: ScenarioVariable[];
  outcomes: ScenarioOutcome[];
  probability: number;
}

export default function AIAnalytics() {
  const [activeTab, setActiveTab] = useState("models");
  
  const { data: models = [] } = useQuery<PredictiveModel[]>({
    queryKey: ["/api/ai/models"],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  
  const { data: predictions = [] } = useQuery<ModelPrediction[]>({
    queryKey: ["/api/ai/predictions"],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  
  const { data: anomalies = [] } = useQuery<AnomalyDetection[]>({
    queryKey: ["/api/ai/anomalies"],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  
  const { data: scenarios = [] } = useQuery<ScenarioAnalysis[]>({
    queryKey: ["/api/ai/scenarios"],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  
  // Filter active models
  const activeModels = models.filter((model) => model.status === "active");
  
  // Get recent predictions (last 7 days)
  const recentPredictions = predictions.slice(0, 5);
  
  // Get active anomalies (not resolved)
  const activeAnomalies = anomalies.filter((anomaly) => anomaly.status !== "resolved");
  
  // Get high probability scenarios
  const highProbabilityScenarios = scenarios.filter((scenario) => scenario.probability > 50);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Predictive Analytics</h1>
          <p className="text-muted-foreground">
            Advanced AI-driven insights, predictions, and anomaly detection
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active AI Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeModels.length}</div>
            <p className="text-xs text-muted-foreground">
              {models.length - activeModels.length} in training/draft
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Predictions</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentPredictions.length}</div>
            <p className="text-xs text-muted-foreground">
              Avg. confidence: {recentPredictions.length > 0 
                ? Math.round(recentPredictions.reduce((acc, pred) => acc + pred.confidence, 0) / recentPredictions.length) 
                : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAnomalies.length}</div>
            <p className="text-xs text-muted-foreground">
              {anomalies.filter((a) => a.status === "investigating").length} under investigation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scenario Analyses</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scenarios.length}</div>
            <p className="text-xs text-muted-foreground">
              {highProbabilityScenarios.length} high probability
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" /> AI Models
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" /> Predictions
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Anomalies
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" /> Scenarios
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{model.name}</CardTitle>
                    <Badge variant={
                      model.status === "active" ? "default" : 
                      model.status === "training" ? "secondary" : "outline"
                    }>
                      {model.status}
                    </Badge>
                  </div>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Accuracy</span>
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{model.accuracy}%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Model Type</span>
                        <span className="font-medium capitalize">{model.type}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Last Trained</span>
                        <span className="font-medium">{new Date(model.lastTrained).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1">Features</div>
                      <div className="flex flex-wrap gap-1">
                        {model.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {predictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{prediction.modelName} Prediction</CardTitle>
                    <Badge className="capitalize">{prediction.predictionType}</Badge>
                  </div>
                  <CardDescription>Generated on {new Date(prediction.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Confidence Level</span>
                      <span className="font-semibold">{prediction.confidence}%</span>
                    </div>
                    <Progress value={prediction.confidence} className="h-2" />
                    
                    {prediction.insights && prediction.insights.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Key Insights</div>
                        <ScrollArea className="h-24 w-full rounded-md border p-2">
                          {prediction.insights.map((insight) => (
                            <div key={insight.id} className="mb-2 last:mb-0">
                              <div className="flex items-start gap-2">
                                <CircleDot className={`h-4 w-4 mt-0.5 ${
                                  insight.importance === "critical" ? "text-red-500" :
                                  insight.importance === "high" ? "text-orange-500" :
                                  insight.importance === "medium" ? "text-yellow-500" :
                                  "text-blue-500"
                                }`} />
                                <div>
                                  <div className="text-sm font-medium">{insight.title}</div>
                                  <div className="text-xs text-muted-foreground">{insight.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                    
                    {prediction.impactAreas && prediction.impactAreas.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-1">Impact Areas</div>
                        <div className="grid grid-cols-2 gap-2">
                          {prediction.impactAreas.map((impact, index) => (
                            <div key={index} className="text-xs border rounded-md p-2">
                              <div className="font-medium">{impact.area}</div>
                              <div className="flex items-center gap-1">
                                <span className={`${
                                  impact.impact === "positive" ? "text-green-500" :
                                  impact.impact === "negative" ? "text-red-500" :
                                  "text-gray-500"
                                }`}>
                                  {impact.value}{impact.unit}
                                </span>
                                <span>on {impact.metric}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="anomalies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {anomalies.map((anomaly) => (
              <Card key={anomaly.id} className={`${
                anomaly.severity === "critical" ? "border-red-500 border-2" :
                anomaly.severity === "high" ? "border-orange-500 border-2" :
                anomaly.severity === "medium" ? "border-yellow-500 border" :
                "border"
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{anomaly.title}</CardTitle>
                    <Badge variant={
                      anomaly.status === "new" ? "destructive" :
                      anomaly.status === "investigating" ? "default" :
                      "outline"
                    }>
                      {anomaly.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Detected at {new Date(anomaly.detectedAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">{anomaly.description}</div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {anomaly.category}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {anomaly.severity} severity
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium mb-1">Affected Areas</div>
                      <div className="flex flex-wrap gap-1">
                        {anomaly.affectedAreas.map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {scenarios.map((scenario) => (
              <Card key={scenario.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{scenario.name}</CardTitle>
                    <div className="bg-primary/10 text-primary rounded-md px-2 py-1 text-sm font-medium">
                      {scenario.probability}% probability
                    </div>
                  </div>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Scenario Variables</div>
                      <div className="grid grid-cols-2 gap-2">
                        {scenario.variables.map((variable, index) => (
                          <div key={index} className="text-xs border rounded-md p-2">
                            <div className="font-medium">{variable.name}</div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground capitalize">{variable.type}</span>
                              <span className="font-medium">{variable.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Predicted Outcomes</div>
                      <div className="space-y-2">
                        {scenario.outcomes.map((outcome, index) => (
                          <div key={index} className="flex items-center justify-between text-sm border-b pb-1 last:border-0">
                            <span>{outcome.metric}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{outcome.value}</span>
                              <span className={`text-xs ${
                                outcome.impact === "positive" ? "text-green-500" :
                                outcome.impact === "negative" ? "text-red-500" :
                                "text-gray-500"
                              }`}>
                                {outcome.change > 0 ? "+" : ""}{outcome.change}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}