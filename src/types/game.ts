/**
 * Square Coffee - Game Types
 * Core type definitions for the café management game
 */

// ===== GAME SCENES =====
export type GameScene = 'main-menu' | 'waiter-selection' | 'gameplay' | 'game-over';

// ===== WAITER TYPES =====
export interface Waiter {
  id: number;
  name: string;
  emoji: string;
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
  | 'staminaLow';
