import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Login from "./pages/auth/Login";
import { ModernLayout } from './components/layout/ModernLayout';
import Dashboard from './pages/admin/modern/Dashboard';
import UserManagement from './pages/admin/modern/UserManagement';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin" element={<ModernLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="students" element={<div>Students Management - Coming Soon</div>} />
              <Route path="lecturers" element={<div>Lecturers Management - Coming Soon</div>} />
              <Route path="courses" element={<div>Course Management - Coming Soon</div>} />
              <Route path="batches" element={<div>Batch Management - Coming Soon</div>} />
              <Route path="enrollment" element={<div>Enrollment Management - Coming Soon</div>} />
              <Route path="grades" element={<div>Grades & Assessment - Coming Soon</div>} />
              <Route path="announcements" element={<div>Announcements - Coming Soon</div>} />
              <Route path="messages" element={<div>Messages & Support - Coming Soon</div>} />
              <Route path="evaluations" element={<div>Evaluation System - Coming Soon</div>} />
              <Route path="reports" element={<div>Reports & Analytics - Coming Soon</div>} />
              <Route path="departments" element={<div>Department Management - Coming Soon</div>} />
              <Route path="settings" element={<div>System Settings - Coming Soon</div>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;