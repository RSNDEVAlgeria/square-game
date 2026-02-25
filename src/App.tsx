/**
 * Square Coffee - Main App Component
 * Café management game rebuilt with React
 */

import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useAudio } from '@/hooks/useAudio';
import { GamesMenu } from '@/scenes/GamesMenu';
import { XO } from '@/scenes/XO';
import { Sudoku } from '@/scenes/Sudoku';
import { SipOrSpill } from '@/scenes/SipOrSpill';
import { ChessLanding } from '@/scenes/chess/ChessLanding';
import { Toaster } from '@/components/ui/sonner';
import CookingGameWrapper from '@/components/CookingGameWrapper';
import { CinematicLaunchScreen } from '@/scenes/CinematicLaunchScreen';

function App() {
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
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);

  const { playSound, initAudio } = useAudio(gameState.soundEnabled);

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
    switchScene('tutorial');
  }, [playSound, switchScene]);

  const handleTutorialStart = useCallback(() => {
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

  if (showLaunchScreen) {
    return (
      <CinematicLaunchScreen onComplete={() => setShowLaunchScreen(false)} />
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      <div
        className="relative w-full h-full max-w-md mx-auto overflow-hidden shadow-2xl"
        style={{
          maxHeight: '900px',
          aspectRatio: '9/16'
        }}
      >
        <Routes>
          <Route path="/" element={<GamesMenu />} />
          <Route path="/maingame/*" element={
            <CookingGameWrapper
              gameState={gameState}
              plate={plate}
              customers={customers}
              floatingTexts={floatingTexts}
              activePowerUps={activePowerUps}
              isShopOpen={isShopOpen}
              isSettingsOpen={isSettingsOpen}
              playSound={playSound}
              handlePlay={handlePlay}
              handleOpenShop={handleOpenShop}
              handleCloseShop={handleCloseShop}
              handleOpenSettings={handleOpenSettings}
              handleCloseSettings={handleCloseSettings}
              handleWaiterSelect={handleWaiterSelect}
              handleStartGame={handleStartGame}
              handleTutorialStart={handleTutorialStart}
              handlePause={handlePause}
              handleResume={handleResume}
              handleRestart={handleRestart}
              handleMainMenu={handleMainMenu}
              handlePlayAgain={handlePlayAgain}
              handleAddToPlate={handleAddToPlate}
              handleClearPlate={handleClearPlate}
              handleServeCustomer={handleServeCustomer}
              handleAddFloatingText={handleAddFloatingText}
              activatePowerUp={activatePowerUp}
              purchaseUpgrade={purchaseUpgrade}
              purchasePowerUp={purchasePowerUp}
              toggleSound={toggleSound}
            />
          } />
          <Route path="/xo" element={<XO onBack={() => {}} />} />
          <Route path="/sudoku" element={<Sudoku onBack={() => {}} />} />
          <Route path="/siporspill" element={<SipOrSpill onBack={() => {}} />} />
          <Route path="/chess" element={<ChessLanding onBack={() => {}} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
