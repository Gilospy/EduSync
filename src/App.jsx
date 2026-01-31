import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SyllabusPage } from './pages/SyllabusPage';
import { StudySprint } from './pages/StudySprint';
import { FacultyAlerts } from './pages/FacultyAlerts';
import { RetentionView } from './pages/RetentionView';
import { StudyCalendar } from './pages/StudyCalendar';

// Wrapper to handle role-based routing
const AppContent = () => {
    const { role } = useUser();

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={role === 'student' ? <StudentDashboard /> : <Navigate to="/admin" />} />
                    <Route path="/admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />

                    {/* Student Routes */}
                    <Route path="/syllabus" element={<SyllabusPage />} />
                    <Route path="/sprint" element={<StudySprint />} />
                    <Route path="/calendar" element={<StudyCalendar />} />

                    {/* Admin Routes */}
                    <Route path="/files" element={<FacultyAlerts />} />
                    <Route path="/retention" element={<RetentionView />} />

                    {/* Fallback routes for demo */}
                    <Route path="*" element={<Navigate to={role === 'student' ? "/" : "/admin"} />} />
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
