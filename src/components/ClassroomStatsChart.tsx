import React, { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { fetchClassroomStats } from "@/app/service/adminService";
import axios from "axios";

interface ClassroomStats {
  week: string;
  publicCount: number;
  privateCount: number;
}

const ClassroomStatsChart: React.FC = () => {
  const [data, setData] = useState<ClassroomStats[]>([]);
  const [viewType, setViewType] = useState<"public" | "private">("public");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await fetchClassroomStats();
        setData(stats);
      } catch (error) {
        console.error(error);
      }
    };
    loadStats();
  }, []);


  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      {/* Header & Buttons */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Classroom Trends</h2>
        <div className="space-x-2">
          {["public", "private"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg ${
                viewType === type ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setViewType(type as "public" | "private")}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {viewType === "public" && <Line type="monotone" dataKey="publicCount" stroke="#007bff" />}
          {viewType === "private" && <Line type="monotone" dataKey="privateCount" stroke="#ff5733" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClassroomStatsChart;
