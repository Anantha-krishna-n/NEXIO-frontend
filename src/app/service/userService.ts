import { axiosHelper } from "@/app/utils/axiosHelper";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";


interface SignupResponse {
  status: number;
  message: string;
  data?: {
    userId: string;
    email: string;
    token?: string;
  };
}

interface ResetPasswordParams {
  email: string
  otp: string
  newPassword: string
  confirmPassword: string
}



export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axiosHelper({
      method: "POST",
      url: "/auth/login",
      data: { email, password },
    });

    return response;
  } catch (err: any) {
    if (err.response && err.response.data) {
      const status = err.response.status;
      const message = err.response.data.error || "An error occurred";

      if (status === 400) {
        throw new Error("Email and password are required.");
      } else if (status === 401) {
        throw new Error("Invalid credentials. Please check your email and password.");
      } else if (status === 403) {
        throw new Error("Your account is blocked. Contact support for assistance.");
      } else {
        throw new Error(message);
      }
    } else {
      throw new Error("Network error! Please try again later.");
    }
  }
}



export const resetPassword = async ({ email, otp, newPassword, confirmPassword }: ResetPasswordParams) => {
  try {
    const response = await axiosHelper({
      method: "POST",
      url: "/auth/reset-password",
      data: { email, otp, newPassword, confirmPassword },
    })
    return response
  } catch (error: any) {
    throw error.response?.data?.error || "An unexpected error occurred. Please try again."
  }
}


export const sendPasswordResetOtp = async (email: string) => {


  try {
    await axiosHelper({
      method: "POST",
      url: "/auth/forgot-password",
      data: { email },
    });
    return true;
  } catch (error) {
  console.log("error in sendreset password",error)
    throw error;
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post("/auth/verify", { email, otp });
    return response;
  } catch (error: any) {
    throw error.response?.data?.error || "An unexpected error occurred. Please try again.";
  }
};

export const resendOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/resend-otp", { email });
    return response;
  } catch (error: any) {
    throw error.response?.data?.error || "Failed to resend OTP. Please try again.";
  }
};