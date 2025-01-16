import { Server } from "socket.io";

export const ioInstance = (httpServer: any) => {
  return new Server(httpServer, {
    cors: {
    origin:process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });
};
