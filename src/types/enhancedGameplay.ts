/**
 * Enhanced Gameplay Types
 * Power-ups, achievements, and special features
 */

export type PowerUpType = 'speed_boost' | 'patience_freeze' | 'auto_serve' | 'double_tips' | 'stamina_boost';

export interface PowerUp {
    id: string;
    type: PowerUpType;
    name: string;
    description: string;
    emoji: string;
    duration: number; // milliseconds
    cost: number;
    color: string;
    active: boolean;
    activatedAt?: number;
}

export interface ActivePowerUp {
    type: PowerUpType;
    expiresAt: number;
}

export type AchievementId =
    | 'first_serve'
    | 'speed_demon'
    | 'perfect_streak'
    | 'big_spender'
    | 'combo_master'
    | 'stamina_warrior'
    | 'tip_collector'
    | 'customer_favorite';

export interface Achievement {
    id: AchievementId;
    name: string;
    description: string;
    emoji: string;
    unlocked: boolean;
    progress: number;
    target: number;
    reward: number; // money reward
}

export interface SpecialCustomer {
    id: string;
    name: string;
    emoji: string;
    description: string;
    orderMultiplier: number; // Order size multiplier
    tipMultiplier: number; // Tip multiplier
    patienceMultiplier: number; // Patience multiplier
    spawnChance: number; // 0-1 probability
    color: string;
}

export interface Upgrade {
    id: string;
    name: string;
    description: string;
    emoji: string;
    cost: number;
    level: number;
    maxLevel: number;
    effect: {
        type: 'stamina' | 'patience' | 'tips' | 'spawn_rate';
        value: number;
    };
}

export interface DailyChallenge {
    id: string;
    name: string;
    description: string;
    target: number;
    progress: number;
    reward: number;
    emoji: string;
    expiresAt: number;
}

export interface ParticleEffect {
    id: string;
    x: number;
    y: number;
    type: 'star' | 'coin' | 'heart' | 'sparkle';
    color: string;
    createdAt: number;
}
