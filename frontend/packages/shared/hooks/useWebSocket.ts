/**
 * HOOK PARA WEBSOCKET
 * Manejo de conexión y mensajes en tiempo real
 */

import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { connectWebSocket, disconnectWebSocket, getSocket, sendMessage as wsSendMessage } from '../lib/websocket';

interface Message {
  id: string;
  message: string;
  room: string;
  type: 'text' | 'image' | 'file' | 'system';
  sender: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  messages: Message[];
  sendMessage: (room: string, message: string) => Promise<void>;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

export function useWebSocket(room?: string): UseWebSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Conectar al montar
  useEffect(() => {
    const ws = connectWebSocket();
    setSocket(ws);

    // Listeners
    ws.on('connect', () => {
      console.log('✅ Conectado a WebSocket');
      setIsConnected(true);
    });

    ws.on('disconnect', () => {
      console.log('❌ Desconectado de WebSocket');
      setIsConnected(false);
    });

    ws.on('message:received', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Unirse a room si se especifica
    if (room) {
      ws.emit('messages:get', { room, limit: 50 }, (response: any) => {
        if (response.messages) {
          setMessages(response.messages);
        }
      });
    }

    // Cleanup
    return () => {
      disconnectWebSocket();
    };
  }, [room]);

  // Enviar mensaje
  const sendMessage = useCallback(async (room: string, message: string) => {
    if (!socket?.connected) {
      throw new Error('WebSocket no conectado');
    }

    await wsSendMessage(room, message);
  }, [socket]);

  // Unirse a room
  const joinRoom = useCallback((room: string) => {
    if (socket?.connected) {
      socket.emit('room:join', { room });
    }
  }, [socket]);

  // Salir de room
  const leaveRoom = useCallback((room: string) => {
    if (socket?.connected) {
      socket.emit('room:leave', { room });
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    messages,
    sendMessage,
    joinRoom,
    leaveRoom,
  };
}