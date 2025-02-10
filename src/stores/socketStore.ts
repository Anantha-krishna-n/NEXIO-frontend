'use client';

import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';






interface SocketStore {
  socket: Socket | null;
  connect: () => void; 
  disconnect: () => void;
  
}

const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  connect: () => {
    const socketInstance = io(process.env.NEXT_PUBLIC_URL!, {
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server:', socketInstance.id);
    });

    set({ socket: socketInstance });
  },

  disconnect: () => {
    const { socket } = useSocketStore.getState();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default useSocketStore;