import { create } from 'zustand';
import { userApi, handleApiResponse, handleApiError } from '../services/api';
import type { 
  EvaluationSession,
  CreateEvaluationSessionRequest,
  EvaluationQuestion,
  EvaluationQuestionByCategory,
  EvaluationCategory,
  SubmitEvaluationRequest,
  EvaluationSubmissionResponse,
  EvaluationSessionStatusResponse,
  EvaluationAnalytics,
  EvaluationSubmission
} from '../types/api';

interface EvaluationState {
  // Session Management
  evaluationSessions: EvaluationSession[];
  currentSession: EvaluationSession | null;
  
  // Submissions
  sessionSubmissions: EvaluationSubmission[];
  
  // Questions and Categories
  questions: EvaluationQuestion[];
  categories: EvaluationCategory[];
  questionsByCategory: Record<number, EvaluationQuestionByCategory[]>;
  
  // Analytics
  courseAnalytics: EvaluationAnalytics | null;
  lecturerAnalytics: EvaluationAnalytics[];
  departmentAnalytics: EvaluationAnalytics[];
  
  // State
  isLoading: boolean;
  error: string | null;
  
  // Admin Methods - Session Management
  fetchEvaluationSessions: (departmentId: number) => Promise<void>;
  createEvaluationSession: (data: CreateEvaluationSessionRequest) => Promise<void>;
  activateEvaluationSession: (sessionId: number) => Promise<void>;
  getSessionStatus: (sessionId: number) => Promise<boolean>;
  
  // Submission Management
  fetchSessionSubmissions: (sessionId: number) => Promise<void>;
  
  // Student Methods - Evaluation Submission
  fetchEvaluationQuestions: () => Promise<void>;
  fetchEvaluationCategories: () => Promise<void>;
  fetchQuestionsByCategory: (categoryId: number) => Promise<void>;
  submitEvaluation: (data: SubmitEvaluationRequest) => Promise<void>;
  
  // Admin Methods - Analytics
  fetchCourseAnalytics: (courseSessionId: number, lecturerId: number) => Promise<void>;
  fetchLecturerAnalytics: (lecturerId: number) => Promise<void>;
  fetchDepartmentAnalytics: (departmentId: number) => Promise<void>;
  
  // Utility
  clearError: () => void;
  setCurrentSession: (session: EvaluationSession | null) => void;
}

