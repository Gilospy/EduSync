import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { ThemeToggle } from './ThemeToggle';
import { LayoutDashboard, BookOpen, Calendar, Clock, BarChart2, ShieldAlert, LogOut, GraduationCap, School, Menu, X, Award } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

export const Layout = ({ children }) => {
  const { role, setRole } = useUser();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleRoleSwitch = () => {
    // Clear auth state
    localStorage.removeItem('userRole');
    // Redirect to the Login Page (Hub)
    window.location.href = '/login';
  };

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/calendar", icon: Calendar, label: "Calendar" },
    { to: "/grades", icon: Award, label: "Grades" },
    { to: "/syllabus", icon: BookOpen, label: "Syllabus" },
    { to: "/sprint", icon: Clock, label: "Sprint" },
  ];

  return (
    <div className="layout-top-nav">
      {/* Top Navigation Bar */}
      <header className="top-navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="logo-box">
              <GraduationCap size={20} />
            </div>
            <div className="brand-text">
              <h2>EduSync AI</h2>
              <span className="role-chip">Student Portal</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="nav-actions desktop-only">
            <ThemeToggle />
            <div className="user-profile">
              <div className="avatar">
                {role === 'student' ? 'AC' : 'DA'}
              </div>
            </div>
            <button className="btn-icon-ghost" onClick={handleRoleSwitch} title="Switch Role">
              <LogOut size={18} />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="mobile-toggle" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
            {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileNavOpen && (
          <div className="mobile-menu">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <link.icon size={20} />
                {link.label}
              </NavLink>
            ))}
            <div className="mobile-actions">
              <ThemeToggle />
              <button onClick={handleRoleSwitch} className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--status-warning)', textDecoration: 'none' }}>
                Log Out / Switch Profile
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="main-content-top-nav">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};
