import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  CalendarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useEvaluationStore } from '../../../stores/evaluationStore';
import { useCourseStore } from '../../../stores/courseStore';
import { useAuth } from '../../../contexts/AuthContext';
import type { CreateEvaluationSessionRequest, EvaluationSession } from '../../../types/api';

const EvaluationManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    evaluationSessions,
    isLoading,
    error,
    fetchEvaluationSessions,
    createEvaluationSession,
    activateEvaluationSession,
    fetchDepartmentAnalytics,
    departmentAnalytics,
    clearError,
  } = useEvaluationStore();

  const { courseSessions, fetchCourseSessions } = useCourseStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState<CreateEvaluationSessionRequest>({
    courseSessionId: 0,
    startDate: '',
    endDate: '',
    departmentId: user?.departmentId || 1,
  });

  useEffect(() => {
    if (user?.departmentId) {
      fetchEvaluationSessions(user.departmentId);
      fetchCourseSessions(user.departmentId);
      fetchDepartmentAnalytics(user.departmentId);
    }
  }, [fetchEvaluationSessions, fetchCourseSessions, fetchDepartmentAnalytics, user]);

  const filteredSessions = evaluationSessions.filter(session => {
    const matchesSearch = session.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && session.isActive) ||
                         (selectedStatus === 'inactive' && !session.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createEvaluationSession(formData);
      setShowCreateForm(false);
      setFormData({
        courseSessionId: 0,
        startDate: '',
        endDate: '',
        departmentId: user?.departmentId || 1,
      });
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleActivateSession = async (sessionId: number) => {
    if (window.confirm('Are you sure you want to activate this evaluation session?')) {
      await activateEvaluationSession(sessionId);
    }
  };

  const handleViewSession = (session: EvaluationSession) => {
    navigate(`/admin/evaluations/${session.id}`);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setFormData({
      courseSessionId: 0,
      startDate: '',
      endDate: '',
      departmentId: user?.departmentId || 1,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'success' : 'warning';
  };

  if (isLoading && evaluationSessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Evaluation Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage lecturer evaluation sessions and view analytics
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Evaluation Session
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <p className="text-red-800">{error}</p>
            <Button variant="ghost" size="sm" onClick={clearError}>
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {evaluationSessions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {evaluationSessions.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <XCircleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Inactive Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {evaluationSessions.filter(s => !s.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <AcademicCapIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Evaluated Courses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {departmentAnalytics.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Evaluation Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="courseSessionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course Session
                </label>
                <select
                  id="courseSessionId"
                  required
                  value={formData.courseSessionId}
                  onChange={(e) => setFormData({ ...formData, courseSessionId: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value={0}>Select a course session</option>
                  {courseSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.course.code} - {session.course.name} (Year {session.year}, Semester {session.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Session'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search evaluation sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Evaluation Sessions ({filteredSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {session.courseCode} - {session.courseName}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(session.isActive)}>
                        {session.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mb-3">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{formatDate(session.startDate)} - {formatDate(session.endDate)}</span>
                      </div>
                      {session.submissionCount !== undefined && (
                        <div className="flex items-center">
                          <span>{session.submissionCount} submissions</span>
                        </div>
                      )}
                      {session.averageRating !== undefined && (
                        <div className="flex items-center">
                          <span>Avg: {session.averageRating.toFixed(1)}/5</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Course Session ID: {session.courseSessionId} • Department: {session.departmentId}
                      {session.activatedBy && (
                        <span> • Activated by: {session.activatedBy}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSession(session)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    
                    {!session.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActivateSession(session.id)}
                      >
                        <PlayIcon className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {session.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                      >
                        <PauseIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredSessions.length === 0 && (
              <div className="text-center py-8">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || selectedStatus !== 'all' 
                    ? 'No evaluation sessions match your filters' 
                    : 'No evaluation sessions found'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationManagement;