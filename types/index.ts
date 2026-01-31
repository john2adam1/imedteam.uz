// TypeScript interfaces for the educational platform

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  order: number;
  isFree: boolean;
  videoUrl?: string;
  pdfUrl?: string;
  testPdfUrl?: string;
  duration?: number; // in minutes
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  categoryId: string;
  instructor?: string;
  imageUrl?: string;
  price: number; // 0 for free courses
  isFree: boolean;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
}

