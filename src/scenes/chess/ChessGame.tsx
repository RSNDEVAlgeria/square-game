import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Chessboard, ChessboardProvider } from 'react-chessboard';
import { ArrowLeft, RotateCcw, Copy, RefreshCw, Trophy, ScrollText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Square } from 'chess.js';
import { useChessGame } from './useChessGame';
import { useChessAI } from './useChessAI';
import type { ChessMode, GameStatus, PlayerSide, AIDifficulty } from './types';
import { THEME } from '@/constants/gameConfig';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_LABELS: Record<GameStatus, string> = {
  playing: 'Playing',
  check: 'Check!',
  checkmate: 'Checkmate',
  stalemate: 'Stalemate',
  draw_insufficient: 'Draw (insufficient material)',
  draw_threefold: 'Draw (threefold repetition)',
  draw_fifty: 'Draw (50 moves)',
  draw_agreement: 'Draw',
};

const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0
};

interface ChessGameProps {
  mode: ChessMode;
  playerSide?: PlayerSide;
  difficulty?: AIDifficulty;
  onBack: () => void;
}

export function ChessGame({ mode, playerSide = 'white', difficulty = 2, onBack }: ChessGameProps) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [promotionPending, setPromotionPending] = useState<{ from: string; to: string } | null>(null);
  const [flipEachTurn, setFlipEachTurn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const historyRef = React.useRef<HTMLDivElement>(null);

  const game = useChessGame({
    mode,
    playerSide,
    difficulty,
    persist: true,
  });

  // Auto-scroll history
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [game.historySan, isSidebarOpen]);

  const ai = useChessAI({
    difficulty: difficulty ?? 2,
    fen: game.fen,
    playerSide,
  });

  // AI move: after human moves, compute and apply AI move
  useEffect(() => {
    if (mode !== 'ai' || game.isGameOver || !ai.isAITurn) return;
    // Small delay for AI to "think" visually
    const timer = setTimeout(() => {
      ai.computeMove(game.fen, (from, to, promotion) => {
        game.makeMove(from, to, promotion);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [mode, game.isGameOver, ai.isAITurn, game.fen]);

  const turnLabel = game.turn === 'white' ? 'White' : 'Black';
  const boardOrientation: 'white' | 'black' =
    (mode === 'friends' && flipEachTurn
      ? game.turn
      : mode === 'ai'
        ? playerSide
        : 'white') as 'white' | 'black';

  const legalTargets = useMemo(() =>
    selectedSquare ? game.legalMoves(selectedSquare) : []
    , [selectedSquare, game.fen]); // recalculate when fen changes

  // Calculate captured pieces
  const { capturedWhite, capturedBlack, materialAdvantage } = useMemo(() => {
    const history = game.chess.history({ verbose: true });
    const w: string[] = []; // Captured BY white (black pieces)
    const b: string[] = []; // Captured BY black (white pieces)
    let wVal = 0;
    let bVal = 0;

    for (const move of history) {
      if (move.captured) {
        if (move.color === 'w') {
          w.push(move.captured);
          wVal += PIECE_VALUES[move.captured] || 0;
        } else {
          b.push(move.captured);
          bVal += PIECE_VALUES[move.captured] || 0;
        }
      }
    }

    return {
      capturedWhite: w, // Black pieces captured by White
      capturedBlack: b, // White pieces captured by Black
      materialAdvantage: wVal - bVal
    };
  }, [game.fen]);

  const squareStyles: Record<string, React.CSSProperties> = {};
  if (game.lastMove) {
    squareStyles[game.lastMove.from] = { backgroundColor: 'rgba(210, 180, 140, 0.6)' }; // Coffee stain style
    squareStyles[game.lastMove.to] = { backgroundColor: 'rgba(210, 180, 140, 0.6)' };
  }
  if (selectedSquare) {
    squareStyles[selectedSquare] = { backgroundColor: 'rgba(105, 60, 40, 0.5)' }; // Dark coffee selection
    legalTargets.forEach((sq) => {
      squareStyles[sq] = {
        background: 'radial-gradient(circle, rgba(105, 60, 40, 0.3) 19%, transparent 20%)',
        borderRadius: '50%'
      }; // Dot indicator
    });
  }

  // Board Styling
  const darkSquareStyle = { backgroundColor: THEME.woodMedium };
  const lightSquareStyle = { backgroundColor: '#F0E6D2' }; // Matches cream/parchment

  const handlePieceDrop = useCallback(
    (args: { sourceSquare: string; targetSquare: string | null }) => {
      const { sourceSquare, targetSquare } = args;
      if (!targetSquare) return false;
      const isPromotion =
        (game.chess.get(sourceSquare as Square)?.type === 'p' && targetSquare[1] === '8') ||
        (game.chess.get(sourceSquare as Square)?.type === 'p' && targetSquare[1] === '1');
      if (isPromotion) {
        setPromotionPending({ from: sourceSquare, to: targetSquare });
        setSelectedSquare(null);
        return false;
      }
      return game.makeMove(sourceSquare, targetSquare) ?? false;
    },
    [game]
  );

  const handlePromotionChoose = useCallback(
    (piece: 'q' | 'r' | 'b' | 'n') => {
      if (!promotionPending) return;
      game.makeMove(promotionPending.from, promotionPending.to, piece);
      setPromotionPending(null);
    },
    [promotionPending, game]
  );

  const humanTurn =
    mode === 'ai'
      ? (playerSide === 'white' && game.turn === 'white') || (playerSide === 'black' && game.turn === 'black')
      : true;

  const canDragPiece = useCallback(
    () => {
      if (game.isGameOver || !humanTurn) return false;
      return true;
    },
    [game.isGameOver, humanTurn]
  );

  const handleSquareClick = useCallback(
    (args: { square: string }) => {
      if (game.isGameOver) return;
      const sq = args.square;
      const piece = game.chess.get(sq as Square);
      const isOurPiece =
        (game.turn === 'white' && piece?.color === 'w') || (game.turn === 'black' && piece?.color === 'b');
      if (mode === 'ai' && !humanTurn) return;

      if (isOurPiece) {
        // If clicking same square, deselect
        if (selectedSquare === sq) setSelectedSquare(null);
        else setSelectedSquare(sq);
      }
      else if (selectedSquare) {
        // Try to move
        if (legalTargets.includes(sq as Square)) {
          const isPromotion =
            (game.chess.get(selectedSquare as Square)?.type === 'p' && sq[1] === '8') ||
            (game.chess.get(selectedSquare as Square)?.type === 'p' && sq[1] === '1');
          if (isPromotion) {
            setPromotionPending({ from: selectedSquare, to: sq });
            setSelectedSquare(null);
          } else {
            game.makeMove(selectedSquare, sq);
            setSelectedSquare(null);
          }
        } else {
          // Clicked empty square or enemy piece that is not a valid target -> deselect
          setSelectedSquare(null);
        }
      }
    },
    [game, mode, humanTurn, selectedSquare, legalTargets]
  );

  const copyPgn = useCallback(() => {
    try {
      navigator.clipboard.writeText(game.pgn);
    } catch {
      // ignore
    }
  }, [game.pgn]);

  const undoBehavior =
    mode === 'friends'
      ? () => game.undo()
      : () => {
        game.undo();
        game.undo(); // Undo AI too
      };

  // Render captured pieces helper
  const getPieceSymbol = (type: string, color: 'w' | 'b') => {
    if (color === 'w') {
      switch (type) {
        case 'p': return '♙';
        case 'n': return '♘';
        case 'b': return '♗';
        case 'r': return '♖';
        case 'q': return '♕';
        case 'k': return '♔';
        default: return '';
      }
    } else {
      switch (type) {
        case 'p': return '♟';
        case 'n': return '♞';
        case 'b': return '♝';
        case 'r': return '♜';
        case 'q': return '♛';
        case 'k': return '♚';
        default: return '';
      }
    }
  };

  const CapturedList = ({ pieces, score, color }: { pieces: string[], score: number, color: 'w' | 'b' }) => (
    <div className="h-8 flex items-center bg-black/5 rounded px-2 gap-1 overflow-hidden min-w-[100px]">
      {pieces.map((p, i) => (
        <span key={i} className="text-xl leading-none select-none" style={{ color: THEME.textDark }}>
          {getPieceSymbol(p, color)}
        </span>
      ))}
      {score > 0 && <span className="text-xs font-bold text-green-700 ml-1">+{score}</span>}
    </div>
  );

  const topPlayerColor = boardOrientation === 'white' ? 'black' : 'white';
  const bottomPlayerColor = boardOrientation === 'white' ? 'white' : 'black';

  // capturedWhite: pieces captured BY White (so they are Black pieces)
  // capturedBlack: pieces captured BY Black (so they are White pieces)

  const topCapturedPieces = topPlayerColor === 'white' ? capturedWhite : capturedBlack;
  const bottomCapturedPieces = bottomPlayerColor === 'white' ? capturedWhite : capturedBlack;

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #2C1810, #1a0f0a)', // Dark Coffee Background
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {/* Ambient background effects (Steam/Lighting) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 30%, #D2B48C, transparent 70%)' }} />

      {/* Top Header - Floating Menu Card Style */}
      <div className="z-20 p-2 md:p-4 pb-0">
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl shadow-lg border border-[#D2B48C]/50"
          style={{
            background: 'linear-gradient(to right, #FAF9F6, #F0E6D2)', // Parchment/Menu Card
            color: '#4B3621'
          }}
        >
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-[#4B3621] border border-[#D2B48C] hover:bg-white/50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#2C1810] leading-none tracking-wide" style={{ fontFamily: "'Pacifico', cursive" }}>
              Square Café Chess
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#8B735B] font-bold uppercase tracking-wider">
                {game.status === 'check' ? (
                  <span className="text-red-700 font-extrabold animate-pulse">⚠️ CHECK!</span>
                ) : (
                  mode === 'friends' ? 'Table for Two' : `Solo • ${difficulty === 1 ? 'Mild' : difficulty === 2 ? 'Medium' : 'Bold'}`
                )}
              </span>
            </div>
          </div>

          <button
            className={`p-2 rounded-xl border border-[#D2B48C] transition-all ${isSidebarOpen ? 'bg-[#4B3621] text-white' : 'text-[#4B3621] hover:bg-white/50'}`}
            onClick={() => setIsSidebarOpen(prev => !prev)}
            title="View Orders (History & Controls)"
          >
            <ScrollText size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area - Board takes everything */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative z-10 w-full h-full">
        <div
          className="relative p-3 md:p-4 rounded-xl shadow-2xl transform transition-transform border border-[#5D4037]"
          style={{
            background: `url('https://www.transparenttextures.com/patterns/wood-pattern.png'), linear-gradient(135deg, ${THEME.woodDark} 0%, ${THEME.espresso} 100%)`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 0 2px rgba(255,255,255,0.05)'
          }}
        >
          {/* Top Player Info (Opponent) */}
          <div className="flex justify-between items-center mb-3 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFEBE9] border-2 border-[#D2B48C] flex items-center justify-center shadow-md text-xl">
                {mode === 'ai' ? '🤖' : (topPlayerColor === 'white' ? '👤' : '👤')}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#F5E6D3] drop-shadow-sm">
                  {mode === 'ai' ? 'Barista Bot' : (topPlayerColor === 'white' ? 'White' : 'Black')}
                </span>
                <CapturedList
                  pieces={topCapturedPieces}
                  color={topPlayerColor === 'white' ? 'b' : 'w'}
                  score={topPlayerColor === 'white' ? (materialAdvantage > 0 ? materialAdvantage : 0) : (materialAdvantage < 0 ? -materialAdvantage : 0)}
                />
              </div>
            </div>
          </div>

          {/* The Board */}
          <div className="w-full max-w-[min(90vw,600px)] aspect-square bg-[#D7CCC8] rounded shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] overflow-hidden border-4 border-[#5D4037]">
            <ChessboardProvider
              options={{
                position: game.fen,
                boardOrientation,
                onPieceDrop: handlePieceDrop,
                onSquareClick: handleSquareClick,
                canDragPiece,
                darkSquareStyle,
                lightSquareStyle,
                squareStyles,
                allowDragging: true,
                showNotation: true,
                animationDurationInMs: 200,
              }}
            >
              <Chessboard />
            </ChessboardProvider>
          </div>

          {/* Bottom Player Info (You) */}
          <div className="flex justify-between items-center mt-3 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF8E1] border-2 border-[#D2B48C] flex items-center justify-center shadow-md text-xl">
                👤
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#F5E6D3] drop-shadow-sm">
                  {mode === 'ai' ? 'You' : (bottomPlayerColor === 'white' ? 'White' : 'Black')}
                </span>
                <CapturedList
                  pieces={bottomCapturedPieces}
                  color={bottomPlayerColor === 'white' ? 'b' : 'w'}
                  score={bottomPlayerColor === 'white' ? (materialAdvantage > 0 ? materialAdvantage : 0) : (materialAdvantage < 0 ? -materialAdvantage : 0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay - "The Bill/order pad" */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 bg-[#FAF9F6] shadow-2xl border-l border-[#D2B48C] flex flex-col"
              style={{ background: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png"), linear-gradient(to bottom, #FAF9F6, #EFEBE9)' }}
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-[#D2B48C]/30 flex items-center justify-between bg-white/50"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                <h3 className="font-bold text-[#2C1810] text-lg font-mono flex items-center gap-2">
                  <ScrollText size={18} /> Order Pad
                </h3>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-black/10 text-[#5D4037]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Banner inside Sidebar */}
              <div
                className={`p-3 text-center font-bold text-sm border-b border-[#D2B48C]/20 flex items-center justify-center gap-2 ${game.status === 'check' ? 'bg-red-50 text-red-800' : 'bg-[#EFEBE9] text-[#5D4037]'
                  }`}
              >
                {game.status === 'check' && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                {game.isGameOver
                  ? STATUS_LABELS[game.status]
                  : `${turnLabel} to move${game.status === 'check' ? ' — Check!' : ''}`}
              </div>

              {/* Move History Table */}
              <div className="flex-1 overflow-hidden flex flex-col relative">
                <div className="grid grid-cols-3 bg-[#D7CCC8]/30 text-[#5D4037] text-xs font-bold py-2 px-3 border-b border-[#D2B48C]/30 uppercase tracking-wider shrink-0 z-10 backdrop-blur-sm">
                  <div className="text-center opacity-60">#</div>
                  <div>White</div>
                  <div>Black</div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin scrollbar-thumb-[#D2B48C] scrollbar-track-transparent bg-white/30" ref={historyRef}>
                  {Array.from({ length: Math.ceil(game.historySan.length / 2) }).map((_, i) => (
                    <div key={i} className={`grid grid-cols-3 text-sm py-1.5 px-3 rounded-lg border border-transparent ${i % 2 === 1 ? 'bg-[#5D4037]/5' : ''} hover:border-[#D2B48C]/30 transition-colors`}>
                      <div className="text-[#A1887F] text-center font-mono text-xs pt-0.5 opacity-70">{i + 1}.</div>
                      <div className="font-bold text-[#3E2723] font-mono">{game.historySan[i * 2]}</div>
                      <div className="font-bold text-[#3E2723] font-mono">{game.historySan[i * 2 + 1] || ''}</div>
                    </div>
                  ))}
                  {game.historySan.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-[#A1887F] opacity-60">
                      <ScrollText size={32} className="mb-2 opacity-50" />
                      <span className="text-sm font-medium">No orders yet...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls Panel */}
              <div className="p-5 border-t border-[#D2B48C]/30 bg-[#FAF9F6]/80 flex flex-col gap-3 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-[#D2B48C] text-[#5D4037] hover:bg-[#EFEBE9] hover:text-[#3E2723] hover:border-[#A1887F] transition-all bg-white shadow-sm"
                    onClick={undoBehavior}
                    disabled={game.historySan.length === 0 || game.isGameOver}
                  >
                    <RotateCcw size={14} className="mr-2" />
                    Undo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-[#D2B48C] text-[#5D4037] hover:bg-[#EFEBE9] hover:text-[#3E2723] hover:border-[#A1887F] transition-all bg-white shadow-sm"
                    onClick={() => game.reset()}
                  >
                    <RefreshCw size={14} className="mr-2" />
                    Reset
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#8D6E63] text-xs w-full hover:bg-[#EFEBE9] hover:text-[#5D4037]"
                  onClick={copyPgn}
                >
                  <Copy size={12} className="mr-1" /> Copy PGN
                </Button>

                {mode === 'friends' && (
                  <label className="flex items-center justify-center gap-2 text-sm text-[#5D4037] cursor-pointer hover:bg-[#EFEBE9] p-3 rounded-xl transition-colors select-none border border-transparent hover:border-[#D2B48C]/30">
                    <input
                      type="checkbox"
                      checked={flipEachTurn}
                      onChange={(e) => setFlipEachTurn(e.target.checked)}
                      className="rounded accent-[#5D4037] w-4 h-4 cursor-pointer"
                    />
                    <span>Flip board each turn</span>
                  </label>
                )}

                <div className="text-center mt-2 border-t border-[#D2B48C]/20 pt-2">
                  <div className="text-[10px] text-[#A1887F] uppercase tracking-[0.2em] opacity-60 font-bold mb-1">Square Café</div>
                  <div className="text-[9px] text-[#D2B48C] font-mono">Thank you for playing!</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Promotion Modal */}
      <AnimatePresence>
        {promotionPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setPromotionPending(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FAF9F6] rounded-2xl p-6 shadow-2xl border-2 border-[#D2B48C] max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#2C1810] mb-4 text-center">Promote Pawn</h3>
              <div className="flex gap-3 justify-center">
                {(['q', 'r', 'b', 'n'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="w-16 h-16 flex items-center justify-center rounded-xl border-2 border-[#D2B48C] hover:bg-[#F0E6D2] hover:-translate-y-1 transition-all text-4xl shadow-md bg-white"
                    style={{ color: THEME.woodDark }}
                    onClick={() => handlePromotionChoose(p)}
                  >
                    {p === 'q' ? '♕' : p === 'r' ? '♖' : p === 'b' ? '♗' : '♘'}
                  </button>
                ))}
              </div>
              <p className="text-center text-[#8B735B] text-sm mt-4">Select a piece to promote to</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {game.isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-[#D2B48C] text-center max-w-xs"
            >
              <Trophy size={48} className="mx-auto text-[#FFD700] mb-4 drop-shadow-md" />
              <h2 className="text-2xl font-bold text-[#2C1810] mb-1">Game Over</h2>
              <p className="text-lg font-medium text-[#4B3621] mb-6">{STATUS_LABELS[game.status]}</p>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full rounded-xl font-bold bg-[#4B3621] hover:bg-[#2C1810] text-white"
                  onClick={() => game.reset()}
                >
                  Play Again
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-[#D2B48C] text-[#4B3621]"
                  onClick={onBack}
                >
                  Exit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
