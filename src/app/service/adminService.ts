import axiosInstance from "@/app/utils/axiosInstance";


export const adminLogin = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post(`/admin/login`, { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };


  export const fetchUsers = async (page: number) => {
  const response = await axiosInstance.get(`/admin/userManagement?page=${page}&limit=10`);
  return response.data;
};

export const toggleBlockStatus = async (userId: string, action: "block" | "unblock") => {
  const response = await axiosInstance.put(`/admin/users/${userId}/toggle-block`, {
    isBlocked: action === "block",
  });
  return response.data;
};

export const fetchClassroomStats = async () => {
  try {
    const response = await axiosInstance.get(`/admin/classroomstats`, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching classroom stats.");
  }
}