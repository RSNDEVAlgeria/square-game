/**
 * Shop System Types
 * Upgrades and permanent improvements
 */

export type UpgradeType =
    | 'vip_spawn'
    | 'critic_spawn'
    | 'influencer_spawn'
    | 'max_stamina'
    | 'stamina_recovery'
    | 'base_tips'
    | 'customer_patience'
    | 'powerup_discount';

export interface ShopUpgrade {
    id: UpgradeType;
    name: string;
    description: string;
    emoji: string;
    category: 'special_customers' | 'gameplay' | 'economy';
    baseCost: number;
    costMultiplier: number; // Cost increases by this multiplier per level
    maxLevel: number;
    currentLevel: number;
    effect: {
        type: string;
        baseValue: number;
        valuePerLevel: number;
    };
    color: string;
}

export interface ShopState {
    totalMoneyEarned: number; // Lifetime earnings
    upgrades: Record<UpgradeType, number>; // Current level of each upgrade
}

export interface PowerUpPurchase {
    powerUpType: string;
    cost: number;
    quantity: number;
}
