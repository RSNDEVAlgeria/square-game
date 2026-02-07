
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react';

interface PlayerSetupProps {
    players: string[];
    onAddPlayer: (name: string) => void;
    onRemovePlayer: (index: number) => void;
    onBack: () => void;
}

export function PlayerSetup({ players, onAddPlayer, onRemovePlayer, onBack }: PlayerSetupProps) {
    const [newPlayerName, setNewPlayerName] = useState('');

    const handleAdd = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (newPlayerName.trim()) {
            onAddPlayer(newPlayerName.trim());
            setNewPlayerName('');
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-start pt-24 p-6 relative overflow-y-auto no-scrollbar"
            style={{
                background: 'linear-gradient(135deg, #F3E8FF 0%, #E0D4FC 100%)' // Soft purple for generic setup
            }}>

            {/* Header */}
            <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4">
                <button
                    onClick={onBack}
                    className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                    aria-label="Back"
                >
                    <ArrowLeft size={20} className="text-[#1B4D3E]" />
                </button>

                <h2 className="text-2xl font-bold text-[#1B4D3E]" style={{ fontFamily: "'Pacifico', cursive" }}>
                    Player Setup
                </h2>

                <div className="w-12"></div> {/* Spacer for centering */}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-xl"
            >
                <div className="text-center mb-6">
                    <Users size={48} className="mx-auto text-[#6D28D9] mb-2" />
                    <p className="text-[#4B5563]">Add players to customize the game experience!</p>
                </div>

                {/* Add Player Form */}
                <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        placeholder="Enter player name"
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none bg-white/80"
                    />
                    <button
                        type="submit"
                        disabled={!newPlayerName.trim()}
                        className="p-3 bg-purple-600 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                        aria-label="Add Player"
                    >
                        <Plus size={24} />
                    </button>
                </form>

                {/* Player List */}
                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {players.length === 0 ? (
                        <p className="text-center text-gray-400 italic py-4">No players added yet.</p>
                    ) : (
                        players.map((player, index) => (
                            <motion.div
                                key={`${player}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-purple-100"
                            >
                                <span className="font-semibold text-gray-800 truncate px-2">{player}</span>
                                <button
                                    onClick={() => onRemovePlayer(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    aria-label={`Remove ${player}`}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={onBack}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity"
                    >
                        Done
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
