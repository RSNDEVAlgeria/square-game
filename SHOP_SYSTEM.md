# Shop System - Implementation Guide

## 🛍️ **New Shop System Overview**

A comprehensive upgrade and power-up shop has been added to Square Coffee! Players can now purchase permanent upgrades and power-ups to enhance their gameplay.

## 📋 **Features**

### **1. Permanent Upgrades** (8 types)

#### Special Customer Upgrades:
- **👑 VIP Magnet** - Increase VIP spawn chance (5% → 25% max)
  - Base: 5%, +2% per level, Max 10 levels
  - Cost: $100, increases by 1.5x per level

- **🎩 Critic Appeal** - Increase Food Critic spawn chance (3% → 18% max)
  - Base: 3%, +1.5% per level, Max 10 levels
  - Cost: $150, increases by 1.6x per level

- **📱 Social Boost** - Increase Influencer spawn chance (8% → 38% max)
  - Base: 8%, +3% per level, Max 10 levels
  - Cost: $80, increases by 1.4x per level

#### Gameplay Upgrades:
- **💪 Endurance Training** - Increase max stamina (100 → 250 max)
  - Base: 100, +10 per level, Max 15 levels
  - Cost: $120, increases by 1.5x per level

- **⚡ Quick Recovery** - Recover more stamina per serve (8 → 28 max)
  - Base: 8, +2 per level, Max 10 levels
  - Cost: $100, increases by 1.5x per level

- **⏰ Patience Plus** - Customers wait longer (1.0x → 1.8x max)
  - Base: 1.0x, +0.08x per level, Max 10 levels
  - Cost: $130, increases by 1.5x per level

#### Economy Upgrades:
- **💰 Charm School** - Increase base tips (1.0x → 2.0x max)
  - Base: 1.0x, +0.1x per level, Max 10 levels
  - Cost: $150, increases by 1.6x per level

- **🏷️ Power Saver** - Reduce power-up costs (0% → 50% max)
  - Base: 0%, -10% per level, Max 5 levels
  - Cost: $200, increases by 1.7x per level

### **2. Power-Up Shop**
Purchase power-ups directly from the shop:
- ⚡ Speed Boost - $50
- ❄️ Patience Freeze - $75
- 💰 Double Tips - $60
- 💪 Stamina Boost - $40

## 🎨 **UI Features**

### **Beautiful Design:**
- ✨ Gradient purple/pink theme
- 📊 Progress bars for each upgrade
- 🏷️ Category filtering (All, Special Customers, Gameplay, Economy)
- 📑 Tabs for Upgrades vs Power-ups
- 💰 Real-time money display
- 🎯 Visual feedback for affordable/maxed upgrades

### **Responsive Layout:**
- Mobile-optimized grid
- Smooth animations
- Backdrop blur effects
- Premium glassmorphism design

## 📁 **New Files Created**

1. **`src/types/shop.ts`**
   - Type definitions for shop system
   - UpgradeType, ShopUpgrade, ShopState interfaces

2. **`src/components/Shop.tsx`**
   - Main shop component
   - Tab system (Upgrades/Power-ups)
   - Category filtering
   - Purchase logic

3. **`src/constants/gameConfig.ts`** (updated)
   - Added SHOP_UPGRADES configuration
   - 8 different upgrade definitions

4. **`src/scenes/MainMenu.tsx`** (updated)
   - Added Shop button
   - New gradient coral/pink styling
   - ShoppingBag icon

## 🔧 **Integration Steps**

### **Required in App.tsx:**

