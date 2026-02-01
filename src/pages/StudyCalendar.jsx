import React from 'react';
import { Card } from '../components/Card';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, MapPin, Users, Loader, LogIn } from 'lucide-react';

export const StudyCalendar = () => {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [authenticated, setAuthenticated] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [checkingAuth, setCheckingAuth] = React.useState(true);

    // Check authentication status on mount
    React.useEffect(() => {
        checkAuthStatus();
    }, []);

    // Fetch events when authenticated
    React.useEffect(() => {
        if (authenticated) {
            fetchCalendarEvents();
        }
    }, [authenticated]);

    const checkAuthStatus = async () => {
        setCheckingAuth(true);
        try {
            const response = await fetch('/api/calendar/auth/status');
            const data = await response.json();
            setAuthenticated(data.authenticated);
            setUser(data.user);

            if (!data.authenticated) {
                setError('Please sign in to view your calendar');
            }
        } catch (err) {
            console.error('Error checking auth status:', err);
        } finally {
            setCheckingAuth(false);
        }
    };

    const handleSignIn = async () => {
        try {
            const response = await fetch('/api/calendar/auth/signin');
            const data = await response.json();

            if (data.authUrl) {
                // Open sign-in in new window
                const width = 500;
                const height = 700;
                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2;

                window.open(
                    data.authUrl,
                    'Microsoft Sign In',
                    `width=${width},height=${height},left=${left},top=${top}`
                );

                // Poll for authentication
                const pollInterval = setInterval(async () => {
                    const statusResponse = await fetch('/api/calendar/auth/status');
                    const statusData = await statusResponse.json();

                    if (statusData.authenticated) {
                        clearInterval(pollInterval);
                        setAuthenticated(true);
                        setUser(statusData.user);
                        setError(null);
                    }
                }, 1000);

                // Stop polling after 2 minutes
                setTimeout(() => clearInterval(pollInterval), 120000);
            }
        } catch (err) {
            console.error('Error initiating sign-in:', err);
            setError('Failed to initiate sign-in');
        }
    };

    const handleSignOut = async () => {
        try {
            await fetch('/api/calendar/auth/signout', { method: 'POST' });
            setAuthenticated(false);
            setUser(null);
            setEvents([]);
            setError('Please sign in to view your calendar');
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    const fetchCalendarEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/calendar/events?days=30');
            const data = await response.json();

            if (data.success) {
                setEvents(data.events);
                console.log(`Loaded ${data.events.length} calendar events`);
            } else {
                if (response.status === 401) {
                    setAuthenticated(false);
                    setError('Session expired. Please sign in again.');
                } else {
                    setError(data.error || 'Failed to fetch events');
                }
            }
        } catch (err) {
            console.error('Error fetching calendar events:', err);
            setError('Failed to load calendar events. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    };

    // ... (keep all the existing helper functions: getStartOfWeek, getWeekDays, navigation functions, etc.)
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const getWeekDays = () => {
        const startOfWeek = getStartOfWeek(currentDate);
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const getEventsForSlot = (day, timeSlot) => {
        if (!events || events.length === 0) return [];

        const slotHour = parseInt(timeSlot.split(':')[0]);
        const slotDate = new Date(day);
        slotDate.setHours(0, 0, 0, 0);

        return events.filter(event => {
            // Microsoft Graph returns dates like "2026-02-01T14:00:00.0000000"
            // Parse without timezone conversion
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);

            // Compare just the date parts
            const eventDateOnly = new Date(eventStart);
            eventDateOnly.setHours(0, 0, 0, 0);

            const isSameDay = eventDateOnly.getTime() === slotDate.getTime();

            if (!isSameDay) return false;

            const eventHour = eventStart.getHours();
            return eventHour === slotHour || (eventHour < slotHour && eventEnd.getHours() > slotHour);
        });
    };

    // Debug: Log events when they change
    React.useEffect(() => {
        if (events.length > 0) {
            console.log('=== Calendar Events Debug ===');
            console.log('Total events:', events.length);
            console.log('Current week:', weekDays.map(d => d.toDateString()));
            events.forEach((event, i) => {
                const start = new Date(event.start);
                console.log(`Event ${i + 1}: "${event.title}" on ${start.toDateString()} at ${start.toLocaleTimeString()}`);
            });
        }
    }, [events]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const getEventColor = (event) => {
        if (event.categories?.includes('Work') || event.categories?.includes('Business')) {
            return { bg: 'var(--color-primary-soft)', color: 'var(--color-primary)', border: 'var(--color-primary)' };
        } else if (event.categories?.includes('Personal')) {
            return { bg: 'var(--color-accent-soft)', color: 'var(--color-accent)', border: 'var(--color-accent)' };
        }
        return { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgb(59, 130, 246)' };
    };

    const weekDays = getWeekDays();
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', height: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ marginBottom: '4px' }}>Study Calendar</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        {authenticated && user ? `Synced with ${user.username}` : 'Your schedule from Microsoft Calendar'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {authenticated ? (
                        <>
                            <button className="btn btn-ghost" onClick={goToToday}>Today</button>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-ghost" onClick={goToPreviousWeek}><ChevronLeft size={20} /></button>
                                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', minWidth: '150px', justifyContent: 'center' }}>
                                    {monthYear}
                                </span>
                                <button className="btn btn-ghost" onClick={goToNextWeek}><ChevronRight size={20} /></button>
                            </div>
                            <button className="btn btn-primary" onClick={fetchCalendarEvents}>
                                <CalendarIcon size={18} /> Refresh
                            </button>
                            <button className="btn btn-ghost" onClick={handleSignOut}>Sign Out</button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={handleSignIn}>
                            <LogIn size={18} /> Sign in with Microsoft
                        </button>
                    )}
                </div>
            </div>

            {/* Checking Auth State */}
            {checkingAuth && (
                <Card style={{ padding: '40px', textAlign: 'center' }}>
                    <Loader size={32} color="var(--color-primary)" style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '16px', color: 'var(--color-text-secondary)' }}>Checking authentication...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </Card>
            )}

            {/* Not Authenticated State */}
            {!checkingAuth && !authenticated && (
                <Card style={{ padding: '60px 40px', textAlign: 'center' }}>
                    <LogIn size={64} color="var(--color-primary)" style={{ opacity: 0.3, marginBottom: '24px' }} />
                    <h2 style={{ marginBottom: '12px' }}>Sign in Required</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                        Sign in with your Microsoft account to view your calendar events
                    </p>
                    <button className="btn btn-primary" onClick={handleSignIn} style={{ fontSize: '1rem', padding: '12px 24px' }}>
                        <LogIn size={20} /> Sign in with Microsoft
                    </button>
                </Card>
            )}

            {/* Loading State */}
            {loading && authenticated && (
                <Card style={{ padding: '40px', textAlign: 'center' }}>
                    <Loader size={32} color="var(--color-primary)" style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '16px', color: 'var(--color-text-secondary)' }}>Loading calendar events...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </Card>
            )}

            {/* Error State */}
            {error && !loading && authenticated && (
                <Card style={{ padding: '40px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgb(239, 68, 68)' }}>
                    <p style={{ color: 'rgb(239, 68, 68)', fontWeight: 600 }}>{error}</p>
                    <button className="btn btn-primary" onClick={fetchCalendarEvents} style={{ marginTop: '16px' }}>
                        Retry
                    </button>
                </Card>
            )}

            {/* Calendar Grid - Only show when authenticated and not loading */}
            {!checkingAuth && authenticated && !loading && !error && (
                <Card style={{ flex: 1, minHeight: '600px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {/* Desktop View */}
                    <div className="calendar-desktop" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {/* Days Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '80px repeat(7, 1fr)',
                            borderBottom: '1px solid var(--color-border)',
                            background: 'var(--color-bg-secondary)'
                        }}>
                            <div style={{ padding: '16px', borderRight: '1px solid var(--color-border)' }}></div>
                            {weekDays.map((day, idx) => {
                                const isToday = day.toDateString() === new Date().toDateString();
                                return (
                                    <div key={idx} style={{
                                        padding: '12px',
                                        textAlign: 'center',
                                        borderRight: '1px solid var(--color-border)',
                                        background: isToday ? 'var(--color-primary-soft)' : 'transparent'
                                    }}>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            color: isToday ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                                        }}>
                                            {dayNames[idx]}
                                        </div>
                                        <div style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 700,
                                            color: isToday ? 'var(--color-primary)' : 'var(--color-text-primary)',
                                            marginTop: '4px'
                                        }}>
                                            {day.getDate()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Body */}
                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {timeSlots.map(timeSlot => (
                                <div key={timeSlot} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '80px repeat(7, 1fr)',
                                    minHeight: '80px'
                                }}>
                                    <div style={{
                                        padding: '8px',
                                        fontSize: '0.8rem',
                                        color: 'var(--color-text-secondary)',
                                        borderRight: '1px solid var(--color-border)',
                                        borderBottom: '1px solid var(--color-border)',
                                        textAlign: 'center',
                                        fontWeight: 600
                                    }}>
                                        {timeSlot}
                                    </div>
                                    {weekDays.map((day, dayIdx) => {
                                        const slotEvents = getEventsForSlot(day, timeSlot);

                                        return (
                                            <div key={`${day}-${timeSlot}`} style={{
                                                borderRight: '1px solid var(--color-border)',
                                                borderBottom: '1px solid var(--color-border)',
                                                padding: '4px',
                                                position: 'relative',
                                                background: 'var(--color-bg)'
                                            }}>
                                                {slotEvents.map((event, eventIdx) => {
                                                    const colors = getEventColor(event);
                                                    return (
                                                        <div key={eventIdx} style={{
                                                            background: colors.bg,
                                                            color: colors.color,
                                                            padding: '6px 8px',
                                                            borderRadius: 'var(--radius-sm)',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            height: '100%',
                                                            borderLeft: `3px solid ${colors.border}`,
                                                            marginBottom: slotEvents.length > 1 ? '4px' : '0',
                                                            cursor: 'pointer',
                                                            transition: 'transform 0.2s',
                                                            overflow: 'hidden'
                                                        }}
                                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                            title={`${event.title}\n${formatTime(event.start)} - ${formatTime(event.end)}${event.location ? '\n' + event.location : ''}`}
                                                        >
                                                            <div style={{ fontWeight: 700, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {event.title}
                                                            </div>
                                                            <div style={{ fontSize: '0.7rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <Clock size={10} />
                                                                {formatTime(event.start)}
                                                            </div>
                                                            {event.location && (
                                                                <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    <MapPin size={9} />
                                                                    {event.location}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile View - List of Events */}
                    <div className="calendar-mobile" style={{ display: 'none', padding: '16px', overflowY: 'auto' }}>
                        {weekDays.map((day, dayIdx) => {
                            const dayEvents = events.filter(event => {
                                const eventStart = new Date(event.start);
                                return eventStart.getDate() === day.getDate() &&
                                    eventStart.getMonth() === day.getMonth() &&
                                    eventStart.getFullYear() === day.getFullYear();
                            });

                            if (dayEvents.length === 0) return null;

                            const isToday = day.toDateString() === new Date().toDateString();

                            return (
                                <div key={dayIdx} style={{ marginBottom: '24px' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        marginBottom: '12px',
                                        color: isToday ? 'var(--color-primary)' : 'var(--color-text-primary)',
                                        borderBottom: '2px solid var(--color-border)',
                                        paddingBottom: '8px'
                                    }}>
                                        {day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                        {isToday && <span style={{ fontSize: '0.8rem', marginLeft: '8px', fontWeight: 'normal' }}>(Today)</span>}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {dayEvents.map((event, eventIdx) => {
                                            const colors = getEventColor(event);
                                            return (
                                                <div key={eventIdx} style={{
                                                    background: colors.bg,
                                                    border: `2px solid ${colors.border}`,
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: '12px',
                                                    color: colors.color
                                                }}>
                                                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>
                                                        {event.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Clock size={16} />
                                                        {formatTime(event.start)} - {formatTime(event.end)}
                                                    </div>
                                                    {event.location && (
                                                        <div style={{ fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <MapPin size={14} />
                                                            {event.location}
                                                        </div>
                                                    )}
                                                    {event.attendees && event.attendees.length > 0 && (
                                                        <div style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Users size={14} />
                                                            {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                                                        </div>
                                                    )}
                                                    {event.description && (
                                                        <div style={{ fontSize: '0.8rem', marginTop: '8px', opacity: 0.8, borderTop: `1px solid ${colors.border}`, paddingTop: '8px' }}>
                                                            {event.description.substring(0, 100)}{event.description.length > 100 ? '...' : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                        {events.filter(e => {
                            const eventStart = new Date(e.start);
                            return weekDays.some(day =>
                                eventStart.getDate() === day.getDate() &&
                                eventStart.getMonth() === day.getMonth() &&
                                eventStart.getFullYear() === day.getFullYear()
                            );
                        }).length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                                    <CalendarIcon size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                                    <p>No events scheduled for this week</p>
                                </div>
                            )}
                    </div>
                </Card>
            )}

            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 1024px) {
                    .calendar-desktop {
                        display: none !important;
                    }
                    .calendar-mobile {
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
};
