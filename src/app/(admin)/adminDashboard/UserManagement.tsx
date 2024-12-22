import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { Toaster, toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isBlocked: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    show: boolean;
    userId: string | null;
    action: "block" | "unblock";
  }>({ show: false, userId: null, action: "block" });

  const fetchUsers = async (page: number = 1) => {
    try {
      const response = await axiosInstance.get(
        `/admin/userManagement?page=${page}&limit=10`
      );
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const toggleBlockStatus = async (userId: string, action: "block" | "unblock") => {
    try {
      setLoadingUserId(userId);
      const currentUser = users.find((user) => user._id === userId);
      const response = await axiosInstance.put(
        `/admin/users/${userId}/toggle-block`,
        { isBlocked: action === "block" }
      );
      toast.success(response.data.message);
      fetchUsers(currentPage);
    } catch (error) {
      toast.error("Failed to update user status");
    } finally {
      setLoadingUserId(null);
      closeModal();
    }
  };

  const openModal = (userId: string, action: "block" | "unblock") => {
    setConfirmationModal({ show: true, userId, action });
  };

  const closeModal = () => {
    setConfirmationModal({ show: false, userId: null, action: "block" });
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">Username</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Created At</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">
                {new Date(user.createdAt).toString()}
              </td>
              <td className="py-2 px-4">
                {user.isBlocked ? "Blocked" : "Active"}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() =>
                    openModal(user._id, user.isBlocked ? "unblock" : "block")
                  }
                  disabled={loadingUserId === user._id}
                  className={`px-4 py-2 rounded-lg text-white ${
                    user.isBlocked
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  } ${
                    loadingUserId === user._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loadingUserId === user._id
                    ? "Loading..."
                    : user.isBlocked
                    ? "Unblock"
                    : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg ml-2"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {confirmationModal.show && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h3 className="text-lg font-semibold mb-4">
        {confirmationModal.action === "block" ? "Confirm Block" : "Confirm Unblock"}
      </h3>
      <p className="mb-6">
        Are you sure you want to{" "}
        {confirmationModal.action === "block" ? "block" : "unblock"} this user?
      </p>
      <div className="flex justify-end">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            toggleBlockStatus(
              confirmationModal.userId!,
              confirmationModal.action
            )
          }
          className={`px-4 py-2 rounded-lg text-white ${
            confirmationModal.action === "block"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {confirmationModal.action === "block" ? "Block" : "Unblock"}
        </button>
      </div>
    </div>
  </div>
)}

      <Toaster />
    </div>
  );
};

export default UserManagement;
