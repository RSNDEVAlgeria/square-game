# New Feature: Game Tutorials

## Overview
Added a comprehensive tutorial system to the "Sip or Spill" party games. Users are now greeted with a "How to Play" screen before starting any game mode.

## Implementation Details

### 1. New Component: `GameTutorial`
- Located at `src/components/siporspill/GameTutorial.tsx`
- Displays specific rules for each game mode:
  - **Truth or Dare**: Explains card types and skips.
  - **Would You Rather**: Explains the choice mechanics.
  - **Never Have I Ever**: Explains the drinking rules ☕.
  - **Who's Likely To**: Explains the pointing mechanic.
- Features smooth animations and a consistent coffee-shop aesthetic.

### 2. Updated Flow in `SipOrSpill.tsx`
- Added `'tutorial'` state to the view manager.
- Navigation flow updated:
  - Menu -> Game Selection -> **Tutorial** -> Game Session
- Users can go back to the menu from the tutorial screen.

## User Experience
- Clear, step-by-step instructions.
- Visual feedback with icons and animations.
- "Start Playing" button clearly indicates when the game begins.
