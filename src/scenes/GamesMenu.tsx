/**
 * Square Coffee - Games Menu Scene
 * Main landing page with all available games
 */

import { motion } from 'framer-motion';
import { Utensils, Grid3X3, Swords, Coffee, Star, ChevronRight } from 'lucide-react';

interface GamesMenuProps {
    onNavigate: (gameId: string) => void;
}

export function GamesMenu({ onNavigate }: GamesMenuProps) {
    const menuItems = [
        {
            id: 'cooking',
            title: 'Cooking Game',
            desc: 'Become the Head Chef',
            icon: <Utensils size={32} />,
            color: 'linear-gradient(135deg, #1B4D3E, #2E8B57)',
            badge: 'Popular'
        },
        {
            id: 'sudoku',
            title: 'Sudoku',
            desc: 'The Coffee Break Classic',
            icon: <Grid3X3 size={32} />,
            color: 'linear-gradient(135deg, #4B3621, #6F4E37)',
            badge: 'Logic'
        },
        {
            id: 'xo',
            title: 'Tic Tac Toe',
            desc: 'Challenge our Barista Bot',
            icon: <Swords size={32} />,
            color: 'linear-gradient(135deg, #C19A6B, #8B5A2B)',
            badge: 'Quick'
        }
    ];

    return (
        <div className="menu-container w-full h-full flex flex-col items-center p-6 relative" style={{
            background: 'radial-gradient(circle at top left, #FAF9F6, #F5F5DC)'
        }}>
            {/* Decorative Elements */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[5%] left-[10%] text-4xl opacity-10 z-0"
            >☕</motion.div>
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[15%] right-[10%] text-4xl opacity-10 z-0"
            >🌿</motion.div>

            <header className="text-center mt-12 mb-10 z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg"
                >
                    <Coffee size={48} className="text-[#1B4D3E]" />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl m-0 leading-none text-[#1B4D3E]"
                    style={{
                        fontFamily: "'Pacifico', cursive",
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    Square Coffee
                </motion.h1>
                <div className="inline-flex items-center gap-1.5 bg-[#1B4D3E] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mt-4">
                    <Star size={14} fill="currentColor" />
                    <span>Open for Fun</span>
                </div>
            </header>

            <div className="w-full flex flex-col gap-4 z-10 flex-1">
                {menuItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                        whileHover={{ scale: 1.03, x: 5 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-md cursor-pointer border border-[#D2B48C]/20 relative"
                        onClick={() => onNavigate(item.id)}
                    >
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                            style={{ background: item.color }}
                        >
                            {item.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="text-[0.65rem] font-extrabold text-[#4B3621] uppercase">
                                    {item.badge}
                                </span>
                                <h3 className="m-0 text-[#2C1810] text-xl font-bold">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="mt-1 mb-0 text-[#8B735B] text-sm">
                                {item.desc}
                            </p>
                        </div>
                        <ChevronRight className="text-[#D2B48C] opacity-50" size={20} />
                    </motion.div>
                ))}
            </div>

            <footer className="mt-auto w-full text-center pb-8 pt-4">
                <div className="w-10 h-0.5 bg-[#D2B48C] mx-auto mb-4 rounded-full opacity-30" />
                <p
                    className="text-sm text-[#4B3621] m-0"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                >
                    Crafted with care at Square Coffee
                </p>
            </footer>
        </div>
    );
}
