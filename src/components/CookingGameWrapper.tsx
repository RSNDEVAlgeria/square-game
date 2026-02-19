/**
 * Cooking Game Wrapper Component
 * Wraps all cooking game scenes and manages the internal routing
 */

import { MainMenu } from '@/scenes/MainMenu';
import { WaiterSelection } from '@/scenes/WaiterSelection';
import { Tutorial } from '@/scenes/Tutorial';
import { Gameplay } from '@/scenes/Gameplay';
import { GameOver } from '@/scenes/GameOver';
import { Shop } from '@/components/Shop';
import { PauseOverlay, SettingsOverlay } from '@/components/Overlays';
import type { GameState, Customer, FloatingText, PlateState, ServeResult, ActivePowerUp } from '@/types/game';

interface CookingGameWrapperProps {
  gameState: GameState;
  plate: PlateState;
  customers: Customer[];
  floatingTexts: FloatingText[];
  activePowerUps: ActivePowerUp[];
  isShopOpen: boolean;
  isSettingsOpen: boolean;
  playSound: (sound: 'click' | 'success' | 'error' | 'plateClear' | 'customerArrive') => void;
  handlePlay: () => void;
  handleOpenShop: () => void;
  handleCloseShop: () => void;
  handleOpenSettings: () => void;
  handleCloseSettings: () => void;
  handleWaiterSelect: (waiterId: number) => void;
  handleStartGame: () => void;
  handleTutorialStart: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleRestart: () => void;
  handleMainMenu: () => void;
  handlePlayAgain: () => void;
  handleAddToPlate: (foodId: string) => void;
  handleClearPlate: () => void;
  handleServeCustomer: (customerId: string) => ServeResult;
  handleAddFloatingText: (x: number, y: number, text: string, color: string) => void;
  activatePowerUp: (powerUpId: string) => boolean;
  purchaseUpgrade: (upgradeId: string) => boolean;
  purchasePowerUp: (powerUpId: string) => boolean;
  toggleSound: () => void;
}

export default function CookingGameWrapper(props: CookingGameWrapperProps) {
  const {
    gameState,
    plate,
    customers,
    floatingTexts,
    activePowerUps,
    isShopOpen,
    isSettingsOpen,
    handlePlay,
    handleOpenShop,
    handleCloseShop,
    handleOpenSettings,
    handleCloseSettings,
    handleWaiterSelect,
    handleStartGame,
    handleTutorialStart,
    handlePause,
    handleResume,
    handleRestart,
    handleMainMenu,
    handlePlayAgain,
    handleAddToPlate,
    handleClearPlate,
    handleServeCustomer,
    handleAddFloatingText,
    activatePowerUp,
    purchaseUpgrade,
    purchasePowerUp,
    toggleSound
  } = props;

  return (
    <>
      {/* Main Menu Scene */}
      {gameState.currentScene === 'main-menu' && (
        <MainMenu
          onPlay={handlePlay}
          onShop={handleOpenShop}
          onSettings={handleOpenSettings}
          onBack={() => {}}
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

      {/* Tutorial Scene */}
      {gameState.currentScene === 'tutorial' && (
        <Tutorial
          onStart={handleTutorialStart}
          onSkip={handleTutorialStart}
        />
      )}

      {/* Gameplay Scene */}
      {gameState.currentScene === 'gameplay' && (
        <Gameplay
          score={gameState.score}
          money={gameState.money}
          stamina={gameState.stamina}
          maxStamina={gameState.maxStamina}
          comboBar={gameState.comboBar}
          maxComboBar={gameState.maxComboBar}
          isRushActive={gameState.isRushActive}
          rushTimer={gameState.rushTimer}
          rushCooldownTimer={gameState.rushCooldownTimer}
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
          onPlaySound={props.playSound}
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
        onPlaySound={props.playSound}
      />
    </>
  );
}
