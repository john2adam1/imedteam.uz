// TypeScript interfaces for Mobile API endpoints
// Based on Swagger documentation at https://dev.axadjonovsardorbek.uz/api/swagger/index.html

// ============================================================================
// Authentication Types
// ============================================================================

export interface UserCheckReq {
  phone_number: string;
}

export interface UserCheckRes {
  exists: boolean;
  message: string;
}

export interface UserLoginReq {
  phone_number: string;
  password: string;
  name?: string;
}

export interface UserRegisterReq {
  phone_number: string;
  full_name: string;
  password: string;
}

export interface TokenRes {
  access_token: string;
  refresh_token: string;
}

export interface ChangePasswordBody {
  old_password: string;
  new_password: string;
}

// ============================================================================
// User/Profile Types
// ============================================================================

export interface UserRes {
  id: string;
  phone_number: string;
  full_name?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateBody {
  name?: string;
  phone_number?: string;
  fcm_token?: string;
  language?: string;
  image?: File;
}

// ============================================================================
// Course Types
// ============================================================================

export interface UserCourseMobile {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  subject_id: string;
  subject_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCourseMobileList {
  courses: UserCourseMobile[];
  total: number;
}

export interface UserCourseMobileRes {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  subject_id: string;
  subject_name?: string;
  is_active: boolean;
  lessons?: SourceLessonMobile[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Lesson Types
// ============================================================================

export interface SourceLessonMobile {
  id: string;
  name: string;
  description?: string;
  course_id: string;
  video_url?: string;
  pdf_url?: string;
  order_number: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SourceLessonMobileRes {
  id: string;
  name: string;
  description?: string;
  course_id: string;
  course_name?: string;
  video_url?: string;
  pdf_url?: string;
  order_number: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Subject Types
// ============================================================================

export interface Subject {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubjectList {
  subjects: Subject[];
  total: number;
}

// ============================================================================
// Banner Types
// ============================================================================

export interface BannerMobile {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface BannerMobileList {
  banners: BannerMobile[];
  total: number;
}

export interface BannerMobileRes {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  order_number: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// About Types
// ============================================================================

export interface AboutMobile {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AboutMobileList {
  about: AboutMobile[];
  total: number;
}

export interface AboutMobileRes {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserNotificationList {
  notifications: UserNotification[];
  total: number;
}

// ============================================================================
// Activity Types
// ============================================================================

export interface UserActivityCreateBody {
  course_id: string;
  lesson_id: string;
  duration: number; // in seconds
}

export interface ActivityStatsResponse {
  total_time: number; // in seconds
  total_lessons: number;
  total_courses: number;
  period: string;
  details?: ActivityDetail[];
}

export interface ActivityDetail {
  date: string;
  time: number; // in seconds
  lessons_completed: number;
}

// ============================================================================
// Rating/Leaderboard Types
// ============================================================================

export interface RatingUser {
  user_id: string;
  full_name: string;
  total_time: number; // in seconds
  rank: number;
}

export interface RatingResponse {
  top_users: RatingUser[];
  me?: RatingUser;
  period: string;
}

// ============================================================================
// Tariff Types
// ============================================================================

export interface TariffRes {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TariffList {
  tariffs: TariffRes[];
  total: number;
}

// ============================================================================
// Order Types
// ============================================================================

export interface OrderCreateBody {
  tariff_id: string;
  payment_method?: string;
}

export interface OrderRes {
  id: string;
  user_id: string;
  tariff_id: string;
  amount: number;
  status: string;
  payment_url?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Contact Types
// ============================================================================

export interface ContactCreateBody {
  name: string;
  phone_number: string;
  message?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone_number: string;
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactList {
  contacts: Contact[];
  total: number;
}

// ============================================================================
// App Route Types
// ============================================================================

export interface AppRoute {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface AppRouteList {
  routes: AppRoute[];
  total: number;
}

export interface AppRouteRes {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface CourseQueryParams extends PaginationParams {
  name?: string;
  subject_id?: string;
  is_active?: string;
}

export interface SubjectQueryParams extends PaginationParams {
  name?: string;
  is_active?: string;
}

export interface NotificationQueryParams {
  is_read?: boolean;
}

export interface ActivityQueryParams {
  type: 'day' | 'week' | 'month' | 'year' | 'range';
  date?: string; // YYYY-MM-DD for day type
  from?: string; // YYYY-MM-DD for range type
  to?: string; // YYYY-MM-DD for range type
}

export interface RatingQueryParams {
  type?: 'day' | 'week' | 'month' | 'year' | 'total';
}

// ============================================================================
// Language Type
// ============================================================================

export type Language = 'uz' | 'ru' | 'en';
