import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  UserIcon,
  StarIcon,
  ChartBarIcon,
  CalendarIcon,
  EyeIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { BarChart } from '../../../components/charts/BarChart';
import { LineChart } from '../../../components/charts/LineChart';
import { PieChart } from '../../../components/charts/PieChart';
import { useEvaluationStore } from '../../../stores/evaluationStore';

interface StarDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

const StarDisplay: React.FC<StarDisplayProps> = ({ rating, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star}>
          {star <= Math.floor(rating) ? (
            <StarIconSolid className={`${sizeClasses[size]} text-yellow-400`} />
          ) : star === Math.ceil(rating) && rating % 1 !== 0 ? (
            <div className="relative">
              <StarIcon className={`${sizeClasses[size]} text-gray-300`} />
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(rating % 1) * 100}%` }}
              >
                <StarIconSolid className={`${sizeClasses[size]} text-yellow-400`} />
              </div>
            </div>
          ) : (
            <StarIcon className={`${sizeClasses[size]} text-gray-300`} />
          )}
        </div>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const EvaluationSessionDetail: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const {
    evaluationSessions,
    sessionSubmissions,
    courseAnalytics,
    isLoading,
    error,
    fetchSessionSubmissions,
    fetchCourseAnalytics,
    clearError,
  } = useEvaluationStore();

  const [activeTab, setActiveTab] = useState<'submissions' | 'analytics'>('submissions');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const session = evaluationSessions.find(s => s.id === parseInt(sessionId || '0'));

  useEffect(() => {
    if (sessionId) {
      const id = parseInt(sessionId);
      fetchSessionSubmissions(id);
      
      // Fetch analytics if we have lecturer info
      if (session) {
        fetchCourseAnalytics(session.courseSessionId, 1); // Mock lecturer ID
      }
    }
  }, [sessionId, fetchSessionSubmissions, fetchCourseAnalytics, session]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
    if (rating >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Session not found</p>
        <Button onClick={() => navigate('/admin/evaluations')} className="mt-4">
          Back to Evaluations
        </Button>
      </div>
    );
  }

  if (isLoading && sessionSubmissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/evaluations')}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {session.courseCode} - {session.courseName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Evaluation Session Details
            </p>
          </div>
        </div>
        <Badge variant={session.isActive ? 'success' : 'warning'}>
          {session.isActive ? 'Active' : 'Inactive'}
        </Badge>
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

      {/* Session Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDate(session.startDate)} - {formatDate(session.endDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Submissions</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {sessionSubmissions.length} responses
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <StarIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {sessionSubmissions.length > 0 
                    ? (sessionSubmissions.reduce((sum, sub) => sum + sub.overallRating, 0) / sessionSubmissions.length).toFixed(1)
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'submissions'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <UserIcon className="h-4 w-4 inline mr-2" />
          Submissions ({sessionSubmissions.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <ChartBarIcon className="h-4 w-4 inline mr-2" />
          Analytics
        </button>
      </div>

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* Submissions Overview */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Submissions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {sessionSubmissions.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Average Rating
                  </p>
                  <p className={`text-2xl font-bold ${getRatingColor(
                    sessionSubmissions.length > 0 
                      ? sessionSubmissions.reduce((sum, sub) => sum + sub.overallRating, 0) / sessionSubmissions.length
                      : 0
                  )}`}>
                    {sessionSubmissions.length > 0 
                      ? (sessionSubmissions.reduce((sum, sub) => sum + sub.overallRating, 0) / sessionSubmissions.length).toFixed(1)
                      : 'N/A'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Highest Rating
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {sessionSubmissions.length > 0 
                      ? Math.max(...sessionSubmissions.map(sub => sub.overallRating)).toFixed(1)
                      : 'N/A'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Lowest Rating
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {sessionSubmissions.length > 0 
                      ? Math.min(...sessionSubmissions.map(sub => sub.overallRating)).toFixed(1)
                      : 'N/A'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessionSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {submission.studentName.split(' ').map(n => n.charAt(0)).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {submission.studentName}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Student ID: {submission.studentId}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <StarDisplay rating={submission.overallRating} size="md" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Submitted: {formatDate(submission.submittedAt)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(submission.categoryRatings).map(([category, rating]) => (
                            <div key={category} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {category}:
                              </span>
                              <span className={`text-xs font-bold ${getRatingColor(rating)}`}>
                                {rating.toFixed(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {sessionSubmissions.length === 0 && (
                  <div className="text-center py-8">
                    <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No submissions yet
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && courseAnalytics && (
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Response Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courseAnalytics.totalSubmissions > 0 ? '85%' : '0%'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Overall Rating
                  </p>
                  <p className={`text-2xl font-bold ${getRatingColor(courseAnalytics.overallRating)}`}>
                    {courseAnalytics.overallRating.toFixed(1)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Responses
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courseAnalytics.totalSubmissions}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Category Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={Object.entries(courseAnalytics.categoryRatings).map(([category, rating]) => ({
                  label: category,
                  value: rating,
                  color: rating >= 4.5 ? 'bg-green-500' : rating >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                }))}
                height={250}
              />
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart 
                  data={Object.entries(courseAnalytics.ratingDistribution).map(([rating, count]) => ({
                    label: `${rating} Star${rating !== '1' ? 's' : ''}`,
                    value: count,
                    color: rating === '5' ? '#10B981' : rating === '4' ? '#3B82F6' : rating === '3' ? '#F59E0B' : rating === '2' ? '#EF4444' : '#6B7280'
                  }))}
                  size={200}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={courseAnalytics.submissionTrend.map(item => ({
                    label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    value: item.count
                  }))}
                  height={200}
                />
              </CardContent>
            </Card>
          </div>

          {/* Question Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Question-wise Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courseAnalytics.questionAnalytics.map((question) => (
                  <div key={question.questionId} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {question.question}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Category: {question.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getRatingColor(question.averageRating)}`}>
                          {question.averageRating.toFixed(1)}
                        </p>
                        <StarDisplay rating={question.averageRating} size="sm" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(question.ratingDistribution).map(([rating, count]) => (
                        <div key={rating} className="text-center">
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {rating}★
                          </div>
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${courseAnalytics.totalSubmissions > 0 ? (count / courseAnalytics.totalSubmissions) * 100 : 0}%` 
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Evaluation Details
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedSubmission.studentName} • {formatDate(selectedSubmission.submittedAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Overall Rating
                  </p>
                  <StarDisplay rating={selectedSubmission.overallRating} size="lg" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Category Ratings
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(selectedSubmission.categoryRatings).map(([category, rating]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {category}
                        </span>
                        <StarDisplay rating={rating} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Individual Responses
                  </h3>
                  <div className="space-y-4">
                    {selectedSubmission.answers.map((answer: any) => (
                      <div key={answer.questionId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              {answer.question}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {answer.category}
                            </p>
                          </div>
                          <StarDisplay rating={answer.rating} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationSessionDetail;