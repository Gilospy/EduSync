const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const syllabusRoutes = require('./routes/syllabusRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/assignments', assignmentRoutes);

// Root route
app.get('/', (req, res) => {
    console.log("Root route hit");
    res.send('EduSync AI Backend is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
