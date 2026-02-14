# Square Coffee - Café Gaming Collection

A comprehensive café-themed gaming collection built with React, TypeScript, and TailwindCSS. Features multiple mini-games, a cooking game with shop system, and full internationalization support.

**Live Demo**: [rsndev.netlify.app](https://rsndev.netlify.app)  
**Built by**: RSN-dev

---

## Games Included

### 1. Cooking Game (Main)
Serve customers quickly and accurately to earn money and score points.
- **Customers**: Normal, VIP (3x tips), Food Critic (5x tips), Influencer (2x tips)
- **Power-ups**: Speed Boost, Patience Freeze, Double Tips, Stamina Boost
- **Shop System**: 8 permanent upgrades (stamina, tips, special customers)
- **Achievements**: 5 unlockable achievements with rewards

### 2. Sip or Spill ☕
Party games collection for friends and couples:
- Truth or Dare (Couples & Friends modes)
- Would You Rather
- Never Have I Ever
- Who's Likely To
- Player management system
- Tutorial system for each mode

### 3. Tic Tac Toe (XO)
Classic XO game against AI or local multiplayer with 3 difficulty levels.

### 4. Sudoku
Number puzzle game with Easy, Medium, and Hard difficulty levels.

### 5. Chess
Full chess implementation with:
- Single-player vs AI (3 difficulty levels)
- Local multiplayer
- Move validation and pawn promotion

---

## Key Features

### Internationalization
- **3 Languages**: English, French, Arabic
- **RTL Support**: Full Arabic support with right-to-left layout
- **Language Switcher**: Easy switching in the Games Menu

### Mobile Optimization
- **PWA Support**: Installable to home screen
- **Haptic Feedback**: Vibration on interactions (mobile)
- **Responsive Design**: 9:16 aspect ratio optimized
- **Touch Controls**: Large, touch-friendly buttons

### Audio System
- Procedurally generated sound effects (Web Audio API)
- 12+ unique sounds (success, error, power-up, combo, etc.)
- Toggle on/off in settings

### Visual Effects
- Particle effects on successful serves
- Floating text feedback
- Framer Motion animations
- Smooth transitions throughout

---

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tooling
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **i18next** - Internationalization
- **React Router** - Client-side routing

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── siporspill/     # Sip or Spill components
│   ├── Shop.tsx        # Shop system
│   └── ...
├── scenes/             # Game scenes/screens
│   ├── GamesMenu.tsx   # Main menu
│   ├── Gameplay.tsx    # Cooking game
│   ├── SipOrSpill.tsx  # Party games
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useGameState.ts # Game state management
│   ├── useAudio.ts     # Audio management
│   └── useHaptic.ts    # Haptic feedback
├── types/              # TypeScript definitions
├── constants/          # Game configuration
└── i18n/               # Internationalization files
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Server runs at `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

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

---

## Game Configuration

### Waiter Selection
Two waiters with photos (place in `public/waiters/`):
- `waiter-1.jpg` - First waiter photo
- `waiter-2.jpg` - Second waiter photo

### Shop Upgrades
- **Special Customers**: VIP Magnet, Critic Appeal, Social Boost
- **Gameplay**: Endurance Training, Quick Recovery, Patience Plus
- **Economy**: Charm School, Power Saver

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

Requires: ES2020+, CSS Grid & Flexbox, Web Audio API, Vibration API

---

## Troubleshooting

**Blank page on deploy**:
- Check `base` path in `vite.config.ts`
- For subdirectory: `base: '/your-repo-name/'`
- For root domains: `base: '/'`

**Audio not playing**:
- Audio initializes on first user interaction
- Requires HTTPS on mobile browsers

**Haptic feedback not working**:
- Requires HTTPS
- Check device vibration settings

---

## License

This project is proprietary. All rights reserved by RSN-dev.

---

**Built with ☕ by RSN-dev**

*Last Updated: 2026-02-14*
