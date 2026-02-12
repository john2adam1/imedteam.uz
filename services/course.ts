// Course Service
// Handles course-related operations

import { apiClient } from '@/lib/api-client';
import { CourseMobileList, MobileCourseRes, CourseQueryParams, UserCourseMobileList, UserCourseMobileRes } from '@/types/mobile-api';

export const courseService = {
    /**
     * Get all courses
     */
    getCourses: async (params?: CourseQueryParams): Promise<CourseMobileList> => {
        const queryString = params ? buildQueryString(params) : '';
        const response = await apiClient<any>(`/course${queryString}`);

        const courses = getArray(response, 'courses');
        const total = response.total || response.count || courses.length;

        return {
            courses,
            count: total
        };
    },

    /**
     * Get course by ID
     */
    getCourseById: async (id: string): Promise<MobileCourseRes> => {
        const course = await apiClient<MobileCourseRes>(`/course/${id}`);

        // Helper to check if any price is 0
        const hasFreePrice = course.price?.some(p => p.price === 0);

        // ✅ CRITICAL FIX: The detail API often misses the is_public flag
        // Also check for price === 0 as per user requirements
        if (course && !course.is_public && !hasFreePrice) {
            try {
                // Fetch list to find correct status fallback
                const response = await apiClient<any>(`/course`);
                const courses = Array.isArray(response) ? response : (response.courses || response.data?.courses || []);
                const found = courses.find((c: any) => (c.id === id || c.course_id === id));
                if (found?.is_public) {
                    course.is_public = true;
                }
            } catch (err) {
                // Silently fail fallback
            }
        }

        return course;
    },

    /**
     * Get user's enrolled courses
     */
    getUserCourses: async (params?: any): Promise<UserCourseMobileList> => {
        const queryString = params ? buildQueryString(params) : '';
        const response = await apiClient<any>(`/course/permission${queryString}`);

        const user_courses = getArray(response, 'user_courses');
        const total = response.total || response.count || user_courses.length;

        return {
            user_courses,
            count: total
        };
    },

    /**
     * Get course with permission details
     */
    getCourseWithPermission: async (id: string): Promise<UserCourseMobileRes> => {
        return apiClient<UserCourseMobileRes>(`/course/permission/${id}`);
    },
};

/**
 * Helper function to build query strings
 */
function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Shared helper to extract array from various potential API response formats
 */
function getArray(data: any, key: string): any[] {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== 'object') return [];

    // Check top level keys
    if (Array.isArray(data[key])) return data[key];
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;

    // Check nested data property
    if (data.data && typeof data.data === 'object') {
        if (Array.isArray(data.data[key])) return data.data[key];
        if (Array.isArray(data.data.items)) return data.data.items;
    }

    return [];
}
