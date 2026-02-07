/**
 * Chess feature - shared types
 */

export type ChessMode = 'friends' | 'ai';

export type GameStatus =
  | 'playing'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw_insufficient'
  | 'draw_threefold'
  | 'draw_fifty'
  | 'draw_agreement';

export type AIDifficulty = 1 | 2 | 3; // 1 = easy, 2 = medium, 3 = hard

export type PlayerSide = 'white' | 'black';

export interface ChessPersistedState {
  fen: string;
  pgn: string;
  history: string[];
  mode: ChessMode;
  /** Only for AI mode */
  playerSide?: PlayerSide;
  difficulty?: AIDifficulty;
  /** Timestamp for optional expiry */
  savedAt: number;
}
