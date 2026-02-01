import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Target, TrendingUp, Plus, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Helper function to get color based on grade
const getGradeColor = (grade) => {
    if (grade >= 90) return '#059669'; // Green
    if (grade >= 80) return '#65A30D'; // Lime
    if (grade >= 70) return '#D97706'; // Amber
    if (grade >= 60) return '#DC2626'; // Red
    return '#991B1B'; // Dark red
};

const getGradeStatus = (grade) => {
    if (grade >= 90) return 'Excellent';
    if (grade >= 80) return 'Good';
    if (grade >= 70) return 'Satisfactory';
    if (grade >= 60) return 'Passing';
    return 'Failing';
};

// Mock grades data
const MOCK_GRADES = [
    { id: 1, course: 'CMP-257: Application Programming', grade: 85, weight: 0.20, status: 'Completed' },
    { id: 2, course: 'DES-101: Visual Communication Design', grade: 92, weight: 0.20, status: 'Completed' },
    { id: 3, course: 'MTH-201: Calculus II', grade: 78, weight: 0.25, status: 'Completed' },
    { id: 4, course: 'ENG-150: English Composition', grade: 88, weight: 0.15, status: 'Completed' },
    { id: 5, course: 'PHY-101: Physics I', grade: 72, weight: 0.20, status: 'In Progress' }
];

