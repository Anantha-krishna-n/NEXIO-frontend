"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Home, FileText, MessageSquare, Video, Square, Users } from "lucide-react";

export default function Classbar() {
  const { Id } = useParams(); // Use hook inside the component body
  const pathname = usePathname();

  // Dynamically generate menu items based on Id
  const menuItems = [
    { icon: Home, label: "Home", href: `/classroom/${Id}` },
    { icon: FileText, label: "Documents", href: `/classroom/${Id}/documents` },
    { icon: MessageSquare, label: "Group Chat", href: `/classroom/${Id}/group-chat` },
    { icon: Video, label: "Video Call", href: `/classroom/${Id}/video` },
    { icon: Square, label: "Whiteboard", href: `/classroom/${Id}/whiteboard` },
    { icon: Users, label: "Members", href: `/classroom/${Id}/members` },
  ];

  const SidebarContent = () => (
    <div className="w-60 h-full bg-white border-r flex flex-col">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
            pathname === item.href ? "bg-gray-100" : ""
          }`}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div>
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
    </div>
  );
}
