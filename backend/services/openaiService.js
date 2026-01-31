const Groq = require('groq-sdk');
require('dotenv').config();

const groqApiKey = process.env.GROQ_API_KEY;

/**
 * Extract structured syllabus data from raw Document Intelligence content
 * using Groq API
 */
exports.parseSyllabusWithGPT = async (rawContent) => {
    if (!groqApiKey) {
        console.log("Groq API key not found. Cannot parse syllabus.");
        return null;
    }

    try {
        const groq = new Groq({ apiKey: groqApiKey });

        const systemPrompt = `You are an AI assistant that extracts structured information from course syllabi. 
Given the raw text content of a syllabus, extract and return a JSON object with the following structure:

{
  "courseTitle": "Course name and code",
  "instructor": "Instructor name",
  "semester": "Semester/Term if mentioned",
  "credits": "Credit hours if mentioned",
  "gradeBreakdown": [
    { "category": "Category name", "weight": "Percentage" }
  ],
  "assignments": [
    {
      "title": "Assignment/Exam name",
      "dueDate": "Date in YYYY-MM-DD format if available, otherwise 'TBD'",
      "description": "Brief description",
      "weight": "Percentage if mentioned"
    }
  ],
  "topics": ["List of main topics covered"],
  "prerequisites": "Prerequisites if mentioned"
}

If a field cannot be determined, use null or an empty array as appropriate.
Return ONLY the JSON object, no additional text.`;

        console.log("Calling Groq API...");

        const chatCompletion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Extract structured syllabus data from the following content:\n\n${rawContent}` }
            ],
            temperature: 0.2,
            max_tokens: 2000,
        });

        const groqResponse = chatCompletion.choices[0].message.content;
        console.log("--------------------------------------------------");
        console.log("GROQ PARSED RESPONSE:");
        console.log(groqResponse);
        console.log("--------------------------------------------------");

        try {
            const parsed = JSON.parse(groqResponse);
            return parsed;
        } catch (parseError) {
            const jsonMatch = groqResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            console.error("Failed to parse Groq response as JSON:", parseError);
            return { rawResponse: groqResponse };
        }

    } catch (error) {
        console.error("Error calling Groq API:", error);
        throw error;
    }
};

/**
 * Break down an assignment into structured micro-steps using Groq API
 */
exports.breakdownAssignment = async (rawContent) => {
    if (!groqApiKey) {
        console.log("Groq API key not found. Cannot break down assignment.");
        return null;
    }

    try {
        const groq = new Groq({ apiKey: groqApiKey });

        const systemPrompt = `You are an AI assistant that breaks down academic assignments into actionable micro-steps to help students complete their work efficiently.

Given the assignment details, create a structured breakdown with the following JSON format:

{
  "assignmentTitle": "Title of the assignment",
  "courseCode": "Course code",
  "courseName": "Course name",
  "dueDate": "Due date if mentioned",
  "totalSteps": number,
  "estimatedHours": number,
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title (e.g., 'Research sources')",
      "description": "Detailed description of what to do",
      "estimatedMinutes": number,
      "tips": ["Helpful tip 1", "Helpful tip 2"]
    }
  ]
}

Break down the assignment into logical steps such as:
- Researching sources/materials
- Understanding requirements
- Drafting an outline/plan
- Working on initial draft/implementation
- Review and refinement
- Final submission preparation

Return ONLY the JSON object, no additional text.`;

        console.log("Calling Groq API for assignment breakdown...");

        const chatCompletion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Break down the following assignment into micro-steps:\n\n${rawContent}` }
            ],
            temperature: 0.3,
            max_tokens: 2000,
        });

        const groqResponse = chatCompletion.choices[0].message.content;
        console.log("--------------------------------------------------");
        console.log("GROQ ASSIGNMENT BREAKDOWN:");
        console.log(groqResponse);
        console.log("--------------------------------------------------");

        try {
            const parsed = JSON.parse(groqResponse);
            return parsed;
        } catch (parseError) {
            const jsonMatch = groqResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            console.error("Failed to parse Groq response as JSON:", parseError);
            return { rawResponse: groqResponse };
        }

    } catch (error) {
        console.error("Error calling Groq API:", error);
        throw error;
    }
};

