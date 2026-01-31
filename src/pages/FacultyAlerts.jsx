import { useState, useEffect } from 'react';
import { Card } from '../components/Card';

export function FacultyAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading student struggle data
        setTimeout(() => {
            setAlerts([
                {
                    id: 1,
                    course: 'BIO101',
                    topic: 'Cell Division',
                    severity: 'high',
                    affectedStudents: 42,
                    percentage: '42%',
                    message: 'High difficulty detected in BIO101 – Cell Division. 42% of students missed tasks. Consider an additional review session.',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                    action: 'Email/Teams Notification Sent'
                },
                {
                    id: 2,
                    course: 'CHEM201',
                    topic: 'Ionic Bonding',
                    severity: 'medium',
                    affectedStudents: 28,
                    percentage: '28%',
                    message: 'Moderate engagement drop-off detected in CHEM201. Consider supplementary materials.',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                    action: 'Notification Pending'
                },
                {
                    id: 3,
                    course: 'PHYS150',
                    topic: 'Thermodynamics',
                    severity: 'medium',
                    affectedStudents: 15,
                    percentage: '15%',
                    message: 'Rising risk trend detected in PHYS150 thermodynamics section.',
                    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                    action: 'Risk Monitoring'
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return '#ef4444';
            case 'medium':
                return '#f59e0b';
            case 'low':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const getSeverityBg = (severity) => {
        switch (severity) {
            case 'high':
                return '#fee2e2';
            case 'medium':
                return '#fef3c7';
            case 'low':
                return '#d1fae5';
            default:
                return '#f3f4f6';
        }
    };

    const formatTime = (date) => {
        const hours = Math.floor((Date.now() - date) / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours === 1) return '1 hour ago';
        return `${hours} hours ago`;
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#1f2937' }}>
                    Faculty Alerts & Notifications
                </h1>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    Real-time alerts when students struggle with course content
                </p>
            </div>

            {/* Alert Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '30px'
            }}>
                <Card style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>HIGH RISK ALERTS</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>1</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>Active Now</div>
                </Card>
                <Card style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>MEDIUM ALERTS</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>2</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>Monitoring</div>
                </Card>
                <Card style={{ padding: '20px', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>TOTAL NOTIFIED</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>3</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>Last 24 hours</div>
                </Card>
            </div>

            {/* Alerts List */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#1f2937' }}>Recent Alerts</h2>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        Loading alerts...
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {alerts.map(alert => (
                            <Card
                                key={alert.id}
                                style={{
                                    padding: '16px',
                                    borderLeft: `4px solid ${getSeverityColor(alert.severity)}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                padding: '4px 8px',
                                                backgroundColor: getSeverityBg(alert.severity),
                                                color: getSeverityColor(alert.severity),
                                                borderRadius: '4px',
                                                textTransform: 'uppercase'
                                            }}>
                                                {alert.severity}
                                            </span>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>
                                                {alert.course} - {alert.topic}
                                            </span>
                                        </div>
                                        <p style={{
                                            margin: '8px 0',
                                            color: '#374151',
                                            fontSize: '14px',
                                            lineHeight: '1.5'
                                        }}>
                                            {alert.message}
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            gap: '20px',
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            marginTop: '8px'
                                        }}>
                                            <span>👥 {alert.affectedStudents} students ({alert.percentage})</span>
                                            <span>⏰ {formatTime(alert.timestamp)}</span>
                                            <span>✉️ {alert.action}</span>
                                        </div>
                                    </div>
                                    <button style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        View Details
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Faculty Heatmap Section */}
            <div>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#1f2937' }}>
                    Course Difficulty Heatmap
                </h2>
                <Card style={{ padding: '20px' }}>
                    <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '20px',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '15px'
                        }}>
                            Power BI Heatmap - Course Difficulty vs Student Engagement
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '10px',
                            marginBottom: '20px'
                        }}>
                            {['BIO101', 'CHEM201', 'PHYS150', 'MATH301'].map((course, idx) => (
                                <div key={course} style={{
                                    padding: '15px',
                                    backgroundColor: [
                                        '#fee2e2', '#fef3c7', '#d1fae5', '#dbeafe'
                                    ][idx],
                                    borderRadius: '6px'
                                }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{course}</div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#6b7280'
                                    }}>
                                        {['High Risk', 'Medium', 'Low Risk', 'Optimal'][idx]}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <iframe
                            title="Faculty Heatmap"
                            width="100%"
                            height="400"
                            src="https://app.powerbi.com/reportEmbed?reportId=50204a66-c6a3-425d-8043-00ca0f59bf3f&autoAuth=true&ctid=d1d8f653-6844-454b-a4fc-c52bc2c76e72"
                            frameBorder="0"
                            allowFullScreen={true}
                            style={{ borderRadius: '6px' }}
                        ></iframe>
                    </div>
                </Card>
            </div>

            {/* Power Automate Info */}
            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
                    ⚡ AUTOMATED NOTIFICATIONS VIA POWER AUTOMATE
                </div>
                <div style={{ fontSize: '13px', color: '#1e40af', lineHeight: '1.6' }}>
                    When risk threshold exceeded → Sends automated email to faculty channel + Teams notification<br/>
                    Example: "High difficulty detected in BIO101 – Consider an additional review session"
                </div>
            </div>
        </div>
    );
}
