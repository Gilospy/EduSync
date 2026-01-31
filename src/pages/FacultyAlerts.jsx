import React from 'react';
import { Card } from '../components/Card';
import { AlertCircle, ArrowRight, UserX, BookOpen } from 'lucide-react';

export const FacultyAlerts = () => {
    const alerts = [
        {
            id: 1,
            course: "BIO101 - Cell Division",
            severity: "high",
            title: "Concept Mastery Alert: Mitosis",
            message: "42% of students missed tasks related to mitosis. There seems to be a widespread misunderstanding of prophase vs metaphase.",
            action: "Schedule Review Session"
        },
        {
            id: 2,
            course: "CS302 - Algorithms",
            severity: "medium",
            title: "Engagement Drop-off",
            message: "Submission rates for the 'Dynamic Programming' problem set are 15% lower than historical averages for this point in the semester.",
            action: "Extend Deadline"
        },
        {
            id: 3,
            course: "HIS240 - Modern History",
            severity: "low",
            title: "Attendance Anomaly",
            message: "Lower than expected attendance in Friday's discussion section.",
            action: "Send Announcement"
        }
    ];

    return (
        <div style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h1>Faculty Alerts</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>AI-driven insights requiring your attention.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {alerts.map(alert => (
                    <Card key={alert.id} className="glass-panel" style={{ borderLeft: `4px solid ${alert.severity === 'high' ? 'var(--status-bad)' : alert.severity === 'medium' ? 'var(--status-warning)' : 'var(--color-primary)'}` }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ paddingTop: '4px' }}>
                                <AlertCircle size={24} color={alert.severity === 'high' ? 'var(--status-bad)' : alert.severity === 'medium' ? 'var(--status-warning)' : 'var(--color-primary)'} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                                            {alert.course} • {alert.severity.toUpperCase()} PRIORITY
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{alert.title}</h3>
                                    </div>
                                    <button className="btn btn-ghost">Dismiss</button>
                                </div>

                                <p style={{ margin: '12px 0', lineHeight: '1.5', color: 'var(--color-text-primary)' }}>
                                    {alert.message}
                                </p>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                        {alert.action}
                                    </button>
                                    <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                        View Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div >
    );
};
