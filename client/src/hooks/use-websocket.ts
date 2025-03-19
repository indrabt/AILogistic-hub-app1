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
  reconnectAttempts?: number;
  reconnectInterval?: number;
  autoReconnect?: boolean;
  skipReconnectWhen?: (reason: CloseEvent | Error) => boolean;
  pingInterval?: number;
}

/**
 * Custom hook for managing WebSocket connections with automatic reconnection
 */
export function useWebSocket(
  url: string,
  {
    onOpen,
    onMessage,
    onClose,
    onError,
    reconnectAttempts = 10,
    reconnectInterval = 2000,
    autoReconnect = true,
    skipReconnectWhen,
    pingInterval = 15000,
  }: UseWebSocketOptions = {}
) {
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const isUnmountingRef = useRef(false);
  const autoReconnectRef = useRef(autoReconnect);
  const pingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const manuallyClosedRef = useRef(false);

  // Update autoReconnect ref when the prop changes
  useEffect(() => {
    autoReconnectRef.current = autoReconnect;
  }, [autoReconnect]);

  // Reset ping timeout
  const resetPingTimeout = useCallback(() => {
    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current);
      pingTimeoutRef.current = null;
    }
  }, []);

  // Send ping to server
  const sendPing = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'PING', timestamp: new Date().toISOString() }));
      
      // Set timeout to check for pong response
      resetPingTimeout();
      pingTimeoutRef.current = setTimeout(() => {
        console.warn('No pong received, connection may be dead. Reconnecting...');
        if (socketRef.current) {
          // Force close and reconnect
          socketRef.current.close();
          
          // We need to reconnect manually since this wasn't triggered by the normal close event
          setTimeout(() => {
            reconnectCountRef.current = 0; // Reset the counter for a fresh start
            connect();
          }, 500);
        }
      }, pingInterval);
    }
  }, [pingInterval, resetPingTimeout]);

  // Function to create a new WebSocket connection
  const connect = useCallback(() => {
    // Skip if manually closed
    if (manuallyClosedRef.current) {
      return;
    }

    try {
      // Reset ping timeout when starting a new connection
      resetPingTimeout();
      
      // Determine the correct WebSocket URL
      let websocketUrl;
      if (url.startsWith('ws')) {
        websocketUrl = url;
      } else {
        // Use the current host but ensure proper protocol (ws or wss)
        const isSecure = window.location.protocol === 'https:';
        const protocol = isSecure ? 'wss' : 'ws';
        websocketUrl = `${protocol}://${window.location.host}/ws`;
      }
      
      console.log('Connecting to WebSocket at:', websocketUrl);
      setStatus('connecting');
      
      const socket = new WebSocket(websocketUrl);
      socketRef.current = socket;

      socket.onopen = (event) => {
        console.log('WebSocket connection established');
        setStatus('open');
        reconnectCountRef.current = 0;
        manuallyClosedRef.current = false;
        
        // Start sending pings immediately after connection
        sendPing();
        
        if (onOpen) onOpen(event);
      };

      socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(data);
          
          // If we get a PONG, reset the ping timeout
          if (data.type === 'PONG') {
            resetPingTimeout();
            // Immediately schedule the next ping
            setTimeout(sendPing, pingInterval);
          }
          
          if (onMessage) onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason || ''}`);
        setStatus('closed');
        resetPingTimeout();
        
        if (onClose) onClose(event);

        // Only attempt reconnection if not manually closed
        if (!manuallyClosedRef.current) {
          // Attempt to reconnect unless specifically told not to
          const shouldSkipReconnect = skipReconnectWhen && skipReconnectWhen(event);
          if (
            autoReconnectRef.current &&
            !isUnmountingRef.current &&
            !shouldSkipReconnect &&
            reconnectCountRef.current < reconnectAttempts
          ) {
            reconnectCountRef.current += 1;
            console.log(`Attempting to reconnect (${reconnectCountRef.current}/${reconnectAttempts})...`);
            setStatus('reconnecting');
            
            // Use exponential backoff for reconnection attempts
            const delay = Math.min(
              reconnectInterval * Math.pow(1.5, reconnectCountRef.current - 1),
              30000 // Cap at 30 seconds
            );
            
            setTimeout(connect, delay);
          } else if (reconnectCountRef.current >= reconnectAttempts) {
            console.error('Max reconnection attempts reached');
            toast({
              title: 'Connection Lost',
              description: 'Unable to restore real-time connection. Please refresh the page.',
              variant: 'destructive',
            });
          }
        }
      };

      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        if (onError) onError(event);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setStatus('closed');
      resetPingTimeout();
      
      // Only attempt reconnection if not manually closed
      if (!manuallyClosedRef.current) {
        const shouldSkipReconnect = skipReconnectWhen && skipReconnectWhen(error as Error);
        if (
          autoReconnectRef.current &&
          !isUnmountingRef.current &&
          !shouldSkipReconnect &&
          reconnectCountRef.current < reconnectAttempts
        ) {
          reconnectCountRef.current += 1;
          setStatus('reconnecting');
          setTimeout(connect, reconnectInterval);
        }
      }
    }
  }, [url, onOpen, onMessage, onClose, onError, reconnectAttempts, reconnectInterval, skipReconnectWhen, sendPing, pingInterval, resetPingTimeout]);

  // Connect when the component mounts
  useEffect(() => {
    connect();

    // Cleanup
    return () => {
      isUnmountingRef.current = true;
      resetPingTimeout();
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect, resetPingTimeout]);

  // Function to manually send a message
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    manuallyClosedRef.current = false;
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    resetPingTimeout();
    reconnectCountRef.current = 0;
    connect();
  }, [connect, resetPingTimeout]);

  // Function to manually disconnect
  const disconnect = useCallback(() => {
    manuallyClosedRef.current = true;
    resetPingTimeout();
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setStatus('closed');
  }, [resetPingTimeout]);

  return {
    status,
    lastMessage,
    sendMessage,
    reconnect,
    disconnect,
  };
}