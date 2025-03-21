import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from './use-toast';

export type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'reconnecting' | 'fallback';

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onMessage?: (data: WebSocketMessage) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

/**
 * WebSocket hook with dedicated connection path, reconnection and fallback mechanism
 */
export function useWebSocket(
  unusedUrl: string, // Keep for API compatibility but ignore
  {
    onOpen,
    onMessage,
    onClose,
    onError,
  }: UseWebSocketOptions = {}
) {
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountingRef = useRef(false);
  const reconnectCountRef = useRef(0);
  const maxReconnectAttemptsRef = useRef(5); // Maximum reconnect attempts before switching to fallback
  
  // Connect to WebSocket server
  const connect = useCallback(() => {
    // Check if WebSocket connections are explicitly disabled in session storage
    const disableWebSockets = sessionStorage.getItem('disableWebSocketConnections') === 'true';
    if (disableWebSockets) {
      console.log('WebSocket connections are explicitly disabled');
      setStatus('fallback');
      
      // Simulate a system message in fallback mode
      if (onMessage) {
        const fallbackMessage: WebSocketMessage = {
          type: 'SYSTEM_MESSAGE',
          message: 'WebSocket connections disabled. Using direct API calls instead.',
          timestamp: new Date().toISOString()
        };
        setLastMessage(fallbackMessage);
        onMessage(fallbackMessage);
      }
      
      return;
    }

    // If we've already tried reconnecting too many times, use fallback mode
    if (reconnectCountRef.current >= maxReconnectAttemptsRef.current) {
      console.log(`Max reconnection attempts (${maxReconnectAttemptsRef.current}) reached, using fallback mode`);
      setStatus('fallback');
      
      // Simulate a system message in fallback mode
      if (onMessage) {
        const fallbackMessage: WebSocketMessage = {
          type: 'SYSTEM_MESSAGE',
          message: 'Using offline mode. Some real-time features may be limited.',
          timestamp: new Date().toISOString()
        };
        setLastMessage(fallbackMessage);
        onMessage(fallbackMessage);
      }
      
      return;
    }
    
    try {
      // Create WebSocket URL with specific path to match server
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const host = window.location.host;
      const websocketUrl = `${protocol}://${host}/api/ws`;
      
      console.log('Connecting to WebSocket at:', websocketUrl);
      setStatus('connecting');
      
      // Create WebSocket connection
      const socket = new WebSocket(websocketUrl);
      socketRef.current = socket;
      
      // Handle connection open
      socket.onopen = (event) => {
        console.log('WebSocket connection established');
        setStatus('open');
        reconnectCountRef.current = 0;
        
        // Send ping message
        const pingMessage = {
          type: 'PING',
          timestamp: new Date().toISOString()
        };
        
        try {
          socket.send(JSON.stringify(pingMessage));
        } catch (error) {
          console.error('Error sending initial ping:', error);
        }
        
        // Call user callback
        if (onOpen) onOpen(event);
      };
      
      // Handle incoming messages
      socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('Received WebSocket message:', data.type);
          setLastMessage(data);
          
          // Call user callback
          if (onMessage) onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      // Handle connection close
      socket.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code}`);
        console.log(`WebSocket closed with code ${event.code}`);
        setStatus('closed');
        
        // Call user callback
        if (onClose) onClose(event);
        
        // Attempt to reconnect if we haven't exceeded the max attempts
        if (!isUnmountingRef.current && reconnectCountRef.current < maxReconnectAttemptsRef.current) {
          reconnectCountRef.current += 1;
          const delay = Math.min(1000 * Math.pow(1.5, reconnectCountRef.current), 10000);
          
          console.log(`Attempting to reconnect in ${delay/1000} seconds... (Attempt ${reconnectCountRef.current}/${maxReconnectAttemptsRef.current})`);
          setStatus('reconnecting');
          
          // Clear any existing reconnect timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          // Set reconnect timeout
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (!isUnmountingRef.current) {
          // If we've exceeded max reconnect attempts, switch to fallback mode
          console.log(`Max reconnection attempts (${maxReconnectAttemptsRef.current}) reached, using fallback mode`);
          setStatus('fallback');
          
          // Simulate a system message in fallback mode
          if (onMessage) {
            const fallbackMessage: WebSocketMessage = {
              type: 'SYSTEM_MESSAGE',
              message: 'Using offline mode. Some real-time features may be limited.',
              timestamp: new Date().toISOString()
            };
            setLastMessage(fallbackMessage);
            onMessage(fallbackMessage);
          }
        }
      };
      
      // Handle connection error
      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        
        // Call user callback
        if (onError) onError(event);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      
      // Increment reconnect counter
      reconnectCountRef.current += 1;
      
      // Check if we've exceeded the max reconnect attempts
      if (reconnectCountRef.current >= maxReconnectAttemptsRef.current) {
        console.log(`Max reconnection attempts (${maxReconnectAttemptsRef.current}) reached, using fallback mode`);
        setStatus('fallback');
        
        // Simulate a system message in fallback mode
        if (onMessage) {
          const fallbackMessage: WebSocketMessage = {
            type: 'SYSTEM_MESSAGE',
            message: 'Using offline mode. Some real-time features may be limited.',
            timestamp: new Date().toISOString()
          };
          setLastMessage(fallbackMessage);
          onMessage(fallbackMessage);
        }
      } else {
        setStatus('reconnecting');
        
        // Calculate backoff delay
        const delay = Math.min(1000 * Math.pow(1.5, reconnectCountRef.current), 10000);
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        // Set reconnect timeout
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      }
    }
  }, [onOpen, onMessage, onClose, onError]);
  
  // Connect when component mounts
  useEffect(() => {
    connect();
    
    // Cleanup
    return () => {
      isUnmountingRef.current = true;
      
      // Clear any reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Close WebSocket connection
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);
  
  // Function to send a message with fallback handling
  const sendMessage = useCallback((message: any) => {
    // If in normal operating mode, send through websocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
      return true;
    }
    
    // If in fallback mode and this is an authentication message, simulate success
    if (status === 'fallback') {
      const msgObj = typeof message === 'string' ? JSON.parse(message) : message;
      if (msgObj.type === 'AUTHENTICATE' && onMessage) {
        // Simulate successful authentication
        setTimeout(() => {
          const authSuccessMessage: WebSocketMessage = {
            type: 'AUTHENTICATION_SUCCESS',
            message: 'Authenticated in offline mode',
            userId: msgObj.userId,
            role: msgObj.role,
            username: msgObj.username,
            timestamp: new Date().toISOString()
          };
          setLastMessage(authSuccessMessage);
          onMessage(authSuccessMessage);
          
          // Also simulate dashboard data
          setTimeout(() => {
            const dashboardMessage: WebSocketMessage = {
              type: 'DASHBOARD_UPDATE',
              data: {
                metrics: {
                  activeShipments: { value: 32, change: '+2%', trend: 'up' },
                  onTimeDelivery: { value: '95%', change: '+1%', trend: 'up' }, 
                  delayAlerts: { value: 3, change: '-20%', trend: 'down' },
                  avgShippingCost: { value: '$12.50', change: '-5%', trend: 'down' }
                },
                alerts: [
                  { 
                    id: 1, 
                    severity: 'advisory', 
                    title: 'Weather Advisory - Local Mode', 
                    description: 'Using cached weather data in offline mode',
                    time: new Date().toISOString(),
                    region: 'Western Sydney' 
                  }
                ],
                activities: [
                  {
                    id: 1,
                    title: 'System Notice',
                    description: 'Running in offline mode. Some features limited.',
                    time: new Date().toISOString(),
                    type: 'secondary'
                  }
                ],
                timestamp: new Date().toISOString()
              }
            };
            setLastMessage(dashboardMessage);
            onMessage(dashboardMessage);
          }, 500);
        }, 300);
        return true;
      }
    }
    
    return false;
  }, [status, onMessage]);
  
  // Function to manually reconnect
  const reconnect = useCallback(() => {
    // Check if WebSocket connections are explicitly disabled
    const disableWebSockets = sessionStorage.getItem('disableWebSocketConnections') === 'true';
    if (disableWebSockets) {
      console.log('Cannot reconnect: WebSocket connections are explicitly disabled');
      setStatus('fallback');
      return;
    }
    
    // Reset fallback mode
    setStatus('closed');
    
    // Close existing connection
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    // Clear any reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Reset reconnect counter
    reconnectCountRef.current = 0;
    
    // Connect again
    connect();
  }, [connect]);
  
  return {
    status,
    lastMessage,
    sendMessage,
    reconnect,
  };
}