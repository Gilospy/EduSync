import React, { useState } from 'react';
import { Card } from '../components/Card';
import { MOCK_STUDENT, MOCK_ASSIGNMENTS } from '../data/mock';
import { Clock, CheckCircle, AlertCircle, Calendar as CalendarIcon, ArrowRight, Loader, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';



export const StudentDashboard = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(null); // assignment id being loaded
    const [breakdown, setBreakdown] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleViewBreakdown = async (assignment) => {
        if (!assignment.pdfFile) {
            alert('No PDF file associated with this assignment');
            return;
        }

        setLoading(assignment.id);
        try {
            const response = await fetch(`http://localhost:5000/api/assignments/breakdown/${assignment.pdfFile}`, {
                method: 'POST',
            });
            const data = await response.json();
            console.log('Breakdown response:', data);

            if (data.success) {
                setBreakdown({ ...data.data, course: assignment.course, originalTitle: assignment.title });
                setShowModal(true);
            } else {
                alert('Failed to get breakdown: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error getting breakdown:', error);
            alert('Error getting breakdown. Check if backend is running.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {/* Breakdown Modal */}
            {showModal && breakdown && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'var(--color-bg)',
                        borderRadius: 'var(--radius-lg)',
                        maxWidth: '700px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        padding: 'var(--spacing-lg)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <div>
                                <h2 style={{ margin: 0 }}>{breakdown.assignmentTitle || breakdown.originalTitle}</h2>
                                <p style={{ color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>{breakdown.course}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                            <div style={{ padding: '12px 16px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{breakdown.totalSteps || breakdown.steps?.length || 0}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Steps</div>
                            </div>
                            <div style={{ padding: '12px 16px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--status-warning)' }}>{breakdown.estimatedHours || '~3'}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Hours</div>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Micro-Steps Breakdown</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {breakdown.steps?.map((step, idx) => (
                                <div key={idx} style={{
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--color-bg-secondary)',
                                    borderRadius: 'var(--radius-sm)',
                                    borderLeft: '4px solid var(--color-primary)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <span style={{
                                            width: '24px', height: '24px',
                                            background: 'var(--color-primary)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.8rem', fontWeight: 700
                                        }}>{step.stepNumber || idx + 1}</span>
                                        <strong>{step.title}</strong>
                                        {step.estimatedMinutes && (
                                            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                ~{step.estimatedMinutes} min
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{step.description}</p>
                                    {step.tips && step.tips.length > 0 && (
                                        <div style={{ marginTop: '8px', padding: '8px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
                                            <strong style={{ fontSize: '0.8rem' }}>💡 Tips:</strong>
                                            <ul style={{ margin: '4px 0 0', paddingLeft: '16px', fontSize: '0.85rem' }}>
                                                {step.tips.map((tip, tipIdx) => <li key={tipIdx}>{tip}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
                            onClick={() => setShowModal(false)}
                        >
                            Got it! Start Working
                        </button>
                    </div>
                </div>
            )}

            {/* Welcome Section */}
            <div className="dashboard-header">
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>
                        Welcome back, {MOCK_STUDENT.name.split(' ')[0]}
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        You have <strong style={{ color: 'var(--color-primary)' }}>{MOCK_ASSIGNMENTS.filter(a => a.status !== 'Completed').length} active assignments</strong> this week.
                    </p>
                </div>
                <button className="btn btn-primary" style={{ boxShadow: theme === 'low-stim' ? 'none' : 'var(--shadow-md)' }}>
                    Plan My Semester
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-lg)' }}>

                {/* Next Up Card */}
                <Card title="Next Up" className="glass-panel">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                        <div style={{
                            background: theme === 'low-stim' ? 'var(--color-bg-secondary)' : 'var(--color-primary-soft)',
                            padding: '12px',
                            borderRadius: '12px',
                            color: 'var(--color-primary)'
                        }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{MOCK_STUDENT.nextAssignment.title}</h4>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: '4px 0' }}>
                                {MOCK_STUDENT.nextAssignment.course}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <span className="badge" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}>
                                    Due {MOCK_STUDENT.nextAssignment.due}
                                </span>
                                <span className="badge" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
                                    {MOCK_STUDENT.nextAssignment.weight}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Progress Card */}
                <Card title="Weekly Progress">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Tasks Completed</span>
                        <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>12/18</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--color-bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            width: '66%',
                            height: '100%',
                            background: 'var(--status-good)',
                            borderRadius: '4px'
                        }}></div>
                    </div>
                    <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)' }}>
                        <div style={{ flex: 1, padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{MOCK_STUDENT.gpa}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Current GPA</div>
                        </div>
                        <div style={{ flex: 1, padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--status-warning)' }}>{MOCK_STUDENT.stressLevel}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Stress Level</div>
                        </div>
                    </div>
                </Card>

                {/* Schedule Card */}
                <Card title="Today's Schedule">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {MOCK_STUDENT.schedule.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: index !== MOCK_STUDENT.schedule.length - 1 ? '12px' : 0, borderBottom: index !== MOCK_STUDENT.schedule.length - 1 ? '1px solid var(--color-bg-secondary)' : 'none' }}>
                                <div style={{ width: '60px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                                    {item.time.split(' ')[0]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{item.course}</div>
                                    {item.duration && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{item.duration}</span>}
                                </div>
                                {item.type === 'study' && (
                                    <div className="badge" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>Study</div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <h3 style={{ marginTop: 'var(--spacing-md)' }}>Your Assignments</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-md)' }}>
                {MOCK_ASSIGNMENTS.map((assignment) => (
                    <Card key={assignment.id} className="glass-panel">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '40px', height: '40px',
                                    borderRadius: '50%',
                                    background: assignment.progress === 100 ? 'var(--status-good)' : 'var(--color-bg-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: assignment.progress === 100 ? 'white' : 'var(--color-text-secondary)'
                                }}>
                                    {assignment.progress === 100 ? <CheckCircle size={20} /> : <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{assignment.progress}%</span>}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{assignment.title}</h4>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{assignment.course} • Due {assignment.dueDate}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {assignment.status !== 'Completed' && (
                                    <button
                                        className="btn btn-ghost"
                                        style={{ fontSize: '0.9rem' }}
                                        onClick={() => handleViewBreakdown(assignment)}
                                        disabled={loading === assignment.id}
                                    >
                                        {loading === assignment.id ? (
                                            <>Analyzing... <Loader size={16} className="spin" /></>
                                        ) : (
                                            <>View Breakdown <ArrowRight size={16} /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Steps Preview */}
                        {assignment.steps.length > 0 && assignment.status !== 'Completed' && (
                            <div style={{ marginTop: '16px', paddingLeft: '56px' }}>
                                {assignment.steps.slice(0, 2).map((step) => (
                                    <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: step.done ? 0.6 : 1 }}>
                                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '2px solid var(--color-border)', background: step.done ? 'var(--color-text-secondary)' : 'transparent' }}></div>
                                        <span style={{ fontSize: '0.9rem', textDecoration: step.done ? 'line-through' : 'none' }}>{step.text}</span>
                                    </div>
                                ))}
                                {assignment.steps.length > 2 && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>+ {assignment.steps.length - 2} more steps</div>}
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
