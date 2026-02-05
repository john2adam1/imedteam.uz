// API Usage Examples
// Demonstrates how to use the mobile API services

import { authService, courseService, lessonService, profileService, notificationService } from '@/services';

// ============================================================================
// AUTHENTICATION EXAMPLES
// ============================================================================

/**
 * Example: Login user and store token
 */
export async function loginUser(phoneNumber: string, password: string) {
    try {
        const response = await authService.login({
            phone_number: phoneNumber,
            password: password,
        });

        console.log('Login successful:', response);
        // Token is automatically stored by authService.login()
        return response;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

/**
 * Example: Check if user exists
 */
export async function checkUserExists(phoneNumber: string) {
    try {
        const result = await authService.checkUser({
            phone_number: phoneNumber,
        });

        console.log('User exists:', result.has_account);
        return result.has_account;
    } catch (error) {
        console.error('Check user failed:', error);
        throw error;
    }
}

/**
 * Example: Logout user
 */
export function logoutUser() {
    authService.logout();
    console.log('User logged out');
}

// ============================================================================
// PROFILE EXAMPLES
// ============================================================================

/**
 * Example: Get user profile
 */
export async function getUserProfile() {
    try {
        const profile = await profileService.getUserProfile();
        console.log('User profile:', profile);
        return profile;
    } catch (error) {
        console.error('Get profile failed:', error);
        throw error;
    }
}

/**
 * Example: Update user profile
 */
export async function updateUserProfile(data: { name?: string; phone_number?: string }) {
    try {
        const result = await profileService.updateProfile(data);
        console.log('Profile updated:', result);
        return result;
    } catch (error) {
        console.error('Update profile failed:', error);
        throw error;
    }
}

// ============================================================================
// COURSE EXAMPLES
// ============================================================================

/**
 * Example: Get all courses
 */
export async function getAllCourses() {
    try {
        const courses = await courseService.getCourses();
        console.log('All courses:', courses);
        return courses;
    } catch (error) {
        console.error('Get courses failed:', error);
        throw error;
    }
}

/**
 * Example: Get course by ID
 */
export async function getCourseById(courseId: string) {
    try {
        const course = await courseService.getCourseById(courseId);
        console.log('Course details:', course);
        return course;
    } catch (error) {
        console.error('Get course failed:', error);
        throw error;
    }
}

/**
 * Example: Get user's enrolled courses
 */
export async function getMyCourses() {
    try {
        const courses = await courseService.getUserCourses();
        console.log('My courses:', courses);
        return courses;
    } catch (error) {
        console.error('Get my courses failed:', error);
        throw error;
    }
}

// ============================================================================
// LESSON EXAMPLES
// ============================================================================

/**
 * Example: Get lesson by ID
 */
export async function getLesson(lessonId: string) {
    try {
        const lesson = await lessonService.getLessonById(lessonId);
        console.log('Lesson details:', lesson);
        return lesson;
    } catch (error) {
        console.error('Get lesson failed:', error);
        throw error;
    }
}

/**
 * Example: Mark lesson as completed
 */
export async function completeLesson(lessonId: string) {
    try {
        const result = await lessonService.endLesson(lessonId);
        console.log('Lesson completed:', result);
        return result;
    } catch (error) {
        console.error('Complete lesson failed:', error);
        throw error;
    }
}

// ============================================================================
// NOTIFICATION EXAMPLES
// ============================================================================

/**
 * Example: Get user notifications
 */
export async function getNotifications() {
    try {
        const notifications = await notificationService.getNotifications();
        console.log('Notifications:', notifications);
        return notifications;
    } catch (error) {
        console.error('Get notifications failed:', error);
        throw error;
    }
}

/**
 * Example: Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
    try {
        const result = await notificationService.markAsRead(notificationId);
        console.log('Notification marked as read:', result);
        return result;
    } catch (error) {
        console.error('Mark notification as read failed:', error);
        throw error;
    }
}

// ============================================================================
// COMPLETE WORKFLOW EXAMPLE
// ============================================================================

/**
 * Example: Complete user workflow
 * 1. Login
 * 2. Get profile
 * 3. Get courses
 * 4. Get lesson and mark as complete
 * 5. Get notifications
 */
export async function completeUserWorkflow(phoneNumber: string, password: string) {
    try {
        // 1. Login
        console.log('Step 1: Logging in...');
        await loginUser(phoneNumber, password);

        // 2. Get user profile
        console.log('Step 2: Getting user profile...');
        const profile = await getUserProfile();

        // 3. Get courses
        console.log('Step 3: Getting courses...');
        const courses = await getAllCourses();

        // 4. Get first lesson and mark as complete (if courses exist)
        if (courses.courses && courses.courses.length > 0) {
            const firstCourse = courses.courses[0];
            console.log('Step 4: Getting lesson from first course...');
            
            // This assumes the course has lessons, adjust as needed
            // const lesson = await getLesson(firstCourse.lessons[0].id);
            // await completeLesson(lesson.id);
        }

        // 5. Get notifications
        console.log('Step 5: Getting notifications...');
        const notifications = await getNotifications();

        console.log('Workflow completed successfully!');
        return { profile, courses, notifications };

    } catch (error) {
        console.error('Workflow failed:', error);
        throw error;
    }
}
