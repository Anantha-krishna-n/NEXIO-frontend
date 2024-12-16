"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

const OTP_VALIDITY_DURATION = 5 * 60; // 5 minutes in seconds

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(OTP_VALIDITY_DURATION);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyOtp = async () => {
    const email = localStorage.getItem("registeredEmail");
    if (!email) {
      toast.error("No email found. Please sign up again.");
      router.push("/signup");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/auth/verify`,
        { email, otp }
      );

      if (response.status === 200) {
        toast.success("Verification successful! Redirecting to login ");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const email = localStorage.getItem("registeredEmail");
    if (!email) {
      toast.error("No email found. Please sign up again.");
      router.push("/signup");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/auth/resend-otp`,
        { email }
      );

      if (response.status === 200) {
        toast.success("New OTP sent successfully");
        setTimeRemaining(OTP_VALIDITY_DURATION);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("Failed to resend OTP. Please try again.");
        }
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleButtonClick = () => {
    if (timeRemaining > 0) {
      handleVerifyOtp();
    } else {
      handleResendOtp();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-inter font-semibold mb-4">Verify OTP</h1>
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <label className="block mb-2 font-semibold" htmlFor="otp">
          Enter OTP
        </label>
        <input
          id="otp"
          type="text"
          className="border p-2 w-full rounded mb-4"
          placeholder="Enter your OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          onClick={handleButtonClick}
          disabled={isLoading}
          className={`bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 rounded w-full ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            "Processing..."
          ) : timeRemaining > 0 ? (
            <>
              Verify OTP ({formatTime(timeRemaining)})
            </>
          ) : (
            "Resend OTP"
          )}
        </button>
      </div>
    </div>
  );
}

