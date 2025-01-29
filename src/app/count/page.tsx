// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Users, Lock } from "lucide-react";
// // import axiosInstance from "@/utils/axiosInstance"; // Adjust the path as per your file structure
// import axiosInstance from "../utils/axiosInstance";
// interface ClassroomCounts {
//   publicCount: number;
//   privateCount: number;
// }

// export default function DashboardPage() {
//  const [counts, setCounts] = useState<ClassroomCounts>({ publicCount: 0, privateCount: 0 });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const response = await axiosInstance.get(
//             `${process.env.NEXT_PUBLIC_URL}/classroom/count`
//           );        setCounts(response.data.counts);
//       } catch (err: any) {
//         setError("Error fetching classroom counts");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCounts();
//   }, []);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Your Classrooms</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Public Classrooms</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{counts?.publicCount || 0}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Private Classrooms</CardTitle>
//             <Lock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{counts?.privateCount || 0}</div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
