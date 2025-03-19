import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from './use-toast';

export type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'reconnecting';

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
 * WebSocket hook with dedicated connection path and reconnection
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
  
  // Connect to WebSocket server
  const connect = useCallback(() => {
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
        
        // Attempt to reconnect
        if (!isUnmountingRef.current) {
          reconnectCountRef.current += 1;
          const delay = Math.min(1000 * Math.pow(1.5, reconnectCountRef.current), 10000);
          
          console.log(`Attempting to reconnect in ${delay/1000} seconds... (Attempt ${reconnectCountRef.current})`);
          setStatus('reconnecting');
          
          // Clear any existing reconnect timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          // Set reconnect timeout
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
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
      setStatus('closed');
      
      // Attempt to reconnect
      if (!isUnmountingRef.current) {
        reconnectCountRef.current += 1;
        const delay = Math.min(1000 * Math.pow(1.5, reconnectCountRef.current), 10000);
        
        setStatus('reconnecting');
        
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
  
  // Function to send a message
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
      return true;
    }
    return false;
  }, []);
  
  // Function to manually reconnect
  const reconnect = useCallback(() => {
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