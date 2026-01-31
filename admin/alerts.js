document.addEventListener('DOMContentLoaded', function() {
    loadAlerts();
    initializeEventListeners();
});

function loadAlerts() {
    const alerts = [
        {
            id: 1,
            course: 'Data Structures',
            topic: 'Binary Tree Structures',
            severity: 'high',
            affectedStudents: 42,
            percentage: '42%',
            message: 'High difficulty detected in Data Structures – Binary Tree Structures. 42% of students missed tasks. Consider an additional review session.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            action: 'Email/Teams Notification Sent'
        },
        {
            id: 2,
            course: 'Operating Systems',
            topic: 'Process Management',
            severity: 'medium',
            affectedStudents: 28,
            percentage: '28%',
            message: 'Moderate engagement drop-off detected in Operating Systems – Process Management. Consider supplementary materials.',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            action: 'Notification Pending'
        },
        {
            id: 3,
            course: 'Signals and Systems',
            topic: 'Waveform Analysis',
            severity: 'medium',
            affectedStudents: 15,
            percentage: '15%',
            message: 'Rising risk trend detected in Signals and Systems – Waveform Analysis.',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            action: 'Risk Monitoring'
        }
    ];

    const container = document.getElementById('alerts-container');
    container.innerHTML = alerts.map(alert => createAlertCard(alert)).join('');
}

function createAlertCard(alert) {
    const severityColor = {
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#10b981'
    }[alert.severity];

    const severityBg = {
        high: '#fee2e2',
        medium: '#fef3c7',
        low: '#d1fae5'
    }[alert.severity];

    return `
        <div style="
            padding: 16px;
            background: white;
            border: 1px solid #e5e7eb;
            border-left: 4px solid ${severityColor};
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        ">
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="
                        font-size: 11px;
                        font-weight: bold;
                        padding: 4px 8px;
                        background: ${severityBg};
                        color: ${severityColor};
                        border-radius: 4px;
                        text-transform: uppercase;
                    ">${alert.severity}</span>
                    <span style="font-size: 14px; font-weight: bold; color: #1f2937;">
                        ${alert.course} - ${alert.topic}
                    </span>
                </div>
                <p style="margin: 8px 0; color: #374151; font-size: 14px; line-height: 1.5;">
                    ${alert.message}
                </p>
                <div style="display: flex; gap: 20px; font-size: 12px; color: #6b7280; margin-top: 8px;">
                    <span>👥 ${alert.affectedStudents} students (${alert.percentage})</span>
                    <span>⏰ ${formatTime(alert.timestamp)}</span>
                    <span>✉️ ${alert.action}</span>
                </div>
            </div>
        </div>
    `;
}

function formatTime(date) {
    const hours = Math.floor((Date.now() - date) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
}

function initializeEventListeners() {
    const refreshBtn = document.querySelector('.btn-refresh');
    const exportBtn = document.querySelector('.btn-export');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadAlerts();
            alert('Alerts refreshed!');
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('Exporting alerts data...');
        });
    }
}
