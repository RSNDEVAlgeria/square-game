/**
 * Square Coffee - Main Menu Scene
 * Entry point with animated title and navigation
 */

import { useEffect, useState } from 'react';
import { Coffee, Play, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { THEME } from '@/constants/gameConfig';
import { useTranslation } from 'react-i18next';

interface MainMenuProps {
  onPlay: () => void;
  onShop: () => void;
  onSettings: () => void;
  onBack?: () => void;
}

export function MainMenu({ onPlay, onShop, onSettings }: MainMenuProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: THEME.bgCream,
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0) 70%),
          linear-gradient(${THEME.woodLight}15 1px, transparent 1px),
          linear-gradient(90deg, ${THEME.woodLight}15 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px'
      }}
    >
      {/* Decorative Floating Circles (Abstract Steam/Beans) */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-700/5 rounded-full blur-2xl animate-bounce-in" />

      {/* Hero Card */}
      <div
        className={`
          relative z-10 w-full max-w-sm
          flex flex-col items-center
          transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-y-10'}
        `}
      >
        {/* Main Logo Badge */}
        <div
          className="w-64 h-64 rounded-full flex items-center justify-center mb-8 relative"
          style={{
            background: `linear-gradient(135deg, ${THEME.woodMedium}, ${THEME.woodDark})`,
            boxShadow: `
              0 20px 40px -10px rgba(0,0,0,0.4),
              inset 0 2px 4px rgba(255,255,255,0.3)
            `,
            border: `8px solid ${THEME.woodDark}`
          }}
        >
          {/* Inner ring */}
          <div className="absolute inset-2 border-2 border-dashed border-amber-200/30 rounded-full animate-[spin_10s_linear_infinite]" />

          <div className="text-center transform -rotate-6">
            <div className="relative">
              <Coffee
                size={80}
                className="text-amber-100 mx-auto drop-shadow-md animate-bounce-in"
                strokeWidth={1.5}
              />
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
            </div>

            <h1
              className="text-4xl font-extrabold text-amber-50 mt-2 tracking-tighter"
              style={{
                fontFamily: 'serif',
                textShadow: '2px 2px 0px rgba(0,0,0,0.2)'
              }}
            >
              SQUARE
              <span className="block text-2xl font-light tracking-widest text-[#E6C68B] mt-1">COFFEE</span>
            </h1>
          </div>
        </div>

        {/* Menu Actions */}
        <div className="w-full space-y-4">
          <Button
            onClick={onPlay}
            className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${THEME.mint}, ${THEME.mintDark})`,
              color: THEME.espresso,
              border: `2px solid ${THEME.espresso}20`
            }}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="relative flex items-center justify-center gap-2">
              <Play className="w-6 h-6 fill-current" />
              <span>{t('mainMenu.play').toUpperCase()}</span>
            </div>
          </Button>

          <Button
            onClick={onShop}
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${THEME.coral}, #FF6B9D)`,
              color: 'white',
              border: `2px solid rgba(255,255,255,0.3)`
            }}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="relative flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>{t('mainMenu.shop').toUpperCase()}</span>
            </div>
          </Button>

          <Button
            onClick={onSettings}
            variant="outline"
            className="w-full h-12 text-md font-bold rounded-2xl border-2 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              borderColor: `${THEME.woodLight}40`,
              color: THEME.textMedium
            }}
          >
            {t('mainMenu.settings')}
          </Button>

          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="w-full h-10 text-xs font-medium text-amber-900/40 hover:text-amber-900 hover:bg-amber-900/5 gap-2"
          >
            <ArrowLeft size={14} />
            {t('mainMenu.backToGames')}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs font-bold tracking-widest text-amber-900/20 uppercase">
        Est. 2026 • Premium Brews
      </div>
    </div>
  );
}
