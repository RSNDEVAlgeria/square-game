/**
 * Haptic Feedback Hook
 * Provides vibration feedback for mobile devices
 */

import { useCallback } from 'react';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning';

export function useHaptic() {
    const vibrate = useCallback((pattern: number | number[]) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }, []);

    const hapticFeedback = useCallback((type: HapticType = 'light') => {
        const patterns: Record<HapticType, number | number[]> = {
            light: 10,
            medium: 20,
            heavy: 30,
            success: [10, 50, 10],
            error: [20, 100, 20],
            warning: [15, 75, 15]
        };

        vibrate(patterns[type]);
    }, [vibrate]);

    return { hapticFeedback, vibrate };
}
