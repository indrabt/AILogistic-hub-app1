import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useWebSocket, WebSocketMessage, WebSocketStatus } from '@/hooks/use-websocket';
import { getCurrentUser } from '@/utils/auth';
import { toast } from '@/hooks/use-toast';

interface WebSocketContextType {
  status: WebSocketStatus;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => boolean;
  reconnect: () => void;
  dashboardData: {
    metrics: any;
    alerts: any[];
    activities: any[];
    lastUpdated: string;
  } | null;
  connectionError: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const user = getCurrentUser();
  const [dashboardData, setDashboardData] = useState<WebSocketContextType['dashboardData']>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Handle connection open
  const handleOpen = useCallback(() => {
    console.log('WebSocket connection established and ready');
    setConnectionError(null);
    
    // Send authentication message when connection opens
    if (user) {
      console.log(`Authenticating as ${user.username} with role ${user.role}`);
      sendMessage({
        type: 'AUTHENTICATE',
        userId: user.id,
        role: user.role,
        username: user.username,
      });
    }
  }, [user]);
  
  // Handle connection close errors
  const handleClose = useCallback((event: CloseEvent) => {
    console.log(`WebSocket closed with code ${event.code}`);
    if (event.code !== 1000) { // Normal closure
      setConnectionError(`Connection closed (${event.code}${event.reason ? ': ' + event.reason : ''})`);
    }
  }, []);

  // Handle WebSocket errors
  const handleError = useCallback((event: Event) => {
    console.error('WebSocket error:', event);
    setConnectionError('Connection error occurred');
  }, []);

  // Handle incoming messages
  const handleMessage = useCallback((data: WebSocketMessage) => {
    console.log('Received WebSocket message:', data.type);
    
    // Handle different message types
    if (data.type === 'DASHBOARD_UPDATE') {
      setDashboardData({
        metrics: data.data.metrics,
        alerts: data.data.alerts,
        activities: data.data.activities,
        lastUpdated: data.data.timestamp,
      });
    } else if (data.type === 'AUTHENTICATION_SUCCESS') {
      toast({
        title: 'Connected',
        description: `Real-time updates active: ${data.message}`,
      });
    } else if (data.type === 'SYSTEM_MESSAGE') {
      toast({
        title: 'System Message',
        description: data.message,
      });
    } else if (data.type === 'ERROR') {
      toast({
        title: 'Error',
        description: data.message,
        variant: 'destructive',
      });
      setConnectionError(data.message);
    }
  }, []);

  // Initialize the WebSocket connection
  const { status, lastMessage, sendMessage, reconnect } = useWebSocket(
    'ws', // will automatically use host from window.location
    {
      onOpen: handleOpen,
      onMessage: handleMessage,
      onClose: handleClose,
      onError: handleError,
      reconnectAttempts: 10,
      reconnectInterval: 2000,
      autoReconnect: true,
      pingInterval: 10000, // 10 seconds
    }
  );

  // Re-authenticate when user changes
  useEffect(() => {
    if (status === 'open' && user) {
      sendMessage({
        type: 'AUTHENTICATE',
        userId: user.id,
        role: user.role,
        username: user.username,
      });
    }
  }, [user, status, sendMessage]);

  // Log status changes
  useEffect(() => {
    console.log(`WebSocket connection status: ${status}`);
  }, [status]);

  // Provide the WebSocket connection and data to the app
  return (
    <WebSocketContext.Provider
      value={{
        status,
        lastMessage,
        sendMessage,
        reconnect,
        dashboardData,
        connectionError,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};