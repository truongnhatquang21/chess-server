import { Chess, ChessInstance } from 'chess.js';

export const ChessClass = (fen: string): ChessInstance => {
  return new Chess(fen);
};