```typescript
import { Shop } from '@/components/Shop';
import { useState } from 'react';

// Add shop state
const [isShopOpen, setIsShopOpen] = useState(false);
const [upgradeLevels, setUpgradeLevels] = useState<Record<string, number>>({});
const [totalMoneyEarned, setTotalMoneyEarned] = useState(0);

// Add shop handlers
const handleOpenShop = () => {
  setIsShopOpen(true);
  playSound('click');
};

const handleCloseShop = () => {
  setIsShopOpen(false);
  playSound('click');
};

const handlePurchaseUpgrade = (upgradeId: string) => {
  const upgrade = SHOP_UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return;
  
  const currentLevel = upgradeLevels[upgradeId] || 0;
  const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
  
  if (gameState.money >= cost && currentLevel < upgrade.maxLevel) {
    setGameState(prev => ({ ...prev, money: prev.money - cost }));
    setUpgradeLevels(prev => ({ ...prev, [upgradeId]: currentLevel + 1 }));
  }
};

const handlePurchasePowerUp = (powerUpId: string) => {
  const powerUp = POWER_UPS.find(p => p.id === powerUpId);
  if (!powerUp || gameState.money < powerUp.cost) return;
  
  setGameState(prev => ({ ...prev, money: prev.money - powerUp.cost }));
  // Add power-up to inventory or activate immediately
};

// In JSX:
<MainMenu 
  onPlay={handlePlay}
  onShop={handleOpenShop}
  onExit={handleExit}
/>

<Shop
  isOpen={isShopOpen}
  onClose={handleCloseShop}
  money={gameState.money}
  totalMoneyEarned={totalMoneyEarned}
  upgradeLevels={upgradeLevels}
  onPurchaseUpgrade={handlePurchaseUpgrade}
  onPurchasePowerUp={handlePurchasePowerUp}
  onPlaySound={playSound}
/>
```

## 💡 **Upgrade Effects Application**

### **How to Apply Upgrades:**

```typescript
// Get upgrade level
const vipLevel = upgradeLevels['vip_spawn'] || 0;
const vipUpgrade = SHOP_UPGRADES.find(u => u.id === 'vip_spawn');

// Calculate current value
const vipSpawnChance = vipUpgrade.effect.baseValue + 
  (vipUpgrade.effect.valuePerLevel * vipLevel);

// Use in spawn logic
if (Math.random() < vipSpawnChance) {
  // Spawn VIP customer
}
```

### **Upgrade Applications:**

1. **Special Customer Spawns** - Apply in `spawnCustomer()` function
2. **Max Stamina** - Apply when initializing game state
3. **Stamina Recovery** - Apply in `serveCustomer()` function
4. **Base Tips** - Multiply tip amounts in `serveCustomer()`
5. **Customer Patience** - Multiply patience values in `spawnCustomer()`
6. **Power-up Discount** - Reduce costs in PowerUpsPanel

## 🎮 **User Flow**

1. **Main Menu** → Click "SHOP" button
2. **Shop Opens** → See current money and total earned
3. **Browse Upgrades** → Filter by category
4. **Purchase** → Click upgrade button
5. **Level Up** → See progress bar fill
6. **Effects Apply** → Immediately in next game

## 📊 **Progression System**

### **Early Game ($0-500):**
- Focus on Influencer Spawn (cheap, frequent)
- Buy Stamina Boost power-ups
- Save for first upgrade

### **Mid Game ($500-2000):**
- Upgrade Max Stamina
- Increase VIP spawn chance
- Buy Quick Recovery

### **Late Game ($2000+):**
- Max out Charm School for tips
- Upgrade Critic Appeal
- Buy Power Saver for discounts

## 🎨 **Visual Hierarchy**

### **Colors:**
- **Purple/Pink Gradient** - Primary actions
- **Green** - Money/Affordable
- **Red** - Cannot afford
- **Gray** - Maxed out
- **Category Colors** - Match upgrade types

### **Animations:**
- Fade in on open
- Zoom in effect
- Progress bar fills
- Hover scale effects
- Smooth transitions

## 🔮 **Future Enhancements**

Potential additions:
- Daily deals/discounts
- Bundle purchases
- Prestige system
- Seasonal upgrades
- Achievement rewards
- Upgrade preview mode

---

**The shop system is now ready to integrate! Just add the handlers to App.tsx and you're good to go!** 🎉
