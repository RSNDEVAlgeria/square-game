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
  ServiceQuality,
  ActivePowerUp
} from '@/types/game';
import {
  CONFIG,
  WAITERS,
  FOOD_ITEMS,
  CUSTOMER_TYPES,
  SERVICE_THRESHOLDS,
  SHOP_UPGRADES,
  POWER_UPS,
  ACHIEVEMENTS
} from '@/constants/gameConfig';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Initial game state factory
const createInitialState = (): GameState => {
  // Load persistent data
  const savedUpgrades = localStorage.getItem('square_coffee_upgrades');
  const savedTotalMoney = localStorage.getItem('square_coffee_total_money');
  const savedPermanentMoney = localStorage.getItem('square_coffee_money');
  const savedInventory = localStorage.getItem('square_coffee_inventory');
  const savedAchievements = localStorage.getItem('square_coffee_achievements');


  return {
    currentScene: 'main-menu',
    selectedWaiter: null,
    score: 0,
    money: savedPermanentMoney ? parseInt(savedPermanentMoney) : 0,
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
    lastServeTime: 0,
    comboBar: 0,
    maxComboBar: CONFIG.COMBO_BAR_MAX,
    isRushActive: false,
    rushTimer: 0,
    rushDuration: CONFIG.RUSH_DURATION,
    rushCooldown: CONFIG.RUSH_COOLDOWN,
    rushCooldownTimer: 0,
    upgrades: savedUpgrades ? JSON.parse(savedUpgrades) : {},
    totalMoneyEarned: savedTotalMoney ? parseInt(savedTotalMoney) : 0,
    inventory: savedInventory ? JSON.parse(savedInventory) : {},
    achievements: savedAchievements ? JSON.parse(savedAchievements) : {}
  };
};

