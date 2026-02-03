/**
 * Square Coffee - Gameplay Scene
 * Main game area with cafe layout, customers, and interactions
 */

import { useState, useRef, useCallback } from 'react';
import { Pause, Trash2, DollarSign, Star, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PowerUpsPanel } from '@/components/PowerUpsPanel';
import { ParticleEffects } from '@/components/ParticleEffects';
import { useHaptic } from '@/hooks/useHaptic';
import {
  FOOD_ITEMS,
  CUSTOMER_POSITIONS,
  THEME
} from '@/constants/gameConfig';
import type { Customer, FloatingText, ServeResult } from '@/types/game';
import type { ActivePowerUp, ParticleEffect } from '@/types/enhancedGameplay';

interface GameplayProps {
  // Game state
  score: number;
  money: number;
  stamina: number;
  maxStamina: number;
  combo: number;
  customers: Customer[];
  plateItems: string[];
  floatingTexts: FloatingText[];
  inventory: Record<string, number>;
  upgradeLevels: Record<string, number>;
  activePowerUps?: ActivePowerUp[];
  particles?: ParticleEffect[];


  // Actions
  onPause: () => void;
  onAddToPlate: (foodId: string) => void;
  onClearPlate: () => void;
  onServeCustomer: (customerId: string) => ServeResult;
  onAddFloatingText: (x: number, y: number, text: string, color: string) => void;
  onActivatePowerUp?: (powerUpType: string) => void;

  // Sound
  onPlaySound: (sound: 'click' | 'success' | 'error' | 'plateClear' | 'customerArrive') => void;
}

// Get patience color based on ratio
const getPatienceColor = (ratio: number): string => {
  if (ratio > 0.5) return THEME.success;
  if (ratio > 0.25) return THEME.warning;
  return THEME.danger;
};

