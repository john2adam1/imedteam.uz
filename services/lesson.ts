// Lesson Service
// Handles lesson-related operations

import { apiClient } from '@/lib/api-client';
import { getMediaUrl } from '@/lib/utils';
import { SourceLessonMobileRes } from '@/types/mobile-api';

export const lessonService = {
    /**
     * Get lesson by ID
     */
    async getLessonById(lessonId: string): Promise<SourceLessonMobileRes> {
        const response = await apiClient<SourceLessonMobileRes>(`/lesson/${lessonId}`);

        // Transform media URLs
        if (response.documents) {
            response.documents = response.documents.map(doc => ({
                ...doc,
                url: getMediaUrl(doc.url)
            }));
        }

        if (response.tests) {
            response.tests = response.tests.map(test => ({
                ...test,
                url: getMediaUrl(test.url)
            }));
        }

        return response;
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
