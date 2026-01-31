import React from 'react';
import { Card } from '../components/Card';
import { MOCK_RISK_DATA } from '../data/mock';
import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';

export const RetentionView = () => {
    // Mock Heatmap Data
    const weeks = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
    const courses = ["BIO101", "CS302", "HIS240", "ENG101", "MTH201"];

    // Generate random intensity for heatmap (0-4)
    const getIntensity = () => Math.floor(Math.random() * 5);
    const intensityColors = [
        'var(--color-bg-secondary)', // 0: No risk
        '#FCA5A5', // 1: Low
        '#F87171', // 2: Medium
        '#EF4444', // 3: High
        '#991B1B'  // 4: Critical
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <h1>Retention Intelligence</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>Predictive analytics for student drop-off patterns.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
                {/* Heatmap Section */}
                <Card title="Course Risk Heatmap">
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                        Visualizing engagement drops by week. Darker red indicates higher dropout risk.
                    </p>

                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(12, 1fr)', gap: '4px', minWidth: '600px' }}>
                            {/* Header */}
                            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}></div>
                            {weeks.map(w => <div key={w} style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>{w}</div>)}

                            {/* Rows */}
                            {courses.map(course => (
                                <React.Fragment key={course}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>{course}</div>
                                    {weeks.map(w => {
                                        const intensity = getIntensity();
                                        return (
                                            <div
                                                key={`${course}-${w}`}
                                                title={`Risk Level: ${intensity}`}
                                                style={{
                                                    height: '32px',
                                                    background: intensityColors[intensity],
                                                    borderRadius: '4px'
                                                }}
                                            ></div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.8rem', alignItems: 'center' }}>
                        <span>Legend:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: intensityColors[0], borderRadius: '2px' }}></div> Safe</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: intensityColors[4], borderRadius: '2px' }}></div> Critical</div>
                    </div>
                </Card>

                {/* Risk Formula Factors */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <Card title="Risk Factors Breakdown">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <span>Missed Assignments</span>
                                    <span style={{ fontWeight: 700, color: 'var(--status-bad)' }}>45% Impact</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--color-bg-secondary)', borderRadius: '3px' }}>
                                    <div style={{ width: '45%', height: '100%', background: 'var(--status-bad)', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <span>Portal Inactivity</span>
                                    <span style={{ fontWeight: 700, color: 'var(--status-warning)' }}>30% Impact</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--color-bg-secondary)', borderRadius: '3px' }}>
                                    <div style={{ width: '30%', height: '100%', background: 'var(--status-warning)', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <span>Low Exam Scores</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>25% Impact</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--color-bg-secondary)', borderRadius: '3px' }}>
                                    <div style={{ width: '25%', height: '100%', background: 'var(--color-primary)', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card style={{ background: 'var(--color-bg-secondary)', border: 'none' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Info size={24} color="var(--color-text-secondary)" />
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                This model is currently running at 89% accuracy based on historical semester data.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
