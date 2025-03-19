/**
 * WebSocket Server for Real-Time Updates
 * 
 * Basic implementation with dedicated path to avoid conflicts with Vite HMR
 */

import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { log } from './vite';
import { storage } from './storage';

export class WebSocketManager {
  private wsServer: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private updateInterval: NodeJS.Timeout | null = null;

  initialize(httpServer: HttpServer) {
    if (this.wsServer) {
      return;
    }

    try {
      // Create WebSocket server with dedicated path to avoid conflicts with Vite
      this.wsServer = new WebSocketServer({ 
        server: httpServer,
        path: '/api/ws' // Use a specific path that won't conflict with Vite
      });

      log('WebSocket server initialized on /api/ws path', 'websocket');

      // Handle new connections
      this.wsServer.on('connection', (ws: WebSocket) => {
        log('WebSocket connection established', 'websocket');
        
        // Add to clients set
        this.clients.add(ws);
        
        // Send welcome message
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
            
            // Handle authentication
            if (data.type === 'AUTHENTICATE') {
              log(`Authenticating user: ${data.username} with role: ${data.role}`, 'websocket');
              
              // Send back confirmation
              this.sendMessage(ws, {
                type: 'AUTHENTICATION_SUCCESS',
                message: `Authenticated as ${data.username}`,
                timestamp: new Date().toISOString()
              });
              
              // Send immediate data update
              this.sendDashboardData(ws);
            }
          } catch (error) {
            log(`Error parsing WebSocket message: ${error}`, 'websocket');
          }
        });
        
        // Handle disconnection
        ws.on('close', (code, reason) => {
          log(`WebSocket connection closed with code ${code}${reason ? ': ' + reason : ''}`, 'websocket');
          this.clients.delete(ws);
          log(`Active connections remaining: ${this.clients.size}`, 'websocket');
        });
        
        // Handle errors
        ws.on('error', (error) => {
          log(`WebSocket error: ${error.message || error}`, 'websocket');
          this.clients.delete(ws);
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
      // Only send if connection is open (OPEN has a value of 1)
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    } catch (error) {
      log(`Error sending WebSocket message: ${error}`, 'websocket');
    }
  }
  
  private async sendDashboardData(ws: WebSocket) {
    try {
      // Get latest data
      const dashboardMetrics = await storage.getDashboardMetrics();
      const weatherAlerts = await storage.getWeatherAlerts();
      const recentActivities = await storage.getRecentActivities();
      
      // Send data to client
      this.sendMessage(ws, {
        type: 'DASHBOARD_UPDATE',
        data: {
          metrics: dashboardMetrics,
          alerts: weatherAlerts,
          activities: recentActivities,
          timestamp: new Date().toISOString()
        }
      });
      
      log('Sent dashboard data to client', 'websocket');
    } catch (error) {
      log(`Error sending dashboard data: ${error}`, 'websocket');
    }
  }
  
  private startPeriodicUpdates() {
    // Clear any existing interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Send updates every 15 seconds
    this.updateInterval = setInterval(() => {
      this.broadcastDashboardUpdates();
    }, 15000);
  }
  
  private async broadcastDashboardUpdates() {
    if (this.clients.size === 0) {
      return; // No clients connected
    }
    
    try {
      // Get latest data
      const dashboardMetrics = await storage.getDashboardMetrics();
      const weatherAlerts = await storage.getWeatherAlerts();
      const recentActivities = await storage.getRecentActivities();
      
      // Create update message
      const updateMessage = {
        type: 'DASHBOARD_UPDATE',
        data: {
          metrics: dashboardMetrics,
          alerts: weatherAlerts,
          activities: recentActivities,
          timestamp: new Date().toISOString()
        }
      };
      
      // Send to all clients
      let activeClients = 0;
      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          this.sendMessage(client, updateMessage);
          activeClients++;
        }
      });
      
      if (activeClients > 0) {
        log(`Broadcast dashboard updates to ${activeClients} clients`, 'websocket');
      }
    } catch (error) {
      log(`Error broadcasting dashboard updates: ${error}`, 'websocket');
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
      this.clients.clear();
      log('WebSocket server shut down', 'websocket');
    }
  }
}

// Singleton instance
export const webSocketManager = new WebSocketManager();