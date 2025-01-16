"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const chessSocket_1 = require("../src/server/chessSocket");
const socket_1 = require("../src/server/socket");
const PORT = process.env.PORT;
const express = require("express");
const appInstance = express();
const http = require('http');
const server = http.createServer(appInstance);
const io = (0, socket_1.ioInstance)(server);
//socket instance
(0, chessSocket_1.chessSocket)(io);
appInstance.get("/", (req, res) => res.send("Chess server running"));
server.listen(PORT, () => console.log("Chess server running on port " + PORT + "--" + process.env.SAIGON_TESTNET_RPC));
