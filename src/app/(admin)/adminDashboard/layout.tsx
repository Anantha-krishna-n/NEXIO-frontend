"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { useAdminStore } from "@/stores/adminStore";
import withAdminAuth from "@/components/HOCs/withAdminAuth";
import Link from "next/link";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname(); 
  const logout = useAdminStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.push("/admin-login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">Admin Panel</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/4 bg-white shadow-md">
          <nav className="p-4">
            <ul>
              <li>
                <Link
                  href="/adminDashboard"
                  className={`block cursor-pointer p-2 mb-2 rounded-lg ${
                    pathname === "/adminDashboard"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/adminDashboard/userManagement"
                  className={`block cursor-pointer p-2 mb-2 rounded-lg ${
                    pathname === "/adminDashboard/userManagement"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  User Management
                </Link>
              </li>
              <li>
                <Link
                  href="/adminDashboard/subscriptionManagement"
                  className={`block cursor-pointer p-2 mb-2 rounded-lg ${
                    pathname === "/adminDashboard/subscriptionManagement"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  Subscription Management
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
};

// Wrap the layout with withAdminAuth
export default withAdminAuth(AdminLayout);