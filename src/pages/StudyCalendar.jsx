import React from 'react';
import { Card } from '../components/Card';
import { MOCK_STUDENT } from '../data/mock';
import { ChevronLeft, ChevronRight, Clock, BookOpen, Coffee } from 'lucide-react';

export const StudyCalendar = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', height: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ marginBottom: '4px' }}>Study Calendar</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Maximize retention with spaced repetition.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost"><ChevronLeft size={20} /></button>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>October 2024</span>
                    <button className="btn btn-ghost"><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* Calendar Grid */}
            <Card style={{ flex: 1, minHeight: '600px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Days Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr 1fr 1fr 1fr 1fr', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
                    <div style={{ padding: '16px', borderRight: '1px solid var(--color-border)' }}></div>
                    {days.map(day => (
                        <div key={day} style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-secondary)', borderRight: '1px solid var(--color-border)' }}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {timeSlots.map(time => (
                        <div key={time} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr 1fr 1fr 1fr 1fr', minHeight: '100px' }}>
                            <div style={{ padding: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
                                {time}
                            </div>
                            {days.map((day, index) => {
                                // Mock Logic to insert events randomly for demo visual
                                const isEvent = (day === 'Mon' && time === '10:00') || (day === 'Wed' && time === '14:00') || (day === 'Fri' && time === '10:00');
                                const isStudy = (day === 'Tue' && time === '18:00') || (day === 'Thu' && time === '20:00');

                                return (
                                    <div key={`${day}-${time}`} style={{ borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '4px', position: 'relative' }}>
                                        {isEvent && (
                                            <div style={{
                                                background: 'var(--color-primary-soft)',
                                                color: 'var(--color-primary)',
                                                padding: '8px',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                height: '100%',
                                                borderLeft: '3px solid var(--color-primary)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                                    <BookOpen size={14} /> Class
                                                </div>
                                                CS302: Algorithms
                                            </div>
                                        )}
                                        {isStudy && (
                                            <div style={{
                                                background: 'var(--color-accent-soft)',
                                                color: 'var(--color-accent)',
                                                padding: '8px',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                height: '100%',
                                                borderLeft: '3px solid var(--color-accent)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                                    <Clock size={14} /> Focus Block
                                                </div>
                                                Study: Bio Mitosis
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
