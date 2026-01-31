import { useState, useEffect } from 'react';
import { Card } from '../components/Card';

export function RetentionView() {
    const [riskData, setRiskData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setRiskData([
                {
                    id: 1,
                    studentName: 'Alex Johnson',
                    course: 'BIO101',
                    riskScore: 85,
                    trend: 'rising',
                    engagementDrop: '35%',
                    lastActive: '2 hours ago',
                    missedTasks: 5
                },
                {
                    id: 2,
                    studentName: 'Maria Garcia',
                    course: 'CHEM201',
                    riskScore: 72,
                    trend: 'stable',
                    engagementDrop: '20%',
                    lastActive: '4 hours ago',
                    missedTasks: 2
                },
                {
                    id: 3,
                    studentName: 'James Wilson',
                    course: 'PHYS150',
                    riskScore: 68,
                    trend: 'falling',
                    engagementDrop: '15%',
                    lastActive: '1 day ago',
                    missedTasks: 1
                },
                {
                    id: 4,
                    studentName: 'Sarah Lee',
                    course: 'MATH301',
                    riskScore: 45,
                    trend: 'stable',
                    engagementDrop: '10%',
                    lastActive: '30 mins ago',
                    missedTasks: 0
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const getRiskColor = (score) => {
        if (score >= 75) return '#ef4444';
        if (score >= 50) return '#f59e0b';
        return '#10b981';
    };

    const getTrendIcon = (trend) => {
        if (trend === 'rising') return '📈';
        if (trend === 'falling') return '📉';
        return '➡️';
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#1f2937' }}>
                    Student Risk & Retention Analytics
                </h1>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    Monitor engagement drop-off, risk trends, and intervention opportunities
                </p>
            </div>

            {/* Risk Summary Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '30px'
            }}>
                <Card style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>HIGH RISK STUDENTS</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>12</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>Immediate intervention needed</div>
                </Card>
                <Card style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>ENGAGEMENT DROP-OFF</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>24%</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>Avg across courses</div>
                </Card>
                <Card style={{ padding: '20px', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>RETENTION RATE</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>88%</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>Course completion</div>
                </Card>
            </div>

            {/* Risk Heatmap */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#1f2937' }}>
                    Power BI Risk Trends & Course Heatmap
                </h2>
                <Card style={{ padding: '20px' }}>
                    <div style={{ aspectRatio: '16 / 9', backgroundColor: '#f9fafb', borderRadius: '8px', overflow: 'hidden' }}>
                        <iframe
                            title="Risk Trends Heatmap"
                            width="100%"
                            height="100%"
                            src="https://app.powerbi.com/reportEmbed?reportId=50204a66-c6a3-425d-8043-00ca0f59bf3f&autoAuth=true&ctid=d1d8f653-6844-454b-a4fc-c52bc2c76e72"
                            frameBorder="0"
                            allowFullScreen={true}
                        ></iframe>
                    </div>
                </Card>
            </div>

            {/* At-Risk Students Table */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#1f2937' }}>
                    Students Requiring Attention
                </h2>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        Loading student data...
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Student Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Course</th>
                                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Risk Score</th>
                                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Trend</th>
                                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Engagement Drop</th>
                                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Missed Tasks</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riskData.map((student, idx) => (
                                    <tr key={student.id} style={{
                                        borderBottom: '1px solid #e5e7eb',
                                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb'
                                    }}>
                                        <td style={{ padding: '12px', color: '#1f2937', fontWeight: '500' }}>{student.studentName}</td>
                                        <td style={{ padding: '12px', color: '#6b7280' }}>{student.course}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                backgroundColor: `${getRiskColor(student.riskScore)}20`,
                                                color: getRiskColor(student.riskScore),
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                fontSize: '13px'
                                            }}>
                                                {student.riskScore}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '18px' }}>
                                            {getTrendIcon(student.trend)}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center', color: '#f59e0b', fontWeight: '500' }}>
                                            {student.engagementDrop}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center', color: '#6b7280' }}>
                                            {student.missedTasks}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <button style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}>
                                                Contact
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Intervention Strategies */}
            <div>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#1f2937' }}>
                    Recommended Interventions
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '15px'
                }}>
                    {[
                        {
                            icon: '📧',
                            title: 'Send Encouragement Email',
                            description: 'Automated email to at-risk students with resources'
                        },
                        {
                            icon: '📞',
                            title: 'Schedule 1-on-1 Meeting',
                            description: 'Direct engagement to understand barriers'
                        },
                        {
                            icon: '📚',
                            title: 'Additional Study Materials',
                            description: 'Supplementary resources for struggling topics'
                        },
                        {
                            icon: '👥',
                            title: 'Peer Study Groups',
                            description: 'Connect students for collaborative learning'
                        }
                    ].map((intervention, idx) => (
                        <Card key={idx} style={{ padding: '16px' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{intervention.icon}</div>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#1f2937' }}>
                                {intervention.title}
                            </div>
                            <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>
                                {intervention.description}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
