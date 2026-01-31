// API service layer
// TODO: Replace mock data with actual API calls
// All API endpoints should be defined here

import { Category, Course, Lesson, Notification } from '@/types';
import { mockCategories, mockCourses, mockNotifications } from '@/mock/data';

// Base API URL - update this when connecting to real API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic fetch wrapper for future API calls
async function fetchAPI<T>(endpoint: string): Promise<T> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}${endpoint}`);
  // if (!response.ok) throw new Error('API call failed');
  // return response.json();
  
  // For now, return mock data
  return {} as T;
}

// Category services
export const categoryService = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    // TODO: Replace with: return fetchAPI<Category[]>('/categories');
    return mockCategories;
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<Category | null> => {
    // TODO: Replace with: return fetchAPI<Category>(`/categories/${slug}`);
    return mockCategories.find(cat => cat.slug === slug) || null;
  },
};

// Course services
export const courseService = {
  // Get all courses
  getAll: async (): Promise<Course[]> => {
    // TODO: Replace with: return fetchAPI<Course[]>('/courses');
    return mockCourses;
  },

  // Get courses by category
  getByCategory: async (categoryId: string): Promise<Course[]> => {
    // TODO: Replace with: return fetchAPI<Course[]>(`/courses?category=${categoryId}`);
    return mockCourses.filter(course => course.categoryId === categoryId);
  },

  // Get course by slug
  getBySlug: async (slug: string): Promise<Course | null> => {
    // TODO: Replace with: return fetchAPI<Course>(`/courses/${slug}`);
    return mockCourses.find(course => course.slug === slug) || null;
  },

  // Get free courses
  getFreeCourses: async (): Promise<Course[]> => {
    // TODO: Replace with: return fetchAPI<Course[]>('/courses?free=true');
    return mockCourses.filter(course => course.isFree);
  },
};

// Lesson services
export const lessonService = {
  // Get lesson by ID
  getById: async (courseId: string, moduleId: string, lessonId: string): Promise<Lesson | null> => {
    // TODO: Replace with: return fetchAPI<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return null;
    
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return null;
    
    return module.lessons.find(l => l.id === lessonId) || null;
  },
};

// Notification services
export const notificationService = {
  // Get all notifications
  getAll: async (): Promise<Notification[]> => {
    // TODO: Replace with: return fetchAPI<Notification[]>('/notifications');
    return mockNotifications;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    // TODO: Replace with: await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, { method: 'POST' });
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  },

  // Mark all as read
  markAllAsRead: async (): Promise<void> => {
    // TODO: Replace with: await fetch(`${API_BASE_URL}/notifications/read-all`, { method: 'POST' });
    mockNotifications.forEach(n => n.read = true);
  },
};

// Auth services
export const authService = {
  // Login with phone number
  login: async (phoneNumber: string): Promise<{ token: string; user: any }> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phoneNumber }),
    // });
    // return response.json();
    
    // Mock response
    return {
      token: 'mock-token',
      user: { id: '1', phoneNumber, name: 'User' },
    };
  },

  // Logout
  logout: async (): Promise<void> => {
    // TODO: Replace with: await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
  },
};

