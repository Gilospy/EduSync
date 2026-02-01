import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Armchair } from 'lucide-react';
import { Card } from '../components/Card';

export const StudySprint = () => {
    // Modes: 'focus' (25m), 'short' (5m), 'long' (15m)
    const [mode, setMode] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    // Timer Duration Configuration
    const MODES = {
        focus: { time: 25 * 60, label: 'Deep Work', icon: Brain, color: 'var(--color-primary)' },
        short: { time: 5 * 60, label: 'Short Break', icon: Coffee, color: 'var(--status-good)' },
        long: { time: 15 * 60, label: 'Long Break', icon: Armchair, color: 'var(--color-accent)' },
    };

    // Reset timer when mode changes
    useEffect(() => {
        setIsActive(false);
        setTimeLeft(MODES[mode].time);
    }, [mode]);

    // Timer Tick
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Optional: Play sound or auto-switch logic here
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const CurrentIcon = MODES[mode].icon;

    return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Study Sprint</h1>

                {/* Mode Toggles */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: 'var(--spacing-xl)',
                    background: 'var(--color-bg-secondary)',
                    padding: '4px',
                    borderRadius: 'var(--radius-md)',
                    display: 'inline-flex'
                }}>
                    {Object.keys(MODES).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            style={{
                                background: mode === m ? 'var(--color-surface)' : 'transparent',
                                color: mode === m ? MODES[m].color : 'var(--color-text-secondary)',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: mode === m ? 'var(--shadow-sm)' : 'none'
                            }}
                        >
                            {MODES[m].label}
                        </button>
                    ))}
                </div>

                <Card className="glass-panel" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Active Mode Indicator */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: MODES[mode].color,
                            opacity: 0.8,
                            marginBottom: '10px'
                        }}>
                            <CurrentIcon size={18} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{MODES[mode].label}</span>
                        </div>

                        <div style={{ fontSize: '8rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-4px', color: MODES[mode].color, lineHeight: 1, transition: 'color 0.3s ease' }}>
                            {formatTime(timeLeft)}
                        </div>

                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <button
                                className="btn"
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    padding: 0,
                                    background: MODES[mode].color,
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '1.2rem'
                                }}
                                onClick={() => setIsActive(!isActive)}
                            >
                                {isActive ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
                            </button>
                            <button
                                className="btn btn-ghost"
                                style={{ width: '64px', height: '64px', borderRadius: '50%', padding: 0, border: '1px solid var(--color-border)' }}
                                onClick={() => {
                                    setIsActive(false);
                                    setTimeLeft(MODES[mode].time);
                                }}
                            >
                                <RotateCcw size={24} />
                            </button>
                        </div>
                    </div>
                </Card>

                <div style={{ marginTop: 'var(--spacing-xl)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>Current Focus</p>
                    <div className="card" style={{ display: 'inline-flex', padding: '12px 24px', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--status-warning)' }}></div>
                        <span style={{ fontWeight: 600 }}>CS302: Dynamic Programming</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
