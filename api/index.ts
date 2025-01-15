require('dotenv').config()
import { chessSocket } from '../src/server/chessSocket';
import { ioInstance } from '../src/server/socket';

const PORT= process.env.PORT
const express = require("express");
const appInstance = express();
const http = require('http');
const server = http.createServer(appInstance);
  const io = ioInstance(server);
  //socket instance
  chessSocket(io);
appInstance.get("/", (req: Request,res:any) => res.send("Chess server running"));

server.listen(PORT, () => console.log("Chess server running on port "+PORT+"--"+ process.env.SAIGON_TESTNET_RPC));
