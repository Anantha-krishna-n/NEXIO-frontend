import axiosInstance from "@/app/utils/axiosInstance";

export const createClassroom = async (formData: any) => {
  try {
    const response = await axiosInstance.post("/classroom/createroom", formData, {
      withCredentials: true,
    });
    return response;
  } catch (error: any) {
    console.error("Error creating classroom:", error);
    throw error.response?.data?.errorMsg || "Failed to create the room. Please try again.";
  }
};

export const fetchPublicClassrooms = async () => {
    try {
      const response = await axiosInstance.get("/classroom/public");
      return response
    } catch (error: any) {
      console.error("Error fetching classrooms:", error);
      throw new Error("Failed to fetch classrooms");
    }
  };
  
  export const joinClassroom = async (classroomId: string) => {
    try {
      const response = await axiosInstance.post(`/classroom/joinClassroom/${classroomId}`);
      return response;
    } catch (error: any) {
      console.error("Error joining classroom:", error);
      throw error.response || new Error("Unexpected error occurred");
    }
  };

  export const fetchClassroomById = async (classroomId: string) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_URL}/classrooms/${classroomId}`
      );
      return response.data.classroom;
    } catch (error) {
      console.error("Failed to fetch classroom:", error);
      throw new Error("Failed to load classroom data.");
    }
  };
  export const sendClassroomInvite = async (classroomId: string, email: string) => {

  
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_URL}/classroom/${classroomId}/invite`,
        { email }
      );
      return response;
    } catch (error: any) {
     
      throw error;
    }
  };
  export const fetchClassroomMembers = async (roomId: string) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_URL}/classroom/${roomId}/members`
      );
  
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch members");
    }
  }