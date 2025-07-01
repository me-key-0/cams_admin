import React, { useEffect } from 'react';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { BarChart } from '../../../components/charts/BarChart';
import { LineChart } from '../../../components/charts/LineChart';
import { PieChart } from '../../../components/charts/PieChart';
import { useAuth } from '../../../contexts/AuthContext';
import { useDashboardStore } from '../../../stores/dashboardStore';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, isLoading, error, fetchDashboardStats } = useDashboardStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading dashboard: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: UserGroupIcon,
    },
    {
      name: 'Active Lecturers',
      value: stats.totalLecturers.toLocaleString(),
      change: '+3.2%',
      changeType: 'increase' as const,
      icon: AcademicCapIcon,
    },
    {
      name: 'Active Courses',
      value: stats.activeCourses.toLocaleString(),
      change: '+8.1%',
      changeType: 'increase' as const,
      icon: BookOpenIcon,
    },
    {
      name: 'Completion Rate',
      value: `${stats.completionRate}%`,
      change: '-2.1%',
      changeType: 'decrease' as const,
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'} Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {user?.firstname} {user?.lastname}. Here's what's happening in your {user?.role === 'SUPER_ADMIN' ? 'institution' : 'department'}.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'increase' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`ml-1 text-sm font-medium ${
                    stat.changeType === 'increase'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={stats.enrollmentTrends} height={200} />
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={stats.departmentDistribution} size={200} />
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={stats.coursePerformance} height={250} />
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: 'New student enrolled',
                details: 'John Doe enrolled in Computer Science',
                time: '2 hours ago',
                type: 'success',
              },
              {
                action: 'Course updated',
                details: 'Advanced Programming course content updated',
                time: '4 hours ago',
                type: 'info',
              },
              {
                action: 'Lecturer assigned',
                details: 'Dr. Smith assigned to Database Systems',
                time: '6 hours ago',
                type: 'success',
              },
              {
                action: 'System maintenance',
                details: 'Scheduled maintenance completed',
                time: '1 day ago',
                type: 'warning',
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.details}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={activity.type as any}>{activity.type}</Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;