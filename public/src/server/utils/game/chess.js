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
exports.getGameInfo = exports.syncWithContractChessGame = exports.chessContract = void 0;
const contracts_1 = require("../../../contracts");
const web3_1 = require("../web3");
const web3_2 = require("../../../lib/web3");
const chessContractAddress = "0x757FEAa65FB76746BB0956d111014C35Cf40f87a";
exports.chessContract = contracts_1.Chess__factory.connect(chessContractAddress, web3_1.roninProvider);
const syncWithContractChessGame = (gameId, callback) => {
    exports.chessContract.on("*", () => __awaiter(void 0, void 0, void 0, function* () {
        const gameInfo = yield (0, exports.getGameInfo)(gameId);
        console.log("🚀 ~ chessContract.on ~ gameInfo:", gameInfo);
        if (gameInfo)
            callback(gameInfo);
    }));
};
exports.syncWithContractChessGame = syncWithContractChessGame;
const getGameInfo = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const gameInfo = yield exports.chessContract.getGameInfo(gameId);
    console.log("🚀 ~ getGameInfo ~ gameInfo", gameInfo);
    const gameFragment = exports.chessContract.interface.fragments.find((fragment) => {
        return fragment.name === "getGameInfo";
    });
    if (gameFragment) {
        const parsedResult = (0, web3_2.parseResult)(gameInfo, gameFragment.outputs);
        console.log("🚀 ~ getGameInfo ~ parsedResult", parsedResult);
        //parsed in to TGame
        parsedResult.playersAddress = parsedResult === null || parsedResult === void 0 ? void 0 : parsedResult.players.split(",");
        parsedResult.firstPlayerIndex = parsedResult.firstPlayerIndex;
        if (parsedResult.decodedMessage && parsedResult.playersAddress) {
            const decodedMessageList = [];
            const decodedMessageParsed = parsedResult.decodedMessage.split(",");
            for (let i = 0; i < parsedResult.playersAddress.length; i++) {
                if (Number(decodedMessageParsed[i]) >= 0) {
                    decodedMessageList.push(parsedResult.playersAddress[i]);
                }
            }
            parsedResult.decodedMessageArray = decodedMessageList;
        }
        parsedResult.latestMoveCountOnContract =
            parsedResult.latestState.split(",")[2];
        return parsedResult;
    }
});
exports.getGameInfo = getGameInfo;
