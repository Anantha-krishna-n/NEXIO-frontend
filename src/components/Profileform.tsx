"use client";
import { useEffect, useState } from "react";
import { Pencil, Camera } from "lucide-react";
import { useUserStore } from "@/stores/authStore";
import axiosInstance from "@/app/utils/axiosInstance";

export default function ProfileForm() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [editedName, setEditedName] = useState("");
  const [privateRooms, setPrivateRooms] = useState([]);
  const [loadingPrivateRooms, setLoadingPrivateRooms] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const [totalClassrooms, setTotalClassrooms] = useState(0);
const classroomsPerPage = 10;

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const accessToken = useUserStore((state) => state.accessToken);
  const fetchPrivateRooms = async (page = 1) => {
    setLoadingPrivateRooms(true);
    try {
      const response = await axiosInstance.get(`/classroom/user/private?page=${page}&limit=${classroomsPerPage}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      setPrivateRooms(response.data.classrooms);
      setTotalClassrooms(response.data.total);
    } catch (err) {
      console.error("Error fetching private rooms:", err);
    } finally {
      setLoadingPrivateRooms(false);
    }
  };
  
  // Call the fetch function whenever `currentPage` changes
  useEffect(() => {
    if (activeTab === "private") {
      fetchPrivateRooms(currentPage);
    }
  }, [activeTab, accessToken, currentPage]);
  
  const handleNameEditClick = () => {
    if (!isNameEditable) {
      setOriginalName(user?.name || "");
      setEditedName(user?.name || "");
    }
    setIsNameEditable(!isNameEditable);
  };

  const handleCancel = () => {
    setIsNameEditable(false);
    setError("");
    setEditedName(originalName);
  };

  const handleConfirm = async () => {
    if (isNameEditable) {
      if (!editedName.trim()) {
        setError("Name cannot be empty.");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await axiosInstance.patch(
          `${process.env.NEXT_PUBLIC_URL}/auth/updateProfile`,
          { name: editedName },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          updateUser({ name: response.data.user.name });
          setIsNameEditable(false);
        }
      } catch (err) {
        setError("Failed to update name. Please try again.");
        console.error("Error updating name:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleEnterClassroom = async (classroomId: string) => {
    try {
      // Redirect to the classroom details page
      window.location.href = `/classroom/${classroomId}`;
    } catch (err) {
      console.error("Error navigating to the classroom:", err);
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
                activeTab === "personal" ? "text-[#FF9B6A]" : "text-gray-500"
              }`}
            >
              Personal Information
              {activeTab === "personal" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9B6A]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("private")}
              className={`px-4 py-3 relative ${
                activeTab === "private" ? "text-[#FF9B6A]" : "text-gray-500"
              }`}
            >
              Private Room
              {activeTab === "private" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9B6A]" />
              )}
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Content based on activeTab */}
        {activeTab === "personal" && (
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={user?.profilepic ||  "/assets/profile.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="profile-image"
                  className={`absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Camera className="w-4 h-4 text-gray-500" />
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    disabled={isLoading}
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
                  value={isNameEditable ? editedName : user?.name || ""}
                  onChange={handleNameChange}
                  className={`w-full p-2 border rounded ${
                    isNameEditable ? "bg-white" : "bg-gray-100"
                  }`}
                  readOnly={!isNameEditable || isLoading}
                />
                {!isNameEditable && (
                  <button
                    type="button"
                    onClick={handleNameEditClick}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </button>
                )}
                {isNameEditable && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-sm text-gray-500 hover:underline"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="text-sm text-[#FF9B6A] hover:underline"
                      disabled={isLoading}
                    >
                      Confirm
                    </button>
                  </div>
                )}
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

{activeTab === "private" && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Private Room</h2>
    {loadingPrivateRooms ? (
      <p>Loading private rooms...</p>
    ) : privateRooms.length > 0 ? (
      <>
       <ul className="space-y-4">
  {privateRooms.map((room: any) => (
    <li
      key={room._id}
      className="p-4 border rounded shadow hover:bg-gray-50"
    >
      <h3 className="text-lg font-semibold">{room.title}</h3>
      <p>{room.description}</p>
      <p className="text-sm text-gray-500">
        Scheduled: {new Date(room.schedule).toLocaleString()}
      </p>
      <button
        onClick={() => handleEnterClassroom(room._id)}
        className="mt-2 px-4 py-2 bg-[#FF9B6A] text-white rounded hover:bg-[#FF7A42]"
      >
        Enter
      </button>
    </li>
  ))}
</ul>
        <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(Number(prev) - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${
            currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Number(prev) + 1)}
          disabled={currentPage === Math.ceil(totalClassrooms / classroomsPerPage)}
          className={`px-4 py-2 border rounded ${
            currentPage === Math.ceil(totalClassrooms / classroomsPerPage)
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
      </>
    ) : (
      <p>No private rooms found.</p>
    )}
  </div>
)}
    </div>
    </div>
  );
}
