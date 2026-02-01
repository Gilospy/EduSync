import React from 'react';
import { Card } from '../components/Card';
import { FileText, Check, AlertCircle } from 'lucide-react';

export const SyllabusPage = () => {
    const [uploading, setUploading] = React.useState(false);
    const [result, setResult] = React.useState(null);
    const fileInputRef = React.useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('syllabus', file);

        try {
            const response = await fetch('/api/syllabus/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log('Upload response:', data);
            setResult(data);
            alert("Upload successful! Check backend terminal for raw Azure output.");
        } catch (error) {
            console.error('Error uploading:', error);
            alert("Upload failed. See console.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ fontSize: '2rem' }}>Syllabus Intelligence</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>Upload your syllabus PDF and let AI plan your semester.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                {/* Upload Area */}
                <Card title="Upload Syllabus">
                    <div
                        style={{
                            border: '2px dashed var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '40px',
                            textAlign: 'center',
                            backgroundColor: 'var(--color-bg)',
                            cursor: 'pointer'
                        }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                            accept=".pdf"
                        />
                        <div style={{
                            width: '64px', height: '64px',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <FileText size={32} color="var(--color-primary)" />
                        </div>
                        <h4 style={{ margin: 0, marginBottom: '8px' }}>
                            {uploading ? "Uploading..." : "Drag & Drop PDF here"}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>or click to browse</p>
                        <button className="btn btn-primary" style={{ marginTop: '16px' }} disabled={uploading}>
                            {uploading ? "Analyzing..." : "Select File"}
                        </button>
                    </div>
                </Card>

                {/* Parsed Results */}
                <Card title="AI Analysis Preview">
                    {result ? (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                                <Check size={18} color="var(--status-good)" />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Analysis Complete</span>
                            </div>

                            {result.data ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {/* Course Info */}
                                    {(result.data.courseTitle || result.data.instructor || result.data.semester || result.data.credits) && (
                                        <div>
                                            <h4 style={{ marginBottom: '12px', fontSize: '1rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '6px' }}>Course Information</h4>
                                            {result.data.courseTitle && <div style={{ fontSize: '0.9rem', marginBottom: '6px' }}><strong>Course:</strong> {result.data.courseTitle}</div>}
                                            {result.data.instructor && <div style={{ fontSize: '0.9rem', marginBottom: '6px' }}><strong>Instructor:</strong> {result.data.instructor}</div>}
                                            {result.data.semester && <div style={{ fontSize: '0.9rem', marginBottom: '6px' }}><strong>Semester:</strong> {result.data.semester}</div>}
                                            {result.data.credits && <div style={{ fontSize: '0.9rem', marginBottom: '6px' }}><strong>Credits:</strong> {result.data.credits}</div>}
                                            {result.data.prerequisites && <div style={{ fontSize: '0.9rem', marginBottom: '6px' }}><strong>Prerequisites:</strong> {result.data.prerequisites}</div>}
                                        </div>
                                    )}

                                    {/* Grade Breakdown */}
                                    {result.data.gradeBreakdown && result.data.gradeBreakdown.length > 0 && (
                                        <div>
                                            <h4 style={{ marginBottom: '12px', fontSize: '1rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '6px' }}>Grade Breakdown</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {result.data.gradeBreakdown.map((item, idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '6px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
                                                        <span>{item.category}</span>
                                                        <span style={{ fontWeight: 600 }}>{item.weight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Assignments/Deadlines */}
                                    {result.data.assignments && result.data.assignments.length > 0 && (
                                        <div>
                                            <h4 style={{ marginBottom: '12px', fontSize: '1rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '6px' }}>Assignments & Deadlines</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {result.data.assignments.map((assignment, idx) => (
                                                    <div key={idx} style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{assignment.title}</span>
                                                            {assignment.weight && <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>{assignment.weight}</span>}
                                                        </div>
                                                        {assignment.dueDate && assignment.dueDate !== 'TBD' && (
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                                                                📅 Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </div>
                                                        )}
                                                        {assignment.description && (
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                                                                {assignment.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Topics */}
                                    {result.data.topics && result.data.topics.length > 0 && (
                                        <div>
                                            <h4 style={{ marginBottom: '12px', fontSize: '1rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '6px' }}>Course Topics</h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {result.data.topics.map((topic, idx) => (
                                                    <span key={idx} style={{
                                                        padding: '6px 12px',
                                                        background: 'var(--color-bg-secondary)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontSize: '0.85rem',
                                                        border: '1px solid var(--color-border)'
                                                    }}>
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>No data available to display.</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                                <Check size={18} color="var(--status-good)" />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>BIO101_Syllabus_Fall2024.pdf</span>
                            </div>

                            <h4 style={{ marginBottom: '12px' }}>Detected Deadlines:</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span>Midterm Exam</span>
                                    <span style={{ fontWeight: 600 }}>Oct 15 (20%)</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span>Lab Report 1</span>
                                    <span style={{ fontWeight: 600 }}>Oct 22 (10%)</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span>Final Project Proposal</span>
                                    <span style={{ fontWeight: 600 }}>Nov 05 (15%)</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid var(--status-warning)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '8px' }}>
                                <AlertCircle size={18} color="var(--status-warning)" />
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>
                                    <strong>Heads up:</strong> The "Lab Report 1" is due 2 days after the "Midterm Exam". We recommend starting the report early.
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
