// ==========================================
// Students Page - PowerBI Integration
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Students page loaded - PowerBI integration ready');
    setupUI();
    loadPowerBIReport();
});

function setupUI() {
    // Setup UI interactions
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            console.log('Search:', this.value);
            // Add search functionality when PowerBI is integrated
        });
    }

    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('Refresh clicked');
            // Add refresh functionality when PowerBI is integrated
        });
    }
}

// ==========================================
// PowerBI Integration
// ==========================================
