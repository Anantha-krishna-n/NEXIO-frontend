"use client";

import { useState } from "react";
import { Pencil, Camera } from 'lucide-react';
import { useUserStore } from "@/stores/authStore";
import Image from "next/image";

export function ProfileForm() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isNameEditable, setIsNameEditable] = useState(false);

  // Fetch user data from zustand store
  const { user, updateUser } = useUserStore();

  // Local state for editable fields
  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(user?.profilepic || "/placeholder.svg?height=100&width=100");

  const handleNameEdit = () => {
    if (isNameEditable) {
      // Save changes to zustand store
      updateUser({ name });
    }
    setIsNameEditable(!isNameEditable);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      updateUser({ profileImage: imageUrl });
    }
  };

  return (
    <div className="space-y-6 mt-5">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-medium mb-2">Profile</h1>
          <p className="text-gray-500">Add your personal information</p>
        </div>
        <div className="px-6">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-3 relative ${
                activeTab === "personal"
                  ? "text-[#FF9B6A]"
                  : "text-gray-500"
              }`}
            >
              Personal information
              {activeTab === "personal" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9B6A]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-4 py-3 relative ${
                activeTab === "password"
                  ? "text-[#FF9B6A]"
                  : "text-gray-500"
              }`}
            >
              Password
              {activeTab === "password" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9B6A]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("assignment")}
              className={`px-4 py-3 relative ${
                activeTab === "assignment"
                  ? "text-[#FF9B6A]"
                  : "text-gray-500"
              }`}
            >
              Assignment validation
              {activeTab === "assignment" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9B6A]" />
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg p-8">
        {activeTab === "personal" && (
          <form className="space-y-6">
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={profileImage}
                    alt="Profile picture"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <label 
                  htmlFor="profile-image" 
                  className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50"
                >
                  <Camera className="w-4 h-4 text-gray-500" />
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2 border rounded ${
                    isNameEditable ? "bg-white" : "bg-gray-100"
                  }`}
                  readOnly={!isNameEditable}
                />
                <button
                  type="button"
                  onClick={handleNameEdit}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  aria-label={isNameEditable ? "Save name" : "Edit name"}
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                className="w-full p-2 border rounded bg-gray-100"
                readOnly
              />
            </div>
          </form>
        )}

        {activeTab === "password" && (
          <form className="space-y-6">
            {/* Password Fields */}
          </form>
        )}

        <div className="flex justify-end gap-4 mt-8">
          <button className="px-4 py-2 border rounded text-gray-700">
            Cancel
          </button>
          <button className="px-4 py-2 rounded bg-[#FF9B6A] hover:bg-[#ff8951] text-white">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

