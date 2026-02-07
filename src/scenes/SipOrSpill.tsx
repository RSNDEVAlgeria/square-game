
/**
 * Sip or Spill ☕ - Party Games Collection
 * Includes Truth or Dare, Would You Rather, Never Have I Ever, Who's Likely To
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Sparkles, Heart, Coffee, HelpCircle, AlertCircle, Fingerprint } from 'lucide-react';
import { PlayerSetup } from '../components/siporspill/PlayerSetup';
import { GameSession } from '../components/siporspill/GameSession';
import { GameTutorial } from '../components/siporspill/GameTutorial';
import type { GameType, Category } from '../components/siporspill/GameData';

interface SipOrSpillProps {
    onBack: () => void;
}

type ViewState = 'menu' | 'setup' | 'game' | 'td-select' | 'tutorial';

export function SipOrSpill({ onBack }: SipOrSpillProps) {
    const [view, setView] = useState<ViewState>('menu');
    const [gameType, setGameType] = useState<GameType>('truth-dare');
    const [category, setCategory] = useState<Category>('party');
    const [players, setPlayers] = useState<string[]>([]);

    const handleGameSelect = (type: GameType) => {
        if (type === 'truth-dare') {
            setView('td-select');
        } else {
            setGameType(type);
            setCategory('party'); // Default for others
            setView('tutorial');
        }
    };

    const handleTDSelect = (cat: Category) => {
        setGameType('truth-dare');
        setCategory(cat);
        setView('tutorial');
    };

    const handleBackToMenu = () => {
        setView('menu');
        setGameType('truth-dare'); // Reset
    };

    // Render Logic
    if (view === 'setup') {
        return (
            <PlayerSetup
                players={players}
                onAddPlayer={(name) => setPlayers([...players, name])}
                onRemovePlayer={(index) => setPlayers(players.filter((_, i) => i !== index))}
                onBack={handleBackToMenu}
            />
        );
    }

    if (view === 'tutorial') {
        return (
            <div className="w-full h-full relative">
                <button
                    onClick={handleBackToMenu}
                    className="absolute top-4 left-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10"
                >
                    <ArrowLeft size={24} className="text-[#1B4D3E]" />
                </button>
                <GameTutorial
                    gameType={gameType}
                    onStart={() => setView('game')}
                />
            </div>
        );
    }

    if (view === 'game') {
        return (
            <GameSession
                gameType={gameType}
                category={category}
                players={players}
                onBack={() => setView('menu')}
                onChangePlayers={() => setView('setup')}
            />
        );
    }

    if (view === 'td-select') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 relative"
                style={{ background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)' }}>
                <button
                    onClick={handleBackToMenu}
                    className="absolute top-4 left-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10"
                >
                    <ArrowLeft size={24} className="text-[#1B4D3E]" />
                </button>

                <h2 className="text-3xl font-bold text-[#8B4049] mb-8 text-center" style={{ fontFamily: "'Pacifico', cursive" }}>
                    Select Mode
                </h2>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTDSelect('couples')}
                        className="bg-gradient-to-r from-pink-100 to-rose-100 p-6 rounded-3xl shadow-lg border-2 border-pink-200 flex items-center gap-4"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center text-white">
                            <Heart size={32} fill="currentColor" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-pink-900">Couples</h3>
                            <p className="text-sm text-pink-700">Romantic & Sweet</p>
                        </div>
                    </motion.button>

                    <motion.button
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTDSelect('friends')}
                        className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-3xl shadow-lg border-2 border-blue-200 flex items-center gap-4"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center text-white">
                            <Users size={32} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-blue-900">Friends</h3>
                            <p className="text-sm text-blue-700">Fun & Social</p>
                        </div>
                    </motion.button>
                </div>
            </div>
        );
    }

    // Main Menu
    return (
        <div className="w-full h-full flex flex-col items-center justify-start pt-20 p-6 relative overflow-y-auto no-scrollbar"
            style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F5E6D3 100%)' }}>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-4 left-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10"
            >
                <ArrowLeft size={24} className="text-[#1B4D3E]" />
            </button>

            {/* Header */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-10"
            >
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-block text-6xl mb-2"
                >
                    ☕
                </motion.div>
                <h1 className="text-4xl font-bold text-[#1B4D3E] mb-1" style={{ fontFamily: "'Pacifico', cursive" }}>
                    Sip or Spill
                </h1>
                <p className="text-[#8B735B]">Party Games Collection</p>
            </motion.div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 gap-4 w-full max-w-sm mb-20">
                {/* Truth or Dare */}
                <MenuButton
                    title="Truth or Dare"
                    subtitle="Couples & Friends Modes"
                    icon={<Coffee size={28} />}
                    color="from-purple-500 to-indigo-500"
                    onClick={() => handleGameSelect('truth-dare')}
                    delay={0}
                />

                {/* Would You Rather */}
                <MenuButton
                    title="Would You Rather"
                    subtitle="Tough Choices"
                    icon={<HelpCircle size={28} />}
                    color="from-orange-400 to-amber-500"
                    onClick={() => handleGameSelect('would-you-rather')}
                    delay={0.1}
                />

                {/* Never Have I Ever */}
                <MenuButton
                    title="Never Have I Ever"
                    subtitle="Reveal Secrets"
                    icon={<AlertCircle size={28} />}
                    color="from-pink-500 to-rose-500"
                    onClick={() => handleGameSelect('never-have-i-ever')}
                    delay={0.2}
                />

                {/* Who's Likely To */}
                <MenuButton
                    title="Who's Likely To"
                    subtitle="Point Fingers"
                    icon={<Fingerprint size={28} />}
                    color="from-emerald-400 to-teal-500"
                    onClick={() => handleGameSelect('most-likely-to')}
                    delay={0.3}
                />
            </div>

            {/* Bottom: Player Setup */}
            <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6">
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setView('setup')}
                    className="bg-white/90 backdrop-blur-md border border-[#1B4D3E]/20 text-[#1B4D3E] px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-bold w-full max-w-sm justify-center"
                >
                    <Users size={20} />
                    <span>Manage Players ({players.length})</span>
                </motion.button>
            </div>
        </div>
    );
}


interface MenuButtonProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
    delay: number;
}

function MenuButton({ title, subtitle, icon, color, onClick, delay }: MenuButtonProps) {
    return (
        <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative overflow-hidden bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex items-center gap-4 text-left"
        >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all`}>
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#1B4D3E] transition-colors">{title}</h3>
                <p className="text-gray-500 text-sm">{subtitle}</p>
            </div>
            <Sparkles className="text-gray-300 group-hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100" size={20} />
        </motion.button>
    );
}

