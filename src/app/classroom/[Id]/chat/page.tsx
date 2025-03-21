'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams,usePathname  } from 'next/navigation';
import axiosInstance from '@/app/utils/axiosInstance';
import { useUserStore } from '@/stores/authStore';
import useSocketStore from '@/stores/socketStore';

interface UserId {
  _id: string;
}

interface Message {
  _id: string;
  userId: UserId;
  userName: string;
  message: string;
  timestamp: Date;
}

export default function ChatPage() {
  const params = useParams();
  const classroomId = params.Id as string;
  const pathname = usePathname();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useUserStore();
  const { socket, connect } = useSocketStore();

  useEffect(() => {
    if (!classroomId || !socket) return;

    socket.emit('joinClassroom', classroomId);

    const handleMessage = (message: Message) => {
      console.log('Received message:', message);

      setMessages((prev) => {
        const isDuplicate = prev.some((msg) => msg._id === message._id);
        return isDuplicate ? prev : [...prev, message];
      });
    };  

    socket.on('receiveMessage', handleMessage);

    return () => {
      socket.off('receiveMessage', handleMessage);
    };
  }, [classroomId, socket]);

  useEffect(() => {
    if (!classroomId) return;

    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/messages/${classroomId}`);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [classroomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);




  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user) return;

    try {
      const messageData = {
        classroomId,
        userId: user._id,
        userName: user.name,
        message: newMessage.trim(),
      };

      const response = await axiosInstance.post('/messages/messages', messageData);

      const tempMessage: Message = {
        _id: response.data.data._id,
        userId: { _id: user._id },
        userName: user.name,
        message: newMessage.trim(),
        timestamp: new Date(),
      };

      socket.emit('sendMessage', classroomId, tempMessage);
      console.log('Sent message:', tempMessage);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-1">
      <div className="h-[400px] overflow-y-scroll p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.userId?._id === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.userId._id === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div className="text-sm font-semibold">{msg?.userName}</div>
              <div>{msg.message}</div>
              <div className="text-xs mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
