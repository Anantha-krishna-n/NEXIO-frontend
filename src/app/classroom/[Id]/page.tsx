'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { Classroom } from '@/stores/roomStore';
import { log } from 'console';

const ClassroomPage: React.FC = () => {
  const { Id } = useParams();
  console.log(Id,"dhf")
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/classroom/${Id}`, {
          withCredentials: true,
        });
        console.log(response,"testing")
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
    <div className="container mx-auto p-4 items-center">
      <h1 className="text-3xl font-bold mb-4">{classroom.title}</h1>
      <p className="text-gray-600 mb-2">{classroom.description}</p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Type:</span> {classroom.type}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Schedule:</span> {new Date(classroom.schedule).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Created:</span> {new Date(classroom.createdAt).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        <span className="font-semibold">Created by:</span> {classroom.admin?.name || 'Unknown'}
      </p>
      <Toaster />
    </div>
  );
};

export default ClassroomPage;

