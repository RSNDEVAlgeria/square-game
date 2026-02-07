/**
 * Chess feature - localStorage keys and config
 */

export const CHESS_STORAGE_KEYS = {
  friends: 'square-chess-friends',
  ai: 'square-chess-ai',
} as const;

export const AI_DEPTH_BY_DIFFICULTY = {
  1: 2,  // easy
  2: 3,  // medium
  3: 4,  // hard
} as const;
