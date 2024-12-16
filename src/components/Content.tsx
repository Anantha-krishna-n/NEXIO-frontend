'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { useRoomStore } from '@/stores/roomStore';
import axios from 'axios';

interface Classroom {
  _id: string;
  title: string;
  description: string;
  type: 'public' | 'private';
  schedule: string;
  createdAt: string;
}

const Content: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { rooms, setRoom } = useRoomStore();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/classroom/public`);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        loading
      </div>
    );
  }
  return (
    <div className="p-4">
      <div className="text-2xl font-inter text-gray-500 text-center mt-10">
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
    </div>
  );
};

export default Content;
