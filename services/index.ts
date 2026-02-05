// Services Index
// Central export point for all API services

export { authService } from './auth';
export { courseService } from './course';
export { lessonService } from './lesson';
export { profileService } from './profile';
export { notificationService } from './notification';
export { bannerService } from './banner';
export { aboutService } from './about';
export { faqService } from './faq';
export { subjectService } from './subject';
export { tariffService } from './tariff';
export { orderService } from './order';
export { contactService } from './contact';
export { activityService } from './activity';
export { ratingService } from './rating';
export { appRouteService } from './appRoute';

// Re-export API client utilities
export { apiClient, setAuthToken, removeAuthToken } from '@/lib/api-client';
