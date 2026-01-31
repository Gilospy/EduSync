// ==========================================
// Login Page Functionality - Role Selection
// ==========================================

function selectRole(role) {
    // Store the selected role in localStorage
    localStorage.setItem('userRole', role);
    
    if (role === 'student') {
        // Redirect to student dashboard
        window.location.href = '/';
    } else if (role === 'teacher') {
        // Redirect to admin dashboard
        window.location.href = '/admin/admin.html';
    }
}
