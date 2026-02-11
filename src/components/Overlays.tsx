/**
 * Square Coffee - Overlay Components
 * Pause menu and settings modal
 */

import { useState, useEffect } from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, X, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { THEME } from '@/constants/gameConfig';
import { useTranslation } from 'react-i18next';

// ===== PAUSE OVERLAY =====
interface PauseOverlayProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function PauseOverlay({ isOpen, onResume, onRestart, onMainMenu }: PauseOverlayProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-500"
      style={{
        background: isVisible ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
        backdropFilter: isVisible ? 'blur(8px)' : 'blur(0px)',
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      <div
        className={`
          w-full max-w-sm mx-4 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden
          transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90'}
        `}
        style={{
          background: `linear-gradient(135deg, ${THEME.bgCream}, #FFF)`,
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.3)'
        }}
      >
        {/* Background decors */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-50 -ml-10 -mb-10" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg mx-auto mb-4 rotate-3">
              <Pause size={32} fill="currentColor" />
            </div>
            <h3
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: THEME.textDark }}
            >
              {t('pause.title')}
            </h3>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-1">{t('pause.title')}</p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={onResume}
              className="h-14 text-lg font-bold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md group relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${THEME.mint} 0%, ${THEME.mintDark} 100%)`,
                color: THEME.espresso
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                <Play className="w-6 h-6 fill-current" />
                {t('pause.resume')}
              </div>
            </Button>

            <Button
              onClick={onRestart}
              variant="outline"
              className="h-14 text-lg font-bold rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:bg-amber-50"
              style={{
                borderColor: `${THEME.woodLight}40`,
                color: THEME.textMedium
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                {t('pause.restart')}
              </div>
            </Button>

            <Button
              onClick={onMainMenu}
              variant="ghost"
              className="h-12 text-base font-medium rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors mt-2"
            >
              <div className="flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                {t('pause.mainMenu')}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SETTINGS OVERLAY =====
interface SettingsOverlayProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClose: () => void;
}

export function SettingsOverlay({ isOpen, soundEnabled, onToggleSound, onClose }: SettingsOverlayProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-500"
      style={{
        background: isVisible ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
        backdropFilter: isVisible ? 'blur(8px)' : 'blur(0px)',
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      <div
        className={`
          w-full max-w-sm mx-4 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden
          transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90'}
        `}
        style={{
          background: `linear-gradient(135deg, ${THEME.bgCream}, #FFF)`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-black/5 hover:bg-black/10"
        >
          <X className="w-4 h-4" style={{ color: THEME.textMedium }} />
        </button>

        <h3
          className="text-2xl font-bold text-center mb-8"
          style={{ color: THEME.coffeeBrown }}
        >
          ⚙ {t('settings.title')}
        </h3>

        <div className="flex flex-col gap-4">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="flex items-center justify-between p-5 rounded-2xl transition-all duration-200 border-2 active:scale-95"
            style={{
              background: 'white',
              borderColor: soundEnabled ? THEME.mint : 'transparent',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${soundEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5" style={{ color: THEME.success }} />
                ) : (
                  <VolumeX className="w-5 h-5" style={{ color: THEME.textLight }} />
                )}
              </div>
              <span
                className="font-bold text-lg"
                style={{ color: THEME.textDark }}
              >
                {t('settings.sound')}
              </span>
            </div>

            {/* Toggle Switch */}
            <div
              className={`
                w-14 h-8 rounded-full relative transition-colors duration-300
                ${soundEnabled ? 'bg-green-500' : 'bg-slate-200'}
              `}
            >
              <div
                className={`
                  absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm
                  transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
                  ${soundEnabled ? 'translate-x-7' : 'translate-x-1'}
                `}
              />
            </div>
          </button>

          {/* Info */}
          <div
            className="p-4 rounded-xl text-center text-xs font-medium tracking-wide opacity-50 uppercase mt-4"
            style={{ color: THEME.textLight }}
          >
            Square Coffee v1.0
          </div>
        </div>
      </div>
    </div>
  );
}
