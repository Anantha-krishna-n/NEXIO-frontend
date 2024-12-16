"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUserStore } from "@/stores/authStore";
import { Toaster, toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser, setAccessToken, user } = useUserStore();

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        toast.success("Login Sucessfully..")
        setUser(response.data.user);
        setAccessToken(response.data.tokens.accessToken);
        localStorage.removeItem("registeredEmail");
        router.push("/");
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          if (err.response.status === 500) {
            setError("Server error. Please try again later or contact support.");
          } else if (err.response.status === 401) {
            setError("Invalid email or password. Please try again.");
          } else {
            setError(err.response.data.error || "Login failed. Please try again.");
          }
        } else if (err.request) {
          setError("No response from server. Please check your internet connection and try again.");
        } else {
          setError("An error occurred while setting up the request. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
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
            <Link href="/forgot-password" className="text-red-500 hover:underline">
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
            <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded w-full">
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

