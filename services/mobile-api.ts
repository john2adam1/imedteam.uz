// Mobile API Service Layer
// Based on Swagger documentation at https://dev.axadjonovsardorbek.uz/api/swagger/index.html
// This is the single source of truth for all /mobile/* endpoints.

import {
    UserCheckReq,
    UserCheckRes,
    UserLoginReq,
    UserRegisterReq,
    TokenRes,
    ChangePasswordBody,
    UserRes,
    CourseMobileList,
    MobileCourseRes,
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev.axadjonovsardorbek.uz/api';

// ============================================================================
// Helper Functions
// ============================================================================

function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return getCookie('auth_token') || localStorage.getItem('auth_token');
}

function getCurrentLanguage(): Language {
    if (typeof window === 'undefined') return 'uz';
    return (localStorage.getItem('language') as Language) || 'uz';
}

/**
 * Robust fetch wrapper with unified error handling
 */
export async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true
): Promise<T> {
    const headers: Record<string, string> = {
        'Accept-Language': getCurrentLanguage(),
        ...((options.headers as Record<string, string>) || {}),
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

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
        let errorMessage = `API error: ${response.status}`;
        const clonedResponse = response.clone();
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
            try {
                const errorText = await clonedResponse.text();
                if (errorText && errorText.length < 200) errorMessage = errorText;
            } catch (e) {
                // Ignore secondary error
            }
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

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
    checkUser: async (data: UserCheckReq): Promise<UserCheckRes> => {
        return fetchAPI<UserCheckRes>('/mobile/auth/user/check', {
            method: 'POST',
            body: JSON.stringify(data),
        }, false);
    },

    login: async (data: UserLoginReq): Promise<TokenRes> => {
        const response = await fetchAPI<TokenRes>('/mobile/auth/user/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }, false);

        if (typeof window !== 'undefined' && response.access_token) {
            setCookie('auth_token', response.access_token);
            localStorage.setItem('auth_token', response.access_token);
            if (response.refresh_token) {
                localStorage.setItem('refresh_token', response.refresh_token);
            }
        }
        return response;
    },

    register: async (data: UserRegisterReq): Promise<TokenRes> => {
        // Swagger: Login endpoint acts as register when 'name' is provided
        const payload: UserLoginReq = {
            phone_number: data.phone_number,
            password: data.password,
            name: data.full_name,
        };
        return authService.login(payload);
    },

    changePassword: async (data: ChangePasswordBody): Promise<string> => {
        return fetchAPI<string>('/mobile/auth/password/change', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            removeCookie('auth_token');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
        }
    },
};

// ============================================================================
// Profile Service
// ============================================================================

export const profileService = {
    getProfile: async (): Promise<UserRes> => {
        return fetchAPI<UserRes>('/mobile/user/get/profile');
    },

    updateProfile: async (data: ProfileUpdateBody): Promise<string> => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.phone_number) formData.append('phone_number', data.phone_number);
        if (data.fcm_token) formData.append('fcm_token', data.fcm_token);
        if (data.language) formData.append('language', data.language);
        if (data.image) formData.append('image', data.image);

        return fetchAPI<string>('/mobile/user/update/profile', {
            method: 'PUT',
            body: formData,
        });
    },

    deleteProfile: async (): Promise<string> => {
        return fetchAPI<string>('/mobile/user/delete/profile', { method: 'DELETE' });
    },
};

// ============================================================================
// Course Service
// ============================================================================

export const courseService = {
    getAll: async (params?: CourseQueryParams): Promise<CourseMobileList> => {
        const queryString = params ? buildQueryString(params) : '';
        return fetchAPI<CourseMobileList>(`/mobile/course${queryString}`);
    },

    getById: async (id: string): Promise<MobileCourseRes> => {
        return fetchAPI<MobileCourseRes>(`/mobile/course/${id}`);
    },

    getUserCourses: async (params?: any): Promise<UserCourseMobileList> => {
        const queryString = params ? buildQueryString(params) : '';
        return fetchAPI<UserCourseMobileList>(`/mobile/course/permission${queryString}`);
    },

    getWithPermission: async (id: string): Promise<UserCourseMobileRes> => {
        return fetchAPI<UserCourseMobileRes>(`/mobile/course/permission/${id}`);
    },
};

// ============================================================================
// Lesson Service
// ============================================================================

export const lessonService = {
    getById: async (id: string): Promise<SourceLessonMobileRes> => {
        return fetchAPI<SourceLessonMobileRes>(`/mobile/lesson/${id}`);
    },

    endLesson: async (id: string): Promise<string> => {
        return fetchAPI<string>(`/mobile/lesson/${id}/end`, { method: 'PUT' });
    },
};

// ============================================================================
// Banner Service
// ============================================================================

export const bannerService = {
    getAll: async (): Promise<BannerMobileList> => {
        return fetchAPI<BannerMobileList>('/mobile/banner');
    },

    getById: async (id: string): Promise<BannerMobileRes> => {
        return fetchAPI<BannerMobileRes>(`/mobile/banner/${id}`);
    },
};

// ============================================================================
// Notification Service
// ============================================================================

export const notificationService = {
    getAll: async (params?: NotificationQueryParams): Promise<UserNotificationList> => {
        const queryString = params ? buildQueryString(params) : '';
        return fetchAPI<UserNotificationList>(`/mobile/notification/user${queryString}`);
    },

    markAsRead: async (id: string): Promise<string> => {
        return fetchAPI<string>(`/mobile/notification/${id}/read`, { method: 'PUT' });
    },
};

// ============================================================================
// Activity & Rating Service
// ============================================================================

export const activityService = {
    getStats: async (params: ActivityQueryParams): Promise<ActivityStatsResponse> => {
        const queryString = buildQueryString(params);
        return fetchAPI<ActivityStatsResponse>(`/mobile/user/activity${queryString}`);
    },

    create: async (data: UserActivityCreateBody): Promise<string> => {
        return fetchAPI<string>('/mobile/user/activity', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

export const ratingService = {
    getRating: async (params?: RatingQueryParams): Promise<RatingResponse> => {
        const queryString = params ? buildQueryString(params) : '';
        return fetchAPI<RatingResponse>(`/mobile/user/rating${queryString}`);
    },
};

// ============================================================================
// Other Services (About, FAQ, AppRoute, Order, Contact, Subject, Tariff)
// ============================================================================

export const aboutService = {
    getAll: async (title?: string): Promise<AboutMobileList> => {
        const queryString = title ? `?title=${encodeURIComponent(title)}` : '';
        return fetchAPI<AboutMobileList>(`/mobile/about${queryString}`);
    },
};

export const faqService = {
    getAll: async (): Promise<FAQList> => {
        return fetchAPI<FAQList>('/mobile/faq');
    },
};

export const appRouteService = {
    getAll: async (): Promise<AppRouteList> => {
        return fetchAPI<AppRouteList>('/mobile/app-route');
    },
};

export const subjectService = {
    getAll: async (params?: SubjectQueryParams): Promise<SubjectList> => {
        const queryString = params ? buildQueryString(params) : '';
        return fetchAPI<SubjectList>(`/mobile/subject${queryString}`);
    },
};

export const tariffService = {
    getAll: async (): Promise<TariffList> => {
        return fetchAPI<TariffList>('/mobile/tariff');
    },
};

export const orderService = {
    create: async (data: OrderCreateBody): Promise<string> => {
        return fetchAPI<string>('/mobile/order', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

export const contactService = {
    submit: async (data: ContactCreateBody): Promise<string> => {
        return fetchAPI<string>('/mobile/contact', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
