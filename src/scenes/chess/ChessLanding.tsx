/**
 * Chess feature - landing page: Play vs Friends / Play vs AI
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, ArrowLeft, ChevronRight, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChessGame } from './ChessGame';
import type { PlayerSide, AIDifficulty } from './types';
import { THEME } from '@/constants/gameConfig';
import { useTranslation } from 'react-i18next';

interface ChessLandingProps {
  onBack?: () => void;
}

type View = 'menu' | 'friends' | 'ai' | 'ai-setup';

export function ChessLanding(_props: ChessLandingProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [view, setView] = useState<View>('menu');
  const [playerSide, setPlayerSide] = useState<PlayerSide>('white');
  const [difficulty, setDifficulty] = useState<AIDifficulty>(2);

  if (view === 'friends') {
    return <ChessGame mode="friends" onBack={() => setView('menu')} />;
  }

  if (view === 'ai') {
    return (
      <ChessGame
        mode="ai"
        playerSide={playerSide}
        difficulty={difficulty}
        onBack={() => setView('ai-setup')}
      />
    );
  }

  if (view === 'ai-setup') {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center p-6 relative"
        style={{ background: THEME.bgCream }}
      >
        <button
          type="button"
          onClick={() => setView('menu')}
          className="absolute top-4 left-4 p-2 rounded-xl border border-[#D2B48C] text-[#4B3621] hover:bg-white/80 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border-2 border-[#D2B48C]/50"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B4D3E] to-[#2E8B57] flex items-center justify-center shadow-lg text-white transform -rotate-6">
              <Bot size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#2C1810] mb-6 text-center">{t('chess.newGame')}</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#4B3621] mb-3 uppercase tracking-wider">{t('chess.yourTurn')}</label>
              <div className="flex gap-3">
                {(['white', 'black'] as const).map((side) => (
                  <button
                    key={side}
                    onClick={() => setPlayerSide(side)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${playerSide === side
                      ? 'border-[#4B3621] bg-[#4B3621] text-white shadow-md transform -translate-y-0.5'
                      : 'border-[#E5E7EB] hover:border-[#D2B48C] text-[#8B735B]'
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-full border ${side === 'white' ? 'bg-white border-gray-300' : 'bg-black border-black'}`} />
                    <span className="capitalize">{side}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4B3621] mb-3 uppercase tracking-wider">{t('xo.difficulty')}</label>
              <div className="flex gap-2">
                {([1, 2, 3] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-xl border-2 transition-all font-bold text-sm ${difficulty === d
                      ? 'bg-[#D2B48C] border-[#D2B48C] text-[#2C1810] shadow-inner'
                      : 'border-[#E5E7EB] text-[#8B735B] hover:bg-[#FAF9F6]'
                      }`}
                  >
                    {d === 1 ? t('xo.easy') : d === 2 ? t('xo.medium') : t('xo.hard')}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              style={{
                background: `linear-gradient(to right, ${THEME.woodDark}, ${THEME.coffeeBrown})`,
                color: '#FFF'
              }}
              onClick={() => setView('ai')}
            >
              {t('waiterSelection.start')}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #2C1810, #1a0f0a)', // Dark Coffee Background
        fontFamily: "'Pacifico', cursive",
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-[#D2B48C] opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-[#4B3621] opacity-20 blur-3xl pointer-events-none" />

      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2 rounded-xl border border-[#D2B48C]/50 text-[#F5E6D3] hover:bg-white/10 flex items-center gap-2 z-10 transition-colors backdrop-blur-sm"
      >
        <ArrowLeft size={22} />
        <span className="text-sm font-sans font-bold">{t('xo.back')}</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-12 mb-10 relative z-10"
      >
        <div className="inline-block relative">
          <div className="absolute -top-8 -right-8 text-[#FFD700] transform rotate-12 opacity-80 drop-shadow-lg">
            <Crown size={40} fill="#FFD700" />
          </div>
          <h1
            className="text-6xl font-bold text-[#F5E6D3]"
            style={{
              textShadow: '0 4px 12px rgba(0,0,0,0.5)',
              letterSpacing: '1px'
            }}
          >
            {t('chess.title')}
          </h1>
        </div>
        <p className="text-[#D7CCC8]/80 mt-3 font-sans font-medium text-lg tracking-wide">{t('chess.subtitle')}</p>
      </motion.div>

      <div className="w-full max-w-sm flex flex-col gap-5 z-10">
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#3E2723] rounded-3xl p-1 shadow-xl group relative overflow-hidden border border-[#D2B48C]/20"
          onClick={() => setView('friends')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#D2B48C] to-[#A1887F] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl" />
          <div className="relative bg-[#3E2723] group-hover:bg-[#4E342E] rounded-[22px] p-5 flex items-center gap-5 transition-colors h-24">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#3E2723] flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{ background: 'linear-gradient(135deg, #D2B48C, #A1887F)' }}
            >
              <Users size={28} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-xl font-bold text-[#F5E6D3] group-hover:text-white font-sans">{t('chess.vsFriend')}</h3>
              <p className="text-sm text-[#D7CCC8]/60 font-sans">{t('chess.subtitle')}</p>
            </div>
            <ChevronRight className="text-[#D2B48C]/50 group-hover:text-[#D2B48C] transition-colors" size={24} />
          </div>
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#3E2723] rounded-3xl p-1 shadow-xl group relative overflow-hidden border border-[#D2B48C]/20"
          onClick={() => setView('ai-setup')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#D7CCC8] to-[#BCAAA4] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl" />
          <div className="relative bg-[#3E2723] group-hover:bg-[#4E342E] rounded-[22px] p-5 flex items-center gap-5 transition-colors h-24">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#3E2723] flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{ background: 'linear-gradient(135deg, #D7CCC8, #BCAAA4)' }}
            >
              <Bot size={28} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-xl font-bold text-[#F5E6D3] group-hover:text-white font-sans">{t('chess.vsAI')}</h3>
              <p className="text-sm text-[#D7CCC8]/60 font-sans">{t('chess.subtitle')}</p>
            </div>
            <ChevronRight className="text-[#D2B48C]/50 group-hover:text-[#D2B48C] transition-colors" size={24} />
          </div>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-auto mb-4 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#D2B48C] animate-pulse"></span>
        <span className="text-[#8D6E63] text-xs font-sans tracking-widest uppercase">Select a mode</span>
        <span className="w-2 h-2 rounded-full bg-[#D2B48C] animate-pulse"></span>
      </motion.div>
    </div>
  );
}
