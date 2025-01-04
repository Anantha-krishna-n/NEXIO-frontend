import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  _id: string;
  name: string;
  email: string;
  profile?: string;
}

export interface Classroom {
  _id: string;
  title: string;
  description: string;
  type: 'public' | 'private';
  inviteLink:string;
  schedule: string;
  createdAt: string;
  admin: User;
}


interface RoomState {
  rooms: Classroom[];
  setRoom: (newRooms: Classroom[]) => void; 
  addRoom: (newRoom: Classroom) => void; 
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      rooms: [], 
      setRoom: (newRooms) => set({ rooms: newRooms }), 
      addRoom: (newRoom) =>
        set((state) => ({ rooms: [...state.rooms, newRoom] })), 
    }),
    {
      name: 'room-storage', 
      storage: createJSONStorage(() => localStorage), 
      onRehydrateStorage: (state) => {
        console.log('Hydration starts');
        return (state, error) => {
          if (error) {
            console.log('An error happened during hydration', error);
          } else {
            console.log('Hydration finished');
          }
        };
      },
    }
  )
);