export function Gameplay({
  score,
  money,
  stamina,
  maxStamina,
  combo,
  customers,
  plateItems,
  floatingTexts,
  inventory,
  upgradeLevels,
  activePowerUps = [],
  particles = [],
  onPause,
  onAddToPlate,
  onClearPlate,
  onServeCustomer,
  onAddFloatingText,
  onActivatePowerUp,
  onPlaySound
}: GameplayProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLButtonElement>(null);
  const [isTouching, setIsTouching] = useState(false);
  const { hapticFeedback } = useHaptic();

  const staminaPercent = (stamina / maxStamina) * 100;
  const staminaColor = getPatienceColor(staminaPercent / 100);

  // Handle food item click
  const handleFoodClick = useCallback((foodId: string, event: React.MouseEvent | React.TouchEvent) => {
    onAddToPlate(foodId);
    onPlaySound('click');
    hapticFeedback('light');

    // Get click position for feedback
    let clientX, clientY;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }

    if (clientX !== undefined && clientY !== undefined) {
      // Create a floating element relative to the viewport if we can't get canvas ref easily, 
      // but the floating text system expects coordinates relative to the game container usually.
      // We'll approximate or use the button's position if simpler.
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const parentRect = canvasRef.current?.getBoundingClientRect();

      if (parentRect) {
        onAddFloatingText(
          rect.left - parentRect.left + rect.width / 2,
          rect.top - parentRect.top,
          '-5',
          THEME.coral
        );
      }
    }
  }, [onAddToPlate, onPlaySound, onAddFloatingText]);

  // Handle trash click
  const handleTrashClick = useCallback(() => {
    if (plateItems.length > 0) {
      onClearPlate();
      onPlaySound('plateClear');
      hapticFeedback('medium');

      const rect = trashRef.current?.getBoundingClientRect();
      const parentRect = canvasRef.current?.getBoundingClientRect();

      if (rect && parentRect) {
        onAddFloatingText(
          rect.left - parentRect.left + rect.width / 2,
          rect.top - parentRect.top - 20,
          '🗑 Cleared',
          '#757575'
        );
      }
    }
  }, [onClearPlate, onPlaySound, onAddFloatingText, plateItems.length]);

  // Handle customer click (serve)
  const handleCustomerClick = useCallback((customer: Customer, index: number) => {
    if (plateItems.length === 0) return;

    const result = onServeCustomer(customer.id);

    if (result.quality === 'wrong') {
      onPlaySound('error');
      hapticFeedback('error');
    } else {
      onPlaySound('success');
      hapticFeedback(result.quality === 'perfect' ? 'success' : 'medium');
      if (result.comboBonus > 0) {
        onPlaySound('success'); // Double sound for combo
      }
    }

    const pos = CUSTOMER_POSITIONS[index];
    onAddFloatingText(pos.x, pos.y - 50, result.message, result.color);
  }, [plateItems.length, onServeCustomer, onPlaySound, onAddFloatingText]);

  // Mouse/Touch tracking for drag effect
  const handleMove = useCallback(() => {
    if (!isTouching) return;
    // Track movement for potential drag effects
  }, [isTouching]);

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden font-sans select-none" style={{ background: THEME.bgLight }}>

      {/* Background Pattern - Original */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: THEME.bgCream,
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0) 70%),
            linear-gradient(${THEME.woodLight}15 1px, transparent 1px),
            linear-gradient(90deg, ${THEME.woodLight}15 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      />

      {/* Game World (Customers) - Original Logic */}
      <div
        ref={canvasRef}
        className="absolute inset-0 z-0"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        style={{ touchAction: 'none' }}
      >
        {/* Customers - Rendered at absolute positions from config */}
        {customers.map((customer, index) => {
          const pos = CUSTOMER_POSITIONS[index];
          const patienceRatio = customer.patience / customer.maxPatience;
          const patienceColor = getPatienceColor(patienceRatio);
          const isSpecial = customer.isSpecial;

          return (
            <div
              key={customer.id}
              onClick={() => handleCustomerClick(customer, index)}
              className="absolute cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-20"
              style={{
                left: pos.x - 30,
                top: pos.y,
                width: 60,
                height: 100,
              }}
            >
              {/* Special Customer Indicator */}
              {isSpecial && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce">
                  <div className="text-2xl drop-shadow-lg">✨</div>
                </div>
              )}

              {/* Order Bubbles - Original */}
              <div className={`absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 p-1.5 rounded-full shadow-sm backdrop-blur-sm border ${isSpecial ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300' : 'bg-white/90 border-orange-100'
                }`}>
                {customer.order.map((itemId, i) => {
                  const item = FOOD_ITEMS.find(f => f.id === itemId);
                  return item ? (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    >
                      {item.emoji}
                    </div>
                  ) : null;
                })}
              </div>

              {/* Customer Emoji - Original */}
              <div
                className="text-5xl text-center transition-transform duration-200 drop-shadow-md mt-2"
                style={{
                  filter: patienceRatio < 0.25 ? 'grayscale(0.5)' : 'none',
                  transform: `scale(${0.9 + (patienceRatio * 0.1)})`
                }}
              >
                {customer.type.emoji}
              </div>

              {/* Patience Bar - Original */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full overflow-hidden bg-gray-200/50"
              >
                <div
                  className="h-full transition-all duration-200"
                  style={{
                    width: `${patienceRatio * 100}%`,
                    background: patienceColor
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Floating Texts - Original / Simple */}
        {floatingTexts.map((text) => (
          <div
            key={text.id}
            className="absolute pointer-events-none animate-float-up font-bold text-lg z-50"
            style={{
              left: text.x,
              top: text.y,
              color: text.color,
              textShadow: '0 2px 4px rgba(255,255,255,0.8)',
              animation: 'float-up 1s ease-out forwards'
            }}
          >
            {text.text}
          </div>
        ))}

        {/* Particle Effects */}
        <ParticleEffects particles={particles} />
      </div>

      {/* Power-Ups Panel */}
      {onActivatePowerUp && (
        <PowerUpsPanel
          money={money}
          inventory={inventory}
          activePowerUps={activePowerUps}
          upgradeLevels={upgradeLevels}
          onActivate={onActivatePowerUp}
          onPlaySound={onPlaySound}
        />
      )}

      {/* --- HUD INTERFACE (NEW) --- */}
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-40 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-start justify-between pointer-events-auto">
          {/* Stats Container - floating glass card (NEW) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-0.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-1.5 pr-4 animate-in slide-in-from-top-4 duration-500">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                <DollarSign className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col px-2 leading-none">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cash</span>
                <span className="font-extrabold text-slate-700 text-lg">${money}</span>
              </div>
            </div>

            <div className="flex items-center gap-0.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-1.5 pr-4 animate-in slide-in-from-top-4 duration-500 delay-100">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                <Star className="w-5 h-5 fill-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col px-2 leading-none">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Score</span>
                <span className="font-extrabold text-slate-700 text-lg">{score}</span>
              </div>
            </div>
          </div>

          {/* Pause Button (NEW) */}
          <Button
            onClick={onPause}
            size="icon"
            className="rounded-2xl w-12 h-12 bg-white/80 backdrop-blur-md shadow-xl border border-white/60 hover:bg-orange-50 text-slate-700 hover:scale-105 active:scale-95 transition-all group"
          >
            <Pause className="w-6 h-6 fill-slate-700 group-hover:fill-orange-500 transition-colors" />
          </Button>
        </div>

        {/* Combo & Stamina - Centered just below header (NEW) */}
        <div className="flex flex-col items-center pointer-events-none mt-2 space-y-2">

          {/* Stamina Bar - Slim (NEW) */}
          <div className="w-48 bg-black/10 backdrop-blur-sm h-3 rounded-full overflow-hidden shadow-inner border border-white/20">
            <div
              className="h-full transition-all duration-300 rounded-full relative overflow-hidden"
              style={{
                width: `${staminaPercent}%`,
                background: staminaColor,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>

          {/* Combo Indicator */}
          <div className={`transition-all duration-300 h-8 flex items-center justify-center ${combo > 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-extrabold px-4 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-2 animate-bounce">
              <span className="text-xl">🔥</span>
              <span className="tracking-widest">{combo}x COMBO!</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM CONTROLS (NEW) --- */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center">

        {/* Prep Station (Floating Card) - New */}
        <div className="mb-2 relative">
          <div
            className="bg-white/95 backdrop-blur-xl p-3 pr-4 rounded-3xl shadow-2xl border border-white/60 flex items-center gap-4 transition-all duration-300"
            style={{
              boxShadow: plateItems.length > 0
                ? '0 20px 40px -5px rgba(255, 127, 80, 0.25)'
                : '0 10px 30px -5px rgba(0,0,0,0.1)'
            }}
          >
            {/* Plate Area */}
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full bg-slate-50 border-[6px] border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center relative overflow-hidden"
              >
                {plateItems.length === 0 ? (
                  <Utensils className="w-6 h-6 text-slate-300 opacity-50" />
                ) : (
                  <div className="flex flex-wrap justify-center items-center content-center w-full h-full p-2 scale-110">
                    {plateItems.map((itemId, i) => {
                      const item = FOOD_ITEMS.find(f => f.id === itemId);
                      return (
                        <div key={i} className="animate-bounce-in text-2xl leading-none filter drop-shadow-sm -mr-2 last:mr-0 hover:z-10 transition-all">
                          {item?.emoji}
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Separator */}
            <div className="h-10 w-px bg-slate-200" />

            {/* Trash Button */}
            <div className="flex flex-col items-center gap-1">
              <Button
                ref={trashRef}
                onClick={handleTrashClick}
                disabled={plateItems.length === 0}
                variant="ghost"
                size="icon"
                className={`w-14 h-14 rounded-2xl transition-all duration-200 border-2 ${plateItems.length > 0
                  ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/30'
                  : 'text-slate-300 bg-slate-50 border-transparent'
                  }`}
              >
                <Trash2 className="w-6 h-6" />
              </Button>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Clear</span>
            </div>
          </div>
        </div>

        {/* Ingredients Menu (Redesigned Bottom Sheet) - New */}
        <div
          className="w-full bg-white/95 backdrop-blur-2xl rounded-t-[3rem] shadow-[0_-10px_60px_-15px_rgba(0,0,0,0.15)] border-t border-white/60 p-6 pb-8 relative overflow-hidden"
        >
          {/* Glass glare effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />

          <div className="flex flex-col gap-5 max-w-md mx-auto">
            {/* Grab Handle */}
            <div className="flex items-center justify-center opacity-30">
              <div className="h-1.5 w-16 rounded-full bg-slate-400" />
            </div>

            {/* Ingredients Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-y-4 gap-x-3 justify-items-center">
              {FOOD_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => handleFoodClick(item.id, e)}
                  onTouchStart={(e) => {
                    setIsTouching(true);
                    handleFoodClick(item.id, e);
                  }}
                  onTouchEnd={() => setIsTouching(false)}
                  className="group relative flex flex-col items-center gap-2 w-full transition-transform active:scale-90"
                >
                  <div
                    className="w-[4.2rem] h-[4.2rem] rounded-2xl bg-white flex items-center justify-center text-4xl shadow-md border border-slate-100 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Colored background hint */}
                    <div className="absolute inset-0 opacity-10" style={{ background: item.color }} />

                    {/* Emoji */}
                    <span className="filter drop-shadow-sm z-10">{item.emoji}</span>

                    {/* Ring on Hover */}
                    <div className="absolute inset-0 border-2 rounded-2xl border-transparent group-hover:border-current opacity-20" style={{ color: item.color }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translateY(0) scale(0.8); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.2); }
        }
        .animate-bounce-in {
            animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes bounce-in {
            0% { opacity: 0; transform: scale(0.3); }
            100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div >
  );
}
