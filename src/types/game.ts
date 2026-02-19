/**
 * Square Coffee - Game Types
 * Core type definitions for the café management game
 */

// ===== GAME SCENES =====
export type GameScene = 'main-menu' | 'waiter-selection' | 'tutorial' | 'gameplay' | 'game-over';

// ===== WAITER TYPES =====
export interface Waiter {
  id: number;
  name: string;
  emoji: string;
  image?: string;     // Optional image path for real photos
  color: string;
  speed: number;      // Movement/action speed multiplier
  stamina: number;    // Stamina multiplier
  tipBonus: number;   // Tip multiplier
  description: string;
  stats: {
    speedBonus: string;
    staminaBonus: string;
  };
}

// ===== FOOD ITEM TYPES =====
export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  category: 'drink' | 'food';
}

// ===== CUSTOMER TYPES =====
export interface CustomerType {
  emoji: string;
  speedMultiplier: number;
  name: string;
}

export interface Customer {
  id: string;
  type: CustomerType;
  order: string[];           // Array of food item IDs
  patience: number;          // Current patience in ms
  maxPatience: number;       // Maximum patience in ms
  position: number;          // Position in queue (0-4)
  isLeaving: boolean;
  arrivalTime: number;       // Timestamp when customer arrived
  isSpecial?: boolean;       // Is this a special customer?
  specialType?: string;      // Type of special customer (vip, critic, influencer)
  tipMultiplier?: number;    // Special tip multiplier
}

// ===== GAME STATE =====
export interface GameState {
  // Core game data
  currentScene: GameScene;
  selectedWaiter: Waiter | null;

  // Game progress
  score: number;
  money: number;
  customersServed: number;

  // Stamina system
  stamina: number;
  maxStamina: number;

  // Game flow
  isPaused: boolean;
  isGameOver: boolean;
  gameTime: number;          // Total game time in ms

  // Difficulty scaling
  difficulty: number;        // 1.0 = base difficulty
  customerPatienceBase: number;

  // Audio
  soundEnabled: boolean;

  // Combo system (enhancement)
  combo: number;
  comboTimer: number;
  lastServeTime: number;

  // New Combo Bar System
  comboBar: number;
  maxComboBar: number;
  isRushActive: boolean;
  rushTimer: number;
  rushDuration: number;
  rushCooldown: number;
  rushCooldownTimer: number;

  // Meta-progression (Shop)
  upgrades: Record<string, number>;
  totalMoneyEarned: number;
  inventory: Record<string, number>;
  achievements: Record<string, boolean>; // id -> unlocked
}

// ===== PLATE STATE =====
export interface PlateState {
  items: string[];           // Array of food item IDs on plate
}

// ===== FLOATING TEXT =====
export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  createdAt: number;
}

import type { PowerUpType } from './enhancedGameplay';

// ===== POWER-UP STATE =====
export interface ActivePowerUp {
  type: PowerUpType;
  expiresAt: number;
}


// ===== GAME CONFIGURATION =====
export interface GameConfig {
  // Canvas
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;

  // Game Balance
  INITIAL_STAMINA: number;
  STAMINA_DRAIN_PER_ACTION: number;
  STAMINA_RECOVERY_CORRECT: number;
  STAMINA_RECOVERY_WRONG: number;

  // Customer spawning
  CUSTOMER_SPAWN_INTERVAL_BASE: number;
  CUSTOMER_SPAWN_INTERVAL_MIN: number;
  MAX_CUSTOMERS: number;

  // Patience
  CUSTOMER_PATIENCE_BASE: number;
  CUSTOMER_PATIENCE_MIN: number;
  DIFFICULTY_INCREASE_RATE: number;

  // Economy
  BASE_PAYMENT: number;
  TIP_MULTIPLIER: number;
  PERFECT_TIMING_BONUS: number;
  GOOD_TIMING_BONUS: number;

  // Combo system (enhancement)
  COMBO_TIMEOUT: number;
  COMBO_MULTIPLIER_BASE: number;

  // New Combo Bar System
  COMBO_BAR_MAX: number;
  COMBO_BAR_GAIN_PER_SERVICE: number;
  COMBO_BAR_DECAY_RATE: number;
  RUSH_DURATION: number;
  RUSH_COOLDOWN: number;
  RUSH_MONEY_MULTIPLIER: number;
  RUSH_CUSTOMER_SPAWN_INTERVAL: number;

  // Order complexity
  MIN_ORDER_ITEMS: number;
  MAX_ORDER_ITEMS: number;
}

// ===== SERVICE QUALITY =====
export type ServiceQuality = 'perfect' | 'good' | 'average' | 'wrong';

export interface ServeResult {
  quality: ServiceQuality;
  payment: number;
  tip: number;
  comboBonus: number;
  message: string;
  color: string;
}

// ===== AUDIO SOUNDS =====
export type GameSound =
  | 'click'
  | 'success'
  | 'error'
  | 'customerArrive'
  | 'combo'
  | 'gameOver'
  | 'plateClear'
  | 'staminaLow'
  | 'powerup'
  | 'special'
  | 'achievement'
  | 'coin';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress: number;
  target: number;
  reward: number;
}
