// Lesson Service
// Handles lesson-related operations

import { apiClient } from '@/lib/api-client';
import { SourceLessonMobileRes } from '@/types/mobile-api';

export const lessonService = {
    /**
     * Get lesson by ID
     */
    getLessonById: async (id: string): Promise<SourceLessonMobileRes> => {
        return apiClient<SourceLessonMobileRes>(`/lesson/${id}`);
    },

    /**
     * Mark lesson as completed
     */
    endLesson: async (id: string): Promise<string> => {
        return apiClient<string>(`/lesson/${id}/end`, {
            method: 'PUT',
        });
    },
};
