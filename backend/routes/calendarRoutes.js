const express = require('express');
const router = express.Router();
const {
    getAuthUrl,
    getTokenFromCode,
    getUserCalendarEvents,
    getUserCalendarEventsByDateRange,
    isAuthenticated,
    getCurrentUser,
    signOut
} = require('../services/microsoftGraphService');

/**
 * GET /api/calendar/auth/status
 * Check if user is authenticated
 */
router.get('/auth/status', (req, res) => {
    const authenticated = isAuthenticated();
    const user = getCurrentUser();

    res.json({
        authenticated,
        user
    });
});

/**
 * GET /api/calendar/auth/signin
 * Initiate OAuth sign-in flow
 */
router.get('/auth/signin', async (req, res) => {
    try {
        const authUrl = await getAuthUrl();
        res.json({ authUrl });
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).json({ error: 'Failed to initiate sign-in' });
    }
});

/**
 * GET /api/calendar/oauth/callback
 * OAuth callback endpoint
 */
router.get('/oauth/callback', async (req, res) => {
    try {
        const code = req.query.code;

        if (!code) {
            return res.status(400).send('No authorization code provided');
        }

        // Exchange code for token
        const tokens = await getTokenFromCode(code);

        // Redirect to calendar page
        res.send(`
            <html>
                <head>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        }
                        .container {
                            text-align: center;
                            background: white;
                            padding: 40px;
                            border-radius: 12px;
                            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                        }
                        h1 { color: #667eea; margin: 0 0 20px 0; }
                        p { color: #666; margin: 0 0 30px 0; }
                        .success { color: #10b981; font-size: 48px; margin-bottom: 20px; }
                    </style>
                    <script>
                        setTimeout(() => {
                            window.close();
                            window.location.href = 'http://localhost:5173/calendar';
                        }, 2000);
                    </script>
                </head>
                <body>
                    <div class="container">
                        <div class="success">✓</div>
                        <h1>Sign-in Successful!</h1>
                        <p>Welcome, ${tokens.account?.name || 'User'}!</p>
                        <p>Redirecting to calendar...</p>
                    </div>
                </body>
            </html>
        `);

    } catch (error) {
        console.error('Error in OAuth callback:', error);
        res.status(500).send(`
            <html>
                <head>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            background: #f5f5f5;
                        }
                        .container {
                            text-align: center;
                            background: white;
                            padding: 40px;
                            border-radius: 12px;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        h1 { color: #ef4444; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Sign-in Failed</h1>
                        <p>${error.message}</p>
                    </div>
                </body>
            </html>
        `);
    }
});

/**
 * POST /api/calendar/auth/signout
 * Sign out the user
 */
router.post('/auth/signout', (req, res) => {
    signOut();
    res.json({ success: true, message: 'Signed out successfully' });
});

/**
 * GET /api/calendar/events
 * Fetch calendar events (requires authentication)
 */
router.get('/events', async (req, res) => {
    try {
        if (!isAuthenticated()) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated',
                message: 'Please sign in to access calendar events'
            });
        }

        const daysAhead = parseInt(req.query.days) || 30;
        const events = await getUserCalendarEvents(daysAhead);

        res.json({
            success: true,
            count: events.length,
            events: events,
            user: getCurrentUser()
        });

    } catch (error) {
        console.error('Error in /api/calendar/events:', error);

        if (error.message.includes('sign in again')) {
            return res.status(401).json({
                success: false,
                error: 'Authentication expired',
                message: 'Please sign in again',
                details: error.message
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch calendar events',
            details: error.message
        });
    }
});

/**
 * GET /api/calendar/events/:startDate/:endDate
 * Fetch calendar events for a specific date range (requires authentication)
 */
router.get('/events/:startDate/:endDate', async (req, res) => {
    try {
        if (!isAuthenticated()) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated',
                message: 'Please sign in to access calendar events'
            });
        }

        const { startDate, endDate } = req.params;

        // Validate date format
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Use ISO format (YYYY-MM-DD)'
            });
        }

        const events = await getUserCalendarEventsByDateRange(
            start.toISOString(),
            end.toISOString()
        );

        res.json({
            success: true,
            count: events.length,
            events: events
        });

    } catch (error) {
        console.error('Error in /api/calendar/events/:startDate/:endDate:', error);

        if (error.message.includes('sign in again')) {
            return res.status(401).json({
                success: false,
                error: 'Authentication expired',
                message: 'Please sign in again'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch calendar events',
            details: error.message
        });
    }
});

module.exports = router;
