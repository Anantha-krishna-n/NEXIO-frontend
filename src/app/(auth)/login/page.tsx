"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useUserStore } from "@/stores/authStore";
import { Toaster, toast } from "sonner";
import { axiosHelper } from "@/app/utils/axiosHelper";
import { loginUser } from "@/app/service/userService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser, setAccessToken, user } = useUserStore();
  const searchParams = useSearchParams();


  const returnUrl = searchParams?.get('returnUrl');
  const urlParts = returnUrl?.split('/');
  const classroomId = urlParts?.[urlParts.length - 1];
  const roomCode = urlParts?.[urlParts.length - 2];
console.log(classroomId,"classroomId")
console.log(roomCode,"roomCode")
  useEffect(() => {
    if (user) {
      if (returnUrl && roomCode && classroomId) {
        handleInviteRedirect();
      } else {
        router.push("/");
      }
    }
  }, [user, router, returnUrl, roomCode, classroomId]);


  const handleInviteRedirect = async () => {
    try {
      await axiosHelper({
        method: "POST",
        url: `/classroom/join/invite/${roomCode}`,
      });
      
      router.push(`/classroom/${classroomId}`);
    } catch (err) {
      toast.error("Failed to join classroom. Invalid or expired invite link.");
      router.push("/");
    }
  };



  const SignInWithGoogle = () => {
    window.open(`${process.env.NEXT_PUBLIC_URL}/auth/google`, "_self");
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser(email, password); 
      const responseData = response as any;
      toast.success("Login Successful!");
      setUser(responseData.user);
      setAccessToken(responseData.tokens.accessToken);
      localStorage.removeItem("registeredEmail");
      router.push("/");
    } catch (err: any) {

      if (err.response && err.response.data) {
        const status = err.response.status;
        const message = err.response.data.error || "An error occurred";
  
        if (status === 400) {
          setError("Email and password are required.");
        } else if (status === 401) {
          setError("Invalid credentials. Please check your email and password.");
          return ;
        } else if (status === 403) {
          setError("Your account is blocked. Contact support for assistance.");
          return ;
        } else {
          setError(message);
        }
      } else {
        setError("Network error! Please try again later.");
        return ;
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-gray-200 min-h-screen flex">


      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-10 mt-16">
        <h1 className="text-3xl font-bold mb-7">Login</h1>
        <p className="text-gray-700 mb-4">Login to access your classroom account</p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border text-black p-2 w-full rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Toaster position="top-right"/>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="border text-black p-2 w-full rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 pt-7"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label htmlFor="rememberMe" className="text-gray-700 text-sm">
                Remember me
              </label>
            </div>
            <Link href={`/finduser?email=${encodeURIComponent(email)}`} className="text-red-500 hover:underline">
              Forgot password
            </Link>
          </div>

          <button
            type="submit"
            className={`bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <div className="mt-4 text-center">
          <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded w-full"
              onClick={SignInWithGoogle}
            >
              Login with Google
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <Image
          src="/assets/login.png"
          alt="Login Illustration"
          width={600}
          height={600}
          className="rounded-lg"
          priority
        />
      </div>
    </div>
  );
}

