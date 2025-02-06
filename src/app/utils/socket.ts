import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
  withCredentials: true,
});

export default socket;
