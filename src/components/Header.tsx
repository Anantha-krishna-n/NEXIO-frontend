"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  // Function to toggle the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Room Code:', roomCode);
    // Add logic to handle the room code (e.g., join the class)
    setIsModalOpen(false); // Close the modal after submission
  };

  return (
    <header className="bg-[#42454e] p-4 fixed top-0 left-0 w-full z-50 shadow-sm">
      <nav className="flex justify-between items-center">
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
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={toggleModal}
              className="bg-[#F19962] text-white font-bold py-2 px-4 rounded-full hover:bg-[#e08e57] transition"
            >
              Join a Class
            </button>
          </li>
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
        </ul>
      </nav>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed top-[64px] left-1/2 transform -translate-x-1/2 bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-[#f19962]">Join a Class</h2>
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
