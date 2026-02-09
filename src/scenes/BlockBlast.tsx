/**
 * Square Coffee - Block Blast Game
 * Coffee-powered puzzle action!
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Zap, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BlockBlastProps {
    onBack: () => void;
}

type Grid = boolean[][];
type Shape = boolean[][];

// Block shapes for the game
const SHAPES: Shape[] = [
    // Single block
    [[true]],

    // 2x1 horizontal
    [[true, true]],

    // 1x2 vertical
    [[true], [true]],

    // 3x1 horizontal
    [[true, true, true]],

    // 1x3 vertical
    [[true], [true], [true]],

    // 2x2 square
    [[true, true], [true, true]],

    // L-shape
    [[true, false], [true, false], [true, true]],

    // Reverse L-shape
    [[false, true], [false, true], [true, true]],

    // T-shape
    [[true, true, true], [false, true, false]],

    // Plus shape
    [[false, true, false], [true, true, true], [false, true, false]],

    // 3x3 square
    [[true, true, true], [true, true, true], [true, true, true]],

    // Z-shape
    [[true, true, false], [false, true, true]],

    // S-shape
    [[false, true, true], [true, true, false]],
];

const GRID_SIZE = 8;

// Generate a random starting grid configuration
const generateRandomStartingGrid = (): Grid => {
    const newGrid: Grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));

    // Choose a random pattern type
    const patternType = Math.floor(Math.random() * 5);

    switch (patternType) {
        case 0: // Random scatter (8-15 blocks)
            {
                const numStartingBlocks = Math.floor(Math.random() * 8) + 8;
                for (let i = 0; i < numStartingBlocks; i++) {
                    let row, col;
                    do {
                        row = Math.floor(Math.random() * GRID_SIZE);
                        col = Math.floor(Math.random() * GRID_SIZE);
                    } while (newGrid[row][col]);
                    newGrid[row][col] = true;
                }
            }
            break;

        case 1: // Diagonal lines
            {
                const numLines = Math.floor(Math.random() * 2) + 1; // 1-2 diagonal lines
                for (let line = 0; line < numLines; line++) {
                    const startRow = Math.floor(Math.random() * 4);
                    const startCol = Math.floor(Math.random() * 4);
                    const length = Math.floor(Math.random() * 3) + 3; // 3-5 blocks
                    for (let i = 0; i < length && startRow + i < GRID_SIZE && startCol + i < GRID_SIZE; i++) {
                        newGrid[startRow + i][startCol + i] = true;
                    }
                }
            }
            break;

        case 2: // Corner clusters
            {
                const corners = [
                    [0, 0], [0, GRID_SIZE - 1],
                    [GRID_SIZE - 1, 0], [GRID_SIZE - 1, GRID_SIZE - 1]
                ];
                const numCorners = Math.floor(Math.random() * 2) + 1; // 1-2 corners
                for (let i = 0; i < numCorners; i++) {
                    const [cornerRow, cornerCol] = corners[Math.floor(Math.random() * corners.length)];
                    const clusterSize = Math.floor(Math.random() * 3) + 2; // 2-4 blocks per corner
                    for (let j = 0; j < clusterSize; j++) {
                        const offsetRow = Math.floor(Math.random() * 3) - 1;
                        const offsetCol = Math.floor(Math.random() * 3) - 1;
                        const row = Math.max(0, Math.min(GRID_SIZE - 1, cornerRow + offsetRow));
                        const col = Math.max(0, Math.min(GRID_SIZE - 1, cornerCol + offsetCol));
                        newGrid[row][col] = true;
                    }
                }
            }
            break;

        case 3: // Checkerboard pattern (sparse)
            {
                for (let r = 0; r < GRID_SIZE; r++) {
                    for (let c = 0; c < GRID_SIZE; c++) {
                        if ((r + c) % 2 === 0 && Math.random() < 0.15) { // 15% chance
                            newGrid[r][c] = true;
                        }
                    }
                }
            }
            break;

        case 4: // Cross pattern
            {
                const centerRow = Math.floor(GRID_SIZE / 2);
                const centerCol = Math.floor(GRID_SIZE / 2);
                const armLength = Math.floor(Math.random() * 2) + 2; // 2-3 blocks per arm

                // Horizontal line
                for (let i = -armLength; i <= armLength; i++) {
                    const col = centerCol + i;
                    if (col >= 0 && col < GRID_SIZE && Math.random() < 0.7) {
                        newGrid[centerRow][col] = true;
                    }
                }

                // Vertical line
                for (let i = -armLength; i <= armLength; i++) {
                    const row = centerRow + i;
                    if (row >= 0 && row < GRID_SIZE && Math.random() < 0.7) {
                        newGrid[row][centerCol] = true;
                    }
                }
            }
            break;
    }

    return newGrid;
};

export function BlockBlast({ onBack }: BlockBlastProps) {
    const [grid, setGrid] = useState<Grid>(() => generateRandomStartingGrid());
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('blockBlastHighScore');
        return saved ? parseInt(saved) : 0;
    });
    const [currentShapes, setCurrentShapes] = useState<Shape[]>([]);
    const [selectedShape, setSelectedShape] = useState<number | null>(null);
    const [draggedShape, setDraggedShape] = useState<Shape | null>(null);
    const [previewPosition, setPreviewPosition] = useState<{ row: number; col: number } | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [combo, setCombo] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Initialize shapes
    useEffect(() => {
        generateNewShapes();
    }, []);

    // Check for game over
    useEffect(() => {
        if (currentShapes.length > 0 && !canPlaceAnyShape()) {
            setGameOver(true);
        }
    }, [currentShapes, grid]);

    const generateNewShapes = () => {
        const shapes: Shape[] = [];
        for (let i = 0; i < 3; i++) {
            const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            shapes.push(randomShape);
        }
        setCurrentShapes(shapes);
    };

    const canPlaceShape = (shape: Shape, startRow: number, startCol: number): boolean => {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const gridRow = startRow + r;
                    const gridCol = startCol + c;
                    if (
                        gridRow < 0 || gridRow >= GRID_SIZE ||
                        gridCol < 0 || gridCol >= GRID_SIZE ||
                        grid[gridRow][gridCol]
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const canPlaceAnyShape = (): boolean => {
        for (const shape of currentShapes) {
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (canPlaceShape(shape, r, c)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const placeShape = (shape: Shape, startRow: number, startCol: number) => {
        if (!canPlaceShape(shape, startRow, startCol)) return;

        const newGrid = grid.map(row => [...row]);
        let blocksPlaced = 0;

        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    newGrid[startRow + r][startCol + c] = true;
                    blocksPlaced++;
                }
            }
        }

        setGrid(newGrid);

        // Add points for placing blocks
        setScore(prev => prev + blocksPlaced * 10);

        // Remove the used shape
        const newShapes = currentShapes.filter((_, idx) => idx !== selectedShape);
        setCurrentShapes(newShapes);
        setSelectedShape(null);
        setDraggedShape(null);

        // Check for cleared lines
        setTimeout(() => clearLines(newGrid, newShapes), 100);
    };

    const clearLines = (currentGrid: Grid, shapes: Shape[]) => {
        const newGrid = currentGrid.map(row => [...row]);
        let linesCleared = 0;

        // Check rows
        for (let r = 0; r < GRID_SIZE; r++) {
            if (newGrid[r].every(cell => cell)) {
                newGrid[r] = Array(GRID_SIZE).fill(false);
                linesCleared++;
            }
        }

        // Check columns
        for (let c = 0; c < GRID_SIZE; c++) {
            if (newGrid.every(row => row[c])) {
                for (let r = 0; r < GRID_SIZE; r++) {
                    newGrid[r][c] = false;
                }
                linesCleared++;
            }
        }

        if (linesCleared > 0) {
            setGrid(newGrid);
            const points = linesCleared * 100 * (linesCleared > 1 ? linesCleared : 1);
            setScore(prev => prev + points);
            setCombo(prev => prev + 1);

            // Confetti for multiple lines
            if (linesCleared > 1) {
                confetti({
                    particleCount: 50 * linesCleared,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        } else {
            setCombo(0);
        }

        // Generate new shapes if all are used
        if (shapes.length === 0) {
            setTimeout(() => {
                generateNewShapes();
                setScore(prev => prev + 50); // Bonus for using all shapes
            }, 300);
        }
    };

    const handleCellClick = (row: number, col: number) => {
        if (draggedShape && !isDragging) {
            placeShape(draggedShape, row, col);
            setPreviewPosition(null);
        }
    };

    const handleShapeSelect = (index: number) => {
        if (!isDragging) {
            setSelectedShape(index);
            setDraggedShape(currentShapes[index]);
        }
    };

    const handleCellHover = (row: number, col: number) => {
        if (draggedShape && !isDragging && canPlaceShape(draggedShape, row, col)) {
            setPreviewPosition({ row, col });
        } else if (!isDragging) {
            setPreviewPosition(null);
        }
    };

    // Drag and Drop handlers
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent, shapeIndex: number) => {
        const shape = currentShapes[shapeIndex];
        setSelectedShape(shapeIndex);
        setDraggedShape(shape);
        setIsDragging(true);

        // Calculate offset from the center of the shape
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        setDragOffset({
            x: clientX - rect.left,
            y: clientY - rect.top
        });

        setDragPosition({
            x: clientX,
            y: clientY
        });
    };

    const handleDrag = (e: MouseEvent | TouchEvent) => {
        if (!isDragging || !draggedShape) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        setDragPosition({
            x: clientX,
            y: clientY
        });

        // Calculate grid position from shape's top-left coordinates
        const gridElement = document.querySelector('.game-grid');
        if (gridElement) {
            const rect = gridElement.getBoundingClientRect();
            const cellSize = rect.width / GRID_SIZE;

            // Adjust coordinates to be relative to the shape's top-left, not the cursor
            const shapeX = clientX - dragOffset.x;
            const shapeY = clientY - dragOffset.y;

            // Add a small threshold (half cell) to make snapping feel more natural
            // This aligns the center of the shape cells with the grid cells
            const relativeX = shapeX - rect.left + (cellSize / 2);
            const relativeY = shapeY - rect.top + (cellSize / 2);

            const col = Math.floor(relativeX / cellSize);
            const row = Math.floor(relativeY / cellSize);

            if (row >= -1 && row <= GRID_SIZE && col >= -1 && col <= GRID_SIZE) {
                // Determine valid placement
                if (canPlaceShape(draggedShape, row, col)) {
                    setPreviewPosition({ row, col });
                } else {
                    setPreviewPosition(null);
                }
            } else {
                setPreviewPosition(null);
            }
        }
    };

    const handleDragEnd = () => {
        if (!isDragging || !draggedShape) return;

        // Reset drag state
        setIsDragging(false);
        setDragPosition(null);

        // If we have a valid preview position, place the shape there
        if (previewPosition) {
            placeShape(draggedShape, previewPosition.row, previewPosition.col);
        }

        setPreviewPosition(null);
        setSelectedShape(null);
        setDraggedShape(null);
    };

    // Add global mouse/touch event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            const handleMove = (e: MouseEvent | TouchEvent) => {
                e.preventDefault();
                handleDrag(e);
            };

            const handleEnd = () => {
                handleDragEnd();
            };

            window.addEventListener('mousemove', handleMove as any);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove as any, { passive: false });
            window.addEventListener('touchend', handleEnd);

            return () => {
                window.removeEventListener('mousemove', handleMove as any);
                window.removeEventListener('mouseup', handleEnd);
                window.removeEventListener('touchmove', handleMove as any);
                window.removeEventListener('touchend', handleEnd);
            };
        }
    }, [isDragging, draggedShape, previewPosition]);

    const reset = () => {
        setGrid(generateRandomStartingGrid());
        setScore(0);
        setCombo(0);
        setGameOver(false);
        setSelectedShape(null);
        setDraggedShape(null);
        setPreviewPosition(null);
        generateNewShapes();
    };

    const handleBack = () => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('blockBlastHighScore', score.toString());
        }
        onBack();
    };

    // Update high score
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('blockBlastHighScore', score.toString());
        }
    }, [score]);

    const isCellInPreview = (row: number, col: number): boolean => {
        if (!previewPosition || !draggedShape) return false;
        const { row: startRow, col: startCol } = previewPosition;

        for (let r = 0; r < draggedShape.length; r++) {
            for (let c = 0; c < draggedShape[r].length; c++) {
                if (draggedShape[r][c] && startRow + r === row && startCol + c === col) {
                    return true;
                }
            }
        }
        return false;
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-5 relative" style={{ background: 'linear-gradient(135deg, #4B3621 0%, #2C1810 100%)' }}>
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-4">
                <button
                    onClick={handleBack}
                    className="p-2.5 rounded-xl bg-white/10 text-amber-100 border border-amber-200/20 hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2
                    className="text-3xl m-0 text-[#FFD700]"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                >
                    Block Blast ☕
                </h2>
                <div style={{ width: 48 }} />
            </div>

            {/* Score Display */}
            <div className="w-full flex justify-around mb-4 gap-3">
                <motion.div
                    className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-amber-200/20"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="text-amber-200 text-sm font-semibold">Score</div>
                    <div className="text-[#FFD700] text-2xl font-bold">{score}</div>
                </motion.div>
                <motion.div
                    className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-amber-200/20"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="text-amber-200 text-sm font-semibold flex items-center justify-center gap-1">
                        <Trophy size={14} /> Best
                    </div>
                    <div className="text-[#FFD700] text-2xl font-bold">{highScore}</div>
                </motion.div>
                {combo > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3 text-center border border-white/30"
                    >
                        <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                            <Zap size={14} /> Combo
                        </div>
                        <div className="text-white text-2xl font-bold">x{combo}</div>
                    </motion.div>
                )}
            </div>

            {/* Game Grid */}
            <div
                className="p-2 rounded-2xl shadow-2xl mb-5"
                style={{ background: '#6F4E37' }}
            >
                <div className="grid gap-1 game-grid">
                    {grid.map((row, r) => (
                        <div key={r} className="flex gap-1">
                            {row.map((cell, c) => {
                                const isPreview = isCellInPreview(r, c);
                                return (
                                    <motion.div
                                        key={c}
                                        whileHover={{ scale: draggedShape ? 1.1 : 1 }}
                                        onClick={() => handleCellClick(r, c)}
                                        onMouseEnter={() => handleCellHover(r, c)}
                                        className={`
                                            w-10 h-10 rounded-lg cursor-pointer transition-all
                                            ${cell
                                                ? 'bg-gradient-to-br from-[#D2691E] to-[#8B4513] shadow-md'
                                                : 'bg-[#F5DEB3]/20'
                                            }
                                            ${isPreview ? 'bg-[#90EE90]/50 shadow-lg ring-2 ring-green-400' : ''}
                                        `}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Shapes */}
            <div className="w-full mb-4">
                <div className="text-amber-200 text-center mb-3 font-semibold">
                    {isDragging ? 'Place the block!' : 'Drag blocks to the grid'}
                </div>
                <div className="flex justify-center gap-4">
                    {currentShapes.map((shape, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseDown={(e) => handleDragStart(e, idx)}
                            onTouchStart={(e) => handleDragStart(e, idx)}
                            onClick={() => handleShapeSelect(idx)}
                            className={`
                                p-3 rounded-xl cursor-pointer transition-all touch-none
                                ${selectedShape === idx && !isDragging
                                    ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-xl ring-2 ring-white'
                                    : 'bg-white/10 backdrop-blur-sm border border-amber-200/20 hover:bg-white/20'
                                }
                                ${isDragging && selectedShape === idx ? 'opacity-0' : 'opacity-100'}
                            `}
                        >
                            <div className="grid gap-1 pointer-events-none">
                                {shape.map((row, r) => (
                                    <div key={r} className="flex gap-1">
                                        {row.map((cell, c) => (
                                            <div
                                                key={c}
                                                className={`
                                                    w-6 h-6 rounded
                                                    ${cell
                                                        ? selectedShape === idx && !isDragging
                                                            ? 'bg-white shadow-md'
                                                            : 'bg-gradient-to-br from-[#D2691E] to-[#8B4513] shadow-md'
                                                        : 'opacity-0'
                                                    }
                                                `}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Dragged Shape Portal */}
            {isDragging && draggedShape && dragPosition && (
                <div
                    className="fixed pointer-events-none z-50 p-2"
                    style={{
                        left: dragPosition.x - dragOffset.x,
                        top: dragPosition.y - dragOffset.y,
                        touchAction: 'none'
                    }}
                >
                    <div className="grid gap-1">
                        {draggedShape.map((row, r) => (
                            <div key={r} className="flex gap-1">
                                {row.map((cell, c) => (
                                    <div
                                        key={c}
                                        className={`
                                            w-10 h-10 rounded-lg shadow-xl
                                            ${cell
                                                ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500] ring-2 ring-white'
                                                : 'opacity-0'
                                            }
                                        `}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reset Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D2B48C] to-[#C19A6B] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
                <RefreshCw size={18} /> New Game
            </motion.button>

            {/* Game Over Modal */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.5, y: 50 }}
                            className="bg-gradient-to-br from-[#4B3621] to-[#2C1810] p-8 rounded-3xl shadow-2xl text-center border-2 border-amber-200/30 max-w-sm"
                        >
                            <div className="text-6xl mb-4">☕</div>
                            <h2 className="text-4xl font-bold text-[#FFD700] mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
                                Game Over!
                            </h2>
                            <p className="text-amber-200 mb-4">No more moves available</p>
                            <div className="bg-white/10 rounded-xl p-4 mb-6">
                                <div className="text-amber-200 text-sm mb-1">Final Score</div>
                                <div className="text-[#FFD700] text-4xl font-bold">{score}</div>
                                {score === highScore && score > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-orange-400 text-sm mt-2 font-semibold"
                                    >
                                        🏆 New High Score! 🏆
                                    </motion.div>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={reset}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1B4D3E] to-[#2E8B57] text-white rounded-xl font-semibold shadow-lg"
                                >
                                    <RefreshCw size={18} /> Play Again
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBack}
                                    className="flex-1 px-4 py-3 bg-white/10 text-amber-100 rounded-xl font-semibold border border-amber-200/20"
                                >
                                    Exit
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
