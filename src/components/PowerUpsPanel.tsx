/**
 * Power-Ups Panel Component
 * Shows available power-ups and allows activation
 */

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { POWER_UPS } from '@/constants/gameConfig';
import type { PowerUp, ActivePowerUp } from '@/types/enhancedGameplay';

interface PowerUpsPanelProps {
    money: number;
    inventory: Record<string, number>;
    activePowerUps: ActivePowerUp[];
    onActivate: (powerUpType: string) => void;
    onPlaySound: (sound: 'click' | 'success' | 'error') => void;
}

export function PowerUpsPanel({ money, inventory, activePowerUps, onActivate, onPlaySound }: PowerUpsPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isPowerUpActive = (type: string) => {
        return activePowerUps.some(p => p.type === type);
    };

    const hasInventory = (type: string) => (inventory[type] || 0) > 0;
    const canAfford = (cost: number) => money >= cost;

    const handleActivate = (powerUp: PowerUp) => {
        if (!hasInventory(powerUp.type) && !canAfford(powerUp.cost)) {
            onPlaySound('error');
            return;
        }

        if (isPowerUpActive(powerUp.type)) {
            onPlaySound('error');
            return;
        }
        onPlaySound('success');
        onActivate(powerUp.type);
        setIsExpanded(false);
    };

    const getTimeRemaining = (type: string): number => {
        const active = activePowerUps.find(p => p.type === type);
        if (!active) return 0;
        return Math.max(0, active.expiresAt - Date.now());
    };

    return (
        <div className="fixed right-2 top-20 z-50">
            {/* Toggle Button */}
            <Button
                onClick={() => setIsExpanded(!isExpanded)}
                size="icon"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-xl border-2 border-white/60 transition-all hover:scale-105 active:scale-95"
            >
                <Zap className="w-6 h-6 fill-white" />
            </Button>

            {/* Power-Ups Menu */}
            {isExpanded && (
                <div className="absolute right-0 top-14 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-4 w-64 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Power-Ups</h3>
                        <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            ${money}
                        </div>
                    </div>

                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {POWER_UPS.map((powerUp) => {
                            const isActive = isPowerUpActive(powerUp.type);
                            const hasOwned = hasInventory(powerUp.type);
                            const affordable = canAfford(powerUp.cost) || hasOwned;
                            const count = inventory[powerUp.type] || 0;
                            const timeLeft = getTimeRemaining(powerUp.type);

                            return (
                                <button
                                    key={powerUp.id}
                                    onClick={() => handleActivate(powerUp)}
                                    disabled={isActive || !affordable}
                                    className={`w-full p-3 rounded-2xl border-2 transition-all text-left relative ${isActive
                                        ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300 cursor-not-allowed'
                                        : affordable
                                            ? 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                                            : 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    {count > 0 && (
                                        <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md z-10">
                                            {count}
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                                            style={{ background: powerUp.color + '20' }}
                                        >
                                            {powerUp.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="font-bold text-slate-700 text-sm">{powerUp.name}</h4>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${hasOwned ? 'bg-purple-100 text-purple-700' : affordable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {hasOwned ? 'Owned' : `$${powerUp.cost}`}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-500 mt-0.5">{powerUp.description}</p>
                                            {isActive && timeLeft > 0 && (
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-green-600 font-semibold">Active</span>
                                                        <span className="text-slate-600">{Math.ceil(timeLeft / 1000)}s</span>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000"
                                                            style={{
                                                                width: `${(timeLeft / powerUp.duration) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Active Power-Ups Indicators */}
            {activePowerUps.length > 0 && !isExpanded && (
                <div className="absolute right-0 top-14 space-y-1">
                    {activePowerUps.map((active) => {
                        const powerUp = POWER_UPS.find(p => p.type === active.type);
                        if (!powerUp) return null;
                        const timeLeft = Math.max(0, active.expiresAt - Date.now());

                        return (
                            <div
                                key={active.type}
                                className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/60 px-3 py-2 flex items-center gap-2 animate-in slide-in-from-right-2"
                            >
                                <span className="text-xl">{powerUp.emoji}</span>
                                <span className="text-xs font-bold text-slate-600">
                                    {Math.ceil(timeLeft / 1000)}s
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
