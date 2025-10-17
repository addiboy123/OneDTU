import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
  transports: ["websocket","polling"],
  withCredentials: true,
});

export default socket;
