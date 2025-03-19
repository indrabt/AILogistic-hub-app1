/**
 * Simplified WebSocket Server for Real-Time Updates
 * 
 * This module provides real-time updates to clients via WebSockets.
 * It ensures delivery status updates with ≤5-second latency.
 */

import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { log } from './vite';
import { storage } from './storage';

interface ClientData {
  socket: WebSocket;
  userId?: number;
  username?: string;
  role?: string;
  authenticated: boolean;
  connectedAt: Date;
}

export class WebSocketManager {
  private wsServer: WebSocketServer | null = null;
  private clients: ClientData[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  initialize(httpServer: HttpServer) {
    if (this.wsServer) {
      return;
    }

    try {
      this.wsServer = new WebSocketServer({ 
        server: httpServer,
        path: '/ws'
      });

      this.wsServer.on('connection', (ws: WebSocket) => {
        log('WebSocket connection established', 'websocket');
        
        // Create a new client data object
        const clientData: ClientData = {
          socket: ws,
          authenticated: false,
          connectedAt: new Date()
        };
        
        // Add to clients list
        this.clients.push(clientData);
        
        // Welcome message
        this.sendMessage(clientData, {
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
              
              // Update client data with authentication info
              clientData.userId = data.userId;
              clientData.username = data.username;
              clientData.role = data.role;
              clientData.authenticated = true;
              
              // Send back confirmation
              this.sendMessage(clientData, {
                type: 'AUTHENTICATION_SUCCESS',
                message: `Authenticated as ${data.username}`,
                timestamp: new Date().toISOString()
              });
              
              // Send current data to this specific client
              this.sendInitialData(clientData);
            }
            
            // Handle ping messages to keep connection alive
            if (data.type === 'PING') {
              this.sendMessage(clientData, {
                type: 'PONG',
                timestamp: new Date().toISOString()
              });
            }
          } catch (error) {
            log(`Error parsing WebSocket message: ${error}`, 'websocket');
          }
        });
        
        // Handle disconnection
        ws.on('close', () => {
          this.clients = this.clients.filter(client => client.socket !== ws);
          log(`WebSocket connection closed. Active connections: ${this.clients.length}`, 'websocket');
        });
        
        // Handle errors
        ws.on('error', (error) => {
          log(`WebSocket error: ${error}`, 'websocket');
          this.clients = this.clients.filter(client => client.socket !== ws);
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
      // WebSocket.OPEN has a value of 1
      if (ws.readyState === 1) {
        ws.send(JSON.stringify(data));
      }
    } catch (error) {
      log(`Error sending WebSocket message: ${error}`, 'websocket');
    }
  }
  
  private async sendInitialData(ws: WebSocket) {
    try {
      // Get latest data
      const dashboardMetrics = await storage.getDashboardMetrics();
      const weatherAlerts = await storage.getWeatherAlerts();
      const recentActivities = await storage.getRecentActivities();
      
      // Send initial data to this client
      this.sendMessage(ws, {
        type: 'DASHBOARD_UPDATE',
        data: {
          metrics: dashboardMetrics,
          alerts: weatherAlerts,
          activities: recentActivities,
          timestamp: new Date().toISOString()
        }
      });
      
      log(`Sent initial data to new client`, 'websocket');
    } catch (error) {
      log(`Error sending initial data: ${error}`, 'websocket');
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
  
  private async broadcastUpdates(specificClients?: WebSocket[]) {
    try {
      // If no specific clients provided and no clients connected, return
      if (!specificClients && this.clients.length === 0) {
        return; // No clients connected
      }
      
      // Get latest data
      const dashboardMetrics = await storage.getDashboardMetrics();
      const weatherAlerts = await storage.getWeatherAlerts();
      const recentActivities = await storage.getRecentActivities();
      
      const updateData = {
        type: 'DASHBOARD_UPDATE',
        data: {
          metrics: dashboardMetrics,
          alerts: weatherAlerts,
          activities: recentActivities,
          timestamp: new Date().toISOString()
        }
      };
      
      // If specific clients provided, send only to them
      if (specificClients && specificClients.length > 0) {
        specificClients.forEach(client => {
          this.sendMessage(client, updateData);
        });
        log(`Sent updates to ${specificClients.length} specific clients`, 'websocket');
      } else {
        // Otherwise broadcast to all clients
        this.broadcast(updateData);
        log(`Broadcast updates to ${this.clients.length} clients`, 'websocket');
      }
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