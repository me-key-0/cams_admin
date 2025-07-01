import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CogIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Student Management', href: '/admin/students', icon: UserGroupIcon },
  { name: 'Lecturer Management', href: '/admin/lecturers', icon: AcademicCapIcon },
  { name: 'Course Management', href: '/admin/courses', icon: BookOpenIcon },
  { name: 'Batch Management', href: '/admin/batches', icon: CalendarIcon },
  { name: 'Enrollment', href: '/admin/enrollment', icon: ClipboardDocumentListIcon },
  { name: 'Grades & Assessment', href: '/admin/grades', icon: ChartBarIcon },
  { name: 'Announcements', href: '/admin/announcements', icon: BellIcon },
  { name: 'Messages & Support', href: '/admin/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Evaluation System', href: '/admin/evaluations', icon: ChartBarIcon },
  { name: 'Reports & Analytics', href: '/admin/reports', icon: ChartBarIcon },
  { name: 'Department Management', href: '/admin/departments', icon: BuildingOfficeIcon, superAdminOnly: true },
  { name: 'System Settings', href: '/admin/settings', icon: CogIcon },
];

interface ModernSidebarProps {
  isCollapsed: boolean;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => {
    if (item.superAdminOnly && user?.role !== 'SUPER_ADMIN') return false;
    if (item.adminOnly && user?.role === 'SUPER_ADMIN') return false;
    return true;
  });

  return (
    <div className={cn(
      'flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800">
        {isCollapsed ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            C
          </div>
        ) : (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            CAMS {user?.role === 'SUPER_ADMIN' ? 'Super' : ''} Admin
          </h1>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300',
                  isCollapsed ? '' : 'mr-3'
                )}
              />
              {!isCollapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};