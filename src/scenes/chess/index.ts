/**
 * Chess feature - entry exports.
 * Route: effectively /chess (view state in App; no router).
 */

export { ChessLanding } from './ChessLanding';
export { ChessGame } from './ChessGame';
export { useChessGame } from './useChessGame';
export { useChessAI, getAIMove } from './useChessAI';
export type { ChessMode, GameStatus, AIDifficulty, PlayerSide } from './types';
