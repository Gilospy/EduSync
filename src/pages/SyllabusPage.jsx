import React from 'react';
import { Card } from '../components/Card';
import { FileText, Check, AlertCircle } from 'lucide-react';

export const SyllabusPage = () => {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ fontSize: '2rem' }}>Syllabus Intelligence</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>Upload your syllabus PDF and let AI plan your semester.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                {/* Upload Area */}
                <Card title="Upload Syllabus">
                    <div style={{
                        border: '2px dashed var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '40px',
                        textAlign: 'center',
                        backgroundColor: 'var(--color-bg)'
                    }}>
                        <div style={{
                            width: '64px', height: '64px',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <FileText size={32} color="var(--color-primary)" />
                        </div>
                        <h4 style={{ margin: 0, marginBottom: '8px' }}>Drag & Drop PDF here</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>or click to browse</p>
                        <button className="btn btn-primary" style={{ marginTop: '16px' }}>Select File</button>
                    </div>
                </Card>

                {/* Parsed Results (Mock) */}
                <Card title="AI Analysis Preview">
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
                </Card>
            </div>
        </div>
    );
};
