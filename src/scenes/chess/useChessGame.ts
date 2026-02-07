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
  const storageKey = CHESS_STORAGE_KEYS[mode];

  const [fen, setFen] = useState(DEFAULT_FEN);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const chess = useMemo(() => new Chess(fen), [fen]);

  const turn = chess.turn() === 'w' ? 'white' : 'black';
  const historySan = useMemo(() => chess.history(), [fen]);
  const status = getGameStatus(chess);
  const isGameOver = status !== 'playing' && status !== 'check';

  const legalMoves = useCallback(
    (square: string) => chess.moves({ square: square as never, verbose: true }).map((m) => m.to),
    [chess]
  );

  const makeMove = useCallback(
    (from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n') => {
      const move = chess.move({ from, to, promotion });
      if (move) {
        const newFen = chess.fen();
        setFen(newFen);
        setLastMove({ from, to });
        return true;
      }
      return false;
    },
    [chess]
  );

  const undo = useCallback(() => {
    const move = chess.undo();
    if (move) {
      const newFen = chess.fen();
      setFen(newFen);
      const prev = chess.history({ verbose: true });
      const last = prev[prev.length - 1];
      setLastMove(last ? { from: last.from, to: last.to } : null);
      return true;
    }
    return false;
  }, [chess]);

  const reset = useCallback(() => {
    setFen(DEFAULT_FEN);
    setLastMove(null);
  }, []);

  const loadFromFen = useCallback((newFen: string) => {
    try {
      const c = new Chess(newFen);
      setFen(c.fen());
      setLastMove(null);
    } catch {
      // ignore invalid FEN
    }
  }, []);

  const pgn = useMemo(() => chess.pgn(), [fen]);

  // Persist to localStorage when position changes (debounced or on change)
  useEffect(() => {
    if (!persist || !storageKey) return;
    const state: ChessPersistedState = {
      fen: chess.fen(),
      pgn: chess.pgn(),
      history: chess.history(),
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
      // ignore quota errors
    }
  }, [fen, mode, persist, storageKey, playerSide, difficulty, chess, pgn]);

  // Restore from localStorage on mount. Prefer PGN so move history (and undo) is preserved.
  useEffect(() => {
    if (!persist || !storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const state = JSON.parse(raw) as ChessPersistedState;
      if (state.pgn && state.pgn.trim().length > 0) {
        const c = new Chess();
        c.loadPgn(state.pgn, { strict: false });
        setFen(c.fen());
        const hist = c.history({ verbose: true });
        if (hist.length > 0) {
          const last = hist[hist.length - 1];
          setLastMove({ from: last.from, to: last.to });
        }
      } else if (state.fen) {
        const c = new Chess(state.fen);
        setFen(c.fen());
      }
    } catch {
      // ignore
    }
  }, [persist, storageKey]);

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
    chess,
  };
}