export function useGameState() {
  const { t } = useTranslation();
  // Core game state
  const [gameState, setGameState] = useState<GameState>(createInitialState());

  // Persistence effect
  useEffect(() => {
    localStorage.setItem('square_coffee_upgrades', JSON.stringify(gameState.upgrades));
    localStorage.setItem('square_coffee_total_money', gameState.totalMoneyEarned.toString());
    localStorage.setItem('square_coffee_money', gameState.money.toString());
    localStorage.setItem('square_coffee_inventory', JSON.stringify(gameState.inventory));
    localStorage.setItem('square_coffee_achievements', JSON.stringify(gameState.achievements));
  }, [gameState.upgrades, gameState.totalMoneyEarned, gameState.money, gameState.inventory, gameState.achievements]);

  // Update refs for game loop
  useEffect(() => {
    isRushActiveRef.current = gameState.isRushActive;
  }, [gameState.isRushActive]);

  // Plate state
  const [plate, setPlate] = useState<PlateState>({ items: [] });

  // Customers array
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Floating texts
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Active power-ups
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);

  // Game loop refs
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const nextSpawnTimeRef = useRef<number>(CONFIG.CUSTOMER_SPAWN_INTERVAL_BASE);
  
  // Refs for game loop to access current state
  const isRushActiveRef = useRef<boolean>(false);

  // ===== SCENE MANAGEMENT =====
  const switchScene = useCallback((scene: GameScene) => {
    setGameState(prev => ({ ...prev, currentScene: scene }));
  }, []);

  const selectWaiter = useCallback((waiterId: number) => {
    const waiter = WAITERS.find(w => w.id === waiterId) || null;

    // Apply waiter stamina max bonus + shop upgrades
    const staminaLevel = gameState.upgrades['max_stamina'] || 0;
    const staminaUpgrade = SHOP_UPGRADES?.find(u => u.id === 'max_stamina');
    const additionalStamina = (staminaUpgrade?.effect.valuePerLevel || 0) * staminaLevel;

    const maxStamina = (CONFIG.INITIAL_STAMINA * (waiter?.staminaMax || 1)) + additionalStamina;

    setGameState(prev => ({
      ...prev,
      selectedWaiter: waiter,
      maxStamina,
      stamina: maxStamina
    }));
  }, [gameState.upgrades]);

  // Keep track of session-specific achievement progress
  const perfectStreakRef = useRef(0);
  const gameStartTimeRef = useRef(Date.now());

  const unlockAchievement = useCallback((achievementId: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement || gameState.achievements[achievementId]) return;

    setGameState(prev => ({
      ...prev,
      money: prev.money + achievement.reward,
      achievements: {
        ...prev.achievements,
        [achievementId]: true
      }
    }));

    toast.success(`Achievement Unlocked: ${achievement.name}`, {
      description: `${achievement.description} +$${achievement.reward}`,
      icon: achievement.emoji,
      duration: 5000,
    });
  }, [gameState.achievements]);


  // ===== GAME CONTROL =====
  const startGame = useCallback(() => {
    const waiter = gameState.selectedWaiter;

    // Apply waiter stamina max bonus + shop upgrades
    const staminaLevel = gameState.upgrades['max_stamina'] || 0;
    const staminaUpgrade = SHOP_UPGRADES?.find(u => u.id === 'max_stamina');
    const additionalStamina = (staminaUpgrade?.effect.valuePerLevel || 0) * staminaLevel;

    const maxStamina = (CONFIG.INITIAL_STAMINA * (waiter?.staminaMax || 1)) + additionalStamina;

    setGameState(prev => ({
      ...createInitialState(),
      currentScene: 'gameplay',
      selectedWaiter: waiter,
      maxStamina,
      stamina: maxStamina,
      soundEnabled: prev.soundEnabled,
      upgrades: prev.upgrades,
      money: prev.money,
      totalMoneyEarned: prev.totalMoneyEarned,
      inventory: prev.inventory,
      achievements: prev.achievements
    }));
    setPlate({ items: [] });
    setCustomers([]);
    setFloatingTexts([]);
    setActivePowerUps([]);
    perfectStreakRef.current = 0;
    gameStartTimeRef.current = Date.now();
    lastTimeRef.current = Date.now();
    nextSpawnTimeRef.current = CONFIG.CUSTOMER_SPAWN_INTERVAL_BASE;
  }, [gameState.selectedWaiter, gameState.soundEnabled, gameState.upgrades, gameState.money, gameState.totalMoneyEarned, gameState.inventory, gameState.achievements]);

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
    setActivePowerUps([]);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  // ===== SHOP ACTIONS =====
  const purchaseUpgrade = useCallback((upgradeId: string) => {
    const upgrade = SHOP_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    const currentLevel = gameState.upgrades[upgradeId] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));

    if (gameState.money >= cost && currentLevel < upgrade.maxLevel) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - cost,
        upgrades: {
          ...prev.upgrades,
          [upgradeId]: currentLevel + 1
        }
      }));
      return true;
    }
    return false;
  }, [gameState.money, gameState.upgrades]);

  const purchasePowerUp = useCallback((powerUpType: string) => {
    const powerUp = POWER_UPS.find(p => p.type === powerUpType);
    if (!powerUp) return false;

    // Apply discount if upgrade exists
    const discountLevel = gameState.upgrades['powerup_discount'] || 0;
    const discountUpgrade = SHOP_UPGRADES.find(u => u.id === 'powerup_discount');
    const discountMultiplier = 1 - (discountUpgrade?.effect.valuePerLevel || 0) * discountLevel;
    const cost = Math.floor(powerUp.cost * discountMultiplier);

    if (gameState.money >= cost) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - cost,
        inventory: {
          ...prev.inventory,
          [powerUpType]: (prev.inventory[powerUpType] || 0) + 1
        }
      }));
      return true;
    }
    return false;
  }, [gameState.money, gameState.upgrades]);

  const activatePowerUp = useCallback((type: string) => {
    const powerUp = POWER_UPS.find(p => p.type === type);
    if (!powerUp) return false;

    // Check if already active
    if (activePowerUps.some(p => p.type === type)) return false;

    // Check inventory first
    const inventoryCount = gameState.inventory[type] || 0;
    if (inventoryCount > 0) {
      setGameState(prev => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          [type]: inventoryCount - 1
        }
      }));
    } else {
      // Direct purchase during gameplay
      const discountLevel = gameState.upgrades['powerup_discount'] || 0;
      const discountUpgrade = SHOP_UPGRADES.find(u => u.id === 'powerup_discount');
      const discountMultiplier = 1 - (discountUpgrade?.effect.valuePerLevel || 0) * discountLevel;
      const cost = Math.floor(powerUp.cost * discountMultiplier);

      if (gameState.money < cost) return false;

      setGameState(prev => ({
        ...prev,
        money: prev.money - cost
      }));
    }

    // Special case: instant effects
    if (type === 'stamina_boost') {
      setGameState(prev => ({
        ...prev,
        stamina: Math.min(prev.maxStamina, prev.stamina + (prev.maxStamina * 0.5))
      }));
      return true;
    }

    // Timed effects
    setActivePowerUps(prev => [
      ...prev,
      { type: type as any, expiresAt: Date.now() + (powerUp.duration || 10000) }
    ]);
    return true;
  }, [gameState.money, gameState.inventory, gameState.upgrades, activePowerUps]);

  // ===== PLATE MANAGEMENT =====
  const addToPlate = useCallback((foodId: string) => {
    const waiter = gameState.selectedWaiter;
    const drainMultiplier = waiter?.staminaDrain || 1;
    
    setPlate(prev => ({ items: [...prev.items, foodId] }));
    // Drain stamina for each action (but not during rush mode - stamina is infinite then)
    if (!gameState.isRushActive) {
      setGameState(prev => ({
        ...prev,
        stamina: Math.max(0, prev.stamina - (CONFIG.STAMINA_DRAIN_PER_ACTION * drainMultiplier))
      }));
    }
  }, []);

  const clearPlate = useCallback(() => {
    setPlate({ items: [] });
  }, []);

  // ===== CUSTOMER MANAGEMENT =====
  const spawnCustomer = useCallback(() => {
    if (customers.length >= CONFIG.MAX_CUSTOMERS) return;

    // Determine customer type (Normal vs Special)
    let isSpecial = false;
    let specialType = '';
    let tipMultiplier = 1.0;
    let patienceMultiplier = 1.0;

    const rand = Math.random();

    // Upgraded chances
    const vipLevel = gameState.upgrades['vip_spawn'] || 0;
    const vipUpgrade = SHOP_UPGRADES?.find(u => u.id === 'vip_spawn');
    const vipChance = (vipUpgrade?.effect.baseValue || 0.05) + (vipUpgrade?.effect.valuePerLevel || 0.02) * vipLevel;

    const criticLevel = gameState.upgrades['critic_spawn'] || 0;
    const criticUpgrade = SHOP_UPGRADES?.find(u => u.id === 'critic_spawn');
    const criticChance = (criticUpgrade?.effect.baseValue || 0.03) + (criticUpgrade?.effect.valuePerLevel || 0.015) * criticLevel;

    const influencerLevel = gameState.upgrades['influencer_spawn'] || 0;
    const influencerUpgrade = SHOP_UPGRADES?.find(u => u.id === 'influencer_spawn');
    const influencerChance = (influencerUpgrade?.effect.baseValue || 0.08) + (influencerUpgrade?.effect.valuePerLevel || 0.03) * influencerLevel;

    if (rand < vipChance) {
      isSpecial = true;
      specialType = 'vip';
      tipMultiplier = 3.0;
      patienceMultiplier = 1.5;
    } else if (rand < vipChance + criticChance) {
      isSpecial = true;
      specialType = 'critic';
      tipMultiplier = 5.0;
      patienceMultiplier = 0.8;
    } else if (rand < vipChance + criticChance + influencerChance) {
      isSpecial = true;
      specialType = 'influencer';
      tipMultiplier = 2.0;
      patienceMultiplier = 1.1;
    }

    const customerType = CUSTOMER_TYPES[Math.floor(Math.random() * CUSTOMER_TYPES.length)];

    // General patience upgrade
    const patienceLevel = gameState.upgrades['customer_patience'] || 0;
    const patienceUpgrade = SHOP_UPGRADES?.find(u => u.id === 'customer_patience');
    const globalPatienceMultiplier = (patienceUpgrade?.effect.baseValue || 1.0) +
      (patienceUpgrade?.effect.valuePerLevel || 0) * patienceLevel;

    // Generate random order
    const orderSize = Math.floor(Math.random() * CONFIG.MAX_ORDER_ITEMS) + CONFIG.MIN_ORDER_ITEMS;
    const order: string[] = [];
    for (let i = 0; i < orderSize; i++) {
      const randomItem = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
      order.push(randomItem.id);
    }

    // Calculate patience based on difficulty, upgrades, and waiter
    const waiter = gameState.selectedWaiter;
    const waiterPatienceMod = waiter?.patienceMultiplier || 1;
    const isSpeedBoost = activePowerUps.some(p => p.type === 'speed_boost');
    const powerUpPatienceMultiplier = isSpeedBoost ? 1.5 : 1.0;

    const patienceBase = Math.max(
      CONFIG.CUSTOMER_PATIENCE_MIN,
      gameState.customerPatienceBase * Math.pow(CONFIG.DIFFICULTY_INCREASE_RATE, gameState.customersServed)
    ) * globalPatienceMultiplier * patienceMultiplier * powerUpPatienceMultiplier * waiterPatienceMod;

    const patience = patienceBase / customerType.speedMultiplier;

    const newCustomer: Customer = {
      id: `customer-${Date.now()}-${Math.random()}`,
      type: customerType,
      order,
      patience,
      maxPatience: patience,
      position: customers.length,
      isLeaving: false,
      arrivalTime: Date.now(),
      isSpecial,
      specialType,
      tipMultiplier
    };

    setCustomers(prev => [...prev, newCustomer]);
  }, [customers.length, gameState.customerPatienceBase, gameState.customersServed, gameState.upgrades, gameState.difficulty, activePowerUps]);

  const updateCustomerPatience = useCallback((deltaTime: number) => {
    // Check for patience freeze
    const isFrozen = activePowerUps.some(p => p.type === 'patience_freeze');
    if (isFrozen) return;

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
  }, [activePowerUps]);

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
        message: t('gameplay.customerNotFound'),
        color: '#F44336'
      };
    }

    const isCorrect = checkOrder(plate.items, customer.order);

    if (!isCorrect) {
      // Wrong order - penalty and clear plate
      setGameState(prev => ({
        ...prev,
        stamina: Math.max(0, prev.stamina + CONFIG.STAMINA_RECOVERY_WRONG),
        combo: 0
      }));
      clearPlate();
      return {
        quality: 'wrong',
        payment: 0,
        tip: 0,
        comboBonus: 0,
        message: t('gameplay.wrongOrder'),
        color: '#F44336'
      };
    }

    // Correct order - calculate rewards
    const patienceRatio = customer.patience / customer.maxPatience;
    const waiter = gameState.selectedWaiter;
    let quality: ServiceQuality = 'average';

    // Tip multiplier upgrade
    const tipLevel = gameState.upgrades['base_tips'] || 0;
    const tipUpgrade = SHOP_UPGRADES?.find(u => u.id === 'base_tips');
    const globalTipMultiplier = (tipUpgrade?.effect.baseValue || 1.0) + (tipUpgrade?.effect.valuePerLevel || 0) * tipLevel;
    const isDoubleTips = activePowerUps.some(p => p.type === 'double_tips');
    const powerUpTipMultiplier = isDoubleTips ? 2.0 : 1.0;
    const customerTipMultiplier = customer.tipMultiplier || 1.0;

    const payment = CONFIG.BASE_PAYMENT;
    let tip = 0;
    let message = t('gameplay.check');
    let color = '#98D8C8';

    if (patienceRatio > SERVICE_THRESHOLDS.perfect) {
      quality = 'perfect';
      tip = Math.floor(CONFIG.PERFECT_TIMING_BONUS * (waiter?.tipBonus || 1) * customerTipMultiplier * globalTipMultiplier * powerUpTipMultiplier);
      message = t('gameplay.perfect');
      color = '#FFD700';
    } else if (patienceRatio > SERVICE_THRESHOLDS.good) {
      quality = 'good';
      tip = Math.floor(CONFIG.GOOD_TIMING_BONUS * (waiter?.tipBonus || 1) * customerTipMultiplier * globalTipMultiplier * powerUpTipMultiplier);
      message = t('gameplay.good');
      color = '#4CAF50';
    } else {
      tip = Math.floor(5 * (waiter?.tipBonus || 1) * customerTipMultiplier * globalTipMultiplier * powerUpTipMultiplier);
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

    let totalEarned = payment + tip + comboBonus;
    
    // Apply 1.5x money multiplier during rush
    if (gameState.isRushActive) {
      totalEarned = Math.floor(totalEarned * CONFIG.RUSH_MONEY_MULTIPLIER);
    }
    
    const scoreGain = totalEarned * 10;

    // Stamina recovery upgrade
    const recoveryLevel = gameState.upgrades['stamina_recovery'] || 0;
    const recoveryUpgrade = SHOP_UPGRADES?.find(u => u.id === 'stamina_recovery');
    const staminaRecovery = (recoveryUpgrade?.effect.baseValue || CONFIG.STAMINA_RECOVERY_CORRECT) +
      (recoveryUpgrade?.effect.valuePerLevel || 0) * recoveryLevel;

    // Calculate new combo bar with waiter bonus
    const comboBarGainMultiplier = waiter?.comboBarGain || 1;
    let newComboBar = gameState.comboBar + (CONFIG.COMBO_BAR_GAIN_PER_SERVICE * comboBarGainMultiplier);
    let rushActive = gameState.isRushActive;
    let rushTimer = gameState.rushTimer;
    let rushCooldownTimer = gameState.rushCooldownTimer;
    
    // Check if combo bar is full and trigger rush (only if not in cooldown and not already active)
    if (newComboBar >= gameState.maxComboBar && !gameState.isRushActive && gameState.rushCooldownTimer <= 0) {
      newComboBar = gameState.maxComboBar;
      rushActive = true;
      rushTimer = CONFIG.RUSH_DURATION;
      rushCooldownTimer = CONFIG.RUSH_COOLDOWN;
    } else if (newComboBar > gameState.maxComboBar) {
      newComboBar = gameState.maxComboBar;
    }

    // Update game state
    setGameState(prev => ({
      ...prev,
      score: prev.score + scoreGain,
      money: prev.money + totalEarned,
      totalMoneyEarned: prev.totalMoneyEarned + totalEarned,
      customersServed: prev.customersServed + 1,
      stamina: Math.min(prev.maxStamina, prev.stamina + staminaRecovery),
      combo: newCombo,
      lastServeTime: now,
      comboTimer: CONFIG.COMBO_TIMEOUT,
      difficulty: prev.difficulty * 1.02,
      comboBar: newComboBar,
      isRushActive: rushActive,
      rushTimer: rushTimer,
      rushCooldownTimer: rushCooldownTimer
    }));

    // Remove customer and clear plate
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    clearPlate();

    // Check achievements
    if (quality === 'perfect') {
      perfectStreakRef.current += 1;
      if (perfectStreakRef.current >= 5) {
        unlockAchievement('perfect_streak');
      }
    } else {
      perfectStreakRef.current = 0;
    }

    if (newCombo >= 10) {
      unlockAchievement('combo_master');
    }

    if (gameState.customersServed + 1 >= 1) {
      unlockAchievement('first_serve');
    }

    if (gameState.customersServed + 1 >= 10) {
      const gameDuration = (Date.now() - gameStartTimeRef.current) / 1000;
      if (gameDuration <= 120) {
        unlockAchievement('speed_demon');
      }
    }

    if (gameState.money + totalEarned >= 500) {
      unlockAchievement('big_spender');
    }

    return {
      quality,
      payment,
      tip,
      comboBonus,
      message: comboBonus > 0 ? `${message} ${t('gameplay.comboBonus', { amount: comboBonus })}` : message,
      color
    };
  }, [customers, plate.items, checkOrder, gameState.selectedWaiter, gameState.combo, gameState.lastServeTime, gameState.upgrades, activePowerUps, clearPlate, gameState.customersServed, gameState.money, unlockAchievement]);

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
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
    }, 1000);
  }, []);

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

      // Update combo bar decay and rush timers
      setGameState(prev => {
        let newComboBar = prev.comboBar;
        let newRushTimer = prev.rushTimer;
        let newRushCooldownTimer = prev.rushCooldownTimer;
        let isRushActive = prev.isRushActive;

        // Handle rush timer
        if (prev.isRushActive) {
          newRushTimer -= deltaTime;
          if (newRushTimer <= 0) {
            isRushActive = false;
            newRushTimer = 0;
            newComboBar = 0; // Reset combo bar after rush
            newRushCooldownTimer = CONFIG.RUSH_COOLDOWN;
          }
        } else if (prev.rushCooldownTimer > 0) {
          // Handle cooldown timer
          newRushCooldownTimer -= deltaTime;
          if (newRushCooldownTimer < 0) newRushCooldownTimer = 0;
          
          // Decay combo bar when not in rush or cooldown
          if (newComboBar > 0) {
            newComboBar -= (CONFIG.COMBO_BAR_DECAY_RATE * deltaTime / 1000);
            if (newComboBar < 0) newComboBar = 0;
          }
        } else {
          // Decay combo bar when not in rush
          if (newComboBar > 0) {
            newComboBar -= (CONFIG.COMBO_BAR_DECAY_RATE * deltaTime / 1000);
            if (newComboBar < 0) newComboBar = 0;
          }
        }

        return {
          ...prev,
          comboBar: newComboBar,
          rushTimer: newRushTimer,
          rushCooldownTimer: newRushCooldownTimer,
          isRushActive
        };
      });

      // Spawn customers - faster during rush
      nextSpawnTimeRef.current -= deltaTime;
      const isRush = isRushActiveRef.current;
      const maxCustomersDuringRush = isRush ? 10 : CONFIG.MAX_CUSTOMERS;
      const spawnInterval = isRush 
        ? CONFIG.RUSH_CUSTOMER_SPAWN_INTERVAL 
        : Math.max(CONFIG.CUSTOMER_SPAWN_INTERVAL_MIN, CONFIG.CUSTOMER_SPAWN_INTERVAL_BASE / gameState.difficulty);
      
      if (nextSpawnTimeRef.current <= 0 && customers.length < maxCustomersDuringRush) {
        spawnCustomer();
        nextSpawnTimeRef.current = spawnInterval;
      }

      // Update customer patience - infinite during rush
      if (!isRush) {
        updateCustomerPatience(deltaTime);
      }

      // Check game over (but not during rush mode - stamina is infinite then)
      if (gameState.stamina <= 0 && !isRush) {
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

  // Effect to clean up expired power-ups
  useEffect(() => {
    if (activePowerUps.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const stillActive = activePowerUps.filter(p => p.expiresAt > now);
      if (stillActive.length !== activePowerUps.length) {
        setActivePowerUps(stillActive);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [activePowerUps]);

  return {
    gameState,
    plate,
    customers,
    floatingTexts,
    activePowerUps,
    switchScene,
    selectWaiter,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    resetGame,
    addToPlate,
    clearPlate,
    serveCustomer,
    addFloatingText,
    toggleSound,
    purchaseUpgrade,
    purchasePowerUp,
    activatePowerUp
  };
}
