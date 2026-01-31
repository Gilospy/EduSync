// ==========================================
// Login Page Functionality
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    loadInstitutes();
});

async function loadInstitutes() {
    try {
        const response = await fetch('/api/institutes');
        const institutes = await response.json();

        const list = document.getElementById('institutes-list');
        list.innerHTML = '';

        institutes.forEach(institute => {
            const card = document.createElement('div');
            card.className = 'institute-card';
            card.innerHTML = `
                <i class="fa-solid fa-university"></i>
                <h3>${institute.name}</h3>
                <button class="btn-select" onclick="selectInstitute('${institute.id}', '${institute.name}')">
                    Select <i class="fa-solid fa-arrow-right"></i>
                </button>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading institutes:', error);
        document.getElementById('institutes-list').innerHTML = '<p class="error">Failed to load institutions</p>';
    }
}

function selectInstitute(instituteId, instituteName) {
    document.getElementById('selectedInstituteId').value = instituteId;
    document.getElementById('institutes-list').classList.add('hidden');
    
    const form = document.getElementById('login-form');
    form.classList.remove('hidden');
    
    // Show selected institute name
    const subtitle = document.querySelector('.subtitle');
    subtitle.textContent = `Logging in as ${instituteName}`;
}

function goBack() {
    document.getElementById('selectedInstituteId').value = '';
    document.getElementById('institutes-list').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
    document.querySelector('.subtitle').textContent = 'Select your institution to access your analytics';
}

async function login() {
    const instituteId = document.getElementById('selectedInstituteId').value;

    if (!instituteId) {
        alert('Please select an institution');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ instituteId })
        });

        const result = await response.json();

        if (result.success) {
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            alert('Login failed: ' + result.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}
