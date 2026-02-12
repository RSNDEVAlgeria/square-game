# Square Coffee - Full Documentation

A comprehensive café-themed gaming collection featuring multiple mini-games, built with React, TypeScript, and TailwindCSS.

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Games](#games)
4. [Features](#features)
5. [Internationalization](#internationalization)
6. [Mobile Optimization](#mobile-optimization)
7. [Development](#development)
8. [Deployment](#deployment)

---

## Overview

**Square Coffee** is a café management and mini-games collection built as a Progressive Web App (PWA). The app features a main cooking game where players serve customers, alongside multiple mini-games for entertainment.

### Key Technologies
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tooling
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **i18next** - Internationalization (EN/FR/AR)
- **React Router** - Client-side routing

---

## Architecture

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── siporspill/      # Sip or Spill game components
│   ├── Shop.tsx         # Shop system
│   ├── PowerUpsPanel.tsx # Power-ups management
│   └── ParticleEffects.tsx # Visual effects
├── scenes/              # Game scenes/screens
│   ├── GamesMenu.tsx    # Main menu with game selection
│   ├── MainMenu.tsx     # Cooking game main menu
│   ├── Gameplay.tsx     # Cooking game core
│   ├── GameOver.tsx     # Game over screen
│   ├── WaiterSelection.tsx # Character selection
│   ├── XO.tsx           # Tic Tac Toe
│   ├── Sudoku.tsx       # Sudoku game
│   ├── SipOrSpill.tsx   # Party games hub
│   └── chess/           # Chess game components
├── hooks/               # Custom React hooks
│   ├── useGameState.ts  # Main game state management
│   ├── useAudio.ts      # Audio management
│   └── useHaptic.ts     # Mobile haptic feedback
├── types/               # TypeScript type definitions
│   ├── game.ts          # Core game types
│   ├── shop.ts          # Shop system types
│   └── enhancedGameplay.ts # Power-ups & achievements
├── constants/           # Game configuration
│   └── gameConfig.ts    # All game constants
├── i18n/                # Internationalization
│   └── config.ts        # i18n setup
└── lib/
    └── utils.ts         # Utility functions
```

### State Management
The app uses React's built-in state management with custom hooks:

- **`useGameState`** - Centralized game state for the cooking game
- **`useAudio`** - Audio context and playback
- **`useHaptic`** - Mobile vibration feedback

---

## Games

### 1. Cooking Game (Main Game)

**Objective**: Serve customers quickly and accurately to earn money and score points.

#### Gameplay Mechanics
- **Customers** arrive with food orders
- **Plate System**: Add items to a plate, then serve
- **Stamina**: Actions consume stamina; serving correctly recovers stamina
- **Combo System**: Quick consecutive serves build combo multipliers
- **Special Customers**: VIP, Food Critic, and Influencer with unique rewards

#### Customer Types
| Type | Spawn Chance | Tips | Patience | Special |
|------|-------------|------|----------|---------|
| Normal | 84% | 1x | 1.0x | - |
| VIP | 5% | 3x | 1.5x | Higher order value |
| Food Critic | 3% | 5x | 0.8x | 2x order size |
| Influencer | 8% | 2x | 0.9x | Brings more customers |

#### Power-Ups
| Power-Up | Cost | Effect |
|----------|------|--------|
| Speed Boost | $50 | +50% patience for 15s |
| Patience Freeze | $75 | Freeze all patience for 10s |
| Double Tips | $60 | 2x tips for 20s |
| Stamina Boost | $40 | +50% instant stamina |

#### Achievements
- First Steps - Serve your first customer
- Speed Demon - 10 customers in 2 minutes
- Perfect Streak - 5 perfect serves in a row
- Combo Master - Reach 10x combo
- Big Spender - Earn $500 in one game

### 2. Sip or Spill ☕

A party games collection for friends and couples with 4 game modes:

1. **Truth or Dare** - Classic with café-safe challenges
   - Couples Mode ❤️
   - Friends Mode 🧑‍🤝‍🧑
   
2. **Would You Rather** - Difficult choices

3. **Never Have I Ever** - Revealing secrets

4. **Who's Likely To** - Pointing fingers

**Features**:
- Player management system
- Tutorial system for each mode
- Turn tracking
- ~40+ prompts per category

### 3. Tic Tac Toe (XO)

Classic XO game against AI or local multiplayer.

### 4. Sudoku

Number puzzle game with multiple difficulty levels.

### 5. Chess

Full chess game with:
- Single-player vs AI (3 difficulty levels)
- Local multiplayer
- Move validation
- Pawn promotion
- Move history

---

## Features

### Shop System

A comprehensive upgrade system for the cooking game:

#### Permanent Upgrades

**Special Customer Upgrades**:
- 👑 VIP Magnet (5% → 25% spawn chance) - $100 base
- 🎩 Critic Appeal (3% → 18% spawn chance) - $150 base
- 📱 Social Boost (8% → 38% spawn chance) - $80 base

**Gameplay Upgrades**:
- 💪 Endurance Training (100 → 250 max stamina) - $120 base
- ⚡ Quick Recovery (8 → 28 stamina per serve) - $100 base
- ⏰ Patience Plus (1.0x → 1.8x patience) - $130 base

**Economy Upgrades**:
- 💰 Charm School (1.0x → 2.0x tips) - $150 base
- 🏷️ Power Saver (0% → 50% discount) - $200 base

### Audio System
- Sound effects for all interactions
- Toggle in settings
- Initialization on first user interaction

### Visual Effects
- Particle effects on successful serves
- Floating text feedback
- Animated customer indicators
- Combo animations
- Framer Motion transitions

### Persistence
- Progress saved to localStorage:
  - Money earned
  - Shop upgrades purchased
  - Power-up inventory
  - Achievements unlocked

---

## Internationalization

Full i18n support with 3 languages:

### Supported Languages
- **English (en)** - Source language
- **French (fr)** - Full translation
- **Arabic (ar)** - Full translation with RTL support

### RTL Support
- Dynamic text direction switching
- Layout adjustments for Arabic
- Arabic translations with proper context

### Language Switching
- Located in GamesMenu header
- Cycles through EN → FR → AR
- Visual flag indicator
- Instant translation without reload

---

## Mobile Optimization

### Responsive Design
- 9:16 aspect ratio optimized
- Portrait mode enforced
- Touch-optimized buttons (44x44px minimum)
- Safe area support for notched devices

### Performance
- Hardware acceleration via CSS transforms
- Optimized rendering
- 60fps animations
- No scroll bounce on iOS

### PWA Features
- Installable to home screen
- Full-screen mode support
- Service worker ready (can be extended)

### Haptic Feedback
- Light tap: Food selection
- Medium: Plate clear
- Success pattern: Perfect serve
- Error pattern: Wrong order

---

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Server runs at `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

### Testing on Mobile
1. Start dev server
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Access from mobile: `http://YOUR_IP:5173`
4. Or use ngrok for external access

---

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository on [vercel.com](https://vercel.com)
3. Framework preset: `Vite`
4. Build command: `npm run build`
5. Output directory: `dist`

### Netlify
1. Import from Git on [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`

### Static Hosting
```bash
npm run build
# Upload dist/ folder contents to your server
```

### Environment Variables
No special environment variables required for basic deployment.

---

## Configuration Files

### vite.config.ts
Vite configuration with React plugin and path aliases.

### tailwind.config.js
TailwindCSS configuration with custom colors and animations.

### tsconfig.json
TypeScript configuration with strict mode and path mapping.

### components.json
shadcn/ui configuration for component management.

---

## Key Dependencies

### Core
- react ^19.2.0
- react-dom ^19.2.0
- react-router-dom ^7.13.0
- typescript ~5.9.3

### UI & Styling
- tailwindcss ^3.4.19
- framer-motion ^12.33.0
- lucide-react ^0.562.0
- @radix-ui/* (various components)

### Internationalization
- i18next ^25.8.5
- react-i18next ^16.5.4
- i18next-browser-languagedetector ^8.2.0

### Game Features
- canvas-confetti ^1.9.4
- chess.js ^1.4.0
- react-chessboard ^5.8.6

---

## Browser Support

### Full Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Required Features
- ES2020+
- CSS Grid & Flexbox
- CSS Custom Properties
- Web Audio API (for sound)
- Vibration API (for haptics)

---

## Troubleshooting

### Common Issues

**Blank page on deploy**:
- Check `base` path in `vite.config.ts`
- For subdirectory deployment: `base: '/your-repo-name/'`
- For root domains: `base: '/'`

**Audio not playing**:
- Audio initializes on first user interaction
- Check browser autoplay policies
- Ensure HTTPS for mobile browsers

**Haptic feedback not working**:
- Requires HTTPS
- Not supported on all devices
- Check device vibration settings

**Build errors**:
- Ensure all dependencies installed: `npm install`
- Check TypeScript errors: `npx tsc --noEmit`
- Run linter: `npm run lint`

---

## Contributing

This is a personal project by **RSN-dev**. For feedback or issues, visit:
- Website: [rsndev.netlify.app](https://rsndev.netlify.app)

---

## License

This project is proprietary. All rights reserved by RSN-dev.

---

**Built with ☕ by RSN-dev**

*Last Updated: 2026-02-12*
