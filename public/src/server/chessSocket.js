"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chessSocket = void 0;
const uuid_1 = require("uuid");
const chess_1 = require("./types/chess");
const chess_2 = require("./utils/game/chess");
const web3_1 = require("../lib/web3");
const chess_3 = require("../lib/chess");
const chessSocket = (io) => {
    const rooms = new Map();
    io.on("connection", (socket) => {
        socket.on("online", (args) => {
            socket.data.userId = args.userId;
            socket.data.address = args.address;
        });
        socket.on("createRoom", (args, callback) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const roomId = (args === null || args === void 0 ? void 0 : args.roomId) || (0, uuid_1.v4)();
            const chessGameMode = args === null || args === void 0 ? void 0 : args.gamePlayMode;
            const orientation = (args === null || args === void 0 ? void 0 : args.orientation) || "white";
            yield socket.join(roomId);
            const newRoom = {
                turnTime: args.turnTime,
                roomId,
                players: [
                    {
                        id: socket.id,
                        userId: (_a = socket.data) === null || _a === void 0 ? void 0 : _a.userId,
                        orientation: orientation,
                        address: (_b = socket.data) === null || _b === void 0 ? void 0 : _b.address,
                    },
                ],
                stepList: [],
                stepSignedList: [],
                stage: chess_1.ChessGameStage.New,
                gamePlayMode: chessGameMode,
            };
            rooms.set(roomId, newRoom);
            callback(newRoom);
            (0, chess_2.syncWithContractChessGame)(roomId, (gameInfo) => {
                const room = rooms.get(roomId);
                if (!room)
                    return;
                let cloneRoom = JSON.parse(JSON.stringify(room));
                cloneRoom = Object.assign(Object.assign({}, cloneRoom), { drawFlag: gameInfo.drawFlag, stage: gameInfo.gameStage, reportTimeOutEndTime: gameInfo.reportTimeOutEndTime, reportTimeOutPlayer: Number(gameInfo.reportTimeOutPlayerIndex) >= 0
                        ? gameInfo.playersAddress[Number(gameInfo.reportTimeOutPlayerIndex)]
                        : undefined, revealEndTime: gameInfo.revealEndTime, winner: gameInfo.winner, firstPlayer: Number(gameInfo.firstPlayerIndex) >= 0
                        ? gameInfo.playersAddress[Number(gameInfo.firstPlayerIndex)]
                        : undefined, playersAddress: gameInfo.playersAddress, decodedMessageArray: gameInfo.decodedMessageArray, betAmount: gameInfo.betAmount, lastestMoveCountOnContract: gameInfo.latestMoveCountOnContract, turnTime: gameInfo.turnTime });
                if (room.firstPlayer) {
                    const newPlayerWithOrientation = cloneRoom.players.map((p) => {
                        var _a, _b;
                        if (((_a = p.address) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === ((_b = room.firstPlayer) === null || _b === void 0 ? void 0 : _b.toLowerCase())) {
                            return Object.assign(Object.assign({}, p), { orientation: "white" });
                        }
                        return Object.assign(Object.assign({}, p), { orientation: "black" });
                    });
                    cloneRoom.players = newPlayerWithOrientation;
                }
                rooms.set(roomId, cloneRoom);
                console.log("🚀 ~ syncWithContractChessGame ~ cloneRoom:", cloneRoom);
                console.log("from room" + roomId + "🚀 ~ Emit event ~ gameInfo:", gameInfo);
                io.to(roomId).emit("syncWithContractChessGame", cloneRoom);
            });
        }));
        socket.on("joinRoom", (args, callback) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const room = rooms.get(args.roomId);
            console.log("🚀 ~ joinRoom ~ room", args);
            console.log("🚀 ~ joinRoom ~ room", room);
            if (!room) {
                callback({
                    message: "Room does not exist.",
                });
                return;
            }
            switch (room.players.length) {
                case 0: {
                    const cloneRoom = JSON.parse(JSON.stringify(room));
                    yield socket.join(args.roomId);
                    cloneRoom.players = [
                        {
                            id: socket.id,
                            address: (_a = socket.data) === null || _a === void 0 ? void 0 : _a.address,
                            userId: (_b = socket.data) === null || _b === void 0 ? void 0 : _b.userId,
                            orientation: args.orientation || "white",
                        },
                    ];
                    rooms.set(args.roomId, cloneRoom);
                    callback(cloneRoom);
                    break;
                }
                case 1: {
                    yield socket.join(args.roomId);
                    const cloneRoom = JSON.parse(JSON.stringify(room));
                    const existedPlayer = cloneRoom.players.find((player) => { var _a; return (0, web3_1.compareAddress)(player.address, (_a = socket.data) === null || _a === void 0 ? void 0 : _a.address); });
                    if (existedPlayer) {
                        existedPlayer.id = socket.id;
                        cloneRoom.players = [existedPlayer];
                    }
                    else {
                        if (cloneRoom.gamePlayMode === chess_1.ChessGameMode.PracticePvP &&
                            Number(cloneRoom.stage) !== chess_1.ChessGameStage.Completed) {
                            cloneRoom.stage = chess_1.ChessGameStage.Playing;
                        }
                        cloneRoom.players.push({
                            address: (_c = socket.data) === null || _c === void 0 ? void 0 : _c.address,
                            id: socket.id,
                            userId: (_d = socket.data) === null || _d === void 0 ? void 0 : _d.userId,
                            orientation: args.orientation || "black",
                        });
                    }
                    rooms.set(args.roomId, cloneRoom);
                    callback(cloneRoom);
                    break;
                }
                case 2: {
                    const cloneRoom = JSON.parse(JSON.stringify(room));
                    const existedPlayer = cloneRoom.players.find((p) => { var _a; return (0, web3_1.compareAddress)(p.address, (_a = socket.data) === null || _a === void 0 ? void 0 : _a.address); });
                    if (!existedPlayer) {
                        callback({
                            message: "Room is full.",
                        });
                        return;
                    }
                    if (cloneRoom.gamePlayMode === chess_1.ChessGameMode.PracticePvP &&
                        Number(cloneRoom.stage) !== chess_1.ChessGameStage.Completed) {
                        cloneRoom.stage = chess_1.ChessGameStage.Playing;
                    }
                    yield socket.join(args.roomId);
                    existedPlayer.id = socket.id;
                    const otherPlayer = cloneRoom.players.filter((p) => {
                        var _a;
                        return (0, web3_1.compareAddress)(p.address, (_a = socket.data) === null || _a === void 0 ? void 0 : _a.address) ===
                            false;
                    });
                    cloneRoom.players = [...otherPlayer, existedPlayer];
                    rooms.set(args.roomId, cloneRoom);
                    callback(cloneRoom);
                    break;
                }
                default: {
                    callback({
                        message: "Room is full.",
                    });
                    return;
                }
            }
            io.to(args.roomId).emit("opponentJoined", rooms.get(args.roomId));
        }));
        socket.on("move", (data, callback) => {
            console.log("🚀 ~ move ~ data", data);
            const room = rooms.get(data.roomId);
            if (!room) {
                return;
            }
            if (room.stage === chess_1.ChessGameStage.Completed) {
                callback({ message: "Game is already completed." });
                return;
            }
            const chess = (0, chess_3.ChessClass)(data.fen);
            const cloneRoom = JSON.parse(JSON.stringify(room));
            cloneRoom.stepList.push(data.fen);
            if (data.signedMove)
                cloneRoom.stepSignedList.push(data.signedMove);
            rooms.set(data.roomId, cloneRoom);
            console.log("🚀 ~ send move ~ cloneRoom", cloneRoom);
            socket.to(data.roomId).emit("move", data);
        });
        // socket.on("disconnect", () => {
        //   const gameRooms = Array.from(rooms.values());
        //   gameRooms.forEach((room) => {
        //     const userInRoom = room.players.find(
        //       (player) => player.id === socket.id
        //     );
        //     if (userInRoom) {
        //       if (room.players.length < 2) {
        //         // if there's only 1 player in the room, close it and exit.
        //         rooms.delete(room.roomId);
        //         return;
        //       }
        //       socket.to(room.roomId).emit("playerDisconnected", userInRoom); // <- 4
        //     }
        //   });
        // });
        socket.on("closeRoom", (data) => __awaiter(void 0, void 0, void 0, function* () {
            socket.to(data.roomId).emit("closeRoom", data); // <- 1 inform others in the room that the room is closing
            const clientSockets = yield io.in(data.roomId).fetchSockets(); // <- 2 get all sockets in a room
            // loop over each socket client
            clientSockets.forEach((s) => {
                s.leave(data.roomId); // <- 3 and make them leave the room on socket.io
            });
            rooms.delete(data.roomId); // <- 4 delete room from rooms map
        }));
    });
};
exports.chessSocket = chessSocket;
