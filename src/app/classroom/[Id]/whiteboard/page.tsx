"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import axiosInstance from "@/app/utils/axiosInstance";
import { useUserStore } from "@/stores/authStore";
import { Tldraw, TldrawEditor, useEditor } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

export default function WhiteboardPage() {
  const params = useParams();
  const classroomId = params.Id as string;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [elements, setElements] = useState<any[]>([]);
  const isRemoteUpdate = useRef(false);
  const { user } = useUserStore();

  useEffect(() => {
    if (!classroomId) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_URL!, {
      withCredentials: true,
    });
    setSocket(socketInstance);

    // socketInstance.on("connect", () => {
    //   socketInstance.emit("joinClassroom", classroomId);
    // });

    const loadInitialData = async () => {
      try {
        const response = await axiosInstance.get(`/whiteboard/${classroomId}`);
        if (!response.data.elements) {
          await axiosInstance.post(`/whiteboard/initialize/${classroomId}`);
          setElements([]);
        } else {
          setElements(response.data.elements);
        }
      } catch (error) {
        console.error("Error loading whiteboard:", error);
      }
    };
    loadInitialData();

    socketInstance.on("whiteboard-update", (newElements: any[]) => {
      isRemoteUpdate.current = true;
      setElements(newElements);
      setTimeout(() => (isRemoteUpdate.current = false), 0);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [classroomId]);

  return (
    <div className="h-full w-full relative">
      <button
        onClick={() => saveWhiteboard(elements, classroomId)}
        className="absolute top-4 right-4 z-10 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
      <div style={{ height: "60vh", width: "60vw" }}>
        <TldrawEditor>
     
          <Tldraw />
          <EditorListener
            setElements={setElements}
            socket={socket}
            classroomId={classroomId}
            user={user}
          />
        </TldrawEditor>
      </div>
    </div>
  );
}

function EditorListener({ setElements, socket, classroomId, user }: any) {
  const editor = useEditor();

  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      const updatedElements = Object.values(editor.getCurrentPageShapes());
      setElements(updatedElements);

      if (socket && user) {
        socket.emit("whiteboard-update", {
          roomId: classroomId,
          elements: updatedElements,
        });

        axiosInstance
          .put(`/whiteboard/${classroomId}`, { elements: updatedElements })
          .catch((error) => console.error("Error updating whiteboard:", error));
      }
    };

    const unsubscribe = editor.store.listen(handleChange);
    return () => unsubscribe();
  }, [editor, socket, user, classroomId]);

  return null;
}

async function saveWhiteboard(elements: any[], classroomId: string) {
  try {
    await axiosInstance.put(`/whiteboard/${classroomId}`, { elements });
    alert("Whiteboard saved successfully!");
  } catch (error) {
    console.error("Error saving whiteboard:", error);
    alert("Failed to save whiteboard.");
  }
}
