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
        return apiClient<CourseMobileList>(`/course${queryString}`);
    },

    /**
     * Get course by ID
     */
    getCourseById: async (id: string): Promise<MobileCourseRes> => {
        return apiClient<MobileCourseRes>(`/course/${id}`);
    },

    /**
     * Get user's enrolled courses
     */
    getUserCourses: async (params?: any): Promise<UserCourseMobileList> => {
        const queryString = params ? buildQueryString(params) : '';
        return apiClient<UserCourseMobileList>(`/course/permission${queryString}`);
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
