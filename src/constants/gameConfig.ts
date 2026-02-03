/**
 * Square Coffee - Game Configuration
 * Centralized game constants and configuration
 */

import type { GameConfig, Waiter, FoodItem, CustomerType } from '@/types/game';

// ===== GAME CONFIGURATION =====
export const CONFIG: GameConfig = {
  // Canvas dimensions (9:16 portrait)
  CANVAS_WIDTH: 420,
  CANVAS_HEIGHT: 600,

  // Game Balance
  INITIAL_STAMINA: 100,
  STAMINA_DRAIN_PER_ACTION: 5,
  STAMINA_RECOVERY_CORRECT: 8,     // Increased from original for better feel
  STAMINA_RECOVERY_WRONG: -10,     // Penalty for wrong orders

  // Customer spawning (ms)
  CUSTOMER_SPAWN_INTERVAL_BASE: 3500,
  CUSTOMER_SPAWN_INTERVAL_MIN: 1500,
  MAX_CUSTOMERS: 5,

  // Patience (ms)
  CUSTOMER_PATIENCE_BASE: 20000,
  CUSTOMER_PATIENCE_MIN: 6000,
  DIFFICULTY_INCREASE_RATE: 0.98,  // 2% decrease per customer

  // Economy
  BASE_PAYMENT: 5,
  TIP_MULTIPLIER: 2,
  PERFECT_TIMING_BONUS: 5,         // Increased for better reward
  GOOD_TIMING_BONUS: 2,

  // Combo system (new enhancement)
  COMBO_TIMEOUT: 5000,             // 5 seconds to maintain combo
  COMBO_MULTIPLIER_BASE: 0.5,      // +0.5x per combo level

  // Order complexity
  MIN_ORDER_ITEMS: 1,
  MAX_ORDER_ITEMS: 3,
};

// ===== WAITER DEFINITIONS =====
export const WAITERS: Waiter[] = [
  {
    id: 0,
    name: 'Alex',
    emoji: '👦',
    color: 'from-blue-400 to-blue-600',
    speed: 1.2,
    stamina: 0.9,
    tipBonus: 1.0,
    description: 'Speed specialist with quick reflexes',
    stats: {
      speedBonus: '+20%',
      staminaBonus: '-10%'
    }
  },
  {
    id: 1,
    name: 'Emma',
    emoji: '👧',
    color: 'from-emerald-400 to-emerald-600',
    speed: 1.0,
    stamina: 1.0,
    tipBonus: 1.15,  // Slightly improved
    description: 'Balanced all-rounder with charm',
    stats: {
      speedBonus: 'Balanced',
      staminaBonus: '+15%'
    }
  },
  {
    id: 2,
    name: 'Marcus',
    emoji: '👨‍🦳',
    color: 'from-red-400 to-red-600',
    speed: 0.85,
    stamina: 1.0,
    tipBonus: 1.35,  // Improved for better balance
    description: 'Experienced veteran with high tips',
    stats: {
      speedBonus: '-15%',
      staminaBonus: 'Exp +30%'
    }
  },
  {
    id: 3,
    name: 'Sophia',
    emoji: '👩',
    color: 'from-violet-400 to-violet-600',
    speed: 1.0,
    stamina: 1.25,
    tipBonus: 0.95,
    description: 'Endurance expert for long sessions',
    stats: {
      speedBonus: 'Balanced',
      staminaBonus: '+25%'
    }
  },
  {
    id: 4,
    name: 'Leo',
    emoji: '🧒',
    color: 'from-amber-400 to-amber-600',
    speed: 1.05,  // Slight speed boost
    stamina: 0.8,
    tipBonus: 1.45,  // High risk, high reward
    description: 'Lucky charm with unpredictable bonuses',
    stats: {
      speedBonus: '+5%',
      staminaBonus: '-20%'
    }
  }
];

