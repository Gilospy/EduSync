document.addEventListener('DOMContentLoaded', function() {
    loadRiskData();
    loadInterventions();
    initializeEventListeners();
});

function loadRiskData() {
    const riskData = [
        {
            id: 1,
            studentName: 'Omar Abdullah',
            course: 'Signals and Systems',
            riskScore: 99.30,
            trend: 'rising',
            engagementDrop: '35%',
            missedTasks: 5
        },
        {
            id: 2,
            studentName: 'Maya Mohammed',
            course: 'Data Structures',
            riskScore: 82.35,
            trend: 'stable',
            engagementDrop: '20%',
            missedTasks: 2
        },
        {
            id: 3,
            studentName: 'Ali Salem',
            course: 'Linear Algebra',
            riskScore: 72,
            trend: 'falling',
            engagementDrop: '15%',
            missedTasks: 1
        },
        {
            id: 4,
            studentName: 'Yousef Hassan',
            course: 'MATH301',
            riskScore: 64.71,
            trend: 'stable',
            engagementDrop: '10%',
            missedTasks: 0
        }
    ];

    const tbody = document.getElementById('risk-tbody');
    tbody.innerHTML = riskData.map((student, idx) => {
        const severityColor = student.riskScore >= 75 ? '#ef4444' : student.riskScore >= 50 ? '#f59e0b' : '#10b981';
        const trendIcon = student.trend === 'rising' ? '📈' : student.trend === 'falling' ? '📉' : '➡️';

        return `
            <tr style="border-bottom: 1px solid #e5e7eb; background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                <td style="padding: 12px; color: #1f2937; font-weight: 500;">${student.studentName}</td>
                <td style="padding: 12px; color: #6b7280;">${student.course}</td>
                <td style="padding: 12px; text-align: center;">
                    <span style="
                        display: inline-block;
                        padding: 4px 12px;
                        background: ${severityColor}20;
                        color: ${severityColor};
                        border-radius: 4px;
                        font-weight: bold;
                        font-size: 13px;
                    ">${student.riskScore}</span>
                </td>
                <td style="padding: 12px; text-align: center; font-size: 18px;">${trendIcon}</td>
                <td style="padding: 12px; text-align: center; color: #f59e0b; font-weight: 500;">${student.engagementDrop}</td>
                <td style="padding: 12px; text-align: center; color: #6b7280;">${student.missedTasks}</td>
                <td style="padding: 12px;">
                    <button style="
                        padding: 6px 12px;
                        background: #3b82f6;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">Contact</button>
                </td>
            </tr>
        `;
    }).join('');
}

function loadInterventions() {
    const interventions = [
        {
            icon: '📧',
            title: 'Send Encouragement Email',
            description: 'Automated email to at-risk students with resources'
        },
        {
            icon: '📞',
            title: 'Schedule 1-on-1 Meeting',
            description: 'Direct engagement to understand barriers'
        },
        {
            icon: '📚',
            title: 'Additional Study Materials',
            description: 'Supplementary resources for struggling topics'
        },
        {
            icon: '👥',
            title: 'Peer Study Groups',
            description: 'Connect students for collaborative learning'
        }
    ];

    const container = document.getElementById('interventions-container');
    container.innerHTML = interventions.map(intervention => `
        <div style="
            padding: 16px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        ">
            <div style="font-size: 24px; margin-bottom: 8px;">${intervention.icon}</div>
            <div style="font-weight: bold; margin-bottom: 5px; color: #1f2937;">
                ${intervention.title}
            </div>
            <div style="font-size: 13px; color: #6b7280; line-height: 1.4;">
                ${intervention.description}
            </div>
        </div>
    `).join('');
}

function initializeEventListeners() {
    const refreshBtn = document.querySelector('.btn-refresh');
    const exportBtn = document.querySelector('.btn-export');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadRiskData();
            alert('Retention data refreshed!');
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('Exporting retention data...');
        });
    }
}
