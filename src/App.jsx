import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { StudentDashboard } from './pages/StudentDashboard';
import { SyllabusPage } from './pages/SyllabusPage';
import { StudySprint } from './pages/StudySprint';
import { StudyCalendar } from './pages/StudyCalendar';

// Wrapper to handle role-based routing
const AppContent = () => {
    const { role } = useUser();

    // Force redirect to Login if no role passed from Login Hub
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
        window.location.href = '/login';
        return null; // Don't render anything while redirecting
    }

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<StudentDashboard />} />

                    {/* Student Routes */}
                    <Route path="/syllabus" element={<SyllabusPage />} />
                    <Route path="/sprint" element={<StudySprint />} />
                    <Route path="/calendar" element={<StudyCalendar />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Layout>
        </Router>
    );
};

function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;
