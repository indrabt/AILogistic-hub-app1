import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Dashboard endpoints
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getSupplyChainLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.get("/api/weather/alerts", async (req, res) => {
    try {
      const alerts = await storage.getWeatherAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather alerts" });
    }
  });

  app.get("/api/forecast", async (req, res) => {
    try {
      const forecast = await storage.getDemandForecast();
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forecast data" });
    }
  });

  app.get("/api/routes/optimizations", async (req, res) => {
    try {
      const optimizations = await storage.getRouteOptimizations();
      res.json(optimizations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch route optimizations" });
    }
  });

  app.get("/api/routes/metrics", async (req, res) => {
    try {
      const metrics = await storage.getRouteMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch route metrics" });
    }
  });

  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getRecentActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Route optimization endpoints
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });

  app.get("/api/routes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const route = await storage.getRouteById(id);
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch route" });
    }
  });

  // Supply chain endpoints
  app.get("/api/supply-chain/nodes", async (req, res) => {
    try {
      const nodes = await storage.getSupplyChainNodes();
      res.json(nodes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supply chain nodes" });
    }
  });

  app.get("/api/shipments", async (req, res) => {
    try {
      const shipments = await storage.getShipments();
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });

  app.get("/api/inventory/alerts", async (req, res) => {
    try {
      const alerts = await storage.getInventoryAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory alerts" });
    }
  });

  // Demand forecasting endpoints
  app.get("/api/forecast/products", async (req, res) => {
    try {
      const category = req.query.category as string;
      const products = await storage.getProductForecasts(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product forecasts" });
    }
  });

  // Weather impact endpoints
  app.get("/api/weather/events", async (req, res) => {
    try {
      const events = await storage.getWeatherEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather events" });
    }
  });

  app.get("/api/weather/metrics", async (req, res) => {
    try {
      const metrics = await storage.getWeatherImpactMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather impact metrics" });
    }
  });

  app.get("/api/weather/alternative-routes", async (req, res) => {
    try {
      const routes = await storage.getAlternativeRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alternative routes" });
    }
  });

  // Reports endpoints
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Settings endpoints
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const settings = req.body;
      const updatedSettings = await storage.updateUserSettings(settings);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user settings" });
    }
  });

  // AI Predictive Analytics endpoints
  app.get("/api/ai/models", async (req, res) => {
    try {
      const models = await storage.getPredictiveModels();
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI models" });
    }
  });

  app.get("/api/ai/models/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const model = await storage.getPredictiveModelById(id);
      if (!model) {
        return res.status(404).json({ message: "AI model not found" });
      }
      res.json(model);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI model" });
    }
  });

  app.post("/api/ai/models", async (req, res) => {
    try {
      const modelSchema = z.object({
        name: z.string(),
        description: z.string(),
        type: z.enum(["demand", "routing", "inventory", "weather", "custom"]),
        accuracy: z.number(),
        lastTrained: z.string(),
        status: z.enum(["active", "training", "draft"]),
        features: z.array(z.string())
      });

      const validatedData = modelSchema.parse(req.body);
      const newModel = await storage.createPredictiveModel(validatedData);
      res.status(201).json(newModel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid model data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI model" });
    }
  });

  app.patch("/api/ai/models/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const modelPartialSchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        type: z.enum(["demand", "routing", "inventory", "weather", "custom"]).optional(),
        accuracy: z.number().optional(),
        lastTrained: z.string().optional(),
        status: z.enum(["active", "training", "draft"]).optional(),
        features: z.array(z.string()).optional()
      });

      const validatedData = modelPartialSchema.parse(req.body);
      const updatedModel = await storage.updatePredictiveModel(id, validatedData);
      
      if (!updatedModel) {
        return res.status(404).json({ message: "AI model not found" });
      }
      
      res.json(updatedModel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid model data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update AI model" });
    }
  });

  app.delete("/api/ai/models/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePredictiveModel(id);
      
      if (!success) {
        return res.status(404).json({ message: "AI model not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete AI model" });
    }
  });

  app.get("/api/ai/predictions", async (req, res) => {
    try {
      const modelId = req.query.modelId ? parseInt(req.query.modelId as string) : undefined;
      const predictions = await storage.getModelPredictions(modelId);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI predictions" });
    }
  });

  app.get("/api/ai/predictions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const prediction = await storage.getModelPredictionById(id);
      
      if (!prediction) {
        return res.status(404).json({ message: "AI prediction not found" });
      }
      
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI prediction" });
    }
  });

  app.post("/api/ai/predictions", async (req, res) => {
    try {
      const predictionSchema = z.object({
        modelId: z.number(),
        modelName: z.string(),
        createdAt: z.string(),
        predictionType: z.enum(["demand", "routing", "inventory", "weather", "custom"]),
        confidence: z.number(),
        insights: z.array(z.object({
          id: z.number(),
          title: z.string(),
          description: z.string(),
          importance: z.enum(["critical", "high", "medium", "low"]),
          relatedEntity: z.string().optional()
        })),
        impactAreas: z.array(z.object({
          area: z.string(),
          metric: z.string(),
          impact: z.enum(["positive", "negative", "neutral"]),
          value: z.number(),
          unit: z.string()
        }))
      });

      const validatedData = predictionSchema.parse(req.body);
      const newPrediction = await storage.createModelPrediction(validatedData);
      res.status(201).json(newPrediction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid prediction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI prediction" });
    }
  });

  app.get("/api/ai/anomalies", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const anomalies = await storage.getAnomalyDetections(status);
      res.json(anomalies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch anomalies" });
    }
  });

  app.patch("/api/ai/anomalies/:id/resolve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const schema = z.object({
        resolution: z.string()
      });

      const { resolution } = schema.parse(req.body);
      const updatedAnomaly = await storage.resolveAnomaly(id, resolution);
      
      if (!updatedAnomaly) {
        return res.status(404).json({ message: "Anomaly not found" });
      }
      
      res.json(updatedAnomaly);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resolution data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to resolve anomaly" });
    }
  });

  app.get("/api/ai/scenarios", async (req, res) => {
    try {
      const scenarios = await storage.getScenarioAnalyses();
      res.json(scenarios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scenarios" });
    }
  });

  app.get("/api/ai/scenarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const scenario = await storage.getScenarioAnalysisById(id);
      
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      
      res.json(scenario);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scenario" });
    }
  });

  app.post("/api/ai/scenarios", async (req, res) => {
    try {
      const scenarioSchema = z.object({
        name: z.string(),
        description: z.string(),
        createdAt: z.string(),
        variables: z.array(z.object({
          name: z.string(),
          value: z.union([z.string(), z.number()]),
          type: z.enum(["demand", "supply", "logistics", "weather", "cost", "other"])
        })),
        outcomes: z.array(z.object({
          metric: z.string(),
          value: z.number(),
          change: z.number(),
          impact: z.enum(["positive", "negative", "neutral"])
        })),
        probability: z.number()
      });

      const validatedData = scenarioSchema.parse(req.body);
      const newScenario = await storage.createScenarioAnalysis(validatedData);
      res.status(201).json(newScenario);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scenario data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create scenario" });
    }
  });

  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const analysisSchema = z.object({
        type: z.string(),
        parameters: z.record(z.any()).optional()
      });

      const validatedData = analysisSchema.parse(req.body);
      const result = await storage.runPredictiveAnalysis(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid analysis request", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to run analysis" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
