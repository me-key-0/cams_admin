import { create } from 'zustand';
import { courseApi, handleApiResponse, handleApiError } from '../services/api';
import type { Batch, Course, CourseSession } from '../types/api';


interface CourseState {
  courses: Course[];
  batches: Batch[];
  courseSessions: CourseSession[];
  isLoading: boolean;
  error: string | null;
  
  // Course methods
  fetchCourses: () => Promise<void>;
  createCourse: (courseData: Partial<Course>) => Promise<void>;
  
  // Batch methods
  fetchBatches: (departmentId?: number) => Promise<void>;
  createBatch: (batchData: Partial<Batch>) => Promise<void>;
  updateBatch: (id: number, batchData: Partial<Batch>) => Promise<void>;
  deleteBatch: (id: number) => Promise<void>;
  
  // Course Session methods
  fetchCourseSessions: (departmentId?: number) => Promise<void>;
  createCourseSession: (sessionData: Partial<CourseSession>) => Promise<void>;
  activateCourseSession: (id: number) => Promise<void>;
  deactivateCourseSession: (id: number) => Promise<void>;
  
  clearError: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  batches: [],
  courseSessions: [],
  isLoading: false,
  error: null,

  // Course methods
  fetchCourses: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await courseApi.get<Course[]>('/v1/courses');
      const courses = handleApiResponse(response);
      
      set({ courses, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch courses' });
      handleApiError(error);
    }
  },

  createCourse: async (courseData: Partial<Course>) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await courseApi.post<Course>('/v1/courses', courseData);
      const newCourse = handleApiResponse(response);
      
      set(state => ({
        courses: [...state.courses, newCourse],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to create course' });
      handleApiError(error);
    }
  },

  // Batch methods
  fetchBatches: async (departmentId?: number) => {
    try {
      set({ isLoading: true, error: null });
      
      const url = departmentId ? `/batches/department/${departmentId}` : '/batches';
      const response = await courseApi.get<Batch[]>(url);
      const batches = handleApiResponse(response);
      
      set({ batches, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch batches' });
      handleApiError(error);
    }
  },

  createBatch: async (batchData: Partial<Batch>) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await courseApi.post<Batch>('/batches', batchData);
      const newBatch = handleApiResponse(response);
      
      set(state => ({
        batches: [...state.batches, newBatch],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to create batch' });
      handleApiError(error);
    }
  },

  updateBatch: async (id: number, batchData: Partial<Batch>) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await courseApi.put<Batch>(`/batches/${id}`, batchData);
      const updatedBatch = handleApiResponse(response);
      
      set(state => ({
        batches: state.batches.map(batch => 
          batch.id === id ? updatedBatch : batch
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to update batch' });
      handleApiError(error);
    }
  },

  deleteBatch: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      
      await courseApi.delete(`/batches/${id}`);
      
      set(state => ({
        batches: state.batches.filter(batch => batch.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to delete batch' });
      handleApiError(error);
    }
  },

  // Course Session methods
  fetchCourseSessions: async (departmentId?: number) => {
    try {
      set({ isLoading: true, error: null });
      
      const url = departmentId 
        ? `/course-sessions/department/${departmentId}` 
        : '/course-sessions';
      const response = await courseApi.get<CourseSession[]>(url);
      const courseSessions = handleApiResponse(response);
      
      set({ courseSessions, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch course sessions' });
      handleApiError(error);
    }
  },

  createCourseSession: async (sessionData: Partial<CourseSession>) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await courseApi.post<CourseSession>('/course-sessions', sessionData);
      const newSession = handleApiResponse(response);
      
      set(state => ({
        courseSessions: [...state.courseSessions, newSession],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to create course session' });
      handleApiError(error);
    }
  },

  activateCourseSession: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      
      await courseApi.post(`/course-sessions/${id}/activate`);
      
      set(state => ({
        courseSessions: state.courseSessions.map(session =>
          session.id === id ? { ...session, isActive: true } : session
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to activate course session' });
      handleApiError(error);
    }
  },

  deactivateCourseSession: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      
      await courseApi.post(`/course-sessions/${id}/deactivate`);
      
      set(state => ({
        courseSessions: state.courseSessions.map(session =>
          session.id === id ? { ...session, isActive: false } : session
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to deactivate course session' });
      handleApiError(error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));