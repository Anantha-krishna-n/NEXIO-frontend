import React, { useEffect, useState, useCallback, useRef } from "react";
import { fetchUsers, toggleBlockStatus } from "@/app/service/adminService";
import ReusableTable from "@/components/ReusableTable";
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
  const hasFetched = useRef(false);

  const loadUsers = useCallback(async (page: number) => {
    try {
        const data = await fetchUsers(page);
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
    } catch (error) {
        toast.error("Failed to fetch users");
    }
}, []);

useEffect(() => {
  console.log("Fetching users for page:", currentPage);
  loadUsers(currentPage);
}, [currentPage, loadUsers]); 
 

  const handleToggleBlock = async (userId: string, action: "block" | "unblock") => {
    try {
      setLoadingUserId(userId);
      const response = await toggleBlockStatus(userId, action);
      toast.success(response.message);
      loadUsers(currentPage);
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

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      
      <ReusableTable
        columns={[
          { label: "Username", key: "name" },
          { label: "Email", key: "email" },
          { label: "Created At", key: "createdAt", render: (value) => new Date(value).toLocaleDateString("en-GB") },
          { label: "Status", key: "isBlocked", render: (value) => (value ? "Blocked" : "Active") },
        ]}
        data={users}
        actions={[
          {
            label: (user) => (user.isBlocked ? "Unblock" : "Block"),
            onClick: (user) => openModal(user._id, user.isBlocked ? "unblock" : "block"),
            className: (user) => 
              `px-4 py-2 rounded-lg text-white ${user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`
          }
        ]}
      />

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
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-lg mr-2">
                Cancel
              </button>
              <button
                onClick={() => handleToggleBlock(confirmationModal.userId!, confirmationModal.action)}
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