const express = require('express');
const path = require('path');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Proxy Configuration (if behind corporate proxy)
// ==========================================
// Set environment variables before running:
// Windows: $env:HTTPS_PROXY="http://proxy-address:port"
// Linux/Mac: export HTTPS_PROXY="http://proxy-address:port"
let customFetch = fetch;

if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) {
    console.log('⚠️  Using proxy:', process.env.HTTPS_PROXY || process.env.HTTP_PROXY);
    try {
        const HttpsProxyAgent = require('https-proxy-agent');
        const HttpProxyAgent = require('http-proxy-agent');
        
        const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
        const httpsAgent = new HttpsProxyAgent(proxyUrl);
        const httpAgent = new HttpProxyAgent(proxyUrl);
        
        customFetch = (url, options = {}) => {
            const parsedUrl = new URL(url);
            if (parsedUrl.protocol === 'https:') {
                options.agent = httpsAgent;
            } else {
                options.agent = httpAgent;
            }
            return fetch(url, options);
        };
        console.log('✓ Proxy agents configured');
    } catch (e) {
        console.error('Install proxy agents: npm install https-proxy-agent http-proxy-agent');
    }
}

// ==========================================
// Mock Institute Database (Replace with real DB)
// ==========================================
const institutes = {
    'inst001': {
        id: 'inst001',
        name: 'Harvard University',
        powerbiReportId: '20918eab-509a-4507-9c01-2d84534e9ada',
        tenantId: 'd1d8f653-6844-454b-a4fc-c52bc2c76e72'
    },
    'inst002': {
        id: 'inst002',
        name: 'MIT',
        powerbiReportId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'd1d8f653-6844-454b-a4fc-c52bc2c76e72'
    },
    'inst003': {
        id: 'inst003',
        name: 'Stanford University',
        powerbiReportId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        tenantId: 'd1d8f653-6844-454b-a4fc-c52bc2c76e72'
    }
};

// Mock KPI data per institute
const instituteData = {
    'inst001': {
        totalStudents: 2543,
        avgFocusTime: '4h 12m',
        completionRate: 87.4,
        atRisk: 148
    },
    'inst002': {
        totalStudents: 1890,
        avgFocusTime: '3h 45m',
        completionRate: 91.2,
        atRisk: 85
    },
    'inst003': {
        totalStudents: 3120,
        avgFocusTime: '4h 33m',
        completionRate: 89.1,
        atRisk: 201
    }
};

// ==========================================
// Session Configuration
// ==========================================
app.use(session({
    secret: 'edusync-secret-key', // Change in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 } // 1 hour
}));

// Serve static files from the current directory
app.use(express.static(__dirname));
app.use(express.json());

// ==========================================
// Authentication Middleware
// ==========================================
function requireInstitute(req, res, next) {
    if (!req.session.instituteId) {
        return res.redirect('/login');
    }
    next();
}

// ==========================================
// Routes
// ==========================================

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'home', 'index.html'));
});

// Handle institute login
app.post('/api/login', (req, res) => {
    const { instituteId } = req.body;
    
    if (!institutes[instituteId]) {
        return res.status(401).json({ error: 'Invalid institute ID' });
    }
    
    req.session.instituteId = instituteId;
    req.session.instituteName = institutes[instituteId].name;
    
    res.json({ success: true, institute: institutes[instituteId] });
});

// Get available institutes (for login page)
app.get('/api/institutes', (req, res) => {
    const institutesList = Object.values(institutes).map(inst => ({
        id: inst.id,
        name: inst.name
    }));
    res.json(institutesList);
});

// Dashboard route - requires session
app.get('/dashboard', requireInstitute, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'admin.html'));
});

// Get institute-specific data and config
app.get('/api/dashboard-config', requireInstitute, (req, res) => {
    const instituteId = req.session.instituteId;
    const institute = institutes[instituteId];
    const data = instituteData[instituteId];
    
    res.json({
        instituteName: institute.name,
        powerbiConfig: {
            reportId: institute.powerbiReportId,
            embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${institute.powerbiReportId}&autoAuth=true&ctid=${institute.tenantId}`,
            tenantId: institute.tenantId
        },
        kpiData: data
    });
});

// Get institute data
app.get('/api/institute-data', requireInstitute, (req, res) => {
    const data = instituteData[req.session.instituteId];
    res.json(data);
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// ==========================================
// Supabase Proxy Routes (for CORS handling)
// ==========================================
const SUPABASE_URL = 'https://nvgbbllooylgumziitvd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZIFRdJdj7qqmWJITwyTCA_rqlTefro';

// Initialize Supabase client with custom fetch if using proxy
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { fetch: customFetch }
});

// Get all students
app.get('/api/students', async (req, res) => {
    try {
        console.log('\n=== SUPABASE REQUEST (Using Client) ===');
        console.log('Fetching from:', SUPABASE_URL);
        
        const { data, error } = await supabase
            .from('students')
            .select('*');

        if (error) {
            console.error('✗ Supabase error:', error);
            throw error;
        }

        console.log('✓ Students fetched successfully:', data.length, 'records');
        console.log('=== END SUPABASE REQUEST ===\n');
        res.json(data);
        
    } catch (error) {
        console.error('\n✗ === SUPABASE ERROR ===');
        console.error('Error:', error.message);
        console.error('=== END ERROR ===\n');
        
        console.log('Using mock data as fallback...');
        
        // Fallback: Return mock data
        const mockStudents = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                enrollment_date: '2026-01-15',
                status: 'active',
                focus_time: '4h 30m'
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                enrollment_date: '2026-01-10',
                status: 'active',
                focus_time: '5h 15m'
            },
            {
                id: 3,
                name: 'Bob Wilson',
                email: 'bob@example.com',
                enrollment_date: '2025-12-20',
                status: 'at_risk',
                focus_time: '1h 45m'
            },
            {
                id: 4,
                name: 'Alice Johnson',
                email: 'alice@example.com',
                enrollment_date: '2026-01-05',
                status: 'inactive',
                focus_time: '0h 0m'
            }
        ];
        
        res.json(mockStudents);
    }
});

// Root route
app.get('/', (req, res) => {
    if (req.session.instituteId) {
        return res.redirect('/dashboard');
    }
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