export const useEvaluationStore = create<EvaluationState>((set, get) => ({
  // Initial State
  evaluationSessions: [],
  currentSession: null,
  sessionSubmissions: [],
  questions: [],
  categories: [],
  questionsByCategory: {},
  courseAnalytics: null,
  lecturerAnalytics: [],
  departmentAnalytics: [],
  isLoading: false,
  error: null,

  // Admin Methods - Session Management
  fetchEvaluationSessions: async (departmentId: number) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.get<EvaluationSession[]>(`/v1/evaluation/sessions/department/${departmentId}`);
      const evaluationSessions = handleApiResponse(response);
      
      set({ evaluationSessions, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch evaluation sessions' });
      handleApiError(error);
    }
  },

  createEvaluationSession: async (data: CreateEvaluationSessionRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.post<EvaluationSession>('/v1/evaluation/session', data);
      const newSession = handleApiResponse(response);
      
      set(state => ({
        evaluationSessions: [...state.evaluationSessions, newSession],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to create evaluation session' });
      handleApiError(error);
    }
  },

  activateEvaluationSession: async (sessionId: number) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.post<EvaluationSubmissionResponse>(`/v1/evaluation/session/${sessionId}/activate`);
      handleApiResponse(response);
      
      set(state => ({
        evaluationSessions: state.evaluationSessions.map(session =>
          session.id === sessionId ? { ...session, isActive: true } : session
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to activate evaluation session' });
      handleApiError(error);
    }
  },

  getSessionStatus: async (sessionId: number): Promise<boolean> => {
    try {
      const response = await userApi.get<EvaluationSessionStatusResponse>(`/v1/evaluation/session/${sessionId}/status`);
      const result = handleApiResponse(response);
      return result.success;
    } catch (error) {
      set({ error: 'Failed to get session status' });
      handleApiError(error);
      return false;
    }
  },

  // Submission Management
  fetchSessionSubmissions: async (sessionId: number) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock data for demonstration - replace with actual API call
      const mockSubmissions: EvaluationSubmission[] = [
        {
          id: 1,
          studentId: 101,
          studentName: 'John Doe',
          lecturerId: 1,
          lecturerName: 'Dr. Jane Smith',
          courseSessionId: sessionId,
          submittedAt: '2024-01-15T10:30:00Z',
          overallRating: 4.2,
          categoryRatings: {
            'Teaching Methodology': 4.5,
            'Course Content': 4.0,
            'Communication': 4.1
          },
          answers: [
            {
              questionId: 1,
              question: 'How would you rate the lecturer\'s teaching methodology?',
              category: 'Teaching Methodology',
              rating: 5
            },
            {
              questionId: 2,
              question: 'How clear were the course objectives?',
              category: 'Course Content',
              rating: 4
            }
          ]
        },
        {
          id: 2,
          studentId: 102,
          studentName: 'Jane Smith',
          lecturerId: 1,
          lecturerName: 'Dr. Jane Smith',
          courseSessionId: sessionId,
          submittedAt: '2024-01-16T14:20:00Z',
          overallRating: 4.8,
          categoryRatings: {
            'Teaching Methodology': 5.0,
            'Course Content': 4.5,
            'Communication': 4.9
          },
          answers: [
            {
              questionId: 1,
              question: 'How would you rate the lecturer\'s teaching methodology?',
              category: 'Teaching Methodology',
              rating: 5
            },
            {
              questionId: 2,
              question: 'How clear were the course objectives?',
              category: 'Course Content',
              rating: 4
            }
          ]
        }
      ];
      
      set({ sessionSubmissions: mockSubmissions, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch session submissions' });
      handleApiError(error);
    }
  },

  // Student Methods - Evaluation Submission
  fetchEvaluationQuestions: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.get<EvaluationQuestion[]>('/v1/evaluation/questions');
      const questions = handleApiResponse(response);
      
      set({ questions, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch evaluation questions' });
      handleApiError(error);
    }
  },

  fetchEvaluationCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.get<EvaluationCategory[]>('/v1/evaluation/categories');
      const categories = handleApiResponse(response);
      
      set({ categories, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch evaluation categories' });
      handleApiError(error);
    }
  },

  fetchQuestionsByCategory: async (categoryId: number) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.get<EvaluationQuestionByCategory[]>(`/v1/evaluation/questions/category/${categoryId}`);
      const questions = handleApiResponse(response);
      
      set(state => ({
        questionsByCategory: {
          ...state.questionsByCategory,
          [categoryId]: questions
        },
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch questions by category' });
      handleApiError(error);
    }
  },

  submitEvaluation: async (data: SubmitEvaluationRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.post<EvaluationSubmissionResponse>('/v1/evaluation/submit', data);
      handleApiResponse(response);
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to submit evaluation' });
      handleApiError(error);
    }
  },

  // Admin Methods - Analytics
  fetchCourseAnalytics: async (courseSessionId: number, lecturerId: number) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock analytics data for demonstration
      const mockAnalytics: EvaluationAnalytics = {
        lecturerId,
        lecturerName: 'Dr. Jane Smith',
        courseSessionId,
        courseCode: 'CS101',
        courseName: 'Programming Fundamentals',
        totalSubmissions: 25,
        overallRating: 4.2,
        categoryRatings: {
          'Teaching Methodology': 4.5,
          'Course Content': 4.0,
          'Communication': 4.1
        },
        questionAnalytics: [
          {
            questionId: 1,
            question: 'How would you rate the lecturer\'s teaching methodology?',
            category: 'Teaching Methodology',
            averageRating: 4.5,
            ratingDistribution: {
              '1': 0,
              '2': 1,
              '3': 2,
              '4': 8,
              '5': 14
            }
          }
        ],
        ratingDistribution: {
          '1': 0,
          '2': 2,
          '3': 5,
          '4': 10,
          '5': 8
        },
        submissionTrend: [
          { date: '2024-01-15', count: 5 },
          { date: '2024-01-16', count: 8 },
          { date: '2024-01-17', count: 12 }
        ]
      };
      
      set({ courseAnalytics: mockAnalytics, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch course analytics' });
      handleApiError(error);
    }
  },

  fetchLecturerAnalytics: async (lecturerId: number) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.get<EvaluationAnalytics[]>(`/v1/evaluation/analytics/lecturer/${lecturerId}`);
      const lecturerAnalytics = handleApiResponse(response);
      
      set({ lecturerAnalytics, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch lecturer analytics' });
      handleApiError(error);
    }
  },

  fetchDepartmentAnalytics: async (departmentId: number) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.get<EvaluationAnalytics[]>(`/v1/evaluation/analytics/department/${departmentId}`);
      const departmentAnalytics = handleApiResponse(response);
      
      set({ departmentAnalytics, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch department analytics' });
      handleApiError(error);
    }
  },

  // Utility Methods
  clearError: () => {
    set({ error: null });
  },

  setCurrentSession: (session: EvaluationSession | null) => {
    set({ currentSession: session });
  },
}));