// ===== FOOD ITEMS =====
export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'coffee',
    name: 'Coffee',
    emoji: '☕',
    color: '#6F4E37',
    category: 'drink'
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    emoji: '🧋',
    color: '#A67C52',
    category: 'drink'
  },
  {
    id: 'juice',
    name: 'Juice',
    emoji: '🧃',
    color: '#FF9800',
    category: 'drink'
  },
  {
    id: 'tea',
    name: 'Tea',
    emoji: '🍵',
    color: '#8BC34A',
    category: 'drink'
  },
  {
    id: 'croissant',
    name: 'Croissant',
    emoji: '🥐',
    color: '#FFD700',
    category: 'food'
  },
  {
    id: 'cake',
    name: 'Cake',
    emoji: '🍰',
    color: '#FF69B4',
    category: 'food'
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    emoji: '🥪',
    color: '#8B4513',
    category: 'food'
  },
  {
    id: 'cookie',
    name: 'Cookie',
    emoji: '🍪',
    color: '#D2691E',
    category: 'food'
  },
  {
    id: 'donut',
    name: 'Donut',
    emoji: '🍩',
    color: '#E91E63',
    category: 'food'
  }
];

// ===== CUSTOMER TYPES =====
export const CUSTOMER_TYPES: CustomerType[] = [
  {
    emoji: '👨‍💼',
    speedMultiplier: 1.0,
    name: 'Business'
  },
  {
    emoji: '👩‍🎓',
    speedMultiplier: 1.15,
    name: 'Student'
  },
  {
    emoji: '👴',
    speedMultiplier: 0.8,
    name: 'Elderly'
  },
  {
    emoji: '👩‍👧',
    speedMultiplier: 0.9,
    name: 'Parent'
  },
  {
    emoji: '🧑',
    speedMultiplier: 1.0,
    name: 'Casual'
  },
  {
    emoji: '👩‍🦰',
    speedMultiplier: 1.05,
    name: 'Regular'
  }
];

// ===== POSITIONS FOR FOOD ITEMS (relative to canvas) =====
// Moved to bottom (Y: 420-580 range)
export const FOOD_POSITIONS: Record<string, { x: number; y: number }> = {
  // Row 1
  coffee: { x: 70, y: 420 },
  cappuccino: { x: 160, y: 420 },
  juice: { x: 250, y: 420 },
  // Row 2
  tea: { x: 70, y: 500 },
  croissant: { x: 160, y: 500 },
  cake: { x: 250, y: 500 },
  // Row 3
  sandwich: { x: 70, y: 580 },
  cookie: { x: 160, y: 580 },
  donut: { x: 250, y: 580 }
};

// ===== CUSTOMER POSITIONS (5 slots in front of counter) =====
// Moved to top (Y: 120)
export const CUSTOMER_POSITIONS: { x: number; y: number }[] = [
  { x: 60, y: 240 },
  { x: 130, y: 240 },
  { x: 200, y: 240 },
  { x: 270, y: 240 },
  { x: 340, y: 240 }
];

// ===== COUNTER ELEMENTS POSITIONS =====
export const COUNTER_POSITIONS = {
  plate: { x: 80, y: 300 },
  cashRegister: { x: 170, y: 300 },
  trashBin: { x: 320, y: 300 }
};

// ===== COLOR THEME =====
export const THEME = {
  // Backgrounds
  bgCream: '#FFF8F0',
  bgLight: '#FFFBF5',

  // Wood tones
  woodDark: '#8B5A3C',
  woodMedium: '#A67C52',
  woodLight: '#C4A57B',

  // Coffee tones
  coffeeBrown: '#6F4E37',
  espresso: '#3E2723',
  cream: '#F5E6D3',

  // Accents
  mint: '#98D8C8',
  mintDark: '#7BC8B8',
  coral: '#FF7F66',
  gold: '#FFD700',

  // Functional
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',


  // Text
  textDark: '#2C1810',
  textMedium: '#5D4037',
  textLight: '#8D6E63'
};

