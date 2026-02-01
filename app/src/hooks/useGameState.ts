/**
 * Square Coffee - Game State Hook
 * Centralized game state management using React hooks
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { 
  GameState, 
  GameScene, 
  Customer, 
  PlateState,
  FloatingText,
  ServeResult,
  ServiceQuality
} from '@/types/game';
import { 
  CONFIG, 
  WAITERS, 
  FOOD_ITEMS, 
  CUSTOMER_TYPES,
  SERVICE_THRESHOLDS 
} from '@/constants/gameConfig';

// Initial game state factory
const createInitialState = (): GameState => ({
  currentScene: 'main-menu',
  selectedWaiter: null,
  score: 0,
  money: 0,
  customersServed: 0,
  stamina: CONFIG.INITIAL_STAMINA,
  maxStamina: CONFIG.INITIAL_STAMINA,
  isPaused: false,
  isGameOver: false,
  gameTime: 0,
  difficulty: 1.0,
  customerPatienceBase: CONFIG.CUSTOMER_PATIENCE_BASE,
  soundEnabled: true,
  combo: 0,
  comboTimer: 0,
  lastServeTime: 0
});

export function useGameState() {
  // Core game state
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  
  // Plate state (separate for frequent updates)
  const [plate, setPlate] = useState<PlateState>({ items: [] });
  
  // Customers array
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  // Floating texts for visual feedback
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  
  // Game loop refs
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const nextSpawnTimeRef = useRef<number>(CONFIG.CUSTOMER_SPAWN_INTERVAL_BASE);

  // ===== SCENE MANAGEMENT =====
  const switchScene = useCallback((scene: GameScene) => {
    setGameState(prev => ({ ...prev, currentScene: scene }));
  }, []);

  const selectWaiter = useCallback((waiterId: number) => {
    const waiter = WAITERS.find(w => w.id === waiterId) || null;
    setGameState(prev => ({ 
      ...prev, 
      selectedWaiter: waiter,
      maxStamina: CONFIG.INITIAL_STAMINA * (waiter?.stamina || 1),
      stamina: CONFIG.INITIAL_STAMINA * (waiter?.stamina || 1)
    }));
  }, []);

  // ===== GAME CONTROL =====
  const startGame = useCallback(() => {
    const waiter = gameState.selectedWaiter;
    const maxStamina = CONFIG.INITIAL_STAMINA * (waiter?.stamina || 1);
    
    setGameState({
      ...createInitialState(),
      currentScene: 'gameplay',
      selectedWaiter: waiter,
      maxStamina,
      stamina: maxStamina,
      soundEnabled: gameState.soundEnabled
    });
    setPlate({ items: [] });
    setCustomers([]);
    setFloatingTexts([]);
    lastTimeRef.current = Date.now();
    nextSpawnTimeRef.current = CONFIG.CUSTOMER_SPAWN_INTERVAL_BASE;
  }, [gameState.selectedWaiter, gameState.soundEnabled]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
    lastTimeRef.current = Date.now();
  }, []);

  const gameOver = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      isGameOver: true, 
      isPaused: true,
      currentScene: 'game-over'
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialState());
    setPlate({ items: [] });
    setCustomers([]);
    setFloatingTexts([]);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  // ===== PLATE MANAGEMENT =====
  const addToPlate = useCallback((foodId: string) => {
    setPlate(prev => ({ items: [...prev.items, foodId] }));
    // Drain stamina for each action
    setGameState(prev => ({
      ...prev,
      stamina: Math.max(0, prev.stamina - CONFIG.STAMINA_DRAIN_PER_ACTION)
    }));
  }, []);

  const clearPlate = useCallback(() => {
    setPlate({ items: [] });
  }, []);

  // ===== CUSTOMER MANAGEMENT =====
  const spawnCustomer = useCallback(() => {
    if (customers.length >= CONFIG.MAX_CUSTOMERS) return;

    const customerType = CUSTOMER_TYPES[Math.floor(Math.random() * CUSTOMER_TYPES.length)];
    
    // Generate random order (1-3 items)
    const orderSize = Math.floor(Math.random() * CONFIG.MAX_ORDER_ITEMS) + CONFIG.MIN_ORDER_ITEMS;
    const order: string[] = [];
    for (let i = 0; i < orderSize; i++) {
      const randomItem = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
      order.push(randomItem.id);
    }

    // Calculate patience based on difficulty
    const patienceBase = Math.max(
      CONFIG.CUSTOMER_PATIENCE_MIN,
      gameState.customerPatienceBase * Math.pow(CONFIG.DIFFICULTY_INCREASE_RATE, gameState.customersServed)
    );
    const patience = patienceBase / customerType.speedMultiplier;

    const newCustomer: Customer = {
      id: `customer-${Date.now()}-${Math.random()}`,
      type: customerType,
      order,
      patience,
      maxPatience: patience,
      position: customers.length,
      isLeaving: false,
      arrivalTime: Date.now()
    };

    setCustomers(prev => [...prev, newCustomer]);
  }, [customers.length, gameState.customerPatienceBase, gameState.customersServed]);

  const removeCustomer = useCallback((customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  }, []);

  const updateCustomerPatience = useCallback((deltaTime: number) => {
    setCustomers(prev => 
      prev.map(customer => {
        if (customer.isLeaving) return customer;
        const newPatience = customer.patience - deltaTime;
        if (newPatience <= 0) {
          return { ...customer, patience: 0, isLeaving: true };
        }
        return { ...customer, patience: newPatience };
      }).filter(customer => customer.patience > 0)
    );
  }, []);

  // ===== SERVING LOGIC =====
  const checkOrder = useCallback((plateItems: string[], customerOrder: string[]): boolean => {
    if (plateItems.length !== customerOrder.length) return false;
    const sortedPlate = [...plateItems].sort();
    const sortedOrder = [...customerOrder].sort();
    return sortedPlate.every((item, i) => item === sortedOrder[i]);
  }, []);

  const serveCustomer = useCallback((customerId: string): ServeResult => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
      return { 
        quality: 'wrong', 
        payment: 0, 
        tip: 0, 
        comboBonus: 0,
        message: 'Customer not found!', 
        color: '#F44336' 
      };
    }

    const isCorrect = checkOrder(plate.items, customer.order);
    
    if (!isCorrect) {
      // Wrong order - penalty
      setGameState(prev => ({
        ...prev,
        stamina: Math.max(0, prev.stamina + CONFIG.STAMINA_RECOVERY_WRONG),
        combo: 0
      }));
      return { 
        quality: 'wrong', 
        payment: 0, 
        tip: 0, 
        comboBonus: 0,
        message: 'Wrong Order!', 
        color: '#F44336' 
      };
    }

    // Correct order - calculate rewards
    const patienceRatio = customer.patience / customer.maxPatience;
    const waiter = gameState.selectedWaiter;
    let quality: ServiceQuality = 'average';
    const payment = CONFIG.BASE_PAYMENT;
    let tip = 0;
    let message = '✓';
    let color = '#98D8C8';

    if (patienceRatio > SERVICE_THRESHOLDS.perfect) {
      quality = 'perfect';
      tip = Math.floor(CONFIG.PERFECT_TIMING_BONUS * (waiter?.tipBonus || 1));
      message = '⭐ Perfect!';
      color = '#FFD700';
    } else if (patienceRatio > SERVICE_THRESHOLDS.good) {
      quality = 'good';
      tip = Math.floor(CONFIG.GOOD_TIMING_BONUS * (waiter?.tipBonus || 1));
      message = '✓ Good';
      color = '#4CAF50';
    }

    // Combo system
    const now = Date.now();
    let newCombo = gameState.combo;
    let comboBonus = 0;
    
    if (now - gameState.lastServeTime < CONFIG.COMBO_TIMEOUT) {
      newCombo = gameState.combo + 1;
      comboBonus = Math.floor(newCombo * CONFIG.COMBO_MULTIPLIER_BASE);
    } else {
      newCombo = 1;
    }

    const totalPayment = payment + tip + comboBonus;
    const scoreGain = totalPayment * 10;

    // Update game state
    setGameState(prev => ({
      ...prev,
      score: prev.score + scoreGain,
      money: prev.money + totalPayment,
      customersServed: prev.customersServed + 1,
      stamina: Math.min(prev.maxStamina, prev.stamina + CONFIG.STAMINA_RECOVERY_CORRECT),
      combo: newCombo,
      lastServeTime: now,
      comboTimer: CONFIG.COMBO_TIMEOUT,
      // Increase difficulty slightly
      difficulty: prev.difficulty * 1.02
    }));

    // Remove customer and clear plate
    removeCustomer(customerId);
    clearPlate();

    return { 
      quality, 
      payment, 
      tip, 
      comboBonus,
      message: comboBonus > 0 ? `${message} +${comboBonus} Combo!` : message, 
      color 
    };
  }, [customers, plate.items, checkOrder, gameState.selectedWaiter, gameState.combo, gameState.lastServeTime, removeCustomer, clearPlate]);

  // ===== FLOATING TEXT =====
  const addFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    const newText: FloatingText = {
      id: `text-${Date.now()}-${Math.random()}`,
      x,
      y,
      text,
      color,
      createdAt: Date.now()
    };
    setFloatingTexts(prev => [...prev, newText]);
    
    // Auto-remove after animation
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
    }, 1000);
  }, []);

  // ===== SOUND SETTINGS =====
  const toggleSound = useCallback(() => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  // ===== GAME LOOP =====
  useEffect(() => {
    if (gameState.currentScene !== 'gameplay' || gameState.isPaused || gameState.isGameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Update game time
      setGameState(prev => ({ ...prev, gameTime: prev.gameTime + deltaTime }));

      // Update combo timer
      if (gameState.combo > 0) {
        const timeSinceLastServe = now - gameState.lastServeTime;
        if (timeSinceLastServe > CONFIG.COMBO_TIMEOUT) {
          setGameState(prev => ({ ...prev, combo: 0 }));
        }
      }

      // Spawn customers
      nextSpawnTimeRef.current -= deltaTime;
      if (nextSpawnTimeRef.current <= 0 && customers.length < CONFIG.MAX_CUSTOMERS) {
        spawnCustomer();
        // Calculate next spawn time based on difficulty
        const spawnInterval = Math.max(
          CONFIG.CUSTOMER_SPAWN_INTERVAL_MIN,
          CONFIG.CUSTOMER_SPAWN_INTERVAL_BASE / gameState.difficulty
        );
        nextSpawnTimeRef.current = spawnInterval;
      }

      // Update customer patience
      updateCustomerPatience(deltaTime);

      // Check game over (stamina depleted)
      if (gameState.stamina <= 0) {
        gameOver();
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [
    gameState.currentScene, 
    gameState.isPaused, 
    gameState.isGameOver,
    gameState.stamina,
    gameState.combo,
    gameState.lastServeTime,
    gameState.difficulty,
    customers.length,
    spawnCustomer,
    updateCustomerPatience,
    gameOver
  ]);

  return {
    // State
    gameState,
    plate,
    customers,
    floatingTexts,
    
    // Scene management
    switchScene,
    selectWaiter,
    
    // Game control
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    resetGame,
    
    // Plate management
    addToPlate,
    clearPlate,
    
    // Customer management
    serveCustomer,
    
    // Visual feedback
    addFloatingText,
    
    // Settings
    toggleSound
  };
}
