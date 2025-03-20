import { createClient, Room } from "@liveblocks/client";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useUserStore } from "@/stores/authStore";

export function createLiveblocksClient() {
  const accessToken = useUserStore.getState().accessToken;

  return createClient({
    authEndpoint: async (roomId) => {
      if (!roomId) {
        throw new Error("Room ID is required for authentication");
      }

      const response = await fetch(`/api/liveblock-auth?roomId=${roomId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate with Liveblocks");
      }

      const data = await response.json();
      return data.token;
    },
  });
}

export function createCollaborationStore(roomId: string) {
  const client = createLiveblocksClient();
  const yDoc = new Y.Doc();
  const wsProvider = new WebsocketProvider("ws://localhost:1234", roomId, yDoc);

  let room: Room | null = client.getRoom(roomId);
  if (!room) {
    const roomEntry = client.enterRoom(roomId); 
    room = roomEntry.room; // ✅ Extract `room` from the returned object
  }

  if (!room) {
    throw new Error("Failed to join Liveblocks room");
  }

  return { client, room, yDoc, wsProvider }; // ✅ Return `client` too
}
