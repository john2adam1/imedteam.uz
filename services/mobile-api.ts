// Mobile API Service Layer
// Handles all API calls to /mobile/* endpoints

import {
    UserCheckReq,
    UserCheckRes,
    UserLoginReq,
    UserRegisterReq,
    TokenRes,
    ChangePasswordBody,
    UserRes,
    UserCourseMobileList,
    UserCourseMobileRes,
    ProfileUpdateBody,
    CourseQueryParams,
    SourceLessonMobileRes,
    SubjectList,
    SubjectQueryParams,
    BannerMobileList,
    BannerMobileRes,
    AboutMobileList,
    AboutMobileRes,
    FAQList,
    UserNotificationList,
    NotificationQueryParams,
    UserActivityCreateBody,
    ActivityStatsResponse,
    ActivityQueryParams,
    RatingResponse,
    RatingQueryParams,
    TariffList,
    TariffRes,
    OrderCreateBody,
    ContactCreateBody,
    AppRouteList,
    AppRouteRes,
    Language,
} from '@/types/mobile-api';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';

// Get API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev.axadjonovsardorbek.uz/api';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get authentication token from localStorage or cookies
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return getCookie('auth_token') || localStorage.getItem('auth_token');
}

/**
 * Get current language from localStorage
 */
function getCurrentLanguage(): Language {
    if (typeof window === 'undefined') return 'uz';
    return (localStorage.getItem('language') as Language) || 'uz';
}

/**
 * Generic fetch wrapper for API calls
 */
