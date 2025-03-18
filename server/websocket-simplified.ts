/**
 * Simplified WebSocket Server for Real-Time Updates
 * 
 * This module provides real-time updates to clients via WebSockets.
 * It ensures delivery status updates with ≤5-second latency.
 */

import { Server as HttpServer } from 'http';
import * as WebSocket from 'ws';
import { log } from './vite';
import { storage } from './storage';

export class WebSocketManager {
  private wsServer: WebSocket.Server | null = null;
  private clients: WebSocket[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  initialize(httpServer: HttpServer) {
    if (this.wsServer) {
      return;
    }

    try {
      this.wsServer = new WebSocket.Server({ 
        server: httpServer,
        path: '/ws'
      });

      this.wsServer.on('connection', (ws: WebSocket) => {
        log('WebSocket connection established', 'websocket');
        
        // Add to clients list
        this.clients.push(ws);
        
        // Welcome message
        this.sendMessage(ws, {
          type: 'SYSTEM_MESSAGE',
          message: 'Connected to Western Sydney AI Logistics Hub',
          timestamp: new Date().toISOString()
        });
        
        // Handle incoming messages
        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message.toString());
            log(`WebSocket message received: ${JSON.stringify(data)}`, 'websocket');
            
            // Handle client messages here
          } catch (error) {
            log(`Error parsing WebSocket message: ${error}`, 'websocket');
          }
        });
        
        // Handle disconnection
        ws.on('close', () => {
          this.clients = this.clients.filter(client => client !== ws);
          log(`WebSocket connection closed. Active connections: ${this.clients.length}`, 'websocket');
        });
        
        // Handle errors
        ws.on('error', (error) => {
          log(`WebSocket error: ${error}`, 'websocket');
          this.clients = this.clients.filter(client => client !== ws);
        });
      });
      
      // Start periodic updates
      this.startPeriodicUpdates();
      
      log('WebSocket server initialized successfully', 'websocket');
    } catch (error) {
      log(`Failed to initialize WebSocket server: ${error}`, 'websocket');
    }
  }
  
  private sendMessage(ws: WebSocket, data: any) {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    } catch (error) {
      log(`Error sending WebSocket message: ${error}`, 'websocket');
    }
  }
  
  broadcast(data: any) {
    this.clients.forEach(client => {
      this.sendMessage(client, data);
    });
  }
  
  private startPeriodicUpdates() {
    // Send updates every 5 seconds (to meet ≤5-second latency requirement)
    this.updateInterval = setInterval(() => {
      this.broadcastUpdates();
    }, 5000);
  }
  
  private async broadcastUpdates() {
    try {
      if (this.clients.length === 0) {
        return; // No clients connected
      }
      
      // Get latest data
      const dashboardMetrics = await storage.getDashboardMetrics();
      const weatherAlerts = await storage.getWeatherAlerts();
      const recentActivities = await storage.getRecentActivities();
      
      // Broadcast updates
      this.broadcast({
        type: 'DASHBOARD_UPDATE',
        data: {
          metrics: dashboardMetrics,
          alerts: weatherAlerts,
          activities: recentActivities,
          timestamp: new Date().toISOString()
        }
      });
      
      log(`Broadcast updates to ${this.clients.length} clients`, 'websocket');
    } catch (error) {
      log(`Error broadcasting updates: ${error}`, 'websocket');
    }
  }
  
  shutdown() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    if (this.wsServer) {
      this.wsServer.close();
      this.wsServer = null;
      this.clients = [];
      log('WebSocket server shut down', 'websocket');
    }
  }
}

// Singleton instance
export const webSocketManager = new WebSocketManager();