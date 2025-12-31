/**
 * CLIENTE WEBSOCKET
 * Conexión Socket.io para chat en tiempo real
 */

import { io, Socket } from 'socket.io-client';
import { getAccessToken } from './api-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

let socket: Socket | null = null;

// Conectar al servidor WebSocket
export const connectWebSocket = (): Socket => {
  if (socket?.connected) {
    return socket;
  }

  const token = getAccessToken();

  socket = io(`${WS_URL}/chat`, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Eventos de conexión
  socket.on('connect', () => {
    console.log('✅ WebSocket conectado');
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ WebSocket desconectado:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Error de conexión WebSocket:', error);
  });

  return socket;
};

// Desconectar WebSocket
export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Obtener socket actual
export const getSocket = (): Socket | null => {
  return socket;
};

// Enviar mensaje
export const sendMessage = (room: string, message: string) => {
  if (!socket?.connected) {
    throw new Error('WebSocket no conectado');
  }

  return new Promise((resolve, reject) => {
    socket!.emit('message:send', { room, message }, (response: any) => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });
  });
};

// Obtener mensajes de un room
export const getMessages = (room: string, limit?: number) => {
  if (!socket?.connected) {
    throw new Error('WebSocket no conectado');
  }

  return new Promise((resolve, reject) => {
    socket!.emit('messages:get', { room, limit }, (response: any) => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response.messages);
      }
    });
  });
};

// Indicador de escritura
export const startTyping = (room: string) => {
  socket?.emit('typing:start', { room });
};

export const stopTyping = (room: string) => {
  socket?.emit('typing:stop', { room });
};