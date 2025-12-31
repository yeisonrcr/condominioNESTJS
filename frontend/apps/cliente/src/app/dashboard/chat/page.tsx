/**
 * CHAT PAGE
 * Chat en tiempo real con seguridad/administración
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { useWebSocket } from '@rosedal2/shared/hooks/useWebSocket';
import { Button } from '@rosedal2/shared/components/Button';
import { Input } from '@rosedal2/shared/components/Input';
import { Send, Users } from 'lucide-react';
import { formatTime } from '@rosedal2/shared/lib/utils';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { user } = useAuth();
  const room = user?.houseId ? `house:${user.houseId}` : '';
  const { isConnected, messages, sendMessage } = useWebSocket(room);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !room) return;

    setIsSending(true);
    try {
      await sendMessage(room, message.trim());
      setMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar mensaje');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-t-lg shadow-sm border border-b-0 border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat en Vivo</h1>
            <p className="text-sm text-gray-600 mt-1">
              Comunicación con administración y seguridad
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-white border-x border-gray-200 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Users size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay mensajes</p>
              <p className="text-sm">Inicia la conversación</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isOwnMessage = msg.sender.id === user?.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isOwnMessage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      } rounded-lg px-4 py-2`}
                    >
                      {!isOwnMessage && (
                        <p className="text-xs font-semibold mb-1 opacity-75">
                          {msg.sender.name}
                        </p>
                      )}
                      <p className="text-sm break-words">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-b-lg shadow-sm border border-t-0 border-gray-200 p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={!isConnected || isSending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!message.trim() || !isConnected || isSending}
            isLoading={isSending}
          >
            <Send size={20} />
          </Button>
        </form>

        {!isConnected && (
          <p className="text-sm text-red-600 mt-2">
            Reconectando al servidor...
          </p>
        )}
      </div>
    </div>
  );
}