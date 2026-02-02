/**
 * Particle Effects Component
 * Renders animated particles for visual feedback
 */

import { useEffect, useState } from 'react';
import type { ParticleEffect } from '@/types/enhancedGameplay';

interface ParticleEffectsProps {
    particles: ParticleEffect[];
}

const PARTICLE_EMOJIS: Record<ParticleEffect['type'], string> = {
    star: '⭐',
    coin: '💰',
    heart: '❤️',
    sparkle: '✨'
};

export function ParticleEffects({ particles }: ParticleEffectsProps) {
    return (
        <div className="absolute inset-0 pointer-events-none z-40">
            {particles.map((particle) => (
                <Particle key={particle.id} particle={particle} />
            ))}
        </div>
    );
}

function Particle({ particle }: { particle: ParticleEffect }) {
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    const emoji = PARTICLE_EMOJIS[particle.type];
    const randomX = (Math.random() - 0.5) * 100;
    const randomRotate = (Math.random() - 0.5) * 360;

    return (
        <div
            className="absolute text-2xl animate-particle-float"
            style={{
                left: particle.x,
                top: particle.y,
                color: particle.color,
                '--random-x': `${randomX}px`,
                '--random-rotate': `${randomRotate}deg`,
                animation: 'particle-float 1.5s ease-out forwards'
            } as React.CSSProperties}
        >
            {emoji}
        </div>
    );
}
