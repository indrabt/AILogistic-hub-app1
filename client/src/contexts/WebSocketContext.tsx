import React, { createContext, useContext, useEffect, useState } from 'react';
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
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const user = getCurrentUser();
  const [dashboardData, setDashboardData] = useState<WebSocketContextType['dashboardData']>(null);

  // Initialize the WebSocket connection
  const { status, lastMessage, sendMessage, reconnect } = useWebSocket(
    'ws', // will automatically use host from window.location
    {
      onOpen: () => {
        // Send authentication message when connection opens
        if (user) {
          sendMessage({
            type: 'AUTHENTICATE',
            userId: user.id,
            role: user.role,
            username: user.username,
          });
        }
      },
      onMessage: (data) => {
        // Handle different message types
        if (data.type === 'DASHBOARD_UPDATE') {
          setDashboardData({
            metrics: data.data.metrics,
            alerts: data.data.alerts,
            activities: data.data.activities,
            lastUpdated: data.data.timestamp,
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
        }
      },
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      autoReconnect: true,
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

  // Provide the WebSocket connection and data to the app
  return (
    <WebSocketContext.Provider
      value={{
        status,
        lastMessage,
        sendMessage,
        reconnect,
        dashboardData,
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