import React, { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card } from '../components/Card';

export const StudySprint = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Deep Work Session</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                    Block distractions. Focus on one task.
                </p>

                <Card className="glass-panel" style={{ padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '8rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-4px', color: 'var(--color-primary)', lineHeight: 1 }}>
                            {formatTime(timeLeft)}
                        </div>
                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <button
                                className="btn btn-primary"
                                style={{ width: '64px', height: '64px', borderRadius: '50%', padding: 0 }}
                                onClick={() => setIsActive(!isActive)}
                            >
                                {isActive ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
                            </button>
                            <button
                                className="btn btn-ghost"
                                style={{ width: '64px', height: '64px', borderRadius: '50%', padding: 0, border: '1px solid var(--color-border)' }}
                                onClick={() => {
                                    setIsActive(false);
                                    setTimeLeft(25 * 60);
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
