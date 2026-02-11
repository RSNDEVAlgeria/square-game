
import { motion } from 'framer-motion';
import { Coffee, CheckCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { GameType } from './GameData';

interface GameTutorialProps {
    gameType: GameType;
    onStart: () => void;
}

export function GameTutorial({ gameType, onStart }: GameTutorialProps) {
    const { t } = useTranslation();
    
    // Map gameType to translation keys
    const tutorialKeyMap: Record<GameType, string> = {
        'truth-dare': 'truthDare',
        'would-you-rather': 'wouldYouRather',
        'never-have-i-ever': 'neverHaveIEver',
        'most-likely-to': 'likelyTo'
    };
    
    const tutorialKey = tutorialKeyMap[gameType];
    const title = t(`sipOrSpill.tutorial.${tutorialKey}.title`);
    const steps = t(`sipOrSpill.tutorial.${tutorialKey}.steps`, { returnObjects: true }) as string[];
    const footer = t('sipOrSpill.tutorial.footer');
    const startButton = t('sipOrSpill.tutorial.startButton');

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
                        {title}
                    </h2>
                    <div className="h-1 w-20 bg-amber-300 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-4 mb-8">
                    {steps.map((step: string, index: number) => (
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
                        {footer}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className="w-full bg-[#1B4D3E] text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-[#143d30] transition-colors"
                >
                    <span>{startButton}</span>
                    <ArrowRight size={20} />
                </motion.button>
            </motion.div>
        </div>
    );
}
