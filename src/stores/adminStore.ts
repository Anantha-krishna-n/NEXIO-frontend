import { create } from "zustand";
import axios from "axios";

interface AdminState {
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  logout: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),

  logout: async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/admin/logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.removeItem("adminToken");
        set({ isAuthenticated: false });
        window.location.href = "/admin-login";
      } else {
        console.error("Logout failed: Unexpected response", response);
      }
    } catch (error: any) {
      console.error("Logout request error:", error.response?.data || error.message);
    }
  },
}));
