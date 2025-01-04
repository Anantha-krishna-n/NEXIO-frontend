'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Classbar from '@/components/Classbar';
import { Classroom } from '@/stores/roomStore';
import axiosInstance from '../utils/axiosInstance';
import { useParams } from 'next/navigation';

interface ClassroomLayoutProps {
    children: React.ReactNode;
    classroomId: string; // Pass `classroomId` as a prop to the layout
}

const ClassroomLayout = ({ children, classroomId }: ClassroomLayoutProps) => {
   const { Id } = useParams()
    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [error, setError] = useState<string | null>(null); 

    useEffect(() => {
        // Fetch the classroom data here
        const fetchClassroom = async () => {
            try {
                const response = await axiosInstance.get(
                    `${process.env.NEXT_PUBLIC_URL}/classroom/${Id}`
                );
                setClassroom(response.data.classroom);
            } catch (error) {
                console.error('Failed to fetch classroom:', error);
                setError('Failed to load classroom data.');
            }
        };

        fetchClassroom();
    }, [classroomId]); 

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <Header />
            <div className="flex h-screen bg-gray-100" style={{ marginTop: '85px' }}>
                <Classbar />
                <main className="flex-1 p-6 overflow-hidden">
                    <div className="max-w-4xl mx-auto">
                        {error ? (
                            <div className="text-red-500">{error}</div>
                        ) : (
                            <>
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <h1 className="text-2xl font-semibold mb-1">
                                        {classroom?.title|| 'Loading...'}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Created By: {classroom?.admin?.name || 'Unknown'}
                                    </p>
                                    {/* <p className='align-middle'>{classroom?.inviteLink}</p> */}
                                </div>
                                {children}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ClassroomLayout;
