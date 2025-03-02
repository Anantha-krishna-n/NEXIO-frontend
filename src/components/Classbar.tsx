import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  Home,
  FileText,
  MessageSquare,
  Video,
  Square,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MembersPopup from "./animateComp/MembersPopup";
import useSocketStore from "@/stores/socketStore";
import { Toaster } from "sonner";
import { useChatNotification } from "../components/coustomHook/useChatNotification"; 

// Define the Message interface or import it from a shared types file
interface UserId {
  _id: string;
}

interface Message {
  _id: string;
  userId: UserId;
  userName: string;
  message: string;
  timestamp: Date;
}

export default function Classbar() {
  const { Id } = useParams();
  const pathname = usePathname();
  const { socket } = useSocketStore();
  const [showMembersPopup, setShowMembersPopup] = useState(false);
  const classroomId = Id?.toString() || "";
  
  // Use the custom hook
  const { unreadMessages, shouldBlink, handleNewMessage } = useChatNotification(pathname);

  useEffect(() => {
    if (!Id || !socket) return;

    socket.emit('joinClassroom', classroomId);

    const onReceiveMessage = (message: Message) => {
      handleNewMessage(message);
    };

    socket.on("receiveMessage", onReceiveMessage);

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
    };
  }, [socket, classroomId, handleNewMessage, Id]);

  const menuItems = [
    { icon: Home, label: "Home", href: `/classroom/${classroomId}` },
    { icon: FileText, label: "Documents", href: `/classroom/${classroomId}/documents` },
    { icon: MessageSquare, label: "Group Chat", href: `/classroom/${classroomId}/chat`, showCount: true },
    { icon: Video, label: "Video Call", href: `/classroom/${classroomId}/video` },
    { icon: Square, label: "Whiteboard", href: `/classroom/${classroomId}/whiteboard` },
    { icon: Users, label: "Members", href: `/classroom/${classroomId}/members` },
  ];
  
  const SidebarContent = () => (
    <div className="w-60 h-[calc(139vh-24rem)] bg-white border-r flex flex-col z-20 fixed">
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

          {item.showCount && unreadMessages > 0 && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={shouldBlink ? { opacity: [1, 0.3, 1] } : {}}
              transition={shouldBlink ? { duration: 1, repeat: Infinity } : {}}
              className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            >
              {unreadMessages}
            </motion.div>
          )}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <Toaster />
      <div className="relative">
        <div className="hidden md:block">
          <SidebarContent />
        </div>

        <div className="md:hidden">
          <div className="p-4">
            <SidebarContent />
          </div>
        </div>

        <div className="p-4 z-10">
          <AnimatePresence>
            {showMembersPopup && (
              <MembersPopup
                onClose={() => setShowMembersPopup(false)}
                roomId={classroomId}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}