/**
 * Square Coffee - Main App Component
 * Café management game rebuilt with React
 */

import { useCallback, useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAudio } from '@/hooks/useAudio';
import { GamesMenu } from '@/scenes/GamesMenu';
import { MainMenu } from '@/scenes/MainMenu';
import { WaiterSelection } from '@/scenes/WaiterSelection';
import { Gameplay } from '@/scenes/Gameplay';
import { GameOver } from '@/scenes/GameOver';
import { XO } from '@/scenes/XO';
import { Sudoku } from '@/scenes/Sudoku';
import { Shop } from '@/components/Shop';
import { PauseOverlay, SettingsOverlay } from '@/components/Overlays';
import { Toaster } from '@/components/ui/sonner';

function App() {
  // Game state management
  const {
    gameState,
    plate,
    customers,
    floatingTexts,
    switchScene,
    selectWaiter,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    addToPlate,
    clearPlate,
    serveCustomer,
    addFloatingText,
    toggleSound,
    purchaseUpgrade,
    purchasePowerUp,
    activatePowerUp,
    activePowerUps
  } = useGameState();

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'games-menu' | 'cooking' | 'xo' | 'sudoku'>('games-menu');

  // Audio management
  const { playSound, initAudio } = useAudio(gameState.soundEnabled);

  // Initialize audio on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio();
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [initAudio]);

  // ===== EVENT HANDLERS =====

  const handlePlay = useCallback(() => {
    playSound('click');
    switchScene('waiter-selection');
  }, [playSound, switchScene]);

  const handleOpenShop = useCallback(() => {
    playSound('click');
    setIsShopOpen(true);
  }, [playSound]);

  const handleCloseShop = useCallback(() => {
    playSound('click');
    setIsShopOpen(false);
  }, [playSound]);

  const handleOpenSettings = useCallback(() => {
    playSound('click');
    setIsSettingsOpen(true);
  }, [playSound]);

  const handleCloseSettings = useCallback(() => {
    playSound('click');
    setIsSettingsOpen(false);
  }, [playSound]);




  const handleWaiterSelect = useCallback((waiterId: number) => {
    playSound('click');
    selectWaiter(waiterId);
  }, [playSound, selectWaiter]);

  const handleStartGame = useCallback(() => {
    playSound('click');
    startGame();
  }, [playSound, startGame]);

  const handlePause = useCallback(() => {
    playSound('click');
    pauseGame();
  }, [playSound, pauseGame]);

  const handleResume = useCallback(() => {
    playSound('click');
    resumeGame();
  }, [playSound, resumeGame]);

  const handleRestart = useCallback(() => {
    playSound('click');
    startGame();
  }, [playSound, startGame]);

  const handleMainMenu = useCallback(() => {
    playSound('click');
    resetGame();
    switchScene('main-menu');
  }, [playSound, resetGame, switchScene]);

  const handlePlayAgain = useCallback(() => {
    playSound('click');
    startGame();
  }, [playSound, startGame]);

  const handleAddToPlate = useCallback((foodId: string) => {
    addToPlate(foodId);
  }, [addToPlate]);

  const handleClearPlate = useCallback(() => {
    clearPlate();
  }, [clearPlate]);

  const handleServeCustomer = useCallback((customerId: string) => {
    return serveCustomer(customerId);
  }, [serveCustomer]);

  const handleAddFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    addFloatingText(x, y, text, color);
  }, [addFloatingText]);

  const handleGameNavigate = useCallback((gameId: string) => {
    playSound('click');
    if (gameId === 'cooking') {
      setCurrentView('cooking');
    } else if (gameId === 'xo') {
      setCurrentView('xo');
    } else if (gameId === 'sudoku') {
      setCurrentView('sudoku');
    }
  }, [playSound]);

  const handleBackToGamesMenu = useCallback(() => {
    playSound('click');
    setCurrentView('games-menu');
  }, [playSound]);

  // ===== RENDER =====
  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Game Container - Mobile-optimized portrait */}
      <div
        className="relative w-full h-full max-w-md mx-auto overflow-hidden shadow-2xl"
        style={{
          maxHeight: '900px',
          aspectRatio: '9/16'
        }}
      >
        {/* Games Menu - Initial Landing Page */}
        {currentView === 'games-menu' && (
          <GamesMenu onNavigate={handleGameNavigate} />
        )}

        {/* XO Game */}
        {currentView === 'xo' && (
          <XO onBack={handleBackToGamesMenu} />
        )}

        {/* Sudoku Game */}
        {currentView === 'sudoku' && (
          <Sudoku onBack={handleBackToGamesMenu} />
        )}

        {/* Cooking Game Scenes - Only show when currentView is 'cooking' */}
        {currentView === 'cooking' && (
          <>
            {/* Main Menu Scene */}
            {gameState.currentScene === 'main-menu' && (
              <MainMenu
                onPlay={handlePlay}
                onShop={handleOpenShop}
                onSettings={handleOpenSettings}
                onBack={handleBackToGamesMenu}
              />
            )}

            {/* Waiter Selection Scene */}
            {gameState.currentScene === 'waiter-selection' && (
              <WaiterSelection
                onSelect={handleWaiterSelect}
                onStart={handleStartGame}
                selectedWaiter={gameState.selectedWaiter}
              />
            )}

            {/* Gameplay Scene */}
            {gameState.currentScene === 'gameplay' && (
              <Gameplay
                score={gameState.score}
                money={gameState.money}
                stamina={gameState.stamina}
                maxStamina={gameState.maxStamina}
                combo={gameState.combo}
                customers={customers}
                plateItems={plate.items}
                floatingTexts={floatingTexts}
                inventory={gameState.inventory}
                upgradeLevels={gameState.upgrades}
                activePowerUps={activePowerUps}
                onPause={handlePause}
                onAddToPlate={handleAddToPlate}
                onClearPlate={handleClearPlate}
                onServeCustomer={handleServeCustomer}
                onAddFloatingText={handleAddFloatingText}
                onActivatePowerUp={activatePowerUp}
                onPlaySound={playSound}
              />
            )}

            {/* Game Over Scene */}
            {gameState.currentScene === 'game-over' && (
              <GameOver
                score={gameState.score}
                money={gameState.money}
                customersServed={gameState.customersServed}
                onPlayAgain={handlePlayAgain}
                onMainMenu={handleMainMenu}
              />
            )}

            {/* Pause Overlay */}
            <PauseOverlay
              isOpen={gameState.isPaused && !gameState.isGameOver && gameState.currentScene === 'gameplay'}
              onResume={handleResume}
              onRestart={handleRestart}
              onMainMenu={handleMainMenu}
            />

            {/* Settings Overlay - shown on main menu */}
            <SettingsOverlay
              isOpen={isSettingsOpen}
              soundEnabled={gameState.soundEnabled}
              onToggleSound={toggleSound}
              onClose={handleCloseSettings}
            />

            {/* Shop Modal */}
            <Shop
              isOpen={isShopOpen}
              onClose={handleCloseShop}
              money={gameState.money}
              totalMoneyEarned={gameState.totalMoneyEarned}
              upgradeLevels={gameState.upgrades}
              onPurchaseUpgrade={purchaseUpgrade}
              onPurchasePowerUp={purchasePowerUp}
              onPlaySound={playSound}
            />
          </>
        )}

        {/* Toast notifications */}
        <Toaster />
      </div>
    </div>
  );
}

export default App;
