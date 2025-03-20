"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Tldraw, TldrawEditor, useEditor } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import useSocketStore from "@/stores/socketStore";
import * as Y from "yjs";
export default function WhiteboardPage() {
  const params = useParams();
  const classroomId = params.Id as string;
  const isRemoteUpdate = useRef(false);
  const { socket } = useSocketStore();

  // Yjs Document & State
  const [yDoc] = useState(() => new Y.Doc());
  const [yArray] = useState(() => yDoc.getArray("whiteboard"));

  useEffect(() => {
    if (!socket || !classroomId) return;

    socket.emit("joinClassroom", classroomId);

    const handleLoadWhiteboard = (initialElements: any[] | null | undefined) => {
      console.log("📥 Attempting to load whiteboard data from backend:", initialElements);
    
      isRemoteUpdate.current = true;
    
      if (!initialElements || initialElements.length === 0) {
        console.log("⚠️ No initial data found. Starting with an empty whiteboard.");
        yArray.delete(0, yArray.length);
      } else {
        yArray.delete(0, yArray.length);
        yArray.push(initialElements);
      }
    
      isRemoteUpdate.current = false;
      console.log("✅ Yjs State after Load:", yArray.toArray());
    };
    
    

    // Listen for real-time whiteboard updates
    const handleWhiteboardUpdate = (updatedElements: any[]) => {
      console.log("🔄 Received live update:", updatedElements);
      isRemoteUpdate.current = true;
      yArray.delete(0, yArray.length);
      yArray.push(updatedElements);
      isRemoteUpdate.current = false;
      console.log("✅ Yjs State after Live Update:", yArray.toArray());

    };

    socket.on("loadWhiteboard", handleLoadWhiteboard);
    socket.on("whiteboard-update", handleWhiteboardUpdate);

    return () => {
      socket.off("loadWhiteboard", handleLoadWhiteboard);
      socket.off("whiteboard-update", handleWhiteboardUpdate);
    };
  }, [socket, classroomId, yArray]);

  return (
    <div className="h-full w-full relative">
      <div style={{ height: "60vh", width: "60vw" }}>
        <TldrawEditor>
          <Tldraw />
          <EditorListener yArray={yArray} classroomId={classroomId} socket={socket} isRemoteUpdate={isRemoteUpdate} />
        </TldrawEditor>
      </div>
    </div>
  );
}

function EditorListener({ yArray, classroomId, socket, isRemoteUpdate }: any) {
  const editor = useEditor();

  useEffect(() => {
    if (!editor || !socket) return;

    // Sync the editor with Yjs state
    const updateFromYjs = () => {
      if (!isRemoteUpdate.current) {
        const newElements = yArray.toArray();
        console.log("📌 Syncing Yjs data to editor:", newElements); 
        const existingShapeIds = Array.from(editor.getCurrentPageShapeIds());
        console.log("🔍 Existing Shape IDs:", existingShapeIds);
        // Clear existing shapes
        if (existingShapeIds.length > 0) {
          editor.deleteShapes(existingShapeIds);
        }

        // Create new shapes from Yjs data
        if (newElements.length > 0) {
          editor.createShapes(newElements);
        }
      }
    };

    yArray.observe(updateFromYjs);

    const handleChange = () => {
      if (!isRemoteUpdate.current) {
        const updatedElements = Object.values(editor.getCurrentPageShapes());
    
        console.log("📝 Local change detected (first-time use possible):", updatedElements);
    
        if (updatedElements.length === 0) {
          console.log("⚠️ No shapes created yet. Waiting for user input...");
          return; // Do nothing if no shapes exist
        }
    
        // 🔹 Send update to backend
        socket.emit("whiteboard-update", {
          roomId: classroomId,
          elements: updatedElements,
        });
    
        // 🔹 Store in Yjs (triggers sync for all users)
        isRemoteUpdate.current = true;
        yArray.delete(0, yArray.length);
        yArray.push(updatedElements);
        isRemoteUpdate.current = false;
    
        console.log("✅ Yjs State after Local Change:", yArray.toArray());
    
        // 🔹 If this is the first time, ask the server to SAVE this data
        socket.emit("saveWhiteboard", {
          roomId: classroomId,
          elements: updatedElements,
        });
    
        console.log("💾 Requesting server to store initial whiteboard state...");
      }
    };
    
    ;

    const unsubscribe = editor.store.listen(handleChange);
    return () => {
      yArray.unobserve(updateFromYjs);
      unsubscribe();
    };
  }, [editor, socket, yArray, classroomId, isRemoteUpdate]);

  return null;
}
