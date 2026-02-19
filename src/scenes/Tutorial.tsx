/**
 * Square Coffee - Tutorial Component
 * Onboarding tutorial for the main cooking game
 */

import { useState, useEffect } from 'react';
import { ChevronRight, Lightbulb, Users, Clock, Zap, Star, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { THEME } from '@/constants/gameConfig';
import { useTranslation } from 'react-i18next';

interface TutorialProps {
  onStart: () => void;
  onSkip: () => void;
}

const TUTORIAL_STEPS = [
  {
    key: '1',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    key: '2',
    icon: Zap,
    color: 'bg-purple-500',
  },
  {
    key: '3',
    icon: Star,
    color: 'bg-amber-500',
  },
  {
    key: '4',
    icon: Clock,
    color: 'bg-red-500',
  },
  {
    key: '5',
    icon: Flame,
    color: 'bg-orange-500',
  },
  {
    key: '6',
    icon: Lightbulb,
    color: 'bg-green-500',
  },
];

export function Tutorial({ onStart, onSkip }: TutorialProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStart();
    }
  };

  const step = TUTORIAL_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div
      className="w-full h-full flex flex-col p-4 md:p-6 justify-center relative overflow-hidden"
      style={{ 
        background: THEME.bgLight,
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0) 70%),
          linear-gradient(${THEME.woodLight}15 1px, transparent 1px),
          linear-gradient(90deg, ${THEME.woodLight}15 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px'
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-10 left-8 w-24 h-24 bg-amber-400/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-8 w-32 h-32 bg-orange-300/10 rounded-full blur-2xl" />

      {/* Header */}
      <div
        className={`
          text-center mb-6
          transition-all duration-500
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        `}
      >
        <h2
          className="text-2xl md:text-3xl font-bold mb-1"
          style={{ color: THEME.coffeeBrown }}
        >
          {t('tutorial.title')}
        </h2>
        <p
          className="text-sm"
          style={{ color: THEME.textMedium }}
        >
          {t('tutorial.subtitle')}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {TUTORIAL_STEPS.map((s, i) => (
          <div
            key={s.key}
            className={`
              h-2 rounded-full transition-all duration-300
              ${i === currentStep ? 'w-8' : 'w-2'}
              ${i <= currentStep ? step.color : 'bg-gray-300'}
            `}
          />
        ))}
      </div>

      {/* Main card */}
      <div
        className={`
          flex-1 flex flex-col items-center justify-center
          transition-all duration-500
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        {/* Icon circle */}
        <div
          className={`
            w-24 h-24 rounded-3xl ${step.color}
            flex items-center justify-center mb-6
            shadow-lg transform transition-all duration-300
            ${currentStep % 2 === 0 ? 'rotate-3' : '-rotate-3'}
          `}
          style={{
            boxShadow: `0 10px 30px -5px ${step.color.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : step.color.includes('purple') ? 'rgba(147, 51, 234, 0.4)' : step.color.includes('amber') ? 'rgba(245, 158, 11, 0.4)' : step.color.includes('red') ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`
          }}
        >
          <StepIcon className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h3
          className="text-xl md:text-2xl font-bold mb-3 text-center"
          style={{ color: THEME.coffeeBrown }}
        >
          {t(`tutorial.steps.${currentStep + 1}_title`)}
        </h3>

        {/* Description */}
        <p
          className="text-sm md:text-base text-center max-w-xs leading-relaxed px-4"
          style={{ color: THEME.textMedium }}
        >
          {t(`tutorial.steps.${currentStep + 1}_desc`)}
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="mt-auto flex flex-col gap-3">
        <Button
          onClick={handleNext}
          className={`
            w-full h-14 text-lg font-bold rounded-xl shadow-lg
            transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
          `}
          style={{
            background: `linear-gradient(135deg, ${THEME.mint} 0%, ${THEME.mintDark} 100%)`,
            color: THEME.espresso
          }}
        >
          {currentStep === TUTORIAL_STEPS.length - 1 ? (
            <>
              {t('tutorial.start')}
              <Star className="w-5 h-5 ml-2 fill-current" />
            </>
          ) : (
            <>
              <ChevronRight className="w-5 h-5 mr-2" />
              Next
            </>
          )}
        </Button>

        <Button
          onClick={onSkip}
          variant="ghost"
          className="w-full h-10 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          {t('tutorial.skip')}
        </Button>
      </div>

      {/* Tips section at bottom */}
      {currentStep === TUTORIAL_STEPS.length - 1 && (
        <div
          className="mt-4 p-3 rounded-xl"
          style={{ background: THEME.bgCream }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4" style={{ color: THEME.coral }} />
            <span className="text-xs font-bold" style={{ color: THEME.textDark }}>
              {t('tutorial.tips.title')}
            </span>
          </div>
          <ul className="space-y-1">
            {['tip1', 'tip2', 'tip3'].map((tip) => (
              <li
                key={tip}
                className="text-xs leading-relaxed"
                style={{ color: THEME.textMedium }}
              >
                • {t(`tutorial.tips.${tip}`)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
