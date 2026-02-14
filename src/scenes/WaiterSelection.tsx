/**
 * Square Coffee - Waiter Selection Scene
 * Choose your character with stats display
 */

import { useState, useEffect } from 'react';
import { ArrowRight, Zap, Heart, Coins, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WAITERS, THEME } from '@/constants/gameConfig';
import type { Waiter } from '@/types/game';
import { useTranslation } from 'react-i18next';

interface WaiterSelectionProps {
  onSelect: (waiterId: number) => void;
  onStart: () => void;
  selectedWaiter: Waiter | null;
}

// Stat icon mapping
const StatIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'speed':
      return <Zap className="w-3 h-3" />;
    case 'stamina':
      return <Heart className="w-3 h-3" />;
    case 'tips':
      return <Coins className="w-3 h-3" />;
    default:
      return <Sparkles className="w-3 h-3" />;
  }
};

export function WaiterSelection({ onSelect, onStart, selectedWaiter }: WaiterSelectionProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredWaiter, setHoveredWaiter] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col p-4 md:p-6 justify-center"
      style={{ background: THEME.bgLight }}
    >
      {/* Header */}
      <div
        className={`
          text-center mb-6
          transition-all duration-500
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        `}
      >
        <h2
          className="text-2xl md:text-3xl font-bold mb-1"
          style={{ color: THEME.coffeeBrown }}
        >
          {t('waiterSelection.title')}
        </h2>
        <p
          className="text-sm"
          style={{ color: THEME.textMedium }}
        >
          {t('waiterSelection.subtitle')}
        </p>
      </div>

      {/* Waiter Grid - Two large cards side by side */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 px-2">
        {WAITERS.map((waiter, index) => (
          <div
            key={waiter.id}
            onClick={() => onSelect(waiter.id)}
            onMouseEnter={() => setHoveredWaiter(waiter.id)}
            onMouseLeave={() => setHoveredWaiter(null)}
            className={`
              relative flex flex-col items-center p-4 md:p-5 rounded-2xl cursor-pointer
              transition-all duration-300 ease-out
              ${selectedWaiter?.id === waiter.id
                ? 'scale-[1.02]'
                : 'hover:scale-[1.02]'
              }
              ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
              }
            `}
            style={{
              background: 'white',
              boxShadow: selectedWaiter?.id === waiter.id
                ? `0 8px 24px rgba(152, 216, 200, 0.4), 0 4px 12px rgba(0,0,0,0.1)`
                : '0 4px 12px rgba(0,0,0,0.08)',
              transitionDelay: `${index * 80}ms`,
              border: selectedWaiter?.id === waiter.id ? `3px solid ${THEME.mint}` : '3px solid transparent',
            }}
          >
            {/* Avatar */}
            <div
              className={`
                w-20 h-24 md:w-24 md:h-28 rounded-xl overflow-hidden mb-2 shadow-md
                bg-gradient-to-br ${waiter.color}
                transition-transform duration-300 border-4 border-white
                ${hoveredWaiter === waiter.id ? 'scale-105' : ''}
                ${selectedWaiter?.id === waiter.id ? 'ring-4 ring-offset-2' : ''}
              `}
              style={{
                boxShadow: selectedWaiter?.id === waiter.id
                  ? `0 0 0 4px ${THEME.mint}, 0 4px 12px rgba(0,0,0,0.15)`
                  : '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {waiter.image ? (
                <img
                  src={waiter.image}
                  alt={waiter.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl">
                  {waiter.emoji}
                </div>
              )}
            </div>

            {/* Name */}
            <h3
              className="font-bold text-base md:text-lg mb-2"
              style={{ color: THEME.textDark }}
            >
              {waiter.name}
            </h3>

            {/* Stats */}
            <div className="flex flex-wrap gap-2 justify-center mt-auto">
              <span
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: THEME.bgCream, color: THEME.textMedium }}
              >
                <StatIcon type="speed" />
                {waiter.stats.speedBonus}
              </span>
              <span
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: THEME.bgCream, color: THEME.textMedium }}
              >
                <StatIcon type="stamina" />
                {waiter.stats.staminaBonus}
              </span>
            </div>

            {/* Selection indicator */}
            {selectedWaiter?.id === waiter.id && (
              <div
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center animate-bounce"
                style={{ background: THEME.mint }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Waiter Info */}
      {selectedWaiter && (
        <div
          className="mb-4 p-3 rounded-xl text-center animate-in fade-in slide-in-from-bottom-2"
          style={{ background: THEME.bgCream }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: THEME.textMedium }}
          >
            {selectedWaiter.description}
          </p>
        </div>
      )}

      {/* Start Button - Positioned naturally below grid */}
      <Button
        onClick={onStart}
        disabled={!selectedWaiter}
        className={`
          w-full h-14 text-lg font-bold rounded-xl shadow-lg
          transition-all duration-300
          ${selectedWaiter ? 'opacity-100' : 'opacity-50'}
        `}
        style={{
          background: selectedWaiter
            ? `linear-gradient(135deg, ${THEME.mint} 0%, ${THEME.mintDark} 100%)`
            : '#ccc',
          color: THEME.espresso
        }}
      >
        {t('waiterSelection.start')}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}
