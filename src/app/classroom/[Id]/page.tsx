'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { Classroom } from '@/stores/roomStore';

const ClassroomPage: React.FC = () => {
  const { Id } = useParams();
  console.log(Id, "Classroom ID");
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/classroom/${Id}`, {
          withCredentials: true,
        });
        console.log(response.data, "Classroom details fetched");
        setClassroom(response.data.classroom);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching classroom details');
        setLoading(false);
      }
    };
    if (Id) {
      fetchClassroom();
    }
  }, [Id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!classroom) {
    return <div className="flex justify-center items-center h-screen">Classroom not found</div>;
  }
  return (
    <div className="flex h-screen bg-gray-100">
     
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Classroom Details</h2>
            <p className="text-gray-600 mb-2">{classroom.description}</p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Type:</span> {classroom.type}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Schedule:</span>{' '}
              {new Date(classroom.schedule).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Created:</span>{' '}
              {new Date(classroom.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <Toaster />
      </main>
    </div>
  );
};

export default ClassroomPage;
