import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

interface Subscription {
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  plan?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  profile?: string;
  verified?: boolean;
  role: 'admin' | 'moderator' | 'participant';
  subscription?: Subscription;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  updateUser: (updates: Partial<User>) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
}

export const useUserStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      clearAuth: () => set({ user: null, accessToken: null }),
      logout: async () => {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_URL}/auth/logout`, {}, { withCredentials: true });
          set({ user: null, accessToken: null });
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
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

