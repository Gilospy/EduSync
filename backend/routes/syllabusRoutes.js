const express = require('express');
const router = express.Router();
const multer = require('multer');
const syllabusController = require('../controllers/syllabusController');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/syllabus/upload
router.post('/upload', upload.single('syllabus'), syllabusController.uploadSyllabus);

module.exports = router;
