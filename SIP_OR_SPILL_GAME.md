# Sip or Spill ☕ - Truth or Dare Game

## Overview
A coffee shop-themed truth or dare game integrated into the Square Coffee games menu. The game features two distinct modes designed for different social settings in a café environment.

## Game Features

### 🎮 Two Game Modes

#### 1. Couples Mode ❤️
- **Theme**: Romantic, emotional, and playful
- **Focus**: Feelings, memories, attraction, and future plans
- **Tone**: Sweet, intimate but respectful
- **Sample Truths**:
  - "What's your favorite thing about our relationship?"
  - "When did you first realize you had feelings for me?"
  - "What's a secret wish you have for us?"
  
- **Sample Dares**:
  - "Whisper something sweet in my ear right now"
  - "Hold my hand and look into my eyes for 30 seconds without laughing"
  - "Share a sip of your coffee with me in the most romantic way"

#### 2. Friends Mode 🧑‍🤝‍🧑
- **Theme**: Funny, light, and social
- **Focus**: Memories, habits, preferences, and inside jokes
- **Tone**: Silly but respectful
- **Sample Truths**:
  - "What's the most embarrassing thing that happened to you at a café?"
  - "What's your weirdest coffee order ever?"
  - "What's a secret talent you've never shown me?"
  
- **Sample Dares**:
  - "Order your next drink in a British accent"
  - "Do your best impression of a coffee machine"
  - "Pretend to be a food critic reviewing your pastry"

### 🎯 Game Mechanics

1. **Mode Selection**: Choose between Couples or Friends mode
2. **Rules Screen**: Clear explanation of how to play
3. **Random Card Generation**: Each round presents a random Truth or Dare
4. **Skip Feature**: One skip allowed per game
5. **Card Tracking**: No repeated cards until all have been shown
6. **Auto-Reset**: When all cards are used, the pool refreshes

### ☕ Coffee Shop Integration

- **Café-Safe Content**: All dares can be performed while seated at a table
- **No Disruption**: Designed to be playful without disturbing other customers
- **Coffee Elements**: Integrated coffee shop themes (cups, barista, pastries, etc.)
- **Atmosphere**: Encourages connection and conversation in a cozy setting

### 🎨 Design Features

- **Beautiful UI**: Gradient cards with smooth animations
- **Mode-Specific Colors**:
  - Couples Mode: Pink/Red gradients
  - Friends Mode: Blue/Green gradients
- **Card Types**:
  - Truth cards: Blue/Pink tones
  - Dare cards: Green/Purple tones
- **Smooth Transitions**: Card flip animations when changing challenges
- **Decorative Elements**: Floating coffee cups and sparkles
- **Responsive Design**: Optimized for mobile portrait mode

### 📝 Content Library

Each mode includes:
- **20 Unique Truths**
- **20 Unique Dares**
- **Total: 80 prompts** across both modes

All content is:
✅ Coffee shop friendly
✅ Respectful and appropriate
✅ Fun and engaging
✅ Short and clear
✅ Designed for conversation

## Technical Implementation

### Files Created/Modified

1. **New File**: `src/scenes/SipOrSpill.tsx`
   - Complete game component with all logic
   - Mode selection, rules, and gameplay screens
   - Card randomization and tracking system
   - Skip functionality

2. **Modified**: `src/scenes/GamesMenu.tsx`
   - Added "Sip or Spill ☕" menu item
   - Pink/red gradient with heart icon
   - "Social" badge

3. **Modified**: `src/App.tsx`
   - Imported SipOrSpill component
   - Added 'sip-or-spill' to view state
   - Added navigation handler
   - Added render logic

### Key Technologies Used

- **React**: Component-based architecture
- **TypeScript**: Type-safe implementation
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icons
- **Tailwind CSS**: Utility-first styling

## How to Play

1. **Launch**: Click "Sip or Spill ☕" from the games menu
2. **Choose Mode**: Select Couples ❤️ or Friends 🧑‍🤝‍🧑
3. **Read Rules**: Review the game instructions
4. **Start Playing**: Click "Let's Play! ☕"
5. **Complete Challenges**: Answer truths or complete dares
6. **Next Round**: Click "Next Challenge" to continue
7. **Skip Option**: Use your one skip if needed
8. **Reset**: Start over with a new mode anytime

## User Experience

### Navigation Flow
```
Games Menu
    ↓
Mode Selection (Couples/Friends)
    ↓
Rules Screen
    ↓
Gameplay (Truth/Dare Cards)
    ↓
Next Challenge / Skip / Reset
```

### Visual Hierarchy
- Clear back buttons on every screen
- Mode indicator always visible during gameplay
- Skip counter shows remaining skips
- Prominent action buttons
- Helpful footer tips

## Content Examples

### Couples Mode Examples

**Romantic Truths**:
- "What's your favorite memory of us together?"
- "What song reminds you of me and why?"
- "What's your idea of a perfect date with me?"

**Sweet Dares**:
- "Give me three genuine compliments"
- "Tell me why you chose to be here with me today"
- "Create a secret handshake with me right now"

### Friends Mode Examples

**Funny Truths**:
- "What's your most unpopular opinion?"
- "What's the longest you've gone without showering?"
- "What's your most embarrassing autocorrect fail?"

**Silly Dares**:
- "Speak in rhymes for the next 2 minutes"
- "Do a silent dance in your seat for 15 seconds"
- "Narrate what you're doing like a nature documentary"

## Safety & Appropriateness

✅ **All content is**:
- Family-friendly
- Respectful
- Non-vulgar
- Café-appropriate
- Designed for public spaces
- Focused on connection and fun

❌ **No content includes**:
- Inappropriate suggestions
- Loud or disruptive activities
- Anything that would disturb others
- Unsafe challenges
- Vulgar or offensive material

## Future Enhancement Ideas

- Add more modes (Family, Coworkers, etc.)
- Expand content library with seasonal themes
- Add difficulty levels
- Include achievement system
- Add custom card creation
- Multiplayer turn-taking
- Timer challenges
- Sound effects for card reveals

## Development Status

✅ **Completed**:
- Full game implementation
- Two complete game modes
- 80 unique prompts
- Beautiful UI with animations
- Integration with games menu
- Skip functionality
- Card tracking system
- Rules screen
- Mode selection
- Responsive design

🚀 **Ready to Play**: The game is fully functional and integrated into the Square Coffee games menu!

## Running the Game

The development server is running at: `http://localhost:5173/`

To access the game:
1. Open the URL in your browser
2. Click on "Sip or Spill ☕" (second game in the menu)
3. Choose your mode and start playing!

---

**Made with ☕ and ❤️ for Square Coffee**
