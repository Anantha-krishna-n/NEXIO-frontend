"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/stores/authStore";
import { useRouter } from 'next/navigation';


const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [mounted, setMounted] = useState(false);

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const clearAuth = useUserStore((state) => state.clearAuth);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleProfileModal = () => setIsProfileModalOpen(!isProfileModalOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileModalOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Room Code:", roomCode);
    setIsModalOpen(false);
  };

  if(!mounted) {
    return null; // or a loading placeholder
  }

  return (
    <header className="bg-[#42454e] p-4 fixed top-0 left-0 w-full z-50 shadow-lg">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src="/path/to/your/logo.png" alt="Logo" className="h-8" />
        </div>

        {/* Center Navigation Links */}
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-gray-400 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-gray-400 hover:underline">
              About Us
            </Link>
          </li>
        </ul>

        {/* Right Navigation Links */}
        <ul className="flex items-center space-x-4">
          <li>
            <button
              onClick={toggleModal}
              className="bg-[#F19962] text-white font-bold py-2 px-4 rounded-full hover:bg-[#e08e57] transition"
            >
              Join a Class
            </button>
          </li>
          {!user ? (
            <>
              <li>
                <Link href="/signup" className="text-gray-400 hover:underline">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:underline">
                  Login
                </Link>
              </li>
            </>
          ) : (
            <li className="relative flex items-center">
              <button
                onClick={toggleProfileModal}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <Image
                  src={user.profile || "/assets/profile.jpg"}
                  alt="Profile"
                  width={30}
                  height={30}
                  className="rounded-full cursor-pointer"
                />
                <span className="text-gray-200 font-medium">{user.name}</span>
              </button>

              {/* Profile Modal */}
              {isProfileModalOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow-lg w-80 z-50 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <button 
                      onClick={toggleProfileModal} 
                      className="text-gray-600 hover:text-gray-800 font-bold absolute top-2 right-2"
                    >
                      X
                    </button>
                  </div>

                  <div className="flex flex-col items-start space-y-4">
                    <Image 
                      src={user.profile || "/assets/profile.jpg"} 
                      alt="User Profile" 
                      width={50} 
                      height={50} 
                      className="rounded-full"
                    />
                    <div className="w-full">
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">name:</p>
                        <h3 className="text-lg font-bold">{user.name}</h3>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">email:</p>
                        <p className="text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleLogout} 
                    className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>

      {/* Join a Class Modal */}
      {isModalOpen && (
        <div className="fixed top-[64px] left-1/2 transform -translate-x-1/2 bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-[#f19962]">
            Join a Class
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="roomCode" className="block text-gray-700 mb-2">
                Room Code
              </label>
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={toggleModal}
                className="mr-2 bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#F19962] text-white font-bold py-2 px-4 rounded hover:bg-[#e08e57] transition"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;

