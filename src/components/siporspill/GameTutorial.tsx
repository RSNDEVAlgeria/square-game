
import { motion } from 'framer-motion';
import { Coffee, CheckCircle, ArrowRight } from 'lucide-react';
import type { GameType } from './GameData';

interface GameTutorialProps {
    gameType: GameType;
    onStart: () => void;
}

const TUTORIAL_CONTENT: Record<GameType, { title: string; steps: string[] }> = {
    'truth-dare': {
        title: 'How to Play Truth or Dare',
        steps: [
            "Players take turns picking a card.",
            "The card will reveal a Truth question or a Dare challenge.",
            "If you choose Truth, answer honestly!",
            "If you choose Dare, complete the challenge!",
            "You have one 'Skip' per game to avoid a card."
        ]
    },
    'would-you-rather': {
        title: 'How to Play Would You Rather',
        steps: [
            "A scenario with two difficult choices will be shown.",
            "Read the options out loud to the group.",
            "Everyone must choose one option - no middle ground!",
            "Discuss why you made your choice.",
            "There are no right or wrong answers, just fun debates!"
        ]
    },
    'never-have-i-ever': {
        title: 'How to Play Never Have I Ever',
        steps: [
            "Read the statement on the card out loud (e.g., 'Never have I ever...').",
            "Anyone who HAS done the action must take a sip of their drink ☕.",
            "If you haven't done it, you're safe!",
            "Share the story if you're comfortable!",
            "Keep it fun and respectful."
        ]
    },
    'most-likely-to': {
        title: "How to Play Who's Likely To",
        steps: [
            "Read the 'Who is most likely to...' question out loud.",
            "On the count of three, everyone points to the person they think fits best.",
            "The person with the most fingers pointed at them wins (or loses!) that round.",
            "The winner can take a sip or share a story.",
            "Debate and defend your choices!"
        ]
    }
};

export function GameTutorial({ gameType, onStart }: GameTutorialProps) {
    const content = TUTORIAL_CONTENT[gameType];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 relative"
            style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F5E6D3 100%)' }}>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-md shadow-2xl border border-amber-100"
            >
                <div className="text-center mb-6">
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-5xl mb-4"
                    >
                        ☕
                    </motion.div>
                    <h2 className="text-2xl font-bold text-[#1B4D3E] mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
                        {content.title}
                    </h2>
                    <div className="h-1 w-20 bg-amber-300 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-4 mb-8">
                    {content.steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.15 }}
                            className="flex gap-3 items-start"
                        >
                            <CheckCircle size={20} className="text-[#1B4D3E] mt-0.5 flex-shrink-0" />
                            <p className="text-[#4B5563] text-sm leading-relaxed">{step}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3 items-center">
                    <Coffee size={24} className="text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-800 font-medium">
                        Remember to keep it friendly and café-appropriate! Have fun!
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className="w-full bg-[#1B4D3E] text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-[#143d30] transition-colors"
                >
                    <span>Start Playing</span>
                    <ArrowRight size={20} />
                </motion.button>
            </motion.div>
        </div>
    );
}
