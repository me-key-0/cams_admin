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
  EvaluationAnalytics
} from '../types/api';

interface EvaluationState {
  // Session Management
  evaluationSessions: EvaluationSession[];
  currentSession: EvaluationSession | null;
  
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
      
      const response = await userApi.get<EvaluationAnalytics>(`/v1/evaluation/analytics/course/${courseSessionId}/lecturer/${lecturerId}`);
      const courseAnalytics = handleApiResponse(response);
      
      set({ courseAnalytics, isLoading: false });
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