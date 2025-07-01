import React, { useState, useEffect } from 'react';
import { 
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useEvaluationStore } from '../../../stores/evaluationStore';
import { useAuth } from '../../../contexts/AuthContext';
import type { SubmitEvaluationRequest, EvaluationAnswer } from '../../../types/api';

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
  questionId: number;
}

const StarRating: React.FC<RatingProps> = ({ value, onChange, questionId }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          {star <= (hoverValue || value) ? (
            <StarIconSolid className="h-6 w-6 text-yellow-400" />
          ) : (
            <StarIcon className="h-6 w-6 text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
};

const EvaluationSubmission: React.FC = () => {
  const { user } = useAuth();
  const {
    questions,
    categories,
    isLoading,
    error,
    fetchEvaluationQuestions,
    fetchEvaluationCategories,
    submitEvaluation,
    clearError,
  } = useEvaluationStore();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock data for demonstration - replace with actual course session data
  const [selectedCourse] = useState({
    courseSessionId: 1,
    courseCode: 'CS101',
    courseName: 'Programming Fundamentals',
    lecturerId: 1,
    lecturerName: 'Dr. Jane Smith'
  });

  useEffect(() => {
    fetchEvaluationQuestions();
    fetchEvaluationCategories();
  }, [fetchEvaluationQuestions, fetchEvaluationCategories]);

  const handleAnswerChange = (questionId: number, rating: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: rating
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !user) return;

    const evaluationAnswers: EvaluationAnswer[] = Object.entries(answers).map(([questionId, rating]) => ({
      questionId: parseInt(questionId),
      answerId: rating // Using rating as answerId for simplicity
    }));

    const submissionData: SubmitEvaluationRequest = {
      lecturerId: selectedCourse.lecturerId,
      courseSessionId: selectedCourse.courseSessionId,
      answers: evaluationAnswers
    };

    try {
      setIsSubmitting(true);
      await submitEvaluation(submissionData);
      setIsSubmitted(true);
    } catch (error) {
      // Error handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategory = categories[currentCategoryIndex];
  const currentQuestions = questions.filter(q => q.category.id === currentCategory?.id);
  const answeredQuestions = currentQuestions.filter(q => answers[q.id]);
  const isCurrentCategoryComplete = answeredQuestions.length === currentQuestions.length;
  const totalQuestions = questions.length;
  const totalAnswered = Object.keys(answers).length;
  const isAllComplete = totalAnswered === totalQuestions;

  const canProceed = currentCategoryIndex < categories.length - 1 && isCurrentCategoryComplete;
  const canGoBack = currentCategoryIndex > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Evaluation Submitted!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your feedback on {selectedCourse.courseCode} - {selectedCourse.courseName}.
              Your evaluation has been submitted successfully.
            </p>

            <Button onClick={() => window.location.reload()}>
              Submit Another Evaluation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-red-800">{error}</p>
          <Button variant="ghost" size="sm" onClick={clearError}>
            ×
          </Button>
        </div>
      </div>
    );
  }

  if (categories.length === 0 || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          No evaluation questions available at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Course Evaluation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please rate your experience with this course and lecturer
        </p>
      </div>

      {/* Course Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <AcademicCapIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedCourse.courseCode} - {selectedCourse.courseName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Lecturer: {selectedCourse.lecturerName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Progress
            </h3>
            <Badge variant="info">
              {totalAnswered} / {totalQuestions} questions answered
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`text-xs ${
                  index === currentCategoryIndex 
                    ? 'text-blue-600 font-medium' 
                    : index < currentCategoryIndex 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                }`}
              >
                {category.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Category Questions */}
      {currentCategory && (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentCategory.name}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              {currentCategory.description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentQuestions.map((question) => (
                <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                        {question.question}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Rate from 1 (Poor) to 5 (Excellent)
                      </p>
                    </div>
                    {answers[question.id] && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 ml-4" />
                    )}
                  </div>
                  
                  <StarRating
                    value={answers[question.id] || 0}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                    questionId={question.id}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentCategoryIndex(prev => prev - 1)}
              disabled={!canGoBack}
            >
              Previous Category
            </Button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Category {currentCategoryIndex + 1} of {categories.length}
            </div>
            
            {canProceed ? (
              <Button
                onClick={() => setCurrentCategoryIndex(prev => prev + 1)}
                disabled={!isCurrentCategoryComplete}
              >
                Next Category
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isAllComplete || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
              </Button>
            )}
          </div>
          
          {!isCurrentCategoryComplete && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please answer all questions in this category before proceeding.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationSubmission;