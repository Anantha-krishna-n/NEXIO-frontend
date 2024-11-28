"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";


export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("First Name:", firstName);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center">
      {/* Left side - Image */}
      <div className="w-2/5 h-[80vh] flex justify-center items-center ml-12">
        <Image
          src="/assets/signup.png" // Replace with your image path
          alt="Signup Illustration"
          width={600}
          height={600}
          className="rounded-lg"
        />
      </div>


      {/* Right side - Form container */}
      <div className="bg-grey-200 p-10 w-full max-w-md rounded-lg ml-auto relative ml-11">
        {/* Signup text above the form */}
        <h2
          className="text-2xl font-bold inter mb-6 absolute left-4 -top-0"
          style={{ fontWeight: 300 }}
        >
          Signup
        </h2>
        <p className="text-gray-700 mb-4">
          Let's get you all set up so you can access your personal account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="border border-gray-300 p-2 w-full rounded"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 p-2 w-full rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="border border-gray-300 p-2 w-full rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 p-2 w-full rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="border border-gray-300 p-2 w-full rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Signup
          </button>

          <div className="mt-4 text-center">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded w-full">
              Signup with Google
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Already Registered? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
