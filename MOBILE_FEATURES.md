# Square Coffee - Mobile Optimization & Gameplay Features

## 🎮 New Gameplay Features

### Power-Ups System
The game now includes 4 exciting power-ups that players can purchase during gameplay:

1. **⚡ Speed Boost** ($50) - Customers wait 50% longer for 15 seconds
2. **❄️ Patience Freeze** ($75) - Freeze all customer patience for 10 seconds
3. **💰 Double Tips** ($60) - Earn 2x tips for 20 seconds
4. **💪 Stamina Boost** ($40) - Instantly restore 50% stamina

Access power-ups via the purple lightning button in the top-right corner during gameplay.

### Special Customers
Three types of special customers can now appear with unique rewards:

1. **👑 VIP Customer** (5% spawn chance)
   - Pays triple tips
   - 1.5x order size
   - 20% more patience

2. **🎩 Food Critic** (3% spawn chance)
   - 5x tips for perfect service!
   - 2x order size
   - 30% less patience (challenging!)

3. **📱 Influencer** (8% spawn chance)
   - Brings more customers
   - 2x tips
   - 10% less patience

Special customers are indicated by a sparkling ✨ icon above their heads.

### Achievements System
Track your progress with 5 achievements:

- 🎯 **First Steps** - Serve your first customer
- ⚡ **Speed Demon** - Serve 10 customers in under 2 minutes
- ⭐ **Perfect Streak** - Get 5 perfect serves in a row
- 🔥 **Combo Master** - Reach a 10x combo
- 💎 **Big Spender** - Earn $500 in a single game

Each achievement unlocks a money reward!

### Visual Effects
- **Particle Effects** - Animated particles appear on successful serves
- **Enhanced Floating Text** - Better feedback for all actions
- **Special Customer Indicators** - Golden glow for VIP customers

## 📱 Mobile Optimizations

### Enhanced Touch Controls
- **Haptic Feedback** - Vibration feedback for all interactions:
  - Light tap for food selection
  - Medium vibration for clearing plate
  - Success pattern for perfect serves
  - Error pattern for wrong orders

### Responsive Design
- **Portrait Mode Optimized** - Game designed for 9:16 aspect ratio
- **Safe Area Support** - Works perfectly on notched devices (iPhone X+)
- **Landscape Warning** - Prompts users to rotate to portrait mode
- **Touch-Optimized Buttons** - Larger hit areas for better mobile UX

### Performance Improvements
- **Fixed Positioning** - Prevents scrolling issues on mobile
- **Overscroll Prevention** - No bounce effect on iOS
- **Hardware Acceleration** - Smooth animations via CSS transforms
- **Optimized Rendering** - Better frame rates on mobile devices

### PWA Support
The game now includes Progressive Web App features:
- **Add to Home Screen** - Install like a native app
- **Full Screen Mode** - Immersive gameplay experience
- **Offline Ready** - (Can be extended with service workers)

## 🎨 UI/UX Enhancements

### Improved Visual Feedback
- Special customer highlighting with golden backgrounds
- Animated sparkles for special customers
- Enhanced combo indicators
- Better stamina bar visibility

### Mobile-First Design
- Optimized font sizes for mobile screens
- Better contrast for outdoor visibility
- Larger touch targets (minimum 44x44px)
- Reduced motion for accessibility

## 🔧 Technical Improvements

### New Components
- `PowerUpsPanel.tsx` - Power-ups management UI
- `ParticleEffects.tsx` - Visual effects system
- `useHaptic.ts` - Haptic feedback hook

### Enhanced Types
- `enhancedGameplay.ts` - Types for new features
- Extended `Customer` interface for special customers
- Power-up and achievement type definitions

### Configuration
- `POWER_UPS` - Power-up definitions
- `SPECIAL_CUSTOMERS` - Special customer configurations
- `ACHIEVEMENTS` - Achievement tracking system

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

### Testing on Mobile
1. Start dev server: `npm run dev`
2. Find your local IP address
3. Access from mobile device: `http://YOUR_IP:5173`
4. Or use ngrok for external testing

## 📊 Game Balance

### Power-Up Costs
Power-ups are priced to create strategic decisions:
- Early game: Save money for stamina boosts
- Mid game: Use speed boost for breathing room
- Late game: Double tips for maximum earnings

### Special Customer Frequency
- VIP: Rare but rewarding (5%)
- Critic: Very rare, high risk/reward (3%)
- Influencer: Common, good for combos (8%)

### Achievement Difficulty
- Beginner: First Steps (tutorial)
- Intermediate: Speed Demon, Perfect Streak
- Advanced: Combo Master, Big Spender

## 🎯 Future Enhancements

Potential additions for future versions:
- Daily challenges system
- Upgrade shop for permanent improvements
- Leaderboards and social features
- More power-up types
- Seasonal events and themes
- Sound effects and background music
- Tutorial system for new players

## 📝 Notes

- All TailwindCSS lint warnings are expected (processed at build time)
- Haptic feedback requires HTTPS on most browsers
- PWA features work best when served over HTTPS
- Test on real devices for best mobile experience

---

**Enjoy your enhanced Square Coffee experience! ☕**
