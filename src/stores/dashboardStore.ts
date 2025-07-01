import { create } from 'zustand';
import { userApi, courseApi, handleApiResponse, handleApiError } from '../services/api';
import type { DashboardStats } from '../types/api';


interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardStats: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Fetch data from multiple endpoints
      const [usersResponse, coursesResponse, batchesResponse] = await Promise.all([
        userApi.get('/'),
        courseApi.get('/v1/courses'),
        courseApi.get('/batches'),
      ]);

      const users = handleApiResponse(usersResponse);
      const courses = handleApiResponse(coursesResponse);
      const batches = handleApiResponse(batchesResponse);

      // Calculate stats
      const totalStudents = users.filter(user => user.role === 'STUDENT').length;
      const totalLecturers = users.filter(user => user.role === 'LECTURER').length;
      const activeCourses = courses.length;
      const completionRate = 94.2; // This would come from a specific analytics endpoint

      // Mock enrollment trends data (replace with actual API call)
      const enrollmentTrends = [
        { label: 'Jan', value: 120 },
        { label: 'Feb', value: 150 },
        { label: 'Mar', value: 180 },
        { label: 'Apr', value: 160 },
        { label: 'May', value: 200 },
        { label: 'Jun', value: 220 },
      ];

      // Mock department distribution (replace with actual API call)
      const departmentDistribution = [
        { label: 'Computer Science', value: 45, color: '#3B82F6' },
        { label: 'Engineering', value: 35, color: '#10B981' },
        { label: 'Business', value: 25, color: '#F59E0B' },
        { label: 'Arts', value: 15, color: '#EF4444' },
      ];

      // Mock course performance (replace with actual API call)
      const coursePerformance = courses.slice(0, 5).map((course, index) => ({
        label: course.code,
        value: 85 + Math.random() * 10, // Mock performance score
      }));

      const stats: DashboardStats = {
        totalStudents,
        totalLecturers,
        activeCourses,
        completionRate,
        enrollmentTrends,
        departmentDistribution,
        coursePerformance,
      };
      
      set({ stats, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch dashboard statistics' });
      handleApiError(error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));