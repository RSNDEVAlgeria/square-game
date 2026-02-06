/**
 * Square Coffee - Tic Tac Toe Game
 * Challenge the Barista Bot!
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeft, Coffee, Cookie, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface XOProps {
    onBack: () => void;
}

type Player = 'X' | 'O' | null;
type Winner = 'X' | 'O' | 'Draw' | null;

export function XO({ onBack }: XOProps) {
    const [gameMode, setGameMode] = useState<'select' | 'ai' | 'freeplay'>('select');
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<Winner>(null);

    const calculateWinner = (squares: Player[]): Winner => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a] as 'X' | 'O';
            }
        }
        if (squares.every(s => s !== null)) return 'Draw';
        return null;
    };

    const getBestMove = (squares: Player[]): number | undefined => {
        // Try to win
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                const copy = [...squares];
                copy[i] = 'O';
                if (calculateWinner(copy) === 'O') return i;
            }
        }
        // Block player from winning
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                const copy = [...squares];
                copy[i] = 'X';
                if (calculateWinner(copy) === 'X') return i;
            }
        }
        // Take center if available
        if (!squares[4]) return 4;
        // Take random available spot
        const available = squares.map((s, i) => s === null ? i : null).filter(s => s !== null) as number[];
        return available[Math.floor(Math.random() * available.length)];
    };

    useEffect(() => {
        if (gameMode === 'ai' && !isXNext && !winner) {
            const timer = setTimeout(() => {
                const move = getBestMove(board);
                if (move !== undefined) {
                    handleClick(move, true);
                }
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isXNext, winner, board, gameMode]);

    const handleClick = (i: number, isAuto = false) => {
        if (winner || board[i]) return;
        // In AI mode, prevent player from clicking during bot's turn
        if (!isAuto && gameMode === 'ai' && !isXNext) return;

        const newBoard = [...board];
        newBoard[i] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const win = calculateWinner(newBoard);
        if (win) {
            setWinner(win);
            // Confetti for any winner in freeplay, or just X in AI mode
            if (gameMode === 'freeplay' || win === 'X') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: isXNext ? ['#1B4D3E', '#FAF9F6', '#D2B48C'] : ['#6F4E37', '#FAF9F6', '#C19A6B']
                });
            }
        }
    };

    const reset = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    const handleBack = () => {
        if (gameMode === 'select') {
            onBack();
        } else {
            setGameMode('select');
            reset();
        }
    };

    if (gameMode === 'select') {
        return (
            <div className="w-full h-full flex flex-col items-center p-6" style={{
                background: 'radial-gradient(circle at center, #FDFCF0 0%, #FAF9F6 100%)'
            }}>
                <div className="w-full flex items-center justify-between mb-12">
                    <button
                        onClick={onBack}
                        className="p-2.5 rounded-xl text-[#4B3621] bg-white border border-[#D2B48C] shadow-none hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2
                        className="text-2xl m-0"
                        style={{ fontFamily: "'Pacifico', cursive", color: '#4B3621' }}
                    >
                        Tic Tac Toe
                    </h2>
                    <div style={{ width: 40 }} />
                </div>

                <div className="flex flex-col gap-6 w-full max-w-sm mt-8">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setGameMode('ai')}
                        className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl shadow-lg border border-[#D2B48C]/30 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Trophy size={80} className="text-[#1B4D3E]" />
                        </div>
                        <div className="w-16 h-16 rounded-full bg-[#1B4D3E]/10 flex items-center justify-center text-[#1B4D3E] mb-2">
                            <Coffee size={32} />
                        </div>
                        <div className="text-center z-10">
                            <h3 className="text-xl font-bold text-[#2C1810] m-0">Classic Mode</h3>
                            <p className="text-[#8B735B] text-sm m-0 mt-1">Challenge our Barista Bot</p>
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setGameMode('freeplay')}
                        className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl shadow-lg border border-[#D2B48C]/30 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Coffee size={80} className="text-[#6F4E37]" />
                        </div>
                        <div className="w-16 h-16 rounded-full bg-[#6F4E37]/10 flex items-center justify-center text-[#6F4E37] mb-2">
                            <div className="flex gap-1">
                                <Coffee size={20} />
                                <Cookie size={20} />
                            </div>
                        </div>
                        <div className="text-center z-10">
                            <h3 className="text-xl font-bold text-[#2C1810] m-0">Free Play</h3>
                            <p className="text-[#8B735B] text-sm m-0 mt-1">Play with a Friend</p>
                        </div>
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center p-6" style={{
            background: 'radial-gradient(circle at center, #FDFCF0 0%, #FAF9F6 100%)'
        }}>
            <div className="w-full flex items-center justify-between mb-8">
                <button
                    onClick={handleBack}
                    className="p-2.5 rounded-xl text-[#4B3621] bg-white border border-[#D2B48C] shadow-none hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2
                    className="text-2xl m-0"
                    style={{ fontFamily: "'Pacifico', cursive", color: '#4B3621' }}
                >
                    Tic Tac Toe
                </h2>
                <div style={{ width: 40 }} />
            </div>

            <motion.div
                key={winner || 'playing'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-3 rounded-full bg-white shadow-md mb-10 font-bold text-[#4B3621] border border-[#D2B48C]"
            >
                {winner ? (
                    <div className="flex items-center gap-2 text-[#1B4D3E]">
                        <Trophy size={20} />
                        <span>
                            {winner === 'Draw'
                                ? "It's a Cozy Tie!"
                                : gameMode === 'freeplay'
                                    ? `Player ${winner === 'X' ? 'Coffee' : 'Cookie'} Wins!`
                                    : (winner === 'X' ? "You Won!" : "Barista Bot Wins!")
                            }
                        </span>
                    </div>
                ) : (
                    <div className={isXNext ? 'text-[#1B4D3E]' : 'text-[#6F4E37]'}>
                        <span>
                            {gameMode === 'freeplay'
                                ? (isXNext ? "Player Coffee's Turn" : "Player Cookie's Turn")
                                : (isXNext ? "Your Turn (Coffee)" : "Bot's Turn (Cookie)")
                            }
                        </span>
                    </div>
                )}
            </motion.div>

            <div
                className="grid grid-cols-3 gap-3 w-full max-w-[340px] p-3 rounded-3xl shadow-inner"
                style={{ background: '#D2B48C' }}
            >
                {board.map((square, i) => (
                    <motion.div
                        key={i}
                        whileHover={!square && (gameMode === 'freeplay' || isXNext) ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.9)' } : {}}
                        whileTap={!square && (gameMode === 'freeplay' || isXNext) ? { scale: 0.95 } : {}}
                        className={`aspect-square bg-[#FAF9F6] rounded-2xl flex items-center justify-center transition-colors ${!square && (gameMode === 'freeplay' || isXNext) ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={() => handleClick(i)}
                    >
                        <AnimatePresence mode="wait">
                            {square === 'X' && (
                                <motion.div
                                    key="X"
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Coffee size={40} className="text-[#1B4D3E]" strokeWidth={2.5} />
                                </motion.div>
                            )}
                            {square === 'O' && (
                                <motion.div
                                    key="O"
                                    initial={{ scale: 0, rotate: 45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Cookie size={40} className="text-[#6F4E37]" strokeWidth={2.5} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="mt-12 flex items-center gap-2.5 px-8 py-3.5 text-lg bg-[#1B4D3E] text-white rounded-2xl font-semibold shadow-lg hover:bg-[#2E8B57] transition-colors"
            >
                <RefreshCw size={20} /> Play Again
            </motion.button>
        </div>
    );
}
