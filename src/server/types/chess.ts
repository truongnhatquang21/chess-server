import Chess from "chess.js";

export enum ChessGameMode {
  PracticePvE = "PracticePvE",
  PracticePvP = "PracticePvP",
  Web3PvP = "Web3PvP",
}

export type BoardOrientation = "white" | "black";

export enum ChessGameStage {
  Empty,
  New,
  Revealing,
  Playing,
  Completed,
}
export type Troom = {
  roomId: string;
  players: {
    id: string;
    userId: string;
    orientation: BoardOrientation;
    address?: string;
  }[];
  stepList: string[];
  stepSignedList: TSignedGameState[];
  stage: ChessGameStage;
  betAmount?: string;
  reportTimeOutEndTime?: string;
  reportTimeOutPlayer?: string;
  revealEndTime?: string;
  winner?: string;
  gamePending?: boolean;
  firstPlayer?: string;
  playersAddress?: string[];
  decodedMessageArray?: string[];
  gamePlayMode?: ChessGameMode;
  drawFlag?: string;
  lastestMoveCountOnContract?: string;
  turnTime: string;
};

export type TMove = {
  move: Chess.ShortMove | string;
  fen: string;
  roomId: string;
  signedMove?: TSignedGameState;
};

export type TSignedGameState = {
  gameID: string;
  board: string;
  moveCount: number;
  signature: string;
  from: number;
  to: number;
};

export type TSignedGameOnContractState = Omit<TSignedGameState, "from" | "to">;
