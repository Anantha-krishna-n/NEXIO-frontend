import { create } from "zustand";

interface AdminState {
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
}));
