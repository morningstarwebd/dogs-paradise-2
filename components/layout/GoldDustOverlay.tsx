'use client'

import { CSSProperties, useMemo, useSyncExternalStore } from 'react'

type GoldDustOverlayProps = {
    enabled: boolean
    density?: number
    speed?: number
    size?: number
    opacity?: number
    color?: string
    hideInIframe?: boolean
}

type ParticleConfig = {
    left: number
    delay: number
    duration: number
    drift: number
    size: number
    opacity: number
    glow: number
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
}

function pseudoRandom(seed: number): number {
    const raw = Math.sin(seed * 127.1) * 43758.5453
    return raw - Math.floor(raw)
}

function buildParticle(index: number, density: number, speed: number, size: number, opacity: number): ParticleConfig {
    const seed = index + 1
    const left = pseudoRandom(seed * 1.23) * 100
    const delay = pseudoRandom(seed * 2.07) * 22
    const baseDuration = 12 + pseudoRandom(seed * 3.11) * 12
    const duration = baseDuration / speed
    const driftDirection = pseudoRandom(seed * 4.03) > 0.5 ? 1 : -1
    const drift = driftDirection * (8 + pseudoRandom(seed * 5.17) * 18)
    const baseParticleSize = (1 + pseudoRandom(seed * 6.19) * 2.4) * size
    const particleOpacity = clamp((0.25 + pseudoRandom(seed * 7.13) * 0.75) * opacity, 0.08, 1)
    const glow = 4 + pseudoRandom(seed * 8.21) * 7

    return {
        left,
        delay,
        duration,
        drift,
        size: baseParticleSize * (0.75 + density * 0.6),
        opacity: particleOpacity,
        glow,
    }
}

export default function GoldDustOverlay({
    enabled,
    density = 0.45,
    speed = 1,
    size = 1,
    opacity = 0.45,
    color = '#d4af37',
    hideInIframe = false,
}: GoldDustOverlayProps) {
    const isInIframe = useSyncExternalStore(
        () => () => undefined,
        () => typeof window !== 'undefined' && window.parent !== window,
        () => false
    )

    const normalizedDensity = clamp(density, 0.1, 1)
    const normalizedSpeed = clamp(speed, 0.6, 2)
    const normalizedSize = clamp(size, 0.6, 1.8)
    const normalizedOpacity = clamp(opacity, 0.1, 1)
    const particleCount = Math.round(35 + normalizedDensity * 115)

    const particles = useMemo(
        () =>
            Array.from({ length: particleCount }, (_, index) =>
                buildParticle(index, normalizedDensity, normalizedSpeed, normalizedSize, normalizedOpacity)
            ),
        [particleCount, normalizedDensity, normalizedSpeed, normalizedSize, normalizedOpacity]
    )

    if (!enabled || (hideInIframe && isInIframe)) return null

    return (
        <div className="gold-dust-overlay" aria-hidden="true">
            {particles.map((particle, index) => {
                const particleStyle: CSSProperties & {
                    '--gold-dust-drift-x': string
                    '--gold-dust-opacity': string
                } = {
                    left: `${particle.left}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animationDuration: `${particle.duration.toFixed(2)}s`,
                    animationDelay: `-${particle.delay.toFixed(2)}s`,
                    backgroundColor: color,
                    boxShadow: `0 0 ${particle.glow.toFixed(1)}px ${color}`,
                    '--gold-dust-drift-x': `${particle.drift.toFixed(2)}px`,
                    '--gold-dust-opacity': `${particle.opacity.toFixed(3)}`,
                }

                return <span key={`gold-dust-${index}`} className="gold-dust-particle" style={particleStyle} />
            })}
        </div>
    )
}
