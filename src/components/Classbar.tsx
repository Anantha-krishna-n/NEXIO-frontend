"use client";
import Link from "next/link";
import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Home, FileText, MessageSquare, Video, Square, Users } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import MembersPopup from "./animateComp/MembersPopup";

export default function Classbar() {
  const { Id } = useParams(); 
  const pathname = usePathname();
  const [showMembersPopup, setShowMembersPopup] = useState(false);

  const classroomId = Id?.toString() || "";

  const menuItems = [
    { icon: Home, label: "Home", href: `/classroom/${classroomId}` },
    { icon: FileText, label: "Documents", href: `/classroom/${classroomId}/documents` },
    { icon: MessageSquare, label: "Group Chat", href: `/classroom/${classroomId}/chat` },
    { icon: Video, label: "Video Call", href: `/classroom/${classroomId}/video` },
    { icon: Square, label: "Whiteboard", href: `/classroom/${classroomId}/whiteboard` },
    { icon: Users, label: "Members", href: `/classroom/${classroomId}/members` },
  ];

  const SidebarContent = () => (
    <div className="w-60 h-[calc(139vh-24rem)] bg-white border-r flex flex-col relative z-20">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-4 py-4 text-grey-500 hover:bg-orange-400 transition-colors ${
            pathname === item.href ? "bg-gray-100" : ""
          }`}
          onClick={(e) => {
            if (item.label === "Members") {
              e.preventDefault();
              setShowMembersPopup(!showMembersPopup);
            }
          }}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <div className="relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <div className="md:hidden">
          <div className="p-4">
            <SidebarContent />
          </div>
        </div>

        {/* Members Popup */}
        <div className="p-4">

        <AnimatePresence >
          {showMembersPopup && (
            <MembersPopup 
              onClose={() => setShowMembersPopup(false)} 
              roomId={classroomId} // Pass the roomId to the component
            />
          )}
        </AnimatePresence>
        </div>
      </div>
    </>
  );
}
