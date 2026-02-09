# Block Blast - Random Starting Patterns 🎲

## Feature Overview
Each game of Block Blast now begins with a **unique random starting configuration**! This adds variety and replayability to every game session.

## The 5 Starting Patterns

### 1. Random Scatter 🎯
- **Description**: 8-15 blocks placed randomly across the grid
- **Strategy**: Most unpredictable pattern, requires adaptive thinking
- **Difficulty**: Medium
- **Example**: Blocks scattered throughout the grid with no particular pattern

### 2. Diagonal Lines ↗️
- **Description**: 1-2 diagonal lines of 3-5 blocks each
- **Strategy**: Creates natural clearing opportunities along diagonals
- **Difficulty**: Easy-Medium
- **Example**: Blocks arranged in diagonal lines from top-left to bottom-right

### 3. Corner Clusters 📐
- **Description**: Blocks grouped in 1-2 corners of the grid
- **Strategy**: Leaves the center open for strategic placement
- **Difficulty**: Easy
- **Example**: 2-4 blocks clustered in opposite corners

### 4. Checkerboard Pattern ♟️
- **Description**: Sparse checkerboard pattern (15% fill rate)
- **Strategy**: Evenly distributed blocks create balanced challenges
- **Difficulty**: Medium-Hard
- **Example**: Blocks on alternating squares like a checkerboard

### 5. Cross Pattern ✝️
- **Description**: Blocks arranged in horizontal and vertical lines through the center
- **Strategy**: Center is partially filled, forcing edge placements
- **Difficulty**: Medium
- **Example**: Cross shape with 2-3 blocks per arm (70% probability per cell)

## How It Works

### Pattern Selection
```typescript
// Randomly choose one of 5 patterns
const patternType = Math.floor(Math.random() * 5);
```

Each time you start a new game or click "New Game", the system:
1. Randomly selects one of the 5 pattern types
2. Generates the pattern with randomized parameters
3. Places blocks on the grid according to the pattern
4. Ensures the game is playable with the starting configuration

### Randomization Details

Each pattern has built-in randomization:
- **Random Scatter**: Random number of blocks (8-15) in random positions
- **Diagonal Lines**: Random number of lines (1-2), random starting positions, random length (3-5)
- **Corner Clusters**: Random corners selected, random cluster size (2-4 blocks)
- **Checkerboard**: 15% probability for each eligible cell
- **Cross**: Random arm length (2-3), 70% probability for each cell in the cross

## Benefits

### 🎮 Gameplay Variety
Every game feels different and presents unique challenges

### 🧠 Strategic Depth
Different starting patterns require different strategies:
- Scatter patterns need flexible thinking
- Diagonal patterns reward line-clearing setups
- Corner patterns allow center-focused strategies
- Checkerboard patterns test spatial planning
- Cross patterns challenge edge placement skills

### 🔄 Replayability
With 5 base patterns and randomization within each, you'll rarely see the same starting configuration twice

### 🎯 Balanced Difficulty
Patterns are designed to be challenging but fair:
- No pattern creates an immediate game over
- All patterns leave room for strategic play
- Difficulty varies to keep gameplay interesting

## Implementation Details

### Code Location
`src/scenes/BlockBlast.tsx` - Lines 62-158

### Function
```typescript
const generateRandomStartingGrid = (): Grid => {
    // Creates a new grid with one of 5 random patterns
}
```

### Usage
- Called on initial game load
- Called when "New Game" button is clicked
- Called when "Play Again" is clicked after game over

## Tips for Each Pattern

### Random Scatter
- Look for natural line-forming opportunities
- Be flexible with shape placement
- Don't commit to a strategy too early

### Diagonal Lines
- Use the diagonal as a foundation
- Build perpendicular lines to clear multiple at once
- Watch for corner traps

### Corner Clusters
- Utilize the open center space
- Work outward from the center
- Save small shapes for corner cleanup

### Checkerboard
- Plan several moves ahead
- Look for multi-line clearing opportunities
- Use the regular spacing to your advantage

### Cross Pattern
- Start with edge placements
- Work toward the center gradually
- Use the cross arms as anchors for larger clears

---

**Enjoy the variety! Every game is a new puzzle to solve! ☕🧱**
