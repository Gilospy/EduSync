const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');

dotenv.config();

const syllabusRoutes = require('./routes/syllabusRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Mock Institute Database
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
// Middleware Configuration
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serve static files from root (for legacy html)

// Session Configuration
app.use(session({
    secret: 'edusync-secret-key', // Change in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 } // 1 hour
}));

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
// API Routes (New Features)
// ==========================================
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/assignments', assignmentRoutes);

// ==========================================
// Legacy/Auth Routes (Merged from root server.js)
// ==========================================

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
// Frontend/Page Routes
// ==========================================

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'home', 'index.html'));
});

// Dashboard route - requires session
app.get('/dashboard', requireInstitute, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'admin.html'));
});

// Root route
app.get('/', (req, res) => {
    if (req.session.instituteId) {
        return res.redirect('/dashboard');
    }
    // If accessing via API/backend port directly, show simple message or redirect
    // res.send('EduSync AI Backend is running'); 
    res.redirect('/login');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
