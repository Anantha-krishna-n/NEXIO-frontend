"use client";
import React from "react";
import UserManagement from "./UserManagement";
import ClassroomManagement from "./ClassroomManagement";
import SubscriptionManagement from "./SubscriptionManagement";
import { useAdminStore } from "@/stores/adminStore";
// import withAdminAuth from "@/hoc/withAdminAuth"; // Import the HOC
import withAdminAuth from "@/components/HOCs/withAdminAuth";


const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <div>Welcome to the Admin Dashboard!</div>;
      case "userManagement":
        return <UserManagement />;
      case "classroomManagement":
        return <ClassroomManagement />;
      case "subscriptionManagement":
        return <SubscriptionManagement />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">Admin Panel</div>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin-login";
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1">
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
                onClick={() => setActiveSection("classroomManagement")}
                className={`cursor-pointer p-2 mb-2 rounded-lg ${
                  activeSection === "classroomManagement"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Classroom Management
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

        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboard); 
