// Admin Panel API Services
// TODO: Replace mock data with actual API calls
// All admin API endpoints should be defined here

import {
  Subject,
  SubjectCreateDTO,
  SubjectUpdateDTO,
  Course,
  CourseCreateDTO,
  CourseUpdateDTO,
  Module,
  ModuleCreateDTO,
  ModuleUpdateDTO,
  Lesson,
  LessonCreateDTO,
  LessonUpdateDTO,
  Source,
  SourceCreateDTO,
  SourceUpdateDTO,
  Banner,
  BannerCreateDTO,
  BannerUpdateDTO,
  Teacher,
} from '@/types/admin';

// Base API URL - update this when connecting to real API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/admin';

// Generic fetch wrapper for API calls
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  //   ...options,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     // TODO: Add authentication token
  //     // 'Authorization': `Bearer ${token}`,
  //     ...options?.headers,
  //   },
  // });
  // if (!response.ok) throw new Error('API call failed');
  // return response.json();

  // For now, return mock data
  return {} as T;
}

// Mock data storage (in-memory for development)
let mockSubjects: Subject[] = [];
let mockCourses: Course[] = [];
let mockModules: Module[] = [];
let mockLessons: Lesson[] = [];
let mockSources: Source[] = [];
let mockBanners: Banner[] = [];
let mockTeachers: Teacher[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

// Subject (Category) Services
export const subjectAdminService = {
  getAll: async (): Promise<Subject[]> => {
    // TODO: Replace with: return fetchAPI<Subject[]>('/subjects');
    return mockSubjects;
  },

  getById: async (id: string): Promise<Subject | null> => {
    // TODO: Replace with: return fetchAPI<Subject>(`/subjects/${id}`);
    return mockSubjects.find((s) => s.id === id) || null;
  },

  create: async (data: SubjectCreateDTO): Promise<Subject> => {
    // TODO: Replace with: return fetchAPI<Subject>('/subjects', { method: 'POST', body: JSON.stringify(data) });
    const newSubject: Subject = {
      ...data,
      id: `subject-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockSubjects.push(newSubject);
    return newSubject;
  },

  update: async (id: string, data: SubjectUpdateDTO): Promise<Subject> => {
    // TODO: Replace with: return fetchAPI<Subject>(`/subjects/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    const index = mockSubjects.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Subject not found');
    mockSubjects[index] = {
      ...mockSubjects[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockSubjects[index];
  },

  delete: async (id: string): Promise<void> => {
    // TODO: Replace with: await fetchAPI(`/subjects/${id}`, { method: 'DELETE' });
    mockSubjects = mockSubjects.filter((s) => s.id !== id);
  },
};

// Course Services
export const courseAdminService = {
  getAll: async (): Promise<Course[]> => {
    // TODO: Replace with: return fetchAPI<Course[]>('/courses');
    return mockCourses;
  },

  getBySubject: async (subjectId: string): Promise<Course[]> => {
    // TODO: Replace with: return fetchAPI<Course[]>(`/courses?subject_id=${subjectId}`);
    return mockCourses.filter((c) => c.subject_id === subjectId);
  },

  getById: async (id: string): Promise<Course | null> => {
    // TODO: Replace with: return fetchAPI<Course>(`/courses/${id}`);
    return mockCourses.find((c) => c.id === id) || null;
  },

  create: async (data: CourseCreateDTO): Promise<Course> => {
    // TODO: Replace with: return fetchAPI<Course>('/courses', { method: 'POST', body: JSON.stringify(data) });
    const newCourse: Course = {
      ...data,
      id: `course-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockCourses.push(newCourse);
    return newCourse;
  },

  update: async (id: string, data: CourseUpdateDTO): Promise<Course> => {
    // TODO: Replace with: return fetchAPI<Course>(`/courses/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    const index = mockCourses.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Course not found');
    mockCourses[index] = {
      ...mockCourses[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockCourses[index];
  },

  delete: async (id: string): Promise<void> => {
    // TODO: Replace with: await fetchAPI(`/courses/${id}`, { method: 'DELETE' });
    mockCourses = mockCourses.filter((c) => c.id !== id);
  },
};

// Module Services
export const moduleAdminService = {
  getByCourse: async (courseId: string): Promise<Module[]> => {
    // TODO: Replace with: return fetchAPI<Module[]>(`/modules?course_id=${courseId}`);
    return mockModules.filter((m) => m.course_id === courseId);
  },

  getById: async (id: string): Promise<Module | null> => {
    // TODO: Replace with: return fetchAPI<Module>(`/modules/${id}`);
    return mockModules.find((m) => m.id === id) || null;
  },

  create: async (data: ModuleCreateDTO): Promise<Module> => {
    // TODO: Replace with: return fetchAPI<Module>('/modules', { method: 'POST', body: JSON.stringify(data) });
    const newModule: Module = {
      ...data,
      id: `module-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockModules.push(newModule);
    return newModule;
  },

  update: async (id: string, data: ModuleUpdateDTO): Promise<Module> => {
    // TODO: Replace with: return fetchAPI<Module>(`/modules/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    const index = mockModules.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Module not found');
    mockModules[index] = {
      ...mockModules[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockModules[index];
  },

  delete: async (id: string): Promise<void> => {
    // TODO: Replace with: await fetchAPI(`/modules/${id}`, { method: 'DELETE' });
    mockModules = mockModules.filter((m) => m.id !== id);
  },
};

// Lesson Services
export const lessonAdminService = {
  getByModule: async (moduleId: string): Promise<Lesson[]> => {
    // TODO: Replace with: return fetchAPI<Lesson[]>(`/lessons?module_id=${moduleId}`);
    return mockLessons.filter((l) => l.module_id === moduleId);
  },

  getById: async (id: string): Promise<Lesson | null> => {
    // TODO: Replace with: return fetchAPI<Lesson>(`/lessons/${id}`);
    return mockLessons.find((l) => l.id === id) || null;
  },

  create: async (data: LessonCreateDTO): Promise<Lesson> => {
    // TODO: Replace with: return fetchAPI<Lesson>('/lessons', { method: 'POST', body: JSON.stringify(data) });
    const newLesson: Lesson = {
      ...data,
      id: `lesson-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockLessons.push(newLesson);
    return newLesson;
  },

  update: async (id: string, data: LessonUpdateDTO): Promise<Lesson> => {
    // TODO: Replace with: return fetchAPI<Lesson>(`/lessons/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    const index = mockLessons.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Lesson not found');
    mockLessons[index] = {
      ...mockLessons[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockLessons[index];
  },

  delete: async (id: string): Promise<void> => {
    // TODO: Replace with: await fetchAPI(`/lessons/${id}`, { method: 'DELETE' });
    mockLessons = mockLessons.filter((l) => l.id !== id);
  },
};

// Source Services
export const sourceAdminService = {
  getByLesson: async (lessonId: string): Promise<Source[]> => {
    // TODO: Replace with: return fetchAPI<Source[]>(`/sources?lesson_id=${lessonId}`);
    return mockSources.filter((s) => s.lesson_id === lessonId);
  },

  getById: async (id: string): Promise<Source | null> => {
    // TODO: Replace with: return fetchAPI<Source>(`/sources/${id}`);
    return mockSources.find((s) => s.id === id) || null;
  },

  create: async (data: SourceCreateDTO): Promise<Source> => {
    // TODO: Replace with: return fetchAPI<Source>('/sources', { method: 'POST', body: JSON.stringify(data) });
    const newSource: Source = {
      ...data,
      id: `source-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockSources.push(newSource);
    return newSource;
  },

  update: async (id: string, data: SourceUpdateDTO): Promise<Source> => {
    // TODO: Replace with: return fetchAPI<Source>(`/sources/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    const index = mockSources.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Source not found');
    mockSources[index] = {
      ...mockSources[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockSources[index];
  },

  delete: async (id: string): Promise<void> => {
    // TODO: Replace with: await fetchAPI(`/sources/${id}`, { method: 'DELETE' });
    mockSources = mockSources.filter((s) => s.id !== id);
  },
};

// Banner Services
export const bannerAdminService = {
  getAll: async (): Promise<Banner[]> => {
    // TODO: Replace with: return fetchAPI<Banner[]>('/banners');
    return mockBanners;
  },

  getById: async (id: string): Promise<Banner | null> => {
    // TODO: Replace with: return fetchAPI<Banner>(`/banners/${id}`);
    return mockBanners.find((b) => b.id === id) || null;
  },

  create: async (data: BannerCreateDTO): Promise<Banner> => {
    // TODO: Replace with: return fetchAPI<Banner>('/banners', { method: 'POST', body: JSON.stringify(data) });
    const newBanner: Banner = {
      ...data,
      id: `banner-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockBanners.push(newBanner);
    return newBanner;
  },

  update: async (id: string, data: BannerUpdateDTO): Promise<Banner> => {
    // TODO: Replace with: return fetchAPI<Banner>(`/banners/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    const index = mockBanners.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Banner not found');
    mockBanners[index] = {
      ...mockBanners[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockBanners[index];
  },

  delete: async (id: string): Promise<void> => {
    // TODO: Replace with: await fetchAPI(`/banners/${id}`, { method: 'DELETE' });
    mockBanners = mockBanners.filter((b) => b.id !== id);
  },
};

// Teacher Services
export const teacherAdminService = {
  getAll: async (): Promise<Teacher[]> => {
    // TODO: Replace with: return fetchAPI<Teacher[]>('/teachers');
    return mockTeachers;
  },
};

