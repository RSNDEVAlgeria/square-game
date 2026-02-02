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
        // Happy ascending tone - enhanced
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6
        gainNode.gain.setValueAtTime(0.35, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        oscillator.start(now);
        oscillator.stop(now + 0.35);
        break;

      case 'error':
        // Low descending tone - more pronounced
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(250, now);
        oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.25);
        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        oscillator.start(now);
        oscillator.stop(now + 0.35);
        break;

      case 'click':
        // Short mid-tone - crisper
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, now);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        oscillator.start(now);
        oscillator.stop(now + 0.06);
        break;

      case 'customerArrive':
        // Gentle bell-like sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        oscillator.start(now);
        oscillator.stop(now + 0.25);
        break;

      case 'combo':
        // Exciting ascending arpeggio
        const playNote = (freq: number, start: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, now + start);
          gain.gain.setValueAtTime(0.25, now + start);
          gain.gain.exponentialRampToValueAtTime(0.01, now + start + duration);
          osc.start(now + start);
          osc.stop(now + start + duration);
        };
        playNote(523.25, 0, 0.1);   // C5
        playNote(659.25, 0.08, 0.1); // E5
        playNote(783.99, 0.16, 0.15); // G5
        playNote(1046.5, 0.24, 0.25);  // C6
        break;

      case 'gameOver':
        // Sad descending sequence
        const playSadNote = (freq: number, start: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
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
        playSadNote(293.66, 0.5, 0.5);  // D4
        break;

      case 'plateClear':
        // Quick swish sound
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.12);
        gainNode.gain.setValueAtTime(0.18, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        oscillator.start(now);
        oscillator.stop(now + 0.18);
        break;

      case 'staminaLow':
        // Warning pulse
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, now);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;

      case 'powerup':
        // Magical ascending sparkle
        const playSparkle = (freq: number, start: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, now + start);
          gain.gain.setValueAtTime(0.2, now + start);
          gain.gain.exponentialRampToValueAtTime(0.01, now + start + 0.15);
          osc.start(now + start);
          osc.stop(now + start + 0.15);
        };
        playSparkle(659.25, 0);      // E5
        playSparkle(783.99, 0.05);   // G5
        playSparkle(1046.5, 0.1);    // C6
        playSparkle(1318.5, 0.15);   // E6
        break;

      case 'special':
        // Special customer arrival - fanfare
        const playFanfare = (freq: number, start: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, now + start);
          gain.gain.setValueAtTime(0.25, now + start);
          gain.gain.exponentialRampToValueAtTime(0.01, now + start + duration);
          osc.start(now + start);
          osc.stop(now + start + duration);
        };
        playFanfare(523.25, 0, 0.2);    // C5
        playFanfare(659.25, 0.15, 0.2); // E5
        playFanfare(783.99, 0.3, 0.3);  // G5
        break;

      case 'achievement':
        // Achievement unlock - triumphant
        const playTriumph = (freq: number, start: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, now + start);
          gain.gain.setValueAtTime(0.3, now + start);
          gain.gain.exponentialRampToValueAtTime(0.01, now + start + duration);
          osc.start(now + start);
          osc.stop(now + start + duration);
        };
        playTriumph(523.25, 0, 0.15);    // C5
        playTriumph(659.25, 0.12, 0.15); // E5
        playTriumph(783.99, 0.24, 0.15); // G5
        playTriumph(1046.5, 0.36, 0.4);  // C6 - held longer
        break;

      case 'coin':
        // Coin collect sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(988, now);
        oscillator.frequency.exponentialRampToValueAtTime(1319, now + 0.05);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;
    }
  }, [soundEnabled, initAudio]);

  return { playSound, initAudio };
}

