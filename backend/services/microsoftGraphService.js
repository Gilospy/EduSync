const { Client } = require('@microsoft/microsoft-graph-client');
const { ConfidentialClientApplication } = require('@azure/msal-node');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const tenantId = process.env.TENANT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI || 'http://localhost:5000/api/calendar/oauth/callback';

// In-memory token storage (in production, use a database)
let userTokens = null;

/**
 * Create MSAL configuration for OAuth
 */
const msalConfig = {
    auth: {
        clientId: clientId,
        authority: `https://login.microsoftonline.com/common`, // 'common' supports personal and work accounts
        clientSecret: clientSecret,
    }
};

const msalClient = new ConfidentialClientApplication(msalConfig);

/**
 * Get the authorization URL for user login
 */
function getAuthUrl() {
    const authCodeUrlParameters = {
        scopes: ['Calendars.Read', 'User.Read', 'offline_access'],
        redirectUri: redirectUri,
    };

    return msalClient.getAuthCodeUrl(authCodeUrlParameters);
}

/**
 * Exchange authorization code for access token
 */
async function getTokenFromCode(code) {
    try {
        const tokenRequest = {
            code: code,
            scopes: ['Calendars.Read', 'User.Read', 'offline_access'],
            redirectUri: redirectUri,
        };

        const response = await msalClient.acquireTokenByCode(tokenRequest);

        // Store tokens
        userTokens = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresOn: response.expiresOn,
            account: response.account
        };

        console.log('Successfully acquired token for user:', response.account?.username);
        return userTokens;

    } catch (error) {
        console.error('Error acquiring token:', error);
        throw error;
    }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken() {
    if (!userTokens || !userTokens.refreshToken) {
        throw new Error('No refresh token available. User needs to sign in again.');
    }

    try {
        const refreshTokenRequest = {
            refreshToken: userTokens.refreshToken,
            scopes: ['Calendars.Read', 'User.Read', 'offline_access'],
        };

        const response = await msalClient.acquireTokenByRefreshToken(refreshTokenRequest);

        userTokens = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken || userTokens.refreshToken,
            expiresOn: response.expiresOn,
            account: response.account
        };

        console.log('Successfully refreshed token');
        return userTokens;

    } catch (error) {
        console.error('Error refreshing token:', error);
        // Clear tokens if refresh fails
        userTokens = null;
        throw new Error('Token refresh failed. User needs to sign in again.');
    }
}

/**
 * Get a valid access token (refresh if needed)
 */
async function getValidToken() {
    if (!userTokens) {
        throw new Error('User not authenticated. Please sign in first.');
    }

    // Check if token is expired or about to expire (within 5 minutes)
    const now = new Date();
    const expiresOn = new Date(userTokens.expiresOn);
    const fiveMinutes = 5 * 60 * 1000;

    if (expiresOn.getTime() - now.getTime() < fiveMinutes) {
        console.log('Token expired or expiring soon, refreshing...');
        await refreshAccessToken();
    }

    return userTokens.accessToken;
}

/**
 * Create and configure Microsoft Graph client with user token
 */
async function getGraphClient() {
    const accessToken = await getValidToken();

    const client = Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return userTokens !== null && userTokens.accessToken !== null;
}

/**
 * Get current user info
 */
function getCurrentUser() {
    if (!userTokens || !userTokens.account) {
        return null;
    }
    return {
        username: userTokens.account.username,
        name: userTokens.account.name
    };
}

/**
 * Sign out user
 */
function signOut() {
    userTokens = null;
    console.log('User signed out');
}

/**
 * Fetch calendar events for the authenticated user
 */
async function getUserCalendarEvents(daysAhead = 30) {
    try {
        const client = await getGraphClient();

        // Calculate date range - include past 7 days to show recent events
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7); // 7 days ago
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + daysAhead);
        endDate.setHours(23, 59, 59, 999);

        const user = getCurrentUser();
        console.log(`Fetching calendar events for ${user?.username || 'current user'}`);
        console.log(`Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

        // Fetch calendar events
        const response = await client
            .api('/me/calendar/events')
            .select('subject,start,end,location,bodyPreview,attendees,isAllDay,organizer,categories')
            .filter(`start/dateTime ge '${startDate.toISOString()}' and end/dateTime le '${endDate.toISOString()}'`)
            .orderby('start/dateTime')
            .top(100)
            .get();

        console.log(`\n=== CALENDAR EVENTS FOUND: ${response.value?.length || 0} ===`);

        // Format events and log details
        const events = response.value.map((event, index) => {
            console.log(`\nEvent ${index + 1}:`);
            console.log(`  Title: ${event.subject}`);
            console.log(`  Start: ${event.start.dateTime} (${event.start.timeZone})`);
            console.log(`  End: ${event.end.dateTime} (${event.end.timeZone})`);
            console.log(`  Location: ${event.location?.displayName || 'N/A'}`);
            console.log(`  All Day: ${event.isAllDay}`);

            return {
                id: event.id,
                title: event.subject,
                start: event.start.dateTime,
                end: event.end.dateTime,
                timeZone: event.start.timeZone,
                location: event.location?.displayName || '',
                description: event.bodyPreview || '',
                isAllDay: event.isAllDay || false,
                organizer: event.organizer?.emailAddress?.name || '',
                attendees: event.attendees?.map(a => a.emailAddress?.name).filter(Boolean) || [],
                categories: event.categories || []
            };
        });

        console.log(`\n=== END EVENTS ===\n`);

        return events;

    } catch (error) {
        console.error('Error fetching calendar events:', error);
        console.error('Error details:', {
            statusCode: error.statusCode,
            message: error.message,
            code: error.code
        });

        if (error.statusCode === 401) {
            // Try to refresh token
            try {
                await refreshAccessToken();
                // Retry the request
                return await getUserCalendarEvents(daysAhead);
            } catch (refreshError) {
                throw new Error('Authentication expired. Please sign in again.');
            }
        }

        throw error;
    }
}

/**
 * Fetch calendar events by date range
 */
async function getUserCalendarEventsByDateRange(startDate, endDate) {
    try {
        const client = await getGraphClient();

        console.log(`Fetching calendar events from ${startDate} to ${endDate}`);

        const response = await client
            .api('/me/calendar/events')
            .select('subject,start,end,location,bodyPreview,attendees,isAllDay,organizer,categories')
            .filter(`start/dateTime ge '${startDate}' and end/dateTime le '${endDate}'`)
            .orderby('start/dateTime')
            .top(100)
            .get();

        const events = response.value.map(event => ({
            id: event.id,
            title: event.subject,
            start: event.start.dateTime,
            end: event.end.dateTime,
            timeZone: event.start.timeZone,
            location: event.location?.displayName || '',
            description: event.bodyPreview || '',
            isAllDay: event.isAllDay || false,
            organizer: event.organizer?.emailAddress?.name || '',
            attendees: event.attendees?.map(a => a.emailAddress?.name).filter(Boolean) || [],
            categories: event.categories || []
        }));

        return events;

    } catch (error) {
        console.error('Error fetching calendar events by date range:', error);

        if (error.statusCode === 401) {
            try {
                await refreshAccessToken();
                return await getUserCalendarEventsByDateRange(startDate, endDate);
            } catch (refreshError) {
                throw new Error('Authentication expired. Please sign in again.');
            }
        }

        throw error;
    }
}

module.exports = {
    getAuthUrl,
    getTokenFromCode,
    getUserCalendarEvents,
    getUserCalendarEventsByDateRange,
    isAuthenticated,
    getCurrentUser,
    signOut
};
