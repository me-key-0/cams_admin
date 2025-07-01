import { create } from 'zustand';
import { userApi, handleApiResponse, handleApiError } from '../services/api';
import type { User } from '../types/api';


interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.get<User[]>('/');
      const users = handleApiResponse(response);
      
      set({ users, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch users' });
      handleApiError(error);
    }
  },

  createUser: async (userData: Partial<User>) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await userApi.post<User>('/', userData);
      const newUser = handleApiResponse(response);
      
      set(state => ({
        users: [...state.users, newUser],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to create user' });
      handleApiError(error);
    }
  },

  deleteUser: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      
      await userApi.delete(`/${id}`);
      
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to delete user' });
      handleApiError(error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));