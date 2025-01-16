"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioInstance = void 0;
const socket_io_1 = require("socket.io");
const ioInstance = (httpServer) => {
    return new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
};
exports.ioInstance = ioInstance;
