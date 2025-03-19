/**
 * Simplified WebSocket Server for Real-Time Updates
 */

import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { log } from './vite';
import { storage } from './storage';

// Heartbeat interval and timeout settings (in milliseconds)
const HEARTBEAT_INTERVAL = 10000; // 10 seconds between pings
const HEARTBEAT_TIMEOUT = 15000;  // 15 seconds before considering client dead

interface ClientConnection {
  ws: WebSocket;
  isAlive: boolean;
  userId?: number;
  username?: string;
  role?: string;
  lastActivity: Date;
}

export class WebSocketManager {
  private wsServer: WebSocketServer | null = null;
  private clients: ClientConnection[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  initialize(httpServer: HttpServer) {
    if (this.wsServer) {
      return;
    }

    try {
      // Create WebSocket server
      this.wsServer = new WebSocketServer({ 
        server: httpServer,
        path: '/ws'
      });

      // Set up heartbeat interval
      this.setupHeartbeat();

      // Handle new connections
      this.wsServer.on('connection', (ws: WebSocket) => {
        log('WebSocket connection established', 'websocket');
        
        // Add to clients list with heartbeat tracking
        const clientConnection: ClientConnection = {
          ws,
          isAlive: true,
          lastActivity: new Date()
        };
        
        this.clients.push(clientConnection);
        
        // Set up ping handler to keep connection alive
        ws.on('pong', () => {
          // Mark the connection as alive when we receive a pong
          const client = this.clients.find(c => c.ws === ws);
          if (client) {
            client.isAlive = true;
            client.lastActivity = new Date();
          }
        });
        
        // Send welcome message
        this.sendMessage(clientConnection, {
          type: 'SYSTEM_MESSAGE',
          message: 'Connected to Western Sydney AI Logistics Hub',
          timestamp: new Date().toISOString()
        });
        
        // Handle incoming messages
        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message.toString());
            log(`WebSocket message received: ${JSON.stringify(data)}`, 'websocket');
            
            // Update activity timestamp
            const client = this.clients.find(c => c.ws === ws);
            if (client) {
              client.lastActivity = new Date();
            }
            
            // Handle authentication
            if (data.type === 'AUTHENTICATE') {
              log(`Authenticating user: ${data.username} with role: ${data.role}`, 'websocket');
              
              // Update client data
              if (client) {
                client.userId = data.userId;
                client.username = data.username;
                client.role = data.role;
              }
              
              // Send back confirmation
              this.sendMessage(client!, {
                type: 'AUTHENTICATION_SUCCESS',
                message: `Authenticated as ${data.username}`,
                timestamp: new Date().toISOString()
              });
              
              // Send immediate data update
              this.sendDashboardData(client!);
            }
            
            // Handle ping messages (from client JavaScript)
            if (data.type === 'PING') {
              this.sendMessage(client!, {
                type: 'PONG',
                timestamp: new Date().toISOString()
              });
            }
          } catch (error) {
            log(`Error parsing WebSocket message: ${error}`, 'websocket');
          }
        });
        
        // Handle disconnection
        ws.on('close', (code, reason) => {
          log(`WebSocket connection closed with code ${code}${reason ? ': ' + reason : ''}`, 'websocket');
          this.clients = this.clients.filter(client => client.ws !== ws);
          log(`Active connections remaining: ${this.clients.length}`, 'websocket');
        });
        
        // Handle errors
        ws.on('error', (error) => {
          log(`WebSocket error: ${error.message || error}`, 'websocket');
          this.clients = this.clients.filter(client => client.ws !== ws);
        });
      });
      
      // Start periodic updates
      this.startPeriodicUpdates();
      
      log('WebSocket server initialized successfully', 'websocket');
    } catch (error) {
      log(`Failed to initialize WebSocket server: ${error}`, 'websocket');
    }
  }
  
  private setupHeartbeat() {
    // Clear any existing interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // Set up new interval for heartbeat
    this.heartbeatInterval = setInterval(() => {
      // For each client, check if they're still alive
      this.clients.forEach(client => {
        // If client failed to respond to the last ping, terminate the connection
        if (!client.isAlive) {
          log('Terminating inactive WebSocket connection', 'websocket');
          client.ws.terminate();
          return;
        }
        
        // Mark as not alive, then ping (client will be marked alive again when they respond)
        client.isAlive = false;
        
        // Send ping (low-level WebSocket ping)
        try {
          client.ws.ping();
        } catch (e) {
          // If ping fails, terminate the connection
          client.ws.terminate();
        }
      });
      
      // Clean up terminated connections
      this.clients = this.clients.filter(client => {
        return client.ws.readyState !== WebSocket.CLOSED && 
               client.ws.readyState !== WebSocket.CLOSING;
      });
      
      log(`Heartbeat check complete. Active connections: ${this.clients.length}`, 'websocket');
    }, HEARTBEAT_INTERVAL);
  }
  
  private sendMessage(client: ClientConnection, data: any) {
    try {
      const ws = client.ws;
      // Only send if connection is open (OPEN has a value of 1)
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    } catch (error) {
      log(`Error sending WebSocket message: ${error}`, 'websocket');
    }
  }
  
  private async sendDashboardData(client: ClientConnection) {
    try {
      // Get latest data
      const dashboardMetrics = await storage.getDashboardMetrics();
      const weatherAlerts = await storage.getWeatherAlerts();
      const recentActivities = await storage.getRecentActivities();
      
      // Send data to client
      this.sendMessage(client, {
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
    
    // Send updates every 5 seconds
    this.updateInterval = setInterval(() => {
      this.broadcastDashboardUpdates();
    }, 5000);
  }
  
  private async broadcastDashboardUpdates() {
    if (this.clients.length === 0) {
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
      this.clients.forEach(client => {
        this.sendMessage(client, updateMessage);
      });
      
      log(`Broadcast dashboard updates to ${this.clients.length} clients`, 'websocket');
    } catch (error) {
      log(`Error broadcasting dashboard updates: ${error}`, 'websocket');
    }
  }
  
  shutdown() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
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