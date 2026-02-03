// TypeScript interfaces for Mobile API endpoints
// Based on Swagger documentation at https://dev.axadjonovsardorbek.uz/api/swagger/index.html
// FIXED: All interfaces now match actual Swagger responses

// ============================================================================
// Authentication Types
// ============================================================================

export interface UserCheckReq {
  phone_number: string;
}

export interface UserCheckRes {
  has_account: boolean; // FIXED: was 'exists'
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
  id: string;
  role: string;
}

export interface ChangePasswordBody {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

// ============================================================================
// User/Profile Types
// ============================================================================

export interface UserRes {
  id: string;
  phone_number: string;
  name: string; // FIXED: was 'full_name'
  fcm_token?: string;
  language?: string;
  image_url?: string;
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
  subject_id?: string;
  subject_name?: string;
}

export interface UserCourseMobileList {
  courses: UserCourseMobile[];
  count: number; // FIXED: was 'total'
}

export interface LessonMobile {
  id: string;
  name: string;
  description?: string;
  order_number: number;
}

export interface UserCourseMobileRes {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  subject_id: string;
  subject_name?: string;
  lessons?: LessonMobile[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Lesson Types
// ============================================================================

export interface SourceMobile {
  id: string;
  name: string;
  order_num: number;
  type: string;
  url: string;
}

export interface SourceLessonMobileRes {
  id: string;
  name: string;
  description?: string;
  course_id: string;
  course_name?: string;
  duration: number;
  order_num: number;
  type: string;
  is_completed: boolean;
  videos?: SourceMobile[];
  documents?: SourceMobile[];
  tests?: SourceMobile[];
}

// ============================================================================
// Subject Types
// ============================================================================

export interface Subject {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface SubjectList {
  subjects: Subject[];
  count: number; // FIXED: was 'total'
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
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface BannerMobileList {
  banners: BannerMobile[];
  count: number; // FIXED: was 'total'
}

export interface BannerMobileRes {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  order_num: number;
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
  count: number; // FIXED: was 'total'
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
  count: number; // FIXED: was 'total'
}

// ============================================================================
// Activity Types
// ============================================================================

export interface UserActivityCreateBody {
  course_id: string;
  lesson_id: string;
  duration: number; // in seconds
}

export interface ActivityStatItem {
  date: string;
  value: number;
}

export interface ActivityStatsResponse {
  user_id: string;
  type: string;
  total: number;
  items: ActivityStatItem[];
  total_time?: number; // Legacy field
  total_lessons?: number; // Legacy field
  total_courses?: number; // Legacy field
}

// ============================================================================
// Rating/Leaderboard Types
// ============================================================================

export interface RatingUser {
  user_id: string;
  full_name: string;
  image_url?: string;
  rank: number;
  total_time: number; // in seconds - FIXED: was named differently
  activity?: number;
  is_me?: boolean;
}

export interface RatingResponse {
  type: string;
  limit: number;
  items: RatingUser[]; // FIXED: was 'top_users'
  me?: RatingUser;
}

// ============================================================================
// Tariff Types
// ============================================================================

export interface TariffRes {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // FIXED: was 'duration_days'
  created_at: string;
  updated_at: string;
}

export interface TariffList {
  tariffs: TariffRes[];
  count: number; // FIXED: was 'total'
}

// ============================================================================
// Order Types
// ============================================================================

export interface OrderCreateBody {
  tariff_id: string;
  payment_method?: string;
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
  link_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactList {
  contacts: Contact[];
  count: number; // FIXED: was 'total'
}

// ============================================================================
// App Route Types
// ============================================================================

export interface AppRoute {
  id: string;
  app_version: any;
  app_links: any;
  support_url: string;
  call_center: string;
  payment_min_version: string;
  created_at: string;
  updated_at: string;
}

export interface AppRouteList {
  app_routes: AppRoute[]; // FIXED: was 'routes'
  count: number; // FIXED: was 'total'
}

export interface AppRouteRes {
  id: string;
  app_version: any;
  app_links: any;
  support_url: string;
  call_center: string;
  payment_min_version: string;
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
  is_public?: boolean;
}

export interface SubjectQueryParams extends PaginationParams {
  name?: string;
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
  limit?: number;
}

// ============================================================================
// Language Type
// ============================================================================

export type Language = 'uz' | 'ru' | 'en';
