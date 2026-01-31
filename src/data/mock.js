export const MOCK_STUDENT = {
    name: "Alex Chen",
    major: "Computer Science",
    gpa: 3.8,
    stressLevel: "Moderate", // Low, Moderate, High
    nextAssignment: {
        course: "CS302: Algorithms",
        title: "Dynamic Programming Problem Set",
        due: "Tomorrow, 11:59 PM",
        weight: "15%",
        estimatedTime: "2.5 hrs"
    },
    schedule: [
        { time: "10:00 AM", course: "CS302 Lecture", type: "class" },
        { time: "01:00 PM", course: "Study Block: Algorithms", type: "study", duration: "1h" },
        { time: "03:30 PM", course: "BIO101 Lab", type: "class" }
    ]
};

export const MOCK_ASSIGNMENTS = [
    {
        id: 1,
        course: "CS302: Algorithms",
        title: "Dynamic Programming Problem Set",
        status: "In Progress",
        progress: 65,
        dueDate: "2024-10-24",
        priority: "High",
        steps: [
            { id: 1, text: "Wait for lecture notes", done: true },
            { id: 2, text: "Draft pseudocode for Q1-Q3", done: true },
            { id: 3, text: "Implement Python solutions", done: false },
            { id: 4, text: "Write complexity analysis", done: false },
        ]
    },
    {
        id: 2,
        course: "BIO101: Cell Biology",
        title: "Mitosis Research Paper",
        status: "Not Started",
        progress: 0,
        dueDate: "2024-10-28",
        priority: "Medium",
        steps: [
            { id: 1, text: "Find 3 reputable sources", done: false },
            { id: 2, text: "Create outline", done: false },
            { id: 3, text: "First draft", done: false },
        ]
    },
    {
        id: 3,
        course: "HIS240: Modern History",
        title: "Midterm Review",
        status: "Completed",
        progress: 100,
        dueDate: "2024-10-20",
        priority: "Low",
        steps: []
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
