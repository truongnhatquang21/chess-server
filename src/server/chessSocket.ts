import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { BoardOrientation, ChessGameMode, ChessGameStage, TMove, Troom } from "./types/chess";

import { syncWithContractChessGame } from "./utils/game/chess";
import { compareAddress } from "../lib/web3";
import { ChessClass } from '../lib/chess';
export const chessSocket = (io: Server) => {
  const rooms = new Map<string, Troom>();

  io.on("connection", (socket) => {
    socket.on("online", (args) => {
      socket.data.userId = args.userId;
      socket.data.address = args.address;
    });

    socket.on("createRoom", async (args, callback) => {
      const roomId = args?.roomId || uuidv4();
      const chessGameMode = args?.gamePlayMode;
      const orientation = args?.orientation || "white";
      await socket.join(roomId);
      const newRoom: Troom = {
        turnTime: args.turnTime,
        roomId,
        players: [
          {
            id: socket.id,
            userId: socket.data?.userId,
            orientation: orientation,
            address: socket.data?.address,
          },
        ],
        stepList: [],
        stepSignedList: [],
        stage: ChessGameStage.New,
        gamePlayMode: chessGameMode,
      };
      rooms.set(roomId, newRoom);
      callback(newRoom);
      syncWithContractChessGame(roomId, (gameInfo) => {
        const room = rooms.get(roomId);
        if (!room) return;
        let cloneRoom = JSON.parse(JSON.stringify(room)) as Troom;
        cloneRoom = {
          ...cloneRoom,
          drawFlag: gameInfo.drawFlag,
          stage: gameInfo.gameStage,
          reportTimeOutEndTime: gameInfo.reportTimeOutEndTime,
          reportTimeOutPlayer:
            Number(gameInfo.reportTimeOutPlayerIndex) >= 0
              ? gameInfo.playersAddress[
                  Number(gameInfo.reportTimeOutPlayerIndex)
                ]
              : undefined,
          revealEndTime: gameInfo.revealEndTime,
          winner: gameInfo.winner,
          firstPlayer:
            Number(gameInfo.firstPlayerIndex) >= 0
              ? gameInfo.playersAddress[Number(gameInfo.firstPlayerIndex)]
              : undefined,
          playersAddress: gameInfo.playersAddress,
          decodedMessageArray: gameInfo.decodedMessageArray,
          betAmount: gameInfo.betAmount,
          lastestMoveCountOnContract: gameInfo.latestMoveCountOnContract,
          turnTime: gameInfo.turnTime,
        };
        if (room.firstPlayer) {
          const newPlayerWithOrientation = cloneRoom.players.map((p) => {
            if (p.address?.toLowerCase() === room.firstPlayer?.toLowerCase()) {
              return {
                ...p,
                orientation: "white" as BoardOrientation,
              };
            }
            return {
              ...p,
              orientation: "black" as BoardOrientation,
            };
          });
          cloneRoom.players = newPlayerWithOrientation;
        }

        rooms.set(roomId, cloneRoom);
        console.log("🚀 ~ syncWithContractChessGame ~ cloneRoom:", cloneRoom);
        console.log(
          "from room" + roomId + "🚀 ~ Emit event ~ gameInfo:",
          gameInfo
        );

        io.to(roomId).emit("syncWithContractChessGame", cloneRoom);
      });
    });

    socket.on("joinRoom", async (args, callback) => {
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
          const cloneRoom = JSON.parse(JSON.stringify(room)) as Troom;
          await socket.join(args.roomId);
          cloneRoom.players = [
            {
              id: socket.id,
              address: socket.data?.address,
              userId: socket.data?.userId,
              orientation: args.orientation || "white",
            },
          ];
          rooms.set(args.roomId, cloneRoom);
          callback(cloneRoom);
          break;
        }
        case 1: {
          await socket.join(args.roomId);
          const cloneRoom = JSON.parse(JSON.stringify(room)) as Troom;
          const existedPlayer = cloneRoom.players.find((player) =>
            compareAddress(player.address as string, socket.data?.address)
          );
          if (existedPlayer) {
            existedPlayer.id = socket.id;
            cloneRoom.players = [existedPlayer];
          } else {
            if (
              cloneRoom.gamePlayMode === ChessGameMode.PracticePvP &&
              Number(cloneRoom.stage) !== ChessGameStage.Completed
            ) {
              cloneRoom.stage = ChessGameStage.Playing;
            }
            cloneRoom.players.push({
              address: socket.data?.address,
              id: socket.id,
              userId: socket.data?.userId,
              orientation: args.orientation || "black",
            });
          }
          rooms.set(args.roomId, cloneRoom);
          callback(cloneRoom);
          break;
        }
        case 2: {
          const cloneRoom = JSON.parse(JSON.stringify(room)) as Troom;
          const existedPlayer = cloneRoom.players.find((p) =>
            compareAddress(p.address as string, socket.data?.address)
          );
          if (!existedPlayer) {
            callback({
              message: "Room is full.",
            });
            return;
          }

          if (
            cloneRoom.gamePlayMode === ChessGameMode.PracticePvP &&
            Number(cloneRoom.stage) !== ChessGameStage.Completed
          ) {
            cloneRoom.stage = ChessGameStage.Playing;
          }

          await socket.join(args.roomId);
          existedPlayer.id = socket.id;
          const otherPlayer = cloneRoom.players.filter(
            (p) =>
              compareAddress(p.address as string, socket.data?.address) ===
              false
          );
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
    });

    socket.on("move", (data: TMove, callback) => {
      console.log("🚀 ~ move ~ data", data);

      const room = rooms.get(data.roomId);
      if (!room) {
        return;
      }
      if (room.stage === ChessGameStage.Completed) {
        callback({ message: "Game is already completed." });
        return;
      }

      const chess = ChessClass(data.fen);

      const cloneRoom = JSON.parse(JSON.stringify(room)) as Troom;
      cloneRoom.stepList.push(data.fen);
      if (data.signedMove) cloneRoom.stepSignedList.push(data.signedMove);

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

    socket.on("closeRoom", async (data) => {
      socket.to(data.roomId).emit("closeRoom", data); // <- 1 inform others in the room that the room is closing

      const clientSockets = await io.in(data.roomId).fetchSockets(); // <- 2 get all sockets in a room

      // loop over each socket client
      clientSockets.forEach((s) => {
        s.leave(data.roomId); // <- 3 and make them leave the room on socket.io
      });

      rooms.delete(data.roomId); // <- 4 delete room from rooms map
    });
  });
};
