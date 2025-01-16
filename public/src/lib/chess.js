"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessClass = void 0;
const chess_js_1 = require("chess.js");
const ChessClass = (fen) => {
    return new chess_js_1.Chess(fen);
};
exports.ChessClass = ChessClass;
