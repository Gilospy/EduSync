// ==========================================
// Supabase Configuration
// ==========================================
const SUPABASE_URL = 'https://nvgbbllooylgumziitvd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZIFRdJdj7qqmWJITwyTCA_rqlTefro';

// ==========================================
// Initialize and Load Students
// ==========================================
document.addEventListener('DOMContentLoaded', async function() {
    await loadStudents();
    setupSearchFunctionality();
    setupRefreshButton();
});

// ==========================================
// Fetch Students from Supabase
// ==========================================
async function loadStudents() {
    try {
        console.log('Fetching students from local API...');
        const response = await fetch('/api/students');

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Response error:', errorData);
            throw new Error(`Failed to fetch students: ${response.status} ${response.statusText}`);
        }

        const students = await response.json();
        console.log('Students loaded:', students);
        displayStudents(students);
        updateTotalCount(students.length);

    } catch (error) {
        console.error('Full error object:', error);
        console.error('Error message:', error.message);
        displayError(`Error: ${error.message}`);
    }
}

// ==========================================
// Display Students in Table
// ==========================================
function displayStudents(students) {
    const tableBody = document.getElementById('studentsTableBody');
    
    if (!students || students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fa-solid fa-inbox"></i> No students found
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = students.map(student => {
        const enrollmentDate = new Date(student.enrollment_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const status = getStudentStatus(student.status);
        const statusClass = getStatusClass(student.status);
        const focusTime = student.focus_time || '0h 0m';

        return `
            <tr>
                <td>#${student.id.toString().padStart(4, '0')}</td>
                <td>${student.name || 'N/A'}</td>
                <td>${student.email || 'N/A'}</td>
                <td>${enrollmentDate}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${status}
                    </span>
                </td>
                <td>${focusTime}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action" title="View Details" onclick="viewStudentDetails(${student.id})">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-action" title="Edit" onclick="editStudent(${student.id})">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ==========================================
// Helper Functions
// ==========================================
function getStudentStatus(statusValue) {
    const statusMap = {
        'active': 'Active',
        'inactive': 'Inactive',
        'at_risk': 'At Risk'
    };
    return statusMap[statusValue] || 'Unknown';
}

function getStatusClass(statusValue) {
    const classMap = {
        'active': 'status-active',
        'inactive': 'status-inactive',
        'at_risk': 'status-at-risk'
    };
    return classMap[statusValue] || 'status-inactive';
}

function updateTotalCount(count) {
    const totalCountElement = document.getElementById('totalCount');
    totalCountElement.textContent = `${count} students`;
}

function displayError(message) {
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 40px; color: var(--danger);">
                <i class="fa-solid fa-circle-exclamation"></i> ${message}
            </td>
        </tr>
    `;
}

// ==========================================
// Search Functionality
// ==========================================
function setupSearchFunctionality() {
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('input', async function() {
        const searchTerm = this.value.toLowerCase().trim();

        if (searchTerm === '') {
            await loadStudents();
            return;
        }

        try {
            const response = await fetch('/api/students');

            const students = await response.json();
            const filtered = students.filter(student => 
                (student.name && student.name.toLowerCase().includes(searchTerm)) ||
                (student.email && student.email.toLowerCase().includes(searchTerm)) ||
                (student.id && student.id.toString().includes(searchTerm))
            );

            displayStudents(filtered);
            updateTotalCount(filtered.length);

        } catch (error) {
            console.error('Search error:', error);
        }
    });
}

// ==========================================
// Refresh Button
// ==========================================
function setupRefreshButton() {
    const refreshBtn = document.querySelector('.btn-refresh');
    refreshBtn.addEventListener('click', async function() {
        refreshBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Refreshing...';
        await loadStudents();
        refreshBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Refresh';
    });
}

// ==========================================
// Action Handlers
// ==========================================
function viewStudentDetails(studentId) {
    alert(`View details for student #${studentId}`);
    // TODO: Implement student details modal
}

function editStudent(studentId) {
    alert(`Edit student #${studentId}`);
    // TODO: Implement student edit modal
}
