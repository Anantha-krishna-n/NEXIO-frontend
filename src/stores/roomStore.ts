import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the Classroom interface
export interface Classroom {
  _id: string;
  title: string;
  description: string;
  type: 'public' | 'private';
  schedule: string;
  createdAt: string;
}

// Define the RoomState interface for the Zustand store
interface RoomState {
  rooms: Classroom[]; // Array of Classroom
  setRoom: (newRooms: Classroom[]) => void; // Overwrites the entire state
  addRoom: (newRoom: Classroom) => void; // Adds a single room to the array
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      rooms: [], // Initial state
      setRoom: (newRooms) => set({ rooms: newRooms }), // Overwrite rooms
      addRoom: (newRoom) =>
        set((state) => ({ rooms: [...state.rooms, newRoom] })), // Add new room
    }),
    {
      name: 'room-storage', // Name of the storage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
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