// ===== ANIMATION DURATIONS =====
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  feedback: 1000
};

// ===== SERVICE QUALITY THRESHOLDS =====
export const SERVICE_THRESHOLDS = {
  perfect: 0.7,  // >70% patience remaining
  good: 0.4,     // >40% patience remaining
  average: 0     // Anything else (but correct)
};

// ===== POWER-UPS =====
export const POWER_UPS = [
  {
    id: 'speed_boost',
    type: 'speed_boost' as const,
    name: 'Speed Boost',
    description: 'Customers wait 50% longer',
    emoji: '⚡',
    duration: 15000, // 15 seconds
    cost: 150,
    color: '#FFD700',
    active: false
  },
  {
    id: 'patience_freeze',
    type: 'patience_freeze' as const,
    name: 'Patience Freeze',
    description: 'Freeze all customer patience',
    emoji: '❄️',
    duration: 10000, // 10 seconds
    cost: 250,
    color: '#4FC3F7',
    active: false
  },
  {
    id: 'double_tips',
    type: 'double_tips' as const,
    name: 'Double Tips',
    description: 'Earn 2x tips for 20 seconds',
    emoji: '💰',
    duration: 20000, // 20 seconds
    cost: 200,
    color: '#4CAF50',
    active: false
  },
  {
    id: 'stamina_boost',
    type: 'stamina_boost' as const,
    name: 'Stamina Boost',
    description: 'Restore 50% stamina instantly',
    emoji: '💪',
    duration: 0, // Instant effect
    cost: 120,
    color: '#FF5722',
    active: false
  }
];

// ===== SPECIAL CUSTOMERS =====
export const SPECIAL_CUSTOMERS = [
  {
    id: 'vip',
    name: 'VIP Customer',
    emoji: '👑',
    description: 'Pays triple tips!',
    orderMultiplier: 1.5,
    tipMultiplier: 3.0,
    patienceMultiplier: 1.2,
    spawnChance: 0.05, // 5% chance
    color: '#FFD700'
  },
  {
    id: 'critic',
    name: 'Food Critic',
    emoji: '🎩',
    description: 'Huge bonus for perfect service!',
    orderMultiplier: 2.0,
    tipMultiplier: 5.0,
    patienceMultiplier: 0.7,
    spawnChance: 0.03, // 3% chance
    color: '#9C27B0'
  },
  {
    id: 'influencer',
    name: 'Influencer',
    emoji: '📱',
    description: 'Brings more customers!',
    orderMultiplier: 1.0,
    tipMultiplier: 2.0,
    patienceMultiplier: 0.9,
    spawnChance: 0.08, // 8% chance
    color: '#E91E63'
  }
];

// ===== ACHIEVEMENTS =====
export const ACHIEVEMENTS = [
  {
    id: 'first_serve' as const,
    name: 'First Steps',
    description: 'Serve your first customer',
    emoji: '🎯',
    unlocked: false,
    progress: 0,
    target: 1,
    reward: 20
  },
  {
    id: 'speed_demon' as const,
    name: 'Speed Demon',
    description: 'Serve 10 customers in under 2 minutes',
    emoji: '⚡',
    unlocked: false,
    progress: 0,
    target: 10,
    reward: 100
  },
  {
    id: 'perfect_streak' as const,
    name: 'Perfect Streak',
    description: 'Get 5 perfect serves in a row',
    emoji: '⭐',
    unlocked: false,
    progress: 0,
    target: 5,
    reward: 150
  },
  {
    id: 'combo_master' as const,
    name: 'Combo Master',
    description: 'Reach a 10x combo',
    emoji: '🔥',
    unlocked: false,
    progress: 0,
    target: 10,
    reward: 200
  },
  {
    id: 'big_spender' as const,
    name: 'Big Spender',
    description: 'Earn $500 in a single game',
    emoji: '💎',
    unlocked: false,
    progress: 0,
    target: 500,
    reward: 250
  }
];