export async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true
): Promise<T> {
    const headers: Record<string, string> = {
        'Accept-Language': getCurrentLanguage(),
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Add authentication token if required
    if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = `API call failed: ${response.status}`;

        try {
            // Try to parse JSON error response
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
            // If JSON parsing fails, try to get text
            try {
                const errorText = await response.text();
                if (errorText && errorText.length < 200) {
                    errorMessage = errorText;
                }
            } catch {
                // Use default error message
            }
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

/**
 * Build query string from params object
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

// ============================================================================
// Authentication Service
// ============================================================================

export const authService = {
    /**
     * Check if user exists
     * POST /mobile/auth/user/check
     */
    checkUser: async (data: UserCheckReq): Promise<UserCheckRes> => {
        return fetchAPI<UserCheckRes>('/mobile/auth/user/check', {
            method: 'POST',
            body: JSON.stringify(data),
        }, false);
    },

    /**
     * Login user
     * POST /mobile/auth/user/login
     */
    login: async (data: UserLoginReq): Promise<TokenRes> => {
        const response = await fetchAPI<TokenRes>('/mobile/auth/user/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }, false);

        // Store token in localStorage and cookies
        if (typeof window !== 'undefined' && response.access_token) {
            setCookie('auth_token', response.access_token);
            setCookie('is_admin', 'false');
            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('is_admin', 'false');
            if (response.refresh_token) {
                localStorage.setItem('refresh_token', response.refresh_token);
            }
        }

        return response;
    },

    /**
     * Register new user (via Login endpoint with name)
     * POST /mobile/auth/user/login
     */
    register: async (data: UserRegisterReq): Promise<TokenRes> => {
        // Using login endpoint which acts as register when name is provided
        const loginData: UserLoginReq = {
            phone_number: data.phone_number,
            password: data.password,
            name: data.full_name
        };

        const response = await fetchAPI<TokenRes>('/mobile/auth/user/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        }, false);

        // Store token in localStorage and cookies
        if (typeof window !== 'undefined' && response.access_token) {
            setCookie('auth_token', response.access_token);
            setCookie('is_admin', 'false');
            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('is_admin', 'false');
            if (response.refresh_token) {
                localStorage.setItem('refresh_token', response.refresh_token);
            }
        }

        return response;
    },

    /**
     * Change password
     * PUT /mobile/auth/password/change
     */
    changePassword: async (data: ChangePasswordBody): Promise<string> => {
        return fetchAPI<string>('/mobile/auth/password/change', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Refresh access token
     * POST /mobile/auth/refresh
     */
    refreshToken: async (refreshToken: string): Promise<TokenRes> => {
        return fetchAPI<TokenRes>('/mobile/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refresh_token: refreshToken }),
        }, false);
    },

    /**
     * Logout user (client-side only)
     */
    logout: () => {
        if (typeof window !== 'undefined') {
            removeCookie('auth_token');
            removeCookie('is_admin');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('is_admin');
        }
    },
};

// ============================================================================
// Profile Service
// ============================================================================

export const profileService = {
    /**
     * Get user profile
     * GET /mobile/user/get/profile
     */
    getProfile: async (): Promise<UserRes> => {
        return fetchAPI<UserRes>('/mobile/user/get/profile');
    },

    /**
     * Delete user profile
     * DELETE /mobile/user/delete/profile
     */
    deleteProfile: async (): Promise<string> => {
        return fetchAPI<string>('/mobile/user/delete/profile', {
            method: 'DELETE',
        });
    },

    /**
     * Update user profile
     * PUT /mobile/user/update/profile
     */
    updateProfile: async (data: ProfileUpdateBody): Promise<string> => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.phone_number) formData.append('phone_number', data.phone_number);
        if (data.fcm_token) formData.append('fcm_token', data.fcm_token);
        if (data.language) formData.append('language', data.language);
        if (data.image) formData.append('image', data.image);

        // Don't cast to any, fetch accepts FormData in body
        return fetchAPI<string>('/mobile/user/update/profile', {
            method: 'PUT',
            body: formData,
        });
    },
};

// ============================================================================
// Course Service
// ============================================================================

export const courseService = {
    /**
     * Get all courses
     * GET /mobile/course
     */
    getAll: async (params?: CourseQueryParams): Promise<UserCourseMobileList> => {
        // Removed hardcoded is_public: true
        const queryString = params ? buildQueryString(params) : '';
        return fetchAPI<UserCourseMobileList>(`/mobile/course${queryString}`);
    },

    /**
     * Get course by ID
     * GET /mobile/course/{id}
     */
    getById: async (id: string): Promise<UserCourseMobileRes> => {
        return fetchAPI<UserCourseMobileRes>(`/mobile/course/${id}`);
    },

    /**
     * Get user courses (with permission)
     * GET /mobile/course/permission
     */
    getUserCourses: async (params?: CourseQueryParams): Promise<UserCourseMobileList> => {
        const queryString = params ? buildQueryString(params) : '';
        return fetchAPI<UserCourseMobileList>(`/mobile/course/permission${queryString}`);
    },

    /**
     * Get course with permission check
     * GET /mobile/course/permission/{id}
     */
    getWithPermission: async (id: string): Promise<UserCourseMobileRes> => {
        return fetchAPI<UserCourseMobileRes>(`/mobile/course/permission/${id}`);
    },
};

// ============================================================================
// Lesson Service
// ============================================================================

export const lessonService = {
    /**
     * Get lesson by ID
     * GET /mobile/lesson/{id}
     */
    getById: async (id: string): Promise<SourceLessonMobileRes> => {
        return fetchAPI<SourceLessonMobileRes>(`/mobile/lesson/${id}`);
    },

    /**
     * Mark lesson as ended
     * PUT /mobile/lesson/{id}/end
     */
    endLesson: async (id: string): Promise<string> => {
        return fetchAPI<string>(`/mobile/lesson/${id}/end`, {
            method: 'PUT',
        });
    },
};

// ============================================================================
// Subject Service
// ============================================================================

export const subjectService = {
    /**
     * Get all subjects
     * GET /mobile/subject
     */
    getAll: async (params?: SubjectQueryParams): Promise<SubjectList> => {
        const queryString = params ? buildQueryString(params) : '';
        return fetchAPI<SubjectList>(`/mobile/subject${queryString}`);
    },

    /**
     * Get subject by ID
     * GET /mobile/subject/{id}
     */
    getById: async (id: string): Promise<SubjectList> => {
        return fetchAPI<SubjectList>(`/mobile/subject/${id}`);
    },
};

// ============================================================================
// Banner Service
// ============================================================================

export const bannerService = {
    /**
     * Get all banners
     * GET /mobile/banner
     */
    getAll: async (): Promise<BannerMobileList> => {
        return fetchAPI<BannerMobileList>('/mobile/banner');
    },

    /**
     * Get banner by ID
     * GET /mobile/banner/{id}
     */
    getById: async (id: string): Promise<BannerMobileRes> => {
        return fetchAPI<BannerMobileRes>(`/mobile/banner/${id}`);
    },
};

// ============================================================================
// About Service
// ============================================================================

export const aboutService = {
    /**
     * Get all about content
     * GET /mobile/about
     */
    getAll: async (title?: string): Promise<AboutMobileList> => {
        const queryString = title ? `?title=${encodeURIComponent(title)}` : '';
        return fetchAPI<AboutMobileList>(`/mobile/about${queryString}`);
    },

    /**
     * Get about by ID
     * GET /mobile/about/{id}
     */
    getById: async (id: string): Promise<AboutMobileRes> => {
        return fetchAPI<AboutMobileRes>(`/mobile/about/${id}`);
    },
};

// ============================================================================
// FAQ Service
// ============================================================================

export const faqService = {
    /**
     * Get all about content
     * GET /mobile/faq
     */
    getAll: async (): Promise<FAQList> => {
        return fetchAPI<FAQList>('/mobile/faq');
    },
};

// ============================================================================
// Notification Service
// ============================================================================

export const notificationService = {
    /**
     * Get all notifications
     * GET /mobile/notification/user
     */
    getAll: async (params?: NotificationQueryParams): Promise<UserNotificationList> => {
        const queryString = params ? buildQueryString(params) : '';
        return fetchAPI<UserNotificationList>(`/mobile/notifications${queryString}`);
    },

    /**
     * Mark notification as read
     * PUT /mobile/notification/{id}/read
     */
    markAsRead: async (id: string): Promise<string> => {
        return fetchAPI<string>(`/mobile/notification/${id}/read`, {
            method: 'PUT',
        });
    },
};

// ============================================================================
// Activity Service
// ============================================================================

export const activityService = {
    /**
     * Get user activity stats
     * GET /mobile/user/activity
     */
    getStats: async (params: ActivityQueryParams): Promise<ActivityStatsResponse> => {
        const queryString = buildQueryString(params);
        return fetchAPI<ActivityStatsResponse>(`/mobile/user/activity${queryString}`);
    },

    /**
     * Create user activity
     * POST /mobile/user/activity
     */
    create: async (data: UserActivityCreateBody): Promise<string> => {
        return fetchAPI<string>('/mobile/user/activity', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// ============================================================================
// Rating Service
// ============================================================================

export const ratingService = {
    /**
     * Get leaderboard/rating
     * GET /mobile/user/rating
     */
    getRating: async (params?: RatingQueryParams): Promise<RatingResponse> => {
        const queryString = params ? buildQueryString(params) : '';
        return fetchAPI<RatingResponse>(`/mobile/user/rating${queryString}`);
    },
};

// ============================================================================
// Tariff Service
// ============================================================================

export const tariffService = {
    /**
     * Get all tariffs
     * GET /mobile/tariff
     */
    getAll: async (): Promise<TariffList> => {
        return fetchAPI<TariffList>('/mobile/tariff');
    },

    /**
     * Get tariff by ID
     * GET /mobile/tariff/{id}
     */
    getById: async (id: string): Promise<TariffRes> => {
        return fetchAPI<TariffRes>(`/mobile/tariff/${id}`);
    },
};

// ============================================================================
// Order Service
// ============================================================================

export const orderService = {
    /**
     * Create order
     * POST /mobile/order
     */
    create: async (data: OrderCreateBody): Promise<string> => {
        return fetchAPI<string>('/mobile/order', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// ============================================================================
// Contact Service
// ============================================================================

export const contactService = {
    /**
     * Submit contact form
     * POST /mobile/contact (assuming POST based on typical REST patterns)
     */
    submit: async (data: ContactCreateBody): Promise<string> => {
        return fetchAPI<string>('/mobile/contact', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// ============================================================================
// App Route Service
// ============================================================================

export const appRouteService = {
    /**
     * Get all app routes
     * GET /mobile/app-route
     */
    getAll: async (key?: string): Promise<AppRouteList> => {
        const queryString = key ? `?key=${encodeURIComponent(key)}` : '';
        return fetchAPI<AppRouteList>(`/mobile/app-route${queryString}`);
    },

    /**
     * Get app route by ID
     * GET /mobile/app-route/{id}
     */
    getById: async (id: string): Promise<AppRouteRes> => {
        return fetchAPI<AppRouteRes>(`/mobile/app-route/${id}`);
    },
};
