'use client';

import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Message {
  _id: string;
  userId: { _id: string };
  userName: string;
  message: string;
  timestamp: Date;
}

interface SocketStore {
  socket: Socket | null;
  unreadMessages: Message[];
  connect: () => void; 
  disconnect: () => void;
 
}

const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    unreadMessages: [],
  
    connect: () => {
      if (get().socket) return; 
      const socketInstance = io(process.env.NEXT_PUBLIC_URL!, {
        withCredentials: true,
      });
  
      socketInstance.on('connect', () => {
        console.log('Connected to socket server:', socketInstance.id);
      });
  
      set({ socket: socketInstance });
    },
  
    disconnect: () => {
      const { socket } = get();
      if (socket) {
        socket.disconnect();
        set({ socket: null });
      }
    },

  }));
  
export default useSocketStore;
