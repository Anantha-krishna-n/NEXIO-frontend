"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission here (e.g., send a request to your backend)
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="bg-gray-200 min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex flex-col items-center justify-center w-1/2 p-10 mt-16">
        <h1
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          className="absolute top-20 left-38 text-3xl font-bold mb-7"
        >
          Login
        </h1>
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
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // Change input type based on visibility state
              id="password"
              className="border text-black p-2 w-full rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Eye icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 pt-7"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label htmlFor="rememberMe" className="text-gray-700 text-sm">
                Remember me
              </label>
            </div>
            <a href="#" className="text-red-500 hover:underline">
              Forgot password
            </a>
          </div>

          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Login
          </button>
          <div className="mt-4 text-center">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded w-full">
              Login with Google
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 flex items-center justify-center">
        <Image
          src="/assets/login.png" // Replace with your image path
          alt="Login Illustration"
          width={600}
          height={600}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
