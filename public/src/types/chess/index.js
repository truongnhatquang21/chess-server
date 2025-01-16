"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChessGameStatus = exports.ChessGameStage = void 0;
var ChessGameStage;
(function (ChessGameStage) {
    ChessGameStage[ChessGameStage["Empty"] = 0] = "Empty";
    ChessGameStage[ChessGameStage["New"] = 1] = "New";
    ChessGameStage[ChessGameStage["Revealing"] = 2] = "Revealing";
    ChessGameStage[ChessGameStage["Playing"] = 3] = "Playing";
    ChessGameStage[ChessGameStage["Completed"] = 4] = "Completed";
})(ChessGameStage || (exports.ChessGameStage = ChessGameStage = {}));
const getChessGameStatus = (stage) => {
    return Object.keys(ChessGameStage).find((key) => {
        return ChessGameStage[key] === stage;
    });
};
exports.getChessGameStatus = getChessGameStatus;
