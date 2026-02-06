/**
 * Sip or Spill ☕ - Truth or Dare Game
 * Coffee shop themed truth or dare game with Couples and Friends modes
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Users, Coffee, Sparkles, SkipForward, RotateCcw } from 'lucide-react';

interface SipOrSpillProps {
    onBack: () => void;
}

type GameMode = 'couples' | 'friends' | null;
type CardType = 'truth' | 'dare';

interface Card {
    type: CardType;
    text: string;
}

// Truth and Dare content for Couples Mode
const couplesContent = {
    truths: [
        "What's your favorite thing about our relationship?",
        "When did you first realize you had feelings for me?",
        "What's a secret wish you have for us?",
        "What's your favorite memory of us together?",
        "If you could relive one moment with me, which would it be?",
        "What song reminds you of me and why?",
        "What's something I do that makes you smile every time?",
        "What's your idea of a perfect date with me?",
        "What's one thing you've never told me but want to?",
        "What do you find most attractive about me?",
        "What's your favorite way I show you love?",
        "If we could travel anywhere together, where would it be?",
        "What's something you admire about me?",
        "What's your favorite thing to do together at a café?",
        "What's a dream you have for our future?",
        "What's the sweetest thing I've ever done for you?",
        "What's your favorite coffee drink to share with me?",
        "When do you feel most connected to me?",
        "What's something new you'd like to try together?",
        "What's your favorite thing about how we communicate?"
    ],
    dares: [
        "Whisper something sweet in my ear right now",
        "Hold my hand and look into my eyes for 30 seconds without laughing",
        "Give me three genuine compliments",
        "Share a sip of your coffee with me in the most romantic way",
        "Write 'I love you' on a napkin and slide it to me",
        "Tell me why you chose to be here with me today",
        "Describe our relationship using only coffee terms",
        "Feed me a small bite of your pastry",
        "Tell the barista we're celebrating something special (make it up!)",
        "Draw a heart on my hand with your finger",
        "Say something you love about me in a different language",
        "Take a selfie with me making silly faces",
        "Hum our favorite song together",
        "Tell me your favorite thing about my smile",
        "Hold both my hands and tell me three things you're grateful for",
        "Spell out 'LOVE' using items on our table",
        "Share your favorite daydream about us",
        "Give me a gentle shoulder massage for 30 seconds",
        "Tell me what you were thinking the first time we met",
        "Create a secret handshake with me right now"
    ]
};

// Truth and Dare content for Friends Mode
const friendsContent = {
    truths: [
        "What's the most embarrassing thing that happened to you at a café?",
        "What's your weirdest coffee order ever?",
        "What's a secret talent you've never shown me?",
        "What's the funniest memory you have of us?",
        "If you could only drink one beverage for life, what would it be?",
        "What's your most irrational fear?",
        "What's the worst fashion choice you've ever made?",
        "What's your guilty pleasure song?",
        "What's the strangest food combination you actually enjoy?",
        "What's something you pretend to like but actually don't?",
        "What's your most used emoji and why?",
        "What's the most spontaneous thing you've ever done?",
        "What's a habit you have that you think is weird?",
        "What's your go-to karaoke song?",
        "What's the longest you've gone without showering?",
        "What's your most unpopular opinion?",
        "What's something you're secretly competitive about?",
        "What's the worst gift you've ever received?",
        "What's your most embarrassing autocorrect fail?",
        "What's a childhood fear you still have?"
    ],
    dares: [
        "Order your next drink in a British accent",
        "Take a sip of your coffee with your eyes closed and describe it dramatically",
        "Do your best impression of a coffee machine",
        "Compliment a stranger's coffee choice",
        "Pretend to be a food critic reviewing your pastry",
        "Speak in rhymes for the next 2 minutes",
        "Do a silent dance in your seat for 15 seconds",
        "Try to make me laugh without speaking",
        "Describe your day using only song titles",
        "Act out your morning routine in fast-forward",
        "Speak only in questions for the next minute",
        "Do your best celebrity impression",
        "Hum a song and I have to guess it",
        "Tell a joke in the worst accent you can do",
        "Pretend the sugar packets are precious gems",
        "Do 5 exaggerated yawns in a row",
        "Narrate what you're doing like a nature documentary",
        "Try to sell me this napkin like it's a luxury item",
        "Do your best robot dance while seated",
        "Speak in a whisper for the next 3 questions"
    ]
};

export function SipOrSpill({ onBack }: SipOrSpillProps) {
    const [gameMode, setGameMode] = useState<GameMode>(null);
    const [currentCard, setCurrentCard] = useState<Card | null>(null);
    const [skipsRemaining, setSkipsRemaining] = useState(1);
    const [usedIndices, setUsedIndices] = useState<Set<string>>(new Set());
    const [showRules, setShowRules] = useState(false);

    const getRandomCard = useCallback((mode: GameMode, forceType?: CardType): Card => {
        if (!mode) return { type: 'truth', text: '' };

        const content = mode === 'couples' ? couplesContent : friendsContent;
        const type = forceType || (Math.random() > 0.5 ? 'truth' : 'dare');
        const pool = type === 'truth' ? content.truths : content.dares;

        // Get available indices
        const availableIndices = pool
            .map((_, index) => index)
            .filter(index => !usedIndices.has(`${mode}-${type}-${index}`));

        // Reset if all cards have been used
        if (availableIndices.length === 0) {
            setUsedIndices(new Set());
            const randomIndex = Math.floor(Math.random() * pool.length);
            return { type, text: pool[randomIndex] };
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        setUsedIndices(prev => new Set([...prev, `${mode}-${type}-${randomIndex}`]));

        return { type, text: pool[randomIndex] };
    }, [usedIndices]);

    const handleModeSelect = (mode: GameMode) => {
        setGameMode(mode);
        setShowRules(true);
    };

    const handleStartGame = () => {
        setShowRules(false);
        setCurrentCard(getRandomCard(gameMode));
    };

    const handleNextCard = () => {
        setCurrentCard(getRandomCard(gameMode));
    };

    const handleSkip = () => {
        if (skipsRemaining > 0) {
            setSkipsRemaining(prev => prev - 1);
            handleNextCard();
        }
    };

    const handleReset = () => {
        setGameMode(null);
        setCurrentCard(null);
        setSkipsRemaining(1);
        setUsedIndices(new Set());
        setShowRules(false);
    };

    // Mode Selection Screen
    if (!gameMode) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 relative"
                style={{
                    background: 'linear-gradient(135deg, #FAF9F6 0%, #F5E6D3 100%)'
                }}>
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10"
                >
                    <ArrowLeft size={24} className="text-[#1B4D3E]" />
                </button>

                {/* Decorative Coffee Cups */}
                <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-10 right-10 text-6xl opacity-20"
                >☕</motion.div>
                <motion.div
                    animate={{ rotate: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    className="absolute bottom-20 left-10 text-6xl opacity-20"
                >☕</motion.div>

                {/* Header */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-7xl mb-4"
                    >☕</motion.div>
                    <h1 className="text-5xl font-bold text-[#1B4D3E] mb-2"
                        style={{ fontFamily: "'Pacifico', cursive" }}>
                        Sip or Spill
                    </h1>
                    <p className="text-[#6F4E37] text-lg">Choose Your Adventure</p>
                </motion.div>

                {/* Mode Selection Cards */}
                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <motion.button
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05, x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleModeSelect('couples')}
                        className="bg-gradient-to-r from-pink-100 to-red-100 p-6 rounded-3xl shadow-lg border-2 border-pink-200 flex items-center gap-4 transition-all"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-400 rounded-2xl flex items-center justify-center">
                            <Heart size={32} className="text-white" fill="white" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-2xl font-bold text-[#8B4049] mb-1">Couples Mode</h3>
                            <p className="text-sm text-[#6F4E37]">Romance & Connection</p>
                        </div>
                        <Sparkles className="text-pink-400" size={24} />
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05, x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleModeSelect('friends')}
                        className="bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-3xl shadow-lg border-2 border-blue-200 flex items-center gap-4 transition-all"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-green-400 rounded-2xl flex items-center justify-center">
                            <Users size={32} className="text-white" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-2xl font-bold text-[#2C5F5D] mb-1">Friends Mode</h3>
                            <p className="text-sm text-[#6F4E37]">Fun & Laughter</p>
                        </div>
                        <Sparkles className="text-blue-400" size={24} />
                    </motion.button>
                </div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center text-[#8B735B] text-sm max-w-xs"
                >
                    A playful game designed for coffee shop conversations ☕😄
                </motion.p>
            </div>
        );
    }

    // Rules Screen
    if (showRules) {
        const isCouplesMode = gameMode === 'couples';
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-y-auto"
                style={{
                    background: isCouplesMode
                        ? 'linear-gradient(135deg, #FFF5F7 0%, #FFE4E9 100%)'
                        : 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)'
                }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md shadow-2xl"
                >
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">
                            {isCouplesMode ? '❤️' : '🧑‍🤝‍🧑'}
                        </div>
                        <h2 className="text-3xl font-bold text-[#1B4D3E] mb-2"
                            style={{ fontFamily: "'Pacifico', cursive" }}>
                            {isCouplesMode ? 'Couples Mode' : 'Friends Mode'}
                        </h2>
                        <p className="text-[#6F4E37]">How to Play</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-[#1B4D3E] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                            <p className="text-[#2C1810] flex-1">
                                Each round, you'll get a random <strong>Truth</strong> or <strong>Dare</strong>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-[#1B4D3E] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                            <p className="text-[#2C1810] flex-1">
                                Answer truthfully or complete the dare!
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-[#1B4D3E] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                            <p className="text-[#2C1810] flex-1">
                                You can skip <strong>once</strong> per game
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-[#1B4D3E] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                            <p className="text-[#2C1810] flex-1">
                                All challenges are café-friendly and respectful
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Coffee size={20} className="text-amber-600" />
                            <span className="font-bold text-amber-800">Café Etiquette</span>
                        </div>
                        <p className="text-sm text-amber-900">
                            Keep it fun, light, and respectful. No loud disruptions or inappropriate content!
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartGame}
                        className="w-full bg-gradient-to-r from-[#1B4D3E] to-[#2E8B57] text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
                    >
                        Let's Play! ☕
                    </motion.button>

                    <button
                        onClick={handleReset}
                        className="w-full mt-3 text-[#6F4E37] py-2 text-sm hover:text-[#1B4D3E] transition-colors"
                    >
                        ← Back to Mode Selection
                    </button>
                </motion.div>
            </div>
        );
    }

    // Game Screen
    const isCouplesMode = gameMode === 'couples';
    const cardColor = currentCard?.type === 'truth'
        ? (isCouplesMode ? 'from-pink-400 to-red-400' : 'from-blue-400 to-cyan-400')
        : (isCouplesMode ? 'from-purple-400 to-pink-400' : 'from-green-400 to-emerald-400');

    return (
        <div className="w-full h-full flex flex-col items-center justify-start pt-28 p-6 relative overflow-y-auto no-scrollbar"
            style={{
                background: isCouplesMode
                    ? 'linear-gradient(135deg, #FFF5F7 0%, #FFE4E9 100%)'
                    : 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)'
            }}>

            {/* Header */}
            <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4">
                <button
                    onClick={handleReset}
                    className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                >
                    <ArrowLeft size={20} className="text-[#1B4D3E]" />
                </button>

                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    {isCouplesMode ? <Heart size={16} className="text-pink-500" fill="currentColor" /> : <Users size={16} className="text-blue-500" />}
                    <span className="text-sm font-bold text-[#1B4D3E]">
                        {isCouplesMode ? 'Couples' : 'Friends'}
                    </span>
                </div>

                <button
                    onClick={handleReset}
                    className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                >
                    <RotateCcw size={20} className="text-[#1B4D3E]" />
                </button>
            </div>

            {/* Card Display */}
            <AnimatePresence mode="wait">
                {currentCard && (
                    <motion.div
                        key={currentCard.text}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-sm"
                    >
                        <div className={`bg-gradient-to-br ${cardColor} rounded-3xl p-8 shadow-2xl min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden`}>
                            {/* Card Type Badge */}
                            <div className="absolute top-6 left-6 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">
                                <span className="text-white font-bold text-sm uppercase tracking-wider">
                                    {currentCard.type === 'truth' ? '🤔 Truth' : '🎯 Dare'}
                                </span>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 text-6xl opacity-20">☕</div>
                            <div className="absolute bottom-0 left-0 text-6xl opacity-20">✨</div>

                            {/* Card Text */}
                            <p className="text-white text-2xl font-bold text-center leading-relaxed z-10 px-4">
                                {currentCard.text}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextCard}
                    className="bg-white text-[#1B4D3E] py-4 rounded-2xl font-bold text-lg shadow-lg border-2 border-[#1B4D3E] flex items-center justify-center gap-2"
                >
                    <Coffee size={20} />
                    Next Challenge
                </motion.button>

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
                    {skipsRemaining > 0 ? `Skip (${skipsRemaining} left)` : 'No Skips Left'}
                </motion.button>
            </div>

            {/* Footer Tip */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center text-[#8B735B] text-sm max-w-xs"
            >
                Remember: Have fun and keep it café-friendly! ☕😄
            </motion.p>
        </div>
    );
}
