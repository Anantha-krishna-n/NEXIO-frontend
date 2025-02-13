"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import axiosInstance from "@/app/utils/axiosInstance"
import { useUserStore } from "@/stores/authStore"
import { Tldraw, TldrawEditor, useEditor } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"
import useSocketStore from "@/stores/socketStore"

export default function WhiteboardPage() {
  const params = useParams()
  const classroomId = params.Id as string
  const [elements, setElements] = useState<any[]>([])
  const isRemoteUpdate = useRef(false)
  const { user } = useUserStore()
  const { socket, connect, disconnect } = useSocketStore()

  const loadInitialData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/whiteboard/${classroomId}`)
      if (!response.data.elements) {
        await axiosInstance.post(`/whiteboard/initialize/${classroomId}`)
        setElements([])
      } else {
        setElements(response.data.elements)
      }
    } catch (error) {
      console.log("Error loading whiteboard:", error)
    }
  }, [classroomId])

  useEffect(() => {
    if (!classroomId) return

    connect()
    loadInitialData()

    return () => {
      disconnect()
    }
  }, [classroomId, connect, disconnect, loadInitialData])

  useEffect(() => {
    if (!socket) return

    socket.emit("joinClassroom", classroomId)

    const handleWhiteboardUpdate = (newElements: any[]) => {
      isRemoteUpdate.current = true
      setElements(newElements)
      setTimeout(() => (isRemoteUpdate.current = false), 0)
    }

    socket.on("whiteboard-update", handleWhiteboardUpdate)

    return () => {
      socket.off("whiteboard-update", handleWhiteboardUpdate)
    }
  }, [socket, classroomId])

  const saveWhiteboard = useCallback(async (elements: any[], classroomId: string) => {
    try {
      await axiosInstance.put(`/whiteboard/${classroomId}`, { elements })
      alert("Whiteboard saved successfully!")
    } catch (error) {
      console.log("Error saving whiteboard:", error)
      alert("Failed to save whiteboard.")
    }
  }, [])

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
            classroomId={classroomId}
            user={user}
            isRemoteUpdate={isRemoteUpdate}
            socket={socket}
          />
        </TldrawEditor>
      </div>
    </div>
  )
}

function EditorListener({ setElements, classroomId, user, isRemoteUpdate, socket }: any) {
  const editor = useEditor()

  useEffect(() => {
    if (!editor || !socket) return

    const handleChange = () => {
      const updatedElements = Object.values(editor.getCurrentPageShapes())
      setElements(updatedElements)

      if (!isRemoteUpdate.current && user) {
        socket.emit("whiteboard-update", {
          roomId: classroomId,
          elements: updatedElements,
        })

        axiosInstance
          .put(`/whiteboard/edit/${classroomId}`, { elements: updatedElements })
          .catch((error) => console.error("Error updating whiteboard:", error))
      }
    }

    const unsubscribe = editor.store.listen(handleChange)
    return () => unsubscribe()
  }, [editor, socket, user, classroomId, setElements, isRemoteUpdate])

  return null
}

