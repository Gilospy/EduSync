const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const azureService = require('../services/azureService');
const openaiService = require('../services/openaiService');

// POST /api/assignments/breakdown/:filename
// Get the breakdown of an assignment PDF from the assignments folder
router.post('/breakdown/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '..', 'assignments', filename);

        console.log(`Looking for assignment file: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Assignment file not found', path: filePath });
        }

        // Read the PDF file
        const fileBuffer = fs.readFileSync(filePath);
        console.log(`Loaded file ${filename}, size: ${fileBuffer.length} bytes`);

        // Step 1: Extract raw text using Azure Document Intelligence
        console.log("Extracting text with Document Intelligence...");
        const docIntelResult = await azureService.extractSyllabusData(fileBuffer);

        const rawContent = docIntelResult.content || JSON.stringify(docIntelResult);
        console.log(`Extracted ${rawContent.length} characters of text`);

        // Step 2: Break down the assignment using Groq
        console.log("Breaking down assignment with Groq...");
        const breakdown = await openaiService.breakdownAssignment(rawContent);

        res.json({
            success: true,
            message: 'Assignment breakdown generated',
            filename: filename,
            data: breakdown
        });

    } catch (error) {
        console.error('Error in assignment breakdown:', error);
        res.status(500).json({ error: 'Failed to process assignment', details: error.message });
    }
});

// GET /api/assignments/list
// List available assignment PDFs
router.get('/list', (req, res) => {
    try {
        const assignmentsDir = path.join(__dirname, '..', 'assignments');
        const files = fs.readdirSync(assignmentsDir).filter(f => f.endsWith('.pdf'));
        res.json({ files });
    } catch (error) {
        res.status(500).json({ error: 'Failed to list assignments' });
    }
});

module.exports = router;
