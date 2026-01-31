const azureService = require('../services/azureService');
const openaiService = require('../services/openaiService');

exports.uploadSyllabus = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`Received file: ${req.file.originalname}`);

        // Step 1: Extract raw text using Azure Document Intelligence
        const docIntelResult = await azureService.extractSyllabusData(req.file.buffer);

        console.log("--------------------------------------------------")
        console.log("DOCUMENT INTELLIGENCE RESULT:")
        console.log(docIntelResult)
        console.log("--------------------------------------------------")
        // The Document Intelligence result has a 'content' field with the extracted text
        const rawContent = docIntelResult.content || JSON.stringify(docIntelResult);

        console.log("Document Intelligence extraction complete. Sending to GPT-4o...");

        // Step 2: Parse the raw content with GPT-4o to get structured data
        const structuredData = await openaiService.parseSyllabusWithGPT(rawContent);

        res.json({
            success: true,
            message: 'Syllabus parsed successfully',
            data: structuredData,
            rawContent: rawContent.substring(0, 500) + '...' // Preview of raw content
        });

    } catch (error) {
        console.error('Error in uploadSyllabus:', error);
        res.status(500).json({ error: 'Failed to process syllabus', details: error.message });
    }
};
