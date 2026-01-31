export const MOCK_STUDENT = {
    name: "Alex Chen",
    major: "Computer Science",
    gpa: 3.8,
    stressLevel: "Moderate", // Low, Moderate, High
    nextAssignment: {
        course: "CMP-257: Application Programming",
        title: "Web-based Graphical User Interfaces",
        due: "Tomorrow, 11:59 PM",
        weight: "20%",
        estimatedTime: "4 hrs"
    },
    schedule: [
        { time: "10:00 AM", course: "CMP-257 Lecture", type: "class" },
        { time: "01:00 PM", course: "Study Block: GUI Design", type: "study", duration: "2h" },
        { time: "03:30 PM", course: "DES-101 Studio", type: "class" }
    ]
};

export const MOCK_ASSIGNMENTS = [
    {
        id: 1,
        course: "CMP-257: Application Programming",
        title: "Web-based Graphical User Interfaces",
        status: "In Progress",
        progress: 35,
        dueDate: "2024-10-24",
        priority: "High",
        pdfFile: "CMP-257.pdf",
        steps: [
            { id: 1, text: "Review GUI design principles", done: true },
            { id: 2, text: "Set up development environment", done: false },
            { id: 3, text: "Implement responsive layout", done: false },
            { id: 4, text: "Add interactive components", done: false },
        ]
    },
    {
        id: 2,
        course: "DES-101: Visual Communication Design",
        title: "Design Principles",
        status: "Not Started",
        progress: 0,
        dueDate: "2024-10-28",
        priority: "Medium",
        pdfFile: "DES-101.pdf",
        steps: [
            { id: 1, text: "Research design principles", done: false },
            { id: 2, text: "Create mood board", done: false },
            { id: 3, text: "Draft initial concepts", done: false },
            { id: 4, text: "Refine and finalize", done: false },
        ]
    }
];

export const MOCK_RISK_DATA = {
    totalStudents: 1240,
    highRisk: 84,
    moderateRisk: 215,
    insights: [
        {
            id: 1,
            course: "BIO101 - Intro to Bio",
            metric: "Assignment Drop-off",
            value: "42%",
            trend: "up", // or down
            message: "42% of students missed tasks related to mitosis."
        },
        {
            id: 2,
            course: "CS101 - Intro to CS",
            metric: "Attendance",
            value: "15%",
            trend: "down",
            message: "Attendance dropped significantly before the midterm."
        }
    ],
    students: [
        { name: "Jordan Smith", id: "S10293", riskScore: 92, riskLabel: "Critical", trend: "up", reason: "Missed 3 consecutive assignments" },
        { name: "Casey Lee", id: "S19201", riskScore: 78, riskLabel: "High", trend: "flat", reason: "Exam scores below threshold" },
        { name: "Taylor Doe", id: "S91823", riskScore: 65, riskLabel: "Moderate", trend: "down", reason: "Irregular login patterns" },
    ]
};
