# Sip or Spill ☕ - Party Games Collection

## Overview
The "Sip or Spill" game has been expanded into a comprehensive collection of coffee-shop themed party games. It now serves as a hub for multiple social game modes designed for friends and couples.

## Featured Games

### 1. Truth or Dare (Original)
*   **Modes**: Couples ❤️ & Friends 🧑‍🤝‍🧑
*   **Description**: Classic truth or dare with café-safe challenges.
*   **Mechanics**: Random card draw, skips, type indicators.

### 2. Would You Rather
*   **Theme**: Difficult choices & hypothetical scenarios.
*   **Format**: "Would you rather X or Y?"
*   **Interaction**: Discuss and choose between two options.

### 3. Never Have I Ever
*   **Theme**: Revealing secrets & past experiences.
*   **Format**: Statements of things people haven't done.
*   **Interaction**: Drink (sip) if you have done it.

### 4. Who's Likely To
*   **Theme**: Pointing fingers & group consensus.
*   **Format**: "Who is most likely to..."
*   **Interaction**: Count to 3 and point to the person fitting the description.

## New Features

### 👤 Player Setup System
*   **Management**: Add and remove player names.
*   **Integration**: Players are tracked across all game modes.
*   **Active Turn**: Shows whose turn it is in the game header.

### 🎨 Universal Game Layout
All modes share a consistent, polished interface:
*   **Header**: Navigation, Mode Title, Reset & Player Management.
*   **Main Area**: Large, readable cards with animations.
*   **Footer**: Contextual actions (Next, Skip).

## Technical Implementation
*   **Entry Point**: `src/scenes/SipOrSpill.tsx` (Main Menu & Router)
*   **Game Logic**: `src/components/siporspill/GameSession.tsx` (Unified game runner)
*   **Data Source**: `src/components/siporspill/GameData.ts` (Content for all modes)
*   **Player Manager**: `src/components/siporspill/PlayerSetup.tsx`

## Content Library
*   **Truth/Dare**: ~40 prompts per category (Couples/Friends).
*   **Would You Rather**: 10+ scenarios.
*   **Never Have I Ever**: 10+ statements.
*   **Who's Likely To**: 10+ prompts.

The architecture allows for easy addition of new questions and game modes in `GameData.ts`.
