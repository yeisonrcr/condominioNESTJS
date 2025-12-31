/**
 * CHAT PAGE - OFICIAL
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { useWebSocket } from '@rosedal2/shared/hooks/useWebSocket';
import { Button } from '@rosedal2/shared/components/Button';
import { Send } from 'lucide-react';
import { formatTime } from '@rosedal2/shared/lib/utils';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { user } = useAuth();
  const room = 'security';
  const { isConnected, messages, sendMessage } = useWebSocket(room);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

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
      <div className="bg-white rounded-t-lg shadow-sm border border-b-0 border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900">Chat de Seguridad</h1>
        <p className="text-sm text-gray-600 mt-1">
          Comunicación con otros oficiales y administración
        </p>
      </div>

      <div className="flex-1 bg-white border-x border-gray-200 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isOwnMessage = msg.sender.id === user?.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    isOwnMessage ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-900'
                  } rounded-lg px-4 py-2`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold mb-1 opacity-75">{msg.sender.name}</p>
                  )}
                  <p className="text-sm break-words">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-green-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white rounded-b-lg shadow-sm border border-t-0 border-gray-200 p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={!isConnected || isSending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <Button type="submit" variant="primary" disabled={!message.trim() || isSending}>
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
}