// ===== SHOP UPGRADES =====
export const SHOP_UPGRADES = [
  {
    id: 'vip_spawn' as const,
    name: 'VIP Magnet',
    description: 'Increase VIP customer spawn chance',
    emoji: '👑',
    category: 'special_customers' as const,
    baseCost: 500,
    costMultiplier: 1.6,
    maxLevel: 10,
    currentLevel: 0,
    effect: {
      type: 'spawn_chance',
      baseValue: 0.05, // 5% base
      valuePerLevel: 0.02 // +2% per level
    },
    color: '#FFD700'
  },
  {
    id: 'critic_spawn' as const,
    name: 'Critic Appeal',
    description: 'Increase Food Critic spawn chance',
    emoji: '🎩',
    category: 'special_customers' as const,
    baseCost: 750,
    costMultiplier: 1.7,
    maxLevel: 10,
    currentLevel: 0,
    effect: {
      type: 'spawn_chance',
      baseValue: 0.03, // 3% base
      valuePerLevel: 0.015 // +1.5% per level
    },
    color: '#9C27B0'
  },
  {
    id: 'influencer_spawn' as const,
    name: 'Social Boost',
    description: 'Increase Influencer spawn chance',
    emoji: '📱',
    category: 'special_customers' as const,
    baseCost: 400,
    costMultiplier: 1.5,
    maxLevel: 10,
    currentLevel: 0,
    effect: {
      type: 'spawn_chance',
      baseValue: 0.08, // 8% base
      valuePerLevel: 0.03 // +3% per level
    },
    color: '#E91E63'
  },
  {
    id: 'max_stamina' as const,
    name: 'Endurance Training',
    description: 'Increase maximum stamina',
    emoji: '💪',
    category: 'gameplay' as const,
    baseCost: 600,
    costMultiplier: 1.6,
    maxLevel: 15,
    currentLevel: 0,
    effect: {
      type: 'max_stamina',
      baseValue: 100,
      valuePerLevel: 10 // +10 stamina per level
    },
    color: '#FF5722'
  },
  {
    id: 'stamina_recovery' as const,
    name: 'Quick Recovery',
    description: 'Recover more stamina per correct serve',
    emoji: '⚡',
    category: 'gameplay' as const,
    baseCost: 500,
    costMultiplier: 1.6,
    maxLevel: 10,
    currentLevel: 0,
    effect: {
      type: 'stamina_recovery',
      baseValue: 8,
      valuePerLevel: 2 // +2 recovery per level
    },
    color: '#FFC107'
  },
  {
    id: 'base_tips' as const,
    name: 'Charm School',
    description: 'Increase base tip amounts',
    emoji: '💰',
    category: 'economy' as const,
    baseCost: 1000,
    costMultiplier: 1.8,
    maxLevel: 10,
    currentLevel: 0,
    effect: {
      type: 'tip_multiplier',
      baseValue: 1.0,
      valuePerLevel: 0.1 // +10% tips per level
    },
    color: '#4CAF50'
  },
  {
    id: 'customer_patience' as const,
    name: 'Patience Plus',
    description: 'Customers wait longer before leaving',
    emoji: '⏰',
    category: 'gameplay' as const,
    baseCost: 650,
    costMultiplier: 1.6,
    maxLevel: 10,
    currentLevel: 0,
    effect: {
      type: 'patience_multiplier',
      baseValue: 1.0,
      valuePerLevel: 0.08 // +8% patience per level
    },
    color: '#2196F3'
  },
  {
    id: 'powerup_discount' as const,
    name: 'Power Saver',
    description: 'Reduce power-up costs',
    emoji: '🏷️',
    category: 'economy' as const,
    baseCost: 1500,
    costMultiplier: 2.0,
    maxLevel: 5,
    currentLevel: 0,
    effect: {
      type: 'powerup_discount',
      baseValue: 0,
      valuePerLevel: 0.1 // -10% cost per level
    },
    color: '#FF9800'
  }
];


