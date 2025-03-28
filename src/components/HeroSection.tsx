"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Toaster, toast } from "sonner";
import { useRoomStore } from "@/stores/roomStore";
import { useUserStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import { SubscriptionModal } from "./SubscriptionModal";
import { createClassroom } from "@/app/service/classroomService";


interface Classroom {
  _id: string;
  title: string;
  description: string;
  type: "public" | "private";
  schedule: string;
  createdAt: string;
}

interface HeroSectionProps {
  classrooms: Classroom[];
  setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
}

const HeroSection: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const { addRoom } = useRoomStore();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] =
    useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "public",
  });
  const router = useRouter();
  const { user } = useUserStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to create a room");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    const { title, description, date, time } = formData;
    const selectedDateTime = new Date(`${date}T${time}`);
    const currentDate = new Date();

    if (!title || !description || !date || !time) {
      toast.error("All fields are required.");
      return;
    }

    if (selectedDateTime < currentDate) {
      toast.error("Please select a future date and time.");
      return;
    }

    try {
      console.log("Form Data:", formData);
      console.log("User:", user);
      if (
        user?.subscription?.plan === "Free" &&
        user?.publicClassroomCount > 2 &&
        user?.privateClassroomCount > 2
      ) {
        setIsSubscriptionModalOpen(true);
        return;
      }

      // const response = await axiosInstance.post(
      //   "/classroom/createroom",
      //   formData,
      //   {
      //     withCredentials: true,
      //   }
      // );
      const response = await createClassroom(formData);
   console.log(response,"response of classroom")
      if (response.data.status === false) {
        setIsSubscriptionModalOpen(true);
        toast.error(response.data.errorMsg || "Could not create classroom");
        return;
      }

      if (response.data.type !== "private") addRoom(response.data);

      toast.success("Room created successfully!");
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        type: "public",
      });
    } catch (error) {
      console.error("Error adding room:", error);
      // toast.error("Failed to create the room. Please try again.");
    }
  };

  return (
    <section className="relative bg-[#F8D252] w-full h-[75vh] flex items-start justify-start">
      {/* Main hero content container */}
      <div className="h-full p-6 pt-48 px-20 ml-20">
        {/* Text container */}
        <div className="flex flex-col items-start mb-5">
          <h1 className="text-4xl font-inter text-black mb-4">
            A shared space for minds to connect,
          </h1>
          <h1 className="text-4xl font-inter font-bold">create & inspire</h1>
        </div>
        <Toaster position="top-right" />

        {/* Form container */}
        <div className="absolute bg-white p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-xs mt-12">
          {/* Add "Join or create one" text inside the form */}
          <div className="absolute top-[-30px] left-0 w-full bg-[#42454e] text-white rounded-t-lg px-4 py-2">
            <p className="text-center font-inter font-semibold">create one</p>
          </div>
          <form className="w-full flex flex-col" onSubmit={handleSubmit}>
            {/* Classroom Name Field */}
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Classroom Name"
              className="w-full p-2 mb-4 border rounded"
            />
            {/* Date and Time Fields in a row */}
            <div className="flex w-full gap-4 mb-4">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="flex-1 p-2 border rounded"
              />
            </div>
            {/* Description Field */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full p-2 mb-4 border rounded"
            ></textarea>

            {/* Radio buttons for Public/Private */}
            <div className="flex justify-between mb-4 w-full">
              <label className="flex items-center text-[#F19962]">
                <input
                  type="radio"
                  name="type"
                  value="public"
                  checked={formData.type === "public"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Public
              </label>
              <label className="flex items-center text-[#F19962]">
                <input
                  type="radio"
                  name="type"
                  value="private"
                  checked={formData.type === "private"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Private
              </label>
            </div>

            {/* Create Button */}
            <button
              type="submit"
              className="group bg-[#F19962] text-white font-bold py-2 px-4 rounded transition-colors duration-200 ease-in-out hover:bg-[#e08e57] focus:bg-[#e08e57] active:bg-[#e08e57]"
              style={{ position: "relative", zIndex: 1 }}
            >
              Create
            </button>
          </form>
        </div>
      </div>

      {/* Image on the right side */}
      <div className="absolute right-1 bottom-[-60px] flex items-center justify-start">
        <Image
          src="/assets/Home.png"
          alt="Student reading"
          width={700}
          height={700}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </section>
  );
};

export default HeroSection;
