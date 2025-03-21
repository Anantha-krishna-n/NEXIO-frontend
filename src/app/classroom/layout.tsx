"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Classbar from "@/components/Classbar";
import InviteModal from "@/components/InviteModal";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { Classroom } from "@/stores/roomStore";
import axiosInstance from "../utils/axiosInstance";
import { useParams } from "next/navigation";
import { useUserStore } from "@/stores/authStore";
import { io, Socket } from "socket.io-client";
import useSocketStore from "@/stores/socketStore";


interface ClassroomLayoutProps {
  children: React.ReactNode;
  classroomId: string;
}

const ClassroomLayout = ({ children, classroomId }: ClassroomLayoutProps) => {
  const { Id } = useParams();
  const { user } = useUserStore();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const inviteButtonRef = useRef<HTMLButtonElement>(null);
  const { connect, socket } = useSocketStore();

  useEffect(() => {
    connect();
  }, [socket, connect]);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_URL}/classroom/${Id}`
        );
        setClassroom(response.data.classroom);
      } catch (error) {
        console.error("Failed to fetch classroom:", error);
        setError("Failed to load classroom data.");
      }
    };

    fetchClassroom();
  }, [Id]);

  const toggleInviteModal = () => {
    setIsInviteModalOpen(!isInviteModalOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 py-16">
      <Header />
      <Classbar />
      <div className="flex h-screen bg-[#f3f4f6] px-72  w-full">
        <main className="flex-1 p-6 h ">
          <div className="w-full ml-2">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <>
                <div className="bg-white  rounded-lg shadow-sm p-6 mb-2 flex justify-between items-center  ">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">
                      {classroom?.title || "Loading..."}
                    </h1>
                    <p className="text-sm text-gray-500">
                      Created By: {classroom?.admin?.name || "Unknown"}
                    </p>
                  </div>
                  {classroom?.type === "private" &&
                    classroom?.admin?.email === user?.email && (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setIsInviteModalOpen(!isInviteModalOpen)
                          }
                          className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-colors"
                        >
                          Invite Code: {classroom?.inviteCode || "N/A"}
                        </button>
                        <InviteModal
                          inviteCode={classroom?.inviteCode || ""}
                          classroomId={classroom?._id}
                          isOpen={isInviteModalOpen}
                          onClose={() => setIsInviteModalOpen(false)}
                        />
                      </div>
                    )}
                </div>
                <div className="w-full">{children}</div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default ClassroomLayout;
