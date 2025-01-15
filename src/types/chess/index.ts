import { TSignedGameState } from '../../server/types/chess'

export type TGameCreateEvent = {
  betAmount: string
  gameID: string
  keccakMessage: string
  player0: string
  _turnTime: number
}

export type TGameJoinEvent = {
  gameID: string
  player1: string
  keccakMessage: string
}
export type TGame = {
  gameID?: string
  betAmount: string
  gameStage: ChessGameStage
  firstPlayerIndex: string
  latestState: string
  reportTimeOutEndTime: string
  reportTimeOutPlayerIndex: string
  revealEndTime: string
  winner: string
  players: string
  playersAddress: string[]
  decodedMessage: string
  decodedMessageArray: string[]
  drawFlag: string
  latestMoveCountOnContract: string
  turnTime: string
  _turnTime: string
}

export enum ChessGameStage {
  Empty,
  New,
  Revealing,
  Playing,
  Completed,
}

export const getChessGameStatus = (stage: ChessGameStage) => {
  return Object.keys(ChessGameStage).find((key) => {
    return ChessGameStage[key as keyof typeof ChessGameStage] === stage
  })
}

export type TGameBase = {
  myOrientation?: 'white' | 'black'
  isMyTurn?: boolean
  canMove: boolean
  hasReportedDraw?: boolean
  hasReportedTimeout?: boolean
  myAddress?: string
  opponentAddress?: string
  isWinner?: boolean
  hasRevealMessage: boolean
  canGameOver?: boolean
  lastestMoveCountOnContract?: number
  currentMoveCount?: number
  myStepList?: string[]
  opponentStepList?: string[]
}

export type TReportGameState = {
  gameID: string
  from: number
  to: number
  newState: Omit<TSignedGameState, 'from' | 'to'>
  oldState: Omit<TSignedGameState, 'from' | 'to'>
}
