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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
