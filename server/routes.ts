import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { webSocketManager } from "./websocket-simplified";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Dashboard endpoints
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });
  
  // Legacy endpoint for backward compatibility
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

  // Order Management endpoints
  app.get("/api/orders", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const orders = await storage.getOrders(status);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      // Log the raw request body for debugging
      console.log("Order creation attempt with body:", JSON.stringify(req.body, null, 2));
      
      // Define the order schema with clear validation
      const orderSchema = z.object({
        orderNumber: z.string(),
        customerName: z.string(),
        customerType: z.enum(["retail", "wholesale", "distributor", "internal"]),
        customerLocation: z.string(),
        createdAt: z.string(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "returned"]),
        items: z.array(z.any()).optional().default([]),
        totalValue: z.number(),
        priority: z.enum(["standard", "express", "urgent"]),
        notes: z.string().default(""),
        estimatedDeliveryDate: z.string(),
        actualDeliveryDate: z.string().optional(),
        assignedShipmentId: z.string().optional(),
        paymentStatus: z.enum(["pending", "paid", "partially_paid", "refunded"]),
        invoiceNumber: z.string().optional()
      });

      // Attempt to parse and validate the order data
      const validatedData = orderSchema.parse(req.body);
      console.log("Validation passed, creating order with:", JSON.stringify(validatedData, null, 2));
      
      // Create the order
      const newOrder = await storage.createOrder(validatedData);
      console.log("Order created successfully:", JSON.stringify(newOrder, null, 2));
      
      // Return the new order
      res.status(201).json(newOrder);
    } catch (error) {
      // Handle validation errors with detailed information
      if (error instanceof z.ZodError) {
        console.error("Order validation failed:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          message: "Invalid order data", 
          errors: error.errors 
        });
      }
      
      // Handle other errors
      console.error("Failed to create order:", error);
      res.status(500).json({ 
        message: "Failed to create order", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const orderPartialSchema = z.object({
        orderNumber: z.string().optional(),
        customerName: z.string().optional(),
        customerType: z.enum(["retail", "wholesale", "distributor", "internal"]).optional(),
        customerLocation: z.string().optional(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "returned"]).optional(),
        totalValue: z.number().optional(),
        priority: z.enum(["standard", "express", "urgent"]).optional(),
        notes: z.string().optional().or(z.literal("")),
        estimatedDeliveryDate: z.string().optional(),
        actualDeliveryDate: z.string().optional(),
        assignedShipmentId: z.string().optional(),
        paymentStatus: z.enum(["pending", "paid", "partially_paid", "refunded"]).optional(),
        invoiceNumber: z.string().optional()
      });

      const validatedData = orderPartialSchema.parse(req.body);
      const updatedOrder = await storage.updateOrder(id, validatedData);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteOrder(id);
      
      if (!success) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

  app.get("/api/orders/:orderId/items", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const items = await storage.getOrderItems(orderId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order items" });
    }
  });

  app.post("/api/order-items", async (req, res) => {
    try {
      const itemSchema = z.object({
        productId: z.number(),
        productName: z.string(),
        productSKU: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
        totalPrice: z.number(),
        warehouseLocation: z.string().optional(),
        status: z.enum(["pending", "allocated", "picked", "packed", "shipped"])
      });

      const validatedData = itemSchema.parse(req.body);
      const newItem = await storage.createOrderItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order item" });
    }
  });

  app.patch("/api/order-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const itemPartialSchema = z.object({
        productId: z.number().optional(),
        productName: z.string().optional(),
        productSKU: z.string().optional(),
        quantity: z.number().optional(),
        unitPrice: z.number().optional(),
        totalPrice: z.number().optional(),
        warehouseLocation: z.string().optional(),
        status: z.enum(["pending", "allocated", "picked", "packed", "shipped"]).optional()
      });

      const validatedData = itemPartialSchema.parse(req.body);
      const updatedItem = await storage.updateOrderItem(id, validatedData);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Order item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order item" });
    }
  });

  app.get("/api/return-requests", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const returnRequests = await storage.getReturnRequests(status);
      res.json(returnRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch return requests" });
    }
  });

  app.get("/api/return-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const returnRequest = await storage.getReturnRequestById(id);
      
      if (!returnRequest) {
        return res.status(404).json({ message: "Return request not found" });
      }
      
      res.json(returnRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch return request" });
    }
  });

  app.post("/api/return-requests", async (req, res) => {
    try {
      const returnRequestSchema = z.object({
        orderId: z.number(),
        orderNumber: z.string(),
        customerName: z.string(),
        requestDate: z.string(),
        status: z.enum(["requested", "approved", "received", "inspected", "processed", "rejected"]),
        reason: z.enum(["damaged", "incorrect_item", "unwanted", "defective", "other"]),
        items: z.array(z.any()).optional().default([]),
        returnMethod: z.enum(["pickup", "drop_off", "mail"]),
        returnShippingLabel: z.string().optional(),
        resolutionType: z.enum(["refund", "exchange", "store_credit"]).optional(),
        notes: z.string().optional()
      });

      const validatedData = returnRequestSchema.parse(req.body);
      const newReturnRequest = await storage.createReturnRequest(validatedData);
      res.status(201).json(newReturnRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid return request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create return request" });
    }
  });

  app.patch("/api/return-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const returnRequestPartialSchema = z.object({
        status: z.enum(["requested", "approved", "received", "inspected", "processed", "rejected"]).optional(),
        returnShippingLabel: z.string().optional(),
        resolutionType: z.enum(["refund", "exchange", "store_credit"]).optional(),
        notes: z.string().optional()
      });

      const validatedData = returnRequestPartialSchema.parse(req.body);
      const updatedReturnRequest = await storage.updateReturnRequest(id, validatedData);
      
      if (!updatedReturnRequest) {
        return res.status(404).json({ message: "Return request not found" });
      }
      
      res.json(updatedReturnRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid return request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update return request" });
    }
  });

  app.get("/api/return-requests/:returnId/items", async (req, res) => {
    try {
      const returnId = parseInt(req.params.returnId);
      const items = await storage.getReturnItems(returnId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch return items" });
    }
  });

  app.post("/api/return-items", async (req, res) => {
    try {
      const returnItemSchema = z.object({
        orderItemId: z.number(),
        productName: z.string(),
        quantity: z.number(),
        reason: z.string(),
        condition: z.enum(["unopened", "opened", "damaged", "defective"]),
        status: z.enum(["pending", "approved", "received", "rejected"]),
        resolution: z.string().optional()
      });

      const validatedData = returnItemSchema.parse(req.body);
      const newReturnItem = await storage.createReturnItem(validatedData);
      res.status(201).json(newReturnItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid return item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create return item" });
    }
  });

  app.patch("/api/return-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const returnItemPartialSchema = z.object({
        quantity: z.number().optional(),
        reason: z.string().optional(),
        condition: z.enum(["unopened", "opened", "damaged", "defective"]).optional(),
        status: z.enum(["pending", "approved", "received", "rejected"]).optional(),
        resolution: z.string().optional()
      });

      const validatedData = returnItemPartialSchema.parse(req.body);
      const updatedReturnItem = await storage.updateReturnItem(id, validatedData);
      
      if (!updatedReturnItem) {
        return res.status(404).json({ message: "Return item not found" });
      }
      
      res.json(updatedReturnItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid return item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update return item" });
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

  // 1. Hyper-Local Route Optimization with Real-Time Adaptation
  app.get("/api/hyper-local/routes", async (req, res) => {
    try {
      const routes = await storage.getHyperLocalRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hyper-local routes" });
    }
  });

  app.get("/api/hyper-local/routes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const route = await storage.getHyperLocalRouteById(id);
      
      if (!route) {
        return res.status(404).json({ message: "Hyper-local route not found" });
      }
      
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hyper-local route" });
    }
  });

  app.get("/api/hyper-local/construction-zones", async (req, res) => {
    try {
      const region = req.query.region as string | undefined;
      const zones = await storage.getConstructionZones(region);
      res.json(zones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch construction zones" });
    }
  });

  app.patch("/api/hyper-local/routes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const routeSchema = z.object({
        name: z.string().optional(),
        status: z.enum(["active", "scheduled", "completed"]).optional(),
        region: z.string().optional(),
        trafficConditions: z.enum(["light", "moderate", "heavy", "gridlock"]).optional(),
        weatherConditions: z.string().optional(),
        constructionZones: z.array(z.object({
          id: z.number(),
          name: z.string(),
          latitude: z.number(),
          longitude: z.number(),
          startDate: z.string(),
          endDate: z.string(),
          impact: z.enum(["low", "medium", "high"]),
          description: z.string()
        })).optional(),
        fuelSavings: z.string().optional(),
        timeReduction: z.string().optional(),
        routeEfficiency: z.number().optional(),
        edgeDeviceStatus: z.enum(["online", "offline", "degraded"]).optional(),
      });

      const validatedData = routeSchema.parse(req.body);
      const updatedRoute = await storage.updateRouteWithRealTimeData(id, validatedData);
      res.json(updatedRoute);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid route data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update hyper-local route" });
    }
  });

  // 2. Predictive Supply Chain Resilience
  app.get("/api/resilience/forecasts", async (req, res) => {
    try {
      const forecasts = await storage.getResilienceForecasts();
      res.json(forecasts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resilience forecasts" });
    }
  });

  app.get("/api/resilience/forecasts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const forecast = await storage.getResilienceForecastById(id);
      
      if (!forecast) {
        return res.status(404).json({ message: "Resilience forecast not found" });
      }
      
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resilience forecast" });
    }
  });

  app.get("/api/resilience/inventory-recommendations", async (req, res) => {
    try {
      const forecastId = req.query.forecastId ? parseInt(req.query.forecastId as string) : undefined;
      const recommendations = await storage.getInventoryRecommendations(forecastId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory recommendations" });
    }
  });

  app.post("/api/resilience/forecasts", async (req, res) => {
    try {
      const forecastSchema = z.object({
        name: z.string(),
        forecastType: z.enum(["demand", "disaster", "delay"]),
        probability: z.number(),
        impact: z.enum(["low", "medium", "high", "critical"]),
        timeWindow: z.string(),
        affectedRegions: z.array(z.string()),
        suggestedActions: z.array(z.string()),
        alternateRoutes: z.array(z.number()),
        inventoryRecommendations: z.array(z.object({
          id: z.number(),
          product: z.string(),
          currentLevel: z.number(),
          recommendedLevel: z.number(),
          priority: z.enum(["low", "medium", "high"]),
          location: z.string(),
          rationale: z.string()
        })),
        accuracy: z.number()
      });

      const validatedData = forecastSchema.parse(req.body);
      const newForecast = await storage.createResilienceForecast(validatedData);
      res.status(201).json(newForecast);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid forecast data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create resilience forecast" });
    }
  });

  // 3. Sustainable AI-Driven Operations
  app.get("/api/sustainability/metrics", async (req, res) => {
    try {
      const metrics = await storage.getSustainabilityMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sustainability metrics" });
    }
  });

  app.get("/api/sustainability/recommendations", async (req, res) => {
    try {
      const recommendations = await storage.getSustainabilityRecommendations();
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sustainability recommendations" });
    }
  });

  app.patch("/api/sustainability/metrics", async (req, res) => {
    try {
      const metricsSchema = z.object({
        totalCarbonEmissions: z.number().optional(),
        emissionReduction: z.string().optional(),
        energyEfficiency: z.number().optional(),
        emptyMilesPercentage: z.number().optional(),
        carbonOffsets: z.number().optional(),
        sustainabilityScore: z.number().optional(),
        recommendations: z.array(z.object({
          id: z.number(),
          title: z.string(),
          description: z.string(),
          potentialImpact: z.string(),
          difficulty: z.enum(["easy", "medium", "complex"]),
          timeToImplement: z.string(),
          costSavings: z.string()
        })).optional()
      });

      const validatedData = metricsSchema.parse(req.body);
      const updatedMetrics = await storage.updateSustainabilityMetrics(validatedData);
      res.json(updatedMetrics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid metrics data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update sustainability metrics" });
    }
  });

  // 4. Integrated Cybersecurity Suite
  app.get("/api/security/alerts", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const alerts = await storage.getSecurityAlerts(status);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch security alerts" });
    }
  });

  app.patch("/api/security/alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const alertSchema = z.object({
        severity: z.enum(["low", "medium", "high", "critical"]).optional(),
        status: z.enum(["new", "investigating", "resolved", "false_positive"]).optional(),
        description: z.string().optional(),
        mitigationSteps: z.array(z.string()).optional(),
        responseTime: z.string().optional()
      });

      const validatedData = alertSchema.parse(req.body);
      const updatedAlert = await storage.updateSecurityAlert(id, validatedData);
      
      if (!updatedAlert) {
        return res.status(404).json({ message: "Security alert not found" });
      }
      
      res.json(updatedAlert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update security alert" });
    }
  });

  app.get("/api/security/compliance", async (req, res) => {
    try {
      const compliance = await storage.getSecurityCompliance();
      res.json(compliance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch security compliance" });
    }
  });

  // 5. Multi-Modal Logistics Orchestration
  app.get("/api/multi-modal/routes", async (req, res) => {
    try {
      const routes = await storage.getMultiModalRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch multi-modal routes" });
    }
  });

  app.get("/api/multi-modal/routes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const route = await storage.getMultiModalRouteById(id);
      
      if (!route) {
        return res.status(404).json({ message: "Multi-modal route not found" });
      }
      
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch multi-modal route" });
    }
  });

  app.get("/api/multi-modal/routes/:id/segments", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const segments = await storage.getTransportSegments(id);
      res.json(segments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transport segments" });
    }
  });

  app.post("/api/multi-modal/routes", async (req, res) => {
    try {
      const routeSchema = z.object({
        name: z.string(),
        status: z.enum(["planned", "in_progress", "completed"]),
        originType: z.enum(["warehouse", "airport", "port", "distribution_center"]),
        destinationType: z.enum(["warehouse", "airport", "port", "distribution_center", "customer"]),
        transportModes: z.array(z.object({
          id: z.number(),
          mode: z.enum(["truck", "drone", "air_freight", "rail", "last_mile"]),
          origin: z.string(),
          destination: z.string(),
          distance: z.string(),
          duration: z.string(),
          cost: z.string(),
          status: z.enum(["pending", "in_transit", "completed", "delayed"]),
          carrier: z.string()
        })),
        totalDistance: z.string(),
        totalDuration: z.string(),
        totalCost: z.string(),
        co2Emissions: z.string(),
        reliability: z.number()
      });

      const validatedData = routeSchema.parse(req.body);
      const newRoute = await storage.createMultiModalRoute(validatedData);
      res.status(201).json(newRoute);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid route data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create multi-modal route" });
    }
  });

  // 6. SME-Centric Customization and Affordability
  app.get("/api/sme/clients", async (req, res) => {
    try {
      const clients = await storage.getSMEClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SME clients" });
    }
  });

  app.get("/api/sme/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getSMEClientById(id);
      
      if (!client) {
        return res.status(404).json({ message: "SME client not found" });
      }
      
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SME client" });
    }
  });

  app.get("/api/sme/subscription-tiers", async (req, res) => {
    try {
      const tiers = await storage.getSubscriptionTiers();
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription tiers" });
    }
  });

  // 7. Digital Twin for Scenario Planning
  app.get("/api/digital-twins", async (req, res) => {
    try {
      const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : undefined;
      const twins = await storage.getDigitalTwins(clientId);
      res.json(twins);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch digital twins" });
    }
  });

  app.get("/api/digital-twins/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const twin = await storage.getDigitalTwinById(id);
      
      if (!twin) {
        return res.status(404).json({ message: "Digital twin not found" });
      }
      
      res.json(twin);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch digital twin" });
    }
  });

  app.post("/api/digital-twins/:id/scenarios", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const scenarioSchema = z.object({
        name: z.string(),
        description: z.string(),
        parameters: z.record(z.any())
      });

      const validatedData = scenarioSchema.parse(req.body);
      const newScenario = await storage.runDigitalTwinScenario(id, {
        ...validatedData,
        createdAt: new Date().toISOString(),
        status: "pending"
      });
      
      res.status(201).json(newScenario);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scenario data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to run digital twin scenario" });
    }
  });

  // 8. Autonomous Fleet Integration
  app.get("/api/autonomous/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getAutonomousVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch autonomous vehicles" });
    }
  });

  app.get("/api/autonomous/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getAutonomousVehicleById(id);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Autonomous vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch autonomous vehicle" });
    }
  });

  app.get("/api/autonomous/fleet-metrics", async (req, res) => {
    try {
      const metrics = await storage.getFleetMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fleet metrics" });
    }
  });

  app.patch("/api/autonomous/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicleSchema = z.object({
        status: z.enum(["idle", "loading", "en_route", "unloading", "charging", "maintenance"]).optional(),
        currentLocation: z.object({
          lat: z.number(),
          lng: z.number()
        }).optional(),
        batteryLevel: z.number().optional(),
        nextMaintenance: z.string().optional(),
        currentRoute: z.number().nullable().optional()
      });

      const validatedData = vehicleSchema.parse(req.body);
      const updatedVehicle = await storage.updateAutonomousVehicle(id, validatedData);
      
      if (!updatedVehicle) {
        return res.status(404).json({ message: "Autonomous vehicle not found" });
      }
      
      res.json(updatedVehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vehicle data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update autonomous vehicle" });
    }
  });

  // 9. Real-Time Client Dashboard with AI Insights
  app.get("/api/dashboard/insights", async (req, res) => {
    try {
      const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : undefined;
      const insights = await storage.getDashboardInsights(clientId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard insights" });
    }
  });

  app.get("/api/dashboard/settings/:clientId", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const settings = await storage.getClientDashboardSettings(clientId);
      
      if (!settings) {
        return res.status(404).json({ message: "Dashboard settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard settings" });
    }
  });

  app.patch("/api/dashboard/settings/:clientId", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const settingsSchema = z.object({
        visibleWidgets: z.array(z.string()).optional(),
        refreshInterval: z.number().optional(),
        alertThresholds: z.record(z.number()).optional(),
        favoriteReports: z.array(z.number()).optional(),
        customKpis: z.array(z.string()).optional()
      });

      const validatedData = settingsSchema.parse(req.body);
      const updatedSettings = await storage.updateClientDashboardSettings(clientId, validatedData);
      
      if (!updatedSettings) {
        return res.status(404).json({ message: "Dashboard settings not found" });
      }
      
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update dashboard settings" });
    }
  });

  // 10. Partnerships and Ecosystem Integration
  app.get("/api/partnerships", async (req, res) => {
    try {
      const partnerships = await storage.getPartnerships();
      res.json(partnerships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partnerships" });
    }
  });

  app.get("/api/partnerships/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const partnership = await storage.getPartnershipById(id);
      
      if (!partnership) {
        return res.status(404).json({ message: "Partnership not found" });
      }
      
      res.json(partnership);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partnership" });
    }
  });

  app.get("/api/grant-applications", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const applications = await storage.getGrantApplications(status);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grant applications" });
    }
  });

  app.post("/api/partnerships", async (req, res) => {
    try {
      const partnershipSchema = z.object({
        partnerName: z.string(),
        partnerType: z.enum(["university", "government", "technology", "logistics", "other"]),
        status: z.enum(["active", "pending", "completed"]),
        startDate: z.string(),
        endDate: z.string().nullable(),
        projectFocus: z.array(z.string()),
        contactPerson: z.string(),
        dataShared: z.array(z.string()),
        benefitsRealized: z.array(z.string())
      });

      const validatedData = partnershipSchema.parse(req.body);
      const newPartnership = await storage.createPartnership(validatedData);
      res.status(201).json(newPartnership);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid partnership data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create partnership" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Initialize WebSocket server for real-time updates
  webSocketManager.initialize(httpServer);
  log('WebSocket server initialized for real-time client dashboard updates', 'server');

  return httpServer;
}
