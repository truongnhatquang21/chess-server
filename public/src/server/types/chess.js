"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessGameStage = exports.ChessGameMode = void 0;
var ChessGameMode;
(function (ChessGameMode) {
    ChessGameMode["PracticePvE"] = "PracticePvE";
    ChessGameMode["PracticePvP"] = "PracticePvP";
    ChessGameMode["Web3PvP"] = "Web3PvP";
})(ChessGameMode || (exports.ChessGameMode = ChessGameMode = {}));
var ChessGameStage;
(function (ChessGameStage) {
    ChessGameStage[ChessGameStage["Empty"] = 0] = "Empty";
    ChessGameStage[ChessGameStage["New"] = 1] = "New";
    ChessGameStage[ChessGameStage["Revealing"] = 2] = "Revealing";
    ChessGameStage[ChessGameStage["Playing"] = 3] = "Playing";
    ChessGameStage[ChessGameStage["Completed"] = 4] = "Completed";
})(ChessGameStage || (exports.ChessGameStage = ChessGameStage = {}));
