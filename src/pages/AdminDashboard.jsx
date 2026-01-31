import React from 'react';
import { Card } from '../components/Card';
import { MOCK_RISK_DATA } from '../data/mock';
import { TrendingUp, TrendingDown, Users, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AdminDashboard = () => {
    const { theme } = useTheme();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-ghost">Export Report</button>
                    <button className="btn btn-primary">Run Analysis</button>
                </div>
            </div>

            {/* KPI Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-md)' }}>
                <Card>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Total Students</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '4px' }}>{MOCK_RISK_DATA.totalStudents}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-good)', fontSize: '0.8rem', marginTop: '8px' }}>
                        <TrendingUp size={14} /> +2.4% vs last semester
                    </div>
                </Card>
                <Card>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>High Risk</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '4px', color: 'var(--status-bad)' }}>{MOCK_RISK_DATA.highRisk}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-bad)', fontSize: '0.8rem', marginTop: '8px' }}>
                        <TrendingUp size={14} /> +12 this week
                    </div>
                </Card>
                <Card>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Engagement Score</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '4px' }}>7.8</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-warning)', fontSize: '0.8rem', marginTop: '8px' }}>
                        <TrendingDown size={14} /> -0.2 vs last week
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
                {/* At Risk List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <h3>Critical Attention Required</h3>
                    {MOCK_RISK_DATA.students.map((student) => (
                        <Card key={student.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '40px', height: '40px',
                                    borderRadius: '8px',
                                    background: 'var(--color-bg-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Users size={20} color="var(--color-text-secondary)" />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{student.name}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>ID: {student.id}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Risk Score</div>
                                    <div style={{ fontWeight: 700, color: student.riskScore > 90 ? 'var(--status-bad)' : 'var(--status-warning)' }}>
                                        {student.riskScore}/100
                                    </div>
                                </div>

                                <span className={`badge ${student.riskScore > 80 ? 'badge-risk-high' : 'badge-risk-low'}`}>
                                    {student.riskLabel}
                                </span>

                                <button className="btn btn-ghost" style={{ padding: '8px' }}>
                                    <AlertTriangle size={18} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* AI Insights Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <h3>AI Course Insights</h3>
                    {MOCK_RISK_DATA.insights.map((insight) => (
                        <Card key={insight.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent)' }}>{insight.course}</span>
                            </div>
                            <h4 style={{ margin: 0, marginBottom: '8px' }}>{insight.metric}: {insight.value}</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                                {insight.message}
                            </p>
                        </Card>
                    ))}

                    <Card style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)', color: 'white' }}>
                        <h4 style={{ margin: 0, color: 'white' }}>Generate New Report</h4>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '16px' }}>
                            Run a fresh analysis on attendance data from this week.
                        </p>
                        <button style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            width: '100%',
                            fontWeight: 600
                        }}>
                            Run Analysis
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
};
