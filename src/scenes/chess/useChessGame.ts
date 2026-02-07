/**
 * Chess feature - core game state hook.
 * Uses chess.js for rules, move validation, history, and draw/check/checkmate detection.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import type { ChessMode, GameStatus, ChessPersistedState, PlayerSide, AIDifficulty } from './types';
import { CHESS_STORAGE_KEYS } from './constants';

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Draw detection: stalemate + insufficient material + threefold repetition (and fifty moves) via chess.js
function getGameStatus(chess: Chess): GameStatus {
  if (chess.isCheckmate()) return 'checkmate';
  if (chess.isStalemate()) return 'stalemate';
  if (chess.isDraw()) {
    if (chess.isInsufficientMaterial()) return 'draw_insufficient';
    if (chess.isThreefoldRepetition()) return 'draw_threefold';
    if (chess.isDrawByFiftyMoves()) return 'draw_fifty';
    return 'draw_insufficient'; // fallback for other draw
  }
  if (chess.isCheck()) return 'check';
  return 'playing';
}

export interface UseChessGameOptions {
  mode: ChessMode;
  playerSide?: PlayerSide;
  difficulty?: AIDifficulty;
  /** Restore from localStorage on mount */
  persist?: boolean;
}

export function useChessGame(options: UseChessGameOptions) {
  const { mode, playerSide = 'white', difficulty = 2, persist = true } = options;
  const storageKey = CHESS_STORAGE_KEYS ? CHESS_STORAGE_KEYS[mode] : `chess_${mode}`; // Safer access

  // We use a ref to hold the mutable chess instance, ensuring history is preserved.
  const chessRef = useMemo(() => new Chess(), []);

  // We use fen state to trigger re-renders
  const [fen, setFen] = useState(DEFAULT_FEN);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  // Helper to update state from the chess instance
  const updateState = useCallback(() => {
    setFen(chessRef.fen());
    const hist = chessRef.history({ verbose: true });
    const last = hist[hist.length - 1];
    setLastMove(last ? { from: last.from, to: last.to } : null);
  }, [chessRef]);

  const turn = chessRef.turn() === 'w' ? 'white' : 'black';
  const historySan = chessRef.history(); // This will be re-evaluated on every render
  const status = getGameStatus(chessRef);
  const isGameOver = status !== 'playing' && status !== 'check';

  const legalMoves = useCallback(
    (square: string) => {
      return chessRef.moves({ square: square as never, verbose: true }).map((m) => m.to);
    },
    [chessRef, fen] // Depend on fen to refresh when board updates
  );

  const makeMove = useCallback(
    (from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n') => {
      try {
        const move = chessRef.move({ from, to, promotion });
        if (move) {
          updateState();
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    [chessRef, updateState]
  );

  const undo = useCallback(() => {
    const move = chessRef.undo();
    if (move) {
      updateState();
      return true;
    }
    return false;
  }, [chessRef, updateState]);

  const reset = useCallback(() => {
    chessRef.reset();
    updateState();
  }, [chessRef, updateState]);

  const loadFromFen = useCallback((newFen: string) => {
    try {
      chessRef.load(newFen);
      updateState();
    } catch {
      // ignore invalid FEN
    }
  }, [chessRef, updateState]);

  const pgn = chessRef.pgn();

  // Persist to localStorage when position changes
  useEffect(() => {
    if (!persist || !storageKey) return;
    const state: ChessPersistedState = {
      fen: chessRef.fen(),
      pgn: chessRef.pgn(), // This is crucial for history
      history: chessRef.history(), // Optional, but PGN is the source of truth
      mode,
      savedAt: Date.now(),
    };
    if (mode === 'ai') {
      state.playerSide = playerSide;
      state.difficulty = difficulty;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [fen, mode, persist, storageKey, playerSide, difficulty, chessRef]);

  // Restore from localStorage on mount
  useEffect(() => {
    if (!persist || !storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;

      // Parse safely
      const state = JSON.parse(raw);

      // If we have a stored PGN, load it to restore history!
      if (state.pgn) {
        chessRef.loadPgn(state.pgn);
        updateState();
      }
      // Fallback to FEN if no PGN (history lost, but position kept)
      else if (state.fen) {
        chessRef.load(state.fen);
        updateState();
      }
    } catch (e) {
      console.error("Failed to load chess state", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return {
    fen,
    turn,
    historySan,
    status,
    isGameOver,
    lastMove,
    legalMoves,
    makeMove,
    undo,
    reset,
    loadFromFen,
    pgn,
    chess: chessRef,
  };
}
