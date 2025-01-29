'use client';

import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const InviteUserForm: React.FC = () => {
  const [classroomId, setClassroomId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!classroomId || !email) {
      toast.error('Please fill in both fields.');
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_URL}/classroom/invite`, {
        classroomId,
        email,
      });

      toast.success(response.data.message || 'Invitation sent successfully!');
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || 'Failed to send the invitation.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6 text-center">Invite User</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Classroom ID Input */}
        <div>
          <label
            htmlFor="classroomId"
            className="block text-sm font-medium text-gray-700"
          >
            Classroom ID
          </label>
          <input
            type="text"
            id="classroomId"
            value={classroomId}
            onChange={(e) => setClassroomId(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter Classroom ID"
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter User Email"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
              loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
            } transition`}
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InviteUserForm;
