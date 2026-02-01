/**
 * Square Coffee - Game Over Scene
 * Display final stats and options to restart
 */

import { useEffect, useState } from 'react';
import { RotateCcw, Home, Trophy, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { THEME } from '@/constants/gameConfig';

interface GameOverProps {
  score: number;
  money: number;
  customersServed: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export function GameOver({ score, money, customersServed, onPlayAgain, onMainMenu }: GameOverProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedMoney, setAnimatedMoney] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate numbers counting up
    const scoreInterval = setInterval(() => {
      setAnimatedScore(prev => {
        const next = prev + Math.ceil(score / 30);
        return next >= score ? score : next;
      });
    }, 30);

    const moneyInterval = setInterval(() => {
      setAnimatedMoney(prev => {
        const next = prev + Math.ceil(money / 30);
        return next >= money ? money : next;
      });
    }, 30);

    return () => {
      clearInterval(scoreInterval);
      clearInterval(moneyInterval);
    };
  }, [score, money]);

  // Determine performance message
  const getPerformanceMessage = () => {
    if (score > 1000) return { title: '🏆 Coffee Master!', color: THEME.gold };
    if (score > 500) return { title: '🌟 Amazing Work!', color: THEME.mint };
    if (score > 200) return { title: '😊 Good Job!', color: THEME.success };
    return { title: '😅 Try Again!', color: THEME.warning };
  };

  const performance = getPerformanceMessage();

  return (
    <div 
      className="w-full h-full flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}
    >
      <div 
        className={`
          w-full max-w-sm rounded-3xl p-6 shadow-2xl
          transition-all duration-500
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
        `}
        style={{ background: 'white' }}
      >
        {/* Title */}
        <h2 
          className="text-2xl font-bold text-center mb-6"
          style={{ color: performance.color }}
        >
          {performance.title}
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Score */}
          <div 
            className="p-4 rounded-2xl text-center"
            style={{ background: THEME.bgCream }}
          >
            <Trophy className="w-6 h-6 mx-auto mb-2" style={{ color: THEME.gold }} />
            <div 
              className="text-2xl font-bold"
              style={{ color: THEME.coffeeBrown }}
            >
              {animatedScore.toLocaleString()}
            </div>
            <div 
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: THEME.textLight }}
            >
              Score
            </div>
          </div>

          {/* Money */}
          <div 
            className="p-4 rounded-2xl text-center"
            style={{ background: THEME.bgCream }}
          >
            <DollarSign className="w-6 h-6 mx-auto mb-2" style={{ color: THEME.success }} />
            <div 
              className="text-2xl font-bold"
              style={{ color: THEME.coffeeBrown }}
            >
              ${animatedMoney.toLocaleString()}
            </div>
            <div 
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: THEME.textLight }}
            >
              Earned
            </div>
          </div>

          {/* Customers Served */}
          <div 
            className="col-span-2 p-4 rounded-2xl flex items-center justify-center gap-4"
            style={{ background: THEME.bgCream }}
          >
            <Users className="w-6 h-6" style={{ color: THEME.mint }} />
            <div>
              <div 
                className="text-xl font-bold"
                style={{ color: THEME.coffeeBrown }}
              >
                {customersServed}
              </div>
              <div 
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: THEME.textLight }}
              >
                Customers Served
              </div>
            </div>
            <TrendingUp className="w-5 h-5 ml-2" style={{ color: THEME.success }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onPlayAgain}
            className="h-12 text-base font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${THEME.mint} 0%, ${THEME.mintDark} 100%)`,
              color: THEME.espresso
            }}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>

          <Button
            onClick={onMainMenu}
            variant="secondary"
            className="h-12 text-base font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: THEME.cream,
              color: THEME.coffeeBrown
            }}
          >
            <Home className="w-5 h-5 mr-2" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
