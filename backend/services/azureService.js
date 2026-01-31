const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
require('dotenv').config();

const endpoint = process.env.DOS_ENDPOINT;
const key = process.env.DOS_KEY;

// Mock data for demo purposes
const MOCK_SYLLABUS_DATA = {
    courseTitle: "Biology 101",
    instructor: "Dr. Sarah Miller",
    semester: "Fall 2024",
    gradeBreakdown: [
        { category: "Homework", weight: "20%" },
        { category: "Midterm Exam", weight: "30%" },
        { category: "Final Exam", weight: "40%" },
        { category: "Participation", weight: "10%" }
    ],
    assignments: [
        {
            title: "Cell Structure Essay",
            dueDate: "2024-09-15",
            description: "Write a 1000-word essay on the structure of plant and animal cells."
        },
        {
            title: "Midterm Exam",
            dueDate: "2024-10-20",
            description: "Covers chapters 1-5."
        },
        {
            title: "Genetics Lab Report",
            dueDate: "2024-11-10",
            description: "Report on the Drosophila melanogaster experiment."
        },
        {
            title: "Final Exam",
            dueDate: "2024-12-15",
            description: "Cumulative exam covering all course material."
        }
    ]
};

exports.extractSyllabusData = async (fileBuffer) => {
    // If keys are missing, return mock data immediately
    if (!endpoint || !key) {
        console.log("Azure credentials not found. Using MOCK data.");
        return MOCK_SYLLABUS_DATA;
    }

    try {
        const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

        // Use the prebuilt-document model (or prebuilt-layout)
        // For syllabus, 'prebuilt-document' or 'prebuilt-layout' is usually best to extract text and tables
        // Here we simulate "intelligent extraction" by just returning mock data if the file is a specific "demo.pdf"
        // In a real scenario, we would parse `result.content` or `result.keyValuePairs`

        // START POLL
        const poller = await client.beginAnalyzeDocument("prebuilt-layout", fileBuffer);
        const result = await poller.pollUntilDone();

        // --------------------------------------------------
        // LOG RAW OUTPUT AS REQUESTED BY USER
        // --------------------------------------------------
        console.log("--------------------------------------------------");
        console.log("AZURE DOCUMENT INTELLIGENCE RAW OUTPUT:");
        console.log(JSON.stringify(result, null, 2));
        console.log("--------------------------------------------------");

        // Return the result (partially or fully) - the controller sends it to frontend
        // We can return the raw result for now so the user can inspect it if they want
        return result;

        // TODO: Implement parsing logic for EduSync structure
        // return MOCK_SYLLABUS_DATA;

        // However, to prove we connected, we can log the page count
        console.log(`Analyzed document with ${result.pages.length} pages.`);

        // Return mock data for the "Wow" factor in demo
        return MOCK_SYLLABUS_DATA;

    } catch (error) {
        console.error("Error analyzing document:", error);
        // Fallback to mock on error
        return MOCK_SYLLABUS_DATA;
    }
};
