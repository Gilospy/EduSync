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
function loadPowerBIReport() {
    const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=50204a66-c6a3-425d-8043-00ca0f59bf3f&autoAuth=true&ctid=d1d8f653-6844-454b-a4fc-c52bc2c76e72';
    if (embedUrl && embedUrl.trim() !== '') {
        // Replace placeholder with iframe
        const container = document.querySelector('.powerbi-container');
        container.innerHTML = `<iframe title="Students" width="1840" height="800" src="${embedUrl}" frameborder="0" allowFullScreen="true"></iframe>`;
        console.log('PowerBI report loaded');
    }
}
