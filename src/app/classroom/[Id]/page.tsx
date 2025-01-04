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
          {/* Header Section */}
          {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-semibold mb-1">{classroom.title}</h1>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Created By:</span> {classroom.admin?.name || 'Unknown'}
            </p>
          </div> */}
          {/* Welcome Section */}
          {/* <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome to {classroom.title}</h2>
            <p className="mb-4">
              This is your classroom homepage. You can access all your classroom resources and activities from here.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>View and upload documents</li>
              <li>Participate in group chats</li>
              <li>Join video calls</li>
              <li>Collaborate on the whiteboard</li>
              <li>Manage classroom members</li>
            </ul>
          </div> */}

          {/* Classroom Details Section */}
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
