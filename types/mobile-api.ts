// TypeScript interfaces for Mobile API endpoints
// Based on Swagger documentation at https://dev.axadjonovsardorbek.uz/api/swagger/index.html

// ============================================================================
// Authentication Types
// ============================================================================

export interface UserCheckReq {
  phone_number: string;
}

export interface UserCheckRes {
  has_account: boolean;
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
  refresh_token?: string;
  id?: string;
  role?: string;
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
  name: string;
  fcm_token?: string;
  image_url?: string;
  language?: string;
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

export interface CourseMobileRes {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  is_public: boolean;
  order_num: number;
  teacher_id?: string;
  teacher_name?: string;
}

export interface CourseMobileList {
  courses: CourseMobileRes[];
  count: number;
}

export interface MobileCourseRes {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  documents: number;
  duration: number;
  has_access: boolean;
  lessons: number;
  tests: number;
  modules: MobileCourseModuleRes[];
  price?: CoursePriceOption[];
  teacher_id?: string;
  teacher_name?: string;
}

export interface MobileCourseModuleRes {
  id: string;
  course_id: string;
  name: string;
  order_num: number;
  lessons: MobileCourseLessonRes[];
}

export interface MobileCourseLessonRes {
  id: string;
  module_id: string;
  name: string;
  order_num: number;
  is_completed: boolean;
  is_public: boolean;
}

export interface CoursePriceOption {
  tariff_id: string;
  duration: number;
  price: number;
}

// ============================================================================
// Lesson API Detail (SourceLessonMobile)
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
  order_num: number;
  duration: number;
  is_completed: boolean;
  type: string;
  videos: SourceMobile[];
  documents: SourceMobile[];
  tests: SourceMobile[];
}


// ============================================================================
// User Course Permission Types
// ============================================================================

export interface UserCourseMobileRes {
  id: string;
  course_id: string;
  course_name: string;
  course_image_url?: string;
  user_id: string;
  user_name: string;
  tariff_id: string;
  tariff_name: string;
  duration: number;
  percentage: number;
  total_lessons: number;
  completed_lessons: number;
  is_active: boolean;
  started_at: string;
  ended_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserCourseMobileList {
  user_courses: UserCourseMobileRes[];
  count: number;
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
  count: number;
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
  count: number;
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
  count: number;
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
// FAQ Types
// ============================================================================

export interface FAQMobile {
  id: string;
  question: string;
  answer: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface FAQList {
  faqs: FAQMobile[];
  count: number;
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
  count: number;
}

export interface UserActivityCreateBody {
  activity: number;
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
}

export interface RatingUser {
  user_id: string;
  name: string;
  image_url?: string;
  rank: number;
  activity: number;
  is_me?: boolean;
}

export interface RatingResponse {
  type: string;
  limit: number;
  items: RatingUser[];
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
  duration: number; // days
  features?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TariffList {
  tariffs: TariffRes[];
  count: number;
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
  count: number;
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
  count: number;
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
