// ==========================================
// Sidebar Toggle (Mobile)
// ==========================================
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// ==========================================
// Load Institute-Specific Dashboard Data
// ==========================================

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Load dashboard configuration
        const response = await fetch('/api/dashboard-config');
        const config = await response.json();

        // Update institute name in sidebar
        const instituteName = document.querySelector('.user-profile .info');
        if (instituteName) {
            instituteName.innerHTML = `
                <span class="name">Admin User</span>
                <span class="role">${config.instituteName}</span>
            `;
        }

        // Update Power BI embed URL
        const iframeElement = document.querySelector('.powerbi-wrapper');
        if (iframeElement && iframeElement.tagName === 'IFRAME') {
            iframeElement.src = config.powerbiConfig.embedUrl;
        }

        // Update KPI cards with institute-specific data
        updateKPICards(config.kpiData);

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }

    // Initialize UI event listeners
    initializeEventListeners();
});

function updateKPICards(data) {
    const cards = document.querySelectorAll('.kpi-card');

    if (cards[0]) {
        cards[0].querySelector('.value').textContent = data.totalStudents.toLocaleString();
    }
    if (cards[1]) {
        cards[1].querySelector('.value').textContent = data.avgFocusTime;
    }
    if (cards[2]) {
        cards[2].querySelector('.value').textContent = data.completionRate + '%';
    }
    if (cards[3]) {
        cards[3].querySelector('.value').textContent = data.atRisk;
    }
}

function initializeEventListeners() {
    const refreshBtn = document.querySelector('.btn-refresh');
    const exportBtn = document.querySelector('.btn-export');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            alert('Refreshing data... (Power BI will auto-refresh)');
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            alert('Export feature - Use Power BI export options in the report.');
        });
    }
}

// ==========================================
// UI Modal Functions (Data Architecture)
// ==========================================

function openModal() {
    const modal = document.getElementById('architecture-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('architecture-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

// Close modal when clicking outside the modal content
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('architecture-modal');
    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});

// ==========================================
// Logout Functionality
// ==========================================

async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/login';
        }
    }
}