export const GradesView = () => {
    const { theme } = useTheme();
    const [grades] = useState(MOCK_GRADES);
    const [goals, setGoals] = useState({
        overall: 85,
        byClass: {}
    });
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [newGoal, setNewGoal] = useState({ courseId: '', targetGrade: '' });

    // Calculate overall grade
    const calculateOverallGrade = () => {
        const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
        const weightedSum = grades.reduce((sum, g) => sum + (g.grade * g.weight), 0);
        return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    };

    // Calculate projected grade
    const calculateProjectedGrade = () => {
        const completedGrades = grades.filter(g => g.status === 'Completed');
        const inProgressGrades = grades.filter(g => g.status === 'In Progress');
        
        if (inProgressGrades.length === 0) return calculateOverallGrade();
        
        // Assume maintaining current average for in-progress courses
        const completedAvg = completedGrades.length > 0 
            ? completedGrades.reduce((sum, g) => sum + g.grade, 0) / completedGrades.length
            : 0;
        
        const projectedGrades = [...completedGrades, ...inProgressGrades.map(g => ({ ...g, grade: completedAvg }))];
        const totalWeight = projectedGrades.reduce((sum, g) => sum + g.weight, 0);
        const weightedSum = projectedGrades.reduce((sum, g) => sum + (g.grade * g.weight), 0);
        return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    };

    const handleAddGoal = () => {
        if (newGoal.courseId && newGoal.targetGrade) {
            setGoals(prev => ({
                ...prev,
                byClass: {
                    ...prev.byClass,
                    [newGoal.courseId]: parseInt(newGoal.targetGrade)
                }
            }));
            setNewGoal({ courseId: '', targetGrade: '' });
            setShowAddGoal(false);
        }
    };

    const handleRemoveGoal = (courseId) => {
        setGoals(prev => {
            const newByClass = { ...prev.byClass };
            delete newByClass[courseId];
            return { ...prev, byClass: newByClass };
        });
    };

    const currentOverall = calculateOverallGrade();
    const projectedOverall = calculateProjectedGrade();
    const overallGoal = goals.overall;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Page Header */}
            <div>
                <h1 style={{ fontSize: '2rem', margin: '0 0 8px' }}>Grades & Goals</h1>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Track your academic performance and set goals</p>
            </div>

            {/* Overall Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
                {/* Current GPA */}
                <Card title="Current Overall Grade">
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--spacing-md)' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: 700,
                                color: getGradeColor(currentOverall),
                                lineHeight: 1
                            }}>
                                {currentOverall}%
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: 'var(--color-text-secondary)',
                                marginTop: '8px'
                            }}>
                                {getGradeStatus(currentOverall)}
                            </div>
                        </div>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${getGradeColor(currentOverall)}20, ${getGradeColor(currentOverall)}40)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getGradeColor(currentOverall)
                        }}>
                            <TrendingUp size={32} />
                        </div>
                    </div>
                </Card>

                {/* Projected Grade */}
                <Card title="Projected Grade">
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--spacing-md)' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: 700,
                                color: getGradeColor(projectedOverall),
                                lineHeight: 1
                            }}>
                                {projectedOverall}%
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: 'var(--color-text-secondary)',
                                marginTop: '8px'
                            }}>
                                {getGradeStatus(projectedOverall)}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-secondary)',
                                marginTop: '4px'
                            }}>
                                Based on in-progress courses
                            </div>
                        </div>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${getGradeColor(projectedOverall)}20, ${getGradeColor(projectedOverall)}40)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getGradeColor(projectedOverall)
                        }}>
                            <TrendingUp size={32} />
                        </div>
                    </div>
                </Card>

                {/* Overall Goal */}
                <Card title="Overall Goal">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-md)' }}>
                        <div>
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: 700,
                                color: getGradeColor(overallGoal),
                                lineHeight: 1
                            }}>
                                {overallGoal}%
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-secondary)',
                                marginTop: '4px'
                            }}>
                                Target
                            </div>
                        </div>
                        <div style={{
                            padding: '8px 12px',
                            background: currentOverall >= overallGoal ? 'var(--status-good)20' : 'var(--status-warning)20',
                            color: currentOverall >= overallGoal ? 'var(--status-good)' : 'var(--status-warning)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            textAlign: 'center'
                        }}>
                            {currentOverall >= overallGoal ? '✓ On Track' : `${overallGoal - currentOverall}% to go`}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Course Grades */}
            <Card title="Course Grades">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {grades.map(grade => {
                        const courseGoal = goals.byClass[grade.id];
                        const onTrack = courseGoal ? grade.grade >= courseGoal : true;
                        
                        return (
                            <div key={grade.id} style={{
                                padding: 'var(--spacing-md)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                border: `2px solid ${getGradeColor(grade.grade)}40`
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{grade.course}</h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                            {grade.status} • {(grade.weight * 100).toFixed(0)}% course weight
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                        color: getGradeColor(grade.grade),
                                        minWidth: '60px',
                                        textAlign: 'right'
                                    }}>
                                        {grade.grade}%
                                    </div>
                                </div>

                                {/* Goal for this course */}
                                {courseGoal && (
                                    <div style={{
                                        padding: 'var(--spacing-sm)',
                                        background: 'var(--color-bg)',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: 'var(--spacing-sm)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Target size={16} color={getGradeColor(courseGoal)} />
                                            <div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Goal: {courseGoal}%</div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: onTrack ? 'var(--status-good)' : 'var(--status-warning)',
                                                    fontWeight: 500
                                                }}>
                                                    {onTrack ? '✓ On Track' : `Need ${courseGoal - grade.grade} more points`}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveGoal(grade.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'var(--color-text-secondary)',
                                                padding: '4px'
                                            }}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Add Goal Section */}
            <Card title="Set Course Goals">
                {!showAddGoal ? (
                    <button
                        onClick={() => setShowAddGoal(true)}
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-md)',
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '1rem',
                            transition: 'var(--transition-fast)',
                            opacity: 0.9
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '1'}
                        onMouseLeave={(e) => e.target.style.opacity = '0.9'}
                    >
                        <Plus size={20} /> Add a Goal
                    </button>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                                Select Course
                            </label>
                            <select
                                value={newGoal.courseId}
                                onChange={(e) => setNewGoal(prev => ({ ...prev, courseId: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '2px solid var(--color-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--color-surface)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">Choose a course...</option>
                                {grades.filter(g => !goals.byClass[g.id]).map(grade => (
                                    <option key={grade.id} value={grade.id}>
                                        {grade.course}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                                Target Grade (0-100)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={newGoal.targetGrade}
                                onChange={(e) => setNewGoal(prev => ({ ...prev, targetGrade: e.target.value }))}
                                placeholder="Enter target grade"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '2px solid var(--color-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--color-surface)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
                            <button
                                onClick={() => setShowAddGoal(false)}
                                style={{
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text-primary)',
                                    border: '2px solid var(--color-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '1rem'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddGoal}
                                disabled={!newGoal.courseId || !newGoal.targetGrade}
                                style={{
                                    padding: 'var(--spacing-md)',
                                    background: newGoal.courseId && newGoal.targetGrade ? 'var(--color-primary)' : 'var(--color-border)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: newGoal.courseId && newGoal.targetGrade ? 'pointer' : 'not-allowed',
                                    fontWeight: 600,
                                    fontSize: '1rem'
                                }}
                            >
                                Set Goal
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Color Legend */}
            <Card title="Grade Scale">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)' }}>
                    {[
                        { range: '90-100', label: 'Excellent', color: getGradeColor(95) },
                        { range: '80-89', label: 'Good', color: getGradeColor(85) },
                        { range: '70-79', label: 'Satisfactory', color: getGradeColor(75) },
                        { range: '60-69', label: 'Passing', color: getGradeColor(65) },
                        { range: 'Below 60', label: 'Failing', color: getGradeColor(50) }
                    ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                background: item.color
                            }} />
                            <div style={{ fontSize: '0.9rem' }}>
                                <div style={{ fontWeight: 600 }}>{item.range}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
