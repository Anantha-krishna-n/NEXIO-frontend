"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import axiosInstance from "@/app/utils/axiosInstance";
import { fetchClassroomMembers } from "@/app/service/classroomService";


interface User {
  _id: string;
  name: string;
  email: string;
  profilepic?: string;
}

interface Member {
  user: User;
  role: string;
  _id: string;
}

interface MembersPopupProps {
  onClose: () => void;
  roomId: string;
}

const MembersPopup: React.FC<MembersPopupProps> = ({ onClose, roomId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        // const response = await axiosInstance.get(
        //   `${process.env.NEXT_PUBLIC_URL}/classroom/${roomId}/members`
        // );
        const response= await fetchClassroomMembers(roomId);
        console.log(response, "members");
        if (!response) {
          throw new Error("Failed to fetch members");
        }

        setMembers(response.data.members);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [roomId]);
 
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 100 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute bottom-[-21.6rem] left-40  w-80 h-auto bg-gray-300 shadow-lg z-10"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Members</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <p>Loading members...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : members.length > 0 ? (
          <ul>
            {members.map((member) => (
              <li key={member._id} className="mb-4 flex items-center gap-3">
                {/* Display profile picture with dynamic border */}
                <div
                  className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${
                    member.role === "admin" ? "border-green-500" : "border-orange-500"
                  }`}
                >
                  {member.user.profilepic ? (
                    <img
                      src={member.user.profilepic}
                      alt={member.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white bg-gray-400 rounded-full">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Display user name, email, and role */}
                <div>
                  <p className="font-medium">{member.user.name}</p>
                  <p className="text-sm text-gray-600">{member.user.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No members found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default MembersPopup;
