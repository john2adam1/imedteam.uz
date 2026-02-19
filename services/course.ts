// Course Service
// Handles course-related operations

import { apiClient } from '@/lib/api-client';
import { getMediaUrl } from '@/lib/utils';
import { CourseMobileList, MobileCourseRes, CourseQueryParams, UserCourseMobileList, UserCourseMobileRes } from '@/types/mobile-api';

export const courseService = {
    /**
     * Get all courses
     */
    getCourses: async (params?: CourseQueryParams): Promise<CourseMobileList> => {
        const queryString = params ? buildQueryString(params) : '';
        const response = await apiClient<any>(`/course${queryString}`, { requiresAuth: false });

        const courses = getArray(response, 'courses').map((c: any) => ({
            ...c,
            image_url: getMediaUrl(c.image_url)
        }));
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

        if (course) {
            course.image_url = getMediaUrl(course.image_url);
        }

        // Helper to check if any price is 0
        const hasFreePrice = course.price?.some(p => p.price === 0);

        // ✅ CRITICAL FIX: The detail API often misses the is_public flag
        // Also check for price === 0 detection
        if (course && !course.is_public && !hasFreePrice) {
            try {
                // Strategy 1: Search by name (sanitized) to handle special chars like quotes
                let found: any = undefined;

                if (course.name) {
                    // Remove quotes and special chars for better search compatibility
                    const cleanName = course.name.replace(/['"]/g, '').trim();
                    const query = `?name=${encodeURIComponent(cleanName)}`;
                    const response = await apiClient<any>(`/course${query}`);
                    const courses = getArray(response, 'courses');
                    found = courses.find((c: any) => (c.id === id || c.course_id === id));
                }

                // Strategy 2: If name search failed, try fetching latest 100 courses
                // This covers cases where name search is broken or fuzzy match fails
                if (!found) {
                    const response = await apiClient<any>(`/course?limit=100`);
                    const courses = getArray(response, 'courses');
                    found = courses.find((c: any) => (c.id === id || c.course_id === id));
                }

                if (found?.is_public) {
                    course.is_public = true;
                }
            } catch (err) {
                // Silently fail fallback
                console.warn('Failed to recover is_public flag', err);
            }
        }

        return course;
    },

    /**
     * Get user's enrolled courses (API + Local Storage for free courses)
     */
    /**
     * Get user's enrolled courses (API + Local Storage for free courses)
     */
    getUserCourses: async (params?: any): Promise<UserCourseMobileList> => {
        const queryString = params ? buildQueryString(params) : '';

        try {
            // 1. Fetch official enrollments from API
            const response = await apiClient<any>(`/course/permission${queryString}`);
            const apiCourses = getArray(response, 'user_courses').map((c: any) => ({
                ...c,
                course_image_url: getMediaUrl(c.course_image_url)
            }));
            let total = response.total || response.count || apiCourses.length;

            // 2. Fetch locally saved free courses
            if (typeof window !== 'undefined') {
                // Determine which IDs are causing duplicates
                const existingIds = new Set(apiCourses.map((c: any) => c.course_id || c.id));

                // Retrieve DETAILED course objects from local storage
                // This avoids making 50+ individual API calls which is slow and error-prone
                const localDetails = getLocalFreeCourseDetails();
                const completedLessonIds = getLocalCompletedLessons();

                // Filter courses that are not already in the API response
                const validLocalCourses = localDetails
                    .filter((course: MobileCourseRes) => !existingIds.has(course.id))
                    .map((course: MobileCourseRes) => {
                        const lessons = course.modules?.flatMap(m => m.lessons || []) || [];
                        const total_lessons = lessons.length || course.lessons || 0;
                        const completed_count = lessons.filter(l => completedLessonIds.has(l.id)).length;
                        const percentage = total_lessons > 0 ? Math.round((completed_count / total_lessons) * 100) : 0;

                        return {
                            id: `local_${course.id}`, // Prefix to distinguish from API courses if needed
                            course_id: course.id,
                            course_name: course.name,
                            course_image_url: course.image_url,
                            user_id: 'local_user',
                            user_name: 'Me',
                            tariff_id: 'free_tariff',
                            tariff_name: 'Bepul',
                            duration: course.duration || 0,
                            percentage: percentage,
                            total_lessons: total_lessons,
                            completed_lessons: completed_count,
                            is_active: true,
                            started_at: new Date().toISOString(),
                            ended_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        } as UserCourseMobileRes;
                    });

                if (validLocalCourses.length > 0) {
                    apiCourses.push(...validLocalCourses);
                    total += validLocalCourses.length;
                }
            }

            return {
                user_courses: apiCourses,
                count: total
            };
        } catch (error) {
            console.error('Failed to get user courses:', error);
            return { user_courses: [], count: 0 };
        }
    },

    /**
     * Start a free course (Local Storage only)
     */
    startFreeCourse: (course: Partial<MobileCourseRes>) => {
        if (typeof window === 'undefined' || !course.id) return;

        // 1. Update ID list for backward compatibility (optional, but good)
        const ids = getLocalFreeCourses();
        if (!ids.includes(course.id)) {
            ids.push(course.id);
            localStorage.setItem('my_free_courses', JSON.stringify(ids));
        }

        // 2. Update Details list
        const details = getLocalFreeCourseDetails();
        if (!details.find((d: MobileCourseRes) => d.id === course.id)) {
            details.push(course as MobileCourseRes);
            localStorage.setItem('my_free_course_details', JSON.stringify(details));
        }
    },

    /**
     * Get course with permission details
     */
    getCourseWithPermission: async (id: string): Promise<UserCourseMobileRes> => {
        const course = await apiClient<UserCourseMobileRes>(`/course/permission/${id}`);
        if (course) {
            course.course_image_url = getMediaUrl(course.course_image_url);
        }
        return course;
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

/**
 * Helper to get local free course details
 */
function getLocalFreeCourseDetails(): MobileCourseRes[] {
    if (typeof window === 'undefined') return [];
    try {
        const item = localStorage.getItem('my_free_course_details');
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
}

/**
 * Helper to get local completed lesson IDs
 */
function getLocalCompletedLessons(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
        const item = localStorage.getItem('completed_lessons');
        const ids = item ? JSON.parse(item) : [];
        return new Set(Array.isArray(ids) ? ids : []);
    } catch {
        return new Set();
    }
}
