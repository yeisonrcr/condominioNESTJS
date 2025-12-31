/**
 * VISITS GATEWAY - WEBSOCKET
 * Chat en tiempo real para comunicación
 * Rooms: "admin", "security", "house:{id}"
 */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { SendMessageDto } from './dto';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  namespace: '/chat',
})
export class VisitsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Mapa de usuarios conectados: socketId -> userId
  private connectedUsers = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  // ============================================
  // CONEXIÓN - Autenticar usuario
  // ============================================
  async handleConnection(client: Socket) {
    try {
      // Obtener token del handshake
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      // Verificar token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // Buscar usuario
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          houseId: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        client.disconnect();
        return;
      }

      // Guardar usuario conectado
      this.connectedUsers.set(client.id, user.id);
      client.data.user = user;

      // Unir a rooms según rol
      if (user.role === 'admin') {
        client.join('admin');
        client.join('security');
      } else if (user.role === 'oficial') {
        client.join('security');
      } else if (user.role === 'filial' && user.houseId) {
        client.join(`house:${user.houseId}`);
      }

      console.log(`✅ Usuario conectado: ${user.email} (${client.id})`);

      // Notificar conexión
      this.server.emit('user:connected', {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
      });
    } catch (error) {
      console.error('Error en conexión WebSocket:', error);
      client.disconnect();
    }
  }

  // ============================================
  // DESCONEXIÓN
  // ============================================
  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      console.log(`❌ Usuario desconectado: ${userId}`);

      this.server.emit('user:disconnected', { userId });
    }
  }

  // ============================================
  // ENVIAR MENSAJE
  // ============================================
  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ) {
    const user = client.data.user;

    if (!user) {
      return { error: 'Usuario no autenticado' };
    }

    // Verificar acceso al room
    const hasAccess = await this.checkRoomAccess(user, dto.room);
    if (!hasAccess) {
      return { error: 'No tienes acceso a este room' };
    }

    // Guardar mensaje en BD
    const message = await this.prisma.chatMessage.create({
      data: {
        senderId: user.id,
        room: dto.room,
        message: dto.message,
        type: (dto.type as any) || 'text',
      },
    });

    // Emitir a todos en el room
    this.server.to(dto.room).emit('message:received', {
      id: message.id,
      message: dto.message,
      room: dto.room,
      type: dto.type || 'text',
      sender: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
      createdAt: message.createdAt,
    });

    return { success: true, messageId: message.id };
  }

  // ============================================
  // MARCAR COMO LEÍDO
  // ============================================
  @SubscribeMessage('message:read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageIds: string[] },
  ) {
    const user = client.data.user;

    if (!user) {
      return { error: 'Usuario no autenticado' };
    }

    await this.prisma.chatMessage.updateMany({
      where: {
        id: { in: data.messageIds },
      },
      data: {
        isRead: true,
      },
    });

    return { success: true };
  }

  // ============================================
  // OBTENER MENSAJES DE UN ROOM
  // ============================================
  @SubscribeMessage('messages:get')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; limit?: number },
  ) {
    const user = client.data.user;

    if (!user) {
      return { error: 'Usuario no autenticado' };
    }

    const hasAccess = await this.checkRoomAccess(user, data.room);
    if (!hasAccess) {
      return { error: 'No tienes acceso a este room' };
    }

    const messages = await this.prisma.chatMessage.findMany({
      where: { room: data.room },
      take: data.limit || 50,
      orderBy: { createdAt: 'desc' },
    });

    return { messages: messages.reverse() };
  }

  // ============================================
  // TYPING INDICATOR
  // ============================================
  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    const user = client.data.user;
    if (!user) return;

    client.to(data.room).emit('typing:user', {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    const user = client.data.user;
    if (!user) return;

    client.to(data.room).emit('typing:user', {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      isTyping: false,
    });
  }

  // ============================================
  // HELPERS
  // ============================================
  private async checkRoomAccess(user: any, room: string): Promise<boolean> {
    // Admin tiene acceso a todo
    if (user.role === 'admin') return true;

    // Oficial tiene acceso a "security"
    if (user.role === 'oficial' && room === 'security') return true;

    // Filial tiene acceso a su casa
    if (user.role === 'filial' && room === `house:${user.houseId}`) return true;

    return false;
  }

  // ============================================
  // NOTIFICACIÓN PÚBLICA (llamada desde services)
  // ============================================
  notifyRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
  }

  notifyAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}