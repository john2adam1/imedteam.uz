// Admin Panel API Services
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
  AdminLoginReq,
  AdminLoginRes,
} from '@/types/admin';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';

// Base API URL
// Assuming the Admin API is at /api/admin/*
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://dev.axadjonovsardorbek.uz') + '/api/web';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return getCookie('auth_token') || localStorage.getItem('auth_token');
}

// Generic fetch wrapper for API calls
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API call failed: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      try {
        const errorText = await response.text();
        if (errorText && errorText.length < 200) errorMessage = errorText;
      } catch { }
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  // Check for logical errors in 200 responses
  if (data && (data.error || (data.success === false && data.message))) {
    throw new Error(data.message || data.error || 'Unknown API error');
  }
  return data;
}

// Subject (Category) Services
export const subjectAdminService = {
  getAll: async (): Promise<Subject[]> => {
    return fetchAPI<Subject[]>('/subjects');
  },

  getById: async (id: string): Promise<Subject | null> => {
    return fetchAPI<Subject>(`/subjects/${id}`);
  },

  create: async (data: SubjectCreateDTO): Promise<Subject> => {
    return fetchAPI<Subject>('/subjects', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id: string, data: SubjectUpdateDTO): Promise<Subject> => {
    return fetchAPI<Subject>(`/subjects/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/subjects/${id}`, { method: 'DELETE' });
  },
};

// Course Services
export const courseAdminService = {
  getAll: async (): Promise<Course[]> => {
    return fetchAPI<Course[]>('/courses');
  },

  getBySubject: async (subjectId: string): Promise<Course[]> => {
    return fetchAPI<Course[]>(`/courses?subject_id=${subjectId}`);
  },

  getById: async (id: string): Promise<Course | null> => {
    return fetchAPI<Course>(`/courses/${id}`);
  },

  create: async (data: CourseCreateDTO): Promise<Course> => {
    return fetchAPI<Course>('/courses', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id: string, data: CourseUpdateDTO): Promise<Course> => {
    return fetchAPI<Course>(`/courses/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/courses/${id}`, { method: 'DELETE' });
  },
};

// Module Services
export const moduleAdminService = {
  getByCourse: async (courseId: string): Promise<Module[]> => {
    return fetchAPI<Module[]>(`/modules?course_id=${courseId}`);
  },

  getById: async (id: string): Promise<Module | null> => {
    return fetchAPI<Module>(`/modules/${id}`);
  },

  create: async (data: ModuleCreateDTO): Promise<Module> => {
    return fetchAPI<Module>('/modules', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id: string, data: ModuleUpdateDTO): Promise<Module> => {
    return fetchAPI<Module>(`/modules/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/modules/${id}`, { method: 'DELETE' });
  },
};

// Lesson Services
export const lessonAdminService = {
  getByModule: async (moduleId: string): Promise<Lesson[]> => {
    return fetchAPI<Lesson[]>(`/lessons?module_id=${moduleId}`);
  },

  getById: async (id: string): Promise<Lesson | null> => {
    return fetchAPI<Lesson>(`/lessons/${id}`);
  },

  create: async (data: LessonCreateDTO): Promise<Lesson> => {
    return fetchAPI<Lesson>('/lessons', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id: string, data: LessonUpdateDTO): Promise<Lesson> => {
    return fetchAPI<Lesson>(`/lessons/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/lessons/${id}`, { method: 'DELETE' });
  },
};

// Source Services
export const sourceAdminService = {
  getByLesson: async (lessonId: string): Promise<Source[]> => {
    return fetchAPI<Source[]>(`/sources?lesson_id=${lessonId}`);
  },

  getById: async (id: string): Promise<Source | null> => {
    return fetchAPI<Source>(`/sources/${id}`);
  },

  create: async (data: SourceCreateDTO): Promise<Source> => {
    return fetchAPI<Source>('/sources', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id: string, data: SourceUpdateDTO): Promise<Source> => {
    return fetchAPI<Source>(`/sources/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/sources/${id}`, { method: 'DELETE' });
  },
};

// Banner Services
export const bannerAdminService = {
  getAll: async (): Promise<Banner[]> => {
    return fetchAPI<Banner[]>('/banners');
  },

  getById: async (id: string): Promise<Banner | null> => {
    return fetchAPI<Banner>(`/banners/${id}`);
  },

  create: async (data: BannerCreateDTO): Promise<Banner> => {
    return fetchAPI<Banner>('/banners', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id: string, data: BannerUpdateDTO): Promise<Banner> => {
    return fetchAPI<Banner>(`/banners/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/banners/${id}`, { method: 'DELETE' });
  },
};

// Teacher Services
export const teacherAdminService = {
  getAll: async (): Promise<Teacher[]> => {
    return fetchAPI<Teacher[]>('/teachers');
  },
};

// Admin Auth Services
export const adminAuthService = {
  login: async (credentials: AdminLoginReq): Promise<AdminLoginRes> => {
    const response = await fetchAPI<AdminLoginRes>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.access_token) {
      setCookie('auth_token', response.access_token);
      setCookie('is_admin', 'true');
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('is_admin', 'true');
    }

    return response;
  },

  logout: () => {
    removeCookie('auth_token');
    removeCookie('is_admin');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('is_admin');
  }
};

