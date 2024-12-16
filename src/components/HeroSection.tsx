"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation"; // Import useRouter

const HeroSection = () => {
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "public",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/classroom/createroom`, 
        formData, 
        { withCredentials: true }
      );
      
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        type: "public",
      });

      // Show success toast
      toast.success("Classroom created successfully!");

      // Optionally, trigger a page refresh or update classrooms
      router.refresh(); // This will trigger a soft refresh of the page

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to create classroom");
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
        <Toaster position="top-right"/>

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
              className="bg-[#F19962] text-white font-bold py-2 px-4 rounded hover:bg-[#e08e57] transition"
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
    </section>
  );
};

export default HeroSection;
