"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/stores/authStore";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LogOut, Settings, User } from 'lucide-react'
import axiosInstance from "@/app/utils/axiosInstance";
import { toast } from "sonner";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      toast.error("Room code cannot be empty!");
      return;
    }
  
    try {
      const response = await axiosInstance.post(
        `/classroom/join/invite/${roomCode}`
      );
  
      const classroomId = response.data.classroom._id;
      toast.success("You have successfully joined the class!");
  
      setTimeout(() => {
        router.push(`/classroom/${classroomId}`);
      }, 1000);
  
      setRoomCode("");
      setIsModalOpen(false);
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          toast.error(data.error || "Invalid invite code.");
        } else {
          toast.error(data.error || "An error occurred. Please try again.");
        }
      } else {
        toast.error("Network error or unexpected issue occurred.");
      }
    }
  };
    
  

  if(!mounted) {
    return null; 
  }

  return (
<header className="bg-[#42454e] p-4 fixed top-0 left-0 w-full z-50 shadow-lg" style={{ boxShadow: '0px 4px 10px rgba(241, 153, 98, 0.5)' }}>
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
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profilepic || "/assets/profile.jpg"} alt="Profile" />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-gray-200 font-medium">{user.name}</span>
              </button>

              {/* Profile Modal */}
              {isProfileModalOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow-lg w-61 z-50">
                  <div className="flex items-center space-x-3 p-2">
                    <Avatar className="h-10 w-10">
   
                      <AvatarImage src={user.profilepic || "/assets/profile.jpg"} alt="Profile" />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200">
                  <button
                      onClick={() => {
                        setIsProfileModalOpen(false); 
                        router.push("/profile"); 
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    >                      <User className="mr-2 h-4 w-4 text-purple-500" />

                      <span>My Profile</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                      <Settings className="mr-2 h-4 w-4 text-purple-500" />
                      <span>Settings</span>
                    </button>
                    <div className="relative">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Notification</span>
                      </button>
                      <div className="absolute left-full top-0 bg-white border rounded shadow-lg hidden group-hover:block">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Allow</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Mute</button>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
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

