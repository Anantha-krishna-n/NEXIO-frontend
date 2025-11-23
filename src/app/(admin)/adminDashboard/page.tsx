// admin-Dashboard/page.tsx
import ClassroomStatsChart from "@/components/ClassroomStatsChart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <ClassroomStatsChart />
    </div>
  );
}