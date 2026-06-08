import { apiClient } from '@/lib/api-client';
import { SourceUpdateBody } from '@/types/mobile-api';

export const sourceService = {
    /**
     * Update source (video, document, test)
     */
    updateSource: async (id: string, data: SourceUpdateBody): Promise<any> => {
        const formData = new FormData();

        if (data.name) formData.append('name', data.name);
        if (data.url) formData.append('url', data.url);
        if (data.video_url) formData.append('video_url', data.video_url);
        if (data.order_num !== undefined) formData.append('order_num', data.order_num.toString());
        if (data.file) formData.append('file', data.file);

        // Using /web/ namespace for management as seen in Swagger
        return apiClient<any>(`/source/${id}/update`, {
            method: 'PUT',
            body: formData,
            namespace: 'web',
        });
    },
};
