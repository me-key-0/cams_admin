import { create } from 'zustand';
import { communicationApi, handleApiResponse, handleApiError } from '../services/api';
import type { 
  Announcement, 
  AnnouncementResponse, 
  CreateAnnouncementRequest, 
  UpdateAnnouncementRequest 
} from '../types/api';

interface AnnouncementState {
  announcements: Announcement[];
  myAnnouncements: Announcement[];
  totalAnnouncements: number;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Admin methods
  fetchAllAnnouncements: () => Promise<void>;
  fetchMyAnnouncements: () => Promise<void>;
  createAnnouncement: (data: CreateAnnouncementRequest) => Promise<void>;
  updateAnnouncement: (id: number, data: UpdateAnnouncementRequest) => Promise<void>;
  deleteAnnouncement: (id: number) => Promise<void>;
  
  // User methods
  fetchUserAnnouncements: () => Promise<void>;
  fetchAnnouncementsByCategory: (category: 'ACADEMIC' | 'ADMINISTRATIVE') => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  
  clearError: () => void;
}

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
  announcements: [],
  myAnnouncements: [],
  totalAnnouncements: 0,
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Admin methods
  fetchAllAnnouncements: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await communicationApi.get<Announcement[]>('/announcements/admin');
      const announcements = handleApiResponse(response);
      
      set({ 
        announcements, 
        totalAnnouncements: announcements.length,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch announcements' });
      handleApiError(error);
    }
  },

  fetchMyAnnouncements: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await communicationApi.get<Announcement[]>('/announcements/my-announcements');
      const myAnnouncements = handleApiResponse(response);
      
      set({ myAnnouncements, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch my announcements' });
      handleApiError(error);
    }
  },

  createAnnouncement: async (data: CreateAnnouncementRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await communicationApi.post<Announcement>('/announcements', data);
      const newAnnouncement = handleApiResponse(response);
      
      set(state => ({
        announcements: [newAnnouncement, ...state.announcements],
        myAnnouncements: [newAnnouncement, ...state.myAnnouncements],
        totalAnnouncements: state.totalAnnouncements + 1,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to create announcement' });
      handleApiError(error);
    }
  },

  updateAnnouncement: async (id: number, data: UpdateAnnouncementRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await communicationApi.put<Announcement>(`/announcements/${id}`, data);
      const updatedAnnouncement = handleApiResponse(response);
      
      set(state => ({
        announcements: state.announcements.map(announcement =>
          announcement.id === id ? updatedAnnouncement : announcement
        ),
        myAnnouncements: state.myAnnouncements.map(announcement =>
          announcement.id === id ? updatedAnnouncement : announcement
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to update announcement' });
      handleApiError(error);
    }
  },

  deleteAnnouncement: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      
      await communicationApi.delete(`/announcements/${id}`);
      
      set(state => ({
        announcements: state.announcements.filter(announcement => announcement.id !== id),
        myAnnouncements: state.myAnnouncements.filter(announcement => announcement.id !== id),
        totalAnnouncements: state.totalAnnouncements - 1,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to delete announcement' });
      handleApiError(error);
    }
  },

  // User methods
  fetchUserAnnouncements: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await communicationApi.get<AnnouncementResponse>('/announcements');
      const data = handleApiResponse(response);
      
      set({ 
        announcements: data.announcements,
        totalAnnouncements: data.totalAnnouncements,
        unreadCount: data.unreadCount,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch announcements' });
      handleApiError(error);
    }
  },

  fetchAnnouncementsByCategory: async (category: 'ACADEMIC' | 'ADMINISTRATIVE') => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await communicationApi.get<AnnouncementResponse>(`/announcements/category/${category}`);
      const data = handleApiResponse(response);
      
      set({ 
        announcements: data.announcements,
        totalAnnouncements: data.totalAnnouncements,
        unreadCount: data.unreadCount,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch announcements by category' });
      handleApiError(error);
    }
  },

  markAsRead: async (id: number) => {
    try {
      await communicationApi.post(`/announcements/${id}/mark-read`);
      
      set(state => ({
        announcements: state.announcements.map(announcement =>
          announcement.id === id ? { ...announcement, isRead: true } : announcement
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      set({ error: 'Failed to mark announcement as read' });
      handleApiError(error);
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await communicationApi.get<number>('/announcements/unread-count');
      const unreadCount = handleApiResponse(response);
      
      set({ unreadCount });
    } catch (error) {
      set({ error: 'Failed to fetch unread count' });
      handleApiError(error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));