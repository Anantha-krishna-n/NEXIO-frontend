import { setupWSConnection } from "y-websocket/bin/utils";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 1234 });

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req, { gc: true });
});

console.log("Yjs WebSocket server running on ws://localhost:1234");