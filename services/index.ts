// Services Index
// Central export point for all API services

export { authService } from './auth';
export { courseService } from './course';
export { lessonService } from './lesson';
export { profileService } from './profile';
export { notificationService } from './notification';
export { bannerService } from './banner';
export { subjectService } from './subject';
export { tariffService } from './tariff';
export { orderService } from './order';
export { activityService } from './activity';
export { ratingService } from './rating';

// Re-export API client utilities
export { apiClient, setAuthToken, removeAuthToken } from '@/lib/api-client';
