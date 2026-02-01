/**
 * Square Coffee - Audio Manager Hook
 * Procedural sound effects using Web Audio API
 */

import { useRef, useCallback } from 'react';
import type { GameSound } from '@/types/game';

export function useAudio(soundEnabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first use
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
  }, []);

  // Play a sound effect
  const playSound = useCallback((soundName: GameSound) => {
    if (!soundEnabled) return;
    
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Create oscillator and gain node
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (soundName) {
      case 'success':
        // Happy ascending tone
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.exponentialRampToValueAtTime(1046.5, now + 0.1); // C6
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'error':
        // Low descending tone
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'click':
        // Short mid-tone
        oscillator.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        oscillator.start(now);
        oscillator.stop(now + 0.08);
        break;

      case 'customerArrive':
        // Gentle bell-like sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case 'combo':
        // Exciting ascending arpeggio
        const playNote = (freq: number, start: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, now + start);
          gain.gain.setValueAtTime(0.2, now + start);
          gain.gain.exponentialRampToValueAtTime(0.01, now + start + duration);
          osc.start(now + start);
          osc.stop(now + start + duration);
        };
        playNote(523.25, 0, 0.1);   // C5
        playNote(659.25, 0.08, 0.1); // E5
        playNote(783.99, 0.16, 0.15); // G5
        playNote(1046.5, 0.24, 0.2);  // C6
        break;

      case 'gameOver':
        // Sad descending sequence
        const playSadNote = (freq: number, start: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, now + start);
          gain.gain.setValueAtTime(0.25, now + start);
          gain.gain.exponentialRampToValueAtTime(0.01, now + start + duration);
          osc.start(now + start);
          osc.stop(now + start + duration);
        };
        playSadNote(440, 0, 0.3);    // A4
        playSadNote(349.23, 0.25, 0.3); // F4
        playSadNote(293.66, 0.5, 0.4);  // D4
        break;

      case 'plateClear':
        // Quick swish sound
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;

      case 'staminaLow':
        // Warning pulse
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, now);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;
    }
  }, [soundEnabled, initAudio]);

  return { playSound, initAudio };
}
