import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Login from "./pages/auth/Login";
import { ModernLayout } from './components/layout/ModernLayout';
import Dashboard from './pages/admin/modern/Dashboard';
import UserManagement from './pages/admin/modern/UserManagement';
import StudentManagement from './pages/admin/modern/StudentManagement';
import LecturerManagement from './pages/admin/modern/LecturerManagement';
import ComingSoon from './pages/admin/modern/ComingSoon';

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
              <Route path="students" element={<StudentManagement />} />
              <Route path="lecturers" element={<LecturerManagement />} />
              <Route 
                path="courses" 
                element={
                  <ComingSoon 
                    title="Course Management"
                    description="Comprehensive course management system for creating, updating, and organizing academic courses."
                    features={[
                      "Create and manage courses",
                      "Set prerequisites and dependencies",
                      "Course catalog management",
                      "Credit hour tracking",
                      "Department-wise organization"
                    ]}
                    estimatedDate="Q2 2024"
                  />
                } 
              />
              <Route 
                path="batches" 
                element={
                  <ComingSoon 
                    title="Batch Management"
                    description="Manage student batches, semester progression, and course assignments."
                    features={[
                      "Create and manage student batches",
                      "Semester advancement tracking",
                      "Course assignment to batches",
                      "Batch performance analytics",
                      "Academic year management"
                    ]}
                    estimatedDate="Q2 2024"
                  />
                } 
              />
              <Route 
                path="enrollment" 
                element={
                  <ComingSoon 
                    title="Enrollment Management"
                    description="Handle student course enrollments and registration processes."
                    features={[
                      "Student course enrollment",
                      "Enrollment verification",
                      "Capacity management",
                      "Enrollment reports",
                      "Waitlist management"
                    ]}
                    estimatedDate="Q2 2024"
                  />
                } 
              />
              <Route 
                path="grades" 
                element={
                  <ComingSoon 
                    title="Grades & Assessment"
                    description="Comprehensive grading system for assignments, quizzes, and examinations."
                    features={[
                      "Grade type management",
                      "Assignment creation and grading",
                      "Gradebook management",
                      "Performance analytics",
                      "Grade distribution reports"
                    ]}
                    estimatedDate="Q2 2024"
                  />
                } 
              />
              <Route 
                path="announcements" 
                element={
                  <ComingSoon 
                    title="Announcements"
                    description="System-wide announcement and notification management."
                    features={[
                      "Create system announcements",
                      "Department-specific notifications",
                      "Targeted messaging",
                      "Read status tracking",
                      "Announcement scheduling"
                    ]}
                    estimatedDate="Q1 2024"
                  />
                } 
              />
              <Route 
                path="messages" 
                element={
                  <ComingSoon 
                    title="Messages & Support"
                    description="Communication platform and support ticket management system."
                    features={[
                      "Support ticket management",
                      "Real-time chat system",
                      "Message threading",
                      "Priority-based ticketing",
                      "Response tracking"
                    ]}
                    estimatedDate="Q2 2024"
                  />
                } 
              />
              <Route 
                path="evaluations" 
                element={
                  <ComingSoon 
                    title="Evaluation System"
                    description="Lecturer evaluation and feedback management system."
                    features={[
                      "Create evaluation sessions",
                      "Student feedback collection",
                      "Evaluation analytics",
                      "Performance reports",
                      "Anonymous feedback system"
                    ]}
                    estimatedDate="Q2 2024"
                  />
                } 
              />
              <Route 
                path="reports" 
                element={
                  <ComingSoon 
                    title="Reports & Analytics"
                    description="Comprehensive reporting and analytics dashboard."
                    features={[
                      "Academic performance reports",
                      "Enrollment analytics",
                      "Department statistics",
                      "Custom report generation",
                      "Data visualization"
                    ]}
                    estimatedDate="Q3 2024"
                  />
                } 
              />
              <Route 
                path="departments" 
                element={
                  <ComingSoon 
                    title="Department Management"
                    description="Manage academic departments and organizational structure."
                    features={[
                      "Department creation and management",
                      "Faculty assignment",
                      "Department analytics",
                      "Resource allocation",
                      "Cross-department coordination"
                    ]}
                    estimatedDate="Q2 2024"
                  />
                } 
              />
              <Route 
                path="settings" 
                element={
                  <ComingSoon 
                    title="System Settings"
                    description="Global system configuration and administrative settings."
                    features={[
                      "System configuration",
                      "User role management",
                      "Security settings",
                      "Integration management",
                      "Backup and maintenance"
                    ]}
                    estimatedDate="Q3 2024"
                  />
                } 
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;