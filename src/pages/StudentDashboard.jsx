import React from 'react';
import { Card } from '../components/Card';
import { MOCK_STUDENT, MOCK_ASSIGNMENTS } from '../data/mock';
import { Clock, CheckCircle, AlertCircle, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const StudentDashboard = () => {
    const { theme } = useTheme();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {/* Welcome Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>

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
                                    <button className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>
                                        View Breakdown <ArrowRight size={16} />
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
