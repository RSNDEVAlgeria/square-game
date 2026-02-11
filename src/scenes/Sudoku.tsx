/**
 * Square Coffee - Sudoku Game
 * The Coffee Break Classic
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SudokuProps {
    onBack: () => void;
}

export function Sudoku({ onBack }: SudokuProps) {
    const { t } = useTranslation();
    const initialBoard = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    const solution = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    const [grid, setGrid] = useState<number[][]>(JSON.parse(JSON.stringify(initialBoard)));
    const [selected, setSelected] = useState<[number, number] | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const handleCellClick = (r: number, c: number) => {
        if (initialBoard[r][c] === 0) {
            setSelected([r, c]);
        }
    };

    const handleNumberInput = (num: number) => {
        if (selected) {
            const [r, c] = selected;
            const newGrid = [...grid];
            newGrid[r][c] = num;
            setGrid(newGrid);
            setErrors(errors.filter(e => e !== `${r}-${c}`));
        }
    };

    const reset = () => {
        setGrid(JSON.parse(JSON.stringify(initialBoard)));
        setSelected(null);
        setErrors([]);
    };

    const checkSolution = () => {
        const newErrors: string[] = [];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] !== 0 && grid[r][c] !== solution[r][c]) {
                    newErrors.push(`${r}-${c}`);
                }
            }
        }
        setErrors(newErrors);
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-5" style={{ background: '#FAF9F6' }}>
            <div className="w-full flex items-center justify-between mb-5">
                <button
                    onClick={onBack}
                    className="p-2.5 rounded-xl bg-white text-[#4B3621] border border-[#D2B48C] shadow-none hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2
                    className="text-2xl m-0"
                    style={{ fontFamily: "'Pacifico', cursive", color: '#4B3621' }}
                >
                    {t('sudoku.title')}
                </h2>
                <div style={{ width: 40 }} />
            </div>

            <div
                className="p-1 rounded-xl flex flex-col gap-[1.5px] shadow-lg"
                style={{ background: '#2C1810' }}
            >
                {grid.map((row, r) => (
                    <div
                        key={r}
                        className={`flex gap-[1.5px] ${r % 3 === 2 && r !== 8 ? 'border-b-2 border-[#2C1810]' : ''}`}
                    >
                        {row.map((val, c) => (
                            <motion.div
                                key={c}
                                whileTap={initialBoard[r][c] === 0 ? { scale: 0.95 } : {}}
                                className={`
                  w-[38px] h-[38px] flex items-center justify-center font-bold text-lg cursor-pointer
                  ${initialBoard[r][c] !== 0 ? 'bg-[#F5F3ED] text-[#8B735B]' : 'bg-white text-[#2C1810]'}
                  ${selected?.[0] === r && selected?.[1] === c ? 'bg-[#E8F5E9] shadow-[inset_0_0_0_2px_#1B4D3E] z-10' : ''}
                  ${errors.includes(`${r}-${c}`) ? 'bg-[#FDECEA] text-[#D32F2F]' : ''}
                  ${c % 3 === 2 && c !== 8 ? 'border-r-2 border-[#2C1810]' : ''}
                `}
                                onClick={() => handleCellClick(r, c)}
                            >
                                {val !== 0 ? val : ''}
                            </motion.div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="w-full mt-6">
                <div className="grid grid-cols-9 gap-1.5 mb-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <motion.button
                            key={num}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleNumberInput(num)}
                            className="aspect-square p-0 flex items-center justify-center bg-white text-[#1B4D3E] border border-[#D2B48C] rounded-lg text-base font-extrabold shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            {num}
                        </motion.button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={reset}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#D2B48C] text-white rounded-2xl font-semibold shadow-md hover:bg-[#C19A6B] transition-colors"
                    >
                        <RefreshCw size={18} /> {t('sudoku.newGame')}
                    </button>
                    <button
                        onClick={checkSolution}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1B4D3E] text-white rounded-2xl font-semibold shadow-md hover:bg-[#2E8B57] transition-colors"
                    >
                        <CheckCircle size={18} /> {t('sudoku.check')}
                    </button>
                </div>
            </div>
        </div>
    );
}
