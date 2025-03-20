"use client";
import React from "react";
import { useState, useMemo } from "react";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";
import ClassroomStatsChart from "@/components/ClassroomStatsChart"; // Import the chart component
import { useAdminStore } from "@/stores/adminStore";
import withAdminAuth from "@/components/HOCs/withAdminAuth";
import { useRouter } from "next/navigation";

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState("dashboard");
  const logout = useAdminStore((state) => state.logout);
  const router = useRouter();

  const MemoizedUserManagement = React.memo(UserManagement);
  const MemoizedSubscriptionManagement = React.memo(SubscriptionManagement);
  
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <ClassroomStatsChart />
          </div>
        );
      case "userManagement":
        return <MemoizedUserManagement />;
      case "subscriptionManagement":
        return <MemoizedSubscriptionManagement />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };;

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
              <li
                onClick={() => setActiveSection("dashboard")}
                className={`cursor-pointer p-2 mb-2 rounded-lg ${
                  activeSection === "dashboard"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Dashboard
              </li>
              <li
                onClick={() => setActiveSection("userManagement")}
                className={`cursor-pointer p-2 mb-2 rounded-lg ${
                  activeSection === "userManagement"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                User Management
              </li>
              <li
                onClick={() => setActiveSection("subscriptionManagement")}
                className={`cursor-pointer p-2 mb-2 rounded-lg ${
                  activeSection === "subscriptionManagement"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Subscription Management
              </li>
            </ul>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);
