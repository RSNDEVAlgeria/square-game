
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Users, Coffee, SkipForward } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CONTENT, type GameType, type Category, type GameItem } from './GameData';

interface GameSessionProps {
    gameType: GameType;
    category: Category;
    players: string[];
    onBack: () => void;
    onChangePlayers: () => void;
}

export function GameSession({ gameType, category, players, onBack, onChangePlayers }: GameSessionProps) {
    const { t } = useTranslation();
    const [currentCard, setCurrentCard] = useState<GameItem | null>(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [usedIndices, setUsedIndices] = useState<Set<string>>(new Set());
    const [skipsRemaining, setSkipsRemaining] = useState(1);
    const [isChoosingType, setIsChoosingType] = useState(gameType === 'truth-dare');
    const [selectedType, setSelectedType] = useState<'truth' | 'dare' | null>(null);

    const getRandomCard = useCallback((forcedType?: 'truth' | 'dare') => {
        let pool: (string | GameItem)[] = [];
        let type: 'truth' | 'dare' | undefined;

        if (gameType === 'truth-dare') {
            // Use translated content for truth/dare
            const translatedTruths = t('sipOrSpill.content.' + category + '.truths', { returnObjects: true }) as string[];
            const translatedDares = t('sipOrSpill.content.' + category + '.dares', { returnObjects: true }) as string[];
            
            // Fallback to CONTENT if translations not available
            const truthDareContent = CONTENT['truth-dare'] as Record<string, { truths: string[], dares: string[] }>;
            const catContent = truthDareContent[category];
            
            if (!catContent) return null;

            // Use forced type if provided, otherwise randomly choose
            type = forcedType || (Math.random() > 0.5 ? 'truth' : 'dare');
            
            // Use translated content if available, otherwise fallback to CONTENT
            const truths = (translatedTruths && translatedTruths.length > 0) ? translatedTruths : catContent.truths;
            const dares = (translatedDares && translatedDares.length > 0) ? translatedDares : catContent.dares;
            pool = type === 'truth' ? truths : dares;
        } else {
            const otherContent = CONTENT[gameType] as Record<string, (string | GameItem)[]>;
            pool = otherContent[category] || [];
        }

        if (!pool || pool.length === 0) return null;

        // Filter out used cards
        const availableIndices = pool.map((_, index) => index).filter(index => {
            const key = `${gameType}-${category}-${type || 'gen'}-${index}`;
            return !usedIndices.has(key);
        });

        // Reset if all used
        if (availableIndices.length === 0) {
            setUsedIndices(new Set());
            const randomIndex = Math.floor(Math.random() * pool.length);
            const item = pool[randomIndex];
            return typeof item === 'string' ? { id: `rnd-${Date.now()}`, text: item, type } : { ...item, type };
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const key = `${gameType}-${category}-${type || 'gen'}-${randomIndex}`;
        setUsedIndices(prev => new Set([...prev, key]));

        const item = pool[randomIndex];
        // Normalize item to GameItem
        if (typeof item === 'string') {
            return { id: key, text: item, type };
        }
        return { ...item, type, id: key };

    }, [gameType, category, usedIndices, t]);

    const handleNextCard = useCallback(() => {
        // For truth-dare, show choice first unless type is already selected
        if (gameType === 'truth-dare' && !selectedType) {
            setIsChoosingType(true);
            setCurrentCard(null);
            return;
        }

        const card = getRandomCard(selectedType || undefined);
        setCurrentCard(card);
        setIsChoosingType(false);
        setSelectedType(null);

        // Unify player rotation
        if (players.length > 0) {
            setCurrentPlayerIndex(prev => (prev + 1) % players.length);
        }
    }, [getRandomCard, players.length, gameType, selectedType]);

    const handleTypeSelect = (type: 'truth' | 'dare') => {
        setSelectedType(type);
        const card = getRandomCard(type);
        setCurrentCard(card);
        setIsChoosingType(false);

        // Unify player rotation
        if (players.length > 0) {
            setCurrentPlayerIndex(prev => (prev + 1) % players.length);
        }
    };

    // Initial load
    useEffect(() => {
        if (gameType !== 'truth-dare') {
            handleNextCard();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSkip = () => {
        if (skipsRemaining > 0) {
            setSkipsRemaining(prev => prev - 1);
            // Reset to choice state for truth-dare
            if (gameType === 'truth-dare') {
                setIsChoosingType(true);
                setSelectedType(null);
                setCurrentCard(null);
            } else {
                handleNextCard();
            }
        }
    };

    const handleRestart = () => {
        setUsedIndices(new Set());
        setSkipsRemaining(1);
        setCurrentPlayerIndex(0);
        setSelectedType(null);
        if (gameType === 'truth-dare') {
            setIsChoosingType(true);
            setCurrentCard(null);
        } else {
            setIsChoosingType(false);
            handleNextCard();
        }
    };

    const currentPlayer = players.length > 0 ? players[currentPlayerIndex] : "Player";

    // Dynamic styles based on game type
    const getBackground = () => {
        switch (gameType) {
            case 'truth-dare':
                return category === 'couples'
                    ? 'linear-gradient(135deg, #FFF5F7 0%, #FFE4E9 100%)'
                    : 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)';
            case 'would-you-rather':
                return 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'; // Orange/Warm
            case 'never-have-i-ever':
                return 'linear-gradient(135deg, #F5F3FF 0%, #DDD6FE 100%)'; // Purple
            case 'most-likely-to':
                return 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'; // Green
            default:
                return 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)';
        }
    };

    const getCardColor = () => {
        if (gameType === 'truth-dare') {
            if (currentCard?.type === 'truth') {
                return category === 'couples' ? 'from-pink-400 to-red-400' : 'from-blue-400 to-cyan-400';
            } else {
                return category === 'couples' ? 'from-purple-400 to-pink-400' : 'from-green-400 to-emerald-400';
            }
        }
        switch (gameType) {
            case 'would-you-rather': return 'from-orange-400 to-amber-400';
            case 'never-have-i-ever': return 'from-violet-400 to-purple-400';
            case 'most-likely-to': return 'from-emerald-400 to-teal-400';
            default: return 'from-gray-400 to-slate-400';
        }
    };

    const getTitle = () => {
        switch (gameType) {
            case 'truth-dare': return category === 'couples' ? t('sipOrSpill.couples') : t('sipOrSpill.friends');
            case 'would-you-rather': return t('sipOrSpill.modes.wouldYouRather.title');
            case 'never-have-i-ever': return t('sipOrSpill.modes.neverHaveIEver.title');
            case 'most-likely-to': return t('sipOrSpill.modes.likelyTo.title');
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-start pt-24 p-6 relative overflow-y-auto no-scrollbar"
            style={{ background: getBackground() }}>

            {/* Header */}
            <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10">
                <button onClick={onBack} className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all">
                    <ArrowLeft size={20} className="text-[#1B4D3E]" />
                </button>

                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-[#1B4D3E] whitespace-nowrap">{getTitle()}</span>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleRestart} className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all">
                        <RotateCcw size={20} className="text-[#1B4D3E]" />
                    </button>
                    <button onClick={onChangePlayers} className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all">
                        <Users size={20} className="text-[#1B4D3E]" />
                    </button>
                </div>
            </div>

            {/* Active Player Indicator */}
            {players.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={currentPlayer}
                    className="mb-6 px-6 py-2 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white/50"
                >
                    <p className="text-[#1B4D3E] font-semibold text-lg flex items-center gap-2">
                        <span>👤</span> {currentPlayer}
                    </p>
                </motion.div>
            )}

            {/* Truth or Dare Choice */}
            {gameType === 'truth-dare' && isChoosingType && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-md"
                >
                    <div className={`bg-gradient-to-br ${category === 'couples' ? 'from-pink-400 to-purple-400' : 'from-blue-400 to-cyan-400'} rounded-3xl p-8 shadow-2xl min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden text-center`}>
                        <div className="absolute top-0 right-0 text-6xl opacity-20">🎲</div>
                        <div className="absolute bottom-0 left-0 text-6xl opacity-20">✨</div>
                        
                        <h2 className="text-white text-3xl font-bold mb-8 drop-shadow-lg">
                            {t('sipOrSpill.selectMode')}
                        </h2>
                        
                        <div className="flex flex-col gap-4 w-full">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleTypeSelect('truth')}
                                className="bg-white/90 backdrop-blur-sm text-blue-600 py-5 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 hover:bg-white transition-all"
                            >
                                <span className="text-3xl">🤔</span>
                                {t('sipOrSpill.truth')}
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleTypeSelect('dare')}
                                className="bg-white/90 backdrop-blur-sm text-purple-600 py-5 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 hover:bg-white transition-all"
                            >
                                <span className="text-3xl">🎯</span>
                                {t('sipOrSpill.dare')}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Card Display */}
            <AnimatePresence mode="wait">
                {currentCard && (
                    <motion.div
                        key={currentCard.id}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <div className={`bg-gradient-to-br ${getCardColor()} rounded-3xl p-8 shadow-2xl min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden text-center`}>
                            {/* Type Badge (Only for Truth/Dare) */}
                            {gameType === 'truth-dare' && (
                                <div className="absolute top-6 left-6 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <span className="text-white font-bold text-sm uppercase tracking-wider">
                                        {currentCard.type === 'truth' ? `🤔 ${t('sipOrSpill.truth')}` : `🎯 ${t('sipOrSpill.dare')}`}
                                    </span>
                                </div>
                            )}

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 text-6xl opacity-20">☕</div>
                            <div className="absolute bottom-0 left-0 text-6xl opacity-20">✨</div>

                            {/* Main Content */}
                            <div className="z-10 w-full">
                                {gameType === 'would-you-rather' && currentCard.options ? (
                                    <div className="flex flex-col gap-6 w-full">
                                        <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border-2 border-white/30 cursor-pointer hover:bg-white/30 transition-all">
                                            <p className="text-white text-xl font-bold">{currentCard.options[0]}</p>
                                        </div>
                                        <div className="text-white font-bold text-lg">- OR -</div>
                                        <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border-2 border-white/30 cursor-pointer hover:bg-white/30 transition-all">
                                            <p className="text-white text-xl font-bold">{currentCard.options[1]}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-white text-2xl font-bold leading-relaxed px-4 shadow-black/10 drop-shadow-sm">
                                        {currentCard.text}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 w-full max-w-md px-4">
                {!isChoosingType && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextCard}
                        className="bg-white text-[#1B4D3E] py-4 rounded-2xl font-bold text-lg shadow-lg border-2 border-[#1B4D3E] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <Coffee size={24} />
                        {t('sipOrSpill.next')}
                    </motion.button>
                )}

                {/* Only show skip for Truth/Dare as per original spec, or maybe all? keeping to T/D for now as others are group games generally */}
                {gameType === 'truth-dare' && !isChoosingType && (
                    <motion.button
                        whileHover={{ scale: skipsRemaining > 0 ? 1.05 : 1 }}
                        whileTap={{ scale: skipsRemaining > 0 ? 0.95 : 1 }}
                        onClick={handleSkip}
                        disabled={skipsRemaining === 0}
                        className={`py-3 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${skipsRemaining > 0
                            ? 'bg-amber-100 text-amber-800 border-2 border-amber-300 hover:bg-amber-200'
                            : 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed'
                            }`}
                    >
                        <SkipForward size={16} />
                        {skipsRemaining > 0 ? `${t('sipOrSpill.skip')} ${t('sipOrSpill.skipsLeft', { count: skipsRemaining })}` : t('sipOrSpill.noSkipsLeft')}
                    </motion.button>
                )}
            </div>

            <div className="h-8"></div> {/* Bottom spacer */}
        </div>
    );
}
