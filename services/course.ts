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
                // Optimally search by name to avoid pagination issues
                const query = course.name ? `?name=${encodeURIComponent(course.name)}` : '?limit=100';
                const response = await apiClient<any>(`/course${query}`);
                const courses = getArray(response, 'courses');
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
     * Get user's enrolled courses (API + Local Storage for free courses)
     */
    getUserCourses: async (params?: any): Promise<UserCourseMobileList> => {
        const queryString = params ? buildQueryString(params) : '';

        try {
            // 1. Fetch official enrollments from API
            const response = await apiClient<any>(`/course/permission${queryString}`);
            const apiCourses = getArray(response, 'user_courses');
            let total = response.total || response.count || apiCourses.length;

            // 2. Fetch locally saved free courses
            if (typeof window !== 'undefined') {
                const localIds = getLocalFreeCourses();
                if (localIds.length > 0) {
                    // Filter out IDs that are already in API response to avoid duplicates
                    const existingIds = new Set(apiCourses.map((c: any) => c.course_id));
                    const newLocalIds = localIds.filter(id => !existingIds.has(id));

                    if (newLocalIds.length > 0) {
                        // Fetch details for these local courses
                        // We can use getCourses with IDs if API supports it, or fetch individually
                        // For simplicity, let's try to fetch them one by one (limit this in production!)
                        // Or better: fetch all courses and filter client side if list is small, 
                        // but getCourses is paginated.
                        // Strategy: Fetch individual details for up to 5 courses to avoid spamming
                        const localCoursesDetails = await Promise.all(
                            newLocalIds.slice(0, 5).map(async (id) => {
                                try {
                                    const course = await courseService.getCourseById(id);
                                    if (!course) return null;

                                    // Map to UserCourseMobileRes format
                                    return {
                                        id: `local_${course.id}`,
                                        course_id: course.id,
                                        course_name: course.name,
                                        course_image_url: course.image_url,
                                        user_id: 'local_user', // Placeholder
                                        user_name: 'Me',
                                        tariff_id: 'free_tariff',
                                        tariff_name: 'Bepul',
                                        duration: course.duration || 0,
                                        percentage: 0, // Cannot track progress properly without backend
                                        total_lessons: course.lessons || 0,
                                        completed_lessons: 0,
                                        is_active: true,
                                        started_at: new Date().toISOString(),
                                        ended_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                                        created_at: new Date().toISOString(),
                                        updated_at: new Date().toISOString()
                                    } as UserCourseMobileRes;
                                } catch (e) {
                                    return null;
                                }
                            })
                        );

                        const validLocalCourses = localCoursesDetails.filter(Boolean) as UserCourseMobileRes[];
                        apiCourses.push(...validLocalCourses);
                        total += validLocalCourses.length;
                    }
                }
            }

            return {
                user_courses: apiCourses,
                count: total
            };
        } catch (error) {
            console.error('Failed to get user courses:', error);
            // Fallback to empty if API fails, but maybe still show local?
            // For now, just throw or return empty
            return { user_courses: [], count: 0 };
        }
    },

    /**
     * Start a free course (Local Storage only)
     */
    startFreeCourse: (courseId: string) => {
        if (typeof window === 'undefined') return;
        const ids = getLocalFreeCourses();
        if (!ids.includes(courseId)) {
            ids.push(courseId);
            localStorage.setItem('my_free_courses', JSON.stringify(ids));
        }
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

/**
 * Helper to get local free course IDs
 */
function getLocalFreeCourses(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const item = localStorage.getItem('my_free_courses');
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
}
