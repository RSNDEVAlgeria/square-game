/**
 * Chess feature - AI move calculation (fallback: minimax + piece-square tables).
 * Stockfish.wasm can be wired in later via the same interface for stronger play:
 * lazy-load the worker in Vs AI mode and call it from computeMove() instead of getAIMove().
 */

import { useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import type { AIDifficulty } from './types';
import { AI_DEPTH_BY_DIFFICULTY } from './constants';

const PIECE_VALUES: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000,
  P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000,
};

// Simplified piece-square bonuses (white perspective; flip for black)
const PAWN_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
];

const KNIGHT_TABLE = [
  -50, -40, -30, -30, -30, -30, -40, -50,
  -40, -20, 0, 0, 0, 0, -20, -40,
  -30, 0, 10, 15, 15, 10, 0, -30,
  -30, 5, 15, 20, 20, 15, 5, -30,
  -30, 0, 15, 20, 20, 15, 0, -30,
  -30, 5, 10, 15, 15, 10, 5, -30,
  -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];

const SQUARE_INDEX: Record<string, number> = {};
'a b c d e f g h'.split(' ').forEach((file, f) => {
  '8 7 6 5 4 3 2 1'.split(' ').forEach((rank, r) => {
    SQUARE_INDEX[file + rank] = r * 8 + f;
  });
});

function getTableIndex(square: string, color: 'w' | 'b'): number {
  const i = SQUARE_INDEX[square];
  if (color === 'b') {
    const row = 7 - Math.floor(i / 8);
    const col = i % 8;
    return row * 8 + col;
  }
  return i;
}

function evaluatePosition(chess: Chess): number {
  let score = 0;
  const board = chess.board();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      const sq = String.fromCharCode(97 + col) + (8 - row);
      const idx = getTableIndex(sq, piece.color);
      const pv = PIECE_VALUES[piece.type] || 0;
      let bonus = 0;
      if (piece.type === 'p') bonus = PAWN_TABLE[idx];
      else if (piece.type === 'n') bonus = KNIGHT_TABLE[idx];
      const mul = piece.color === 'w' ? 1 : -1;
      score += mul * (pv + bonus);
    }
  }
  return score;
}

function minimax(chess: Chess, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  if (depth === 0) return evaluatePosition(chess);
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) {
    if (chess.isCheckmate()) return maximizing ? -100000 + (4 - depth) : 100000 - (4 - depth);
    return 0; // stalemate
  }
  if (maximizing) {
    let best = -Infinity;
    for (const m of moves) {
      chess.move(m);
      const score = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      chess.move(m);
      const score = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      best = Math.min(best, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export interface UseChessAIOptions {
  difficulty: AIDifficulty;
  /** Current FEN; AI plays as the side not to move after human moved */
  fen: string;
  /** Human side (AI plays the opposite) */
  playerSide: 'white' | 'black';
}

/** Returns the best move for the side to move (the AI). Runs in main thread; for heavy use run in worker. */
export function getAIMove(chess: Chess, difficulty: AIDifficulty): { from: string; to: string; promotion?: 'q' | 'r' | 'b' | 'n' } | null {
  const depth = AI_DEPTH_BY_DIFFICULTY[difficulty];
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;
  const maximizing = chess.turn() === 'w';
  let bestScore = maximizing ? -Infinity : Infinity;
  let bestMove: (typeof moves)[0] | null = null;
  for (const m of moves) {
    chess.move(m);
    const score = minimax(chess, depth - 1, -Infinity, Infinity, !maximizing);
    chess.undo();
    if (maximizing && score > bestScore) {
      bestScore = score;
      bestMove = m;
    } else if (!maximizing && score < bestScore) {
      bestScore = score;
      bestMove = m;
    }
  }
  if (!bestMove) bestMove = moves[Math.floor(Math.random() * moves.length)];
  const prom = bestMove.promotion;
  const promotion = prom === 'q' || prom === 'r' || prom === 'b' || prom === 'n' ? prom : undefined;
  return bestMove ? { from: bestMove.from, to: bestMove.to, promotion } : null;
}

export function useChessAI(options: UseChessAIOptions) {
  const { difficulty, fen, playerSide } = options;
  const isAITurn = (playerSide === 'white' && fen.includes(' b ')) || (playerSide === 'black' && fen.includes(' w '));
  const computingRef = useRef(false);

  const computeMove = useCallback(
    (currentFen: string, onMove: (from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n') => void) => {
      if (computingRef.current) return;
      computingRef.current = true;
      // Run in requestIdleCallback/setTimeout so UI stays responsive
      const id = setTimeout(() => {
        try {
          const chess = new Chess(currentFen);
          const move = getAIMove(chess, difficulty);
          if (move) onMove(move.from, move.to, move.promotion);
        } finally {
          computingRef.current = false;
        }
      }, 50);
      return () => clearTimeout(id);
    },
    [difficulty]
  );

  return { isAITurn, computeMove };
}
