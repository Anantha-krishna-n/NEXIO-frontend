'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { useRoomStore } from '@/stores/roomStore';
import { useUserStore } from "@/stores/authStore";
import { useRouter } from 'next/navigation';
import axiosInstance from '@/app/utils/axiosInstance';

interface User {
  _id: string;
  name: string;
  email: string;
  profile?: string;
}

interface Classroom {
  _id: string;
  title: string;
  description: string;
  type: 'public' | 'private';
  schedule: string;
  createdAt: string;
  admin: User;
}

const Content: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [showModal, setShowModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { rooms, setRoom } = useRoomStore();
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/classroom/public');
        // const publicRooms = response.data.filter((room: Classroom) => room.type === 'public');
        setRoom(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching rooms:');
        setLoading(false);
      }
    };
  
    fetchRooms();
  }, [setRoom]);
  

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleJoinClassroom = async (classroomId: string) => {
    if (!user) {
      toast.error("Please log in to join a room");
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }
    axiosInstance.post(`/classroom/joinClassroom/${classroomId}`)
    .then((response) => {
      console.log(response,"response")
      if (response.status === 406) {
        toast.error(response.data.message);
        return; 
      }
      router.push(`classroom/${classroomId}`);
      toast.success('Joined classroom successfully');
    })
    .catch((error: any) => {
      console.log(error, "error");
      if (error.response) {
        const errorMessage = error.response.data?.error || 'Unexpected error occurred';
        toast.error(`Failed to join classroom: ${errorMessage}`);
      } else if (error.request) {
        toast.error('No response received from server. Please try again later.');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    });  
  };

  
  const openModal = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClassroom(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        loading
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-2xl font-inter text-gray-500 text-center mt-10 opacity-70">
        <p>The new age education system welcomes you</p>
        <p>We deliver better results than other platforms</p>
      </div>

      <div className="relative mt-10">
        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto gap-4 scrollbar-hide"
          style={{ 
            overflowX: 'auto', 
            overflowY: 'hidden', 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none' 
          }}
        >
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white shadow-md rounded-lg border hover:shadow-lg transition-shadow w-80 flex-shrink-0"
              onClick={() => openModal(room)}
            >
              <div className='bg-[#F19962] w-full h-10 shadow-md rounded-t-lg'></div>
              <h2 className="text-xl font-semibold px-4 mt-2">{room.title}</h2>
              <p className="text-gray-700 px-4 mt-2">{room.description}</p>
              <div className="mt-4 px-4 pb-4">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Type:</span> {room.type}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Schedule:</span>{' '}
                  {new Date(room.schedule).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Created:</span>{' '}
                  {new Date(room.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-semibold">Created by:</span>{' '}
                  {room.admin?.name || room.admin?.['name'] || 'Unknown'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={scrollLeft} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-md focus:outline-none"
        >
          &#8249;
        </button>
        <button 
          onClick={scrollRight} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-md focus:outline-none"
        >
          &#8250;
        </button>
      </div>

      {showModal && selectedClassroom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Join Classroom</h2>
            <p>Do you want to join the classroom "{selectedClassroom.title}"?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button 
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300" 
                onClick={closeModal}
              >
                Cancel
              </button>
              <button 
                className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-600" 
                onClick={() => {
                  handleJoinClassroom(selectedClassroom._id);
                  closeModal();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
