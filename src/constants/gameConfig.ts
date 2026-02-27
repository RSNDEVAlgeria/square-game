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

  // Customer spawning (ms) - Harder difficulty
  CUSTOMER_SPAWN_INTERVAL_BASE: 3500,
  CUSTOMER_SPAWN_INTERVAL_MIN: 1200,  // Reduced from 1500 for harder gameplay
  MAX_CUSTOMERS: 5,

  // Patience (ms) - Harder difficulty
  CUSTOMER_PATIENCE_BASE: 18000,      // Reduced from 20000
  CUSTOMER_PATIENCE_MIN: 4000,        // Reduced from 6000 for harder gameplay
  DIFFICULTY_INCREASE_RATE: 0.95,     // Increased from 0.98 (5% decrease per customer instead of 2%)

  // Economy
  BASE_PAYMENT: 5,
  TIP_MULTIPLIER: 2,
  PERFECT_TIMING_BONUS: 5,         // Increased for better reward
  GOOD_TIMING_BONUS: 2,

  // Combo system (new enhancement)
  COMBO_TIMEOUT: 5000,             // 5 seconds to maintain combo
  COMBO_MULTIPLIER_BASE: 0.5,      // +0.5x per combo level

  // New Combo Bar System
  COMBO_BAR_MAX: 100,
  COMBO_BAR_GAIN_PER_SERVICE: 20,   // How much combo bar fills per serve
  COMBO_BAR_DECAY_RATE: 5,          // Combo bar decay per second
  RUSH_DURATION: 15000,             // 15 seconds rush mode
  RUSH_COOLDOWN: 20000,             // 20 seconds cooldown after rush
  RUSH_MONEY_MULTIPLIER: 4,          // 4x money during rush
  RUSH_CUSTOMER_SPAWN_INTERVAL: 800, // Fast spawn during rush

  // Order complexity
  MIN_ORDER_ITEMS: 1,
  MAX_ORDER_ITEMS: 3,
};

// ===== WAITER DEFINITIONS =====
export const WAITERS: Waiter[] = [
  {
    id: 0,
    name: 'Alex',
    emoji: '👨‍🦱',
    image: '/waiters/waiter-1.jpg',
    color: 'from-amber-600 to-amber-800',
    description: 'Fast & Energetic - Builds combo quickly but drains stamina faster',
    staminaMax: 1.0,        // Base stamina
    staminaDrain: 1.25,     // +25% stamina drain per action (needs quick breaks)
    tipBonus: 1.0,         // Base tips
    patienceMultiplier: 0.85,  // Customers less patient (-15%)
    comboBarGain: 1.35,    // +35% combo bar gain (rushes faster)
    specialAbility: 'Fast Hands'
  },
  {
    id: 1,
    name: 'Giovanni',
    emoji: '👨‍🦳',
    image: '/waiters/waiter-2.jpg',
    color: 'from-slate-600 to-slate-800',
    description: 'Veteran Server - Great tips & patience but slower combo building',
    staminaMax: 1.2,       // +20% max stamina
    staminaDrain: 0.75,    // -25% stamina drain (lasts longer)
    tipBonus: 1.3,         // +30% better tips
    patienceMultiplier: 1.2,  // Customers more patient (+20%)
    comboBarGain: 0.85,    // -15% combo bar gain
    specialAbility: 'Years of Experience'
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
// Moved to top (Y: 120) - Increased spacing to prevent overlap
export const CUSTOMER_POSITIONS: { x: number; y: number }[] = [
  { x: 42, y: 240 },
  { x: 126, y: 240 },
  { x: 210, y: 240 },
  { x: 294, y: 240 },
  { x: 378, y: 240 }
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


