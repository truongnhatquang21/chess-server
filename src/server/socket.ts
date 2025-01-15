import { Server } from "socket.io";

export const ioInstance = (httpServer: any) => {
  return new Server(httpServer, {
    cors: {
      origin: process.env.HOST_URL,
      methods: ["GET", "POST"],
    },
  });
};
