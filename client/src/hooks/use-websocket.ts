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
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    autoReconnect = true,
    skipReconnectWhen,
  }: UseWebSocketOptions = {}
) {
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const isUnmountingRef = useRef(false);
  const autoReconnectRef = useRef(autoReconnect);

  // Update autoReconnect ref when the prop changes
  useEffect(() => {
    autoReconnectRef.current = autoReconnect;
  }, [autoReconnect]);

  // Function to create a new WebSocket connection
  const connect = useCallback(() => {
    try {
      const websocketUrl = url.startsWith('ws') ? url : `ws://${window.location.host}/ws`;
      setStatus('connecting');
      
      const socket = new WebSocket(websocketUrl);
      socketRef.current = socket;

      socket.onopen = (event) => {
        console.log('WebSocket connection established');
        setStatus('open');
        reconnectCountRef.current = 0;
        if (onOpen) onOpen(event);
      };

      socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(data);
          if (onMessage) onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        setStatus('closed');
        if (onClose) onClose(event);

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
          setTimeout(connect, reconnectInterval);
        } else if (reconnectCountRef.current >= reconnectAttempts) {
          console.error('Max reconnection attempts reached');
          toast({
            title: 'Connection Lost',
            description: 'Unable to restore real-time connection. Please refresh the page.',
            variant: 'destructive',
          });
        }
      };

      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        if (onError) onError(event);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setStatus('closed');
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
  }, [url, onOpen, onMessage, onClose, onError, reconnectAttempts, reconnectInterval, skipReconnectWhen]);

  // Connect when the component mounts
  useEffect(() => {
    connect();

    // Cleanup
    return () => {
      isUnmountingRef.current = true;
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

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
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    reconnectCountRef.current = 0;
    connect();
  }, [connect]);

  // Function to manually disconnect
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  // Heartbeat ping to keep connection alive
  useEffect(() => {
    if (status !== 'open') return;

    const pingInterval = setInterval(() => {
      sendMessage({ type: 'PING', timestamp: new Date().toISOString() });
    }, 30000); // Send ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [status, sendMessage]);

  return {
    status,
    lastMessage,
    sendMessage,
    reconnect,
    disconnect,
  };
}